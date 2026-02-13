// app/teplotekhnika/teplovaya-moshchnost/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function TeplovayaMoshchnostPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"power" | "mass" | "temp_diff" | "heat_cap">("power");
  const [mass, setMass] = useState<string>("");
  const [tempDiff, setTempDiff] = useState<string>("");
  const [heatCap, setHeatCap] = useState<string>("4.19");
  const [power, setPower] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  // Функция расчёта
  const calculate = useCallback(() => {
    const m = parseFloat(mass) || 0;
    const ΔT = parseFloat(tempDiff) || 0;
    const c = parseFloat(heatCap) || 4.19;
    const Q = parseFloat(power) || 0;
    
    let calculatedResult = 0;
    
    switch(calcType) {
      case "power": // Q = m·c·ΔT
        calculatedResult = m * c * ΔT;
        break;
      case "mass": // m = Q/(c·ΔT)
        if (c > 0 && ΔT > 0) {
          calculatedResult = Q / (c * ΔT);
        }
        break;
      case "temp_diff": // ΔT = Q/(m·c)
        if (m > 0 && c > 0) {
          calculatedResult = Q / (m * c);
        }
        break;
      case "heat_cap": // c = Q/(m·ΔT)
        if (m > 0 && ΔT > 0) {
          calculatedResult = Q / (m * ΔT);
        }
        break;
    }
    
    setResult(isNaN(calculatedResult) ? null : calculatedResult);
  }, [calcType, mass, tempDiff, heatCap, power]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setMass("");
    setTempDiff("");
    setHeatCap("4.19");
    setPower("");
    setResult(null);
    setCalcType("power");
  };

  // Получение единиц измерения
  const getUnit = () => {
    switch(calcType) {
      case "power": return "кВт";
      case "mass": return "кг/с";
      case "temp_diff": return "°C";
      case "heat_cap": return "кДж/(кг·K)";
      default: return "";
    }
  };

  // Получение формулы
  const getFormula = () => {
    switch(calcType) {
      case "power": return "Q = m × c × ΔT";
      case "mass": return "m = Q / (c × ΔT)";
      case "temp_diff": return "ΔT = Q / (m × c)";
      case "heat_cap": return "c = Q / (m × ΔT)";
      default: return "Q = m × c × ΔT";
    }
  };

  // Получение описания формулы
  const getFormulaDescription = () => {
    switch(calcType) {
      case "power": return "Q — тепловая мощность, m — массовый расход, c — удельная теплоёмкость, ΔT — разность температур";
      case "mass": return "m — массовый расход, Q — тепловая мощность, c — удельная теплоёмкость, ΔT — разность температур";
      case "temp_diff": return "ΔT — разность температур, Q — тепловая мощность, m — массовый расход, c — удельная теплоёмкость";
      case "heat_cap": return "c — удельная теплоёмкость, Q — тепловая мощность, m — массовый расход, ΔT — разность температур";
      default: return "Основная формула тепловой мощности";
    }
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
              🔥 Калькулятор тепловой мощности
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт по формуле Q = m × c × ΔT
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
                color: '#f97316',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#f97316';
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
              onClick={() => setCalcType("power")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                backgroundColor: calcType === "power" ? '#f97316' : 'transparent',
                color: calcType === "power" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "power" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти мощность Q
            </button>
            <button
              onClick={() => setCalcType("mass")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                backgroundColor: calcType === "mass" ? '#f97316' : 'transparent',
                color: calcType === "mass" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "mass" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти расход m
            </button>
            <button
              onClick={() => setCalcType("temp_diff")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                backgroundColor: calcType === "temp_diff" ? '#f97316' : 'transparent',
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
              onClick={() => setCalcType("heat_cap")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                backgroundColor: calcType === "heat_cap" ? '#f97316' : 'transparent',
                color: calcType === "heat_cap" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "heat_cap" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти теплоёмкость c
            </button>
          </div>

          {/* Поля ввода (меняются в зависимости от режима) */}
          <div style={{ marginBottom: '24px' }}>
            {calcType === "power" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Массовый расход m (кг/с)
                  </label>
                  <input
                    type="number"
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
                    placeholder="Например: 0.5"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Удельная теплоёмкость c (кДж/(кг·K))
                  </label>
                  <input
                    type="number"
                    value={heatCap}
                    onChange={(e) => setHeatCap(e.target.value)}
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
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Вода: 4.19, Воздух: 1.005, Сталь: 0.46
                  </p>
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
                    placeholder="Например: 25"
                  />
                </div>
              </>
            )}

            {calcType === "mass" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Тепловая мощность Q (кВт)
                  </label>
                  <input
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
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
                    Удельная теплоёмкость c (кДж/(кг·K))
                  </label>
                  <input
                    type="number"
                    value={heatCap}
                    onChange={(e) => setHeatCap(e.target.value)}
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
                    placeholder="Например: 25"
                  />
                </div>
              </>
            )}

            {calcType === "temp_diff" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Тепловая мощность Q (кВт)
                  </label>
                  <input
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
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
                    Массовый расход m (кг/с)
                  </label>
                  <input
                    type="number"
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
                    placeholder="Например: 0.5"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Удельная теплоёмкость c (кДж/(кг·K))
                  </label>
                  <input
                    type="number"
                    value={heatCap}
                    onChange={(e) => setHeatCap(e.target.value)}
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

            {calcType === "heat_cap" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Тепловая мощность Q (кВт)
                  </label>
                  <input
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
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
                    Массовый расход m (кг/с)
                  </label>
                  <input
                    type="number"
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
                    placeholder="Например: 25"
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
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f97316', marginBottom: '8px' }}>
              {result !== null ? `${result.toFixed(2)} ${getUnit()}` : "—"}
            </div>
            <div style={{ color: '#94a3b8', marginBottom: '16px' }}>
              {calcType === "power" && "Тепловая мощность"}
              {calcType === "mass" && "Массовый расход"}
              {calcType === "temp_diff" && "Разность температур"}
              {calcType === "heat_cap" && "Удельная теплоёмкость"}
            </div>
            
            {result !== null && (
              <div style={{ paddingTop: '16px', borderTop: '1px solid #334155' }}>
                <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  {calcType === "power" && `≈ ${Math.round(result)} кВт`}
                  {calcType === "mass" && `≈ ${result.toFixed(3)} кг/с`}
                  {calcType === "temp_diff" && `≈ ${Math.round(result)} °C`}
                  {calcType === "heat_cap" && `≈ ${result.toFixed(2)} кДж/(кг·K)`}
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
            <div style={{ color: '#f97316', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
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
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#f97316' }}>
            Как работает расчёт тепловой мощности?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
            Калькулятор тепловой мощности использует основную формулу теплотехники <strong>Q = m × c × ΔT</strong>, 
            которая позволяет рассчитать любой из четырёх параметров при известных остальных трёх.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#f97316', marginBottom: '8px' }}>Основная формула</h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '12px' }}>
                Q = m × c × ΔT
              </p>
              <div style={{ backgroundColor: '#334155', padding: '12px', borderRadius: '6px' }}>
                <code style={{ color: '#f97316', fontSize: '14px' }}>
                  Q — тепловая мощность (кВт)<br/>
                  m — массовый расход (кг/с)<br/>
                  c — удельная теплоёмкость (кДж/(кг·K))<br/>
                  ΔT — разность температур (°C)
                </code>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#f97316', marginBottom: '8px' }}>Типовые значения теплоёмкости</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Вода:</strong> 4.19 кДж/(кг·K)</p>
                <p>• <strong>Воздух:</strong> 1.005 кДж/(кг·K)</p>
                <p>• <strong>Сталь:</strong> 0.46 кДж/(кг·K)</p>
                <p>• <strong>Медь:</strong> 0.39 кДж/(кг·K)</p>
                <p>• <strong>Алюминий:</strong> 0.90 кДж/(кг·K)</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#f97316' }}>Практическое применение</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Расчёт мощности нагревателя</strong> для заданного расхода теплоносителя</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Определение расхода теплоносителя</strong> при известной мощности системы</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Расчёт перепада температур</strong> в теплообменных аппаратах</li>
            <li>• <strong>Определение теплоёмкости</strong> различных материалов</li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}