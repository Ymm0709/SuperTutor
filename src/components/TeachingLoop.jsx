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
            : question.reteach && state.mode === 'retest'
            ? `${state.lastFeedback ? `${t('youMayBeStuckOn')}${state.lastFeedback}\n\n` : ''}${question.reteach.title}\n\n${question.reteach.text}\n\n${t('keyIdea')}: ${getKeyIdea(question, t)}\n\n${t('hintLabel')}: ${question.reteach.hint}\n\n${t('analogy')}: ${question.reteach.analogy}`
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

function getKeyIdea(question, t) {
  if (question.level === 1) return t('teaching_l1')
  if (question.level === 2) return t('teaching_l2')
  if (question.level === 3) return t('teaching_l3')
  return t('teaching_l4')
}

