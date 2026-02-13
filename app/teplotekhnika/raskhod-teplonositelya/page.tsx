// app/teplotekhnika/raskhod-teplonositelya/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function RaskhodTeplonositelyaPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"flow_rate" | "heat_load" | "temp_diff" | "specific_heat">("flow_rate");
  const [heatLoad, setHeatLoad] = useState<string>("");
  const [tempDiff, setTempDiff] = useState<string>("");
  const [flowRate, setFlowRate] = useState<string>("");
  const [specificHeat, setSpecificHeat] = useState<string>("4.19");
  const [result, setResult] = useState<number | null>(null);

  // Функция расчёта
  const calculate = useCallback(() => {
    const Q = parseFloat(heatLoad) || 0;
    const ΔT = parseFloat(tempDiff) || 0;
    const G = parseFloat(flowRate) || 0;
    const c = parseFloat(specificHeat) || 4.19;
    
    let calculatedResult = 0;
    
    switch(calcType) {
      case "flow_rate": // G = Q / (c × ΔT)
        if (c > 0 && ΔT > 0) {
          calculatedResult = Q / (c * ΔT);
        }
        break;
        
      case "heat_load": // Q = G × c × ΔT
        calculatedResult = G * c * ΔT;
        break;
        
      case "temp_diff": // ΔT = Q / (G × c)
        if (G > 0 && c > 0) {
          calculatedResult = Q / (G * c);
        }
        break;
        
      case "specific_heat": // c = Q / (G × ΔT)
        if (G > 0 && ΔT > 0) {
          calculatedResult = Q / (G * ΔT);
        }
        break;
    }
    
    setResult(isNaN(calculatedResult) ? null : calculatedResult);
  }, [calcType, heatLoad, tempDiff, flowRate, specificHeat]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setHeatLoad("");
    setTempDiff("");
    setFlowRate("");
    setSpecificHeat("4.19");
    setResult(null);
    setCalcType("flow_rate");
  };

  // Получение единиц измерения
  const getUnit = () => {
    switch(calcType) {
      case "flow_rate": return "кг/с";
      case "heat_load": return "кВт";
      case "temp_diff": return "°C";
      case "specific_heat": return "кДж/(кг·K)";
      default: return "";
    }
  };

  // Получение формулы
  const getFormula = () => {
    switch(calcType) {
      case "flow_rate": return "G = Q / (c × ΔT)";
      case "heat_load": return "Q = G × c × ΔT";
      case "temp_diff": return "ΔT = Q / (G × c)";
      case "specific_heat": return "c = Q / (G × ΔT)";
      default: return "Q = G × c × ΔT";
    }
  };

  // Получение описания формулы
  const getFormulaDescription = () => {
    switch(calcType) {
      case "flow_rate": return "G — расход теплоносителя, Q — тепловая нагрузка, c — удельная теплоёмкость, ΔT — разность температур";
      case "heat_load": return "Q — тепловая нагрузка, G — расход теплоносителя, c — удельная теплоёмкость, ΔT — разность температур";
      case "temp_diff": return "ΔT — разность температур, Q — тепловая нагрузка, G — расход теплоносителя, c — удельная теплоёмкость";
      case "specific_heat": return "c — удельная теплоёмкость, Q — тепловая нагрузка, G — расход теплоносителя, ΔT — разность температур";
      default: return "Основная формула расчёта расхода теплоносителя";
    }
  };

  // Теплоёмкости разных теплоносителей
  const heatCapacities = [
    { name: "Вода", value: "4.19", description: "Стандартный теплоноситель" },
    { name: "Этиленгликоль 30%", value: "3.85", description: "Антифриз для систем отопления" },
    { name: "Пропиленгликоль 30%", value: "3.78", description: "Безопасный антифриз" },
    { name: "Термальное масло", value: "1.67", description: "Высокотемпературные системы" },
    { name: "Воздух", value: "1.005", description: "Воздушное отопление" }
  ];

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
              color: '#8b5cf6'
            }}>
              💧 Калькулятор расхода теплоносителя
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт по формуле Q = G × c × ΔT
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
                color: '#8b5cf6',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#8b5cf6';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#8b5cf6';
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Переключатель режимов */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '24px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '8px'
          }}>
            <button
              onClick={() => setCalcType("flow_rate")}
              style={{
                flex: '1',
                minWidth: '130px',
                padding: '12px',
                backgroundColor: calcType === "flow_rate" ? '#8b5cf6' : 'transparent',
                color: calcType === "flow_rate" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "flow_rate" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти расход G
            </button>
            <button
              onClick={() => setCalcType("heat_load")}
              style={{
                flex: '1',
                minWidth: '130px',
                padding: '12px',
                backgroundColor: calcType === "heat_load" ? '#8b5cf6' : 'transparent',
                color: calcType === "heat_load" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "heat_load" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти нагрузку Q
            </button>
            <button
              onClick={() => setCalcType("temp_diff")}
              style={{
                flex: '1',
                minWidth: '130px',
                padding: '12px',
                backgroundColor: calcType === "temp_diff" ? '#8b5cf6' : 'transparent',
                color: calcType === "temp_diff" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "temp_diff" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти ΔT
            </button>
            <button
              onClick={() => setCalcType("specific_heat")}
              style={{
                flex: '1',
                minWidth: '130px',
                padding: '12px',
                backgroundColor: calcType === "specific_heat" ? '#8b5cf6' : 'transparent',
                color: calcType === "specific_heat" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "specific_heat" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти теплоёмкость c
            </button>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            {calcType === "flow_rate" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Тепловая нагрузка Q (кВт)
                  </label>
                  <input
                    type="number"
                    value={heatLoad}
                    onChange={(e) => setHeatLoad(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 50"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Разность температур ΔT (°C)
                  </label>
                  <input
                    type="number"
                    value={tempDiff}
                    onChange={(e) => setTempDiff(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 20"
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Стандартный перепад в системах отопления: 20°C
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Удельная теплоёмкость c (кДж/(кг·K))
                  </label>
                  <select
                    value={specificHeat}
                    onChange={(e) => setSpecificHeat(e.target.value)}
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
                    {heatCapacities.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}: {item.value} кДж/(кг·K) - {item.description}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {calcType === "heat_load" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Расход теплоносителя G (кг/с)
                  </label>
                  <input
                    type="number"
                    value={flowRate}
                    onChange={(e) => setFlowRate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 0.5"
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    1 кг/с ≈ 3.6 м³/ч (для воды)
                  </p>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Разность температур ΔT (°C)
                  </label>
                  <input
                    type="number"
                    value={tempDiff}
                    onChange={(e) => setTempDiff(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 20"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Удельная теплоёмкость c (кДж/(кг·K))
                  </label>
                  <input
                    type="number"
                    value={specificHeat}
                    onChange={(e) => setSpecificHeat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Для воды: 4.19"
                  />
                </div>
              </>
            )}

            {calcType === "temp_diff" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Тепловая нагрузка Q (кВт)
                  </label>
                  <input
                    type="number"
                    value={heatLoad}
                    onChange={(e) => setHeatLoad(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 50"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Расход теплоносителя G (кг/с)
                  </label>
                  <input
                    type="number"
                    value={flowRate}
                    onChange={(e) => setFlowRate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 0.5"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Удельная теплоёмкость c (кДж/(кг·K))
                  </label>
                  <input
                    type="number"
                    value={specificHeat}
                    onChange={(e) => setSpecificHeat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Для воды: 4.19"
                  />
                </div>
              </>
            )}

            {calcType === "specific_heat" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Тепловая нагрузка Q (кВт)
                  </label>
                  <input
                    type="number"
                    value={heatLoad}
                    onChange={(e) => setHeatLoad(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 50"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Расход теплоносителя G (кг/с)
                  </label>
                  <input
                    type="number"
                    value={flowRate}
                    onChange={(e) => setFlowRate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 0.5"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Разность температур ΔT (°C)
                  </label>
                  <input
                    type="number"
                    value={tempDiff}
                    onChange={(e) => setTempDiff(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 20"
                  />
                </div>
              </>
            )}
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
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
              {result !== null ? `${result.toFixed(3)} ${getUnit()}` : "—"}
            </div>
            <div style={{ color: '#94a3b8', marginBottom: '16px' }}>
              {calcType === "flow_rate" && "Расход теплоносителя"}
              {calcType === "heat_load" && "Тепловая нагрузка"}
              {calcType === "temp_diff" && "Разность температур"}
              {calcType === "specific_heat" && "Удельная теплоёмкость"}
            </div>
            
            {result !== null && calcType === "flow_rate" && (
              <div style={{ paddingTop: '16px', borderTop: '1px solid #334155' }}>
                <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  ≈ {(result * 3600).toFixed(1)} кг/ч ({(result * 3.6).toFixed(2)} м³/ч для воды)
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
            <div style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              {getFormula()}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              {getFormulaDescription()}
            </div>
          </div>
        </div>

        {/* SEO ТЕКСТ */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#8b5cf6' }}>
            Как работает расчёт расхода теплоносителя?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
            Расход теплоносителя — ключевой параметр при проектировании систем отопления и ГВС. 
            Правильный расчёт обеспечивает эффективную работу системы и предотвращает перегрузку оборудования.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#8b5cf6', marginBottom: '8px' }}>Основная формула</h3>
              <div style={{ backgroundColor: '#334155', padding: '12px', borderRadius: '6px' }}>
                <code style={{ color: '#8b5cf6', fontSize: '14px' }}>
                  Q = G × c × ΔT<br/>
                  где:<br/>
                  Q — тепловая нагрузка (кВт)<br/>
                  G — расход теплоносителя (кг/с)<br/>
                  c — удельная теплоёмкость (кДж/(кг·K))<br/>
                  ΔT — разность температур (°C)
                </code>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#8b5cf6', marginBottom: '8px' }}>Типовые расходы для систем отопления</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Коттедж 150 м²:</strong> 0.3-0.5 кг/с (≈ 1-1.8 м³/ч)</p>
                <p>• <strong>Квартира 80 м²:</strong> 0.15-0.25 кг/с (≈ 0.5-0.9 м³/ч)</p>
                <p>• <strong>Офисное здание 500 м²:</strong> 1.0-1.5 кг/с (≈ 3.6-5.4 м³/ч)</p>
                <p>• <strong>Промышленный объект:</strong> 2.0-5.0 кг/с (≈ 7.2-18 м³/ч)</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#8b5cf6' }}>Практические рекомендации</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Скорость воды в трубах</strong> должна быть 0.5-1.5 м/с для минимизации шума</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Расчётный перепад температур</strong> в системах отопления обычно 20°C</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Для антифризов</strong> расход увеличивается на 10-15% из-за меньшей теплоёмкости</li>
            <li>• <strong>Минимальный расход</strong> через котёл указывается производителем</li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}