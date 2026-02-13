// app/teplotekhnika/moschnost-radiatorov/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function MoschnostRadistorovPage() {
  // Состояния калькулятора
  const [roomArea, setRoomArea] = useState<string>("15");
  const [roomHeight, setRoomHeight] = useState<string>("2.7");
  const [roomType, setRoomType] = useState<string>("corner");
  const [windowCount, setWindowCount] = useState<string>("1");
  const [outdoorTemp, setOutdoorTemp] = useState<string>("-25");
  const [desiredTemp, setDesiredTemp] = useState<string>("22");
  const [radiatorType, setRadiatorType] = useState<string>("bimetal");
  const [sectionCount, setSectionCount] = useState<string>("10");
  const [sectionPower, setSectionPower] = useState<string>("170");
  const [waterTemp, setWaterTemp] = useState<string>("70");
  
  // Результаты
  const [radiatorResult, setRadiatorResult] = useState<{
    heatLoss: number,          // Теплопотери помещения, Вт
    requiredPower: number,     // Требуемая мощность, Вт
    radiatorPower: number,     // Мощность радиатора, Вт
    requiredSections: number,  // Необходимое количество секций
    efficiency: string,        // Эффективность
    temperatureDelta: number,  // Дельта температур
    coverage: number,          // Покрытие потребности, %
    heatOutput: number         // Теплоотдача радиатора, Вт
  } | null>(null);

  // Типы помещений (коэффициент)
  const roomTypes = {
    corner: { 
      name: "Угловая комната", 
      factor: 1.2, 
      color: "#ef4444",
      description: "Две наружные стены"
    },
    middle: { 
      name: "Средняя комната", 
      factor: 1.0, 
      color: "#10b981",
      description: "Одна наружная стена"
    },
    end: { 
      name: "Торцевая", 
      factor: 1.1, 
      color: "#f59e0b",
      description: "С окном на торце"
    },
    attic: { 
      name: "Мансарда", 
      factor: 1.3, 
      color: "#8b5cf6",
      description: "Под крышей"
    },
    basement: { 
      name: "Подвал/цоколь", 
      factor: 1.4, 
      color: "#6b7280",
      description: "Ниже уровня земли"
    },
    balcony: { 
      name: "С балконом", 
      factor: 1.25, 
      color: "#06b6d4",
      description: "Примыкающий балкон"
    },
    large_window: { 
      name: "С панорамным окном", 
      factor: 1.3, 
      color: "#ec4899",
      description: "Большая площадь остекления"
    },
    insulated: { 
      name: "Утеплённая", 
      factor: 0.8, 
      color: "#3b82f6",
      description: "Дополнительное утепление"
    }
  };

  // Типы радиаторов
  const radiatorTypes = {
    cast_iron: { 
      name: "Чугунный", 
      factor: 0.9, 
      color: "#6b7280",
      lifespan: "50+ лет",
      inertia: "Высокая"
    },
    aluminum: { 
      name: "Алюминиевый", 
      factor: 1.1, 
      color: "#d4d4d8",
      lifespan: "20-25 лет",
      inertia: "Низкая"
    },
    bimetal: { 
      name: "Биметаллический", 
      factor: 1.0, 
      color: "#3b82f6",
      lifespan: "25-30 лет",
      inertia: "Средняя"
    },
    steel_panel: { 
      name: "Стальной панельный", 
      factor: 0.95, 
      color: "#475569",
      lifespan: "15-20 лет",
      inertia: "Средняя"
    },
    steel_tubular: { 
      name: "Стальной трубчатый", 
      factor: 0.92, 
      color: "#64748b",
      lifespan: "15-20 лет",
      inertia: "Средняя"
    }
  };

  // Функция расчёта
  const calculate = useCallback(() => {
    // Парсим значения из строк
    const area = parseFloat(roomArea) || 0; // м²
    const height = parseFloat(roomHeight) || 0; // м
    const windows = parseFloat(windowCount) || 0;
    const tempOutdoor = parseFloat(outdoorTemp) || 0;
    const tempDesired = parseFloat(desiredTemp) || 0;
    const sections = parseFloat(sectionCount) || 0;
    const powerPerSection = parseFloat(sectionPower) || 0;
    const tempWater = parseFloat(waterTemp) || 0;

    const deltaTemp = tempDesired - tempOutdoor;
    
    // Проверка валидности ввода
    if (area > 0 && height > 0 && deltaTemp > 0) {
      // Базовые теплопотери (формула упрощённая)
      // Q = V × ΔT × K, где V — объём, ΔT — разница температур, K — коэффициент
      const volume = area * height;
      
      // Базовый коэффициент теплопотерь (Вт/м³·°C)
      const baseCoefficient = 0.5; // Упрощённо
      
      // Корректировка по типу помещения
      const roomFactor = roomTypes[roomType as keyof typeof roomTypes]?.factor || 1.0;
      
      // Корректировка по окнам
      const windowFactor = 1 + (windows * 0.1);
      
      // Расчёт теплопотерь
      const heatLoss = volume * deltaTemp * baseCoefficient * roomFactor * windowFactor;
      
      // Требуемая мощность с запасом 15%
      const requiredPower = heatLoss * 1.15;
      
      // Расчёт мощности радиатора с учётом температуры теплоносителя
      // Номинальная мощность указывается для ΔT = 70°C (90°C/20°C)
      const nominalDelta = 70;
      const actualDelta = tempWater - tempDesired;
      
      // Коррекция мощности по температуре (приближённо)
      const temperatureFactor = Math.pow(actualDelta / nominalDelta, 1.3);
      
      // Мощность одной секции с коррекцией
      const correctedSectionPower = powerPerSection * temperatureFactor;
      
      // Мощность всего радиатора
      const radiatorPower = correctedSectionPower * sections;
      
      // Необходимое количество секций
      const requiredSections = Math.ceil(requiredPower / correctedSectionPower);
      
      // Покрытие потребности
      const coverage = (radiatorPower / requiredPower) * 100;
      
      // Эффективность
      let efficiency = "Оптимальная";
      if (coverage < 80) efficiency = "Недостаточная";
      else if (coverage < 90) efficiency = "Минимальная";
      else if (coverage > 120) efficiency = "Избыточная";
      
      // Теплоотдача радиатора (с учётом типа)
      const typeFactor = radiatorTypes[radiatorType as keyof typeof radiatorTypes]?.factor || 1.0;
      const heatOutput = radiatorPower * typeFactor;
      
      // Сохраняем результаты
      setRadiatorResult({
        heatLoss: heatLoss,
        requiredPower: requiredPower,
        radiatorPower: radiatorPower,
        requiredSections: requiredSections,
        efficiency: efficiency,
        temperatureDelta: actualDelta,
        coverage: coverage,
        heatOutput: heatOutput
      });
    } else {
      setRadiatorResult(null);
    }
  }, [roomArea, roomHeight, roomType, windowCount, outdoorTemp, 
      desiredTemp, radiatorType, sectionCount, sectionPower, waterTemp]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setRoomArea("15");
    setRoomHeight("2.7");
    setRoomType("corner");
    setWindowCount("1");
    setOutdoorTemp("-25");
    setDesiredTemp("22");
    setRadiatorType("bimetal");
    setSectionCount("10");
    setSectionPower("170");
    setWaterTemp("70");
    setRadiatorResult(null);
  };

  // Функция для получения рекомендаций
  const getRadiatorAdvice = (coverage: number, required: number, actual: number) => {
    if (coverage < 80) return `❌ Недостаточно! Добавьте ${required - actual} секций`;
    if (coverage < 90) return `⚠️ Минимально достаточно. Рекомендуется +1 секция`;
    if (coverage >= 90 && coverage <= 110) return `✅ Оптимальное количество секций`;
    if (coverage <= 120) return `📏 Немного избыточно, но допустимо`;
    return `⚡ Слишком много! Уменьшите на ${actual - required} секций`;
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
              color: '#3b82f6'
            }}>
              🔥 Калькулятор мощности радиаторов отопления
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт необходимого количества секций и мощности
            </p>
          </div>

          {/* Кнопки */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <a 
              href="/"
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
              ← На главную
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
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Параметры помещения */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              🏠 Параметры помещения
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Площадь комнаты (м²)
                </label>
                <input
                  type="number"
                  value={roomArea}
                  onChange={(e) => setRoomArea(e.target.value)}
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
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Высота потолков (м)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(e.target.value)}
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
              </div>
            </div>

            {/* Количество окон */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1' }}>Количество окон</label>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{windowCount}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={windowCount}
                onChange={(e) => setWindowCount(e.target.value)}
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#334155',
                  borderRadius: '3px',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                <span>0</span>
                <span>2-3 (стандарт)</span>
                <span>5+</span>
              </div>
            </div>

            {/* Тип помещения */}
            <div>
              <h4 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '16px' }}>
                Тип помещения
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {Object.entries(roomTypes).map(([key, room]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRoomType(key)}
                    style={{
                      padding: '12px 8px',
                      backgroundColor: roomType === key ? room.color : '#334155',
                      color: 'white',
                      border: `2px solid ${roomType === key ? room.color : '#475569'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      fontSize: '12px'
                    }}
                    title={room.description}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Температурные условия */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              🌡️ Температурные условия
            </h3>
            
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #334155'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    На улице (°C)
                  </label>
                  <input
                    type="number"
                    value={outdoorTemp}
                    onChange={(e) => setOutdoorTemp(e.target.value)}
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
                    Средняя зимняя температура
                  </p>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    В комнате (°C)
                  </label>
                  <input
                    type="number"
                    value={desiredTemp}
                    onChange={(e) => setDesiredTemp(e.target.value)}
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
                    Желаемая температура
                  </p>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Температура теплоносителя (°C)
                </label>
                <input
                  type="number"
                  value={waterTemp}
                  onChange={(e) => setWaterTemp(e.target.value)}
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
                  Стандартно: 70-90°C для систем отопления
                </p>
              </div>
            </div>
          </div>

          {/* Радиатор */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              🔩 Параметры радиатора
            </h3>
            
            {/* Тип радиатора */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '16px' }}>
                Тип радиатора
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {Object.entries(radiatorTypes).map(([key, radiator]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRadiatorType(key)}
                    style={{
                      padding: '12px 8px',
                      backgroundColor: radiatorType === key ? radiator.color : '#334155',
                      color: 'white',
                      border: `2px solid ${radiatorType === key ? radiator.color : '#475569'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      fontSize: '12px'
                    }}
                    title={`Срок службы: ${radiator.lifespan}, Инерция: ${radiator.inertia}`}
                  >
                    {radiator.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Характеристики секций */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #334155'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Количество секций
                  </label>
                  <input
                    type="number"
                    value={sectionCount}
                    onChange={(e) => setSectionCount(e.target.value)}
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
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Мощность секции (Вт)
                  </label>
                  <input
                    type="number"
                    value={sectionPower}
                    onChange={(e) => setSectionPower(e.target.value)}
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
                    Обычно: 150-200 Вт
                  </p>
                </div>
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
            {radiatorResult ? (
              <div style={{  }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                    {radiatorResult.requiredSections} <span style={{ fontSize: '20px' }}>секций</span>
                  </div>
                  <div style={{ color: '#94a3b8' }}>Рекомендуемое количество</div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                      {radiatorResult.requiredPower.toFixed(0)} Вт
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Требуемая мощность</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                      {radiatorResult.radiatorPower.toFixed(0)} Вт
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Мощность радиатора</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px' }}>
                      {radiatorResult.coverage.toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Покрытие потребности</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ec4899', marginBottom: '4px' }}>
                      ΔT {radiatorResult.temperatureDelta.toFixed(0)}°C
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Дельта температур</div>
                  </div>
                </div>
                
                {/* Эффективность */}
                <div style={{ 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Эффективность:</span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: radiatorResult.efficiency === "Оптимальная" ? '#10b98120' : 
                                     radiatorResult.efficiency === "Минимальная" ? '#f59e0b20' : 
                                     radiatorResult.efficiency === "Недостаточная" ? '#ef444420' : '#3b82f620',
                      color: radiatorResult.efficiency === "Оптимальная" ? '#10b981' : 
                            radiatorResult.efficiency === "Минимальная" ? '#f59e0b' : 
                            radiatorResult.efficiency === "Недостаточная" ? '#ef4444' : '#3b82f6',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {radiatorResult.efficiency}
                    </span>
                  </div>
                  
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    {getRadiatorAdvice(
                      radiatorResult.coverage,
                      radiatorResult.requiredSections,
                      parseFloat(sectionCount)
                    )}
                  </div>
                </div>
                
                {/* Теплопотери */}
                <div style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid #334155'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '20px' }}>📊</span>
                    <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Расчёт теплопотерь</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>
                    Объём помещения: {(parseFloat(roomArea) * parseFloat(roomHeight)).toFixed(1)} м³
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Теплопотери помещения: {radiatorResult.heatLoss.toFixed(0)} Вт
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🔥</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите площадь помещения и температурные условия
                </div>
              </div>
            )}
          </div>

          {/* ФОРМУЛА */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#3b82f6', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              N = (Q × K₁ × K₂) / (P × (ΔT/70)^1.3)
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              N — количество секций, Q — теплопотери, K — коэффициенты, P — мощность секции, ΔT — разница температур
            </div>
          </div>
        </div>

        {/* SEO ТЕКСТ */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#3b82f6' }}>
            Как правильно подобрать радиаторы отопления?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
            Правильный расчёт мощности радиаторов — залог комфортной температуры в помещении и экономии энергии.
            Недостаточная мощность приведёт к холоду, избыточная — к перегреву и переплате.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>Сравнение типов радиаторов</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                {Object.entries(radiatorTypes).map(([key, radiator]) => (
                  <div key={key} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong>{radiator.name}</strong>
                      <span style={{ color: '#64748b' }}>Коэф. {radiator.factor}</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      Срок службы: {radiator.lifespan} • Инерция: {radiator.inertia}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>Стандартные мощности секций</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Чугунные:</strong> 100-160 Вт на секцию (межосевое 500 мм)</p>
                <p>• <strong>Алюминиевые:</strong> 150-200 Вт на секцию</p>
                <p>• <strong>Биметаллические:</strong> 150-180 Вт на секцию</p>
                <p>• <strong>Стальные панельные:</strong> 500-5000 Вт на весь радиатор</p>
                <p>• <strong>Стальные трубчатые:</strong> 80-150 Вт на секцию</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#3b82f6' }}>Практические советы по установке</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Расположение под окном</strong> — создаёт тепловую завесу от холодного воздуха</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Отступ от стены:</strong> 3-5 см для циркуляции воздуха</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Высота от пола:</strong> 10-15 см</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Расстояние до подоконника:</strong> 10-15 см</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Обязательные краны Маевского</strong> для удаления воздуха</li>
            <li>• <strong>Терморегуляторы</strong> позволяют экономить до 20% энергии</li>
          </ul>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '8px' }}>💡 Профессиональный совет</h4>
            <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
              Всегда добавляйте 10-15% запаса мощности на аномально холодные дни и потери в трубах.
              Для помещений с большими окнами или угловых комнат увеличьте мощность на 20%.
              Учитывайте, что мощность секций указывается для ΔT=70°C (90°C/20°C).
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}