// app/mechanics/skivy-i-peredachi/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function SkivyIPeredachiPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('speed_ratio'); // 'speed_ratio', 'diameter_ratio', 'torque_ratio', 'belt_length', 'center_distance'
  
  // Основные параметры
  const [driveRpm, setDriveRpm] = useState<string>('1500');
  const [drivenRpm, setDrivenRpm] = useState<string>('750');
  const [driveDiameter, setDriveDiameter] = useState<string>('100');
  const [drivenDiameter, setDrivenDiameter] = useState<string>('200');
  const [driveTorque, setDriveTorque] = useState<string>('50');
  const [drivenTorque, setDrivenTorque] = useState<string>('100');
  const [beltLength, setBeltLength] = useState<string>('1500');
  const [centerDistance, setCenterDistance] = useState<string>('500');
  
  // Результаты
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    explanation: string;
    warnings: string[];
    comparison: Array<{label: string, value: number, unit: string}>;
  } | null>(null);

  // Типовые обороты (об/мин)
  const typicalRpms = [
    { value: '300', label: '300 об/мин', desc: 'Медленные' },
    { value: '750', label: '750 об/мин', desc: 'Стандартные' },
    { value: '1500', label: '1500 об/мин', desc: 'Быстрые' },
    { value: '3000', label: '3000 об/мин', desc: 'Высокооборотные' },
    { value: '100', label: '100 об/мин', desc: 'Очень медленные' },
    { value: '5000', label: '5000 об/мин', desc: 'Сверхбыстрые' },
  ];

  // Типовые диаметры шкивов (мм)
  const typicalDiameters = [
    { value: '50', label: '50 мм', desc: 'Маленький' },
    { value: '100', label: '100 мм', desc: 'Средний' },
    { value: '200', label: '200 мм', desc: 'Большой' },
    { value: '300', label: '300 мм', desc: 'Очень большой' },
    { value: '25', label: '25 мм', desc: 'Миниатюрный' },
    { value: '400', label: '400 мм', desc: 'Гигантский' },
  ];

  // Типовые крутящие моменты (Н·м)
  const typicalTorques = [
    { value: '10', label: '10 Н·м', desc: 'Малый' },
    { value: '50', label: '50 Н·м', desc: 'Средний' },
    { value: '100', label: '100 Н·м', desc: 'Большой' },
    { value: '500', label: '500 Н·м', desc: 'Очень большой' },
    { value: '1000', label: '1000 Н·м', desc: 'Гигантский' },
    { value: '5', label: '5 Н·м', desc: 'Минимальный' },
  ];

  // Типовые длины ремней (мм)
  const typicalBeltLengths = [
    { value: '500', label: '500 мм', desc: 'Короткий' },
    { value: '1000', label: '1000 мм', desc: 'Средний' },
    { value: '1500', label: '1500 мм', desc: 'Длинный' },
    { value: '2000', label: '2000 мм', desc: 'Очень длинный' },
    { value: '3000', label: '3000 мм', desc: 'Экстра длинный' },
    { value: '250', label: '250 мм', desc: 'Мини' },
  ];

  // Типовые межосевые расстояния (мм)
  const typicalCenterDistances = [
    { value: '200', label: '200 мм', desc: 'Малое' },
    { value: '500', label: '500 мм', desc: 'Среднее' },
    { value: '1000', label: '1000 мм', desc: 'Большое' },
    { value: '1500', label: '1500 мм', desc: 'Очень большое' },
    { value: '3000', label: '3000 мм', desc: 'Гигантское' },
    { value: '100', label: '100 мм', desc: 'Минимальное' },
  ];

  // Расчет
  const calculate = () => {
    const n1 = parseFloat(driveRpm) || 0;
    const n2 = parseFloat(drivenRpm) || 0;
    const d1 = parseFloat(driveDiameter) || 0;
    const d2 = parseFloat(drivenDiameter) || 0;
    const T1 = parseFloat(driveTorque) || 0;
    const T2 = parseFloat(drivenTorque) || 0;
    const L = parseFloat(beltLength) || 0;
    const C = parseFloat(centerDistance) || 0;
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    let explanation = '';
    let comparison: Array<{label: string, value: number, unit: string}> = [];

    switch(mode) {
      case 'speed_ratio':
        if (n2 !== 0) {
          value = n1 / n2;
          unit = ' (безразмерный)';
          formula = 'i = n₁ / n₂';
          explanation = `Ведущий шкив делает ${value.toFixed(2)} оборотов за 1 оборот ведомого`;
        }
        if (value > 10) warnings.push('⚠️ Очень высокое передаточное отношение - возможны проскальзывания');
        if (value < 0.1) warnings.push('⚠️ Очень низкое передаточное отношение - неэффективно');
        comparison = [
          { label: 'Повышающая передача', value: 0.5, unit: '' },
          { label: 'Прямая передача', value: 1, unit: '' },
          { label: 'Понижающая передача', value: 2, unit: '' },
        ];
        break;
        
      case 'diameter_ratio':
        if (d2 !== 0) {
          value = d1 / d2;
          unit = ' (безразмерный)';
          formula = 'i = d₁ / d₂';
          explanation = `Диаметр ведущего шкива в ${value.toFixed(2)} раза меньше ведомого`;
        }
        comparison = [
          { label: 'Ведущий меньше в 2 раза', value: 0.5, unit: '' },
          { label: 'Шкивы равны', value: 1, unit: '' },
          { label: 'Ведущий больше в 2 раза', value: 2, unit: '' },
        ];
        break;
        
      case 'torque_ratio':
        if (T1 !== 0) {
          value = T2 / T1;
          unit = ' (безразмерный)';
          formula = 'i = T₂ / T₁';
          explanation = `Крутящий момент увеличивается в ${value.toFixed(2)} раза`;
        }
        if (value > 10) warnings.push('💡 Очень большое увеличение момента - проверьте прочность ремня');
        comparison = [
          { label: 'Понижение момента', value: 0.5, unit: '' },
          { label: 'Момент не меняется', value: 1, unit: '' },
          { label: 'Увеличение момента в 2 раза', value: 2, unit: '' },
        ];
        break;
        
      case 'belt_length':
        if (d1 > 0 && d2 > 0 && C > 0) {
          value = 2 * C + 1.57 * (d1 + d2) + Math.pow(d2 - d1, 2) / (4 * C);
          unit = ' мм';
          formula = 'L ≈ 2C + 1.57(D+d) + (D-d)²/4C';
          explanation = 'Примерная длина ремня для ременной передачи';
        }
        if (C < (d1 + d2) / 2) warnings.push('⚠️ Межосевое расстояние слишком мало - увеличьте расстояние');
        comparison = [
          { label: 'Короткий ремень', value: 500, unit: 'мм' },
          { label: 'Стандартный ремень', value: 1500, unit: 'мм' },
          { label: 'Длинный ремень', value: 3000, unit: 'мм' },
        ];
        break;
        
      case 'center_distance':
        if (d1 > 0 && d2 > 0 && L > 0) {
          const sumD = d1 + d2;
          const diffD = Math.abs(d2 - d1);
          const A = L - 1.57 * sumD;
          const B = Math.sqrt(Math.pow(A, 2) - Math.pow(diffD, 2));
          value = (A + B) / 4;
          unit = ' мм';
          formula = 'C ≈ [L - 1.57(D+d) + √((L-1.57(D+d))² - (D-d)²)] / 4';
          explanation = 'Межосевое расстояние для ременной передачи';
        }
        if (value < (d1 + d2) / 2) warnings.push('💡 Межосевое расстояние слишком мало - рекомендуется увеличить');
        comparison = [
          { label: 'Близкое расположение', value: 200, unit: 'мм' },
          { label: 'Стандартное расстояние', value: 500, unit: 'мм' },
          { label: 'Удаленное расположение', value: 1500, unit: 'мм' },
        ];
        break;
    }

    // Общие проверки
    if (n1 < 0 || n2 < 0) warnings.push('❌ Обороты не могут быть отрицательными');
    if (d1 < 0 || d2 < 0) warnings.push('❌ Диаметры не могут быть отрицательными');
    if (T1 < 0 || T2 < 0) warnings.push('❌ Моменты не могут быть отрицательными');
    if (L < 0) warnings.push('❌ Длина ремня не может быть отрицательной');
    if (C < 0) warnings.push('❌ Межосевое расстояние не может быть отрицательным');

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
  }, [mode, driveRpm, drivenRpm, driveDiameter, drivenDiameter, driveTorque, drivenTorque, beltLength, centerDistance]);

  const resetCalculator = () => {
    setDriveRpm('1500');
    setDrivenRpm('750');
    setDriveDiameter('100');
    setDrivenDiameter('200');
    setDriveTorque('50');
    setDrivenTorque('100');
    setBeltLength('1500');
    setCenterDistance('500');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalDriveRpm = (value: string) => {
    setDriveRpm(value);
  };

  const selectTypicalDrivenRpm = (value: string) => {
    setDrivenRpm(value);
  };

  const selectTypicalDriveDiameter = (value: string) => {
    setDriveDiameter(value);
  };

  const selectTypicalDrivenDiameter = (value: string) => {
    setDrivenDiameter(value);
  };

  const selectTypicalDriveTorque = (value: string) => {
    setDriveTorque(value);
  };

  const selectTypicalDrivenTorque = (value: string) => {
    setDrivenTorque(value);
  };

  const selectTypicalBeltLength = (value: string) => {
    setBeltLength(value);
  };

  const selectTypicalCenterDistance = (value: string) => {
    setCenterDistance(value);
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
        <title>Калькулятор шкивов и ременных передач онлайн | Расчёт передаточных отношений</title>
        <meta name="description" content="Бесплатный онлайн калькулятор для расчёта шкивов, ременных передач, передаточных отношений, длины ремня и межосевых расстояний. Формулы механических передач." />
        <meta name="keywords" content="калькулятор шкивов, ременные передачи, передаточное отношение, длина ремня, межосевое расстояние, расчёт передач, механические передачи" />
        <meta property="og:title" content="Калькулятор шкивов и ременных передач онлайн | Профессиональные расчёты" />
        <meta property="og:description" content="Расчёт передаточных отношений, длины ремня, диаметров шкивов и межосевых расстояний" />
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
              color: '#f59e0b'
            }}>
              ⚙️ Калькулятор шкивов и ременных передач
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт передаточных отношений, длины ремня, диаметров шкивов
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
                onClick={() => setMode('speed_ratio')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'speed_ratio' ? '#f59e0b' : '#334155',
                  color: mode === 'speed_ratio' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'speed_ratio' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Передаточное отношение по оборотам
              </button>
              
              <button
                type="button"
                onClick={() => setMode('diameter_ratio')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'diameter_ratio' ? '#f59e0b' : '#334155',
                  color: mode === 'diameter_ratio' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'diameter_ratio' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Передаточное отношение по диаметрам
              </button>
              
              <button
                type="button"
                onClick={() => setMode('torque_ratio')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'torque_ratio' ? '#f59e0b' : '#334155',
                  color: mode === 'torque_ratio' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'torque_ratio' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Отношение крутящих моментов
              </button>
              
              <button
                type="button"
                onClick={() => setMode('belt_length')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'belt_length' ? '#f59e0b' : '#334155',
                  color: mode === 'belt_length' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'belt_length' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Длина ремня
              </button>
              
              <button
                type="button"
                onClick={() => setMode('center_distance')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'center_distance' ? '#f59e0b' : '#334155',
                  color: mode === 'center_distance' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'center_distance' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Межосевое расстояние
              </button>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#1e293b', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#94a3b8',
              borderLeft: '4px solid #f59e0b'
            }}>
              {mode === 'speed_ratio' && 'Передаточное отношение i = n₁ / n₂ — отношение оборотов ведущего и ведомого шкивов'}
              {mode === 'diameter_ratio' && 'Передаточное отношение i = d₁ / d₂ — отношение диаметров ведущего и ведомого шкивов'}
              {mode === 'torque_ratio' && 'Отношение моментов i = T₂ / T₁ — показывает во сколько раз увеличивается крутящий момент'}
              {mode === 'belt_length' && 'Длина ремня L ≈ 2C + 1.57(D+d) + (D-d)²/4C — для клиноременных и плоских передач'}
              {mode === 'center_distance' && 'Межосевое расстояние C — расстояние между центрами шкивов ременной передачи'}
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Введите параметры:
            </h2>
            
            {/* Передаточное отношение по оборотам */}
            {mode === 'speed_ratio' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Обороты ведущего шкива (об/мин)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalRpms.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDriveRpm(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: driveRpm === item.value ? '#f59e0b' : '#334155',
                          color: driveRpm === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${driveRpm === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={driveRpm}
                    onChange={(e) => setDriveRpm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите обороты ведущего шкива"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Обороты ведомого шкива (об/мин)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalRpms.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDrivenRpm(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: drivenRpm === item.value ? '#f59e0b' : '#334155',
                          color: drivenRpm === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${drivenRpm === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={drivenRpm}
                    onChange={(e) => setDrivenRpm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите обороты ведомого шкива"
                  />
                </div>
              </>
            )}

            {/* Передаточное отношение по диаметрам */}
            {mode === 'diameter_ratio' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Диаметр ведущего шкива (мм)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDiameters.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDriveDiameter(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: driveDiameter === item.value ? '#f59e0b' : '#334155',
                          color: driveDiameter === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${driveDiameter === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={driveDiameter}
                    onChange={(e) => setDriveDiameter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите диаметр ведущего шкива"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Диаметр ведомого шкива (мм)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDiameters.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDrivenDiameter(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: drivenDiameter === item.value ? '#f59e0b' : '#334155',
                          color: drivenDiameter === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${drivenDiameter === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={drivenDiameter}
                    onChange={(e) => setDrivenDiameter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите диаметр ведомого шкива"
                  />
                </div>
              </>
            )}

            {/* Отношение крутящих моментов */}
            {mode === 'torque_ratio' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Крутящий момент ведущего (Н·м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalTorques.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDriveTorque(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: driveTorque === item.value ? '#f59e0b' : '#334155',
                          color: driveTorque === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${driveTorque === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={driveTorque}
                    onChange={(e) => setDriveTorque(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите момент ведущего шкива"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Крутящий момент ведомого (Н·м)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalTorques.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDrivenTorque(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: drivenTorque === item.value ? '#f59e0b' : '#334155',
                          color: drivenTorque === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${drivenTorque === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={drivenTorque}
                    onChange={(e) => setDrivenTorque(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите момент ведомого шкива"
                  />
                </div>
              </>
            )}

            {/* Длина ремня */}
            {mode === 'belt_length' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Диаметр ведущего шкива (мм)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDiameters.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDriveDiameter(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: driveDiameter === item.value ? '#f59e0b' : '#334155',
                          color: driveDiameter === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${driveDiameter === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={driveDiameter}
                    onChange={(e) => setDriveDiameter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите диаметр ведущего шкива"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Диаметр ведомого шкива (мм)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDiameters.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDrivenDiameter(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: drivenDiameter === item.value ? '#f59e0b' : '#334155',
                          color: drivenDiameter === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${drivenDiameter === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={drivenDiameter}
                    onChange={(e) => setDrivenDiameter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите диаметр ведомого шкива"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Межосевое расстояние (мм)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalCenterDistances.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalCenterDistance(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: centerDistance === item.value ? '#f59e0b' : '#334155',
                          color: centerDistance === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${centerDistance === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={centerDistance}
                    onChange={(e) => setCenterDistance(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите межосевое расстояние"
                  />
                </div>
              </>
            )}

            {/* Межосевое расстояние */}
            {mode === 'center_distance' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Диаметр ведущего шкива (мм)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDiameters.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDriveDiameter(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: driveDiameter === item.value ? '#f59e0b' : '#334155',
                          color: driveDiameter === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${driveDiameter === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={driveDiameter}
                    onChange={(e) => setDriveDiameter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите диаметр ведущего шкива"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Диаметр ведомого шкива (мм)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalDiameters.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalDrivenDiameter(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: drivenDiameter === item.value ? '#f59e0b' : '#334155',
                          color: drivenDiameter === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${drivenDiameter === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={drivenDiameter}
                    onChange={(e) => setDrivenDiameter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите диаметр ведомого шкива"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#cbd5e1' }}>Длина ремня (мм)</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {typicalBeltLengths.slice(0, 3).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectTypicalBeltLength(item.value)}
                        style={{
                          padding: '6px 4px',
                          backgroundColor: beltLength === item.value ? '#f59e0b' : '#334155',
                          color: beltLength === item.value ? '#0f172a' : 'white',
                          border: `1px solid ${beltLength === item.value ? '#f59e0b' : '#475569'}`,
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
                    value={beltLength}
                    onChange={(e) => setBeltLength(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите длину ремня"
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
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
                      {result.value.toFixed(3)}
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
                    <div style={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '8px' }}>
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
                            <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>
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
                    const text = `Результат: ${result.value.toFixed(3)}${result.unit} (${result.formula})`;
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
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚙️</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта шкивов
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
            <div style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              i = n₁/n₂ = d₁/d₂ = T₂/T₁
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основные формулы ременных передач: передаточные отношения, длина ремня
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
          <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#f59e0b' }}>
            Калькулятор шкивов и ременных передач онлайн: формулы, расчёты, примеры
          </h1>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#f59e0b' }}>
              Что такое ременные передачи и зачем нужен этот калькулятор?
            </h2>
            <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>
              <strong>Ременные передачи</strong> — это механические передачи, использующие гибкую связь (ремень) для передачи вращательного движения между шкивами. Наш онлайн калькулятор позволяет быстро выполнять основные расчёты ременных передач без сложных вычислений.
            </p>
            <p style={{ color: '#cbd5e1' }}>
              С помощью этого инструмента вы можете рассчитать передаточные отношения, подобрать диаметры шкивов, определить необходимую длину ремня и оптимальное межосевое расстояние. Калькулятор идеально подходит для инженеров, механиков, проектировщиков и всех, кто работает с механическими передачами.
            </p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#f59e0b' }}>
              Основные формулы ременных передач
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#10b981' }}>1. Передаточное отношение по оборотам</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> i = n₁ / n₂<br/>
                <strong>Где:</strong> i — передаточное отношение, n₁ — обороты ведущего шкива (об/мин), n₂ — обороты ведомого шкива (об/мин)<br/>
                <strong>Пример:</strong> Если ведущий шкив вращается со скоростью 1500 об/мин, а ведомый — 750 об/мин, передаточное отношение составит 2:1.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#10b981' }}>2. Передаточное отношение по диаметрам</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> i = d₁ / d₂<br/>
                <strong>Где:</strong> d₁ — диаметр ведущего шкива (мм), d₂ — диаметр ведомого шкива (мм)<br/>
                <strong>Пример:</strong> Если диаметр ведущего шкива 100 мм, а ведомого — 200 мм, передаточное отношение составит 0.5 (повышающая передача).
              </p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#10b981' }}>3. Длина ремня (приближенная формула)</h3>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Формула:</strong> L ≈ 2C + 1.57(D+d) + (D-d)²/4C<br/>
                <strong>Где:</strong> L — длина ремня (мм), C — межосевое расстояние (мм), D — большой диаметр (мм), d — малый диаметр (мм)<br/>
                <strong>Пример:</strong> При диаметрах 100/200 мм и расстоянии 500 мм длина ремня ≈ 1500 мм.
              </p>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#f59e0b' }}>
              Практическое применение расчётов
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Станкостроение</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Подбор шкивов для станков, регулировка скоростей резания, натяжных устройств.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Автомобилестроение</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Расчёт ремней ГРМ, приводов генераторов, насосов, клиноременных передач.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Промышленное оборудование</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Конвейеры, вентиляторы, насосы, компрессоры — везде нужны ременные передачи.
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#06b6d4' }}>Сельхозтехника</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  Приводы комбайнов, тракторов, молотилок, измельчителей.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#f59e0b' }}>
              Часто задаваемые вопросы (FAQ) по ременным передачам
            </h2>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px' }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#10b981' }}>📌 В чём разница между клиновыми и плоскими ремнями?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  <strong>Клиновые ремни</strong> имеют трапецеидальное сечение, лучше держат нагрузку, меньше проскальзывают. <strong>Плоские ремни</strong> — для малых мощностей, проще в монтаже, дешевле.
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#10b981' }}>📌 Какое оптимальное передаточное отношение для ременных передач?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Для клиноременных передач — <strong>1:1 до 1:7</strong>, для плоских — <strong>1:1 до 1:3</strong>. Большие отношения требуют больших диаметров шкивов или промежуточных шкивов.
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#10b981' }}>📌 Как правильно натянуть ремень?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Прогиб ремня должен быть <strong>10-15 мм на 1 метр межосевого расстояния</strong>. Слишком сильное натяжение изнашивает подшипники, слабое — вызывает проскальзывание.
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '17px', marginBottom: '8px', color: '#10b981' }}>📌 Как рассчитать межосевое расстояние?</h3>
                <p style={{ color: '#cbd5e1', fontSize: '15px' }}>
                  Рекомендуемое расстояние: <strong>C = (0.7 ÷ 2) × (D + d)</strong>, где D и d — диаметры шкивов. Наш калькулятор точно рассчитает это значение.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #06b6d4' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#06b6d4' }}>
              💡 Практические советы по ременным передачам
            </h2>
            <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Всегда используйте защитные кожухи на ременных передачах</li>
              <li style={{ marginBottom: '10px' }}>Минимальный угол обхвата ремнем малого шкива — 120°</li>
              <li style={{ marginBottom: '10px' }}>Для переменных нагрузок используйте натяжные ролики</li>
              <li style={{ marginBottom: '10px' }}>Совмещайте ремни и шкивы от одного производителя</li>
              <li>Регулярно проверяйте натяжение и состояние ремней (трещины, износ)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}