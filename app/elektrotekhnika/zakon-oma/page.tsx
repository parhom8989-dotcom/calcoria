// app/elektrotekhnika/zakon-oma/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function ZakonOmaPage() {
  // Состояния для ввода значений
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [resistance, setResistance] = useState<string>('');
  
  // Единицы измерения
  const [voltageUnit, setVoltageUnit] = useState<string>('V');
  const [currentUnit, setCurrentUnit] = useState<string>('A');
  const [resistanceUnit, setResistanceUnit] = useState<string>('Ω');
  
  // Режим расчёта (что ищем)
  const [calculationMode, setCalculationMode] = useState<'resistance' | 'voltage' | 'current'>('resistance');
  
  // Результат
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    explanation: string;
  } | null>(null);
  
  // Конвертация в базовые единицы (Вольты, Амперы, Омы)
  const convertToBase = (value: string, unit: string, type: 'voltage' | 'current' | 'resistance'): number => {
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
      case 'current':
        switch (unit) {
          case 'μA': return numValue / 1_000_000;
          case 'mA': return numValue / 1000;
          case 'A': return numValue;
          default: return numValue;
        }
      case 'resistance':
        switch (unit) {
          case 'Ω': return numValue;
          case 'kΩ': return numValue * 1000;
          case 'MΩ': return numValue * 1_000_000;
          default: return numValue;
        }
      default:
        return numValue;
    }
  };
  
  // Конвертация из базовых единиц
  const convertFromBase = (value: number, unit: string, type: 'voltage' | 'current' | 'resistance'): number => {
    if (isNaN(value)) return NaN;
    
    switch (type) {
      case 'voltage':
        switch (unit) {
          case 'mV': return value * 1000;
          case 'V': return value;
          case 'kV': return value / 1000;
          default: return value;
        }
      case 'current':
        switch (unit) {
          case 'μA': return value * 1_000_000;
          case 'mA': return value * 1000;
          case 'A': return value;
          default: return value;
        }
      case 'resistance':
        switch (unit) {
          case 'Ω': return value;
          case 'kΩ': return value / 1000;
          case 'MΩ': return value / 1_000_000;
          default: return value;
        }
      default:
        return value;
    }
  };
  
  // Функция расчёта
  const calculate = () => {
    const voltageBase = convertToBase(voltage, voltageUnit, 'voltage');
    const currentBase = convertToBase(current, currentUnit, 'current');
    const resistanceBase = convertToBase(resistance, resistanceUnit, 'resistance');
    
    let calculatedValue = 0;
    let targetUnit = '';
    let formula = '';
    let explanation = '';
    
    if (calculationMode === 'resistance') {
      // Расчёт сопротивления: R = U / I
      if (!isNaN(voltageBase) && !isNaN(currentBase) && currentBase !== 0) {
        calculatedValue = voltageBase / currentBase;
        targetUnit = resistanceUnit;
        formula = 'R = U ÷ I';
        explanation = `Сопротивление = ${voltage} ${voltageUnit} ÷ ${current} ${currentUnit}`;
        
        setResult({
          value: convertFromBase(calculatedValue, resistanceUnit, 'resistance'),
          unit: resistanceUnit,
          formula,
          explanation
        });
      } else {
        setResult(null);
      }
    } else if (calculationMode === 'voltage') {
      // Расчёт напряжения: U = I × R
      if (!isNaN(currentBase) && !isNaN(resistanceBase)) {
        calculatedValue = currentBase * resistanceBase;
        targetUnit = voltageUnit;
        formula = 'U = I × R';
        explanation = `Напряжение = ${current} ${currentUnit} × ${resistance} ${resistanceUnit}`;
        
        setResult({
          value: convertFromBase(calculatedValue, voltageUnit, 'voltage'),
          unit: voltageUnit,
          formula,
          explanation
        });
      } else {
        setResult(null);
      }
    } else if (calculationMode === 'current') {
      // Расчёт тока: I = U / R
      if (!isNaN(voltageBase) && !isNaN(resistanceBase) && resistanceBase !== 0) {
        calculatedValue = voltageBase / resistanceBase;
        targetUnit = currentUnit;
        formula = 'I = U ÷ R';
        explanation = `Ток = ${voltage} ${voltageUnit} ÷ ${resistance} ${resistanceUnit}`;
        
        setResult({
          value: convertFromBase(calculatedValue, currentUnit, 'current'),
          unit: currentUnit,
          formula,
          explanation
        });
      } else {
        setResult(null);
      }
    }
  };
  
  // Автоматический пересчёт при изменении значений
  useEffect(() => {
    calculate();
  }, [voltage, current, resistance, voltageUnit, currentUnit, resistanceUnit, calculationMode]);
  
  // Сброс значений
  const resetCalculator = () => {
    setVoltage('');
    setCurrent('');
    setResistance('');
    setVoltageUnit('V');
    setCurrentUnit('A');
    setResistanceUnit('Ω');
    setCalculationMode('resistance');
    setResult(null);
  };
  
  // Копирование результата в буфер обмена
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
              color: '#3b82f6'
            }}>
              ⚡ Калькулятор закона Ома
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт напряжения (U), тока (I) и сопротивления (R)
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
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#38bdf8';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#38bdf8';
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
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#3b82f6';
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Выбор режима расчёта */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Что нужно рассчитать?
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setCalculationMode('resistance')}
                style={{
                  padding: '14px',
                  backgroundColor: calculationMode === 'resistance' ? '#3b82f6' : '#334155',
                  color: 'white',
                  border: `2px solid ${calculationMode === 'resistance' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Сопротивление (R)
              </button>
              
              <button
                onClick={() => setCalculationMode('voltage')}
                style={{
                  padding: '14px',
                  backgroundColor: calculationMode === 'voltage' ? '#3b82f6' : '#334155',
                  color: 'white',
                  border: `2px solid ${calculationMode === 'voltage' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Напряжение (U)
              </button>
              
              <button
                onClick={() => setCalculationMode('current')}
                style={{
                  padding: '14px',
                  backgroundColor: calculationMode === 'current' ? '#3b82f6' : '#334155',
                  color: 'white',
                  border: `2px solid ${calculationMode === 'current' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Ток (I)
              </button>
            </div>
            
            <div style={{
              backgroundColor: '#0f172a',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #334155',
              marginTop: '10px'
            }}>
              <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
                {calculationMode === 'resistance' ? 'R = U ÷ I' : 
                 calculationMode === 'voltage' ? 'U = I × R' : 
                 'I = U ÷ R'}
              </div>
              <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '14px', marginTop: '8px' }}>
                {calculationMode === 'resistance' ? 'Сопротивление = Напряжение ÷ Ток' : 
                 calculationMode === 'voltage' ? 'Напряжение = Ток × Сопротивление' : 
                 'Ток = Напряжение ÷ Сопротивление'}
              </p>
            </div>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Введите известные значения
            </h3>
            
            {/* Напряжение (скрыто при расчёте напряжения) */}
            {calculationMode !== 'voltage' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Напряжение (U)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    placeholder="Например: 12"
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
                    <option value="V">В (V)</option>
                    <option value="mV">мВ (mV)</option>
                    <option value="kV">кВ (kV)</option>
                  </select>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Стандартные значения: 1.5В (батарейка), 5В (USB), 12В (авто), 220В (сеть)
                </p>
              </div>
            )}
            
            {/* Ток (скрыто при расчёте тока) */}
            {calculationMode !== 'current' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Ток (I)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    placeholder="Например: 0.5"
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
                    <option value="A">А (A)</option>
                    <option value="mA">мА (mA)</option>
                    <option value="μA">мкА (μA)</option>
                  </select>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  LED: 20мА, Автомобильные лампы: 5-10А, Бытовые приборы: 0.5-10А
                </p>
              </div>
            )}
            
            {/* Сопротивление (скрыто при расчёте сопротивления) */}
            {calculationMode !== 'resistance' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Сопротивление (R)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    placeholder="Например: 100"
                    value={resistance}
                    onChange={(e) => setResistance(e.target.value)}
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
                    value={resistanceUnit}
                    onChange={(e) => setResistanceUnit(e.target.value)}
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
                    <option value="Ω">Ом (Ω)</option>
                    <option value="kΩ">кОм (kΩ)</option>
                    <option value="MΩ">МОм (MΩ)</option>
                  </select>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  LED резисторы: 100-1000Ω, Нагреватели: 10-100Ω, Изоляторы: &gt1MΩ
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
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                    {result.value.toFixed(3)} <span style={{ fontSize: '20px' }}>{result.unit}</span>
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    {calculationMode === 'resistance' ? 'Сопротивление' : 
                     calculationMode === 'voltage' ? 'Напряжение' : 'Ток'}
                  </div>
                </div>
                
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
                      backgroundColor: '#3b82f620',
                      color: '#3b82f6',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {result.formula}
                    </span>
                  </div>
                  
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    {result.explanation}
                  </div>
                </div>
                
                <button 
                  onClick={() => copyToClipboard(`${result.value.toFixed(3)} ${result.unit}`)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#334155';
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                >
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚡</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите значения для расчёта
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  {calculationMode === 'resistance' ? 'Введите напряжение и ток' : 
                   calculationMode === 'voltage' ? 'Введите ток и сопротивление' : 
                   'Введите напряжение и сопротивление'}
                </div>
              </div>
            )}
          </div>

          {/* Примеры */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '16px' }}>
              💡 Примеры использования
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>LED + резистор</div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>U=12В, I=20мА → R=600Ω</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Нагреватель 1кВт</div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>P=1000Вт, U=220В → I=4.55А</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Автомобильная лампочка</div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>U=12В, R=2.4Ω → I=5А</div>
              </div>
            </div>
          </div>

          {/* Формула */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#3b82f6', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              U = I × R
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Закон Ома: напряжение прямо пропорционально току и сопротивлению
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#3b82f6' }}>
            Что такое закон Ома?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.6' }}>
            Закон Ома — фундаментальный принцип электротехники, открытый Георгом Омом в 1827 году. 
            Он устанавливает взаимосвязь между напряжением, током и сопротивлением в электрической цепи.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>Три формы закона Ома</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Напряжение:</strong> U = I × R</p>
                <p>• <strong>Ток:</strong> I = U ÷ R</p>
                <p>• <strong>Сопротивление:</strong> R = U ÷ I</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>Где применяется?</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• Расчёт резисторов для светодиодов</p>
                <p>• Определение потребляемого тока устройствами</p>
                <p>• Проектирование электрических схем</p>
                <p>• Диагностика неисправностей в цепях</p>
                <p>• Подбор источников питания</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#3b82f6' }}>Практические советы</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Всегда соблюдайте полярность</strong> при подключении источников напряжения</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Для светодиодов</strong> используйте резисторы, расчитанные по закону Ома</li>
            <li style={{ marginBottom: '8px' }}>• <strong>При расчёте мощных цепей</strong> учитывайте нагрев компонентов</li>
            <li>• <strong>Проверяйте соответствие</strong> фактических значений расчётным</li>
          </ul>
        </div>
      </div>
    </div>
  );
}