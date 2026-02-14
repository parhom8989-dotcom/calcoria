// app/other/solar/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function SolarCalculatorPage() {
  // Состояния калькулятора
  const [monthlyConsumption, setMonthlyConsumption] = useState<string>("500");
  const [panelPower, setPanelPower] = useState<string>("400");
  const [sunHours, setSunHours] = useState<string>("4");
  const [area, setArea] = useState<string>("50");
  const [result, setResult] = useState<{
    dailyConsumption: number;
    panelsCount: number;
    totalPower: number;
    requiredArea: number;
    annualGeneration: number;
    savingsPerMonth: number;
    co2Savings: number;
  } | null>(null);

  // Цена за кВт·ч (можно сделать редактируемой позже)
  const [electricityPrice, setElectricityPrice] = useState<number>(5.5);

  // Цветовая схема
  const COLORS = {
    primary: '#fbbf24', // солнечный жёлтый
    primaryHover: '#f59e0b',
    secondary: '#fcd34d',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    success: '#34d399',
    warning: '#fbbf24'
  };

  // Расчёт солнечных панелей
  const calculate = useCallback(() => {
    const monthly = parseFloat(monthlyConsumption) || 0;
    const power = parseFloat(panelPower) || 0;
    const hours = parseFloat(sunHours) || 0;
    const availableArea = parseFloat(area) || 0;

    if (monthly > 0 && power > 0 && hours > 0) {
      // Среднесуточное потребление
      const dailyConsumption = monthly / 30;
      
      // Необходимая мощность солнечной станции (с учётом КПД инвертора 90%)
      const requiredPower = dailyConsumption / (hours * 0.9);
      
      // Количество панелей
      const panelsCount = Math.ceil(requiredPower / (power / 1000));
      
      // Фактическая общая мощность
      const totalPower = panelsCount * power / 1000;
      
      // Требуемая площадь (примерно 2 м² на панель)
      const requiredArea = panelsCount * 2;
      
      // Годовая выработка
      const annualGeneration = totalPower * hours * 365;
      
      // Экономия в месяц
      const savingsPerMonth = (dailyConsumption * 30) * electricityPrice;
      
      // Экономия CO2 (примерно 0.5 кг на кВт·ч)
      const co2Savings = annualGeneration * 0.5 / 1000; // в тоннах

      setResult({
        dailyConsumption: parseFloat(dailyConsumption.toFixed(1)),
        panelsCount,
        totalPower: parseFloat(totalPower.toFixed(1)),
        requiredArea: parseFloat(requiredArea.toFixed(1)),
        annualGeneration: parseFloat(annualGeneration.toFixed(0)),
        savingsPerMonth: parseFloat(savingsPerMonth.toFixed(0)),
        co2Savings: parseFloat(co2Savings.toFixed(1))
      });
    } else {
      setResult(null);
    }
  }, [monthlyConsumption, panelPower, sunHours, area, electricityPrice]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const resetCalculator = () => {
    setMonthlyConsumption("500");
    setPanelPower("400");
    setSunHours("4");
    setArea("50");
    setElectricityPrice(5.5);
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
            <span style={{ fontSize: '32px' }}>☀️</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Солнечные панели для дома
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Расчёт мощности, количества панелей и окупаемости
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
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                Среднемесячное потребление электроэнергии (кВт·ч)
              </label>
              <input
                type="number"
                value={monthlyConsumption}
                onChange={(e) => setMonthlyConsumption(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '14px'
                }}
                step="10"
                min="0"
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {[300, 500, 800, 1000].map(val => (
                  <button
                    key={val}
                    onClick={() => setMonthlyConsumption(val.toString())}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: COLORS.background,
                      border: `1px solid ${COLORS.primary}`,
                      borderRadius: '4px',
                      color: COLORS.primary,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {val} кВт·ч
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Мощность панели (Вт)
                </label>
                <input
                  type="number"
                  value={panelPower}
                  onChange={(e) => setPanelPower(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '14px'
                  }}
                  step="50"
                  min="0"
                />
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {[300, 400, 450, 500].map(val => (
                    <button
                      key={val}
                      onClick={() => setPanelPower(val.toString())}
                      style={{
                        padding: '2px 6px',
                        backgroundColor: COLORS.background,
                        border: `1px solid ${COLORS.primary}`,
                        borderRadius: '4px',
                        color: COLORS.primary,
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Солнечных часов в день
                </label>
                <input
                  type="number"
                  value={sunHours}
                  onChange={(e) => setSunHours(e.target.value)}
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
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {[3, 4, 5, 6].map(val => (
                    <button
                      key={val}
                      onClick={() => setSunHours(val.toString())}
                      style={{
                        padding: '2px 6px',
                        backgroundColor: COLORS.background,
                        border: `1px solid ${COLORS.primary}`,
                        borderRadius: '4px',
                        color: COLORS.primary,
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      {val} ч
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                Доступная площадь для панелей (м²)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
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
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {[30, 50, 80, 100].map(val => (
                  <button
                    key={val}
                    onClick={() => setArea(val.toString())}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: COLORS.background,
                      border: `1px solid ${COLORS.primary}`,
                      borderRadius: '4px',
                      color: COLORS.primary,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {val} м²
                  </button>
                ))}
              </div>
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
                Результат расчёта солнечной станции
              </h3>
              
              {/* Количество панелей */}
              <div style={{
                backgroundColor: COLORS.card,
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px' }}>
                  Требуется панелей
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.primary }}>
                  {result.panelsCount}
                </div>
                <div style={{ fontSize: '12px', color: COLORS.text.muted }}>
                  общей мощностью {result.totalPower} кВт
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ backgroundColor: COLORS.card, padding: '12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Суточное потребление</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text.main }}>
                    {result.dailyConsumption} кВт·ч
                  </div>
                </div>
                <div style={{ backgroundColor: COLORS.card, padding: '12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Годовая выработка</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.success }}>
                    {result.annualGeneration} кВт·ч
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ backgroundColor: COLORS.card, padding: '12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Требуется площади</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text.main }}>
                    {result.requiredArea} м²
                  </div>
                  {result.requiredArea > parseFloat(area) && (
                    <div style={{ fontSize: '10px', color: COLORS.primary, marginTop: '4px' }}>
                      ⚠️ Нужно больше места
                    </div>
                  )}
                </div>
                <div style={{ backgroundColor: COLORS.card, padding: '12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Экономия в месяц</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.success }}>
                    {result.savingsPerMonth.toLocaleString()} ₽
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: COLORS.border,
                borderRadius: '6px',
                fontSize: '13px',
                marginTop: '8px'
              }}>
                <span style={{ color: COLORS.text.muted }}>🌱 Экономия CO₂ в год:</span>
                <span style={{ fontWeight: 'bold', color: COLORS.success }}>
                  {result.co2Savings} тонн
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
            <span style={{ fontSize: '18px' }}>☀️</span>
            <span style={{ fontWeight: 'bold', color: COLORS.primary }}>Важно знать:</span>
          </div>
          <p style={{ marginBottom: '6px' }}>• Среднее количество солнечных часов в России: 3-5 часов/день</p>
          <p style={{ marginBottom: '6px' }}>• Одна панель занимает ~2 м² площади</p>
          <p style={{ marginBottom: '6px' }}>• КПД инвертора ~90%</p>
          <p style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '8px' }}>
            Расчёт предварительный. Для точного проекта обратитесь к специалистам.
          </p>
        </div>
      </div>
    </div>
  );
}