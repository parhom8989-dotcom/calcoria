// app/mechanics/gidravlika/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function GidravlikaPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('pressure'); // 'pressure', 'force', 'area', 'hydrostatic', 'flow_rate', 'velocity', 'pipe_diameter'
  
  // Основные параметры
  const [force, setForce] = useState<string>('1000');
  const [area, setArea] = useState<string>('0.01');
  const [pressure, setPressure] = useState<string>('100000');
  const [density, setDensity] = useState<string>('1000');
  const [height, setHeight] = useState<string>('10');
  const [flowRate, setFlowRate] = useState<string>('0.001');
  const [pipeArea, setPipeArea] = useState<string>('0.0001');
  const [velocity, setVelocity] = useState<string>('10');
  const [pipeDiameter, setPipeDiameter] = useState<string>('0.1');
  
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
    { value: '10', label: '10 Н', desc: 'Маленькая' },
    { value: '100', label: '100 Н', desc: 'Средняя' },
    { value: '1000', label: '1000 Н', desc: 'Большая' },
    { value: '10000', label: '10 кН', desc: 'Промышленная' },
    { value: '100000', label: '100 кН', desc: 'Очень большая' },
    { value: '1000000', label: '1 МН', desc: 'Гигантская' },
  ];

  // Типовые площади (м²)
  const typicalAreas = [
    { value: '0.0001', label: '1 см²', desc: 'Маленькая' },
    { value: '0.001', label: '10 см²', desc: 'Средняя' },
    { value: '0.01', label: '100 см²', desc: 'Большая' },
    { value: '0.1', label: '0.1 м²', desc: 'Промышленная' },
    { value: '1', label: '1 м²', desc: 'Очень большая' },
    { value: '10', label: '10 м²', desc: 'Гигантская' },
  ];

  // Типовые давления (Па)
  const typicalPressures = [
    { value: '1000', label: '1 кПа', desc: 'Малое' },
    { value: '10000', label: '10 кПа', desc: 'Среднее' },
    { value: '100000', label: '100 кПа', desc: 'Атмосферное' },
    { value: '1000000', label: '1 МПа', desc: 'Высокое' },
    { value: '10000000', label: '10 МПа', desc: 'Очень высокое' },
    { value: '100000000', label: '100 МПа', desc: 'Экстремальное' },
  ];

  // Типовые плотности (кг/м³) - ТОЛЬКО ЖИДКОСТИ
  const typicalDensities = [
    { value: '800', label: '800', desc: 'Нефть, масло' },
    { value: '1000', label: '1000', desc: 'Вода пресная' },
    { value: '1025', label: '1025', desc: 'Морская вода' },
    { value: '790', label: '790', desc: 'Спирт этиловый' },
    { value: '13600', label: '13600', desc: 'Ртуть' },
    { value: '700', label: '700', desc: 'Бензин' },
  ];

  // Типовые высоты (м)
  const typicalHeights = [
    { value: '0.1', label: '0.1 м', desc: '10 см' },
    { value: '1', label: '1 м', desc: 'Метр' },
    { value: '10', label: '10 м', desc: '3 этаж' },
    { value: '100', label: '100 м', desc: 'Высотка' },
    { value: '1000', label: '1000 м', desc: 'Гора' },
    { value: '10000', label: '10 км', desc: 'Высота полета' },
  ];

  // Типовые расходы (м³/с)
  const typicalFlowRates = [
    { value: '0.000001', label: '1 мл/с', desc: 'Капля' },
    { value: '0.0001', label: '100 мл/с', desc: 'Ручеек' },
    { value: '0.001', label: '1 л/с', desc: 'Струя' },
    { value: '0.01', label: '10 л/с', desc: 'Поток' },
    { value: '0.1', label: '100 л/с', desc: 'Речка' },
    { value: '1', label: '1 м³/с', desc: 'Река' },
  ];

  // Типовые скорости (м/с)
  const typicalVelocities = [
    { value: '0.1', label: '0.1 м/с', desc: 'Медленно' },
    { value: '1', label: '1 м/с', desc: 'Средне' },
    { value: '10', label: '10 м/с', desc: 'Быстро' },
    { value: '100', label: '100 м/с', desc: 'Очень быстро' },
    { value: '300', label: '300 м/с', desc: 'Звуковая' },
    { value: '1000', label: '1000 м/с', desc: 'Сверхзвуковая' },
  ];

  // Расчет
  const calculate = () => {
    const F = parseFloat(force) || 0;
    const A = parseFloat(area) || 0;
    const p = parseFloat(pressure) || 0;
    const ρ = parseFloat(density) || 1000;
    const h = parseFloat(height) || 0;
    const Q = parseFloat(flowRate) || 0;
    const A_pipe = parseFloat(pipeArea) || 0;
    const v = parseFloat(velocity) || 0;
    const D = parseFloat(pipeDiameter) || 0;
    const g = 9.81; // м/с²
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];

    switch(mode) {
      case 'pressure':
        if (A !== 0) {
          value = F / A;
          unit = 'Па (Паскаль)';
          formula = 'p = F / A';
        }
        if (value > 1e9) warnings.push('⚠️ Очень высокое давление - экстремальные условия');
        if (value < 0) warnings.push('❌ Давление не может быть отрицательным');
        comparison = [
          { label: 'Атмосферное давление', value: 101325, unit: 'Па' },
          { label: 'Гидравлический пресс', value: 2e7, unit: 'Па' },
          { label: 'Глубина Марианской впадины', value: 1.1e8, unit: 'Па' },
        ];
        break;
        
      case 'force':
        value = p * A;
        unit = 'Н (Ньютон)';
        formula = 'F = p × A';
        if (value > 1e9) warnings.push('💡 Очень большая сила - промышленные масштабы');
        comparison = [
          { label: 'Вес автомобиля', value: 15000, unit: 'Н' },
          { label: 'Сила гидравлического пресса', value: 1e6, unit: 'Н' },
          { label: 'Тяга ракеты Saturn V', value: 3.4e7, unit: 'Н' },
        ];
        break;
        
      case 'area':
        if (p !== 0) {
          value = F / p;
          unit = 'м²';
          formula = 'A = F / p';
        }
        comparison = [
          { label: 'Лист А4', value: 0.06237, unit: 'м²' },
          { label: 'Квадратный метр', value: 1, unit: 'м²' },
          { label: 'Футбольное поле', value: 7140, unit: 'м²' },
        ];
        break;
        
      case 'hydrostatic':
        value = ρ * g * h;
        unit = 'Па (Гидростатическое давление)';
        formula = 'p = ρ × g × h';
        if (h > 11000) warnings.push('💡 Высота больше глубины Марианской впадины');
        comparison = [
          { label: '10 см воды', value: 981, unit: 'Па' },
          { label: '10 м воды', value: 98100, unit: 'Па' },
          { label: 'Марианская впадина', value: 1.1e8, unit: 'Па' },
        ];
        break;
        
      case 'flow_rate':
        value = A_pipe * v;
        unit = 'м³/с';
        formula = 'Q = A × v';
        comparison = [
          { label: 'Капля из крана', value: 1e-7, unit: 'м³/с' },
          { label: 'Домашний кран', value: 1e-4, unit: 'м³/с' },
          { label: 'Река Волга (средний)', value: 8060, unit: 'м³/с' },
        ];
        break;
        
      case 'velocity':
        if (A_pipe !== 0) {
          value = Q / A_pipe;
          unit = 'м/с';
          formula = 'v = Q / A';
        }
        if (value > 1000) warnings.push('⚠️ Очень высокая скорость - сверхзвуковой поток');
        comparison = [
          { label: 'Течение в реке', value: 1, unit: 'м/с' },
          { label: 'Водопроводная труба', value: 2, unit: 'м/с' },
          { label: 'Пожарный шланг', value: 30, unit: 'м/с' },
        ];
        break;
        
      case 'pipe_diameter':
        if (v !== 0) {
          const A_calc = Q / v;
          value = 2 * Math.sqrt(A_calc / Math.PI);
          unit = 'м';
          formula = 'D = 2 × √(Q / (π × v))';
        }
        comparison = [
          { label: 'Игла шприца', value: 0.001, unit: 'м' },
          { label: 'Водопроводная труба', value: 0.02, unit: 'м' },
          { label: 'Магистральный нефтепровод', value: 1.2, unit: 'м' },
        ];
        break;
    }

    // Общие проверки
    if (ρ < 0) warnings.push('❌ Плотность не может быть отрицательной');
    if (h < 0) warnings.push('❌ Высота не может быть отрицательной');
    if (Q < 0) warnings.push('❌ Расход не может быть отрицательным');
    if (v < 0) warnings.push('❌ Скорость не может быть отрицательной');

    setResult({
      value,
      unit,
      formula,
      warnings,
      typicalValues: typicalPressures,
      comparison
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, force, area, pressure, density, height, flowRate, pipeArea, velocity, pipeDiameter]);

  const resetCalculator = () => {
    setForce('1000');
    setArea('0.01');
    setPressure('100000');
    setDensity('1000');
    setHeight('10');
    setFlowRate('0.001');
    setPipeArea('0.0001');
    setVelocity('10');
    setPipeDiameter('0.1');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalForce = (value: string) => {
    setForce(value);
  };

  const selectTypicalArea = (value: string) => {
    setArea(value);
  };

  const selectTypicalPressure = (value: string) => {
    setPressure(value);
  };

  const selectTypicalDensity = (value: string) => {
    setDensity(value);
  };

  const selectTypicalHeight = (value: string) => {
    setHeight(value);
  };

  const selectTypicalFlowRate = (value: string) => {
    setFlowRate(value);
  };

  const selectTypicalVelocity = (value: string) => {
    setVelocity(value);
  };

  const selectTypicalPipeArea = (value: string) => {
    setPipeArea(value);
  };

  const selectTypicalDiameter = (value: string) => {
    setPipeDiameter(value);
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
        <title>Калькулятор гидравлики онлайн | Расчёт давления, силы, расхода</title>
        <meta name="description" content="Бесплатный онлайн калькулятор гидравлики для расчёта давления, гидростатического давления, силы, расхода жидкости и скорости потока. Формулы законов Паскаля и Бернулли." />
        <meta name="keywords" content="калькулятор гидравлики, гидравлика онлайн, давление жидкости, гидростатическое давление, закон Паскаля, расход жидкости, скорость потока, гидравлический расчёт" />
        <meta property="og:title" content="Калькулятор гидравлики онлайн | Профессиональные расчёты" />
        <meta property="og:description" content="Расчёт давления, силы, расхода и скорости жидкости по формулам гидравлики" />
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
              color: '#06b6d4'
            }}>
              💧 Калькулятор гидравлики
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт давления, силы, расхода и скорости жидкости
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
                onClick={() => setMode('pressure')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'pressure' ? '#06b6d4' : '#334155',
                  color: mode === 'pressure' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'pressure' ? '#06b6d4' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Давление от силы (Па)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('force')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'force' ? '#06b6d4' : '#334155',
                  color: mode === 'force' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'force' ? '#06b6d4' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Сила от давления (Н)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('area')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'area' ? '#06b6d4' : '#334155',
                  color: mode === 'area' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'area' ? '#06b6d4' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Площадь от силы и давления (м²)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('hydrostatic')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'hydrostatic' ? '#06b6d4' : '#334155',
                  color: mode === 'hydrostatic' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'hydrostatic' ? '#06b6d4' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Гидростатическое давление (Па)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('flow_rate')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'flow_rate' ? '#06b6d4' : '#334155',
                  color: mode === 'flow_rate' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'flow_rate' ? '#06b6d4' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Расход жидкости (м³/с)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('velocity')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'velocity' ? '#06b6d4' : '#334155',
                  color: mode === 'velocity' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'velocity' ? '#06b6d4' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Скорость потока (м/с)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('pipe_diameter')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'pipe_diameter' ? '#06b6d4' : '#334155',
                  color: mode === 'pipe_diameter' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'pipe_diameter' ? '#06b6d4' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Диаметр трубы (м)
              </button>
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Введите параметры:
            </h2>
            
            {/* Давление от силы */}
            {mode === 'pressure' && (
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
                          backgroundColor: force === item.value ? '#06b6d4' : '#334155',
                          color: force === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${force === item.value ? '#06b6d4' : '#475569'}`,
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
                    <label style={{ color: '#cbd5e1' }}>Площадь (м²)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalAreas.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalArea(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: area === item.value ? '#06b6d4' : '#334155',
                          color: area === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${area === item.value ? '#06b6d4' : '#475569'}`,
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
                    step="0.0001"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите площадь в квадратных метрах"
                  />
                </div>
              </>
            )}

            {/* Сила от давления */}
            {mode === 'force' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Давление (Па)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalPressures.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalPressure(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: pressure === item.value ? '#06b6d4' : '#334155',
                          color: pressure === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${pressure === item.value ? '#06b6d4' : '#475569'}`,
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
                    value={pressure}
                    onChange={(e) => setPressure(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите давление в Паскалях"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Площадь (м²)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalAreas.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalArea(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: area === item.value ? '#06b6d4' : '#334155',
                          color: area === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${area === item.value ? '#06b6d4' : '#475569'}`,
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
                    step="0.0001"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите площадь в квадратных метрах"
                  />
                </div>
              </>
            )}

            {/* Площадь от силы и давления */}
            {mode === 'area' && (
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
                          backgroundColor: force === item.value ? '#06b6d4' : '#334155',
                          color: force === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${force === item.value ? '#06b6d4' : '#475569'}`,
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
                    <label style={{ color: '#cbd5e1' }}>Давление (Па)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalPressures.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalPressure(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: pressure === item.value ? '#06b6d4' : '#334155',
                          color: pressure === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${pressure === item.value ? '#06b6d4' : '#475569'}`,
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
                    value={pressure}
                    onChange={(e) => setPressure(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите давление в Паскалях"
                  />
                </div>
              </>
            )}

            {/* Гидростатическое давление */}
            {mode === 'hydrostatic' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Плотность жидкости (кг/м³)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDensities.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDensity(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: density === item.value ? '#06b6d4' : '#334155',
                          color: density === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${density === item.value ? '#06b6d4' : '#475569'}`,
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
                    value={density}
                    onChange={(e) => setDensity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите плотность (вода = 1000 кг/м³)"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Высота столба жидкости (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalHeights.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalHeight(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: height === item.value ? '#06b6d4' : '#334155',
                          color: height === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${height === item.value ? '#06b6d4' : '#475569'}`,
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
                    placeholder="Введите высоту в метрах"
                  />
                </div>
              </>
            )}

            {/* Расход жидкости - ИСПРАВЛЕНО: только диаметр в мм */}
{mode === 'flow_rate' && (
  <>
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ color: '#cbd5e1' }}>Диаметр трубы (мм)</label>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые диаметры:</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {[
          { value: '10', label: '10 мм', desc: 'Тонкая трубка' },
          { value: '20', label: '20 мм', desc: 'Водопроводная' },
          { value: '50', label: '50 мм', desc: 'Средняя' },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setPipeDiameter(item.value);
              const diameterMm = parseFloat(item.value);
              const areaM2 = (Math.PI * Math.pow(diameterMm / 1000, 2)) / 4;
              setPipeArea(areaM2.toString());
            }}
            style={{
              padding: '6px 4px',
              backgroundColor: pipeDiameter === item.value ? '#06b6d4' : '#334155',
              color: pipeDiameter === item.value ? '#0f172a' : 'white',
              border: `1px solid ${pipeDiameter === item.value ? '#06b6d4' : '#475569'}`,
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
        value={pipeDiameter}
        onChange={(e) => {
          const diameterMm = e.target.value;
          setPipeDiameter(diameterMm);
          if (diameterMm) {
            const areaM2 = (Math.PI * Math.pow(parseFloat(diameterMm) / 1000, 2)) / 4;
            setPipeArea(areaM2.toString());
          }
        }}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#334155',
          border: '1px solid #475569',
          color: 'white',
          fontSize: '16px'
        }}
        placeholder="Введите диаметр трубы в мм"
      />
    </div>

    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ color: '#cbd5e1' }}>Скорость потока (м/с)</label>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {typicalVelocities.slice(0, 3).map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => selectTypicalVelocity(item.value)}
            style={{
              padding: '6px 4px',
              backgroundColor: velocity === item.value ? '#06b6d4' : '#334155',
              color: velocity === item.value ? '#0f172a' : 'white',
              border: `1px solid ${velocity === item.value ? '#06b6d4' : '#475569'}`,
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
        placeholder="Введите скорость потока"
      />
    </div>
  </>
)}

            {/* Скорость потока - ИСПРАВЛЕНО: только диаметр в мм */}
{mode === 'velocity' && (
  <>
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ color: '#cbd5e1' }}>Расход жидкости (м³/с)</label>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {typicalFlowRates.slice(0, 3).map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => selectTypicalFlowRate(item.value)}
            style={{
              padding: '6px 4px',
              backgroundColor: flowRate === item.value ? '#06b6d4' : '#334155',
              color: flowRate === item.value ? '#0f172a' : 'white',
              border: `1px solid ${flowRate === item.value ? '#06b6d4' : '#475569'}`,
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
        step="0.000001"
        value={flowRate}
        onChange={(e) => setFlowRate(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#334155',
          border: '1px solid #475569',
          color: 'white',
          fontSize: '16px'
        }}
        placeholder="Введите расход жидкости"
      />
    </div>

    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ color: '#cbd5e1' }}>Диаметр трубы (мм)</label>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые диаметры:</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {[
          { value: '10', label: '10 мм', desc: 'Тонкая трубка' },
          { value: '20', label: '20 мм', desc: 'Водопроводная' },
          { value: '50', label: '50 мм', desc: 'Средняя' },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setPipeDiameter(item.value);
              const diameterMm = parseFloat(item.value);
              const areaM2 = (Math.PI * Math.pow(diameterMm / 1000, 2)) / 4;
              setPipeArea(areaM2.toString());
            }}
            style={{
              padding: '6px 4px',
              backgroundColor: pipeDiameter === item.value ? '#06b6d4' : '#334155',
              color: pipeDiameter === item.value ? '#0f172a' : 'white',
              border: `1px solid ${pipeDiameter === item.value ? '#06b6d4' : '#475569'}`,
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
        value={pipeDiameter}
        onChange={(e) => {
          const diameterMm = e.target.value;
          setPipeDiameter(diameterMm);
          if (diameterMm) {
            const areaM2 = (Math.PI * Math.pow(parseFloat(diameterMm) / 1000, 2)) / 4;
            setPipeArea(areaM2.toString());
          }
        }}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#334155',
          border: '1px solid #475569',
          color: 'white',
          fontSize: '16px'
        }}
        placeholder="Введите диаметр трубы в мм"
      />
    </div>
  </>
)}

            {/* Диаметр трубы */}
            {mode === 'pipe_diameter' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Расход жидкости (м³/с)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalFlowRates.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalFlowRate(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: flowRate === item.value ? '#06b6d4' : '#334155',
                          color: flowRate === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${flowRate === item.value ? '#06b6d4' : '#475569'}`,
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
                    step="0.000001"
                    value={flowRate}
                    onChange={(e) => setFlowRate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите расход жидкости"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Скорость потока (м/с)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalVelocities.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalVelocity(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: velocity === item.value ? '#06b6d4' : '#334155',
                          color: velocity === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${velocity === item.value ? '#06b6d4' : '#475569'}`,
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
                    placeholder="Введите скорость потока"
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
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '8px' }}>
                      {result.value.toFixed(6)}
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
                      <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                        📊 Для сравнения:
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {result.comparison.map((item, index) => (
                          <div key={index} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.label}:</span>
                            <span style={{ fontWeight: 'bold', color: '#06b6d4' }}>
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
                    const text = `${mode === 'pressure' ? 'Давление' : mode === 'force' ? 'Сила' : mode === 'area' ? 'Площадь' : mode === 'hydrostatic' ? 'Гидростатическое давление' : mode === 'flow_rate' ? 'Расход' : mode === 'velocity' ? 'Скорость потока' : 'Диаметр трубы'}: ${result.value.toFixed(6)} ${result.unit.split(' ')[0]}`;
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
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>💧</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта гидравлики
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
            <div style={{ color: '#06b6d4', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              p = F/A | p = ρgh | Q = Av
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основные формулы гидравлики: закон Паскаля, гидростатическое давление, расход
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
          <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#06b6d4' }}>
            Калькулятор гидравлики онлайн: формулы, расчёты, примеры
          </h1>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#06b6d4' }}>
              Что такое гидравлика и зачем нужен этот калькулятор?
            </h2>
            <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>
              <strong>Гидравлика</strong> — это раздел физики и инженерной науки, изучающий законы движения и равновесия жидкостей, а также их практическое применение. Наш онлайн калькулятор гидравлики позволяет быстро и точно выполнять расчёты по основным формулам гидравлики без необходимости ручных вычислений.
            </p>
            <p style={{ color: '#cbd5e1' }}>
              С помощью этого инструмента вы можете рассчитать давление жидкости, силу гидравлического пресса, расход воды в трубе, скорость потока и другие важные параметры. Калькулятор идеально подходит для студентов, инженеров, проектировщиков и всех, кто работает с гидравлическими системами.
            </p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#06b6d4' }}>
              Основные формулы гидравлики для расчётов
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#10b981' }}>1. Закон Паскаля (давление от силы)</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> p = F / A<br/>
                <strong>Где:</strong> p — давление (Па), F — сила (Н), A — площадь (м²)<br/>
                <strong>Пример:</strong> Если сила 1000 Н действует на площадь 0.01 м², давление составит 100,000 Па (1 бар).
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#10b981' }}>2. Гидростатическое давление</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> p = ρ × g × h<br/>
                <strong>Где:</strong> ρ — плотность жидкости (кг/м³), g — ускорение свободного падения (9.81 м/с²), h — высота столба жидкости (м)<br/>
                <strong>Пример:</strong> Столб воды высотой 10 м создаёт давление около 98,100 Па (0.981 бар).
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#10b981' }}>3. Расход жидкости (уравнение неразрывности)</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> Q = A × v<br/>
                <strong>Где:</strong> Q — объёмный расход (м³/с), A — площадь сечения (м²), v — скорость потока (м/с)<br/>
                <strong>Пример:</strong> При скорости потока 2 м/с в трубе диаметром 0.1 м расход составит примерно 0.0157 м³/с.
              </p>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#06b6d4' }}>
              Практическое применение гидравлических расчётов
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#f59e0b' }}>Гидравлические прессы</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Используют закон Паскаля для умножения силы. Малое усилие на малом поршне создаёт большое усилие на большом поршне.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#f59e0b' }}>Водопроводные системы</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Расчёт давления и расхода необходим для проектирования систем водоснабжения, отопления и канализации.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#f59e0b' }}>Гидротехнические сооружения</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Плотины, шлюзы, дамбы требуют точных расчётов гидростатического давления и нагрузок.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#f59e0b' }}>Автомобильные системы</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Тормозные системы, гидроусилители руля работают на принципах гидравлики.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#06b6d4' }}>
              Часто задаваемые вопросы (FAQ) по гидравлике
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px' }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#10b981' }}>📌 В чём разница между гидравлическим и пневматическим давлением?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  <strong>Гидравлическое давление</strong> создаётся несжимаемыми жидкостями (вода, масло), передаёт большие усилия, используется в прессах, экскаваторах. <strong>Пневматическое давление</strong> создаётся сжимаемыми газами (воздух), используется для быстрых движений в автоматизации.
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#10b981' }}>📌 Как перевести давление из Паскалей в Бары или атмосферы?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  <strong>1 бар = 100,000 Па</strong><br/>
                  <strong>1 техническая атмосфера (ат) = 98,066.5 Па</strong><br/>
                  <strong>1 физическая атмосфера (атм) = 101,325 Па</strong><br/>
                  Пример: 200,000 Па = 2 бара ≈ 2.04 ат ≈ 1.97 атм
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#10b981' }}>📌 Почему гидравлические системы используют масло вместо воды?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Гидравлическое масло имеет лучшие смазывающие свойства, не вызывает коррозию металлов, имеет более стабильные характеристики при разных температурах и обладает определённой сжимаемостью для демпфирования ударов.
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#10b981' }}>📌 Как рассчитать необходимый диаметр трубы для заданного расхода?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Используйте формулу: <strong>D = 2 × √(Q / (π × v))</strong>, где D — диаметр трубы (м), Q — расход (м³/с), v — рекомендуемая скорость потока (обычно 1-3 м/с для воды). Наш калькулятор автоматически выполнит этот расчёт.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#f59e0b' }}>
              💡 Практические советы по гидравлическим расчётам
            </h2>
            <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Всегда добавляйте 10-20% запас давления при проектировании гидравлических систем</li>
              <li style={{ marginBottom: '10px' }}>Для воды в бытовых условиях используйте плотность 1000 кг/м³, для гидравлического масла — 800-900 кг/м³</li>
              <li style={{ marginBottom: '10px' }}>Оптимальная скорость потока в трубопроводах: вода — 1-3 м/с, масло — 2-5 м/с, пар — 20-40 м/с</li>
              <li style={{ marginBottom: '10px' }}>При расчёте гидростатического давления учитывайте плотность жидкости (морская вода плотнее пресной)</li>
              <li>Для точных инженерных расчётов учитывайте потери давления на трение, местные сопротивления и температуру жидкости</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}