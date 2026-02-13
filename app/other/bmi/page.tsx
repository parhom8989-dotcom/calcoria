// app/imt/kalkulyator-imt/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function KalkulyatorIMTPage() {
  // Состояния для расчёта
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [age, setAge] = useState<string>("30");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [imt, setImt] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [idealWeight, setIdealWeight] = useState<{ min: number; max: number } | null>(null);
  const [riskLevel, setRiskLevel] = useState<string>("");
  const [bmr, setBmr] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);

  // Цветовая схема #3b82f6 (синий) - для ИМТ выбран синий
  const COLORS = {
    primary: '#10b981',
    primaryHover: '#10b981',
    secondary: '#10b981',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#10b981',
      to: '#60a5fa'
    },
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  // Категории ИМТ
  const imtCategories = [
    { min: 0, max: 16, category: "Выраженный дефицит массы", color: COLORS.danger, risk: "Высокий риск заболеваний" },
    { min: 16, max: 18.5, category: "Недостаточная масса", color: COLORS.warning, risk: "Повышенный риск" },
    { min: 18.5, max: 25, category: "Норма", color: COLORS.success, risk: "Низкий риск" },
    { min: 25, max: 30, category: "Избыточная масса", color: COLORS.warning, risk: "Повышенный риск" },
    { min: 30, max: 35, category: "Ожирение I степени", color: COLORS.danger, risk: "Высокий риск" },
    { min: 35, max: 40, category: "Ожирение II степени", color: COLORS.danger, risk: "Очень высокий риск" },
    { min: 40, max: 100, category: "Ожирение III степени", color: COLORS.danger, risk: "Крайне высокий риск" }
  ];

  // Расчёт ИМТ
  const calculateIMT = useCallback(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    const a = parseFloat(age) || 0;

    if (w > 0 && h > 0) {
      // ИМТ = вес (кг) / рост (м)²
      const heightInMeters = h / 100;
      const imtValue = w / (heightInMeters * heightInMeters);
      setImt(imtValue);

      // Определяем категорию
      const foundCategory = imtCategories.find(cat => imtValue >= cat.min && imtValue < cat.max);
      setCategory(foundCategory?.category || "Не определено");
      setRiskLevel(foundCategory?.risk || "");

      // Идеальный вес (по формуле Брока)
      // Для мужчин: рост - 100, для женщин: рост - 110
      let idealMin = 0, idealMax = 0;
      if (gender === "male") {
        idealMin = (h - 110) * 0.9;
        idealMax = (h - 100) * 1.1;
      } else {
        idealMin = (h - 115) * 0.9;
        idealMax = (h - 105) * 1.1;
      }
      setIdealWeight({ min: Math.round(idealMin), max: Math.round(idealMax) });

      // Расчёт BMR (базовый метаболизм) по формуле Миффлина-Сан Жеора
      if (a > 0) {
        let bmrValue = 0;
        if (gender === "male") {
          bmrValue = 10 * w + 6.25 * h - 5 * a + 5;
        } else {
          bmrValue = 10 * w + 6.25 * h - 5 * a - 161;
        }
        setBmr(Math.round(bmrValue));
        
        // Расчёт калорий для поддержания веса (средняя активность)
        setCalories(Math.round(bmrValue * 1.55));
      }
    } else {
      setImt(null);
      setCategory("");
      setRiskLevel("");
      setIdealWeight(null);
      setBmr(null);
      setCalories(null);
    }
  }, [weight, height, age, gender]);

  // Автоматический пересчёт
  useEffect(() => {
    calculateIMT();
  }, [calculateIMT]);

  // Сброс значений
  const resetCalculator = () => {
    setWeight("70");
    setHeight("175");
    setAge("30");
    setGender("male");
  };

  // Получить цвет категории
  const getCategoryColor = () => {
    if (!imt) return COLORS.text.muted;
    const foundCategory = imtCategories.find(cat => imt >= cat.min && imt < cat.max);
    return foundCategory?.color || COLORS.text.muted;
  };

  // Форматирование чисел
  const formatNumber = (num: number, decimals: number = 1) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
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
              <span style={{ fontSize: '32px' }}>🏋️</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Калькулятор ИМТ
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              Индекс массы тела • Идеальный вес • Метаболизм
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

          {/* ПОЛЯ ВВОДА */}
          <div style={{ marginBottom: '24px' }}>
            {/* Пол */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                Пол
              </label>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setGender("male")}
                  style={{
                    flex: '1 1 150px',
                    padding: '12px',
                    backgroundColor: gender === "male" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${gender === "male" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '8px',
                    color: gender === "male" ? 'white' : COLORS.text.main,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>👨</span> Мужской
                </button>
                <button
                  onClick={() => setGender("female")}
                  style={{
                    flex: '1 1 150px',
                    padding: '12px',
                    backgroundColor: gender === "female" ? COLORS.primary : COLORS.border,
                    border: `1px solid ${gender === "female" ? COLORS.primary : COLORS.border}`,
                    borderRadius: '8px',
                    color: gender === "female" ? 'white' : COLORS.text.main,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>👩</span> Женский
                </button>
              </div>
            </div>

            {/* Возраст */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                Возраст (лет)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid #475569`,
                  color: 'white',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Например: 30"
                min="1"
                max="120"
              />
            </div>

            {/* Рост и вес в одной сетке */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                  Рост (см)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: 'white',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Например: 175"
                  min="50"
                  max="250"
                />
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '8px',
                  flexWrap: 'wrap'
                }}>
                  {[150, 160, 170, 175, 180, 190].map(val => (
                    <button
                      key={val}
                      onClick={() => setHeight(val.toString())}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '4px',
                        color: COLORS.text.muted,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                  Вес (кг)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: 'white',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Например: 70"
                  min="20"
                  max="300"
                />
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '8px',
                  flexWrap: 'wrap'
                }}>
                  {[50, 60, 70, 80, 90, 100].map(val => (
                    <button
                      key={val}
                      onClick={() => setWeight(val.toString())}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '4px',
                        color: COLORS.text.muted,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* РЕЗУЛЬТАТЫ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px',
            background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
          }}>
            {imt !== null ? (
              <>
                {/* ИМТ */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px' }}>
                    Ваш индекс массы тела (ИМТ)
                  </div>
                  <div style={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold',
                    color: getCategoryColor()
                  }}>
                    {formatNumber(imt, 1)}
                  </div>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    color: getCategoryColor(),
                    marginTop: '8px'
                  }}>
                    {category}
                  </div>
                  {riskLevel && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: COLORS.text.muted,
                      marginTop: '8px'
                    }}>
                      {riskLevel}
                    </div>
                  )}
                </div>

                {/* Идеальный вес */}
                {idealWeight && (
                  <div style={{
                    paddingTop: '16px',
                    borderTop: `1px solid ${COLORS.border}`,
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px', textAlign: 'center' }}>
                      Идеальный вес для вашего роста
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '12px'
                    }}>
                      <div style={{
                        backgroundColor: COLORS.card,
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Минимум</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.success }}>
                          {idealWeight.min} кг
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: COLORS.card,
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Максимум</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.success }}>
                          {idealWeight.max} кг
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Метаболизм */}
                {bmr && calories && (
                  <div style={{
                    paddingTop: '16px',
                    borderTop: `1px solid ${COLORS.border}`
                  }}>
                    <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px', textAlign: 'center' }}>
                      Ваш метаболизм
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '12px'
                    }}>
                      <div style={{
                        backgroundColor: COLORS.card,
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '12px', color: COLORS.text.muted }}>BMR (покой)</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.primary }}>
                          {bmr} ккал
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: COLORS.card,
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Для поддержания</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.primary }}>
                          {calories} ккал
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ color: COLORS.text.muted }}>Введите рост и вес для расчёта</div>
              </div>
            )}
          </div>

          {/* ИНФОРМАЦИЯ О КАТЕГОРИЯХ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '16px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px'
          }}>
            <div style={{ 
              color: COLORS.primary, 
              fontSize: '15px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📊</span> Категории ИМТ
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '8px'
            }}>
              {imtCategories.map((cat, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px',
                    backgroundColor: COLORS.card,
                    border: `1px solid ${cat.color}`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ color: cat.color, fontWeight: 'bold' }}>
                    {cat.min} - {cat.max}
                  </span>
                  <div style={{ color: COLORS.text.muted, fontSize: '11px', marginTop: '2px' }}>
                    {cat.category}
                  </div>
                </div>
              ))}
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
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '28px' }}>📋</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Что такое индекс массы тела?
            </span>
          </h2>
          
          <p style={{ color: COLORS.text.main, marginBottom: '16px', fontSize: '15px' }}>
            Индекс массы тела (ИМТ) — это величина, позволяющая оценить степень соответствия 
            массы человека и его роста. ИМТ рассчитывается по формуле: <strong>вес (кг) / рост² (м²)</strong>.
          </p>
          
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
                ⚖️ Идеальный вес
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p>• Для мужчин: рост - 100 (±10%)</p>
                <p>• Для женщин: рост - 110 (±10%)</p>
                <p>• Формула Брока с учётом телосложения</p>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🔥 Метаболизм (BMR)
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p>• Формула Миффлина-Сан Жеора</p>
                <p>• Учитывает возраст, вес, рост, пол</p>
                <p>• Базовый расход калорий в покое</p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                ⚠️ Риски для здоровья
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p>• ИМТ &lt; 18.5: дефицит массы</p>
                <p>• ИМТ 25-30: избыточный вес</p>
                <p>• ИМТ &gt; 30: ожирение (риск заболеваний)</p>
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(59, 130, 246, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Важно:</strong> ИМТ не учитывает соотношение мышц и жира. 
              У спортсменов с развитой мускулатурой ИМТ может быть выше нормы. 
              Для точной оценки состава тела рекомендуется биоимпедансный анализ.
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
            Калькулятор ИМТ • Формула ВОЗ • Метаболизм по Миффлину-Сан Жеору • {new Date().getFullYear()} год
          </p>
        </div>
      </div>
    </div>
  );
}