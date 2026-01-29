import { t, getLanguage } from './i18n'
import { questionBank } from '../data/questionBank.js'

// 根据当前语言获取题目的多语言文本
export function getQuestionText(question, field, lang = null) {
  if (!question || !question.rawData) {
    // 如果没有原始数据，返回当前值（用于动态生成的题目）
    return question?.[field] || '';
  }
  
  const currentLang = lang || getLanguage();
  const rawData = question.rawData;
  
  if (field === 'prompt') {
    let promptText = '';
    if (typeof rawData.prompt === 'object' && rawData.prompt !== null) {
      promptText = rawData.prompt[currentLang] || rawData.prompt.en || rawData.prompt.zh || '';
    } else {
      promptText = rawData.prompt || '';
    }
    
    const statementLabel = t('q1_statement');
    let prompt = promptText.trim();
    if (rawData.code) {
      prompt += `\n${statementLabel}\n${rawData.code}`;
    }
    return prompt;
  }
  
  if (field === 'options') {
    if (rawData.options) {
      if (typeof rawData.options === 'object' && !Array.isArray(rawData.options)) {
        return rawData.options[currentLang] || rawData.options.en || rawData.options.zh || [];
      } else {
        return rawData.options;
      }
    }
    return null;
  }
  
  if (field === 'hint') {
    if (typeof rawData.hint === 'object' && rawData.hint !== null) {
      return rawData.hint[currentLang] || rawData.hint.en || rawData.hint.zh || '';
    } else {
      return rawData.hint || '';
    }
  }
  
  return question[field] || '';
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseMappingAnswer(ansNorm) {
  const pairs = ansNorm.split(",").filter(Boolean);
  if (pairs.length < 2) return null;
  const out = {};
  for (const p of pairs) {
    const m = p.match(/^([a-z]+)[:=](-?\d+)$/);
    if (!m) return null;
    out[m[1]] = Number(m[2]);
  }
  if (!("x" in out) || !("y" in out)) return null;
  return out;
}

export function makeQ_Level1_AssignConst() {
  const varName = pick(["x", "y", "score"]);
  const n = pick([2, 5, 7, 10, 12]);
  const before = { [varName]: undefined };
  const after = { [varName]: n };
  return {
    id: `L1_const_${varName}_${n}_${Date.now()}`,
    level: 1,
    prompt: `${t('q1_prompt', { var: varName })}\n${t('q1_statement')}${varName} ← ${n}`,
    inputHint: t('q1_inputHint'),
    expected: { kind: "value", value: n },
    checker: (ansNorm) => {
      if (ansNorm === String(n)) return { correct: true };
      if (ansNorm.includes("=")) {
        return {
          correct: false,
          misconception: t('q1_misconception_equals'),
          feedback: t('q1_feedback_equals'),
        };
      }
      return {
        correct: false,
        misconception: t('q1_misconception_name'),
        feedback: t('q1_feedback_name'),
      };
    },
    visual: {
      codeLine: `${varName} ← ${n}`,
      arrowText: t('q1_visual_arrow', { value: n, var: varName }),
      before,
      after,
    },
    reteach: {
      title: t('q1_reteach_title'),
      text: t('q1_reteach_text'),
      analogy: t('q1_reteach_analogy'),
      hint: t('q1_reteach_hint'),
    },
  };
}

export function makeQ_Level2_Reassign() {
  const varName = pick(["x", "y"]);
  const a = pick([1, 3, 4, 6]);
  const b = pick([8, 9, 11, 15]);
  const before = { [varName]: a };
  const after = { [varName]: b };
  return {
    id: `L2_reassign_${varName}_${a}_${b}_${Date.now()}`,
    level: 2,
    prompt: `${t('q2_prompt', { var: varName })}\n${t('q1_statement')}\n${varName} ← ${a}\n${varName} ← ${b}`,
    inputHint: t('q1_inputHint'),
    expected: { kind: "value", value: b },
    checker: (ansNorm) => {
      if (ansNorm === String(b)) return { correct: true };
      if (ansNorm === String(a)) {
        return {
          correct: false,
          misconception: t('q2_misconception_ignore'),
          feedback: t('q2_feedback_ignore'),
        };
      }
      return { correct: false, misconception: t('q2_misconception_order'), feedback: t('q2_feedback_order', { a, b }) };
    },
    visual: {
      codeLine: `${varName} ← ${a}\n${varName} ← ${b}`,
      arrowText: t('q2_visual_arrow', { var: varName, a, b }),
      before,
      after,
    },
    reteach: {
      title: t('q2_reteach_title'),
      text: t('q2_reteach_text'),
      analogy: t('q2_reteach_analogy', { a, b }),
      hint: t('q2_reteach_hint'),
    },
  };
}

export function makeQ_Level3_CopyValueBetweenVars() {
  const x0 = pick([2, 5, 9]);
  const x1 = pick([12, 7, 3, 10].filter((n) => n !== x0));
  const before = { x: x0, y: undefined };
  const after = { x: x1, y: x0 };
  return {
    id: `L3_copy_${x0}_${x1}_${Date.now()}`,
    level: 3,
    prompt:
      `${t('q3_prompt')}\n` +
      `${t('q1_statement')}\n` +
      `x ← ${x0}\n` +
      `y ← x\n` +
      `x ← ${x1}`,
    inputHint: t('q3_inputHint'),
    expected: { kind: "mapping", mapping: { x: x1, y: x0 } },
    checker: (ansNorm) => {
      const m = parseMappingAnswer(ansNorm);
      if (!m) return { correct: false, misconception: t('q3_misconception_format'), feedback: t('q3_feedback_format') };
      const ok = m.x === x1 && m.y === x0;
      if (ok) return { correct: true };
      if (m.y === x1) {
        return {
          correct: false,
          misconception: t('q3_misconception_binding'),
          feedback: t('q3_feedback_binding'),
        };
      }
      return { correct: false, misconception: t('q3_misconception_track'), feedback: t('q3_feedback_track') };
    },
    visual: {
      codeLine: `x ← ${x0}\ny ← x\nx ← ${x1}`,
      arrowText: t('q3_visual_arrow', { x0, x1 }),
      before,
      after,
    },
    reteach: {
      title: t('q3_reteach_title'),
      text: t('q3_reteach_text'),
      analogy: t('q3_reteach_analogy'),
      hint: t('q3_reteach_hint'),
    },
  };
}

export function makeQ_Level4_SwapWithTemp() {
  const x0 = pick([1, 4, 8]);
  const y0 = pick([2, 6, 9].filter((n) => n !== x0));
  const before = { x: x0, y: y0, temp: undefined };
  const after = { x: y0, y: x0, temp: x0 };
  return {
    id: `L4_swap_${x0}_${y0}_${Date.now()}`,
    level: 4,
    prompt:
      `${t('q4_prompt')}\n` +
      `${t('q4_initial', { x0, y0 })}\n` +
      `${t('q1_statement')}\n` +
      `temp ← x\n` +
      `x ← y\n` +
      `y ← temp`,
    inputHint: t('q4_inputHint'),
    expected: { kind: "mapping", mapping: { x: y0, y: x0 } },
    checker: (ansNorm) => {
      const m = parseMappingAnswer(ansNorm);
      if (!m) return { correct: false, misconception: t('q3_misconception_format'), feedback: t('q4_feedback_format') };
      if (m.x === y0 && m.y === x0) return { correct: true };
      if (m.x === y0 && m.y === y0) {
        return {
          correct: false,
          misconception: t('q4_misconception_temp'),
          feedback: t('q4_feedback_temp', { x0, y0 }),
        };
      }
      return { correct: false, misconception: t('q4_misconception_swap'), feedback: t('q4_feedback_swap', { x0, y0 }) };
    },
    visual: {
      codeLine: `temp ← x\nx ← y\ny ← temp`,
      arrowText: t('q4_visual_arrow', { x0 }),
      before,
      after,
    },
    reteach: {
      title: t('q4_reteach_title'),
      text: t('q4_reteach_text'),
      analogy: t('q4_reteach_analogy'),
      hint: t('q4_reteach_hint'),
    },
  };
}

// 将 JSON 题目转换为项目格式
function convertQuestionFromJSON(qJson) {
  const lang = getLanguage();
  const statementLabel = t('q1_statement');
  
  // 构建 prompt（支持多语言）
  let promptText = '';
  if (typeof qJson.prompt === 'object' && qJson.prompt !== null) {
    promptText = qJson.prompt[lang] || qJson.prompt.en || qJson.prompt.zh || '';
  } else {
    promptText = qJson.prompt || '';
  }
  
  let prompt = promptText.trim();
  if (qJson.code) {
    prompt += `\n${statementLabel}\n${qJson.code}`;
  }

  // 根据题目类型创建 checker
  let expected, checker;
  
  // 获取 hint（支持多语言）
  let hintText = '';
  if (typeof qJson.hint === 'object' && qJson.hint !== null) {
    hintText = qJson.hint[lang] || qJson.hint.en || qJson.hint.zh || '';
  } else {
    hintText = qJson.hint || '';
  }

  if (qJson.type === 'multiple_choice') {
    // 获取正确答案（支持多语言）- 在 checker 中动态获取，以支持语言切换
    expected = { kind: 'value', value: '' }; // 占位符，实际值在 checker 中动态获取
    checker = (ansNorm) => {
      // 根据当前语言动态获取正确答案
      const currentLang = getLanguage();
      let correctAnswer = '';
      if (typeof qJson.answer === 'object' && qJson.answer !== null) {
        correctAnswer = qJson.answer[currentLang] || qJson.answer.en || qJson.answer.zh || '';
      } else {
        correctAnswer = String(qJson.answer || '');
      }
      const normalized = normalizeAnswer(correctAnswer);
      if (ansNorm === normalized) {
        return { correct: true };
      }
      // 获取当前语言的提示
      let currentHintText = '';
      if (typeof qJson.hint === 'object' && qJson.hint !== null) {
        currentHintText = qJson.hint[currentLang] || qJson.hint.en || qJson.hint.zh || '';
      } else {
        currentHintText = qJson.hint || '';
      }
      return {
        correct: false,
        misconception: qJson.misconception || 'unknown',
        feedback: currentHintText || t('tryAgain'),
      };
    };
  } else if (qJson.type === 'true_false') {
    expected = { kind: 'value', value: qJson.answer ? 'true' : 'false' };
    checker = (ansNorm) => {
      const userAnswer = ansNorm === 'true' || ansNorm === '1' || ansNorm === 'yes';
      const correctAnswer = qJson.answer === true;
      if (userAnswer === correctAnswer) {
        return { correct: true };
      }
      return {
        correct: false,
        misconception: qJson.misconception || 'unknown',
        feedback: hintText || t('tryAgain'),
      };
    };
  } else {
    // short_answer 或其他类型
    expected = { kind: 'value', value: String(qJson.answer) };
    checker = (ansNorm) => {
      const normalized = normalizeAnswer(String(qJson.answer));
      if (ansNorm === normalized) {
        return { correct: true };
      }
      return {
        correct: false,
        misconception: qJson.misconception || 'unknown',
        feedback: hintText || t('tryAgain'),
      };
    };
  }

  // 获取 options（支持多语言）
  let optionsList = null;
  if (qJson.options) {
    if (typeof qJson.options === 'object' && !Array.isArray(qJson.options)) {
      optionsList = qJson.options[lang] || qJson.options.en || qJson.options.zh || [];
    } else {
      optionsList = qJson.options;
    }
  }

  // 构建 visual（如果有）
  let visual = null;
  if (qJson.visual) {
    visual = {
      codeLine: qJson.code || '',
      arrowText: hintText || '',
      before: qJson.visual.before || {},
      after: qJson.visual.after || {},
    };
  } else if (qJson.code) {
    visual = {
      codeLine: qJson.code,
      arrowText: hintText || '',
      before: {},
      after: {},
    };
  }

  // 构建 reteach：根据 misconception 类型提供针对性的内容
  const getReteachForMisconception = (misconceptionKey, level) => {
    const misconceptionMap = {
      'assignment_vs_comparison': {
        zh: {
          title: '把赋值当成等号/判断',
          text: '赋值语句 x ← 5 的含义是：把 5 写进名为 x 的变量里。← 不是等号，不是在判断 x 是否等于 5。',
          analogy: '像给贴着"x"标签的抽屉里放入一张写着"5"的卡片。放进去以后，这个变量的值就是 5。\n\n也可以这样想：变量像是一个带名字的盒子，赋值就是往盒子里放数字卡片。',
          hint: '只需要回答"赋值后这个变量里是什么数字"。',
        },
        en: {
          title: 'Treating assignment as equals/comparison',
          text: 'The assignment statement x ← 5 means: write 5 into the variable named x. ← is not an equals sign, it\'s not checking if x equals 5.',
          analogy: 'Like putting a card with "5" into a drawer labeled "x". After putting it in, the value of this variable is 5.\n\nYou can also think of it this way: a variable is like a box with a name, and assignment is putting a number card into the box.',
          hint: 'Just answer: "What number is in this variable after the assignment?"',
        },
      },
      'variable_storage': {
        zh: {
          title: '变量一次只能存储一个值',
          text: '变量就像一个盒子，一次只能装一张卡片。新的赋值会覆盖旧的值。',
          analogy: '像抽屉里只能放一张卡片，放新卡片时，旧卡片会被替换。\n\n也可以这样想：变量盒子每次只能装一个数字，赋值就是换卡片。',
          hint: '记住：变量在任何时刻都只有一个值。',
        },
        en: {
          title: 'A variable stores only one value at a time',
          text: 'A variable is like a box that can only hold one card at a time. A new assignment overwrites the old value.',
          analogy: 'Like a drawer that can only hold one card - when you put in a new card, the old one is replaced.\n\nYou can also think of it this way: a variable box can only hold one number at a time, and assignment is swapping cards.',
          hint: 'Remember: a variable has only one value at any moment.',
        },
      },
      'reassignment_confusion': {
        zh: {
          title: '赋值=覆盖盒子里的内容（按顺序执行）',
          text: '程序从上到下执行。每次赋值都会把"左边变量当前的值"替换成右边的新值（最后一次赋值生效）。',
          analogy: '像白板上写数字：先写第一个数，后面再写第二个数，最后看到的是第二个数。\n\n也可以这样想：变量盒子像是一个可以换卡片的盒子，每次赋值就是换一张新卡片，旧的卡片会被扔掉。',
          hint: '抓住关键：最终值由"最后一次对它赋值的语句"决定。',
        },
        en: {
          title: 'Assignment = Overwriting the content in the box (executed in order)',
          text: 'The program executes from top to bottom. Each assignment replaces "the current value of the variable on the left" with the new value on the right (last assignment wins).',
          analogy: 'Like writing numbers on a whiteboard: first write the first number, then write the second number later, what you see at the end is the second number.\n\nYou can also think of it this way: a variable box is like a box where you can swap cards. Each assignment replaces the old card with a new one, and the old card is discarded.',
          hint: 'Key point: The final value is determined by "the last statement that assigns to it".',
        },
      },
      'self_reference_confusion': {
        zh: {
          title: '自增：先读取旧值，再计算，最后覆盖',
          text: 'x ← x + 1 的执行过程：先从 x 盒子读取当前值，在 CPU 里计算（当前值 + 1），再把结果写回 x 盒子。',
          analogy: '像数钱：先把钱包里的钱拿出来数，加上新的一元，再把总数放回钱包。\n\n也可以这样想：先把盒子里的卡片拿出来看数字，算出新数字，再把新卡片放回盒子。',
          hint: '关键：先"读"当前值，再"算"新值，最后"写"回盒子。',
        },
        en: {
          title: 'Increment: Read old value, calculate, then overwrite',
          text: 'The execution of x ← x + 1: first read the current value from x\'s box, calculate (current value + 1) in the CPU, then write the result back to x\'s box.',
          analogy: 'Like counting money: first take the money out of the wallet to count, add one more dollar, then put the total back in the wallet.\n\nYou can also think of it this way: first take the card out of the box to see the number, calculate the new number, then put the new card back in the box.',
          hint: 'Key: first "read" the current value, then "calculate" the new value, finally "write" it back to the box.',
        },
      },
      'thinking_variables_are_linked': {
        zh: {
          title: 'y ← x：复制"此刻的值"，不是建立"绑定关系"',
          text: '把右边这个变量里"当前看到的数字"复制一份，写进左边的变量。复制完成后，这两个变量互不影响。',
          analogy: '像抄作业：你把 x 现在写的数字抄到 y 的纸上。之后 x 改了，不会自动改你的 y 那张纸。\n\n也可以这样想：x 和 y 是两个独立的盒子。y ← x 只是把 x 盒子里的卡片"复印"一份放进 y 盒子。之后给 x 换卡片，y 盒子里的卡片不会自动跟着变。',
          hint: '先回答：执行到 y ← x 那一行时，x 是多少？那就是 y 的最终值（除非后面又给 y 赋值）。',
        },
        en: {
          title: 'y ← x: Copy "the value at this moment", not establish "a binding relationship"',
          text: 'Copy the "currently visible number" in the variable on the right, and write it into the variable on the left. After copying, these two variables do not affect each other.',
          analogy: 'Like copying homework: you copy the number x currently has to y\'s paper. After x changes, it won\'t automatically change your y paper.\n\nYou can also think of it this way: x and y are two independent boxes. y ← x just "photocopies" the card in x\'s box and puts it into y\'s box. After you change the card in x\'s box, the card in y\'s box won\'t automatically change.',
          hint: 'First answer: when executing the line y ← x, what is x? That is y\'s final value (unless y is assigned again later).',
        },
      },
      'expression_not_evaluated': {
        zh: {
          title: '表达式要先计算，再赋值',
          text: '赋值语句右边如果是表达式（如 6 + 2），会先计算出结果（8），再把结果写进变量。',
          analogy: '像做数学题：先算出答案，再把答案写进盒子里。\n\n也可以这样想：CPU 先算出表达式的结果，再把结果卡片放进变量盒子。',
          hint: '记住：先计算表达式，再把计算结果赋值给变量。',
        },
        en: {
          title: 'Expressions must be evaluated before assignment',
          text: 'If the right side of an assignment is an expression (like 6 + 2), it is first calculated to get the result (8), then the result is written into the variable.',
          analogy: 'Like doing math: first calculate the answer, then write the answer into the box.\n\nYou can also think of it this way: the CPU first calculates the expression\'s result, then puts the result card into the variable box.',
          hint: 'Remember: first evaluate the expression, then assign the result to the variable.',
        },
      },
      'copy_vs_reference': {
        zh: {
          title: 'y ← x：复制"此刻的值"，不是建立"绑定关系"',
          text: '把右边这个变量里"当前看到的数字"复制一份，写进左边的变量。复制完成后，这两个变量互不影响。',
          analogy: '像抄作业：你把 x 现在写的数字抄到 y 的纸上。之后 x 改了，不会自动改你的 y 那张纸。\n\n也可以这样想：x 和 y 是两个独立的盒子。y ← x 只是把 x 盒子里的卡片"复印"一份放进 y 盒子。之后给 x 换卡片，y 盒子里的卡片不会自动跟着变。',
          hint: '先回答：执行到 y ← x 那一行时，x 是多少？那就是 y 的最终值（除非后面又给 y 赋值）。',
        },
        en: {
          title: 'y ← x: Copy "the value at this moment", not establish "a binding relationship"',
          text: 'Copy the "currently visible number" in the variable on the right, and write it into the variable on the left. After copying, these two variables do not affect each other.',
          analogy: 'Like copying homework: you copy the number x currently has to y\'s paper. After x changes, it won\'t automatically change your y paper.\n\nYou can also think of it this way: x and y are two independent boxes. y ← x just "photocopies" the card in x\'s box and puts it into y\'s box. After you change the card in x\'s box, the card in y\'s box won\'t automatically change.',
          hint: 'First answer: when executing the line y ← x, what is x? That is y\'s final value (unless y is assigned again later).',
        },
      },
    };
    
    const currentLang = getLanguage();
    const langKey = currentLang === 'zh' ? 'zh' : 'en';
    const mapped = misconceptionMap[misconceptionKey];
    
    if (mapped && mapped[langKey]) {
      return mapped[langKey];
    }
    
    // 如果没有找到映射，根据 level 返回通用的 reteach
    if (level === 1) {
      return {
        zh: {
          title: t('q1_reteach_title'),
          text: t('q1_reteach_text'),
          analogy: t('q1_reteach_analogy'),
          hint: t('q1_reteach_hint'),
        },
        en: {
          title: t('q1_reteach_title'),
          text: t('q1_reteach_text'),
          analogy: t('q1_reteach_analogy'),
          hint: t('q1_reteach_hint'),
        },
      }[langKey];
    } else if (level === 2) {
      return {
        zh: {
          title: t('q2_reteach_title'),
          text: t('q2_reteach_text'),
          analogy: t('q2_reteach_analogy', { a: '', b: '' }),
          hint: t('q2_reteach_hint'),
        },
        en: {
          title: t('q2_reteach_title'),
          text: t('q2_reteach_text'),
          analogy: t('q2_reteach_analogy', { a: '', b: '' }),
          hint: t('q2_reteach_hint'),
        },
      }[langKey];
    } else if (level === 3) {
      return {
        zh: {
          title: t('q3_reteach_title'),
          text: t('q3_reteach_text'),
          analogy: t('q3_reteach_analogy'),
          hint: t('q3_reteach_hint'),
        },
        en: {
          title: t('q3_reteach_title'),
          text: t('q3_reteach_text'),
          analogy: t('q3_reteach_analogy'),
          hint: t('q3_reteach_hint'),
        },
      }[langKey];
    }
    
    // 默认返回
    return {
      zh: {
        title: '核心概念',
        text: hintText || '请仔细理解变量的赋值过程。',
        analogy: '变量就像带名字的盒子，赋值就是往盒子里放数字卡片。',
        hint: '一步一步跟踪变量的变化。',
      },
      en: {
        title: 'Key Concept',
        text: hintText || 'Please carefully understand the variable assignment process.',
        analogy: 'A variable is like a box with a name, and assignment is putting a number card into the box.',
        hint: 'Track variable changes step by step.',
      },
    }[langKey];
  };
  
  const misconceptionKey = qJson.misconception || '';
  const reteachContent = getReteachForMisconception(misconceptionKey, qJson.level || 1);
  
  // 构建 reteach
  const reteach = {
    title: reteachContent.title,
    text: reteachContent.text,
    analogy: reteachContent.analogy,
    hint: reteachContent.hint,
  };

  return {
    id: qJson.id,
    level: qJson.level || 1,
    type: qJson.type || 'short_answer',
    prompt,
    inputHint: qJson.type === 'multiple_choice' ? t('q1_inputHint') : (qJson.type === 'true_false' ? 'true/false' : t('q1_inputHint')),
    options: optionsList,
    expected,
    checker,
    visual,
    reteach,
    rawData: qJson, // 保存原始多语言数据，用于动态语言切换
  };
}

export function generateQuestion(level, mode, lastMisconception, answeredQuestionIds = []) {
  const lang = getLanguage();
  
  // 优先从 JSON 题库中选择题目，过滤掉已做过的题目
  const availableQuestions = questionBank.filter(q => 
    q.level === level && !answeredQuestionIds.includes(q.id)
  );
  if (availableQuestions.length > 0) {
    const selectedQ = pick(availableQuestions);
    return convertQuestionFromJSON(selectedQ);
  }
  
  // 如果该级别的所有题目都做过了，允许重复（重置会清空列表）
  const allQuestionsAtLevel = questionBank.filter(q => q.level === level);
  if (allQuestionsAtLevel.length > 0) {
    const selectedQ = pick(allQuestionsAtLevel);
    return convertQuestionFromJSON(selectedQ);
  }

  // 如果没有对应 level 的题目，使用原来的动态生成方式
  if (mode === 'retest' && lastMisconception) {
    const misconceptionKeys = {
      zh: { overwrite: "覆盖", binding: "绑定", follow: "跟着", equals: "等号", judge: "判断" },
      en: { overwrite: "overwrite", binding: "binding", follow: "follow", equals: "equals", judge: "judge" }
    };
    const keys = misconceptionKeys[lang] || misconceptionKeys.zh;
    if (lastMisconception.includes(keys.overwrite)) return makeQ_Level2_Reassign();
    if (lastMisconception.includes(keys.binding) || lastMisconception.includes(keys.follow)) return makeQ_Level3_CopyValueBetweenVars();
    if (lastMisconception.includes(keys.equals) || lastMisconception.includes(keys.judge)) return makeQ_Level1_AssignConst();
  }

  if (level <= 1) return makeQ_Level1_AssignConst();
  if (level === 2) return makeQ_Level2_Reassign();
  if (level === 3) return makeQ_Level3_CopyValueBetweenVars();
  return makeQ_Level4_SwapWithTemp();
}

export function normalizeAnswer(s) {
  return String(s ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/：/g, ":")
    .replace(/＝/g, "=")
    .toLowerCase();
}

