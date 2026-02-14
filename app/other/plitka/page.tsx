// app/other/tiles/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function TilesCalculatorPage() {
  // Состояния калькулятора
  const [roomLength, setRoomLength] = useState<string>("4");
  const [roomWidth, setRoomWidth] = useState<string>("3");
  const [tileLength, setTileLength] = useState<string>("40");
  const [tileWidth, setTileWidth] = useState<string>("40");
  const [pricePerPack, setPricePerPack] = useState<string>("1500");
  const [tilesInPack, setTilesInPack] = useState<string>("5");
  const [gap, setGap] = useState<string>("0.5");
  const [stockPercent, setStockPercent] = useState<number>(10);
  const [result, setResult] = useState<{
    roomArea: number;
    tileArea: number;
    tilesNeeded: number;
    packsNeeded: number;
    totalPrice: number;
    totalArea: number;
    wasteArea: number;
    tilesPerRow: number;
    rowsCount: number;
  } | null>(null);

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
    success: '#10b981',
    warning: '#f59e0b'
  };

  // Расчёт материалов
  const calculate = useCallback(() => {
    const rl = parseFloat(roomLength) || 0;
    const rw = parseFloat(roomWidth) || 0;
    const tl = parseFloat(tileLength) / 100 || 0; // переводим см в метры
    const tw = parseFloat(tileWidth) / 100 || 0;
    const g = parseFloat(gap) / 100 || 0; // зазор в метры
    const price = parseFloat(pricePerPack) || 0;
    const perPack = parseFloat(tilesInPack) || 1;

    if (rl > 0 && rw > 0 && tl > 0 && tw > 0) {
      // Площадь комнаты
      const roomArea = rl * rw;
      
      // Площадь одной плитки с учётом зазора
      const tileArea = (tl + g) * (tw + g);
      
      // Количество плиток без запаса
      let tilesNeeded = Math.ceil(rl / (tl + g)) * Math.ceil(rw / (tw + g));
      
      // Количество плиток с запасом
      const tilesWithStock = Math.ceil(tilesNeeded * (1 + stockPercent / 100));
      
      // Количество упаковок
      const packsNeeded = Math.ceil(tilesWithStock / perPack);
      
      // Общая стоимость
      const totalPrice = packsNeeded * price;
      
      // Общая площадь материала
      const totalArea = packsNeeded * perPack * tileArea;
      
      // Площадь отходов
      const wasteArea = totalArea - roomArea;
      
      // Количество в ряду и рядов
      const tilesPerRow = Math.ceil(rl / (tl + g));
      const rowsCount = Math.ceil(rw / (tw + g));

      setResult({
        roomArea: parseFloat(roomArea.toFixed(2)),
        tileArea: parseFloat(tileArea.toFixed(3)),
        tilesNeeded: tilesWithStock,
        packsNeeded,
        totalPrice,
        totalArea: parseFloat(totalArea.toFixed(2)),
        wasteArea: parseFloat(wasteArea.toFixed(2)),
        tilesPerRow,
        rowsCount
      });
    } else {
      setResult(null);
    }
  }, [roomLength, roomWidth, tileLength, tileWidth, pricePerPack, tilesInPack, gap, stockPercent]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const resetCalculator = () => {
    setRoomLength("4");
    setRoomWidth("3");
    setTileLength("40");
    setTileWidth("40");
    setPricePerPack("1500");
    setTilesInPack("5");
    setGap("0.5");
    setStockPercent(10);
  };

  // Форматирование чисел
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
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
            <span style={{ fontSize: '32px' }}>🔲</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Расчёт плитки и ламината
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Калькулятор материалов для пола
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
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.primary }}>
              📐 Размеры комнаты
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Длина (м)
                </label>
                <input
                  type="number"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
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
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
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

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.primary }}>
              🔲 Размеры материала
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Длина плитки (см)
                </label>
                <input
                  type="number"
                  value={tileLength}
                  onChange={(e) => setTileLength(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="1"
                  min="0"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Ширина плитки (см)
                </label>
                <input
                  type="number"
                  value={tileWidth}
                  onChange={(e) => setTileWidth(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="1"
                  min="0"
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Зазор между плитками (мм)
                </label>
                <input
                  type="number"
                  value={gap}
                  onChange={(e) => setGap(e.target.value)}
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
                  Запас на подрезку (%)
                </label>
                <input
                  type="number"
                  value={stockPercent}
                  onChange={(e) => setStockPercent(parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="1"
                  min="0"
                  max="30"
                />
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.primary }}>
              💰 Стоимость
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Цена за упаковку (₽)
                </label>
                <input
                  type="number"
                  value={pricePerPack}
                  onChange={(e) => setPricePerPack(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="100"
                  min="0"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Штук в упаковке
                </label>
                <input
                  type="number"
                  value={tilesInPack}
                  onChange={(e) => setTilesInPack(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="1"
                  min="1"
                />
              </div>
            </div>

            {/* Быстрые кнопки */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '16px'
            }}>
              <button
                onClick={() => {
                  setTileLength("30");
                  setTileWidth("30");
                }}
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
                30×30 см
              </button>
              <button
                onClick={() => {
                  setTileLength("40");
                  setTileWidth("40");
                }}
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
                40×40 см
              </button>
              <button
                onClick={() => {
                  setTileLength("60");
                  setTileWidth("60");
                }}
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
                60×60 см
              </button>
              <button
                onClick={() => {
                  setTileLength("120");
                  setTileWidth("20");
                }}
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
                Ламинат 120×20
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
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: COLORS.primary, textAlign: 'center' }}>
                Результат расчёта
              </h3>

              {/* Основные показатели */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    Площадь комнаты
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.primary }}>
                    {result.roomArea} м²
                  </div>
                </div>

                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    Плиток с запасом
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.success }}>
                    {result.tilesNeeded} шт
                  </div>
                </div>
              </div>

              {/* Количество упаковок и цена */}
              <div style={{
                backgroundColor: COLORS.card,
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '8px' }}>
                  Потребуется упаковок
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.primary }}>
                  {result.packsNeeded}
                </div>
                <div style={{ fontSize: '14px', color: COLORS.success, marginTop: '4px' }}>
                  {formatCurrency(result.totalPrice)}
                </div>
              </div>

              {/* Детализация */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '13px'
              }}>
                <div style={{ color: COLORS.text.muted }}>Плиток в ряду:</div>
                <div style={{ color: COLORS.text.main, textAlign: 'right' }}>{result.tilesPerRow} шт</div>
                
                <div style={{ color: COLORS.text.muted }}>Рядов:</div>
                <div style={{ color: COLORS.text.main, textAlign: 'right' }}>{result.rowsCount}</div>
                
                <div style={{ color: COLORS.text.muted }}>Площадь материала:</div>
                <div style={{ color: COLORS.text.main, textAlign: 'right' }}>{result.totalArea} м²</div>
                
                <div style={{ color: COLORS.text.muted }}>Отходы:</div>
                <div style={{ color: COLORS.warning, textAlign: 'right' }}>{result.wasteArea} м²</div>
              </div>

              {/* Прогресс-бар отходов */}
              <div style={{
                marginTop: '16px',
                padding: '8px',
                backgroundColor: COLORS.card,
                borderRadius: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: COLORS.text.muted }}>Полезная площадь</span>
                  <span style={{ fontSize: '11px', color: COLORS.text.muted }}>Отходы</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: COLORS.border,
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(result.roomArea / result.totalArea) * 100}%`,
                    height: '100%',
                    backgroundColor: COLORS.success,
                    borderRadius: '3px',
                    float: 'left'
                  }} />
                  <div style={{
                    width: `${(result.wasteArea / result.totalArea) * 100}%`,
                    height: '100%',
                    backgroundColor: COLORS.warning,
                    borderRadius: '3px',
                    float: 'left'
                  }} />
                </div>
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
            📏 Как рассчитать плитку или ламинат?
          </h2>
          
          <p style={{ color: COLORS.text.main, fontSize: '15px', marginBottom: '16px' }}>
            Калькулятор помогает точно рассчитать количество материалов для пола: 
            керамической плитки, керамогранита, ламината, паркетной доски или кварцвинила.
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            💡 Формула расчёта
          </h3>

          <div style={{
            backgroundColor: COLORS.background,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: COLORS.text.muted
          }}>
            <p>1. Площадь комнаты = длина × ширина</p>
            <p>2. Площадь плитки = (длина плитки + зазор) × (ширина плитки + зазор)</p>
            <p>3. Количество плиток = площадь комнаты / площадь плитки</p>
            <p>4. С запасом = количество × (1 + процент запаса / 100)</p>
            <p>5. Упаковок = количество плиток / штук в упаковке (округляем вверх)</p>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            💡 Рекомендации по запасу
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
              <div style={{ fontSize: '16px', marginBottom: '4px' }}>🧱</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Прямая укладка
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Запас 5-7% для плитки<br/>Запас 7-10% для ламината
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '16px', marginBottom: '4px' }}>📐</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                Диагональная
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Запас 10-15% для плитки<br/>Запас 12-15% для ламината
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            📊 Популярные форматы
          </h3>

          <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Плитка:</strong> 30×30 см, 40×40 см, 45×45 см, 60×60 см</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Керамогранит:</strong> 60×60 см, 80×80 см, 120×60 см</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Ламинат:</strong> 120×20 см, 138×19 см, 185×19 см</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Паркетная доска:</strong> 180×14 см, 210×15 см</li>
          </ul>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Совет:</strong> Всегда покупайте материал с запасом из одной партии (одинаковый тон). 
              При необходимости докупить тот же кафель позже — рискуете получить другую партию с отличающимся оттенком.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}