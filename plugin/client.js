window.__ModuleLoader__.load({
  id: '@local/dsh-lawyer-workbench',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'lawyerWorkbench'
    const API = '/lawyer-workbench/api/all'

    const STRINGS = {
      zh: {
        navCases: '案件台',
        navTracks: '赛道台',
        navDeliver: '交付台',
        navDeadlines: '期限台',
        navSettings: '设置',
        navClients: '客户',
        navWorkbench: '律师台',
        reportBack: '返回',
        exportHtml: '导出 HTML',
        exporting: '导出中…',
        exportedTo: '已导出',
        openFile: '查看',
        noClients: '还没有客户文件夹。在 律师工作目录/客户/<客户名>/ 下放聊天记录和诊断报告，就会出现在这里。',
        kindDiagnosis: '诊断',
        kindChat: '聊天原文',
        kindDecision: '决策材料',
        kindProposal: '方案',
        kindOther: '其他',
        reportHint: '点文件看可视化报告，可导出 HTML（浏览器打开后打印即可存 PDF）',
        stageLead: '线索',
        stageConsulted: '已咨询',
        stageProposal: '已方案',
        stageQuoted: '已报价',
        stageWon: '已成交',
        stageLost: '已失单',
        stageServed: '售后',
        funnel: '转化漏斗',
        postSale: '售后待办',
        postSaleEmpty: '没有待回访的结案案件',
        followQueue: '本周该跟进',
        clientNext: '下一步动作',
        clientInfo: '客户信息',
        grade: '分级',
        temp: '温度',
        source: '来源',
        budget: '预算信号',
        ownerLabel: '负责人',
        stageLabel2: '阶段',
        stageSaved: '阶段已更新',
        converted: '已转案件',
        convertCase: '转成案件',
        promptCaseId: '案件编号（格式 2026-001）',
        promptCaseName: '案件名称（如 张三诉李四民间借贷）',
        promptLawyer: '承办律师',
        lostReason: '失单原因',
        promptLostReason: '失单原因（price/trust/timing/competitor/no_decision/unqualified/ghost）',
        openCaseReport: '看报告',
        outputsHint: '点 md 直接看报告；Word/PDF 用本机打开',
        allStages: '全部',
        noStageCards: '这个阶段没有对应功能卡，切「全部」看看',
        outputsTo: '产出 →',
        quoteTitle: '生成报价单（三档价，填完直接出）',
        qBasic: '基础版',
        qRecommend: '推荐版',
        qFull: '全程/风险',
        quoteClose: '收起报价单',
        backupTitle: '备份',
        backupLast: '最近备份',
        backupNone: '还没有备份（每天首次打开会自动备份，保留 7 天）',
        backupNow: '立即备份',
        navIntake: '建档',
        intakeStep1: '选择建档',
        intakeStep2: '上传资料',
        intakeStep3: '确认归档',
        intakeClient: '新客户（还没成案）',
        intakeClientHint: '先建客户档案，等签约再转案件',
        intakeCase: '新案件（已委托）',
        intakeCaseHint: '直接建 10 段案件目录，资料自动归位',
        intakeName: '客户称呼 / 案件名称',
        intakeNamePh: '如：小卢 / 卢某与高某合伙纠纷',
        intakeLawyer: '承办律师',
        intakeLawyerPh: '如：唐律师',
        intakeCause: '案由（选填）',
        intakeCausePh: '如：合伙合同纠纷',
        intakeCaseId: '案件编号',
        intakeCaseName: '案件名称',
        intakeCaseNamePh: '如：卢某与高某合伙合同纠纷',
        intakeStage: '当前阶段',
        intakeNext: '下一步：上传资料',
        intakeBusy: '处理中…',
        needName: '先填一个称呼',
        needCaseName: '案件名称必填',
        intakeChoose: '选择文件',
        intakeSlotEmpty: '空着也行，之后还能补',
        intakeUploadHint: '每个槽位可以传多个文件，也可以直接传 zip 压缩包（会在下一步自动展开、逐个归类）。',
        intakeUploaded: '已上传',
        intakePreview: '下一步：预览归档位置',
        intakeBack: '上一步',
        needFiles: '先上传至少一个文件',
        intakeTarget: '归档位置',
        intakeFolder: '目标文件夹',
        intakeBulk: '统一改为',
        intakeBulkPh: '全部移到…',
        intakeExists: '已存在，只会补充文件',
        intakeNew: '将新建目录',
        intakeCommit: '确认归档',
        intakeDone: '归档完成',
        intakeFiles: '文件数',
        intakeGo: '去看看',
        intakeAgain: '再建一个',
        hideDemo: '隐藏演示',
        showAll: '查看全部',
        collapse: '收起',
        intakeModeNew: '新建档案',
        intakeModeExisting: '补到已有',
        intakePickTarget: '选择已有案件或客户',
        intakePickTargetPh: '选择…',
        intakeCaseShort: '案件',
        intakeClientShort: '客户',
        needTarget: '先选一个已有档案',
        healthTitle: '体检',
        healthRoot: '工作目录',
        healthTemplate: '案件模板目录',
        healthBatches: '待归档批次',
        healthAudit: '操作日志',
        exportWord: '导出 Word',
        exportingWord: '导出中…',
        wordDone: '已导出 Word',
        exportIcs: '导出日历 (.ics)',
        icsDone: '日历已导出',
        searchPlaceholder: '搜案件 / 客户 / 文件…（Ctrl+K）',
        searchHint: '↑↓ 选择 · Enter 打开 · Esc 关闭',
        searchEmpty: '没有匹配结果',
        batchExport: '批量导出 Word',
        batchBusy: '导出中…',
        batchDone: '已导出 {n} 个 Word',
        clickOpen: '点开看',
        openLocally: '本机打开',
        unverified: '导出未审',
        demo: '演示',
        deadlineLow: '期限台账没填全，红灯不会亮',
        unverifiedExports: '份文书已导出但没过出稿前审查',
        quote: '生成报价单',
        quoteBasic: '基础版价格（如 3000-4000）',
        quoteRecommended: '推荐版价格（如 8000）',
        quoteFull: '全程版价格（如 12000-15000）',
        quoting: '生成中…',
        quoteDone: '报价单已生成',
        desensitize: '生成脱敏副本',
        desensitizing: '脱敏中…',
        desensitized: '脱敏完成',
        postSaleLine: '结案 %d 天 · 建议 %n 天回访（%d）',
        postSaleOverdue: '已过建议回访时间',
        due: '截止',
        kindQuote: '报价单',
        kindVisit: '回访',
        kindLead: '线索',
        kindFollow: '跟进',
        kindExport: '导出',
        uploadTitle: '上传材料（拖进来就行）',
        uploadHint: '把微信聊天截图、导出的聊天 txt、谈案笔记拖到下面；也可以直接粘贴聊天文字。文件会存进这个客户文件夹。',
        dropHere: '拖拽文件到这里上传（默认当作聊天记录）',
        chooseChat: '上传聊天记录',
        chooseDoc: '上传谈案材料',
        savePaste: '粘贴保存为聊天记录',
        saving: '保存中…',
        uploaded: '已上传',
        pastePlaceholder: '把微信聊天记录整段粘贴到这里，点下面按钮保存…',
        materials: '材料清单',
        mChat: '聊天记录',
        mDiagnosis: '聊天诊断',
        mProposal: '三档方案',
        mQuote: '报价单',
        mDecision: '决策材料',
        genDiagnosis: '生成诊断',
        genProposal: '生成方案',
        genDecision: '生成决策材料',
        newClient: '新建客户',
        newClientPrompt: '客户怎么称呼（脱敏，如 李女士）',
        clientCreated: '客户已建',
        mHave: '已有',
        mMissing: '缺',
        uploadedAsk: '已上传，接着做什么？',
        nowDiagnose: '现在生成诊断',
        ocrNow: '识别截图文字',
        ocrDone: '已识别 {n} 张截图',
        later: '稍后',
        safetyTitle: '安全感邀约卡',
        inviteTitle: '邀约铺垫卡',
        inviteHint: '第一次见面别提三件事：委托、价格、保证输赢。只给他一个现在就能用的东西。',
        copyThis: '复制这一句',
        anotherVersion: '换一版',
        safetyNoDeal: '不谈委托',
        safetyNoFee: '这次不收费',
        safetyBring: '可带家人/合伙人',
        safetyWalk: '20 分钟到点结束',
        safetyRecord: '可以录音',
        safetyRefuse: '不方便也没关系',
        copyInvite: '复制这句邀约',
        copied: '已复制',
        loading: '正在读取案件…',
        empty: '还没有案件。用 lawyer-case-workbench 建第一个案件文件夹，或先在设置里改工作目录。',
        failed: '读取失败',
        retry: '重试',
        refresh: '刷新',
        caselist: '案件',
        active: '在办',
        search: '搜索客户 / 案由 / 编号',
        noMatch: '没有匹配的案件',
        overview: '案件概况',
        client: '客户',
        opponent: '对方',
        cause: '案由',
        amount: '争议金额',
        court: '管辖法院',
        lawyer: '承办律师',
        fee: '收费',
        lifecycle: '生命周期',
        checklist: '本阶段 Checklist',
        ledger: '台账（唯一编号源）',
        ledgerOk: '台账校验：结构可读',
        ledgerBroken: '条待证事实为断点',
        deadlines: '期限与时效',
        redline: '项红灯',
        delivery: '交付包',
        doneOf: '完成',
        redlines: '六条红线',
        outputs: '本阶段产出物',
        noOutputs: '还没有产出文件',
        next: '下一步',
        run: '开跑',
        nextOne: '换一个动作',
        markDone: '标记完成',
        openCase: '打开',
        stages: '阶段',
        tracks: '赛道',
        trackHint: '点阶段看功能卡；点开跑会带上当前案件上下文',
        usingCase: '当前案件',
        pickCase: '选择案件（开跑对象）',
        noCase: '先在案件台选一个案件',
        functions: '功能卡',
        deliverables: '交付看板',
        draft: '草稿',
        reviewed: '已审',
        exported: '已导出',
        delivered: '已交付',
        noFiles: '暂无文件',
        allDeadlines: '全部期限',
        today: '今日 / 逾期',
        week: '本周（7 天内）',
        month: '30 天内',
        noDeadline: '台账里还没有填截止日',
        root: '工作目录',
        skillCore: '中文实务技能',
        skillRef: '社区参考技能（折叠）',
        refNote: '参考区为英美法社区技能，默认不进阶段流水线，避免误用。',
        aboutTitle: '这个工作台在做什么',
        aboutBody: '左栏 5 个台：案件台看案子到哪一步，赛道台看每条业务线能做什么，交付台看文书走到哪个状态，期限台看今天/本周要处理什么。所有数据来自案件文件夹里的 6 张表，不另存一份。',
        toggleConfirm: '把这个 Checklist 项标记为',
        openFailed: '开跑失败',
        statusFlow: '状态流转',
        red: '红灯',
        amber: '临近',
        ok: '正常',
        dirty: '未刷新',
        refOpen: '查看',
        lastUpdate: '最后更新'
      },
      en: {
        navCases: 'Cases',
        navTracks: 'Tracks',
        navDeliver: 'Deliverables',
        navDeadlines: 'Deadlines',
        navSettings: 'Settings',
        navClients: 'Clients',
        navWorkbench: 'Lawyer desk',
        reportBack: 'Back',
        exportHtml: 'Export HTML',
        exporting: 'Exporting…',
        exportedTo: 'Exported',
        openFile: 'Open',
        noClients: 'No client folders yet. Put chat logs and diagnoses under 律师工作目录/客户/<name>/.',
        kindDiagnosis: 'Diagnosis',
        kindChat: 'Chat log',
        kindDecision: 'Decision sheet',
        kindProposal: 'Proposal',
        kindOther: 'Other',
        reportHint: 'Open a file to read the rendered report; export HTML and print to PDF from the browser.',
        stageLead: 'Lead',
        stageConsulted: 'Consulted',
        stageProposal: 'Proposal',
        stageQuoted: 'Quoted',
        stageWon: 'Won',
        stageLost: 'Lost',
        stageServed: 'Aftercare',
        funnel: 'Funnel',
        postSale: 'Aftercare queue',
        postSaleEmpty: 'No closed case waiting for a visit',
        followQueue: 'Follow up this week',
        clientNext: 'Next action',
        clientInfo: 'Client',
        grade: 'Grade',
        temp: 'Temperature',
        source: 'Source',
        budget: 'Budget signal',
        ownerLabel: 'Owner',
        stageLabel2: 'Stage',
        stageSaved: 'Stage updated',
        converted: 'Case created',
        convertCase: 'Convert to case',
        promptCaseId: 'Case number (2026-001)',
        promptCaseName: 'Case name',
        promptLawyer: 'Lawyer',
        lostReason: 'Lost reason',
        promptLostReason: 'Lost reason code',
        openCaseReport: 'Open report',
        outputsHint: 'Click an md file to read it; open Word/PDF locally.',
        allStages: 'All',
        noStageCards: 'No card in this stage — try All.',
        outputsTo: 'Output →',
        quoteTitle: 'Build quote (three tiers)',
        qBasic: 'Basic',
        qRecommend: 'Recommended',
        qFull: 'Full/risk',
        quoteClose: 'Hide quote form',
        backupTitle: 'Backup',
        backupLast: 'Last backup',
        backupNone: 'No backup yet (auto daily, kept 7 days)',
        backupNow: 'Back up now',
        navIntake: 'Intake',
        intakeStep1: 'Choose type',
        intakeStep2: 'Upload files',
        intakeStep3: 'Confirm filing',
        intakeClient: 'New client (not retained)',
        intakeClientHint: 'Create a client folder first',
        intakeCase: 'New case (retained)',
        intakeCaseHint: 'Create the full case tree and file materials',
        intakeName: 'Client / case name',
        intakeNamePh: 'e.g. Lu',
        intakeLawyer: 'Lawyer',
        intakeLawyerPh: 'e.g. Tang',
        intakeCause: 'Cause (optional)',
        intakeCausePh: 'e.g. partnership dispute',
        intakeCaseId: 'Case number',
        intakeCaseName: 'Case name',
        intakeCaseNamePh: 'e.g. Lu v. Gao',
        intakeStage: 'Stage',
        intakeNext: 'Next: upload',
        intakeBusy: 'Working…',
        needName: 'Enter a name first',
        needCaseName: 'Case name is required',
        intakeChoose: 'Choose files',
        intakeSlotEmpty: 'Can be empty',
        intakeUploadHint: 'Multiple files per slot; zip archives are expanded and classified in the next step.',
        intakeUploaded: 'Uploaded',
        intakePreview: 'Next: preview filing',
        intakeBack: 'Back',
        needFiles: 'Upload at least one file',
        intakeTarget: 'Target',
        intakeFolder: 'Folder',
        intakeBulk: 'Move all to',
        intakeBulkPh: 'All to…',
        intakeExists: 'exists, will add files',
        intakeNew: 'will be created',
        intakeCommit: 'Confirm filing',
        intakeDone: 'Filed',
        intakeFiles: 'Files',
        intakeGo: 'Open',
        intakeAgain: 'Start another',
        hideDemo: 'Hide demo',
        showAll: 'Show all',
        collapse: 'Collapse',
        intakeModeNew: 'New file',
        intakeModeExisting: 'Add to existing',
        intakePickTarget: 'Pick an existing case or client',
        intakePickTargetPh: 'Choose…',
        intakeCaseShort: 'Case',
        intakeClientShort: 'Client',
        needTarget: 'Pick an existing file first',
        healthTitle: 'Health',
        healthRoot: 'Work folder',
        healthTemplate: 'Case templates',
        healthBatches: 'Pending intake batches',
        healthAudit: 'Audit log',
        exportWord: 'Export Word',
        exportingWord: 'Exporting…',
        wordDone: 'Word exported',
        exportIcs: 'Export calendar (.ics)',
        icsDone: 'Calendar exported',
        searchPlaceholder: 'Search cases / clients / files… (Ctrl+K)',
        searchHint: '↑↓ select · Enter open · Esc close',
        searchEmpty: 'No results',
        batchExport: 'Export all to Word',
        batchBusy: 'Exporting…',
        batchDone: 'Exported {n} Word files',
        clickOpen: 'open',
        openLocally: 'open locally',
        unverified: 'exported, unreviewed',
        demo: 'Demo',
        deadlineLow: 'Deadline ledger is incomplete — never turns red',
        unverifiedExports: 'exports lack pre-publish review',
        quote: 'Build quote',
        quoteBasic: 'Basic price',
        quoteRecommended: 'Recommended price',
        quoteFull: 'Full price',
        quoting: 'Building…',
        quoteDone: 'Quote created',
        desensitize: 'Desensitize copy',
        desensitizing: 'Desensitizing…',
        desensitized: 'Desensitized',
        postSaleLine: 'Closed %d days ago · next touchpoint %n days (%d)',
        postSaleOverdue: 'Past the recommended visit',
        due: 'Due',
        kindQuote: 'Quote',
        kindVisit: 'Visit',
        kindLead: 'Lead',
        kindFollow: 'Follow-up',
        kindExport: 'Export',
        uploadTitle: 'Upload materials (drag & drop)',
        uploadHint: 'Drop chat screenshots, exported txt, or notes here; or paste the chat text. Files go into this client folder.',
        dropHere: 'Drop files here (treated as chat records)',
        chooseChat: 'Upload chat log',
        chooseDoc: 'Upload case notes',
        savePaste: 'Save pasted chat',
        saving: 'Saving…',
        uploaded: 'Uploaded',
        pastePlaceholder: 'Paste the whole WeChat conversation here, then save…',
        materials: 'Materials',
        mChat: 'Chat log',
        mDiagnosis: 'Diagnosis',
        mProposal: 'Proposal',
        mQuote: 'Quote',
        mDecision: 'Decision sheet',
        genDiagnosis: 'Diagnose',
        genProposal: 'Build proposal',
        genDecision: 'Build decision sheet',
        newClient: 'New client',
        newClientPrompt: 'Client name (desensitized)',
        clientCreated: 'Client created',
        mHave: 'have',
        mMissing: 'missing',
        uploadedAsk: 'Uploaded. What next?',
        nowDiagnose: 'Diagnose now',
        ocrNow: 'OCR screenshots',
        ocrDone: 'Recognized {n} screenshots',
        later: 'Later',
        safetyTitle: 'Safe invitation card',
        inviteTitle: 'Invitation groundwork',
        inviteHint: 'Do not raise retainer, price, or outcome promises at the first meeting. Give him one thing he can use now.',
        copyThis: 'Copy this line',
        anotherVersion: 'Another version',
        safetyNoDeal: 'No retainer talk',
        safetyNoFee: 'No fee this time',
        safetyBring: 'Bring family/partner',
        safetyWalk: '20 minutes, hard stop',
        safetyRecord: 'Recording is fine',
        safetyRefuse: 'No pressure if you decline',
        copyInvite: 'Copy invitation',
        copied: 'Copied',
        loading: 'Loading cases…',
        empty: 'No cases yet. Create a case folder with the case-workbench skill, or change the root in Settings.',
        failed: 'Failed to load',
        retry: 'Retry',
        refresh: 'Refresh',
        caselist: 'Cases',
        active: 'active',
        search: 'Search client / cause / number',
        noMatch: 'No matching case',
        overview: 'Overview',
        client: 'Client',
        opponent: 'Opponent',
        cause: 'Cause',
        amount: 'Amount',
        court: 'Court',
        lawyer: 'Lawyer',
        fee: 'Fee',
        lifecycle: 'Lifecycle',
        checklist: 'Stage checklist',
        ledger: 'Ledger (single id source)',
        ledgerOk: 'Ledger readable',
        ledgerBroken: 'facts are broken links',
        deadlines: 'Deadlines',
        redline: 'red',
        delivery: 'Delivery pack',
        doneOf: 'done',
        redlines: 'Red lines',
        outputs: 'Stage outputs',
        noOutputs: 'No output files yet',
        next: 'Next step',
        run: 'Run',
        nextOne: 'Another action',
        markDone: 'Mark done',
        openCase: 'Open',
        stages: 'stages',
        tracks: 'Tracks',
        trackHint: 'Pick a stage to see function cards; Run carries the selected case.',
        usingCase: 'Case',
        pickCase: 'Pick a case to run on',
        noCase: 'Select a case first',
        functions: 'Function cards',
        deliverables: 'Deliverable board',
        draft: 'Draft',
        reviewed: 'Reviewed',
        exported: 'Exported',
        delivered: 'Delivered',
        noFiles: 'No files',
        allDeadlines: 'All deadlines',
        today: 'Today / overdue',
        week: 'This week (≤7d)',
        month: 'Within 30 days',
        noDeadline: 'No due dates in the deadline ledger yet',
        root: 'Case root',
        skillCore: 'Chinese practice skills',
        skillRef: 'Community reference (folded)',
        refNote: 'The reference area is US-style community content; it stays out of the stage pipeline.',
        aboutTitle: 'What this workbench does',
        aboutBody: 'Five tables on the left: Cases tracks where each matter stands, Tracks maps what each practice line can do, Deliverables tracks document state, Deadlines shows what is due. Every value is parsed from the six records inside the case folder; nothing is stored twice.',
        toggleConfirm: 'Set this checklist item to',
        openFailed: 'Could not start the session',
        statusFlow: 'Status flow',
        red: 'red',
        amber: 'soon',
        ok: 'ok',
        dirty: 'stale',
        refOpen: 'View',
        lastUpdate: 'Updated'
      }
    }

    const TRACKS = [
      {
        id: 'civil',
        title: '民事诉讼',
        titleEn: 'Civil litigation',
        stages: ['咨询', '接案', '取证', '策略', '立案', '庭前', '庭审', '判决', '执行', '结案'],
        functions: [
          ['法律研究（LR-01）', '能不能告、值不值、走哪条路径', 'lawyer-legal-research', '03-法律研究/'],
          ['建台建档', '10 个目录、基本信息、台账、期限表', 'lawyer-case-workbench', '00-案件档案/'],
          ['证据目录与三性审查', '待证事实拆解、分组编号、三性逐份', 'lawyer-evidence-handling', '02-证据整理/'],
          ['补证路径', '断点 → 找谁取、怎么取、多久', 'lawyer-evidence-handling', '02-证据整理/补证清单.md'],
          ['调查取证 / 保全', '调查令、证人出庭、诉前保全', 'evidence-investigation-management', '02-证据整理/申请书/'],
          ['诉讼策略（LA-01）', '争点、胜负区间、调解底线', 'lawyer-litigation-analysis', '05-诉讼策略/'],
          ['起诉状 / 代理词（我方）', '证据编号必须与台账对齐', 'lawyer-doc-drafting', '06-文书产出/'],
          ['答辩状（被告方）', '逐项回应对方主张，引台账编号反驳', 'litigation-doc-drafting', '06-文书产出/答辩状-日期-v1.docx'],
          ['可视化', '时间轴、关系图、争点树、证据链', 'litigation-visualization', '07-交付文件/'],
          ['庭前准备与庭审', '争点清单、举证顺序、质证攻防', 'pre-trial-preparation', '05-庭审材料/'],
          ['结案归档', '结案报告、回访、复盘、装订', 'case-closing-and-archiving', '08-结案归档/']
        ]
      },
      {
        id: 'criminal',
        title: '刑事辩护',
        titleEn: 'Criminal defense',
        stages: ['接案', '侦查', '审查起诉', '一审', '二审', '速裁/认罪认罚', '特殊程序'],
        functions: [
          ['接案与委托', '首次接待、风险评估、委托手续', 'case-intake-and-retainer', '00-案件档案/'],
          ['阶段路由', '现在在哪个阶段、下一步是什么', 'criminal-defense-router', '07-程序记录/'],
          ['侦查阶段', '会见、取保、不予批捕、羁押必要性', 'criminal-investigation-stage', '04-会见笔录/'],
          ['审查起诉', '阅卷、不起诉意见、排非申请', 'criminal-prosecution-review-stage', '03-阅卷摘要/'],
          ['一审辩护', '庭前会议、发问质证、辩护词', 'criminal-first-instance', '06-文书产出/'],
          ['二审辩护', '上诉理由、争取开庭、书面意见', 'criminal-second-instance', '06-文书产出/'],
          ['专项', '未成年人、死刑、速裁、违法所得没收', 'special-procedures', '06-文书产出/']
        ]
      },
      {
        id: 'labor',
        title: '劳动争议',
        titleEn: 'Labor disputes',
        stages: ['咨询', '仲裁', '诉讼', '执行', '企方合规'],
        functions: [
          ['关系认定与补偿测算', '三性从属、12 类争议、N/N+1/2N', 'labor-relationship-and-compensation', '03-法律分析/'],
          ['证据体系', '举证责任倒置、按争议类型出清单', 'labor-evidence-system', '02-证据整理/'],
          ['仲裁程序', '仲裁前置、时效、一裁终局、申请答辩', 'labor-arbitration-procedure', '06-文书产出/'],
          ['劳动诉讼', '与民事流程衔接', 'labor-litigation', '06-文书产出/'],
          ['企方合规', '员工手册、制度、解除审查、工资工时', 'employer-labor-compliance', '00-案件档案/']
        ]
      },
      {
        id: 'bankruptcy',
        title: '破产重整',
        titleEn: 'Bankruptcy',
        stages: ['分析', '申请受理', '接管', '财产调查', '债权申报', '债权人会议', '重整/和解/清算', '文书'],
        functions: [
          ['破产法律分析', '三角色视角（管理人/债权人/债务人）', 'bankruptcy-legal-analysis', '03-法律分析/'],
          ['申请与受理', '申请书、附件、提交跟踪', 'bankruptcy-filing-and-acceptance', '06-文书产出/'],
          ['管理人接管', '印章账户、财产接管、合同处理', 'bankruptcy-administrator-work', '01-接管材料/'],
          ['财产调查', '可撤销/无效行为追回、管理方案', 'bankruptcy-asset-investigation', '03-财产调查/'],
          ['债权申报审查', '申报、审查、编表', 'bankruptcy-claim-filing-review', '02-债权申报/'],
          ['债权人会议', '筹备、议程、表决、纪要', 'bankruptcy-creditors-meeting', '05-会议材料/'],
          ['重整 / 和解 / 清算', '计划草案、分组表决、变价分配', 'bankruptcy-reorganization', '06-文书产出/'],
          ['破产文书', '165 份文书样式按需生成', 'bankruptcy-document-generation', '06-文书产出/']
        ]
      },
      {
        id: 'contract',
        title: '合同事务',
        titleEn: 'Contracts',
        stages: ['收稿', '结构梳理', '逐条审查', '修订', '定稿归档', '起草'],
        functions: [
          ['交易结构梳理', '谁付钱/谁交付/何时/谁担责/去哪解决', 'contract-review', '04-合同审查/'],
          ['逐条审查', '22 类专项、三色标注、缺失条款', 'contract-review', '04-合同审查/审查报告.md'],
          ['红线修订', '原合同只读 → track changes + 批注', 'contract-review', '04-合同审查/修订稿.docx'],
          ['合同起草', '16 类合同模板 + 条款规范', 'contract-drafting', '06-文书产出/'],
          ['委托合同套件', '委托合同/授权/风险告知/笔录', 'retainer-contract-management', '00-案件档案/'],
          ['定稿比对', '审核后定稿与修订历史对比', 'contract-review', '04-合同审查/比对表.md']
        ]
      },
      {
        id: 'compliance',
        title: '顾问与合规',
        titleEn: 'Counsel & compliance',
        stages: ['咨询', '产品上线', '营销文案', '监管监测', '制度更新'],
        functions: [
          ['咨询快答', '微信/口头咨询的口语化回复', 'legal-consultation-assistant', '07-沟通记录/'],
          ['产品上线审查', '功能合规、默认开启、客户 Logo、PRD', 'product-legal', '03-合规评估/'],
          ['广告文案审核', '绝对化用语、虚假宣传、行业专项', 'advertising-compliance-review', '03-合规评估/'],
          ['食品标签审核', 'GB 7718 / GB 28050 逐项', 'prepackaged-food-labeling-compliance', '03-合规评估/'],
          ['监管监测', '新规跟踪、客户缺口、整改清单', 'regulatory-compliance-monitoring', '03-合规评估/'],
          ['制度更新', '政策 diff + 修订建议稿', 'regulatory-compliance-monitoring', '06-文书产出/']
        ]
      },
      {
        id: 'research',
        title: '法律研究',
        titleEn: 'Legal research',
        stages: ['问题拆解', '法条检索', '类案检索', '核验', '可视化输出'],
        functions: [
          ['请求权分析', '六来源体系 + 6 步/9 步法', 'preliminary-legal-analysis', '03-法律研究/'],
          ['法条与类案检索', '三层检索法、地域优先、相似度', 'statute-and-case-search', '03-法律研究/'],
          ['法源核验', '条款项、现行有效、案号真伪', 'lawyer-source-verify', '03-法律研究/'],
          ['论证自检', '要件—事实—证据、找最强反驳', 'lawyer-legal-reasoning', '05-诉讼策略/'],
          ['知识库查询', '罪名/领域 Wiki 卡片', 'legal-wiki-query', '03-法律研究/']
        ]
      },
      {
        id: 'delivery',
        title: '交付与工具',
        titleEn: 'Delivery & tools',
        stages: ['转换', '出稿前审查', '模板导出', '图片交付', '归档'],
        functions: [
          ['材料 → 专业文档', '案件材料/沟通记录 → 方案/报告', 'case-materials-to-docx', '06-文书产出/'],
          ['出稿前审查', '事实/金额/引证/结构预检（PASS/需改）', 'legal-doc-pre-publish-review', '06-文书产出/'],
          ['模板导出 docx', '语义 HTML → docx；要素式起诉状母版克隆', 'legal-doc-template-export', '06-文书产出/'],
          ['格式转换', '法条/文章 → Markdown', 'law-to-markdown', '00-资料/'],
          ['去 AI 味', '去 AI 腔、句读节奏、个人风格', 'legal-article-deai-polish', '06-文书产出/']
        ]
      },
      {
        id: 'reference',
        title: '参考区',
        titleEn: 'Reference',
        stages: [],
        functions: [],
        reference: true
      }
    ]

    // 每张功能卡属于哪个阶段（顺序与 TRACKS[i].functions 对应）
    const TRACK_STAGE_MAP = {
      civil: [0, 1, 2, 2, 2, 3, 4, 4, 5, 5, 9],
      criminal: [0, 0, 1, 2, 3, 4, 6],
      labor: [0, 1, 1, 2, 4],
      bankruptcy: [0, 1, 2, 3, 4, 5, 6, 7],
      contract: [1, 2, 3, 5, 0, 4],
      compliance: [0, 1, 2, 2, 3, 4],
      research: [0, 1, 3, 3, 1],
      delivery: [0, 1, 2, 0, 0]
    }

    const CSS = [
      '.wb-root{height:100%;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;overflow:hidden}',
      '.wb-head{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);flex:0 0 auto}',
      '.wb-title{font-size:15px;font-weight:600}',
      '.wb-sub{color:var(--dsw-alias-label-secondary);font-size:11px}',
      '.wb-tabs{display:flex;gap:4px;margin-left:16px;flex-wrap:wrap}',
      '.wb-tab{border:1px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary);border-radius:7px;padding:5px 11px;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}',
      '.wb-tab:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.wb-tab.is-on{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 10%,transparent);color:var(--dsw-alias-brand-primary);border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 32%,transparent);font-weight:600}',
      '.wb-spacer{flex:1 1 auto}',
      '.wb-btn{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border-radius:6px;padding:5px 12px;font-size:12px;cursor:pointer}',
      '.wb-btn:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.wb-btn.is-primary{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);color:#fff}',
      '.wb-btn.is-primary:hover{filter:brightness(1.05)}',
      '.wb-body{flex:1 1 auto;min-height:0;padding:12px 14px;display:flex;gap:12px;overflow:hidden}',
      '.wb-col{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;min-height:0;display:flex;flex-direction:column;overflow:hidden}',
      '.wb-col-h{padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);display:flex;align-items:center;gap:8px;flex:0 0 auto}',
      '.wb-col-b{padding:10px 12px;overflow:auto;min-height:0;flex:1 1 auto}',
      '.wb-list{width:290px;flex:0 0 auto}',
      '.wb-main{flex:1 1 auto;min-width:0}',
      '.wb-side{width:310px;flex:0 0 auto}',
      '.wb-row{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:9px 10px;margin-bottom:8px;cursor:pointer;background:var(--dsw-alias-bg-layer-2)}',
      '.wb-row:hover{border-color:var(--dsw-alias-border-l2)}',
      '.wb-row.is-on{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-brand-primary) inset}',
      '.wb-row-t{font-weight:600;font-size:13px;display:flex;align-items:center;gap:6px;min-width:0}',
      '.wb-name{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.wb-row-t .wb-chip{max-width:58%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 0 auto}',
      '.wb-col-h .wb-chip{max-width:48%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.wb-row-s{color:var(--dsw-alias-label-secondary);font-size:11px;margin-top:3px}',
      '.wb-chip{display:inline-flex;align-items:center;gap:4px;border-radius:999px;padding:1px 8px;font-size:11px;border:1px solid transparent;white-space:nowrap}',
      '.wb-chip.is-red{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 12%,transparent)}',
      '.wb-chip.is-amber{color:var(--dsw-alias-state-warn-primary);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 14%,transparent)}',
      '.wb-chip.is-ok{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 12%,transparent)}',
      '.wb-chip.is-idle{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2)}',
      '.wb-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;margin-bottom:12px}',
      '.wb-k{color:var(--dsw-alias-label-secondary);font-size:10px}',
      '.wb-v{font-size:12px;font-weight:600;margin-top:2px;word-break:break-all}',
      '.wb-next{border:1px solid var(--dsw-alias-brand-primary);border-radius:10px;padding:12px;margin-bottom:14px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,transparent)}',
      '.wb-next-t{font-weight:600;font-size:13px;margin-bottom:4px}',
      '.wb-next-d{color:var(--dsw-alias-label-secondary);font-size:11px;margin-bottom:10px;line-height:1.5}',
      '.wb-next-a{display:flex;gap:8px;flex-wrap:wrap}',
      '.wb-sec{font-size:12px;font-weight:600;margin:0 0 8px}',
      '.wb-check{display:flex;align-items:flex-start;gap:8px;padding:5px 0;font-size:12px;cursor:pointer;line-height:1.45}',
      '.wb-check:hover{color:var(--dsw-alias-brand-primary)}',
      '.wb-box{width:14px;height:14px;border:1.5px solid var(--dsw-alias-border-l2);border-radius:4px;flex:0 0 auto;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff}',
      '.wb-box.is-done{background:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary)}',
      '.wb-check.is-done{color:var(--dsw-alias-label-secondary);text-decoration:line-through}',
      '.wb-stage{display:flex;align-items:center;gap:9px;padding:5px 0;font-size:12px}',
      '.wb-dot{width:14px;height:14px;border-radius:50%;flex:0 0 auto;border:1.5px solid var(--dsw-alias-border-l2);display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff}',
      '.wb-dot.is-done{background:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary)}',
      '.wb-dot.is-now{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-brand-primary) 18%,transparent)}',
      '.wb-bar{height:6px;border-radius:4px;background:var(--dsw-alias-bg-layer-2);overflow:hidden;margin:6px 0}',
      '.wb-bar>div{height:100%;background:var(--dsw-alias-brand-primary)}',
      '.wb-side-item{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 10px;margin-bottom:8px;background:var(--dsw-alias-bg-layer-2)}',
      '.wb-side-item .row1{display:flex;align-items:center;gap:6px;justify-content:space-between}',
      '.wb-dim{color:var(--dsw-alias-label-secondary);font-size:11px}',
      '.wb-empty{padding:22px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.7}',
      '.wb-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}',
      '.wb-card{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:11px 12px;background:var(--dsw-alias-bg-layer-2);display:flex;flex-direction:column;gap:6px}',
      '.wb-card-t{font-size:13px;font-weight:600}',
      '.wb-card-d{font-size:11px;color:var(--dsw-alias-label-secondary);line-height:1.5;min-height:32px}',
      '.wb-card-f{font-size:10px;color:var(--dsw-alias-label-secondary);word-break:break-all}',
      '.wb-card-a{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px}',
      '.wb-pipe{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}',
      '.wb-pipe button{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border-radius:7px;padding:6px 10px;font-size:12px;cursor:pointer}',
      '.wb-pipe button.is-on{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 9%,transparent)}',
      '.wb-trk{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}',
      '.wb-trk button{flex:0 0 auto}',
      '.wb-4col{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;height:100%;min-height:0}',
      '.wb-file{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:7px 9px;margin-bottom:7px;background:var(--dsw-alias-bg-layer-2)}',
      '.wb-file .n{font-size:12px;word-break:break-all;line-height:1.4}',
      '.wb-err{color:var(--dsw-alias-state-error-primary);font-size:12px;padding:12px}',
      '.wb-legend{display:flex;gap:14px;flex-wrap:wrap;font-size:11px;color:var(--dsw-alias-label-secondary)}',
      '.wb-funnel{display:flex;gap:6px;align-items:stretch;margin-bottom:2px;flex-wrap:wrap}',
      '.wb-funnel-step{flex:1 1 0;min-width:92px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;padding:9px 10px;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:1px}',
      '.wb-funnel-step:hover{border-color:var(--dsw-alias-border-l2)}',
      '.wb-funnel-step.is-on{border-color:var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 8%,transparent)}',
      '.wb-funnel-n{font-size:20px;font-weight:600;line-height:1.15}',
      '.wb-funnel-l{font-size:11px;color:var(--dsw-alias-label-secondary)}',
      '.wb-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 8px;align-items:center}',
      '.wb-sel{padding:4px 8px;font-size:12px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.wb-alert{font-size:11px;color:var(--dsw-alias-state-warn-primary);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 9%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-warn-primary) 28%,transparent);padding:7px 10px;border-radius:8px;margin-bottom:10px;line-height:1.6}',
      '.wb-upload{border:1px dashed var(--dsw-alias-border-l2);border-radius:10px;padding:10px 12px;margin:8px 0 4px;background:var(--dsw-alias-bg-layer-2)}',
      '.wb-upload-head{font-size:12px;font-weight:600}',
      '.wb-upload-hint{font-size:11px;color:var(--dsw-alias-label-secondary);line-height:1.6;margin:3px 0 8px}',
      '.wb-drop{border:1px dashed var(--dsw-alias-border-l2);border-radius:8px;padding:12px;text-align:center;font-size:11px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1)}',
      '.wb-textarea{width:100%;box-sizing:border-box;min-height:64px;margin:8px 0 0;padding:7px 9px;font-size:12px;font-family:inherit;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);resize:vertical}',
      '.wb-upload-actions{display:flex;align-items:center;gap:10px;margin-top:7px;flex-wrap:wrap}',
      '.wb-materials{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:9px;font-size:11px}',
      '.wb-material{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;padding:2px 8px;background:var(--dsw-alias-bg-layer-1);font-size:11px}',
      '.wb-material.is-done{border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 45%,transparent);color:var(--dsw-alias-state-success-primary)}',
      '.wb-mini{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-brand-primary);border-radius:999px;padding:1px 7px;font-size:10px;cursor:pointer}',
      '.wb-quote{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:10px 12px;margin:8px 0 4px;background:var(--dsw-alias-bg-layer-2)}',
      '.wb-quote-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}',
      '.wb-input{flex:1 1 auto;padding:5px 8px;font-size:12px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}',
      '.wb-steps{display:flex;gap:14px;align-items:center;flex-wrap:wrap}',
      '.wb-step{font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.wb-step.is-on{color:var(--dsw-alias-brand-primary);font-weight:600}',
      '.wb-slot{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:10px 12px;margin-bottom:10px;background:var(--dsw-alias-bg-layer-2)}',
      '.wb-slot-h{display:flex;align-items:center;gap:8px}',
      '.wb-plan{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;overflow:hidden}',
      '.wb-plan-row{display:flex;gap:10px;align-items:center;padding:7px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);font-size:12px}',
      '.wb-plan-row:last-child{border-bottom:none}',
      '.wb-plan-file{flex:1 1 auto;word-break:break-all}',
      '.wb-plan-to{flex:0 0 auto;color:var(--dsw-alias-brand-primary);font-size:11px}',
      '.wb-plan-sel{max-width:340px;font-size:11px;padding:3px 6px}',
      '.wb-overlay{position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:2147483000;display:flex;align-items:flex-start;justify-content:center;padding-top:12vh}',
      '.wb-palette{width:min(680px,92vw);max-height:70vh;background:var(--dsw-alias-bg-overlay,#fff);border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.28);overflow:hidden;display:flex;flex-direction:column}',
      '.wb-palette-input{width:100%;box-sizing:border-box;padding:12px 14px;font-size:14px;border:none;border-bottom:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-primary);outline:none}',
      '.wb-palette-list{overflow:auto;min-height:60px}',
      '.wb-palette-item{display:flex;gap:10px;align-items:center;padding:8px 14px;cursor:pointer;font-size:12px}',
      '.wb-palette-item.is-on{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 9%,transparent)}',
      '.wb-palette-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.wb-safety{border:1px solid color-mix(in srgb,var(--dsw-alias-state-success-primary) 35%,transparent);border-radius:10px;padding:10px 12px;margin:8px 0 4px;background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 5%,transparent)}',
      '.wb-safety-h{font-size:12px;font-weight:600;margin-bottom:7px}',
      '.wb-safety-list{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}',
      '.wb-safety-text{font-size:11.5px;line-height:1.7;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-radius:8px;padding:8px 10px}',
      '@media (max-width:1180px){.wb-body{flex-wrap:wrap;overflow:auto}.wb-list{width:100%;flex:1 1 100%}.wb-main{flex:1 1 100%}.wb-side{display:flex;width:100%;flex:1 1 100%;max-height:60vh}}',
      '@media (max-width:960px){.wb-list{width:220px}.wb-4col{grid-template-columns:repeat(2,minmax(0,1fr))}}'
    ].join('\n')

    const { useState, useEffect, useCallback, useMemo, useRef } = React

    // --- report rendering -------------------------------------------------
    // One markdown renderer serves both the in-panel preview and the exported
    // standalone HTML, so what the lawyer reads is what the file contains.
    const REPORT_CSS = [
      '.wb-doc{max-width:880px;margin:0 auto;padding:26px 34px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#1f2328);font-size:14px;line-height:1.85;border-radius:10px;box-shadow:0 1px 3px rgba(15,23,42,.06)}',
      '.wb-doc h1{font-size:23px;line-height:1.35;margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid var(--dsw-alias-brand-primary,#2f6bff)}',
      '.wb-doc h2{font-size:17px;margin:26px 0 10px;padding-left:10px;border-left:4px solid var(--dsw-alias-brand-primary,#2f6bff)}',
      '.wb-doc h3{font-size:15px;margin:18px 0 8px}',
      '.wb-doc h4{font-size:14px;margin:14px 0 6px}',
      '.wb-doc p{margin:8px 0}',
      '.wb-doc blockquote{margin:10px 0;padding:9px 14px;border-left:3px solid #c9d9ff;background:#f4f7ff;border-radius:0 6px 6px 0;color:#475569;font-size:12.5px;line-height:1.7}',
      '.wb-doc table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12.5px}',
      '.wb-doc th,.wb-doc td{border:1px solid #e3e6ec;padding:7px 10px;text-align:left;vertical-align:top}',
      '.wb-doc th{background:#f2f4f8;font-weight:600}',
      '.wb-doc tbody tr:nth-child(even) td{background:#fafbfd}',
      '.wb-doc ul,.wb-doc ol{padding-left:22px;margin:8px 0}',
      '.wb-doc li{margin:4px 0}',
      '.wb-doc hr{border:none;border-top:1px dashed #d9dee8;margin:22px 0}',
      '.wb-doc code{background:#f2f4f8;padding:1px 5px;border-radius:4px;font-size:12px}',
      '.wb-doc a{color:#2f6bff}',
      '.wb-doc strong{font-weight:600}',
      '.wb-doc pre{background:#f7f8fa;padding:12px;border-radius:8px;overflow:auto;font-size:12px}'
    ].join('\n')

    const EXPORT_SHELL_CSS = [
      'html,body{margin:0;padding:0}',
      'body{background:#f2f3f5;padding:24px 12px;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.wb-export-bar{max-width:880px;margin:0 auto 12px;font:12px/1.6 -apple-system,"Segoe UI","Microsoft YaHei",sans-serif;color:#6b7280;display:flex;justify-content:space-between}',
      '.wb-doc{box-shadow:0 2px 10px rgba(15,23,42,.08)}',
      '@media print{body{background:#fff;padding:0}.wb-export-bar{display:none}.wb-doc{box-shadow:none;border-radius:0;max-width:100%;padding:0}.wb-doc h2{break-after:avoid}.wb-doc table,.wb-doc tr{break-inside:avoid}@page{size:A4;margin:16mm}}',
      '@media (max-width:720px){.wb-doc{padding:18px 16px}}'
    ].join('\n')

    function escapeHtml(text) {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    }

    function splitRow(line) {
      return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
    }

    function inlineMd(text) {
      return escapeHtml(text)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    }

    function mdToHtml(markdown) {
      const lines = String(markdown).replace(/\r/g, '').split('\n')
      const out = []
      let inUl = false
      let inOl = false
      let i = 0
      const closeLists = () => {
        if (inUl) { out.push('</ul>'); inUl = false }
        if (inOl) { out.push('</ol>'); inOl = false }
      }
      while (i < lines.length) {
        const line = lines[i]
        if (/^```/.test(line)) {
          closeLists()
          i += 1
          const buffer = []
          while (i < lines.length && !/^```/.test(lines[i])) { buffer.push(escapeHtml(lines[i])); i += 1 }
          i += 1
          out.push('<pre><code>' + buffer.join('\n') + '</code></pre>')
          continue
        }
        const heading = /^(#{1,6})\s+(.*)$/.exec(line)
        if (heading) {
          closeLists()
          const level = heading[1].length
          out.push('<h' + level + '>' + inlineMd(heading[2]) + '</h' + level + '>')
          i += 1
          continue
        }
        if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
          closeLists()
          out.push('<hr/>')
          i += 1
          continue
        }
        if (/^>\s?/.test(line)) {
          closeLists()
          const buffer = []
          while (i < lines.length && /^>\s?/.test(lines[i])) { buffer.push(inlineMd(lines[i].replace(/^>\s?/, ''))); i += 1 }
          out.push('<blockquote>' + buffer.join('<br/>') + '</blockquote>')
          continue
        }
        if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
          closeLists()
          const header = splitRow(line)
          i += 2
          const rows = []
          while (i < lines.length && /^\|/.test(lines[i])) { rows.push(splitRow(lines[i])); i += 1 }
          out.push(
            '<table><thead><tr>' + header.map((cell) => '<th>' + inlineMd(cell) + '</th>').join('') + '</tr></thead><tbody>' +
            rows.map((row) => '<tr>' + row.map((cell) => '<td>' + inlineMd(cell) + '</td>').join('') + '</tr>').join('') +
            '</tbody></table>'
          )
          continue
        }
        const unordered = /^[-*]\s+(.*)$/.exec(line)
        if (unordered) {
          if (!inUl) { closeLists(); out.push('<ul>'); inUl = true }
          const item = unordered[1]
          const box = /^\[( |x|X)\]\s*(.*)$/.exec(item)
          out.push('<li>' + (box ? (box[1] === ' ' ? '☐ ' : '☑ ') + inlineMd(box[2]) : inlineMd(item)) + '</li>')
          i += 1
          continue
        }
        const ordered = /^\d+\.\s+(.*)$/.exec(line)
        if (ordered) {
          if (!inOl) { closeLists(); out.push('<ol>'); inOl = true }
          out.push('<li>' + inlineMd(ordered[1]) + '</li>')
          i += 1
          continue
        }
        if (!line.trim()) { closeLists(); i += 1; continue }
        closeLists()
        const buffer = [line]
        i += 1
        while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|>|\||[-*]\s|\d+\.\s)/.test(lines[i])) { buffer.push(lines[i]); i += 1 }
        out.push('<p>' + inlineMd(buffer.join(' ')) + '</p>')
      }
      closeLists()
      return out.join('\n')
    }

    function fmtDate(ms) {
      if (!ms) return ''
      const d = new Date(ms)
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    }

    function IconIntake(props) {
      const size = (props && props.size) || 18
      const active = !!(props && props.active)
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: active ? 1.9 : 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block', opacity: active ? 1 : 0.82 } },
        h('path', { d: 'M3.5 7.5a2 2 0 0 1 2-2h4l1.8 2h7.2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z' }),
        h('path', { d: 'M12 10.5v5' }),
        h('path', { d: 'M9.5 13h5' }))
    }

    function IconCases(props) {
      const size = (props && props.size) || 18
      const active = !!(props && props.active)
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: active ? 1.9 : 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block', opacity: active ? 1 : 0.82 } },
        h('path', { d: 'M3.5 7.5a2 2 0 0 1 2-2h4l1.8 2h7.2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z' }),
        h('path', { d: 'M7.5 12.5h9' }))
    }

    function IconTracks(props) {
      const size = (props && props.size) || 18
      const active = !!(props && props.active)
      const sw = active ? 1.9 : 1.6
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block', opacity: active ? 1 : 0.82 } },
        h('rect', { x: 4, y: 4, width: 6.5, height: 6.5, rx: 1.4 }),
        h('rect', { x: 13.5, y: 4, width: 6.5, height: 6.5, rx: 1.4 }),
        h('rect', { x: 4, y: 13.5, width: 6.5, height: 6.5, rx: 1.4 }),
        h('rect', { x: 13.5, y: 13.5, width: 6.5, height: 6.5, rx: 1.4 }))
    }

    function IconDeliver(props) {
      const size = (props && props.size) || 18
      const active = !!(props && props.active)
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: active ? 1.9 : 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block', opacity: active ? 1 : 0.82 } },
        h('path', { d: 'M6 3.5h7.5l4.5 4.5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-15.5a1 1 0 0 1 1-1z' }),
        h('path', { d: 'M13.5 3.5V8H18' }),
        h('path', { d: 'M8.5 14.5l2 2 3.5-4' }))
    }

    function IconDeadlines(props) {
      const size = (props && props.size) || 18
      const active = !!(props && props.active)
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: active ? 1.9 : 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block', opacity: active ? 1 : 0.82 } },
        h('circle', { cx: 12, cy: 12.5, r: 8 }),
        h('path', { d: 'M12 8v4.6l3 1.8' }),
        h('path', { d: 'M9.2 2.8h5.6' }))
    }

    function IconSettings(props) {
      const size = (props && props.size) || 18
      const active = !!(props && props.active)
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: active ? 1.9 : 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block', opacity: active ? 1 : 0.82 } },
        h('circle', { cx: 12, cy: 12, r: 3 }),
        h('path', { d: 'M19.2 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z' }))
    }

    function IconClients(props) {
      const size = (props && props.size) || 18
      const active = !!(props && props.active)
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: active ? 1.9 : 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block', opacity: active ? 1 : 0.82 } },
        h('circle', { cx: 9, cy: 8, r: 3.2 }),
        h('path', { d: 'M3.5 19.5c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2' }),
        h('path', { d: 'M16 5.4a3 3 0 0 1 0 5.6' }),
        h('path', { d: 'M17.6 14.6c1.8.6 3 2.2 3 4.4' }))
    }

    const ICONS = {
      'lawyer-cases': IconCases,
      'lawyer-tracks': IconTracks,
      'lawyer-deliver': IconDeliver,
      'lawyer-deadlines': IconDeadlines,
      'lawyer-settings': IconSettings
    }

    const NAV_KEYS = {
      'lawyer-cases': 'navCases',
      'lawyer-tracks': 'navTracks',
      'lawyer-deliver': 'navDeliver',
      'lawyer-deadlines': 'navDeadlines',
      'lawyer-settings': 'navSettings'
    }

    function Chip(props) {
      return h('span', { className: 'wb-chip is-' + (props.tone || 'idle') }, props.text)
    }

    function riskTone(item) {
      if (!item) return 'idle'
      if (item.risk === 'red') return 'red'
      if (item.risk === 'amber') return 'amber'
      return 'ok'
    }

    function dueText(days, t) {
      if (days === null || days === undefined) return '—'
      if (days < 0) return Math.abs(days) + 'd'
      if (days === 0) return '0d'
      return days + 'd'
    }

    function CaseRow(props) {
      const { item, t, selected, onSelect } = props
      const min = item.dueSoon
      return h('div', { className: 'wb-row' + (selected ? ' is-on' : ''), onClick: () => onSelect(item.id), role: 'button', tabIndex: 0 },
        h('div', { className: 'wb-row-t' },
          h('span', { className: 'wb-name', title: item.name }, item.name),
          item.demo ? h(Chip, { tone: 'idle', text: t('demo') }) : null,
          h('span', { className: 'wb-spacer' }),
          h('span', { title: item.stageLabel || '' }, h(Chip, { tone: riskTone(item), text: item.stageShort || item.stageLabel || '-' }))),
        h('div', { className: 'wb-row-s' }, (item.caseNo || '') + ' · ' + (item.lawyer || '') + ' · ' + (item.cause || '')),
        h('div', { className: 'wb-row-s' }, (t('doneOf') + ' ' + item.delivery.done + '/' + item.delivery.total),
          h('span', { style: { marginLeft: '8px' } }, min === null ? '' : (min <= 3 ? '· ' + min + 'd' : '· ' + min + 'd'))))
    }

    function useData(t) {
      const [state, setState] = useState({ loading: true, data: null, error: '' })
      const load = useCallback(() => {
        setState((prev) => ({ loading: !prev.data, data: prev.data, error: '' }))
        fetch(API, { headers: { accept: 'application/json' } })
          .then((res) => res.json())
          .then((json) => {
            if (!json || json.ok !== true) throw new Error((json && json.error) || 'bad payload')
            setState({ loading: false, data: json, error: '' })
          })
          .catch((err) => setState((prev) => ({ loading: false, data: prev.data, error: String(err.message || err) })))
      }, [])
      useEffect(() => { load() }, [load])
      return { state, load }
    }

    function Head(props) {
      const { t, data, loading, onRefresh, mode } = props
      const titles = { cases: 'navCases', tracks: 'navTracks', deliver: 'navDeliver', deadlines: 'navDeadlines', settings: 'navSettings' }
      return h('div', { className: 'wb-head' },
        h('div', { className: 'wb-title' }, t(titles[mode])),
        h('div', { className: 'wb-sub' }, t('root') + '：' + ((data && data.root) || '—')),
        h('div', { className: 'wb-spacer' }),
        loading ? h('span', { className: 'wb-dim' }, t('loading')) : null,
        h('button', { className: 'wb-btn', onClick: onRefresh }, t('refresh')))
    }

    function StageRail(props) {
      const { item, t } = props
      return h('div', {},
        h('div', { className: 'wb-sec' }, t('lifecycle'),
          h('span', { className: 'wb-dim', style: { marginLeft: '8px' } }, (item.stageIndex + 1) + '/10 · ' + t('stages'))),
        item.stages.map((s, i) => {
          const done = s.items.length > 0 && s.checked === s.items.length
          const now = i === item.stageIndex
          return h('div', { className: 'wb-stage', key: i },
            h('div', { className: 'wb-dot' + (done ? ' is-done' : '') + (now && !done ? ' is-now' : '') }, done ? '✓' : ''),
            h('span', { style: { fontWeight: now ? 600 : 400, color: now ? 'var(--dsw-alias-brand-primary)' : 'inherit', flex: '1 1 auto' } }, s.name),
            h('span', { className: 'wb-dim' }, s.checked + '/' + s.total))
        }))
    }

    function Checklist(props) {
      const { item, t, onToggle } = props
      const stage = item.stages[item.stageIndex]
      if (!stage) return null
      return h('div', { style: { marginBottom: '14px' } },
        h('div', { className: 'wb-sec' }, t('checklist') + ' · ' + stage.name),
        stage.items.map((it, idx) => h('div', {
          key: idx,
          className: 'wb-check' + (it.done ? ' is-done' : ''),
          role: 'button',
          tabIndex: 0,
          onClick: () => onToggle(item.stageIndex, it.text)
        },
          h('div', { className: 'wb-box' + (it.done ? ' is-done' : '') }, it.done ? '✓' : ''),
          h('span', { style: { flex: '1 1 auto' } }, it.text))))
    }

    function NextCard(props) {
      const { item, t, onRun, onCycle } = props
      const action = item.actions[item.actionIndex || 0]
      if (!action) return null
      return h('div', { className: 'wb-next' },
        h('div', { className: 'wb-next-t' }, t('next') + '：' + action.title),
        h('div', { className: 'wb-next-d' }, action.why + '｜产出 → ' + action.target + '｜' + item.nextActionLabel),
        h('div', { className: 'wb-next-a' },
          h('button', { className: 'wb-btn is-primary', onClick: () => onRun(action) }, t('run')),
          h('button', { className: 'wb-btn', onClick: onCycle }, t('nextOne')),
          h('span', { className: 'wb-dim', style: { alignSelf: 'center' } }, action.skill)))
    }

    function CasesPane(props) {
      const { t, data, loading, error, reload, uiWorkspace, onOpenReport, focusId } = props
      const [showAllOutputs, setShowAllOutputs] = useState(false)
      const [batchBusy, setBatchBusy] = useState(false)
      const [batchNotice, setBatchNotice] = useState('')
      const cases = (data && data.cases) || []
      const [sel, setSel] = useState('')
      const [q, setQ] = useState('')
      const [actionIndex, setActionIndex] = useState(0)
      useEffect(() => {
        if (focusId) setSel(focusId)
      }, [focusId])
      const [busy, setBusy] = useState('')
      const [notice, setNotice] = useState('')

      const selected = useMemo(() => {
        if (!cases.length) return null
        const found = cases.find((c) => c.id === sel)
        return found || cases[0]
      }, [cases, sel])

      const filtered = useMemo(() => {
        const key = q.trim()
        if (!key) return cases
        return cases.filter((c) => (c.name + ' ' + c.client + ' ' + c.opponent + ' ' + c.cause + ' ' + c.caseNo).indexOf(key) >= 0)
      }, [cases, q])

      const run = useCallback((action) => {
        if (!selected) return
        setBusy(action.id)
        setNotice('')
        fetch('/lawyer-workbench/api/open', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ caseId: selected.id, actionId: action.id })
        })
          .then((res) => res.json())
          .then((json) => {
            if (!json || !json.ok || !json.sessionId) throw new Error((json && json.error) || 'failed')
            if (uiWorkspace && typeof uiWorkspace.openSession === 'function') uiWorkspace.openSession(json.sessionId)
          })
          .catch((err) => setNotice(t('openFailed') + '：' + String(err.message || err)))
          .finally(() => setBusy(''))
      }, [selected, t, uiWorkspace])

      const toggle = useCallback((stageIndex, text) => {
        if (!selected) return
        const done = window.confirm(t('toggleConfirm') + '：' + text)
        if (!done) return
        fetch('/lawyer-workbench/api/check', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ caseId: selected.id, stageIndex, item: text })
        })
          .then((res) => res.json())
          .then((json) => { if (json && json.ok) reload() })
          .catch(() => {})
      }, [selected, t, reload])

      if (loading && !data) return h('div', { className: 'wb-empty' }, t('loading'))
      if (error && !data) return h('div', {}, h('div', { className: 'wb-err' }, t('failed') + '：' + error), h('div', { style: { padding: '0 14px' } }, h('button', { className: 'wb-btn', onClick: reload }, t('retry'))))
      if (!cases.length) return h('div', { className: 'wb-empty' }, t('empty'))

      const item = selected
      const action = item ? item.actions[actionIndex % (item.actions.length || 1)] : null
      const itemWithAction = item ? Object.assign({}, item, { actionIndex: actionIndex % (item.actions.length || 1) }) : null

      return h('div', { className: 'wb-body' },
        h('div', { className: 'wb-col wb-list' },
          h('div', { className: 'wb-col-h' }, h('span', { className: 'wb-sec', style: { margin: 0 } }, t('caselist') + ' · ' + cases.length),
            h('span', { className: 'wb-dim' }, filtered.length + '/' + cases.length)),
          h('div', { style: { padding: '8px 12px', flex: '0 0 auto' } },
            h('input', {
              value: q,
              placeholder: t('search'),
              onChange: (e) => setQ(e.target.value),
              style: { width: '100%', boxSizing: 'border-box', padding: '6px 9px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--dsw-alias-border-l1)', background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)' }
            })),
          h('div', { className: 'wb-col-b' },
            filtered.length
              ? filtered.map((c) => h(CaseRow, { key: c.id, item: c, t, selected: item && c.id === item.id, onSelect: (id) => { setSel(id); setActionIndex(0) } }))
              : h('div', { className: 'wb-empty' }, t('noMatch')))),
        h('div', { className: 'wb-col wb-main' },
          h('div', { className: 'wb-col-h' },
            h('span', { style: { fontWeight: 600, fontSize: '14px' } }, item.name),
            h('span', { title: item.stageLabel || '' }, h(Chip, { tone: riskTone(item), text: item.stageShort || item.stageLabel || '-' })),
            item.demo ? h(Chip, { tone: 'idle', text: t('demo') }) : null,
            h('div', { className: 'wb-spacer' }),
            batchNotice ? h('span', { className: 'wb-dim' }, batchNotice) : null,
            h('button', {
              className: 'wb-btn',
              disabled: batchBusy,
              onClick: () => {
                setBatchBusy(true)
                setBatchNotice('')
                fetch('/lawyer-workbench/api/export-batch', {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ caseId: item.id })
                })
                  .then((r) => r.json())
                  .then((j) => {
                    if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
                    setBatchNotice(t('batchDone').replace('{n}', String((j.done || []).length)))
                    if (typeof reload === 'function') reload()
                  })
                  .catch((e) => setBatchNotice(String(e.message || e)))
                  .finally(() => setBatchBusy(false))
              }
            }, batchBusy ? t('batchBusy') : t('batchExport')),
            item.redCount ? h(Chip, { tone: 'red', text: item.redCount + ' ' + t('redline') }) : null),
          h('div', { className: 'wb-col-b' },
            h('div', { className: 'wb-sec' }, t('overview')),
            h('div', { className: 'wb-grid' },
              [['caseNo', item.caseNo], ['client', item.client], ['opponent', item.opponent], ['cause', item.cause], ['amount', item.amount], ['court', item.court], ['lawyer', item.lawyer], ['fee', item.fee + ' ' + item.feeMode], ['due', item.dueLabel]].map((pair, i) =>
                h('div', { key: i }, h('div', { className: 'wb-k' }, pair[0] === 'caseNo' ? '编号' : t(pair[0])), h('div', { className: 'wb-v' }, pair[1] || '—')))),
            item.deadlineAudit && item.deadlineAudit.low
              ? h('div', { className: 'wb-alert' }, t('deadlineLow') + '：' + item.deadlineAudit.filled + '/' + item.deadlineAudit.expected + ' 项有截止日，先补时效起算点与拟立案日')
              : null,
            item.deliveryAudit && item.deliveryAudit.unverifiedExports > 0
              ? h('div', { className: 'wb-alert' }, item.deliveryAudit.unverifiedExports + ' ' + t('unverifiedExports'))
              : null,
            h(NextCard, { item: itemWithAction, t, onRun: run, onCycle: () => setActionIndex((n) => n + 1) }),
            notice ? h('div', { className: 'wb-err', style: { marginBottom: '10px' } }, notice) : null,
            h(Checklist, { item, t, onToggle: toggle }),
            h('div', { className: 'wb-sec' }, t('ledger')),
            h('div', { className: 'wb-legend', style: { marginBottom: '8px' } },
              h('span', null, 'TF ' + item.ledger.tf + (item.ledger.broken ? '（' + item.ledger.broken + ' ' + t('ledgerBroken') + '）' : '')),
              h('span', null, 'E ' + item.ledger.ev),
              h('span', null, 'IS ' + item.ledger.issue)),
            h('div', { className: 'wb-dim' }, item.timeline.lastDate ? (t('lastUpdate') + '：' + item.timeline.lastDate + ' · ' + item.timeline.entries + ' 条记录') : '—'))),
        h('div', { className: 'wb-col wb-side' },
          h('div', { className: 'wb-col-h' }, h('span', { className: 'wb-sec', style: { margin: 0 } }, t('deadlines')),
            h('div', { className: 'wb-spacer' }),
            item.redCount ? h(Chip, { tone: 'red', text: item.redCount + ' ' + t('redline') }) : null),
          h('div', { className: 'wb-col-b' },
            item.deadlines.filter((d) => d.daysLeft !== null).slice(0, 5).map((d, i) =>
              h('div', { className: 'wb-side-item', key: i },
                h('div', { className: 'row1' },
                  h('span', { style: { fontSize: '12px', fontWeight: 600 } }, d.name),
                  h(Chip, { tone: d.daysLeft <= 3 ? 'red' : d.daysLeft <= 7 ? 'amber' : 'idle', text: dueText(d.daysLeft, t) })),
                h('div', { className: 'wb-dim' }, d.due + ' · ' + d.basis))),
            h('div', { className: 'wb-sec', style: { marginTop: '14px' } }, t('delivery') + ' · ' + item.delivery.done + '/' + item.delivery.total),
            h('div', { className: 'wb-bar' }, h('div', { style: { width: Math.round((item.delivery.done / Math.max(1, item.delivery.total)) * 100) + '%' } })),
            h('div', { className: 'wb-legend' },
              item.delivery.redlines.map((r, i) => h('span', { key: i, style: { color: r.ok ? 'var(--dsw-alias-state-success-primary)' : 'var(--dsw-alias-state-error-primary)' } }, (r.ok ? '✓ ' : '× ') + String(r.name).replace(/\*\*/g, '')))),
            h('div', { className: 'wb-sec', style: { marginTop: '16px' } }, t('outputs')),
            h('div', { className: 'wb-dim', style: { fontSize: '10px', marginBottom: '6px' } }, t('outputsHint')),
            item.outputs.length
              ? item.outputs.slice(0, showAllOutputs ? 999 : 8).map((f, i) => {
                const canOpen = /\.(md|txt)$/i.test(f.name)
                return h('div', {
                  className: 'wb-file',
                  key: i,
                  role: canOpen ? 'button' : undefined,
                  tabIndex: canOpen ? 0 : undefined,
                  style: canOpen ? { cursor: 'pointer' } : undefined,
                  onClick: canOpen && typeof onOpenReport === 'function' ? () => onOpenReport({ rel: f.rel, name: f.name }) : undefined
                },
                  h('div', { className: 'n' }, f.name),
                  h('div', { className: 'wb-dim' }, f.section + ' · ' + (f.status === 'exported' ? t('exported') : f.status === 'exported_unreviewed' ? t('unverified') : t('draft')) + (canOpen ? ' · ' + t('clickOpen') : ' · ' + t('openLocally'))))
              })
              : h('div', { className: 'wb-dim' }, t('noOutputs')),
            item.outputs.length > 8
              ? h('button', { className: 'wb-btn', style: { marginTop: '6px' }, onClick: () => setShowAllOutputs((v) => !v) },
                showAllOutputs ? t('collapse') : t('showAll') + '（' + item.outputs.length + '）')
              : null)))
    }

    function TracksPane(props) {
      const { t, data, uiWorkspace } = props
      const cases = (data && data.cases) || []
      const [trackId, setTrackId] = useState(TRACKS[0].id)
      const [stageIdx, setStageIdx] = useState(-1)
      const [caseId, setCaseId] = useState('')
      const [notice, setNotice] = useState('')
      const track = TRACKS.find((x) => x.id === trackId) || TRACKS[0]
      const selCase = cases.find((c) => c.id === caseId) || null
      const refCount = (data && data.skills && data.skills.referenceCount) || 0
      const refGroups = (data && data.skills && data.skills.referenceGroups) || []

      const run = useCallback((fn) => {
        if (!selCase) { setNotice(t('noCase')); return }
        setNotice('')
        fetch('/lawyer-workbench/api/open', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            caseId: selCase.id,
            action: { title: fn[0], why: fn[1], skill: fn[2], target: fn[3] }
          })
        })
          .then((res) => res.json())
          .then((json) => {
            if (!json || !json.ok || !json.sessionId) throw new Error((json && json.error) || 'failed')
            if (uiWorkspace && typeof uiWorkspace.openSession === 'function') uiWorkspace.openSession(json.sessionId)
          })
          .catch((err) => setNotice(t('openFailed') + '：' + String(err.message || err)))
      }, [selCase, t, uiWorkspace])

      const trackRows = TRACKS.map((tr) => h('div', {
        key: tr.id,
        className: 'wb-row' + (tr.id === trackId ? ' is-on' : ''),
        role: 'button',
        tabIndex: 0,
        onClick: () => { setTrackId(tr.id); setStageIdx(0) }
      },
        h('div', { className: 'wb-row-t' }, tr.title),
        h('div', { className: 'wb-row-s' }, tr.reference
          ? (refCount + ' 个技能 · 折叠')
          : (tr.functions.length + ' 个功能 · ' + tr.stages.length + ' 阶段'))))

      const leftCol = h('div', { className: 'wb-col wb-list' },
        h('div', { className: 'wb-col-h' }, h('span', { className: 'wb-sec', style: { margin: 0 } }, t('tracks') + ' · ' + TRACKS.length)),
        h('div', { className: 'wb-col-b' }, trackRows))

      const pipe = h('div', { className: 'wb-pipe' },
        h('button', { key: '__all', className: stageIdx === -1 ? 'is-on' : '', onClick: () => setStageIdx(-1) }, t('allStages')),
        track.stages.map((s, i) => h('button', {
          key: i,
          className: i === stageIdx ? 'is-on' : '',
          onClick: () => setStageIdx(i)
        }, s)))

      const stageMap = TRACK_STAGE_MAP[track.id] || []
      const cards = track.functions
        .map((fn, i) => ({ fn, stage: typeof stageMap[i] === 'number' ? stageMap[i] : 0 }))
        .filter((row) => stageIdx < 0 || row.stage === stageIdx)
        .map((row, i) => h('div', { className: 'wb-card', key: i },
          h('div', { className: 'wb-card-t' }, row.fn[0]),
          h('div', { className: 'wb-card-d' }, row.fn[1]),
          h('div', { className: 'wb-card-f' }, t('outputsTo') + ' ' + row.fn[3]),
          h('div', { className: 'wb-card-a' },
            h('span', { className: 'wb-chip is-idle' }, row.fn[2]),
            h('span', { className: 'wb-dim', style: { fontSize: '10px' } }, track.stages[row.stage] || ''),
            h('button', { className: 'wb-btn is-primary', onClick: () => run(row.fn) }, t('run')))))

      const mainCol = h('div', { className: 'wb-col wb-main' },
        h('div', { className: 'wb-col-h' },
          h('span', { style: { fontWeight: 600, fontSize: '14px' } }, track.title),
          h('span', { className: 'wb-dim' }, track.reference ? '' : t('trackHint')),
          h('div', { className: 'wb-spacer' }),
          track.reference
            ? null
            : h('select', {
                value: selCase ? selCase.id : '',
                title: t('usingCase'),
                onChange: (e) => setCaseId(e.target.value),
                style: { maxWidth: '280px', padding: '4px 8px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--dsw-alias-border-l1)', background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)' }
              }, [h('option', { key: '__pick', value: '' }, t('pickCase'))].concat(cases.map((c) => h('option', { key: c.id, value: c.id }, c.name))))),
        h('div', { className: 'wb-col-b' },
          track.reference
            ? h('div', {},
                h('div', { className: 'wb-dim', style: { marginBottom: '12px', lineHeight: '1.8' } }, t('refNote')),
                h('div', { className: 'wb-cards' }, refGroups.map((g, i) => h('div', { className: 'wb-card', key: i },
                  h('div', { className: 'wb-card-t' }, g.category.replace(/^\d+-/, '')),
                  h('div', { className: 'wb-card-d' }, g.count + ' 个技能'),
                  h('div', { className: 'wb-card-f' }, '非中国法 · 只读参考，不挂开跑按钮')))))
            : h('div', {},
                pipe,
                h('div', { className: 'wb-sec' }, t('functions') + (stageIdx >= 0 && track.stages[stageIdx] ? ' · ' + track.stages[stageIdx] : '')),
                h('div', { className: 'wb-cards' }, cards),
                cards.length === 0 ? h('div', { className: 'wb-dim', style: { marginTop: '8px' } }, t('noStageCards')) : null),
          notice ? h('div', { className: 'wb-alert', style: { marginTop: '10px' } }, notice) : null,
          h('div', { className: 'wb-dim', style: { marginTop: '14px' } },
            t('usingCase') + '：' + (selCase ? selCase.name : t('noCase')))))

      return h('div', { className: 'wb-body' }, leftCol, mainCol)
    }

    function DeliverPane(props) {
      const { t, data, onOpenReport } = props
      const cases = (data && data.cases) || []
      const groups = { draft: [], reviewed: [], exported: [], delivered: [] }
      let unreviewed = 0
      for (const c of cases) {
        for (const f of c.outputs || []) {
          const status = f.status || 'draft'
          let key = 'draft'
          if (status === 'delivered') key = 'delivered'
          else if (status === 'exported' || status === 'exported_unreviewed') key = 'exported'
          else if (status === 'reviewed') key = 'reviewed'
          if (status === 'exported_unreviewed') unreviewed += 1
          groups[key].push({ name: f.name, caseName: c.name, caseId: c.id, date: f.mtime, section: f.section, rel: f.rel, ext: f.ext, status })
        }
      }
      const cols = [['draft', 'draft'], ['reviewed', 'reviewed'], ['exported', 'exported'], ['delivered', 'delivered']]
      return h('div', { className: 'wb-body' },
        h('div', { className: 'wb-col', style: { flex: '1 1 auto' } },
          h('div', { className: 'wb-col-h' }, h('span', { className: 'wb-sec', style: { margin: 0 } }, t('deliverables')),
            h('span', { className: 'wb-dim' }, '草稿 → 已审 → 已导出 → 已交付　·　' + t('reportHint')),
            h('div', { className: 'wb-spacer' }),
            unreviewed > 0 ? h(Chip, { tone: 'red', text: unreviewed + ' ' + t('unverifiedExports') }) : null),
          h('div', { className: 'wb-col-b' },
            h('div', { className: 'wb-4col' },
              cols.map((pair) => h('div', { key: pair[0] },
                h('div', { className: 'wb-sec' }, t(pair[1]) + '（' + groups[pair[0]].length + '）'),
                groups[pair[0]].length
                  ? groups[pair[0]].map((f, i) => h('div', {
                    className: 'wb-file',
                    key: i,
                    role: f.rel ? 'button' : undefined,
                    tabIndex: f.rel ? 0 : undefined,
                    style: f.rel ? { cursor: 'pointer' } : undefined,
                    onClick: f.rel ? () => onOpenReport({ rel: f.rel, name: f.name }) : undefined
                  },
                    h('div', { className: 'n' }, f.name,
                      f.status === 'exported_unreviewed' ? h('span', { style: { marginLeft: '6px', color: 'var(--dsw-alias-state-error-primary)', fontSize: '11px' } }, '未过审查') : null),
                    h('div', { className: 'wb-dim' }, f.caseName + ' · ' + fmtDate(f.date))))
                  : h('div', { className: 'wb-dim' }, t('noFiles'))))))))
    }

    function DeadlinesPane(props) {
      const { t, data } = props
      const [icsNotice, setIcsNotice] = useState('')
      const cases = (data && data.cases) || []
      const all = []
      for (const c of cases) for (const d of c.deadlines || []) all.push({ caseName: c.name, caseId: c.id, d })
      const dated = all.filter((x) => x.d.daysLeft !== null).sort((a, b) => a.d.daysLeft - b.d.daysLeft)
      const buckets = [
        ['today', dated.filter((x) => x.d.daysLeft <= 0)],
        ['week', dated.filter((x) => x.d.daysLeft > 0 && x.d.daysLeft <= 7)],
        ['month', dated.filter((x) => x.d.daysLeft > 7 && x.d.daysLeft <= 30)]
      ]
      return h('div', { className: 'wb-body' },
        h('div', { className: 'wb-col', style: { flex: '1 1 auto' } },
          h('div', { className: 'wb-col-h' }, h('span', { className: 'wb-sec', style: { margin: 0 } }, t('allDeadlines')),
            h('span', { className: 'wb-dim' }, dated.length + ' 项'),
            h('div', { className: 'wb-spacer' }),
            icsNotice ? h('span', { className: 'wb-dim' }, icsNotice) : null,
            h('button', {
              className: 'wb-btn',
              onClick: () => {
                fetch('/lawyer-workbench/api/export-ics', { method: 'POST', headers: { 'content-type': 'application/json' } })
                  .then((r) => r.json())
                  .then((j) => {
                    if (j && j.ok) setIcsNotice(t('icsDone') + '：' + j.events + ' 条')
                  })
                  .catch(() => {})
              }
            }, t('exportIcs'))),
          h('div', { className: 'wb-col-b' },
            dated.length === 0 ? h('div', { className: 'wb-empty' }, t('noDeadline')) : null,
            buckets.map((bucket) => h('div', { key: bucket[0], style: { marginBottom: '16px' } },
              h('div', { className: 'wb-sec' }, t(bucket[0]) + '（' + bucket[1].length + '）'),
              bucket[1].length
                ? bucket[1].map((x, i) => h('div', { className: 'wb-side-item', key: i },
                  h('div', { className: 'row1' },
                    h('span', { style: { fontSize: '12px', fontWeight: 600 } }, x.d.name + ' · ' + x.caseName),
                    h(Chip, { tone: x.d.daysLeft <= 3 ? 'red' : x.d.daysLeft <= 7 ? 'amber' : 'idle', text: dueText(x.d.daysLeft, t) })),
                  h('div', { className: 'wb-dim' }, x.d.due + ' · ' + x.d.basis + ' · ' + (x.d.owner || '—'))))
                : h('div', { className: 'wb-dim' }, '—'))))))
    }

    function SettingsPane(props) {
      const { t, data, loading, reload } = props
      const core = (data && data.skills && data.skills.core) || []
      const refCount = (data && data.skills && data.skills.referenceCount) || 0
      const cats = {}
      for (const s of core) cats[s.category] = (cats[s.category] || 0) + 1
      return h('div', { className: 'wb-body' },
        h('div', { className: 'wb-col', style: { flex: '1 1 auto' } },
          h('div', { className: 'wb-col-h' }, h('span', { className: 'wb-sec', style: { margin: 0 } }, t('navSettings'))),
          h('div', { className: 'wb-col-b' },
            h('div', { className: 'wb-sec' }, t('root')),
            h('div', { className: 'wb-v', style: { marginBottom: '16px', wordBreak: 'break-all' } }, (data && data.root) || '—'),
            h('div', { className: 'wb-sec' }, t('skillCore') + ' · ' + core.length),
            h('div', { className: 'wb-legend', style: { marginBottom: '14px' } },
              Object.keys(cats).map((k) => h('span', { key: k }, k.replace(/^\d+-/, '') + ' ' + cats[k]))),
            h('div', { className: 'wb-sec' }, t('skillRef') + ' · ' + refCount),
            h('div', { className: 'wb-dim', style: { marginBottom: '16px' } }, t('refNote')),
            h('div', { className: 'wb-sec' }, t('backupTitle')),
            h('div', { className: 'wb-dim', style: { marginBottom: '8px' } },
              data && data.backup ? (t('backupLast') + '：' + data.backup.date + '（' + Math.round(data.backup.size / 1024) + ' KB）') : t('backupNone')),
            h('button', {
              className: 'wb-btn',
              onClick: () => {
                fetch('/lawyer-workbench/api/backup', { method: 'POST', headers: { 'content-type': 'application/json' } })
                  .then((r) => r.json())
                  .then((j) => { if (j && j.ok && typeof reload === 'function') reload() })
                  .catch(() => {})
              }
            }, t('backupNow')),
            h('div', { className: 'wb-sec', style: { marginTop: '18px' } }, t('healthTitle')),
            data && data.health
              ? h('div', { className: 'wb-legend', style: { flexDirection: 'column', alignItems: 'flex-start', gap: '5px' } },
                h('span', null, t('healthRoot') + '：' + (data.health.rootExists ? '✓' : '×')),
                h('span', null, t('healthTemplate') + '：' + (data.health.templateExists ? '✓' : '×')),
                h('span', null, t('healthBatches') + '：' + data.health.intakeBatches),
                h('span', null, t('healthAudit') + '：' + (data.health.auditLog ? '✓' : '—')))
              : h('div', { className: 'wb-dim' }, t('loading')),
            h('div', { className: 'wb-sec', style: { marginTop: '18px' } }, t('aboutTitle')),
            h('div', { className: 'wb-dim', style: { lineHeight: '1.8' } }, t('aboutBody')),
            loading ? h('div', { className: 'wb-dim', style: { marginTop: '12px' } }, t('loading')) : null)))
    }

    function kindLabel(t, kind) {
      if (kind === 'diagnosis') return t('kindDiagnosis')
      if (kind === 'chat') return t('kindChat')
      if (kind === 'decision') return t('kindDecision')
      if (kind === 'proposal') return t('kindProposal')
      if (kind === 'quote') return t('kindQuote')
      if (kind === 'visit') return t('kindVisit')
      if (kind === 'lead') return t('kindLead')
      if (kind === 'follow') return t('kindFollow')
      if (kind === 'export') return t('kindExport')
      return t('kindOther')
    }

    function QuoteForm(props) {
      const { t, client, onDone } = props
      const [basic, setBasic] = useState('3,000')
      const [recommended, setRecommended] = useState('12,000')
      const [full, setFull] = useState('20%')
      const [busy, setBusy] = useState(false)
      const [msg, setMsg] = useState('')
      const submit = () => {
        if (!client) return
        setBusy(true)
        setMsg('')
        fetch('/lawyer-workbench/api/quote', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: client.name, basic, recommended, full })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            setMsg(t('quoteDone') + '：' + j.path)
            if (typeof onDone === 'function') onDone(j.path)
          })
          .catch((e) => setMsg(String(e.message || e)))
          .finally(() => setBusy(false))
      }
      const field = (label, value, setter, placeholder) => h('div', { className: 'wb-quote-row' },
        h('span', { className: 'wb-dim', style: { width: '46px', flex: '0 0 auto' } }, label),
        h('input', {
          className: 'wb-input',
          value,
          placeholder,
          onChange: (e) => setter(e.target.value)
        }))
      return h('div', { className: 'wb-quote' },
        h('div', { className: 'wb-safety-h' }, t('quoteTitle')),
        field(t('qBasic'), basic, setBasic, '3,000'),
        field(t('qRecommend'), recommended, setRecommended, '12,000'),
        field(t('qFull'), full, setFull, '20%'),
        h('div', { style: { marginTop: '7px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
          h('button', { className: 'wb-btn is-primary', disabled: busy, onClick: submit }, busy ? t('quoting') : t('quote')),
          msg ? h('span', { className: 'wb-dim', style: { fontSize: '11px' } }, msg) : null))
    }

    function UploadPanel(props) {
      const { t, client, onUploaded, onAction, onQuote } = props
      const [text, setText] = useState('')
      const [busy, setBusy] = useState('')
      const [msg, setMsg] = useState('')
      const [pending, setPending] = useState(null)
      const chatInput = useRef(null)
      const docInput = useRef(null)

      const uploadFiles = (fileList, kind) => {
        if (!client) return
        const files = Array.from(fileList || [])
        if (!files.length) return
        setBusy('file')
        setMsg('')
        let index = 0
        const step = () => {
          if (index >= files.length) {
            setBusy('')
            setMsg(t('uploaded'))
            setPending({
              count: files.length,
              hasImage: files.some((f) => /^image\//.test(f.type || '') || /\.(png|jpe?g|webp)$/i.test(f.name || ''))
            })
            if (typeof onUploaded === 'function') onUploaded()
            return
          }
          const file = files[index]
          fetch('/lawyer-workbench/api/upload?name=' + encodeURIComponent(client.name) + '&kind=' + encodeURIComponent(kind) + '&filename=' + encodeURIComponent(file.name), {
            method: 'POST',
            headers: { 'content-type': file.type || 'application/octet-stream' },
            body: file
          })
            .then((r) => r.json())
            .then((j) => {
              if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
              index += 1
              step()
            })
            .catch((e) => {
              setMsg(String(e.message || e))
              setBusy('')
            })
        }
        step()
      }

      const saveText = () => {
        if (!client || !text.trim()) return
        setBusy('text')
        setMsg('')
        fetch('/lawyer-workbench/api/upload-text', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: client.name, text })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            setText('')
            setMsg(t('uploaded') + '：' + j.path)
            setPending({ count: 1, hasImage: false })
            if (typeof onUploaded === 'function') onUploaded()
          })
          .catch((e) => setMsg(String(e.message || e)))
          .finally(() => setBusy(''))
      }

      const diagAction = {
        title: '客户聊天诊断',
        skill: 'lawyer-chat-diagnose',
        target: '客户/' + (client ? client.name : '') + '/聊天诊断.md',
        why: '判断阶段、真实顾虑、该不该约'
      }
      const ocrNow = () => {
        if (!client) return
        setBusy('ocr')
        setMsg('')
        fetch('/lawyer-workbench/api/ocr', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: client.name })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            setMsg(t('ocrDone').replace('{n}', String(j.images)) + '：' + j.path)
            setPending({ count: 0, hasImage: false })
            if (typeof onUploaded === 'function') onUploaded()
          })
          .catch((e) => setMsg(String(e.message || e)))
          .finally(() => setBusy(''))
      }

      const has = (client && client.has) || {}
      const rows = [
        ['chat', t('mChat'), has.chat ? null : (has.images ? { ocr: true, label: t('ocrNow') } : { upload: 'chat' })],
        ['diagnosis', t('mDiagnosis'), has.diagnosis ? null : { action: { title: '客户聊天诊断', skill: 'lawyer-chat-diagnose', target: '客户/' + (client ? client.name : '') + '/聊天诊断.md', why: '判断阶段、真实顾虑、该不该约' }, label: t('genDiagnosis') }],
        ['proposal', t('mProposal'), has.proposal ? null : { action: { title: '三档服务方案', skill: 'lawyer-consult-diagnose', target: '客户/' + (client ? client.name : '') + '/方案.md', why: '给三条路与三档服务' }, label: t('genProposal') }],
        ['quote', t('mQuote'), has.quote ? null : { quote: true, label: t('quote') }],
        ['decision', t('mDecision'), has.decision ? null : { action: { title: '一页纸决策材料', skill: 'lawyer-chat-diagnose', target: '客户/' + (client ? client.name : '') + '/决策材料.md', why: '给配偶或合伙人看的一页纸' }, label: t('genDecision') }]
      ]

      return h('div', { className: 'wb-upload' },
        h('div', { className: 'wb-upload-head' }, t('uploadTitle')),
        h('div', { className: 'wb-upload-hint' }, t('uploadHint')),
        h('div', {
          className: 'wb-drop',
          onDragOver: (e) => { e.preventDefault() },
          onDrop: (e) => { e.preventDefault(); uploadFiles(e.dataTransfer && e.dataTransfer.files, 'chat') }
        },
          h('div', null, t('dropHere')),
          h('div', { style: { marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' } },
            h('button', { className: 'wb-btn', disabled: busy === 'file', onClick: () => chatInput.current && chatInput.current.click() }, t('chooseChat')),
            h('button', { className: 'wb-btn', disabled: busy === 'file', onClick: () => docInput.current && docInput.current.click() }, t('chooseDoc')),
            h('input', { ref: chatInput, type: 'file', multiple: true, style: { display: 'none' }, onChange: (e) => { uploadFiles(e.target.files, 'chat'); e.target.value = '' } }),
            h('input', { ref: docInput, type: 'file', multiple: true, style: { display: 'none' }, onChange: (e) => { uploadFiles(e.target.files, 'other'); e.target.value = '' } }))),
        h('textarea', {
          className: 'wb-textarea',
          value: text,
          placeholder: t('pastePlaceholder'),
          onChange: (e) => setText(e.target.value)
        }),
        h('div', { className: 'wb-upload-actions' },
          h('button', { className: 'wb-btn is-primary', disabled: busy === 'text' || !text.trim(), onClick: saveText }, busy === 'text' ? t('saving') : t('savePaste')),
          msg ? h('span', { className: 'wb-dim' }, msg) : null),
        pending
          ? h('div', { className: 'wb-alert', style: { marginTop: '8px' } },
            h('div', null, t('uploadedAsk')),
            h('div', { style: { marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' } },
              h('button', { className: 'wb-mini', onClick: () => { setPending(null); if (typeof onAction === 'function') onAction(diagAction) } }, t('nowDiagnose')),
              pending.hasImage
                ? h('button', { className: 'wb-mini', disabled: busy === 'ocr', onClick: ocrNow }, busy === 'ocr' ? t('saving') : t('ocrNow'))
                : null,
              h('button', { className: 'wb-mini', onClick: () => setPending(null) }, t('later'))))
          : null,
        h('div', { className: 'wb-materials' },
          h('span', { className: 'wb-dim' }, t('materials') + '：'),
          rows.map((row) => {
            const done = has[row[0]]
            return h('span', { key: row[0], className: 'wb-material' + (done ? ' is-done' : '') },
              h('span', null, (done ? '✓ ' : '· ') + row[1]),
              row[2]
                ? h('button', {
                  className: 'wb-mini',
                  onClick: () => {
                    if (row[2].ocr) { ocrNow(); return }
                    if (row[2].upload === 'chat') { if (chatInput.current) chatInput.current.click(); return }
                    if (row[2].quote) { if (typeof onQuote === 'function') onQuote(); return }
                    if (typeof onAction === 'function') onAction(row[2].action)
                  }
                }, row[2].label || t('chooseChat'))
                : h('span', { className: 'wb-dim', style: { fontSize: '10px' } }, t('mHave')))
          })))
    }

    function SafetyCard(props) {
      const { t, client } = props
      const [copied, setCopied] = useState(false)
      const [variant, setVariant] = useState(0)
      const [draft, setDraft] = useState('')
      const hooks = (client && client.hooks) || []
      const name = client ? client.name : ''
      const hook = hooks.length ? hooks[variant % hooks.length] : ''
      const aim = client && client.stage === 'quoted'
        ? '对方可能怎么答、你手上这些东西够不够'
        : client && client.stage === 'proposal'
          ? '三档到底差在哪、你现在最该补哪一步'
          : client && client.stage === 'consulted'
            ? '有哪几条路、各要花多少时间'
            : '你这情况能不能走、值不值得走'
      const variants = [
        hook
          ? name + '，你说过“' + hook + '”。这周你哪天晚上方便，来我这儿坐二十分钟，我把' + aim + '当面跟你捋一遍。先不用定什么，听完你自己判断。'
          : name + '，你那个事我想了两天，有个地方容易被忽略。这周找个时间坐二十分钟，我当面跟你说清楚，你先不用定什么。',
        name + '，我这周整理了一份跟你情况差不多的案子是怎么走的，二十分钟给你讲一遍。你听听有没有用，觉得有用再说下一步。',
        name + '，你要是方便，带上你家里人一起过来坐坐。有些话当面说比微信里转述清楚，你们听完再商量，不着急定。'
      ]
      useEffect(() => {
        setDraft(variants[variant % variants.length])
      }, [variant, name, hook])

      const copy = (value) => {
        const done = () => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        }
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).then(done).catch(done)
            return
          }
        } catch (e) {
          /* fall through */
        }
        done()
      }

      return h('div', { className: 'wb-safety' },
        h('div', { className: 'wb-safety-h' }, t('inviteTitle')),
        h('div', { className: 'wb-dim', style: { fontSize: '11px', marginBottom: '6px', lineHeight: '1.6' } }, t('inviteHint')),
        hooks.length
          ? h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' } },
            hooks.map((item, index) => h('button', {
              key: index,
              className: 'wb-mini',
              title: t('copyThis'),
              onClick: () => copy('“' + item + '”')
            }, '“' + item + '”')))
          : null,
        h('textarea', {
          className: 'wb-textarea',
          value: draft,
          onChange: (e) => setDraft(e.target.value)
        }),
        h('div', { style: { marginTop: '7px', display: 'flex', gap: '8px', flexWrap: 'wrap' } },
          h('button', { className: 'wb-btn', onClick: () => copy(draft) }, copied ? t('copied') : t('copyInvite')),
          h('button', { className: 'wb-btn', onClick: () => setVariant((n) => n + 1) }, t('anotherVersion'))))
    }

    const STAGE_KEYS = {
      lead: 'stageLead',
      consulted: 'stageConsulted',
      proposal: 'stageProposal',
      quoted: 'stageQuoted',
      won: 'stageWon',
      lost: 'stageLost',
      served: 'stageServed'
    }
    const STAGE_TONE = { lead: 'idle', consulted: 'amber', proposal: 'amber', quoted: 'red', won: 'ok', lost: 'idle', served: 'ok' }
    const FUNNEL_STAGES = [['lead', 'stageLead'], ['consulted', 'stageConsulted'], ['proposal', 'stageProposal'], ['quoted', 'stageQuoted'], ['won', 'stageWon'], ['lost', 'stageLost']]

    function ClientsPane(props) {
      const { t, data, onOpenReport, uiWorkspace, reload, focusName } = props
      const clients = (data && data.clients) || []
      const cases = (data && data.cases) || []
      const [sel, setSel] = useState('')
      const [filter, setFilter] = useState('')
      useEffect(() => {
        if (focusName) setSel(focusName)
      }, [focusName])
      const [notice, setNotice] = useState('')
      const [busy, setBusy] = useState('')
      const [showQuote, setShowQuote] = useState(false)
      const cur = clients.find((c) => c.name === sel) || clients[0] || null
      const shown = filter ? clients.filter((c) => c.stage === filter) : clients
      const counts = {}
      for (const c of clients) counts[c.stage] = (counts[c.stage] || 0) + 1

      const createClient = () => {
        const name = window.prompt(t('newClientPrompt'), '')
        if (!name) return
        fetch('/lawyer-workbench/api/client-create', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            setNotice(t('clientCreated') + '：' + name)
            if (typeof reload === 'function') reload()
          })
          .catch((e) => setNotice(String(e.message || e)))
      }
      const run = (action) => {
        if (!cur) return
        setBusy('run')
        setNotice('')
        fetch('/lawyer-workbench/api/client-open', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: cur.name, action })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok || !j.sessionId) throw new Error((j && j.error) || 'failed')
            if (uiWorkspace && typeof uiWorkspace.openSession === 'function') uiWorkspace.openSession(j.sessionId)
          })
          .catch((e) => setNotice(String(e.message || e)))
          .finally(() => setBusy(''))
      }
      const pickStage = (stage) => {
        if (!cur || stage === cur.stage) return
        let reason = ''
        if (stage === 'lost') {
          reason = window.prompt(t('promptLostReason'), cur.reason || 'price') || ''
          if (!reason) return
        }
        setBusy('stage')
        fetch('/lawyer-workbench/api/client-stage', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: cur.name, stage, reason })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            setNotice(t('stageSaved'))
            if (typeof reload === 'function') reload()
          })
          .catch((e) => setNotice(String(e.message || e)))
          .finally(() => setBusy(''))
      }
      const convert = () => {
        if (!cur) return
        const caseId = window.prompt(t('promptCaseId'), new Date().getFullYear() + '-001')
        if (!caseId) return
        const caseName = window.prompt(t('promptCaseName'), cur.name + '案')
        if (!caseName) return
        const lawyer = window.prompt(t('promptLawyer'), cur.owner || '') || ''
        setBusy('convert')
        fetch('/lawyer-workbench/api/convert-case', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: cur.name, caseId, caseName, lawyer })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            setNotice(t('converted') + '：' + j.caseDir)
            if (typeof reload === 'function') reload()
          })
          .catch((e) => setNotice(String(e.message || e)))
          .finally(() => setBusy(''))
      }
      const runCaseAction = (item, action) => {
        fetch('/lawyer-workbench/api/open', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ caseId: item.id, action })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            if (uiWorkspace && typeof uiWorkspace.openSession === 'function') uiWorkspace.openSession(j.sessionId)
          })
          .catch((e) => setNotice(String(e.message || e)))
      }

      const funnel = h('div', { className: 'wb-funnel' },
        FUNNEL_STAGES.map((pair) => h('button', {
          key: pair[0],
          className: 'wb-funnel-step' + (filter === pair[0] ? ' is-on' : ''),
          onClick: () => setFilter(filter === pair[0] ? '' : pair[0])
        },
          h('span', { className: 'wb-funnel-n' }, counts[pair[0]] || 0),
          h('span', { className: 'wb-funnel-l' }, t(pair[1])))))

      const listRows = shown.map((c) => h('div', {
        key: c.name,
        className: 'wb-row' + (cur && c.name === cur.name ? ' is-on' : ''),
        role: 'button',
        tabIndex: 0,
        onClick: () => setSel(c.name)
      },
        h('div', { className: 'wb-row-t' }, c.name,
          h('span', { className: 'wb-spacer' }),
          h(Chip, { tone: STAGE_TONE[c.stage] || 'idle', text: t(STAGE_KEYS[c.stage] || 'stageLead') })),
        h('div', { className: 'wb-row-s' }, (c.grade ? c.grade + ' 类 · ' : '') + (c.source || '—') + (c.due ? ' · 截止 ' + c.due : ''))))

      const left = h('div', { className: 'wb-col wb-list' },
        h('div', { className: 'wb-col-h' },
          h('span', { className: 'wb-sec', style: { margin: 0 } }, t('navClients') + ' · ' + clients.length),
          h('div', { className: 'wb-spacer' }),
          filter ? h('button', { className: 'wb-btn', onClick: () => setFilter('') }, '×') : null,
          h('button', { className: 'wb-btn', onClick: createClient }, t('newClient'))),
        h('div', { className: 'wb-col-b' }, shown.length ? listRows : h('div', { className: 'wb-empty' }, t('noClients'))))

      const info = cur ? h('div', { className: 'wb-grid' },
        [
          [t('stageLabel2'), t(STAGE_KEYS[cur.stage] || 'stageLead')],
          [t('grade'), cur.grade || '—'],
          [t('temp'), cur.temp || '—'],
          [t('source'), cur.source || '—'],
          [t('budget'), cur.budget || '—'],
          [t('ownerLabel'), cur.owner || '—'],
          [t('clientNext'), cur.next || (cur.action && cur.action.title) || '—'],
          [t('due'), cur.due || '—']
        ].map((pair, index) => h('div', { key: index },
          h('div', { className: 'wb-k' }, pair[0]),
          h('div', { className: 'wb-v' }, pair[1] || '—')))) : null

      const actions = cur ? h('div', { className: 'wb-actions' },
        h('button', {
          className: 'wb-btn is-primary',
          disabled: busy === 'run' || !cur.action,
          onClick: () => run(cur.action)
        }, t('run') + (cur.action ? '：' + cur.action.title : '')),
        h('select', {
          className: 'wb-sel',
          value: cur.stage,
          onChange: (e) => pickStage(e.target.value)
        }, FUNNEL_STAGES.concat([['served', 'stageServed']]).map((pair) => h('option', { key: pair[0], value: pair[0] }, t(pair[1])))),
        h('button', { className: 'wb-btn', onClick: () => setShowQuote((v) => !v) }, showQuote ? t('quoteClose') : t('quote')),
        h('button', { className: 'wb-btn', disabled: busy === 'convert', onClick: convert }, t('convertCase'))) : null

      const fileRows = cur && cur.files.length
        ? cur.files.map((f) => h('div', {
          key: f.rel,
          className: 'wb-file',
          role: 'button',
          tabIndex: 0,
          style: { cursor: 'pointer' },
          onClick: () => onOpenReport({ rel: f.rel, name: f.name })
        },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            h('span', { className: 'n', style: { flex: '1 1 auto' } }, f.name),
            h(Chip, { tone: f.kind === 'diagnosis' ? 'ok' : 'idle', text: kindLabel(t, f.kind) }),
            h('span', { className: 'wb-dim' }, fmtDate(f.mtime)))))
        : h('div', { className: 'wb-dim' }, t('noClients'))

      const pending = cases.filter((c) => c.closed && !c.visitDate)
      const postSale = h('div', { style: { marginTop: '16px' } },
        h('div', { className: 'wb-sec' }, t('postSale') + '（' + pending.length + '）'),
        pending.length
          ? pending.map((item) => h('div', { className: 'wb-file', key: item.id },
            h('div', { className: 'n' }, item.name),
            h('div', { className: 'wb-dim' }, item.daysSinceClose === null
              ? '—'
              : (item.daysSinceClose + ' 天前结案 · ' + (item.postSale && item.postSale.nextMark ? ('建议 ' + item.postSale.nextMark + ' 天回访（' + item.postSale.due + '）') : '待排期') + (item.postSale && item.postSale.overdue ? ' · 已过建议时间' : ''))),
            h('div', { style: { marginTop: '6px' } },
              h('button', {
                className: 'wb-btn',
                onClick: () => runCaseAction(item, { title: '结案后 30 天回访', skill: 'lawyer-followup-grow', target: '08-结案归档/回访记录.md', why: '结案后 30 天是转介绍窗口' })
              }, t('run')))))
          : h('div', { className: 'wb-dim' }, t('postSaleEmpty')))

      const right = h('div', { className: 'wb-col', style: { flex: '1 1 auto', minWidth: 0 } },
        h('div', { className: 'wb-col-h' },
          h('span', { style: { fontWeight: 600, fontSize: '14px' } }, cur ? cur.name : t('navClients')),
          cur ? h(Chip, { tone: STAGE_TONE[cur.stage] || 'idle', text: t(STAGE_KEYS[cur.stage] || 'stageLead') }) : null,
          cur && cur.demo ? h(Chip, { tone: 'idle', text: t('demo') }) : null,
          h('div', { className: 'wb-spacer' }),
          h('span', { className: 'wb-dim' }, t('reportHint'))),
        h('div', { className: 'wb-col-b' },
          info,
          actions,
          notice ? h('div', { className: 'wb-alert' }, notice) : null,
          cur ? h(SafetyCard, { t, client: cur }) : null,
          cur && showQuote ? h(QuoteForm, {
            t,
            client: cur,
            onDone: (path) => {
              setNotice(t('quoteDone') + '：' + path)
              setShowQuote(false)
              if (typeof onOpenReport === 'function') onOpenReport({ rel: path, name: path.split('/').pop() })
              if (typeof reload === 'function') reload()
            }
          }) : null,
          cur ? h(UploadPanel, { t, client: cur, onUploaded: () => { if (typeof reload === 'function') reload() }, onAction: run, onQuote: () => setShowQuote(true) }) : null,
          h('div', { className: 'wb-sec', style: { marginTop: '12px' } }, t('clientInfo')),
          fileRows,
          postSale))

      return h('div', { className: 'wb-body', style: { flexDirection: 'column' } },
        funnel,
        h('div', { style: { display: 'flex', gap: '12px', flex: '1 1 auto', minHeight: 0 } }, left, right))
    }

    function ReportView(props) {
      const { t, report, onBack } = props
      const [state, setState] = useState({ loading: true, text: '', error: '' })
      const [busy, setBusy] = useState(false)
      const [desens, setDesens] = useState(false)
      const [wordBusy, setWordBusy] = useState(false)
      const [notice, setNotice] = useState('')
      useEffect(() => {
        let alive = true
        setState({ loading: true, text: '', error: '' })
        fetch('/lawyer-workbench/api/file?path=' + encodeURIComponent(report.rel))
          .then((res) => res.json())
          .then((json) => {
            if (!alive) return
            if (!json || !json.ok) throw new Error((json && json.error) || 'failed')
            setState({ loading: false, text: json.text, error: '' })
          })
          .catch((err) => { if (alive) setState({ loading: false, text: '', error: String(err.message || err) }) })
        return () => { alive = false }
      }, [report.rel])
      const html = useMemo(() => (state.text ? mdToHtml(state.text) : ''), [state.text])
      const doExport = () => {
        const target = report.rel.replace(/\.(md|txt)$/i, '') + '.html'
        const title = report.name.replace(/\.(md|txt)$/i, '')
        const doc = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/>' +
          '<meta name="viewport" content="width=device-width,initial-scale=1"/>' +
          '<title>' + escapeHtml(title) + '</title><style>' + REPORT_CSS + EXPORT_SHELL_CSS + '</style></head>' +
          '<body><div class="wb-export-bar"><span>律师工作台 · 导出报告</span><span>' + escapeHtml(report.rel) + '</span></div>' +
          '<div class="wb-doc">' + html + '</div></body></html>'
        setBusy(true)
        setNotice('')
        fetch('/lawyer-workbench/api/save-html', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ path: target, html: doc })
        })
          .then((res) => res.json())
          .then((json) => {
            if (!json || !json.ok) throw new Error((json && json.error) || 'failed')
            setNotice(t('exportedTo') + '：' + json.path)
          })
          .catch((err) => setNotice(String(err.message || err)))
          .finally(() => setBusy(false))
      }
      const doDesensitize = () => {
        setDesens(true)
        setNotice('')
        fetch('/lawyer-workbench/api/desensitize', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ path: report.rel })
        })
          .then((res) => res.json())
          .then((json) => {
            if (!json || !json.ok) throw new Error((json && json.error) || 'failed')
            const counts = json.counts || {}
            setNotice(t('desensitized') + '：' + json.path + '（手机 ' + (counts.phone || 0) + ' / 身份证 ' + (counts.idCard || 0) + ' / 银行卡 ' + (counts.bankCard || 0) + '）')
          })
          .catch((err) => setNotice(String(err.message || err)))
          .finally(() => setDesens(false))
      }
      const doWord = () => {
        setWordBusy(true)
        setNotice('')
        fetch('/lawyer-workbench/api/export-docx', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ path: report.rel })
        })
          .then((res) => res.json())
          .then((json) => {
            if (!json || !json.ok) throw new Error((json && json.error) || 'failed')
            setNotice(t('wordDone') + '：' + json.path)
          })
          .catch((err) => setNotice(String(err.message || err)))
          .finally(() => setWordBusy(false))
      }
      return h('div', { className: 'wb-body' },
        h('div', { className: 'wb-col', style: { flex: '1 1 auto' } },
          h('div', { className: 'wb-col-h' },
            h('button', { className: 'wb-btn', onClick: onBack }, '← ' + t('reportBack')),
            h('span', { style: { fontWeight: 600, fontSize: '14px' } }, report.name),
            h('span', { className: 'wb-dim' }, report.rel),
            h('div', { className: 'wb-spacer' }),
            notice ? h('span', { className: 'wb-dim' }, notice) : null,
            /\.(md|txt)$/i.test(report.rel)
              ? h('button', { className: 'wb-btn', onClick: doDesensitize, disabled: desens }, desens ? t('desensitizing') : t('desensitize'))
              : null,
            /\.md$/i.test(report.rel)
              ? h('button', { className: 'wb-btn', onClick: doWord, disabled: wordBusy }, wordBusy ? t('exportingWord') : t('exportWord'))
              : null,
            h('button', { className: 'wb-btn is-primary', onClick: doExport, disabled: busy || !state.text }, busy ? t('exporting') : t('exportHtml'))),
          h('div', { className: 'wb-col-b', style: { background: 'var(--dsw-alias-bg-base)' } },
            h('style', null, REPORT_CSS),
            state.loading
              ? h('div', { className: 'wb-empty' }, t('loading'))
              : state.error
                ? h('div', { className: 'wb-err' }, t('failed') + '：' + state.error)
                : h('div', { className: 'wb-doc', dangerouslySetInnerHTML: { __html: html } }))))
    }

    function IntakePane(props) {
      const { t, data, reload, onGo } = props
      const [step, setStep] = useState(1)
      const [kind, setKind] = useState('client')
      const [name, setName] = useState('')
      const [caseId, setCaseId] = useState(String(new Date().getFullYear()) + '-001')
      const [caseName, setCaseName] = useState('')
      const [lawyer, setLawyer] = useState('')
      const [cause, setCause] = useState('')
      const [stage, setStage] = useState('咨询')
      const [batch, setBatch] = useState('')
      const [slots, setSlots] = useState([])
      const [files, setFiles] = useState([])
      const [busy, setBusy] = useState('')
      const [notice, setNotice] = useState('')
      const [mode, setMode] = useState('new')
      const [target, setTarget] = useState('')
      const [preview, setPreview] = useState(null)
      const [targets, setTargets] = useState({})
      const [bulkTarget, setBulkTarget] = useState('')
      const [result, setResult] = useState(null)
      const currentSlot = React.useRef('chat')

      const begin = () => {
        if (mode === 'existing') {
          if (!target) { setNotice(t('needTarget')); return }
        } else {
          if (!name.trim()) { setNotice(t('needName')); return }
          if (kind === 'case' && !caseName.trim()) { setNotice(t('needCaseName')); return }
        }
        setBusy('begin')
        setNotice('')
        fetch('/lawyer-workbench/api/intake/begin', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ mode, target, kind, name: name.trim(), caseId, caseName: caseName.trim(), lawyer, cause, stage })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            setBatch(j.batch)
            setSlots(j.slots || [])
            setFiles([])
            setStep(2)
          })
          .catch((e) => setNotice(String(e.message || e)))
          .finally(() => setBusy(''))
      }

      const upload = (slot, fileList) => {
        const list = Array.from(fileList || [])
        if (!list.length || !batch) return
        setBusy('upload')
        setNotice('')
        let index = 0
        const next = () => {
          if (index >= list.length) {
            setBusy('')
            if (typeof reload === 'function') reload()
            return
          }
          const file = list[index]
          fetch('/lawyer-workbench/api/intake/upload?batch=' + encodeURIComponent(batch) + '&slot=' + encodeURIComponent(slot) + '&filename=' + encodeURIComponent(file.name), {
            method: 'POST',
            headers: { 'content-type': file.type || 'application/octet-stream' },
            body: file
          })
            .then((r) => r.json())
            .then((j) => {
              if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
              setFiles((prev) => prev.concat([{ stored: j.stored, original: j.original, slot, size: j.size }]))
              index += 1
              next()
            })
            .catch((e) => {
              setNotice(String(e.message || e))
              setBusy('')
            })
        }
        next()
      }

      const removeFile = (stored) => {
        fetch('/lawyer-workbench/api/intake/remove', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ batch, stored })
        })
          .then((r) => r.json())
          .then((j) => { if (j && j.ok) setFiles((prev) => prev.filter((f) => f.stored !== stored)) })
          .catch(() => {})
      }

      const doPreview = () => {
        if (!files.length) { setNotice(t('needFiles')); return }
        setBusy('preview')
        setNotice('')
        fetch('/lawyer-workbench/api/intake/preview?batch=' + encodeURIComponent(batch))
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            const nextTargets = {}
            for (const row of j.plan || []) {
              const key = row.stored + '|' + (row.zipEntry || '')
              nextTargets[key] = String(row.target).replace(j.base + '/', '')
            }
            setTargets(nextTargets)
            setBulkTarget('')
            setPreview(j)
            setStep(3)
          })
          .catch((e) => setNotice(String(e.message || e)))
          .finally(() => setBusy(''))
      }

      const commit = () => {
        setBusy('commit')
        setNotice('')
        fetch('/lawyer-workbench/api/intake/commit', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            batch,
            targets: (preview && preview.plan ? preview.plan : []).map((row) => ({
              stored: row.stored,
              zipEntry: row.zipEntry || '',
              target: targets[row.stored + '|' + (row.zipEntry || '')] || ''
            }))
          })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || !j.ok) throw new Error((j && j.error) || 'failed')
            setResult(j)
            setBatch('')
            setFiles([])
            if (typeof reload === 'function') reload()
          })
          .catch((e) => setNotice(String(e.message || e)))
          .finally(() => setBusy(''))
      }

      const reset = () => {
        setStep(1)
        setBatch('')
        setFiles([])
        setPreview(null)
        setResult(null)
        setNotice('')
      }

      const steps = h('div', { className: 'wb-steps' },
        [[1, t('intakeStep1')], [2, t('intakeStep2')], [3, t('intakeStep3')]].map((pair) =>
          h('span', { key: pair[0], className: 'wb-step' + (step === pair[0] ? ' is-on' : '') },
            h('b', null, String(pair[0])), ' ', pair[1])))

      if (result) {
        return h('div', { className: 'wb-body' },
          h('div', { className: 'wb-col', style: { flex: '1 1 auto' } },
            h('div', { className: 'wb-col-h' }, h('span', { className: 'wb-sec', style: { margin: 0 } }, t('intakeDone'))),
            h('div', { className: 'wb-col-b' },
              h('div', { className: 'wb-safety' },
                h('div', { className: 'wb-safety-h' }, t('intakeDone')),
                h('div', { className: 'wb-dim', style: { marginBottom: '8px' } }, result.base + ' ｜ ' + t('intakeFiles') + '：' + result.files),
                h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
                  h('button', { className: 'wb-btn is-primary', onClick: () => { reset(); if (typeof onGo === 'function') onGo(result.kind === 'client' ? 'clients' : 'cases') } }, t('intakeGo')),
                  h('button', { className: 'wb-btn', onClick: reset }, t('intakeAgain')))))))
      }

      const existingTargets = []
      if (data) {
        for (const item of data.cases || []) existingTargets.push({ rel: item.id, label: t('intakeCaseShort') + ' · ' + item.name })
        for (const item of data.clients || []) existingTargets.push({ rel: item.rel || ('客户/' + item.name), label: t('intakeClientShort') + ' · ' + item.name })
      }
      const modeRow = h('div', { className: 'wb-actions' },
        h('button', { className: 'wb-btn' + (mode === 'new' ? ' is-primary' : ''), onClick: () => setMode('new') }, t('intakeModeNew')),
        h('button', { className: 'wb-btn' + (mode === 'existing' ? ' is-primary' : ''), onClick: () => setMode('existing') }, t('intakeModeExisting')))

      const follow = h('div', { style: { marginTop: '14px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
        h('button', { className: 'wb-btn is-primary', disabled: busy === 'begin', onClick: begin }, busy === 'begin' ? t('intakeBusy') : t('intakeNext')),
        notice ? h('span', { className: 'wb-alert', style: { margin: 0 } }, notice) : null)

      const stepOne = h('div', {},
        modeRow,
        mode === 'existing'
          ? h('div', { style: { marginTop: '12px' } },
            h('div', { className: 'wb-k' }, t('intakePickTarget')),
            h('select', { className: 'wb-sel', value: target, onChange: (e) => setTarget(e.target.value), style: { minWidth: '360px', maxWidth: '100%' } },
              [h('option', { key: '__', value: '' }, t('intakePickTargetPh'))].concat(existingTargets.map((row) => h('option', { key: row.rel, value: row.rel }, row.label)))))
          : h('div', {},
            h('div', { style: { display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap', marginTop: '12px' } },
              [['client', t('intakeClient'), t('intakeClientHint')], ['case', t('intakeCase'), t('intakeCaseHint')]].map((pair) =>
                h('div', {
                  key: pair[0],
                  className: 'wb-row' + (kind === pair[0] ? ' is-on' : ''),
                  style: { flex: '1 1 260px', padding: '12px' },
                  role: 'button',
                  tabIndex: 0,
                  onClick: () => setKind(pair[0])
                },
                  h('div', { className: 'wb-row-t' }, pair[1]),
                  h('div', { className: 'wb-row-s' }, pair[2])))),
            h('div', { className: 'wb-grid' },
              h('div', null, h('div', { className: 'wb-k' }, t('intakeName')), h('input', { className: 'wb-input', value: name, onChange: (e) => setName(e.target.value), placeholder: t('intakeNamePh') })),
              h('div', null, h('div', { className: 'wb-k' }, t('intakeLawyer')), h('input', { className: 'wb-input', value: lawyer, onChange: (e) => setLawyer(e.target.value), placeholder: t('intakeLawyerPh') })),
              h('div', null, h('div', { className: 'wb-k' }, t('intakeCause')), h('input', { className: 'wb-input', value: cause, onChange: (e) => setCause(e.target.value), placeholder: t('intakeCausePh') })),
              kind === 'case' ? h('div', null, h('div', { className: 'wb-k' }, t('intakeCaseId')), h('input', { className: 'wb-input', value: caseId, onChange: (e) => setCaseId(e.target.value), placeholder: '2026-001' })) : null,
              kind === 'case' ? h('div', null, h('div', { className: 'wb-k' }, t('intakeCaseName')), h('input', { className: 'wb-input', value: caseName, onChange: (e) => setCaseName(e.target.value), placeholder: t('intakeCaseNamePh') })) : null,
              kind === 'case' ? h('div', null, h('div', { className: 'wb-k' }, t('intakeStage')), h('select', { className: 'wb-sel', value: stage, onChange: (e) => setStage(e.target.value) },
                ['咨询', '接案', '取证', '策略', '立案', '庭前', '庭审', '判决', '执行', '结案'].map((s) => h('option', { key: s, value: s }, s)))) : null)),
        follow)

      const slotCards = slots.map((slot) => h('div', { className: 'wb-slot', key: slot.id },
        h('div', { className: 'wb-slot-h' },
          h('span', { className: 'wb-sec', style: { margin: 0 } }, slot.name),
          h('div', { className: 'wb-spacer' }),
          h('button', { className: 'wb-btn', disabled: busy === 'upload', onClick: () => { currentSlot.current = slot.id; const input = document.getElementById('intake-file-input'); if (input) { input.click() } } }, t('intakeChoose'))),
        files.filter((f) => f.slot === slot.id).length
          ? h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' } },
            files.filter((f) => f.slot === slot.id).map((f) => h('span', { key: f.stored, className: 'wb-material' },
              h('span', null, f.original + ' · ' + Math.round((f.size || 0) / 1024) + ' KB'),
              h('button', { className: 'wb-mini', onClick: () => removeFile(f.stored) }, '×'))))
          : h('div', { className: 'wb-dim', style: { fontSize: '11px', marginTop: '4px' } }, t('intakeSlotEmpty'))))

      const stepTwo = h('div', {},
        h('input', {
          id: 'intake-file-input',
          type: 'file',
          multiple: true,
          style: { display: 'none' },
          onChange: (e) => { upload(currentSlot.current, e.target.files); e.target.value = '' }
        }),
        h('div', { className: 'wb-dim', style: { marginBottom: '10px', lineHeight: '1.7' } }, t('intakeUploadHint')),
        slotCards,
        h('div', { style: { marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } },
          h('button', { className: 'wb-btn', onClick: () => setStep(1) }, t('intakeBack')),
          h('button', { className: 'wb-btn is-primary', disabled: busy === 'preview' || !files.length, onClick: doPreview }, busy === 'preview' ? t('intakeBusy') : t('intakePreview')),
          h('span', { className: 'wb-dim' }, t('intakeUploaded') + '：' + files.length),
          notice ? h('span', { className: 'wb-alert', style: { margin: 0 } }, notice) : null))

      const stepThree = preview ? h('div', {},
        h('div', { className: 'wb-dim', style: { marginBottom: '10px', lineHeight: '1.7' } },
          t('intakeTarget') + '：' + preview.base + (preview.exists ? '（' + t('intakeExists') + '）' : '（' + t('intakeNew') + '）')),
        h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' } },
          h('span', { className: 'wb-dim' }, t('intakeBulk')),
          h('select', {
            className: 'wb-sel',
            value: bulkTarget,
            onChange: (e) => {
              const value = e.target.value
              setBulkTarget(value)
              if (!value) return
              const next = {}
              for (const row of preview.plan || []) next[row.stored + '|' + (row.zipEntry || '')] = value
              setTargets(next)
            }
          }, [h('option', { key: '__', value: '' }, t('intakeBulkPh'))].concat(preview.folders.map((folder) => h('option', { key: folder, value: folder }, folder))))),
        h('div', { className: 'wb-plan' },
          preview.plan.map((row, i) => {
            const key = row.stored + '|' + (row.zipEntry || '')
            return h('div', { className: 'wb-plan-row', key: i },
              h('span', { className: 'wb-plan-file', title: row.display }, row.display),
              h('span', { className: 'wb-dim' }, '→'),
              h('select', {
                className: 'wb-sel wb-plan-sel',
                value: targets[key] || '',
                onChange: (e) => {
                  const value = e.target.value
                  setTargets((prev) => Object.assign({}, prev, { [key]: value }))
                }
              }, (preview.folders || []).concat(targets[key] && preview.folders.indexOf(targets[key]) < 0 ? [targets[key]] : []).map((folder) => h('option', { key: folder, value: folder }, folder))))
          })),
        h('div', { style: { marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } },
          h('button', { className: 'wb-btn', onClick: () => setStep(2) }, t('intakeBack')),
          h('button', { className: 'wb-btn is-primary', disabled: busy === 'commit', onClick: commit }, busy === 'commit' ? t('intakeBusy') : t('intakeCommit')),
          notice ? h('span', { className: 'wb-alert', style: { margin: 0 } }, notice) : null)) : null

      return h('div', { className: 'wb-body', style: { flexDirection: 'column' } },
        h('div', { className: 'wb-col', style: { flex: '1 1 auto' } },
          h('div', { className: 'wb-col-h' }, steps),
          h('div', { className: 'wb-col-b' },
            step === 1 ? stepOne : step === 2 ? stepTwo : stepThree)))
    }

    function SearchOverlay(props) {
      const { t, data, onClose, onPick } = props
      const [query, setQuery] = useState('')
      const [index, setIndex] = useState(0)
      const cases = (data && data.cases) || []
      const clients = (data && data.clients) || []
      const results = []
      for (const item of cases) {
        results.push({ kind: 'case', id: item.id, label: item.name, sub: (item.caseNo || '') + ' · ' + (item.cause || '') + ' · 案件' })
        for (const file of item.outputs || []) results.push({ kind: 'file', rel: file.rel, name: file.name, label: file.name, sub: item.name + ' · 文件' })
      }
      for (const item of clients) {
        results.push({ kind: 'client', name: item.name, label: item.name, sub: '客户 · ' + (item.stage || '') })
        for (const file of item.files || []) results.push({ kind: 'file', rel: file.rel, name: file.name, label: file.name, sub: '客户 ' + item.name + ' · 文件' })
      }
      const key = query.trim().toLowerCase()
      const shown = (key ? results.filter((row) => (row.label + ' ' + row.sub).toLowerCase().indexOf(key) >= 0) : results).slice(0, 20)
      const pick = (row) => {
        if (!row) return
        onPick(row)
        onClose()
      }
      return h('div', { className: 'wb-overlay', onClick: (e) => { if (e.target === e.currentTarget) onClose() } },
        h('div', { className: 'wb-palette' },
          h('input', {
            className: 'wb-palette-input',
            autoFocus: true,
            value: query,
            placeholder: t('searchPlaceholder'),
            onChange: (e) => { setQuery(e.target.value); setIndex(0) },
            onKeyDown: (e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((n) => Math.min(n + 1, shown.length - 1)) }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((n) => Math.max(n - 1, 0)) }
              else if (e.key === 'Enter') { e.preventDefault(); pick(shown[index]) }
              else if (e.key === 'Escape') { onClose() }
            }
          }),
          h('div', { className: 'wb-palette-list' },
            shown.length
              ? shown.map((row, i) => h('div', {
                key: i,
                className: 'wb-palette-item' + (i === index ? ' is-on' : ''),
                onClick: () => pick(row),
                onMouseEnter: () => setIndex(i)
              },
                h('span', { className: 'wb-palette-label' }, row.label),
                h('span', { className: 'wb-dim' }, row.sub)))
              : h('div', { className: 'wb-dim', style: { padding: '14px' } }, t('searchEmpty'))),
          h('div', { className: 'wb-dim', style: { padding: '6px 12px', fontSize: '10px' } }, t('searchHint'))))
    }

    function Panel(props) {
      const { t, uiWorkspace } = props
      const [mode, setMode] = useState('cases')
      const [report, setReport] = useState(null)
      const [searchOpen, setSearchOpen] = useState(false)
      const [focusCase, setFocusCase] = useState('')
      const [focusClient, setFocusClient] = useState('')
      const [hideDemo, setHideDemo] = useState(() => {
        try {
          return window.localStorage.getItem('wbHideDemo') === '1'
        } catch (e) {
          return false
        }
      })
      const { state, load } = useData(t)
      useEffect(() => {
        const onKey = (e) => {
          if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault()
            setSearchOpen(true)
          } else if (e.key === 'Escape') {
            setSearchOpen(false)
          }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [])
      const viewData = useMemo(() => {
        if (!state.data || !hideDemo) return state.data
        return Object.assign({}, state.data, {
          cases: (state.data.cases || []).filter((item) => !item.demo),
          clients: (state.data.clients || []).filter((item) => !item.demo)
        })
      }, [state.data, hideDemo])
      const tabs = [
        ['cases', 'navCases', IconCases],
        ['clients', 'navClients', IconClients],
        ['intake', 'navIntake', IconIntake],
        ['tracks', 'navTracks', IconTracks],
        ['deliver', 'navDeliver', IconDeliver],
        ['deadlines', 'navDeadlines', IconDeadlines],
        ['settings', 'navSettings', IconSettings]
      ]
      let body = null
      if (report) body = h(ReportView, { t, report, onBack: () => setReport(null) })
      else if (mode === 'cases') body = h(CasesPane, { t, data: viewData, loading: state.loading, error: state.error, reload: load, uiWorkspace, onOpenReport: setReport, focusId: focusCase })
      else if (mode === 'clients') body = h(ClientsPane, { t, data: viewData, onOpenReport: setReport, uiWorkspace, reload: load, focusName: focusClient })
      else if (mode === 'intake') body = h(IntakePane, { t, data: viewData, reload: load, onGo: setMode })
      else if (mode === 'tracks') body = h(TracksPane, { t, data: viewData, reload: load, uiWorkspace })
      else if (mode === 'deliver') body = h(DeliverPane, { t, data: viewData, onOpenReport: setReport })
      else if (mode === 'deadlines') body = h(DeadlinesPane, { t, data: viewData })
      else body = h(SettingsPane, { t, data: viewData, loading: state.loading, reload: load })
      return h('div', { className: 'wb-root' },
        h('style', null, CSS),
        h('div', { className: 'wb-head' },
          h('div', { className: 'wb-title' }, t('navWorkbench')),
          h('div', { className: 'wb-tabs' }, tabs.map((pair) => h('button', {
            key: pair[0],
            className: 'wb-tab' + (mode === pair[0] ? ' is-on' : ''),
            onClick: () => setMode(pair[0])
          }, h(pair[2], { size: 14, active: mode === pair[0] }), h('span', null, t(pair[1]))))),
          h('div', { className: 'wb-spacer' }),
          h('label', { className: 'wb-dim', style: { display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginRight: '10px' } },
            h('input', {
              type: 'checkbox',
              checked: hideDemo,
              onChange: (e) => {
                const value = e.target.checked
                setHideDemo(value)
                try { window.localStorage.setItem('wbHideDemo', value ? '1' : '0') } catch (err) { /* ignore */ }
              }
            }),
            t('hideDemo')),
          state.loading ? h('span', { className: 'wb-dim' }, t('loading')) : null,
          h('button', { className: 'wb-btn', onClick: load }, t('refresh'))),
        body,
        searchOpen
          ? h(SearchOverlay, {
            t,
            data: viewData,
            onClose: () => setSearchOpen(false),
            onPick: (row) => {
              if (row.kind === 'case') { setFocusCase(row.id); setMode('cases') }
              else if (row.kind === 'client') { setFocusClient(row.name); setMode('clients') }
              else if (row.kind === 'file') { setReport({ rel: row.rel, name: row.name }) }
            }
          })
          : null)
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const locale = ctx.locale
        let uiWorkspace
        try {
          uiWorkspace = ctx.get('uiWorkspace')
        } catch (e) {
          uiWorkspace = undefined
        }

        ctx.effect(() => {
          const disposers = []
          const snapshot = locale.getLocale()
          const ids = snapshot && Array.isArray(snapshot.locales) ? snapshot.locales.map((item) => item.id) : []
          if (ids.length === 0) ids.push('zh')
          for (const id of ids) {
            const dict = /^zh/i.test(id) ? STRINGS.zh : STRINGS.en
            try {
              disposers.push(locale.register(NS, id, dict))
            } catch (e) {
              /* duplicate registration: a live dictionary already covers this locale */
            }
          }
          return () => {
            for (const dispose of disposers) dispose()
          }
        }, 'lawyer-workbench-dictionary')

        const t = locale.bind(NS)
        const Page = () => h(Panel, { t, uiWorkspace })
        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            { name: 'sidebar.panellist', id: 'lawyer-workbench', order: 40, label: () => t('navWorkbench') },
            IconCases
          )
        )
        ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'lawyer-workbench' }, Page))
      }
    }
  }
})
