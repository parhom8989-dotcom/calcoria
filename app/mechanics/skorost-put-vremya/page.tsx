// app/mechanics/skorost-put-vremya/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function SkorostPutVremyaPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('speed'); // 'speed', 'distance', 'time'
  
  // Основные параметры
  const [distance, setDistance] = useState<string>('100');
  const [time, setTime] = useState<string>('10');
  const [speed, setSpeed] = useState<string>('10');
  
  // Единицы измерения
  const [distanceUnit, setDistanceUnit] = useState<string>('m'); // 'm', 'km', 'cm'
  const [timeUnit, setTimeUnit] = useState<string>('s'); // 's', 'min', 'h'
  const [speedUnit, setSpeedUnit] = useState<string>('m/s'); // 'm/s', 'km/h'
  
  // Результаты
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    warnings: string[];
    typicalValues: Array<{value: string, label: string, desc: string}>;
    comparison: Array<{label: string, value: number, unit: string}>;
  } | null>(null);

  // Типовые расстояния (м)
  const typicalDistances = [
    { value: '0.1', label: '0.1 м', desc: '10 см' },
    { value: '1', label: '1 м', desc: 'Метр' },
    { value: '10', label: '10 м', desc: 'Комната' },
    { value: '100', label: '100 м', desc: 'Футбольное поле' },
    { value: '1000', label: '1 км', desc: 'Километр' },
    { value: '10000', label: '10 км', desc: 'Город' },
  ];

  // Типовые времена (с)
  const typicalTimes = [
    { value: '0.1', label: '0.1 с', desc: 'Моментально' },
    { value: '1', label: '1 с', desc: 'Секунда' },
    { value: '10', label: '10 с', desc: 'Коротко' },
    { value: '60', label: '1 мин', desc: 'Минута' },
    { value: '3600', label: '1 час', desc: 'Час' },
    { value: '86400', label: '1 сутки', desc: 'День' },
  ];

  // Типовые скорости (м/с)
  const typicalSpeedsMps = [
    { value: '0.1', label: '0.1 м/с', desc: 'Медленно' },
    { value: '1', label: '1 м/с', desc: 'Ходьба' },
    { value: '3', label: '3 м/с', desc: 'Быстрая ходьба' },
    { value: '5', label: '5 м/с', desc: 'Бег' },
    { value: '10', label: '10 м/с', desc: 'Спринт' },
    { value: '20', label: '20 м/с', desc: 'Автомобиль' },
  ];

  // Типовые скорости (км/ч)
  const typicalSpeedsKmph = [
    { value: '1', label: '1 км/ч', desc: 'Медленная ходьба' },
    { value: '5', label: '5 км/ч', desc: 'Ходьба' },
    { value: '10', label: '10 км/ч', desc: 'Быстрая ходьба' },
    { value: '20', label: '20 км/ч', desc: 'Велосипед' },
    { value: '60', label: '60 км/ч', desc: 'Автомобиль в городе' },
    { value: '120', label: '120 км/ч', desc: 'Автомобиль на трассе' },
  ];

  // Конвертация единиц
  const convertDistance = (value: number, unit: string): number => {
    switch(unit) {
      case 'km': return value * 1000;
      case 'cm': return value / 100;
      default: return value; // м
    }
  };

  const convertTime = (value: number, unit: string): number => {
    switch(unit) {
      case 'min': return value * 60;
      case 'h': return value * 3600;
      default: return value; // с
    }
  };

  const convertSpeed = (value: number, unit: string): number => {
    if (unit === 'km/h') {
      return value * 1000 / 3600; // км/ч → м/с
    }
    return value; // м/с
  };

  const formatSpeed = (value: number, unit: string): string => {
    if (unit === 'km/h') {
      return (value * 3.6).toFixed(2) + ' км/ч';
    }
    return value.toFixed(2) + ' м/с';
  };

  const formatDistance = (value: number): string => {
    if (value >= 1000) {
      return (value / 1000).toFixed(2) + ' км';
    } else if (value < 1) {
      return (value * 100).toFixed(2) + ' см';
    }
    return value.toFixed(2) + ' м';
  };

  const formatTime = (value: number): string => {
    if (value >= 86400) {
      return (value / 86400).toFixed(2) + ' суток';
    } else if (value >= 3600) {
      return (value / 3600).toFixed(2) + ' ч';
    } else if (value >= 60) {
      return (value / 60).toFixed(2) + ' мин';
    }
    return value.toFixed(2) + ' с';
  };

  // Расчет
  const calculate = () => {
    const s_input = parseFloat(distance) || 0;
    const t_input = parseFloat(time) || 0;
    const v_input = parseFloat(speed) || 0;
    
    const s_m = convertDistance(s_input, distanceUnit);
    const t_s = convertTime(t_input, timeUnit);
    const v_mps = convertSpeed(v_input, speedUnit);
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];
    let displayValue = 0;
    let displayUnit = '';

    switch(mode) {
      case 'speed':
        if (t_s !== 0) {
          value = s_m / t_s;
          displayValue = speedUnit === 'km/h' ? value * 3.6 : value;
          displayUnit = speedUnit;
          unit = 'м/с';
          formula = 'v = s / t';
        }
        if (value > 100) warnings.push('⚠️ Очень высокая скорость - сверхзвуковая');
        if (value < 0.001) warnings.push('⚠️ Очень маленькая скорость');
        comparison = [
          { label: 'Ходьба человека', value: 1.4, unit: 'м/с' },
          { label: 'Бег человека', value: 5, unit: 'м/с' },
          { label: 'Автомобиль (город)', value: 13.9, unit: 'м/с' },
          { label: 'Самолёт', value: 250, unit: 'м/с' },
          { label: 'Звук в воздухе', value: 340, unit: 'м/с' },
        ];
        break;
        
      case 'distance':
        value = v_mps * t_s;
        displayValue = value;
        displayUnit = 'м';
        unit = 'м';
        formula = 's = v × t';
        if (value > 1000000) warnings.push('💡 Большое расстояние - космические масштабы');
        comparison = [
          { label: 'Футбольное поле', value: 100, unit: 'м' },
          { label: 'Марафон', value: 42195, unit: 'м' },
          { label: 'Расстояние до Луны', value: 384400000, unit: 'м' },
          { label: 'Световой год', value: 9.46e15, unit: 'м' },
        ];
        break;
        
      case 'time':
        if (v_mps !== 0) {
          value = s_m / v_mps;
          displayValue = value;
          displayUnit = 'с';
          unit = 'с';
          formula = 't = s / v';
        }
        if (value > 31536000) warnings.push('💡 Большое время - больше года');
        comparison = [
          { label: 'Минута', value: 60, unit: 'с' },
          { label: 'Час', value: 3600, unit: 'с' },
          { label: 'Сутки', value: 86400, unit: 'с' },
          { label: 'Год', value: 31536000, unit: 'с' },
        ];
        break;
    }

    // Проверки
    if (v_mps > 300000000) warnings.push('❌ Скорость не может превышать скорость света (300,000,000 м/с)');
    if (s_m < 0) warnings.push('❌ Расстояние не может быть отрицательным');
    if (t_s < 0) warnings.push('❌ Время не может быть отрицательным');
    if (v_mps < 0) warnings.push('❌ Скорость не может быть отрицательной');

    setResult({
      value,
      unit,
      formula,
      warnings,
      typicalValues: typicalDistances,
      comparison
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, distance, time, speed, distanceUnit, timeUnit, speedUnit]);

  const resetCalculator = () => {
    setDistance('100');
    setTime('10');
    setSpeed('10');
    setDistanceUnit('m');
    setTimeUnit('s');
    setSpeedUnit('m/s');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalDistance = (value: string) => {
    setDistance(value);
  };

  const selectTypicalTime = (value: string) => {
    setTime(value);
  };

  const selectTypicalSpeed = (value: string) => {
    setSpeed(value);
  };

  // Форматирование результата для отображения
  const formatResult = () => {
    if (!result) return "0.00";
    
    let displayValue = result.value;
    let displayUnit = result.unit;
    
    if (mode === 'speed') {
      if (speedUnit === 'km/h') {
        displayValue = result.value * 3.6;
        displayUnit = 'км/ч';
      } else {
        displayUnit = 'м/с';
      }
      return `${displayValue.toFixed(2)} ${displayUnit}`;
    }
    
    if (mode === 'distance') {
      return formatDistance(result.value);
    }
    
    if (mode === 'time') {
      return formatTime(result.value);
    }
    
    return `${result.value.toFixed(2)} ${result.unit}`;
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
              🚗 Скорость, путь, время
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Основные формулы кинематики: v = s/t
            </p>
          </div>

          {/* Кнопки навигации */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <a 
              href="/mechanics"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#334155',
                color: '#f59e0b',
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
              Что найти?
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setMode('speed')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'speed' ? '#8b5cf6' : '#334155',
                  color: mode === 'speed' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'speed' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Скорость (v)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('distance')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'distance' ? '#8b5cf6' : '#334155',
                  color: mode === 'distance' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'distance' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Расстояние (s)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('time')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'time' ? '#8b5cf6' : '#334155',
                  color: mode === 'time' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'time' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Время (t)
              </button>
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Основные параметры
            </h3>
            
            {/* Скорость */}
            {mode === 'speed' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Расстояние</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDistances.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDistance(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: distance === item.value ? '#8b5cf6' : '#334155',
                          color: distance === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${distance === item.value ? '#8b5cf6' : '#475569'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        <div style={{ fontSize: '9px', opacity: 0.8 }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Расстояние"
                    />
                    <select 
                      value={distanceUnit} 
                      onChange={(e) => setDistanceUnit(e.target.value)}
                      style={{
                        width: '80px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <option value="m">м</option>
                      <option value="km">км</option>
                      <option value="cm">см</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Время</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalTimes.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalTime(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: time === item.value ? '#8b5cf6' : '#334155',
                          color: time === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${time === item.value ? '#8b5cf6' : '#475569'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        <div style={{ fontSize: '9px', opacity: 0.8 }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Время"
                    />
                    <select 
                      value={timeUnit} 
                      onChange={(e) => setTimeUnit(e.target.value)}
                      style={{
                        width: '80px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <option value="s">с</option>
                      <option value="min">мин</option>
                      <option value="h">ч</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Единицы скорости результата
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setSpeedUnit('m/s')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: speedUnit === 'm/s' ? '#8b5cf6' : '#334155',
                        color: speedUnit === 'm/s' ? '#0f172a' : 'white',
                        border: `1px solid ${speedUnit === 'm/s' ? '#8b5cf6' : '#475569'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      м/с
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeedUnit('km/h')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: speedUnit === 'km/h' ? '#8b5cf6' : '#334155',
                        color: speedUnit === 'km/h' ? '#0f172a' : 'white',
                        border: `1px solid ${speedUnit === 'km/h' ? '#8b5cf6' : '#475569'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      км/ч
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Расстояние */}
            {mode === 'distance' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Скорость</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые (м/с):</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalSpeedsMps.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalSpeed(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: speed === item.value ? '#8b5cf6' : '#334155',
                          color: speed === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${speed === item.value ? '#8b5cf6' : '#475569'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        <div style={{ fontSize: '9px', opacity: 0.8 }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Скорость"
                    />
                    <select 
                      value={speedUnit} 
                      onChange={(e) => setSpeedUnit(e.target.value)}
                      style={{
                        width: '80px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <option value="m/s">м/с</option>
                      <option value="km/h">км/ч</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Время</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalTimes.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalTime(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: time === item.value ? '#8b5cf6' : '#334155',
                          color: time === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${time === item.value ? '#8b5cf6' : '#475569'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        <div style={{ fontSize: '9px', opacity: 0.8 }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Время"
                    />
                    <select 
                      value={timeUnit} 
                      onChange={(e) => setTimeUnit(e.target.value)}
                      style={{
                        width: '80px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <option value="s">с</option>
                      <option value="min">мин</option>
                      <option value="h">ч</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Время */}
            {mode === 'time' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Расстояние</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDistances.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDistance(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: distance === item.value ? '#8b5cf6' : '#334155',
                          color: distance === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${distance === item.value ? '#8b5cf6' : '#475569'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        <div style={{ fontSize: '9px', opacity: 0.8 }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Расстояние"
                    />
                    <select 
                      value={distanceUnit} 
                      onChange={(e) => setDistanceUnit(e.target.value)}
                      style={{
                        width: '80px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <option value="m">м</option>
                      <option value="km">км</option>
                      <option value="cm">см</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Скорость</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые (м/с):</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalSpeedsMps.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalSpeed(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: speed === item.value ? '#8b5cf6' : '#334155',
                          color: speed === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${speed === item.value ? '#8b5cf6' : '#475569'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        <div style={{ fontSize: '9px', opacity: 0.8 }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Скорость"
                    />
                    <select 
                      value={speedUnit} 
                      onChange={(e) => setSpeedUnit(e.target.value)}
                      style={{
                        width: '80px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <option value="m/s">м/с</option>
                      <option value="km/h">км/ч</option>
                    </select>
                  </div>
                </div>
              </>
            )}
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
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                      {formatResult()}
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                      {mode === 'speed' ? 'Скорость' : mode === 'distance' ? 'Расстояние' : 'Время'}
                    </div>
                  </div>
                  
                  {/* Формула */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px'
                  }}>
                    <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '8px' }}>
                      📝 Используемая формула:
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontFamily: 'monospace' }}>
                      {result.formula}
                    </div>
                  </div>
                  
                  {/* Сравнение */}
                  {result.comparison && result.comparison.length > 0 && (
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '16px',
                      backgroundColor: '#1e293b',
                      borderRadius: '8px'
                    }}>
                      <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                        📊 Для сравнения:
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {result.comparison.map((item, index) => (
                          <div key={index} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.label}:</span>
                            <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>
                              {item.unit === 'м/с' ? item.value.toFixed(1) : item.value.toLocaleString()} {item.unit}
                            </span>
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
                    const text = `${mode === 'speed' ? 'Скорость' : mode === 'distance' ? 'Расстояние' : 'Время'}: ${formatResult()}`;
                    navigator.clipboard.writeText(text);
                    alert('Результат скопирован!');
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
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🚗</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчета
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Выберите что найти и укажите известные значения
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
              v = s/t | s = v×t | t = s/v
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основные формулы кинематики для равномерного движения
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
            Теория: Скорость, путь, время
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#8b5cf6', marginBottom: '8px' }}>📏 Основные формулы</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Скорость:</strong> v = Δs / Δt (изменение пути за изменение времени)</p>
              <p><strong>Путь при равномерном движении:</strong> s = v × t</p>
              <p><strong>Время движения:</strong> t = s / v</p>
              <p><strong>Средняя скорость:</strong> vср = sобщ / tобщ</p>
              <p><strong>Перевод единиц:</strong> 1 м/с = 3.6 км/ч | 1 км/ч ≈ 0.278 м/с</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#8b5cf6', marginBottom: '8px' }}>🚗 Практические примеры скоростей</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Человек</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Ходьба: 1.4 м/с (5 км/ч)<br/>
                  Бег: 5 м/с (18 км/ч)<br/>
                  Спринт: 10 м/с (36 км/ч)
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Транспорт</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Велосипед: 5.5 м/с (20 км/ч)<br/>
                  Автомобиль: 13.9-33.3 м/с<br/>
                  Поезд: до 55 м/с (200 км/ч)
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Животные</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Черепаха: 0.05 м/с<br/>
                  Гепард: 30 м/с (108 км/ч)<br/>
                  Сапсан: до 100 м/с (пикирование)
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Техника</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Звук в воздухе: 340 м/с<br/>
                  Самолёт: 250-300 м/с<br/>
                  Космическая станция: 7,660 м/с
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
            <h4 style={{ color: '#8b5cf6', marginBottom: '8px' }}>💡 Практические советы</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Для перевода км/ч в м/с</strong> разделите на 3.6: 90 км/ч ÷ 3.6 = 25 м/с</p>
              <p>• <strong>При расчёте времени в пути</strong> учитывайте остановки и изменение скорости</p>
              <p>• <strong>Средняя скорость ≠ среднему арифметическому</strong> скоростей при неравномерном движении</p>
              <p>• <strong>Для безопасности</strong> добавьте 10-20% времени на непредвиденные обстоятельства</p>
              <p>• <strong>При больших расстояниях</strong> учитывайте кривизну Земли (для расчётов &gt; 100 км)</p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>⚠️ Важные замечания</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Формулы для равномерного движения</strong> - при ускоренном движении используются другие формулы</p>
              <p>• <strong>Скорость света</strong> - максимально возможная скорость в природе: 299,792,458 м/с</p>
              <p>• <strong>При околосветовых скоростях</strong> начинают действовать законы теории относительности</p>
              <p>• <strong>В жидкостях и газах</strong> скорость зависит от плотности и вязкости среды</p>
              <p>• <strong>Для точных расчётов</strong> учитывайте сопротивление воздуха, особенно при высоких скоростях</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}