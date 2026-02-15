// app/mechanics/peredachi/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function PeredachiPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('gearRatio'); // 'gearRatio', 'speed', 'torque', 'multiStage', 'diameter'
  
  // Параметры передачи
  const [z1, setZ1] = useState<string>('20');
  const [z2, setZ2] = useState<string>('60');
  const [n1, setN1] = useState<string>('1000');
  const [n2, setN2] = useState<string>('333.33');
  const [torqueIn, setTorqueIn] = useState<string>('50');
  const [torqueOut, setTorqueOut] = useState<string>('150');
  const [moduleGear, setModuleGear] = useState<string>('2');
  const [stages, setStages] = useState<string>('2');
  
  // Тип передачи
  const [gearType, setGearType] = useState<string>('spur'); // 'spur', 'helical', 'bevel', 'worm'
  
  // Многоступенчатая передача
  const [stageRatios, setStageRatios] = useState<string[]>(['3', '4']);
  
  // Результаты
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    explanation: string;
    warnings: string[];
    comparison: Array<{label: string, value: number, unit: string}>;
    details?: Array<{label: string, value: string}>;
  } | null>(null);

  // Типовые числа зубьев
  const typicalTeeth = [
    { value: '12', label: '12', desc: 'Малое' },
    { value: '20', label: '20', desc: 'Среднее' },
    { value: '30', label: '30', desc: 'Большое' },
    { value: '45', label: '45', desc: 'Очень большое' },
    { value: '60', label: '60', desc: 'Гигантское' },
    { value: '80', label: '80', desc: 'Экстремальное' },
  ];

  // Типовые обороты (об/мин)
  const typicalRPM = [
    { value: '100', label: '100', desc: 'Медленно' },
    { value: '500', label: '500', desc: 'Средне' },
    { value: '1000', label: '1000', desc: 'Быстро' },
    { value: '3000', label: '3000', desc: 'Очень быстро' },
    { value: '10000', label: '10000', desc: 'Сверхбыстро' },
    { value: '50', label: '50', desc: 'Очень медленно' },
  ];

  // Типовые моменты (Н·м)
  const typicalTorques = [
    { value: '10', label: '10 Н·м', desc: 'Маленький' },
    { value: '50', label: '50 Н·м', desc: 'Средний' },
    { value: '100', label: '100 Н·м', desc: 'Большой' },
    { value: '500', label: '500 Н·м', desc: 'Очень большой' },
    { value: '1000', label: '1000 Н·м', desc: 'Гигантский' },
    { value: '5', label: '5 Н·м', desc: 'Минимальный' },
  ];

  // Типовые модули (мм)
  const typicalModules = [
    { value: '1', label: '1 мм', desc: 'Мелкий' },
    { value: '2', label: '2 мм', desc: 'Средний' },
    { value: '3', label: '3 мм', desc: 'Крупный' },
    { value: '5', label: '5 мм', desc: 'Очень крупный' },
    { value: '8', label: '8 мм', desc: 'Гигантский' },
    { value: '0.5', label: '0.5 мм', desc: 'Микро' },
  ];

  // Примеры передач
  const gearExamples = [
    { type: 'spur', name: 'Часы', z1: '12', z2: '48', module: '0.5' },
    { type: 'spur', name: 'Дрель', z1: '20', z2: '60', module: '2' },
    { type: 'helical', name: 'Коробка передач', z1: '25', z2: '75', module: '3' },
    { type: 'bevel', name: 'Дифференциал', z1: '15', z2: '45', module: '4' },
    { type: 'worm', name: 'Подъёмник', z1: '1', z2: '40', module: '5' },
    { type: 'spur', name: 'Миксер', z1: '18', z2: '72', module: '1.5' },
  ];

  // Типовые передаточные числа
  const typicalRatios = [
    { value: '2', label: '1:2', desc: 'Малое' },
    { value: '3', label: '1:3', desc: 'Среднее' },
    { value: '5', label: '1:5', desc: 'Большое' },
    { value: '10', label: '1:10', desc: 'Очень большое' },
    { value: '20', label: '1:20', desc: 'Гигантское' },
    { value: '50', label: '1:50', desc: 'Экстремальное' },
  ];

  // Расчет
  const calculate = () => {
    const teeth1 = parseFloat(z1) || 0;
    const teeth2 = parseFloat(z2) || 0;
    const rpm1 = parseFloat(n1) || 0;
    const rpm2 = parseFloat(n2) || 0;
    const torque1 = parseFloat(torqueIn) || 0;
    const torque2 = parseFloat(torqueOut) || 0;
    const module = parseFloat(moduleGear) || 0;
    const numStages = parseFloat(stages) || 1;
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let explanation = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];
    let details: Array<{label: string, value: string}> = [];

    switch(mode) {
      case 'gearRatio':
        if (teeth2 !== 0) {
          value = teeth2 / teeth1;
          unit = ':1';
          formula = 'i = z₂ / z₁ = n₁ / n₂';
          explanation = `Передаточное число зубчатой передачи`;
          
          details = [
            { label: 'Ведомое колесо зубьев', value: teeth2.toString() },
            { label: 'Ведущее колесо зубьев', value: teeth1.toString() },
            { label: 'Передаточное отношение', value: `1 : ${value.toFixed(2)}` },
          ];
        }
        
        if (value < 1) warnings.push('⚡ Передаточное число < 1 - увеличение скорости');
        if (value > 100) warnings.push('🐌 Очень большое передаточное число - медленный ход');
        if (value < 0.1) warnings.push('🚀 Очень малое передаточное число - сверхвысокая скорость');
        
        comparison = [
          { label: 'Велосипед', value: 3, unit: ':1' },
          { label: 'Автомобиль (1 передача)', value: 4.5, unit: ':1' },
          { label: 'Часовой механизм', value: 60, unit: ':1' },
        ];
        break;
        
      case 'speed':
        if (teeth2 !== 0) {
          const ratio = teeth2 / teeth1;
          value = rpm1 / ratio;
          unit = 'об/мин';
          formula = 'n₂ = n₁ / i';
          explanation = `Обороты ведомого вала`;
          
          details = [
            { label: 'Обороты ведущего', value: `${rpm1} об/мин` },
            { label: 'Передаточное число', value: ratio.toFixed(2) },
            { label: 'Скорость изменения', value: `${(rpm1 / value).toFixed(2)} раз` },
          ];
        }
        
        if (value > 10000) warnings.push('🔥 Очень высокие обороты - проверьте балансировку');
        if (value < 10) warnings.push('🐢 Очень низкие обороты - высокий крутящий момент');
        
        comparison = [
          { label: 'Электродвигатель', value: 1500, unit: 'об/мин' },
          { label: 'Автомобильный двигатель', value: 3000, unit: 'об/мин' },
          { label: 'Стиральная машина', value: 1000, unit: 'об/мин' },
        ];
        break;
        
      case 'torque':
        if (teeth1 !== 0 && teeth2 !== 0) {
          const ratio = teeth2 / teeth1;
          value = torque1 * ratio;
          unit = 'Н·м';
          formula = 'M₂ = M₁ × i';
          explanation = `Крутящий момент на ведомом валу`;
          
          details = [
            { label: 'Входной момент', value: `${torque1} Н·м` },
            { label: 'Передаточное число', value: ratio.toFixed(2) },
            { label: 'Выигрыш в моменте', value: `${ratio.toFixed(2)} раз` },
          ];
        }
        
        if (value > 10000) warnings.push('💪 Огромный момент - мощная передача');
        if (value < 1) warnings.push('📏 Маленький момент - точные механизмы');
        
        comparison = [
          { label: 'Отвертка', value: 5, unit: 'Н·м' },
          { label: 'Дрель', value: 50, unit: 'Н·м' },
          { label: 'Автомобильный вал', value: 300, unit: 'Н·м' },
        ];
        break;
        
      case 'multiStage':
        if (stageRatios.length > 0) {
          const ratios = stageRatios.map(r => parseFloat(r) || 1);
          value = ratios.reduce((acc, curr) => acc * curr, 1);
          unit = ':1';
          formula = 'i = i₁ × i₂ × i₃ × ...';
          explanation = `Общее передаточное число многоступенчатого редуктора`;
          
          details = [
            { label: 'Количество ступеней', value: stageRatios.length.toString() },
            { label: 'Отдельные передаточные числа', value: ratios.join(' : ').toString() },
            { label: 'Суммарный выигрыш', value: `${value.toFixed(2)} раз` },
          ];
        }
        
        if (value > 1000) warnings.push('⚙️ Гигантское общее передаточное число');
        if (value < 0.01) warnings.push('🚀 Сильное увеличение скорости');
        
        comparison = [
          { label: '2-ступенчатый редуктор', value: 9, unit: ':1' },
          { label: '3-ступенчатый редуктор', value: 27, unit: ':1' },
          { label: 'Часовой механизм', value: 3600, unit: ':1' },
        ];
        break;
        
      case 'diameter':
        if (module > 0) {
          const d1 = module * teeth1;
          const d2 = module * teeth2;
          value = (d1 + d2) / 2;
          unit = 'мм';
          formula = 'd = m × z';
          explanation = `Средний диаметр зацепления передачи`;
          
          details = [
            { label: 'Диаметр шестерни', value: `${d1.toFixed(1)} мм` },
            { label: 'Диаметр колеса', value: `${d2.toFixed(1)} мм` },
            { label: 'Межосевое расстояние', value: `${((d1 + d2) / 2).toFixed(1)} мм` },
          ];
        }
        
        if (value > 1000) warnings.push('🏗️ Очень крупная передача');
        if (value < 10) warnings.push('🔬 Миниатюрная передача');
        
        comparison = [
          { label: 'Наручные часы', value: 15, unit: 'мм' },
          { label: 'Дрель', value: 60, unit: 'мм' },
          { label: 'Промышленный редуктор', value: 500, unit: 'мм' },
        ];
        break;
    }

    // Общие проверки
    if (teeth1 < 6) warnings.push('⚠️ Слишком мало зубьев - возможно заклинивание');
    if (teeth2 < 6) warnings.push('⚠️ Слишком мало зубьев - возможно заклинивание');
    if (teeth1 === teeth2) warnings.push('⚙️ Равные числа зубьев - прямая передача (i=1)');
    if (module < 0.1) warnings.push('🔬 Микромодуль - высокая точность изготовления');
    if (rpm1 > 20000) warnings.push('🚨 Опасные обороты - центробежные силы');

    setResult({
      value,
      unit,
      formula,
      explanation,
      warnings,
      comparison,
      details
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, z1, z2, n1, n2, torqueIn, torqueOut, moduleGear, stages, stageRatios, gearType]);

  const resetCalculator = () => {
    setZ1('20');
    setZ2('60');
    setN1('1000');
    setN2('333.33');
    setTorqueIn('50');
    setTorqueOut('150');
    setModuleGear('2');
    setStages('2');
    setStageRatios(['3', '4']);
    setGearType('spur');
  };

  const loadExample = (example: typeof gearExamples[0]) => {
    setZ1(example.z1);
    setZ2(example.z2);
    setModuleGear(example.module);
    setGearType(example.type);
  };

  const addStage = () => {
    setStageRatios([...stageRatios, '3']);
  };

  const removeStage = (index: number) => {
    const newRatios = [...stageRatios];
    newRatios.splice(index, 1);
    setStageRatios(newRatios);
  };

  const updateStageRatio = (index: number, value: string) => {
    const newRatios = [...stageRatios];
    newRatios[index] = value;
    setStageRatios(newRatios);
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
        <title>Калькулятор передач онлайн | Зубчатые передачи, редукторы, передаточные числа</title>
        <meta name="description" content="Бесплатный онлайн калькулятор для расчёта зубчатых передач, редукторов, передаточных чисел, оборотов и крутящих моментов." />
        <meta name="keywords" content="калькулятор передач, передаточное число, зубчатая передача, редуктор, обороты, крутящий момент, модуль зубьев, шестерни" />
        <meta property="og:title" content="Калькулятор передач онлайн | Механика зубчатых передач" />
        <meta property="og:description" content="Расчёт передаточных чисел, оборотов, моментов и параметров зубчатых передач" />
      </head>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КАЛЬКУЛЯТОРА */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid "#334155',
          backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #7c2d12 100%)'
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#f97316',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              ⚙️ Калькулятор передач и редукторов
            </h1>
            <p style={{ color: '#fdba74' }}>
              Расчёт зубчатых передач, передаточных чисел, оборотов и моментов
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
                backgroundColor: '#ea580c',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: 'none',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
            >
              ← В каталог
            </a>
            
            <button
              onClick={resetCalculator}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#ea580c',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Выбор режима */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#fed7aa', marginBottom: '12px', fontSize: '18px' }}>
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
                onClick={() => setMode('gearRatio')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'gearRatio' ? '#f97316' : '#334155',
                  color: mode === 'gearRatio' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'gearRatio' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'gearRatio') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'gearRatio') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Передаточное число
              </button>
              
              <button
                type="button"
                onClick={() => setMode('speed')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'speed' ? '#f97316' : '#334155',
                  color: mode === 'speed' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'speed' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'speed') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'speed') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Обороты вала
              </button>
              
              <button
                type="button"
                onClick={() => setMode('torque')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'torque' ? '#f97316' : '#334155',
                  color: mode === 'torque' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'torque' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'torque') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'torque') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Крутящий момент
              </button>
              
              <button
                type="button"
                onClick={() => setMode('multiStage')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'multiStage' ? '#f97316' : '#334155',
                  color: mode === 'multiStage' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'multiStage' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'multiStage') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'multiStage') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Многоступенчатая
              </button>
              
              <button
                type="button"
                onClick={() => setMode('diameter')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'diameter' ? '#f97316' : '#334155',
                  color: mode === 'diameter' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'diameter' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'diameter') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'diameter') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Диаметры шестерён
              </button>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#1e293b', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#fdba74',
              borderLeft: '4px solid #f97316',
              borderTop: '1px solid #334155'
            }}>
              {mode === 'gearRatio' && 'Передаточное число: i = z₂/z₁ = n₁/n₂'}
              {mode === 'speed' && 'Обороты ведомого вала: n₂ = n₁ / i'}
              {mode === 'torque' && 'Крутящий момент: M₂ = M₁ × i'}
              {mode === 'multiStage' && 'Многоступенчатая передача: i = i₁ × i₂ × i₃ × ...'}
              {mode === 'diameter' && 'Диаметр шестерни: d = m × z'}
            </div>
          </div>

         {/* Тип зубчатой передачи */}
<div style={{ marginBottom: '24px' }}>
  <h2 style={{ color: '#fed7aa', marginBottom: '12px', fontSize: '18px' }}>
    Тип зубчатой передачи:
  </h2>
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px', 
    marginBottom: '20px',
    width: '100%'
  }}>
    <button
      type="button"
      onClick={() => setGearType('spur')}
      style={{
        padding: '12px 8px',
        backgroundColor: gearType === 'spur' ? '#ea580c' : '#334155',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'clamp(14px, 3vw, 16px)',
        textAlign: 'center',
        transition: 'all 0.3s',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '50px'
      }}
      onMouseEnter={(e) => {
        if (gearType !== 'spur') e.currentTarget.style.backgroundColor = '#475569';
      }}
      onMouseLeave={(e) => {
        if (gearType !== 'spur') e.currentTarget.style.backgroundColor = '#334155';
      }}
    >
      Прямозубая
    </button>
    
    <button
      type="button"
      onClick={() => setGearType('helical')}
      style={{
        padding: '12px 8px',
        backgroundColor: gearType === 'helical' ? '#ea580c' : '#334155',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'clamp(14px, 3vw, 16px)',
        textAlign: 'center',
        transition: 'all 0.3s',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '50px'
      }}
      onMouseEnter={(e) => {
        if (gearType !== 'helical') e.currentTarget.style.backgroundColor = '#475569';
      }}
      onMouseLeave={(e) => {
        if (gearType !== 'helical') e.currentTarget.style.backgroundColor = '#334155';
      }}
    >
      Косозубая
    </button>
    
    <button
      type="button"
      onClick={() => setGearType('bevel')}
      style={{
        padding: '12px 8px',
        backgroundColor: gearType === 'bevel' ? '#ea580c' : '#334155',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'clamp(14px, 3vw, 16px)',
        textAlign: 'center',
        transition: 'all 0.3s',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '50px'
      }}
      onMouseEnter={(e) => {
        if (gearType !== 'bevel') e.currentTarget.style.backgroundColor = '#475569';
      }}
      onMouseLeave={(e) => {
        if (gearType !== 'bevel') e.currentTarget.style.backgroundColor = '#334155';
      }}
    >
      Коническая
    </button>
    
    <button
      type="button"
      onClick={() => setGearType('worm')}
      style={{
        padding: '12px 8px',
        backgroundColor: gearType === 'worm' ? '#ea580c' : '#334155',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'clamp(14px, 3vw, 16px)',
        textAlign: 'center',
        transition: 'all 0.3s',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '50px'
      }}
      onMouseEnter={(e) => {
        if (gearType !== 'worm') e.currentTarget.style.backgroundColor = '#475569';
      }}
      onMouseLeave={(e) => {
        if (gearType !== 'worm') e.currentTarget.style.backgroundColor = '#334155';
      }}
    >
      Червячная
    </button>
  </div>
</div>

          {/* Примеры передач */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#fed7aa', marginBottom: '12px', fontSize: '18px' }}>
              Примеры передач:
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '16px'
            }}>
              {gearExamples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => loadExample(example)}
                  style={{
                    padding: '10px 8px',
                    backgroundColor: '#c2410c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a3412'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{example.name}</div>
                  <div style={{ fontSize: '10px', opacity: 0.9 }}>
                    z₁={example.z1} z₂={example.z2}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#fed7aa', marginBottom: '16px', fontSize: '18px' }}>
              Введите параметры передачи:
            </h2>
            
            {/* Две колонки с параметрами */}
            {(mode === 'gearRatio' || mode === 'speed' || mode === 'torque' || mode === 'diameter') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                
                {/* Левая сторона (ведущая) */}
                <div>
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#1e293b', 
                    borderRadius: '8px',
                    border: '1px solid #334155'
                  }}>
                    <h3 style={{ color: '#f97316', marginBottom: '12px', fontSize: '16px', textAlign: 'center' }}>
                      Ведущая шестерня (z₁)
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ color: '#cbd5e1' }}>Число зубьев z₁</label>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                        {typicalTeeth.slice(0, 3).map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setZ1(item.value)}
                            style={{
                              padding: '6px 4px',
                              backgroundColor: z1 === item.value ? '#f97316' : '#334155',
                              color: z1 === item.value ? '#0f172a' : 'white',
                              border: `1px solid ${z1 === item.value ? '#f97316' : '#475569'}`,
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
                        step="1"
                        min="1"
                        value={z1}
                        onChange={(e) => setZ1(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          color: 'white',
                          fontSize: '16px'
                        }}
                        placeholder="Число зубьев ведущей"
                      />
                    </div>
                    
                    {(mode === 'speed' || mode === 'torque') && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label style={{ color: '#cbd5e1' }}>
                            {mode === 'speed' ? 'Обороты n₁ (об/мин)' : 'Момент M₁ (Н·м)'}
                          </label>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                          {(mode === 'speed' ? typicalRPM.slice(0, 3) : typicalTorques.slice(0, 3)).map((item) => (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => mode === 'speed' ? setN1(item.value) : setTorqueIn(item.value)}
                              style={{
                                padding: '6px 4px',
                                backgroundColor: (mode === 'speed' ? n1 : torqueIn) === item.value ? '#f97316' : '#334155',
                                color: (mode === 'speed' ? n1 : torqueIn) === item.value ? '#0f172a' : 'white',
                                border: `1px solid ${(mode === 'speed' ? n1 : torqueIn) === item.value ? '#f97316' : '#475569'}`,
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
                          step={mode === 'speed' ? '10' : '0.1'}
                          min="0"
                          value={mode === 'speed' ? n1 : torqueIn}
                          onChange={(e) => mode === 'speed' ? setN1(e.target.value) : setTorqueIn(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            color: 'white',
                            fontSize: '16px'
                          }}
                          placeholder={mode === 'speed' ? 'Обороты ведущего вала' : 'Входной крутящий момент'}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Правая сторона (ведомая) */}
                <div>
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#1e293b', 
                    borderRadius: '8px',
                    border: '1px solid #334155'
                  }}>
                    <h3 style={{ color: '#f97316', marginBottom: '12px', fontSize: '16px', textAlign: 'center' }}>
                      Ведомое колесо (z₂)
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ color: '#cbd5e1' }}>Число зубьев z₂</label>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                        {typicalTeeth.slice(3, 6).map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setZ2(item.value)}
                            style={{
                              padding: '6px 4px',
                              backgroundColor: z2 === item.value ? '#f97316' : '#334155',
                              color: z2 === item.value ? '#0f172a' : 'white',
                              border: `1px solid ${z2 === item.value ? '#f97316' : '#475569'}`,
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
                        step="1"
                        min="1"
                        value={z2}
                        onChange={(e) => setZ2(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          color: 'white',
                          fontSize: '16px'
                        }}
                        placeholder="Число зубьев ведомой"
                      />
                    </div>
                    
                    {mode === 'diameter' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label style={{ color: '#cbd5e1' }}>Модуль m (мм)</label>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                          {typicalModules.slice(0, 3).map((item) => (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => setModuleGear(item.value)}
                              style={{
                                padding: '6px 4px',
                                backgroundColor: moduleGear === item.value ? '#f97316' : '#334155',
                                color: moduleGear === item.value ? '#0f172a' : 'white',
                                border: `1px solid ${moduleGear === item.value ? '#f97316' : '#475569'}`,
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
                          min="0.1"
                          value={moduleGear}
                          onChange={(e) => setModuleGear(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            color: 'white',
                            fontSize: '16px'
                          }}
                          placeholder="Модуль зубчатого колеса"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Для многоступенчатой передачи */}
            {mode === 'multiStage' && (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#1e293b', 
                borderRadius: '8px',
                border: '1px solid #334155',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: '#f97316', fontSize: '16px' }}>
                    Передаточные числа ступеней:
                  </h3>
                  <button
                    type="button"
                    onClick={addStage}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ea580c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                  >
                    + Добавить ступень
                  </button>
                </div>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {stageRatios.map((ratio, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#0f172a',
                      borderRadius: '6px'
                    }}>
                      <div style={{ color: '#cbd5e1', minWidth: '80px' }}>
                        Ступень {index + 1}:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', flex: 1 }}>
                        {typicalRatios.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => updateStageRatio(index, item.value)}
                            style={{
                              padding: '8px 4px',
                              backgroundColor: ratio === item.value ? '#f97316' : '#334155',
                              color: ratio === item.value ? '#0f172a' : 'white',
                              border: `1px solid ${ratio === item.value ? '#f97316' : '#475569'}`,
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
                        min="0.1"
                        value={ratio}
                        onChange={(e) => updateStageRatio(index, e.target.value)}
                        style={{
                          width: '80px',
                          padding: '8px',
                          borderRadius: '6px',
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          color: 'white',
                          fontSize: '14px',
                          textAlign: 'center'
                        }}
                        placeholder="i"
                      />
                      {stageRatios.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStage(index)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316', marginBottom: '8px' }}>
                      {result.value.toFixed(4)}
                    </div>
                    <div style={{ color: '#fdba74', fontSize: '18px' }}>
                      {result.unit}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                      {result.explanation}
                    </div>
                  </div>
                  
                  {/* Детали расчета */}
                  {result.details && result.details.length > 0 && (
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '16px',
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: '1px solid #334155'
                    }}>
                      <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px' }}>
                        📋 Детали расчета:
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {result.details.map((item, index) => (
                          <div key={index} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.label}:</span>
                            <span style={{ fontWeight: 'bold', color: '#f97316' }}>
                              {item.value}
                            </span>
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
                    borderRadius: '8px',
                    border: '1px solid #334155'
                  }}>
                    <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px' }}>
                      📝 Формула расчета:
                    </div>
                    <div style={{ color: '#fed7aa', fontSize: '18px', fontFamily: 'monospace' }}>
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
                      backgroundColor: '#450a0a',
                      borderRadius: '8px',
                      border: '1px solid #f97316'
                    }}>
                      <div style={{ color: '#f97316', fontWeight: 'bold', marginBottom: '8px' }}>
                        ⚠️ Технические рекомендации:
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
                    const text = `${mode === 'gearRatio' ? 'Передаточное число' : mode === 'speed' ? 'Обороты вала' : mode === 'torque' ? 'Крутящий момент' : mode === 'multiStage' ? 'Общее передаточное число' : 'Диаметр'}: ${result.value.toFixed(4)} ${result.unit}`;
                    navigator.clipboard.writeText(text);
                    alert('Результат скопирован!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ea580c',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    width: '100%',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                >
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚙️</div>
                <div style={{ color: '#fdba74', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры передачи
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите числа зубьев, обороты или моменты для расчёта
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
            <div style={{ color: '#f97316', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              i = z₂/z₁ = n₁/n₂ | M₂ = M₁ × i | d = m × z
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основные формулы зубчатых передач и редукторов
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
          <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#f97316' }}>
            Калькулятор передач онлайн: зубчатые передачи, редукторы, передаточные числа
          </h1>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#f97316' }}>
              Что такое зубчатая передача и передаточное число?
            </h2>
            <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>
              <strong>Зубчатая передача</strong> — это механизм для передачи вращательного движения между валами с изменением угловой скорости и крутящего момента. Основной характеристикой является <strong>передаточное число (i)</strong> — отношение числа зубьев ведомого колеса к числу зубьев ведущего.
            </p>
            <p style={{ color: '#cbd5e1' }}>
              Наш калькулятор позволяет рассчитать все ключевые параметры зубчатых передач: передаточное число, обороты валов, крутящий момент, диаметры шестерён, параметры многоступенчатых редукторов.
            </p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#f97316' }}>
              Основные формулы расчёта передач
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#fbbf24' }}>1. Передаточное число</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> i = z₂ / z₁ = n₁ / n₂<br/>
                <strong>Где:</strong> z — число зубьев, n — обороты в минуту<br/>
                <strong>Пример:</strong> z₁=20, z₂=60 → i=60/20=3:1 (уменьшение скорости в 3 раза)
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#fbbf24' }}>2. Крутящий момент</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> M₂ = M₁ × i<br/>
                <strong>Где:</strong> M — крутящий момент (Н·м)<br/>
                <strong>Пример:</strong> Входной момент 50 Н·м при i=3 → выходной момент 150 Н·м
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#fbbf24' }}>3. Диаметр шестерни</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> d = m × z<br/>
                <strong>Где:</strong> d — диаметр (мм), m — модуль (мм)<br/>
                <strong>Пример:</strong> z=30, m=2 мм → d=60 мм
              </p>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#f97316' }}>
              Типы зубчатых передач и их применение
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Прямозубая</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  <strong>Особенности:</strong> Простая, шумная, для низких скоростей<br/>
                  <strong>Применение:</strong> Редукторы, простые механизмы
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Косозубая</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  <strong>Особенности:</strong> Тихая, плавная, осевая нагрузка<br/>
                  <strong>Применение:</strong> Коробки передач, высокоскоростные передачи
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Коническая</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  <strong>Особенности:</strong> Передача между пересекающимися валами<br/>
                  <strong>Применение:</strong> Дифференциалы, рулевые механизмы
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Червячная</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  <strong>Особенности:</strong> Большой передаточный номер, самоторможение<br/>
                  <strong>Применение:</strong> Подъёмники, тихоходные передачи
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#f97316' }}>
              Часто задаваемые вопросы (FAQ) по передачам
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#fbbf24' }}>⚙️ Что такое модуль зубчатого колеса?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  <strong>Модуль (m)</strong> — основной параметр зубчатого зацепления, определяющий размеры зубьев. Измеряется в миллиметрах. Стандартные модули: 1, 1.25, 1.5, 2, 2.5, 3, 4, 5 мм и т.д.
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#fbbf24' }}>⚙️ Как выбрать передаточное число?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Зависит от задачи: <br/>
                  • <strong>Увеличение момента</strong> → i &gt; 1 (3:1, 5:1, 10:1)<br/>
                  • <strong>Увеличение скорости</strong> → i &lt; 1 (1:2, 1:3)<br/>
                  • <strong>Прямая передача</strong> → i = 1 (1:1)
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#fbbf24' }}>⚙️ Что такое КПД передачи?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Коэффициент полезного действия показывает потери мощности:<br/>
                  • Прямозубая: 95-98%<br/>
                  • Косозубая: 96-99%<br/>
                  • Коническая: 93-97%<br/>
                  • Червячная: 30-90% (зависит от передаточного числа)
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#fbbf24' }}>⚙️ Как спроектировать многоступенчатый редуктор?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  1. Определите общее передаточное число<br/>
                  2. Разбейте на ступени (обычно 2-4 ступени)<br/>
                  3. Подберите числа зубьев для каждой ступени<br/>
                  4. Рассчитайте диаметры шестерён<br/>
                  5. Проверьте межосевые расстояния<br/>
                  6. Наш калькулятор поможет на каждом этапе
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #06b6d4', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#06b6d4' }}>
              💡 Практические советы по проектированию передач
            </h2>
            <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}><strong>Минимальное число зубьев:</strong> 17-20 для прямозубых, 14-17 для косозубых</li>
              <li style={{ marginBottom: '10px' }}><strong>Оптимальное передаточное число:</strong> для одной ступени 1.5-6, для червячных до 80</li>
              <li style={{ marginBottom: '10px' }}><strong>Межосевое расстояние:</strong> должно быть стандартным или кратным 5 мм</li>
              <li style={{ marginBottom: '10px' }}><strong>Ширина зубчатого венца:</strong> обычно 8-12 модулей</li>
              <li style={{ marginBottom: '10px' }}><strong>Материалы:</strong> сталь для нагруженных передач, пластик для лёгких</li>
              <li><strong>Смазка:</strong> обязательна для высокоскоростных передач</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}