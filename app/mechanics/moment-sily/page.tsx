// app/mechanics/moment-sily/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function MomentSilyPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('torque'); // 'torque', 'force', 'lever', 'power', 'equilibrium'
  
  // Основные параметры
  const [force, setForce] = useState<string>('100');
  const [leverArm, setLeverArm] = useState<string>('0.5');
  const [torque, setTorque] = useState<string>('50');
  const [rpm, setRpm] = useState<string>('1500');
  const [power, setPower] = useState<string>('1000');
  const [force1, setForce1] = useState<string>('100');
  const [lever1, setLever1] = useState<string>('0.5');
  const [force2, setForce2] = useState<string>('50');
  
  // Результаты
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    explanation: string;
    warnings: string[];
    comparison: Array<{label: string, value: number, unit: string}>;
  } | null>(null);

  // Типовые силы (Н)
  const typicalForces = [
    { value: '10', label: '10 Н', desc: 'Маленькая' },
    { value: '100', label: '100 Н', desc: 'Средняя' },
    { value: '1000', label: '1000 Н', desc: 'Большая' },
    { value: '10000', label: '10 кН', desc: 'Очень большая' },
    { value: '1', label: '1 Н', desc: 'Минимальная' },
    { value: '50000', label: '50 кН', desc: 'Гигантская' },
  ];

  // Типовые плечи (м)
  const typicalLeverArms = [
    { value: '0.1', label: '10 см', desc: 'Короткое' },
    { value: '0.5', label: '50 см', desc: 'Среднее' },
    { value: '1', label: '1 м', desc: 'Длинное' },
    { value: '2', label: '2 м', desc: 'Очень длинное' },
    { value: '5', label: '5 м', desc: 'Гигантское' },
    { value: '0.01', label: '1 см', desc: 'Минимальное' },
  ];

  // Типовые моменты (Н·м)
  const typicalTorques = [
    { value: '10', label: '10 Н·м', desc: 'Малый' },
    { value: '50', label: '50 Н·м', desc: 'Средний' },
    { value: '100', label: '100 Н·м', desc: 'Большой' },
    { value: '500', label: '500 Н·м', desc: 'Очень большой' },
    { value: '1000', label: '1000 Н·м', desc: 'Гигантский' },
    { value: '1', label: '1 Н·м', desc: 'Минимальный' },
  ];

  // Типовые обороты (об/мин)
  const typicalRpms = [
    { value: '100', label: '100 об/мин', desc: 'Медленные' },
    { value: '500', label: '500 об/мин', desc: 'Средние' },
    { value: '1500', label: '1500 об/мин', desc: 'Быстрые' },
    { value: '3000', label: '3000 об/мин', desc: 'Высокие' },
    { value: '10000', label: '10000 об/мин', desc: 'Сверхвысокие' },
    { value: '10', label: '10 об/мин', desc: 'Очень медленные' },
  ];

  // Типовые мощности (Вт)
  const typicalPowers = [
    { value: '10', label: '10 Вт', desc: 'Маленькая' },
    { value: '100', label: '100 Вт', desc: 'Средняя' },
    { value: '1000', label: '1 кВт', desc: 'Большая' },
    { value: '10000', label: '10 кВт', desc: 'Очень большая' },
    { value: '100000', label: '100 кВт', desc: 'Гигантская' },
    { value: '1', label: '1 Вт', desc: 'Минимальная' },
  ];

  // Расчет
  const calculate = () => {
    const F = parseFloat(force) || 0;
    const L = parseFloat(leverArm) || 0;
    const M = parseFloat(torque) || 0;
    const n = parseFloat(rpm) || 0;
    const P = parseFloat(power) || 0;
    const F1 = parseFloat(force1) || 0;
    const L1 = parseFloat(lever1) || 0;
    const F2 = parseFloat(force2) || 0;
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let explanation = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];

    switch(mode) {
      case 'torque':
        value = F * L;
        unit = 'Н·м';
        formula = 'M = F × L';
        explanation = `Момент силы приложенной на расстоянии ${L} м`;
        if (value > 10000) warnings.push('⚡ Очень большой момент - промышленные масштабы');
        comparison = [
          { label: 'Гайковёрт', value: 200, unit: 'Н·м' },
          { label: 'Двигатель авто', value: 300, unit: 'Н·м' },
          { label: 'Кран башенный', value: 50000, unit: 'Н·м' },
        ];
        break;
        
      case 'force':
        if (L !== 0) {
          value = M / L;
          unit = 'Н';
          formula = 'F = M / L';
          explanation = `Сила создающая момент ${M} Н·м на плече ${L} м`;
        }
        if (value > 100000) warnings.push('💥 Очень большая сила - экстремальные условия');
        comparison = [
          { label: 'Вес яблока', value: 1, unit: 'Н' },
          { label: 'Вес человека', value: 700, unit: 'Н' },
          { label: 'Тяга ракеты', value: 30000000, unit: 'Н' },
        ];
        break;
        
      case 'lever':
        if (F !== 0) {
          value = M / F;
          unit = 'м';
          formula = 'L = M / F';
          explanation = `Плечо силы для создания момента ${M} Н·м`;
        }
        if (value > 10) warnings.push('📏 Очень длинное плечо - проверьте устойчивость');
        comparison = [
          { label: 'Рука человека', value: 0.3, unit: 'м' },
          { label: 'Гаечный ключ', value: 0.5, unit: 'м' },
          { label: 'Балка крана', value: 30, unit: 'м' },
        ];
        break;
        
      case 'power':
        value = (M * n * 2 * Math.PI) / 60;
        unit = 'Вт';
        formula = 'P = (M × n × 2π) / 60';
        explanation = `Мощность при крутящем моменте ${M} Н·м и ${n} об/мин`;
        if (value > 1000000) warnings.push('🔋 Очень большая мощность - промышленные двигатели');
        comparison = [
          { label: 'Лампочка', value: 100, unit: 'Вт' },
          { label: 'Чайник', value: 2000, unit: 'Вт' },
          { label: 'Автомобиль', value: 100000, unit: 'Вт' },
        ];
        break;
        
      case 'equilibrium':
        if (F1 !== 0 && L1 !== 0) {
          value = (F1 * L1) / F2;
          unit = 'м';
          formula = 'L₂ = (F₁ × L₁) / F₂';
          explanation = `Плечо для уравновешивания сил по правилу рычага`;
        }
        if (value > 100) warnings.push('⚖️ Очень длинное плечо - конструкция неустойчива');
        comparison = [
          { label: 'Весы равноплечие', value: 0.5, unit: 'м' },
          { label: 'Рычаг Архимеда', value: 5, unit: 'м' },
          { label: 'Подъёмный кран', value: 20, unit: 'м' },
        ];
        break;
    }

    // Общие проверки
    if (F < 0) warnings.push('❌ Сила не может быть отрицательной');
    if (L < 0) warnings.push('❌ Плечо не может быть отрицательным');
    if (M < 0) warnings.push('❌ Момент не может быть отрицательным');
    if (n < 0) warnings.push('❌ Обороты не могут быть отрицательными');
    if (P < 0) warnings.push('❌ Мощность не может быть отрицательной');

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
  }, [mode, force, leverArm, torque, rpm, power, force1, lever1, force2]);

  const resetCalculator = () => {
    setForce('100');
    setLeverArm('0.5');
    setTorque('50');
    setRpm('1500');
    setPower('1000');
    setForce1('100');
    setLever1('0.5');
    setForce2('50');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalForce = (value: string) => {
    setForce(value);
  };

  const selectTypicalLeverArm = (value: string) => {
    setLeverArm(value);
  };

  const selectTypicalTorque = (value: string) => {
    setTorque(value);
  };

  const selectTypicalRpm = (value: string) => {
    setRpm(value);
  };

  const selectTypicalPower = (value: string) => {
    setPower(value);
  };

  const selectTypicalForce1 = (value: string) => {
    setForce1(value);
  };

  const selectTypicalLever1 = (value: string) => {
    setLever1(value);
  };

  const selectTypicalForce2 = (value: string) => {
    setForce2(value);
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
        <title>Калькулятор момента силы онлайн | Крутящий момент, рычаги, мощность</title>
        <meta name="description" content="Бесплатный онлайн калькулятор для расчёта момента силы, крутящего момента, рычагов и мощности. Формулы механики, правило рычага, расчёт мощности." />
        <meta name="keywords" content="калькулятор момента силы, крутящий момент, момент силы, рычаг, плечо силы, мощность двигателя, механические расчёты, правило рычага" />
        <meta property="og:title" content="Калькулятор момента силы онлайн | Рычаги и крутящий момент" />
        <meta property="og:description" content="Расчёт момента силы, мощности, плеча рычага и равновесия сил" />
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
              color: '#8b5cf6'
            }}>
              🔩 Калькулятор момента силы и рычагов
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт крутящего момента, плеча силы, мощности и равновесия рычагов
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
                color: '#8b5cf6',
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
                onClick={() => setMode('torque')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'torque' ? '#8b5cf6' : '#334155',
                  color: mode === 'torque' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'torque' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Момент силы (M)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('force')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'force' ? '#8b5cf6' : '#334155',
                  color: mode === 'force' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'force' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Сила по моменту (F)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('lever')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'lever' ? '#8b5cf6' : '#334155',
                  color: mode === 'lever' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'lever' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Плечо силы (L)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('power')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'power' ? '#8b5cf6' : '#334155',
                  color: mode === 'power' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'power' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Мощность (P)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('equilibrium')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'equilibrium' ? '#8b5cf6' : '#334155',
                  color: mode === 'equilibrium' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'equilibrium' ? '#8b5cf6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Равновесие рычага
              </button>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#1e293b', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#94a3b8',
              borderLeft: '4px solid #8b5cf6'
            }}>
              {mode === 'torque' && 'M = F × L — Момент силы равен произведению силы на плечо'}
              {mode === 'force' && 'F = M / L — Сила необходимая для создания заданного момента'}
              {mode === 'lever' && 'L = M / F — Плечо силы для создания заданного момента'}
              {mode === 'power' && 'P = (M × n × 2π) / 60 — Мощность через крутящий момент и обороты'}
              {mode === 'equilibrium' && 'F₁ × L₁ = F₂ × L₂ — Правило рычага (равновесие моментов)'}
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Введите параметры:
            </h2>
            
            {/* Момент силы */}
            {mode === 'torque' && (
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
                          backgroundColor: force === item.value ? '#8b5cf6' : '#334155',
                          color: force === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${force === item.value ? '#8b5cf6' : '#475569'}`,
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
                    <label style={{ color: '#cbd5e1' }}>Плечо силы (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalLeverArms.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalLeverArm(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: leverArm === item.value ? '#8b5cf6' : '#334155',
                          color: leverArm === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${leverArm === item.value ? '#8b5cf6' : '#475569'}`,
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
                    value={leverArm}
                    onChange={(e) => setLeverArm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите плечо в метрах"
                  />
                </div>
              </>
            )}

            {/* Сила по моменту */}
            {mode === 'force' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Момент силы (Н·м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalTorques.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalTorque(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: torque === item.value ? '#8b5cf6' : '#334155',
                          color: torque === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${torque === item.value ? '#8b5cf6' : '#475569'}`,
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
                    value={torque}
                    onChange={(e) => setTorque(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите момент силы"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Плечо силы (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalLeverArms.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalLeverArm(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: leverArm === item.value ? '#8b5cf6' : '#334155',
                          color: leverArm === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${leverArm === item.value ? '#8b5cf6' : '#475569'}`,
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
                    value={leverArm}
                    onChange={(e) => setLeverArm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите плечо в метрах"
                  />
                </div>
              </>
            )}

            {/* Плечо силы */}
            {mode === 'lever' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Момент силы (Н·м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalTorques.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalTorque(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: torque === item.value ? '#8b5cf6' : '#334155',
                          color: torque === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${torque === item.value ? '#8b5cf6' : '#475569'}`,
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
                    value={torque}
                    onChange={(e) => setTorque(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите момент силы"
                  />
                </div>

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
                          backgroundColor: force === item.value ? '#8b5cf6' : '#334155',
                          color: force === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${force === item.value ? '#8b5cf6' : '#475569'}`,
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
              </>
            )}

            {/* Мощность */}
            {mode === 'power' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Момент силы (Н·м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalTorques.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalTorque(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: torque === item.value ? '#8b5cf6' : '#334155',
                          color: torque === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${torque === item.value ? '#8b5cf6' : '#475569'}`,
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
                    value={torque}
                    onChange={(e) => setTorque(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите момент силы"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Обороты (об/мин)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalRpms.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalRpm(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: rpm === item.value ? '#8b5cf6' : '#334155',
                          color: rpm === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${rpm === item.value ? '#8b5cf6' : '#475569'}`,
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
                    step="10"
                    value={rpm}
                    onChange={(e) => setRpm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите обороты в минуту"
                  />
                </div>
              </>
            )}

            {/* Равновесие рычага */}
            {mode === 'equilibrium' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Сила F₁ (Н)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalForces.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalForce1(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: force1 === item.value ? '#8b5cf6' : '#334155',
                          color: force1 === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${force1 === item.value ? '#8b5cf6' : '#475569'}`,
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
                    value={force1}
                    onChange={(e) => setForce1(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите первую силу"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Плечо L₁ (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalLeverArms.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalLever1(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: lever1 === item.value ? '#8b5cf6' : '#334155',
                          color: lever1 === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${lever1 === item.value ? '#8b5cf6' : '#475569'}`,
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
                    value={lever1}
                    onChange={(e) => setLever1(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите первое плечо"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Сила F₂ (Н)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalForces.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalForce2(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: force2 === item.value ? '#8b5cf6' : '#334155',
                          color: force2 === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${force2 === item.value ? '#8b5cf6' : '#475569'}`,
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
                    value={force2}
                    onChange={(e) => setForce2(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите вторую силу"
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
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
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
                      <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                        📊 Для сравнения:
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {result.comparison.map((item, index) => (
                          <div key={index} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.label}:</span>
                            <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>
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
                    const text = `${mode === 'torque' ? 'Момент силы' : mode === 'force' ? 'Сила' : mode === 'lever' ? 'Плечо' : mode === 'power' ? 'Мощность' : 'Плечо L₂'}: ${result.value.toFixed(6)} ${result.unit}`;
                    navigator.clipboard.writeText(text);
                    alert('Результат скопирован!');
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
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🔩</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта момента
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
            <div style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              M = F×L | P = M×ω | F₁L₁ = F₂L₂
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основные формулы: момент силы, мощность, правило рычага
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
          <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#8b5cf6' }}>
            Калькулятор момента силы онлайн: крутящий момент, рычаги, мощность
          </h1>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#8b5cf6' }}>
              Что такое момент силы и зачем нужен этот калькулятор?
            </h2>
            <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>
              <strong>Момент силы</strong> (крутящий момент) — это физическая величина, характеризующая вращательное действие силы на твёрдое тело. Он равен произведению силы на плечо (кратчайшее расстояние от оси вращения до линии действия силы).
            </p>
            <p style={{ color: '#cbd5e1' }}>
              Наш онлайн калькулятор момента силы позволяет выполнять все основные расчёты: определить крутящий момент по силе и плечу, рассчитать необходимую силу для создания заданного момента, найти мощность двигателя по моменту и оборотам, а также решать задачи на равновесие рычагов.
            </p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#8b5cf6' }}>
              Основные формулы момента силы
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#f59e0b' }}>1. Момент силы (основная формула)</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> M = F × L<br/>
                <strong>Где:</strong> M — момент силы (Н·м), F — сила (Н), L — плечо силы (м)<br/>
                <strong>Пример:</strong> Сила 100 Н, приложенная на расстоянии 0.5 м, создаёт момент 50 Н·м.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#f59e0b' }}>2. Мощность через момент и обороты</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> P = (M × n × 2π) / 60<br/>
                <strong>Где:</strong> P — мощность (Вт), n — обороты в минуту (об/мин)<br/>
                <strong>Пример:</strong> Двигатель с моментом 50 Н·м при 1500 об/мин развивает мощность ≈7854 Вт.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#f59e0b' }}>3. Правило рычага (равновесие)</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> F₁ × L₁ = F₂ × L₂<br/>
                <strong>Где:</strong> F₁, F₂ — силы, L₁, L₂ — соответствующие плечи<br/>
                <strong>Пример:</strong> Чтобы уравновесить силу 100 Н на плече 0.5 м, нужна сила 50 Н на плече 1 м.
              </p>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#8b5cf6' }}>
              Практическое применение расчётов момента силы
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#10b981' }}>Автомобилестроение</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Расчёт крутящего момента двигателей, подбор передаточных чисел, тормозные системы.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#10b981' }}>Машиностроение</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Проектирование станков, подъёмных механизмов, редукторов, муфт.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#10b981' }}>Строительство</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Краны, лебёдки, подъёмники, расчёт фундаментов под оборудование.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#10b981' }}>Бытовая техника</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Дрели, миксеры, стиральные машины, вентиляторы — везде есть вращающиеся части.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#8b5cf6' }}>
              Часто задаваемые вопросы (FAQ) по моменту силы
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px' }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#f59e0b' }}>📌 В чём разница между моментом силы и мощностью?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  <strong>Момент силы</strong> показывает вращательное усилие (как сильно "крутит"). <strong>Мощность</strong> показывает скорость выполнения работы (как быстро "крутит"). Автомобиль с большим моментом легко трогается, с большой мощностью — быстро разгоняется.
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#f59e0b' }}>📌 Как увеличить момент силы при той же силе?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Увеличить <strong>плечо силы</strong>. Например, использовать более длинный гаечный ключ. Увеличение плеча в 2 раза увеличивает момент в 2 раза при той же силе.
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#f59e0b' }}>📌 Что такое "кривая момента" двигателя?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Это график зависимости крутящего момента от оборотов двигателя. Показывает, в каком диапазоне оборотов двигатель наиболее эффективен. Пик момента обычно находится в среднем диапазоне оборотов.
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#f59e0b' }}>📌 Как рассчитать момент для откручивания ржавой гайки?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Обычно требуется <strong>50-100 Н·м</strong>. При силе 100 Н нужен ключ длиной 0.5-1 м. Учтите, что ударные нагрузки могут быть в 2-3 раза выше статических.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#10b981' }}>
              💡 Практические советы по работе с моментом силы
            </h2>
            <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Всегда используйте динамометрический ключ для точного момента затяжки</li>
              <li style={{ marginBottom: '10px' }}>При расчёте рычагов учитывайте вес самого рычага</li>
              <li style={{ marginBottom: '10px' }}>Для переменных нагрузок добавляйте запас прочности 20-30%</li>
              <li style={{ marginBottom: '10px' }}>Проверяйте подшипники и опоры на способность выдерживать радиальные нагрузки</li>
              <li>При передаче момента через редукторы учитывайте КПД передачи (обычно 0.85-0.95)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}