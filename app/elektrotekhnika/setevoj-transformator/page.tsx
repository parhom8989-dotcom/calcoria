// app/elektrotekhnika/setevoj-transformator/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function SetevojTransformatorPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('voltage'); // 'voltage', 'current', 'power'
  
  // Основные параметры
  const [primaryVoltage, setPrimaryVoltage] = useState<string>('220');
  const [secondaryVoltage, setSecondaryVoltage] = useState<string>('12');
  const [primaryCurrent, setPrimaryCurrent] = useState<string>('1');
  const [secondaryCurrent, setSecondaryCurrent] = useState<string>('10');
  const [power, setPower] = useState<string>('100');
  
  // Параметры сердечника
  const [coreArea, setCoreArea] = useState<string>('10');
  const [frequency, setFrequency] = useState<string>('50');
  const [efficiency, setEfficiency] = useState<string>('0.85');
  
  // Результаты
  const [result, setResult] = useState<{
    turnsRatio: number;
    primaryTurns: number;
    secondaryTurns: number;
    calculatedPower: number;
    calculatedCurrents: { primary: number; secondary: number };
    wireDiameter: { primary: number; secondary: number };
    warnings: string[];
    formulas: string[];
  } | null>(null);

  // Типовые напряжения
  const typicalVoltages = [
    { value: '12', label: '12В', desc: 'Авто, БП' },
    { value: '24', label: '24В', desc: 'Промышленность' },
    { value: '36', label: '36В', desc: 'Безопасное' },
    { value: '110', label: '110В', desc: 'США, Япония' },
    { value: '220', label: '220В', desc: 'Бытовая' },
    { value: '380', label: '380В', desc: 'Трёхфазная' },
  ];

  // Типовые мощности
  const typicalPowers = [
    { value: '10', label: '10 ВА', desc: 'Малый' },
    { value: '50', label: '50 ВА', desc: 'Средний' },
    { value: '100', label: '100 ВА', desc: 'Стандарт' },
    { value: '500', label: '500 ВА', desc: 'Мощный' },
    { value: '1000', label: '1 кВА', desc: 'Большой' },
    { value: '5000', label: '5 кВА', desc: 'Промышленный' },
  ];

  // Типовые площади сердечника (см²)
  const typicalCoreAreas = [
    { value: '5', label: '5 см²', power: 'до 50 ВА', desc: 'Малый' },
    { value: '10', label: '10 см²', power: 'до 100 ВА', desc: 'Стандарт' },
    { value: '20', label: '20 см²', power: 'до 200 ВА', desc: 'Средний' },
    { value: '40', label: '40 см²', power: 'до 400 ВА', desc: 'Большой' },
    { value: '80', label: '80 см²', power: 'до 800 ВА', desc: 'Мощный' },
    { value: '150', label: '150 см²', power: 'до 1500 ВА', desc: 'Очень мощный' },
  ];

  // Расчет
  const calculate = () => {
    const U1 = parseFloat(primaryVoltage) || 0;
    const U2 = parseFloat(secondaryVoltage) || 0;
    const I1 = parseFloat(primaryCurrent) || 0;
    const I2 = parseFloat(secondaryCurrent) || 0;
    const P = parseFloat(power) || 0;
    const S = parseFloat(coreArea) || 0;
    const f = parseFloat(frequency) || 50;
    const η = parseFloat(efficiency) || 0.85;
    
    const warnings: string[] = [];
    const formulas: string[] = [];

    let turnsRatio = 0;
    let primaryTurns = 0;
    let secondaryTurns = 0;
    let calculatedPower = 0;
    let calculatedCurrents = { primary: 0, secondary: 0 };
    let wireDiameter = { primary: 0, secondary: 0 };

    // 1. Расчет коэффициента трансформации
    if (U1 > 0 && U2 > 0) {
      turnsRatio = U1 / U2;
      formulas.push('k = U₁ ÷ U₂');
    }

    // 2. Расчет количества витков (упрощенная формула)
    if (S > 0 && U1 > 0 && f > 0) {
      // Формула: N = U × 10⁴ / (4.44 × f × B × S)
      // где B ≈ 1.2 Тл для трансформаторной стали
      const B = 1.2; // магнитная индукция, Тл
      primaryTurns = (U1 * 10000) / (4.44 * f * B * S);
      secondaryTurns = primaryTurns / turnsRatio;
      
      formulas.push('N₁ = U₁ × 10⁴ / (4.44 × f × B × S)');
      formulas.push('N₂ = N₁ ÷ k');
    }

    // 3. Расчет мощности и токов в зависимости от режима
    if (mode === 'power') {
      // Известна мощность
      calculatedPower = P;
      if (U1 > 0) calculatedCurrents.primary = P / U1;
      if (U2 > 0) calculatedCurrents.secondary = P / U2;
      formulas.push('I₁ = P ÷ U₁');
      formulas.push('I₂ = P ÷ U₂');
    } else if (mode === 'current') {
      // Известны токи
      if (I1 > 0 && U1 > 0) calculatedPower = I1 * U1 * η;
      if (I2 > 0 && U2 > 0) calculatedPower = I2 * U2;
      calculatedCurrents = { primary: I1, secondary: I2 };
    } else {
      // Режим по напряжению - рассчитываем из предполагаемой мощности
      calculatedPower = 100; // предположим 100 ВА
      if (U1 > 0) calculatedCurrents.primary = calculatedPower / U1;
      if (U2 > 0) calculatedCurrents.secondary = calculatedPower / U2;
    }

    // 4. Расчет диаметра провода
    // Плотность тока: 2-3 А/мм² для трансформаторов
    const currentDensity = 2.5; // А/мм²
    if (calculatedCurrents.primary > 0) {
      const wireAreaPrimary = calculatedCurrents.primary / currentDensity; // мм²
      wireDiameter.primary = 2 * Math.sqrt(wireAreaPrimary / Math.PI);
    }
    if (calculatedCurrents.secondary > 0) {
      const wireAreaSecondary = calculatedCurrents.secondary / currentDensity; // мм²
      wireDiameter.secondary = 2 * Math.sqrt(wireAreaSecondary / Math.PI);
    }
    formulas.push('d = 2 × √(I ÷ (J × π))');

    // Проверки и предупреждения
    if (turnsRatio < 0.1 || turnsRatio > 100) {
      warnings.push('⚠️ Очень большой коэффициент трансформации - сложная конструкция');
    }

    if (primaryTurns < 100) {
      warnings.push('⚠️ Мало витков на первичной обмотке - большой ток намагничивания');
    }

    if (primaryTurns > 5000) {
      warnings.push('⚠️ Очень много витков - большой расход провода, высокое сопротивление');
    }

    if (calculatedPower > 0 && S > 0) {
      const specificLoad = calculatedPower / S; // ВА/см²
      if (specificLoad > 10) {
        warnings.push('⚠️ Высокая нагрузка на сердечник - риск перегрева');
      } else if (specificLoad < 2) {
        warnings.push('💡 Низкая нагрузка - трансформатор будет работать в щадящем режиме');
      }
    }

    if (wireDiameter.primary < 0.1) {
      warnings.push('⚠️ Очень тонкий провод первичной обмотки - сложность намотки');
    }

    if (wireDiameter.secondary > 3) {
      warnings.push('⚠️ Очень толстый провод вторичной обмотки - сложность намотки');
    }

    if (f !== 50 && f !== 60) {
      warnings.push(`💡 Частота ${f} Гц - нестандартная, проверьте формулы`);
    }

    // Проверка мощности для выбранного сердечника
    const selectedCore = typicalCoreAreas.find(c => c.value === coreArea);
    if (selectedCore && calculatedPower > 0) {
      const maxPower = parseFloat(selectedCore.power.split(' ')[2]) || 0;
      if (calculatedPower > maxPower * 1.2) {
        warnings.push(`⚠️ Мощность ${calculatedPower.toFixed(0)} ВА превышает рекомендуемую ${maxPower} ВА для сердечника ${coreArea} см²`);
      }
    }

    setResult({
      turnsRatio,
      primaryTurns: Math.round(primaryTurns),
      secondaryTurns: Math.round(secondaryTurns),
      calculatedPower,
      calculatedCurrents,
      wireDiameter,
      warnings,
      formulas
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, primaryVoltage, secondaryVoltage, primaryCurrent, secondaryCurrent, power, coreArea, frequency, efficiency]);

  const resetCalculator = () => {
    setPrimaryVoltage('220');
    setSecondaryVoltage('12');
    setPrimaryCurrent('1');
    setSecondaryCurrent('10');
    setPower('100');
    setCoreArea('10');
    setFrequency('50');
    setEfficiency('0.85');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalVoltage = (value: string, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryVoltage(value);
    } else {
      setSecondaryVoltage(value);
    }
  };

  const selectTypicalPower = (value: string) => {
    setPower(value);
  };

  const selectCoreArea = (value: string) => {
    setCoreArea(value);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КАЛЬКУЛЯТОРА */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #334155'
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#f59e0b'
            }}>
              ⚡ Сетевой трансформатор
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт параметров силового трансформатора
            </p>
          </div>

          {/* Кнопки навигации */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <a 
              href="/elektrotekhnika"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#334155',
                color: '#38bdf8',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: '1px solid #475569',
                textAlign: 'center'
              }}
            >
              ← В каталог
            </a>
            
            <button
              onClick={resetCalculator}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f59e0b',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Выбор режима */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Режим расчета
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setMode('voltage')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'voltage' ? '#f59e0b' : '#334155',
                  color: mode === 'voltage' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'voltage' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                По напряжению
              </button>
              
              <button
                type="button"
                onClick={() => setMode('current')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'current' ? '#f59e0b' : '#334155',
                  color: mode === 'current' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'current' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                По току
              </button>
              
              <button
                type="button"
                onClick={() => setMode('power')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'power' ? '#f59e0b' : '#334155',
                  color: mode === 'power' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'power' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                По мощности
              </button>
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Основные параметры
            </h3>
            
            {/* Напряжения */}
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: '12px', 
  marginBottom: '20px',
  width: '100%'
}}>
  <div>
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      marginBottom: '6px'
    }}>
      <label style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 'bold' }}>
        Первичное U₁
      </label>
      <span style={{ fontSize: '10px', color: '#94a3b8' }}>Входное (В)</span>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
      {typicalVoltages.slice(2, 5).map((volt) => (
        <button
          key={volt.value}
          type="button"
          onClick={() => selectTypicalVoltage(volt.value, true)}
          style={{
            padding: '4px 2px',
            backgroundColor: primaryVoltage === volt.value ? '#f59e0b' : '#334155',
            color: primaryVoltage === volt.value ? '#0f172a' : 'white',
            border: `1px solid ${primaryVoltage === volt.value ? '#f59e0b' : '#475569'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            textAlign: 'center',
            lineHeight: '1.2'
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{volt.label}</div>
        </button>
      ))}
    </div>
    
    <input
      type="number"
      step="1"
      value={primaryVoltage}
      onChange={(e) => setPrimaryVoltage(e.target.value)}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        backgroundColor: '#334155',
        border: '1px solid #475569',
        color: 'white',
        fontSize: '14px',
        boxSizing: 'border-box'
      }}
      placeholder="220"
    />
  </div>
  
  <div>
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      marginBottom: '6px'
    }}>
      <label style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 'bold' }}>
        Вторичное U₂
      </label>
      <span style={{ fontSize: '10px', color: '#94a3b8' }}>Выходное (В)</span>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
      {typicalVoltages.slice(0, 3).map((volt) => (
        <button
          key={volt.value}
          type="button"
          onClick={() => selectTypicalVoltage(volt.value, false)}
          style={{
            padding: '4px 2px',
            backgroundColor: secondaryVoltage === volt.value ? '#f59e0b' : '#334155',
            color: secondaryVoltage === volt.value ? '#0f172a' : 'white',
            border: `1px solid ${secondaryVoltage === volt.value ? '#f59e0b' : '#475569'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            textAlign: 'center',
            lineHeight: '1.2'
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{volt.label}</div>
        </button>
      ))}
    </div>
    
    <input
      type="number"
      step="0.1"
      value={secondaryVoltage}
      onChange={(e) => setSecondaryVoltage(e.target.value)}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        backgroundColor: '#334155',
        border: '1px solid #475569',
        color: 'white',
        fontSize: '14px',
        boxSizing: 'border-box'
      }}
      placeholder="12"
    />
  </div>
</div>
            {/* Токи (если режим по току) */}
            {mode === 'current' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Первичный ток (А)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={primaryCurrent}
                    onChange={(e) => setPrimaryCurrent(e.target.value)}
                    style={{
                      width: '90%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 1"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Вторичный ток (А)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={secondaryCurrent}
                    onChange={(e) => setSecondaryCurrent(e.target.value)}
                    style={{
                      width: '90%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 10"
                  />
                </div>
              </div>
            )}

            {/* Мощность (если режим по мощности) */}
            {mode === 'power' && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ color: '#cbd5e1' }}>Мощность трансформатора (ВА)</label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  {typicalPowers.map((pwr) => (
                    <button
                      key={pwr.value}
                      type="button"
                      onClick={() => selectTypicalPower(pwr.value)}
                      style={{
                        padding: '6px 2px',
                        backgroundColor: power === pwr.value ? '#f59e0b' : '#334155',
                        color: power === pwr.value ? '#0f172a' : 'white',
                        border: `1px solid ${power === pwr.value ? '#f59e0b' : '#475569'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{pwr.label}</div>
                      <div style={{ fontSize: '8px', opacity: 0.8 }}>{pwr.desc}</div>
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step="1"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  style={{
                    width: '90%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Например: 100"
                />
              </div>
            )}
          </div>

          {/* Параметры сердечника */}
          <div style={{ 
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#f59e0b', marginBottom: '16px', fontSize: '18px' }}>
              🔲 Параметры сердечника
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1' }}>Площадь сечения сердечника (см²)</label>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {typicalCoreAreas.map((core) => (
                  <button
                    key={core.value}
                    type="button"
                    onClick={() => selectCoreArea(core.value)}
                    style={{
                      padding: '8px 4px',
                      backgroundColor: coreArea === core.value ? '#f59e0b' : '#334155',
                      color: coreArea === core.value ? '#0f172a' : 'white',
                      border: `1px solid ${coreArea === core.value ? '#f59e0b' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{core.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{core.power}</div>
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.1"
                value={coreArea}
                onChange={(e) => setCoreArea(e.target.value)}
                style={{
                  width: '90%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Например: 10"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Частота сети (Гц)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setFrequency('50')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: frequency === '50' ? '#f59e0b' : '#334155',
                      color: frequency === '50' ? '#0f172a' : 'white',
                      border: `1px solid ${frequency === '50' ? '#f59e0b' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    50 Гц
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('60')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: frequency === '60' ? '#f59e0b' : '#334155',
                      color: frequency === '60' ? '#0f172a' : 'white',
                      border: `1px solid ${frequency === '60' ? '#f59e0b' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    60 Гц
                  </button>
                </div>
                <input
                  type="number"
                  step="1"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px',
                    marginTop: '8px'
                  }}
                  placeholder="Например: 50"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  КПД трансформатора
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="0.5"
                    max="0.98"
                    step="0.01"
                    value={efficiency}
                    onChange={(e) => setEfficiency(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <span style={{ 
                    minWidth: '50px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                    fontSize: '16px'
                  }}>
                    {(parseFloat(efficiency) * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  color: '#64748b',
                  fontSize: '12px'
                }}>
                  <span>50% (плохо)</span>
                  <span>98% (отлично)</span>
                </div>
              </div>
            </div>
          </div>

          {/* РЕЗУЛЬТАТЫ */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #334155',
            marginBottom: '20px'
          }}>
            {result ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  {/* Основные результаты */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
                      k = {result.turnsRatio.toFixed(2)}
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                      Коэффициент трансформации
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
                        {result.primaryTurns} вит.
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Первичная обмотка</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                        {result.secondaryTurns} вит.
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Вторичная обмотка</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                        {result.calculatedPower.toFixed(1)} ВА
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Мощность</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px' }}>
                        {(result.calculatedPower / parseFloat(coreArea)).toFixed(1)} ВА/см²
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Нагрузка сердечника</div>
                    </div>
                  </div>
                  
                  {/* Токи и провода */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px'
                  }}>
                    <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
                      📊 Токи и диаметры проводов
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <div style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px' }}>
                          <strong>Первичная обмотка:</strong>
                        </div>
                        <div style={{ color: '#3b82f6' }}>Ток: {result.calculatedCurrents.primary.toFixed(2)} А</div>
                        <div style={{ color: '#10b981' }}>Диаметр провода: {result.wireDiameter.primary.toFixed(2)} мм</div>
                      </div>
                      
                      <div>
                        <div style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px' }}>
                          <strong>Вторичная обмотка:</strong>
                        </div>
                        <div style={{ color: '#3b82f6' }}>Ток: {result.calculatedCurrents.secondary.toFixed(2)} А</div>
                        <div style={{ color: '#10b981' }}>Диаметр провода: {result.wireDiameter.secondary.toFixed(2)} мм</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Формулы */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px'
                  }}>
                    <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                      📝 Используемые формулы:
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                      {result.formulas.map((formula, index) => (
                        <div key={index} style={{ marginBottom: '4px', fontFamily: 'monospace' }}>
                          • {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Предупреждения */}
                  {result.warnings.length > 0 && (
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '16px',
                      backgroundColor: '#431407',
                      borderRadius: '8px',
                      border: '1px solid #ef4444'
                    }}>
                      <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '8px' }}>
                        ⚠️ Внимание
                      </div>
                      <div style={{ color: '#fca5a5', fontSize: '14px' }}>
                        {result.warnings.map((warning, index) => (
                          <div key={index} style={{ marginBottom: '4px' }}>• {warning}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    const text = `Трансформатор: ${primaryVoltage}В→${secondaryVoltage}В, k=${result.turnsRatio.toFixed(2)}, N₁=${result.primaryTurns}, N₂=${result.secondaryTurns}, P=${result.calculatedPower.toFixed(1)}ВА`;
                    navigator.clipboard.writeText(text);
                    alert('Результаты скопированы!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f59e0b',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    width: '100%'
                  }}
                >
                  📋 Копировать результаты
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚡</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры трансформатора
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите напряжения, мощность или токи, и параметры сердечника
                </div>
              </div>
            )}
          </div>

          {/* Формула */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              N = U × 10⁴ / (4.44 × f × B × S)
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основная формула для расчета количества витков
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#f59e0b' }}>
            Теория: Сетевые трансформаторы
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>📏 Основные формулы</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Коэффициент трансформации:</strong> k = U₁ ÷ U₂ = N₁ ÷ N₂</p>
              <p><strong>Количество витков:</strong> N = U × 10⁴ / (4.44 × f × B × S)</p>
              <p><strong>Мощность:</strong> P = U₁ × I₁ × η ≈ U₂ × I₂</p>
              <p><strong>Диаметр провода:</strong> d = 2 × √(I ÷ (J × π))</p>
              <p>где: B = 1.2 Тл (индукция), J = 2.5 А/мм² (плотность тока)</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>🧲 Параметры сердечника</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Ш-образный (ШЛ)</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Площадь: S = a × b<br/>
                  Стандартные: 5, 10, 20, 40 см²
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Тороидальный</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Площадь: S = (D - d)/2 × h<br/>
                  Высокий КПД, сложная намотка
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Броневой</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Площадь: S = a × b<br/>
                  Простая конструкция, средний КПД
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Стержневой</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Площадь: S = a × b<br/>
                  Хорошее охлаждение, для мощных
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>⚡ Практические примеры</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Блок питания 12В/10А</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  220В→12В, P=120 ВА<br/>
                  Сердечник: 15-20 см²<br/>
                  N₁≈1000, N₂≈55
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Зарядное устройство</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  220В→36В, P=180 ВА<br/>
                  Сердечник: 20-25 см²<br/>
                  N₁≈1000, N₂≈164
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Аудио трансформатор</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  220В→2×15В, P=50 ВА<br/>
                  Сердечник: 8-10 см²<br/>
                  Высокие требования к качеству
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Изолирующий 1:1</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  220В→220В, P=100 ВА<br/>
                  Сердечник: 10-12 см²<br/>
                  N₁=N₂≈1000
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '8px' }}>💡 Практические советы</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Площадь сердечника:</strong> 1 см² на 8-10 ВА мощности (50 Гц)</p>
              <p>• <strong>Количество витков:</strong> 4-6 витков на вольт для 50 Гц</p>
              <p>• <strong>Диаметр провода:</strong> 0.7-0.8 мм на 1 А тока (медь)</p>
              <p>• <strong>Изоляция:</strong> между слоями - кабельная бумага, между обмотками - лавсан</p>
              <p>• <strong>Пропитка:</strong> обязательна для защиты от влаги и улучшения охлаждения</p>
              <p>• <strong>Тестирование:</strong> проверка на КЗ, измерение тока холостого хода (3-8% от Iном)</p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>⚠️ Меры безопасности</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Сетевые обмотки</strong> работают под опасным напряжением 220/380В!</p>
              <p>• <strong>Изоляция</strong> должна выдерживать 1500-2000В испытательного напряжения</p>
              <p>• <strong>Защитное заземление</strong> корпуса обязательно для металлических трансформаторов</p>
              <p>• <strong>Плавкие предохранители</strong> на первичной стороне - обязательны!</p>
              <p>• <strong>Перегрев:</strong> температура не должна превышать 105°C (класс A)</p>
              <p>• <strong>Проверка на КЗ</strong> перед включением в сеть - обязательно!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}