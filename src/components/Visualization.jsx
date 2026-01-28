import { useState, useEffect } from 'react'
import './Visualization.css'
import { useLanguage } from '../contexts/LanguageContext'

// 多个“盒子模型”场景
const scenarios = [
  {
    id: 'basic_copy',
    label: 'A',
    titleKey: 'box_scenario_a',
    allVars: ['x', 'y'],
    lines: [
      { code: 'x = 3', apply: (vars) => ({ ...vars, x: 3 }) },
      { code: 'y = x', apply: (vars) => ({ ...vars, y: vars.x }) },
      { code: 'x = 5', apply: (vars) => ({ ...vars, x: 5 }) },
    ],
  },
  {
    id: 'overwrite_y',
    label: 'B',
    titleKey: 'box_scenario_b',
    allVars: ['x', 'y'],
    lines: [
      { code: 'x = 2', apply: (vars) => ({ ...vars, x: 2 }) },
      { code: 'y = 7', apply: (vars) => ({ ...vars, y: 7 }) },
      { code: 'y = x', apply: (vars) => ({ ...vars, y: vars.x }) },
    ],
  },
  {
    id: 'increment',
    label: 'C',
    titleKey: 'box_scenario_c',
    allVars: ['x', 'y'],
    lines: [
      { code: 'x = 1', apply: (vars) => ({ ...vars, x: 1 }) },
      { code: 'y = x + 1', apply: (vars) => ({ ...vars, y: (vars.x ?? 0) + 1 }) },
      { code: 'x = x + 1', apply: (vars) => ({ ...vars, x: (vars.x ?? 0) + 1 }) },
    ],
  },
  {
    id: 'chain_copy',
    label: 'D',
    titleKey: 'box_scenario_d',
    allVars: ['x', 'y', 'z'],
    lines: [
      { code: 'x = 4', apply: (vars) => ({ ...vars, x: 4 }) },
      { code: 'y = x', apply: (vars) => ({ ...vars, y: vars.x }) },
      { code: 'z = y', apply: (vars) => ({ ...vars, z: vars.y }) },
      { code: 'x = 9', apply: (vars) => ({ ...vars, x: 9 }) },
    ],
  },
  {
    id: 'boolean_compare',
    label: 'E',
    titleKey: 'box_scenario_e',
    allVars: ['x', 'y', 'bigger'],
    lines: [
      { code: 'x = 3', apply: (vars) => ({ ...vars, x: 3 }) },
      { code: 'y = 5', apply: (vars) => ({ ...vars, y: 5 }) },
      { code: 'bigger = x > y', apply: (vars) => ({ ...vars, bigger: (vars.x ?? 0) > (vars.y ?? 0) }) },
    ],
  },
]

function simulateProgram(lines) {
  let vars = {}
  for (const line of lines) {
    vars = line.apply(vars)
  }
  return vars
}

export default function Visualization({ onAllDone }) {
  const { t } = useLanguage()

  const [scenarioIndex, setScenarioIndex] = useState(0)
  const currentScenario = scenarios[scenarioIndex]
  const programLines = currentScenario.lines

  const [phase, setPhase] = useState('predict') // 'predict' | 'execute' | 'compare'
  const [prediction, setPrediction] = useState({ x: '', y: '', z: '', bigger: '' })
  const [currentVars, setCurrentVars] = useState({})
  const [currentLineIndex, setCurrentLineIndex] = useState(-1)
  const [finalActual, setFinalActual] = useState(() =>
    simulateProgram(currentScenario.lines),
  )
  const [feedback, setFeedback] = useState(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [clearedScenarios, setClearedScenarios] = useState([])
  const [customMode, setCustomMode] = useState(false)
  const [customNames, setCustomNames] = useState({ x: 'x', y: 'y' })
  const [customInputs, setCustomInputs] = useState({ x: '', y: '' })

  // 当切换场景时，重置所有状态
  useEffect(() => {
    setPhase('predict')
    setPrediction({ x: '', y: '', z: '', bigger: '' })
    setCurrentVars({})
    setCurrentLineIndex(-1)
    setFeedback(null)
    setIsCorrect(false)
    setFinalActual(simulateProgram(currentScenario.lines))
  }, [scenarioIndex, currentScenario])

  const handlePredictionChange = (name, value) => {
    setPrediction((prev) => ({ ...prev, [name]: value }))
  }

  const startExecution = () => {
    // 简单校验：需要的预测都要填
    if (!prediction.x.trim() || !prediction.y.trim()) return
    if (currentScenario.allVars.includes('z') && !prediction.z.trim()) return
    if (currentScenario.id === 'boolean_compare' && !prediction.bigger.trim()) return
    // 重置执行状态
    setCurrentVars({})
    setCurrentLineIndex(-1)
    setPhase('execute')
  }

  const stepExecute = () => {
    const nextIndex = currentLineIndex + 1
    if (nextIndex >= programLines.length) {
      // 执行结束，进入对比阶段
      runComparison()
      return
    }
    const line = programLines[nextIndex]
    setCurrentVars((prev) => line.apply(prev))
    setCurrentLineIndex(nextIndex)
  }

  const runComparison = () => {
    setPhase('compare')
    // 比较预测和实际结果，给出反馈（主要针对“盒子共享”误解）
    const predX = (prediction.x ?? '').trim()
    const predY = (prediction.y ?? '').trim()
    const actX = String(finalActual.x ?? '')
    const actY = String(finalActual.y ?? '')

    let allMatch = predX === actX && predY === actY
    // 场景 D 需要同时比较 z
    if (currentScenario.id === 'chain_copy') {
      const predZ = (prediction.z ?? '').trim()
      const actZ = String(finalActual.z ?? '')
      allMatch = allMatch && predZ === actZ
    }
    // 场景 E 需要比较 bigger（是/否）
    if (currentScenario.id === 'boolean_compare') {
      const predB = (prediction.bigger ?? '').trim().toLowerCase()
      const actB = (finalActual.bigger ? 'true' : 'false')
      allMatch = allMatch && (predB === actB)
    }

    if (allMatch) {
      setIsCorrect(true)
      // 记录已通关的场景（用于小成就条）
      setClearedScenarios((prev) => {
        if (prev.includes(currentScenario.id)) return prev
        const next = [...prev, currentScenario.id]
        if (next.length === scenarios.length && typeof onAllDone === 'function') {
          onAllDone()
        }
        return next
      })
      setFeedback({
        type: 'correct',
        title: t('box_feedback_correct_title'),
        text: t('box_feedback_correct_text'),
      })
      return
    }

    // 误解：把 y 当成“跟着 x 一起变的同一个盒子”
    if (predY === predX) {
      setIsCorrect(false)
      setFeedback({
        type: 'misunderstanding',
        title: t('box_feedback_shared_box_title'),
        text: t('box_feedback_shared_box_text'),
      })
      return
    }

    // 其他情况，给一个通用的盒子模型解释
    setIsCorrect(false)
    setFeedback({
      type: 'generic',
      title: t('box_feedback_generic_title'),
      text: t('box_feedback_generic_text'),
    })
  }

  const resetAll = () => {
    // 完全重置到第一个场景，重新开始整轮练习
    setScenarioIndex(0)
    setPhase('predict')
    setPrediction({ x: '', y: '', z: '', bigger: '' })
    setCurrentVars({})
    setCurrentLineIndex(-1)
    setFeedback(null)
    setIsCorrect(false)
    setClearedScenarios([])
    setCustomMode(false)
    setCustomNames({ x: 'x', y: 'y' })
    setCustomInputs({ x: '', y: '' })
    setFinalActual(simulateProgram(scenarios[0].lines))
  }

  const displayName = (name) =>
    customMode && (name === 'x' || name === 'y')
      ? customNames[name] || name
      : name

  const renderBoxes = (vars) => {
    const names = currentScenario.allVars || ['x', 'y']
    const isWideForScenario =
      currentScenario.id === 'overwrite_y' // 场景 B 盒子稍微加宽一点

    return (
      <div className="box-viz__boxes">
        {names.map((name) => (
          <div
            key={name}
            className={`box-viz__box ${
              isWideForScenario ? 'box-viz__box--wide' : ''
            }`}
          >
          <div className="box-viz__box-header">
            <span className="box-viz__box-name">{displayName(name)}</span>
          </div>
          <div className="box-viz__box-body">
            {vars[name] === undefined ? (
              <span className="box-viz__box-empty">{t('empty')}</span>
            ) : (
              <span className="box-viz__box-value">
                {name === 'bigger'
                  ? (vars[name] ? 'true' : 'false')
                  : String(vars[name])}
              </span>
            )}
          </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="box-viz">
      <div className="box-viz__header">
        <div className="box-viz__title">{t('boxModelTitle')}</div>
        <div className="box-viz__subtitle">
          {t('box_subtitle')}
        </div>
      </div>

      <div className="box-viz__layout">
        {/* 左：代码 + 预测/执行/对比说明 */}
        <div className="box-viz__column box-viz__column--left">
          <div className="box-viz__section-title">
            {t('box_code_title')} · {t('box_scenario_label', { label: currentScenario.label })}
          </div>
          <div className="box-viz__scenario-title">
            {t(currentScenario.titleKey)}
          </div>
          <pre className="box-viz__code">
            {programLines.map((line, idx) => (
              <div
                key={idx}
                className={`box-viz__code-line ${
                  phase === 'execute' && idx === currentLineIndex
                    ? 'box-viz__code-line--active'
                    : ''
                }`}
              >
                {line.code}
              </div>
            ))}
          </pre>

          <div className="box-viz__side">
            {phase === 'predict' && (
              <>
                <div className="box-viz__section-title">{t('box_predict_title')}</div>
                <div className="box-viz__predict-text">
                  {t('box_predict_text')}
                </div>
                <div className="box-viz__predict-form">
                  {(currentScenario.id === 'chain_copy'
                    ? ['x', 'y', 'z']
                    : currentScenario.id === 'boolean_compare'
                      ? ['x', 'y', 'bigger']
                      : ['x', 'y']
                  ).map((name) => (
                    <div key={name} className="box-viz__predict-row">
                      <span className="box-viz__predict-label">
                        {name} {t('box_predict_arrow')}
                      </span>
                      {name === 'bigger' ? (
                        <select
                          className="box-viz__predict-input"
                          value={prediction.bigger}
                          onChange={(e) => handlePredictionChange('bigger', e.target.value)}
                        >
                          <option value="">{t('box_boolean_placeholder')}</option>
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="box-viz__predict-input"
                          value={prediction[name]}
                          onChange={(e) => handlePredictionChange(name, e.target.value)}
                          placeholder={t('box_predict_placeholder')}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="box-viz__btn box-viz__btn--primary"
                  onClick={startExecution}
                >
                  {t('box_start_execute')}
                </button>
              </>
            )}

            {phase === 'execute' && (
              <>
                <div className="box-viz__section-title">{t('box_execute_title')}</div>
                <div className="box-viz__execute-text">
                  {currentLineIndex < 0
                    ? t('box_execute_intro')
                    : t('box_execute_line', {
                        line: programLines[currentLineIndex].code,
                      })}
                </div>
                <button
                  type="button"
                  className="box-viz__btn box-viz__btn--primary"
                  onClick={stepExecute}
                >
                  {currentLineIndex < programLines.length - 1
                    ? t('next')
                    : t('box_go_compare')}
                </button>
              </>
            )}

            {phase === 'compare' && (
              <>
                <div className="box-viz__section-title">{t('box_compare_title')}</div>
                <div className="box-viz__compare-grid">
                  {(currentScenario.id === 'chain_copy'
                    ? ['x', 'y', 'z']
                    : currentScenario.id === 'boolean_compare'
                      ? ['x', 'y', 'bigger']
                      : ['x', 'y']
                  ).map((name) => (
                    <div key={name} className="box-viz__compare-row">
                      <div className="box-viz__compare-name">{name}</div>
                      <div className="box-viz__compare-cell">
                        <div className="box-viz__compare-label">
                          {t('box_predicted')}
                        </div>
                        <div className="box-viz__compare-value">
                          {(prediction[name] ?? '').trim() || t('empty')}
                        </div>
                      </div>
                      <div className="box-viz__compare-cell">
                        <div className="box-viz__compare-label">
                          {t('box_actual')}
                        </div>
                        <div className="box-viz__compare-value">
                          {name === 'bigger'
                            ? (finalActual.bigger ? 'true' : 'false')
                            : String(finalActual[name] ?? '')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 右：变量盒子大区域 */}
        <div className="box-viz__column box-viz__column--boxes">
          <div className="box-viz__section-title">{t('box_boxes_title')}</div>
          {phase === 'predict' && (
            <div className="box-viz__boxes-hint">
              {t('box_boxes_predict_hint')}
            </div>
          )}
          {phase === 'predict' && renderBoxes({})}
          {phase === 'execute' && (
            <>
              {renderBoxes(currentVars)}

              {/* 执行阶段也显示预测值 vs 实际值对比，实际值会随着执行逐步更新 */}
              <div className="box-viz__boxes-compare-inline">
                {(currentScenario.id === 'chain_copy'
                  ? ['x', 'y', 'z']
                  : currentScenario.id === 'boolean_compare'
                    ? ['x', 'y', 'bigger']
                    : ['x', 'y']
                ).map((name) => (
                  <div key={name} className="box-viz__boxes-compare-inline-row">
                    <span className="box-viz__boxes-compare-name">{name}</span>
                    <span className="box-viz__boxes-compare-item">
                      <span className="box-viz__boxes-compare-label">{t('box_predicted')}</span>
                      <span className="box-viz__boxes-compare-value">
                        {(prediction[name] ?? '').trim() || t('empty')}
                      </span>
                    </span>
                    <span className="box-viz__boxes-compare-item">
                      <span className="box-viz__boxes-compare-label">{t('box_actual')}</span>
                      <span className="box-viz__boxes-compare-value">
                        {currentVars[name] === undefined ? (
                          <span style={{ opacity: 0.5 }}>{t('empty')}</span>
                        ) : (
                          name === 'bigger'
                            ? (currentVars[name] ? 'true' : 'false')
                            : String(currentVars[name])
                        )}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          {phase === 'compare' && (
            <>
              {renderBoxes(finalActual)}

              {/* 变量盒子下方的实时对比区，让学生一眼看到“自己填了什么 / 实际是什么” */}
              <div className="box-viz__boxes-compare-inline">
                {(currentScenario.id === 'chain_copy'
                  ? ['x', 'y', 'z']
                  : currentScenario.id === 'boolean_compare'
                    ? ['x', 'y', 'bigger']
                    : ['x', 'y']
                ).map((name) => (
                  <div key={name} className="box-viz__boxes-compare-inline-row">
                    <span className="box-viz__boxes-compare-name">{name}</span>
                    <span className="box-viz__boxes-compare-item">
                      <span className="box-viz__boxes-compare-label">{t('box_predicted')}</span>
                      <span className="box-viz__boxes-compare-value">
                        {(prediction[name] ?? '').trim() || t('empty')}
                      </span>
                    </span>
                    <span className="box-viz__boxes-compare-item">
                      <span className="box-viz__boxes-compare-label">{t('box_actual')}</span>
                      <span className="box-viz__boxes-compare-value">
                        {name === 'bigger'
                          ? (finalActual.bigger ? 'true' : 'false')
                          : String(finalActual[name] ?? '')}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="box-viz__compare-bottom">
                {feedback && (
                  <div
                    className={`box-viz__feedback box-viz__feedback--${feedback.type}`}
                  >
                    <div className="box-viz__feedback-title">{feedback.title}</div>
                    <div className="box-viz__feedback-text">{feedback.text}</div>
                  </div>
                )}

                <button
                  type="button"
                  className="box-viz__btn box-viz__btn--next"
                  onClick={() => {
                    if (!isCorrect) {
                      // 预测错误：同一场景重新来一遍（同类型，不换场景）
                      setPhase('predict')
                      setPrediction({ x: '', y: '', z: '', bigger: '' })
                      setCurrentVars({})
                      setCurrentLineIndex(-1)
                      setFeedback(null)
                      setIsCorrect(false)
                      // 如需将来支持“换一组数”，可在这里重新生成本场景的常量
                      return
                    }

                    // 预测正确：进入下一场景或自由练习
                    if (scenarioIndex < scenarios.length - 1) {
                      setScenarioIndex(scenarioIndex + 1)
                    } else {
                      // 全部通关：回到当前场景的预测阶段，自由练习
                      setPhase('predict')
                      setPrediction({ x: '', y: '', z: '', bigger: '' })
                      setCurrentVars({})
                      setCurrentLineIndex(-1)
                      setIsCorrect(false)
                      setFeedback({
                        type: 'correct',
                        title: t('box_all_done_title'),
                        text: t('box_all_done_text'),
                      })
                    }
                  }}
                >
                  {isCorrect
                    ? scenarioIndex < scenarios.length - 1
                      ? t('box_next_scenario')
                      : t('box_free_play')
                    : t('tryAgain')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* 底部类型小条 */}
      <div className="box-viz__type-strip">
        <div className="box-viz__type-chip box-viz__type-chip--int">
          <span className="box-viz__type-name">int</span>
          <span className="box-viz__type-text">{t('box_type_int')}</span>
        </div>
        <div className="box-viz__type-chip box-viz__type-chip--double">
          <span className="box-viz__type-name">double</span>
          <span className="box-viz__type-text">{t('box_type_double')}</span>
        </div>
        <div className="box-viz__type-chip box-viz__type-chip--string">
          <span className="box-viz__type-name">String</span>
          <span className="box-viz__type-text">{t('box_type_string')}</span>
        </div>
        <div className="box-viz__type-chip box-viz__type-chip--boolean">
          <span className="box-viz__type-name">boolean</span>
          <span className="box-viz__type-text">{t('box_type_boolean')}</span>
        </div>
      </div>

      {/* 进度 / 成就小条 */}
      <div className="box-viz__progress">
        <div className="box-viz__progress-title">{t('box_progress_title')}</div>
        <div className="box-viz__progress-row">
          {scenarios.map((s) => {
            const unlocked = clearedScenarios.includes(s.id)
            return (
              <div
                key={s.id}
                className={`box-viz__progress-badge ${
                  unlocked ? 'box-viz__progress-badge--on' : 'box-viz__progress-badge--off'
                }`}
              >
                <span className="box-viz__progress-label">
                  {t('box_scenario_label', { label: s.label })}
                </span>
                <span className="box-viz__progress-icon">
                  {unlocked ? '■' : '□'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
