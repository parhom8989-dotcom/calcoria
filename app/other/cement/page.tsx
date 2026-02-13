// app/other/cement/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function CementCalculatorPage() {
  // Состояния калькулятора
  const [length, setLength] = useState<string>("4");
  const [width, setWidth] = useState<string>("3");
  const [thickness, setThickness] = useState<string>("5");
  const [bagWeight, setBagWeight] = useState<string>("25");
  const [result, setResult] = useState<{
    volume: number;
    dryMix: number;
    bags: number;
    price: number;
  } | null>(null);

  // Цена за мешок (можно сделать редактируемой позже)
  const [pricePerBag, setPricePerBag] = useState<number>(250);

  // Цветовая схема в стиле главной страницы
  const COLORS = {
    primary: '#f97316', // оранжевый как в карточке теплотехники
    primaryHover: '#ea580c',
    secondary: '#fb923c',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    }
  };

  // Расчёт стяжки
  const calculate = useCallback(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(thickness) || 0;
    const bag = parseFloat(bagWeight) || 25;

    if (l > 0 && w > 0 && h > 0) {
      // Объём стяжки в м³
      const volume = (l * w * (h / 100));
      
      // Расход сухой смеси (примерно 1.8 т/м³ для стяжки)
      const dryMix = volume * 1800; // в кг
      
      // Количество мешков
      const bags = Math.ceil(dryMix / bag);
      
      // Примерная стоимость
      const price = bags * pricePerBag;

      setResult({
        volume: parseFloat(volume.toFixed(2)),
        dryMix: parseFloat(dryMix.toFixed(0)),
        bags,
        price
      });
    } else {
      setResult(null);
    }
  }, [length, width, thickness, bagWeight, pricePerBag]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс
  const resetCalculator = () => {
    setLength("4");
    setWidth("3");
    setThickness("5");
    setBagWeight("25");
    setPricePerBag(250);
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
            <span style={{ fontSize: '32px' }}>🏗️</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Расход цемента на стяжку
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Калькулятор мешков для полусухой стяжки пола
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
            {/* Размеры комнаты */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Длина (м)
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="0.1"
                  min="0"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Ширина (м)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="0.1"
                  min="0"
                />
              </div>
            </div>

            {/* Толщина и вес мешка */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Толщина стяжки (см)
                </label>
                <input
                  type="number"
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="0.5"
                  min="0"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Вес мешка (кг)
                </label>
                <input
                  type="number"
                  value={bagWeight}
                  onChange={(e) => setBagWeight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="5"
                  min="0"
                />
              </div>
            </div>

            {/* Быстрые кнопки */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginTop: '8px'
            }}>
              {[3, 4, 5, 6, 7, 8].map(val => (
                <button
                  key={val}
                  onClick={() => setThickness(val.toString())}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: COLORS.background,
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: '6px',
                    color: COLORS.primary,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {val} см
                </button>
              ))}
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
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: COLORS.primary, textAlign: 'center' }}>
                Результат расчёта
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Объём стяжки</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.main }}>
                    {result.volume} м³
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Сухой смеси</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.main }}>
                    {result.dryMix} кг
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: COLORS.card,
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px' }}>
                  Требуется мешков
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.primary }}>
                  {result.bags}
                </div>
                <div style={{ fontSize: '12px', color: COLORS.text.muted }}>
                  по {bagWeight} кг
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: COLORS.border,
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                <span style={{ color: COLORS.text.muted }}>Примерная стоимость:</span>
                <span style={{ fontWeight: 'bold', color: COLORS.primary }}>
                  {result.price.toLocaleString()} ₽
                </span>
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
            <span style={{ fontSize: '18px' }}>💡</span>
            <span style={{ fontWeight: 'bold', color: COLORS.primary }}>Как рассчитать:</span>
          </div>
          <p style={{ marginBottom: '8px' }}>
            • Объём = Длина × Ширина × Толщина (в метрах)<br/>
            • Расход смеси ≈ 1800 кг на 1 м³ стяжки<br/>
            • Количество мешков = (Объём × 1800) ÷ Вес мешка
          </p>
          <p style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '8px' }}>
            Расчёт примерный. Для точного расчёта учитывайте марку смеси и потери.
          </p>
        </div>
      </div>
    </div>
  );
}