// app/elektrotekhnika/puskovoj-kondensator/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function PuskovojKondensatorPage() {
  // Параметры
  const [motorPower, setMotorPower] = useState<string>('1.1');
  const [voltage, setVoltage] = useState<string>('220');
  const [frequency, setFrequency] = useState<string>('50');
  const [efficiency, setEfficiency] = useState<string>('0.75');
  const [powerFactor, setPowerFactor] = useState<string>('0.85');
  
  // Выбор конденсатора
  const [capacitorType, setCapacitorType] = useState<'start' | 'run' | 'both'>('start');
  
  // Результаты
  const [result, setResult] = useState<{
    startCapacitance: number;
    runCapacitance: number;
    motorCurrent: number;
    reactivePower: number;
    recommendedStartCap: string;
    recommendedRunCap: string;
    capacitorInfo: string;
  } | null>(null);
  
  // Типы двигателей
  const motorTypes = {
    single_phase: { 
      name: "Однофазный", 
      factor: 1.2,
      desc: "Бытовые вентиляторы, насосы, компрессоры"
    },
    three_phase_triangle: { 
      name: "3-фазный (треугольник)", 
      factor: 0.8,
      desc: "Промышленные двигатели до 5кВт"
    },
    three_phase_star: { 
      name: "3-фазный (звезда)", 
      factor: 0.6,
      desc: "Мощные двигатели от 5кВт"
    },
    compressor: { 
      name: "Компрессорный", 
      factor: 1.5,
      desc: "Холодильники, кондиционеры, компрессоры"
    }
  };
  
  const [motorType, setMotorType] = useState<keyof typeof motorTypes>('single_phase');
  
  // Расчёт
  const calculate = () => {
    const P = parseFloat(motorPower); // кВт
    const U = parseFloat(voltage);
    const f = parseFloat(frequency);
    const η = parseFloat(efficiency);
    const cosφ = parseFloat(powerFactor);
    const factor = motorTypes[motorType].factor;
    
    if ([P, U, f, η, cosφ].some(isNaN) || P <= 0 || U <= 0 || f <= 0) {
      setResult(null);
      return;
    }
    
    // Ток двигателя: I = P × 1000 / (√3 × U × η × cosφ)
    const motorCurrent = (P * 1000) / (1.732 * U * η * cosφ);
    
    // Реактивная мощность: Q = P × tan(φ)
    const φ = Math.acos(cosφ);
    const reactivePower = P * Math.tan(φ);
    
    // Ёмкость пускового конденсатора: Cпуск = (4800 × I) / (U × частота)
    const startCapacitance = (4800 * motorCurrent * factor) / (U * f);
    
    // Ёмкость рабочего конденсатора: Cраб = (66 × P × 1000) / (U² × 2πf)
    const runCapacitance = (66 * P * 1000) / (U * U * 2 * Math.PI * f);
    
    // Рекомендации
    const recommendedStartCap = getRecommendedCapacitor(startCapacitance, 'start');
    const recommendedRunCap = getRecommendedCapacitor(runCapacitance, 'run');
    
    // Информация о конденсаторах
    let capacitorInfo = "";
    if (capacitorType === 'start') {
      capacitorInfo = "🔋 Пусковой конденсатор: кратковременная работа (3-5 секунд), электролитический, на напряжение ≥ 1.5×U сети";
    } else if (capacitorType === 'run') {
      capacitorInfo = "⚡ Рабочий конденсатор: постоянная работа, плёнка/бумага/металлоплёночный, на напряжение ≥ 2×U сети";
    } else {
      capacitorInfo = "🔋 Пусковой + ⚡ Рабочий: для сложных пусков, оба конденсатора работают вместе";
    }
    
    setResult({
      startCapacitance,
      runCapacitance,
      motorCurrent,
      reactivePower,
      recommendedStartCap,
      recommendedRunCap,
      capacitorInfo
    });
  };
  
  const getRecommendedCapacitor = (value: number, type: 'start' | 'run'): string => {
    // Стандартные ряды
    const startSeries = [10, 20, 30, 40, 50, 60, 70, 80, 100, 120, 150, 200, 250, 300, 350, 400, 450, 500];
    const runSeries = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 100];
    
    const series = type === 'start' ? startSeries : runSeries;
    
    const nearest = series.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    
    if (type === 'start') {
      return `${nearest} μF (электролитический, ≥ ${(parseFloat(voltage) * 1.5).toFixed(0)}В)`;
    } else {
      return `${nearest} μF (плёнка/бумага, ≥ ${(parseFloat(voltage) * 2).toFixed(0)}В)`;
    }
  };
  
  useEffect(() => { 
    calculate(); 
  }, [motorPower, voltage, frequency, efficiency, powerFactor, motorType, capacitorType]);
  
  const resetCalculator = () => {
    setMotorPower('1.1');
    setVoltage('220');
    setFrequency('50');
    setEfficiency('0.75');
    setPowerFactor('0.85');
    setMotorType('single_phase');
    setCapacitorType('start');
  };
  
  // Копирование
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Результат скопирован!');
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
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#f97316'
            }}>
              🌀 Калькулятор пускового конденсатора
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт ёмкости для однофазных и трёхфазных электродвигателей
            </p>
          </div>

          {/* Кнопки навигации */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <a 
              href="/elektrotekhnika"
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
                textAlign: 'center',
                transition: 'all 0.3s ease'
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
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Тип двигателя */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Тип двигателя
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginBottom: '12px'
            }}>
              {Object.entries(motorTypes).map(([key, motor]) => (
                <button
                  key={key}
                  onClick={() => setMotorType(key as keyof typeof motorTypes)}
                  style={{
                    padding: '12px',
                    backgroundColor: motorType === key ? '#f97316' : '#334155',
                    color: 'white',
                    border: `2px solid ${motorType === key ? '#f97316' : '#475569'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {motor.name}
                </button>
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              {motorTypes[motorType].desc}
            </p>
          </div>

          {/* Тип конденсатора */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Какой конденсатор нужен?
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setCapacitorType('start')}
                style={{
                  padding: '14px',
                  backgroundColor: capacitorType === 'start' ? '#f97316' : '#334155',
                  color: 'white',
                  border: `2px solid ${capacitorType === 'start' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                🔋 Только пусковой
              </button>
              
              <button
                onClick={() => setCapacitorType('run')}
                style={{
                  padding: '14px',
                  backgroundColor: capacitorType === 'run' ? '#f97316' : '#334155',
                  color: 'white',
                  border: `2px solid ${capacitorType === 'run' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                ⚡ Только рабочий
              </button>
              
              <button
                onClick={() => setCapacitorType('both')}
                style={{
                  padding: '14px',
                  backgroundColor: capacitorType === 'both' ? '#f97316' : '#334155',
                  color: 'white',
                  border: `2px solid ${capacitorType === 'both' ? '#f97316' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                🔋+⚡ Оба вместе
              </button>
            </div>
          </div>

          {/* Параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Параметры двигателя
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Мощность (кВт)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={motorPower}
                  onChange={(e) => setMotorPower(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  0.25 - 5.5 кВт для бытовых
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Напряжение сети (В)
                </label>
                <input
                  type="number"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  220В (однофазные), 380В (трёхфазные)
                </p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Частота (Гц)
                </label>
                <input
                  type="number"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  50 Гц (Россия), 60 Гц (США)
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  КПД двигателя
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="1"
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
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Обычно 0.7-0.9
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  cos φ (коэф. мощности)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="1"
                  value={powerFactor}
                  onChange={(e) => setPowerFactor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Обычно 0.7-0.95
                </p>
              </div>
            </div>
          </div>

          {/* РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #334155',
            marginBottom: '20px'
          }}>
            {result ? (
              <div style={{  }}>
                {/* Основной результат */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f97316', marginBottom: '8px' }}>
                    {capacitorType === 'start' ? result.recommendedStartCap :
                     capacitorType === 'run' ? result.recommendedRunCap :
                     `${result.recommendedStartCap.split(' (')[0]} + ${result.recommendedRunCap.split(' (')[0]}`}
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    {capacitorType === 'start' ? 'Пусковой конденсатор' :
                     capacitorType === 'run' ? 'Рабочий конденсатор' :
                     'Пусковой + рабочий конденсаторы'}
                  </div>
                </div>
                
                {/* Дополнительная информация */}
                <div style={{ 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <div style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '12px' }}>
                    {result.capacitorInfo}
                  </div>
                  
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    <div><strong>Ток двигателя:</strong> {result.motorCurrent.toFixed(1)} А</div>
                    <div><strong>Реактивная мощность:</strong> {result.reactivePower.toFixed(2)} кВАр</div>
                    {capacitorType === 'both' && (
                      <>
                        <div><strong>Пусковой:</strong> {result.startCapacitance.toFixed(0)} μF (расчётное)</div>
                        <div><strong>Рабочий:</strong> {result.runCapacitance.toFixed(1)} μF (расчётное)</div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Кнопка копирования */}
                <button 
                  onClick={() => {
                    const text = capacitorType === 'start' ? result.recommendedStartCap :
                                capacitorType === 'run' ? result.recommendedRunCap :
                                `Пусковой: ${result.recommendedStartCap}, Рабочий: ${result.recommendedRunCap}`;
                    copyToClipboard(text);
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
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                >
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🌀</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры двигателя
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите мощность, напряжение и другие параметры
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
            <div style={{ color: '#f97316', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              C<sub>пуск</sub> ≈ 4800 × I ÷ (U × f)
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Упрощённая формула для однофазных двигателей
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
            Разница между пусковым и рабочим конденсатором
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#f97316', marginBottom: '12px' }}>🔋 Пусковой конденсатор</h3>
              <ul style={{ color: '#cbd5e1', fontSize: '14px', paddingLeft: '20px' }}>
                <li><strong>Назначение:</strong> Только для запуска двигателя</li>
                <li><strong>Время работы:</strong> 3-5 секунд, затем отключается</li>
                <li><strong>Тип:</strong> Электролитический, полярный</li>
                <li><strong>Напряжение:</strong> ≥ 1.5×U сети (например, 400В для 220В сети)</li>
                <li><strong>Ёмкость:</strong> Большая (десятки-сотни μF)</li>
                <li><strong>Когда использовать:</strong> Для тяжёлых пусков, компрессоров</li>
              </ul>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#f97316', marginBottom: '12px' }}>⚡ Рабочий конденсатор</h3>
              <ul style={{ color: '#cbd5e1', fontSize: '14px', paddingLeft: '20px' }}>
                <li><strong>Назначение:</strong> Постоянно в цепи при работе</li>
                <li><strong>Время работы:</strong> Постоянно, 24/7</li>
                <li><strong>Тип:</strong> Плёнка, бумага, металлоплёночный</li>
                <li><strong>Напряжение:</strong> ≥ 2×U сети (например, 450В для 220В сети)</li>
                <li><strong>Ёмкость:</strong> Меньшая (единицы-десятки μF)</li>
                <li><strong>Когда использовать:</strong> Вентиляторы, насосы, лёгкие пуски</li>
              </ul>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#f97316' }}>Типовые значения для бытовых двигателей</h3>
          <div style={{ 
            backgroundColor: '#0f172a', 
            padding: '16px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div>
                <div style={{ color: '#f97316', fontWeight: 'bold' }}>0.5 кВт</div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>50-80 μF</div>
              </div>
              <div>
                <div style={{ color: '#f97316', fontWeight: 'bold' }}>1.1 кВт</div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>100-150 μF</div>
              </div>
              <div>
                <div style={{ color: '#f97316', fontWeight: 'bold' }}>1.5 кВт</div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>150-200 μF</div>
              </div>
              <div>
                <div style={{ color: '#f97316', fontWeight: 'bold' }}>2.2 кВт</div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>200-300 μF</div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #f97316'
          }}>
            <h4 style={{ color: '#f97316', marginBottom: '8px' }}>⚠️ Важные предупреждения</h4>
            <ul style={{ color: '#cbd5e1', fontSize: '14px', paddingLeft: '20px' }}>
              <li><strong>Не превышайте расчётную ёмкость</strong> — может сгореть обмотка</li>
              <li><strong>Проверяйте напряжение</strong> конденсатора — должно быть выше сетевого</li>
              <li><strong>Для электролитических</strong> соблюдайте полярность (если указана)</li>
              <li><strong>После отключения</strong> разряжайте конденсатор — опасное напряжение!</li>
              <li><strong>При сомнениях</strong> проконсультируйтесь с электриком</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}