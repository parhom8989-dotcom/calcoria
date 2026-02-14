// app/other/molar-mass/page.tsx
"use client";

import { useState, useCallback } from 'react';

export default function MolarMassPage() {
  // Состояния калькулятора
  const [formula, setFormula] = useState<string>("H2O");
  const [result, setResult] = useState<{
    formula: string;
    molarMass: number;
    elements: { symbol: string; name: string; count: number; mass: number; total: number }[];
    percentage: { symbol: string; percentage: number }[];
  } | null>(null);
  const [error, setError] = useState<string>("");

  // Цветовая схема
  const COLORS = {
    primary: '#a855f7', // фиолетовый
    primaryHover: '#9333ea',
    secondary: '#c084fc',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    success: '#10b981'
  };

  // Периодическая таблица (атомные массы)
  const elements: Record<string, { mass: number; name: string }> = {
    H: { mass: 1.008, name: "Водород" },
    He: { mass: 4.0026, name: "Гелий" },
    Li: { mass: 6.94, name: "Литий" },
    Be: { mass: 9.0122, name: "Бериллий" },
    B: { mass: 10.81, name: "Бор" },
    C: { mass: 12.011, name: "Углерод" },
    N: { mass: 14.007, name: "Азот" },
    O: { mass: 16.0, name: "Кислород" },
    F: { mass: 18.998, name: "Фтор" },
    Ne: { mass: 20.18, name: "Неон" },
    Na: { mass: 22.99, name: "Натрий" },
    Mg: { mass: 24.305, name: "Магний" },
    Al: { mass: 26.982, name: "Алюминий" },
    Si: { mass: 28.085, name: "Кремний" },
    P: { mass: 30.974, name: "Фосфор" },
    S: { mass: 32.06, name: "Сера" },
    Cl: { mass: 35.45, name: "Хлор" },
    Ar: { mass: 39.948, name: "Аргон" },
    K: { mass: 39.098, name: "Калий" },
    Ca: { mass: 40.078, name: "Кальций" },
    Sc: { mass: 44.956, name: "Скандий" },
    Ti: { mass: 47.867, name: "Титан" },
    V: { mass: 50.942, name: "Ванадий" },
    Cr: { mass: 51.996, name: "Хром" },
    Mn: { mass: 54.938, name: "Марганец" },
    Fe: { mass: 55.845, name: "Железо" },
    Co: { mass: 58.933, name: "Кобальт" },
    Ni: { mass: 58.693, name: "Никель" },
    Cu: { mass: 63.546, name: "Медь" },
    Zn: { mass: 65.38, name: "Цинк" },
    Br: { mass: 79.904, name: "Бром" },
    Ag: { mass: 107.87, name: "Серебро" },
    I: { mass: 126.9, name: "Йод" },
    Au: { mass: 196.97, name: "Золото" },
    Hg: { mass: 200.59, name: "Ртуть" },
    Pb: { mass: 207.2, name: "Свинец" }
  };

  // Парсинг химической формулы
  const parseFormula = useCallback((input: string) => {
    const elementCounts: Record<string, number> = {};
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;

    while ((match = regex.exec(input)) !== null) {
      const element = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;
      
      if (!elements[element]) {
        throw new Error(`Элемент ${element} не найден в базе данных`);
      }
      
      elementCounts[element] = (elementCounts[element] || 0) + count;
    }

    return elementCounts;
  }, []);

  // Расчёт молярной массы
  const calculateMolarMass = useCallback(() => {
    setError("");
    
    try {
      // Удаляем пробелы
      const cleanFormula = formula.replace(/\s+/g, '');
      
      if (!cleanFormula) {
        setError("Введите химическую формулу");
        return;
      }

      // Парсим формулу
      const elementCounts = parseFormula(cleanFormula);
      
      // Рассчитываем массу и собираем данные
      let totalMass = 0;
      const elementsData = [];
      const percentageData = [];

      for (const [element, count] of Object.entries(elementCounts)) {
        const elementMass = elements[element].mass;
        const totalElementMass = elementMass * count;
        totalMass += totalElementMass;
        
        elementsData.push({
          symbol: element,
          name: elements[element].name,
          count,
          mass: elementMass,
          total: totalElementMass
        });
      }

      // Сортируем элементы по алфавиту
      elementsData.sort((a, b) => a.symbol.localeCompare(b.symbol));

      // Рассчитываем процентное содержание
      for (const item of elementsData) {
        percentageData.push({
          symbol: item.symbol,
          percentage: (item.total / totalMass) * 100
        });
      }

      setResult({
        formula: cleanFormula,
        molarMass: totalMass,
        elements: elementsData,
        percentage: percentageData
      });

    } catch (err: any) {
      setError(err.message || "Ошибка в формуле");
      setResult(null);
    }
  }, [formula, parseFormula]);

  // Быстрые примеры
  const setExample = (ex: string) => {
    setFormula(ex);
    setTimeout(() => calculateMolarMass(), 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КАЛЬКУЛЯТОРА */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: `1px solid ${COLORS.border}`
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>⚗️</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Калькулятор молярной массы
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Расчёт молекулярной массы химических соединений
              </p>
            </div>
          </div>

          {/* КНОПКИ */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <a 
              href="/"
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: COLORS.border,
                color: COLORS.text.main,
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: `1px solid ${COLORS.border}`,
                textAlign: 'center'
              }}
            >
              ← На главную
            </a>
            <button
              onClick={() => {
                setFormula("");
                setResult(null);
                setError("");
              }}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: COLORS.border,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.primary,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* ПОЛЕ ВВОДА */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
              Химическая формула
            </label>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <input
                type="text"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="Например: H2O, CO2, C6H12O6"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={calculateMolarMass}
                style={{
                  padding: '12px 20px',
                  backgroundColor: COLORS.primary,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primary;
                }}
              >
                Рассчитать
              </button>
            </div>

            {/* Быстрые примеры */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginTop: '12px'
            }}>
              <button
                onClick={() => setExample("H2O")}
                style={{
                  padding: '6px 12px',
                  backgroundColor: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '20px',
                  color: COLORS.text.muted,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                H₂O (вода)
              </button>
              <button
                onClick={() => setExample("CO2")}
                style={{
                  padding: '6px 12px',
                  backgroundColor: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '20px',
                  color: COLORS.text.muted,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                CO₂ (углекислый газ)
              </button>
              <button
                onClick={() => setExample("C6H12O6")}
                style={{
                  padding: '6px 12px',
                  backgroundColor: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '20px',
                  color: COLORS.text.muted,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                C₆H₁₂O₆ (глюкоза)
              </button>
              <button
                onClick={() => setExample("NaCl")}
                style={{
                  padding: '6px 12px',
                  backgroundColor: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '20px',
                  color: COLORS.text.muted,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                NaCl (соль)
              </button>
              <button
                onClick={() => setExample("H2SO4")}
                style={{
                  padding: '6px 12px',
                  backgroundColor: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '20px',
                  color: COLORS.text.muted,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                H₂SO₄ (серная кислота)
              </button>
            </div>

            {error && (
              <div style={{
                marginTop: '12px',
                padding: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                borderRadius: '6px',
                color: '#ef4444',
                fontSize: '13px'
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* РЕЗУЛЬТАТ */}
          {result && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${COLORS.border}`
            }}>
              
              {/* Молярная масса */}
              <div style={{
                backgroundColor: COLORS.card,
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px' }}>
                  Молярная масса {result.formula}
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.primary }}>
                  {result.molarMass.toFixed(3)} г/моль
                </div>
              </div>

              {/* Состав */}
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.primary }}>
                Элементный состав
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {result.elements.map((el, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: COLORS.card,
                      padding: '12px',
                      borderRadius: '6px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontWeight: 'bold', color: COLORS.primary }}>
                        {el.symbol} — {el.name}
                      </span>
                      <span style={{ color: COLORS.text.main }}>
                        {el.count} × {el.mass.toFixed(3)} = {el.total.toFixed(3)}
                      </span>
                    </div>
                    
                    {/* Прогресс-бар процентного содержания */}
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: COLORS.border,
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      {result.percentage.map((p, i) => {
                        if (p.symbol === el.symbol) {
                          return (
                            <div
                              key={i}
                              style={{
                                width: `${p.percentage}%`,
                                height: '100%',
                                backgroundColor: COLORS.primary,
                                borderRadius: '2px'
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '4px',
                      fontSize: '11px',
                      color: COLORS.text.dark
                    }}>
                      <span>Массовая доля:</span>
                      <span>
                        {result.percentage.find(p => p.symbol === el.symbol)?.percentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Сумма */}
              <div style={{
                padding: '12px',
                backgroundColor: COLORS.card,
                borderRadius: '6px',
                border: `1px solid ${COLORS.primary}`,
                textAlign: 'center',
                fontSize: '13px',
                color: COLORS.text.muted
              }}>
                Общая масса: {result.molarMass.toFixed(3)} г/моль
              </div>
            </div>
          )}
        </div>

        {/* SEO ТЕКСТ */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${COLORS.border}`
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: COLORS.primary
          }}>
            💡 Что такое молярная масса?
          </h2>
          
          <p style={{ color: COLORS.text.main, fontSize: '15px', marginBottom: '16px' }}>
            <strong>Молярная масса</strong> — это масса одного моля вещества (6.022 × 10²³ частиц). 
            Она численно равна молекулярной массе, но выражается в г/моль. Зная молярную массу, 
            можно рассчитать необходимое количество вещества для химической реакции.
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            📐 Как рассчитывается?
          </h3>

          <div style={{
            backgroundColor: COLORS.background,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <p style={{ color: COLORS.text.muted, fontSize: '14px', marginBottom: '8px' }}>
              <strong>Пример для воды (H₂O):</strong>
            </p>
            <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px' }}>
              <li>H (водород) — 1.008 г/моль × 2 атома = 2.016 г/моль</li>
              <li>O (кислород) — 16.00 г/моль × 1 атом = 16.00 г/моль</li>
              <li><strong>Итого:</strong> 2.016 + 16.00 = 18.016 г/моль</li>
            </ul>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            🔬 Где применяется?
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚗️</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Лабораторные работы
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Приготовление растворов нужной концентрации
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🏭</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Промышленность
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Расчёт реагентов для химических процессов
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>💊</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Фармацевтика
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Производство лекарственных препаратов
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🌱</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Агрохимия
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Расчёт удобрений и подкормок
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            📊 Таблица атомных масс (основные элементы)
          </h3>

          <div style={{
            backgroundColor: COLORS.background,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px', color: COLORS.primary, borderBottom: `1px solid ${COLORS.border}` }}>Элемент</th>
                  <th style={{ padding: '8px', color: COLORS.primary, borderBottom: `1px solid ${COLORS.border}` }}>Символ</th>
                  <th style={{ padding: '8px', color: COLORS.primary, borderBottom: `1px solid ${COLORS.border}` }}>Масса (г/моль)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '6px' }}>Водород</td><td style={{ padding: '6px' }}>H</td><td style={{ padding: '6px' }}>1.008</td></tr>
                <tr><td style={{ padding: '6px' }}>Углерод</td><td style={{ padding: '6px' }}>C</td><td style={{ padding: '6px' }}>12.011</td></tr>
                <tr><td style={{ padding: '6px' }}>Азот</td><td style={{ padding: '6px' }}>N</td><td style={{ padding: '6px' }}>14.007</td></tr>
                <tr><td style={{ padding: '6px' }}>Кислород</td><td style={{ padding: '6px' }}>O</td><td style={{ padding: '6px' }}>16.000</td></tr>
                <tr><td style={{ padding: '6px' }}>Натрий</td><td style={{ padding: '6px' }}>Na</td><td style={{ padding: '6px' }}>22.990</td></tr>
                <tr><td style={{ padding: '6px' }}>Хлор</td><td style={{ padding: '6px' }}>Cl</td><td style={{ padding: '6px' }}>35.450</td></tr>
                <tr><td style={{ padding: '6px' }}>Кальций</td><td style={{ padding: '6px' }}>Ca</td><td style={{ padding: '6px' }}>40.078</td></tr>
                <tr><td style={{ padding: '6px' }}>Железо</td><td style={{ padding: '6px' }}>Fe</td><td style={{ padding: '6px' }}>55.845</td></tr>
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Формула для расчёта:</strong> M = n₁·m₁ + n₂·m₂ + ... где n — количество атомов элемента, m — атомная масса элемента.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}