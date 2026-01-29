import { useEffect, useState } from 'react'
import './TeachingLoop.css'
import { useLanguage } from '../contexts/LanguageContext'
import { getQuestionText } from '../utils/questionGenerator'

export default function TeachingLoop({ 
  state, 
  question, 
  banner,
  onNextQuestion, 
  onSubmitAnswer,
  onHint,
  locked,
  showAnswerButton,
  onShowAnswer,
  correctAnswer,
  answerRevealsRemaining,
  showAnswer
}) {
  const { t, language } = useLanguage()
  const [answer, setAnswer] = useState('')
  const [answerX, setAnswerX] = useState('')
  const [answerY, setAnswerY] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // 根据当前语言动态获取题目文本
  const prompt = question ? getQuestionText(question, 'prompt', language) : ''
  let mainText = prompt
  let codeText = ''
  const isMapping = question?.expected?.kind === 'mapping'
  
  // 根据当前语言动态获取选项
  const questionOptions = question ? (getQuestionText(question, 'options', language) || question.options) : null
  const isMultipleChoice = questionOptions && questionOptions.length > 0
  const isTrueFalse = question?.type === 'true_false'
  
  // 支持中英文分隔符
  const statementLabel = t('q1_statement')
  const idx = prompt.indexOf(statementLabel)
  if (idx !== -1) {
    mainText = prompt.slice(0, idx).trim()
    codeText = prompt.slice(idx + statementLabel.length).trim()
  }

  const handleSubmit = () => {
    if (!question || locked) return

    if (isMapping) {
      if (!answerX.trim() || !answerY.trim()) return
      setIsSubmitting(true)
      const combined = `x:${answerX},y:${answerY}`
      onSubmitAnswer(combined)
      setTimeout(() => {
        setIsSubmitting(false)
        setAnswerX('')
        setAnswerY('')
      }, 500)
      return
    }

    if (isMultipleChoice) {
      if (!selectedOption) return
      setIsSubmitting(true)
      onSubmitAnswer(selectedOption)
      setTimeout(() => {
        setIsSubmitting(false)
        setSelectedOption('')
      }, 500)
      return
    }

    if (isTrueFalse) {
      if (!answer.trim()) return
      setIsSubmitting(true)
      onSubmitAnswer(answer)
      setTimeout(() => {
        setIsSubmitting(false)
        setAnswer('')
      }, 500)
      return
    }

    if (!answer.trim()) return
    setIsSubmitting(true)
    onSubmitAnswer(answer)
    setTimeout(() => {
      setIsSubmitting(false)
      setAnswer('')
    }, 500)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleHint = () => {
    setShowHint(!showHint)
    onHint?.()
  }

  // 当问题改变时，隐藏 hint 并重置答案
  // 使用 question?.id 而不是 question 对象本身，避免语言切换时触发重置
  useEffect(() => {
    setShowHint(false)
    setAnswer('')
    setAnswerX('')
    setAnswerY('')
    setSelectedOption('')
  }, [question?.id]) // 只监听 question.id 的变化，而不是整个 question 对象
  
  // 当语言改变时，如果已选择选项，需要重新匹配（因为选项文本可能已改变）
  useEffect(() => {
    if (isMultipleChoice && selectedOption && questionOptions) {
      // 检查当前选中的选项是否还在新语言的选项中
      if (!questionOptions.includes(selectedOption)) {
        // 如果不在，清空选择（让用户重新选择）
        setSelectedOption('')
      }
    }
  }, [language, isMultipleChoice, questionOptions])

  return (
    <div className="teaching-loop">
      <div className="status-pills">
        <div className="pill pill--ok">{t('continuousCorrect')}{state.streak}</div>
      </div>

      <div className="question-box">
        <div className="question-box__title">{t('question')}</div>
        <div className="question-box__body">
          <div className="question-box__text">
            {question ? mainText : t('waiting')}
          </div>
          {question && codeText ? (
            <pre className="question-box__code">
              {codeText}
            </pre>
          ) : null}
        </div>

        {banner ? (
          <div className={`banner banner--${banner.type}`}>{banner.text}</div>
        ) : null}

        {isMapping ? (
          <div className="answer-row answer-row--multi">
            <div className="answer-group">
              <label className="answer-label">x =</label>
              <input
                className="answer-input"
                type="text"
                value={answerX}
                onChange={(e) => setAnswerX(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('number')}
                disabled={!question || isSubmitting || locked}
                autoComplete="off"
              />
            </div>
            <div className="answer-group">
              <label className="answer-label">y =</label>
              <input
                className="answer-input"
                type="text"
                value={answerY}
                onChange={(e) => setAnswerY(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('number')}
                disabled={!question || isSubmitting || locked}
                autoComplete="off"
              />
            </div>
            <button
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={!question || !answerX.trim() || !answerY.trim() || isSubmitting || locked}
            >
              {t('submit')}
            </button>
          </div>
        ) : isMultipleChoice ? (
          <div className="answer-row answer-row--multiple-choice">
            <div className="options-list">
              {questionOptions && questionOptions.map((option, index) => (
                <label key={index} className={`option-item ${selectedOption === option ? 'option-item--selected' : ''}`}>
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedOption === option}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    disabled={!question || isSubmitting || locked}
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
            <button
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={!question || !selectedOption || isSubmitting || locked}
            >
              {t('submit')}
            </button>
          </div>
        ) : isTrueFalse ? (
          <div className="answer-row answer-row--true-false">
            <label className={`option-item ${answer === 'true' ? 'option-item--selected' : ''}`}>
              <input
                type="radio"
                name="trueFalse"
                value="true"
                checked={answer === 'true'}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!question || isSubmitting || locked}
              />
              <span className="option-text">True</span>
            </label>
            <label className={`option-item ${answer === 'false' ? 'option-item--selected' : ''}`}>
              <input
                type="radio"
                name="trueFalse"
                value="false"
                checked={answer === 'false'}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!question || isSubmitting || locked}
              />
              <span className="option-text">False</span>
            </label>
            <button
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={!question || !answer.trim() || isSubmitting || locked}
            >
              {t('submit')}
            </button>
          </div>
        ) : (
          <div className="answer-row">
            <input
              className="answer-input"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={question?.inputHint || t('placeholder')}
              disabled={!question || isSubmitting || locked}
              autoComplete="off"
            />
            <button
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={!question || !answer.trim() || isSubmitting || locked}
            >
              {t('submit')}
            </button>
          </div>
        )}

        <div className="controls">
          {showAnswerButton && (
            <button
              className="btn btn--ghost"
              onClick={onShowAnswer}
              disabled={!question || isSubmitting || showAnswer}
              title={answerRevealsRemaining > 0 ? t('answerRevealRemaining', { count: answerRevealsRemaining }) : ''}
            >
              {t('answer')} {answerRevealsRemaining > 0 && `(${answerRevealsRemaining})`}
            </button>
          )}
          <button
            className={`btn btn--ghost ${showHint ? 'btn--active' : ''}`}
            onClick={handleHint}
            disabled={!question || isSubmitting}
          >
            {t('hint')}
          </button>
          <button
            className="btn btn--secondary"
            onClick={onNextQuestion}
            disabled={isSubmitting}
          >
            {t('nextQuestion')}
          </button>
        </div>
      </div>

      {showAnswer && correctAnswer && (
        <div className="hint-box hint-box--answer">
          <div className="hint-box__title">{t('answer')}</div>
          <div className="hint-box__text">
            {correctAnswer}
          </div>
        </div>
      )}

      {showHint && question && (
        <div className="hint-box">
          <div className="hint-box__title">{t('hint')}</div>
          <div className="hint-box__text">
            {getQuestionText(question, 'hint', language) || question.reteach?.hint || t('noHintAvailable')}
          </div>
        </div>
      )}

      <div className="teach-box">
        <div className="teach-box__title">
          {!question ? t('startText') : state.mode === 'retest' ? t('hintAndCorrection') : t('shortExplanation')}
        </div>
        <div className="teach-box__text">
          {!question 
            ? t('clickNextToStart')
            : state.mode === 'retest'
            ? (() => {
                const reteach = getReteachForMisconception(state.lastMisconception, question, t)
                return `${state.lastFeedback ? `${t('youMayBeStuckOn')}${state.lastFeedback}\n\n` : ''}${reteach.title}\n\n${reteach.text}\n\n${t('keyIdea')}: ${reteach.hint}\n\n${t('hintLabel')}: ${reteach.hint}\n\n${t('analogy')}:\n${reteach.analogy}`
              })()
            : getTeachingText(question, t)
          }
        </div>
      </div>
    </div>
  )
}

function getTeachingText(question, t) {
  const base = t('teaching_base')
  if (question.level === 1) return `${base} ${t('teaching_l1')}`
  if (question.level === 2) return `${base} ${t('teaching_l2')}`
  if (question.level === 3) return `${base} ${t('teaching_l3')}`
  return `${base} ${t('teaching_l4')}`
}

// 根据 misconception 文字匹配对应的 reteach key
function getReteachKeyFromMisconception(misconceptionText, t) {
  if (!misconceptionText) return null
  
  // 创建映射：翻译后的 misconception 文字 -> reteach key
  // 需要同时匹配中英文
  const misconceptionToReteachKey = {
    // 中文
    [t('q1_misconception_equals')]: 'q1',
    [t('q1_misconception_name')]: 'q1',
    [t('q2_misconception_ignore')]: 'q2',
    [t('q2_misconception_order')]: 'q2',
    [t('q3_misconception_format')]: 'q3',
    [t('q3_misconception_binding')]: 'q3',
    [t('q3_misconception_track')]: 'q3',
    [t('q4_misconception_temp')]: 'q4',
    [t('q4_misconception_swap')]: 'q4',
    // 英文（如果语言切换后）
    'Treating assignment as equals/comparison': 'q1',
    'Treating variable as a name instead of a box': 'q1',
    'Ignoring overwrite/thinking first assignment is permanent': 'q2',
    'Unstable execution order tracking': 'q2',
    'Format error': 'q3',
    'Thinking y follows x changes (treating copy as binding/reference)': 'q3',
    'Unstable execution tracking': 'q3',
    'Ignoring temporary variable/overwrite causes value loss': 'q4',
    'Unstable swap tracking': 'q4',
  }
  
  return misconceptionToReteachKey[misconceptionText] || null
}

// 根据 misconception 获取针对性的 reteach 内容
function getReteachForMisconception(misconceptionText, question, t) {
  const reteachKey = getReteachKeyFromMisconception(misconceptionText, t)
  
  if (reteachKey === 'q1') {
    return {
      title: t('q1_reteach_title'),
      text: t('q1_reteach_text'),
      analogy: t('q1_reteach_analogy'),
      hint: t('q1_reteach_hint'),
    }
  } else if (reteachKey === 'q2') {
    // Q2 的 analogy 需要参数，但这里我们没有具体值，使用通用版本
    const analogyText = t('q2_reteach_analogy', { a: '第一个值', b: '第二个值' })
    return {
      title: t('q2_reteach_title'),
      text: t('q2_reteach_text'),
      analogy: analogyText.replace('第一个值', '第一个数').replace('第二个值', '第二个数'),
      hint: t('q2_reteach_hint'),
    }
  } else if (reteachKey === 'q3') {
    return {
      title: t('q3_reteach_title'),
      text: t('q3_reteach_text'),
      analogy: t('q3_reteach_analogy'),
      hint: t('q3_reteach_hint'),
    }
  } else if (reteachKey === 'q4') {
    return {
      title: t('q4_reteach_title'),
      text: t('q4_reteach_text'),
      analogy: t('q4_reteach_analogy'),
      hint: t('q4_reteach_hint'),
    }
  }
  
  // 如果没有匹配到，使用题目的默认 reteach（如果有）
  if (question.reteach) {
    return question.reteach
  }
  
  // 最后回退到根据 level 的通用内容
  if (question.level === 1) {
    return {
      title: t('q1_reteach_title'),
      text: t('q1_reteach_text'),
      analogy: t('q1_reteach_analogy'),
      hint: t('q1_reteach_hint'),
    }
  } else if (question.level === 2) {
    return {
      title: t('q2_reteach_title'),
      text: t('q2_reteach_text'),
      analogy: t('q2_reteach_analogy', { a: '第一个数', b: '第二个数' }),
      hint: t('q2_reteach_hint'),
    }
  } else if (question.level === 3) {
    return {
      title: t('q3_reteach_title'),
      text: t('q3_reteach_text'),
      analogy: t('q3_reteach_analogy'),
      hint: t('q3_reteach_hint'),
    }
  }
  
  return {
    title: t('q4_reteach_title'),
    text: t('q4_reteach_text'),
    analogy: t('q4_reteach_analogy'),
    hint: t('q4_reteach_hint'),
  }
}

function getKeyIdea(question, t) {
  // 如果有 reteach，使用 reteach 的 hint 作为 key idea（更针对错误）
  if (question.reteach && question.reteach.hint) {
    return question.reteach.hint
  }
  // 否则根据 level 返回通用的
  if (question.level === 1) return t('teaching_l1')
  if (question.level === 2) return t('teaching_l2')
  if (question.level === 3) return t('teaching_l3')
  return t('teaching_l4')
}

