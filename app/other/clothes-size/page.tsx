// app/other/clothes-size/page.tsx
"use client";

import { useState, useCallback } from 'react';

export default function ClothesSizePage() {
  // Состояния калькулятора
  const [sizeType, setSizeType] = useState<"ru" | "eu" | "us" | "int">("ru");
  const [sizeValue, setSizeValue] = useState<string>("46");
  const [convertedSizes, setConvertedSizes] = useState<{
    ru: number | string;
    eu: number | string;
    us: number | string;
    int: string;
    uk?: number | string;
  } | null>(null);
  
  const [gender, setGender] = useState<"male" | "female" | "unisex">("male");
  const [clothingType, setClothingType] = useState<"top" | "bottom" | "dress">("top");

  // Цветовая схема
  const COLORS = {
    primary: '#8b5cf6', // фиолетовый
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
    success: '#10b981'
  };

  // Таблицы размеров
  const sizeTables = {
    male: {
      top: {
        ru: [44, 46, 48, 50, 52, 54, 56, 58],
        eu: [44, 46, 48, 50, 52, 54, 56, 58],
        us: [34, 36, 38, 40, 42, 44, 46, 48],
        int: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"]
      },
      bottom: {
        ru: [44, 46, 48, 50, 52, 54, 56, 58],
        eu: [44, 46, 48, 50, 52, 54, 56, 58],
        us: [28, 30, 32, 34, 36, 38, 40, 42],
        int: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"]
      }
    },
    female: {
      top: {
        ru: [40, 42, 44, 46, 48, 50, 52, 54],
        eu: [34, 36, 38, 40, 42, 44, 46, 48],
        us: [4, 6, 8, 10, 12, 14, 16, 18],
        int: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"]
      },
      bottom: {
        ru: [40, 42, 44, 46, 48, 50, 52, 54],
        eu: [34, 36, 38, 40, 42, 44, 46, 48],
        us: [2, 4, 6, 8, 10, 12, 14, 16],
        int: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"]
      },
      dress: {
        ru: [40, 42, 44, 46, 48, 50, 52, 54],
        eu: [34, 36, 38, 40, 42, 44, 46, 48],
        us: [4, 6, 8, 10, 12, 14, 16, 18],
        int: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"]
      }
    }
  };

  // Функция конвертации
  const convertSize = useCallback(() => {
    const value = parseFloat(sizeValue);
    if (isNaN(value) && sizeType !== "int") {
      setConvertedSizes(null);
      return;
    }

    // Выбираем таблицу
    const table = gender === "male" 
      ? sizeTables.male[clothingType as "top" | "bottom"] 
      : sizeTables.female[clothingType as "top" | "bottom" | "dress"];

    if (!table) return;

    // Поиск индекса размера
    let index = -1;
    
    if (sizeType === "int") {
      index = table.int.indexOf(sizeValue);
    } else {
      const arr = table[sizeType as keyof typeof table] as number[];
      index = arr.indexOf(value);
    }

    if (index === -1) {
      setConvertedSizes({
        ru: "—",
        eu: "—",
        us: "—",
        int: "—"
      });
      return;
    }

    // Получаем все размеры
    setConvertedSizes({
      ru: table.ru[index],
      eu: table.eu[index],
      us: table.us[index],
      int: table.int[index]
    });

  }, [sizeType, sizeValue, gender, clothingType]);

  // Сброс
  const resetCalculator = () => {
    setSizeType("ru");
    setSizeValue("46");
    setGender("male");
    setClothingType("top");
    setConvertedSizes(null);
  };

  // Быстрые примеры
  const setExample = (ru: number, gender: "male" | "female", type: "top" | "bottom" | "dress") => {
    setSizeType("ru");
    setSizeValue(ru.toString());
    setGender(gender);
    setClothingType(type);
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
            <span style={{ fontSize: '32px' }}>👕</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Конвертер размеров одежды
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Перевод размеров между системами EU/US/RU
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
            {/* Пол */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                Пол
              </label>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => setGender("male")}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: gender === "male" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${gender === "male" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '6px',
                    color: gender === "male" ? 'white' : COLORS.text.main,
                    cursor: 'pointer'
                  }}
                >
                  👨 Мужской
                </button>
                <button
                  onClick={() => setGender("female")}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: gender === "female" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${gender === "female" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '6px',
                    color: gender === "female" ? 'white' : COLORS.text.main,
                    cursor: 'pointer'
                  }}
                >
                  👩 Женский
                </button>
                <button
                  onClick={() => setGender("unisex")}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: gender === "unisex" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${gender === "unisex" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '6px',
                    color: gender === "unisex" ? 'white' : COLORS.text.main,
                    cursor: 'pointer'
                  }}
                >
                  👤 Унисекс
                </button>
              </div>
            </div>

            {/* Тип одежды */}
            {gender !== "unisex" && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Тип одежды
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => setClothingType("top")}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: clothingType === "top" ? COLORS.primary : COLORS.border,
                      border: `1px solid ${clothingType === "top" ? COLORS.primary : COLORS.border}`,
                      borderRadius: '6px',
                      color: clothingType === "top" ? 'white' : COLORS.text.main,
                      cursor: 'pointer'
                    }}
                  >
                    👕 Верх
                  </button>
                  <button
                    onClick={() => setClothingType("bottom")}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: clothingType === "bottom" ? COLORS.primary : COLORS.border,
                      border: `1px solid ${clothingType === "bottom" ? COLORS.primary : COLORS.border}`,
                      borderRadius: '6px',
                      color: clothingType === "bottom" ? 'white' : COLORS.text.main,
                      cursor: 'pointer'
                    }}
                  >
                    👖 Низ
                  </button>
                  {gender === "female" && (
                    <button
                      onClick={() => setClothingType("dress")}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: clothingType === "dress" ? COLORS.primary : COLORS.border,
                        border: `1px solid ${clothingType === "dress" ? COLORS.primary : COLORS.border}`,
                        borderRadius: '6px',
                        color: clothingType === "dress" ? 'white' : COLORS.text.main,
                        cursor: 'pointer'
                      }}
                    >
                      👗 Платья
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Система и размер */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Система
                </label>
                <select
                  value={sizeType}
                  onChange={(e) => setSizeType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ru">RU (Россия)</option>
                  <option value="eu">EU (Европа)</option>
                  <option value="us">US (США)</option>
                  <option value="int">INT (Международный)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Размер
                </label>
                {sizeType === "int" ? (
                  <select
                    value={sizeValue}
                    onChange={(e) => setSizeValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid ${COLORS.border}`,
                      color: 'white',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                  </select>
                ) : (
                  <input
                    type="number"
                    value={sizeValue}
                    onChange={(e) => setSizeValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid ${COLORS.border}`,
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Кнопка конвертации */}
            <button
              onClick={convertSize}
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
              🔄 Конвертировать
            </button>

            {/* Быстрые примеры */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setExample(46, "male", "top")}
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
                👨‍🦰 Мужской 46
              </button>
              <button
                onClick={() => setExample(48, "male", "bottom")}
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
                👖 Джинсы 48
              </button>
              <button
                onClick={() => setExample(42, "female", "top")}
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
                👩‍🦰 Женский 42
              </button>
            </div>
          </div>

          {/* РЕЗУЛЬТАТ */}
          {convertedSizes && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: COLORS.primary, textAlign: 'center' }}>
                Соответствие размеров
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    🇷🇺 Россия (RU)
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.primary }}>
                    {convertedSizes.ru}
                  </div>
                </div>

                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    🇪🇺 Европа (EU)
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.secondary }}>
                    {convertedSizes.eu}
                  </div>
                </div>

                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    🇺🇸 США (US)
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.success }}>
                    {convertedSizes.us}
                  </div>
                </div>

                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    🌍 Международный
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.primaryHover }}>
                    {convertedSizes.int}
                  </div>
                </div>
              </div>

              {convertedSizes.ru === "—" && (
                <p style={{
                  color: COLORS.text.dark,
                  fontSize: '13px',
                  textAlign: 'center',
                  marginTop: '16px'
                }}>
                  Размер не найден в таблице соответствий
                </p>
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
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: COLORS.primary
          }}>
            📏 Как перевести размер одежды?
          </h2>
          
          <p style={{ color: COLORS.text.main, fontSize: '15px', marginBottom: '16px' }}>
            Конвертер размеров одежды помогает быстро перевести размер между разными системами: 
            российской (RU), европейской (EU), американской (US) и международной (XS, S, M, L, XL).
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            📊 Таблица соответствия размеров
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
                  <th style={{ padding: '8px', color: COLORS.primary, borderBottom: `1px solid ${COLORS.border}` }}>RU</th>
                  <th style={{ padding: '8px', color: COLORS.primary, borderBottom: `1px solid ${COLORS.border}` }}>EU</th>
                  <th style={{ padding: '8px', color: COLORS.primary, borderBottom: `1px solid ${COLORS.border}` }}>US</th>
                  <th style={{ padding: '8px', color: COLORS.primary, borderBottom: `1px solid ${COLORS.border}` }}>INT</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '6px', textAlign: 'center' }}>40</td><td style={{ padding: '6px', textAlign: 'center' }}>34</td><td style={{ padding: '6px', textAlign: 'center' }}>4</td><td style={{ padding: '6px', textAlign: 'center' }}>XS</td></tr>
                <tr><td style={{ padding: '6px', textAlign: 'center' }}>42</td><td style={{ padding: '6px', textAlign: 'center' }}>36</td><td style={{ padding: '6px', textAlign: 'center' }}>6</td><td style={{ padding: '6px', textAlign: 'center' }}>S</td></tr>
                <tr><td style={{ padding: '6px', textAlign: 'center' }}>44</td><td style={{ padding: '6px', textAlign: 'center' }}>38</td><td style={{ padding: '6px', textAlign: 'center' }}>8</td><td style={{ padding: '6px', textAlign: 'center' }}>M</td></tr>
                <tr><td style={{ padding: '6px', textAlign: 'center' }}>46</td><td style={{ padding: '6px', textAlign: 'center' }}>40</td><td style={{ padding: '6px', textAlign: 'center' }}>10</td><td style={{ padding: '6px', textAlign: 'center' }}>L</td></tr>
                <tr><td style={{ padding: '6px', textAlign: 'center' }}>48</td><td style={{ padding: '6px', textAlign: 'center' }}>42</td><td style={{ padding: '6px', textAlign: 'center' }}>12</td><td style={{ padding: '6px', textAlign: 'center' }}>XL</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            💡 Важные особенности
          </h3>

          <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Мужские размеры</strong> отличаются от женских — всегда выбирайте пол</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Верх и низ</strong> могут иметь разные размеры у одного человека</li>
            <li style={{ marginBottom: '8px' }}>• <strong>US размеры</strong> для мужчин и женщин отличаются (у женщин они меньше)</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Международные размеры</strong> (XS, S, M, L) очень приблизительны</li>
          </ul>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Совет:</strong> Размеры разных брендов могут отличаться. Всегда сверяйтесь с таблицей размеров конкретного производителя, особенно при заказе из других стран.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}