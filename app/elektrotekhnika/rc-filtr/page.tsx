// app/elektrotekhnika/rc-filtr/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function RcFiltrPage() {
  // Параметры ввода
  const [resistance, setResistance] = useState<string>('1000');
  const [capacitance, setCapacitance] = useState<string>('1');
  const [frequency, setFrequency] = useState<string>('1000');
  
  // Единицы измерения
  const [resistanceUnit, setResistanceUnit] = useState<string>('Ω');
  const [capacitanceUnit, setCapacitanceUnit] = useState<string>('μF');
  const [frequencyUnit, setFrequencyUnit] = useState<string>('Hz');
  
  // Тип фильтра
  const [filterType, setFilterType] = useState<'lowpass' | 'highpass'>('lowpass');
  const [calculationMode, setCalculationMode] = useState<'fc' | 'rc' | 'components'>('fc');
  
  // Результаты
  const [result, setResult] = useState<{
    cutoffFrequency: number;
    timeConstant: number;
    angularFrequency: number;
    impedance: number;
    phaseShift: number;
    attenuation: number;
    capacitorReactance: number;
    recommendedComponents: { r: string; c: string; }[];
    filterResponse: string;
  } | null>(null);
  
  // Готовые фильтры
  const presetFilters = {
    audio_lowpass: { r: '10000', rUnit: 'Ω', c: '0.01', cUnit: 'μF', desc: 'Аудио НЧ (16кГц)' },
    audio_highpass: { r: '10000', rUnit: 'Ω', c: '0.1', cUnit: 'μF', desc: 'Аудио ВЧ (160Гц)' },
    power_supply: { r: '100', rUnit: 'Ω', c: '100', cUnit: 'μF', desc: 'Фильтр питания (16Гц)' },
    digital_filter: { r: '1000', rUnit: 'Ω', c: '0.001', cUnit: 'μF', desc: 'Цифровой (160кГц)' },
    emi_filter: { r: '47', rUnit: 'Ω', c: '0.01', cUnit: 'μF', desc: 'EMI фильтр (340кГц)' }
  };
  
  // Конвертация единиц
  const convertToBase = (value: string, unit: string, type: 'resistance' | 'capacitance' | 'frequency'): number => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return NaN;
    
    switch (type) {
      case 'resistance':
        switch (unit) {
          case 'Ω': return numValue;
          case 'kΩ': return numValue * 1000;
          case 'MΩ': return numValue * 1000000;
          default: return numValue;
        }
      case 'capacitance':
        switch (unit) {
          case 'pF': return numValue * 1e-12;
          case 'nF': return numValue * 1e-9;
          case 'μF': return numValue * 1e-6;
          case 'mF': return numValue * 1e-3;
          case 'F': return numValue;
          default: return numValue * 1e-6; // μF по умолчанию
        }
      case 'frequency':
        switch (unit) {
          case 'Hz': return numValue;
          case 'kHz': return numValue * 1000;
          case 'MHz': return numValue * 1000000;
          default: return numValue;
        }
      default:
        return numValue;
    }
  };
  
  // Конвертация из базовых единиц
  const convertFromBase = (value: number, unit: string, type: 'resistance' | 'capacitance' | 'frequency'): number => {
    if (isNaN(value)) return NaN;
    
    switch (type) {
      case 'resistance':
        switch (unit) {
          case 'Ω': return value;
          case 'kΩ': return value / 1000;
          case 'MΩ': return value / 1000000;
          default: return value;
        }
      case 'capacitance':
        switch (unit) {
          case 'pF': return value / 1e-12;
          case 'nF': return value / 1e-9;
          case 'μF': return value / 1e-6;
          case 'mF': return value / 1e-3;
          case 'F': return value;
          default: return value / 1e-6;
        }
      case 'frequency':
        switch (unit) {
          case 'Hz': return value;
          case 'kHz': return value / 1000;
          case 'MHz': return value / 1000000;
          default: return value;
        }
      default:
        return value;
    }
  };
  
  // Форматирование частоты
  const formatFrequency = (freq: number): string => {
    if (freq >= 1000000) return `${(freq / 1000000).toFixed(3)} МГц`;
    if (freq >= 1000) return `${(freq / 1000).toFixed(3)} кГц`;
    return `${freq.toFixed(3)} Гц`;
  };
  
  // Форматирование времени
  const formatTime = (time: number): string => {
    if (time < 1e-6) return `${(time * 1e9).toFixed(2)} нс`;
    if (time < 1e-3) return `${(time * 1e6).toFixed(2)} мкс`;
    if (time < 1) return `${(time * 1e3).toFixed(2)} мс`;
    return `${time.toFixed(3)} с`;
  };
  
  // Расчёт
  const calculate = () => {
    const R = convertToBase(resistance, resistanceUnit, 'resistance');
    const C = convertToBase(capacitance, capacitanceUnit, 'capacitance');
    const F = convertToBase(frequency, frequencyUnit, 'frequency');
    
    if (isNaN(R) || isNaN(C) || R <= 0 || C <= 0) {
      setResult(null);
      return;
    }
    
    // Частота среза: fc = 1 / (2πRC)
    const cutoffFrequency = 1 / (2 * Math.PI * R * C);
    
    // Постоянная времени: τ = RC
    const timeConstant = R * C;
    
    // Угловая частота: ω = 2πf = 1/τ
    const angularFrequency = 1 / timeConstant;
    
    // Реактивное сопротивление конденсатора на частоте f
    const capacitorReactance = 1 / (2 * Math.PI * F * C);
    
    // Импеданс RC цепи
    const impedance = Math.sqrt(R * R + capacitorReactance * capacitorReactance);
    
    // Фазовый сдвиг
    const phaseShift = Math.atan(capacitorReactance / R) * (180 / Math.PI);
    const phaseShiftAdjusted = filterType === 'lowpass' ? -phaseShift : 90 - phaseShift;
    
    // Ослабление на частоте f
    const attenuationDB = 20 * Math.log10(1 / Math.sqrt(1 + Math.pow(F / cutoffFrequency, 2)));
    
    // Рекомендуемые компоненты для стандартных частот
    const recommendedComponents = [
      { freq: 100, r: '16kΩ', c: '0.1μF' },
      { freq: 1000, r: '1.6kΩ', c: '0.1μF' },
      { freq: 10000, r: '1.6kΩ', c: '0.01μF' },
      { freq: 100000, r: '1.6kΩ', c: '0.001μF' },
      { freq: 1000000, r: '1.6kΩ', c: '100pF' }
    ].map(comp => ({
      r: comp.r,
      c: comp.c
    }));
    
    // Описание АЧХ
    let filterResponse = "";
    if (F < cutoffFrequency * 0.1) {
      filterResponse = filterType === 'lowpass' ? "Сигнал проходит почти без изменений" : "Сигнал сильно ослаблен";
    } else if (F > cutoffFrequency * 10) {
      filterResponse = filterType === 'lowpass' ? "Сигнал сильно ослаблен" : "Сигнал проходит почти без изменений";
    } else {
      filterResponse = "Частота вблизи точки среза";
    }
    
    setResult({
      cutoffFrequency,
      timeConstant,
      angularFrequency,
      impedance,
      phaseShift: phaseShiftAdjusted,
      attenuation: attenuationDB,
      capacitorReactance,
      recommendedComponents,
      filterResponse
    });
  };
  
  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [resistance, capacitance, frequency, resistanceUnit, capacitanceUnit, frequencyUnit, filterType]);
  
  // Сброс
  const resetCalculator = () => {
    setResistance('1000');
    setCapacitance('1');
    setFrequency('1000');
    setResistanceUnit('Ω');
    setCapacitanceUnit('μF');
    setFrequencyUnit('Hz');
    setFilterType('lowpass');
    setCalculationMode('fc');
    setResult(null);
  };
  
  // Установка готового фильтра
  const setPreset = (presetKey: keyof typeof presetFilters) => {
    const preset = presetFilters[presetKey];
    setResistance(preset.r);
    setResistanceUnit(preset.rUnit);
    setCapacitance(preset.c);
    setCapacitanceUnit(preset.cUnit);
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
              color: '#06b6d4'
            }}>
              🔄 Калькулятор RC-фильтра
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт частоты среза, постоянной времени и параметров RC-фильтров
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
                color: '#06b6d4',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Готовые фильтры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Готовые фильтры
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}>
              {Object.entries(presetFilters).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setPreset(key as keyof typeof presetFilters)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#334155',
                    color: 'white',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{preset.desc}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {preset.r}{preset.rUnit} + {preset.c}{preset.cUnit}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Тип фильтра */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Тип фильтра
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setFilterType('lowpass')}
                style={{
                  padding: '14px',
                  backgroundColor: filterType === 'lowpass' ? '#06b6d4' : '#334155',
                  color: 'white',
                  border: `2px solid ${filterType === 'lowpass' ? '#06b6d4' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                ФНЧ (Low-pass)
              </button>
              
              <button
                onClick={() => setFilterType('highpass')}
                style={{
                  padding: '14px',
                  backgroundColor: filterType === 'highpass' ? '#06b6d4' : '#334155',
                  color: 'white',
                  border: `2px solid ${filterType === 'highpass' ? '#06b6d4' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                ФВЧ (High-pass)
              </button>
            </div>
            
            <div style={{
              backgroundColor: '#0f172a',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #334155',
              marginTop: '10px'
            }}>
              <div style={{ color: '#06b6d4', fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
                {filterType === 'lowpass' ? '🔽 Пропускает низкие частоты' : '🔼 Пропускает высокие частоты'}
              </div>
              <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '14px', marginTop: '8px' }}>
                {filterType === 'lowpass' ? 
                  'Ослабляет сигналы выше частоты среза' : 
                  'Ослабляет сигналы ниже частоты среза'}
              </p>
            </div>
          </div>

          {/* Параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Параметры компонентов
            </h3>
            
            {/* Сопротивление */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Сопротивление (R)
              </label>
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
                  <option value="Ω">Ω</option>
                  <option value="kΩ">kΩ</option>
                  <option value="MΩ">MΩ</option>
                </select>
              </div>
            </div>
            
            {/* Ёмкость */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Ёмкость (C)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  step="0.001"
                  value={capacitance}
                  onChange={(e) => setCapacitance(e.target.value)}
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
                  value={capacitanceUnit}
                  onChange={(e) => setCapacitanceUnit(e.target.value)}
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
                  <option value="pF">pF</option>
                  <option value="nF">nF</option>
                  <option value="μF">μF</option>
                  <option value="mF">mF</option>
                </select>
              </div>
            </div>
            
            {/* Частота сигнала (опционально) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Частота сигнала (для расчёта параметров на частоте f)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  step="1"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
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
                  value={frequencyUnit}
                  onChange={(e) => setFrequencyUnit(e.target.value)}
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
                  <option value="Hz">Гц</option>
                  <option value="kHz">кГц</option>
                  <option value="MHz">МГц</option>
                </select>
              </div>
            </div>
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
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '8px' }}>
                    {formatFrequency(result.cutoffFrequency)}
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    Частота среза (-3дБ)
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
                      {formatTime(result.timeConstant)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Постоянная времени (τ)</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                      {result.attenuation.toFixed(1)} дБ
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Ослабление на {formatFrequency(convertToBase(frequency, frequencyUnit, 'frequency'))}</div>
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
                    <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Характеристики на частоте {formatFrequency(convertToBase(frequency, frequencyUnit, 'frequency'))}:</span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: '#06b6d420',
                      color: '#06b6d4',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {result.filterResponse}
                    </span>
                  </div>
                  
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    <div>• <strong>Фазовый сдвиг:</strong> {result.phaseShift.toFixed(1)}°</div>
                    <div>• <strong>Импеданс цепи:</strong> {(result.impedance).toFixed(1)} Ω</div>
                    <div>• <strong>Реактивное сопротивление C:</strong> {(result.capacitorReactance).toFixed(1)} Ω</div>
                    <div>• <strong>Угловая частота:</strong> {result.angularFrequency.toFixed(1)} рад/с</div>
                  </div>
                </div>
                
                {/* Рекомендованные компоненты */}
                <div style={{ 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '16px' }}>
                    💡 Стандартные комбинации для частот среза:
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                    {result.recommendedComponents.map((comp, index) => (
                      <div key={index} style={{
                        padding: '10px',
                        backgroundColor: '#0f172a',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}>
                        <div style={{ color: '#06b6d4', fontSize: '12px' }}>R = {comp.r}</div>
                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>C = {comp.c}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => copyToClipboard(`fс = ${formatFrequency(result.cutoffFrequency)}, τ = ${formatTime(result.timeConstant)}`)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#06b6d4',
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
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🔄</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите сопротивление и ёмкость
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
            <div style={{ color: '#06b6d4', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              f<sub>c</sub> = 1 ÷ (2π × R × C)
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Формула частоты среза RC-фильтра
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#06b6d4' }}>
            Принцип работы RC-фильтров
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.6' }}>
            RC-фильтры — простейшие пассивные фильтры, состоящие из резистора и конденсатора. 
            Их работа основана на частотной зависимости реактивного сопротивления конденсатора. 
            На низких частотах конденсатор имеет высокое сопротивление, на высоких — низкое.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#06b6d4', marginBottom: '8px' }}>ФНЧ (Low-pass filter)</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Конденсатор параллельно нагрузке</strong> — шунтирует высокие частоты</p>
                <p>• <strong>Частота среза:</strong> f<sub>c</sub> = 1 / (2πRC)</p>
                <p>• <strong>Применение:</strong> подавление ВЧ помех, сглаживание пульсаций, антиалиасинг</p>
                <p>• <strong>АЧХ:</strong> ослабление -20дБ/декаду выше f<sub>c</sub></p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#06b6d4', marginBottom: '8px' }}>ФВЧ (High-pass filter)</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Конденсатор последовательно с нагрузкой</strong> — блокирует НЧ составляющие</p>
                <p>• <strong>Частота среза:</strong> f<sub>c</sub> = 1 / (2πRC)</p>
                <p>• <strong>Применение:</strong> разделение НЧ/ВЧ в аудио, устранение постоянной составляющей</p>
                <p>• <strong>АЧХ:</strong> ослабление -20дБ/декаду ниже f<sub>c</sub></p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#06b6d4' }}>Ключевые параметры RC-фильтров</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Частота среза (-3дБ)</strong> — частота, на которой мощность сигнала уменьшается вдвое</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Постоянная времени (τ = RC)</strong> — время заряда конденсатора до 63% от напряжения</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Крутизна спада</strong> — -20дБ/декаду для фильтра первого порядка</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Фазовый сдвиг</strong> — от 0° до 90° в зависимости от частоты</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Добротность (Q)</strong> — для RC-фильтра Q = 0.707 на частоте среза</li>
            <li>• <strong>Выходное сопротивление</strong> — зависит от частоты и влияет на нагрузку</li>
          </ul>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #06b6d4'
          }}>
            <h4 style={{ color: '#06b6d4', marginBottom: '8px' }}>🔧 Практические рекомендации</h4>
            <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <strong>Выбор компонентов:</strong><br/>
              1. Для точной частоты среза используйте прецизионные резисторы (±1%) и плёночные конденсаторы<br/>
              2. Мощность резистора: P = U²/R (учитывайте максимальное напряжение)<br/>
              3. Рабочее напряжение конденсатора должно быть минимум в 1.5 раза выше максимального в цепи<br/>
              4. Для аудиоприменений используйте плёночные или полипропиленовые конденсаторы<br/>
              5. При проектировании учитывайте входное сопротивление следующего каскада
            </p>
          </div>
          
          <div style={{ 
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#06b6d4', marginBottom: '8px' }}>📈 Пример: Фильтр для аудио</h4>
            <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <strong>Задача:</strong> Создать ФНЧ с частотой среза 3.4кГц для телефонной линии<br/>
              <strong>Расчёт:</strong> Выбираем R = 4.7кΩ → C = 1/(2π × 4700 × 3400) ≈ 10нФ<br/>
              <strong>Компоненты:</strong> 4.7кΩ резистор (±5%), 10нФ керамический конденсатор (±10%)<br/>
              <strong>Проверка:</strong> f<sub>c</sub> = 1/(2×3.14×4700×10×10<sup>-9</sup>) = 3386 Гц ≈ 3.4кГц
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}