// app/teplotekhnika/teplopoteri-pomeshcheniya/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function TeplopoteriPomeshcheniyaPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"heat_loss" | "volume" | "coefficient" | "temp_diff">("heat_loss");
  const [roomArea, setRoomArea] = useState<string>("");
  const [roomHeight, setRoomHeight] = useState<string>("");
  const [tempInside, setTempInside] = useState<string>("20");
  const [tempOutside, setTempOutside] = useState<string>("-10");
  const [heatLossCoeff, setHeatLossCoeff] = useState<string>("0.8");
  const [result, setResult] = useState<number | null>(null);

  // Функция расчёта
  const calculate = useCallback(() => {
    const area = parseFloat(roomArea) || 0;
    const height = parseFloat(roomHeight) || 0;
    const Tin = parseFloat(tempInside) || 0;
    const Tout = parseFloat(tempOutside) || 0;
    const k = parseFloat(heatLossCoeff) || 0;
    
    let calculatedResult = 0;
    
    switch(calcType) {
      case "heat_loss": // Q = V × k × ΔT
        if (area > 0 && height > 0 && k > 0) {
          const volume = area * height;
          const ΔT = Tin - Tout;
          calculatedResult = volume * k * ΔT;
        }
        break;
        
      case "volume": // V = Q / (k × ΔT)
        if (k > 0) {
          const ΔT = Tin - Tout;
          const Q = parseFloat(roomArea) || 0;
          if (ΔT > 0) {
            calculatedResult = Q / (k * ΔT);
          }
        }
        break;
        
      case "coefficient": // k = Q / (V × ΔT)
        if (area > 0 && height > 0) {
          const volume = area * height;
          const ΔT = Tin - Tout;
          const Q = parseFloat(heatLossCoeff) || 0;
          if (volume > 0 && ΔT > 0) {
            calculatedResult = Q / (volume * ΔT);
          }
        }
        break;
        
      case "temp_diff": // ΔT = Q / (V × k)
        if (area > 0 && height > 0 && k > 0) {
          const volume = area * height;
          const Q = parseFloat(tempInside) || 0;
          if (volume > 0) {
            calculatedResult = Q / (volume * k);
          }
        }
        break;
    }
    
    setResult(isNaN(calculatedResult) ? null : calculatedResult);
  }, [calcType, roomArea, roomHeight, tempInside, tempOutside, heatLossCoeff]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setRoomArea("");
    setRoomHeight("");
    setTempInside("20");
    setTempOutside("-10");
    setHeatLossCoeff("0.8");
    setResult(null);
    setCalcType("heat_loss");
  };

  // Получение единиц измерения
  const getUnit = () => {
    switch(calcType) {
      case "heat_loss": return "Вт";
      case "volume": return "м³";
      case "coefficient": return "Вт/м³·K";
      case "temp_diff": return "°C";
      default: return "";
    }
  };

  // Получение формулы
  const getFormula = () => {
    switch(calcType) {
      case "heat_loss": return "Q = V × k × ΔT";
      case "volume": return "V = Q / (k × ΔT)";
      case "coefficient": return "k = Q / (V × ΔT)";
      case "temp_diff": return "ΔT = Q / (V × k)";
      default: return "Q = V × k × ΔT";
    }
  };

  // Получение описания формулы
  const getFormulaDescription = () => {
    switch(calcType) {
      case "heat_loss": return "Q — теплопотери, V — объём помещения, k — коэффициент теплопотерь, ΔT — разность температур";
      case "volume": return "V — объём помещения, Q — теплопотери, k — коэффициент теплопотерь, ΔT — разность температур";
      case "coefficient": return "k — коэффициент теплопотерь, Q — теплопотери, V — объём помещения, ΔT — разность температур";
      case "temp_diff": return "ΔT — разность температур, Q — теплопотери, V — объём помещения, k — коэффициент теплопотерь";
      default: return "Формула расчёта теплопотерь помещения";
    }
  };

  // Типы зданий и коэффициенты
  const buildingTypes = [
    { name: "Новое здание с утеплением", coeff: "0.6", description: "Энергоэффективное здание" },
    { name: "Среднее утепление", coeff: "0.8", description: "Современные стандарты" },
    { name: "Старое здание", coeff: "1.2", description: "Требует утепления" },
    { name: "Промышленное помещение", coeff: "1.5", description: "Большие теплопотери" },
    { name: "Панельный дом", coeff: "1.0", description: "Типовая застройка" }
  ];

  // Рассчёт разности температур
  const deltaTemp = (parseFloat(tempInside) || 0) - (parseFloat(tempOutside) || 0);

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
              color: '#ec4899'
            }}>
              🏠 Калькулятор теплопотерь помещения
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт по формуле Q = V × k × ΔT
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
                color: '#ec4899',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#ec4899';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#ec4899';
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
              onClick={() => setCalcType("heat_loss")}
              style={{
                flex: '1',
                minWidth: '140px',
                padding: '12px',
                backgroundColor: calcType === "heat_loss" ? '#ec4899' : 'transparent',
                color: calcType === "heat_loss" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "heat_loss" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти теплопотери Q
            </button>
            <button
              onClick={() => setCalcType("volume")}
              style={{
                flex: '1',
                minWidth: '140px',
                padding: '12px',
                backgroundColor: calcType === "volume" ? '#ec4899' : 'transparent',
                color: calcType === "volume" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "volume" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти объём V
            </button>
            <button
              onClick={() => setCalcType("coefficient")}
              style={{
                flex: '1',
                minWidth: '140px',
                padding: '12px',
                backgroundColor: calcType === "coefficient" ? '#ec4899' : 'transparent',
                color: calcType === "coefficient" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "coefficient" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти коэффициент k
            </button>
            <button
              onClick={() => setCalcType("temp_diff")}
              style={{
                flex: '1',
                minWidth: '140px',
                padding: '12px',
                backgroundColor: calcType === "temp_diff" ? '#ec4899' : 'transparent',
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
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            {calcType === "heat_loss" && (
              <>
                <div style={{ marginBottom: '16px' }}>
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
                    placeholder="Например: 50"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Высота потолков (м)
                  </label>
                  <input
                    type="number"
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
                    placeholder="Например: 2.7"
                  />
                </div>
                
                {/* Температурный блок */}
                <div style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  border: '1px solid #334155'
                }}>
                  <h4 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '16px' }}>
                    🌡️ Температурные условия
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                        Внутри помещения
                      </label>
                      <input
                        type="number"
                        value={tempInside}
                        onChange={(e) => setTempInside(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Желаемая температура</p>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                        Снаружи (улица)
                      </label>
                      <input
                        type="number"
                        value={tempOutside}
                        onChange={(e) => setTempOutside(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          backgroundColor: '#334155',
                          border: '1px solid #475569',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      />
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Минимальная температура</p>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '12px',
                    padding: '10px',
                    backgroundColor: '#1e293b',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Расчётная разница температур</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ec4899' }}>{deltaTemp} °C</div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Коэффициент теплопотерь k (Вт/м³·K)
                  </label>
                  <select
                    value={heatLossCoeff}
                    onChange={(e) => setHeatLossCoeff(e.target.value)}
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
                    {buildingTypes.map((type) => (
                      <option key={type.name} value={type.coeff}>
                        {type.name}: k = {type.coeff} - {type.description}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Меньше коэффициент = лучше утепление
                  </p>
                </div>
              </>
            )}

            {/* Остальные режимы (volume, coefficient, temp_diff) */}
            {calcType !== "heat_loss" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    {calcType === "volume" ? "Теплопотери Q (Вт)" : 
                     calcType === "coefficient" ? "Теплопотери Q (Вт)" : "Теплопотери Q (Вт)"}
                  </label>
                  <input
                    type="number"
                    value={calcType === "volume" ? roomArea : 
                           calcType === "coefficient" ? heatLossCoeff : tempInside}
                    onChange={(e) => {
                      if (calcType === "volume") setRoomArea(e.target.value);
                      if (calcType === "coefficient") setHeatLossCoeff(e.target.value);
                      if (calcType === "temp_diff") setTempInside(e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Введите значение"
                  />
                </div>

                {calcType === "volume" && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                        Коэффициент k (Вт/м³·K)
                      </label>
                      <input
                        type="number"
                        value={heatLossCoeff}
                        onChange={(e) => setHeatLossCoeff(e.target.value)}
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
                    {/* Температурный блок */}
                    <div style={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                      border: '1px solid #334155'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                            Внутри
                          </label>
                          <input
                            type="number"
                            value={tempInside}
                            onChange={(e) => setTempInside(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '6px',
                              backgroundColor: '#334155',
                              border: '1px solid #475569',
                              color: 'white'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                            Снаружи
                          </label>
                          <input
                            type="number"
                            value={tempOutside}
                            onChange={(e) => setTempOutside(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '6px',
                              backgroundColor: '#334155',
                              border: '1px solid #475569',
                              color: 'white'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {calcType === "coefficient" && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
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
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                        Высота потолков (м)
                      </label>
                      <input
                        type="number"
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
                    {/* Температурный блок */}
                    <div style={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                      border: '1px solid #334155'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                            Внутри
                          </label>
                          <input
                            type="number"
                            value={tempInside}
                            onChange={(e) => setTempInside(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '6px',
                              backgroundColor: '#334155',
                              border: '1px solid #475569',
                              color: 'white'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                            Снаружи
                          </label>
                          <input
                            type="number"
                            value={tempOutside}
                            onChange={(e) => setTempOutside(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '6px',
                              backgroundColor: '#334155',
                              border: '1px solid #475569',
                              color: 'white'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {calcType === "temp_diff" && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
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
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                        Высота потолков (м)
                      </label>
                      <input
                        type="number"
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
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                        Коэффициент k (Вт/м³·K)
                      </label>
                      <input
                        type="number"
                        value={heatLossCoeff}
                        onChange={(e) => setHeatLossCoeff(e.target.value)}
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
                  </>
                )}
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
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ec4899', marginBottom: '8px' }}>
              {result !== null ? `${result.toFixed(0)} ${getUnit()}` : "—"}
            </div>
            <div style={{ color: '#94a3b8', marginBottom: '16px' }}>
              {calcType === "heat_loss" && "Теплопотери помещения"}
              {calcType === "volume" && "Объём помещения"}
              {calcType === "coefficient" && "Коэффициент теплопотерь"}
              {calcType === "temp_diff" && "Разность температур"}
            </div>
            
            {result !== null && calcType === "heat_loss" && (
              <div style={{ paddingTop: '16px', borderTop: '1px solid #334155' }}>
                <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  ≈ {(result / 1000).toFixed(2)} кВт · {(result * 0.86).toFixed(0)} ккал/ч
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  {result > 10000 ? "Высокие теплопотери — требуется мощное отопление" :
                   result > 5000 ? "Средние теплопотери" :
                   "Низкие теплопотери — хорошее утепление"}
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
            <div style={{ color: '#ec4899', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
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
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#ec4899' }}>
            Как работает расчёт теплопотерь помещения?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
            Теплопотери помещения — это количество тепловой энергии, которое теряется через 
            ограждающие конструкции (стены, окна, пол, потолок) при разнице температур внутри и снаружи.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#ec4899', marginBottom: '8px' }}>Основная формула</h3>
              <div style={{ backgroundColor: '#334155', padding: '12px', borderRadius: '6px' }}>
                <code style={{ color: '#ec4899', fontSize: '14px' }}>
                  Q = V × k × ΔT<br/>
                  где:<br/>
                  Q — теплопотери (Вт)<br/>
                  V — объём помещения (м³)<br/>
                  k — коэффициент теплопотерь (Вт/м³·K)<br/>
                  ΔT — разность температур (°C)
                </code>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#ec4899', marginBottom: '8px' }}>Коэффициенты теплопотерь для разных зданий</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                {buildingTypes.map((type) => (
                  <p key={type.name} style={{ marginBottom: '6px' }}>
                    • <strong>{type.name}:</strong> k = {type.coeff} Вт/м³·K — {type.description}
                  </p>
                ))}
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#ec4899' }}>Как снизить теплопотери?</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Утепление стен:</strong> снижает теплопотери на 30-40%</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Энергоэффективные окна:</strong> снижают потери через окна на 50%</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Утепление пола и потолка:</strong> особенно важно для частных домов</li>
            <li>• <strong>Устранение мостиков холода:</strong> герметизация стыков и швов</li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}