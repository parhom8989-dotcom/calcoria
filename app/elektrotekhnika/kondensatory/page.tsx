// app/elektrotekhnika/kondensatory/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function KondensatoryPage() {
  // Основные параметры
  const [mode, setMode] = useState<string>('two'); // 'two', 'three', 'many'
  
  // Емкости конденсаторов
  const [c1, setC1] = useState<string>('100');
  const [c2, setC2] = useState<string>('100');
  const [c3, setC3] = useState<string>('100');
  const [capacitorList, setCapacitorList] = useState<string>('100, 100, 100');
  
  // Напряжение и частота (для дополнительных расчетов)
  const [voltage, setVoltage] = useState<string>('12');
  const [frequency, setFrequency] = useState<string>('50');
  
  // Единицы измерения
  const [unit, setUnit] = useState<string>('nF'); // 'pF', 'nF', 'μF', 'mF', 'F'
  
  // Результаты
  const [result, setResult] = useState<{
    totalCapacitance: number;
    totalCapacitanceFormatted: string;
    voltageDistribution: { [key: number]: number };
    reactance: number;
    energy: number;
    warnings: string[];
    formula: string;
  } | null>(null);

  // Типовые значения конденсаторов
  const typicalValues = [
    { value: '10', label: '10 пФ', desc: 'Высокочастотные' },
    { value: '100', label: '100 пФ', desc: 'ВЧ фильтры' },
    { value: '1000', label: '1 нФ', desc: 'Связь' },
    { value: '10000', label: '10 нФ', desc: 'Помехи' },
    { value: '100000', label: '100 нФ', desc: 'Развязка' },
    { value: '1000000', label: '1 мкФ', desc: 'Фильтр' },
    { value: '10000000', label: '10 мкФ', desc: 'Сглаживание' },
    { value: '100000000', label: '100 мкФ', desc: 'БП' },
    { value: '1000000000', label: '1000 мкФ', desc: 'ИБП' },
  ];

  // Коэффициенты перевода единиц
  const unitMultipliers = {
    'pF': 1,
    'nF': 1000,
    'μF': 1000000,
    'mF': 1000000000,
    'F': 1000000000000,
  };

  // Форматирование емкости
  const formatCapacitance = (value: number): string => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(3) + ' F';
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(3) + ' mF';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(3) + ' μF';
    } else if (value >= 1) {
      return value.toFixed(3) + ' nF';
    } else {
      return (value * 1000).toFixed(3) + ' pF';
    }
  };

  // Конвертация в пикофарады (базовая единица)
  const toBaseUnit = (value: number): number => {
    return value * (unitMultipliers[unit as keyof typeof unitMultipliers] || 1);
  };

  // Конвертация из пикофарад
  const fromBaseUnit = (value: number): number => {
    return value / (unitMultipliers[unit as keyof typeof unitMultipliers] || 1);
  };

  // Расчет последовательного соединения
  const calculateSeries = (capacitances: number[]): number => {
    if (capacitances.length === 0) return 0;
    if (capacitances.length === 1) return capacitances[0];
    
    // Формула: 1/Cобщ = 1/C1 + 1/C2 + ... + 1/Cn
    let sumOfReciprocals = 0;
    for (const cap of capacitances) {
      if (cap > 0) {
        sumOfReciprocals += 1 / cap;
      }
    }
    
    return sumOfReciprocals > 0 ? 1 / sumOfReciprocals : 0;
  };

  // Расчет
  const calculate = () => {
    let capacitances: number[] = [];
    const warnings: string[] = [];

    // Получаем значения конденсаторов
    if (mode === 'two') {
      const cap1 = toBaseUnit(parseFloat(c1) || 0);
      const cap2 = toBaseUnit(parseFloat(c2) || 0);
      if (cap1 > 0 && cap2 > 0) {
        capacitances = [cap1, cap2];
      }
    } else if (mode === 'three') {
      const cap1 = toBaseUnit(parseFloat(c1) || 0);
      const cap2 = toBaseUnit(parseFloat(c2) || 0);
      const cap3 = toBaseUnit(parseFloat(c3) || 0);
      if (cap1 > 0 && cap2 > 0 && cap3 > 0) {
        capacitances = [cap1, cap2, cap3];
      }
    } else {
      // Режим "много" - парсим список
      const values = capacitorList
        .split(/[,;\s]+/)
        .map(v => toBaseUnit(parseFloat(v.trim()) || 0))
        .filter(v => v > 0);
      capacitances = values;
    }

    // Проверки
    if (capacitances.length < 2) {
      warnings.push('⚠️ Нужно как минимум 2 конденсатора для последовательного соединения');
      setResult(null);
      return;
    }

    // Проверка на нулевые значения
    capacitances.forEach((cap, index) => {
      if (cap <= 0) {
        warnings.push(`⚠️ Конденсатор C${index + 1} имеет некорректное значение`);
      }
    });

    // Расчет общей емкости
    const totalCapacitance = calculateSeries(capacitances);
    
    if (totalCapacitance <= 0 || !isFinite(totalCapacitance)) {
      warnings.push('❌ Невозможно вычислить общую емкость');
      setResult(null);
      return;
    }

    // Расчет распределения напряжения
    const totalVoltage = parseFloat(voltage) || 0;
    const voltageDistribution: { [key: number]: number } = {};
    
    if (totalVoltage > 0) {
      // Напряжение распределяется обратно пропорционально емкости
      capacitances.forEach((cap, index) => {
        voltageDistribution[index] = (totalCapacitance / cap) * totalVoltage;
      });
    }

    // Расчет реактивного сопротивления
    const freq = parseFloat(frequency) || 0;
    let reactance = 0;
    if (freq > 0 && totalCapacitance > 0) {
      reactance = 1 / (2 * Math.PI * freq * totalCapacitance * 1e-12); // в омах
    }

    // Расчет запасенной энергии
    const energy = totalVoltage > 0 
      ? 0.5 * totalCapacitance * 1e-12 * Math.pow(totalVoltage, 2) // в джоулях
      : 0;

    // Определение формулы
    let formula = '';
    if (capacitances.length === 2) {
      formula = 'Cобщ = (C₁ × C₂) ÷ (C₁ + C₂)';
    } else if (capacitances.length === 3) {
      formula = '1/Cобщ = 1/C₁ + 1/C₂ + 1/C₃';
    } else {
      formula = `1/Cобщ = 1/C₁ + ... + 1/C${capacitances.length}`;
    }

    // Проверка на одинаковые конденсаторы
    const allEqual = capacitances.every(c => Math.abs(c - capacitances[0]) < 0.001);
    if (allEqual && capacitances.length >= 2) {
      warnings.push(`💡 Все конденсаторы одинаковые: Cобщ = C ÷ ${capacitances.length}`);
    }

    // Проверка на очень маленькую общую емкость
    if (totalCapacitance < 10) { // меньше 10 пФ
      warnings.push('💡 Общая емкость очень маленькая - возможно, нецелесообразно');
    }

    setResult({
      totalCapacitance,
      totalCapacitanceFormatted: formatCapacitance(totalCapacitance),
      voltageDistribution,
      reactance,
      energy,
      warnings,
      formula
    });
  };

  // Автоматический пересчет
  useEffect(() => {
    calculate();
  }, [mode, c1, c2, c3, capacitorList, voltage, frequency, unit]);

  // Сброс
  const resetCalculator = () => {
    setC1('100');
    setC2('100');
    setC3('100');
    setCapacitorList('100, 100, 100');
    setVoltage('12');
    setFrequency('50');
    setUnit('nF');
    setResult(null);
  };

  // Быстрый выбор типовых значений
  const selectTypicalValue = (value: string) => {
    if (mode === 'two') {
      setC1(value);
      setC2(value);
    } else if (mode === 'three') {
      setC1(value);
      setC2(value);
      setC3(value);
    } else {
      // Для режима "много" создаем список из 3 одинаковых значений
      setCapacitorList(`${value}, ${value}, ${value}`);
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
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#8b5cf6'
            }}>
              ⚡ Последовательное соединение конденсаторов
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт общей емкости и распределения напряжения
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
                color: '#a78bfa',
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
                color: '#8b5cf6',
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
              Количество конденсаторов
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setMode('two')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'two' ? '#8b5cf6' : '#334155',
                  color: 'white',
                  border: `2px solid ${mode === 'two' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                2 конденсатора
              </button>
              
              <button
                type="button"
                onClick={() => setMode('three')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'three' ? '#8b5cf6' : '#334155',
                  color: 'white',
                  border: `2px solid ${mode === 'three' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                3 конденсатора
              </button>
              
              <button
                type="button"
                onClick={() => setMode('many')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'many' ? '#8b5cf6' : '#334155',
                  color: 'white',
                  border: `2px solid ${mode === 'many' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Много
              </button>
            </div>
          </div>

          {/* Быстрый выбор типовых значений */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Быстрый выбор емкости
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {typicalValues.slice(0, 6).map((cap) => (
                <button
                  key={cap.value}
                  type="button"
                  onClick={() => selectTypicalValue(cap.value)}
                  style={{
                    padding: '10px 6px',
                    backgroundColor: '#334155',
                    color: 'white',
                    border: '2px solid #475569',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{cap.label}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>{cap.desc}</div>
                </button>
              ))}
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              {typicalValues.slice(6).map((cap) => (
                <button
                  key={cap.value}
                  type="button"
                  onClick={() => selectTypicalValue(cap.value)}
                  style={{
                    padding: '10px 6px',
                    backgroundColor: '#334155',
                    color: 'white',
                    border: '2px solid #475569',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{cap.label}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>{cap.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Емкости конденсаторов
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#cbd5e1' }}>Единица измерения:</span>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="pF">пФ (пикофарады)</option>
                <option value="nF">нФ (нанофарады)</option>
                <option value="μF">мкФ (микрофарады)</option>
                <option value="mF">мФ (миллифарады)</option>
                <option value="F">Ф (фарады)</option>
              </select>
            </div>

            {/* Режим: 2 конденсатора */}
            {mode === 'two' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    C₁
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={c1}
                    onChange={(e) => setC1(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Емкость C₁"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    C₂
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={c2}
                    onChange={(e) => setC2(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Емкость C₂"
                  />
                </div>
              </div>
            )}

            {/* Режим: 3 конденсатора */}
            {mode === 'three' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    C₁
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={c1}
                    onChange={(e) => setC1(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Емкость C₁"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    C₂
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={c2}
                    onChange={(e) => setC2(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Емкость C₂"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    C₃
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={c3}
                    onChange={(e) => setC3(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Емкость C₃"
                  />
                </div>
              </div>
            )}

            {/* Режим: много конденсаторов */}
            {mode === 'many' && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Введите значения через запятую:
                </label>
                <textarea
                  value={capacitorList}
                  onChange={(e) => setCapacitorList(e.target.value)}
                  style={{
                    width: '100%',
                    height: '80px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px',
                    resize: 'vertical',
                    fontFamily: 'monospace'
                  }}
                  placeholder="Пример: 100, 220, 470, 1000"
                />
                <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                  💡 Форматы: "100, 220, 470" или "1к 2.2к 4.7к" (к = 1000)
                </div>
              </div>
            )}
          </div>

          {/* Дополнительные параметры */}
          <div style={{ 
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#8b5cf6', marginBottom: '16px', fontSize: '18px' }}>
              ⚡ Дополнительные параметры
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Общее напряжение (В)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Например: 12"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Частота (Гц)
                </label>
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
                    fontSize: '16px'
                  }}
                  placeholder="Например: 50"
                />
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
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                    {result.totalCapacitanceFormatted}
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    Общая емкость последовательного соединения
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
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                      {result.reactance.toFixed(1)} Ω
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Реактивное сопротивление</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                      {(result.energy * 1000).toFixed(3)} мДж
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Запасенная энергия</div>
                  </div>
                </div>
                
                {/* Распределение напряжения */}
                {Object.keys(result.voltageDistribution).length > 0 && parseFloat(voltage) > 0 && (
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px'
                  }}>
                    <div style={{ color: '#8b5cf6', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
                      📊 Распределение напряжения
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {Object.entries(result.voltageDistribution).map(([index, voltage]) => (
                        <div key={index}>
                          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>На C{parseInt(index) + 1}:</div>
                          <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                            {voltage.toFixed(2)} В
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Формула */}
                <div style={{ 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px'
                }}>
                  <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                    📝 Формула расчета:
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '14px', fontFamily: 'monospace' }}>
                    {result.formula}
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
                
                <button 
                  onClick={() => {
                    const text = `Cобщ = ${result.totalCapacitanceFormatted}, Xc = ${result.reactance.toFixed(1)}Ω`;
                    navigator.clipboard.writeText(text);
                    alert('Результаты скопированы!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#8b5cf6',
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
                  Введите емкости конденсаторов
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Выберите режим и укажите значения
                </div>
              </div>
            )}
          </div>

          {/* Формулы */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              1/C<sub>общ</sub> = 1/C₁ + 1/C₂ + ... + 1/C<sub>n</sub>
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Формула последовательного соединения
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
            Теория: Соединение конденсаторов
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#8b5cf6', marginBottom: '8px' }}>📏 Последовательное соединение</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Формула:</strong> 1/C<sub>общ</sub> = 1/C₁ + 1/C₂ + ... + 1/C<sub>n</sub></p>
              <p><strong>Для двух конденсаторов:</strong> C<sub>общ</sub> = (C₁ × C₂) ÷ (C₁ + C₂)</p>
              <p><strong>Для одинаковых конденсаторов:</strong> C<sub>общ</sub> = C ÷ n</p>
              <p><strong>Напряжение распределяется</strong> обратно пропорционально емкостям</p>
              <p><strong>Общая емкость ВСЕГДА меньше</strong> самой маленькой емкости в цепи</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>🔌 Параллельное соединение</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Формула:</strong> C<sub>общ</sub> = C₁ + C₂ + ... + C<sub>n</sub></p>
              <p><strong>Ёмкости просто складываются!</strong></p>
              <p><strong>Напряжение одинаковое</strong> на всех конденсаторах</p>
              <p><strong>Общая емкость ВСЕГДА больше</strong> самой большой емкости в цепи</p>
              <p><strong>Используется для увеличения</strong> общей емкости при том же напряжении</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#8b5cf6', marginBottom: '8px' }}>⚡ Практическое применение</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>Высокое напряжение</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Последовательно для распределения напряжения на нескольких конденсаторах
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>Точная подстройка</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Получение нестандартных значений из стандартных конденсаторов
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>Увеличение емкости</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Параллельно для увеличения общей емкости (блоки питания)
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>Защита от пробоя</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Последовательно для распределения напряжения и защиты
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #8b5cf6'
          }}>
            <h4 style={{ color: '#8b5cf6', marginBottom: '8px' }}>💡 Важные правила</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>При последовательном соединении</strong> общая емкость уменьшается</p>
              <p>• <strong>При параллельном соединении</strong> общая емкость увеличивается</p>
              <p>• <strong>Напряжение в последовательной цепи</strong> распределяется обратно пропорционально емкостям</p>
              <p>• <strong>Для электролитических конденсаторов</strong> последовательно нужны балансировочные резисторы</p>
              <p>• <strong>Максимальное напряжение цепи</strong> равно сумме напряжений конденсаторов (последовательно)</p>
              <p>• <strong>При параллельном соединении</strong> рабочее напряжение равно напряжению самого слабого конденсатора</p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>⚠️ Опасности</h4>
            <div style={{ color: '#cbd5e5', fontSize: '14px' }}>
              <p>• <strong>Несбалансированное напряжение</strong> в последовательной цепи - пробой слабого конденсатора</p>
              <p>• <strong>Обратная полярность</strong> электролитических конденсаторов - взрыв</p>
              <p>• <strong>Остаточный заряд</strong> - опасность поражения током даже после отключения</p>
              <p>• <strong>Большие емкости</strong> - огромная энергия, опасная при коротком замыкании</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}