import { useState, useEffect, useRef } from 'react'
import './Visualization.css'
import { useLanguage } from '../contexts/LanguageContext'
import ReactECharts from 'echarts-for-react'

function OperationPanel({ vars, onOperation }) {
  const { t } = useLanguage()
  const [selectedVar, setSelectedVar] = useState('x')
  const [operation, setOperation] = useState('add')
  const [operandType, setOperandType] = useState('number') // 'number' or 'variable'
  const [operand, setOperand] = useState('1')
  const [operandVar, setOperandVar] = useState('y')

  const varNames = Object.keys(vars).sort()

  const executeOperation = () => {
    const currentValue = vars[selectedVar] || 0
    let opValue
    
    if (operandType === 'variable') {
      opValue = vars[operandVar] || 0
    } else {
      opValue = Number(operand)
      if (Number.isNaN(opValue)) return
    }

    let result
    if (operation === 'add') result = currentValue + opValue
    else if (operation === 'subtract') result = currentValue - opValue
    else if (operation === 'multiply') result = currentValue * opValue
    else if (operation === 'divide' && opValue !== 0) result = currentValue / opValue
    else return

    const operandDisplay = operandType === 'variable' ? operandVar : operand
    onOperation?.(selectedVar, result, `${selectedVar} = ${selectedVar} ${operation === 'add' ? '+' : operation === 'subtract' ? '-' : operation === 'multiply' ? '*' : '/'} ${operandDisplay}`)
  }

  const getOpSymbol = () => {
    if (operation === 'add') return '+'
    if (operation === 'subtract') return '-'
    if (operation === 'multiply') return '×'
    return '÷'
  }

  const getOperandDisplay = () => {
    if (operandType === 'variable') {
      return operandVar
    }
    return operand
  }

  const getOperandValue = () => {
    if (operandType === 'variable') {
      return vars[operandVar] || 0
    }
    return Number(operand) || 0
  }

  return (
    <div className="operation-panel">
      <div className="operation-panel__title">{t('operationTitle')}</div>
      <div className="operation-panel__controls">
        <select
          className="control-select"
          value={selectedVar}
          onChange={(e) => setSelectedVar(e.target.value)}
        >
          {varNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <select
          className="control-select"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="add">+</option>
          <option value="subtract">-</option>
          <option value="multiply">×</option>
          <option value="divide">÷</option>
        </select>
        <select
          className="control-select"
          value={operandType}
          onChange={(e) => setOperandType(e.target.value)}
          style={{ width: '80px' }}
        >
          <option value="number">{t('number')}</option>
          <option value="variable">{t('variable')}</option>
        </select>
        {operandType === 'number' ? (
          <input
            className="control-input"
            type="text"
            value={operand}
            onChange={(e) => setOperand(e.target.value)}
            placeholder={t('number')}
            style={{ width: '60px' }}
          />
        ) : (
          <select
            className="control-select"
            value={operandVar}
            onChange={(e) => setOperandVar(e.target.value)}
            style={{ width: '60px' }}
          >
            {varNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        )}
        <button
          type="button"
          className="control-btn control-btn--apply"
          onClick={executeOperation}
        >
          {t('execute')}
        </button>
      </div>
      <div className="operation-panel__steps">
        <div className="step">{t('step1')}: {t('readValue', { var: selectedVar, value: vars[selectedVar] || 0 })}</div>
        <div className="step">
          {t('step2')}: {t('calculate', { var: selectedVar, op: getOpSymbol(), operand: getOperandDisplay() })}
          {operandType === 'variable' && ` (${operandVar} = ${getOperandValue()})`}
        </div>
        <div className="step">{t('step3')}: {t('storeResult', { var: selectedVar })}</div>
      </div>
    </div>
  )
}

export default function Visualization() {
  const { t } = useLanguage()
  const [vars, setVars] = useState({ w: 1, x: 2, y: 3, z: 4 })
  const [highlightedVar, setHighlightedVar] = useState(null)
  const [lastOperation, setLastOperation] = useState(null)
  const [history, setHistory] = useState([])
  const [editingVar, setEditingVar] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [varHistory, setVarHistory] = useState({ w: [1], x: [2], y: [3], z: [4] })
  const stepRef = useRef(0)
  const [isChartExpanded, setIsChartExpanded] = useState(false)

  const varNames = Object.keys(vars).sort()

  const handleValueClick = (varName) => {
    setEditingVar(varName)
    setEditValue(String(vars[varName] || ''))
  }

  const handleValueChange = (e) => {
    setEditValue(e.target.value)
  }

  const handleValueBlur = (varName) => {
    const numValue = Number(editValue)
    if (!Number.isNaN(numValue)) {
      setVars((prev) => {
        const oldValue = prev[varName]
        // 只有当值真正改变时才更新历史
        if (oldValue !== numValue) {
          const next = { ...prev, [varName]: numValue }
          setHistory((h) => [...h.slice(-9), `${varName}: ${oldValue ?? t('empty')} → ${numValue}`])
          // 更新图表历史 - 手动赋值只增加一次，确保所有变量同步步数
          stepRef.current += 1
          setVarHistory((prev) => {
            const updated = { ...prev }
            // 更新当前变量
            updated[varName] = [...(prev[varName] || []), numValue]
            // 其他变量如果长度不足，用最后一个值填充以保持同步
            const newLength = updated[varName].length
            Object.keys(updated).forEach(name => {
              if (name !== varName) {
                const currentHistory = updated[name] || []
                if (currentHistory.length < newLength) {
                  const lastValue = currentHistory.length > 0 
                    ? currentHistory[currentHistory.length - 1] 
                    : vars[name] ?? 0
                  updated[name] = [...currentHistory, lastValue]
                }
              }
            })
            return updated
          })
          setHighlightedVar(varName)
          setTimeout(() => setHighlightedVar(null), 600)
          return next
        }
        return prev
      })
    }
    setEditingVar(null)
    setEditValue('')
  }

  const handleValueKeyDown = (e, varName) => {
    if (e.key === 'Enter') {
      e.target.blur()
    } else if (e.key === 'Escape') {
      setEditingVar(null)
      setEditValue('')
    }
  }

  const handleOperation = (varName, result, operationText) => {
    setVars((prev) => {
      const oldValue = prev[varName]
      const next = { ...prev, [varName]: result }
      setHistory((h) => [...h.slice(-9), operationText])
      setLastOperation({ var: varName, old: oldValue, new: result })
      setTimeout(() => setLastOperation(null), 1000)
      // 更新图表历史
      stepRef.current += 1
      setVarHistory((prev) => ({
        ...prev,
        [varName]: [...(prev[varName] || []), result]
      }))
      return next
    })
    setHighlightedVar(varName)
    setTimeout(() => setHighlightedVar(null), 600)
  }


  const resetAll = () => {
    setVars({ w: 1, x: 2, y: 3, z: 4 })
    setHistory([])
    setLastOperation(null)
    setHighlightedVar(null)
    setVarHistory({ w: [1], x: [2], y: [3], z: [4] })
    stepRef.current = 0
  }

  // 准备图表数据
  const getChartOption = () => {
    const varNames = Object.keys(vars).sort()
    const lengths = varNames.map(name => varHistory[name]?.length || 0)
    const maxLength = lengths.length > 0 ? Math.max(...lengths) : 1
    const steps = Array.from({ length: maxLength }, (_, i) => i + 1)
    
    const series = varNames.map((name, index) => {
      const colors = ['#6ab0ff', '#3ddc97', '#ffcc66', '#ff6b9d']
      // 确保每个变量的数据长度一致，不足的用最后一个值填充
      const history = varHistory[name] || []
      const paddedData = Array.from({ length: maxLength }, (_, i) => {
        if (i < history.length) {
          return history[i]
        }
        // 如果历史数据不足，使用最后一个值（或初始值）
        return history.length > 0 ? history[history.length - 1] : vars[name] || 0
      })
      
      return {
        name,
        type: 'line',
        data: paddedData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 2,
          color: colors[index % colors.length]
        },
        itemStyle: {
          color: colors[index % colors.length]
        },
        emphasis: {
          focus: 'series'
        }
      }
    })

    return {
      backgroundColor: 'transparent',
      grid: {
        left: '50px',
        right: '30px',
        top: '30px',
        bottom: '40px',
        containLabel: false
      },
      xAxis: {
        type: 'category',
        data: steps,
        name: 'Step',
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: {
          lineStyle: {
            color: 'rgba(184, 195, 230, 0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(184, 195, 230, 0.8)',
          fontSize: 11
        },
        nameTextStyle: {
          color: 'rgba(184, 195, 230, 0.8)',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        name: 'Value',
        nameLocation: 'middle',
        nameGap: 40,
        axisLine: {
          lineStyle: {
            color: 'rgba(184, 195, 230, 0.3)'
          }
        },
        axisLabel: {
          color: 'rgba(184, 195, 230, 0.8)',
          fontSize: 11
        },
        nameTextStyle: {
          color: 'rgba(184, 195, 230, 0.8)',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(184, 195, 230, 0.1)',
            type: 'dashed'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 16, 30, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        textStyle: {
          color: '#e9eefc',
          fontSize: 12
        },
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'rgba(184, 195, 230, 0.3)'
          }
        }
      },
      legend: {
        data: varNames,
        top: 5,
        textStyle: {
          color: 'rgba(184, 195, 230, 0.9)',
          fontSize: 12
        },
        itemGap: 20
      },
      series
    }
  }

  return (
    <div className="visualization">
      <div className="visualization__header">
        <div className="visualization__title">{t('interactiveVariableModel')}</div>
        <div className="visualization__subtitle">
          {t('clickToEditVariables')}
        </div>
      </div>

      <div className="visualization__main">
        <div className="variables-panel">
          <div className="panel-title">{t('variables')}</div>
          <div className="variables-code">
            {varNames.length === 0 ? (
              <div className="empty-state">{t('clickToAddVariable')}</div>
            ) : (
              <pre className="code-display">
                {varNames.map((name) => {
                  const value = vars[name]
                  const isEmpty = value === undefined || value === null
                  const isHighlighted = highlightedVar === name || lastOperation?.var === name
                  const isEditing = editingVar === name
                  
                  return (
                    <div
                      key={name}
                      className={`code-line ${isHighlighted ? 'code-line--highlighted' : ''}`}
                    >
                      <span className="code-var">{name}</span>
                      <span className="code-equals"> = </span>
                      {isEditing ? (
                        <input
                          type="text"
                          className="code-value-input"
                          value={editValue}
                          onChange={handleValueChange}
                          onBlur={() => handleValueBlur(name)}
                          onKeyDown={(e) => handleValueKeyDown(e, name)}
                          autoFocus
                        />
                      ) : (
                        <span 
                          className={`code-value ${isEmpty ? 'code-value--empty' : ''} code-value--editable`}
                          onClick={() => handleValueClick(name)}
                          title={t('clickToEdit')}
                        >
                          {isEmpty ? t('empty') : value}
                        </span>
                      )}
                    </div>
                  )
                })}
              </pre>
            )}
          </div>
        </div>

        <div className="visualization__chart">
          <div className="chart-header">
            <div className="panel-title">{t('variableHistory')}</div>
            <button
              type="button"
              className="chart-expand-btn"
              onClick={() => setIsChartExpanded(!isChartExpanded)}
              title={isChartExpanded ? t('shrinkChart') : t('expandChart')}
            >
              {isChartExpanded ? '✕' : '⛶'}
            </button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ReactECharts
              option={getChartOption()}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </div>

        {isChartExpanded && (
          <div className="chart-modal" onClick={() => setIsChartExpanded(false)}>
            <div className="chart-modal__content" onClick={(e) => e.stopPropagation()}>
              <div className="chart-modal__header">
                <div className="chart-modal__title">{t('variableHistory')}</div>
                <button
                  type="button"
                  className="chart-modal__close"
                  onClick={() => setIsChartExpanded(false)}
                >
                  ✕
                </button>
              </div>
              <div className="chart-modal__chart">
                <ReactECharts
                  option={getChartOption()}
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <OperationPanel vars={vars} onOperation={handleOperation} />

      {lastOperation && (
        <div className="operation-feedback">
          {lastOperation.var}: {lastOperation.old} → {lastOperation.new}
        </div>
      )}

      {history.length > 0 && (
        <div className="visualization__history">
          <div className="history-title">{t('operationHistory')}</div>
          <div className="history-items">
            {history.map((op, i) => (
              <div key={i} className="history-item">{op}</div>
            ))}
          </div>
        </div>
      )}

      <div className="visualization__controls-bottom">
        <button
          type="button"
          className="control-btn control-btn--reset"
          onClick={resetAll}
        >
          {t('resetAll')}
        </button>
      </div>

      <div className="visualization__explanation">
        <div className="explanation-text">
          <strong>{t('keyConcept')}</strong>{t('assignmentOverwrites')}
        </div>
      </div>
    </div>
  )
}
