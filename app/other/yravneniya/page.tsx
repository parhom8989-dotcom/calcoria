// app/other/linear-equation/page.tsx
"use client";

import { useState, useCallback } from 'react';

export default function LinearEquationPage() {
  // Состояния для уравнения вида ax + b = c
  const [a, setA] = useState<string>("2");
  const [b, setB] = useState<string>("3");
  const [c, setC] = useState<string>("7");
  const [result, setResult] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Цветовая схема #6366f1 (индиго)
  const COLORS = {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    secondary: '#818cf8',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#6366f1',
      to: '#818cf8'
    },
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };

  // Решение линейного уравнения ax + b = c
  const solveEquation = useCallback(() => {
    setError("");
    setResult("");
    setSolution("");
    setSteps([]);

    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    // Проверка на корректность ввода
    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setError("Пожалуйста, введите все коэффициенты");
      return;
    }

    const newSteps: string[] = [];
    newSteps.push(`Исходное уравнение: ${numA}x + ${numB} = ${numC}`);

    // Проверка на ноль коэффициента A
    if (numA === 0) {
      if (numB === numC) {
        setResult("∞");
        setSolution("Бесконечное множество решений");
        newSteps.push(`Коэффициент a = 0`);
        newSteps.push(`${numB} = ${numC} — верно для любого x`);
        setSteps(newSteps);
      } else {
        setResult("нет решений");
        setSolution("Уравнение не имеет решений");
        newSteps.push(`Коэффициент a = 0`);
        newSteps.push(`${numB} ≠ ${numC} — противоречие`);
        setSteps(newSteps);
      }
      return;
    }

    // Решение: x = (c - b) / a
    newSteps.push(`Переносим ${numB} в правую часть:`);
    newSteps.push(`${numA}x = ${numC} - (${numB})`);
    
    const rightSide = numC - numB;
    newSteps.push(`${numA}x = ${rightSide}`);
    
    newSteps.push(`Делим обе части на ${numA}:`);
    newSteps.push(`x = ${rightSide} / ${numA}`);
    
    const x = rightSide / numA;
    
    // Форматируем результат
    const formattedX = Number.isInteger(x) ? x.toString() : x.toFixed(4);
    newSteps.push(`x = ${formattedX}`);

    // Проверка
    newSteps.push(`\nПроверка:`);
    const check = numA * x + numB;
    newSteps.push(`${numA} × ${formattedX} + ${numB} = ${check.toFixed(4)}`);
    newSteps.push(`Получили ${check.toFixed(4)} = ${numC} — верно ✓`);

    setResult(formattedX);
    setSolution(`x = ${formattedX}`);
    setSteps(newSteps);

  }, [a, b, c]);

  // Сброс калькулятора
  const resetCalculator = () => {
    setA("2");
    setB("3");
    setC("7");
    setResult("");
    setSolution("");
    setSteps([]);
    setError("");
  };

  // Примеры уравнений
  const examples = [
    { a: "2", b: "3", c: "7", desc: "2x + 3 = 7 → x = 2" },
    { a: "5", b: "-2", c: "8", desc: "5x - 2 = 8 → x = 2" },
    { a: "3", b: "4", c: "1", desc: "3x + 4 = 1 → x = -1" },
    { a: "0", b: "5", c: "5", desc: "0x + 5 = 5 → x ∈ R" },
    { a: "0", b: "2", c: "7", desc: "0x + 2 = 7 → нет решений" }
  ];

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
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '32px' }}>📐</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Решение линейных уравнений
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              ax + b = c • Пошаговое решение • Проверка
            </p>
          </div>

          {/* КНОПКИ НАВИГАЦИИ */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/"
              style={{
                flex: '1 1 200px',
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
                flex: '1 1 200px',
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

          {/* КОЭФФИЦИЕНТЫ */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px'
            }}>
              <div style={{ width: '100px' }}>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: COLORS.primary,
                    fontSize: '20px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <span style={{ color: COLORS.text.main }}>x</span>
              <span style={{ color: COLORS.text.muted, fontSize: '18px' }}>+</span>
              <div style={{ width: '100px' }}>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: COLORS.primary,
                    fontSize: '20px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <span style={{ color: COLORS.text.muted, fontSize: '18px' }}>=</span>
              <div style={{ width: '100px' }}>
                <input
                  type="number"
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: COLORS.primary,
                    fontSize: '20px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Кнопка решения */}
            <button
              onClick={solveEquation}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: COLORS.primary,
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              🧮 Решить уравнение
            </button>

            {/* Примеры */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center'
            }}>
              {examples.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setA(ex.a);
                    setB(ex.b);
                    setC(ex.c);
                    solveEquation();
                  }}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: COLORS.background,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '20px',
                    color: COLORS.text.muted,
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
                    e.currentTarget.style.color = COLORS.text.muted;
                  }}
                >
                  {ex.desc}
                </button>
              ))}
            </div>
          </div>

          {/* РЕЗУЛЬТАТ */}
          {error && (
            <div style={{
              backgroundColor: `rgba(239, 68, 68, 0.1)`,
              border: `1px solid ${COLORS.danger}`,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              color: COLORS.danger,
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          {solution && !error && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${COLORS.border}`,
              marginBottom: '20px',
              background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
            }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px' }}>
                  Решение уравнения:
                </div>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: 'bold',
                  color: COLORS.primary,
                  fontFamily: 'monospace'
                }}>
                  {solution}
                </div>
              </div>

              {/* Пошаговое решение */}
              {steps.length > 0 && (
                <div style={{
                  borderTop: `1px solid ${COLORS.border}`,
                  paddingTop: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📝</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.primary }}>
                      Пошаговое решение
                    </h3>
                  </div>
                  
                  <div style={{
                    backgroundColor: COLORS.card,
                    borderRadius: '8px',
                    padding: '16px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '1.8',
                    color: COLORS.text.main
                  }}>
                    {steps.map((step, idx) => (
                      <div key={idx} style={{ 
                        marginBottom: '8px',
                        color: step.includes('✓') ? COLORS.success : 
                               step.includes('нет решений') ? COLORS.danger : 
                               step.includes('Бесконечное') ? COLORS.warning : 
                               COLORS.text.main
                      }}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            fontSize: '24px', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '28px' }}>📐</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Линейные уравнения: теория и практика
            </span>
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                📌 Что такое линейное уравнение?
              </h3>
              <p style={{ color: COLORS.text.main, fontSize: '14px' }}>
                Линейное уравнение — это уравнение вида <strong>ax + b = c</strong>, 
                где x — переменная, a, b, c — известные числа (коэффициенты). 
                Такие уравнения называются линейными, потому что переменная x 
                находится в первой степени.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🔧 Алгоритм решения
              </h3>
              <ol style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '4px' }}>Перенести b в правую часть: ax = c - b</li>
                <li style={{ marginBottom: '4px' }}>Разделить обе части на a: x = (c - b) / a</li>
                <li style={{ marginBottom: '4px' }}>Проверить, что a ≠ 0</li>
                <li>Выполнить проверку подстановкой</li>
              </ol>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                ⚠️ Особые случаи
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '4px' }}>
                  • <strong>a ≠ 0</strong> — единственное решение
                </p>
                <p style={{ marginBottom: '4px' }}>
                  • <strong>a = 0, b = c</strong> — бесконечно много решений
                </p>
                <p>
                  • <strong>a = 0, b ≠ c</strong> — нет решений
                </p>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', color: COLORS.primary, marginBottom: '12px' }}>
            Примеры с подробным решением
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                Пример 1: 2x + 3 = 7
              </h4>
              <div style={{ color: COLORS.text.muted, fontSize: '14px', fontFamily: 'monospace' }}>
                2x + 3 = 7<br/>
                2x = 7 - 3<br/>
                2x = 4<br/>
                x = 4 ÷ 2<br/>
                <strong style={{ color: COLORS.primary }}>x = 2</strong><br/>
                Проверка: 2×2 + 3 = 4 + 3 = 7 ✓
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                Пример 2: 5x - 2 = 8
              </h4>
              <div style={{ color: COLORS.text.muted, fontSize: '14px', fontFamily: 'monospace' }}>
                5x - 2 = 8<br/>
                5x = 8 + 2<br/>
                5x = 10<br/>
                x = 10 ÷ 5<br/>
                <strong style={{ color: COLORS.primary }}>x = 2</strong><br/>
                Проверка: 5×2 - 2 = 10 - 2 = 8 ✓
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                Пример 3: 3x + 4 = 1
              </h4>
              <div style={{ color: COLORS.text.muted, fontSize: '14px', fontFamily: 'monospace' }}>
                3x + 4 = 1<br/>
                3x = 1 - 4<br/>
                3x = -3<br/>
                x = -3 ÷ 3<br/>
                <strong style={{ color: COLORS.primary }}>x = -1</strong><br/>
                Проверка: 3×(-1) + 4 = -3 + 4 = 1 ✓
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', color: COLORS.primary, marginBottom: '12px' }}>
            Где применяются линейные уравнения?
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                💰 Финансы
              </h4>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Расчёт процентов, кредитов, вкладов, налогов.
                Например: сколько нужно откладывать в месяц, чтобы накопить сумму.
              </p>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                🚗 Путешествия
              </h4>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Расчёт времени в пути, расхода топлива, 
                стоимости поездки в зависимости от расстояния.
              </p>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                🏠 Строительство
              </h4>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Расчёт материалов, пропорций смесей, 
                площади и объёма помещений.
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(99, 102, 241, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Совет:</strong> При решении уравнений всегда проверяйте, 
              что коэффициент при x (a) не равен нулю. Если a = 0, уравнение может 
              не иметь решений или иметь бесконечно много решений. Используйте 
              проверку подстановкой, чтобы убедиться в правильности ответа.
            </p>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            border: `1px solid ${COLORS.border}`
          }}>
            <h4 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '12px' }}>
              📚 Интересные факты
            </h4>
            <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>• Слово «алгебра» происходит от арабского «аль-джабр» из трактата математика Аль-Хорезми (IX век).</li>
              <li style={{ marginBottom: '8px' }}>• Линейные уравнения используются в компьютерной графике для преобразований координат.</li>
              <li style={{ marginBottom: '8px' }}>• В экономике линейные уравнения применяются для моделирования спроса и предложения.</li>
              <li style={{ marginBottom: '8px' }}>• Первое упоминание методов решения уравнений встречается в древнеегипетском папирусе Ринда (около 1650 г. до н.э.).</li>
              <li>• Линейные уравнения — основа для понимания более сложных математических концепций.</li>
            </ul>
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
            Калькулятор линейных уравнений • ax + b = c • Пошаговое решение • {new Date().getFullYear()} год
          </p>
        </div>
      </div>
    </div>
  );
}