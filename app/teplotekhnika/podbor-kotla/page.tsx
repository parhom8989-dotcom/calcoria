// app/teplotekhnika/podbor-kotla/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function PodborKotlaPage() {
  // Состояния калькулятора
  const [totalHeatLoad, setTotalHeatLoad] = useState<string>("");
  const [boilerType, setBoilerType] = useState<"gas" | "electric" | "solid">("gas");
  const [safetyMargin, setSafetyMargin] = useState<string>("15");
  const [boilerEfficiency, setBoilerEfficiency] = useState<string>("92");
  const [recommendedBoilerPower, setRecommendedBoilerPower] = useState<number | null>(null);
  const [formulaDetails, setFormulaDetails] = useState<string>("");

  // Функция расчёта
  const calculate = useCallback(() => {
    const load = parseFloat(totalHeatLoad) || 0; // Нагрузка в Вт
    const margin = parseFloat(safetyMargin) || 0; // Запас в %
    const efficiency = parseFloat(boilerEfficiency) || 100; // КПД в %

    if (load > 0 && efficiency > 0 && efficiency <= 100) {
      // 1. Учитываем запас мощности
      const loadWithMargin = load * (1 + margin / 100);
      // 2. Учитываем КПД котла
      const requiredInputPower = loadWithMargin / (efficiency / 100);
      // 3. Переводим в кВт и округляем
      const resultInKw = Number((requiredInputPower / 1000).toFixed(2));

      if (!isNaN(resultInKw)) {
        setRecommendedBoilerPower(resultInKw);
        setFormulaDetails(`(${load/1000} кВт + ${margin}%) / (${efficiency}% / 100) = ${resultInKw} кВт`);
      } else {
        setRecommendedBoilerPower(null);
        setFormulaDetails("");
      }
    } else {
      setRecommendedBoilerPower(null);
      setFormulaDetails("");
    }
  }, [totalHeatLoad, safetyMargin, boilerEfficiency]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setTotalHeatLoad("");
    setBoilerType("gas");
    setSafetyMargin("15");
    setBoilerEfficiency("92");
    setRecommendedBoilerPower(null);
    setFormulaDetails("");
  };

  // Получение КПД по умолчанию в зависимости от типа котла
  const getDefaultEfficiency = (type: string) => {
    const efficiencies: Record<string, string> = {
      'gas': '92',      // Современный газовый
      'electric': '99', // Электрический
      'solid': '85'     // Твердотопливный
    };
    return efficiencies[type] || '92';
  };

  // Типы котлов
  const boilerTypes = [
    { id: "gas", name: "Газовый котёл", icon: "🔥", color: "#3b82f6", efficiency: "92" },
    { id: "electric", name: "Электрический котёл", icon: "⚡", color: "#f59e0b", efficiency: "99" },
    { id: "solid", name: "Твердотопливный котёл", icon: "🪵", color: "#8b5cf6", efficiency: "85" }
  ];

  // Рекомендации по мощности
  const getPowerRecommendation = (power: number) => {
    if (power < 10) return { text: "Малая мощность", color: "#10b981" };
    if (power >= 10 && power <= 30) return { text: "Средняя мощность", color: "#f59e0b" };
    if (power > 30 && power <= 60) return { text: "Высокая мощность", color: "#ef4444" };
    return { text: "Промышленная мощность", color: "#dc2626" };
  };

  const recommendation = recommendedBoilerPower ? getPowerRecommendation(recommendedBoilerPower) : null;

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
              🏭 Калькулятор подбора котла
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт требуемой мощности отопительного котла
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
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#3b82f6';
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Блок с инструкцией */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid #334155'
          }}>
            <h3 style={{ color: '#3b82f6', marginBottom: '12px', fontSize: '18px' }}>
              📋 Как получить тепловую нагрузку?
            </h3>
            <ol style={{ color: '#cbd5e1', paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>Откройте калькулятор «Теплопотери помещения»</li>
              <li>Введите площадь, высоту, температуры</li>
              <li>Скопируйте результат в ваттах (Вт)</li>
              <li>Вставьте значение в поле ниже</li>
            </ol>
          </div>

          {/* Поле для тепловой нагрузки */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
              Тепловая нагрузка (Вт)
            </label>
            <input
              type="number"
              placeholder="Например: 8500"
              value={totalHeatLoad}
              onChange={(e) => setTotalHeatLoad(e.target.value)}
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
              Суммарная тепловая нагрузка всех помещений
            </p>
          </div>

          {/* Выбор типа котла */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#cbd5e1' }}>
              Тип котла
            </label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {boilerTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setBoilerType(type.id as "gas" | "electric" | "solid");
                    setBoilerEfficiency(type.efficiency);
                  }}
                  style={{
                    flex: '1',
                    minWidth: '140px',
                    padding: '16px',
                    backgroundColor: boilerType === type.id ? type.color : '#334155',
                    color: 'white',
                    border: `2px solid ${boilerType === type.id ? type.color : '#475569'}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    if (boilerType !== type.id) {
                      e.currentTarget.style.backgroundColor = '#475569';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (boilerType !== type.id) {
                      e.currentTarget.style.backgroundColor = '#334155';
                    }
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{type.icon}</span>
                  <span>{type.name}</span>
                  <span style={{ fontSize: '12px', opacity: 0.9 }}>КПД: {type.efficiency}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Запас мощности */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ color: '#cbd5e1' }}>
                Запас мощности
              </label>
              <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '18px' }}>{safetyMargin}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={safetyMargin}
              onChange={(e) => setSafetyMargin(e.target.value)}
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#334155',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              <span>0% (без запаса)</span>
              <span>15% (рекомендуется)</span>
              <span>30% (максимум)</span>
            </div>
          </div>

          {/* КПД котла */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
              КПД котла (%)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              step="1"
              value={boilerEfficiency}
              onChange={(e) => setBoilerEfficiency(e.target.value)}
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
              Типовые значения: газовые 85-95%, электрические 95-99%, твердотопливные 75-85%
            </p>
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
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {recommendedBoilerPower !== null ? `${recommendedBoilerPower.toFixed(1)} кВт` : "—"}
            </div>
            <div style={{ color: '#94a3b8', marginBottom: '16px' }}>
              Рекомендуемая мощность котла
            </div>
            
            {recommendedBoilerPower !== null && (
              <>
                {recommendation && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: `${recommendation.color}20`,
                    border: `1px solid ${recommendation.color}40`,
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ color: recommendation.color, fontWeight: 'bold', fontSize: '16px' }}>
                      {recommendation.text}
                    </div>
                  </div>
                )}
                
                <div style={{ paddingTop: '16px', borderTop: '1px solid #334155' }}>
                  <div style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px' }}>
                    Для {boilerType === 'gas' ? 'газового' : boilerType === 'electric' ? 'электрического' : 'твердотопливного'} котла
                  </div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>
                    С учётом {safetyMargin}% запаса и КПД {boilerEfficiency}%
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ФОРМУЛА */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#3b82f6', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              P_котла = (P_нагр + запас) / (КПД / 100)
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              P_котла — мощность котла, P_нагр — тепловая нагрузка, запас — резерв мощности
            </div>
            {formulaDetails && (
              <div style={{
                marginTop: '12px',
                padding: '10px',
                backgroundColor: '#334155',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#cbd5e1'
              }}>
                {formulaDetails}
              </div>
            )}
          </div>
        </div>

        {/* SEO ТЕКСТ */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#3b82f6' }}>
            Как правильно подобрать котёл?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
            Правильный подбор мощности котла — ключевой этап проектирования системы отопления. 
            Недостаточная мощность приведёт к недогреву, избыточная — к перерасходу топлива и снижению КПД.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>Типовые мощности котлов</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Квартира 50-80 м²:</strong> 8-12 кВт</p>
                <p>• <strong>Дом 100-150 м²:</strong> 15-25 кВт</p>
                <p>• <strong>Дом 150-200 м²:</strong> 25-35 кВт</p>
                <p>• <strong>Дом 200-300 м²:</strong> 35-50 кВт</p>
                <p>• <strong>Коттедж 300+ м²:</strong> 50+ кВт</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>Запас мощности: зачем он нужен?</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p><strong>10-15% запаса</strong> рекомендуется для:</p>
                <p>• Компенсации потерь в системе</p>
                <p>• Быстрого выхода на режим в морозы</p>
                <p>• Подготовки горячей воды (если котёл двухконтурный)</p>
                <p>• Учёта возможного увеличения отапливаемой площади</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#3b82f6' }}>Сравнение типов котлов</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ color: '#3b82f6', marginBottom: '8px' }}>🔥 Газовые</h4>
              <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                • КПД 85-95%<br/>
                • Экономичный<br/>
                • Требуется дымоход
              </p>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ color: '#f59e0b', marginBottom: '8px' }}>⚡ Электрические</h4>
              <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                • КПД 95-99%<br/>
                • Простой монтаж<br/>
                • Высокие тарифы
              </p>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
              <h4 style={{ color: '#8b5cf6', marginBottom: '8px' }}>🪵 Твердотопливные</h4>
              <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
                • КПД 75-85%<br/>
                • Автономность<br/>
                • Требует запаса топлива
              </p>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#3b82f6' }}>Практические рекомендации</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Для точного расчёта</strong> используйте калькулятор теплопотерь</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Двухконтурные котлы</strong> требуют на 20-30% большей мощности</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Для домов с плохим утеплением</strong> увеличьте запас до 20-25%</li>
            <li>• <strong>Проконсультируйтесь со специалистом</strong> перед покупкой оборудования</li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}