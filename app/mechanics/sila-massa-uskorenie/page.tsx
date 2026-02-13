"use client";

import { useState, useEffect } from 'react';

export default function SilaMassaUskoreniePage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('force'); // 'force', 'mass', 'acceleration', 'weight', 'friction'
  
  // Основные параметры
  const [mass, setMass] = useState<string>('10');
  const [acceleration, setAcceleration] = useState<string>('9.81');
  const [frictionCoeff, setFrictionCoeff] = useState<string>('0.3');
  
  // Гравитация
  const [gravity, setGravity] = useState<string>('9.81');
  
  // Результаты
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    formula: string;
    warnings: string[];
    typicalValues: Array<{value: string, label: string, desc: string}>;
  } | null>(null);

  // Типовые массы (кг)
  const typicalMasses = [
    { value: '0.1', label: '0.1 кг', desc: 'Яблоко' },
    { value: '1', label: '1 кг', desc: 'Пакет молока' },
    { value: '10', label: '10 кг', desc: 'Ведро воды' },
    { value: '70', label: '70 кг', desc: 'Человек' },
    { value: '1000', label: '1000 кг', desc: 'Автомобиль' },
    { value: '50000', label: '50 т', desc: 'Грузовик' },
  ];

  // Типовые ускорения (м/с²)
  const typicalAccelerations = [
    { value: '1', label: '1 м/с²', desc: 'Медленное' },
    { value: '9.81', label: '9.81 м/с²', desc: 'Земная гравитация' },
    { value: '3', label: '3 м/с²', desc: 'Авто разгон' },
    { value: '10', label: '10 м/с²', desc: 'Спорткар' },
    { value: '50', label: '50 м/с²', desc: 'Ракета' },
  ];

  // Типовые коэффициенты трения
  const typicalFrictionCoeffs = [
    { value: '0.1', label: '0.1', desc: 'Лёд/металл' },
    { value: '0.3', label: '0.3', desc: 'Дерево/дерево' },
    { value: '0.5', label: '0.5', desc: 'Резина/асфальт' },
    { value: '0.8', label: '0.8', desc: 'Высокое сцепление' },
    { value: '1.0', label: '1.0', desc: 'Максимальное' },
  ];

  // Расчет
  const calculate = () => {
    const m = parseFloat(mass) || 0;
    const a = parseFloat(acceleration) || 0;
    const μ = parseFloat(frictionCoeff) || 0;
    const g = parseFloat(gravity) || 9.81;
    
    const warnings: string[] = [];
    let value = 0;
    let unit = '';
    let formula = '';
    const typicalValues = typicalMasses;

    switch(mode) {
      case 'force':
        value = m * a;
        unit = 'Н (Ньютон)';
        formula = 'F = m × a';
        if (value > 10000) warnings.push('⚠️ Очень большая сила - проверьте значения');
        if (value < 0.001) warnings.push('⚠️ Очень маленькая сила - проверьте единицы измерения');
        break;
        
      case 'mass':
        if (a !== 0) {
          value = m / a;
          unit = 'кг';
          formula = 'm = F / a';
        }
        if (value > 100000) warnings.push('⚠️ Очень большая масса - возможно ошибка в данных');
        break;
        
      case 'acceleration':
        if (m !== 0) {
          value = a / m;
          unit = 'м/с²';
          formula = 'a = F / m';
        }
        if (value > 100) warnings.push('⚠️ Очень большое ускорение - экстремальные условия');
        if (value < 0.01) warnings.push('⚠️ Очень маленькое ускорение');
        break;
        
      case 'weight':
        value = m * g;
        unit = 'Н (Вес)';
        formula = 'P = m × g';
        if (value > 100000) warnings.push('⚠️ Очень большой вес');
        break;
        
      case 'friction':
        value = μ * m * g;
        unit = 'Н (Сила трения)';
        formula = 'Fтр = μ × m × g';
        if (μ > 1) warnings.push('⚠️ Коэффициент трения обычно ≤ 1');
        if (μ < 0) warnings.push('❌ Коэффициент трения не может быть отрицательным');
        break;
    }

    // Проверка гравитации
    if (Math.abs(g - 9.81) > 2) {
      warnings.push(`💡 Нестандартная гравитация: ${g} м/с² (Земля: 9.81 м/с²)`);
    }

    setResult({
      value,
      unit,
      formula,
      warnings,
      typicalValues
    });
  };

  useEffect(() => {
    calculate();
  }, [mode, mass, acceleration, frictionCoeff, gravity]);

  const resetCalculator = () => {
    setMass('10');
    setAcceleration('9.81');
    setFrictionCoeff('0.3');
    setGravity('9.81');
    setResult(null);
  };

  // Быстрый выбор
  const selectTypicalMass = (value: string) => {
    setMass(value);
  };

  const selectTypicalAcceleration = (value: string) => {
    setAcceleration(value);
  };

  const selectTypicalFriction = (value: string) => {
    setFrictionCoeff(value);
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
              color: '#f59e0b'
            }}>
              ⚖️ Сила, масса, ускорение
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Второй закон Ньютона: F = ma
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
                color: '#38bdf8',
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
                onClick={() => setMode('force')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'force' ? '#f59e0b' : '#334155',
                  color: mode === 'force' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'force' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Силу (F)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('mass')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'mass' ? '#f59e0b' : '#334155',
                  color: mode === 'mass' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'mass' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Массу (m)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('acceleration')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'acceleration' ? '#f59e0b' : '#334155',
                  color: mode === 'acceleration' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'acceleration' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Ускорение (a)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('weight')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'weight' ? '#f59e0b' : '#334155',
                  color: mode === 'weight' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'weight' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Вес (P)
              </button>
              
              <button
                type="button"
                onClick={() => setMode('friction')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'friction' ? '#f59e0b' : '#334155',
                  color: mode === 'friction' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'friction' ? '#f59e0b' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Силу трения (Fтр)
              </button>
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Основные параметры
            </h3>
            
            {/* Масса */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1' }}>Масса (кг)</label>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {typicalMasses.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => selectTypicalMass(item.value)}
                    style={{
                      padding: '6px 4px',
                      backgroundColor: mass === item.value ? '#f59e0b' : '#334155',
                      color: mass === item.value ? '#0f172a' : 'white',
                      border: `1px solid ${mass === item.value ? '#f59e0b' : '#475569'}`,
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
                placeholder="Введите массу в кг"
              />
            </div>

            {/* Ускорение (для силы, массы, ускорения) */}
            {(mode === 'force' || mode === 'mass' || mode === 'acceleration') && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ color: '#cbd5e1' }}>Ускорение (м/с²)</label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  {typicalAccelerations.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => selectTypicalAcceleration(item.value)}
                      style={{
                        padding: '6px 4px',
                        backgroundColor: acceleration === item.value ? '#f59e0b' : '#334155',
                        color: acceleration === item.value ? '#0f172a' : 'white',
                        border: `1px solid ${acceleration === item.value ? '#f59e0b' : '#475569'}`,
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
                  value={acceleration}
                  onChange={(e) => setAcceleration(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Введите ускорение"
                />
              </div>
            )}

            {/* Коэффициент трения (для силы трения) */}
            {mode === 'friction' && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ color: '#cbd5e1' }}>Коэффициент трения (μ)</label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  {typicalFrictionCoeffs.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => selectTypicalFriction(item.value)}
                      style={{
                        padding: '6px 4px',
                        backgroundColor: frictionCoeff === item.value ? '#f59e0b' : '#334155',
                        color: frictionCoeff === item.value ? '#0f172a' : 'white',
                        border: `1px solid ${frictionCoeff === item.value ? '#f59e0b' : '#475569'}`,
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
                  value={frictionCoeff}
                  onChange={(e) => setFrictionCoeff(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Введите коэффициент трения"
                />
              </div>
            )}

            {/* Гравитация (для веса и трения) */}
            {(mode === 'weight' || mode === 'friction') && (
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
                      backgroundColor: gravity === '9.81' ? '#f59e0b' : '#334155',
                      color: gravity === '9.81' ? '#0f172a' : 'white',
                      border: `1px solid ${gravity === '9.81' ? '#f59e0b' : '#475569'}`,
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
                      backgroundColor: gravity === '1.62' ? '#f59e0b' : '#334155',
                      color: gravity === '1.62' ? '#0f172a' : 'white',
                      border: `1px solid ${gravity === '1.62' ? '#f59e0b' : '#475569'}`,
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
                      backgroundColor: gravity === '3.71' ? '#f59e0b' : '#334155',
                      color: gravity === '3.71' ? '#0f172a' : 'white',
                      border: `1px solid ${gravity === '3.71' ? '#f59e0b' : '#475569'}`,
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
                    <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                      📝 Используемая формула:
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontFamily: 'monospace' }}>
                      {result.formula}
                    </div>
                  </div>
                  
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
                  
                  {/* Типовые значения */}
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
                      <p>• Вес человека (70 кг): {(70 * 9.81).toFixed(1)} Н</p>
                      <p>• Сила удара боксёра: ~3000 Н</p>
                      <p>• Тяга реактивного двигателя: ~100,000 Н</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    const text = `${mode === 'force' ? 'Сила' : mode === 'mass' ? 'Масса' : mode === 'acceleration' ? 'Ускорение' : mode === 'weight' ? 'Вес' : 'Сила трения'}: ${result.value.toFixed(2)} ${result.unit.split(' ')[0]}`;
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
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚖️</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчета
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Выберите что найти и укажите известные значения
                </div>
              </div>
            )}
          </div>

          {/* Формула */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              F = m × a
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Второй закон Ньютона: Сила = масса × ускорение
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#f59e0b' }}>
            Теория: Сила, масса, ускорение
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>📏 Основные формулы</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Второй закон Ньютона:</strong> F = m × a</p>
              <p><strong>Вес тела:</strong> P = m × g (где g ≈ 9.81 м/с² на Земле)</p>
              <p><strong>Сила трения:</strong> Fтр = μ × N (N = m × g для горизонтальной поверхности)</p>
              <p><strong>Единицы измерения:</strong> 1 Н = 1 кг·м/с²</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>⚖️ Практические примеры</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Человек (70 кг)</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Вес: 686.7 Н<br/>
                  Сила удара: до 3000 Н
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Автомобиль (1500 кг)</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Вес: 14,715 Н<br/>
                  Тормозная сила: ~10,000 Н
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Спорт (разгоны)</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Бег: 3-4 м/с²<br/>
                  Авто: 3-8 м/с²<br/>
                  Ракета: 20-50 м/с²
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Трение</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Лёд: μ ≈ 0.1<br/>
                  Асфальт: μ ≈ 0.7<br/>
                  Макс: μ ≤ 1.0
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '8px' }}>💡 Практические советы</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Масса ≠ вес:</strong> Масса (кг) постоянна, вес (Н) зависит от гравитации</p>
              <p>• <strong>1 кг-сила:</strong> ≈ 9.81 Н (на Земле)</p>
              <p>• <strong>Перегрузки:</strong> Человек выдерживает до 5g кратковременно</p>
              <p>• <strong>Коэффициент трения:</strong> всегда ≤ 1 для обычных поверхностей</p>
              <p>• <strong>Гравитация планет:</strong> Земля 9.81, Луна 1.62, Марс 3.71 м/с²</p>
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
              <p>• <strong>Сила трения</strong> не зависит от площади контакта</p>
              <p>• <strong>Ускорение свободного падения</strong> немного меняется в зависимости от широты и высоты</p>
              <p>• <strong>При больших скоростях</strong> начинают действовать законы релятивистской механики</p>
              <p>• <strong>В неинерциальных системах</strong> появляются фиктивные силы (центробежная, Кориолиса)</p>
              <p>• <strong>Для точных расчётов</strong> учитывайте сопротивление воздуха и другие силы</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}