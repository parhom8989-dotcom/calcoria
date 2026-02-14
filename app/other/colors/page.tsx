// app/other/color-palette/page.tsx
"use client";

import { useState, useCallback, useEffect } from 'react';

export default function ColorPalettePage() {
  // Состояния
  const [baseColor, setBaseColor] = useState<string>("#3b82f6");
  const [paletteType, setPaletteType] = useState<"monochrome" | "complementary" | "analogous" | "triadic" | "tetradic">("monochrome");
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Цветовая схема
  const COLORS = {
    primary: '#f97316', // оранжевый
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

  // Конвертер HEX в RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Конвертер RGB в HEX
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // HSV в RGB
  const hsvToRgb = (h: number, s: number, v: number) => {
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // RGB в HSV
  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    const s = max === 0 ? 0 : diff / max;
    const v = max;

    if (diff !== 0) {
      if (max === r) {
        h = (g - b) / diff + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / diff + 2;
      } else {
        h = (r - g) / diff + 4;
      }
      h /= 6;
    }

    return { h, s, v };
  };

  // Генерация палитры
  const generatePalette = useCallback(() => {
    const rgb = hexToRgb(baseColor);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    
    let colors: string[] = [];

    switch (paletteType) {
  case "monochrome": {
    // Монохромная - разные оттенки
    for (let i = 0; i < 5; i++) {
      const newV = Math.min(1, Math.max(0.2, hsv.v * (0.5 + i * 0.25)));
      const newRgb = hsvToRgb(hsv.h, hsv.s, newV);
      colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    break;
  }

  case "complementary": {
    // Комплементарная + оттенки
    const compH = (hsv.h + 0.5) % 1;
    
    colors.push(baseColor); // основной
    colors.push(rgbToHex(
      hsvToRgb(compH, hsv.s, hsv.v).r,
      hsvToRgb(compH, hsv.s, hsv.v).g,
      hsvToRgb(compH, hsv.s, hsv.v).b
    )); // комплементарный
    
    // Добавляем светлые варианты
    colors.push(rgbToHex(
      hsvToRgb(hsv.h, hsv.s * 0.6, hsv.v).r,
      hsvToRgb(hsv.h, hsv.s * 0.6, hsv.v).g,
      hsvToRgb(hsv.h, hsv.s * 0.6, hsv.v).b
    ));
    colors.push(rgbToHex(
      hsvToRgb(compH, hsv.s * 0.6, hsv.v).r,
      hsvToRgb(compH, hsv.s * 0.6, hsv.v).g,
      hsvToRgb(compH, hsv.s * 0.6, hsv.v).b
    ));
    
    // Добавляем нейтральный
    colors.push("#ffffff");
    break;
  }

  case "analogous": {
    // Аналоговая (соседние цвета)
    for (let i = -2; i <= 2; i++) {
      const newH = (hsv.h + i * 0.08 + 1) % 1;
      const newRgb = hsvToRgb(newH, hsv.s, hsv.v);
      colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    break;
  }

  case "triadic": {
    // Триада (120 градусов)
    for (let i = 0; i < 3; i++) {
      const newH = (hsv.h + i * 0.333 + 1) % 1;
      const newRgb = hsvToRgb(newH, hsv.s, hsv.v);
      colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    break;
  }

  case "tetradic": {
    // Тетрада (прямоугольник)
    const h1 = hsv.h;
    const h2 = (hsv.h + 0.25) % 1;
    const h3 = (hsv.h + 0.5) % 1;
    const h4 = (hsv.h + 0.75) % 1;

    [h1, h2, h3, h4].forEach(h => {
      const newRgb = hsvToRgb(h, hsv.s, hsv.v);
      colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    });
    break;
  }
}

    // Обрезаем до 5 цветов и удаляем дубликаты
    colors = [...new Set(colors)].slice(0, 5);
    
    // Дополняем если меньше 5
    while (colors.length < 5) {
      colors.push("#ffffff");
    }

    setPalette(colors);
  }, [baseColor, paletteType]);

  // Генерация случайного цвета
  const randomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBaseColor(randomHex);
  };

  // Копирование цвета
  const copyColor = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Генерация при изменении
  useEffect(() => {
    generatePalette();
  }, [baseColor, paletteType, generatePalette]);

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
            <span style={{ fontSize: '32px' }}>🎨</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Генератор цветовых палитр
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Создание гармоничных цветовых сочетаний
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
                setBaseColor("#3b82f6");
                setPaletteType("monochrome");
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

          {/* ВЫБОР ЦВЕТА */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Базовый цвет
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    style={{
                      width: '60px',
                      height: '45px',
                      padding: '4px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid ${COLORS.border}`,
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid ${COLORS.border}`,
                      color: 'white',
                      fontSize: '14px',
                      fontFamily: 'monospace'
                    }}
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
              <button
                onClick={randomColor}
                style={{
                  padding: '12px 16px',
                  backgroundColor: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  color: COLORS.primary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: '20px'
                }}
              >
                🎲 Случайный
              </button>
            </div>

            {/* ТИП ПАЛИТРЫ */}
            <div>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                Тип палитры
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '8px'
              }}>
                <button
                  onClick={() => setPaletteType("monochrome")}
                  style={{
                    padding: '10px',
                    backgroundColor: paletteType === "monochrome" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${paletteType === "monochrome" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '6px',
                    color: paletteType === "monochrome" ? 'white' : COLORS.text.main,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🌑 Монохромная
                </button>
                <button
                  onClick={() => setPaletteType("complementary")}
                  style={{
                    padding: '10px',
                    backgroundColor: paletteType === "complementary" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${paletteType === "complementary" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '6px',
                    color: paletteType === "complementary" ? 'white' : COLORS.text.main,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🔄 Комплемен-ная
                </button>
                <button
                  onClick={() => setPaletteType("analogous")}
                  style={{
                    padding: '10px',
                    backgroundColor: paletteType === "analogous" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${paletteType === "analogous" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '6px',
                    color: paletteType === "analogous" ? 'white' : COLORS.text.main,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🌈 Аналоговая
                </button>
                <button
                  onClick={() => setPaletteType("triadic")}
                  style={{
                    padding: '10px',
                    backgroundColor: paletteType === "triadic" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${paletteType === "triadic" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '6px',
                    color: paletteType === "triadic" ? 'white' : COLORS.text.main,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🔺 Триада
                </button>
                <button
                  onClick={() => setPaletteType("tetradic")}
                  style={{
                    padding: '10px',
                    backgroundColor: paletteType === "tetradic" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${paletteType === "tetradic" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '6px',
                    color: paletteType === "tetradic" ? 'white' : COLORS.text.main,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🔲 Тетрада
                </button>
              </div>
            </div>
          </div>

          {/* ПАЛИТРА */}
          {palette.length > 0 && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: COLORS.primary, textAlign: 'center' }}>
                Сгенерированная палитра
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px'
              }}>
                {palette.map((color, index) => {
                  const rgb = hexToRgb(color);
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: COLORS.card,
                        padding: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => copyColor(color, index)}
                    >
                      <div style={{
                        width: '60px',
                        height: '40px',
                        backgroundColor: color,
                        borderRadius: '6px',
                        border: `2px solid ${index === 0 ? COLORS.primary : COLORS.border}`
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px'
                        }}>
                          <span style={{
                            fontWeight: index === 0 ? 'bold' : 'normal',
                            color: index === 0 ? COLORS.primary : COLORS.text.main
                          }}>
                            {index === 0 ? '🎨 Базовый' : `Цвет ${index + 1}`}
                          </span>
                          <span style={{
                            fontFamily: 'monospace',
                            color: COLORS.text.muted,
                            fontSize: '14px'
                          }}>
                            {color.toUpperCase()}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          fontSize: '12px',
                          color: COLORS.text.dark
                        }}>
                          <span>R: {rgb.r}</span>
                          <span>G: {rgb.g}</span>
                          <span>B: {rgb.b}</span>
                        </div>
                      </div>
                      {copiedIndex === index && (
                        <div style={{
                          position: 'absolute',
                          right: '20px',
                          backgroundColor: COLORS.primary,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          ✓ Скопировано
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(palette.join(', '));
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: COLORS.background,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    color: COLORS.text.main,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  📋 Скопировать все
                </button>
                <button
                  onClick={generatePalette}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: COLORS.background,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    color: COLORS.primary,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🔄 Сгенерировать заново
                </button>
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
            🎨 Что такое цветовая палитра?
          </h2>
          
          <p style={{ color: COLORS.text.main, fontSize: '15px', marginBottom: '16px' }}>
            Цветовая палитра — это набор гармонично сочетающихся цветов, 
            используемых в дизайне, искусстве и веб-разработке. Правильно подобранная 
            палитра создаёт целостное восприятие и нужное настроение.
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            🎯 Типы цветовых сочетаний
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                🌑 Монохромная
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Один цвет в разных оттенках (светлее/темнее). Создаёт спокойный, элегантный образ.
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                🔄 Комплементарная
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Цвета напротив друг друга в цветовом круге. Максимальный контраст, яркие акценты.
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                🌈 Аналоговая
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Соседние цвета в цветовом круге. Мягкие, гармоничные переходы.
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                🔺 Триада
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Три цвета на равном расстоянии (120°). Сбалансированное, живое сочетание.
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                🔲 Тетрада
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Четыре цвета (прямоугольник 60°-120°). Богатая палитра для сложных дизайнов.
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            💡 Где применять?
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
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🖥️</div>
              <div style={{ fontSize: '13px', color: COLORS.text.muted }}>
                Веб-дизайн
              </div>
            </div>
            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎨</div>
              <div style={{ fontSize: '13px', color: COLORS.text.muted }}>
                Графический дизайн
              </div>
            </div>
            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🖼️</div>
              <div style={{ fontSize: '13px', color: COLORS.text.muted }}>
                Интерьер
              </div>
            </div>
            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>👕</div>
              <div style={{ fontSize: '13px', color: COLORS.text.muted }}>
                Мода
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Совет:</strong> В дизайне используйте правило 60-30-10: 
              60% — основной цвет, 30% — дополнительный, 10% — акцентный. Это создаёт 
              сбалансированную и профессиональную цветовую схему.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}