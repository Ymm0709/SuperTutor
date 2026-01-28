// 翻译文本
const translations = {
  zh: {
    // App
    reset: '重置',
    visualModel: 'Visual Model',
    skip_button: '跳过',
    skip_modal_title: '跳过验证',
    skip_modal_desc: '做对以下 3 道题，可直接跳过 Visual Model，进入下一页。（一次机会）',
    skip_modal_exit: '退出',
    skip_modal_submit: '提交',
    skip_modal_need_all: '请先完成 3 道选择题。',
    skip_modal_wrong: '还有题目不正确，请检查高亮提示后再提交。',
    skip_modal_one_wrong: '这题选错了，再检查一遍。',
    skip_modal_fail_inline: '错题：{list}（红框已标出）。跳过功能将被禁用，请完成 Visual Model 才能进入下一页。',
    skip_modal_pass_inline: '✅ 三题全对！你可以点击「进入下一页」直接跳过 Visual Model。',
    skip_modal_continue: '进入下一页',
    skip_locked_hint: '跳过已禁用：请完成 Visual Model 才能进入下一页。',

    skip_q1_title: '题目 1',
    skip_q1_code: `x ← 0
y ← 1

FOR EACH value IN inputList
{
    IF (value MOD 2 = 0)
    {
        x ← x + y
    }
    y ← y + 1
}`,
    skip_q1_question: `程序运行时，inputList 为 [2, 4, 5, 6]。\n程序结束后，变量 x 和 y 的值是多少？`,
    skip_q1_opt_A: 'A. x = 6, y = 5',
    skip_q1_opt_B: 'B. x = 7, y = 5',
    skip_q1_opt_C: 'C. x = 8, y = 5',
    skip_q1_opt_D: 'D. x = 9, y = 4',

    skip_q2_title: '题目 2',
    skip_q2_code: `count ← 0
total ← 0

FOR EACH number IN inputList
{
    IF (number MOD 3 = 0)
    {
        count ← count + 1
        total ← total + number
    }
}

IF (count > 0)
{
    average ← total / count
}
ELSE
{
    average ← 0
}`,
    skip_q2_question: `程序运行时，inputList 为 [3, 5, 6, 7, 9]。\n哪一项最准确地描述程序结束时变量 count、total 和 average 的值？`,
    skip_q2_opt_A: 'A. count = 3, total = 18, average = 6',
    skip_q2_opt_B: 'B. count = 2, total = 18, average = 9',
    skip_q2_opt_C: 'C. count = 3, total = 18, average = 0',
    skip_q2_opt_D: 'D. count = 5, total = 30, average = 6',

    skip_q3_title: '题目 3',
    skip_q3_code: `count ← 0
sum ← 0

FOR EACH number IN inputList
{
    IF (number > 4)
    {
        count ← count + 1
        sum ← sum + number
    }
    ELSE
    {
        count ← 0
    }
}

IF (count > 0)
{
    result ← sum / count
}
ELSE
{
    result ← -1
}`,
    skip_q3_question: `程序运行时，inputList 为 [6, 2, 8, 3, 10]。\n程序结束后，count、sum 和 result 的值分别是多少？`,
    skip_q3_opt_A: 'A. count = 3, sum = 24, result = 8',
    skip_q3_opt_B: 'B. count = 1, sum = 24, result = 24',
    skip_q3_opt_C: 'C. count = 2, sum = 18, result = 9',
    skip_q3_opt_D: 'D. count = 0, sum = 24, result = -1',
    
    // Home
    homeTitle: 'CSP Super Tutor',
    homeSubtitle: 'Variables & Assignment（变量与赋值）Interactive Practice',
    homeDesc: '你将在可视化模型的帮助下，练习关键知识点：',
    start: 'START',
    
    // TeachingLoop
    continuousCorrect: '连续答对：',
    question: 'QUESTION',
    waiting: '（等待开始…）',
    submit: '提交',
    hint: 'HINT',
    answer: '答案',
    answerRevealRemaining: '剩余 {count} 次',
    noHintAvailable: '暂无提示',
    nextQuestion: '下一题',
    startText: '开始',
    hintAndCorrection: '提示与修正',
    shortExplanation: '短讲解',
    clickNextToStart: '点击"下一题"开始。',
    youMayBeStuckOn: '你这次可能卡在：',
    keyIdea: 'Key idea',
    hintLabel: 'Hint',
    analogy: 'Analogy',
    placeholder: '在这里输入答案',
    number: '数字',
    
    // Visualization
    interactiveVariableModel: 'Interactive Variable Model',
    boxModelTitle: '盒子模型训练',
    dragModelTitle: '拖拽变量实验室',
    dragToCode: '拖拽值到代码中的变量进行赋值。赋值会覆盖旧值。',
    clickToEditVariables: '点击变量值进行编辑，或使用下方的运算面板进行操作。',
    draggableValues: '可拖拽的值',
    variables: 'Variables',
    variableHistory: '变量变化历史',
    expandChart: '放大图表',
    shrinkChart: '缩小图表',
    clickToAddVariable: '点击下方添加变量',
    empty: '（空）',
    operationTitle: '变量运算演示',
    clickToEdit: '点击编辑',
    variable: '变量',
    execute: 'Execute',
    step1: 'Step 1',
    step2: 'Step 2',
    step3: 'Step 3',
    readValue: '读取 {var} 的值 = {value}',
    calculate: '计算 {var} {op} {operand}',
    storeResult: '将结果存回 {var}',
    step1Explanation: '（从存储格中读取当前值）',
    step2Explanation: '（在 CPU 中计算新值，不改变存储格）',
    step3Explanation: '（把计算结果写回存储格，覆盖旧值）',
    resetAll: 'Reset All',
    keyConcept: '关键概念：',
    assignmentOverwrites: '赋值会覆盖。拖拽新值到变量时，旧值会被替换（不是累加）。',
    operationHistory: '操作历史：',
    storageSpace: '{bytes} 字节存储空间',
    runDemo: '运行演示：x=10, y=x, x=5',
    demoTitle: '演示：为什么 y = x 后，x 改变但 y 不变？',
    demoStep1: '步骤 1: x ← 10（把 10 存储到 x 的存储格中）',
    demoStep2: '步骤 2: y ← x（读取 x 当前的值 10，复制到 y 的存储格中）',
    demoStep3: '步骤 3: x ← 5（把 5 存储到 x 的存储格中，覆盖原来的 10）',
    demoConclusion: '关键理解：y ← x 是「复制值」，不是「绑定关系」。y 存储的是执行 y ← x 时 x 的值（10），之后 x 改变不会影响 y。',
    executionReading: '正在读取变量值...',
    executionCalculating: '正在计算...',
    executionStoring: '正在存储结果...',
    typePanelTitle: 'AP 变量类型 与 可存储空间',
    typeDemoTitle: '变量类型与存储空间演示',
    typeDemoSubtitle: '了解不同类型的变量如何占用不同的存储空间',
    demoTypeStep1Title: 'int 类型（整数）',
    demoTypeStep1Desc: 'int 类型占用 4 个字节的存储空间，可以存储整数，例如：42。适合存储考试分数、计数器等整数值。',
    demoTypeStep2Title: 'double 类型（小数）',
    demoTypeStep2Desc: 'double 类型占用 8 个字节的存储空间，可以存储带小数点的实数，例如：3.14159。精度更高，但占用空间也更大。',
    demoTypeStep3Title: 'String 类型（字符串）',
    demoTypeStep3Desc: 'String 类型占用的存储空间取决于字符串的长度。例如 "hello" 占用 5 个字节（每个字符 1 字节）。用来存储文本信息，如姓名、消息等。',
    demoTypeStep4Title: 'boolean 类型（真/假）',
    demoTypeStep4Desc: 'boolean 类型只需要 1 个字节的存储空间，只能存储 true 或 false。用于存储条件判断的结果。',
    typeDemoSummary: '变量类型总结',
    typeTreeTitle: '总览：variable 的四种常见类型',
    typeTreeDesc: 'variable 可以分成以下四种类型：int 用来存整数，占 4 字节；double 用来存小数，占 8 字节；String 用来存文本（如 "hello"），占用的字节数等于字符数；boolean 用来存 True / False 的判断语句结果，占 1 字节。理解类型，就是理解这个变量这块存储格打算装什么样的数据、占多大空间。',
    typeTreeStepLabel: '类型总览',
    showTimeline: '显示时间轴可视化',
    hideTimeline: '隐藏时间轴可视化',
    timelineScenario1Title: '场景 1: x = x + 1 为什么成立？',
    timelineScenario1Desc: '展示 x = x + 1 的执行过程：读取 x 的值 → 计算 x + 1 → 将结果写回 x',
    timelineScenario1Short: 'x = x + 1',
    timelineScenario2Title: '场景 2: x = 10, y = x, x = 5 后 y 是多少？',
    timelineScenario2Desc: '展示变量赋值和复制的执行过程，理解为什么 y 的值不会因为 x 的改变而改变',
    timelineScenario2Short: 'x=10, y=x, x=5',
    timelineStep1_1: '初始状态：x = 5',
    timelineStep1_2: '步骤 1：读取 x 的当前值（5）',
    timelineStep1_3: '步骤 2：在 CPU 中计算 5 + 1 = 6',
    timelineStep1_4: '步骤 3：将计算结果（6）写回 x 的存储格，覆盖旧值',
    timelineStep2_1: '初始状态：x 和 y 都是空的',
    timelineStep2_2: '步骤 1：将 10 存储到 x 的存储格中',
    timelineStep2_3: '步骤 2：读取 x 的当前值（10）',
    timelineStep2_4: '步骤 3：将读取的值（10）复制到 y 的存储格中',
    timelineStep2_5: '步骤 4：将 5 存储到 x 的存储格中，覆盖原来的 10',
    timelineStep2_6: '最终结果：x = 5, y = 10（y 的值不会改变，因为它是复制值，不是绑定）',
    play: '播放',
    prev: '上一步',
    next: '下一步',
    step: '步骤',
    close: '关闭',
    minimize: '最小化',
    minimizeTimeline: '最小化时间轴',
    timelineMinimized: '时间轴可视化',
    minimizeTypeDemo: '最小化类型演示',
    typeDemoMinimized: '变量类型演示',
    typePanelIntro: '在 AP CS A 中，每个变量都有「类型」，不同类型的变量对应着不同大小的存储格，可以容纳的数值精度和范围也不同（右边的条越长，占用的存储空间越大）：',
    type_int_title: 'int 整型（整数）',
    type_int_desc: '大约占 4 个字节，常用来存储考试分数、计数器等整数。范围很大，但不能存小数。',
    type_double_title: 'double 浮点型（小数）',
    type_double_desc: '大约占 8 个字节，能存带小数点的实数，精度比 int 更高，但也会有舍入误差。',
    type_boolean_title: 'boolean 布尔型（真/假）',
    type_boolean_desc: '只表示 true 或 false，本质上只需要非常小的一块存储空间，用来存储条件判断结果等逻辑值。',
    
    // Box model
    box_subtitle: '用「盒子模型」理解变量：变量是一只带名字的盒子，赋值是往盒子里放卡片或换卡片。',
    box_code_title: '代码',
    box_boxes_title: '变量盒子（x 盒子 / y 盒子）',
    box_boxes_predict_hint: 'Step 1：预测 —— 先不要执行，只用盒子模型想一想：程序跑完以后，每个盒子里会留下什么卡片？',
    box_predict_title: 'Step 1：预测',
    box_predict_text: '执行下面代码后，盒子里会是什么？请预测程序执行结束后，x 盒子和 y 盒子里最后各自会留下什么数字。',
    box_predict_arrow: '：',
    box_predict_placeholder: '请输入一个数字',
    box_boolean_placeholder: '请选择 true / false',
    box_start_execute: 'Step 2：开始执行动画',
    box_execute_title: 'Step 2：执行动画',
    box_execute_intro: '一行一行动画执行，观察数字是如何“被拿出来”“被放进盒子”“覆盖旧卡片”的。',
    box_execute_line: '正在执行：{line}',
    box_go_compare: 'Step 3：去对比预测',
    box_compare_title: 'Step 3：对比反馈',
    box_predicted: '你预测的值',
    box_actual: '实际盒子里的值',
    box_feedback_correct_title: '✅ 预测正确！',
    box_feedback_correct_text: '你已经在用正确的「盒子模型」思考：x 和 y 是两只独立的盒子，y = x 这一行只是把那一刻 x 盒子里的卡片复制一份放进 y 盒子。之后再给 x 换成 5，不会自动去改 y。',
    box_feedback_shared_box_title: '❌ 你把变量当成“共用同一只盒子”了',
    box_feedback_shared_box_text: '你的答案里，y 跟着 x 一起变，就像脑中是一只盒子上贴了两个名字标签。正确的盒子模型是：x 和 y 各有一只盒子，y = x 只是把那一刻 x 里的卡片复制一份放进 y，以后给 x 换卡片，不会回头去改 y。',
    box_feedback_generic_title: '❌ 可以再用盒子顺一遍执行过程',
    box_feedback_generic_text: '按顺序用盒子想一遍：每一行只会动「左边那只盒子」。右边只是“读出当前卡片上的数字”，不会改盒子本身。先问：这一行要往哪只盒子里放/换卡片？再看：读的是哪只盒子里的当前卡片？',
    box_scenario_label: '场景 {label}',
    box_scenario_a: '场景 A：先把 3 放进 x，再把那张卡片抄一份放进 y，最后给 x 换成 5。',
    box_scenario_b: '场景 B：先给 y 放 7，但最后一行 y = x 会用 x 里的卡片覆盖 y 里的 7。',
    box_scenario_c: '场景 C：先给 x 放 1，再用「当前的 x+1」填入 y，最后再给 x 自己 +1。',
    box_scenario_d: '场景 D：先把 4 放进 x，再复制到 y，再复制到 z，最后只给 x 换成 9，y 和 z 不会自动跟着变。',
    box_scenario_e: '场景 E：布尔盒子 bigger 里装的是一次判断 x > y 的 True/False 结果，而不是两个盒子之间的“连接”。',
    box_type_int: '整数（如分数、计数器），大约 4 字节。',
    box_type_double: '带小数点的实数（如平均分），大约 8 字节。',
    box_type_string: '文本（如 "hello"），长度越长占用越多空间。',
    box_type_boolean: '判断语句的 True/False 结果，占用空间最小。',
    box_next_scenario: '下一题',
    box_free_play: '已通关，继续自由练习这一题',
    box_all_done_title: '✅ 你已经通关所有盒子场景！',
    box_all_done_text: '现在你可以自由修改预测，再用「盒子模型」反复练习。也可以回到上方题目区，用同样的思路追踪更难的变量题。',
    box_progress_title: '小盒子进度',
    box_drag_subtitle: '拖拽值卡片或变量盒子，练习赋值与复制。',
    box_drag_pool_title: '操作区',
    box_drag_boxes_title: '变量舞台',
    box_drag_read_zone: '读取区（把变量盒子拖到这里）',
    box_drag_ghost_title: '历史记录',
    box_drag_ghost_empty: '（还没有产生代码行）',
    trace_expand: '打开时间轨迹',
    trace_collapse: '收起时间轨迹',
    trace_empty: '还没有轨迹：先做一次拖拽操作。',
    trace_click_to_restore: '点开这一段：盒子回到当时状态',
    box_drag_var_tokens_title: '变量卡片',
    box_drag_value_tokens_title: '数值卡片',
    box_drag_var_token_hint: '拖到另一个变量盒子上：复制值',
    box_drag_var_token_need_value: '这个变量目前是空的：先给它放一个值',
    box_drag_copied_from: '复制自 {from}',
    box_drag_expand: '展开',
    box_drag_collapse: '收起',
    box_drag_detail_value: 'value',
    box_drag_detail_type: 'type',
    box_drag_detail_step: 'last updated',
    box_drag_detail_step_none: '尚未更新',
    box_drag_detail_step_value: 'step {step}',
    box_drag_detail_source: 'source',
    box_drag_detail_source_none: '（直接赋值或尚未记录）',
    box_drag_sim_title: '变量舞台',
    box_drag_sim_intro: '拖拽值卡片或变量盒子，练习赋值、复制与覆盖。',
    box_drag_sim_empty: '目前没有操作记录。',
    box_drag_hint: '拖值卡片到变量盒子=赋值；拖变量盒子到另一个盒子=复制值。',
    box_drag_feedback_updated: '已更新变量盒子。',
    box_drag_feedback_copied: '已复制值到目标盒子。',
    box_drag_put_in: '→ 放入目标盒子',
    box_drag_overwrite: '→ 覆盖旧卡片（旧值被替换）',
    box_drag_stmt_assign: '对应语句：{left} ← {right}',
    box_drag_stmt_copy: '对应语句：{left} ← {right}',
    box_drag_step_open: '→ 打开 {name} 盒子',
    box_drag_step_take: '→ 从 {name} 盒子取出当前值 {value}',
    box_drag_step_copy: '→ 复制一份值（不是共享盒子）',
    box_drag_step_put: '→ 把 {value} 放进 {name} 盒子',
    box_drag_restart: '重新开始所有拖拽练习',
    box_drag_input_placeholder: '输入一个值，例如 42, 3.14, "hi", true',
    box_drag_input_generate: '生成一个值卡片',
    box_drag_input_error_empty: '请先输入一个值。',
    box_drag_input_type_info: '你刚刚生成的是一个 {type} 类型的值卡片。',
    box_drag_mode_title: '模式选择',
    box_drag_mode_guided: '引导模式（带提示）',
    box_drag_mode_exam: '考试模式（更少提示）',
    box_drag_ops_title: '常用操作',
    box_drag_stage_title: '变量舞台',
    box_drag_drop_hint: '把值卡片或变量盒子拖到变量上即可赋值/复制。',
    box_drag_history_title: '历史记录',
    box_drag_history_empty: '暂无记录：拖拽一次就会出现一条记录。',
    box_drag_history_clear: '清空记录',
    box_drag_type_examples_title: '类型示例',
    box_drag_type_int_example: '例如：42, -7, 0',
    box_drag_type_double_example: '例如：3.14, -0.5',
    box_drag_type_string_example: '例如："hello", "score"',
    box_drag_type_boolean_example: '例如：true, false',
    box_drag_type_boolean_note: '注意：true / false 是 boolean 专用（不要把它当成字符串）。',
    
    // Questions - Level 1
    q1_prompt: '执行下面的赋值语句后，variable {var} 的值是多少？（只输入一个数字）',
    q1_statement: '语句：',
    q1_inputHint: '例如：5',
    q1_misconception_equals: '把赋值当成等号/判断',
    q1_feedback_equals: '你输入了"="。这里的 ← 表示把右边的值写进左边的 variable，不是在判断对不对。',
    q1_misconception_name: '把变量当成名称而不是盒子',
    q1_feedback_name: '看起来你没有给出一个数字。题目问的是"这个 variable 的值"。',
    q1_reteach_title: '核心模型：variable 就是一个"有名字的存储位置"',
    q1_reteach_text: '赋值语句 x ← 5 的含义是：把 5 写进名为 x 的 variable 里。原来是什么（甚至是空的）都会被覆盖成 5。',
    q1_reteach_analogy: '像给贴着"x"标签的抽屉里放入一张写着"5"的卡片。放进去以后，这个 variable 的值就是 5。',
    q1_reteach_hint: '只需要回答"赋值后这个 variable 里是什么数字"。',
    q1_visual_arrow: '把右边的值 {value} 复制进左边的 variable：{var}',
    
    // Questions - Level 2
    q2_prompt: '变量可以被"重新赋值"。请回答执行完两句后，{var} 的最终值是多少？（只输入一个数字）',
    q2_misconception_ignore: '忽略了覆盖/以为第一次赋值永久有效',
    q2_feedback_ignore: '你像是停在了第一句。第二句会把这个 variable 里旧的值覆盖掉。',
    q2_misconception_order: '跟踪执行顺序不稳',
    q2_feedback_order: '再按顺序执行一遍：先放 {a}，再放 {b}。最终盒子里只会留下最后一次放入的值。',
    q2_visual_arrow: '第二次赋值会覆盖第一次：{var} 先变成 {a}，再变成 {b}',
    q2_reteach_title: '赋值=覆盖盒子里的内容（按顺序执行）',
    q2_reteach_text: '程序从上到下执行。每次赋值都会把"左边 variable 当前的值"替换成右边的新值（last assignment wins）。',
    q2_reteach_analogy: '像白板上写数字：先写 {a}，后面再写 {b}，最后看到的是 {b}。',
    q2_reteach_hint: '抓住关键：最终值由"最后一次对它赋值的语句"决定。',
    
    // Questions - Level 3
    q3_prompt: '请跟踪这段程序执行完后的结果，分别写出 x 和 y 的最终值。',
    q3_format: '要求格式：x:数字,y:数字（中间用逗号）',
    q3_inputHint: '例如：x:10,y:5',
    q3_misconception_format: '格式错误',
    q3_feedback_format: '请按格式输入：x:数字,y:数字（例如 x:10,y:5）。',
    q3_misconception_binding: '以为 y 跟着 x 变化（把复制当成绑定/引用）',
    q3_feedback_binding: '你把 y 也写成了后来的 x 值。y ← x 是把当时的 x 值复制到 y 这个 variable 里；之后 x 再变，不会回头改变 y。',
    q3_misconception_track: '执行跟踪不稳',
    q3_feedback_track: '一步一步：先 x=初值，再把 x 的值复制到 y，最后 x 被改成新值。y 不会被最后一句影响。',
    q3_visual_arrow: '关键：y ← x 是"复制 x 当下的值 {x0} 到 y"。之后 x 变成 {x1}，y 仍是 {x0}',
    q3_reteach_title: 'y ← x：复制"此刻的值"，不是建立"绑定关系"',
    q3_reteach_text: '把右边这个 variable 里"当前看到的数字"复制一份，写进左边的 variable。复制完成后，这两个 variable 互不影响。',
    q3_reteach_analogy: '像抄作业：你把 x 现在写的数字抄到 y 的纸上。之后 x 改了，不会自动改你的 y 那张纸。',
    q3_reteach_hint: '先回答：执行到 y ← x 那一行时，x 是多少？那就是 y 的最终值（除非后面又给 y 赋值）。',
    
    // Questions - Level 4
    q4_prompt: '下面的三句想实现"交换 x 和 y"。请写出执行完后的 x 和 y 最终值。',
    q4_format: '要求格式：x:数字,y:数字',
    q4_initial: '初始：x={x0}, y={y0}',
    q4_inputHint: '例如：x:6,y:1',
    q4_feedback_format: '请按格式输入：x:数字,y:数字。',
    q4_misconception_temp: '忽略临时变量/覆盖导致丢值',
    q4_feedback_temp: '你把 y 也写成了 {y0}，像是丢了 {x0}。没有 temp 的话会覆盖丢失；temp 的作用是先把 {x0} 暂存到另一个 variable 里。',
    q4_misconception_swap: '交换跟踪不稳',
    q4_feedback_swap: '按顺序写盒子：temp 先拿到 {x0}；x 改成 {y0}；最后 y 从 temp 取回 {x0}。',
    q4_visual_arrow: 'temp 先"保管"旧的 x={x0}，避免被 x ← y 覆盖丢失；最后 y 从 temp 取回',
    q4_reteach_title: '为什么需要 temp：避免"覆盖丢值"',
    q4_reteach_text: '赋值会覆盖。若直接 x ← y，再做 y ← x，你会把旧 x 覆盖掉，导致两边都变成同一个值。temp 用来暂存旧值。',
    q4_reteach_analogy: '像交换两杯水：需要一个空杯子临时倒一下，否则先倒的一杯会把另一杯覆盖混掉。',
    q4_reteach_hint: '先问自己：执行完第一句 temp ← x 后，temp 里是什么？接着 x 改成什么？最后 y 从哪里拿？',
    
    // Teaching text
    teaching_base: '看左侧可视化：左边是"赋值前"，右边是"赋值后"。箭头说明：把右边的值复制进左边变量盒子。',
    teaching_l1: '本题只需要读懂：x ← 5 就是"x 盒子里变成 5"。',
    teaching_l2: '本题强调：后面的赋值会覆盖前面的值，最终以"最后一次赋值"为准。',
    teaching_l3: '本题强调：y ← x 复制的是"当时的 x 值"，之后 x 变了，y 不会自动跟着变。',
    teaching_l4: '本题强调：赋值会覆盖，为了交换需要 temp 暂存旧值，避免覆盖丢失。',
    
    // App states
    mode_learn: '学习',
    mode_retest: '重测',
    correct: '正确',
    tryAgain: '再试一次',
    unknownMisconception: '未知误区',
    mustSubmitFirst: '请先提交答案才能进入下一题',
    mustAnswerCorrectly: '请先答对才能进入下一题',
  },
  en: {
    // App
    reset: 'Reset',
    visualModel: 'Visual Model',
    skip_button: 'Skip',
    skip_modal_title: 'Skip check',
    skip_modal_desc: 'Answer all 3 questions correctly to skip the Visual Model and move on. (One attempt)',
    skip_modal_exit: 'Exit',
    skip_modal_submit: 'Submit',
    skip_modal_need_all: 'Please answer all 3 questions first.',
    skip_modal_wrong: 'Some answers are incorrect. Please check the highlighted questions and try again.',
    skip_modal_one_wrong: 'Incorrect. Check this one again.',
    skip_modal_fail_inline: 'Incorrect: {list} (highlighted in red). Skip will be disabled. Please finish the Visual Model to continue.',
    skip_modal_pass_inline: '✅ All correct! Click “Continue” to skip the Visual Model.',
    skip_modal_continue: 'Continue',
    skip_locked_hint: 'Skip disabled: please finish the Visual Model to continue.',

    skip_q1_title: 'Question 1',
    skip_q1_code: `x ← 0
y ← 1

FOR EACH value IN inputList
{
    IF (value MOD 2 = 0)
    {
        x ← x + y
    }
    y ← y + 1
}`,
    skip_q1_question: `Given inputList = [2, 4, 5, 6].\nAfter the program finishes, what are the values of x and y?`,
    skip_q1_opt_A: 'A. x = 6, y = 5',
    skip_q1_opt_B: 'B. x = 7, y = 5',
    skip_q1_opt_C: 'C. x = 8, y = 5',
    skip_q1_opt_D: 'D. x = 9, y = 4',

    skip_q2_title: 'Question 2',
    skip_q2_code: `count ← 0
total ← 0

FOR EACH number IN inputList
{
    IF (number MOD 3 = 0)
    {
        count ← count + 1
        total ← total + number
    }
}

IF (count > 0)
{
    average ← total / count
}
ELSE
{
    average ← 0
}`,
    skip_q2_question: `Given inputList = [3, 5, 6, 7, 9].\nWhich option best describes the final values of count, total, and average?`,
    skip_q2_opt_A: 'A. count = 3, total = 18, average = 6',
    skip_q2_opt_B: 'B. count = 2, total = 18, average = 9',
    skip_q2_opt_C: 'C. count = 3, total = 18, average = 0',
    skip_q2_opt_D: 'D. count = 5, total = 30, average = 6',

    skip_q3_title: 'Question 3',
    skip_q3_code: `count ← 0
sum ← 0

FOR EACH number IN inputList
{
    IF (number > 4)
    {
        count ← count + 1
        sum ← sum + number
    }
    ELSE
    {
        count ← 0
    }
}

IF (count > 0)
{
    result ← sum / count
}
ELSE
{
    result ← -1
}`,
    skip_q3_question: `Given inputList = [6, 2, 8, 3, 10].\nAfter the program finishes, what are the values of count, sum, and result?`,
    skip_q3_opt_A: 'A. count = 3, sum = 24, result = 8',
    skip_q3_opt_B: 'B. count = 1, sum = 24, result = 24',
    skip_q3_opt_C: 'C. count = 2, sum = 18, result = 9',
    skip_q3_opt_D: 'D. count = 0, sum = 24, result = -1',
    
    // Home
    homeTitle: 'CSP Super Tutor',
    homeSubtitle: 'Variables & Assignment Interactive Practice',
    homeDesc: 'You will practice key concepts with the help of a visual model:',
    start: 'START',
    
    // TeachingLoop
    continuousCorrect: 'Streak:',
    question: 'QUESTION',
    waiting: '(Waiting to start...)',
    submit: 'Submit',
    hint: 'HINT',
    noHintAvailable: 'No hint available',
    nextQuestion: 'Next',
    startText: 'Start',
    hintAndCorrection: 'Hint & Correction',
    shortExplanation: 'Brief Explanation',
    clickNextToStart: 'Click "Next" to start.',
    youMayBeStuckOn: 'You may be stuck on:',
    keyIdea: 'Key idea',
    hintLabel: 'Hint',
    analogy: 'Analogy',
    placeholder: 'Enter your answer here',
    number: 'number',
    
    // Visualization
    interactiveVariableModel: 'Interactive Variable Model',
    boxModelTitle: 'Box Model Trainer',
    dragModelTitle: 'Drag-and-Drop Variable Lab',
    dragToCode: 'Drag values to variables in code to assign. Assignment overwrites old values.',
    clickToEditVariables: 'Click variable values to edit, or use the operation panel below.',
    draggableValues: 'Draggable Values',
    variables: 'Variables',
    variableHistory: 'Variable History',
    expandChart: 'Expand chart',
    shrinkChart: 'Shrink chart',
    clickToAddVariable: 'Click below to add variable',
    empty: '(empty)',
    operationTitle: 'Variable Operations Demo',
    clickToEdit: 'Click to edit',
    variable: 'Variable',
    execute: 'Execute',
    step1: 'Step 1',
    step2: 'Step 2',
    step3: 'Step 3',
    readValue: 'Read {var} value = {value}',
    calculate: 'Calculate {var} {op} {operand}',
    storeResult: 'Store result back to {var}',
    step1Explanation: '(read current value from storage cell)',
    step2Explanation: '(calculate new value in CPU, storage cell unchanged)',
    step3Explanation: '(write result back to storage cell, overwriting old value)',
    resetAll: 'Reset All',
    keyConcept: 'Key Concept:',
    assignmentOverwrites: 'Assignment overwrites. When dragging a new value to a variable, the old value is replaced (not added).',
    operationHistory: 'Operation History:',
    storageSpace: '{bytes} bytes of storage',
    runDemo: 'Run Demo: x=10, y=x, x=5',
    demoTitle: 'Demo: Why does y stay 10 after x changes to 5?',
    demoStep1: 'Step 1: x ← 10 (store 10 into x\'s storage cell)',
    demoStep2: 'Step 2: y ← x (read x\'s current value 10, copy it into y\'s storage cell)',
    demoStep3: 'Step 3: x ← 5 (store 5 into x\'s storage cell, overwriting the old 10)',
    demoConclusion: 'Key insight: y ← x is "copying the value", not "binding". y stores the value x had when y ← x executed (10), so later changes to x don\'t affect y.',
    executionReading: 'Reading variable value...',
    executionCalculating: 'Calculating...',
    executionStoring: 'Storing result...',
    typePanelTitle: 'AP Variable Types & Storage',
    typeDemoTitle: 'Variable Types & Storage Demo',
    typeDemoSubtitle: 'Learn how different variable types occupy different storage spaces',
    demoTypeStep1Title: 'int Type (Integer)',
    demoTypeStep1Desc: 'int type uses 4 bytes of storage space, can store whole numbers like 42. Good for exam scores, counters, and other integer values.',
    demoTypeStep2Title: 'double Type (Decimal)',
    demoTypeStep2Desc: 'double type uses 8 bytes of storage space, can store real numbers with decimals like 3.14159. Higher precision but takes more space.',
    demoTypeStep3Title: 'String Type (Text)',
    demoTypeStep3Desc: 'String type uses storage space based on the length of the string. For example, "hello" uses 5 bytes (1 byte per character). Used to store text information like names, messages, etc.',
    demoTypeStep4Title: 'boolean Type (True/False)',
    demoTypeStep4Desc: 'boolean type only needs 1 byte of storage space, can only store true or false. Used for storing condition evaluation results.',
    typeDemoSummary: 'Variable Types Summary',
    typeTreeTitle: 'Overview: Four common types of variables',
    typeTreeDesc: 'Think of variable as the root of a tree. Under it, we have different type branches: int for integers (4 bytes), double for decimals (8 bytes), String for text (like "hello", bytes equal to character count), and boolean for true/false (1 byte). Understanding type means understanding what kind of data this storage cell is meant to hold and roughly how much memory it needs.',
    typeTreeStepLabel: 'Type overview',
    showTimeline: 'Show Timeline Visualization',
    hideTimeline: 'Hide Timeline Visualization',
    timelineScenario1Title: 'Scenario 1: Why does x = x + 1 work?',
    timelineScenario1Desc: 'Demonstrates the execution of x = x + 1: read x\'s value → calculate x + 1 → write result back to x',
    timelineScenario1Short: 'x = x + 1',
    timelineScenario2Title: 'Scenario 2: After x = 10, y = x, x = 5, what is y?',
    timelineScenario2Desc: 'Demonstrates variable assignment and copying, understanding why y\'s value doesn\'t change when x changes',
    timelineScenario2Short: 'x=10, y=x, x=5',
    timelineStep1_1: 'Initial state: x = 5',
    timelineStep1_2: 'Step 1: Read x\'s current value (5)',
    timelineStep1_3: 'Step 2: Calculate 5 + 1 = 6 in CPU',
    timelineStep1_4: 'Step 3: Write the result (6) back to x\'s storage cell, overwriting the old value',
    timelineStep2_1: 'Initial state: both x and y are empty',
    timelineStep2_2: 'Step 1: Store 10 into x\'s storage cell',
    timelineStep2_3: 'Step 2: Read x\'s current value (10)',
    timelineStep2_4: 'Step 3: Copy the read value (10) into y\'s storage cell',
    timelineStep2_5: 'Step 4: Store 5 into x\'s storage cell, overwriting the old 10',
    timelineStep2_6: 'Final result: x = 5, y = 10 (y\'s value doesn\'t change because it\'s a copied value, not a binding)',
    play: 'Play',
    prev: 'Prev',
    next: 'Next',
    step: 'Step',
    close: 'Close',
    minimize: 'Minimize',
    minimizeTimeline: 'Minimize Timeline',
    timelineMinimized: 'Timeline Visualization',
    minimizeTypeDemo: 'Minimize Type Demo',
    typeDemoMinimized: 'Variable Types Demo',
    typePanelIntro: 'In AP CS A, every variable has a type. Different types correspond to different-sized storage cells and different ranges/precision of values (a longer bar means more memory per variable):',
    type_int_title: 'int (integer)',
    type_int_desc: 'Typically uses about 4 bytes; good for exam scores, counters, and whole numbers. Large range, but cannot store decimals.',
    type_double_title: 'double (real number)',
    type_double_desc: 'Typically uses about 8 bytes; can store numbers with decimals and higher precision, but may introduce rounding error.',
    type_boolean_title: 'boolean (true/false)',
    type_boolean_desc: 'Represents only true or false, conceptually using a tiny amount of memory; great for conditions and yes/no flags.',
    
    // Box model (Predict → Execute → Compare)
    box_subtitle: 'Use a “box model” to understand variables and assignment: each variable is a named box, and assignment means placing/replacing a card in that box.',
    box_code_title: 'Code (executed line by line)',
    box_boxes_title: 'Variable Boxes (storage cells)',
    box_boxes_predict_hint: 'Do not execute yet. Using the box model only, think: after the program finishes, what card will be left in each box?',
    box_predict_title: 'Your Prediction',
    box_predict_text: 'Predict the final number in each variable box after execution. This is not a math equation; it is simply asking “what value will this box end up storing?”.',
    box_predict_arrow: 'will finally hold',
    box_predict_placeholder: 'Enter a number',
    box_boolean_placeholder: 'Choose true / false',
    box_start_execute: 'Execute step by step with boxes',
    box_execute_title: 'Execution Phase (box view)',
    box_execute_intro: 'Click “Next” to execute the code one line at a time and watch how cards are placed/copied/overwritten inside the boxes.',
    box_execute_line: 'Executing: {line}',
    box_go_compare: 'See result and compare',
    box_compare_title: 'Compare your prediction with the actual boxes',
    box_predicted: 'Your predicted value',
    box_actual: 'Actual value in the box',
    box_feedback_correct_title: 'Nice! Your box model is correct.',
    box_feedback_correct_text: 'You correctly treated variables as separate boxes: y just copied the card from x at that moment; later when x\'s box is changed to 5, it does not go back and change y\'s box.',
    box_feedback_shared_box_title: 'You treated variables as “sharing the same box”',
    box_feedback_shared_box_text: 'In your answer, y changes together with x, which suggests a mental model like “two names stuck on one box”. In reality, x and y are two different boxes: y = x just copies the card from x at that moment into y; later changes to x do not automatically update y.',
    box_feedback_generic_title: 'Try replaying the execution with boxes',
    box_feedback_generic_text: 'Think in order: Which box did we put a card into first? Later, did we replace a card in some box? The key is: each line only changes the box on the LEFT side; the RIGHT side is just “reading the current number on that card”.',
    box_scenario_label: 'Scenario {label}',
    box_scenario_a: 'Scenario A: Put 3 into x, copy that card into y, then change x to 5.',
    box_scenario_b: 'Scenario B: First put 7 into y, then y = x overwrites y with whatever is in x, and finally z gets a copy of y\'s card (2).',
    box_scenario_c: 'Scenario C: x starts as 1, y gets a copy of x+1, then x is increased by 1.',
    box_scenario_d: 'Scenario D: 4 is copied from x to y, then from y to z. Only x\'s box is changed to 9 at the end; y and z keep their copied 4.',
    box_scenario_e: 'Scenario E: bigger is a boolean box that stores the True/False result of the comparison x > y, not a link between the two variables.',
    box_type_int: 'Integers (scores, counters), about 4 bytes.',
    box_type_double: 'Real numbers with decimals (averages, measurements), about 8 bytes.',
    box_type_string: 'Text (like "hello"), memory depends on length.',
    box_type_boolean: 'True/False results of conditions, uses very little space.',
    box_next_scenario: 'Next exercise',
    box_free_play: 'All done! Keep practicing this scenario freely',
    box_all_done_title: '✅ You have completed all box scenarios!',
    box_all_done_text: 'Now you can freely change your predictions and re-run the box model, or go back to the question panel and apply the same mental model to harder variable problems.',
    box_progress_title: 'Progress',
    box_drag_ops_title: 'Operations',
    box_drag_mode_title: 'Mode',
    box_drag_mode_guided: 'Guided',
    box_drag_mode_exam: 'Exam',
    box_drag_stage_title: 'Variable stage',
    box_drag_drop_hint: 'Drag value cards or boxes onto any variable.',
    box_drag_history_title: 'History',
    box_drag_history_empty: 'No history yet. Make a move to see entries here.',
    box_drag_history_clear: 'Clear history',
    box_drag_type_examples_title: 'Type examples',
    box_drag_type_int_example: 'e.g. 42, -7, 0',
    box_drag_type_double_example: 'e.g. 3.14, -0.5',
    box_drag_type_string_example: 'e.g. "hello", "score"',
    box_drag_type_boolean_example: 'e.g. true, false',
    box_drag_type_boolean_note: 'Note: true / false are reserved for boolean (do not treat them as strings).',

    box_drag_subtitle: 'Drag value cards or variable boxes to practice assigning and copying.',
    box_drag_pool_title: 'Tools',
    box_drag_boxes_title: 'Variable stage',
    box_drag_read_zone: 'Read zone (drop a variable box here)',
    box_drag_ghost_title: 'History',
    box_drag_ghost_empty: '(No code lines yet)',
    trace_expand: 'Open execution trace',
    trace_collapse: 'Collapse trace',
    trace_empty: 'No trace yet. Make a move first.',
    trace_click_to_restore: 'Click to restore boxes to this moment',
    box_drag_var_tokens_title: 'Variable cards',
    box_drag_value_tokens_title: 'Value cards',
    box_drag_var_token_hint: 'Drop onto another variable: copy value',
    box_drag_var_token_need_value: 'This variable is empty: assign a value first',
    box_drag_copied_from: 'Copied from {from}',
    box_drag_expand: 'Expand',
    box_drag_collapse: 'Collapse',
    box_drag_detail_value: 'value',
    box_drag_detail_type: 'type',
    box_drag_detail_step: 'last updated',
    box_drag_detail_step_none: 'Not updated yet',
    box_drag_detail_step_value: 'step {step}',
    box_drag_detail_source: 'source',
    box_drag_detail_source_none: '(direct literal or not recorded)',
    box_drag_sim_title: 'Variable stage',
    box_drag_sim_intro: 'Drag value cards or variable boxes to practice assignment, copying, and overwriting.',
    box_drag_sim_empty: 'No log yet.',
    box_drag_hint: 'Drag value card → box = assignment; drag box → box = copy value (not shared).',
    box_drag_feedback_updated: 'Box updated.',
    box_drag_feedback_copied: 'Value copied to the target box.',
    box_drag_put_in: '→ put into target box',
    box_drag_overwrite: '→ overwrite the old card (old value replaced)',
    box_drag_stmt_assign: 'Statement: {left} ← {right}',
    box_drag_stmt_copy: 'Statement: {left} ← {right}',
    box_drag_step_open: '→ open the {name} box',
    box_drag_step_take: '→ take out the current value {value} from {name}',
    box_drag_step_copy: '→ make a copy of the value (not a shared box)',
    box_drag_step_put: '→ put {value} into {name}',
    box_drag_restart: 'Restart drag-and-drop practice',
    box_drag_ops_title: 'Operations',
    box_drag_mode_title: 'Mode',
    box_drag_mode_guided: 'Guided',
    box_drag_mode_exam: 'Exam',
    box_drag_stage_title: 'Variable stage',
    box_drag_drop_hint: 'Drag value cards or boxes onto any variable.',
    box_drag_input_placeholder: 'Type a value, e.g. 42, 3.14, "hi", true',
    box_drag_input_generate: 'Generate value card',
    box_drag_input_error_empty: 'Please enter a value first.',
    box_drag_input_type_info: 'You just created a {type} value card.',
    
    // Questions - Level 1
    q1_prompt: 'After executing the assignment statement below, what is the value of variable {var}? (Enter only a number)',
    q1_statement: 'Statement:',
    q1_inputHint: 'e.g., 5',
    q1_misconception_equals: 'Treating assignment as equals/comparison',
    q1_feedback_equals: 'You entered "=". The ← means writing the value on the right into the variable on the left, not checking if they are equal.',
    q1_misconception_name: 'Treating variable as a name instead of a box',
    q1_feedback_name: 'It looks like you didn\'t provide a number. The question asks for "the value of this variable".',
    q1_reteach_title: 'Core Model: A variable is a "named storage location"',
    q1_reteach_text: 'The assignment statement x ← 5 means: write 5 into the variable named x. Whatever was there before (even empty) will be overwritten to 5.',
    q1_reteach_analogy: 'Like putting a card with "5" into a drawer labeled "x". After putting it in, the value of this variable is 5.',
    q1_reteach_hint: 'Just answer: "What number is in this variable after the assignment?"',
    q1_visual_arrow: 'Copy the value {value} on the right into the variable on the left: {var}',
    
    // Questions - Level 2
    q2_prompt: 'Variables can be "reassigned". After executing both statements, what is the final value of {var}? (Enter only a number)',
    q2_misconception_ignore: 'Ignoring overwrite/thinking first assignment is permanent',
    q2_feedback_ignore: 'You seem to have stopped at the first statement. The second statement will overwrite the old value in this variable.',
    q2_misconception_order: 'Unstable execution order tracking',
    q2_feedback_order: 'Execute again in order: first put {a}, then put {b}. The box will only contain the last value put in.',
    q2_visual_arrow: 'The second assignment overwrites the first: {var} first becomes {a}, then becomes {b}',
    q2_reteach_title: 'Assignment = Overwriting the content in the box (executed in order)',
    q2_reteach_text: 'The program executes from top to bottom. Each assignment replaces "the current value of the variable on the left" with the new value on the right (last assignment wins).',
    q2_reteach_analogy: 'Like writing numbers on a whiteboard: first write {a}, then write {b} later, what you see at the end is {b}.',
    q2_reteach_hint: 'Key point: The final value is determined by "the last statement that assigns to it".',
    
    // Questions - Level 3
    q3_prompt: 'Please trace the result after executing this program, and write the final values of x and y separately.',
    q3_format: 'Format required: x:number,y:number (separated by comma)',
    q3_inputHint: 'e.g., x:10,y:5',
    q3_misconception_format: 'Format error',
    q3_feedback_format: 'Please enter in the format: x:number,y:number (e.g., x:10,y:5).',
    q3_misconception_binding: 'Thinking y follows x changes (treating copy as binding/reference)',
    q3_feedback_binding: 'You wrote y as the later x value. y ← x copies the current x value into variable y; after x changes, it won\'t change y back.',
    q3_misconception_track: 'Unstable execution tracking',
    q3_feedback_track: 'Step by step: first x=initial value, then copy x\'s value to y, finally x is changed to a new value. y won\'t be affected by the last statement.',
    q3_visual_arrow: 'Key: y ← x copies "the current value of x, {x0}, to y". After x becomes {x1}, y remains {x0}',
    q3_reteach_title: 'y ← x: Copy "the value at this moment", not establish "a binding relationship"',
    q3_reteach_text: 'Copy the "currently visible number" in the variable on the right, and write it into the variable on the left. After copying, these two variables do not affect each other.',
    q3_reteach_analogy: 'Like copying homework: you copy the number x currently has to y\'s paper. After x changes, it won\'t automatically change your y paper.',
    q3_reteach_hint: 'First answer: when executing the line y ← x, what is x? That is y\'s final value (unless y is assigned again later).',
    
    // Questions - Level 4
    q4_prompt: 'The three statements below aim to "swap x and y". Write the final values of x and y after execution.',
    q4_format: 'Format required: x:number,y:number',
    q4_initial: 'Initial: x={x0}, y={y0}',
    q4_inputHint: 'e.g., x:6,y:1',
    q4_feedback_format: 'Please enter in the format: x:number,y:number.',
    q4_misconception_temp: 'Ignoring temporary variable/overwrite causes value loss',
    q4_feedback_temp: 'You wrote y as {y0}, as if {x0} was lost. Without temp, it would be overwritten and lost; temp\'s role is to temporarily store {x0} in another variable first.',
    q4_misconception_swap: 'Unstable swap tracking',
    q4_feedback_swap: 'Write boxes in order: temp first gets {x0}; x changes to {y0}; finally y retrieves {x0} from temp.',
    q4_visual_arrow: 'temp first "keeps" the old x={x0}, avoiding being overwritten and lost by x ← y; finally y retrieves from temp',
    q4_reteach_title: 'Why temp is needed: Avoid "overwrite value loss"',
    q4_reteach_text: 'Assignment overwrites. If you directly do x ← y, then y ← x, you will overwrite the old x, causing both sides to become the same value. temp is used to temporarily store the old value.',
    q4_reteach_analogy: 'Like swapping two cups of water: you need an empty cup to temporarily pour, otherwise the first cup poured will mix and overwrite the other.',
    q4_reteach_hint: 'First ask yourself: after executing the first statement temp ← x, what is in temp? Then what does x change to? Finally, where does y get it from?',
    
    // Teaching text
    teaching_base: 'Look at the visualization on the left: the left is "before assignment", the right is "after assignment". The arrow shows: copy the value on the right into the variable box on the left.',
    teaching_l1: 'This question only requires understanding: x ← 5 means "x box becomes 5".',
    teaching_l2: 'This question emphasizes: later assignments overwrite earlier values, the final value is determined by "the last assignment".',
    teaching_l3: 'This question emphasizes: y ← x copies "the x value at that time", after x changes, y won\'t automatically follow.',
    teaching_l4: 'This question emphasizes: assignment overwrites, to swap you need temp to temporarily store the old value, avoiding overwrite loss.',
    
    // App states
    mode_learn: 'Learn',
    mode_retest: 'Retest',
    correct: 'Correct',
    tryAgain: 'Try again',
    unknownMisconception: 'Unknown misconception',
    mustSubmitFirst: 'Please submit an answer before moving to the next question',
    mustAnswerCorrectly: 'Please answer correctly before moving to the next question',
  }
}

// 语言上下文
let currentLanguage = 'zh'

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang
    localStorage.setItem('app_language', lang)
  }
}

export const getLanguage = () => {
  const saved = localStorage.getItem('app_language')
  if (saved && translations[saved]) {
    currentLanguage = saved
  }
  return currentLanguage
}

export const t = (key, params = {}) => {
  const lang = getLanguage()
  let text = translations[lang]?.[key] || translations.zh[key] || key
  
  // 替换参数
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param])
  })
  
  return text
}

// 初始化语言
getLanguage()

