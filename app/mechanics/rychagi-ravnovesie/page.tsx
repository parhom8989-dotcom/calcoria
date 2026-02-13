// app/mechanics/rychagi/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function RychagiPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('equilibrium'); // 'equilibrium', 'forceGain', 'armLength', 'forceValue'
  
  // Параметры рычага
  const [force1, setForce1] = useState<string>('10');
  const [arm1, setArm1] = useState<string>('0.5');
  const [force2, setForce2] = useState<string>('5');
  const [arm2, setArm2] = useState<string>('1');
  const [forceGain, setForceGain] = useState<string>('2');
  
  // Тип рычага
  const [leverType, setLeverType] = useState<string>('first'); // 'first', 'second', 'third'
  
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
    { value: '1', label: '1 Н', desc: 'Маленькая' },
    { value: '10', label: '10 Н', desc: 'Средняя' },
    { value: '100', label: '100 Н', desc: 'Большая' },
    { value: '500', label: '500 Н', desc: 'Очень большая' },
    { value: '1000', label: '1000 Н', desc: 'Гигантская' },
    { value: '0.1', label: '0.1 Н', desc: 'Минимальная' },
  ];

  // Типовые длины плеч (м)
  const typicalArms = [
    { value: '0.1', label: '10 см', desc: 'Короткое' },
    { value: '0.5', label: '50 см', desc: 'Среднее' },
    { value: '1', label: '1 м', desc: 'Длинное' },
    { value: '2', label: '2 м', desc: 'Очень длинное' },
    { value: '3', label: '3 м', desc: 'Рычаг Архимеда' },
    { value: '0.01', label: '1 см', desc: 'Очень короткое' },
  ];

  // Типовые выигрыши в силе
  const typicalGains = [
    { value: '2', label: '×2', desc: 'Маленький' },
    { value: '5', label: '×5', desc: 'Средний' },
    { value: '10', label: '×10', desc: 'Большой' },
    { value: '20', label: '×20', desc: 'Очень большой' },
    { value: '50', label: '×50', desc: 'Гигантский' },
    { value: '100', label: '×100', desc: 'Экстремальный' },
  ];

  // Примеры рычагов
  const leverExamples = [
    { type: 'first', name: 'Ножницы', force: '50', arm1: '0.1', arm2: '0.02' },
    { type: 'first', name: 'Качели', force: '400', arm1: '1.5', arm2: '1.5' },
    { type: 'second', name: 'Тачка', force: '200', arm1: '1.2', arm2: '0.3' },
    { type: 'second', name: 'Орехокол', force: '100', arm1: '0.2', arm2: '0.02' },
    { type: 'third', name: 'Пинцет', force: '5', arm1: '0.03', arm2: '0.08' },
    { type: 'third', name: 'Рыболовный спиннинг', force: '20', arm1: '0.4', arm2: '2.5' },
  ];

  // Расчет
  const calculate = () => {
    const F1 = parseFloat(force1) || 0;
    const L1 = parseFloat(arm1) || 0;
    const F2 = parseFloat(force2) || 0;
    const L2 = parseFloat(arm2) || 0;
    const gain = parseFloat(forceGain) || 0;
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let explanation = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];

    switch(mode) {
      case 'equilibrium':
        value = F1 * L1;
        unit = 'Н·м';
        formula = 'F₁ × L₁ = F₂ × L₂';
        explanation = `Момент силы на левом плече: ${F1} Н × ${L1} м`;
        
        const moment2 = F2 * L2;
        if (Math.abs(value - moment2) / Math.max(value, moment2) > 0.05) {
          warnings.push(`⚖️ Рычаг не в равновесии: левый момент ${value.toFixed(2)} Н·м, правый ${moment2.toFixed(2)} Н·м`);
        } else {
          warnings.push('✅ Рычаг находится в равновесии');
        }
        
        comparison = [
          { label: 'Поднять 10 кг на 1 м', value: 100, unit: 'Н·м' },
          { label: 'Отвернуть болт', value: 50, unit: 'Н·м' },
          { label: 'Крутящий момент авто', value: 200, unit: 'Н·м' },
        ];
        break;
        
      case 'forceGain':
        if (L2 !== 0) {
          value = L1 / L2;
          unit = 'раз';
          formula = 'Выигрыш = L₁ / L₂';
          explanation = `Во сколько раз выигрываем в силе`;
        }
        
        if (value > 100) warnings.push('💪 Огромный выигрыш! Но малый ход');
        if (value < 1) warnings.push('📏 Выигрыша нет - проигрываем в силе');
        
        comparison = [
          { label: 'Ножницы', value: 5, unit: 'раз' },
          { label: 'Тачка', value: 4, unit: 'раз' },
          { label: 'Кузнечные клещи', value: 10, unit: 'раз' },
        ];
        break;
        
      case 'armLength':
        if (F2 !== 0) {
          value = (F1 * L1) / F2;
          unit = 'м';
          formula = 'L₂ = (F₁ × L₁) / F₂';
          explanation = `Длина второго плеча для равновесия`;
        }
        
        if (value > 10) warnings.push('📏 Слишком длинное плечо - непрактично');
        if (value < 0.01) warnings.push('📐 Очень короткое плечо - точность нужна');
        
        comparison = [
          { label: 'Линейка', value: 0.3, unit: 'м' },
          { label: 'Рост человека', value: 1.7, unit: 'м' },
          { label: 'Автомобиль', value: 4.5, unit: 'м' },
        ];
        break;
        
      case 'forceValue':
        if (L2 !== 0) {
          value = (F1 * L1) / L2;
          unit = 'Н';
          formula = 'F₂ = (F₁ × L₁) / L₂';
          explanation = `Сила, которую нужно приложить ко второму плечу`;
        }
        
        if (value > 10000) warnings.push('💥 Огромная сила - проверьте прочность!');
        if (value < 0.1) warnings.push('🐜 Маленькая сила - чувствительность высокая');
        
        comparison = [
          { label: 'Вес яблока', value: 1, unit: 'Н' },
          { label: 'Ведро воды', value: 100, unit: 'Н' },
          { label: 'Взрослый человек', value: 700, unit: 'Н' },
        ];
        break;
    }

    // Общие проверки
    if (F1 < 0) warnings.push('❌ Сила не может быть отрицательной');
    if (L1 < 0) warnings.push('❌ Длина плеча не может быть отрицательной');
    if (F2 < 0) warnings.push('❌ Сила не может быть отрицательной');
    if (L2 < 0) warnings.push('❌ Длина плеча не может быть отрицательной');
    if (gain < 0) warnings.push('❌ Выигрыш не может быть отрицательным');

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
  }, [mode, force1, arm1, force2, arm2, forceGain, leverType]);

  const resetCalculator = () => {
    setForce1('10');
    setArm1('0.5');
    setForce2('5');
    setArm2('1');
    setForceGain('2');
  };

  const loadExample = (example: typeof leverExamples[0]) => {
    setForce1(example.force);
    setArm1(example.arm1);
    setArm2(example.arm2);
    setLeverType(example.type);
  };

  const selectTypicalForce = (value: string, target: 'force1' | 'force2') => {
    if (target === 'force1') setForce1(value);
    else setForce2(value);
  };

  const selectTypicalArm = (value: string, target: 'arm1' | 'arm2') => {
    if (target === 'arm1') setArm1(value);
    else setArm2(value);
  };

  const selectTypicalGain = (value: string) => {
    setForceGain(value);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <head>
        <title>Калькулятор рычагов онлайн | Условия равновесия, выигрыш в силе</title>
        <meta name="description" content="Бесплатный онлайн калькулятор для расчёта рычагов. Условия равновесия, выигрыш в силе, моменты сил. Рычаги 1, 2 и 3 рода." />
        <meta name="keywords" content="калькулятор рычагов, условия равновесия, выигрыш в силе, момент силы, рычаг Архимеда, простые механизмы, физика" />
        <meta property="og:title" content="Калькулятор рычагов онлайн | Механика простых механизмов" />
        <meta property="og:description" content="Расчёт равновесия рычагов, выигрыша в силе, моментов сил" />
      </head>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КАЛЬКУЛЯТОРА */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid "#334155',
          backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 100%)'
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#60a5fa',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              ⚖️ Калькулятор рычагов и равновесия
            </h1>
            <p style={{ color: '#93c5fd' }}>
              Расчёт условий равновесия и выигрыша в силе
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
                backgroundColor: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: 'none',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              ← В каталог
            </a>
            
            <button
              onClick={resetCalculator}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Выбор режима */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#dbeafe', marginBottom: '12px', fontSize: '18px' }}>
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
                onClick={() => setMode('equilibrium')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'equilibrium' ? '#60a5fa' : '#334155',
                  color: mode === 'equilibrium' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'equilibrium' ? '#60a5fa' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'equilibrium') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'equilibrium') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Равновесие
              </button>
              
              <button
                type="button"
                onClick={() => setMode('forceGain')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'forceGain' ? '#60a5fa' : '#334155',
                  color: mode === 'forceGain' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'forceGain' ? '#60a5fa' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'forceGain') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'forceGain') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Выигрыш в силе
              </button>
              
              <button
                type="button"
                onClick={() => setMode('armLength')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'armLength' ? '#60a5fa' : '#334155',
                  color: mode === 'armLength' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'armLength' ? '#60a5fa' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'armLength') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'armLength') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Длина плеча
              </button>
              
              <button
                type="button"
                onClick={() => setMode('forceValue')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'forceValue' ? '#60a5fa' : '#334155',
                  color: mode === 'forceValue' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'forceValue' ? '#60a5fa' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'forceValue') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'forceValue') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Величина силы
              </button>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#1e293b', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#93c5fd',
              borderLeft: '4px solid #60a5fa',
              borderTop: '1px solid #334155'
            }}>
              {mode === 'equilibrium' && 'Условие равновесия: F₁ × L₁ = F₂ × L₂'}
              {mode === 'forceGain' && 'Выигрыш в силе: Выигрыш = L₁ / L₂'}
              {mode === 'armLength' && 'Найти плечо: L₂ = (F₁ × L₁) / F₂'}
              {mode === 'forceValue' && 'Найти силу: F₂ = (F₁ × L₁) / L₂'}
            </div>
          </div>

          {/* Тип рычага */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#dbeafe', marginBottom: '12px', fontSize: '18px' }}>
              Тип рычага:
            </h2>
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setLeverType('first')}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: leverType === 'first' ? '#3b82f6' : '#334155',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (leverType !== 'first') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (leverType !== 'first') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                1 род (Опора посередине)
              </button>
              
              <button
                type="button"
                onClick={() => setLeverType('second')}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: leverType === 'second' ? '#3b82f6' : '#334155',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (leverType !== 'second') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (leverType !== 'second') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                2 род (Груз посередине)
              </button>
              
              <button
                type="button"
                onClick={() => setLeverType('third')}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: leverType === 'third' ? '#3b82f6' : '#334155',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (leverType !== 'third') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (leverType !== 'third') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                3 род (Усилие посередине)
              </button>
            </div>
          </div>

          {/* Примеры рычагов */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#dbeafe', marginBottom: '12px', fontSize: '18px' }}>
              Примеры рычагов:
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '16px'
            }}>
              {leverExamples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => loadExample(example)}
                  style={{
                    padding: '10px 8px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{example.name}</div>
                  <div style={{ fontSize: '10px', opacity: 0.9 }}>
                    {example.type === 'first' ? 'Ⅰ' : example.type === 'second' ? 'Ⅱ' : 'Ⅲ'} род
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#dbeafe', marginBottom: '16px', fontSize: '18px' }}>
              Введите параметры рычага:
            </h2>
            
            {/* Две колонки с параметрами */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              
              {/* Левая сторона */}
              <div>
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#1e293b', 
                  borderRadius: '8px',
                  border: '1px solid #334155'
                }}>
                  <h3 style={{ color: '#60a5fa', marginBottom: '12px', fontSize: '16px', textAlign: 'center' }}>
                    Левая сторона
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ color: '#cbd5e1' }}>Сила F₁ (Н)</label>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                      {typicalForces.slice(0, 3).map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => selectTypicalForce(item.value, 'force1')}
                          style={{
                            padding: '6px 4px',
                            backgroundColor: force1 === item.value ? '#60a5fa' : '#334155',
                            color: force1 === item.value ? '#0f172a' : 'white',
                            border: `1px solid ${force1 === item.value ? '#60a5fa' : '#475569'}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            textAlign: 'center',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={force1}
                      onChange={(e) => setForce1(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Сила слева"
                    />
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ color: '#cbd5e1' }}>Плечо L₁ (м)</label>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                      {typicalArms.slice(0, 3).map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => selectTypicalArm(item.value, 'arm1')}
                          style={{
                            padding: '6px 4px',
                            backgroundColor: arm1 === item.value ? '#60a5fa' : '#334155',
                            color: arm1 === item.value ? '#0f172a' : 'white',
                            border: `1px solid ${arm1 === item.value ? '#60a5fa' : '#475569'}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            textAlign: 'center',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={arm1}
                      onChange={(e) => setArm1(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Длина плеча слева"
                    />
                  </div>
                </div>
              </div>
              
              {/* Правая сторона */}
              <div>
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#1e293b', 
                  borderRadius: '8px',
                  border: '1px solid #334155'
                }}>
                  <h3 style={{ color: '#60a5fa', marginBottom: '12px', fontSize: '16px', textAlign: 'center' }}>
                    Правая сторона
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ color: '#cbd5e1' }}>Сила F₂ (Н)</label>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                      {typicalForces.slice(3, 6).map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => selectTypicalForce(item.value, 'force2')}
                          style={{
                            padding: '6px 4px',
                            backgroundColor: force2 === item.value ? '#60a5fa' : '#334155',
                            color: force2 === item.value ? '#0f172a' : 'white',
                            border: `1px solid ${force2 === item.value ? '#60a5fa' : '#475569'}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            textAlign: 'center',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={force2}
                      onChange={(e) => setForce2(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Сила справа"
                    />
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ color: '#cbd5e1' }}>Плечо L₂ (м)</label>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                      {typicalArms.slice(3, 6).map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => selectTypicalArm(item.value, 'arm2')}
                          style={{
                            padding: '6px 4px',
                            backgroundColor: arm2 === item.value ? '#60a5fa' : '#334155',
                            color: arm2 === item.value ? '#0f172a' : 'white',
                            border: `1px solid ${arm2 === item.value ? '#60a5fa' : '#475569'}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            textAlign: 'center',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={arm2}
                      onChange={(e) => setArm2(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Длина плеча справа"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Для режима выигрыша в силе */}
            {mode === 'forceGain' && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ color: '#cbd5e1' }}>Требуемый выигрыш (раз)</label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '12px' }}>
                  {typicalGains.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => selectTypicalGain(item.value)}
                      style={{
                        padding: '8px 4px',
                        backgroundColor: forceGain === item.value ? '#60a5fa' : '#334155',
                        color: forceGain === item.value ? '#0f172a' : 'white',
                        border: `1px solid ${forceGain === item.value ? '#60a5fa' : '#475569'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        transition: 'all 0.3s'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={forceGain}
                  onChange={(e) => setForceGain(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Желаемый выигрыш в силе"
                />
              </div>
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
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '8px' }}>
                      {result.value.toFixed(4)}
                    </div>
                    <div style={{ color: '#93c5fd', fontSize: '18px' }}>
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
                    borderRadius: '8px',
                    border: '1px solid #334155'
                  }}>
                    <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px' }}>
                      📝 Золотое правило механики:
                    </div>
                    <div style={{ color: '#dbeafe', fontSize: '18px', fontFamily: 'monospace' }}>
                      {result.formula}
                    </div>
                  </div>
                  
                  {/* Сравнение */}
                  {result.comparison && result.comparison.length > 0 && (
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '16px',
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: '1px solid #334155'
                    }}>
                      <div style={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '8px' }}>
                        📊 Для сравнения:
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {result.comparison.map((item, index) => (
                          <div key={index} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.label}:</span>
                            <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>
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
                      backgroundColor: '#172554',
                      borderRadius: '8px',
                      border: '1px solid #3b82f6'
                    }}>
                      <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '8px' }}>
                        ⚠️ Информация
                      </div>
                      <div style={{ color: '#93c5fd', fontSize: '14px' }}>
                        {result.warnings.map((warning, index) => (
                          <div key={index} style={{ marginBottom: '4px' }}>• {warning}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    const text = `${mode === 'equilibrium' ? 'Момент силы' : mode === 'forceGain' ? 'Выигрыш в силе' : mode === 'armLength' ? 'Длина плеча' : 'Сила'}: ${result.value.toFixed(4)} ${result.unit}`;
                    navigator.clipboard.writeText(text);
                    alert('Результат скопирован!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    width: '100%',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚖️</div>
                <div style={{ color: '#93c5fd', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры рычага
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите силы и длины плеч для расчёта
                </div>
              </div>
            )}
          </div>

          {/* Формулы */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid #334155'
          }}>
            <div style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              F₁ × L₁ = F₂ × L₂ | M = F × L | Выигрыш = L₁/L₂
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Правило рычага Архимеда: "Дайте мне точку опоры, и я переверну мир"
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
          lineHeight: '1.6',
          border: '1px solid #334155'
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#60a5fa' }}>
            Калькулятор рычагов онлайн: условия равновесия, моменты сил, выигрыш
          </h1>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#60a5fa' }}>
              Что такое рычаг и почему он так важен?
            </h2>
            <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>
              <strong>Рычаг</strong> — это простейший механизм, представляющий собой твёрдое тело, вращающееся вокруг точки опоры. Золотое правило рычага было сформулировано Архимедом: «Дайте мне точку опоры, и я переверну мир».
            </p>
            <p style={{ color: '#cbd5e1' }}>
              Наш калькулятор позволяет рассчитать все параметры рычага: условия равновесия, выигрыш в силе, моменты сил, необходимые длины плеч. Особенно полезен при проектировании механизмов и решении физических задач.
            </p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#60a5fa' }}>
              Основные формулы расчёта рычагов
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#fbbf24' }}>1. Условие равновесия рычага</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> F₁ × L₁ = F₂ × L₂<br/>
                <strong>Где:</strong> F — сила (Н), L — плечо силы (м)<br/>
                <strong>Пример:</strong> Сила 10 Н на плече 0.5 м уравновешивает силу 5 Н на плече 1 м.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#fbbf24' }}>2. Момент силы</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> M = F × L<br/>
                <strong>Где:</strong> M — момент силы (Н·м)<br/>
                <strong>Пример:</strong> Ключ длиной 0.3 м с усилием 50 Н создаёт момент 15 Н·м.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#fbbf24' }}>3. Выигрыш в силе</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> Выигрыш = L₁ / L₂<br/>
                <strong>Где:</strong> L₁ — длинное плечо, L₂ — короткое плечо<br/>
                <strong>Пример:</strong> При соотношении плеч 4:1 выигрыш в силе составит 4 раза.
              </p>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#60a5fa' }}>
              Типы рычагов и их применение
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4', textAlign: 'center' }}>Ⅰ род</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', textAlign: 'center' }}>
                  <strong>Опора посередине</strong><br/>
                  Ножницы, качели, плоскогубцы, весы
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4', textAlign: 'center' }}>Ⅱ род</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', textAlign: 'center' }}>
                  <strong>Груз посередине</strong><br/>
                  Тачка, орехокол, двери, стеклорез
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4', textAlign: 'center' }}>Ⅲ род</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', textAlign: 'center' }}>
                  <strong>Усилие посередине</strong><br/>
                  Пинцет, щипцы, швабра, лопата
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#60a5fa' }}>
              Часто задаваемые вопросы (FAQ) по рычагам
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#fbbf24' }}>⚖️ Почему в рычаге проигрываем в пути?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  <strong>Золотое правило механики</strong>: во сколько раз выигрываем в силе, во столько же раз проигрываем в расстоянии. Это следствие закона сохранения энергии.
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#fbbf24' }}>⚖️ Какой максимальный выигрыш можно получить?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Теоретически — бесконечный (при L₂ → 0). Практически ограничен прочностью материала. В быту — до 100 раз, в промышленности — до 1000 раз.
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#fbbf24' }}>⚖️ Что такое момент силы и зачем он нужен?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Момент силы — это произведение силы на плечо. Он характеризует вращательный эффект силы. Важен при расчёте крутящих моментов, прочности, устойчивости.
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#fbbf24' }}>⚖️ Как спроектировать рычаг для конкретной задачи?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  1. Определите необходимую силу и ход<br/>
                  2. Рассчитайте соотношение плеч по формуле выигрыша<br/>
                  3. Проверьте равновесие моментов<br/>
                  4. Учтите прочность и вес конструкции<br/>
                  5. Наш калькулятор поможет на каждом этапе
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #06b6d4', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#06b6d4' }}>
              💡 Исторические факты о рычагах
            </h2>
            <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}><strong>Архимед</strong> (287-212 до н.э.) — открыл правило рычага и заявил: «Дайте мне точку опоры, и я переверну мир»</li>
              <li style={{ marginBottom: '10px' }}><strong>Древний Египет</strong> — использовали рычаги при строительстве пирамид</li>
              <li style={{ marginBottom: '10px' }}><strong>Средневековье</strong> — рычаги применялись в катапультах и осадных орудиях</li>
              <li style={{ marginBottom: '10px' }}><strong>Промышленная революция</strong> — рычажные механизмы стали основой станков</li>
              <li>Современность — от микрохирургических инструментов до подъёмных кранов</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}