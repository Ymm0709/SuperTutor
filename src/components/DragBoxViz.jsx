import { useState } from 'react'
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

const tasks = [
  {
    id: 1,
    promptKey: 'box_drag_task1',
    targetVar: 'x',
    targetValue: 7,
  },
  {
    id: 2,
    promptKey: 'box_drag_task2',
    targetVar: 'y',
    targetValue: 10,
  },
]

export default function DragBoxViz() {
  const { t } = useLanguage()
  const [pool, setPool] = useState(initialPool)
  const [inputRaw, setInputRaw] = useState('')
  const [inputError, setInputError] = useState('')
  const [boxes, setBoxes] = useState({
    x: { name: 'x', type: 'int', value: null },
    y: { name: 'y', type: 'int', value: null },
  })
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [dragItem, setDragItem] = useState(null) // { kind: 'value' | 'box', payload: ... }
  const [dragOverBox, setDragOverBox] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const currentTask = tasks[currentTaskIndex]

  const handleDragStartValue = (token) => {
    setDragItem({ kind: 'value', payload: token })
    setFeedback(null)
  }

  const handleDragEnd = () => {
    setDragItem(null)
    setDragOverBox(null)
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
      setBoxes((prev) => ({
        ...prev,
        [boxName]: { ...(prev[boxName] || { name: boxName }), type: token.type, value: token.value },
      }))

      // 判题与反馈（只在当前任务里针对数值赋值判断）
      if (boxName === currentTask.targetVar && token.value === currentTask.targetValue) {
      setFeedback({
        type: 'correct',
        text: t('box_drag_correct'),
      })
      if (currentTaskIndex < tasks.length - 1) {
        setTimeout(() => {
          setCurrentTaskIndex((idx) => idx + 1)
          setFeedback(null)
        }, 900)
      }
      } else if (boxName !== currentTask.targetVar) {
        setFeedback({
          type: 'wrong',
          text: t('box_drag_wrong_box'),
        })
      } else {
        setFeedback({
          type: 'wrong',
          text: t('box_drag_wrong_value'),
        })
      }
      return
    }

    // 盒子 → 盒子：复制 y = x
    if (dragged.kind === 'box') {
      const fromName = dragged.payload
      setBoxes((prev) => {
        const fromBox = prev[fromName]
        if (!fromBox) return prev
        const next = {
          ...prev,
          [boxName]: { ...(prev[boxName] || { name: boxName }), type: fromBox.type, value: fromBox.value },
        }
        return next
      })
      // 这里暂时不参与任务判定，只做概念示范
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
      x: { name: 'x', type: 'int', value: null },
      y: { name: 'y', type: 'int', value: null },
    })
    setFeedback(null)
  }

  const restartAll = () => {
    resetBoxes()
    setCurrentTaskIndex(0)
    setFeedback(null)
  }

  return (
    <div className="drag-viz">
      <div className="drag-viz__header">
        <div className="drag-viz__title">{t('dragModelTitle')}</div>
        <div className="drag-viz__subtitle">{t('box_drag_subtitle')}</div>
      </div>

      <div className="drag-viz__layout">
        {/* 左：数字池 */}
        <div className="drag-viz__column drag-viz__column--pool">
          <div className="drag-viz__section-title">{t('box_drag_pool_title')}</div>
          <div className="drag-viz__input-row">
            <input
              className="drag-viz__input"
              value={inputRaw}
              onChange={(e) => {
                setInputRaw(e.target.value)
                setInputError('')
              }}
              placeholder={t('box_drag_input_placeholder')}
            />
            <button
              type="button"
              className="drag-viz__btn"
              onClick={handleGenerateFromInput}
            >
              {t('box_drag_input_generate')}
            </button>
          </div>
          {inputError && (
            <div className="drag-viz__input-hint">{inputError}</div>
          )}
          <div className="drag-viz__pool">
            {pool.map((token, idx) => (
              <div
                key={idx}
                className={`drag-viz__token ${
                  dragItem && dragItem.kind === 'value' && dragItem.payload === token
                    ? 'drag-viz__token--dragging'
                    : ''
                }`}
                draggable
                onDragStart={() => handleDragStartValue(token)}
                onDragEnd={handleDragEnd}
              >
                {token.display}
              </div>
            ))}
          </div>
        </div>

        {/* 中：变量盒子 */}
        <div className="drag-viz__column drag-viz__column--boxes">
          <div className="drag-viz__section-title">{t('box_drag_boxes_title')}</div>
          <div className="drag-viz__boxes">
            {['x', 'y'].map((name) => {
              const box = boxes[name]
              return (
              <div
                key={name}
                className={`drag-viz__box ${
                  dragOverBox === name ? 'drag-viz__box--over' : ''
                } ${currentTask.targetVar === name ? 'drag-viz__box--target' : ''}`}
                draggable
                onDragStart={() => {
                  if (box && box.value !== null && box.value !== undefined) {
                    setDragItem({ kind: 'box', payload: name })
                    setFeedback(null)
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
                <div className="drag-viz__box-header">
                  <span className="drag-viz__box-name">{name}</span>
                </div>
                <div className="drag-viz__box-body">
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
              </div>
              )
            })}
          </div>

          <div className="drag-viz__controls">
            <button
              type="button"
              className="drag-viz__btn"
              onClick={resetBoxes}
            >
              {t('reset')}
            </button>
            <button
              type="button"
              className="drag-viz__btn drag-viz__btn--ghost"
              onClick={restartAll}
            >
              {t('box_drag_restart')}
            </button>
          </div>
        </div>

        {/* 右：问题区 */}
        <div className="drag-viz__column drag-viz__column--task">
          <div className="drag-viz__section-title">
            {t('box_drag_task_title', { index: currentTaskIndex + 1 })}
          </div>
          <div className="drag-viz__prompt">
            {t(currentTask.promptKey)}
          </div>
          <div className="drag-viz__hint">
            {t('box_drag_hint')}
          </div>

          {feedback && (
            <div
              className={`drag-viz__feedback drag-viz__feedback--${feedback.type}`}
            >
              {feedback.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

