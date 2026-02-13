// app/teplotekhnika/teplopoteri-trub/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function TeplopoteriTrubPage() {
  // Состояния калькулятора
  const [pipeDiameter, setPipeDiameter] = useState<string>("32");
  const [pipeLength, setPipeLength] = useState<string>("10");
  const [pipeTemp, setPipeTemp] = useState<string>("70");
  const [ambientTemp, setAmbientTemp] = useState<string>("20");
  const [insulationThickness, setInsulationThickness] = useState<string>("20");
  const [insulationMaterial, setInsulationMaterial] = useState<string>("mineral_wool");
  const [pipeMaterial, setPipeMaterial] = useState<string>("steel");
  const [pipeWallThickness, setPipeWallThickness] = useState<string>("3");
  
  // Результаты
  const [pipeResult, setPipeResult] = useState<{
    lossPerMeter: number, 
    totalLoss: number, 
    recommendedInsulation: number,
    energyLossPerYear: number,
    efficiency: string,
    pipeResistance: number,
    insulationResistance: number
  } | null>(null);

  // Справочник материалов труб (коэффициент теплопроводности Вт/(м·K))
  const pipeMaterials = {
    steel: { 
      name: "Сталь", 
      lambda: 50, 
      color: "#6b7280",
      description: "Стандартные стальные трубы"
    },
    stainless_steel: { 
      name: "Нержавейка", 
      lambda: 16, 
      color: "#94a3b8",
      description: "Коррозионностойкие трубы"
    },
    copper: { 
      name: "Медь", 
      lambda: 401, 
      color: "#b45309",
      description: "Высокая теплопроводность"
    },
    aluminum: { 
      name: "Алюминий", 
      lambda: 237, 
      color: "#6b7280",
      description: "Лёгкие трубы"
    },
    ppr: { 
      name: "Полипропилен (PPR)", 
      lambda: 0.24, 
      color: "#059669",
      description: "Пластиковые трубы для отопления"
    },
    pex: { 
      name: "Сшитый полиэтилен (PEX)", 
      lambda: 0.41, 
      color: "#3b82f6",
      description: "Гибкие трубы"
    },
    pvc: { 
      name: "ПВХ", 
      lambda: 0.19, 
      color: "#8b5cf6",
      description: "Поливинилхлорид"
    },
    metal_plastic: { 
      name: "Металлопластик", 
      lambda: 0.45, 
      color: "#ec4899",
      description: "Комбинированные трубы"
    }
  };

  // Справочник материалов изоляции
  const insulationMaterials = {
    mineral_wool: { 
      name: "Минеральная вата", 
      lambda: 0.045, 
      color: "#f59e0b",
      description: "Стандартная изоляция"
    },
    polyurethane: { 
      name: "Пенополиуретан", 
      lambda: 0.03, 
      color: "#3b82f6",
      description: "Высокая эффективность"
    },
    foam_rubber: { 
      name: "Вспененный каучук", 
      lambda: 0.038, 
      color: "#10b981",
      description: "Гибкая изоляция"
    },
    eps: { 
      name: "Пенополистирол", 
      lambda: 0.037, 
      color: "#8b5cf6",
      description: "Лёгкая изоляция"
    },
    basalt: { 
      name: "Базальтовое волокно", 
      lambda: 0.042, 
      color: "#ef4444",
      description: "Огнестойкая изоляция"
    },
    aerogel: { 
      name: "Аэрогель", 
      lambda: 0.015, 
      color: "#06b6d4",
      description: "Сверхэффективная изоляция"
    },
    none: { 
      name: "Без изоляции", 
      lambda: 1.0, 
      color: "#6b7280",
      description: "Труба без изоляции"
    }
  };

  // Функция расчёта
  const calculate = useCallback(() => {
    // Парсим значения из строк
    const diameter = parseFloat(pipeDiameter) || 0; // мм
    const length = parseFloat(pipeLength) || 0; // м
    const tempPipe = parseFloat(pipeTemp) || 0;
    const tempAmbient = parseFloat(ambientTemp) || 0;
    const insulation = parseFloat(insulationThickness) || 0;
    const wallThickness = parseFloat(pipeWallThickness) || 3;

    const deltaTemp = tempPipe - tempAmbient;
    
    // Проверка валидности ввода
    if (diameter > 0 && length > 0 && deltaTemp > 0) {
      // Переводим мм в м для расчетов
      const diameterM = diameter / 1000;
      const insulationM = insulation / 1000;
      const wallThicknessM = wallThickness / 1000;
      
      // Получаем коэффициенты теплопроводности
      const kPipe = pipeMaterials[pipeMaterial as keyof typeof pipeMaterials]?.lambda || 50;
      const kInsulation = insulationMaterials[insulationMaterial as keyof typeof insulationMaterials]?.lambda || 0.045;
      
      // Рассчитываем радиусы
      const r1 = diameterM / 2; // Внутренний радиус
      const r2 = r1 + wallThicknessM; // Внешний радиус трубы
      const r3 = r2 + insulationM; // Внешний радиус изоляции
      
      // Термические сопротивления
      let totalResistance = 0;
      let pipeResistance = 0;
      let insulationResistance = 0;
      
      // 1. Сопротивление стенки трубы
      if (wallThickness > 0 && kPipe > 0) {
        pipeResistance = Math.log(r2 / r1) / (2 * Math.PI * kPipe * length);
        totalResistance += pipeResistance;
      }
      
      // 2. Сопротивление изоляции
      if (insulation > 0 && insulationMaterial !== 'none' && kInsulation > 0) {
        insulationResistance = Math.log(r3 / r2) / (2 * Math.PI * kInsulation * length);
        totalResistance += insulationResistance;
      }
      
      // 3. Сопротивление теплоотдачи поверхности
      const surfaceCoeff = 10; // Вт/(м²·K)
      const outerDiameter = diameterM + 2 * wallThicknessM + 2 * insulationM;
      const surfaceArea = Math.PI * outerDiameter * length;
      const surfaceResistance = 1 / (surfaceCoeff * surfaceArea);
      totalResistance += surfaceResistance;
      
      // Тепловой поток (Вт)
      const heatFlow = totalResistance > 0 ? deltaTemp / totalResistance : 0;
      const lossPerMeter = length > 0 ? heatFlow / length : 0;
      
      // Годовые потери (кВт·ч)
      const operatingHoursPerYear = 8760;
      const energyLossPerYear = (heatFlow * operatingHoursPerYear) / 1000;
      
      // Рекомендуемая изоляция по температуре
      let recommendedInsulation = 0;
      if (tempPipe <= 60) recommendedInsulation = 20;
      else if (tempPipe <= 80) recommendedInsulation = 30;
      else if (tempPipe <= 100) recommendedInsulation = 40;
      else if (tempPipe <= 150) recommendedInsulation = 50;
      else recommendedInsulation = 60;
      
      // Корректировка для пластиковых труб
      if (pipeMaterial.includes('ppr') || pipeMaterial.includes('pex') || pipeMaterial.includes('pvc')) {
        recommendedInsulation = Math.max(20, recommendedInsulation - 10);
      }
      
      // Оценка эффективности
      let efficiency = "Низкая";
      if (insulation >= recommendedInsulation) efficiency = "Высокая";
      else if (insulation >= recommendedInsulation * 0.5) efficiency = "Средняя";
      
      // Сохраняем результаты
      setPipeResult({
        lossPerMeter: lossPerMeter,
        totalLoss: heatFlow,
        recommendedInsulation: recommendedInsulation,
        energyLossPerYear: energyLossPerYear,
        efficiency: efficiency,
        pipeResistance: pipeResistance,
        insulationResistance: insulationResistance
      });
    } else {
      setPipeResult(null);
    }
  }, [pipeDiameter, pipeLength, pipeTemp, ambientTemp, insulationThickness, 
      insulationMaterial, pipeMaterial, pipeWallThickness]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setPipeDiameter("32");
    setPipeLength("10");
    setPipeTemp("70");
    setAmbientTemp("20");
    setInsulationThickness("20");
    setInsulationMaterial("mineral_wool");
    setPipeMaterial("steel");
    setPipeWallThickness("3");
    setPipeResult(null);
  };

  // Функция для получения рекомендаций
  const getInsulationAdvice = (recommended: number, current: number, material: string) => {
    const materialName = insulationMaterials[material as keyof typeof insulationMaterials]?.name || material;
    
    if (current === 0) return `Рекомендуется: ${recommended} мм ${materialName}`;
    if (current >= recommended) return `✅ Изоляция достаточна (${materialName})`;
    return `⚠️ Увеличить до ${recommended} мм ${materialName}`;
  };

  // Функция расчёта экономии
  const calculateSavings = (currentLoss: number, recommendedLoss: number, energyPrice: number = 5) => {
    const savingsPerYear = (currentLoss - recommendedLoss) * 8760 / 1000 * energyPrice;
    return {
      savingsPerYear: savingsPerYear > 0 ? savingsPerYear.toFixed(0) : "0",
      percentage: recommendedLoss > 0 ? ((currentLoss - recommendedLoss) / currentLoss * 100).toFixed(0) : "0"
    };
  };

  // Рассчёт разницы температур
  const deltaTemp = (parseFloat(pipeTemp) || 0) - (parseFloat(ambientTemp) || 0);

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
              color: '#6b7280'
            }}>
              📏 Калькулятор теплопотерь трубопроводов
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт потерь тепла через изоляцию труб
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
                color: '#6b7280',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#6b7280';
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Диаметр трубы (мм)
                </label>
                <input
                  type="number"
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
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Стандартные: 20, 25, 32, 40 мм
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Длина участка (м)
                </label>
                <input
                  type="number"
                  value={pipeLength}
                  onChange={(e) => setPipeLength(e.target.value)}
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

            {/* Температуры */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #334155'
            }}>
              <h4 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '16px' }}>
                🌡️ Температурные условия
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Температура в трубе (°C)
                  </label>
                  <input
                    type="number"
                    value={pipeTemp}
                    onChange={(e) => setPipeTemp(e.target.value)}
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
                    Отопление: 70-90°C, ГВС: 55-65°C
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Температура окружения (°C)
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
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Воздух в помещении или грунте
                  </p>
                </div>
              </div>
              
              {/* Разница температур */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#1e293b',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>Разница температур</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280' }}>
                  {deltaTemp} °C
                </div>
              </div>
            </div>
          </div>

          {/* Материал трубы */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              🔩 Материал трубы
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {Object.entries(pipeMaterials).map(([key, material]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPipeMaterial(key)}
                  style={{
                    padding: '12px 8px',
                    backgroundColor: pipeMaterial === key ? material.color : '#334155',
                    color: 'white',
                    border: `2px solid ${pipeMaterial === key ? material.color : '#475569'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    fontSize: '12px'
                  }}
                  title={`λ = ${material.lambda} Вт/(м·K)`}
                >
                  {material.name}
                </button>
              ))}
            </div>
            
            {/* Толщина стенки */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1' }}>Толщина стенки трубы</label>
                <span style={{ color: '#6b7280', fontWeight: 'bold' }}>{pipeWallThickness} мм</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={pipeWallThickness}
                onChange={(e) => setPipeWallThickness(e.target.value)}
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#334155',
                  borderRadius: '3px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Изоляция */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              🛡️ Теплоизоляция
            </h3>
            
            {/* Выбор материала изоляции */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Материал изоляции
              </label>
              <select
                value={insulationMaterial}
                onChange={(e) => setInsulationMaterial(e.target.value)}
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
                {Object.entries(insulationMaterials).map(([key, material]) => (
                  <option key={key} value={key} style={{ backgroundColor: '#1e293b' }}>
                    {material.name} (λ = {material.lambda.toFixed(3)} Вт/(м·K))
                  </option>
                ))}
              </select>
            </div>
            
            {/* Толщина изоляции */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1' }}>Толщина изоляции</label>
                <span style={{ color: '#6b7280', fontWeight: 'bold' }}>{insulationThickness} мм</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
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
            {pipeResult ? (
              <div style={{  }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#6b7280', marginBottom: '8px' }}>
                    {pipeResult.totalLoss.toFixed(0)} <span style={{ fontSize: '20px' }}>Вт</span>
                  </div>
                  <div style={{ color: '#94a3b8' }}>Общие теплопотери</div>
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
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                      {pipeResult.lossPerMeter.toFixed(1)} Вт/м
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>На 1 метре трубы</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                      {pipeResult.energyLossPerYear.toFixed(0)} кВт·ч
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Годовые потери</div>
                  </div>
                </div>
                
                {/* Эффективность изоляции */}
                <div style={{ 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Эффективность изоляции:</span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: pipeResult.efficiency === "Высокая" ? '#10b98120' : 
                                     pipeResult.efficiency === "Средняя" ? '#f59e0b20' : '#ef444420',
                      color: pipeResult.efficiency === "Высокая" ? '#10b981' : 
                            pipeResult.efficiency === "Средняя" ? '#f59e0b' : '#ef4444',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {pipeResult.efficiency}
                    </span>
                  </div>
                  
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    {getInsulationAdvice(
                      pipeResult.recommendedInsulation, 
                      parseInt(insulationThickness),
                      insulationMaterial
                    )}
                  </div>
                </div>
                
                {/* Экономия */}
                {parseInt(insulationThickness) < pipeResult.recommendedInsulation && insulationMaterial !== 'none' && (
                  <div style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #334155'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '20px' }}>💰</span>
                      <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Потенциальная экономия</span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                          {calculateSavings(pipeResult.totalLoss, pipeResult.totalLoss * 0.3).percentage}%
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Снижение потерь</div>
                      </div>
                      
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                          {calculateSavings(pipeResult.totalLoss, pipeResult.totalLoss * 0.3).savingsPerYear} ₽
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Экономия в год*</div>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '12px', textAlign: 'center' }}>
                      *При цене тепловой энергии 5 руб/кВт·ч
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>📐</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите диаметр, длину и температуры
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
            <div style={{ color: '#6b7280', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              Q = (2πLΔT) / [ln(r₂/r₁)/λ₁ + ln(r₃/r₂)/λ₂]
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Q — тепловой поток, L — длина, ΔT — разность температур, λ — теплопроводность
            </div>
          </div>
        </div>

        {/* SEO ТЕКСТ */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#6b7280' }}>
            Как снизить теплопотери трубопроводов?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
            Теплопотери в неизолированных трубопроводах могут достигать 20-30% от общей тепловой мощности системы. 
            Правильная изоляция позволяет значительно снизить энергопотребление и увеличить эффективность системы.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#6b7280', marginBottom: '8px' }}>Рекомендуемые толщины изоляции</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Горячее водоснабжение (55-65°C):</strong> 20-30 мм</p>
                <p>• <strong>Системы отопления (70-90°C):</strong> 30-50 мм</p>
                <p>• <strong>Паропроводы (100°C+):</strong> 50-100 мм</p>
                <p>• <strong>Холодное водоснабжение:</strong> 15-25 мм (для предотвращения конденсата)</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#6b7280', marginBottom: '8px' }}>Сравнение материалов изоляции</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                {Object.entries(insulationMaterials).map(([key, material]) => (
                  <p key={key} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>{material.name}:</strong> λ = {material.lambda.toFixed(3)}</span>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{material.description}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#6b7280' }}>Практические советы</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Изоляция всех соединений и фланцев</strong> — они часто являются мостиками холода</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Регулярная проверка состояния изоляции</strong> — повреждения снижают эффективность на 40-60%</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Для наружных трубопроводов</strong> используйте изоляцию с гидроизоляционным покрытием</li>
            <li>• <strong>Окупаемость утепления</strong> обычно составляет 1-3 отопительных сезона</li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}