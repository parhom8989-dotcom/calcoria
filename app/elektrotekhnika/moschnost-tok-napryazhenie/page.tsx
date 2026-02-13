// app/elektrotekhnika/moschnost-tok-napryazhenie/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function MoschnostTokNapryazheniePage() {
  // Режим работы
  const [mode, setMode] = useState<string>('dc');
  const [phaseType, setPhaseType] = useState<string>('1ph'); // '1ph' или '3ph'
  
  // Входные параметры
  const [inputType, setInputType] = useState<string>('power-voltage');
  const [power, setPower] = useState<string>('2200');
  const [voltage, setVoltage] = useState<string>('380');
  const [current, setCurrent] = useState<string>('4.2');
  const [resistance, setResistance] = useState<string>('10');
  
  // Параметры AC
  const [powerFactor, setPowerFactor] = useState<string>('0.85');
  const [efficiency, setEfficiency] = useState<string>('0.85');
  
  // Единицы измерения
  const [powerUnit, setPowerUnit] = useState<string>('W');
  const [voltageUnit, setVoltageUnit] = useState<string>('V');
  const [currentUnit, setCurrentUnit] = useState<string>('A');
  
  // Результаты
  const [result, setResult] = useState<{
    power: number;
    voltage: number;
    current: number;
    resistance: number;
    formulas: string[];
    warnings: string[];
    acParams?: {
      apparentPower: number;
      reactivePower: number;
      powerFactorValue: number;
      phaseAngle: number;
      efficiency: number;
      calculatedPower: number; // P = √3 × V × I × cos φ × η для 3ph
    };
  } | null>(null);

  // Типы расчетов
  const calculationTypes = [
    { id: 'power-voltage', name: 'P, V → I, R', icon: '⚡', desc: 'Мощность и напряжение' },
    { id: 'power-current', name: 'P, I → V, R', icon: '🔋', desc: 'Мощность и ток' },
    { id: 'voltage-current', name: 'V, I → P, R', icon: '🌀', desc: 'Напряжение и ток' },
    { id: 'power-resistance', name: 'P, R → V, I', icon: '💎', desc: 'Мощность и сопротивление' },
  ];

  // Типовые значения для быстрого выбора
  const typicalVoltages = [
    { value: '12', label: '12В (авто)', desc: 'Автомобильная сеть' },
    { value: '24', label: '24В (пром)', desc: 'Промышленность' },
    { value: '220', label: '220В (1ф)', desc: 'Бытовая сеть' },
    { value: '380', label: '380В (3ф)', desc: 'Трёхфазная сеть' },
  ];

  const typicalPowerFactors = [
    { value: '1.0', label: '1.0', desc: 'Нагреватели, лампы' },
    { value: '0.95', label: '0.95', desc: 'Компьютеры, ИБП' },
    { value: '0.85', label: '0.85', desc: 'Электродвигатели' },
    { value: '0.75', label: '0.75', desc: 'Трансформаторы' },
  ];

  const typicalEfficiencies = [
    { value: '0.95', label: '0.95', desc: 'Высокий КПД' },
    { value: '0.88', label: '0.88', desc: 'Стандартный' },
    { value: '0.85', label: '0.85', desc: 'Двигатели' },
    { value: '0.75', label: '0.75', desc: 'Старые модели' },
  ];

  // Конвертация в базовые единицы
  const toBase = (value: number, unit: string, type: 'power' | 'voltage' | 'current'): number => {
    const multipliers: Record<string, number> = {
      'W': 1, 'kW': 1000, 'mW': 0.001,
      'V': 1, 'kV': 1000, 'mV': 0.001,
      'A': 1, 'mA': 0.001, 'μA': 0.000001
    };
    return value * (multipliers[unit] || 1);
  };

  // Форматирование результата
  const formatResult = (value: number, type: 'power' | 'voltage' | 'current' | 'resistance'): string => {
    let result = Math.abs(value);
    let unit = '';
    
    if (type === 'power') {
      if (result >= 1000) {
        result = value / 1000;
        unit = ' кВт';
      } else if (result < 0.1 && result > 0) {
        result = value * 1000;
        unit = ' мВт';
      } else {
        unit = ' Вт';
      }
    } else if (type === 'voltage') {
      if (result >= 1000) {
        result = value / 1000;
        unit = ' кВ';
      } else if (result < 0.1 && result > 0) {
        result = value * 1000;
        unit = ' мВ';
      } else {
        unit = ' В';
      }
    } else if (type === 'current') {
      if (result >= 1) {
        unit = ' А';
      } else if (result >= 0.001) {
        result = value * 1000;
        unit = ' мА';
      } else {
        result = value * 1000000;
        unit = ' мкА';
      }
    } else if (type === 'resistance') {
      if (result >= 1000000) {
        result = value / 1000000;
        unit = ' МΩ';
      } else if (result >= 1000) {
        result = value / 1000;
        unit = ' кΩ';
      } else {
        unit = ' Ω';
      }
    }
    
    return result.toFixed(3) + unit;
  };

  // Расчет
  const calculate = () => {
    const P = toBase(parseFloat(power) || 0, powerUnit, 'power');
    const V = toBase(parseFloat(voltage) || 0, voltageUnit, 'voltage');
    const I = toBase(parseFloat(current) || 0, currentUnit, 'current');
    const R = parseFloat(resistance) || 0;
    const pf = Math.max(0.1, Math.min(1, parseFloat(powerFactor) || 1));
    const η = Math.max(0.1, Math.min(1, parseFloat(efficiency) || 1));

    let calculatedP = P;
    let calculatedV = V;
    let calculatedI = I;
    let calculatedR = R;
    const formulas: string[] = [];
    const warnings: string[] = [];

    // DC расчеты
    if (mode === 'dc') {
      switch (inputType) {
        case 'power-voltage':
          if (P > 0 && V > 0) {
            calculatedI = P / V;
            calculatedR = V / calculatedI;
            formulas.push('I = P ÷ V', 'R = V ÷ I');
          }
          break;
          
        case 'power-current':
          if (P > 0 && I > 0) {
            calculatedV = P / I;
            calculatedR = calculatedV / I;
            formulas.push('V = P ÷ I', 'R = V ÷ I');
          }
          break;
          
        case 'voltage-current':
          if (V > 0 && I > 0) {
            calculatedP = V * I;
            calculatedR = V / I;
            formulas.push('P = V × I', 'R = V ÷ I');
          }
          break;
          
        case 'power-resistance':
          if (P > 0 && R > 0) {
            calculatedI = Math.sqrt(P / R);
            calculatedV = calculatedI * R;
            formulas.push('I = √(P ÷ R)', 'V = I × R');
          }
          break;
      }
    } else {
      // AC расчеты
      const sqrt3 = 1.73205080757; // √3
      
      switch (inputType) {
        case 'power-voltage':
          if (P > 0 && V > 0) {
            if (phaseType === '1ph') {
              // 1-фазный: P = V × I × cos φ × η
              calculatedI = P / (V * pf * η);
              formulas.push('I = P ÷ (V × cos φ × η)');
            } else {
              // 3-фазный: P = √3 × V × I × cos φ × η
              calculatedI = P / (sqrt3 * V * pf * η);
              formulas.push('I = P ÷ (√3 × V × cos φ × η)');
            }
            calculatedR = V / calculatedI;
            formulas.push('R = V ÷ I');
          }
          break;
          
        case 'power-current':
          if (P > 0 && I > 0) {
            if (phaseType === '1ph') {
              calculatedV = P / (I * pf * η);
              formulas.push('V = P ÷ (I × cos φ × η)');
            } else {
              calculatedV = P / (sqrt3 * I * pf * η);
              formulas.push('V = P ÷ (√3 × I × cos φ × η)');
            }
            calculatedR = calculatedV / I;
            formulas.push('R = V ÷ I');
          }
          break;
          
        case 'voltage-current':
          if (V > 0 && I > 0) {
            if (phaseType === '1ph') {
              calculatedP = V * I * pf * η;
              formulas.push('P = V × I × cos φ × η');
            } else {
              calculatedP = sqrt3 * V * I * pf * η;
              formulas.push('P = √3 × V × I × cos φ × η');
            }
            calculatedR = V / I;
            formulas.push('R = V ÷ I');
          }
          break;
          
        case 'power-resistance':
          if (P > 0 && R > 0) {
            calculatedI = Math.sqrt(P / R);
            calculatedV = calculatedI * R;
            formulas.push('I = √(P ÷ R)', 'V = I × R');
          }
          break;
      }
    }

    // Проверки и предупреждения
    if (calculatedI > 100) warnings.push('⚠️ Высокий ток! Проверьте сечение проводов');
    if (calculatedP > 10000) warnings.push('⚠️ Высокая мощность! Требуется проектирование');
    if (calculatedR < 0.01 && calculatedR > 0) warnings.push('⚠️ Очень низкое сопротивление');
    if (mode === 'ac') {
      if (pf < 0.7) warnings.push('⚠️ Низкий cos φ - большие потери в сети');
      if (η < 0.8) warnings.push('⚠️ Низкий КПД - неэффективное оборудование');
      if (phaseType === '3ph' && V < 300) warnings.push('⚠️ Для 3-фазных обычно 380В и выше');
    }

    // AC параметры
    let acParams = undefined;
    if (mode === 'ac' && calculatedV > 0 && calculatedI > 0) {
      let apparentPower = 0;
      if (phaseType === '1ph') {
        apparentPower = calculatedV * calculatedI;
      } else {
        apparentPower = 1.73205080757 * calculatedV * calculatedI;
      }
      
      const reactivePower = apparentPower * Math.sqrt(1 - pf * pf);
      const phaseAngle = Math.acos(pf) * 180 / Math.PI;
      const calculatedRealPower = apparentPower * pf * η;
      
      acParams = {
        apparentPower,
        reactivePower,
        powerFactorValue: pf,
        phaseAngle,
        efficiency: η,
        calculatedPower: calculatedRealPower
      };
    }

    setResult({
      power: calculatedP,
      voltage: calculatedV,
      current: calculatedI,
      resistance: calculatedR,
      formulas,
      warnings,
      acParams
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, phaseType, inputType, power, voltage, current, resistance, powerFactor, efficiency, powerUnit, voltageUnit, currentUnit]);

  const resetCalculator = () => {
    setPower('2200');
    setVoltage('380');
    setCurrent('4.2');
    setResistance('10');
    setPowerFactor('0.85');
    setEfficiency('0.85');
    setResult(null);
  };

  // Быстрый выбор типовых значений
  const selectTypicalVoltage = (value: string) => {
    setVoltage(value);
    if (value === '380') setPhaseType('3ph');
    if (value === '220') setPhaseType('1ph');
  };

  const selectTypicalPowerFactor = (value: string) => {
    setPowerFactor(value);
  };

  const selectTypicalEfficiency = (value: string) => {
    setEfficiency(value);
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
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#10b981'
            }}>
              ⚡ Калькулятор мощности, тока и напряжения
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт параметров электрических цепей постоянного и переменного тока (1-фазные и 3-фазные)
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
                textAlign: 'center',
                transition: 'all 0.3s ease'
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
                color: '#10b981',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Выбор режима */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Тип цепи
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setMode('dc')}
                style={{
                  padding: '16px',
                  backgroundColor: mode === 'dc' ? '#10b981' : '#334155',
                  color: 'white',
                  border: `2px solid ${mode === 'dc' ? '#10b981' : '#475569'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '16px'
                }}
              >
                🔋 Постоянный ток (DC)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('ac')}
                style={{
                  padding: '16px',
                  backgroundColor: mode === 'ac' ? '#10b981' : '#334155',
                  color: 'white',
                  border: `2px solid ${mode === 'ac' ? '#10b981' : '#475569'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '16px'
                }}
              >
                🔌 Переменный ток (AC)
              </button>
            </div>

            {/* Выбор фазы для AC */}
            {mode === 'ac' && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
                  Количество фаз
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setPhaseType('1ph')}
                    style={{
                      padding: '12px',
                      backgroundColor: phaseType === '1ph' ? '#3b82f6' : '#334155',
                      color: 'white',
                      border: `2px solid ${phaseType === '1ph' ? '#3b82f6' : '#475569'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    1-фазный
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPhaseType('3ph')}
                    style={{
                      padding: '12px',
                      backgroundColor: phaseType === '3ph' ? '#3b82f6' : '#334155',
                      color: 'white',
                      border: `2px solid ${phaseType === '3ph' ? '#3b82f6' : '#475569'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    3-фазный
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Выбор типа расчета */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Что известно?
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {calculationTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setInputType(type.id)}
                  style={{
                    padding: '12px 8px',
                    backgroundColor: inputType === type.id ? '#10b981' : '#334155',
                    color: 'white',
                    border: `2px solid ${inputType === type.id ? '#10b981' : '#475569'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{type.icon}</div>
                  <div>{type.name}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Введите известные значения
            </h3>
            
            {/* Быстрый выбор напряжения */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1' }}>
                  Напряжение (V)
                </label>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Быстрый выбор:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {typicalVoltages.map((volt) => (
                  <button
                    key={volt.value}
                    type="button"
                    onClick={() => selectTypicalVoltage(volt.value)}
                    style={{
                      padding: '8px 4px',
                      backgroundColor: voltage === volt.value ? '#3b82f6' : '#334155',
                      color: 'white',
                      border: `1px solid ${voltage === volt.value ? '#3b82f6' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{volt.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{volt.desc}</div>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  step="0.1"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Напряжение"
                />
                <select
                  value={voltageUnit}
                  onChange={(e) => setVoltageUnit(e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px',
                    minWidth: '80px'
                  }}
                >
                  <option value="V">В</option>
                  <option value="kV">кВ</option>
                </select>
              </div>
            </div>
            
            {/* Мощность */}
            <div style={{ 
              marginBottom: '16px',
              display: inputType === 'power-voltage' || inputType === 'power-current' || inputType === 'power-resistance' ? 'block' : 'none'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Мощность (P)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  step="0.1"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Мощность"
                />
                <select
                  value={powerUnit}
                  onChange={(e) => setPowerUnit(e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px',
                    minWidth: '80px'
                  }}
                >
                  <option value="W">Вт</option>
                  <option value="kW">кВт</option>
                </select>
              </div>
            </div>
            
            {/* Ток */}
            <div style={{ 
              marginBottom: '16px',
              display: inputType === 'power-current' || inputType === 'voltage-current' ? 'block' : 'none'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Ток (I)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  step="0.01"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Ток"
                />
                <select
                  value={currentUnit}
                  onChange={(e) => setCurrentUnit(e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px',
                    minWidth: '80px'
                  }}
                >
                  <option value="A">А</option>
                  <option value="mA">мА</option>
                </select>
              </div>
            </div>
            
            {/* Сопротивление */}
            <div style={{ 
              marginBottom: '16px',
              display: inputType === 'power-resistance' ? 'block' : 'none'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Сопротивление (R)
              </label>
              <input
                type="number"
                step="0.1"
                value={resistance}
                onChange={(e) => setResistance(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Сопротивление"
              />
            </div>

            {/* Параметры AC */}
            {mode === 'ac' && (
              <div style={{ 
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#0f172a',
                borderRadius: '8px'
              }}>
                <h3 style={{ color: '#3b82f6', marginBottom: '16px', fontSize: '16px' }}>
                  🔌 Параметры переменного тока
                </h3>
                
                {/* Коэффициент мощности */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>
                      Коэффициент мощности (cos φ)
                    </label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalPowerFactors.map((pf) => (
                      <button
                        key={pf.value}
                        type="button"
                        onClick={() => selectTypicalPowerFactor(pf.value)}
                        style={{
                          padding: '8px 4px',
                          backgroundColor: powerFactor === pf.value ? '#10b981' : '#334155',
                          color: 'white',
                          border: `1px solid ${powerFactor === pf.value ? '#10b981' : '#475569'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{pf.label}</div>
                        <div style={{ fontSize: '10px', opacity: 0.8 }}>{pf.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.01"
                      value={powerFactor}
                      onChange={(e) => setPowerFactor(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <span style={{ 
                      minWidth: '60px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#10b981',
                      fontSize: '18px'
                    }}>
                      {powerFactor}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    color: '#64748b',
                    fontSize: '12px'
                  }}>
                    <span>0.1 (плохо)</span>
                    <span>1.0 (идеально)</span>
                  </div>
                </div>
                
                {/* КПД */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>
                      Коэффициент полезного действия (КПД, η)
                    </label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Для двигателей:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalEfficiencies.map((eff) => (
                      <button
                        key={eff.value}
                        type="button"
                        onClick={() => selectTypicalEfficiency(eff.value)}
                        style={{
                          padding: '8px 4px',
                          backgroundColor: efficiency === eff.value ? '#f59e0b' : '#334155',
                          color: 'white',
                          border: `1px solid ${efficiency === eff.value ? '#f59e0b' : '#475569'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{eff.label}</div>
                        <div style={{ fontSize: '10px', opacity: 0.8 }}>{eff.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.01"
                      value={efficiency}
                      onChange={(e) => setEfficiency(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <span style={{ 
                      minWidth: '60px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                      fontSize: '18px'
                    }}>
                      {efficiency}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    color: '#64748b',
                    fontSize: '12px'
                  }}>
                    <span>0.1 (низкий)</span>
                    <span>1.0 (высокий)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #334155',
            marginBottom: '20px'
          }}>
            {result ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '20px', color: '#10b981', marginBottom: '16px', fontWeight: 'bold' }}>
                    Результаты расчета
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
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                        {formatResult(result.power, 'power')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Мощность (P)</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
                        {formatResult(result.voltage, 'voltage')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Напряжение (V)</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                        {formatResult(result.current, 'current')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Ток (I)</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px' }}>
                        {formatResult(result.resistance, 'resistance')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Сопротивление (R)</div>
                    </div>
                  </div>

                  {/* AC параметры */}
                  {mode === 'ac' && result.acParams && (
                    <div style={{ 
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '20px',
                      textAlign: 'left'
                    }}>
                      <div style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
                        🔌 Параметры переменного тока
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>Полная мощность (S):</div>
                          <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                            {formatResult(result.acParams.apparentPower, 'power')}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>Реактивная мощность (Q):</div>
                          <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                            {formatResult(result.acParams.reactivePower, 'power')}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>Коэффициент мощности:</div>
                          <div style={{ color: '#ef4444', fontWeight: 'bold' }}>
                            {result.acParams.powerFactorValue.toFixed(3)}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>Фазовый угол (φ):</div>
                          <div style={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                            {result.acParams.phaseAngle.toFixed(1)}°
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        backgroundColor: '#0f172a',
                        padding: '12px',
                        borderRadius: '6px',
                        marginTop: '8px'
                      }}>
                        <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                          <strong>Расчетная активная мощность:</strong>{' '}
                          <span style={{ color: '#f59e0b' }}>
                            {formatResult(result.acParams.calculatedPower, 'power')}
                          </span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                          P = {phaseType === '1ph' ? 'V × I × cos φ × η' : '√3 × V × I × cos φ × η'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Формулы */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px'
                  }}>
                    <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                      📝 Использованные формулы:
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                      {result.formulas.map((formula, index) => (
                        <div key={index} style={{ marginBottom: '4px' }}>• {formula}</div>
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
                    const text = `P=${formatResult(result.power, 'power')}, V=${formatResult(result.voltage, 'voltage')}, I=${formatResult(result.current, 'current')}, R=${formatResult(result.resistance, 'resistance')}`;
                    navigator.clipboard.writeText(text);
                    alert('Результаты скопированы!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#10b981',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                >
                  📋 Копировать результаты
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚡</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Выберите тип цепи и известные параметры
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
            <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              {mode === 'dc' 
                ? 'P = V × I' 
                : phaseType === '1ph' 
                  ? 'P = V × I × cos φ × η' 
                  : 'P = √3 × V × I × cos φ × η'
              }
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              {mode === 'dc' 
                ? 'Основная формула мощности для DC' 
                : phaseType === '1ph' 
                  ? 'Активная мощность для 1-фазного AC' 
                  : 'Активная мощность для 3-фазного AC'
              }
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#10b981' }}>
            Теория: Мощность, ток и напряжение
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>🔋 Постоянный ток (DC)</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Закон Ома:</strong> V = I × R</p>
                <p>• <strong>Мощность:</strong> P = V × I = I² × R = V² ÷ R</p>
                <p>• Все величины постоянны во времени</p>
                <p>• Применение: батареи, блоки питания, электроника</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>🔌 1-фазный переменный ток</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Активная мощность:</strong> P = V × I × cos φ × η (Вт)</p>
                <p>• <strong>Полная мощность:</strong> S = V × I (ВА)</p>
                <p>• <strong>Реактивная мощность:</strong> Q = V × I × sin φ (ВАр)</p>
                <p>• <strong>Напряжение:</strong> 220В (бытовое), 110В (США)</p>
                <p>• Применение: розетки дома, мелкая бытовая техника</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>🔌 3-фазный переменный ток</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Активная мощность:</strong> P = √3 × V × I × cos φ × η</p>
                <p>• <strong>Полная мощность:</strong> S = √3 × V × I</p>
                <p>• <strong>√3 ≈ 1.732</strong> (корень из 3)</p>
                <p>• <strong>Напряжение:</strong> 380В (линейное), 220В (фазное)</p>
                <p>• Применение: двигатели, станки, промышленное оборудование</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#10b981' }}>📊 Примеры расчетов</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>Лампочка 100Вт/220В</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                cos φ = 1, η = 1<br/>
                I = 100 ÷ 220 = 0.45А
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>Двигатель 2.2кВт/380В</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                cos φ = 0.85, η = 0.85<br/>
                I = 2200 ÷ (1.732×380×0.85×0.85) ≈ 4.6А
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>Обогреватель 1.5кВт/220В</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                cos φ = 1, η = 1<br/>
                I = 1500 ÷ 220 = 6.82А
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>Трансформатор 10кВА/380В</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                S = 10000ВА, cos φ = 0.8<br/>
                I = 10000 ÷ (1.732×380) = 15.2А
              </div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '8px' }}>⚡ Практические советы</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Сечение провода:</strong> 1мм² меди ≈ 10А, 1.5мм² ≈ 16А, 2.5мм² ≈ 25А</p>
              <p>• <strong>Автоматический выключатель:</strong> выбирайте на 20-30% больше расчётного тока</p>
              <p>• <strong>Коэффициент мощности:</strong> чем ближе к 1, тем меньше потери в сети</p>
              <p>• <strong>Для двигателей:</strong> пусковой ток в 5-7 раз больше номинального</p>
              <p>• <strong>3-фазные цепи:</strong> более эффективны для мощного оборудования</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}