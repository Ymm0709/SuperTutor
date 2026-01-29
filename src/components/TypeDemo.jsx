import { useState, useEffect } from 'react'
import './TypeDemo.css'
import { useLanguage } from '../contexts/LanguageContext'

export default function TypeDemo({ onComplete, isCollapsed = false, isMinimized = false, onMinimize }) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    {
      title: t('demoTypeStep1Title'),
      description: t('demoTypeStep1Desc'),
      type: 'int',
      value: 42,
      bytes: 4,
      color: 'rgba(106, 168, 255, 0.3)',
    },
    {
      title: t('demoTypeStep2Title'),
      description: t('demoTypeStep2Desc'),
      type: 'double',
      value: 3.14159,
      bytes: 8,
      color: 'rgba(61, 220, 151, 0.3)',
    },
    {
      title: t('demoTypeStep3Title'),
      description: t('demoTypeStep3Desc'),
      type: 'string',
      value: 'hello',
      bytes: 5,
      color: 'rgba(255, 150, 200, 0.3)',
    },
    {
      title: t('demoTypeStep4Title'),
      description: t('demoTypeStep4Desc'),
      type: 'boolean',
      value: true,
      bytes: 1,
      color: 'rgba(255, 204, 102, 0.3)',
    },
  ]

  const totalSteps = steps.length + 1 // 第 0 步是总览树，后面每一步是具体类型
  const maxIndex = totalSteps - 1

  const handleNext = () => {
    if (currentStep < maxIndex) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      // 到达最后一步，可以最小化
      onMinimize?.()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex <= maxIndex) {
      setCurrentStep(stepIndex)
    }
  }

  const isTreeStep = currentStep === 0
  const currentStepData = isTreeStep ? null : (steps[currentStep - 1] || steps[0])

  if (isMinimized) {
    return (
      <div className="type-demo-minimized" onClick={onMinimize}>
        <div className="type-demo-minimized__icon">📦</div>
        <div className="type-demo-minimized__text">{t('typeDemoMinimized')}</div>
      </div>
    )
  }

  if (isCollapsed) {
    return (
      <div className="type-demo type-demo--collapsed">
        <div className="type-demo__summary">
          <div className="type-demo__summary-title">{t('typeDemoSummary')}</div>
          <div className="type-demo__summary-items">
            {steps.map((step, idx) => (
              <div key={idx} className="type-demo__summary-item">
                <span className="type-demo__summary-type">{step.type}</span>
                <span className="type-demo__summary-bytes">{step.bytes} bytes</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="type-demo">
      <div className="type-demo__header">
        <div className="type-demo__title">{t('typeDemoTitle')}</div>
        <div className="type-demo__subtitle">{t('typeDemoSubtitle')}</div>
      </div>

      <div className="type-demo__content">
        <div className={`type-demo__cell ${isAnimating ? 'type-demo__cell--animating' : ''}`}
             style={{ '--type-color': isTreeStep ? 'rgba(106, 168, 255, 0.3)' : currentStepData.color }}>
          {isTreeStep ? (
            <div className="type-demo__tree">
              <div className="type-demo__tree-root">variable</div>
              <div className="type-demo__tree-branches">
                {steps.map((step, idx) => (
                  <div key={step.type} className="type-demo__tree-node">
                    <div className="type-demo__tree-node-line" />
                    <div className="type-demo__tree-node-box">
                      <div className="type-demo__tree-node-type">{step.type}</div>
                      <div className="type-demo__tree-node-bytes">{step.bytes} bytes</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="type-demo__cell-header">
                <span className="type-demo__cell-name">variable</span>
                <span className="type-demo__cell-type">{currentStepData.type}</span>
              </div>
              <div className="type-demo__cell-body">
                <div className="type-demo__cell-space" style={{ width: `${currentStepData.bytes * 20}px` }}>
                  <div className="type-demo__cell-bytes">{currentStepData.bytes} bytes</div>
                </div>
                <div className="type-demo__cell-value">
                  {typeof currentStepData.value === 'boolean' 
                    ? (currentStepData.value ? 'true' : 'false')
                    : currentStepData.type === 'string'
                    ? `"${currentStepData.value}"`
                    : currentStepData.value}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="type-demo__info">
          <div className="type-demo__step-title">
            {isTreeStep ? t('typeTreeTitle') : currentStepData.title}
          </div>
          {isTreeStep ? (
            <div className="type-demo__overview">
              <div className="type-demo__overview-lead">
                {t('typeTreeDesc')}
              </div>
              <div className="type-demo__overview-grid">
                <div className="type-demo__overview-item type-demo__overview-item--int">
                  <div className="type-demo__overview-top">
                    <span className="type-demo__overview-dot" />
                    <span className="type-demo__overview-type">int</span>
                    <span className="type-demo__overview-bytes">4 bytes</span>
                  </div>
                  <div className="type-demo__overview-sub">整数，例如 42</div>
                </div>

                <div className="type-demo__overview-item type-demo__overview-item--double">
                  <div className="type-demo__overview-top">
                    <span className="type-demo__overview-dot" />
                    <span className="type-demo__overview-type">double</span>
                    <span className="type-demo__overview-bytes">8 bytes</span>
                  </div>
                  <div className="type-demo__overview-sub">小数，例如 3.14</div>
                </div>

                <div className="type-demo__overview-item type-demo__overview-item--string">
                  <div className="type-demo__overview-top">
                    <span className="type-demo__overview-dot" />
                    <span className="type-demo__overview-type">String</span>
                    <span className="type-demo__overview-bytes">n bytes</span>
                  </div>
                  <div className="type-demo__overview-sub">文本，例如 "hello"（长度决定空间）</div>
                </div>

                <div className="type-demo__overview-item type-demo__overview-item--boolean">
                  <div className="type-demo__overview-top">
                    <span className="type-demo__overview-dot" />
                    <span className="type-demo__overview-type">boolean</span>
                    <span className="type-demo__overview-bytes">1 byte</span>
                  </div>
                  <div className="type-demo__overview-sub">只存 true / false（判断结果）</div>
                </div>
              </div>
              <div className="type-demo__overview-foot">
                小结：类型告诉我们“盒子能装什么”，以及“通常需要多大的空间”。
              </div>
            </div>
          ) : (
            <div className="type-demo__step-desc">
              {currentStepData.description}
            </div>
          )}
        </div>

        <div className="type-demo__progress">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`type-demo__progress-dot ${idx === currentStep ? 'type-demo__progress-dot--active' : ''} ${idx < currentStep ? 'type-demo__progress-dot--completed' : ''}`}
              onClick={() => handleStep(idx)}
              title={idx === 0 ? t('typeTreeStepLabel') : `${t('step')} ${idx}`}
            />
          ))}
        </div>

        <div className="type-demo__controls">
          <button
            type="button"
            className="type-demo__control-btn"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            {t('prev')}
          </button>
          <button
            type="button"
            className="type-demo__control-btn type-demo__control-btn--primary"
            onClick={handleNext}
          >
            {currentStep === maxIndex ? t('close') : t('next')}
          </button>
          <button
            type="button"
            className="type-demo__control-btn type-demo__control-btn--minimize"
            onClick={onMinimize}
            title={t('minimizeTypeDemo')}
          >
            {t('minimize')}
          </button>
        </div>
      </div>
    </div>
  )
}
