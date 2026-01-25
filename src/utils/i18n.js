// 翻译文本
const translations = {
  zh: {
    // App
    reset: '重置',
    visualModel: 'Visual Model',
    
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
    resetAll: 'Reset All',
    keyConcept: '关键概念：',
    assignmentOverwrites: '赋值会覆盖。拖拽新值到变量时，旧值会被替换（不是累加）。',
    operationHistory: '操作历史：',
    
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
    resetAll: 'Reset All',
    keyConcept: 'Key Concept:',
    assignmentOverwrites: 'Assignment overwrites. When dragging a new value to a variable, the old value is replaced (not added).',
    operationHistory: 'Operation History:',
    
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

