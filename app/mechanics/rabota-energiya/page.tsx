// app/mechanics/rabota-energiya/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function RabotaEnergiyaPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('work'); // 'work', 'force', 'distance', 'kinetic', 'potential'
  
  // Основные параметры
  const [force, setForce] = useState<string>('100');
  const [distance, setDistance] = useState<string>('10');
  const [mass, setMass] = useState<string>('10');
  const [velocity, setVelocity] = useState<string>('5');
  const [height, setHeight] = useState<string>('5');
  
  // Гравитация
  const [gravity, setGravity] = useState<string>('9.81');
  
  // Результаты
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    warnings: string[];
    typicalValues: Array<{value: string, label: string, desc: string}>;
    comparison: Array<{label: string, value: number, unit: string}>;
  } | null>(null);

  // Типовые силы (Н)
  const typicalForces = [
    { value: '10', label: '10 Н', desc: 'Лёгкий предмет' },
    { value: '100', label: '100 Н', desc: 'Средняя сила' },
    { value: '500', label: '500 Н', desc: 'Сила человека' },
    { value: '1000', label: '1000 Н', desc: 'Большая сила' },
    { value: '5000', label: '5 кН', desc: 'Промышленная' },
    { value: '10000', label: '10 кН', desc: 'Очень большая' },
  ];

  // Типовые расстояния (м)
  const typicalDistances = [
    { value: '0.1', label: '0.1 м', desc: '10 см' },
    { value: '1', label: '1 м', desc: 'Метр' },
    { value: '5', label: '5 м', desc: 'Комната' },
    { value: '10', label: '10 м', desc: 'Коридор' },
    { value: '50', label: '50 м', desc: 'Бассейн' },
    { value: '100', label: '100 м', desc: 'Футбольное поле' },
  ];

  // Типовые массы (кг)
  const typicalMasses = [
    { value: '1', label: '1 кг', desc: 'Пакет молока' },
    { value: '5', label: '5 кг', desc: 'Гиря' },
    { value: '10', label: '10 кг', desc: 'Ведро воды' },
    { value: '50', label: '50 кг', desc: 'Мешок цемента' },
    { value: '70', label: '70 кг', desc: 'Человек' },
    { value: '1000', label: '1000 кг', desc: 'Автомобиль' },
  ];

  // Типовые скорости (м/с)
  const typicalVelocities = [
    { value: '1', label: '1 м/с', desc: 'Медленная ходьба' },
    { value: '3', label: '3 м/с', desc: 'Быстрая ходьба' },
    { value: '5', label: '5 м/с', desc: 'Бег' },
    { value: '10', label: '10 м/с', desc: 'Спринт' },
    { value: '20', label: '20 м/с', desc: 'Автомобиль' },
    { value: '50', label: '50 м/с', desc: 'Поезд' },
  ];

  // Типовые высоты (м)
  const typicalHeights = [
    { value: '1', label: '1 м', desc: 'Стол' },
    { value: '3', label: '3 м', desc: 'Потолок' },
    { value: '10', label: '10 м', desc: '3 этаж' },
    { value: '50', label: '50 м', desc: 'Высотка' },
    { value: '100', label: '100 м', desc: 'Небоскрёб' },
    { value: '1000', label: '1000 м', desc: 'Гора' },
  ];

  // Расчет
  const calculate = () => {
    const F = parseFloat(force) || 0;
    const s = parseFloat(distance) || 0;
    const m = parseFloat(mass) || 0;
    const v = parseFloat(velocity) || 0;
    const h = parseFloat(height) || 0;
    const g = parseFloat(gravity) || 9.81;
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];

    switch(mode) {
      case 'work':
        value = F * s;
        unit = 'Дж (Джоуль)';
        formula = 'A = F × s';
        if (value > 1000000) warnings.push('⚠️ Очень большая работа - проверьте значения');
        if (value < 0.001) warnings.push('⚠️ Очень маленькая работа - проверьте единицы измерения');
        comparison = [
          { label: 'Поднять яблоко на 1 м', value: 1, unit: 'Дж' },
          { label: 'Поднять человека на 1 м', value: 700, unit: 'Дж' },
          { label: 'Суточная норма человека', value: 10000000, unit: 'Дж' },
        ];
        break;
        
      case 'force':
        if (s !== 0) {
          value = F / s;
          unit = 'Н (Ньютон)';
          formula = 'F = A / s';
        }
        comparison = [
          { label: 'Вес яблока', value: 1, unit: 'Н' },
          { label: 'Вес человека', value: 700, unit: 'Н' },
          { label: 'Тяга двигателя', value: 100000, unit: 'Н' },
        ];
        break;
        
      case 'distance':
        if (F !== 0) {
          value = s / F;
          unit = 'м (Метр)';
          formula = 's = A / F';
        }
        comparison = [
          { label: 'Длина стола', value: 1, unit: 'м' },
          { label: 'Бассейн', value: 25, unit: 'м' },
          { label: 'Футбольное поле', value: 100, unit: 'м' },
        ];
        break;
        
      case 'kinetic':
        value = 0.5 * m * v * v;
        unit = 'Дж (Кинетическая энергия)';
        formula = 'Ek = ½ × m × v²';
        if (value > 1000000) warnings.push('⚠️ Очень большая кинетическая энергия - опасность!');
        comparison = [
          { label: 'Мяч для тенниса', value: 50, unit: 'Дж' },
          { label: 'Пуля пистолета', value: 500, unit: 'Дж' },
          { label: 'Автомобиль 60 км/ч', value: 300000, unit: 'Дж' },
        ];
        break;
        
      case 'potential':
        value = m * g * h;
        unit = 'Дж (Потенциальная энергия)';
        formula = 'Ep = m × g × h';
        comparison = [
          { label: 'Яблоко на дереве', value: 2, unit: 'Дж' },
          { label: 'Человек на 3 этаже', value: 20000, unit: 'Дж' },
          { label: 'Вода в плотине (1м³)', value: 10000, unit: 'Дж' },
        ];
        break;
    }

    // Проверки
    if (v > 100) warnings.push('💡 Очень высокая скорость - релятивистские эффекты');
    if (h > 10000) warnings.push('💡 Высота больше 10 км - изменение гравитации');
    if (Math.abs(g - 9.81) > 2) {
      warnings.push(`💡 Нестандартная гравитация: ${g} м/с² (Земля: 9.81 м/с²)`);
    }

    setResult({
      value,
      unit,
      formula,
      warnings,
      typicalValues: typicalForces,
      comparison
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, force, distance, mass, velocity, height, gravity]);

  const resetCalculator = () => {
    setForce('100');
    setDistance('10');
    setMass('10');
    setVelocity('5');
    setHeight('5');
    setGravity('9.81');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalForce = (value: string) => {
    setForce(value);
  };

  const selectTypicalDistance = (value: string) => {
    setDistance(value);
  };

  const selectTypicalMass = (value: string) => {
    setMass(value);
  };

  const selectTypicalVelocity = (value: string) => {
    setVelocity(value);
  };

  const selectTypicalHeight = (value: string) => {
    setHeight(value);
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
              color: '#10b981'
            }}>
              ⚡ Работа и энергия
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Механическая работа, кинетическая и потенциальная энергия
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
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setMode('work')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'work' ? '#10b981' : '#334155',
                  color: mode === 'work' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'work' ? '#10b981' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Работу (A)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('force')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'force' ? '#10b981' : '#334155',
                  color: mode === 'force' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'force' ? '#10b981' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Силу (F)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('distance')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'distance' ? '#10b981' : '#334155',
                  color: mode === 'distance' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'distance' ? '#10b981' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Расстояние (s)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('kinetic')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'kinetic' ? '#10b981' : '#334155',
                  color: mode === 'kinetic' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'kinetic' ? '#10b981' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Кинетическую энергию (Ek)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('potential')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'potential' ? '#10b981' : '#334155',
                  color: mode === 'potential' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'potential' ? '#10b981' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Потенциальную энергию (Ep)
              </button>
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Основные параметры
            </h3>
            
            {/* Работа, сила, расстояние */}
            {(mode === 'work' || mode === 'force' || mode === 'distance') && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>
                      {mode === 'work' ? 'Сила (Н)' : mode === 'force' ? 'Работа (Дж)' : 'Работа (Дж)'}
                    </label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalForces.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalForce(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: force === item.value ? '#10b981' : '#334155',
                          color: force === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${force === item.value ? '#10b981' : '#475569'}`,
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
                  <input
                    type="number"
                    step="0.1"
                    value={force}
                    onChange={(e) => setForce(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder={`Введите ${mode === 'work' ? 'силу' : 'работу'}`}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>
                      {mode === 'work' ? 'Расстояние (м)' : mode === 'force' ? 'Расстояние (м)' : 'Сила (Н)'}
                    </label>
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
                          backgroundColor: distance === item.value ? '#10b981' : '#334155',
                          color: distance === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${distance === item.value ? '#10b981' : '#475569'}`,
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
                  <input
                    type="number"
                    step="0.1"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder={`Введите ${mode === 'distance' ? 'силу' : 'расстояние'}`}
                  />
                </div>
              </>
            )}

            {/* Кинетическая энергия */}
            {mode === 'kinetic' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Масса (кг)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalMasses.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalMass(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: mass === item.value ? '#10b981' : '#334155',
                          color: mass === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${mass === item.value ? '#10b981' : '#475569'}`,
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
                  <input
                    type="number"
                    step="0.1"
                    value={mass}
                    onChange={(e) => setMass(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите массу"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Скорость (м/с)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalVelocities.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalVelocity(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: velocity === item.value ? '#10b981' : '#334155',
                          color: velocity === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${velocity === item.value ? '#10b981' : '#475569'}`,
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
                  <input
                    type="number"
                    step="0.1"
                    value={velocity}
                    onChange={(e) => setVelocity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите скорость"
                  />
                </div>
              </>
            )}

            {/* Потенциальная энергия */}
            {mode === 'potential' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Масса (кг)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalMasses.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalMass(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: mass === item.value ? '#10b981' : '#334155',
                          color: mass === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${mass === item.value ? '#10b981' : '#475569'}`,
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
                  <input
                    type="number"
                    step="0.1"
                    value={mass}
                    onChange={(e) => setMass(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите массу"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Высота (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalHeights.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalHeight(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: height === item.value ? '#10b981' : '#334155',
                          color: height === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${height === item.value ? '#10b981' : '#475569'}`,
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
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите высоту"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Ускорение свободного падения (м/с²)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setGravity('9.81')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: gravity === '9.81' ? '#10b981' : '#334155',
                        color: gravity === '9.81' ? '#0f172a' : 'white',
                        border: `1px solid ${gravity === '9.81' ? '#10b981' : '#475569'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Земля: 9.81
                    </button>
                    <button
                      type="button"
                      onClick={() => setGravity('1.62')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: gravity === '1.62' ? '#10b981' : '#334155',
                        color: gravity === '1.62' ? '#0f172a' : 'white',
                        border: `1px solid ${gravity === '1.62' ? '#10b981' : '#475569'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Луна: 1.62
                    </button>
                    <button
                      type="button"
                      onClick={() => setGravity('3.71')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: gravity === '3.71' ? '#10b981' : '#334155',
                        color: gravity === '3.71' ? '#0f172a' : 'white',
                        border: `1px solid ${gravity === '3.71' ? '#10b981' : '#475569'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Марс: 3.71
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={gravity}
                    onChange={(e) => setGravity(e.target.value)}
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
                    placeholder="Введите значение g"
                  />
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
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                      {result.value.toFixed(2)}
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                      {result.unit}
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
                      <div style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '8px' }}>
                        📊 Для сравнения:
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {result.comparison.map((item, index) => (
                          <div key={index} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.label}:</span>
                            <span style={{ fontWeight: 'bold', color: '#10b981' }}>
                              {item.value.toLocaleString()} {item.unit}
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
                    const text = `${mode === 'work' ? 'Работа' : mode === 'force' ? 'Сила' : mode === 'distance' ? 'Расстояние' : mode === 'kinetic' ? 'Кинетическая энергия' : 'Потенциальная энергия'}: ${result.value.toFixed(2)} ${result.unit.split(' ')[0]}`;
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
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚡</div>
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
            <div style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              A = F × s | Ek = ½mv² | Ep = mgh
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основные формулы для работы и энергии
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
            Теория: Работа и энергия
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>📏 Основные формулы</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Механическая работа:</strong> A = F × s × cos(α) (α - угол между силой и перемещением)</p>
              <p><strong>Кинетическая энергия:</strong> Ek = ½ × m × v²</p>
              <p><strong>Потенциальная энергия:</strong> Ep = m × g × h</p>
              <p><strong>Единицы измерения:</strong> 1 Дж = 1 Н·м = 1 кг·м²/с²</p>
              <p><strong>Мощность:</strong> P = A / t (1 Вт = 1 Дж/с)</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>⚡ Практические примеры</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Человек поднимается на этаж</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Масса: 70 кг<br/>
                  Высота: 3 м<br/>
                  Работа: ~2,000 Дж
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Автомобиль разгоняется</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Масса: 1500 кг<br/>
                  Скорость: 20 м/с<br/>
                  Энергия: 300,000 Дж
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Молот кузнеца</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Масса: 5 кг<br/>
                  Высота: 1 м<br/>
                  Энергия: 49 Дж<br/>
                  Удар: до 5000 Дж
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Вода в ГЭС</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Масса: 1000 кг (1 м³)<br/>
                  Высота: 100 м<br/>
                  Энергия: 981,000 Дж<br/>
                  Мощность: от 1 МВт
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '8px' }}>💡 Практические советы</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Работа ≠ энергия:</strong> Работа - процесс передачи энергии, энергия - способность совершать работу</p>
              <p>• <strong>КПД:</strong> Полезная работа всегда меньше затраченной из-за потерь</p>
              <p>• <strong>Закон сохранения:</strong> Энергия не создаётся и не исчезает, а превращается из одной формы в другую</p>
              <p>• <strong>1 кДж ≈ 0.24 ккал</strong> (пищевая энергия)</p>
              <p>• <strong>1 кВт·ч = 3.6 МДж</strong> (электрическая энергия)</p>
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
              <p>• <strong>При больших скоростях</strong> (близких к скорости света) формула кинетической энергии меняется</p>
              <p>• <strong>Потенциальная энергия</strong> зависит от выбора нулевого уровня</p>
              <p>• <strong>Работа силы трения</strong> всегда отрицательна (переходит в тепло)</p>
              <p>• <strong>В неконсервативных системах</strong> механическая энергия не сохраняется</p>
              <p>• <strong>Для точных расчётов</strong> учитывайте КПД механизмов и потери на трение</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}