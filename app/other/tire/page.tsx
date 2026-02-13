// app/shinnyy-kalkulyator/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function ShinnyyKalkulyatorPage() {
  // Состояния для первой шины
  const [width1, setWidth1] = useState<string>("205");
  const [profile1, setProfile1] = useState<string>("55");
  const [rim1, setRim1] = useState<string>("16");
  
  // Состояния для второй шины (сравнение)
  const [width2, setWidth2] = useState<string>("225");
  const [profile2, setProfile2] = useState<string>("50");
  const [rim2, setRim2] = useState<string>("17");
  
  // Режим: одиночный расчёт или сравнение
  const [mode, setMode] = useState<"single" | "compare">("single");
  
  // Результаты для первой шины
  const [height1, setHeight1] = useState<number | null>(null);
  const [outerDiameter1, setOuterDiameter1] = useState<number | null>(null);
  const [circumference1, setCircumference1] = useState<number | null>(null);
  const [revolutions1, setRevolutions1] = useState<number | null>(null);
  
  // Результаты для второй шины (сравнение)
  const [height2, setHeight2] = useState<number | null>(null);
  const [outerDiameter2, setOuterDiameter2] = useState<number | null>(null);
  const [circumference2, setCircumference2] = useState<number | null>(null);
  const [revolutions2, setRevolutions2] = useState<number | null>(null);
  
  // Результаты сравнения
  const [diameterDiff, setDiameterDiff] = useState<number | null>(null);
  const [diameterDiffPercent, setDiameterDiffPercent] = useState<number | null>(null);
  const [clearanceDiff, setClearanceDiff] = useState<number | null>(null);
  const [speedError, setSpeedError] = useState<number | null>(null);
  const [isRecommended, setIsRecommended] = useState<boolean>(true);

  // Цветовая схема #ea580c (оранжевый)
  const COLORS = {
    primary: '#ea580c',
    primaryHover: '#c2410c',
    secondary: '#f97316',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#ea580c',
      to: '#f97316'
    },
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };

  // Расчёт параметров шины
  const calculateTire = useCallback((width: number, profile: number, rim: number) => {
    const tireHeight = width * (profile / 100);
    const diameter = (rim * 25.4) + (2 * tireHeight);
    const circumference = Math.PI * diameter;
    const revs = 1000000 / circumference;
    
    return {
      height: tireHeight,
      diameter,
      circumference,
      revolutions: revs
    };
  }, []);

  // Расчёт всех параметров
  const calculateAll = useCallback(() => {
    const w1 = parseFloat(width1) || 0;
    const p1 = parseFloat(profile1) || 0;
    const r1 = parseFloat(rim1) || 0;
    
    const w2 = parseFloat(width2) || 0;
    const p2 = parseFloat(profile2) || 0;
    const r2 = parseFloat(rim2) || 0;
    
    if (w1 > 0 && p1 > 0 && r1 > 0) {
      const result1 = calculateTire(w1, p1, r1);
      setHeight1(result1.height);
      setOuterDiameter1(result1.diameter);
      setCircumference1(result1.circumference);
      setRevolutions1(result1.revolutions);
    }
    
    if (w2 > 0 && p2 > 0 && r2 > 0) {
      const result2 = calculateTire(w2, p2, r2);
      setHeight2(result2.height);
      setOuterDiameter2(result2.diameter);
      setCircumference2(result2.circumference);
      setRevolutions2(result2.revolutions);
      
      if (w1 > 0 && p1 > 0 && r1 > 0) {
        const result1 = calculateTire(w1, p1, r1);
        
        const diff = result2.diameter - result1.diameter;
        setDiameterDiff(diff);
        
        const diffPercent = (diff / result1.diameter) * 100;
        setDiameterDiffPercent(diffPercent);
        
        setClearanceDiff(diff / 2);
        
        const speedErr = ((result2.circumference - result1.circumference) / result1.circumference) * 100;
        setSpeedError(speedErr);
        
        setIsRecommended(Math.abs(diffPercent) <= 3);
      }
    }
  }, [width1, profile1, rim1, width2, profile2, rim2, calculateTire]);

  useEffect(() => {
    calculateAll();
  }, [calculateAll]);

  const resetCalculator = () => {
    setWidth1("205");
    setProfile1("55");
    setRim1("16");
    setWidth2("225");
    setProfile2("50");
    setRim2("17");
    setMode("single");
  };

  const swapTires = () => {
    setWidth1(width2);
    setProfile1(profile2);
    setRim1(rim2);
    setWidth2(width1);
    setProfile2(profile1);
    setRim2(rim1);
  };

  const formatNumber = (num: number, decimals: number = 1) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatWithSign = (num: number, decimals: number = 1) => {
    const formatted = formatNumber(Math.abs(num), decimals);
    return num > 0 ? `+${formatted}` : num < 0 ? `-${formatted}` : `0`;
  };

  const getValueColor = (value: number | null) => {
    if (value === null) return COLORS.text.main;
    if (Math.abs(value) <= 1) return COLORS.success;
    if (Math.abs(value) <= 3) return COLORS.warning;
    return COLORS.danger;
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
              <span style={{ fontSize: '32px' }}>🛞</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Шинный калькулятор
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              Расчёт размеров шин и сравнение для подбора
            </p>
          </div>

          {/* ДВЕ КНОПКИ РЯДОМ */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
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
              onClick={() => setMode("single")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: mode === "single" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: mode === "single" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: mode === "single" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              🔍 Одиночный
            </button>
            <button
              onClick={() => setMode("compare")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: mode === "compare" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: mode === "compare" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: mode === "compare" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Сравнение
            </button>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            {/* Шина 1 */}
            <div style={{
              backgroundColor: COLORS.background,
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`,
              marginBottom: mode === "compare" ? '16px' : '0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '20px' }}>🛞</span>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  color: COLORS.primary 
                }}>
                  Шина {mode === "compare" ? "A" : ""}
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: COLORS.text.muted, fontSize: '12px' }}>
                    Ширина (мм)
                  </label>
                  <input
                    type="number"
                    value={width1}
                    onChange={(e) => setWidth1(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: COLORS.text.muted, fontSize: '12px' }}>
                    Профиль (%)
                  </label>
                  <input
                    type="number"
                    value={profile1}
                    onChange={(e) => setProfile1(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: COLORS.text.muted, fontSize: '12px' }}>
                    Диск (")
                  </label>
                  <input
                    type="number"
                    value={rim1}
                    onChange={(e) => setRim1(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Шина 2 и кнопка обмена - ТОЛЬКО ДЛЯ СРАВНЕНИЯ */}
            {mode === "compare" && (
              <>
                {/* Кнопка обмена */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '8px 0'
                }}>
                  <button
                    onClick={swapTires}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: COLORS.primary,
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.primary;
                    }}
                  >
                    <span>⇄</span> Поменять местами
                  </button>
                </div>

                {/* Шина 2 */}
                <div style={{
                  backgroundColor: COLORS.background,
                  padding: '16px',
                  borderRadius: '8px',
                  border: `1px solid ${COLORS.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '20px' }}>🛞</span>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      color: COLORS.secondary 
                    }}>
                      Шина Б
                    </h3>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px'
                  }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', color: COLORS.text.muted, fontSize: '12px' }}>
                        Ширина (мм)
                      </label>
                      <input
                        type="number"
                        value={width2}
                        onChange={(e) => setWidth2(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          backgroundColor: COLORS.border,
                          border: `1px solid #475569`,
                          color: 'white',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', color: COLORS.text.muted, fontSize: '12px' }}>
                        Профиль (%)
                      </label>
                      <input
                        type="number"
                        value={profile2}
                        onChange={(e) => setProfile2(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          backgroundColor: COLORS.border,
                          border: `1px solid #475569`,
                          color: 'white',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', color: COLORS.text.muted, fontSize: '12px' }}>
                        Диск (")
                      </label>
                      <input
                        type="number"
                        value={rim2}
                        onChange={(e) => setRim2(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          backgroundColor: COLORS.border,
                          border: `1px solid #475569`,
                          color: 'white',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* РЕЗУЛЬТАТЫ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px'
          }}>
            {mode === "single" ? (
              /* Одиночный расчёт */
              <div>
                <div style={{ 
                  fontSize: '14px', 
                  color: COLORS.text.muted, 
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  Параметры шины {width1}/{profile1} R{rim1}
                </div>
                
                {/* АДАПТАЦИЯ: на мобилке 1 колонка, на десктопе 2 колонки */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    backgroundColor: COLORS.card,
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Наружный диаметр
                    </div>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      color: COLORS.primary
                    }}>
                      {outerDiameter1 !== null ? formatNumber(outerDiameter1, 1) : "—"} мм
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: COLORS.card,
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Длина окружности
                    </div>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      color: COLORS.secondary
                    }}>
                      {circumference1 !== null ? formatNumber(circumference1, 1) : "—"} мм
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    Оборотов на 1 км
                  </div>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: COLORS.text.main
                  }}>
                    {revolutions1 !== null ? formatNumber(revolutions1, 0) : "—"}
                  </div>
                </div>
              </div>
            ) : (
              /* Режим сравнения */
              <div>
                <div style={{ 
                  fontSize: '14px', 
                  color: COLORS.text.muted, 
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  Сравнение шин
                </div>
                
                {/* АДАПТАЦИЯ: на мобилке 1 колонка, на десктопе 2 колонки */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  {/* Шина А */}
                  <div style={{
                    backgroundColor: COLORS.card,
                    padding: '16px',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                      borderBottom: `1px solid ${COLORS.border}`,
                      paddingBottom: '12px'
                    }}>
                      <span style={{ fontSize: '18px' }}>🛞</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary }}>
                        Шина А
                      </span>
                      <span style={{ fontSize: '12px', color: COLORS.text.muted }}>
                        {width1}/{profile1} R{rim1}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Диаметр</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          {outerDiameter1 !== null ? formatNumber(outerDiameter1, 1) : "—"} мм
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Оборотов/км</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          {revolutions1 !== null ? formatNumber(revolutions1, 0) : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Шина Б */}
                  <div style={{
                    backgroundColor: COLORS.card,
                    padding: '16px',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                      borderBottom: `1px solid ${COLORS.border}`,
                      paddingBottom: '12px'
                    }}>
                      <span style={{ fontSize: '18px' }}>🛞</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.secondary }}>
                        Шина Б
                      </span>
                      <span style={{ fontSize: '12px', color: COLORS.text.muted }}>
                        {width2}/{profile2} R{rim2}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Диаметр</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          {outerDiameter2 !== null ? formatNumber(outerDiameter2, 1) : "—"} мм
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Оборотов/км</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          {revolutions2 !== null ? formatNumber(revolutions2, 0) : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Разница */}
                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  border: `1px solid ${getValueColor(diameterDiffPercent)}`,
                  marginTop: '8px'
                }}>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    marginBottom: '12px',
                    color: COLORS.text.main,
                    textAlign: 'center'
                  }}>
                    Разница между шинами
                  </h4>
                  
                  {/* АДАПТАЦИЯ: на мобилке 1 колонка, на десктопе 2 колонки */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>
                        Разница в диаметре
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: getValueColor(diameterDiff)
                      }}>
                        {diameterDiff !== null ? formatWithSign(diameterDiff, 1) : "—"} мм
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>
                        Разница в %
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: getValueColor(diameterDiffPercent)
                      }}>
                        {diameterDiffPercent !== null ? formatWithSign(diameterDiffPercent, 1) : "—"}%
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>
                        Изменение клиренса
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: getValueColor(clearanceDiff)
                      }}>
                        {clearanceDiff !== null ? formatWithSign(clearanceDiff, 1) : "—"} мм
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>
                        Погрешность спидометра
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: getValueColor(speedError)
                      }}>
                        {speedError !== null ? formatWithSign(speedError, 1) : "—"}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Рекомендация */}
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: isRecommended 
                      ? `rgba(16, 185, 129, 0.1)` 
                      : `rgba(239, 68, 68, 0.1)`,
                    borderRadius: '6px',
                    border: `1px solid ${isRecommended ? COLORS.success : COLORS.danger}`,
                    textAlign: 'center'
                  }}>
                    <span style={{ marginRight: '6px' }}>
                      {isRecommended ? "✅" : "⚠️"}
                    </span>
                    <span style={{ 
                      color: isRecommended ? COLORS.success : COLORS.danger,
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      {isRecommended 
                        ? "Шины взаимозаменяемы (разница менее 3%)" 
                        : "Не рекомендуется (разница более 3%)"}
                    </span>
                  </div>
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
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '6px',
              fontFamily: 'monospace'
            }}>
              Диаметр = (Диск × 25.4) + 2 × (Ширина × Профиль ÷ 100)
            </div>
            <div style={{ color: COLORS.text.dark, fontSize: '13px' }}>
              Длина окружности = π × Диаметр • Оборотов/км = 1 000 000 ÷ Длина окружности
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
            <span style={{ fontSize: '28px' }}>🛞</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Как подобрать шины?
            </span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                📏 Маркировка шин
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p><strong>205/55 R16</strong> —</p>
                <p>• 205 мм — ширина профиля</p>
                <p>• 55% — высота профиля от ширины</p>
                <p>• R — радиальная конструкция</p>
                <p>• 16" — посадочный диаметр диска</p>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                ⚠️ Допустимые отклонения
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p>• <span style={{color: COLORS.success}}>До ±1%</span> — идеальная замена</p>
                <p>• <span style={{color: COLORS.warning}}>±1% до ±3%</span> — допустимо</p>
                <p>• <span style={{color: COLORS.danger}}>Более ±3%</span> — не рекомендуется</p>
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(234, 88, 12, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Совет:</strong> При замене шин старайтесь подбирать размер с разницей в диаметре не более 3%. Это обеспечит корректную работу спидометра, ABS и других систем автомобиля.
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
            Шинный калькулятор • Визуальное сравнение и погрешность спидометра • {new Date().getFullYear()} год
          </p>
          <p style={{ marginTop: '8px' }}>
            Расчёты носят информационный характер. Всегда сверяйтесь с рекомендациями производителя автомобиля.
          </p>
        </div>
      </div>
    </div>
  );
}