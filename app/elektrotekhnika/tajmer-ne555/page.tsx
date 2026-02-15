// app/elektrotekhnika/tajmer-ne555/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function TajmerNE555Page() {
  // Режим работы
  const [mode, setMode] = useState<string>('monostable'); // 'monostable', 'astable'
  
  // Параметры для моностабильного режима
  const [resistance, setResistance] = useState<string>('10000');
  const [capacitance, setCapacitance] = useState<string>('100');
  
  // Параметры для астабильного режима
  const [r1, setR1] = useState<string>('1000');
  const [r2, setR2] = useState<string>('10000');
  const [capacitanceAstable, setCapacitanceAstable] = useState<string>('10');
  
  // Единицы измерения
  const [resistanceUnit, setResistanceUnit] = useState<string>('Ω');
  const [capacitanceUnit, setCapacitanceUnit] = useState<string>('nF');
  
  // Результаты
  const [result, setResult] = useState<{
    frequency: number;
    period: number;
    dutyCycle: number;
    highTime: number;
    lowTime: number;
    pulseWidth: number;
    warnings: string[];
    formulas: string[];
  } | null>(null);

  // Типовые сопротивления
  const typicalResistances = [
    { value: '1000', label: '1 кΩ', desc: 'Малое' },
    { value: '10000', label: '10 кΩ', desc: 'Среднее' },
    { value: '100000', label: '100 кΩ', desc: 'Большое' },
    { value: '1000000', label: '1 МΩ', desc: 'Очень большое' },
  ];

  // Типовые емкости
  const typicalCapacitances = [
    { value: '10', label: '10 нФ', desc: 'Короткие' },
    { value: '100', label: '100 нФ', desc: 'Средние' },
    { value: '1000', label: '1 мкФ', desc: 'Длинные' },
    { value: '10000', label: '10 мкФ', desc: 'Очень длинные' },
  ];

  // Типовые частоты
  const typicalFrequencies = [
    { value: '1', label: '1 Гц', desc: 'Медленно' },
    { value: '10', label: '10 Гц', desc: 'Мигание' },
    { value: '100', label: '100 Гц', desc: 'Быстро' },
    { value: '1000', label: '1 кГц', desc: 'Звук' },
    { value: '10000', label: '10 кГц', desc: 'ВЧ' },
    { value: '100000', label: '100 кГц', desc: 'Очень ВЧ' },
  ];

  // Конвертация единиц
  const toBaseResistance = (value: number): number => {
    const multipliers: Record<string, number> = {
      'Ω': 1,
      'kΩ': 1000,
      'MΩ': 1000000,
    };
    return value * (multipliers[resistanceUnit] || 1);
  };

  const toBaseCapacitance = (value: number): number => {
    const multipliers: Record<string, number> = {
      'pF': 1,
      'nF': 1000,
      'μF': 1000000,
      'mF': 1000000000,
    };
    return value * (multipliers[capacitanceUnit] || 1);
  };

  // Форматирование времени
  const formatTime = (seconds: number): string => {
    if (seconds >= 1) {
      return seconds.toFixed(3) + ' с';
    } else if (seconds >= 0.001) {
      return (seconds * 1000).toFixed(3) + ' мс';
    } else if (seconds >= 0.000001) {
      return (seconds * 1000000).toFixed(3) + ' мкс';
    } else {
      return (seconds * 1000000000).toFixed(3) + ' нс';
    }
  };

  // Форматирование частоты
  const formatFrequency = (hz: number): string => {
    if (hz >= 1000000) {
      return (hz / 1000000).toFixed(3) + ' МГц';
    } else if (hz >= 1000) {
      return (hz / 1000).toFixed(3) + ' кГц';
    } else {
      return hz.toFixed(3) + ' Гц';
    }
  };

  // Расчет
  const calculate = () => {
    const warnings: string[] = [];
    const formulas: string[] = [];

    let frequency = 0;
    let period = 0;
    let dutyCycle = 0;
    let highTime = 0;
    let lowTime = 0;
    let pulseWidth = 0;

    if (mode === 'monostable') {
      // Моностабильный режим
      const R = toBaseResistance(parseFloat(resistance) || 0);
      const C = toBaseCapacitance(parseFloat(capacitance) || 0) * 1e-12; // в фарады
      
      if (R > 0 && C > 0) {
        // Длительность импульса: T = 1.1 × R × C
        pulseWidth = 1.1 * R * C;
        formulas.push('T = 1.1 × R × C');
        
        // Для моностабильного режима частота = 1/T
        frequency = 1 / pulseWidth;
        period = pulseWidth;
        
        warnings.push('⚠️ Моностабильный режим: один импульс при срабатывании триггера');
      }
    } else {
      // Астабильный режим
      const R1_val = toBaseResistance(parseFloat(r1) || 0);
      const R2_val = toBaseResistance(parseFloat(r2) || 0);
      const C_val = toBaseCapacitance(parseFloat(capacitanceAstable) || 0) * 1e-12; // в фарады
      
      if (R1_val > 0 && R2_val > 0 && C_val > 0) {
        // Время высокого уровня: T_high = 0.693 × (R1 + R2) × C
        highTime = 0.693 * (R1_val + R2_val) * C_val;
        
        // Время низкого уровня: T_low = 0.693 × R2 × C
        lowTime = 0.693 * R2_val * C_val;
        
        // Общий период: T = 0.693 × (R1 + 2R2) × C
        period = highTime + lowTime;
        
        // Частота: f = 1.44 / ((R1 + 2R2) × C)
        frequency = 1.44 / ((R1_val + 2 * R2_val) * C_val);
        
        // Коэффициент заполнения: D = (R1 + R2) / (R1 + 2R2)
        dutyCycle = (R1_val + R2_val) / (R1_val + 2 * R2_val) * 100;
        
        formulas.push('T_high = 0.693 × (R1 + R2) × C');
        formulas.push('T_low = 0.693 × R2 × C');
        formulas.push('f = 1.44 / ((R1 + 2R2) × C)');
        
        // Проверки для астабильного режима
        if (dutyCycle < 1) {
          warnings.push('⚠️ Коэффициент заполнения менее 1% - может не работать');
        } else if (dutyCycle > 99) {
          warnings.push('⚠️ Коэффициент заполнения более 99% - может не работать');
        }
        
        if (frequency > 1000000) {
          warnings.push('⚠️ Очень высокая частота - NE555 может не работать стабильно');
        }
        
        if (frequency < 0.001) {
          warnings.push('⚠️ Очень низкая частота - используйте электролитический конденсатор');
        }
        
        if (R1_val < 1000) {
          warnings.push('⚠️ R1 слишком маленькое - минимально 1 кОм');
        }
        
        if (R1_val + R2_val > 10000000) {
          warnings.push('⚠️ Сумма R1+R2 слишком большая - максимально 10 МОм');
        }
      }
    }

    // Общие проверки
    if (frequency > 0 && frequency < 0.1) {
      warnings.push('💡 Низкая частота - можно использовать как таймер');
    }
    
    if (frequency > 20000) {
      warnings.push('💡 Частота выше 20 кГц - не слышно, но видно на осциллографе');
    }

    setResult({
      frequency,
      period,
      dutyCycle,
      highTime,
      lowTime,
      pulseWidth,
      warnings,
      formulas
    });
  };

  // Автоматический пересчет
  useEffect(() => {
    calculate();
  }, [mode, resistance, capacitance, r1, r2, capacitanceAstable, resistanceUnit, capacitanceUnit]);

  // Сброс
  const resetCalculator = () => {
    setResistance('10000');
    setCapacitance('100');
    setR1('1000');
    setR2('10000');
    setCapacitanceAstable('10');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalResistance = (value: string) => {
    if (mode === 'monostable') {
      setResistance(value);
    } else {
      setR1(value);
      setR2((parseFloat(value) * 10).toString());
    }
  };

  const selectTypicalCapacitance = (value: string) => {
    if (mode === 'monostable') {
      setCapacitance(value);
    } else {
      setCapacitanceAstable(value);
    }
  };

  // Выбор по желаемой частоте
  const selectByFrequency = (desiredFreq: number) => {
    if (mode === 'astable') {
      // Примерные значения для заданной частоты
      const C = 0.00000001; // 10 нФ
      const totalR = 1.44 / (desiredFreq * C) - 1000; // Примерный расчет
      
      if (totalR > 0) {
        setR1('1000');
        setR2(Math.round(totalR).toString());
        setCapacitanceAstable('10');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: '#d1d5db',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КАЛЬКУЛЯТОРА */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #374151'
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#9ca3af'
            }}>
              ⏱️ Таймер NE555
            </h1>
            <p style={{ color: '#6b7280' }}>
              Расчёт параметров для моностабильного и астабильного режимов
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
                backgroundColor: '#374151',
                color: '#9ca3af',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: '1px solid #4b5563',
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
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#9ca3af',
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
  <h3 style={{ color: '#9ca3af', marginBottom: '12px', fontSize: '18px' }}>
    Режим работы
  </h3>
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
    width: '100%'
  }}>
    <button
      type="button"
      onClick={() => setMode('monostable')}
      style={{
        padding: '14px 8px',
        backgroundColor: mode === 'monostable' ? '#4b5563' : '#374151',
        color: 'white',
        border: `2px solid ${mode === 'monostable' ? '#9ca3af' : '#4b5563'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'clamp(14px, 3vw, 16px)',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      🎯 Моностабильный
    </button>
    
    <button
      type="button"
      onClick={() => setMode('astable')}
      style={{
        padding: '14px 8px',
        backgroundColor: mode === 'astable' ? '#4b5563' : '#374151',
        color: 'white',
        border: `2px solid ${mode === 'astable' ? '#9ca3af' : '#4b5563'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'clamp(14px, 3vw, 16px)',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      🔄 Астабильный
    </button>
  </div>
  <div style={{ color: '#6b7280', fontSize: '14px' }}>
    {mode === 'monostable' 
      ? 'Один импульс заданной длительности при срабатывании триггера' 
      : 'Непрерывные импульсы с заданной частотой и скважностью'}
  </div>
</div>

          {/* Быстрый выбор частоты (только для астабильного) */}
          {mode === 'astable' && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#9ca3af', marginBottom: '12px', fontSize: '18px' }}>
                Желаемая частота
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {typicalFrequencies.map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => selectByFrequency(parseFloat(freq.value))}
                    style={{
                      padding: '10px 6px',
                      backgroundColor: '#374151',
                      color: 'white',
                      border: '2px solid #4b5563',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{freq.label}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>{freq.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '18px' }}>
              {mode === 'monostable' ? 'Параметры таймера' : 'Параметры генератора'}
            </h3>
            
            {/* Моностабильный режим */}
            {mode === 'monostable' ? (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#9ca3af' }}>
                      Сопротивление (R)
                    </label>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalResistances.map((res) => (
                      <button
                        key={res.value}
                        type="button"
                        onClick={() => selectTypicalResistance(res.value)}
                        style={{
                          padding: '8px 4px',
                          backgroundColor: resistance === res.value ? '#6b7280' : '#374151',
                          color: 'white',
                          border: `1px solid ${resistance === res.value ? '#9ca3af' : '#4b5563'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{res.label}</div>
                        <div style={{ fontSize: '10px', opacity: 0.8 }}>{res.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      step="1"
                      value={resistance}
                      onChange={(e) => setResistance(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#374151',
                        border: '1px solid #4b5563',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Сопротивление"
                    />
                    <select
                      value={resistanceUnit}
                      onChange={(e) => setResistanceUnit(e.target.value)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#374151',
                        border: '1px solid #4b5563',
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
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#9ca3af' }}>
                      Ёмкость (C)
                    </label>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalCapacitances.map((cap) => (
                      <button
                        key={cap.value}
                        type="button"
                        onClick={() => selectTypicalCapacitance(cap.value)}
                        style={{
                          padding: '8px 4px',
                          backgroundColor: capacitance === cap.value ? '#6b7280' : '#374151',
                          color: 'white',
                          border: `1px solid ${capacitance === cap.value ? '#9ca3af' : '#4b5563'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{cap.label}</div>
                        <div style={{ fontSize: '10px', opacity: 0.8 }}>{cap.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={capacitance}
                      onChange={(e) => setCapacitance(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#374151',
                        border: '1px solid #4b5563',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Ёмкость"
                    />
                    <select
                      value={capacitanceUnit}
                      onChange={(e) => setCapacitanceUnit(e.target.value)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#374151',
                        border: '1px solid #4b5563',
                        color: 'white',
                        fontSize: '16px',
                        minWidth: '80px'
                      }}
                    >
                      <option value="nF">нФ</option>
                      <option value="μF">мкФ</option>
                      <option value="mF">мФ</option>
                      <option value="pF">пФ</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* Астабильный режим */
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
                    Сопротивление R₁
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={r1}
                    onChange={(e) => setR1(e.target.value)}
                    style={{
                      width: '90%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#374151',
                      border: '1px solid #4b5563',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="R₁, Ω"
                  />
                  <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                    Определяет время высокого уровня вместе с R₂
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
                    Сопротивление R₂
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={r2}
                    onChange={(e) => setR2(e.target.value)}
                    style={{
                      width: '90%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#374151',
                      border: '1px solid #4b5563',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="R₂, Ω"
                  />
                  <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                    Определяет время низкого уровня
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
                    Ёмкость (C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={capacitanceAstable}
                    onChange={(e) => setCapacitanceAstable(e.target.value)}
                    style={{
                      width: '90%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#374151',
                      border: '1px solid #4b5563',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Ёмкость, нФ"
                  />
                  <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                    Влияет на общую частоту
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* РЕЗУЛЬТАТЫ */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #374151',
            marginBottom: '20px'
          }}>
            {result ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  {/* Основной результат */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '8px' }}>
                      {mode === 'monostable' 
                        ? formatTime(result.pulseWidth)
                        : formatFrequency(result.frequency)
                      }
                    </div>
                    <div style={{ color: '#6b7280' }}>
                      {mode === 'monostable' ? 'Длительность импульса' : 'Частота генерации'}
                    </div>
                  </div>
                  
                  {/* Детали в зависимости от режима */}
{mode === 'monostable' ? (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '16px',
    marginBottom: '20px'
  }}>
    <div style={{ 
      backgroundColor: '#1f2937', 
      padding: '16px', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '4px' }}>
        {formatFrequency(result.frequency)}
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>Частота (1/T)</div>
    </div>
    
    <div style={{ 
      backgroundColor: '#1f2937', 
      padding: '16px', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '4px' }}>
        {formatTime(result.period)}
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>Период</div>
    </div>
  </div>
) : (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '12px',
    marginBottom: '20px'
  }}>
    <div style={{ 
      backgroundColor: '#1f2937', 
      padding: '16px', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '4px' }}>
        {formatTime(result.highTime)}
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>Высокий уровень</div>
    </div>
    
    <div style={{ 
      backgroundColor: '#1f2937', 
      padding: '16px', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '4px' }}>
        {formatTime(result.lowTime)}
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>Низкий уровень</div>
    </div>
    
    <div style={{ 
      backgroundColor: '#1f2937', 
      padding: '16px', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '4px' }}>
        {formatTime(result.period)}
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>Период</div>
    </div>
    
    <div style={{ 
      backgroundColor: '#1f2937', 
      padding: '16px', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '4px' }}>
        {result.dutyCycle.toFixed(1)}%
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>Заполнение</div>
    </div>
  </div>
)}
                  
                  {/* Формулы */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1f2937',
                    borderRadius: '8px'
                  }}>
                    <div style={{ color: '#9ca3af', fontWeight: 'bold', marginBottom: '8px' }}>
                      📝 Используемые формулы:
                    </div>
                    <div style={{ color: '#d1d5db', fontSize: '14px' }}>
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
                    const text = mode === 'monostable' 
                      ? `Импульс: ${formatTime(result.pulseWidth)}, Частота: ${formatFrequency(result.frequency)}`
                      : `Частота: ${formatFrequency(result.frequency)}, Заполнение: ${result.dutyCycle.toFixed(1)}%, Высокий: ${formatTime(result.highTime)}, Низкий: ${formatTime(result.lowTime)}`;
                    navigator.clipboard.writeText(text);
                    alert('Результаты скопированы!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '8px',
                    color: '#9ca3af',
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
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⏱️</div>
                <div style={{ color: '#6b7280', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры таймера
                </div>
                <div style={{ color: '#4b5563', fontSize: '14px' }}>
                  {mode === 'monostable' 
                    ? 'Укажите сопротивление и емкость для моностабильного режима' 
                    : 'Укажите R₁, R₂ и емкость для астабильного режима'}
                </div>
              </div>
            )}
          </div>

          {/* Формулы */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#9ca3af', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              {mode === 'monostable' 
                ? 'T = 1.1 × R × C' 
                : 'f = 1.44 / ((R₁ + 2R₂) × C)'}
            </div>
            <div style={{ color: '#4b5563', fontSize: '14px' }}>
              {mode === 'monostable' 
                ? 'Формула длительности импульса в моностабильном режиме' 
                : 'Формула частоты в астабильном режиме'}
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#9ca3af' }}>
            Теория: Таймер NE555
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '8px' }}>🎯 Моностабильный режим (одновибратор)</h3>
            <div style={{ color: '#d1d5db', fontSize: '14px' }}>
              <p><strong>Назначение:</strong> Генерация одного импульса заданной длительности при поступлении триггерного сигнала</p>
              <p><strong>Формула:</strong> T = 1.1 × R × C</p>
              <p><strong>Диапазон:</strong> От микросекунд до нескольких часов</p>
              <p><strong>Применение:</strong> Таймеры, задержки, формирователи импульсов</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '8px' }}>🔄 Астабильный режим (генератор)</h3>
            <div style={{ color: '#d1d5db', fontSize: '14px' }}>
              <p><strong>Назначение:</strong> Генерация непрерывной последовательности прямоугольных импульсов</p>
              <p><strong>Формулы:</strong></p>
              <p>• Время высокого уровня: T<sub>high</sub> = 0.693 × (R₁ + R₂) × C</p>
              <p>• Время низкого уровня: T<sub>low</sub> = 0.693 × R₂ × C</p>
              <p>• Общая частота: f = 1.44 / ((R₁ + 2R₂) × C)</p>
              <p>• Коэффициент заполнения: D = (R₁ + R₂) / (R₁ + 2R₂)</p>
              <p><strong>Применение:</strong> Генераторы тактовых импульсов, мигалки, ШИМ</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '8px' }}>⚡ Практические примеры</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#9ca3af', fontWeight: 'bold', marginBottom: '4px' }}>Мигающий светодиод</div>
                <div style={{ color: '#d1d5db', fontSize: '13px' }}>
                  R₁=1кΩ, R₂=10кΩ, C=10мкФ<br/>
                  Частота: ~1 Гц (мигание раз в секунду)
                </div>
              </div>
              
              <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#9ca3af', fontWeight: 'bold', marginBottom: '4px' }}>Звуковой генератор</div>
                <div style={{ color: '#d1d5db', fontSize: '13px' }}>
                  R₁=1кΩ, R₂=10кΩ, C=10нФ<br/>
                  Частота: ~1 кГц (слышимый звук)
                </div>
              </div>
              
              <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#9ca3af', fontWeight: 'bold', marginBottom: '4px' }}>Таймер 1 минута</div>
                <div style={{ color: '#d1d5db', fontSize: '13px' }}>
                  R=1МΩ, C=100мкФ<br/>
                  Импульс: 1.1×1М×100мк = 110 секунд
                </div>
              </div>
              
              <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#9ca3af', fontWeight: 'bold', marginBottom: '4px' }}>ШИМ 50%</div>
                <div style={{ color: '#d1d5db', fontSize: '13px' }}>
                  R₁=R₂, любая емкость<br/>
                  Коэффициент заполнения: (R+R)/(R+2R) = 2/3 = 66%
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#111827',
            borderRadius: '8px',
            borderLeft: '4px solid #9ca3af'
          }}>
            <h4 style={{ color: '#9ca3af', marginBottom: '8px' }}>💡 Важные правила</h4>
            <div style={{ color: '#d1d5db', fontSize: '14px' }}>
              <p>• <strong>R₁ должно быть ≥ 1 кОм</strong> для стабильной работы</p>
              <p>• <strong>R₁ + R₂ должно быть ≤ 10 МОм</strong> (ограничение NE555)</p>
              <p>• <strong>Емкость ≥ 100 пФ</strong> для избежания паразитных колебаний</p>
              <p>• <strong>Для больших времен</strong> используйте электролитические конденсаторы</p>
              <p>• <strong>Коэффициент заполнения</strong> всегда больше 50% при стандартной схеме</p>
              <p>• <strong>Для ШИМ 50%</strong> используйте диод параллельно R₂</p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#111827',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>⚠️ Ограничения NE555</h4>
            <div style={{ color: '#d1d5db', fontSize: '14px' }}>
              <p>• <strong>Максимальная частота:</strong> ~1 МГц (практически до 500 кГц)</p>
              <p>• <strong>Минимальная частота:</strong> сотые доли Герца (зависит от емкости)</p>
              <p>• <strong>Напряжение питания:</strong> 4.5-16В (CMOS версии 2-18В)</p>
              <p>• <strong>Потребляемый ток:</strong> 10-15 мА (CMOS версии 100-500 мкА)</p>
              <p>• <strong>Выходной ток:</strong> до 200 мА (достаточно для светодиода)</p>
              <p>• <strong>Температурная стабильность:</strong> 0.005%/°C</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}