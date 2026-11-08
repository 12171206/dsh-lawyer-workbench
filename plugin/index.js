/**
 * Host half of the lawyer-workbench bundle.
 *
 * Scans the configured case root (one folder per case, the
 * lawyer-case-workbench convention), parses the six markdown records it
 * prescribes, and serves the result to the browser half. "开跑" creates an
 * Agent Session whose workspace is the case root, so the model can read and
 * write the case files while this session's workspace stays untouched.
 *
 * Read-only over the case files, except POST /check (explicit checklist tick).
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { join, resolve, sep, extname, basename } from 'node:path'

const API_PREFIX = '/lawyer-workbench/api'
const execFileAsync = promisify(execFile)
const OCR_SCRIPT = fileURLToPath(new URL('./ocr.ps1', import.meta.url))
const DOCX_SCRIPT = fileURLToPath(new URL('./md_to_docx.py', import.meta.url))
const MAX_BODY = 32 * 1024
const STAGE_ORDER = ['咨询', '接案', '取证', '策略', '立案', '庭前', '庭审', '判决', '执行', '结案']

function readText(path) {
  try {
    return readFileSync(path, 'utf8').replace(/^\uFEFF/, '')
  } catch {
    return ''
  }
}

function readJsonFile(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function walkFiles(dir, limit) {
  const out = []
  const visit = (current, depth) => {
    if (out.length >= limit || depth > 2) return
    let entries
    try {
      entries = readdirSync(current, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (out.length >= limit) return
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || entry.name === '__pycache__') continue
        visit(full, depth + 1)
      } else if (entry.isFile()) {
        let mtime = 0
        try {
          mtime = statSync(full).mtimeMs
        } catch {
          mtime = 0
        }
        out.push({ full, name: entry.name, mtime })
      }
    }
  }
  visit(dir, 0)
  out.sort((a, b) => b.mtime - a.mtime)
  return out
}

// ---------------------------------------------------------------- parsers

function parseInfo(text) {
  const flat = {}
  for (const line of text.split(/\r?\n/)) {
    const m = /^-\s*([^：:]{1,24})[：:]\s*(.*)$/.exec(line.trim())
    if (!m) continue
    const key = m[1].trim()
    if (!(key in flat)) flat[key] = m[2].trim()
  }
  let client = ''
  let opponent = ''
  for (const chunk of text.split(/^###\s*/m)) {
    const head = (chunk.split(/\r?\n/)[0] || '').trim()
    const nm = /- 姓名[：:]\s*(.*)/.exec(chunk)
    if (!nm) continue
    if (/原告|申请人|委托人/.test(head)) client = nm[1].trim()
    else if (/被告|被申请人|对方/.test(head)) opponent = nm[1].trim()
  }
  return {
    id: flat['案件编号'] || '',
    name: flat['案件名称'] || '',
    lawyer: flat['承办律师'] || '',
    builtAt: flat['建档日期'] || '',
    feeMode: flat['收费方式'] || '',
    fee: flat['收费金额'] || '',
    client,
    opponent,
    cause: flat['案由'] || '',
    amount: flat['争议金额'] || '',
    court: flat['管辖法院'] || '',
    stageLabel: flat['当前阶段'] || '',
    nextAction: flat['下一个动作'] || '',
    due: flat['截止时间'] || ''
  }
}

function parseChecklist(text) {
  const stages = []
  let current = null
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    const head = /^##\s+(.+)$/.exec(line)
    if (head) {
      current = { name: head[1].trim(), items: [] }
      stages.push(current)
      continue
    }
    const item = /^-\s*\[([ xX])\]\s*(.+)$/.exec(line)
    if (item && current) current.items.push({ text: item[2].trim(), done: item[1] !== ' ' })
  }
  const total = stages.reduce((n, s) => n + s.items.length, 0)
  const checked = stages.reduce((n, s) => n + s.items.filter((i) => i.done).length, 0)
  const firstUnchecked = stages.findIndex((s) => s.items.length > 0 && s.items.some((i) => !i.done))
  let lastProgress = -1
  stages.forEach((s, i) => {
    if (s.items.some((item) => item.done)) lastProgress = i
  })
  let stageIndex = Math.max(firstUnchecked < 0 ? stages.length - 1 : firstUnchecked, lastProgress)
  if (stageIndex < 0) stageIndex = 0
  return {
    stages: stages.map((s, index) => ({
      index,
      name: s.name,
      short: STAGE_ORDER.find((x) => s.name.startsWith(x)) || s.name.replace(/阶段.*$/, ''),
      total: s.items.length,
      checked: s.items.filter((i) => i.done).length,
      items: s.items
    })),
    total,
    checked,
    stageIndex
  }
}

function parseDeadlines(text) {
  const rows = []
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line.startsWith('|')) continue
    const cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
    if (cells.length < 9) continue
    if (!/^\d+$/.test(cells[0])) continue
    const due = cells[4]
    rows.push({
      no: Number(cells[0]),
      name: cells[1],
      from: cells[2],
      period: cells[3],
      due,
      basis: cells[6],
      owner: cells[7],
      status: cells[8],
      daysLeft: daysUntil(due)
    })
  }
  return rows
}

function daysUntil(dateText) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateText || '').trim())
  if (!m) return null
  const due = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((due.getTime() - today.getTime()) / 86400000)
}

function parseDelivery(text) {
  const items = []
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line.startsWith('|')) continue
    const cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
    if (cells.length < 3) continue
    if (!/^\d+$/.test(cells[0])) continue
    const statusRaw = cells[cells.length - 1]
    let state = 'missing'
    if (/✅/.test(statusRaw)) state = 'done'
    else if (/⏳/.test(statusRaw)) state = 'doing'
    else if (/—|不适用/.test(statusRaw)) state = 'na'
    items.push({ no: Number(cells[0]), name: cells[1], state, statusRaw })
  }
  const done = items.filter((i) => i.state === 'done').length
  const doing = items.filter((i) => i.state === 'doing').length
  const na = items.filter((i) => i.state === 'na').length
  const missing = items.filter((i) => i.state === 'missing').length
  const redlineNos = [1, 6, 7, 8, 11, 13]
  const redlines = items
    .filter((i) => redlineNos.includes(i.no))
    .map((i) => ({ no: i.no, name: i.name, ok: i.state === 'done' || i.state === 'na' }))
  return { total: items.length, done, doing, na, missing, redlines, items }
}

function parseLedger(text) {
  let tf = 0
  let ev = 0
  let issue = 0
  let broken = 0
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (/^\|\s*TF-/.test(line)) {
      tf += 1
      if (/断点/.test(line)) broken += 1
    } else if (/^\|\s*E-/.test(line)) ev += 1
    else if (/^\|\s*IS-/.test(line)) issue += 1
  }
  return { tf, ev, issue, broken }
}

function parseTimeline(text) {
  const dates = String(text).match(/\d{4}-\d{2}-\d{2}/g) || []
  const last = dates.length ? dates[dates.length - 1] : ''
  const rows = String(text)
    .split(/\r?\n/)
    .filter((l) => l.trim().startsWith('|') && /\d{4}-\d{2}-\d{2}/.test(l))
    .length
  return { lastDate: last, entries: rows }
}

// ---------------------------------------------------------------- stage -> actions

const STAGE_ACTIONS = [
  [
    { id: 'lr', title: '出法律研究报告（LR-01）', skill: 'lawyer-legal-research', target: '03-法律研究/法律研究报告-LR-<日期>-<序号>.md', why: '判断能不能告、值不值、走哪条路径' },
    { id: 'conflict', title: '利益冲突审查', skill: 'lawyer-case-workbench', target: '00-案件档案/利益冲突审查表.md', why: '接案红线：有冲突不得接案' },
    { id: 'consult-record', title: '咨询谈话笔录', skill: 'lawyer-legal-research', target: '03-法律研究/咨询记录.md', why: '固定客户口述事实与诉求' }
  ],
  [
    { id: 'retainer', title: '委托合同套件（合同/授权/风险告知）', skill: 'retainer-contract-management', target: '00-案件档案/委托材料/', why: '代理权与收费的唯一依据' },
    { id: 'fee', title: '报价单与收费告知', skill: 'retainer-contract-management', target: '00-案件档案/收费凭证/', why: '收费事先明示，避免争议' },
    { id: 'ledger-init', title: '初始化台账与期限台账', skill: 'lawyer-case-workbench', target: '00-案件档案/', why: '编号与期限的唯一真源' }
  ],
  [
    { id: 'evidence', title: '证据目录与三性审查（EV-01）', skill: 'lawyer-evidence-handling', target: '02-证据整理/证据目录.md', why: '待证事实拆解、分组编号、逐份三性' },
    { id: 'supplement', title: '补证清单', skill: 'lawyer-evidence-handling', target: '02-证据整理/补证清单.md', why: '断点 → 找谁取、怎么取、多久' },
    { id: 'investigate', title: '调查取证 / 财产保全', skill: 'evidence-investigation-management', target: '02-证据整理/申请书/', why: '调查令、证人出庭、诉前保全' }
  ],
  [
    { id: 'strategy', title: '诉讼策略报告（LA-01）', skill: 'lawyer-litigation-analysis', target: '05-诉讼策略/策略分析报告-LA-<日期>-<序号>.md', why: '争点、胜负区间、调解底线' },
    { id: 'hearing-outline', title: '庭审提纲', skill: 'pre-trial-preparation', target: '05-诉讼策略/庭审提纲.md', why: '争点导向的举证与发问顺序' },
    { id: 'contract-review', title: '涉案合同审查（CR-01）', skill: 'lawyer-contract-review', target: '04-合同审查/审查报告-CR-<日期>-<序号>.md', why: '涉案合同的条款风险' }
  ],
  [
    { id: 'complaint', title: '起诉状（LD-01）', skill: 'lawyer-doc-drafting', target: '06-文书产出/起诉状-<日期>-v1.docx', why: '诉请、事实、证据编号必须对齐台账' },
    { id: 'filing', title: '立案材料与诉讼费', skill: 'case-filing-management', target: '06-文书产出/立案材料/', why: '管辖预检、材料清单、费用计算' },
    { id: 'jurisdiction', title: '管辖权预检', skill: 'case-filing-management', target: '06-文书产出/管辖权预检报告.md', why: '避免立案被退回' },
    { id: 'answer', title: '答辩状 / 代理词', skill: 'lawyer-doc-drafting', target: '06-文书产出/答辩状-<日期>-v1.docx', why: '被告方答辩或开庭代理意见，证据编号须对齐台账' }
  ],
  [
    { id: 'cross-exam', title: '质证意见', skill: 'lawyer-evidence-handling', target: '05-庭审材料/质证意见.md', why: '对方证据的三性逐条意见' },
    { id: 'trial-outline', title: '庭审提纲与举证顺序', skill: 'pre-trial-preparation', target: '05-庭审材料/庭审提纲.md', why: '争点、举证、发问、质证预案' },
    { id: 'visual', title: '诉讼可视化图表', skill: 'litigation-visualization', target: '07-交付文件/诉讼可视化/', why: '时间轴/关系图/证据链' },
    { id: 'agent-opinion', title: '代理词', skill: 'litigation-doc-drafting', target: '06-文书产出/代理词-<日期>-v1.docx', why: '庭前书面代理意见' }
  ],
  [
    { id: 'minutes', title: '庭审纪要', skill: 'trial-and-post-trial', target: '07-程序记录/庭审纪要.md', why: '庭上事实与法官倾向的即时记录' },
    { id: 'post-agent', title: '庭后代理词', skill: 'trial-and-post-trial', target: '06-文书产出/代理词-<日期>-v1.docx', why: '庭后补强书面意见' },
    { id: 'mediation', title: '调解方案与底线', skill: 'mediation-and-settlement', target: '07-程序记录/调解方案.md', why: '理想值与底线两档' }
  ],
  [
    { id: 'judgment', title: '判决分析与上诉评估', skill: 'litigation-analysis-tools', target: '05-诉讼策略/判决分析.md', why: '拆判决、算上诉空间' },
    { id: 'appeal', title: '上诉状', skill: 'litigation-doc-drafting', target: '06-文书产出/上诉状-<日期>-v1.docx', why: '上诉期内必须决定' },
    { id: 'client-report', title: '结果与客户沟通', skill: 'lawyer-case-workbench', target: '07-程序记录/客户沟通记录.md', why: '如实告知结果与选项' }
  ],
  [
    { id: 'enforce', title: '执行申请', skill: 'lawyer-case-workbench', target: '06-文书产出/执行申请书.md', why: '生效后 2 年内申请执行' },
    { id: 'assets', title: '财产线索调查', skill: 'lawyer-evidence-handling', target: '02-证据整理/财产线索.md', why: '无财产线索执行难落地' },
    { id: 'deadline-exec', title: '执行期限与续封', skill: 'lawyer-case-progress', target: '00-案件档案/期限与时效台账.md', why: '保全到期须续封' }
  ],
  [
    { id: 'closing', title: '结案报告', skill: 'case-closing-and-archiving', target: '08-结案归档/结案报告.md', why: '结果、回款、遗留问题' },
    { id: 'review', title: '复盘记录', skill: 'lawyer-case-workbench', target: '08-结案归档/复盘记录.md', why: '这个案子踩了什么坑' },
    { id: 'archive', title: '案卷装订目录', skill: 'case-closing-and-archiving', target: '08-结案归档/案卷装订目录.md', why: '归档合规、日后调卷' }
  ]
]

// ---------------------------------------------------------------- case model

function buildCase(caseDir, caseRoot) {
  const relCase = caseDir.slice(caseRoot.length + 1).replace(/\\/g, '/')
  const demo = relCase.startsWith('_演示/')
  const name = basename(caseDir)
  const metaPath = join(caseDir, '00-案件档案')
  const info = parseInfo(readText(join(metaPath, '案件基本信息.md')))
  const checklist = parseChecklist(readText(join(metaPath, '案件生命周期Checklist.md')))
  const deadlines = parseDeadlines(readText(join(metaPath, '期限与时效台账.md')))
  const delivery = parseDelivery(readText(join(metaPath, '律师交付包清单.md')))
  const ledger = parseLedger(readText(join(metaPath, '案件台账.md')))
  const timeline = parseTimeline(readText(join(caseDir, '07-程序记录', '案件时间线.md')))

  const reviewRaw = readText(join(metaPath, '出稿前审查报告.md'))
  const reviewStatus = (reviewRaw.match(/review_status[：:]\s*([A-Z_]+)/i) || [])[1] || ''
  const reviewPass = /PASS/.test(reviewStatus)
  const outputs = []
  for (const dir of ['02-证据整理', '03-法律研究', '04-合同审查', '05-诉讼策略', '05-庭审材料', '06-文书产出', '07-交付文件']) {
    const full = join(caseDir, dir)
    if (!existsSync(full)) continue
    for (const file of walkFiles(full, 40)) {
      const ext = extname(file.name).toLowerCase()
      if (ext === '.html' || ext === '.htm') continue
      if (ext === '.md') {
        if (file.name === '证据原件交接单.md') continue
      }
      let status = 'draft'
      if (dir === '07-交付文件') status = 'delivered'
      else if (ext === '.docx' || ext === '.pdf') status = reviewPass ? 'exported' : 'exported_unreviewed'
      else if (reviewPass && /审查报告/.test(file.name)) status = 'reviewed'
      outputs.push({
        name: file.name,
        section: dir,
        ext,
        mtime: file.mtime,
        rel: relCase + '/' + dir + '/' + file.name,
        status
      })
    }
  }
  outputs.sort((a, b) => b.mtime - a.mtime)

  const applicable = deadlines.filter((d) => !/^[—\-]|不适用/.test(String(d.status || '').trim()))
  const filledDeadlines = applicable.filter((d) => d.due && d.due !== '—' && d.daysLeft !== null)
  const deadlineAudit = {
    filled: filledDeadlines.length,
    expected: applicable.length,
    low: applicable.length > 0 && filledDeadlines.length < Math.min(3, applicable.length),
    missing: applicable.filter((d) => !d.due || d.due === '—').map((d) => d.name)
  }
  const days = deadlines.map((d) => d.daysLeft).filter((v) => v !== null)
  const dueSoon = days.length ? Math.min(...days) : null
  const redCount = deadlines.filter((d) => d.daysLeft !== null && d.daysLeft <= 3).length

  const stageShort = (String(info.stageLabel || '').match(/^(咨询|接案|取证|策略|立案|庭前|庭审|判决|执行|结案)/) || [])[0] || String(info.stageLabel || '')
  const stage = checklist.stages[checklist.stageIndex] || null
  const actions = STAGE_ACTIONS[checklist.stageIndex] || STAGE_ACTIONS[0]
  const closed = checklist.stageIndex >= checklist.stages.length - 1 || /已结案/.test(info.stageLabel)
  let visitDate = ''
  for (const rel of ['08-结案归档/回访记录.md', '07-程序记录/客户回访记录.md']) {
    const file = join(caseDir, rel)
    if (!existsSync(file)) continue
    const match = readText(file).match(/\d{4}-\d{2}-\d{2}/)
    visitDate = match ? match[0] : ''
    break
  }
  const daysSinceClose = closed && timeline.lastDate ? -daysUntil(timeline.lastDate) : null

  return {
    id: name,
    path: caseDir,
    name: info.name || name.replace(/^案件-[^-]+-/, ''),
    caseNo: info.id || (name.match(/^案件-([^-]+)-/) || [])[1] || '',
    client: info.client,
    opponent: info.opponent,
    cause: info.cause,
    amount: info.amount,
    court: info.court,
    lawyer: info.lawyer,
    fee: info.fee,
    feeMode: info.feeMode,
    stageLabel: info.stageLabel,
    stageShort,
    nextActionLabel: info.nextAction,
    dueLabel: info.due,
    stageIndex: checklist.stageIndex,
    stages: checklist.stages,
    progress: { checked: checklist.checked, total: checklist.total },
    deadlines,
    delivery,
    ledger,
    timeline,
    outputs,
    actions,
    closed,
    visitDate,
    daysSinceClose,
    postSale: closed && daysSinceClose !== null
      ? (() => {
          const marks = [30, 90, 365]
          const next = marks.find((mark) => daysSinceClose < mark)
          const overdue = visitDate === '' && daysSinceClose >= 30
          let due = ''
          if (timeline.lastDate) {
            const base = new Date(timeline.lastDate + 'T00:00:00')
            const mark = next || 365
            base.setDate(base.getDate() + mark)
            due = base.toISOString().slice(0, 10)
          }
          return { day: daysSinceClose, nextMark: next || 0, due, overdue }
        })()
      : null,
    demo,
    deadlineAudit,
    deliveryAudit: { unverifiedExports: outputs.filter((o) => o.status === 'exported_unreviewed').length },
    dueSoon,
    redCount,
    risk:
      redCount > 0 || (dueSoon !== null && dueSoon <= 3)
        ? 'red'
        : dueSoon !== null && dueSoon <= 7
          ? 'amber'
          : 'ok'
  }
}

function scanCases(caseRoot) {
  let entries = []
  try {
    entries = readdirSync(caseRoot, { withFileTypes: true })
  } catch {
    return { cases: [], error: 'CASE_ROOT_UNREADABLE' }
  }
  const dirs = entries
    .filter((e) => e.isDirectory() && /^案件-/.test(e.name))
    .map((e) => join(caseRoot, e.name))
  const demoRoot = join(caseRoot, '_演示')
  try {
    for (const entry of readdirSync(demoRoot, { withFileTypes: true })) {
      if (entry.isDirectory() && /^案件-/.test(entry.name)) dirs.push(join(demoRoot, entry.name))
    }
  } catch {
    /* no demo root */
  }
  const cases = []
  for (const dir of dirs) {
    try {
      cases.push(buildCase(dir, caseRoot))
    } catch {
      /* one broken case must not blank the whole board */
    }
  }
  const rank = { red: 0, amber: 1, ok: 2 }
  cases.sort((a, b) => {
    const r = rank[a.risk] - rank[b.risk]
    if (r !== 0) return r
    const ad = a.dueSoon === null ? 9999 : a.dueSoon
    const bd = b.dueSoon === null ? 9999 : b.dueSoon
    return ad - bd
  })
  return { cases }
}

const CLIENT_STAGES = ['lead', 'consulted', 'proposal', 'quoted', 'won', 'lost', 'served']

function parseLead(text) {
  const flat = {}
  for (const line of text.split(/\r?\n/)) {
    const m = /^-\s*([^：:]{1,16})[：:]\s*(.*)$/.exec(line.trim())
    if (!m) continue
    const key = m[1].trim()
    if (!(key in flat)) flat[key] = m[2].trim()
  }
  return {
    stage: flat['阶段'] || '',
    grade: flat['分级'] || '',
    temp: flat['温度'] || '',
    source: flat['来源'] || '',
    budget: flat['预算信号'] || '',
    next: flat['下一步'] || '',
    due: flat['截止'] || '',
    reason: flat['原因码'] || '',
    owner: flat['负责人'] || '',
    updated: flat['更新时间'] || ''
  }
}

const CLIENT_NEXT = {
  lead: { title: '3 分钟首轮响应（一问 + 一给 + 一约）', skill: 'lawyer-lead-ops', target: '首轮响应.md', why: '客户还在和别人比，先回先问' },
  consulted: { title: '出三档方案 + 约上门', skill: 'lawyer-consult-diagnose', target: '方案.md', why: '有诉求没方案，客户会一直拖' },
  proposal: { title: '报价（三档结构）并约决策人', skill: 'lawyer-deal-close', target: '报价.md', why: '方案认可后不报价，热度会掉' },
  quoted: { title: '异议处理（五分类）', skill: 'lawyer-deal-close', target: '异议应对.md', why: '报价后卡住，多数是钱/信任/不急/比价/家人' },
  won: { title: '转成案件并办委托手续', skill: 'lawyer-case-workbench', target: '案件-新案/', why: '口头答应不等于委托，24 小时内上月' },
  lost: { title: '原因复盘 + 看能否二次激活', skill: 'lawyer-followup-grow', target: '失单复盘.md', why: '不记原因，下个月用同样方式再丢一次' },
  served: { title: '30/90 天回访与转介绍', skill: 'lawyer-followup-grow', target: '回访记录.md', why: '结案后 30 天是转介绍窗口' }
}

function clientFiles(caseRoot, name, baseRel) {
  const root = baseRel || '客户'
  return walkFiles(join(caseRoot, root, name), 40).map((file) => {
    const kind = /\.html?$/i.test(file.name)
      ? 'export'
      : /聊天诊断|诊断报告/.test(file.name)
        ? 'diagnosis'
      : /聊天原文|聊天记录|聊天截图/.test(file.name)
        ? 'chat'
        : /决策材料/.test(file.name)
          ? 'decision'
          : /报价单/.test(file.name)
            ? 'quote'
            : /方案/.test(file.name)
              ? 'proposal'
              : /回访/.test(file.name)
                ? 'visit'
                : /线索/.test(file.name)
                  ? 'lead'
                  : /跟进记录/.test(file.name)
                    ? 'follow'
                    : 'other'
    return { name: file.name, rel: root + '/' + name + '/' + file.name, kind, mtime: file.mtime }
  })
}

function extractHooks(text) {
  const idx = String(text || '').search(/钩子/)
  if (idx < 0) return []
  const slice = String(text).slice(idx, idx + 700)
  const hooks = []
  for (const raw of slice.split(/\r?\n/)) {
    const line = raw.trim()
    const m = /^\d+[.、)]\s*(.+)$/.exec(line)
    if (!m) continue
    let value = m[1].split('→')[0].split('——')[0].trim()
    value = value.replace(/^["“「']|["”」']$/g, '').trim()
    if (value.length < 4) continue
    if (value.length > 70) value = value.slice(0, 70) + '…'
    if (hooks.indexOf(value) < 0) hooks.push(value)
  }
  return hooks.slice(0, 4)
}

function buildClient(caseRoot, name, baseRel) {
  const root = baseRel || '客户'
  const dir = join(caseRoot, root, name)
  const files = clientFiles(caseRoot, name, root)
  const lead = parseLead(readText(join(dir, '线索.md')))
  const has = (kind) => files.some((file) => file.kind === kind)
  let stage = lead.stage
  if (CLIENT_STAGES.indexOf(stage) < 0) {
    stage = has('proposal') ? 'proposal' : has('diagnosis') ? 'consulted' : 'lead'
  }
  const base = CLIENT_NEXT[stage] || CLIENT_NEXT.lead
  const diagnosis = files.find((file) => file.kind === 'diagnosis' && /\.md$/i.test(file.name))
  const hooks = diagnosis ? extractHooks(readText(join(dir, diagnosis.name))) : []
  return {
    name,
    dir,
    files,
    latest: files[0] || null,
    stage,
    stageIndex: CLIENT_STAGES.indexOf(stage),
    grade: lead.grade || (has('diagnosis') ? 'B' : 'C'),
    temp: lead.temp,
    source: lead.source,
    budget: lead.budget,
    next: lead.next,
    due: lead.due,
    reason: lead.reason,
    owner: lead.owner,
    updated: lead.updated,
    has: {
      chat: has('chat'),
      images: files.some((file) => /\.(png|jpe?g|webp)$/i.test(file.name)),
      diagnosis: has('diagnosis'),
      proposal: has('proposal'),
      quote: has('quote'),
      decision: has('decision'),
      visit: has('visit')
    },
    demo: root !== '客户',
    rel: root + '/' + name,
    baseRel: root,
    hooks,
    action: { title: base.title, skill: base.skill, why: base.why, target: root + '/' + name + '/' + base.target }
  }
}

function scanClients(caseRoot) {
  const rank = { lead: 0, consulted: 1, proposal: 2, quoted: 3, won: 4, served: 5, lost: 6 }
  const rows = []
  for (const root of ['客户', '_演示/客户']) {
    let entries = []
    try {
      entries = readdirSync(join(caseRoot, root), { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue
      rows.push(buildClient(caseRoot, entry.name, root))
    }
  }
  return rows
    .sort((a, b) => {
      const r = (rank[a.stage] || 0) - (rank[b.stage] || 0)
      if (r !== 0) return r
      return ((b.latest && b.latest.mtime) || 0) - ((a.latest && a.latest.mtime) || 0)
    })
}

function skillFileFor(catalogPath, skillId) {
  const doc = readJsonFile(catalogPath)
  if (!doc || !Array.isArray(doc.items)) return ''
  const item = doc.items.find((entry) => entry.id === skillId)
  if (!item || typeof item.path !== 'string') return ''
  const file = join(resolve(catalogPath, '..'), item.path, 'SKILL.md')
  return existsSync(file) ? file : ''
}

function writeUtf8(file, text) {
  writeFileSync(file, text, 'utf8')
}

function leadDoc(client) {
  return [
    '# 线索档案',
    '',
    '- 阶段：' + client.stage,
    '- 分级：' + (client.grade || ''),
    '- 温度：' + (client.temp || ''),
    '- 来源：' + (client.source || ''),
    '- 预算信号：' + (client.budget || ''),
    '- 下一步：' + (client.next || ''),
    '- 截止：' + (client.due || ''),
    '- 原因码：' + (client.reason || ''),
    '- 负责人：' + (client.owner || ''),
    '- 更新时间：' + new Date().toISOString().slice(0, 10),
    ''
  ].join('\n')
}

function convertClientToCase(caseRoot, templateDir, payload) {
  const name = String(payload.name || '')
  const caseId = String(payload.caseId || '').trim()
  const caseName = String(payload.caseName || '').trim()
  const lawyer = String(payload.lawyer || '').trim()
  if (!name || !/^\d{4}-\d{2,3}$/.test(caseId) || !caseName || /[\\/:*?"<>|]/.test(caseName)) {
    return { error: 'BAD_INPUT' }
  }
  const located = findClientDir(caseRoot, name)
  if (!located) return { error: 'CLIENT_NOT_FOUND' }
  const clientDir = located.dir
  const folder = '案件-' + caseId + '-' + caseName
  const caseDir = join(caseRoot, folder)
  if (existsSync(caseDir)) return { error: 'CASE_EXISTS' }

  const dirs = ['00-案件档案', '01-材料收集/当事人提供', '01-材料收集/律师调取', '02-证据整理', '03-法律研究/类案判例', '04-合同审查', '05-诉讼策略', '06-文书产出', '07-程序记录', '08-结案归档']
  mkdirSync(caseDir, { recursive: true })
  for (const sub of dirs) mkdirSync(join(caseDir, sub), { recursive: true })

  const copies = [
    ['模板-案件基本信息.md', '00-案件档案/案件基本信息.md'],
    ['模板-案件生命周期Checklist.md', '00-案件档案/案件生命周期Checklist.md'],
    ['模板-案件台账.md', '00-案件档案/案件台账.md'],
    ['模板-律师交付包清单.md', '00-案件档案/律师交付包清单.md'],
    ['模板-期限与时效台账.md', '00-案件档案/期限与时效台账.md'],
    ['模板-利益冲突审查表.md', '00-案件档案/利益冲突审查表.md'],
    ['模板-证据原件交接单.md', '02-证据整理/证据原件交接单.md'],
    ['模板-材料收集清单.md', '01-材料收集/材料收集清单.md'],
    ['模板-证据目录.md', '02-证据整理/证据目录.md']
  ]
  const today = new Date().toISOString().slice(0, 10)
  for (const pair of copies) {
    const from = join(templateDir, pair[0])
    if (!existsSync(from)) continue
    let text = readText(from)
    if (pair[1].indexOf('案件基本信息') >= 0) {
      text = text.replace('- 案件编号：2026-XXX', '- 案件编号：' + caseId)
        .replace('- 案件名称：原告 诉 被告 案由', '- 案件名称：' + caseName)
        .replace(/- 承办律师：/, '- 承办律师：' + lawyer)
        .replace(/^- 建档日期：\s*$/m, '- 建档日期：' + today)
    }
    if (pair[1].indexOf('案件台账') >= 0) {
      text = text.replace('| 案件编号 | 2026-XXX |', '| 案件编号 | ' + caseId + ' |')
        .replace('| 案件名称 | 原告 诉 被告 案由 |', '| 案件名称 | ' + caseName + ' |')
        .replace('| 承办律师 | |', '| 承办律师 | ' + lawyer + ' |')
        .replace('| 当前阶段 | 咨询中 / 已接案', '| 当前阶段 | 咨询中')
        .replace('| | | 建台账 | 建台 |', '| ' + today + ' | ' + lawyer + ' | 建台账（' + caseId + '） | 建台 |')
    }
    writeUtf8(join(caseDir, pair[1]), text)
  }
  writeUtf8(
    join(caseDir, '07-程序记录', '案件时间线.md'),
    ['# 案件时间线', '', '> 只追加，不删行。', '', '| 日期 | 动作 | 责任人 | 产出文件 |', '|---|---|---|---|', '| ' + today + ' | 由客户「' + name + '」转成案件（' + caseId + '） | ' + lawyer + ' | 00-案件档案/案件基本信息.md |', ''].join('\n')
  )

  updateLeadFields(clientDir, { 阶段: 'won', 下一步: '已转案件：' + folder, 更新时间: today })
  const followFile = join(clientDir, '跟进记录.md')
  const row = '| ' + today + ' | 转成案件 ' + folder + ' | 工作台 |\n'
  if (existsSync(followFile)) writeUtf8(followFile, readText(followFile).replace(/\s*$/, '') + '\n' + row)
  else {
    writeUtf8(followFile, '# 跟进记录\n\n| 日期 | 动作 | 责任人 |\n|---|---|---|\n' + row)
  }
  appendAudit(caseRoot, '客户转案件', name + ' → ' + folder)
  return { caseDir: folder, caseId, caseName }
}

function findClientDir(caseRoot, name) {
  for (const root of ['客户', '_演示/客户']) {
    const dir = join(caseRoot, root, name)
    if (existsSync(dir)) return { dir, root }
  }
  return null
}

function desensitizeText(text) {
  const counts = {}
  let out = String(text)
  out = out.replace(/(?<!\d)1[3-9]\d{9}(?!\d)/g, () => {
    counts.phone = (counts.phone || 0) + 1
    return '【手机号】'
  })
  out = out.replace(/(?<!\d)\d{17}[\dXx](?!\d)/g, () => {
    counts.idCard = (counts.idCard || 0) + 1
    return '【身份证号】'
  })
  out = out.replace(/(?<!\d)\d{16,19}(?!\d)/g, () => {
    counts.bankCard = (counts.bankCard || 0) + 1
    return '【银行卡】'
  })
  out = out.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, () => {
    counts.email = (counts.email || 0) + 1
    return '【邮箱】'
  })
  out = out.replace(/wxid_[A-Za-z0-9_-]+/g, () => {
    counts.wechat = (counts.wechat || 0) + 1
    return '【微信号】'
  })
  return { text: out, counts }
}

function buildQuote(client, payload) {
  const basic = String(payload.basic || '【基础价】')
  const recommended = String(payload.recommended || '【推荐价】')
  const full = String(payload.full || '【全程价】')
  const excludes = String(payload.excludes || '不含二审、不含执行、不含另案')
  return [
    '# 服务方案与报价 · ' + client.name,
    '',
    '> 报价有效期 7 天 ｜ ' + new Date().toISOString().slice(0, 10),
    '',
    '## 一、我们对这个案子的理解',
    '',
    (client.next ? '- 当前判断：' + client.next : '- 当前判断：' + (client.action ? client.action.title : '待补充')),
    client.budget ? '- 你提到的预算区间：' + client.budget : '',
    '',
    '## 二、三档服务与价格',
    '',
    '| 档位 | 价格 | 包含什么 | 不包含什么 | 谁配合 |',
    '|---|---|---|---|---|',
    '| 基础版 | ' + basic + ' | 代写文书、证据清单、开庭要点指导 | 不代出庭、不代办立案 | 你自己跑程序 |',
    '| 推荐版 | ' + recommended + ' | 基础版全部 + 立案 + 出庭 + 调解谈判 | ' + excludes + ' | 你配合材料与到场 |',
    '| 全程版 | ' + full + ' | 推荐版全部 + 执行 + 一年内后续咨询 | 不含另案 | 全案配合 |',
    '',
    '## 三、付款与保障',
    '',
    '- 付款：签约 50%，立案或开庭前 30%，结案 20%（可按阶段验收）',
    '- 每阶段结束提供书面进度，不满意可终止后续委托',
    '- 咨询费在委托时抵扣（如已收取）',
    '',
    '## 四、风险告知',
    '',
    '- 本报价不构成对结果的承诺；结果取决于证据、裁判与执行情况',
    '- 律师费与诉讼费、保全费、鉴定费分开计算',
    '',
    '## 五、下一步',
    '',
    '1. 你先选一个档位；',
    '2. 我们约 20 分钟确认服务范围与不含项；',
    '3. 签委托合同并启动。',
    ''
  ].join('\n') + '\n'
}

function tidyOcr(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((raw) => {
      let line = raw.replace(/\s+/g, ' ').trim()
      if (!line) return ''
      line = line.replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff，。、；：？！“”‘’（）《》…—])/g, '$1')
      line = line.replace(/([，。、；：？！“”‘’（）《》…—])\s+/g, '$1')
      line = line.replace(/\s+(?=[，。、；：？！“”‘’（）《》…—％＄＃＆＊＋－＝／｜～])/g, '')
      line = line.replace(/([％＄＃＆＊＋－＝／｜～])\s+/g, '$1')
      line = line.replace(/([\u4e00-\u9fff])\s+(?=[0-9A-Za-z])/g, '$1')
      line = line.replace(/([0-9A-Za-z])\s+(?=[\u4e00-\u9fff])/g, '$1')
      line = line.replace(/(\d)\s*一\s*(\d)/g, '$1-$2')
      return line
    })
    .filter(Boolean)
    .join('\n')
}

function readRaw(req, limit) {
  return new Promise((resolvePromise, rejectPromise) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        rejectPromise(new Error('file too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolvePromise(Buffer.concat(chunks)))
    req.on('error', rejectPromise)
  })
}

function safeFileName(input, fallbackExt) {
  let base = basename(String(input || '')).replace(/[\\/:*?"<>|\u0000-\u001f]/g, '').trim()
  if (!base) base = '上传文件-' + Date.now()
  const ext = extname(base).toLowerCase()
  const allowed = ['.md', '.txt', '.png', '.jpg', '.jpeg', '.webp', '.docx', '.pdf', '.zip']
  if (allowed.indexOf(ext) < 0) base = base + (fallbackExt || '.txt')
  return base
}

async function ensureDailyBackup(caseRoot, force) {
  const dir = join(caseRoot, '_备份')
  const today = new Date().toISOString().slice(0, 10)
  const zip = join(dir, today + '.zip')
  if (!force && existsSync(zip)) return { skipped: true, path: today + '.zip', size: statSync(zip).size }
  mkdirSync(dir, { recursive: true })
  const quotedRoot = caseRoot.replace(/'/g, "''")
  const quotedZip = zip.replace(/'/g, "''")
  const cmd = [
    "$ErrorActionPreference='Stop'",
    "$items = Get-ChildItem -LiteralPath '" + quotedRoot + "' -Force | Where-Object { $_.Name -ne '_备份' } | Select-Object -ExpandProperty FullName",
    "if ($items) { Compress-Archive -LiteralPath $items -DestinationPath '" + quotedZip + "' -Force }"
  ].join('; ')
  await execFileAsync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', cmd], {
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true
  })
  for (const file of readdirSync(dir)) {
    const matched = /^(\d{4}-\d{2}-\d{2})\.zip$/.exec(file)
    if (!matched) continue
    const age = (Date.now() - new Date(matched[1] + 'T00:00:00').getTime()) / 86400000
    if (age > 7) {
      try { unlinkSync(join(dir, file)) } catch { /* keep */ }
    }
  }
  const logFile = join(dir, '备份记录.md')
  const line = '| ' + new Date().toISOString().slice(0, 19).replace('T', ' ') + ' | ' + today + '.zip | ' + Math.round(statSync(zip).size / 1024) + ' KB |'
  if (!existsSync(logFile)) writeUtf8(logFile, '# 备份记录\n\n| 时间 | 文件 | 大小 |\n|---|---|---|\n')
  writeUtf8(logFile, readText(logFile).replace(/\s*$/, '') + '\n' + line + '\n')
  return { path: today + '.zip', size: statSync(zip).size }
}

function latestBackup(caseRoot) {
  const dir = join(caseRoot, '_备份')
  let latest = null
  try {
    for (const file of readdirSync(dir)) {
      const matched = /^(\d{4}-\d{2}-\d{2})\.zip$/.exec(file)
      if (!matched) continue
      const size = statSync(join(dir, file)).size
      if (!latest || matched[1] > latest.date) latest = { date: matched[1], size }
    }
  } catch {
    return null
  }
  return latest
}

const INTAKE_DIR = '_收件箱'
const INTAKE_SLOTS = {
  client: [
    { id: 'chat', name: '聊天记录（微信截图/导出的 txt）' },
    { id: 'material', name: '咨询材料（协议、转账、身份）' },
    { id: 'other', name: '其他' }
  ],
  case: [
    { id: 'retainer', name: '委托与身份（合同/授权/身份证）' },
    { id: 'chat', name: '聊天记录' },
    { id: 'evidence', name: '证据材料（照片/截图/录音/银行流水）' },
    { id: 'court', name: '法院文书（传票/受理/判决）' },
    { id: 'draft', name: '文书草稿（起诉状/答辩状/代理词）' },
    { id: 'research', name: '类案与法规' },
    { id: 'other', name: '其他' }
  ]
}

function batchDir(caseRoot, batch) {
  const safe = String(batch || '').replace(/[^a-z0-9]/gi, '')
  if (!safe) return ''
  return join(caseRoot, INTAKE_DIR, safe)
}

function readManifest(caseRoot, batch) {
  const dir = batchDir(caseRoot, batch)
  if (!dir) return null
  const file = join(dir, 'manifest.json')
  if (!existsSync(file)) return null
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function saveManifest(caseRoot, batch, manifest) {
  writeFileSync(join(batchDir(caseRoot, batch), 'manifest.json'), JSON.stringify(manifest, null, 1), 'utf8')
}

function classifyIntake(kind, slot, filename) {
  const name = String(filename || '')
  if (kind === 'client') {
    if (slot === 'chat' || /聊天|微信|对话/.test(name)) return '聊天记录'
    if (slot === 'material' || /协议|合同|转账|回单|流水|身份证|户口|营业执照|判决|裁定|传票|受理|起诉状|答辩|代理词|律师函|证据|录音|照片|发票|委托|授权|方案|报价|诊断|决策/.test(name)) return '咨询材料'
    return '其他'
  }
  if (slot === 'retainer') return '00-案件档案'
  if (slot === 'chat') return '01-材料收集/当事人提供'
  if (slot === 'evidence') {
    return /身份证|营业执照|户口/.test(name) ? '00-案件档案/当事人信息' : '02-证据整理'
  }
  if (slot === 'court') return '07-程序记录'
  if (slot === 'draft') return '06-文书产出'
  if (slot === 'research') return '03-法律研究/类案判例'
  if (/判决|裁定|传票|受理通知|举证通知|应诉|开庭|调解书/.test(name)) return '07-程序记录'
  if (/委托|授权|风险告知|收费|发票/.test(name)) return '00-案件档案'
  if (/身份证|营业执照|户口|法定代表人/.test(name)) return '00-案件档案/当事人信息'
  if (/聊天|微信|对话/.test(name)) return '01-材料收集/当事人提供'
  if (/证据|截图|照片|录音|视频|鉴定/.test(name)) return '02-证据整理'
  if (/起诉状|答辩状|代理词|上诉状|律师函|意见书/.test(name)) return '06-文书产出'
  if (/法规|法条|案例|类案/.test(name)) return '03-法律研究/类案判例'
  return '01-材料收集'
}

async function zipEntryNames(fullPath) {
  const cmd = "Add-Type -AssemblyName System.IO.Compression.FileSystem; " +
    "[System.IO.Compression.ZipFile]::OpenRead('" + String(fullPath).replace(/'/g, "''") + "').Entries | ForEach-Object { $_.FullName }"
  const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', cmd], {
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true
  })
  return String(stdout)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.endsWith('/') && line.indexOf('__MACOSX') < 0 && !/(^|\/)\.DS_Store$/.test(line))
}

async function unzipInto(zipPath, destDir) {
  mkdirSync(destDir, { recursive: true })
  const cmd = "Expand-Archive -LiteralPath '" + String(zipPath).replace(/'/g, "''") + "' -DestinationPath '" +
    String(destDir).replace(/'/g, "''") + "' -Force"
  await execFileAsync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', cmd], {
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true
  })
}

function walkAllFiles(root) {
  const out = []
  const visit = (dir) => {
    let entries = []
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) visit(full)
      else if (entry.isFile()) out.push({ full, rel: full.slice(root.length + 1).split(sep).join('/') })
    }
  }
  visit(root)
  return out
}

function caseFolderName(caseId, caseName) {
  return '案件-' + caseId + '-' + caseName
}

function createCaseSkeleton(caseRoot, templateDir, payload) {
  const caseId = String(payload.caseId || '').trim()
  const caseName = String(payload.caseName || '').trim()
  const lawyer = String(payload.lawyer || '').trim()
  const folder = caseFolderName(caseId, caseName)
  const caseDir = join(caseRoot, folder)
  if (existsSync(caseDir)) return { exists: true, folder, caseDir }
  const dirs = ['00-案件档案', '01-材料收集/当事人提供', '01-材料收集/律师调取', '02-证据整理', '03-法律研究/类案判例', '04-合同审查', '05-诉讼策略', '06-文书产出', '07-程序记录', '08-结案归档']
  mkdirSync(caseDir, { recursive: true })
  for (const sub of dirs) mkdirSync(join(caseDir, sub), { recursive: true })
  const copies = [
    ['模板-案件基本信息.md', '00-案件档案/案件基本信息.md'],
    ['模板-案件生命周期Checklist.md', '00-案件档案/案件生命周期Checklist.md'],
    ['模板-案件台账.md', '00-案件档案/案件台账.md'],
    ['模板-律师交付包清单.md', '00-案件档案/律师交付包清单.md'],
    ['模板-期限与时效台账.md', '00-案件档案/期限与时效台账.md'],
    ['模板-利益冲突审查表.md', '00-案件档案/利益冲突审查表.md'],
    ['模板-证据原件交接单.md', '02-证据整理/证据原件交接单.md'],
    ['模板-材料收集清单.md', '01-材料收集/材料收集清单.md'],
    ['模板-证据目录.md', '02-证据整理/证据目录.md']
  ]
  const today = new Date().toISOString().slice(0, 10)
  for (const pair of copies) {
    const from = join(templateDir, pair[0])
    if (!existsSync(from)) continue
    let text = readText(from)
    if (pair[1].indexOf('案件基本信息') >= 0) {
      text = text.replace('- 案件编号：2026-XXX', '- 案件编号：' + caseId)
        .replace('- 案件名称：原告 诉 被告 案由', '- 案件名称：' + caseName)
        .replace(/- 承办律师：/, '- 承办律师：' + lawyer)
        .replace(/^- 建档日期：\s*$/m, '- 建档日期：' + today)
    }
    if (pair[1].indexOf('案件台账') >= 0) {
      text = text.replace('| 案件编号 | 2026-XXX |', '| 案件编号 | ' + caseId + ' |')
        .replace('| 案件名称 | 原告 诉 被告 案由 |', '| 案件名称 | ' + caseName + ' |')
        .replace('| 承办律师 | |', '| 承办律师 | ' + lawyer + ' |')
        .replace('| 当前阶段 | 咨询中 / 已接案', '| 当前阶段 | 咨询中')
    }
    writeUtf8(join(caseDir, pair[1]), text)
  }
  writeUtf8(join(caseDir, '07-程序记录', '案件时间线.md'),
    ['# 案件时间线', '', '| 日期 | 动作 | 责任人 | 产出文件 |', '|---|---|---|---|',
      '| ' + today + ' | 建档向导创建案件（' + caseId + '） | ' + lawyer + ' | 00-案件档案/案件基本信息.md |', ''].join('\n'))
  return { exists: false, folder, caseDir }
}

function intakePlan(caseRoot, manifest) {
  const kind = manifest.kind
  const base = kind === 'client' ? '客户/' + manifest.name : caseFolderName(manifest.caseId, manifest.caseName)
  const plan = []
  for (const file of manifest.files || []) {
    const slot = file.slot || 'other'
    if (/\.zip$/i.test(file.original)) {
      continue // zip 先展开，条目在 preview 阶段补充
    }
    plan.push({
      display: file.original,
      target: base + '/' + classifyIntake(kind, slot, file.original),
      stored: file.stored,
      zipEntry: ''
    })
  }
  return { base, plan }
}

function appendAudit(caseRoot, action, detail) {
  try {
    const dir = join(caseRoot, '_系统记录')
    mkdirSync(dir, { recursive: true })
    const file = join(dir, '操作日志.md')
    if (!existsSync(file)) writeUtf8(file, '# 操作日志\n\n| 时间 | 动作 | 说明 |\n|---|---|---|\n')
    const line = '| ' + new Date().toISOString().slice(0, 19).replace('T', ' ') + ' | ' + String(action) + ' | ' + String(detail || '').replace(/\|/g, '/') + ' |'
    writeUtf8(file, readText(file).replace(/\s*$/, '') + '\n' + line + '\n')
  } catch {
    /* audit must never break the action */
  }
}

function updateLeadFields(clientDir, patch) {
  const file = join(clientDir, '线索.md')
  let text = existsSync(file) ? readText(file) : '# 线索档案\n\n'
  const lines = text.split(/\r?\n/)
  for (const key of Object.keys(patch)) {
    const value = patch[key]
    if (value === undefined || value === null || value === '') continue
    const hit = lines.findIndex((line) => new RegExp('^-\\s*' + key + '\\s*[：:]').test(line.trim()))
    const next = '- ' + key + '：' + value
    if (hit >= 0) lines[hit] = next
    else lines.push(next)
  }
  writeUtf8(file, lines.join('\n').replace(/\s*$/, '') + '\n')
}

function commonRoot(rels) {
  if (!rels || !rels.length) return ''
  if (rels.every((rel) => !rel.includes('/'))) return ''
  const first = rels[0].split('/')[0]
  return rels.every((rel) => rel === first || rel.startsWith(first + '/')) ? first : ''
}

function icsEscape(text) {
  return String(text || '').replace(/[\\;,]/g, (m) => '\\' + m).replace(/\r?\n/g, '\\n')
}

function icsDateAdd(dateText, days) {
  const d = new Date(dateText + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

function buildIcs(cases) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LawyerWorkbench//CN', 'CALSCALE:GREGORIAN']
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  for (const item of cases) {
    for (const deadline of item.deadlines || []) {
      if (!deadline.due || deadline.due === '—') continue
      const day = deadline.due.replace(/-/g, '')
      lines.push('BEGIN:VEVENT')
      lines.push('UID:' + item.caseNo + '-' + deadline.no + '-' + day + '@lawyer-workbench')
      lines.push('DTSTAMP:' + stamp)
      lines.push('DTSTART;VALUE=DATE:' + day)
      lines.push('DTEND;VALUE=DATE:' + icsDateAdd(deadline.due, 1))
      lines.push('SUMMARY:' + icsEscape('【' + item.caseNo + '】' + deadline.name))
      lines.push('DESCRIPTION:' + icsEscape(item.name + '｜' + (deadline.basis || '') + '｜' + (deadline.owner || '')))
      lines.push('END:VEVENT')
    }
    if (item.postSale && item.postSale.due) {
      const day = item.postSale.due.replace(/-/g, '')
      lines.push('BEGIN:VEVENT')
      lines.push('UID:' + item.caseNo + '-aftercare-' + day + '@lawyer-workbench')
      lines.push('DTSTAMP:' + stamp)
      lines.push('DTSTART;VALUE=DATE:' + day)
      lines.push('DTEND;VALUE=DATE:' + icsDateAdd(item.postSale.due, 1))
      lines.push('SUMMARY:' + icsEscape('【' + item.caseNo + '】结案回访（第 ' + item.postSale.nextMark + ' 天）'))
      lines.push('DESCRIPTION:' + icsEscape(item.name + '｜售后回访'))
      lines.push('END:VEVENT')
    }
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n') + '\r\n'
}

function safePath(caseRoot, rel) {
  const text = String(rel || '').replace(/\\/g, '/').trim()
  if (!text || text.includes('..') || text.startsWith('/')) return ''
  const full = resolve(caseRoot, text)
  if (full !== caseRoot && !full.startsWith(caseRoot + sep)) return ''
  return full
}

function loadSkills(catalogPath) {
  const doc = readJsonFile(catalogPath)
  if (!doc || !Array.isArray(doc.items)) return { core: [], referenceCount: 0 }
  const coreCats = ['00-LS BANGONG原创', '21-刑事辩护', '22-劳动争议', '23-破产程序', '24-合同', '25-诉讼流程', '26-合规', '27-工具']
  const core = []
  let referenceCount = 0
  const referenceGroups = []
  for (const item of doc.items) {
    if (coreCats.includes(item.category)) {
      core.push({
        id: item.id,
        category: item.category,
        description: item.description,
        path: item.path,
        hasScripts: !!item.hasScripts,
        hasTemplates: !!item.hasTemplates
      })
    } else {
      referenceCount += 1
      const group = referenceGroups.find((g) => g.category === item.category)
      if (group) group.count += 1
      else referenceGroups.push({ category: item.category, count: 1 })
    }
  }
  return { core, referenceCount, referenceGroups }
}

// ---------------------------------------------------------------- http helpers

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  })
  res.end(body)
}

function readBody(req) {
  return new Promise((resolvePromise, rejectPromise) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        rejectPromise(new Error('body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8').trim()
      if (!text) {
        resolvePromise({})
        return
      }
      try {
        resolvePromise(JSON.parse(text))
      } catch {
        rejectPromise(new Error('invalid json'))
      }
    })
    req.on('error', rejectPromise)
  })
}

function buildPrompt(spec, caseItem, action, skillFile) {
  const target = String(action.target || '').replace('<日期>', new Date().toISOString().slice(0, 10).replace(/-/g, ''))
  return [
    `用 ${action.skill} 处理案件「${caseItem.name}」（路径：${caseItem.path}）。`,
    skillFile
      ? `技能文件：${skillFile}（若本会话未加载该技能，先完整读取此文件，再按它的流程执行）`
      : '（本机未安装该技能：按目标自行完成，不要假装调用不存在的技能）',
    '',
    `当前阶段：${caseItem.stageLabel || action.title}（第 ${caseItem.stageIndex + 1}/10 阶段）`,
    `本次目标：${action.title} —— ${action.why}`,
    `产出落盘到：${join(caseItem.path, target)}`,
    '',
    '执行要求：',
    '1. 先读 00-案件档案/案件基本信息.md、案件台账.md、案件生命周期Checklist.md；',
    '2. 只在案件文件夹内写入，不覆盖已有文件，新版本另存并带日期与版本号；',
    '3. 法条、司法解释、案号必须核验，不得用模型记忆代替；材料先完整读取再做关键数据提取；',
    '4. 产出首行写报告编号并回填「关联文件」，完成后把进度写进 07-程序记录/案件时间线.md；',
    '5. 律师没给的关键信息（金额、诉请、授权范围）先问，不要猜。'
  ].join('\n')
}

export function apply(ctx, config) {
  const settings = config || {}
  const caseRoot = resolve(
    typeof settings.caseRoot === 'string' && settings.caseRoot
      ? settings.caseRoot
      : join(process.env.USERPROFILE || process.cwd(), 'Documents', '律师工作目录')
  )
  const catalogPath = resolve(
    typeof settings.catalogPath === 'string' && settings.catalogPath
      ? settings.catalogPath
      : join(caseRoot, '..', 'catalog.json')
  )
  const sessionWorkspace = resolve(
    typeof settings.sessionWorkspace === 'string' && settings.sessionWorkspace ? settings.sessionWorkspace : caseRoot
  )
  const pythonBin = typeof settings.python === 'string' && settings.python ? settings.python : 'python'
  const firmName = typeof settings.firmName === 'string' ? settings.firmName : ''
  const templateDir = resolve(
    process.env.USERPROFILE || process.cwd(),
    '.dsh',
    'skills',
    'lawyer-case-workbench',
    'assets'
  )

  const apiHandler = async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://127.0.0.1')
      const base = API_PREFIX.replace('/api', '')
      const action = url.pathname.slice(base.length) // e.g. /api/all
      if (req.method === 'GET' && action === '/api/all') {
        const scanned = scanCases(caseRoot)
        sendJson(res, 200, {
          ok: true,
          generatedAt: new Date().toISOString(),
          root: caseRoot,
          error: scanned.error || '',
          cases: scanned.cases,
          clients: scanClients(caseRoot),
          backup: latestBackup(caseRoot),
          health: {
            rootExists: existsSync(caseRoot),
            templateDir,
            templateExists: existsSync(templateDir),
            intakeBatches: (() => {
              try {
                return readdirSync(join(caseRoot, INTAKE_DIR)).filter((n) => !n.startsWith('.')).length
              } catch {
                return 0
              }
            })(),
            auditLog: existsSync(join(caseRoot, '_系统记录', '操作日志.md'))
          },
          skills: loadSkills(catalogPath),
          stages: STAGE_ORDER
        })
        return
      }
      if (req.method === 'GET' && action === '/api/case') {
        const id = url.searchParams.get('id') || ''
        const found = scanCases(caseRoot).cases.find((c) => c.id === id)
        if (!found) {
          sendJson(res, 404, { ok: false, error: 'CASE_NOT_FOUND' })
          return
        }
        sendJson(res, 200, { ok: true, case: found })
        return
      }
      if (req.method === 'POST' && action === '/api/open') {
        const body = await readBody(req)
        const caseId = String(body.caseId || '')
        const actionId = String(body.actionId || '')
        const found = scanCases(caseRoot).cases.find((c) => c.id === caseId)
        if (!found) {
          sendJson(res, 404, { ok: false, error: 'CASE_NOT_FOUND' })
          return
        }
        const picked = body.action && typeof body.action === 'object'
          ? {
              id: 'custom',
              title: String(body.action.title || '法律工作'),
              skill: String(body.action.skill || 'lawyer-case-workbench'),
              target: String(body.action.target || '06-文书产出/'),
              why: String(body.action.why || '')
            }
          : found.actions.find((a) => a.id === actionId)
        if (!picked) {
          sendJson(res, 400, { ok: false, error: 'ACTION_NOT_FOUND' })
          return
        }
        const sessionController = ctx.get('sessionController')
        const workspaceRegistry = ctx.get('workspaceRegistry')
        if (!sessionController) {
          sendJson(res, 503, { ok: false, error: 'NO_SESSION_SERVICE' })
          return
        }
        let workspaceId = ''
        if (workspaceRegistry && typeof workspaceRegistry.resolveByPath === 'function') {
          try {
            const workspace = await workspaceRegistry.resolveByPath(sessionWorkspace)
            workspaceId = (workspace && workspace.id) || ''
          } catch {
            workspaceId = ''
          }
        }
        const created = workspaceId
          ? await sessionController.create({ workspaceId })
          : await sessionController.create({ cwd: sessionWorkspace })
        const sessionId = created && created.sessionId
        if (!sessionId) throw new Error('session created without id')
        await sessionController.prompt(
          {
            requestId: `lawyer-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
            sessionId,
            mode: 'queue',
            content: [{ type: 'text', text: buildPrompt(settings, found, picked, skillFileFor(catalogPath, picked.skill)) }]
          },
          new AbortController().signal
        )
        sendJson(res, 200, { ok: true, sessionId, workspaceId: workspaceId || null, action: picked })
        return
      }
      if (req.method === 'POST' && action === '/api/check') {
        const body = await readBody(req)
        const caseId = String(body.caseId || '')
        const stageIdx = Number(body.stageIndex)
        const text = String(body.item || '')
        const dirs = readdirSync(caseRoot, { withFileTypes: true })
          .filter((e) => e.isDirectory() && e.name === caseId)
          .map((e) => join(caseRoot, e.name))
        if (!dirs.length) {
          sendJson(res, 404, { ok: false, error: 'CASE_NOT_FOUND' })
          return
        }
        const file = join(dirs[0], '00-案件档案', '案件生命周期Checklist.md')
        const raw = readFileSync(file, 'utf8')
        const lines = raw.split(/\r?\n/)
        let section = -1
        let hit = -1
        for (let i = 0; i < lines.length; i += 1) {
          if (/^##\s+/.test(lines[i])) section += 1
          if (section === stageIdx && lines[i].includes(`] ${text}`)) {
            hit = i
            break
          }
        }
        if (hit < 0) {
          sendJson(res, 404, { ok: false, error: 'ITEM_NOT_FOUND' })
          return
        }
        lines[hit] = lines[hit].replace(/-\s*\[[ xX]\]/, lines[hit].includes('[x]') || lines[hit].includes('[X]') ? '- [ ]' : '- [x]')
        const next = lines.join('\n')
        writeFileSync(file, next, 'utf8')
        const today = new Date().toISOString().slice(0, 10)
        const logFile = join(dirs[0], '07-程序记录', '案件时间线.md')
        if (existsSync(logFile)) {
          const log = readFileSync(logFile, 'utf8')
          const line = `| ${today} | 勾选 Checklist：${text} | 工作台 | 00-案件档案/案件生命周期Checklist.md |`
          writeFileSync(logFile, `${log.replace(/\s*$/, '')}\n${line}\n`, 'utf8')
        }
        appendAudit(caseRoot, '勾选Checklist', caseId + ' / ' + text)
        const updated = scanCases(caseRoot).cases.find((c) => c.id === caseId) || null
        sendJson(res, 200, { ok: true, case: updated })
        return
      }
      if (req.method === 'GET' && action === '/api/file') {
        const rel = url.searchParams.get('path') || ''
        const full = safePath(caseRoot, rel)
        if (!full || !/\.(md|txt|html?)$/i.test(full)) {
          sendJson(res, 400, { ok: false, error: 'BAD_PATH' })
          return
        }
        if (!existsSync(full)) {
          sendJson(res, 404, { ok: false, error: 'FILE_NOT_FOUND', path: rel })
          return
        }
        sendJson(res, 200, { ok: true, path: rel, text: readFileSync(full, 'utf8').replace(/^\uFEFF/, '') })
        return
      }
      if (req.method === 'POST' && action === '/api/save-html') {
        const body = await readBody(req)
        const rel = String(body.path || '')
        const html = String(body.html || '')
        const full = safePath(caseRoot, rel)
        if (!full || !/\.html?$/i.test(full) || !html.trim() || html.length > 4 * 1024 * 1024) {
          sendJson(res, 400, { ok: false, error: 'BAD_EXPORT' })
          return
        }
        const dir = resolve(full, '..')
        if (!existsSync(dir)) {
          sendJson(res, 404, { ok: false, error: 'DIR_NOT_FOUND' })
          return
        }
        writeFileSync(full, html, 'utf8')
        appendAudit(caseRoot, '导出HTML', rel)
        sendJson(res, 200, { ok: true, path: rel, bytes: Buffer.byteLength(html, 'utf8') })
        return
      }
      if (req.method === 'POST' && action === '/api/client-stage') {
        const body = await readBody(req)
        const name = String(body.name || '')
        const stage = String(body.stage || '')
        if (!name || CLIENT_STAGES.indexOf(stage) < 0) {
          sendJson(res, 400, { ok: false, error: 'BAD_INPUT' })
          return
        }
        const located = findClientDir(caseRoot, name)
        if (!located) {
          sendJson(res, 404, { ok: false, error: 'CLIENT_NOT_FOUND' })
          return
        }
        const dir = located.dir
        const client = buildClient(caseRoot, name, located.root)
        const today = new Date().toISOString().slice(0, 10)
        updateLeadFields(dir, {
          阶段: stage,
          下一步: body.next ? String(body.next) : undefined,
          截止: body.due ? String(body.due) : undefined,
          原因码: body.reason ? String(body.reason) : undefined,
          更新时间: today
        })
        const row = '| ' + today + ' | 阶段改为 ' + stage + (body.reason ? '（' + String(body.reason) + '）' : '') + ' | 工作台 |\n'
        const followFile = join(dir, '跟进记录.md')
        if (existsSync(followFile)) writeUtf8(followFile, readText(followFile).replace(/\s*$/, '') + '\n' + row)
        else writeUtf8(followFile, '# 跟进记录\n\n| 日期 | 动作 | 责任人 |\n|---|---|---|\n' + row)
        appendAudit(caseRoot, '客户阶段变更', name + ' → ' + stage + (body.reason ? '（' + String(body.reason) + '）' : ''))
        sendJson(res, 200, { ok: true, client: buildClient(caseRoot, name, located.root) })
        return
      }
      if (req.method === 'POST' && action === '/api/convert-case') {
        const body = await readBody(req)
        const result = convertClientToCase(caseRoot, templateDir, body)
        if (result.error) {
          sendJson(res, result.error === 'CASE_EXISTS' ? 409 : 400, { ok: false, error: result.error })
          return
        }
        sendJson(res, 200, Object.assign({ ok: true }, result))
        return
      }
      if (req.method === 'POST' && action === '/api/client-open') {
        const body = await readBody(req)
        const name = String(body.name || '')
        const act = body.action && typeof body.action === 'object' ? body.action : null
        if (!name || !act) {
          sendJson(res, 400, { ok: false, error: 'BAD_INPUT' })
          return
        }
        const located = findClientDir(caseRoot, name)
        if (!located) {
          sendJson(res, 404, { ok: false, error: 'CLIENT_NOT_FOUND' })
          return
        }
        const client = buildClient(caseRoot, name, located.root)
        const skillFile = skillFileFor(catalogPath, String(act.skill || ''))
        const relTarget = String(act.target || '').replace(/^客户\/[^/]+\//, '')
        const prompt = [
          '用 ' + (act.skill || 'lawyer-chat-diagnose') + ' 处理客户「' + client.name + '」（目录：' + client.dir + '）。',
          skillFile
            ? '技能文件：' + skillFile + '（若本会话未加载该技能，先完整读取该文件，再按它的流程执行）'
            : '（本机未安装该技能：按目标自行完成，不要假装调用不存在的技能）',
          '',
          '当前阶段：' + client.stage + '（分级 ' + (client.grade || '-') + '）',
          '本次目标：' + act.title + ' —— ' + (act.why || ''),
          '产出落盘到：' + join(client.dir, relTarget),
          '',
          '执行要求：',
          '1. 先读该客户目录下的聊天原文与已有诊断；没有原文就先要求补，不要凭空判断；',
          '2. 法条、案号必须核验，不得用模型记忆；不承诺结果、不贬低同行、隐私先脱敏；',
          '3. 涉及报价按三档结构，写清"不做什么"；涉及邀约给出具体时间段；',
          '3.1 凡是邀约，只做铺垫、不推进：用一个"他现在就能用的东西"换一次见面，不要罗列条件、不要清单腔排比、不要在邀约里报价或谈委托或承诺结果；理由必须用客户自己说过的话；语气像人说话，短句，一次只说一件事；',
          '4. 完成后更新 线索.md 的阶段/下一步，并在 跟进记录.md 追加一行。'
        ].join('\n')
        const sessionController = ctx.get('sessionController')
        const workspaceRegistry = ctx.get('workspaceRegistry')
        if (!sessionController) {
          sendJson(res, 503, { ok: false, error: 'NO_SESSION_SERVICE' })
          return
        }
        let workspaceId = ''
        if (workspaceRegistry && typeof workspaceRegistry.resolveByPath === 'function') {
          try {
            const workspace = await workspaceRegistry.resolveByPath(sessionWorkspace)
            workspaceId = (workspace && workspace.id) || ''
          } catch {
            workspaceId = ''
          }
        }
        const created = workspaceId
          ? await sessionController.create({ workspaceId })
          : await sessionController.create({ cwd: sessionWorkspace })
        const sessionId = created && created.sessionId
        if (!sessionId) throw new Error('session created without id')
        await sessionController.prompt(
          {
            requestId: 'client-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
            sessionId,
            mode: 'queue',
            content: [{ type: 'text', text: prompt }]
          },
          new AbortController().signal
        )
        sendJson(res, 200, { ok: true, sessionId })
        return
      }
      if (req.method === 'POST' && action === '/api/desensitize') {
        const body = await readBody(req)
        const rel = String(body.path || '')
        const full = safePath(caseRoot, rel)
        if (!full || !/\.(md|txt)$/i.test(full)) {
          sendJson(res, 400, { ok: false, error: 'BAD_PATH' })
          return
        }
        if (!existsSync(full)) {
          sendJson(res, 404, { ok: false, error: 'FILE_NOT_FOUND' })
          return
        }
        const result = desensitizeText(readText(full))
        const outRel = rel.replace(/(\.(md|txt))$/i, '.脱敏.$2')
        writeFileSync(safePath(caseRoot, outRel), result.text, 'utf8')
        appendAudit(caseRoot, '生成脱敏副本', outRel)
        sendJson(res, 200, { ok: true, path: outRel, counts: result.counts })
        return
      }
      if (req.method === 'POST' && action === '/api/quote') {
        const body = await readBody(req)
        const name = String(body.name || '')
        const located = findClientDir(caseRoot, name)
        if (!located) {
          sendJson(res, 404, { ok: false, error: 'CLIENT_NOT_FOUND' })
          return
        }
        const client = buildClient(caseRoot, name, located.root)
        const md = buildQuote(client, body)
        const rel = located.root + '/' + name + '/报价单-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.md'
        writeFileSync(join(caseRoot, rel), md, 'utf8')
        sendJson(res, 200, { ok: true, path: rel })
        return
      }
      if (req.method === 'POST' && action === '/api/client-create') {
        const body = await readBody(req)
        const name = String(body.name || '').trim()
        if (!name || name.length > 40 || /[\\/:*?"<>|]/.test(name)) {
          sendJson(res, 400, { ok: false, error: 'BAD_NAME' })
          return
        }
        if (findClientDir(caseRoot, name)) {
          sendJson(res, 409, { ok: false, error: 'CLIENT_EXISTS' })
          return
        }
        const dir = join(caseRoot, '客户', name)
        mkdirSync(dir, { recursive: true })
        writeUtf8(join(dir, '线索.md'), leadDoc({ stage: 'lead', grade: 'C', next: '3 分钟首轮响应', owner: '' }))
        sendJson(res, 200, { ok: true, client: buildClient(caseRoot, name, '客户') })
        return
      }
      if (req.method === 'POST' && action === '/api/upload') {
        const name = url.searchParams.get('name') || ''
        const kind = url.searchParams.get('kind') || 'other'
        const located = findClientDir(caseRoot, name)
        if (!located) {
          sendJson(res, 404, { ok: false, error: 'CLIENT_NOT_FOUND' })
          return
        }
        const bytes = await readRaw(req, 25 * 1024 * 1024)
        if (!bytes.length) {
          sendJson(res, 400, { ok: false, error: 'EMPTY_FILE' })
          return
        }
        const original = url.searchParams.get('filename') || ''
        let fname = safeFileName(original)
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const ext = extname(fname).toLowerCase()
        const isImage = ['.png', '.jpg', '.jpeg', '.webp'].indexOf(ext) >= 0
        if (kind === 'chat' && isImage) {
          let count = 0
          try {
            count = readdirSync(located.dir).filter((file) => /聊天截图/.test(file)).length
          } catch {
            count = 0
          }
          fname = '聊天截图-' + today + '-' + String(count + 1).padStart(2, '0') + ext
        } else if (kind === 'chat' && !/聊天/.test(fname)) {
          fname = '聊天记录-' + today + ext
        } else if (kind === 'decision' && !/决策|需求/.test(fname)) {
          fname = '需求材料-' + today + ext
        }
        writeFileSync(join(located.dir, fname), bytes)
        sendJson(res, 200, { ok: true, path: located.root + '/' + name + '/' + fname, size: bytes.length })
        return
      }
      if (req.method === 'POST' && action === '/api/upload-text') {
        const body = await readBody(req)
        const name = String(body.name || '')
        const located = findClientDir(caseRoot, name)
        if (!located) {
          sendJson(res, 404, { ok: false, error: 'CLIENT_NOT_FOUND' })
          return
        }
        const text = String(body.text || '')
        if (!text.trim()) {
          sendJson(res, 400, { ok: false, error: 'EMPTY_TEXT' })
          return
        }
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const wanted = String(body.filename || '').trim() || '聊天记录-' + today + '.md'
        const fname = safeFileName(wanted)
        writeUtf8(join(located.dir, fname), text)
        sendJson(res, 200, { ok: true, path: located.root + '/' + name + '/' + fname })
        return
      }
      if (req.method === 'POST' && action === '/api/ocr') {
        const body = await readBody(req)
        const name = String(body.name || '')
        const located = findClientDir(caseRoot, name)
        if (!located) {
          sendJson(res, 404, { ok: false, error: 'CLIENT_NOT_FOUND' })
          return
        }
        const wanted = Array.isArray(body.files) ? body.files.map(String) : []
        const candidates = wanted.length
          ? wanted
          : readdirSync(located.dir).filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
        const images = candidates.filter((file) => !/[\\/]/.test(file) && /\.(png|jpe?g|webp)$/i.test(file))
        if (!images.length) {
          sendJson(res, 400, { ok: false, error: 'NO_IMAGES' })
          return
        }
        const chunks = []
        const failed = []
        for (const image of images) {
          const full = join(located.dir, image)
          if (!existsSync(full)) {
            failed.push(image)
            continue
          }
          try {
            const result = await execFileAsync(
              'powershell.exe',
              ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', OCR_SCRIPT, '-Path', full],
              { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, windowsHide: true }
            )
            const text = tidyOcr(result.stdout)
            if (text) chunks.push('## ' + image + '\n\n' + text)
            else failed.push(image)
          } catch {
            failed.push(image)
          }
        }
        if (!chunks.length) {
          sendJson(res, 502, { ok: false, error: 'OCR_FAILED', failed })
          return
        }
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const rel = located.root + '/' + name + '/聊天原文-OCR-' + today + '.md'
        const content = '# 聊天记录 OCR\n\n> 自动识别，可能有错字；关键内容请对照原图。\n\n' + chunks.join('\n\n---\n\n') + '\n'
        writeUtf8(join(caseRoot, rel), content)
        sendJson(res, 200, { ok: true, path: rel, images: images.length, failed, chars: content.length })
        return
      }
      if (req.method === 'POST' && action === '/api/backup') {
        const result = await ensureDailyBackup(caseRoot, true)
        sendJson(res, 200, Object.assign({ ok: true }, result))
        return
      }
      if (req.method === 'POST' && action === '/api/intake/begin') {
        const body = await readBody(req)
        const mode = body.mode === 'existing' ? 'existing' : 'new'
        let kind = body.kind === 'case' ? 'case' : 'client'
        let name = String(body.name || '').trim()
        const caseId = String(body.caseId || '').trim()
        const caseName = String(body.caseName || '').trim()
        let baseRel = ''
        if (mode === 'existing') {
          baseRel = String(body.target || '').replace(/\\/g, '/').trim()
          const full = safePath(caseRoot, baseRel)
          if (!full || !existsSync(full)) {
            sendJson(res, 400, { ok: false, error: 'TARGET_NOT_FOUND' })
            return
          }
          kind = /^案件-/.test(baseRel) ? 'case' : 'client'
          name = baseRel.split('/').pop()
        } else {
          if (!name || /[\\/:*?"<>|]/.test(name)) {
            sendJson(res, 400, { ok: false, error: 'BAD_NAME' })
            return
          }
          if (kind === 'case') {
            if (!/^\d{4}-\d{2,3}$/.test(caseId) || !caseName || /[\\/:*?"<>|]/.test(caseName)) {
              sendJson(res, 400, { ok: false, error: 'BAD_CASE' })
              return
            }
            if (existsSync(join(caseRoot, caseFolderName(caseId, caseName)))) {
              sendJson(res, 409, { ok: false, error: 'CASE_EXISTS' })
              return
            }
          } else if (findClientDir(caseRoot, name)) {
            sendJson(res, 409, { ok: false, error: 'CLIENT_EXISTS' })
            return
          }
        }
        const batch = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
        mkdirSync(join(batchDir(caseRoot, batch), 'files'), { recursive: true })
        const manifest = { batch, mode, baseRel, kind, name, caseId, caseName, lawyer: String(body.lawyer || ''), cause: String(body.cause || ''), stage: String(body.stage || ''), files: [] }
        saveManifest(caseRoot, batch, manifest)
        sendJson(res, 200, { ok: true, batch, slots: INTAKE_SLOTS[kind] })
        return
      }
      if (req.method === 'POST' && action === '/api/intake/upload') {
        const body = await readRaw(req, 80 * 1024 * 1024)
        const batch = url.searchParams.get('batch') || ''
        const slot = url.searchParams.get('slot') || 'other'
        const manifest = readManifest(caseRoot, batch)
        if (!manifest) {
          sendJson(res, 404, { ok: false, error: 'BATCH_NOT_FOUND' })
          return
        }
        if (!body.length) {
          sendJson(res, 400, { ok: false, error: 'EMPTY_FILE' })
          return
        }
        const original = safeFileName(url.searchParams.get('filename') || 'file')
        const index = (manifest.files || []).length + 1
        const stored = String(index).padStart(2, '0') + '-' + original
        writeFileSync(join(batchDir(caseRoot, batch), 'files', stored), body)
        manifest.files.push({ stored, original, slot, size: body.length })
        saveManifest(caseRoot, batch, manifest)
        sendJson(res, 200, { ok: true, stored, original, slot, size: body.length })
        return
      }
      if (req.method === 'POST' && action === '/api/intake/remove') {
        const body = await readBody(req)
        const batch = String(body.batch || '')
        const stored = String(body.stored || '')
        const manifest = readManifest(caseRoot, batch)
        if (!manifest) {
          sendJson(res, 404, { ok: false, error: 'BATCH_NOT_FOUND' })
          return
        }
        manifest.files = (manifest.files || []).filter((f) => f.stored !== stored)
        saveManifest(caseRoot, batch, manifest)
        try { unlinkSync(join(batchDir(caseRoot, batch), 'files', stored)) } catch { /* gone */ }
        sendJson(res, 200, { ok: true })
        return
      }
      if (req.method === 'GET' && action === '/api/intake/preview') {
        const batch = url.searchParams.get('batch') || ''
        const manifest = readManifest(caseRoot, batch)
        if (!manifest) {
          sendJson(res, 404, { ok: false, error: 'BATCH_NOT_FOUND' })
          return
        }
        const base = manifest.mode === 'existing' ? manifest.baseRel : (manifest.kind === 'client' ? '客户/' + manifest.name : caseFolderName(manifest.caseId, manifest.caseName))
        const plan = []
        for (const file of manifest.files || []) {
          if (/\.zip$/i.test(file.original)) {
            try {
              const entries = await zipEntryNames(join(batchDir(caseRoot, batch), 'files', file.stored))
              const entryRels = entries.map((entry) => entry.split('\\').join('/'))
              const prefix = commonRoot(entryRels)
              for (const entryRel of entryRels) {
                const relative = prefix ? entryRel.slice(prefix.length + 1) : entryRel
                const folder = classifyIntake(manifest.kind, 'other', relative)
                const dir = relative.includes('/') ? relative.slice(0, relative.lastIndexOf('/')) : ''
                plan.push({
                  display: entryRel,
                  target: base + '/' + folder + (dir ? '/' + dir : ''),
                  stored: file.stored,
                  zipEntry: entryRel,
                  zipOriginal: file.original
                })
              }
              plan.push({
                display: file.original,
                target: base + '/' + (manifest.kind === 'client' ? '原始压缩包' : '01-材料收集/原始压缩包'),
                stored: file.stored,
                zipEntry: '',
                isZipKeep: true
              })
            } catch {
              plan.push({ display: file.original, target: base + '/' + classifyIntake(manifest.kind, 'other', file.original), stored: file.stored, zipEntry: '', zipFailed: true })
            }
            continue
          }
          plan.push({
            display: file.original,
            target: base + '/' + classifyIntake(manifest.kind, file.slot, file.original),
            stored: file.stored,
            zipEntry: ''
          })
        }
        const folders = manifest.kind === 'client'
          ? ['聊天记录', '咨询材料', '其他', '原始压缩包']
          : ['00-案件档案', '00-案件档案/当事人信息', '01-材料收集', '01-材料收集/当事人提供', '01-材料收集/律师调取', '01-材料收集/原始压缩包', '02-证据整理', '03-法律研究', '03-法律研究/类案判例', '04-合同审查', '05-诉讼策略', '06-文书产出', '07-程序记录', '08-结案归档']
        sendJson(res, 200, {
          ok: true,
          base,
          exists: manifest.kind === 'client' ? Boolean(findClientDir(caseRoot, manifest.name)) : existsSync(join(caseRoot, base)),
          plan,
          folders,
          manifest: { kind: manifest.kind, name: manifest.name, caseId: manifest.caseId, caseName: manifest.caseName, lawyer: manifest.lawyer, cause: manifest.cause, stage: manifest.stage }
        })
        return
      }
      if (req.method === 'POST' && action === '/api/intake/commit') {
        const body = await readBody(req)
        const batch = String(body.batch || '')
        const manifest = readManifest(caseRoot, batch)
        if (!manifest) {
          sendJson(res, 404, { ok: false, error: 'BATCH_NOT_FOUND' })
          return
        }
        const base = manifest.mode === 'existing' ? manifest.baseRel : (manifest.kind === 'client' ? '客户/' + manifest.name : caseFolderName(manifest.caseId, manifest.caseName))
        if (manifest.mode !== 'existing') {
          if (manifest.kind === 'case') {
            createCaseSkeleton(caseRoot, templateDir, manifest)
          } else {
            const dir = join(caseRoot, '客户', manifest.name)
            mkdirSync(dir, { recursive: true })
            if (!existsSync(join(dir, '线索.md'))) {
              writeUtf8(join(dir, '线索.md'), leadDoc({ stage: 'lead', grade: 'C', next: '3 分钟首轮响应', owner: manifest.lawyer }))
            }
          }
        }
        const overrides = {}
        for (const item of Array.isArray(body.targets) ? body.targets : []) {
          const key = String(item.stored || '') + '|' + String(item.zipEntry || '')
          const target = String(item.target || '').replace(/\\/g, '/').replace(/^\.?\//, '')
          if (target && target.indexOf('..') < 0) overrides[key] = target
        }
        const unzRoot = join(batchDir(caseRoot, batch), 'unz')
        let written = 0
        for (const file of manifest.files || []) {
          const source = join(batchDir(caseRoot, batch), 'files', file.stored)
          if (/\.zip$/i.test(file.original)) {
            const dest = join(unzRoot, file.stored)
            try {
              await unzipInto(source, dest)
            } catch {
              continue
            }
            const allEntries = walkAllFiles(dest).filter((entry) => entry.rel.indexOf('__MACOSX') < 0 && !/(^|\/)\.DS_Store$/.test(entry.rel))
            const prefix = commonRoot(allEntries.map((entry) => entry.rel))
            for (const entry of allEntries) {
              const relative = prefix ? entry.rel.slice(prefix.length + 1) : entry.rel
              const overrideKey = file.stored + '|' + entry.rel
              const override = overrides[overrideKey]
              const folder = override || classifyIntake(manifest.kind, 'other', relative)
              const dir = relative.includes('/') ? relative.slice(0, relative.lastIndexOf('/')) : ''
              const targetRel = base + '/' + folder + (dir ? '/' + dir : '')
              const targetDir = join(caseRoot, targetRel)
              mkdirSync(targetDir, { recursive: true })
              const name = basename(entry.full)
              let finalPath = join(targetDir, name)
              let n = 2
              while (existsSync(finalPath)) {
                const dot = name.lastIndexOf('.')
                const stem = dot > 0 ? name.slice(0, dot) : name
                const ext = dot > 0 ? name.slice(dot) : ''
                finalPath = join(targetDir, stem + '-' + n + ext)
                n += 1
              }
              copyFileSync(entry.full, finalPath)
              written += 1
            }
            const keepDir = join(caseRoot, base, manifest.kind === 'client' ? '原始压缩包' : '01-材料收集/原始压缩包')
            mkdirSync(keepDir, { recursive: true })
            try { copyFileSync(source, join(keepDir, file.original)) } catch { /* keep */ }
          } else {
            const override = overrides[file.stored + '|']
            const targetRel = base + '/' + (override || classifyIntake(manifest.kind, file.slot, file.original))
            const targetDir = join(caseRoot, targetRel)
            mkdirSync(targetDir, { recursive: true })
            let finalPath = join(targetDir, file.original)
            let n = 2
            while (existsSync(finalPath)) {
              const dot = file.original.lastIndexOf('.')
              const stem = dot > 0 ? file.original.slice(0, dot) : file.original
              const ext = dot > 0 ? file.original.slice(dot) : ''
              finalPath = join(targetDir, stem + '-' + n + ext)
              n += 1
            }
            copyFileSync(source, finalPath)
            written += 1
          }
        }
        appendAudit(caseRoot, '建档归档', base + '，写入 ' + written + ' 个文件')
        try { rmSync(batchDir(caseRoot, batch), { recursive: true, force: true }) } catch { /* ignore */ }
        sendJson(res, 200, { ok: true, base, files: written, kind: manifest.kind })
        return
      }
      if (req.method === 'POST' && action === '/api/export-docx') {
        const body = await readBody(req)
        const rel = String(body.path || '')
        const full = safePath(caseRoot, rel)
        if (!full || !/\.md$/i.test(full) || !existsSync(full)) {
          sendJson(res, 400, { ok: false, error: 'BAD_PATH' })
          return
        }
        const outRel = rel.replace(/\.md$/i, '.docx')
        const outFull = safePath(caseRoot, outRel)
        try {
          await execFileAsync(pythonBin, ['-X', 'utf8', DOCX_SCRIPT, full, outFull, firmName], {
            encoding: 'utf8',
            maxBuffer: 16 * 1024 * 1024,
            windowsHide: true
          })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: 'DOCX_FAILED', message: String((error && error.message) || error) })
          return
        }
        appendAudit(caseRoot, '导出Word', outRel)
        sendJson(res, 200, { ok: true, path: outRel })
        return
      }
      if (req.method === 'POST' && action === '/api/export-ics') {
        const cases = scanCases(caseRoot).cases
        const ics = buildIcs(cases)
        const dir = join(caseRoot, '_日历')
        mkdirSync(dir, { recursive: true })
        const name = '期限提醒-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.ics'
        writeFileSync(join(dir, name), ics, 'utf8')
        appendAudit(caseRoot, '导出日历', name)
        sendJson(res, 200, { ok: true, path: '_日历/' + name, events: (ics.match(/BEGIN:VEVENT/g) || []).length })
        return
      }
      if (req.method === 'POST' && action === '/api/export-batch') {
        const body = await readBody(req)
        const caseId = String(body.caseId || '')
        const found = scanCases(caseRoot).cases.find((item) => item.id === caseId)
        if (!found) {
          sendJson(res, 404, { ok: false, error: 'CASE_NOT_FOUND' })
          return
        }
        const skipNames = ['案件基本信息.md', '案件生命周期Checklist.md', '案件台账.md', '期限与时效台账.md', '律师交付包清单.md', '利益冲突审查表.md', '材料收集清单.md', '证据原件交接单.md', '案件时间线.md']
        const mdFiles = walkAllFiles(found.path).filter((file) =>
          /\.md$/i.test(file.rel) && file.rel.indexOf('_系统记录') < 0 && skipNames.indexOf(basename(file.rel)) < 0
        )
        const done = []
        const failed = []
        for (const file of mdFiles) {
          const outFull = file.full.replace(/\.md$/i, '.docx')
          try {
            await execFileAsync(pythonBin, ['-X', 'utf8', DOCX_SCRIPT, file.full, outFull, firmName], {
              encoding: 'utf8',
              maxBuffer: 16 * 1024 * 1024,
              windowsHide: true
            })
            done.push(file.rel.replace(/\.md$/i, '.docx'))
          } catch {
            failed.push(file.rel)
          }
        }
        appendAudit(caseRoot, '批量导出Word', caseId + '，成功 ' + done.length + ' 个')
        sendJson(res, 200, { ok: true, done, failed, total: mdFiles.length })
        return
      }
      sendJson(res, 404, { ok: false, error: 'UNKNOWN_ROUTE', path: url.pathname })
    } catch (error) {
      sendJson(res, 500, { ok: false, error: 'HANDLER_FAILED', message: String((error && error.message) || error) })
    }
  }

  ensureDailyBackup(caseRoot, false).catch(() => {
    /* backup failure must not block the panel */
  })

  ctx.inject(['webServer'], (scope) => {
    const webServer = scope.webServer
    scope.effect(
      () => webServer.register({ kind: 'prefix', path: API_PREFIX, handler: apiHandler }),
      'lawyer-workbench-routes'
    )
  })
}
