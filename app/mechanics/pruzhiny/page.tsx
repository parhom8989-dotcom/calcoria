// app/mechanics/pruzhiny-guk/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function PruzhinyGukPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('force'); // 'force', 'deformation', 'stiffness', 'energy', 'frequency'
  
  // Основные параметры
  const [stiffness, setStiffness] = useState<string>('1000');
  const [deformation, setDeformation] = useState<string>('0.01');
  const [force, setForce] = useState<string>('10');
  const [mass, setMass] = useState<string>('0.5');
  const [energy, setEnergy] = useState<string>('0.05');
  
  // Результаты
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    explanation: string;
    warnings: string[];
    comparison: Array<{label: string, value: number, unit: string}>;
  } | null>(null);

  // Типовые жесткости (Н/м)
  const typicalStiffnesses = [
    { value: '100', label: '100 Н/м', desc: 'Мягкая' },
    { value: '1000', label: '1000 Н/м', desc: 'Средняя' },
    { value: '10000', label: '10000 Н/м', desc: 'Жёсткая' },
    { value: '100000', label: '100 кН/м', desc: 'Очень жёсткая' },
    { value: '10', label: '10 Н/м', desc: 'Очень мягкая' },
    { value: '500000', label: '500 кН/м', desc: 'Пружина авто' },
  ];

  // Типовые деформации (м)
  const typicalDeformations = [
    { value: '0.001', label: '1 мм', desc: 'Маленькая' },
    { value: '0.01', label: '1 см', desc: 'Средняя' },
    { value: '0.05', label: '5 см', desc: 'Большая' },
    { value: '0.1', label: '10 см', desc: 'Очень большая' },
    { value: '0.5', label: '50 см', desc: 'Предельная' },
    { value: '0.0001', label: '0.1 мм', desc: 'Минимальная' },
  ];

  // Типовые силы (Н)
  const typicalForces = [
    { value: '1', label: '1 Н', desc: 'Маленькая' },
    { value: '10', label: '10 Н', desc: 'Средняя' },
    { value: '100', label: '100 Н', desc: 'Большая' },
    { value: '1000', label: '1000 Н', desc: 'Очень большая' },
    { value: '10000', label: '10 кН', desc: 'Гигантская' },
    { value: '0.1', label: '0.1 Н', desc: 'Минимальная' },
  ];

  // Типовые массы (кг)
  const typicalMasses = [
    { value: '0.01', label: '10 г', desc: 'Очень легкая' },
    { value: '0.1', label: '100 г', desc: 'Легкая' },
    { value: '0.5', label: '500 г', desc: 'Средняя' },
    { value: '1', label: '1 кг', desc: 'Тяжелая' },
    { value: '10', label: '10 кг', desc: 'Очень тяжелая' },
    { value: '100', label: '100 кг', desc: 'Гигантская' },
  ];

  // Типовые энергии (Дж)
  const typicalEnergies = [
    { value: '0.001', label: '1 мДж', desc: 'Очень малая' },
    { value: '0.01', label: '10 мДж', desc: 'Малая' },
    { value: '0.1', label: '100 мДж', desc: 'Средняя' },
    { value: '1', label: '1 Дж', desc: 'Большая' },
    { value: '10', label: '10 Дж', desc: 'Очень большая' },
    { value: '100', label: '100 Дж', desc: 'Гигантская' },
  ];

  // Расчет
  const calculate = () => {
    const k = parseFloat(stiffness) || 0;
    const x = parseFloat(deformation) || 0;
    const F = parseFloat(force) || 0;
    const m = parseFloat(mass) || 0;
    const E = parseFloat(energy) || 0;
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let explanation = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];

    switch(mode) {
      case 'force':
        value = k * x;
        unit = 'Н (Ньютон)';
        formula = 'F = k × x';
        explanation = `Сила упругости пружины при деформации ${(x * 1000).toFixed(1)} мм`;
        if (value > 10000) warnings.push('💡 Очень большая сила - проверьте прочность пружины');
        comparison = [
          { label: 'Вес яблока', value: 1, unit: 'Н' },
          { label: 'Вес книги', value: 10, unit: 'Н' },
          { label: 'Вес человека', value: 700, unit: 'Н' },
        ];
        break;
        
      case 'deformation':
        if (k !== 0) {
          value = F / k;
          unit = 'м';
          formula = 'x = F / k';
          explanation = `Деформация пружины под действием силы ${F} Н`;
        }
        if (value > 0.5) warnings.push('⚠️ Очень большая деформация - возможна остаточная деформация');
        comparison = [
          { label: 'Толщина бумаги', value: 0.0001, unit: 'м' },
          { label: 'Дюйм', value: 0.0254, unit: 'м' },
          { label: 'Длина линейки', value: 0.3, unit: 'м' },
        ];
        break;
        
      case 'stiffness':
        if (x !== 0) {
          value = F / x;
          unit = 'Н/м';
          formula = 'k = F / x';
          explanation = `Жёсткость пружины (коэффициент упругости)`;
        }
        if (value > 1000000) warnings.push('⚡ Очень высокая жёсткость - специальные пружины');
        comparison = [
          { label: 'Мягкая пружина', value: 100, unit: 'Н/м' },
          { label: 'Средняя пружина', value: 1000, unit: 'Н/м' },
          { label: 'Автомобильная', value: 20000, unit: 'Н/м' },
        ];
        break;
        
      case 'energy':
        value = (k * x * x) / 2;
        unit = 'Дж (Джоуль)';
        formula = 'E = (k × x²) / 2';
        explanation = `Потенциальная энергия упругой деформации`;
        if (value > 1000) warnings.push('💥 Очень большая энергия - опасно!');
        comparison = [
          { label: 'Поднять яблоко на 1 м', value: 1, unit: 'Дж' },
          { label: 'Пулька из пистолета', value: 3, unit: 'Дж' },
          { label: 'Удар боксёра', value: 500, unit: 'Дж' },
        ];
        break;
        
      case 'frequency':
        if (k > 0 && m > 0) {
          value = (1 / (2 * Math.PI)) * Math.sqrt(k / m);
          unit = 'Гц';
          formula = 'f = (1/2π) × √(k/m)';
          explanation = `Собственная частота колебаний груза на пружине`;
        }
        if (value > 100) warnings.push('🔊 Высокая частота - ультразвуковой диапазон');
        comparison = [
          { label: 'Сердцебиение', value: 1.2, unit: 'Гц' },
          { label: 'Сетевая частота', value: 50, unit: 'Гц' },
          { label: 'Свист', value: 1000, unit: 'Гц' },
        ];
        break;
    }

    // Общие проверки
    if (k < 0) warnings.push('❌ Жёсткость не может быть отрицательной');
    if (x < 0) warnings.push('❌ Деформация не может быть отрицательной');
    if (F < 0) warnings.push('❌ Сила не может быть отрицательной');
    if (m < 0) warnings.push('❌ Масса не может быть отрицательной');
    if (E < 0) warnings.push('❌ Энергия не может быть отрицательной');

    setResult({
      value,
      unit,
      formula,
      explanation,
      warnings,
      comparison
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, stiffness, deformation, force, mass, energy]);

  const resetCalculator = () => {
    setStiffness('1000');
    setDeformation('0.01');
    setForce('10');
    setMass('0.5');
    setEnergy('0.05');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalStiffness = (value: string) => {
    setStiffness(value);
  };

  const selectTypicalDeformation = (value: string) => {
    setDeformation(value);
  };

  const selectTypicalForce = (value: string) => {
    setForce(value);
  };

  const selectTypicalMass = (value: string) => {
    setMass(value);
  };

  const selectTypicalEnergy = (value: string) => {
    setEnergy(value);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Мета-теги и SEO-контент */}
      <head>
        <title>Калькулятор пружин онлайн | Закон Гука, энергия пружин, колебания</title>
        <meta name="description" content="Бесплатный онлайн калькулятор для расчёта пружин по закону Гука. Вычисление силы упругости, деформации, жёсткости, энергии пружин и частоты колебаний." />
        <meta name="keywords" content="калькулятор пружин, закон Гука, сила упругости, деформация пружины, жёсткость пружины, энергия пружины, колебания пружины, механические расчёты" />
        <meta property="og:title" content="Калькулятор пружин онлайн | Закон Гука и энергия упругости" />
        <meta property="og:description" content="Расчёт силы упругости, деформации, жёсткости пружин и энергии упругой деформации" />
      </head>

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
              🌀 Калькулятор пружин - Закон Гука
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт силы упругости, деформации, жёсткости и энергии пружин
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
                color: '#10b981',
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
                color: '#10b981',
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
            <h2 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Выберите тип расчёта:
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '20px'
            }}>
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
                Сила упругости (F)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('deformation')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'deformation' ? '#10b981' : '#334155',
                  color: mode === 'deformation' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'deformation' ? '#10b981' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Деформация (x)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('stiffness')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'stiffness' ? '#10b981' : '#334155',
                  color: mode === 'stiffness' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'stiffness' ? '#10b981' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Жёсткость (k)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('energy')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'energy' ? '#10b981' : '#334155',
                  color: mode === 'energy' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'energy' ? '#10b981' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Энергия (E)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('frequency')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'frequency' ? '#10b981' : '#334155',
                  color: mode === 'frequency' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'frequency' ? '#10b981' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Частота колебаний (f)
              </button>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#1e293b', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#94a3b8',
              borderLeft: '4px solid #10b981'
            }}>
              {mode === 'force' && 'F = k × x — Сила упругости пружины по закону Гука'}
              {mode === 'deformation' && 'x = F / k — Деформация пружины под действием силы'}
              {mode === 'stiffness' && 'k = F / x — Коэффициент жёсткости (упругости) пружины'}
              {mode === 'energy' && 'E = (k × x²) / 2 — Потенциальная энергия упругой деформации'}
              {mode === 'frequency' && 'f = (1/2π) × √(k/m) — Собственная частота колебаний груза на пружине'}
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Введите параметры:
            </h2>
            
            {/* Сила упругости */}
            {mode === 'force' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Жёсткость пружины (Н/м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalStiffnesses.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalStiffness(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: stiffness === item.value ? '#10b981' : '#334155',
                          color: stiffness === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${stiffness === item.value ? '#10b981' : '#475569'}`,
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
                    step="1"
                    value={stiffness}
                    onChange={(e) => setStiffness(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите жёсткость пружины"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Деформация (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDeformations.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDeformation(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: deformation === item.value ? '#10b981' : '#334155',
                          color: deformation === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${deformation === item.value ? '#10b981' : '#475569'}`,
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
                    step="0.001"
                    value={deformation}
                    onChange={(e) => setDeformation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите деформацию в метрах"
                  />
                </div>
              </>
            )}

            {/* Деформация */}
            {mode === 'deformation' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Сила (Н)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
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
                    placeholder="Введите силу в Ньютонах"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Жёсткость пружины (Н/м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalStiffnesses.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalStiffness(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: stiffness === item.value ? '#10b981' : '#334155',
                          color: stiffness === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${stiffness === item.value ? '#10b981' : '#475569'}`,
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
                    step="1"
                    value={stiffness}
                    onChange={(e) => setStiffness(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите жёсткость пружины"
                  />
                </div>
              </>
            )}

            {/* Жёсткость */}
            {mode === 'stiffness' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Сила (Н)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
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
                    placeholder="Введите силу в Ньютонах"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Деформация (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDeformations.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDeformation(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: deformation === item.value ? '#10b981' : '#334155',
                          color: deformation === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${deformation === item.value ? '#10b981' : '#475569'}`,
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
                    step="0.001"
                    value={deformation}
                    onChange={(e) => setDeformation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите деформацию в метрах"
                  />
                </div>
              </>
            )}

            {/* Энергия */}
            {mode === 'energy' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Жёсткость пружины (Н/м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalStiffnesses.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalStiffness(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: stiffness === item.value ? '#10b981' : '#334155',
                          color: stiffness === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${stiffness === item.value ? '#10b981' : '#475569'}`,
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
                    step="1"
                    value={stiffness}
                    onChange={(e) => setStiffness(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите жёсткость пружины"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Деформация (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDeformations.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDeformation(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: deformation === item.value ? '#10b981' : '#334155',
                          color: deformation === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${deformation === item.value ? '#10b981' : '#475569'}`,
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
                    step="0.001"
                    value={deformation}
                    onChange={(e) => setDeformation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите деформацию в метрах"
                  />
                </div>
              </>
            )}

            {/* Частота колебаний */}
            {mode === 'frequency' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Жёсткость пружины (Н/м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalStiffnesses.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalStiffness(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: stiffness === item.value ? '#10b981' : '#334155',
                          color: stiffness === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${stiffness === item.value ? '#10b981' : '#475569'}`,
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
                    step="1"
                    value={stiffness}
                    onChange={(e) => setStiffness(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите жёсткость пружины"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Масса груза (кг)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
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
                    step="0.01"
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
                    placeholder="Введите массу груза"
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
                      {result.value.toFixed(6)}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '18px' }}>
                      {result.unit}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                      {result.explanation}
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
                      <div style={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '8px' }}>
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
                    const text = `${mode === 'force' ? 'Сила упругости' : mode === 'deformation' ? 'Деформация' : mode === 'stiffness' ? 'Жёсткость' : mode === 'energy' ? 'Энергия' : 'Частота колебаний'}: ${result.value.toFixed(6)} ${result.unit}`;
                    navigator.clipboard.writeText(text);
                    alert('Результат скопирован!');
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
                    width: '100%'
                  }}
                >
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🌀</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта пружин
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Выберите тип расчёта и укажите известные значения
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
              F = kx | E = kx²/2 | f = (1/2π)√(k/m)
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основные формулы: закон Гука, энергия упругости, колебания
            </div>
          </div>
        </div>

        {/* ========================== */
        /* SEO-ОПТИМИЗИРОВАННЫЙ КОНТЕНТ */
        /* ========================== */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#10b981' }}>
            Калькулятор пружин онлайн: закон Гука, энергия упругости, колебания
          </h1>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#10b981' }}>
              Что такое закон Гука и зачем нужен этот калькулятор?
            </h2>
            <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>
              <strong>Закон Гука</strong> — это основной закон теории упругости, открытый Робертом Гуком в 1660 году. Он описывает линейную зависимость между силой упругости и деформацией пружины: F = k × x.
            </p>
            <p style={{ color: '#cbd5e1' }}>
              Наш онлайн калькулятор позволяет быстро выполнять расчёты по закону Гука без сложных вычислений. Вы можете определить силу упругости, деформацию пружины, её жёсткость, энергию упругой деформации и частоту колебаний.
            </p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#10b981' }}>
              Основные формулы расчёта пружин
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#f59e0b' }}>1. Закон Гука (сила упругости)</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> F = k × x<br/>
                <strong>Где:</strong> F — сила упругости (Н), k — коэффициент жёсткости (Н/м), x — деформация (м)<br/>
                <strong>Пример:</strong> При жёсткости 1000 Н/м и деформации 0.01 м сила составит 10 Н.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#f59e0b' }}>2. Энергия упругой деформации</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> E = (k × x²) / 2<br/>
                <strong>Где:</strong> E — потенциальная энергия (Дж)<br/>
                <strong>Пример:</strong> Пружина жёсткостью 1000 Н/м, сжатая на 0.1 м, запасает 5 Дж энергии.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#f59e0b' }}>3. Частота колебаний</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> f = (1/2π) × √(k/m)<br/>
                <strong>Где:</strong> f — частота колебаний (Гц), m — масса груза (кг)<br/>
                <strong>Пример:</strong> Груз 0.5 кг на пружине 1000 Н/м колеблется с частотой 7.12 Гц.
              </p>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#10b981' }}>
              Практическое применение расчётов пружин
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Автомобилестроение</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Подвески, амортизаторы, клапанные пружины, тормозные системы.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Машиностроение</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Пружинные муфты, механизмы подачи, возвратные устройства.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Приборостроение</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Весы, манометры, измерительные приборы, реле времени.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Бытовая техника</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Дверные механизмы, матрасы, игрушки, спортивный инвентарь.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#10b981' }}>
              Часто задаваемые вопросы (FAQ) по пружинам
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px' }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#f59e0b' }}>📌 Что такое предел упругости пружины?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  <strong>Предел упругости</strong> — максимальная деформация, после которой пружина не возвращается в исходное состояние. Обычно составляет 60-80% от максимальной деформации.
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#f59e0b' }}>📌 Как рассчитать жёсткость нескольких пружин?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  При <strong>последовательном</strong> соединении: 1/k = 1/k₁ + 1/k₂<br/>
                  При <strong>параллельном</strong> соединении: k = k₁ + k₂
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#f59e0b' }}>📌 Почему пружины устают и ломаются?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Из-за циклических нагрузок в материале накапливаются микротрещины (усталость металла). Срок службы зависит от амплитуды и частоты колебаний.
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#f59e0b' }}>📌 Как выбрать пружину для конкретной задачи?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  1. Определите требуемую силу и ход<br/>
                  2. Рассчитайте жёсткость по формуле k = F/x<br/>
                  3. Учитывайте запас прочности 20-30%<br/>
                  4. Наш калькулятор поможет с этими расчётами
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #06b6d4' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#06b6d4' }}>
              💡 Практические советы по работе с пружинами
            </h2>
            <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Всегда оставляйте запас хода 10-20% от максимальной деформации</li>
              <li style={{ marginBottom: '10px' }}>Для переменных нагрузок используйте пружины из легированных сталей</li>
              <li style={{ marginBottom: '10px' }}>Смазывайте пружины в условиях повышенной влажности</li>
              <li style={{ marginBottom: '10px' }}>Проверяйте пружины на наличие трещин и коррозии</li>
              <li>При проектировании учитывайте температурный коэффициент расширения</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}