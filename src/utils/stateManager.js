const STORAGE_KEY = "csp_super_tutor_vars_v1";

export const defaultState = () => ({
  level: 1,
  streak: 0,
  mistakesAtLevel: 0,
  mode: "learn", // 使用英文键，显示时翻译
  lastMisconception: null,
  lastFeedback: null,
  mastery: false,
  answerButtonUses: 3, // 答案按钮剩余使用次数
  hasMadeFirstMistake: false, // 是否已经第一次答错
  answeredQuestionIds: [], // 已做过的题目ID列表
});

export function loadState() {
  // 每次进入程序都从 Level 1 开始，不加载保存的状态
  return defaultState();
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

