// app/mechanics/moshchnost-kpd/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function MoshchnostKpdPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('power'); // 'power', 'work', 'time', 'efficiency', 'useful_power', 'total_power'
  
  // Основные параметры
  const [work, setWork] = useState<string>('1000');
  const [time, setTime] = useState<string>('10');
  const [force, setForce] = useState<string>('100');
  const [velocity, setVelocity] = useState<string>('5');
  const [usefulPower, setUsefulPower] = useState<string>('800');
  const [totalPower, setTotalPower] = useState<string>('1000');
  const [efficiency, setEfficiency] = useState<string>('85');
  
  // Результаты
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    warnings: string[];
    typicalValues: Array<{value: string, label: string, desc: string}>;
    comparison: Array<{label: string, value: number, unit: string}>;
  } | null>(null);

  // Типовые работы (Дж)
  const typicalWorks = [
    { value: '100', label: '100 Дж', desc: 'Небольшая работа' },
    { value: '1000', label: '1 кДж', desc: 'Поднять груз' },
    { value: '10000', label: '10 кДж', desc: 'Средняя работа' },
    { value: '100000', label: '100 кДж', desc: 'Значительная работа' },
    { value: '3600000', label: '3.6 МДж', desc: '1 кВт·ч' },
    { value: '10000000', label: '10 МДж', desc: 'Большая работа' },
  ];

  // Типовые времена (с)
  const typicalTimes = [
    { value: '0.1', label: '0.1 с', desc: 'Моментально' },
    { value: '1', label: '1 с', desc: 'Секунда' },
    { value: '10', label: '10 с', desc: 'Короткое время' },
    { value: '60', label: '60 с', desc: 'Минута' },
    { value: '3600', label: '3600 с', desc: 'Час' },
    { value: '86400', label: '86400 с', desc: 'Сутки' },
  ];

  // Типовые силы (Н)
  const typicalForces = [
    { value: '10', label: '10 Н', desc: 'Лёгкий предмет' },
    { value: '100', label: '100 Н', desc: 'Средняя сила' },
    { value: '500', label: '500 Н', desc: 'Сила человека' },
    { value: '1000', label: '1000 Н', desc: 'Большая сила' },
    { value: '5000', label: '5 кН', desc: 'Промышленная' },
    { value: '10000', label: '10 кН', desc: 'Очень большая' },
  ];

  // Типовые скорости (м/с)
  const typicalVelocities = [
    { value: '0.1', label: '0.1 м/с', desc: 'Медленно' },
    { value: '1', label: '1 м/с', desc: 'Ходьба' },
    { value: '5', label: '5 м/с', desc: 'Бег' },
    { value: '10', label: '10 м/с', desc: 'Спринт' },
    { value: '20', label: '20 м/с', desc: 'Автомобиль' },
    { value: '50', label: '50 м/с', desc: 'Поезд' },
  ];

  // Типовые мощности (Вт)
  const typicalPowers = [
    { value: '10', label: '10 Вт', desc: 'Маленькая' },
    { value: '100', label: '100 Вт', desc: 'Лампочка' },
    { value: '1000', label: '1 кВт', desc: 'Чайник' },
    { value: '5000', label: '5 кВт', desc: 'Двигатель' },
    { value: '100000', label: '100 кВт', desc: 'Автомобиль' },
    { value: '1000000', label: '1 МВт', desc: 'Электростанция' },
  ];

  // Типовые КПД (%)
  const typicalEfficiencies = [
    { value: '30', label: '30%', desc: 'Паровая машина' },
    { value: '50', label: '50%', desc: 'Среднее' },
    { value: '70', label: '70%', desc: 'Хорошее' },
    { value: '85', label: '85%', desc: 'Отличное' },
    { value: '95', label: '95%', desc: 'Высокое' },
    { value: '99', label: '99%', desc: 'Почти идеал' },
  ];

  // Расчет
  const calculate = () => {
    const A = parseFloat(work) || 0;
    const t = parseFloat(time) || 0;
    const F = parseFloat(force) || 0;
    const v = parseFloat(velocity) || 0;
    const P_useful = parseFloat(usefulPower) || 0;
    const P_total = parseFloat(totalPower) || 0;
    const η_percent = parseFloat(efficiency) || 0;
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];

    switch(mode) {
      case 'power':
        if (t !== 0) {
          value = A / t;
          unit = 'Вт (Ватт)';
          formula = 'P = A / t';
        } else if (F !== 0 && v !== 0) {
          value = F * v;
          unit = 'Вт (Ватт)';
          formula = 'P = F × v';
        }
        if (value > 1000000) warnings.push('⚠️ Очень большая мощность - промышленные масштабы');
        if (value < 0.001) warnings.push('⚠️ Очень маленькая мощность');
        comparison = [
          { label: 'Лампочка', value: 100, unit: 'Вт' },
          { label: 'Человек', value: 100, unit: 'Вт' },
          { label: 'Автомобиль', value: 100000, unit: 'Вт' },
        ];
        break;
        
      case 'work':
        value = A * t;
        unit = 'Дж (Джоуль)';
        formula = 'A = P × t';
        if (value > 1000000000) warnings.push('⚠️ Очень большая работа');
        comparison = [
          { label: '1 кВт·ч', value: 3600000, unit: 'Дж' },
          { label: 'Суточная работа человека', value: 10000000, unit: 'Дж' },
          { label: 'Бочка нефти', value: 6000000000, unit: 'Дж' },
        ];
        break;
        
      case 'time':
        if (A !== 0) {
          value = A / t;
          unit = 'с (Секунда)';
          formula = 't = A / P';
        }
        comparison = [
          { label: 'Минута', value: 60, unit: 'с' },
          { label: 'Час', value: 3600, unit: 'с' },
          { label: 'Сутки', value: 86400, unit: 'с' },
        ];
        break;
        
      case 'efficiency':
        if (P_total !== 0) {
          value = (P_useful / P_total) * 100;
          unit = '% (КПД)';
          formula = 'η = (Pполезн / Pзатрач) × 100%';
        }
        if (value > 100) warnings.push('❌ КПД не может быть больше 100%');
        if (value < 0) warnings.push('❌ КПД не может быть отрицательным');
        comparison = [
          { label: 'Паровая машина', value: 30, unit: '%' },
          { label: 'Бензиновый двигатель', value: 40, unit: '%' },
          { label: 'Электродвигатель', value: 90, unit: '%' },
        ];
        break;
        
      case 'useful_power':
        value = (η_percent / 100) * P_total;
        unit = 'Вт (Полезная мощность)';
        formula = 'Pполезн = η × Pзатрач';
        comparison = [
          { label: 'Лампочка при КПД 10%', value: 10, unit: 'Вт' },
          { label: 'Двигатель 100кВт, КПД 40%', value: 40000, unit: 'Вт' },
        ];
        break;
        
      case 'total_power':
        if (η_percent !== 0) {
          value = P_useful / (η_percent / 100);
          unit = 'Вт (Затраченная мощность)';
          formula = 'Pзатрач = Pполезн / η';
        }
        comparison = [
          { label: 'Для 100Вт лампы КПД 10%', value: 1000, unit: 'Вт' },
          { label: 'Для 40кВт двигателя КПД 40%', value: 100000, unit: 'Вт' },
        ];
        break;
    }

    // Общие проверки
    if (t < 0) warnings.push('❌ Время не может быть отрицательным');
    if (A < 0) warnings.push('❌ Работа не может быть отрицательной');
    if (η_percent < 0) warnings.push('❌ КПД не может быть отрицательным');
    if (η_percent > 100) warnings.push('❌ КПД не может быть больше 100%');

    setResult({
      value,
      unit,
      formula,
      warnings,
      typicalValues: typicalPowers,
      comparison
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, work, time, force, velocity, usefulPower, totalPower, efficiency]);

  const resetCalculator = () => {
    setWork('1000');
    setTime('10');
    setForce('100');
    setVelocity('5');
    setUsefulPower('800');
    setTotalPower('1000');
    setEfficiency('85');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalWork = (value: string) => {
    setWork(value);
  };

  const selectTypicalTime = (value: string) => {
    setTime(value);
  };

  const selectTypicalForce = (value: string) => {
    setForce(value);
  };

  const selectTypicalVelocity = (value: string) => {
    setVelocity(value);
  };

  const selectTypicalPower = (value: string) => {
    if (mode === 'useful_power') setUsefulPower(value);
    else if (mode === 'total_power') setTotalPower(value);
    else setWork(value);
  };

  const selectTypicalEfficiency = (value: string) => {
    setEfficiency(value);
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
              color: '#3b82f6'
            }}>
              🔋 Мощность и КПД
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт механической мощности, работы и эффективности
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
                onClick={() => setMode('power')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'power' ? '#3b82f6' : '#334155',
                  color: mode === 'power' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'power' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Мощность (P)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('work')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'work' ? '#3b82f6' : '#334155',
                  color: mode === 'work' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'work' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Работу (A)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('time')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'time' ? '#3b82f6' : '#334155',
                  color: mode === 'time' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'time' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Время (t)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('efficiency')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'efficiency' ? '#3b82f6' : '#334155',
                  color: mode === 'efficiency' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'efficiency' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                КПД (η)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('useful_power')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'useful_power' ? '#3b82f6' : '#334155',
                  color: mode === 'useful_power' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'useful_power' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Полезную мощность
              </button>
              
              <button
                type="button"
                onClick={() => setMode('total_power')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'total_power' ? '#3b82f6' : '#334155',
                  color: mode === 'total_power' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'total_power' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Затраченную мощность
              </button>
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Основные параметры
            </h3>
            
            {/* Мощность (из работы и времени или силы и скорости) */}
            {mode === 'power' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Работа (Дж)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalWorks.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalWork(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: work === item.value ? '#3b82f6' : '#334155',
                          color: work === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${work === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите работу"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Время (с)</label>
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
                          backgroundColor: time === item.value ? '#3b82f6' : '#334155',
                          color: time === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${time === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите время"
                  />
                </div>

                <div style={{ textAlign: 'center', color: '#64748b', margin: '16px 0' }}>или</div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Сила (Н)</label>
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
                          backgroundColor: force === item.value ? '#3b82f6' : '#334155',
                          color: force === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${force === item.value ? '#3b82f6' : '#475569'}`,
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
                    placeholder="Введите силу"
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
                          backgroundColor: velocity === item.value ? '#3b82f6' : '#334155',
                          color: velocity === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${velocity === item.value ? '#3b82f6' : '#475569'}`,
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

            {/* Работа (из мощности и времени) */}
            {mode === 'work' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Мощность (Вт)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalPowers.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalPower(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: work === item.value ? '#3b82f6' : '#334155',
                          color: work === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${work === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите мощность"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Время (с)</label>
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
                          backgroundColor: time === item.value ? '#3b82f6' : '#334155',
                          color: time === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${time === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите время"
                  />
                </div>
              </>
            )}

            {/* Время (из работы и мощности) */}
            {mode === 'time' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Работа (Дж)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalWorks.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalWork(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: work === item.value ? '#3b82f6' : '#334155',
                          color: work === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${work === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите работу"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Мощность (Вт)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalPowers.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalPower(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: time === item.value ? '#3b82f6' : '#334155',
                          color: time === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${time === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите мощность"
                  />
                </div>
              </>
            )}

            {/* КПД (из полезной и затраченной мощности) */}
            {mode === 'efficiency' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Полезная мощность (Вт)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalPowers.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setUsefulPower(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: usefulPower === item.value ? '#3b82f6' : '#334155',
                          color: usefulPower === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${usefulPower === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={usefulPower}
                    onChange={(e) => setUsefulPower(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите полезную мощность"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Затраченная мощность (Вт)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalPowers.slice(3, 6).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setTotalPower(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: totalPower === item.value ? '#3b82f6' : '#334155',
                          color: totalPower === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${totalPower === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={totalPower}
                    onChange={(e) => setTotalPower(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите затраченную мощность"
                  />
                </div>
              </>
            )}

            {/* Полезная мощность (из КПД и затраченной мощности) */}
            {mode === 'useful_power' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>КПД (%)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalEfficiencies.slice(2, 5).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalEfficiency(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: efficiency === item.value ? '#3b82f6' : '#334155',
                          color: efficiency === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${efficiency === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={efficiency}
                    onChange={(e) => setEfficiency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите КПД"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Затраченная мощность (Вт)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalPowers.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalPower(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: totalPower === item.value ? '#3b82f6' : '#334155',
                          color: totalPower === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${totalPower === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={totalPower}
                    onChange={(e) => setTotalPower(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите затраченную мощность"
                  />
                </div>
              </>
            )}

            {/* Затраченная мощность (из полезной мощности и КПД) */}
            {mode === 'total_power' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Полезная мощность (Вт)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalPowers.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setUsefulPower(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: usefulPower === item.value ? '#3b82f6' : '#334155',
                          color: usefulPower === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${usefulPower === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={usefulPower}
                    onChange={(e) => setUsefulPower(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите полезную мощность"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>КПД (%)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalEfficiencies.slice(2, 5).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalEfficiency(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: efficiency === item.value ? '#3b82f6' : '#334155',
                          color: efficiency === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${efficiency === item.value ? '#3b82f6' : '#475569'}`,
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
                    value={efficiency}
                    onChange={(e) => setEfficiency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите КПД"
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
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
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
                      <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                        📊 Для сравнения:
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {result.comparison.map((item, index) => (
                          <div key={index} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.label}:</span>
                            <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>
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
                    const text = `${mode === 'power' ? 'Мощность' : mode === 'work' ? 'Работа' : mode === 'time' ? 'Время' : mode === 'efficiency' ? 'КПД' : mode === 'useful_power' ? 'Полезная мощность' : 'Затраченная мощность'}: ${result.value.toFixed(2)} ${result.unit.split(' ')[0]}`;
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
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🔋</div>
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
            <div style={{ color: '#3b82f6', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              P = A/t = F×v | η = (Pполезн/Pзатрач)×100%
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основные формулы для мощности и КПД
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
            Теория: Мощность и КПД
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>📏 Основные формулы</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Мощность через работу:</strong> P = A / t</p>
              <p><strong>Мощность через силу и скорость:</strong> P = F × v × cos(α)</p>
              <p><strong>Коэффициент полезного действия:</strong> η = (Aполезн / Aзатрач) × 100% = (Pполезн / Pзатрач) × 100%</p>
              <p><strong>Единицы измерения:</strong> 1 Вт = 1 Дж/с = 1 Н·м/с</p>
              <p><strong>Мощные единицы:</strong> 1 кВт = 1000 Вт, 1 МВт = 1,000,000 Вт, 1 л.с. ≈ 736 Вт</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>🔋 Практические примеры</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Человек</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Постоянная мощность: 70-100 Вт<br/>
                  Кратковременно: до 1000 Вт<br/>
                  Суточная работа: 10 МДж
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Автомобиль</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Мощность: 100-300 кВт<br/>
                  КПД двигателя: 25-40%<br/>
                  Топливная энергия: 35 МДж/л
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Электродвигатели</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  КПД: 85-95%<br/>
                  Бытовые: 0.5-3 кВт<br/>
                  Промышленные: до 10 МВт
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Электростанции</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  ТЭС: 100-1000 МВт<br/>
                  АЭС: до 1600 МВт<br/>
                  ГЭС: до 22,500 МВт
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '8px' }}>💡 Практические советы</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>1 лошадиная сила</strong> = 735.5 Вт (метрическая) = 745.7 Вт (механическая)</p>
              <p>• <strong>КПД тепловых машин</strong> ограничен циклом Карно: η ≤ 1 - Tхол/Tгор</p>
              <p>• <strong>Мгновенная мощность</strong> P = dA/dt (производная работы по времени)</p>
              <p>• <strong>Для переменных сил</strong> P = F·v·cosα, где α - угол между F и v</p>
              <p>• <strong>Эффективность системы</strong> = η₁ × η₂ × ... × ηₙ (последовательное соединение)</p>
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
              <p>• <strong>КПД не может быть больше 100%</strong> - это нарушило бы закон сохранения энергии</p>
              <p>• <strong>Реальная мощность</strong> всегда меньше номинальной из-за потерь</p>
              <p>• <strong>При расчётах для двигателей</strong> учитывайте механический КПД и потери в трансмиссии</p>
              <p>• <strong>Мощность переменного тока</strong> рассчитывается с учётом cosφ (коэффициента мощности)</p>
              <p>• <strong>Для длительной работы</strong> используйте среднюю мощность, для кратковременной - пиковую</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}