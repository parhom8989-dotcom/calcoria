// app/elektrotekhnika/delitel-napryazheniya/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function DelitelNapryazheniyaPage() {
  // Параметры ввода
  const [inputVoltage, setInputVoltage] = useState<string>('12');
  const [r1Value, setR1Value] = useState<string>('1000');
  const [r2Value, setR2Value] = useState<string>('1000');
  const [outputVoltage, setOutputVoltage] = useState<string>('');
  
  // Единицы измерения
  const [voltageUnit, setVoltageUnit] = useState<string>('V');
  const [r1Unit, setR1Unit] = useState<string>('Ω');
  const [r2Unit, setR2Unit] = useState<string>('Ω');
  const [outputUnit, setOutputUnit] = useState<string>('V');
  
  // Режим расчёта
  const [calculationMode, setCalculationMode] = useState<'vout' | 'r1' | 'r2'>('vout');
  
  // Результаты
  const [result, setResult] = useState<{
    calculatedValue: number;
    unit: string;
    formula: string;
    explanation: string;
    current: number;
    powerR1: number;
    powerR2: number;
    nearestE24: string[];
    voltageError: number;
  } | null>(null);
  
  // Стандартный ряд E24
  const e24Series = [
    1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
    3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
    10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30,
    33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91,
    100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300,
    330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910,
    1000, 1100, 1200, 1300, 1500, 1600, 1800, 2000, 2200, 2400, 2700, 3000,
    3300, 3600, 3900, 4300, 4700, 5100, 5600, 6200, 6800, 7500, 8200, 9100,
    10000, 11000, 12000, 13000, 15000, 16000, 18000, 20000, 22000, 24000, 27000, 30000,
    33000, 36000, 39000, 43000, 47000, 51000, 56000, 62000, 68000, 75000, 82000, 91000,
    100000, 110000, 120000, 130000, 150000, 160000, 180000, 200000, 220000, 240000, 270000, 300000,
    330000, 360000, 390000, 430000, 470000, 510000, 560000, 620000, 680000, 750000, 820000, 910000,
    1000000, 1100000, 1200000, 1300000, 1500000, 1600000, 1800000, 2000000, 2200000, 2400000, 2700000, 3000000,
    3300000, 3600000, 3900000, 4300000, 4700000, 5100000, 5600000, 6200000, 6800000, 7500000, 8200000, 9100000,
    10000000
  ];
  
  // Конвертация в базовые единицы (Омы, Вольты)
  const convertToBase = (value: string, unit: string, type: 'resistance' | 'voltage'): number => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return NaN;
    
    switch (type) {
      case 'voltage':
        switch (unit) {
          case 'mV': return numValue / 1000;
          case 'V': return numValue;
          case 'kV': return numValue * 1000;
          default: return numValue;
        }
      case 'resistance':
        switch (unit) {
          case 'Ω': return numValue;
          case 'kΩ': return numValue * 1000;
          case 'MΩ': return numValue * 1000000;
          default: return numValue;
        }
      default:
        return numValue;
    }
  };
  
  // Конвертация из базовых единиц
  const convertFromBase = (value: number, unit: string, type: 'resistance' | 'voltage'): number => {
    if (isNaN(value)) return NaN;
    
    switch (type) {
      case 'voltage':
        switch (unit) {
          case 'mV': return value * 1000;
          case 'V': return value;
          case 'kV': return value / 1000;
          default: return value;
        }
      case 'resistance':
        switch (unit) {
          case 'Ω': return value;
          case 'kΩ': return value / 1000;
          case 'MΩ': return value / 1000000;
          default: return value;
        }
      default:
        return value;
    }
  };
  
  // Найти ближайший стандартный резистор
  const findNearestResistor = (value: number): string => {
    const nearest = e24Series.reduce((prev, curr) => {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
    
    // Форматирование вывода
    if (nearest >= 1000000) return `${(nearest / 1000000).toFixed(2)} MΩ`;
    if (nearest >= 1000) return `${(nearest / 1000).toFixed(2)} kΩ`;
    return `${nearest} Ω`;
  };
  
  // Расчёт
  const calculate = () => {
    const Vin = convertToBase(inputVoltage, voltageUnit, 'voltage');
    const R1 = convertToBase(r1Value, r1Unit, 'resistance');
    const R2 = convertToBase(r2Value, r2Unit, 'resistance');
    const VoutDesired = convertToBase(outputVoltage, outputUnit, 'voltage');
    
    let calculatedValue = 0;
    let targetUnit = '';
    let formula = '';
    let explanation = '';
    let current = 0;
    let powerR1 = 0;
    let powerR2 = 0;
    let voltageError = 0;
    let nearestResistors: string[] = [];
    
    if (calculationMode === 'vout') {
      // Расчёт выходного напряжения: Vout = Vin × R2 / (R1 + R2)
      if (!isNaN(Vin) && !isNaN(R1) && !isNaN(R2) && R1 + R2 !== 0) {
        calculatedValue = Vin * R2 / (R1 + R2);
        targetUnit = voltageUnit;
        formula = 'Vout = Vin × R2 ÷ (R1 + R2)';
        explanation = `${inputVoltage}${voltageUnit} × ${r2Value}${r2Unit} ÷ (${r1Value}${r1Unit} + ${r2Value}${r2Unit})`;
        
        // Ток через делитель
        current = Vin / (R1 + R2);
        
        // Мощности на резисторах
        powerR1 = current * current * R1;
        powerR2 = current * current * R2;
        
        // Ближайшие стандартные резисторы
        nearestResistors = [
          findNearestResistor(R1),
          findNearestResistor(R2)
        ];
        
        setResult({
          calculatedValue: convertFromBase(calculatedValue, voltageUnit, 'voltage'),
          unit: voltageUnit,
          formula,
          explanation,
          current: current * 1000, // в мА
          powerR1,
          powerR2,
          nearestE24: nearestResistors,
          voltageError: 0
        });
      } else {
        setResult(null);
      }
    } else if (calculationMode === 'r1') {
      // Расчёт R1: R1 = R2 × (Vin / Vout - 1)
      if (!isNaN(Vin) && !isNaN(VoutDesired) && !isNaN(R2) && VoutDesired > 0 && VoutDesired < Vin) {
        calculatedValue = R2 * (Vin / VoutDesired - 1);
        targetUnit = r1Unit;
        formula = 'R1 = R2 × (Vin ÷ Vout - 1)';
        explanation = `${r2Value}${r2Unit} × (${inputVoltage}${voltageUnit} ÷ ${outputVoltage}${outputUnit} - 1)`;
        
        // Ток через делитель
        current = Vin / (calculatedValue + R2);
        
        // Проверка на правильность
        const actualVout = Vin * R2 / (calculatedValue + R2);
        voltageError = Math.abs(actualVout - VoutDesired) / VoutDesired * 100;
        
        // Ближайший стандартный резистор
        nearestResistors = [findNearestResistor(calculatedValue)];
        
        setResult({
          calculatedValue: convertFromBase(calculatedValue, r1Unit, 'resistance'),
          unit: r1Unit,
          formula,
          explanation,
          current: current * 1000, // в мА
          powerR1: current * current * calculatedValue,
          powerR2: current * current * R2,
          nearestE24: nearestResistors,
          voltageError
        });
      } else {
        setResult(null);
      }
    } else if (calculationMode === 'r2') {
      // Расчёт R2: R2 = R1 × Vout / (Vin - Vout)
      if (!isNaN(Vin) && !isNaN(VoutDesired) && !isNaN(R1) && VoutDesired > 0 && VoutDesired < Vin) {
        calculatedValue = R1 * VoutDesired / (Vin - VoutDesired);
        targetUnit = r2Unit;
        formula = 'R2 = R1 × Vout ÷ (Vin - Vout)';
        explanation = `${r1Value}${r1Unit} × ${outputVoltage}${outputUnit} ÷ (${inputVoltage}${voltageUnit} - ${outputVoltage}${outputUnit})`;
        
        // Ток через делитель
        current = Vin / (R1 + calculatedValue);
        
        // Проверка на правильность
        const actualVout = Vin * calculatedValue / (R1 + calculatedValue);
        voltageError = Math.abs(actualVout - VoutDesired) / VoutDesired * 100;
        
        // Ближайший стандартный резистор
        nearestResistors = [findNearestResistor(calculatedValue)];
        
        setResult({
          calculatedValue: convertFromBase(calculatedValue, r2Unit, 'resistance'),
          unit: r2Unit,
          formula,
          explanation,
          current: current * 1000, // в мА
          powerR1: current * current * R1,
          powerR2: current * current * calculatedValue,
          nearestE24: nearestResistors,
          voltageError
        });
      } else {
        setResult(null);
      }
    }
  };
  
  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [inputVoltage, r1Value, r2Value, outputVoltage, voltageUnit, r1Unit, r2Unit, outputUnit, calculationMode]);
  
  // Сброс
  const resetCalculator = () => {
    setInputVoltage('12');
    setR1Value('1000');
    setR2Value('1000');
    setOutputVoltage('');
    setVoltageUnit('V');
    setR1Unit('Ω');
    setR2Unit('Ω');
    setOutputUnit('V');
    setCalculationMode('vout');
    setResult(null);
  };
  
  // Установка готовых схем
  const setPreset = (preset: '5v_to_3v3' | '12v_to_5v' | 'arduino_analog') => {
    switch (preset) {
      case '5v_to_3v3':
        setInputVoltage('5');
        setR1Value('2200');
        setR2Value('3300');
        setCalculationMode('vout');
        break;
      case '12v_to_5v':
        setInputVoltage('12');
        setR1Value('10000');
        setR2Value('7140');
        setCalculationMode('vout');
        break;
      case 'arduino_analog':
        setInputVoltage('5');
        setR1Value('10000');
        setR2Value('10000');
        setCalculationMode('vout');
        break;
    }
  };
  
  // Копирование
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Результат скопирован!');
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
              color: '#8b5cf6'
            }}>
              📊 Калькулятор делителя напряжения
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт резистивного делителя для понижения напряжения
            </p>
          </div>

          {/* Кнопки */}
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
                color: '#8b5cf6',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Готовые схемы */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Готовые схемы
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setPreset('5v_to_3v3')}
                style={{
                  padding: '12px',
                  backgroundColor: '#334155',
                  color: 'white',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                5В → 3.3В
              </button>
              
              <button
                onClick={() => setPreset('12v_to_5v')}
                style={{
                  padding: '12px',
                  backgroundColor: '#334155',
                  color: 'white',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                12В → 5В
              </button>
              
              <button
                onClick={() => setPreset('arduino_analog')}
                style={{
                  padding: '12px',
                  backgroundColor: '#334155',
                  color: 'white',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Arduino (½ напряжения)
              </button>
            </div>
          </div>

          {/* Выбор режима */}
<div style={{ marginBottom: '24px' }}>
  <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
    Что нужно рассчитать?
  </h3>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '20px',
    width: '100%'
  }}>
    <button
      onClick={() => setCalculationMode('vout')}
      style={{
        padding: '12px 4px',
        backgroundColor: calculationMode === 'vout' ? '#8b5cf6' : '#334155',
        color: 'white',
        border: `2px solid ${calculationMode === 'vout' ? '#8b5cf6' : '#475569'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'clamp(12px, 2.5vw, 16px)',
        textAlign: 'center',
        transition: 'all 0.3s',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div>Выходное</div>
      <div style={{ fontSize: 'clamp(10px, 2vw, 14px)', opacity: 0.9 }}>напряжение</div>
    </button>
    
    <button
      onClick={() => setCalculationMode('r1')}
      style={{
        padding: '12px 4px',
        backgroundColor: calculationMode === 'r1' ? '#8b5cf6' : '#334155',
        color: 'white',
        border: `2px solid ${calculationMode === 'r1' ? '#8b5cf6' : '#475569'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'clamp(12px, 2.5vw, 16px)',
        textAlign: 'center',
        transition: 'all 0.3s',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div>Резистор</div>
      <div style={{ fontSize: 'clamp(10px, 2vw, 14px)', opacity: 0.9 }}>R1</div>
    </button>
    
    <button
      onClick={() => setCalculationMode('r2')}
      style={{
        padding: '12px 4px',
        backgroundColor: calculationMode === 'r2' ? '#8b5cf6' : '#334155',
        color: 'white',
        border: `2px solid ${calculationMode === 'r2' ? '#8b5cf6' : '#475569'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'clamp(12px, 2.5vw, 16px)',
        textAlign: 'center',
        transition: 'all 0.3s',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div>Резистор</div>
      <div style={{ fontSize: 'clamp(10px, 2vw, 14px)', opacity: 0.9 }}>R2</div>
    </button>
  </div>
</div>

          {/* Параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Параметры делителя
            </h3>
            
            {/* Входное напряжение */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Входное напряжение (Vin)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  step="0.1"
                  value={inputVoltage}
                  onChange={(e) => setInputVoltage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
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
                  <option value="mV">мВ</option>
                  <option value="kV">кВ</option>
                </select>
              </div>
            </div>
            
            {/* Резистор R1 (скрыт при расчёте R1) */}
            {calculationMode !== 'r1' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Резистор R1
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    value={r1Value}
                    onChange={(e) => setR1Value(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  <select
                    value={r1Unit}
                    onChange={(e) => setR1Unit(e.target.value)}
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
                    <option value="Ω">Ω</option>
                    <option value="kΩ">kΩ</option>
                    <option value="MΩ">MΩ</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Резистор R2 (скрыт при расчёте R2) */}
            {calculationMode !== 'r2' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Резистор R2
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    value={r2Value}
                    onChange={(e) => setR2Value(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  <select
                    value={r2Unit}
                    onChange={(e) => setR2Unit(e.target.value)}
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
                    <option value="Ω">Ω</option>
                    <option value="kΩ">kΩ</option>
                    <option value="MΩ">MΩ</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Выходное напряжение (только при расчёте резисторов) */}
            {(calculationMode === 'r1' || calculationMode === 'r2') && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Желаемое выходное напряжение (Vout)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    step="0.01"
                    value={outputVoltage}
                    onChange={(e) => setOutputVoltage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  <select
                    value={outputUnit}
                    onChange={(e) => setOutputUnit(e.target.value)}
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
                    <option value="mV">мВ</option>
                  </select>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Должно быть меньше входного напряжения
                </p>
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
              <div style={{  }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                    {result.calculatedValue.toFixed(3)} <span style={{ fontSize: '20px' }}>{result.unit}</span>
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    {calculationMode === 'vout' ? 'Выходное напряжение' : 
                     calculationMode === 'r1' ? 'Значение резистора R1' : 
                     'Значение резистора R2'}
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
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
                      {result.current.toFixed(2)} мА
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Ток через делитель</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                      {(result.powerR1 + result.powerR2).toFixed(3)} Вт
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Общая мощность</div>
                  </div>
                </div>
                
                {/* Детали */}
                <div style={{ 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Формула:</span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: '#8b5cf620',
                      color: '#8b5cf6',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {result.formula}
                    </span>
                  </div>
                  
                  <div style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '12px' }}>
                    {result.explanation}
                  </div>
                  
                  {result.nearestE24.length > 0 && (
                    <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                      <div><strong>Ближайшие стандартные резисторы:</strong></div>
                      {result.nearestE24.map((resistor, index) => (
                        <div key={index}>• {resistor}</div>
                      ))}
                    </div>
                  )}
                  
                  {result.voltageError > 0 && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '10px',
                      backgroundColor: result.voltageError < 5 ? '#10b98120' : '#f59e0b20',
                      borderRadius: '6px',
                      color: result.voltageError < 5 ? '#10b981' : '#f59e0b'
                    }}>
                      <strong>Погрешность напряжения:</strong> {result.voltageError.toFixed(2)}%
                      {result.voltageError > 10 && " ⚠️ Слишком большая погрешность!"}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => copyToClipboard(`${result.calculatedValue.toFixed(3)} ${result.unit}`)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#8b5cf6',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                >
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>📊</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  {calculationMode === 'vout' ? 'Введите входное напряжение и резисторы' : 
                   calculationMode === 'r1' ? 'Введите Vin, Vout и R2' : 
                   'Введите Vin, Vout и R1'}
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
            <div style={{ color: '#8b5cf6', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              V<sub>out</sub> = V<sub>in</sub> × R<sub>2</sub> ÷ (R<sub>1</sub> + R<sub>2</sub>)
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основная формула резистивного делителя напряжения
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#8b5cf6' }}>
            Принцип работы делителя напряжения
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.6' }}>
            Резистивный делитель напряжения — простейшая схема для получения части входного напряжения. 
            Состоит из двух последовательно соединённых резисторов. Выходное напряжение снимается с точки 
            соединения резисторов и пропорционально их соотношению.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#8b5cf6', marginBottom: '8px' }}>Основные формулы</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Выходное напряжение:</strong> Vout = Vin × R2 ÷ (R1 + R2)</p>
                <p>• <strong>Ток через делитель:</strong> I = Vin ÷ (R1 + R2)</p>
                <p>• <strong>Мощность на R1:</strong> P1 = I² × R1</p>
                <p>• <strong>Мощность на R2:</strong> P2 = I² × R2</p>
                <p>• <strong>Выходное сопротивление:</strong> Rout = R1 ∥ R2 = (R1 × R2) ÷ (R1 + R2)</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#8b5cf6', marginBottom: '8px' }}>Типичные применения</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Понижение напряжения</strong> для питания маломощных устройств</p>
                <p>• <strong>Создание опорного напряжения</strong> для компараторов и АЦП</p>
                <p>• <strong>Измерение высоких напряжений</strong> с помощью АЦП микроконтроллера</p>
                <p>• <strong>Смещение рабочих точек</strong> транзисторов и операционных усилителей</p>
                <p>• <strong>Регулировка уровня сигнала</strong> в аудиотехнике</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#8b5cf6' }}>Ограничения и рекомендации</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Низкий КПД</strong> — часть мощности рассеивается на резисторах</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Выходное сопротивление</strong> должно быть намного меньше входного сопротивления нагрузки</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Для питания устройств</strong> лучше использовать стабилизаторы напряжения</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Выбирайте резисторы</strong> с мощностью в 2-3 раза больше расчётной</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Для точных измерений</strong> используйте прецизионные резисторы с низким ТКС</li>
            <li>• <strong>При больших токах</strong> резистивные делители неэффективны — используйте импульсные преобразователи</li>
          </ul>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #8b5cf6'
          }}>
            <h4 style={{ color: '#8b5cf6', marginBottom: '8px' }}>💡 Пример: Делитель для Arduino</h4>
            <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
              Для измерения напряжения до 25В с помощью Arduino (максимум 5В на входе АЦП):<br/>
              <strong>Vin = 25В, Vout = 5В → R1:R2 = 4:1</strong><br/>
              Используем R1 = 40кΩ, R2 = 10кΩ<br/>
              Ток: 25В ÷ 50кΩ = 0.5мА<br/>
              Мощность на R1: 0.01мВт, на R2: 0.0025мВт<br/>
              Подходят резисторы 0.125Вт
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}