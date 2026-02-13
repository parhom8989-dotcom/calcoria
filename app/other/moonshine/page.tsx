// app/samogon/kalkulyator-samogonshhika/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function KalkulyatorSamogonshhikaPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"braga_alcohol" | "distillation" | "dilution" | "yield">("braga_alcohol");
  
  // Для расчёта браги
  const [sugarAmount, setSugarAmount] = useState<string>("5");
  const [waterVolume, setWaterVolume] = useState<string>("20");
  const [yeastType, setYeastType] = useState<"spirits" | "wine" | "turbo">("spirits");
  
  // Для перегонки
  const [bragaStrength, setBragaStrength] = useState<string>("12");
  const [bragaVolume, setBragaVolume] = useState<string>("20");
  const [distillationEfficiency, setDistillationEfficiency] = useState<string>("80");
  
  // Для разбавления
  const [moonshineStrength, setMoonshineStrength] = useState<string>("70");
  const [moonshineVolume, setMoonshineVolume] = useState<string>("3");
  const [targetStrength, setTargetStrength] = useState<string>("40");
  
  // Для выхода
  const [sugarUsed, setSugarUsed] = useState<string>("5");
  
  // Результаты
  const [result, setResult] = useState<number | null>(null);
  const [additionalResult, setAdditionalResult] = useState<number | null>(null);
  const [warning, setWarning] = useState<string>("");

  // Цветовая схема #f59e0b (amber-500)
  const COLORS = {
    primary: '#f59e0b',
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
    gradient: {
      from: '#f59e0b',
      to: '#fbbf24'
    }
  };

  // Константы для расчётов
  const YEAST_EFFICIENCY = {
    spirits: 0.6,    // Спиртовые дрожжи: 0.6 л спирта с 1 кг сахара
    wine: 0.5,       // Винные дрожжи: 0.5 л спирта
    turbo: 0.65      // Турбо-дрожжи: 0.65 л спирта
  };

  // Функция расчёта
  const calculate = useCallback(() => {
    const sugar = parseFloat(sugarAmount) || 0;
    const water = parseFloat(waterVolume) || 0;
    const strength = parseFloat(bragaStrength) || 0;
    const volume = parseFloat(bragaVolume) || 0;
    const efficiency = parseFloat(distillationEfficiency) || 0;
    const moonshineStr = parseFloat(moonshineStrength) || 0;
    const moonshineVol = parseFloat(moonshineVolume) || 0;
    const targetStr = parseFloat(targetStrength) || 0;
    const sugarTotal = parseFloat(sugarUsed) || 0;
    
    let calculatedResult = 0;
    let calculatedAdditional = 0;
    let calculatedWarning = "";
    
    switch(calcType) {
      case "braga_alcohol": // Расчёт потенциального спирта в бражке
        const efficiencyRate = YEAST_EFFICIENCY[yeastType];
        calculatedResult = sugar * efficiencyRate; // Литры 100% спирта
        calculatedAdditional = (calculatedResult / (water + (sugar * 0.6))) * 100; // Крепость браги
        calculatedWarning = calculatedAdditional > 20 
          ? "⚠️ Крепость браги слишком высокая! Дрожжи могут погибнуть. Добавьте воды." 
          : calculatedAdditional < 10 
          ? "⚠️ Крепость браги низкая. Можно добавить сахара для повышения выхода." 
          : "";
        break;
        
      case "distillation": // Расчёт выхода самогона при перегонке
        const totalAlcohol = (volume * strength) / 100; // Литры спирта в бражке
        calculatedResult = (totalAlcohol * efficiency) / 100; // Литры спирта на выходе
        calculatedAdditional = (calculatedResult / volume) * 100; // Средняя крепость выхода
        break;
        
      case "dilution": // Разбавление самогона до нужной крепости
        const pureAlcohol = (moonshineVol * moonshineStr) / 100;
        calculatedResult = (pureAlcohol * 100) / targetStr; // Общий объём после разбавления
        calculatedAdditional = calculatedResult - moonshineVol; // Воды нужно добавить
        calculatedWarning = targetStr < 20 
          ? "⚠️ Крепость ниже 20% может не сохранить напиток" 
          : targetStr > 60 
          ? "⚠️ Высокая крепость может быть слишком жёсткой" 
          : "";
        break;
        
      case "yield": // Расчёт теоретического выхода самогона
  const maxAlcohol = sugarTotal * 0.64; // Максимально возможный спирт (теоретически)
  const realisticYield = sugarTotal * 1.25; // Реалистичный выход 40% самогона
  calculatedResult = realisticYield; // Литров 40% самогона
  
  // Эффективность: сколько от теоретического максимума получили
  // 5кг сахара → 3.2л макс спирта → 1.28л в 5л 40% самогона = 40% эффективность
  const alcoholInMoonshine = realisticYield * 0.4; // Спирт в самогоне
  calculatedAdditional = (alcoholInMoonshine / maxAlcohol) * 100; // Эффективность
  break;
    }
    
    setResult(isNaN(calculatedResult) ? null : calculatedResult);
    setAdditionalResult(isNaN(calculatedAdditional) ? null : calculatedAdditional);
    setWarning(calculatedWarning);
  }, [calcType, sugarAmount, waterVolume, yeastType, bragaStrength, bragaVolume, distillationEfficiency, moonshineStrength, moonshineVolume, targetStrength, sugarUsed]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setSugarAmount("5");
    setWaterVolume("20");
    setYeastType("spirits");
    setBragaStrength("12");
    setBragaVolume("20");
    setDistillationEfficiency("80");
    setMoonshineStrength("70");
    setMoonshineVolume("3");
    setTargetStrength("40");
    setSugarUsed("5");
    setResult(null);
    setAdditionalResult(null);
    setWarning("");
    setCalcType("braga_alcohol");
  };

  // Форматирование чисел
  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  // Получение единиц измерения
  const getUnit = () => {
    switch(calcType) {
      case "braga_alcohol": return "л 100% спирта";
      case "distillation": return "л спирта на выходе";
      case "dilution": return "л готового напитка";
      case "yield": return "л 40% самогона";
      default: return "";
    }
  };

  // Получение формулы
  const getFormula = () => {
    switch(calcType) {
      case "braga_alcohol": return "Спирт = Сахар × КПД дрожжей";
      case "distillation": return "Выход = Объём × Крепость × Эффективность";
      case "dilution": return "Объём = (Спирт × 100) ÷ Нужная крепость";
      case "yield": return "Выход = Сахар × 1.25 (40% самогона)";
      default: return "Спирт = Сахар × 0.6";
    }
  };

  // Получение описания формулы
  const getFormulaDescription = () => {
    switch(calcType) {
      case "braga_alcohol": return "КПД дрожжей: спиртовые 0.6, винные 0.5, турбо 0.65";
      case "distillation": return "Эффективность перегонки обычно 70-85%";
      case "dilution": return "Для разбавления используйте очищенную воду";
      case "yield": return "Из 1 кг сахара ≈ 1.2 л 40% самогона";
      default: return "Основная формула для расчёта браги";
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
              gap: '10px'
            }}>
              <span style={{ fontSize: '32px' }}>⚗️</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Калькулятор самогонщика
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              Расчёт браги, перегонки, разбавления и выхода самогона
            </p>
          </div>

          {/* ДВЕ КНОПКИ РЯДОМ */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {/* Кнопка "На главную" */}
            <a 
              href="/"
              style={{
                flex: 1,
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
            
            {/* Кнопка "Сбросить" */}
            <button
              onClick={resetCalculator}
              style={{
                flex: 1,
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

          {/* Переключатель режимов */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '24px',
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '8px'
          }}>
            <button
              onClick={() => setCalcType("braga_alcohol")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "braga_alcohol" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "braga_alcohol" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "braga_alcohol" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Брага
            </button>
            <button
              onClick={() => setCalcType("distillation")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "distillation" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "distillation" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "distillation" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Перегонка
            </button>
            <button
              onClick={() => setCalcType("dilution")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "dilution" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "dilution" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "dilution" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Разбавление
            </button>
            <button
              onClick={() => setCalcType("yield")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "yield" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "yield" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "yield" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Выход с сахара
            </button>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            {calcType === "braga_alcohol" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Количество сахара (кг)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sugarAmount}
                    onChange={(e) => setSugarAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 5"
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[1, 3, 5, 10].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSugarAmount(val.toString())}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: COLORS.background,
                          border: `1px solid ${COLORS.primary}`,
                          borderRadius: '4px',
                          color: COLORS.primary,
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
                          e.currentTarget.style.color = COLORS.primary;
                        }}
                      >
                        {val} кг
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Объём воды (л)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={waterVolume}
                    onChange={(e) => setWaterVolume(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 20"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Тип дрожжей
                  </label>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    {["spirits", "wine", "turbo"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setYeastType(type as any)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: yeastType === type 
                            ? COLORS.primary 
                            : COLORS.background,
                          border: `1px solid ${yeastType === type ? COLORS.primary : COLORS.border}`,
                          borderRadius: '6px',
                          color: yeastType === type ? 'white' : COLORS.text.main,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {type === "spirits" && "Спиртовые"}
                        {type === "wine" && "Винные"}
                        {type === "turbo" && "Турбо"}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '8px' }}>
                    {yeastType === "spirits" && "КПД: 0.6 л спирта/кг сахара"}
                    {yeastType === "wine" && "КПД: 0.5 л спирта/кг сахара"}
                    {yeastType === "turbo" && "КПД: 0.65 л спирта/кг сахара"}
                  </div>
                </div>
              </>
            )}

            {calcType === "distillation" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Крепость браги (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={bragaStrength}
                    onChange={(e) => setBragaStrength(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 12"
                  />
                  <div style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '4px' }}>
                    Обычно 10-15%. Выше 20% - дрожжи гибнут
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Объём браги (л)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={bragaVolume}
                    onChange={(e) => setBragaVolume(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 20"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Эффективность перегонки (%)
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={distillationEfficiency}
                    onChange={(e) => setDistillationEfficiency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 80"
                  />
                  <div style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '4px' }}>
                    Обычно 70-85% в зависимости от аппарата
                  </div>
                </div>
              </>
            )}

            {calcType === "dilution" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Крепость самогона (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={moonshineStrength}
                    onChange={(e) => setMoonshineStrength(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 70"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Объём самогона (л)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={moonshineVolume}
                    onChange={(e) => setMoonshineVolume(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 3"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Желаемая крепость (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={targetStrength}
                    onChange={(e) => setTargetStrength(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 40"
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[40, 45, 50, 55, 60].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setTargetStrength(val.toString())}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: COLORS.background,
                          border: `1px solid ${COLORS.primary}`,
                          borderRadius: '4px',
                          color: COLORS.primary,
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
                          e.currentTarget.style.color = COLORS.primary;
                        }}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {calcType === "yield" && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Количество сахара (кг)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sugarUsed}
                    onChange={(e) => setSugarUsed(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 5"
                  />
                  <div style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '4px' }}>
                    1 кг сахара ≈ 1.2 л 40% самогона
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ПРЕДУПРЕЖДЕНИЕ */}
          {warning && (
            <div style={{
              backgroundColor: `rgba(245, 158, 11, 0.1)`,
              border: `1px solid ${COLORS.primary}`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: COLORS.text.main,
              fontSize: '14px'
            }}>
              ⚠️ {warning}
            </div>
          )}

          {/* ОСНОВНОЙ РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px',
            background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
              {result !== null ? (
                <span style={{
                  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {formatNumber(result, 2)} {getUnit()}
                </span>
              ) : (
                <span style={{ color: COLORS.text.muted }}>—</span>
              )}
            </div>
            <div style={{ color: COLORS.text.muted, marginBottom: '16px' }}>
              {calcType === "braga_alcohol" && "Потенциальный выход спирта из браги"}
              {calcType === "distillation" && "Ожидаемый выход при перегонке"}
              {calcType === "dilution" && "Объём после разбавления"}
              {calcType === "yield" && "Теоретический выход самогона"}
            </div>
            
            {/* ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ */}
            {additionalResult !== null && (
              <div style={{ 
                paddingTop: '16px', 
                borderTop: `1px solid ${COLORS.border}`,
                marginTop: '16px'
              }}>
                <div style={{ color: COLORS.text.main, fontSize: '16px', marginBottom: '8px' }}>
                  {calcType === "braga_alcohol" && `Крепость браги: ${formatNumber(additionalResult, 1)}%`}
                  {calcType === "distillation" && `Средняя крепость выхода: ${formatNumber(additionalResult, 1)}%`}
                  {calcType === "dilution" && `Добавить воды: ${formatNumber(additionalResult, 2)} л`}
                  {calcType === "yield" && `Эффективность процесса: ${formatNumber(additionalResult, 1)}%`}
                </div>
                {calcType === "dilution" && additionalResult > 0 && (
                  <div style={{ 
                    fontSize: '14px', 
                    color: COLORS.text.muted,
                    backgroundColor: `rgba(59, 130, 246, 0.1)`,
                    padding: '8px',
                    borderRadius: '6px',
                    marginTop: '8px'
                  }}>
                    💧 Добавляйте воду постепенно, контролируя крепость ареометром
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ФОРМУЛА */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            border: `1px solid ${COLORS.border}`
          }}>
            <div style={{ 
              color: COLORS.primary, 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              fontFamily: 'monospace'
            }}>
              {getFormula()}
            </div>
            <div style={{ color: COLORS.text.dark, fontSize: '14px' }}>
              {getFormulaDescription()}
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
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>⚗️</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Технология домашнего самогоноварения
            </span>
          </h2>
          <p style={{ color: COLORS.text.main, marginBottom: '16px' }}>
            Самогоноварение — это процесс получения спирта из сахаросодержащего сырья 
            путём брожения и последующей перегонки. Калькулятор помогает рассчитать 
            ключевые параметры для получения качественного продукта.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🍶 Этапы самогоноварения
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>1. <strong>Приготовление браги:</strong> сахар + вода + дрожжи</p>
                <p style={{ marginBottom: '8px' }}>2. <strong>Брожение:</strong> 5-14 дней при 20-28°C</p>
                <p style={{ marginBottom: '8px' }}>3. <strong>Перегонка:</strong> отделение спирта от браги</p>
                <p style={{ marginBottom: '8px' }}>4. <strong>Очистка:</strong> углём или другими методами</p>
                <p>5. <strong>Разбавление:</strong> доведение до нужной крепости</p>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                📊 Оптимальные параметры
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>• <strong>Крепость браги:</strong> 12-15%</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Температура брожения:</strong> 24-28°C</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Пропорции:</strong> 1 кг сахара на 4-5 л воды</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Дрожжи:</strong> 20 г на 1 кг сахара</p>
                <p>• <strong>Крепость готового:</strong> 40-45% (для настоек)</p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                ⚠️ Важные предупреждения
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>• <strong>Не используйте металлическую посуду</strong> для брожения</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Контролируйте температуру</strong> — перегрев губит дрожжи</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Отсекайте "головы" и "хвосты"</strong> при перегонке</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Используйте гидрозатвор</strong> для отвода углекислого газа</p>
                <p>• <strong>Соблюдайте меры безопасности</strong> при работе с огнём</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '12px',
            color: COLORS.primary 
          }}>
            Примеры расчётов
          </h3>
          <ul style={{ color: COLORS.text.main, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              • <strong>5 кг сахара + 20 л воды + спиртовые дрожжи:</strong><br/>
              → 3 л 100% спирта → ≈ 7.5 л 40% самогона
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>3 л 70% самогона разбавить до 40%:</strong><br/>
              → Добавить 2.25 л воды → Получится 5.25 л напитка
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>20 л 12% браги перегнать с эффективностью 80%:</strong><br/>
              → 2.4 л спирта в браге → 1.92 л спирта на выходе
            </li>
            <li>
              • <strong>10 кг сахара даёт примерно:</strong><br/>
              → 12 л 40% самогона при хорошем КПД
            </li>
          </ul>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(245, 158, 11, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Совет профессионала:</strong> Для качественного самогона всегда используйте 
              "головы" и "хвосты" отсекайте. "Головы" (первые 10-15% выхода) содержат вредные примеси, 
              "хвосты" (последние 20%) — сивушные масла. Пейте умеренно!
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
            Калькулятор самогонщика • Только для информационных целей • {new Date().getFullYear()} год
          </p>
          <p style={{ marginTop: '8px' }}>
            Самогоноварение может регулироваться законодательством вашей страны. Употребляйте алкоголь ответственно.
          </p>
        </div>
      </div>
    </div>
  );
}