// app/other/transport-tax/page.tsx
"use client";

import { useState, useCallback, useEffect } from 'react';

export default function TransportTaxPage() {
  // Состояния калькулятора
  const [vehicleType, setVehicleType] = useState<"car" | "motorcycle" | "truck" | "bus">("car");
  const [power, setPower] = useState<string>("150");
  const [region, setRegion] = useState<string>("moscow");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [months, setMonths] = useState<number>(12);
  const [price, setPrice] = useState<string>("");
  const [taxAmount, setTaxAmount] = useState<number | null>(null);
  const [advanceAmount, setAdvanceAmount] = useState<number | null>(null);
  const [totalWithCoeff, setTotalWithCoeff] = useState<number | null>(null);
  const [luxurySurcharge, setLuxurySurcharge] = useState<number | null>(null);
  const [taxRate, setTaxRate] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  // Цветовая схема #06b6d4 (голубой)
  const COLORS = {
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    secondary: '#22d3ee',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#06b6d4',
      to: '#22d3ee'
    },
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  // Базовые ставки транспортного налога (НК РФ ст. 361) [citation:7]
  const BASE_RATES = {
    car: [
      { min: 0, max: 100, rate: 2.5 },
      { min: 100, max: 150, rate: 3.5 },
      { min: 150, max: 200, rate: 5 },
      { min: 200, max: 250, rate: 7.5 },
      { min: 250, max: Infinity, rate: 15 }
    ],
    motorcycle: [
      { min: 0, max: 20, rate: 1 },
      { min: 20, max: 35, rate: 2 },
      { min: 35, max: Infinity, rate: 5 }
    ],
    truck: [
      { min: 0, max: 100, rate: 2.5 },
      { min: 100, max: 150, rate: 4 },
      { min: 150, max: 200, rate: 5 },
      { min: 200, max: 250, rate: 6.5 },
      { min: 250, max: Infinity, rate: 8.5 }
    ],
    bus: [
      { min: 0, max: 200, rate: 5 },
      { min: 200, max: Infinity, rate: 10 }
    ]
  };

  // Региональные коэффициенты (примеры) [citation:1][citation:4]
  const REGIONS = [
    { id: "moscow", name: "Москва", coeff: 5.0 },
    { id: "spb", name: "Санкт-Петербург", coeff: 4.5 },
    { id: "mo", name: "Московская область", coeff: 4.0 },
    { id: "lo", name: "Ленинградская область", coeff: 3.5 },
    { id: "tatarstan", name: "Республика Татарстан", coeff: 3.0 },
    { id: "krasnodar", name: "Краснодарский край", coeff: 3.2 },
    { id: "rostov", name: "Ростовская область", coeff: 3.8 },
    { id: "sverdlovsk", name: "Свердловская область", coeff: 3.4 },
    { id: "nsk", name: "Новосибирская область", coeff: 3.6 },
    { id: "tomsk", name: "Томская область", coeff: 4.2 }
  ];

  // Повышающие коэффициенты для дорогих автомобилей [citation:7][citation:9]
  const LUXURY_COEFFICIENTS = [
    { min: 10000000, max: 15000000, years: 10, coeff: 3 },
    { min: 15000000, max: Infinity, years: 20, coeff: 3 }
  ];

  // Перевод кВт в л.с. [citation:2]
  const convertKwToHp = (kw: number): number => {
    return kw * 1.35962;
  };

  // Округление лошадиных сил [citation:5]
  const roundHp = (hp: number): number => {
    return Math.round(hp * 100) / 100;
  };

  // Получение базовой ставки по типу ТС и мощности
  const getBaseRate = (type: string, hp: number): number => {
    const rates = BASE_RATES[type as keyof typeof BASE_RATES];
    const bracket = rates.find(r => hp > r.min && hp <= r.max);
    return bracket ? bracket.rate : 0;
  };

  // Проверка на роскошь [citation:7]
  const getLuxuryCoeff = (carPrice: number, carYear: number, currentYear: number): number => {
    if (!carPrice || carPrice < 10000000) return 1;
    
    const age = currentYear - carYear;
    
    for (const bracket of LUXURY_COEFFICIENTS) {
      if (carPrice >= bracket.min && carPrice < bracket.max && age <= bracket.years) {
        return bracket.coeff;
      }
    }
    
    return 1;
  };

  // Основной расчёт налога
  const calculateTax = useCallback(() => {
    setError("");
    
    const hp = parseFloat(power);
    if (isNaN(hp) || hp <= 0) {
      setError("Введите корректную мощность двигателя");
      setTaxAmount(null);
      return;
    }

    // Получаем базовую ставку
    const baseRate = getBaseRate(vehicleType, hp);
    
    // Применяем региональный коэффициент [citation:1]
    const regionData = REGIONS.find(r => r.id === region);
    const regionalRate = baseRate * (regionData?.coeff || 1);
    
    // Расчёт налога: мощность * ставка * (месяцы владения / 12) [citation:9]
    const calculatedTax = hp * regionalRate * (months / 12);
    
    // Округляем до целых рублей [citation:7]
    const roundedTax = Math.round(calculatedTax);
    setTaxAmount(roundedTax);
    setTaxRate(regionalRate);
    
    // Расчёт авансовых платежей (для юрлиц)
    setAdvanceAmount(Math.round(roundedTax / 4));
    
    // Применяем повышающий коэффициент для дорогих авто [citation:7]
    if (vehicleType === "car" && price) {
      const carPrice = parseFloat(price);
      if (!isNaN(carPrice) && carPrice >= 10000000) {
        const luxuryCoeff = getLuxuryCoeff(carPrice, year, new Date().getFullYear());
        if (luxuryCoeff > 1) {
          const withLuxury = roundedTax * luxuryCoeff;
          setTotalWithCoeff(withLuxury);
          setLuxurySurcharge(withLuxury - roundedTax);
        } else {
          setTotalWithCoeff(null);
          setLuxurySurcharge(null);
        }
      } else {
        setTotalWithCoeff(null);
        setLuxurySurcharge(null);
      }
    } else {
      setTotalWithCoeff(null);
      setLuxurySurcharge(null);
    }

  }, [vehicleType, power, region, months, price, year]);

  // Автоматический пересчёт
  useEffect(() => {
    calculateTax();
  }, [calculateTax]);

  // Сброс калькулятора
  const resetCalculator = () => {
    setVehicleType("car");
    setPower("150");
    setRegion("moscow");
    setMonths(12);
    setPrice("");
    setYear(new Date().getFullYear());
    setTaxAmount(null);
    setAdvanceAmount(null);
    setTotalWithCoeff(null);
    setLuxurySurcharge(null);
    setTaxRate(null);
    setError("");
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

  // Форматирование даты
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 20 + i);

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
              <span style={{ fontSize: '32px' }}>🚗</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Калькулятор транспортного налога
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              Расчёт налога с учётом региона, мощности и периода владения • Актуальные ставки 2026 года.
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

          {/* ОСНОВНЫЕ ПАРАМЕТРЫ */}
          <div style={{ marginBottom: '24px' }}>
            {/* Тип транспортного средства */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                Тип транспортного средства
              </label>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {[
                  { id: "car", label: "🚗 Легковой", icon: "🚗" },
                  { id: "motorcycle", label: "🏍️ Мотоцикл", icon: "🏍️" },
                  { id: "truck", label: "🚛 Грузовой", icon: "🚛" },
                  { id: "bus", label: "🚌 Автобус", icon: "🚌" }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setVehicleType(type.id as any)}
                    style={{
                      flex: '1 1 120px',
                      padding: '12px',
                      backgroundColor: vehicleType === type.id ? COLORS.primary : COLORS.border,
                      border: `1px solid ${vehicleType === type.id ? COLORS.primary : COLORS.border}`,
                      borderRadius: '8px',
                      color: vehicleType === type.id ? 'white' : COLORS.text.main,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{type.icon}</span> {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Мощность двигателя */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                Мощность двигателя (л.с.) 
              </label>
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
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
                placeholder="Например: 150"
                min="1"
                step="0.1"
              />
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
                flexWrap: 'wrap'
              }}>
                {[100, 150, 200, 250, 300].map(val => (
                  <button
                    key={val}
                    onClick={() => setPower(val.toString())}
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
                    {val} л.с.
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '4px' }}>
                Если мощность указана в кВт: 1 кВт = 1.36 л.с.
              </p>
            </div>

            {/* Регион регистрации */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                Регион регистрации 
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid #475569`,
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {REGIONS.map(r => (
                  <option key={r.id} value={r.id} style={{ backgroundColor: COLORS.background }}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Период владения */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                Месяцев владения в году 
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.primary} ${(months/12)*100}%, ${COLORS.border} ${(months/12)*100}%)`,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '14px',
                color: COLORS.text.muted
              }}>
                <span>1 мес</span>
                <span style={{ color: COLORS.primary, fontWeight: 'bold' }}>{months} мес</span>
                <span>12 мес</span>
              </div>
            </div>

            {/* Для дорогих автомобилей (опционально) */}
            {vehicleType === "car" && (
              <div style={{ marginBottom: '16px' }}>
                <details style={{
                  backgroundColor: COLORS.background,
                  borderRadius: '8px',
                  padding: '12px',
                  border: `1px solid ${COLORS.border}`
                }}>
                  <summary style={{ color: COLORS.primary, cursor: 'pointer', fontWeight: 'bold' }}>
                    ⭐ Налог на роскошь (для автомобилей дороже 10 млн ₽) 
                  </summary>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '4px', color: COLORS.text.muted, fontSize: '12px' }}>
                        Стоимость автомобиля (₽)
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
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
                        placeholder="Например: 15000000"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', color: COLORS.text.muted, fontSize: '12px' }}>
                        Год выпуска
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          backgroundColor: COLORS.border,
                          border: `1px solid #475569`,
                          color: 'white',
                          fontSize: '14px',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {years.map(y => (
                          <option key={y} value={y} style={{ backgroundColor: COLORS.background }}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </details>
              </div>
            )}
          </div>

          {/* РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px',
            background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
          }}>
            {error ? (
              <div style={{ textAlign: 'center', color: COLORS.danger, padding: '20px' }}>
                ⚠️ {error}
              </div>
            ) : taxAmount !== null ? (
              <>
                {/* Основная сумма */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px' }}>
                    Сумма транспортного налога за {months} мес.
                  </div>
                  <div style={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold',
                    color: COLORS.primary,
                    fontFamily: 'monospace'
                  }}>
                    {formatCurrency(taxAmount)}
                  </div>
                  {taxRate && (
                    <div style={{ fontSize: '14px', color: COLORS.text.muted, marginTop: '4px' }}>
                      Ставка: {taxRate.toFixed(2)} ₽/л.с.
                    </div>
                  )}
                </div>

                {/* Детализация */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    backgroundColor: COLORS.card,
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Мощность
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.text.main }}>
                      {parseFloat(power).toFixed(1)} л.с.
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: COLORS.card,
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Аванс (за квартал)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.secondary }}>
                      {advanceAmount ? formatCurrency(advanceAmount) : "—"}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: COLORS.card,
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Срок уплаты
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.text.main }}>
                      1 декабря 
                    </div>
                  </div>
                </div>

                {/* Налог на роскошь */}
                {totalWithCoeff && luxurySurcharge && (
  <div style={{
    backgroundColor: COLORS.card,
    padding: '16px',
    borderRadius: '8px',
    border: `1px solid ${COLORS.warning}`
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    }}>
      <span style={{ fontSize: '20px' }}>⭐</span>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.warning }}>
        Повышающий коэффициент (налог на роскошь)
      </h3>
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px'
    }}>
      <div>
        <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Без коэффициента</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text.main }}>
          {formatCurrency(taxAmount)}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: COLORS.text.muted }}>С коэффициентом</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.warning }}>
          {formatCurrency(totalWithCoeff)}
        </div>
      </div>
    </div>
    <div style={{
      marginTop: '8px',
      fontSize: '12px',
      color: COLORS.text.dark,
      textAlign: 'center'
    }}>
      Надбавка: {formatCurrency(luxurySurcharge)}
    </div>
  </div>
)}

                {/* Информация о льготах [citation:6] */}
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: `rgba(6, 182, 212, 0.1)`,
                  borderRadius: '8px',
                  border: `1px solid ${COLORS.primary}`,
                  fontSize: '12px',
                  color: COLORS.text.muted
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span>💡</span>
                    <span style={{ fontWeight: 'bold', color: COLORS.primary }}>Льготные категории</span>
                  </div>
                  <p>
                    От уплаты налога могут освобождаться: пенсионеры, инвалиды, многодетные семьи, 
                    ветераны, владельцы электромобилей. Проверьте льготы в вашем регионе. 
                  </p>
                </div>
              </>
            ) : null}
          </div>

          {/* КРАТКАЯ ИНФОРМАЦИЯ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '16px',
            border: `1px solid ${COLORS.border}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>📌</span>
              <span style={{ color: COLORS.primary, fontWeight: 'bold' }}>
                Как рассчитывается налог?
              </span>
            </div>
            <p style={{ color: COLORS.text.muted, fontSize: '14px', marginBottom: '8px' }}>
              <strong>Формула:</strong> Мощность (л.с.) × Ставка региона × (Месяцы владения ÷ 12) 
            </p>
            <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
              <strong>Срок уплаты:</strong> до 1 декабря следующего года 
            </p>
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
              Транспортный налог в 2026 году
            </span>
          </h2>
          
          <p style={{ color: COLORS.text.main, marginBottom: '16px', fontSize: '15px' }}>
            Транспортный налог — региональный налог, который уплачивают владельцы зарегистрированных 
            транспортных средств. Средства поступают в бюджет региона и направляются на ремонт 
            и строительство дорог. 
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
                📊 Базовые ставки (НК РФ) 
              </h3>
              <div style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                <p>• до 100 л.с. — 2,5 ₽/л.с.</p>
                <p>• 100–150 л.с. — 3,5 ₽/л.с.</p>
                <p>• 150–200 л.с. — 5 ₽/л.с.</p>
                <p>• 200–250 л.с. — 7,5 ₽/л.с.</p>
                <p>• свыше 250 л.с. — 15 ₽/л.с.</p>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🏛️ Региональные ставки 
              </h3>
              <div style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                <p>• Москва — в 5 раз выше базовых</p>
                <p>• СПб — в 4,5 раза выше</p>
                <p>• МО — в 4 раза выше</p>
                <p>• Татарстан — в 3 раза выше</p>
                <p>• Регионы могут изменять ставки в 10 раз</p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                ⭐ Налог на роскошь 
              </h3>
              <div style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                <p>• Авто дороже 10 млн ₽ — коэффициент 3</p>
                <p>• До 15 млн ₽ — до 10 лет</p>
                <p>• Свыше 15 млн ₽ — до 20 лет</p>
                <p>• Перечень обновляется ежегодно</p>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', color: COLORS.primary, marginBottom: '12px' }}>
            Кто освобождается от уплаты? 
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
                👥 Федеральные льготы 
              </h4>
              <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px' }}>
                <li>Инвалиды I и II групп (до 100 л.с.)</li>
                <li>Автомобили, оборудованные для инвалидов</li>
                <li>Сельскохозяйственная техника</li>
                <li>Транспорт экстренных служб</li>
                <li>Герои РФ, СССР, ветераны (в некоторых регионах)</li>
              </ul>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                👨‍👩‍👧‍👦 Региональные льготы 
              </h4>
              <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px' }}>
                <li>Многодетные семьи (до 150-250 л.с.)</li>
                <li>Пенсионеры (в некоторых регионах)</li>
                <li>Владельцы электромобилей</li>
                <li>Ветераны боевых действий</li>
                <li>Родители детей-инвалидов</li>
              </ul>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                🚫 Освобождение полностью 
              </h4>
              <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px' }}>
                <li>Угнанные автомобили (на время розыска)</li>
                <li>Утилизированные авто</li>
                <li>Автомобили мощностью до 70 л.с. (в некоторых регионах)</li>
                <li>Спецтехника для сельхозработ</li>
              </ul>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', color: COLORS.primary, marginBottom: '12px' }}>
            Важные изменения 2026 года 
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>📅</span>
                <span style={{ fontWeight: 'bold', color: COLORS.primary }}>Новые ставки в регионах</span>
              </div>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                В 11 регионах изменились ставки на грузовые автомобили. 
                Наибольшее повышение в Ростовской и Томской областях. 
              </p>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔍</span>
                <span style={{ fontWeight: 'bold', color: COLORS.primary }}>Угон и розыск</span>
              </div>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Налог прекращает начисляться с месяца начала розыска. 
                Данные автоматически передаются из МВД. 
              </p>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>📍</span>
                <span style={{ fontWeight: 'bold', color: COLORS.primary }}>Смена региона</span>
              </div>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                При смене места регистрации налог пересчитывается по новому региону 
                с месяца, следующего за изменением. 
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(6, 182, 212, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Важно:</strong> Транспортный налог — региональный, поэтому ставки и льготы 
              могут значительно отличаться в разных субъектах РФ. Рекомендуется проверять актуальные 
              ставки в вашем регионе на официальном сайте ФНС или в личном кабинете налогоплательщика. 
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
            Калькулятор транспортного налога • Актуальные ставки 2026 года • Данные ФНС и НК РФ • {new Date().getFullYear()} год
          </p>
        </div>
      </div>
    </div>
  );
}