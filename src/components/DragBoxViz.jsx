import { useRef, useState } from 'react'
import './Visualization.css'
import { useLanguage } from '../contexts/LanguageContext'

// 简单的值生成工具：可扩展成更多类型
const makeValue = (raw) => {
  if (raw === 'true') return { display: 'true', type: 'boolean', value: true }
  if (raw === 'false') return { display: 'false', type: 'boolean', value: false }

  // string: 用双引号包起来的
  if (/^".*"$/.test(raw)) {
    return { display: raw, type: 'string', value: raw.slice(1, -1) }
  }

  // number: 先尝试整数，再尝试浮点
  if (/^-?\d+$/.test(raw)) {
    return { display: raw, type: 'int', value: parseInt(raw, 10) }
  }
  if (/^-?\d+\.\d+$/.test(raw)) {
    return { display: raw, type: 'double', value: parseFloat(raw) }
  }

  // 默认当作字符串处理
  return { display: `"${raw}"`, type: 'string', value: raw }
}

const initialPool = [
  makeValue('12'),
  makeValue('-4'),
  makeValue('8.5'),
  makeValue('"hi"'),
  makeValue('true'),
]

export default function DragBoxViz() {
  const { t } = useLanguage()
  const [pool, setPool] = useState(initialPool)
  const [inputRaw, setInputRaw] = useState('')
  const [inputError, setInputError] = useState('')
  const [boxes, setBoxes] = useState({
    x: { name: 'x', type: 'int', value: null, lastStep: null, source: null },
    y: { name: 'y', type: 'int', value: null, lastStep: null, source: null },
  })
  // 历史记录（影子代码）：每次拖拽生成一行“半透明代码”，永远在那里
  const [ghostCode, setGhostCode] = useState([]) // oldest first
  // 时间轨迹丝带：保存每一步执行后的快照，点击可回放到当时状态
  const [trace, setTrace] = useState([]) // oldest first: { label, snapshot }
  const [traceOpen, setTraceOpen] = useState(false)
  const [traceSelected, setTraceSelected] = useState(-1)
  const [stepCounter, setStepCounter] = useState(0)
  const [mode, setMode] = useState('guided') // 'guided' | 'exam'
  const [dragItem, setDragItem] = useState(null) // { kind: 'value' | 'box', payload: ... }
  const [dragOverBox, setDragOverBox] = useState(null)

  // 动作层可视化：闪光/高亮/复制提示/飞行影子
  const stageRef = useRef(null)
  const boxRefs = useRef({})
  const [boxFx, setBoxFx] = useState({}) // { [name]: { flash?: 'assign'|'copyFrom', label?: string, drop?: string } }
  const [flies, setFlies] = useState([]) // [{id,text,x0,y0,x1,y1,go}]

  const cloneBoxes = (b) => JSON.parse(JSON.stringify(b))

  const pushGhost = (line) => {
    setGhostCode((prev) => [...prev, line].slice(-18))
  }

  const pushTrace = (label, nextBoxes) => {
    const snap = cloneBoxes(nextBoxes)
    setTrace((prev) => [...prev, { label, snapshot: snap }].slice(-24))
    setTraceSelected((_) => -1)
  }

  const handleDragStartValue = (token) => {
    setDragItem({ kind: 'value', payload: token })
  }

  const handleDragStartVarToken = (name) => {
    const b = boxes[name]
    if (!b || b.value === null || b.value === undefined) return
    setDragItem({ kind: 'box', payload: name })
  }

  const handleDragEnd = () => {
    setDragItem(null)
    setDragOverBox(null)
  }

  const formatValue = (v) => {
    if (v === null || v === undefined) return ''
    if (typeof v === 'boolean') return v ? 'true' : 'false'
    return String(v)
  }

  const flashBox = (name, payload) => {
    setBoxFx((prev) => ({ ...prev, [name]: { ...(prev[name] || {}), ...payload } }))
    window.setTimeout(() => {
      setBoxFx((prev) => {
        const next = { ...prev }
        if (!next[name]) return prev
        // 只清理本次效果字段
        next[name] = { ...(next[name] || {}) }
        delete next[name].flash
        delete next[name].label
        delete next[name].drop
        if (Object.keys(next[name]).length === 0) delete next[name]
        return next
      })
    }, 700)
  }

  const flyValue = (fromName, toName, text) => {
    const stageEl = stageRef.current
    const fromEl = boxRefs.current[fromName]
    const toEl = boxRefs.current[toName]
    if (!stageEl || !fromEl || !toEl) return
    const stageRect = stageEl.getBoundingClientRect()
    const fromRect = fromEl.getBoundingClientRect()
    const toRect = toEl.getBoundingClientRect()
    const x0 = fromRect.left + fromRect.width / 2 - stageRect.left
    const y0 = fromRect.top + fromRect.height / 2 - stageRect.top
    const x1 = toRect.left + toRect.width / 2 - stageRect.left
    const y1 = toRect.top + toRect.height / 2 - stageRect.top
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const item = { id, text, x0, y0, x1, y1, go: false }
    setFlies((prev) => [...prev, item].slice(-6))
    requestAnimationFrame(() => {
      setFlies((prev) => prev.map((f) => (f.id === id ? { ...f, go: true } : f)))
    })
    window.setTimeout(() => {
      setFlies((prev) => prev.filter((f) => f.id !== id))
    }, 750)
  }

  const handleDropOnBox = (name) => {
    if (!dragItem) return
    const boxName = name
    const dragged = dragItem

    setDragItem(null)
    setDragOverBox(null)

    // 数值 → 盒子：赋值 x = 5
    if (dragged.kind === 'value') {
      const token = dragged.payload
      pushGhost(`${boxName} = ${token.display}`)
      const prev = boxes
      const prevBox = prev[boxName]
      const nextStep = stepCounter + 1
      const next = {
        ...prev,
        [boxName]: {
          ...(prev[boxName] || { name: boxName }),
          type: token.type,
          value: token.value,
          lastStep: nextStep,
          source: token.display,
        },
      }
      setStepCounter(nextStep)
      setBoxes(next)
      pushTrace(`${boxName} = ${token.display}`, next)
      // 动作可视化：数值直接落入 + 目标盒子短暂发光
      flashBox(boxName, { flash: 'assign', drop: token.display })
      return
    }

    // 盒子 → 盒子：复制 y = x
    if (dragged.kind === 'box') {
      const fromName = dragged.payload
      pushGhost(`${boxName} = ${fromName}`)
      const prev = boxes
      const fromBox = prev[fromName]
      if (!fromBox) return
      const valueText = formatValue(fromBox.value)
      const nextStep = stepCounter + 1
      const next = {
        ...prev,
        [boxName]: {
          ...(prev[boxName] || { name: boxName }),
          type: fromBox.type,
          value: fromBox.value,
          lastStep: nextStep,
          source: fromName,
        },
      }
      setStepCounter(nextStep)
      setBoxes(next)
      pushTrace(`${boxName} = ${fromName}`, next)
      // 动作可视化：影子值从源飞向目标 + 源高亮 + 目标显示“复制自 y”
      if (valueText) flyValue(fromName, boxName, valueText)
      flashBox(fromName, { flash: 'copyFrom' })
      flashBox(boxName, { flash: 'assign', label: t('box_drag_copied_from', { from: fromName }) })
    }
  }

  const handleGenerateFromInput = () => {
    const raw = inputRaw.trim()
    if (!raw) {
      setInputError(t('box_drag_input_error_empty') || '')
      return
    }
    const token = makeValue(raw)
    setPool((prev) => [...prev, token])
    setInputRaw('')
    setInputError(
      t('box_drag_input_type_info', { type: token.type }) || '',
    )
  }

  const resetBoxes = () => {
    setBoxes({
      x: { name: 'x', type: 'int', value: null, lastStep: null, source: null },
      y: { name: 'y', type: 'int', value: null, lastStep: null, source: null },
    })
    setGhostCode([])
    setTrace([])
    setTraceOpen(false)
    setTraceSelected(-1)
    setStepCounter(0)
  }

  return (
    <div className="drag-viz">
      <div className="drag-viz__header">
        <div className="drag-viz__title">{t('dragModelTitle')}</div>
        <div className="drag-viz__subtitle">{t('box_drag_subtitle')}</div>
      </div>

      <div className="drag-viz__layout drag-viz__layout--gold">
        {/* 左：操作区 */}
        <div className="drag-viz__column drag-viz__column--tools">
          <div className="drag-viz__section-title-row">
            <div className="drag-viz__section-title">{t('box_drag_pool_title')}</div>
            <div className="drag-viz__section-actions">
              <button type="button" className="drag-viz__btn drag-viz__btn--xs" onClick={resetBoxes}>
                {t('reset')}
              </button>
            </div>
          </div>
          <div className="drag-viz__card">
            <div className="drag-viz__input-row drag-viz__input-row--stack">
              <input
                className="drag-viz__input"
                value={inputRaw}
                onChange={(e) => {
                  setInputRaw(e.target.value)
                  setInputError('')
                }}
                placeholder={t('box_drag_input_placeholder')}
              />
            </div>
            <button
              type="button"
              className="drag-viz__btn drag-viz__btn--block"
              onClick={handleGenerateFromInput}
            >
              {t('box_drag_input_generate')}
            </button>
            {inputError && (
              <div className="drag-viz__input-hint">{inputError}</div>
            )}

            <div className="drag-viz__subrow">
              <div className="drag-viz__subrow-title">{t('box_drag_var_tokens_title')}</div>
              <div className="drag-viz__var-tokens">
                {Object.keys(boxes).map((name) => {
                  const b = boxes[name]
                  const disabled = !b || b.value === null || b.value === undefined
                  return (
                    <div
                      key={name}
                      className={`drag-viz__token drag-viz__token--var ${disabled ? 'drag-viz__token--disabled' : ''}`}
                      draggable={!disabled}
                      onDragStart={() => handleDragStartVarToken(name)}
                      onDragEnd={handleDragEnd}
                      title={disabled ? t('box_drag_var_token_need_value') : t('box_drag_var_token_hint')}
                    >
                      {name}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="drag-viz__subrow">
              <div className="drag-viz__subrow-title">{t('box_drag_value_tokens_title')}</div>
            </div>
            <div className="drag-viz__pool">
              {pool.map((token, idx) => (
                <div
                  key={idx}
                  className={`drag-viz__token drag-viz__token--${token.type || 'int'} ${
                    dragItem && dragItem.kind === 'value' && dragItem.payload === token
                      ? 'drag-viz__token--dragging'
                      : ''
                  }`}
                  draggable
                  onDragStart={() => handleDragStartValue(token)}
                  onDragEnd={handleDragEnd}
                  data-type={token.type === 'int' ? 'int' : token.type === 'double' ? 'double' : token.type === 'string' ? 'String' : token.type === 'boolean' ? 'boolean' : 'int'}
                >
                  {token.display}
                </div>
              ))}
            </div>
          </div>

          {mode === 'guided' && (
            <div className="drag-viz__card drag-viz__type-hints">
              <div className="drag-viz__type-hints-title">{t('box_drag_type_examples_title')}</div>
              <div className="drag-viz__type-hints-list">
                <div className="drag-viz__type-hints-row">
                  <span className="drag-viz__type-chip drag-viz__type-chip--int">int</span>
                  <span className="drag-viz__type-example">{t('box_drag_type_int_example')}</span>
                </div>
                <div className="drag-viz__type-hints-row">
                  <span className="drag-viz__type-chip drag-viz__type-chip--double">double</span>
                  <span className="drag-viz__type-example">{t('box_drag_type_double_example')}</span>
                </div>
                <div className="drag-viz__type-hints-row">
                  <span className="drag-viz__type-chip drag-viz__type-chip--string">String</span>
                  <span className="drag-viz__type-example">{t('box_drag_type_string_example')}</span>
                </div>
                <div className="drag-viz__type-hints-row">
                  <span className="drag-viz__type-chip drag-viz__type-chip--boolean">boolean</span>
                  <span className="drag-viz__type-example">{t('box_drag_type_boolean_example')}</span>
                </div>
              </div>
              <div className="drag-viz__type-hints-note">
                {t('box_drag_type_boolean_note')}
              </div>
            </div>
          )}

          <div className="drag-viz__section-title">{t('box_drag_mode_title')}</div>
          <div className="drag-viz__mode-row">
            <button
              type="button"
              className={`drag-viz__btn drag-viz__btn--block ${mode === 'guided' ? 'drag-viz__btn--active' : ''}`}
              onClick={() => setMode('guided')}
            >
              {t('box_drag_mode_guided')}
            </button>
            <button
              type="button"
              className={`drag-viz__btn drag-viz__btn--ghost drag-viz__btn--block ${mode === 'exam' ? 'drag-viz__btn--active' : ''}`}
              onClick={() => setMode('exam')}
            >
              {t('box_drag_mode_exam')}
            </button>
          </div>
        </div>

        {/* 中：变量舞台 */}
        <div className="drag-viz__column drag-viz__column--stage">
          <div className="drag-viz__section-title">{t('box_drag_stage_title')}</div>
          <div className="drag-viz__stage" ref={stageRef}>
            <div className="drag-viz__drop-hint">{t('box_drag_drop_hint')}</div>
            <div className="drag-viz__fly-layer" aria-hidden="true">
              {flies.map((f) => (
                <div
                  key={f.id}
                  className={`drag-viz__fly ${f.go ? 'drag-viz__fly--go' : ''}`}
                  style={{
                    left: f.x0,
                    top: f.y0,
                    transform: f.go ? `translate(${f.x1 - f.x0}px, ${f.y1 - f.y0}px)` : 'translate(0,0)',
                  }}
                >
                  {f.text}
                </div>
              ))}
            </div>
            <div className="drag-viz__boxes drag-viz__boxes--stage">
              {Object.keys(boxes).map((name) => {
                const box = boxes[name]
                const fx = boxFx[name] || null
                return (
                  <div
                    key={name}
                    className={`drag-viz__box drag-viz__box--${box.type || 'int'} ${
                      dragOverBox === name ? 'drag-viz__box--over' : ''
                    }`}
                    ref={(el) => {
                      if (el) boxRefs.current[name] = el
                    }}
                    draggable
                    onDragStart={() => {
                      if (box && box.value !== null && box.value !== undefined) {
                        setDragItem({ kind: 'box', payload: name })
                      }
                    }}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragOverBox(name)
                    }}
                    onDragLeave={() => {
                      setDragOverBox((prev) => (prev === name ? null : prev))
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleDropOnBox(name)
                    }}
                  >
                    {fx?.flash === 'assign' && <div className="drag-viz__fx drag-viz__fx--assign" aria-hidden="true" />}
                    {fx?.flash === 'copyFrom' && <div className="drag-viz__fx drag-viz__fx--copyfrom" aria-hidden="true" />}
                    <div className="drag-viz__box-header">
                      <span className="drag-viz__box-name">{name}</span>
                      <span className="drag-viz__box-meta">
                        <span className="drag-viz__box-type">{box.type}</span>
                        <button
                          type="button"
                          className="drag-viz__expand-btn"
                          onClick={() => {
                            setBoxFx((prev) => ({
                              ...prev,
                              [name]: {
                                ...(prev[name] || {}),
                                open: !prev[name]?.open,
                              },
                            }))
                          }}
                        >
                          {fx?.open ? t('box_drag_collapse') : t('box_drag_expand')}
                        </button>
                      </span>
                    </div>
                    <div className="drag-viz__box-body">
                      {fx?.drop && (
                        <div className="drag-viz__drop" aria-hidden="true">
                          <span className="drag-viz__drop-value">{fx.drop}</span>
                        </div>
                      )}
                      {fx?.label && (
                        <div className="drag-viz__label" aria-hidden="true">
                          {fx.label}
                        </div>
                      )}
                      {box.value == null ? (
                        <span className="drag-viz__box-empty">{t('empty')}</span>
                      ) : (
                        <span className="drag-viz__box-value">
                          {typeof box.value === 'boolean'
                            ? box.value ? 'true' : 'false'
                            : box.value}
                        </span>
                      )}
                    </div>
                    {fx?.open && (
                      <div className="drag-viz__box-detail">
                        <div className="drag-viz__box-detail-row">
                          <span className="drag-viz__box-detail-label">{t('box_drag_detail_value')}</span>
                          <span className="drag-viz__box-detail-value">
                            {box.value == null ? t('empty') : formatValue(box.value)}
                          </span>
                        </div>
                        <div className="drag-viz__box-detail-row">
                          <span className="drag-viz__box-detail-label">{t('box_drag_detail_type')}</span>
                          <span className="drag-viz__box-detail-value">{box.type || '-'}</span>
                        </div>
                        <div className="drag-viz__box-detail-row">
                          <span className="drag-viz__box-detail-label">{t('box_drag_detail_step')}</span>
                          <span className="drag-viz__box-detail-value">
                            {box.lastStep == null ? t('box_drag_detail_step_none') : t('box_drag_detail_step_value', { step: box.lastStep })}
                          </span>
                        </div>
                        <div className="drag-viz__box-detail-row">
                          <span className="drag-viz__box-detail-label">{t('box_drag_detail_source')}</span>
                          <span className="drag-viz__box-detail-value">
                            {box.source == null ? t('box_drag_detail_source_none') : box.source}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="drag-viz__ghost">
              <div className="drag-viz__ghost-header">
                <div className="drag-viz__ghost-title">{t('box_drag_ghost_title')}</div>
              </div>
              {ghostCode.length === 0 ? (
                <div className="drag-viz__ghost-empty">{t('box_drag_ghost_empty')}</div>
              ) : (
                <pre className="drag-viz__ghost-code">
                  {ghostCode.join('\n')}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* 右栏已移除：只保留“操作区 + 变量舞台”两块 */}
      </div>

      <div className={`trace-ribbon ${traceOpen ? 'trace-ribbon--open' : ''}`}>
        <button
          type="button"
          className="trace-ribbon__toggle"
          onClick={() => setTraceOpen((v) => !v)}
        >
          {traceOpen ? t('trace_collapse') : t('trace_expand')}
        </button>
        {traceOpen && (
          <div className="trace-ribbon__content">
            {trace.length === 0 ? (
              <div className="trace-ribbon__empty">{t('trace_empty')}</div>
            ) : (
              <div className="trace-ribbon__items">
                {trace.map((step, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={`trace-ribbon__item ${traceSelected === idx ? 'trace-ribbon__item--active' : ''}`}
                    onClick={() => {
                      setBoxes(cloneBoxes(step.snapshot))
                      setTraceSelected(idx)
                    }}
                    title={t('trace_click_to_restore')}
                  >
                    {step.label}
                    {idx < trace.length - 1 ? <span className="trace-ribbon__arrow">→</span> : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

