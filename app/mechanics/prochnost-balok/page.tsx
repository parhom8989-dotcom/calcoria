// app/mechanics/prochnost-balki/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function ProchnostBalkiPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('sigma'); // 'sigma', 'deflection', 'moment', 'load'
  
  // Основные параметры (в кг и кгс/м)
  const [moment, setMoment] = useState<string>('100'); // кг·м
  const [sectionModulus, setSectionModulus] = useState<string>('100'); // см³
  const [load, setLoad] = useState<string>('100'); // кг/м
  const [length, setLength] = useState<string>('2'); // м
  const [elasticity, setElasticity] = useState<string>('2100000'); // кгс/см²
  const [inertia, setInertia] = useState<string>('1000'); // см⁴
  
  // Тип балки и закрепления
  const [beamType, setBeamType] = useState<string>('simple'); // 'simple', 'cantilever'
  const [loadType, setLoadType] = useState<string>('uniform'); // 'uniform', 'point'
  const [loadPosition, setLoadPosition] = useState<string>('0.5'); // для сосредоточенной нагрузки
  
  // Результаты
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    warnings: string[];
    typicalValues: Array<{value: string, label: string, desc: string}>;
    comparison: Array<{label: string, value: number, unit: string}>;
  } | null>(null);

  // Константы
  const g = 9.81; // ускорение свободного падения м/с²

  // Типовые моменты (кг·м)
  const typicalMoments = [
    { value: '10', label: '10 кг·м', desc: 'Малый момент' },
    { value: '100', label: '100 кг·м', desc: 'Балка в доме' },
    { value: '500', label: '500 кг·м', desc: 'Мостовой пролёт' },
    { value: '1000', label: '1000 кг·м', desc: 'Промышленная' },
    { value: '5000', label: '5 т·м', desc: 'Большая балка' },
    { value: '10000', label: '10 т·м', desc: 'Очень большая' },
  ];

  // Типовые моменты сопротивления (см³)
  const typicalSectionModulus = [
    { value: '10', label: '10 см³', desc: 'Маленькое сечение' },
    { value: '50', label: '50 см³', desc: 'Доска 50×100' },
    { value: '100', label: '100 см³', desc: 'Брус 100×100' },
    { value: '200', label: '200 см³', desc: 'Двутавр №10' },
    { value: '500', label: '500 см³', desc: 'Двутавр №20' },
    { value: '1000', label: '1000 см³', desc: 'Двутавр №30' },
  ];

  // Типовые нагрузки (кг/м)
  const typicalLoads = [
    { value: '10', label: '10 кг/м', desc: 'Лёгкая нагрузка' },
    { value: '50', label: '50 кг/м', desc: 'Мебель в доме' },
    { value: '100', label: '100 кг/м', desc: 'Типовая нагрузка' },
    { value: '500', label: '500 кг/м', desc: 'Промышленная' },
    { value: '1000', label: '1000 кг/м', desc: 'Тяжёлая' },
    { value: '5000', label: '5 т/м', desc: 'Мостовые' },
  ];

  // Типовые длины (м)
  const typicalLengths = [
    { value: '1', label: '1 м', desc: 'Короткий пролёт' },
    { value: '2', label: '2 м', desc: 'Межкомнатное' },
    { value: '3', label: '3 м', desc: 'Жилой дом' },
    { value: '5', label: '5 м', desc: 'Промышленное' },
    { value: '10', label: '10 м', desc: 'Мостовой' },
    { value: '20', label: '20 м', desc: 'Большой пролёт' },
  ];

  // Типовые модули упругости (кгс/см²)
  const typicalElasticity = [
    { value: '100000', label: '100000 кгс/см²', desc: 'Древесина' },
    { value: '700000', label: '700000 кгс/см²', desc: 'Алюминий' },
    { value: '2100000', label: '2.1×10⁶ кгс/см²', desc: 'Сталь' },
    { value: '3000000', label: '3×10⁶ кгс/см²', desc: 'Арматура' },
    { value: '4000000', label: '4×10⁶ кгс/см²', desc: 'Высокопрочная' },
  ];

  // Типовые моменты инерции (см⁴)
  const typicalInertia = [
    { value: '10', label: '10 см⁴', desc: 'Малое сечение' },
    { value: '100', label: '100 см⁴', desc: 'Брусок' },
    { value: '500', label: '500 см⁴', desc: 'Профиль' },
    { value: '1000', label: '1000 см⁴', desc: 'Двутавр №10' },
    { value: '5000', label: '5000 см⁴', desc: 'Двутавр №20' },
    { value: '10000', label: '10000 см⁴', desc: 'Двутавр №30' },
  ];

  // Коэффициенты для разных типов балок и нагрузок
  const getBeamCoefficients = () => {
    if (beamType === 'simple') {
      if (loadType === 'uniform') {
        return {
          momentCoef: 1/8,
          deflectionCoef: 5/384,
          reactionCoef: 1/2
        };
      } else { // point load
        const a = parseFloat(loadPosition) || 0.5;
        const b = 1 - a;
        return {
          momentCoef: a * b,
          deflectionCoef: (a * b * (a + 2 * Math.sqrt(a*b) + b)) / 3,
          reactionCoef: b
        };
      }
    } else { // cantilever
      if (loadType === 'uniform') {
        return {
          momentCoef: 1/2,
          deflectionCoef: 1/8,
          reactionCoef: 1
        };
      } else { // point load
        return {
          momentCoef: 1,
          deflectionCoef: 1/3,
          reactionCoef: 1
        };
      }
    }
  };

  // Расчет
  const calculate = () => {
    const M = parseFloat(moment) || 0; // кг·м
    const W = parseFloat(sectionModulus) || 0; // см³
    const q = parseFloat(load) || 0; // кг/м
    const L = parseFloat(length) || 0; // м
    const E = parseFloat(elasticity) || 0; // кгс/см²
    const I = parseFloat(inertia) || 0; // см⁴
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];

    const coef = getBeamCoefficients();

    switch(mode) {
      case 'sigma': // Напряжение в кгс/см²
        if (W !== 0) {
          // M(кг·м) * 100(см/м) / W(см³) = кгс/см²
          value = (M * 100) / W;
          unit = 'кгс/см² (Килограмм-сила на см²)';
          formula = 'σ = M / W';
          if (value > 2400) warnings.push('⚠️ Высокое напряжение - возможна пластическая деформация');
          if (value > 4000) warnings.push('⚠️ Опасное напряжение - возможное разрушение');
          comparison = [
            { label: 'Древесина сосна', value: 100, unit: 'кгс/см²' },
            { label: 'Сталь Ст3', value: 2400, unit: 'кгс/см²' },
            { label: 'Высокопрочная сталь', value: 5000, unit: 'кгс/см²' },
          ];
        }
        break;
        
      case 'deflection': // Прогиб в см
        if (E !== 0 && I !== 0 && L !== 0) {
          // f = k × q(кг/м) × L⁴(м⁴) / (E(кгс/см²) × I(см⁴)) × 100(см/м)
          value = (coef.deflectionCoef * q * Math.pow(L * 100, 4)) / (E * I) / 100; // см
          unit = 'см (Сантиметры)';
          formula = 'f = k × q × L⁴ / (E × I)';
          if (value > L * 100 / 200) warnings.push(`⚠️ Прогиб превышает допустимый L/200 = ${(L*100/200).toFixed(1)} см`);
          if (value > L * 100 / 100) warnings.push('⚠️ Большой прогиб - опасность!');
          comparison = [
            { label: 'Допустимый для L=3м', value: 1.5, unit: 'см' },
            { label: 'Заметный прогиб', value: 3, unit: 'см' },
            { label: 'Критический прогиб', value: 10, unit: 'см' },
          ];
        }
        break;
        
      case 'moment': // Изгибающий момент в кг·м
        value = coef.momentCoef * q * Math.pow(L, 2);
        unit = 'кг·м (Килограмм-метр)';
        formula = 'M = k × q × L²';
        comparison = [
          { label: 'Балка перекрытия', value: 500, unit: 'кг·м' },
          { label: 'Мостовой пролёт', value: 5000, unit: 'кг·м' },
          { label: 'Промышленная балка', value: 20000, unit: 'кг·м' },
        ];
        break;
        
      case 'load': // Допустимая нагрузка в кг/м
        if (L !== 0 && coef.momentCoef !== 0) {
          value = M / (coef.momentCoef * Math.pow(L, 2));
          unit = 'кг/м (Килограмм на метр)';
          formula = 'q = M / (k × L²)';
          comparison = [
            { label: 'Жилая нагрузка', value: 200, unit: 'кг/м' },
            { label: 'Офисная нагрузка', value: 300, unit: 'кг/м' },
            { label: 'Складская нагрузка', value: 500, unit: 'кг/м' },
          ];
        }
        break;
    }

    // Проверки
    if (value > 1000000) warnings.push('💡 Очень большие значения - проверьте единицы измерения');
    if (L > 50) warnings.push('💡 Большая длина пролёта - учёт собственного веса');
    if (E < 100000 || E > 5000000) {
      warnings.push(`💡 Нестандартный модуль упругости: ${E.toLocaleString()} кгс/см²`);
    }

    setResult({
      value,
      unit,
      formula,
      warnings,
      typicalValues: typicalMoments,
      comparison
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, moment, sectionModulus, load, length, elasticity, inertia, beamType, loadType, loadPosition]);

  const resetCalculator = () => {
    setMoment('100');
    setSectionModulus('100');
    setLoad('100');
    setLength('2');
    setElasticity('2100000');
    setInertia('1000');
    setBeamType('simple');
    setLoadType('uniform');
    setLoadPosition('0.5');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalMoment = (value: string) => {
    setMoment(value);
  };

  const selectTypicalSectionModulus = (value: string) => {
    setSectionModulus(value);
  };

  const selectTypicalLoad = (value: string) => {
    setLoad(value);
  };

  const selectTypicalLength = (value: string) => {
    setLength(value);
  };

  const selectTypicalElasticity = (value: string) => {
    setElasticity(value);
  };

  const selectTypicalInertia = (value: string) => {
    setInertia(value);
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
              color: '#f97316'
            }}>
              🏗️ Прочность балок
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт напряжений, прогибов, моментов и нагрузок при изгибе
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
                color: '#f97316',
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
                color: '#f97316',
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
                onClick={() => setMode('sigma')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'sigma' ? '#f97316' : '#334155',
                  color: mode === 'sigma' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'sigma' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Напряжение (σ)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('deflection')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'deflection' ? '#f97316' : '#334155',
                  color: mode === 'deflection' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'deflection' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Прогиб (f)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('moment')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'moment' ? '#f97316' : '#334155',
                  color: mode === 'moment' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'moment' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Момент (M)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('load')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'load' ? '#f97316' : '#334155',
                  color: mode === 'load' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'load' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Нагрузку (q)
              </button>
            </div>
          </div>

          {/* Тип балки и нагрузки */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Условия закрепления и нагрузки
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Тип балки
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setBeamType('simple')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: beamType === 'simple' ? '#f97316' : '#334155',
                      color: beamType === 'simple' ? '#0f172a' : 'white',
                      border: `1px solid ${beamType === 'simple' ? '#f97316' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Шарнирная
                  </button>
                  <button
                    type="button"
                    onClick={() => setBeamType('cantilever')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: beamType === 'cantilever' ? '#f97316' : '#334155',
                      color: beamType === 'cantilever' ? '#0f172a' : 'white',
                      border: `1px solid ${beamType === 'cantilever' ? '#f97316' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Консольная
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Тип нагрузки
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setLoadType('uniform')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: loadType === 'uniform' ? '#f97316' : '#334155',
                      color: loadType === 'uniform' ? '#0f172a' : 'white',
                      border: `1px solid ${loadType === 'uniform' ? '#f97316' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Равномерная
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoadType('point')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: loadType === 'point' ? '#f97316' : '#334155',
                      color: loadType === 'point' ? '#0f172a' : 'white',
                      border: `1px solid ${loadType === 'point' ? '#f97316' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Сосредоточенная
                  </button>
                </div>
              </div>
            </div>

            {loadType === 'point' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Положение нагрузки (от опоры)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.1"
                  value={loadPosition}
                  onChange={(e) => setLoadPosition(e.target.value)}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: '#334155',
                    outline: 'none'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px' }}>
                  <span>0.1L (близко к опоре)</span>
                  <span>0.5L (посередине)</span>
                  <span>0.9L (далеко от опоры)</span>
                </div>
              </div>
            )}
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Основные параметры (в кг)
            </h3>
            
            {/* Напряжение */}
            {mode === 'sigma' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Изгибающий момент (кг·м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalMoments.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalMoment(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: moment === item.value ? '#f97316' : '#334155',
                          color: moment === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${moment === item.value ? '#f97316' : '#475569'}`,
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
                    value={moment}
                    onChange={(e) => setMoment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите момент"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Момент сопротивления (см³)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalSectionModulus.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalSectionModulus(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: sectionModulus === item.value ? '#f97316' : '#334155',
                          color: sectionModulus === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${sectionModulus === item.value ? '#f97316' : '#475569'}`,
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
                    value={sectionModulus}
                    onChange={(e) => setSectionModulus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите W"
                  />
                </div>
              </>
            )}

            {/* Прогиб */}
            {mode === 'deflection' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Нагрузка (кг/м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalLoads.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalLoad(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: load === item.value ? '#f97316' : '#334155',
                          color: load === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${load === item.value ? '#f97316' : '#475569'}`,
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
                    value={load}
                    onChange={(e) => setLoad(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите нагрузку"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Длина пролёта (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalLengths.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalLength(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: length === item.value ? '#f97316' : '#334155',
                          color: length === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${length === item.value ? '#f97316' : '#475569'}`,
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
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите длину"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Модуль упругости (кгс/см²)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalElasticity.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalElasticity(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: elasticity === item.value ? '#f97316' : '#334155',
                          color: elasticity === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${elasticity === item.value ? '#f97316' : '#475569'}`,
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
                    step="1000"
                    value={elasticity}
                    onChange={(e) => setElasticity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите модуль упругости"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Момент инерции (см⁴)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalInertia.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalInertia(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: inertia === item.value ? '#f97316' : '#334155',
                          color: inertia === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${inertia === item.value ? '#f97316' : '#475569'}`,
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
                    value={inertia}
                    onChange={(e) => setInertia(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите момент инерции"
                  />
                </div>
              </>
            )}

            {/* Момент */}
            {mode === 'moment' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Нагрузка (кг/м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalLoads.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalLoad(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: load === item.value ? '#f97316' : '#334155',
                          color: load === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${load === item.value ? '#f97316' : '#475569'}`,
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
                    value={load}
                    onChange={(e) => setLoad(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите нагрузку"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Длина пролёта (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalLengths.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalLength(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: length === item.value ? '#f97316' : '#334155',
                          color: length === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${length === item.value ? '#f97316' : '#475569'}`,
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
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите длину"
                  />
                </div>
              </>
            )}

            {/* Нагрузка */}
            {mode === 'load' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Изгибающий момент (кг·м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalMoments.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalMoment(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: moment === item.value ? '#f97316' : '#334155',
                          color: moment === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${moment === item.value ? '#f97316' : '#475569'}`,
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
                    value={moment}
                    onChange={(e) => setMoment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите момент"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Длина пролёта (м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalLengths.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalLength(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: length === item.value ? '#f97316' : '#334155',
                          color: length === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${length === item.value ? '#f97316' : '#475569'}`,
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
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите длину"
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
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316', marginBottom: '8px' }}>
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
                    <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px' }}>
                      📝 Используемая формула:
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontFamily: 'monospace' }}>
                      {result.formula}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
                      Тип балки: {beamType === 'simple' ? 'Шарнирная' : 'Консольная'} | 
                      Нагрузка: {loadType === 'uniform' ? 'Равномерная' : 'Сосредоточенная'}
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
                            <span style={{ fontWeight: 'bold', color: '#f97316' }}>
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
                    const text = `${mode === 'sigma' ? 'Напряжение' : mode === 'deflection' ? 'Прогиб' : mode === 'moment' ? 'Момент' : 'Нагрузка'}: ${result.value.toFixed(2)} ${result.unit.split(' ')[0]}`;
                    navigator.clipboard.writeText(text);
                    alert('Результат скопирован!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f97316',
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
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🏗️</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта
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
            <div style={{ color: '#f97316', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              σ = M/W | f = k·q·L⁴/(E·I) | M = k·q·L²
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основные формулы для расчёта балок (в кг)
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#f97316' }}>
            Теория: Прочность балок (в кг)
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#f97316', marginBottom: '8px' }}>📏 Основные формулы (в кг)</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Напряжение (кгс/см²):</strong> σ = M(кг·м) × 100 / W(см³) ≤ [σ]</p>
              <p><strong>Прогиб (см):</strong> f = k × q(кг/м) × L⁴(см⁴) / (E(кгс/см²) × I(см⁴)) / 100 ≤ [f]</p>
              <p><strong>Изгибающий момент (кг·м):</strong> M = k × q(кг/м) × L²(м²)</p>
              <p><strong>Допустимая нагрузка (кг/м):</strong> q = M(кг·м) / (k × L²(м²))</p>
              <p><strong>Коэффициент перевода:</strong> 1 кгс/см² = 98.1 кПа ≈ 0.1 МПа</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#f97316', marginBottom: '8px' }}>🏗️ Практические примеры</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Деревянная балка перекрытия</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Сечение: 100×200 мм<br/>
                  Пролёт: 4 м<br/>
                  Нагрузка: 400 кг/м<br/>
                  Прогиб: ~1.2 см
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Стальной двутавр №20</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Пролёт: 6 м<br/>
                  Нагрузка: 5000 кг/м<br/>
                  Напряжение: 1800 кгс/см²<br/>
                  Запас: 1.33
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Железобетонная балка</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Сечение: 300×600 мм<br/>
                  Пролёт: 8 м<br/>
                  Момент: 32 т·м<br/>
                  Арматура: 4Ø20
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Мостовой пролёт</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Длина: 30 м<br/>
                  Нагрузка: 5 т/м<br/>
                  Высота: 2 м<br/>
                  Материал: сталь 40Х
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #f97316'
          }}>
            <h4 style={{ color: '#f97316', marginBottom: '8px' }}>💡 Практические советы</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>1 кгс = 1 кг × 9.81 м/с²</strong> - техническая система единиц</p>
              <p>• <strong>Допустимый прогиб:</strong> для перекрытий f ≤ L/200 (в см)</p>
              <p>• <strong>Допустимые напряжения:</strong> сталь 2400 кгс/см², дерево 100 кгс/см²</p>
              <p>• <strong>Коэффициент запаса:</strong> 1.5-2.0 для статической нагрузки</p>
              <p>• <strong>Собственный вес:</strong> добавьте 10-20% к полезной нагрузке</p>
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
              <p>• <strong>Расчёт по предельным состояниям:</strong> I группа (прочность), II группа (деформации)</p>
              <p>• <strong>Проверка на устойчивость:</strong> особенно для высоких и тонких балок</p>
              <p>• <strong>Температурные воздействия:</strong> для пролётов более 20 м</p>
              <p>• <strong>Динамические нагрузки:</strong> умножьте статическую нагрузку на 1.2-1.5</p>
              <p>• <strong>Для ответственных конструкций</strong> обязательна проверка инженером</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}