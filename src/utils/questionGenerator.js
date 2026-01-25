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

  // 构建 reteach
  const reteach = {
    title: qJson.misconception || 'Key Concept',
    text: hintText || '',
    analogy: '',
    hint: hintText || '',
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

