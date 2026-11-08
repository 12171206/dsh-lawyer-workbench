# 律师工作台（dsh-lawyer-workbench）

DSH Web 左栏**一个入口「律师台」**，进去 6 个页签：案件 / 客户 / 赛道 / 交付 / 期限 / 设置。
数据全部来自案件文件夹与客户文件夹里的 markdown，不另存数据库。

## 它读什么

工作目录（默认 `C:\Users\you\Documents\律师工作目录`）：

| 目录 | 内容 |
|---|---|
| `案件-<编号>-<名称>/` | 按 `lawyer-case-workbench` 的 10 段目录组织 |
| `客户/<客户名>/` | 还没成案的咨询客户：聊天原文、诊断、决策材料、方案 |

| 界面字段 | 来源文件 |
|---|---|
| 案名/编号/客户/对方/案由/金额/管辖/承办 | `00-案件档案/案件基本信息.md` |
| 当前阶段、阶段进度、本阶段 Checklist | `00-案件档案/案件生命周期Checklist.md` |
| 期限与红灯 | `00-案件档案/期限与时效台账.md` |
| 交付包 22 项与六条红线 | `00-案件档案/律师交付包清单.md` |
| TF / E / IS 计数与断点 | `00-案件档案/案件台账.md` |
| 卡点天数、最后更新 | `07-程序记录/案件时间线.md` |
| 产出物列表 | `02-证据整理` 等 7 个业务目录 |
| 客户文件 | `客户/<客户名>/` 下的 `.md`（诊断/原文/决策材料/方案） |

## 六个页签

| 页签 | 内容 |
|---|---|
| 案件 | 案件列表 + 详情三栏（生命周期 / 下一步+Checklist / 期限+交付+产出） |
| 客户 | 客户列表 + 文件列表 → 点文件看渲染后的报告 |
| 赛道 | 8 条业务线 + 参考区；选阶段 → 功能卡 → 开跑 |
| 交付 | 草稿 / 已审 / 已导出 / 已交付 四列；点文件看报告 |
| 期限 | 今日逾期 / 本周 / 30 天，跨案件聚合 |
| 设置 | 工作目录、技能统计、参考区说明 |

## 转销 → 办案 → 售后（闭环）

```
线索(lead) → 已咨询(consulted) → 已方案(proposal) → 已报价(quoted) → 已成交(won) → 转成案件 → 办案 → 结案 → 回访/复购(served)
                                                                     ↘ 已失单(lost，必记原因码)
```

- **客户台顶部**：6 段转化漏斗（数量），点数字筛选客户列表
- **每个阶段一个默认动作**（开跑即执行）：
  线索→3 分钟首响（lead-ops）／已咨询→三档方案（consult-diagnose）／已方案→报价（deal-close）／已报价→异议处理（deal-close）／已成交→转案件／已失单→原因复盘（followup-grow）
- **阶段可手动改**：下拉切换，写入 `客户/<名>/线索.md` 并追加 `跟进记录.md`；失单必须填原因码
- **转成案件**：一键建 `案件-<编号>-<名称>/`（10 个目录 + 9 个模板已填好 + 时间线首行），客户阶段自动改 won
- **售后待办**：结案案件里没有 `08-结案归档/回访记录.md` 的，在客户台右栏列出，一键生成回访（followup-grow）
- **开跑提示词**：带该技能 `SKILL.md` 的绝对路径，未安装的技能也能让模型直接读文件执行

## 上传材料（降低学习成本）

客户台右栏常驻一块上传区：

- **拖拽**任意聊天截图/txt/md 到虚线框 → 默认存为「聊天记录」
- **上传聊天记录 / 上传谈案材料** 两个按钮各带一个文件选择器
- **粘贴框**：整段微信文字粘进去 → 「粘贴保存为聊天记录」
- **上传后自动询问**：已上传 / 现在生成诊断 / 识别截图文字 / 稍后
- **截图 OCR（离线）**：用 Windows 自带 OCR（zh-Hans），把 `聊天截图-*.png` 识别成 `聊天原文-OCR-日期.md`；自动去掉汉字间空格、修正常见误识别（如把 `-` 认成 `一`）
- **邀约铺垫卡**：客户台右栏常驻。自动从聊天诊断里抽出「他说过的原话」，三版铺垫草稿（用他的话 / 给一份东西 / 带家人），可改可复制；第一次见面只提"给什么"，不提委托、价格、保证
- **材料清单**：聊天记录 / 诊断 / 方案 / 报价单 / 决策材料，缺哪项直接给按钮（上传、识别或生成）
- 文件落进 `客户/<名>/`，命名自动规范化（`聊天截图-20261108-01.png`、`聊天记录-20261108.md`）

## 演示样本（`_演示/`）

| 客户 | 阶段 | 用来验证什么 |
|---|---|---|
| 王先生 | 线索 | 首轮响应 |
| 周女士 | 已咨询 | 诊断已出、待方案 |
| 张女士 | 已方案 | 方案已出、待报价 |
| 李女士 | 已报价 | 比价 + 家人决策 + 想自己办 |
| **陈先生** | 已报价 | **复杂样本**：48 条聊天、五类顾虑全中、对方律师函、和解时限、风险代理、多次反悔 |
| 某科技公司 | 已成交 | 转案件 |
| 赵先生 | 已失单 | 原因码复盘 |

案件侧：`2025-088` 已结案未回访（售后排期）、`2026-014` 导出未审、`2026-015` 审查 PASS。

## 防坑校验（v3）

| 校验 | 规则 | 界面表现 |
|---|---|---|
| **交付状态** | 不再按文件名猜：`.docx/.pdf` 只有在 `00-案件档案/出稿前审查报告.md` 的 `review_status` 含 PASS 时才算"已导出"；否则标 `exported_unreviewed` | 交付台右上红字"N 份文书已导出但没过出稿前审查"，行内标"未过审查" |
| **期限完整性** | 台账 8 项里统计有截止日的项数，<3 项判定"红灯不会亮" | 案件台中间黄条提示 `2/8 项有截止日` |
| **演示隔离** | 只扫根目录 + `_演示/`；`_演示/` 下的一律带 `demo: true` | 卡片与详情显示「演示」标 |
| **售后排期** | 结案案件按 30/90/365 天算下一个触点与日期；`daysSinceClose ≥ 30` 且无回访记录 = 逾期 | 客户台右栏显示"结案 49 天 · 建议 90 天回访（2026-12-18）· 已过建议时间" |
| **脱敏** | 报告视图一键生成 `.脱敏.md`（手机/身份证/银行卡/邮箱/微信号），返回命中数 | 报告标题栏「生成脱敏副本」 |
| **建档向导** | 三步：选类型（客户/案件）→ 按槽位上传（聊天记录/证据/法院文书/文书草稿/类案/zip）→ 预览归档位置并确认 | 「建档」页签；zip 自动展开、逐条归类；确认后自动建 10 段目录或客户档案 |
| **报价单** | 三档价格 → 生成客户可读报价单 md（三档服务、不含项、付款、风险告知、下一步） | 客户台「生成报价单」→ **卡内三联输入框**（不再弹 3 个对话框）→ 直接进报告视图可导出 HTML |
| **期限完整性（v4）** | 只统计"适用"行（排除 `— 不适用`），避免模板行让黄条永远亮 | 案件台黄条显示 `2/7 项有截止日`，填满就不再提示 |
| **每日备份（v4）** | 每天首次激活自动 zip 到 `_备份/日期.zip`，保留 7 天；设置页可手动备份 | 设置页显示"最近备份：日期（大小）"+「立即备份」 |
| **赛道阶段过滤（v4）** | 每张功能卡标注所属阶段；阶段条最左加「全部」，选阶段即过滤 | 选"取证"只显示取证阶段卡片 |
| **操作日志（v5）** | 勾选/阶段变更/转案/归档/导出/脱敏/备份都写 `_系统记录/操作日志.md` | 事后可查谁在何时改了什么 |
| **线索增量更新（v5）** | 改阶段只改字段行，不再整文件重写 | 手写备注、附加字段不会被覆盖 |
| **补到已有（v5）** | 建档支持「补到已有案件/客户」，不新建目录 | 中途收到的材料直接归档到原案卷 |
| **演示过滤（v5）** | 页头「隐藏演示」开关，记住偏好 | 真实数据不被 `_演示` 污染 |
| **体检（v5）** | 设置页显示工作目录/案件模板/待归档批次/操作日志状态 | 出问题先看这里 |
| **导出 Word（v6）** | 报告视图「导出 Word」→ md 转 `.docx`（标题/表格/列表/引用/加粗），同目录生成 | 发给客户/法院前的可编辑版本 |
| **模板级排版（v6.1）** | A4＋公文页边距（上 3.7 / 下 3.5 / 左 2.8 / 右 2.6 cm）、正文仿宋三号 28 磅行距、首行缩进 2 字、标题小标宋二号居中、表格宋体小四、页脚页码；配置 `firmName` 可加红头 | Word 打开即接近可交付版式 |
| **批量导出（v6.1）** | 案件台右上「批量导出 Word」→ 该案所有实质 md 转 docx（自动跳过基本信息/台账/Checklist 等模板文件） | 一个案子 8 份文书一次出完 |
| **期限日历（v6）** | 期限台「导出日历 (.ics)」→ 写 `_日历/期限提醒-日期.ics`（期限 + 售后回访） | 导入 Outlook/Apple/飞书日历，手机也能提醒 |
| **Ctrl+K 搜索（v6）** | 页头任意处按 Ctrl/Cmd+K，搜案件/客户/文件，↑↓ 选择、Enter 打开 | 案子多了不用翻列表 |
| **窄屏堆叠（v6）** | <1180px 时三栏改为纵向堆叠（右栏不再消失） | 小屏笔记本也能用 |
| **zip 保留层级（v6）** | zip 内子目录保留在归类文件夹下（自动剥掉公共根目录） | 深目录材料能看出原始结构 |

## 报告：可视化 + 导出

- 点客户文件或交付台文件 → 进入**报告视图**：markdown 渲染成文档（标题层级、表格、引用块、清单全部排版）
- **导出 HTML**：在同一目录生成同名 `.html`（内嵌样式，A4 打印样式），浏览器打开后 Ctrl+P 即可存 PDF
- 渲染器与导出共用同一份 CSS：屏幕上看到的就是导出文件的内容

## 路由（Host）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/lawyer-workbench/api/all` | 全部案件 + 客户 + 技能目录（67 中文 / 150 参考） |
| GET | `/lawyer-workbench/api/case?id=` | 单案 |
| GET | `/lawyer-workbench/api/file?path=` | 读一个 md/txt/html（限定在 caseRoot 内，拒绝 `..`） |
| POST | `/lawyer-workbench/api/save-html` | `{path, html}` 写导出文件（限 caseRoot 内、限 .html、≤4MB） |
| POST | `/lawyer-workbench/api/client-open` | `{name, action}` 客户动作 → 建会话（提示词带技能文件绝对路径） |
| POST | `/lawyer-workbench/api/client-stage` | `{name, stage, reason?}` 改线索阶段 + 追加跟进记录 |
| POST | `/lawyer-workbench/api/convert-case` | `{name, caseId, caseName, lawyer}` 客户转案件（建 10 段目录 + 9 模板 + 回写线索） |
| POST | `/lawyer-workbench/api/quote` | `{name, basic, recommended, full}` 生成三档报价单 md |
| POST | `/lawyer-workbench/api/desensitize` | `{path}` 生成 `.脱敏.md`（手机/身份证/银行卡/邮箱/微信号） |
| POST | `/lawyer-workbench/api/client-create` | `{name}` 新建客户目录 + 线索档案（阶段 lead） |
| POST | `/lawyer-workbench/api/upload?name=&kind=&filename=` | 原始字节上传（≤25MB）：截图自动命名 `聊天截图-日期-序号`，聊天文本自动命名 `聊天记录-日期` |
| POST | `/lawyer-workbench/api/upload-text` | `{name, text, filename?}` 粘贴的聊天文字直接落盘 |
| POST | `/lawyer-workbench/api/ocr` | `{name, files?}` 离线 OCR 截图 → `聊天原文-OCR-日期.md`（Windows OCR，zh-Hans） |
| POST | `/lawyer-workbench/api/open` | `{caseId, actionId}` 或 `{caseId, action:{...}}` → 建会话 + 投喂提示词 |
| POST | `/lawyer-workbench/api/check` | 切换 Checklist 勾选 + 追加时间线 |
| POST | `/lawyer-workbench/api/intake/begin` | `{kind:client\|case, name, caseId?, caseName?, lawyer?, cause?, stage?}` → 批次号 + 槽位 |
| POST | `/lawyer-workbench/api/intake/upload?batch=&slot=&filename=` | 原始字节（≤80MB，支持 `.zip`） |
| GET | `/lawyer-workbench/api/intake/preview?batch=` | 分类计划：文件 → 目标文件夹（zip 展开为多条） |
| POST | `/lawyer-workbench/api/intake/commit` | `{batch}` 建目录/解压/移文件，返回 base |
| POST | `/lawyer-workbench/api/intake/remove` | `{batch, stored}` 移除已传文件 |
| POST | `/lawyer-workbench/api/backup` | 立即备份整个工作目录 |
| POST | `/lawyer-workbench/api/export-docx` | `{path}` md → 同目录 `.docx`（python-docx） |
| POST | `/lawyer-workbench/api/export-ics` | 生成 `_日历/期限提醒-日期.ics`（期限 + 售后回访） |

「开跑」创建的会话**工作区 = 案件根目录**，模型直接读写案卷；主会话不受影响。

## 已验证

- `/api/all`：3 个案件 + 5 个客户（lead / proposal / quoted / won / lost 各就位）；结案案件识别为 `closed:true, daysSinceClose:49, 未回访`
- 客户阶段写回：`王先生 lead → consulted` 成功，`线索.md` 与 `跟进记录.md` 同步更新
- 客户转案件：建出 `案件-2099-001-测试案`（10 目录 + 9 模板），基本信息/台账/时间线填好，线索改 won；验证后已清理
- `/api/file` 读取成功；`../../secret.md` 被 `BAD_PATH` 拦截；`/api/save-html` 写入后核验并清理
- markdown 渲染器对真实诊断稿：3 个表格、9 个二级标题、3 个引用块、17 处加粗、无残留管道符
- 左栏注册 1 个入口、主区注册 1 个面板（inspect 显示 active）
- 无浏览器用 React 替身渲染主面板通过

## 已知边界

- 导出只有 HTML（打印成 PDF）；docx 导出留给 P2 接 `legal-doc-template-export`
- 报价单是固定模板 + 手填三档价；没有按案由/标的自动算价
- 售后只算 30/90/365 三个点，没有回访排期表与提醒
- 操作日志只记录通过工作台做的动作；直接用命令行改文件不会留痕
- 改 `index.js` 后需 `remove_bundle` + `install_bundle`；只改 `client.js` 刷新页面即可

## 配置

`cordis.patch.yml`：

```yaml
- insert:
    - id: lawyer-workbench
      name: '@local/dsh-lawyer-workbench'
      config:
        caseRoot: 'C:\Users\you\Documents\律师工作目录'
        catalogPath: '...\catalog.json'
        sessionWorkspace: 'C:\Users\you\Documents\律师工作目录'
        python: 'C:\Users\you\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe'
        firmName: '某某律师事务所'   # 为空则不生成红头
```
