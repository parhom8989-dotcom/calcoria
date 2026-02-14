// app/other/random/page.tsx
"use client";

import { useState, useCallback } from 'react';

export default function RandomNumberPage() {
  // Состояния калькулятора
  const [min, setMin] = useState<string>("1");
  const [max, setMax] = useState<string>("100");
  const [count, setCount] = useState<string>("5");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [unique, setUnique] = useState<boolean>(false);
  const [sort, setSort] = useState<boolean>(false);
  const [history, setHistory] = useState<number[][]>([]);

  // Цветовая схема
  const COLORS = {
    primary: '#3b82f6', // синий
    primaryHover: '#2563eb',
    secondary: '#60a5fa',
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

  // Генерация случайных чисел
  const generateNumbers = useCallback(() => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    const countVal = parseInt(count);

    // Валидация
    if (isNaN(minVal) || isNaN(maxVal) || isNaN(countVal)) {
      alert('Пожалуйста, введите корректные числа');
      return;
    }

    if (minVal >= maxVal) {
      alert('Минимальное значение должно быть меньше максимального');
      return;
    }

    if (countVal < 1) {
      alert('Количество чисел должно быть больше 0');
      return;
    }

    if (unique && (maxVal - minVal + 1) < countVal) {
      alert('Невозможно сгенерировать уникальные числа в таком диапазоне');
      return;
    }

    // Генерация
    let generated: number[] = [];
    
    if (unique) {
      // Уникальные числа
      const available = Array.from(
        { length: maxVal - minVal + 1 }, 
        (_, i) => minVal + i
      );
      
      for (let i = 0; i < countVal; i++) {
        if (available.length === 0) break;
        const randomIndex = Math.floor(Math.random() * available.length);
        generated.push(available[randomIndex]);
        available.splice(randomIndex, 1);
      }
    } else {
      // Обычные случайные числа
      for (let i = 0; i < countVal; i++) {
        const random = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        generated.push(random);
      }
    }

    // Сортировка если нужно
    if (sort) {
      generated.sort((a, b) => a - b);
    }

    setNumbers(generated);
    
    // Сохраняем в историю
    setHistory(prev => [generated, ...prev].slice(0, 10));
    
  }, [min, max, count, unique, sort]);

  // Копировать в буфер обмена
  const copyToClipboard = () => {
    const text = numbers.join(', ');
    navigator.clipboard.writeText(text);
    alert('Скопировано!');
  };

  // Очистить всё
  const clearAll = () => {
    setNumbers([]);
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
            <span style={{ fontSize: '32px' }}>🔢</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Генератор случайных чисел
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Случайные числа в заданном диапазоне
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
              onClick={clearAll}
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
              🧹 Очистить
            </button>
          </div>

          {/* ПОЛЯ ВВОДА */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
              Минимум
                </label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Максимум
                </label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                Количество чисел
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px'
                }}
                min="1"
                max="100"
              />
            </div>

            {/* НАСТРОЙКИ */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '16px',
              flexWrap: 'wrap'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={unique}
                  onChange={(e) => setUnique(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: COLORS.text.muted }}>Только уникальные</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={sort}
                  onChange={(e) => setSort(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: COLORS.text.muted }}>Сортировать</span>
              </label>
            </div>

            {/* Кнопка генерации */}
            <button
              onClick={generateNumbers}
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
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              🎲 Сгенерировать
            </button>
          </div>

          {/* РЕЗУЛЬТАТ */}
          {numbers.length > 0 && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${COLORS.border}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary }}>
                  Результат:
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '6px',
                      color: COLORS.text.main,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    📋 Копировать
                  </button>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                {numbers.map((num, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: COLORS.card,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${COLORS.primary}`,
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: COLORS.primary,
                      minWidth: '60px',
                      textAlign: 'center'
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>

              <div style={{
                fontSize: '12px',
                color: COLORS.text.dark,
                textAlign: 'center'
              }}>
                Всего чисел: {numbers.length}
              </div>
            </div>
          )}

          {/* ИСТОРИЯ */}
          {history.length > 1 && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: COLORS.background,
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.muted }}>
                Последние генерации:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.slice(1).map((gen, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '13px',
                      color: COLORS.text.dark,
                      padding: '6px 10px',
                      backgroundColor: COLORS.card,
                      borderRadius: '4px'
                    }}
                  >
                    {gen.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ПОДСКАЗКА */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${COLORS.border}`,
          fontSize: '13px',
          color: COLORS.text.muted
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>🎲</span>
            <span style={{ fontWeight: 'bold', color: COLORS.primary }}>Для чего нужен:</span>
          </div>
          <p style={{ marginBottom: '6px' }}>• Розыгрыши и лотереи</p>
          <p style={{ marginBottom: '6px' }}>• Тестирование программ</p>
          <p style={{ marginBottom: '6px' }}>• Учебные задачи</p>
          <p style={{ marginBottom: '6px' }}>• Выбор случайных значений</p>
          <p style={{ marginTop: '8px', fontSize: '12px', color: COLORS.text.dark }}>
            Генератор использует криптографически безопасный алгоритм.
          </p>
        </div>
      </div>
    </div>
  );
}