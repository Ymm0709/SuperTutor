import { useState, useEffect } from 'react'
import './TimeLineVisualization.css'
import { useLanguage } from '../contexts/LanguageContext'

function VariableBox({ name, value, type = 'int', isHighlighted = false, isReading = false, isStoring = false }) {
  const { t } = useLanguage()
  const isEmpty = value === undefined || value === null
  
  const getTypeColor = (type) => {
    if (type === 'int') return 'rgba(106, 168, 255, 0.3)'
    if (type === 'double') return 'rgba(61, 220, 151, 0.3)'
    if (type === 'boolean') return 'rgba(255, 204, 102, 0.3)'
    return 'rgba(106, 168, 255, 0.3)'
  }

  const getTypeSize = (type) => {
    if (type === 'int') return 4
    if (type === 'double') return 8
    if (type === 'boolean') return 1
    return 4
  }

  return (
    <div 
      className={`variable-box ${isHighlighted ? 'variable-box--highlighted' : ''} ${isReading ? 'variable-box--reading' : ''} ${isStoring ? 'variable-box--storing' : ''}`}
      style={{ '--type-color': getTypeColor(type) }}
    >
      <div className="variable-box__header">
        <span className="variable-box__name">{name}</span>
        <span className="variable-box__type">{type}</span>
      </div>
      <div className="variable-box__space" style={{ width: `${getTypeSize(type) * 12}px` }}>
        <span className="variable-box__bytes">{getTypeSize(type)} bytes</span>
      </div>
      <div className={`variable-box__value ${isEmpty ? 'variable-box__value--empty' : ''}`}>
        {isEmpty ? t('empty') : value}
      </div>
    </div>
  )
}

function TimelineStep({ step, vars, codeLine, explanation, isActive, isCompleted, highlightVar, readingVar, storingVar }) {
  const { t } = useLanguage()
  
  return (
    <div className={`timeline-step ${isActive ? 'timeline-step--active' : ''} ${isCompleted ? 'timeline-step--completed' : ''}`}>
      <div className="timeline-step__header">
        <div className="timeline-step__number">{step}</div>
        <div className="timeline-step__code">{codeLine}</div>
      </div>
      <div className="timeline-step__explanation">{explanation}</div>
      <div className="timeline-step__vars">
        {Object.keys(vars).sort().map(name => (
          <VariableBox
            key={name}
            name={name}
            value={vars[name]}
            type="int"
            isHighlighted={highlightVar === name}
            isReading={readingVar === name}
            isStoring={storingVar === name}
          />
        ))}
      </div>
    </div>
  )
}

export default function TimeLineVisualization({ scenario, onComplete, isMinimized = false, onMinimize }) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highlightVar, setHighlightVar] = useState(null)
  const [readingVar, setReadingVar] = useState(null)
  const [storingVar, setStoringVar] = useState(null)

  if (isMinimized) {
    return (
      <div className="timeline-minimized" onClick={onMinimize}>
        <div className="timeline-minimized__icon">📊</div>
        <div className="timeline-minimized__text">{t('timelineMinimized')}</div>
      </div>
    )
  }

  // 场景1: x = x + 1
  const scenario1 = {
    title: t('timelineScenario1Title'),
    description: t('timelineScenario1Desc'),
    steps: [
      {
        codeLine: 'x = x + 1',
        explanation: t('timelineStep1_1'),
        vars: { x: 5 },
        highlightVar: null,
        readingVar: null,
        storingVar: null,
      },
      {
        codeLine: 'x = x + 1',
        explanation: t('timelineStep1_2'),
        vars: { x: 5 },
        highlightVar: 'x',
        readingVar: 'x',
        storingVar: null,
      },
      {
        codeLine: 'x = x + 1',
        explanation: t('timelineStep1_3'),
        vars: { x: 5 },
        highlightVar: null,
        readingVar: null,
        storingVar: null,
      },
      {
        codeLine: 'x = x + 1',
        explanation: t('timelineStep1_4'),
        vars: { x: 6 },
        highlightVar: 'x',
        readingVar: null,
        storingVar: 'x',
      },
    ]
  }

  // 场景2: x = 10, y = x, x = 5
  const scenario2 = {
    title: t('timelineScenario2Title'),
    description: t('timelineScenario2Desc'),
    steps: [
      {
        codeLine: 'x = 10',
        explanation: t('timelineStep2_1'),
        vars: { x: undefined, y: undefined },
        highlightVar: null,
        readingVar: null,
        storingVar: null,
      },
      {
        codeLine: 'x = 10',
        explanation: t('timelineStep2_2'),
        vars: { x: 10, y: undefined },
        highlightVar: 'x',
        readingVar: null,
        storingVar: 'x',
      },
      {
        codeLine: 'y = x',
        explanation: t('timelineStep2_3'),
        vars: { x: 10, y: undefined },
        highlightVar: 'x',
        readingVar: 'x',
        storingVar: null,
      },
      {
        codeLine: 'y = x',
        explanation: t('timelineStep2_4'),
        vars: { x: 10, y: 10 },
        highlightVar: 'y',
        readingVar: null,
        storingVar: 'y',
      },
      {
        codeLine: 'x = 5',
        explanation: t('timelineStep2_5'),
        vars: { x: 10, y: 10 },
        highlightVar: 'x',
        readingVar: null,
        storingVar: 'x',
      },
      {
        codeLine: 'x = 5',
        explanation: t('timelineStep2_6'),
        vars: { x: 5, y: 10 },
        highlightVar: null,
        readingVar: null,
        storingVar: null,
      },
    ]
  }

  const currentScenario = scenario === 1 ? scenario1 : scenario2
  const steps = currentScenario.steps

  const handleStep = (stepIndex) => {
    setCurrentStep(stepIndex)
    setIsPlaying(false)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // 到达最后一步，可以最小化
      onMinimize?.()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 手动控制步骤，显示动画效果
  useEffect(() => {
    const step = steps[currentStep]
    
    // 设置高亮
    setHighlightVar(step.highlightVar)
    
    // 处理读取动画
    if (step.readingVar) {
      setReadingVar(step.readingVar)
      setTimeout(() => setReadingVar(null), 1000)
    } else {
      setReadingVar(null)
    }
    
    // 处理存储动画
    if (step.storingVar) {
      const delay = step.readingVar ? 1000 : 0
      setTimeout(() => {
        setStoringVar(step.storingVar)
        setTimeout(() => setStoringVar(null), 1000)
      }, delay)
    } else {
      setStoringVar(null)
    }
  }, [currentStep, steps])

  return (
    <div className="timeline-visualization">
      <div className="timeline-visualization__header">
        <div className="timeline-visualization__title">{currentScenario.title}</div>
        <div className="timeline-visualization__description">{currentScenario.description}</div>
      </div>

      <div className="timeline-visualization__controls">
        <button
          className="timeline-control-btn"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          {t('prev')}
        </button>
        <button
          className="timeline-control-btn"
          onClick={handleNext}
        >
          {currentStep === steps.length - 1 ? t('close') : t('next')}
        </button>
        <button
          className="timeline-control-btn timeline-control-btn--minimize"
          onClick={onMinimize}
          title={t('minimizeTimeline')}
        >
          {t('minimize')}
        </button>
        <div className="timeline-progress">
          {steps.map((_, idx) => (
            <button
              key={idx}
              className={`timeline-progress-dot ${idx === currentStep ? 'timeline-progress-dot--active' : ''} ${idx < currentStep ? 'timeline-progress-dot--completed' : ''}`}
              onClick={() => handleStep(idx)}
              title={`${t('step')} ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="timeline-visualization__content">
        <div className="timeline-track">
          {steps.map((step, idx) => (
            <div key={idx} className="timeline-track__item">
              <div className="timeline-track__line" />
              <TimelineStep
                step={idx + 1}
                vars={step.vars}
                codeLine={step.codeLine}
                explanation={step.explanation}
                isActive={idx === currentStep}
                isCompleted={idx < currentStep}
                highlightVar={idx === currentStep ? step.highlightVar : null}
                readingVar={idx === currentStep ? readingVar : null}
                storingVar={idx === currentStep ? storingVar : null}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
