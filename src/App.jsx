import { useEffect, useState } from 'react'
import Visualization from './components/Visualization'
import TeachingLoop from './components/TeachingLoop'
import Home from './components/Home'
import { generateQuestion, normalizeAnswer } from './utils/questionGenerator'
import { clearState, defaultState, loadState, saveState } from './utils/stateManager'
import { useLanguage } from './contexts/LanguageContext'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export default function App() {
  const { language, changeLanguage, t } = useLanguage()
  const [tutorState, setTutorState] = useState(() => loadState())
  const [question, setQuestion] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [view, setView] = useState('home')
  const [resultBanner, setResultBanner] = useState(null) // { type: 'correct'|'wrong', text: string }
  const [locked, setLocked] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false) // 是否显示答案

  useEffect(() => {
    saveState(tutorState)
  }, [tutorState])

  // 移除语言切换时重新生成题目的逻辑，改为动态切换语言显示

  // 当问题改变时，重置提交状态和答案显示
  // 使用 question?.id 而不是 question 对象本身，避免语言切换时触发重置
  useEffect(() => {
    if (question) {
      setHasSubmitted(false)
      setShowAnswer(false)
    }
  }, [question?.id]) // 只监听 question.id 的变化，而不是整个 question 对象

  const nextQuestion = () => {
    // 检查是否已提交过答案
    if (question && !hasSubmitted) {
      setResultBanner({ type: 'error', text: t('mustSubmitFirst') })
      return
    }

    // 检查是否答对了（答错了不能进入下一题）
    if (question && hasSubmitted && !locked) {
      setResultBanner({ type: 'error', text: t('mustAnswerCorrectly') })
      return
    }

    const q = generateQuestion(tutorState.level, tutorState.mode, tutorState.lastMisconception, tutorState.answeredQuestionIds || [])
    setQuestion(q)
    setResultBanner(null)
    setLocked(false)
    setHasSubmitted(false)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 900)

    // 出新题时，如果不是重测，清掉上一题的"反馈/误区"
    setTutorState((s) => ({
      ...s,
      lastFeedback: null,
      mode: s.mode === 'retest' ? 'retest' : 'learn',
    }))
    setShowAnswer(false)
  }

  const start = () => {
    // 每次进入都从 Level 1 开始
    setTutorState({
      level: 1,
      streak: 0,
      mistakesAtLevel: 0,
      mode: 'learn',
      lastFeedback: null,
      lastMisconception: null,
      mastery: false,
      answerButtonUses: 3,
      hasMadeFirstMistake: false,
      answeredQuestionIds: [], // 重置时清空已做题目列表
    })
    setView('tutor')
    setHasSubmitted(false)
    setShowAnswer(false)
    // 进入后直接出第一题
    setTimeout(() => nextQuestion(), 0)
  }

  const reset = () => {
    clearState()
    const s = defaultState()
    setTutorState(s)
    setQuestion(null)
    setIsAnimating(false)
    setResultBanner(null)
    setLocked(false)
    setShowAnswer(false)
    setView('home')
  }

  const revealHint = () => {
    // HINT 现在由 TeachingLoop 组件内部管理显示/隐藏
  }

  const submitAnswer = (raw) => {
    if (!question || locked) return
    const ans = normalizeAnswer(raw)
    if (!ans) return

    setHasSubmitted(true)
    const res = question.checker(ans)
    if (res.correct) {
      const prev = tutorState
      let level = prev.level
      let streak = prev.streak + 1
      let mode = '学习'

      if (level === 1 && streak >= 2) {
        level = 2
        streak = 0
      } else if (level === 2 && streak >= 2) {
        level = 3
        streak = 0
      }

      // 记录已做过的题目ID（如果题目有id字段，且未记录过）
      const answeredIds = question.id && !(prev.answeredQuestionIds || []).includes(question.id)
        ? [...(prev.answeredQuestionIds || []), question.id]
        : (prev.answeredQuestionIds || [])

      setTutorState({
        ...prev,
        level,
        streak,
        mode: 'learn',
        mistakesAtLevel: 0,
        lastMisconception: null,
        lastFeedback: null,
        answeredQuestionIds: answeredIds,
      })

      setResultBanner({ type: 'correct', text: t('correct') })
      setLocked(true)
      return
    }

    // 错误：记录误区 + 进入重测（不直接给答案）
    const prev = tutorState
    let level = prev.level
    let mistakesAtLevel = prev.mistakesAtLevel + 1
    if (mistakesAtLevel >= 2 && level > 1) {
      level = clamp(level - 1, 1, 3)
      mistakesAtLevel = 0
    }

    // 记录已做过的题目ID（如果题目有id字段，且未记录过）
    const answeredIds = question.id && !(prev.answeredQuestionIds || []).includes(question.id)
      ? [...(prev.answeredQuestionIds || []), question.id]
      : (prev.answeredQuestionIds || [])

    const nextState = {
      ...prev,
      streak: 0,
      mode: 'retest',
      level,
      mistakesAtLevel,
      lastMisconception: res.misconception || t('unknownMisconception'),
      lastFeedback: res.feedback || null,
      hasMadeFirstMistake: true, // 标记已经第一次答错
      answeredQuestionIds: answeredIds,
    }
    setTutorState(nextState)
    setResultBanner({ type: 'wrong', text: t('tryAgain') })
    setShowAnswer(false) // 新答错时隐藏答案
  }

  // 显示答案的处理函数
  const handleShowAnswer = () => {
    if (tutorState.answerButtonUses > 0) {
      setTutorState((s) => ({
        ...s,
        answerButtonUses: s.answerButtonUses - 1,
      }))
      setShowAnswer(true)
    }
  }

  // 获取正确答案（根据当前语言动态获取）
  const getCorrectAnswer = () => {
    if (!question) return ''
    
    // 如果有原始数据，从原始数据中根据当前语言获取答案
    if (question.rawData) {
      const rawData = question.rawData
      if (rawData.type === 'multiple_choice' || rawData.type === 'short_answer') {
        if (typeof rawData.answer === 'object' && rawData.answer !== null) {
          // 多语言答案
          return rawData.answer[language] || rawData.answer.en || rawData.answer.zh || ''
        } else if (rawData.type === 'true_false') {
          return rawData.answer ? 'True' : 'False'
        } else {
          return String(rawData.answer || '')
        }
      } else if (rawData.type === 'true_false') {
        return rawData.answer ? 'True' : 'False'
      }
    }
    
    // 回退到原来的逻辑
    if (question.expected) {
      if (question.expected.kind === 'mapping') {
        // 对于 mapping 类型，返回格式化的答案
        const mapping = question.expected.value
        if (mapping && typeof mapping === 'object') {
          const parts = []
          if (mapping.x !== undefined) parts.push(`x:${mapping.x}`)
          if (mapping.y !== undefined) parts.push(`y:${mapping.y}`)
          return parts.join(',')
        }
      } else {
        // 对于其他类型，返回 value
        const value = String(question.expected.value || '')
        // 对于 true/false 类型，转换为更友好的显示
        if (question.type === 'true_false') {
          return value === 'true' ? 'True' : 'False'
        }
        return value
      }
    }
    
    return ''
  }

  // 计算是否显示答案按钮
  const showAnswerButton = tutorState.hasMadeFirstMistake && 
                           tutorState.answerButtonUses > 0 && 
                           hasSubmitted && 
                           !locked &&
                           question !== null

  const handleSelectLevel = (level) => {
    const clamped = clamp(level, 1, 3)
    setTutorState((s) => ({
      ...s,
      level: clamped,
      streak: 0,
      mistakesAtLevel: 0,
      mode: 'learn',
      lastMisconception: null,
      lastFeedback: null,
    }))
    setLocked(false)
    setResultBanner(null)
    setTimeout(() => nextQuestion(), 0)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__left">
          <div className="brand">CSP Super Tutor</div>
          <div className="subtitle">Variables &amp; Assignment</div>
        </div>
        <div className="topbar__right">
          <div className="language-selector">
            <button
              className={`lang-btn ${language === 'zh' ? 'lang-btn--active' : ''}`}
              type="button"
              onClick={() => changeLanguage('zh')}
            >
              中文
            </button>
            <button
              className={`lang-btn ${language === 'en' ? 'lang-btn--active' : ''}`}
              type="button"
              onClick={() => changeLanguage('en')}
            >
              English
            </button>
          </div>
          <button className="btn btn--ghost" type="button" onClick={reset}>
            {t('reset')}
          </button>
        </div>
      </header>

      {view === 'home' ? (
        <Home onStart={start} />
      ) : (
        <main className="layout">
          <section className="panel panel--question">
            <TeachingLoop
              state={tutorState}
              question={question}
              banner={resultBanner}
              onNextQuestion={nextQuestion}
              onSubmitAnswer={submitAnswer}
              onHint={revealHint}
              locked={locked}
              showAnswerButton={showAnswerButton}
              onShowAnswer={handleShowAnswer}
              correctAnswer={getCorrectAnswer()}
              answerRevealsRemaining={tutorState.answerButtonUses}
              showAnswer={showAnswer}
            />
          </section>

          <section className="panel panel--viz">
            <h2 className="panel__title">{t('visualModel')}</h2>
            <Visualization />
          </section>
        </main>
      )}
    </div>
  )
}


