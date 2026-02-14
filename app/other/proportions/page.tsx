// app/other/proportions/page.tsx
"use client";

import { useState, useCallback } from 'react';

export default function ProportionsPage() {
  // Состояния для пропорции a/b = c/d
  const [a, setA] = useState<string>("2");
  const [b, setB] = useState<string>("5");
  const [c, setC] = useState<string>("4");
  const [d, setD] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [missingValue, setMissingValue] = useState<string>("");
  const [steps, setSteps] = useState<string[]>([]);

  // Цветовая схема
  const COLORS = {
    primary: '#f59e0b', // оранжевый
    primaryHover: '#d97706',
    secondary: '#fbbf24',
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

  // Функция решения пропорции
  const calculateProportion = useCallback(() => {
    // Парсим значения
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);
    const numD = parseFloat(d);

    // Создаем массив для шагов
    const newSteps: string[] = [];
    newSteps.push(`Пропорция: ${numA} / ${numB} = ${numC} / ${numD || 'x'}`);

    // Проверка какое значение ищем
    if (isNaN(numD)) {
      // Ищем D
      if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
        setResult("Заполните A, B и C");
        return;
      }
      if (numB === 0) {
        setResult("B не может быть 0");
        return;
      }
      const calculatedD = (numC * numB) / numA;
      setResult(calculatedD.toString());
      setMissingValue("d");
      newSteps.push(`По правилу пропорции: A × D = B × C`);
      newSteps.push(`${numA} × D = ${numB} × ${numC}`);
      newSteps.push(`${numA} × D = ${numB * numC}`);
      newSteps.push(`D = (${numB} × ${numC}) / ${numA}`);
      newSteps.push(`D = ${calculatedD}`);
    } 
    else if (isNaN(numC)) {
      // Ищем C
      if (isNaN(numA) || isNaN(numB) || isNaN(numD)) {
        setResult("Заполните A, B и D");
        return;
      }
      if (numA === 0) {
        setResult("A не может быть 0");
        return;
      }
      const calculatedC = (numA * numD) / numB;
      setResult(calculatedC.toString());
      setMissingValue("c");
      newSteps.push(`По правилу пропорции: A × D = B × C`);
      newSteps.push(`${numA} × ${numD} = ${numB} × C`);
      newSteps.push(`${numA * numD} = ${numB} × C`);
      newSteps.push(`C = (${numA} × ${numD}) / ${numB}`);
      newSteps.push(`C = ${calculatedC}`);
    }
    else if (isNaN(numB)) {
      // Ищем B
      if (isNaN(numA) || isNaN(numC) || isNaN(numD)) {
        setResult("Заполните A, C и D");
        return;
      }
      if (numC === 0) {
        setResult("C не может быть 0");
        return;
      }
      const calculatedB = (numA * numD) / numC;
      setResult(calculatedB.toString());
      setMissingValue("b");
      newSteps.push(`По правилу пропорции: A × D = B × C`);
      newSteps.push(`${numA} × ${numD} = B × ${numC}`);
      newSteps.push(`${numA * numD} = B × ${numC}`);
      newSteps.push(`B = (${numA} × ${numD}) / ${numC}`);
      newSteps.push(`B = ${calculatedB}`);
    }
    else if (isNaN(numA)) {
      // Ищем A
      if (isNaN(numB) || isNaN(numC) || isNaN(numD)) {
        setResult("Заполните B, C и D");
        return;
      }
      if (numD === 0) {
        setResult("D не может быть 0");
        return;
      }
      const calculatedA = (numB * numC) / numD;
      setResult(calculatedA.toString());
      setMissingValue("a");
      newSteps.push(`По правилу пропорции: A × D = B × C`);
      newSteps.push(`A × ${numD} = ${numB} × ${numC}`);
      newSteps.push(`A × ${numD} = ${numB * numC}`);
      newSteps.push(`A = (${numB} × ${numC}) / ${numD}`);
      newSteps.push(`A = ${calculatedA}`);
    }

    setSteps(newSteps);
  }, [a, b, c, d]);

  // Сброс
  const resetCalculator = () => {
    setA("2");
    setB("5");
    setC("4");
    setD("");
    setResult("");
    setMissingValue("");
    setSteps([]);
  };

  // Быстрые примеры
  const loadExample = (type: string) => {
    if (type === "recipe") {
      setA("2"); // 2 стакана муки
      setB("3"); // на 3 порции
      setC("5"); // сколько муки на 5 порций?
      setD("");
    } else if (type === "map") {
      setA("1"); // 1 см на карте
      setB("100000"); // 100000 см в реальности (1 км)
      setC("5"); // 5 см на карте
      setD("");
    } else if (type === "discount") {
      setA("1000"); // 1000 рублей
      setB("100"); // 100% 
      setC("300"); // 300 рублей скидка
      setD(""); // сколько процентов?
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
            <span style={{ fontSize: '32px' }}>⚖️</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Калькулятор пропорций
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Решение пропорций вида a : b = c : d
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
              onClick={resetCalculator}
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

          {/* ПОЛЯ ВВОДА */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '20px'
            }}>
              {/* A */}
              <div style={{ width: '80px' }}>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: missingValue === 'a' ? COLORS.success : COLORS.border,
                    border: `2px solid ${missingValue === 'a' ? COLORS.success : COLORS.border}`,
                    color: 'white',
                    fontSize: '18px',
                    textAlign: 'center'
                  }}
                  placeholder="a"
                />
              </div>

              <span style={{ fontSize: '20px', color: COLORS.text.muted }}>:</span>

              {/* B */}
              <div style={{ width: '80px' }}>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: missingValue === 'b' ? COLORS.success : COLORS.border,
                    border: `2px solid ${missingValue === 'b' ? COLORS.success : COLORS.border}`,
                    color: 'white',
                    fontSize: '18px',
                    textAlign: 'center'
                  }}
                  placeholder="b"
                />
              </div>

              <span style={{ fontSize: '20px', color: COLORS.text.muted }}>=</span>

              {/* C */}
              <div style={{ width: '80px' }}>
                <input
                  type="number"
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: missingValue === 'c' ? COLORS.success : COLORS.border,
                    border: `2px solid ${missingValue === 'c' ? COLORS.success : COLORS.border}`,
                    color: 'white',
                    fontSize: '18px',
                    textAlign: 'center'
                  }}
                  placeholder="c"
                />
              </div>

              <span style={{ fontSize: '20px', color: COLORS.text.muted }}>:</span>

              {/* D */}
              <div style={{ width: '80px' }}>
                <input
                  type="number"
                  value={d}
                  onChange={(e) => setD(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: missingValue === 'd' ? COLORS.success : COLORS.border,
                    border: `2px solid ${missingValue === 'd' ? COLORS.success : COLORS.border}`,
                    color: 'white',
                    fontSize: '18px',
                    textAlign: 'center'
                  }}
                  placeholder="d"
                />
              </div>
            </div>

            {/* ПОДСКАЗКА */}
            <p style={{
              fontSize: '13px',
              color: COLORS.text.dark,
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              Оставьте пустым то значение, которое нужно найти
            </p>

            {/* Кнопка расчёта */}
            <button
              onClick={calculateProportion}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: COLORS.primary,
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              🧮 Решить пропорцию
            </button>

            {/* Быстрые примеры */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => loadExample("recipe")}
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
                🍳 Рецепт
              </button>
              <button
                onClick={() => loadExample("map")}
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
                🗺️ Карта
              </button>
              <button
                onClick={() => loadExample("discount")}
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
                🏷️ Скидка
              </button>
            </div>
          </div>

          {/* РЕЗУЛЬТАТ */}
          {result && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.primary, textAlign: 'center' }}>
                Решение
              </h3>

              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: COLORS.primary,
                textAlign: 'center',
                marginBottom: '16px',
                fontFamily: 'monospace'
              }}>
                {a} : {b} = {c} : {d || result}
              </div>

              {steps.length > 0 && (
                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: COLORS.text.muted
                }}>
                  {steps.map((step, idx) => (
                    <div key={idx} style={{ marginBottom: '4px' }}>{step}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO ТЕКСТ - объяснение */}
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
            📐 Что такое пропорция?
          </h2>
          
          <p style={{ color: COLORS.text.main, fontSize: '15px', marginBottom: '16px' }}>
            Пропорция — это равенство двух отношений. Например, <strong>a : b = c : d</strong>. 
            Это означает, что a относится к b так же, как c относится к d.
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            💡 Как решать пропорцию?
          </h3>
          
          <p style={{ color: COLORS.text.muted, fontSize: '14px', marginBottom: '12px' }}>
            <strong>Основное правило пропорции:</strong> произведение крайних членов равно произведению средних.
          </p>
          
          <div style={{
            backgroundColor: COLORS.background,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontFamily: 'monospace',
            fontSize: '16px',
            textAlign: 'center',
            color: COLORS.primary
          }}>
            a × d = b × c
          </div>

          <p style={{ color: COLORS.text.muted, fontSize: '14px', marginBottom: '12px' }}>
            Если одно значение неизвестно, его можно найти:
          </p>

          <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}>• x = (b × c) / a — если ищем d</li>
            <li style={{ marginBottom: '8px' }}>• x = (a × d) / b — если ищем c</li>
            <li style={{ marginBottom: '8px' }}>• x = (a × d) / c — если ищем b</li>
            <li style={{ marginBottom: '8px' }}>• x = (b × c) / d — если ищем a</li>
          </ul>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            💡 Где применяются пропорции?
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
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🍳</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Кулинария
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Увеличение или уменьшение рецепта
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🗺️</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Карты и масштаб
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Расстояние на карте и в реальности
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>💰</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Финансы
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Проценты, скидки, налоги
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🧪</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Химия
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Растворы, смеси, концентрации
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Пример:</strong> Если для 2 порций нужно 3 яйца, то для 5 порций нужно x яиц.
              Записываем пропорцию: 2 : 3 = 5 : x → x = (3 × 5) / 2 = 7.5 яиц.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}