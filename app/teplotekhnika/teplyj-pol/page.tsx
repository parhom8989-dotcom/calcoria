// app/teplotekhnika/teplyj-pol/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function TeplyjPolPage() {
  // Состояния калькулятора
  const [roomArea, setRoomArea] = useState<string>("20");
  const [roomType, setRoomType] = useState<string>("living");
  const [floorType, setFloorType] = useState<string>("laminate");
  const [pipeDiameter, setPipeDiameter] = useState<string>("16");
  const [pipeSpacing, setPipeSpacing] = useState<string>("150");
  const [inletTemp, setInletTemp] = useState<string>("40");
  const [returnTemp, setReturnTemp] = useState<string>("35");
  const [ambientTemp, setAmbientTemp] = useState<string>("20");
  const [insulationThickness, setInsulationThickness] = useState<string>("50");
  
  // Результаты
  const [floorResult, setFloorResult] = useState<{
    totalPower: number,        // Общая мощность, Вт
    powerPerM2: number,        // Удельная мощность, Вт/м²
    waterFlow: number,         // Расход воды, л/ч
    pipeLength: number,        // Длина трубы, м
    heatLoss: number,          // Теплопотери вниз, Вт
    efficiency: string,        // Эффективность
    floorSurfaceTemp: number,  // Температура поверхности пола, °C
    cooling: number            // Охлаждение теплоносителя, °C
  } | null>(null);

  // Типы помещений (Вт/м²)
  const roomTypes = {
    bathroom: { 
      name: "Ванная комната", 
      power: 120, 
      color: "#3b82f6",
      description: "Высокая потребность в тепле"
    },
    balcony: { 
      name: "Балкон/лоджия", 
      power: 150, 
      color: "#06b6d4",
      description: "Помещение с холодными стенами"
    },
    kitchen: { 
      name: "Кухня", 
      power: 80, 
      color: "#10b981",
      description: "Средняя потребность в тепле"
    },
    living: { 
      name: "Жилая комната", 
      power: 100, 
      color: "#f59e0b",
      description: "Стандартная жилая зона"
    },
    bedroom: { 
      name: "Спальня", 
      power: 90, 
      color: "#8b5cf6",
      description: "Комфортная температура"
    },
    hallway: { 
      name: "Коридор/прихожая", 
      power: 70, 
      color: "#6b7280",
      description: "Вспомогательное помещение"
    },
    office: { 
      name: "Офис", 
      power: 95, 
      color: "#ec4899",
      description: "Рабочее помещение"
    },
    garage: { 
      name: "Гараж/подсобка", 
      power: 130, 
      color: "#ef4444",
      description: "Неотапливаемое помещение"
    }
  };

  // Типы напольных покрытий (термическое сопротивление, м²·K/Вт)
  const floorTypes = {
    laminate: { 
      name: "Ламинат", 
      resistance: 0.1, 
      color: "#d97706",
      description: "Популярное покрытие"
    },
    parquet: { 
      name: "Паркет/доска", 
      resistance: 0.15, 
      color: "#b45309",
      description: "Деревянное покрытие"
    },
    tile: { 
      name: "Керамическая плитка", 
      resistance: 0.02, 
      color: "#6b7280",
      description: "Хорошая теплопроводность"
    },
    linoleum: { 
      name: "Линолеум", 
      resistance: 0.12, 
      color: "#059669",
      description: "Синтетическое покрытие"
    },
    carpet: { 
      name: "Ковролин", 
      resistance: 0.25, 
      color: "#7c3aed",
      description: "Тёплое покрытие"
    },
    pvc: { 
      name: "ПВХ покрытие", 
      resistance: 0.08, 
      color: "#3b82f6",
      description: "Влагостойкое покрытие"
    },
    cork: { 
      name: "Пробковое покрытие", 
      resistance: 0.2, 
      color: "#a16207",
      description: "Натуральное, тёплое"
    },
    none: { 
      name: "Без покрытия", 
      resistance: 0.01, 
      color: "#6b7280",
      description: "Бетонная стяжка"
    }
  };

  // Функция расчёта
  const calculate = useCallback(() => {
    // Парсим значения из строк
    const area = parseFloat(roomArea) || 0; // м²
    const spacing = parseFloat(pipeSpacing) || 0; // мм
    const diameter = parseFloat(pipeDiameter) || 0; // мм
    const tempInlet = parseFloat(inletTemp) || 0;
    const tempReturn = parseFloat(returnTemp) || 0;
    const tempAmbient = parseFloat(ambientTemp) || 0;
    const insulation = parseFloat(insulationThickness) || 0;

    const avgWaterTemp = (tempInlet + tempReturn) / 2;
    const deltaTemp = avgWaterTemp - tempAmbient;
    
    // Проверка валидности ввода
    if (area > 0 && spacing > 0 && deltaTemp > 0) {
      // Получаем базовую мощность для типа помещения (Вт/м²)
      const basePower = roomTypes[roomType as keyof typeof roomTypes]?.power || 100;
      
      // Корректировка по типу покрытия
      const floorResistance = floorTypes[floorType as keyof typeof floorTypes]?.resistance || 0.1;
      const floorFactor = 1 - (floorResistance * 2); // Чем больше сопротивление, тем меньше теплопередача
      
      // Корректировка по утеплению пола
      const insulationFactor = 1 - (insulation / 200); // Чем толще утеплитель, тем меньше потерь вниз
      
      // Расчёт удельной мощности (Вт/м²)
      const powerPerM2 = basePower * Math.max(0.5, floorFactor) * Math.max(0.7, insulationFactor);
      
      // Общая мощность (Вт)
      const totalPower = powerPerM2 * area;
      
      // Длина трубы (м)
      const pipeLength = (area * 1000) / spacing; // м
      
      // Расход воды (л/ч)
      // Q = m × c × ΔT, где Q - мощность (Вт), c = 1.163 Вт·ч/(кг·K), ΔT = разница температур воды
      const tempDiff = tempInlet - tempReturn;
      const waterFlow = tempDiff > 0 ? totalPower / (1.163 * tempDiff) : 0;
      
      // Теплопотери вниз (через утеплитель)
      // Предполагаем, что утеплитель снижает потери на 70-95%
      const heatLossDown = totalPower * (0.3 - (insulation / 200));
      
      // Температура поверхности пола
      const floorSurfaceTemp = tempAmbient + (avgWaterTemp - tempAmbient) * (1 - floorResistance * 3);
      
      // Охлаждение теплоносителя
      const cooling = tempInlet - tempReturn;
      
      // Оценка эффективности
      let efficiency = "Высокая";
      if (spacing > 200) efficiency = "Низкая";
      else if (spacing > 150) efficiency = "Средняя";
      if (tempDiff < 5) efficiency = "Низкая";
      
      // Сохраняем результаты
      setFloorResult({
        totalPower: totalPower,
        powerPerM2: powerPerM2,
        waterFlow: waterFlow,
        pipeLength: pipeLength,
        heatLoss: Math.max(0, heatLossDown),
        efficiency: efficiency,
        floorSurfaceTemp: Math.min(floorSurfaceTemp, 29), // Не выше 29°C для комфорта
        cooling: cooling
      });
    } else {
      setFloorResult(null);
    }
  }, [roomArea, roomType, floorType, pipeDiameter, pipeSpacing, 
      inletTemp, returnTemp, ambientTemp, insulationThickness]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setRoomArea("20");
    setRoomType("living");
    setFloorType("laminate");
    setPipeDiameter("16");
    setPipeSpacing("150");
    setInletTemp("40");
    setReturnTemp("35");
    setAmbientTemp("20");
    setInsulationThickness("50");
    setFloorResult(null);
  };

  // Функция для получения рекомендаций
  const getSpacingAdvice = (spacing: number, roomType: string) => {
    if (spacing <= 100) return `✅ Плотная укладка для ${roomTypes[roomType as keyof typeof roomTypes]?.name}`;
    if (spacing <= 150) return `📏 Стандартный шаг для равномерного прогрева`;
    if (spacing <= 200) return `⚠️ Увеличить плотность для лучшего прогрева`;
    return `❌ Слишком редкий шаг, увеличьте плотность`;
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
              color: '#f59e0b'
            }}>
              🌡️ Калькулятор мощности тёплого пола
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт водяного тёплого пола
            </p>
          </div>

          {/* ДВЕ КНОПКИ РЯДОМ */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {/* Кнопка "На главную" */}
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
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#38bdf8';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#38bdf8';
              }}
            >
              ← На главную
            </a>
            
            {/* Кнопка "Сбросить" */}
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
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#f59e0b';
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              📊 Основные параметры
            </h3>
            
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
                    Площадь помещения (м²)
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
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Общая отапливаемая площадь
                  </p>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Диаметр трубы (мм)
                  </label>
                  <select
                    value={pipeDiameter}
                    onChange={(e) => setPipeDiameter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  >
                    <option value="16">16 мм (стандартная)</option>
                    <option value="17">17 мм (PEX)</option>
                    <option value="20">20 мм (усиленная)</option>
                    <option value="25">25 мм (высокий расход)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Шаг укладки */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #334155'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Шаг укладки трубы</label>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{pipeSpacing} мм</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={pipeSpacing}
                onChange={(e) => setPipeSpacing(e.target.value)}
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#334155',
                  borderRadius: '3px',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                <span>50 мм (плотно)</span>
                <span>150 мм (стандарт)</span>
                <span>300 мм (редко)</span>
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '12px' }}>
                {getSpacingAdvice(parseFloat(pipeSpacing), roomType)}
              </div>
            </div>
          </div>

          {/* Тип помещения */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              🏠 Тип помещения
            </h3>
            
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
                  title={`${room.power} Вт/м² - ${room.description}`}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Напольное покрытие */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              🪵 Напольное покрытие
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {Object.entries(floorTypes).map(([key, floor]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFloorType(key)}
                  style={{
                    padding: '12px 8px',
                    backgroundColor: floorType === key ? floor.color : '#334155',
                    color: 'white',
                    border: `2px solid ${floorType === key ? floor.color : '#475569'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    fontSize: '12px'
                  }}
                  title={`R = ${floor.resistance} м²·K/Вт`}
                >
                  {floor.name}
                </button>
              ))}
            </div>
          </div>

          {/* Температуры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              🌡️ Температурные параметры
            </h3>
            
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #334155'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Подача (°C)
                  </label>
                  <input
                    type="number"
                    value={inletTemp}
                    onChange={(e) => setInletTemp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid "#475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Рекомендуется 35-45°C
                  </p>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Обратка (°C)
                  </label>
                  <input
                    type="number"
                    value={returnTemp}
                    onChange={(e) => setReturnTemp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid "#475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    На 5-10°C ниже подачи
                  </p>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    В помещении (°C)
                  </label>
                  <input
                    type="number"
                    value={ambientTemp}
                    onChange={(e) => setAmbientTemp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid "#475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Желаемая температура
                  </p>
                </div>
              </div>
              
              {/* Средняя температура и разница */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#1e293b',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Средняя температура</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {((parseFloat(inletTemp) + parseFloat(returnTemp)) / 2).toFixed(1)} °C
                  </div>
                </div>
                
                <div style={{
                  padding: '12px',
                  backgroundColor: '#1e293b',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Охлаждение</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {(parseFloat(inletTemp) - parseFloat(returnTemp)).toFixed(1)} °C
                  </div>
                </div>
              </div>
            </div>

            {/* Утепление пола */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Толщина утеплителя под полом</label>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{insulationThickness} мм</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={insulationThickness}
                onChange={(e) => setInsulationThickness(e.target.value)}
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#334155',
                  borderRadius: '3px',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                <span>0 мм</span>
                <span>50 мм</span>
                <span>100 мм</span>
                <span>200 мм</span>
              </div>
            </div>
          </div>

          {/* РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid "#334155',
            marginBottom: '20px'
          }}>
            {floorResult ? (
              <div style={{  }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
                    {floorResult.totalPower.toFixed(0)} <span style={{ fontSize: '20px' }}>Вт</span>
                  </div>
                  <div style={{ color: '#94a3b8' }}>Общая тепловая мощность</div>
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
                      {floorResult.powerPerM2.toFixed(0)} Вт/м²
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Удельная мощность</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
                      {floorResult.waterFlow.toFixed(1)} л/ч
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Расход теплоносителя</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px' }}>
                      {floorResult.pipeLength.toFixed(0)} м
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Длина трубы</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ec4899', marginBottom: '4px' }}>
                      {floorResult.floorSurfaceTemp.toFixed(1)} °C
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Темп. поверхности</div>
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
                    <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Эффективность системы:</span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: floorResult.efficiency === "Высокая" ? '#10b98120' : 
                                     floorResult.efficiency === "Средняя" ? '#f59e0b20' : '#ef444420',
                      color: floorResult.efficiency === "Высокая" ? '#10b981' : 
                            floorResult.efficiency === "Средняя" ? '#f59e0b' : '#ef4444',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {floorResult.efficiency}
                    </span>
                  </div>
                  
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    {floorResult.heatLoss > 0 && (
                      <div>Теплопотери вниз: {floorResult.heatLoss.toFixed(0)} Вт ({((floorResult.heatLoss / floorResult.totalPower) * 100).toFixed(1)}%)</div>
                    )}
                  </div>
                </div>
                
                {/* Рекомендации */}
                {floorResult.floorSurfaceTemp > 29 && (
                  <div style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid "#334155',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '20px' }}>⚠️</span>
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Внимание: высокая температура пола</span>
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                      Температура поверхности {floorResult.floorSurfaceTemp.toFixed(1)}°C превышает комфортные 29°C.
                      Рекомендуется уменьшить температуру подачи или увеличить шаг укладки.
                    </div>
                  </div>
                )}
                
                {floorResult.cooling < 5 && (
                  <div style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid "#334155'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '20px' }}>📊</span>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>Оптимизация расхода</span>
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                      Охлаждение теплоносителя всего {floorResult.cooling.toFixed(1)}°C.
                      Рекомендуется увеличить расход или уменьшить температуру подачи.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🌡️</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите площадь помещения и температурные параметры
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
            <div style={{ color: '#f59e0b', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              Q = S × q × η
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Q — мощность (Вт), S — площадь (м²), q — удельная мощность (Вт/м²), η — КПД системы
            </div>
          </div>
        </div>

        {/* SEO ТЕКСТ */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#f59e0b' }}>
            Как правильно рассчитать тёплый пол?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
            Водяной тёплый пол — эффективная система отопления, обеспечивающая равномерный прогрев помещения.
            Правильный расчёт мощности позволяет достичь комфортной температуры при минимальных энергозатратах.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>Рекомендуемые параметры</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Температура подачи:</strong> 35-45°C (не более 55°C)</p>
                <p>• <strong>Шаг укладки:</strong> 100-150 мм (для помещений с окнами — 100 мм)</p>
                <p>• <strong>Температура поверхности:</strong> 24-29°C (в ванной до 33°C)</p>
                <p>• <strong>Охлаждение теплоносителя:</strong> 5-10°C (оптимально 7°C)</p>
                <p>• <strong>Длина контура:</strong> не более 100 м для трубы 16 мм</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>Влияние напольного покрытия</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                {Object.entries(floorTypes).map(([key, floor]) => (
                  <p key={key} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>{floor.name}:</strong> R = {floor.resistance}</span>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{floor.description}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#f59e0b' }}>Практические советы</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Обязательная теплоизоляция</strong> — минимум 50 мм экструдированного пенополистирола под стяжкой</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Разделение на контуры</strong> — каждый контур не более 100 м²</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Гидравлическая балансировка</strong> — необходим расчёт и настройка расходомеров</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Температурные ограничения</strong> — для ламината не более 27°C, для плитки до 29°C</li>
            <li>• <strong>Смесительный узел</strong> — обязателен для регулирования температуры подачи</li>
          </ul>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '8px' }}>💡 Профессиональный совет</h4>
            <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
              Для помещений с большими окнами или наружными стенами уменьшайте шаг укладки до 100 мм
              и увеличьте мощность на 15-20%. Всегда делайте расчётную схему укладки с указанием длин контуров.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}