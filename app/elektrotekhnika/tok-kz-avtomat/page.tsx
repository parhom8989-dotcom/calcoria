// app/elektrotekhnika/tok-kz-avtomat/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function TokKzAvtomatPage() {
  // Основные параметры
  const [voltage, setVoltage] = useState<string>('230');
  const [power, setPower] = useState<string>('5000');
  const [distance, setDistance] = useState<string>('20');
  const [cableSection, setCableSection] = useState<string>('2.5');
  const [cableMaterial, setCableMaterial] = useState<string>('copper');
  const [phaseType, setPhaseType] = useState<string>('single');
  
  // Результаты
  const [results, setResults] = useState<{
    currentRated: number;
    currentKz: number;
    recommendedBreaker: string;
    breakingCapacity: string;
    voltageDrop: number;
    warnings: string[];
  } | null>(null);

  // Типовые значения для быстрого выбора
  const typicalVoltages = [
    { value: '230', label: '230В', desc: 'Бытовая сеть' },
    { value: '400', label: '400В', desc: 'Трёхфазная' },
    { value: '110', label: '110В', desc: 'США, Япония' },
  ];

  const typicalPowers = [
    { value: '1000', label: '1 кВт', desc: 'Малая нагрузка' },
    { value: '3500', label: '3.5 кВт', desc: 'Стандартная' },
    { value: '5000', label: '5 кВт', desc: 'Средняя' },
    { value: '10000', label: '10 кВт', desc: 'Большая' },
  ];

  const cableSections = [
    { value: '1.5', label: '1.5 мм²', current: '16А', desc: 'Освещение' },
    { value: '2.5', label: '2.5 мм²', current: '25А', desc: 'Розетки' },
    { value: '4', label: '4 мм²', current: '32А', desc: 'Кухня' },
    { value: '6', label: '6 мм²', current: '40А', desc: 'Ввод' },
    { value: '10', label: '10 мм²', current: '50А', desc: 'Мощная' },
  ];

  // Удельное сопротивление материалов (Ом·мм²/м)
  const materialResistivity = {
    copper: 0.0175,   // Медь
    aluminum: 0.028,  // Алюминий
  };

  // Стандартные автоматы
  const standardBreakers = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];

  // Расчет
  const calculate = () => {
    const U = parseFloat(voltage) || 230;
    const P = parseFloat(power) || 0;
    const L = parseFloat(distance) || 0; // Длина в метрах
    const S = parseFloat(cableSection) || 0;
    const material = cableMaterial as keyof typeof materialResistivity;
    const phase = phaseType;
    
    const warnings: string[] = [];

    // 1. Расчет номинального тока
    let currentRated = 0;
    if (phase === 'single') {
      currentRated = P / U; // Однофазный: I = P / U
    } else {
      currentRated = P / (U * 1.732); // Трехфазный: I = P / (√3 × U)
    }

    // 2. Расчет сопротивления линии
    const resistivity = materialResistivity[material] || 0.0175;
    const lineResistance = (2 * L * resistivity) / S; // R = 2 × L × ρ / S

    // 3. Расчет тока КЗ
    const currentKz = U / lineResistance;

    // 4. Расчет падения напряжения
    const voltageDrop = (currentRated * lineResistance / U) * 100; // В процентах

    // 5. Подбор автомата
    let recommendedBreaker = '16A';
    for (const breaker of standardBreakers) {
      if (breaker >= currentRated * 1.25) { // Запас 25%
        recommendedBreaker = `${breaker}A`;
        break;
      }
    }

    // 6. Определение отключающей способности
    let breakingCapacity = '4.5 кА (бытовой)';
    if (currentKz > 6000) breakingCapacity = '6 кА';
    if (currentKz > 10000) breakingCapacity = '10 кА (промышленный)';
    if (currentKz > 20000) breakingCapacity = '20 кА (специальный)';

    // Проверки и предупреждения
    if (voltageDrop > 5) {
      warnings.push(`⚠️ Большое падение напряжения: ${voltageDrop.toFixed(1)}% (допустимо до 5%)`);
    }

     const selectedCable = cableSections.find(c => c.value === cableSection);
    if (selectedCable) {
      const match = selectedCable.current.match(/(\d+)/);
      const cableMaxCurrent = match ? parseInt(match[1]) : 0;
      
      if (currentRated > cableMaxCurrent) {
        warnings.push(`⚠️ Ток ${currentRated.toFixed(1)}А превышает допустимый ${cableMaxCurrent}А для кабеля ${cableSection}мм²`);
      }
    }

    if (currentKz < 1000) {
      warnings.push('⚠️ Маленький ток КЗ - автомат может не отключиться');
    }

    if (currentKz > 10000 && !breakingCapacity.includes('10 кА')) {
      warnings.push('⚠️ Требуется автомат с отключающей способностью 10 кА или более');
    }

    setResults({
      currentRated,
      currentKz,
      recommendedBreaker,
      breakingCapacity,
      voltageDrop,
      warnings,
    });
  };

  useEffect(() => {
    calculate();
  }, [voltage, power, distance, cableSection, cableMaterial, phaseType]);

  const resetCalculator = () => {
    setVoltage('230');
    setPower('5000');
    setDistance('20');
    setCableSection('2.5');
    setCableMaterial('copper');
    setPhaseType('single');
    setResults(null);
  };

  // Быстрый выбор
  const selectTypicalVoltage = (value: string) => {
    setVoltage(value);
    if (value === '400') setPhaseType('three');
    if (value === '230' || value === '110') setPhaseType('single');
  };

  const selectTypicalPower = (value: string) => {
    setPower(value);
  };

  const selectCableSection = (value: string) => {
    setCableSection(value);
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
              ⚡ Ток КЗ и выбор автомата
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт тока короткого замыкания и подбор автоматического выключателя
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
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Выбор фазы */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Тип сети
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => setPhaseType('single')}
                style={{
                  padding: '12px',
                  backgroundColor: phaseType === 'single' ? '#3b82f6' : '#334155',
                  color: 'white',
                  border: `2px solid ${phaseType === 'single' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                1-фазная
              </button>
              
              <button
                type="button"
                onClick={() => setPhaseType('three')}
                style={{
                  padding: '12px',
                  backgroundColor: phaseType === 'three' ? '#3b82f6' : '#334155',
                  color: 'white',
                  border: `2px solid ${phaseType === 'three' ? '#3b82f6' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                3-фазная
              </button>
            </div>
          </div>

          {/* Быстрый выбор напряжения */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Напряжение
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {typicalVoltages.map((volt) => (
                <button
                  key={volt.value}
                  type="button"
                  onClick={() => selectTypicalVoltage(volt.value)}
                  style={{
                    padding: '10px 6px',
                    backgroundColor: voltage === volt.value ? '#3b82f6' : '#334155',
                    color: 'white',
                    border: `2px solid ${voltage === volt.value ? '#3b82f6' : '#475569'}`,
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{volt.label}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>{volt.desc}</div>
                </button>
              ))}
            </div>
            <input
              type="number"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              style={{
                width: '95%',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="Напряжение, В"
            />
          </div>

          {/* Мощность */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Мощность нагрузки
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {typicalPowers.map((pwr) => (
                <button
                  key={pwr.value}
                  type="button"
                  onClick={() => selectTypicalPower(pwr.value)}
                  style={{
                    padding: '10px 6px',
                    backgroundColor: power === pwr.value ? '#3b82f6' : '#334155',
                    color: 'white',
                    border: `2px solid ${power === pwr.value ? '#3b82f6' : '#475569'}`,
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{pwr.label}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>{pwr.desc}</div>
                </button>
              ))}
            </div>
            <input
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              style={{
                width: '95%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="Мощность, Вт"
            />
          </div>

          {/* Параметры кабеля */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Параметры кабеля
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Длина линии (м)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                style={{
                  width: '95%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Длина кабеля"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Сечение кабеля
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {cableSections.map((cable) => (
                  <button
                    key={cable.value}
                    type="button"
                    onClick={() => selectCableSection(cable.value)}
                    style={{
                      padding: '8px 4px',
                      backgroundColor: cableSection === cable.value ? '#3b82f6' : '#334155',
                      color: 'white',
                      border: `2px solid ${cableSection === cable.value ? '#3b82f6' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{cable.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{cable.current}</div>
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.5"
                value={cableSection}
                onChange={(e) => setCableSection(e.target.value)}
                style={{
                  width: '95%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Сечение, мм²"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Материал жилы
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={() => setCableMaterial('copper')}
                  style={{
                    padding: '12px',
                    backgroundColor: cableMaterial === 'copper' ? '#f59e0b' : '#334155',
                    color: 'white',
                    border: `2px solid ${cableMaterial === 'copper' ? '#f59e0b' : '#475569'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Медь
                </button>
                
                <button
                  type="button"
                  onClick={() => setCableMaterial('aluminum')}
                  style={{
                    padding: '12px',
                    backgroundColor: cableMaterial === 'aluminum' ? '#8b5cf6' : '#334155',
                    color: 'white',
                    border: `2px solid ${cableMaterial === 'aluminum' ? '#8b5cf6' : '#475569'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Алюминий
                </button>
              </div>
            </div>
          </div>

          {/* РЕЗУЛЬТАТЫ */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #334155',
            marginBottom: '20px'
          }}>
            {results ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '20px', color: '#3b82f6', marginBottom: '16px', fontWeight: 'bold', textAlign: 'center' }}>
                    Результаты расчета
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
                        {results.currentRated.toFixed(1)} А
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Номинальный ток</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444', marginBottom: '4px' }}>
                        {results.currentKz.toFixed(0)} А
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Ток КЗ (макс.)</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                        {results.recommendedBreaker}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Автомат</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                        {results.breakingCapacity}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Отключающая способность</div>
                    </div>
                  </div>
                  
                  {/* Падение напряжения */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px'
                  }}>
                    <div style={{ color: '#cbd5e1', marginBottom: '8px', fontWeight: 'bold' }}>
                      Падение напряжения: <span style={{ color: results.voltageDrop > 5 ? '#ef4444' : '#10b981' }}>
                        {results.voltageDrop.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ 
                      height: '8px',
                      backgroundColor: '#334155',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{
                          width: `${Math.min(results.voltageDrop * 10, 100)}%`,
                          height: '100%',
                          backgroundColor: results.voltageDrop > 5 ? '#ef4444' : results.voltageDrop > 3 ? '#f59e0b' : '#10b981',
                          transition: 'width 0.3s'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', color: '#64748b', fontSize: '12px' }}>
                      <span>0%</span>
                      <span>5% (допустимо)</span>
                      <span>10%</span>
                    </div>
                  </div>
                  
                  {/* Предупреждения */}
                  {results.warnings.length > 0 && (
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
                        {results.warnings.map((warning, index) => (
                          <div key={index} style={{ marginBottom: '4px' }}>• {warning}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    const text = `Ток: ${results.currentRated.toFixed(1)}А, КЗ: ${results.currentKz.toFixed(0)}А, Автомат: ${results.recommendedBreaker}`;
                    navigator.clipboard.writeText(text);
                    alert('Результаты скопированы!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    width: '100%'
                  }}
                >
                  📋 Копировать результаты
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚡</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры сети
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите напряжение, мощность и параметры кабеля
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
            <div style={{ color: '#3b82f6', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              I<sub>кз</sub> = U / R<sub>линии</sub>
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Ток короткого замыкания зависит от сопротивления линии
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
            Теория: Ток КЗ и защита
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>📏 Как рассчитывается ток КЗ</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Формула:</strong> I<sub>кз</sub> = U / R<sub>л</sub></p>
              <p><strong>Сопротивление линии:</strong> R<sub>л</sub> = 2 × L × ρ / S</p>
              <p>где: L - длина кабеля (м), ρ - удельное сопротивление, S - сечение (мм²)</p>
              <p><strong>Медь:</strong> ρ = 0.0175 Ом·мм²/м</p>
              <p><strong>Алюминий:</strong> ρ = 0.028 Ом·мм²/м</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>🔧 Выбор автомата</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>1. <strong>Номинальный ток</strong> должен быть на 25% больше рабочего</p>
              <p>2. <strong>Отключающая способность</strong> должна быть больше тока КЗ</p>
              <p>3. <strong>Стандартные номиналы:</strong> 6А, 10А, 16А, 20А, 25А, 32А, 40А, 50А, 63А</p>
              <p>4. <strong>Характеристика срабатывания:</strong> B (3-5×Iн), C (5-10×Iн), D (10-20×Iн)</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>⚡ Типовые значения</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Розеточная группа</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Сечение: 2.5мм²<br/>
                  Автомат: 16А<br/>
                  Мощность: до 3.5кВт
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Освещение</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Сечение: 1.5мм²<br/>
                  Автомат: 10А<br/>
                  Мощность: до 2.2кВт
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Электроплита</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Сечение: 6мм²<br/>
                  Автомат: 32А<br/>
                  Мощность: до 7кВт
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Ввод в квартиру</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Сечение: 10мм²<br/>
                  Автомат: 50А<br/>
                  Мощность: до 11кВт
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>⚠️ Важные правила</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Сечение кабеля</strong> определяет максимальный ток</p>
              <p>• <strong>Ток КЗ</strong> должен быть достаточным для срабатывания автомата</p>
              <p>• <strong>Падение напряжения</strong> не должно превышать 5%</p>
              <p>• <strong>Медь vs Алюминий</strong> - медь проводит ток лучше на 60%</p>
              <p>• <strong>Длина линии</strong> критична для тока КЗ - чем длиннее, тем меньше ток</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}