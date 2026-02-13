// app/procenty/kalkulyator-procentov/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function KalkulyatorProcentovPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"percent_of_number" | "number_from_percent" | "increase_decrease" | "percentage_change">("percent_of_number");
  
  // Основные поля ввода
  const [number, setNumber] = useState<string>("1000");
  const [percent, setPercent] = useState<string>("10");
  const [resultNumber, setResultNumber] = useState<string>("");
  const [resultPercent, setResultPercent] = useState<string>("");
  
  // Для увеличения/уменьшения
  const [increasePercent, setIncreasePercent] = useState<string>("10");
  const [decreasePercent, setDecreasePercent] = useState<string>("10");
  
  // Результаты
  const [result, setResult] = useState<number | null>(null);
  const [additionalResult, setAdditionalResult] = useState<number | null>(null);

  // Цветовая схема #8b5cf6 (violet-500)
  const COLORS = {
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    secondary: '#a78bfa',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#8b5cf6',
      to: '#a78bfa'
    }
  };

  // Функция расчёта
  const calculate = useCallback(() => {
    const num = parseFloat(number) || 0;
    const pct = parseFloat(percent) || 0;
    const resNum = parseFloat(resultNumber) || 0;
    const resPct = parseFloat(resultPercent) || 0;
    const incPct = parseFloat(increasePercent) || 0;
    const decPct = parseFloat(decreasePercent) || 0;
    
    let calculatedResult = 0;
    let calculatedAdditional = 0;
    
    switch(calcType) {
      case "percent_of_number": // Сколько составляет X% от числа
        calculatedResult = (num * pct) / 100;
        break;
        
      case "number_from_percent": // Число, если X% от него равно Y
        if (pct > 0) {
          calculatedResult = (resNum * 100) / pct;
        }
        break;
        
      case "increase_decrease": // Увеличение/уменьшение на X%
        calculatedResult = num + (num * incPct / 100);
        calculatedAdditional = num - (num * decPct / 100);
        break;
        
      case "percentage_change": // На сколько % изменилось число
        if (num > 0) {
          calculatedResult = ((resNum - num) / num) * 100;
        }
        break;
    }
    
    setResult(isNaN(calculatedResult) ? null : calculatedResult);
    setAdditionalResult(isNaN(calculatedAdditional) ? null : calculatedAdditional);
  }, [calcType, number, percent, resultNumber, resultPercent, increasePercent, decreasePercent]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setNumber("1000");
    setPercent("10");
    setResultNumber("");
    setResultPercent("");
    setIncreasePercent("10");
    setDecreasePercent("10");
    setResult(null);
    setAdditionalResult(null);
    setCalcType("percent_of_number");
  };

  // Форматирование чисел
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Получение единиц измерения
  const getUnit = () => {
    switch(calcType) {
      case "percent_of_number": 
      case "number_from_percent": 
        return "";
      case "increase_decrease": 
        return "";
      case "percentage_change": 
        return "%";
      default: return "";
    }
  };

  // Получение формулы
  const getFormula = () => {
    switch(calcType) {
      case "percent_of_number": return "X% от Y = Y × X ÷ 100";
      case "number_from_percent": return "Y = Z × 100 ÷ X";
      case "increase_decrease": return "Y ± X% = Y × (1 ± X/100)";
      case "percentage_change": return "Δ% = (B - A) ÷ A × 100%";
      default: return "X% от Y = Y × X ÷ 100";
    }
  };

  // Получение описания формулы
  const getFormulaDescription = () => {
    switch(calcType) {
      case "percent_of_number": return "X — процент, Y — исходное число";
      case "number_from_percent": return "Z — известная часть, X — процент от числа, Y — искомое число";
      case "increase_decrease": return "Y — исходное число, X — процент увеличения/уменьшения";
      case "percentage_change": return "A — начальное значение, B — конечное значение, Δ% — изменение в %";
      default: return "Основная формула расчёта процентов";
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КАЛЬКУЛЯТОРА */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: `1px solid ${COLORS.border}`,
          background: `linear-gradient(145deg, ${COLORS.card} 0%, #1e2a3b 100%)`
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '32px' }}>📊</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Калькулятор процентов
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              Расчёт процентов, увеличение и уменьшение на процент
            </p>
          </div>

          {/* ДВЕ КНОПКИ РЯДОМ */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {/* Кнопка "На главную" */}
            <a 
              href="/"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: COLORS.border,
                color: COLORS.secondary,
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: `1px solid #475569`,
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.secondary;
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.border;
                e.currentTarget.style.color = COLORS.secondary;
              }}
            >
              ← На главную
            </a>
            
            {/* Кнопка "Сбросить" */}
            <button
              onClick={resetCalculator}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: COLORS.border,
                border: `1px solid #475569`,
                borderRadius: '8px',
                color: COLORS.primary,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.border;
                e.currentTarget.style.color = COLORS.primary;
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Переключатель режимов */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '24px',
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '8px'
          }}>
            <button
              onClick={() => setCalcType("percent_of_number")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "percent_of_number" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "percent_of_number" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "percent_of_number" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              X% от числа
            </button>
            <button
              onClick={() => setCalcType("number_from_percent")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "number_from_percent" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "number_from_percent" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "number_from_percent" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Число из %
            </button>
            <button
              onClick={() => setCalcType("increase_decrease")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "increase_decrease" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "increase_decrease" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "increase_decrease" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Увел./Уменьш.
            </button>
            <button
              onClick={() => setCalcType("percentage_change")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "percentage_change" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "percentage_change" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "percentage_change" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Изменение в %
            </button>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            {calcType === "percent_of_number" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Исходное число
                  </label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 1000"
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[100, 500, 1000, 5000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setNumber(val.toString())}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: COLORS.background,
                          border: `1px solid ${COLORS.primary}`,
                          borderRadius: '4px',
                          color: COLORS.primary,
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.primary;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.background;
                          e.currentTarget.style.color = COLORS.primary;
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Процент (%)
                  </label>
                  <input
                    type="number"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 10"
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[1, 5, 10, 15, 20, 25].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPercent(val.toString())}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: COLORS.background,
                          border: `1px solid ${COLORS.primary}`,
                          borderRadius: '4px',
                          color: COLORS.primary,
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.primary;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.background;
                          e.currentTarget.style.color = COLORS.primary;
                        }}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {calcType === "number_from_percent" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Известная часть числа
                  </label>
                  <input
                    type="number"
                    value={resultNumber}
                    onChange={(e) => setResultNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 100"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Процент от числа (%)
                  </label>
                  <input
                    type="number"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 10"
                  />
                </div>
              </>
            )}

            {calcType === "increase_decrease" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Исходное число
                  </label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 1000"
                  />
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Увеличение на (%)
                    </label>
                    <input
                      type="number"
                      value={increasePercent}
                      onChange={(e) => setIncreasePercent(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: COLORS.border,
                        border: `1px solid #475569`,
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Например: 10"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Уменьшение на (%)
                    </label>
                    <input
                      type="number"
                      value={decreasePercent}
                      onChange={(e) => setDecreasePercent(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: COLORS.border,
                        border: `1px solid #475569`,
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Например: 10"
                    />
                  </div>
                </div>
              </>
            )}

            {calcType === "percentage_change" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Начальное значение
                  </label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 1000"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Конечное значение
                  </label>
                  <input
                    type="number"
                    value={resultNumber}
                    onChange={(e) => setResultNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 1200"
                  />
                </div>
              </>
            )}
          </div>

          {/* ОСНОВНОЙ РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px',
            background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
          }}>
            {calcType === "increase_decrease" && result !== null && additionalResult !== null ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ color: COLORS.text.muted, marginBottom: '8px', fontSize: '14px' }}>
                    Увеличение на {increasePercent}%
                  </div>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold',
                    background: `linear-gradient(90deg, #10b981, #34d399)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {formatNumber(result)}
                  </div>
                </div>
                <div>
                  <div style={{ color: COLORS.text.muted, marginBottom: '8px', fontSize: '14px' }}>
                    Уменьшение на {decreasePercent}%
                  </div>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold',
                    background: `linear-gradient(90deg, #ef4444, #f87171)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {formatNumber(additionalResult)}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {result !== null ? (
                    <span style={{
                      background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {formatNumber(result)} {getUnit()}
                    </span>
                  ) : (
                    <span style={{ color: COLORS.text.muted }}>—</span>
                  )}
                </div>
                <div style={{ color: COLORS.text.muted, marginBottom: '16px' }}>
                  {calcType === "percent_of_number" && `${percent}% от ${number}`}
                  {calcType === "number_from_percent" && `100% = ${result !== null ? formatNumber(result) : "?"}`}
                  {calcType === "percentage_change" && `Изменение от ${number} до ${resultNumber}`}
                  {calcType === "increase_decrease" && "Увеличение и уменьшение числа"}
                </div>
              </>
            )}
            
            {/* ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ */}
            {result !== null && calcType !== "increase_decrease" && (
              <div style={{ 
                paddingTop: '16px', 
                borderTop: `1px solid ${COLORS.border}`,
                marginTop: '16px'
              }}>
                <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                  {calcType === "percent_of_number" && `${percent}% от ${number} = ${formatNumber(result)}`}
                  {calcType === "number_from_percent" && `${percent}% от числа составляет ${resultNumber}`}
                  {calcType === "percentage_change" && 
                    (result > 0 
                      ? `Увеличение на ${result.toFixed(2)}%` 
                      : `Уменьшение на ${Math.abs(result).toFixed(2)}%`)}
                </div>
              </div>
            )}
          </div>

          {/* ФОРМУЛА */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            border: `1px solid ${COLORS.border}`
          }}>
            <div style={{ 
              color: COLORS.primary, 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              fontFamily: 'monospace'
            }}>
              {getFormula()}
            </div>
            <div style={{ color: COLORS.text.dark, fontSize: '14px' }}>
              {getFormulaDescription()}
            </div>
          </div>
        </div>

        {/* SEO ТЕКСТ */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${COLORS.border}`
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🧮</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Как рассчитать проценты?
            </span>
          </h2>
          <p style={{ color: COLORS.text.main, marginBottom: '16px' }}>
            Проценты — это сотая часть числа. Калькулятор позволяет выполнять различные операции 
            с процентами: находить процент от числа, число по проценту, увеличивать или уменьшать 
            число на процент, вычислять процентное изменение.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                📐 Основные формулы
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>• <strong>Процент от числа:</strong> X% от Y = Y × X ÷ 100</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Число из процента:</strong> Если X% = Z, то Y = Z × 100 ÷ X</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Увеличение на процент:</strong> Новое = Старое × (1 + X/100)</p>
                <p>• <strong>Уменьшение на процент:</strong> Новое = Старое × (1 - X/100)</p>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                💼 Практическое применение
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>• <strong>Финансы:</strong> скидки, налоги, проценты по кредитам</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Бизнес:</strong> рост продаж, маржа, прибыль</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Учёба:</strong> успеваемость, оценка тестов</p>
                <p>• <strong>Повседневная жизнь:</strong> чаевые, скидки в магазинах</p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🔢 Быстрые расчёты в уме
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>• <strong>10% от числа:</strong> разделить на 10</p>
                <p style={{ marginBottom: '8px' }}>• <strong>5% от числа:</strong> найти 10% и разделить на 2</p>
                <p style={{ marginBottom: '8px' }}>• <strong>25% от числа:</strong> разделить на 4</p>
                <p>• <strong>50% от числа:</strong> разделить на 2</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '12px',
            color: COLORS.primary 
          }}>
            Примеры расчётов
          </h3>
          <ul style={{ color: COLORS.text.main, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              • <strong>15% от 2000:</strong> 2000 × 15 ÷ 100 = <strong>300</strong>
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Число, если 20% от него равно 150:</strong> 150 × 100 ÷ 20 = <strong>750</strong>
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Увеличение 500 на 30%:</strong> 500 × 1.3 = <strong>650</strong>
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Уменьшение 800 на 25%:</strong> 800 × 0.75 = <strong>600</strong>
            </li>
            <li>
              • <strong>Изменение с 50 до 75:</strong> ((75-50)÷50)×100 = <strong>+50%</strong>
            </li>
          </ul>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(139, 92, 246, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Полезный совет:</strong> Для быстрого увеличения числа на X% умножьте его 
              на (1 + X/100). Например, увеличение на 15%: умножьте на 1.15. 
              Для уменьшения: умножьте на (1 - X/100), например, уменьшение на 20%: умножьте на 0.8.
            </p>
          </div>
        </div>
        
        {/* ФУТЕР */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          textAlign: 'center',
          color: COLORS.text.muted,
          fontSize: '12px',
          borderTop: `1px solid ${COLORS.border}`
        }}>
          <p>
            Калькулятор процентов • Версия 1.0 • {new Date().getFullYear()} год
          </p>
          <p style={{ marginTop: '8px' }}>
            Проценты — это просто! Используйте калькулятор для точных расчётов.
          </p>
        </div>
      </div>
    </div>
  );
}