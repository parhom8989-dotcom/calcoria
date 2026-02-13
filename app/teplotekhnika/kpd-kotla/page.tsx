// app/teplotekhnika/kpd-kotla/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function KpdKotlaPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"efficiency" | "useful_heat" | "fuel_energy">("efficiency");
  const [fuelEnergy, setFuelEnergy] = useState<string>("");
  const [usefulHeat, setUsefulHeat] = useState<string>("");
  const [efficiencyPercent, setEfficiencyPercent] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  // Функция расчёта
  const calculate = useCallback(() => {
    const Q_fuel = parseFloat(fuelEnergy) || 0;
    const Q_useful = parseFloat(usefulHeat) || 0;
    const η = parseFloat(efficiencyPercent) || 0;
    
    let calculatedResult = 0;
    
    switch(calcType) {
      case "efficiency": // η = (Q_полезн / Q_затрач) × 100%
        if (Q_fuel > 0) {
          calculatedResult = (Q_useful / Q_fuel) * 100;
        }
        break;
        
      case "useful_heat": // Q_полезн = Q_затрач × (η / 100)
        if (η > 0) {
          calculatedResult = Q_fuel * (η / 100);
        }
        break;
        
      case "fuel_energy": // Q_затрач = Q_полезн / (η / 100)
        if (η > 0) {
          calculatedResult = Q_useful / (η / 100);
        }
        break;
    }
    
    setResult(isNaN(calculatedResult) ? null : calculatedResult);
  }, [calcType, fuelEnergy, usefulHeat, efficiencyPercent]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setFuelEnergy("");
    setUsefulHeat("");
    setEfficiencyPercent("");
    setResult(null);
    setCalcType("efficiency");
  };

  // Получение единиц измерения
  const getUnit = () => {
    switch(calcType) {
      case "efficiency": return "%";
      case "useful_heat": return "кВт";
      case "fuel_energy": return "кВт";
      default: return "";
    }
  };

  // Получение формулы
  const getFormula = () => {
    switch(calcType) {
      case "efficiency": return "η = (Q_полезн / Q_затрач) × 100%";
      case "useful_heat": return "Q_полезн = Q_затрач × (η / 100)";
      case "fuel_energy": return "Q_затрач = Q_полезн / (η / 100)";
      default: return "η = (Q_полезн / Q_затрач) × 100%";
    }
  };

  // Получение описания формулы
  const getFormulaDescription = () => {
    switch(calcType) {
      case "efficiency": return "η — КПД (коэффициент полезного действия), Q_полезн — полезная тепловая энергия, Q_затрач — затраченная энергия";
      case "useful_heat": return "Q_полезн — полезная тепловая энергия, Q_затрач — затраченная энергия, η — КПД";
      case "fuel_energy": return "Q_затрач — затраченная энергия, Q_полезн — полезная тепловая энергия, η — КПД";
      default: return "Формула расчёта КПД";
    }
  };

  // Получение оценки КПД
  const getEfficiencyRating = () => {
    if (calcType === "efficiency" && result !== null) {
      if (result > 90) return { text: "Отличный КПД!", color: "#10b981" };
      if (result >= 70 && result <= 90) return { text: "Хороший КПД", color: "#f59e0b" };
      if (result < 70) return { text: "Низкий КПД", color: "#ef4444" };
    }
    return null;
  };

  const rating = getEfficiencyRating();

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
              color: '#10b981'
            }}>
              ⚡ Калькулятор КПД котла
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт эффективности отопительного оборудования
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
                color: '#10b981',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#10b981';
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
              onClick={() => setCalcType("efficiency")}
              style={{
                flex: '1',
                minWidth: '140px',
                padding: '12px',
                backgroundColor: calcType === "efficiency" ? '#10b981' : 'transparent',
                color: calcType === "efficiency" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "efficiency" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти КПД η
            </button>
            <button
              onClick={() => setCalcType("useful_heat")}
              style={{
                flex: '1',
                minWidth: '140px',
                padding: '12px',
                backgroundColor: calcType === "useful_heat" ? '#10b981' : 'transparent',
                color: calcType === "useful_heat" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "useful_heat" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти полезное тепло
            </button>
            <button
              onClick={() => setCalcType("fuel_energy")}
              style={{
                flex: '1',
                minWidth: '140px',
                padding: '12px',
                backgroundColor: calcType === "fuel_energy" ? '#10b981' : 'transparent',
                color: calcType === "fuel_energy" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "fuel_energy" ? 'bold' : 'normal',
                textAlign: 'center'
              }}
            >
              Найти затраты энергии
            </button>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            {calcType === "efficiency" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Затраченная энергия Q_затрач (кВт)
                  </label>
                  <input
                    type="number"
                    value={fuelEnergy}
                    onChange={(e) => setFuelEnergy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 100"
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Энергия, полученная от сжигания топлива
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Полезное тепло Q_полезн (кВт)
                  </label>
                  <input
                    type="number"
                    value={usefulHeat}
                    onChange={(e) => setUsefulHeat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 85"
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Энергия, переданная теплоносителю
                  </p>
                </div>
              </>
            )}

            {calcType === "useful_heat" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Затраченная энергия Q_затрач (кВт)
                  </label>
                  <input
                    type="number"
                    value={fuelEnergy}
                    onChange={(e) => setFuelEnergy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 100"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    КПД системы η (%)
                  </label>
                  <input
                    type="number"
                    value={efficiencyPercent}
                    onChange={(e) => setEfficiencyPercent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 85"
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Типовые значения: газовые котлы 85-95%, электрические 95-99%
                  </p>
                </div>
              </>
            )}

            {calcType === "fuel_energy" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Полезное тепло Q_полезн (кВт)
                  </label>
                  <input
                    type="number"
                    value={usefulHeat}
                    onChange={(e) => setUsefulHeat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 80"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    КПД системы η (%)
                  </label>
                  <input
                    type="number"
                    value={efficiencyPercent}
                    onChange={(e) => setEfficiencyPercent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 90"
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
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {result !== null ? `${result.toFixed(1)} ${getUnit()}` : "—"}
            </div>
            <div style={{ color: '#94a3b8', marginBottom: '16px' }}>
              {calcType === "efficiency" && "Коэффициент полезного действия"}
              {calcType === "useful_heat" && "Полезная тепловая энергия"}
              {calcType === "fuel_energy" && "Затраченная энергия"}
            </div>
            
            {rating && (
              <div style={{
                padding: '12px',
                backgroundColor: `${rating.color}20`,
                border: `1px solid ${rating.color}40`,
                borderRadius: '8px',
                marginTop: '16px'
              }}>
                <div style={{ color: rating.color, fontWeight: 'bold', fontSize: '16px' }}>
                  {rating.text}
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
            <div style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
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
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#10b981' }}>
            Как работает расчёт КПД котла?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
            КПД (коэффициент полезного действия) показывает, какая часть затраченной энергии 
            преобразуется в полезную тепловую энергию. Высокий КПД означает экономичную работу 
            отопительного оборудования.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>Формула КПД</h3>
              <div style={{ backgroundColor: '#334155', padding: '12px', borderRadius: '6px' }}>
                <code style={{ color: '#10b981', fontSize: '14px' }}>
                  η = (Q_полезн / Q_затрач) × 100%<br/>
                  где:<br/>
                  η — КПД (%)<br/>
                  Q_полезн — полезная тепловая энергия (кВт)<br/>
                  Q_затрач — затраченная энергия (кВт)
                </code>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>Типовые значения КПД</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Конденсационные газовые котлы:</strong> 90-98%</p>
                <p>• <strong>Обычные газовые котлы:</strong> 85-92%</p>
                <p>• <strong>Электрические котлы:</strong> 95-99%</p>
                <p>• <strong>Твердотопливные котлы:</strong> 75-85%</p>
                <p>• <strong>Жидкотопливные котлы:</strong> 85-90%</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#10b981' }}>Практические рекомендации</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>КПД ниже 70%</strong> — оборудование требует обслуживания или замены</li>
            <li style={{ marginBottom: '8px' }}>• <strong>На КПД влияют:</strong> качество топлива, чистота теплообменника, настройка горелки</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Сезонное обслуживание</strong> повышает КПД на 5-10%</li>
            <li>• <strong>Регулярная чистка</strong> дымохода и теплообменника сохраняет высокий КПД</li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}