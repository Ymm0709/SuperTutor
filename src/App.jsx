import { useEffect, useState } from 'react'
import Visualization from './components/Visualization'
import TeachingLoop from './components/TeachingLoop'
import Home from './components/Home'
import TypeDemo from './components/TypeDemo'
import DragBoxViz from './components/DragBoxViz'
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
  const [showDemo, setShowDemo] = useState(false)
  const [demoCompleted, setDemoCompleted] = useState(false)
  const [demoMinimized, setDemoMinimized] = useState(false)
  const [boxTrainerDone, setBoxTrainerDone] = useState(false) // 盒子模型是否已通关
  const [resultBanner, setResultBanner] = useState(null) // { type: 'correct'|'wrong', text: string }
  const [locked, setLocked] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false) // 是否显示答案

  // 越级（跳过 Visual Model）弹窗
  const [skipOpen, setSkipOpen] = useState(false)
  const [skipAnswers, setSkipAnswers] = useState({ q1: '', q2: '', q3: '' })
  const [skipChecked, setSkipChecked] = useState(false)
  const [skipError, setSkipError] = useState('')
  const [skipLockedOut, setSkipLockedOut] = useState(false)
  const [skipPassed, setSkipPassed] = useState(false)

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
    setShowDemo(true)
    setDemoCompleted(false)
    setBoxTrainerDone(false)
    setHasSubmitted(false)
    setShowAnswer(false)
    // 不直接出题，等演示完成
  }

  const handleDemoComplete = () => {
    setDemoCompleted(true)
    setShowDemo(false)
  }

  const handleDemoMinimize = () => {
    setDemoMinimized(true)
    setShowDemo(false)
    if (!demoCompleted) {
      setDemoCompleted(true)
    }
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
    setShowDemo(false)
    setDemoCompleted(false)
    setBoxTrainerDone(false)
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

  const skipQuestions = [
    { id: 'q1', correct: 'C' },
    { id: 'q2', correct: 'A' },
    { id: 'q3', correct: 'B' },
  ]

  const handleOpenSkip = () => {
    if (skipLockedOut) return
    setSkipOpen(true)
    setSkipChecked(false)
    setSkipError('')
    setSkipPassed(false)
    setSkipAnswers({ q1: '', q2: '', q3: '' })
  }

  const handleCloseSkip = () => {
    setSkipOpen(false)
    setSkipChecked(false)
    setSkipError('')
  }

  const handleContinueSkip = () => {
    // 全对后由用户点“进入下一页”
    setSkipError('')
    setSkipOpen(false)
    setBoxTrainerDone(true)
    setQuestion(null)
    setResultBanner(null)
    setLocked(false)
    setHasSubmitted(false)
    setShowAnswer(false)
    setTimeout(() => nextQuestion(), 500)
  }

  const handleSubmitSkip = () => {
    // 一次性机会：只要提交失败（未做完/有错）就锁死并退出弹窗
    const wrongNums = []
    for (let i = 0; i < skipQuestions.length; i++) {
      const q = skipQuestions[i]
      const num = i + 1
      const chosen = (skipAnswers[q.id] || '').trim().toUpperCase()
      if (!chosen || chosen !== q.correct) wrongNums.push(num)
    }

    if (wrongNums.length > 0) {
      const list = wrongNums.join(', ')
      // 标红错题 + 提示，然后退出弹窗并禁用
      setSkipChecked(true)
      setSkipError(t('skip_modal_fail_inline', { list }))
      setSkipLockedOut(true) // 立刻禁用跳过（用户退出后按钮会变灰）
      return
    }

    // 全对：停留在弹窗内，提示通过，让用户点击“进入下一页”
    setSkipChecked(true)
    setSkipPassed(true)
    setSkipError('')
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
        <main className={boxTrainerDone ? 'layout' : 'layout layout--single'}>
          {showDemo ? (
            <div className="demo-container">
              <TypeDemo 
                onComplete={handleDemoComplete}
                isMinimized={false}
                onMinimize={handleDemoMinimize}
              />
            </div>
          ) : (
            <>
              {boxTrainerDone ? (
                <>
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
                    <div className="panel__title-row">
                      <h2 className="panel__title">{t('visualModel')}</h2>
                    </div>
                    <DragBoxViz />
                  </section>
                </>
              ) : (
                <section className="panel panel--viz panel--full">
                  <div className="panel__title-row">
                    <h2 className="panel__title">{t('visualModel')}</h2>
                    <button
                      type="button"
                      className={`panel__title-action ${skipLockedOut ? 'panel__title-action--disabled' : ''}`}
                      onClick={handleOpenSkip}
                      disabled={skipLockedOut}
                    >
                      {t('skip_button')}
                    </button>
                  </div>
                  {skipLockedOut && (
                    <div className="panel__title-hint">
                      {t('skip_locked_hint')}
                    </div>
                  )}
                  <Visualization
                    onAllDone={() => {
                      setBoxTrainerDone(true)
                      // 盒子模型通关后再出第一题
                      setTimeout(() => nextQuestion(), 500)
                    }}
                  />
                </section>
              )}
            </>
          )}
          
          {demoMinimized && (
            <TypeDemo 
              onComplete={null}
              isMinimized={true}
              onMinimize={() => {
                setDemoMinimized(false)
                setShowDemo(true)
              }}
            />
          )}
        </main>
      )}

      {skipOpen && (
        <div className="skip-modal" role="dialog" aria-modal="true">
          <div className="skip-modal__backdrop" onClick={handleCloseSkip} />
          <div className="skip-modal__panel">
            <div className="skip-modal__header">
              <div className="skip-modal__title">{t('skip_modal_title')}</div>
              <button type="button" className="skip-modal__close" onClick={handleCloseSkip}>
                ×
              </button>
            </div>
            <div className="skip-modal__desc">{t('skip_modal_desc')}</div>

            <div className="skip-modal__body">
              {skipQuestions.map((q, idx) => {
                const id = q.id
                const chosen = (skipAnswers[id] || '').toUpperCase()
                const wrong = skipChecked && (!chosen || chosen !== q.correct)
                return (
                  <div key={id} className={`skip-modal__q ${wrong ? 'skip-modal__q--wrong' : ''}`}>
                    <div className="skip-modal__q-title">{t(`skip_${id}_title`)}</div>
                    <pre className="skip-modal__code">{t(`skip_${id}_code`)}</pre>
                    <div className="skip-modal__q-text">{t(`skip_${id}_question`)}</div>
                    <div className="skip-modal__options">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <label key={opt} className="skip-modal__opt">
                          <input
                            type="radio"
                            name={id}
                            value={opt}
                            checked={skipAnswers[id] === opt}
                            onChange={() => {
                              setSkipAnswers((prev) => ({ ...prev, [id]: opt }))
                              setSkipError('')
                            }}
                          />
                          <span className="skip-modal__opt-text">{t(`skip_${id}_opt_${opt}`)}</span>
                        </label>
                      ))}
                    </div>
                    {wrong && <div className="skip-modal__wrong">{t('skip_modal_one_wrong')}</div>}
                  </div>
                )
              })}
            </div>

            {skipPassed && (
              <div className="skip-modal__success">{t('skip_modal_pass_inline')}</div>
            )}
            {skipError && <div className="skip-modal__error">{skipError}</div>}

            <div className="skip-modal__footer">
              <button type="button" className="btn btn--ghost" onClick={handleCloseSkip}>
                {t('skip_modal_exit')}
              </button>
              {skipPassed ? (
                <button type="button" className="btn" onClick={handleContinueSkip}>
                  {t('skip_modal_continue')}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn"
                  onClick={handleSubmitSkip}
                  disabled={skipLockedOut}
                >
                  {t('skip_modal_submit')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


