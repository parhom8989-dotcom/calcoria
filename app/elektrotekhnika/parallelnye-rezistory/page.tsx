// app/elektrotekhnika/parallelnye-rezistory/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function ParallelnyeRezistoryPage() {
  // Режим работы: простое или расширенное
  const [mode, setMode] = useState<string>('simple'); // 'simple' или 'advanced'
  
  // Простой режим: 2-4 резистора
  const [resistors, setResistors] = useState<string[]>(['1000', '2000', '', '']);
  const [resistorCount, setResistorCount] = useState<number>(2);
  
  // Расширенный режим: список резисторов
  const [resistorList, setResistorList] = useState<string>('1000, 2000, 3000');
  
  // Результаты
  const [result, setResult] = useState<{
    totalResistance: number;
    totalResistanceFormatted: string;
    conductance: number;
    currentDistribution: { [key: number]: number };
    powerDistribution: { [key: number]: number };
    warnings: string[];
    calculationMethod: string;
  } | null>(null);

  // Стандартный ряд E12 для быстрого выбора
  const e12Series = [
    10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82,
    100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820,
    1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200,
    10000, 12000, 15000, 18000, 22000, 27000, 33000, 39000, 47000, 56000, 68000, 82000,
    100000, 120000, 150000, 180000, 220000, 270000, 330000, 390000, 470000, 560000, 680000, 820000,
    1000000
  ];

  // Типовые значения для быстрого выбора
  const typicalValues = [
    { value: '100', label: '100Ω', desc: 'Слаботочные' },
    { value: '1000', label: '1кΩ', desc: 'Стандарт' },
    { value: '10000', label: '10кΩ', desc: 'Высокое' },
    { value: '100000', label: '100кΩ', desc: 'Очень высокое' },
  ];

  // Форматирование значения резистора
  const formatResistance = (value: number): string => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(3) + ' МΩ';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(3) + ' кΩ';
    } else {
      return value.toFixed(2) + ' Ω';
    }
  };

  // Расчет общего сопротивления параллельных резисторов
  const calculateParallelResistance = (values: number[]): number => {
    if (values.length === 0) return 0;
    
    // Формула: 1/Rtotal = 1/R1 + 1/R2 + ... + 1/Rn
    let sumOfReciprocals = 0;
    let validCount = 0;
    
    for (const value of values) {
      if (value > 0) {
        sumOfReciprocals += 1 / value;
        validCount++;
      }
    }
    
    if (validCount === 0) return 0;
    if (validCount === 1) return values.find(v => v > 0) || 0;
    
    return 1 / sumOfReciprocals;
  };

  // Расчет
  const calculate = () => {
    let resistorValues: number[] = [];
    const warnings: string[] = [];

    if (mode === 'simple') {
      // Простой режим: берем указанное количество резисторов
      for (let i = 0; i < resistorCount; i++) {
        const value = parseFloat(resistors[i]) || 0;
        if (value > 0) {
          resistorValues.push(value);
        }
      }
    } else {
      // Расширенный режим: парсим строку
      const values = resistorList
        .split(/[,;\s]+/)
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v) && v > 0);
      
      resistorValues = values;
    }

    // Проверки
    if (resistorValues.length === 0) {
      setResult(null);
      return;
    }

    if (resistorValues.length === 1) {
      warnings.push('⚠️ Указан только один резистор - нет параллельного соединения');
    }

    // Проверка на нулевые и отрицательные значения
    for (let i = 0; i < resistorValues.length; i++) {
      if (resistorValues[i] <= 0) {
        warnings.push(`⚠️ Резистор R${i+1} имеет некорректное значение`);
      }
      if (resistorValues[i] < 1) {
        warnings.push(`⚠️ Резистор R${i+1} очень маленький (${resistorValues[i]}Ω)`);
      }
    }

    // Расчет общего сопротивления
    const totalResistance = calculateParallelResistance(resistorValues);
    
    // Проверка результата
    if (totalResistance <= 0 || !isFinite(totalResistance)) {
      warnings.push('❌ Невозможно вычислить общее сопротивление');
      setResult(null);
      return;
    }

    // Проверка на короткое замыкание
    if (totalResistance < 0.1) {
      warnings.push('⚠️ Очень низкое общее сопротивление - возможен большой ток!');
    }

    // Проверка на равенство резисторов
    if (resistorValues.length >= 2) {
      const allEqual = resistorValues.every(v => Math.abs(v - resistorValues[0]) < 0.001);
      if (allEqual) {
        warnings.push('💡 Все резисторы одинаковые - используйте формулу R/n');
      }
    }

    // Проверка на доминирующий резистор
    if (resistorValues.length >= 2) {
      const minResistor = Math.min(...resistorValues);
      if (minResistor > 0 && totalResistance < minResistor * 0.1) {
        warnings.push('💡 Один резистор значительно меньше других - он определяет общее сопротивление');
      }
    }

    // Проверка стандартного ряда
    const isStandardValue = e12Series.some(value => 
      Math.abs(value - totalResistance) / totalResistance < 0.05
    );
    if (!isStandardValue && totalResistance > 10) {
      warnings.push('ℹ️ Общее сопротивление не соответствует стандартному ряду E12');
    }

    // Расчет проводимости
    const conductance = 1 / totalResistance;

    // Расчет распределения тока (для примера: напряжение 12В)
    const voltageExample = 12;
    const totalCurrent = voltageExample / totalResistance;
    const currentDistribution: { [key: number]: number } = {};
    const powerDistribution: { [key: number]: number } = {};

    resistorValues.forEach((value, index) => {
      if (value > 0) {
        currentDistribution[index] = voltageExample / value;
        powerDistribution[index] = (voltageExample * voltageExample) / value;
      }
    });

    // Метод расчета
    let calculationMethod = '';
    if (resistorValues.length === 2) {
      calculationMethod = 'Формула для двух резисторов: Rобщ = (R1 × R2) ÷ (R1 + R2)';
    } else if (resistorValues.length > 10) {
      calculationMethod = 'Расчет по формуле проводимости: 1/Rобщ = Σ(1/Ri)';
    } else {
      calculationMethod = `Расчет для ${resistorValues.length} резисторов: 1/Rобщ = ${resistorValues.map((_, i) => `1/R${i+1}`).join(' + ')}`;
    }

    setResult({
      totalResistance,
      totalResistanceFormatted: formatResistance(totalResistance),
      conductance,
      currentDistribution,
      powerDistribution,
      warnings,
      calculationMethod
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, resistors, resistorCount, resistorList]);

  // Обработчики для простого режима
  const handleResistorChange = (index: number, value: string) => {
    const newResistors = [...resistors];
    newResistors[index] = value;
    setResistors(newResistors);
  };

  const addResistor = () => {
    if (resistorCount < 10) {
      setResistorCount(prev => prev + 1);
    }
  };

  const removeResistor = () => {
    if (resistorCount > 1) {
      setResistorCount(prev => {
        const newCount = prev - 1;
        const newResistors = [...resistors];
        newResistors[newCount] = '';
        setResistors(newResistors);
        return newCount;
      });
    }
  };

  // Обработчик для расширенного режима
  const handleResistorListChange = (value: string) => {
    // Очищаем от лишних символов, но сохраняем разделители
    const cleaned = value.replace(/[^0-9.,;\s]/g, '');
    setResistorList(cleaned);
  };

  // Сброс
  const resetCalculator = () => {
    setResistors(['1000', '2000', '', '']);
    setResistorCount(2);
    setResistorList('1000, 2000, 3000');
    setResult(null);
  };

  // Быстрый выбор типовых значений
  const selectTypicalValue = (value: string) => {
    if (mode === 'simple') {
      // Для простого режима заполняем все резисторы
      const newResistors = [...resistors];
      for (let i = 0; i < resistorCount; i++) {
        newResistors[i] = value;
      }
      setResistors(newResistors);
    } else {
      // Для расширенного режима добавляем в список
      const currentList = resistorList.trim();
      const newValue = currentList ? `${currentList}, ${value}` : value;
      setResistorList(newValue);
    }
  };

  // Копирование результата
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
              color: '#10b981'
            }}>
              🔌 Калькулятор параллельных резисторов
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт общего сопротивления параллельно соединённых резисторов
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
              Режим ввода
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setMode('simple')}
                style={{
                  padding: '16px',
                  backgroundColor: mode === 'simple' ? '#10b981' : '#334155',
                  color: 'white',
                  border: `2px solid ${mode === 'simple' ? '#10b981' : '#475569'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '16px'
                }}
              >
                📱 Простой (2-4 резистора)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('advanced')}
                style={{
                  padding: '16px',
                  backgroundColor: mode === 'advanced' ? '#10b981' : '#334155',
                  color: 'white',
                  border: `2px solid ${mode === 'advanced' ? '#10b981' : '#475569'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '16px'
                }}
              >
                💻 Расширенный (список)
              </button>
            </div>
          </div>

          {/* Быстрый выбор типовых значений */}
<div style={{ marginBottom: '24px' }}>
  <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
    Быстрый выбор
  </h3>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '20px',
    width: '100%'
  }}>
    {typicalValues.map((item) => (
      <button
        key={item.value}
        type="button"
        onClick={() => selectTypicalValue(item.value)}
        style={{
          padding: '12px 4px',
          backgroundColor: '#334155',
          color: 'white',
          border: '2px solid #475569',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 'clamp(12px, 3vw, 18px)',
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
        <div style={{ fontSize: 'clamp(14px, 3.5vw, 18px)', marginBottom: '4px' }}>{item.label}</div>
        <div style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', opacity: 0.8 }}>{item.desc}</div>
      </button>
    ))}
  </div>
</div>

          {/* Поля ввода для простого режима */}
          {mode === 'simple' ? (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
                Значения резисторов
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: '#cbd5e1' }}>Количество резисторов: {resistorCount}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={removeResistor}
                      disabled={resistorCount <= 1}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: resistorCount <= 1 ? '#334155' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: resistorCount <= 1 ? 'not-allowed' : 'pointer',
                        opacity: resistorCount <= 1 ? 0.5 : 1
                      }}
                    >
                      ➖ Убрать
                    </button>
                    <button
                      onClick={addResistor}
                      disabled={resistorCount >= 10}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: resistorCount >= 10 ? '#334155' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: resistorCount >= 10 ? 'not-allowed' : 'pointer',
                        opacity: resistorCount >= 10 ? 0.5 : 1
                      }}
                    >
                      ➕ Добавить
                    </button>
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px'
              }}>
                {Array.from({ length: resistorCount }).map((_, index) => (
                  <div key={index} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                      Резистор R{index + 1}
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={resistors[index] || ''}
                      onChange={(e) => handleResistorChange(index, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder={`R${index + 1}, Ω`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Поле ввода для расширенного режима */
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
                Список резисторов
              </h3>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Введите значения через запятую, точку с запятой или пробел:
                </label>
                <textarea
                  value={resistorList}
                  onChange={(e) => handleResistorListChange(e.target.value)}
                  style={{
                    width: '100%',
                    height: '120px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px',
                    resize: 'vertical',
                    fontFamily: 'monospace'
                  }}
                  placeholder="Например: 1000, 2000, 3000, 4700"
                />
              </div>
              
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                💡 Примеры форматов: "1000, 2000, 3000" или "1к 2.2к 4.7к" или "10;22;33"
              </div>
            </div>
          )}

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
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                    {result.totalResistanceFormatted}
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    Общее сопротивление параллельного соединения
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
                      {result.conductance.toExponential(3)} См
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Проводимость (G)</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                      {(12 / result.totalResistance).toFixed(3)} А
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Ток при 12В</div>
                  </div>
                </div>
                
                {/* Метод расчета */}
                <div style={{ 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                    📝 Метод расчета:
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    {result.calculationMethod}
                  </div>
                </div>
                
                {/* Особые случаи */}
                {Object.keys(result.currentDistribution).length > 0 && (
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    textAlign: 'left'
                  }}>
                    <div style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
                      📊 Распределение тока при 12В
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {Object.entries(result.currentDistribution).map(([index, current]) => (
                        <div key={index}>
                          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>Через R{parseInt(index) + 1}:</div>
                          <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                            {current.toFixed(3)} А
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Предупреждения */}
                {result.warnings.length > 0 && (
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: '1px solid #f59e0b'
                  }}>
                    <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '8px' }}>
                      💡 Примечания
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                      {result.warnings.map((warning, index) => (
                        <div key={index} style={{ marginBottom: '4px' }}>• {warning}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => copyToClipboard(`Rобщ = ${result.totalResistanceFormatted}`)}
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
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🔌</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите значения резисторов
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  {mode === 'simple' 
                    ? 'Укажите сопротивления резисторов R1, R2...' 
                    : 'Введите список сопротивлений через запятую'}
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
              1/R<sub>общ</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + ... + 1/R<sub>n</sub>
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основная формула для параллельного соединения резисторов
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
            Теория: Параллельное соединение резисторов
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.6' }}>
            При параллельном соединении резисторов напряжение на каждом резисторе одинаковое, 
            а общий ток равен сумме токов через отдельные резисторы. Общее сопротивление всегда 
            меньше самого маленького из сопротивлений в цепи.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>📐 Основные формулы</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Общая формула:</strong> 1/R<sub>общ</sub> = 1/R₁ + 1/R₂ + ... + 1/R<sub>n</sub></p>
                <p>• <strong>Для двух резисторов:</strong> R<sub>общ</sub> = (R₁ × R₂) ÷ (R₁ + R₂)</p>
                <p>• <strong>Для одинаковых резисторов:</strong> R<sub>общ</sub> = R ÷ n</p>
                <p>• <strong>Проводимость:</strong> G<sub>общ</sub> = G₁ + G₂ + ... + G<sub>n</sub></p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>⚡ Особенности</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Общее сопротивление ВСЕГДА меньше</strong> самого маленького резистора</p>
                <p>• <strong>Добавление резистора УМЕНЬШАЕТ</strong> общее сопротивление</p>
                <p>• <strong>Ток распределяется обратно пропорционально</strong> сопротивлениям</p>
                <p>• <strong>Мощность рассеивается</strong> пропорционально току через каждый резистор</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#10b981' }}>🔢 Практические примеры</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>Два резистора 100Ω и 100Ω</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                R<sub>общ</sub> = (100×100)÷(100+100) = 50Ω
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>Три одинаковых по 1кΩ</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                R<sub>общ</sub> = 1000 ÷ 3 = 333.3Ω
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>10Ω параллельно с 1000Ω</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                R<sub>общ</sub> ≈ 9.9Ω (практически 10Ω)
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>1кΩ, 2кΩ, 3кΩ, 4кΩ</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                R<sub>общ</sub> = 480Ω (меньше 1кΩ!)
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
            <h4 style={{ color: '#10b981', marginBottom: '8px' }}>💡 Практическое применение</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Создание нестандартных сопротивлений:</strong> комбинируя параллельно стандартные резисторы</p>
              <p>• <strong>Увеличение мощности:</strong> несколько резисторов параллельно рассеивают больше тепла</p>
              <p>• <strong>Токоизмерительные шунты:</strong> параллельное соединение для получения нужного сопротивления</p>
              <p>• <strong>Нагрузочные резисторы:</strong> для имитации нагрузки с большим током</p>
              <p>• <strong>Громкость динамиков:</strong> параллельное соединение для уменьшения сопротивления</p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '8px' }}>⚠️ Важные предупреждения</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Мощность резисторов:</strong> при параллельном соединении общая мощность = сумме мощностей</p>
              <p>• <strong>Ток через каждый резистор:</strong> I = U ÷ R, проверяйте, не превышает ли номинальный</p>
              <p>• <strong>Очень маленькие сопротивления:</strong> могут вызвать большой ток и перегрев</p>
              <p>• <strong>Равномерное распределение:</strong> при больших токах используйте резисторы с одинаковыми параметрами</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}