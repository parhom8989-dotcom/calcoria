// app/teplotekhnika/vodonagrevatel/page.tsx

"use client";

import { useState, useEffect, useCallback } from 'react';

export default function VodonagrevatelPage() {
  const [waterConsumption, setWaterConsumption] = useState("8");
  const [waterTempIn, setWaterTempIn] = useState("10");
  const [waterTempOut, setWaterTempOut] = useState("55");
  const [heatingTime, setHeatingTime] = useState("60");
  const [waterHeaterResult, setWaterHeaterResult] = useState<number | null>(null);
  const [calculationMode, setCalculationMode] = useState<"volume" | "power">("volume");

  const calculateWaterHeater = useCallback(() => {
    const flowRate = parseFloat(waterConsumption) || 0;
    const tempIn = parseFloat(waterTempIn) || 10;
    const tempOut = parseFloat(waterTempOut) || 55;
    const time = parseFloat(heatingTime) || 60;
    
    const deltaTemp = tempOut - tempIn;
    
    if (deltaTemp > 0) {
      let result = 0;
      
      if (calculationMode === "volume") {
        if (flowRate > 0 && time > 0) {
          result = (flowRate * time) / 60;
          result = result * 1.15;
        }
      } else {
        const volume = flowRate;
        if (volume > 0 && time > 0) {
          const timeHours = time / 60;
          result = (volume * 1.16 * deltaTemp) / timeHours;
          result = result / 1000;
        }
      }
      
      setWaterHeaterResult(isNaN(result) ? null : result);
    } else {
      setWaterHeaterResult(null);
    }
  }, [waterConsumption, waterTempIn, waterTempOut, heatingTime, calculationMode]);

  useEffect(() => {
    calculateWaterHeater();
  }, [calculateWaterHeater]);

  const getWaterHeaterUnit = () => calculationMode === "volume" ? "литров" : "кВт";
  const getWaterHeaterFormula = () => calculationMode === "volume" ? "V = G × t × 1.15" : "P = (V × 1.16 × ΔT) / t";

  const resetWaterHeaterCalc = () => {
    setWaterConsumption("8");
    setWaterTempIn("10");
    setWaterTempOut("55");
    setHeatingTime("60");
    setWaterHeaterResult(null);
    setCalculationMode("volume");
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
        
        {/* Карточка калькулятора */}
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
              color: '#38bdf8'
            }}>
              🚰 Калькулятор водонагревателя
            </h1>
            <p style={{ color: '#94a3b8' }}>
              {calculationMode === "volume" 
                ? "Рассчитайте необходимый объём бойлера" 
                : "Рассчитайте требуемую мощность нагрева"}
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
              onClick={resetWaterHeaterCalc}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#38bdf8',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
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
              🔄 Сбросить
            </button>
          </div>

          {/* Переключатель режимов */}
          <div style={{ display: 'flex', marginBottom: '24px', backgroundColor: '#0f172a', borderRadius: '8px', padding: '4px' }}>
            <button
              onClick={() => setCalculationMode("volume")}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: calculationMode === "volume" ? '#1e40af' : 'transparent',
                color: calculationMode === "volume" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calculationMode === "volume" ? 'bold' : 'normal'
              }}
            >
              Объём бойлера
            </button>
            <button
              onClick={() => setCalculationMode("power")}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: calculationMode === "power" ? '#1e40af' : 'transparent',
                color: calculationMode === "power" ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calculationMode === "power" ? 'bold' : 'normal'
              }}
            >
              Мощность нагрева
            </button>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                {calculationMode === "volume" ? "Расход воды (л/мин)" : "Объём бойлера (л)"}
              </label>
              <input
                type="number"
                value={waterConsumption}
                onChange={(e) => setWaterConsumption(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder={calculationMode === "volume" ? "Например: 8" : "Например: 100"}
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {calculationMode === "volume" 
                  ? "Душ: 6-8 л/мин, Кран: 4-6 л/мин"
                  : "Стандартные объёмы: 50, 80, 100, 120 л"}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                  Температура холодной воды (°C)
                </label>
                <input
                  type="number"
                  value={waterTempIn}
                  onChange={(e) => setWaterTempIn(e.target.value)}
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
                  Температура ГВС (°C)
                </label>
                <input
                  type="number"
                  value={waterTempOut}
                  onChange={(e) => setWaterTempOut(e.target.value)}
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

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Желаемое время нагрева (мин)
              </label>
              <input
                type="number"
                value={heatingTime}
                onChange={(e) => setHeatingTime(e.target.value)}
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
                {calculationMode === "volume" 
                  ? "За какое время должен нагреться полный объём" 
                  : "За какое время должен нагреться указанный объём"}
              </p>
            </div>
          </div>

          {/* Результат */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #334155',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '8px' }}>
              {waterHeaterResult !== null ? `${waterHeaterResult.toFixed(1)} ${getWaterHeaterUnit()}` : "—"}
            </div>
            <div style={{ color: '#94a3b8', marginBottom: '16px' }}>
              {calculationMode === "volume" 
                ? "Рекомендуемый объём бойлера" 
                : "Требуемая мощность нагрева"}
            </div>
            
            {waterHeaterResult !== null && (
              <div style={{ paddingTop: '16px', borderTop: '1px solid #334155' }}>
                <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                  {calculationMode === "volume" 
                    ? `≈ ${Math.ceil(waterHeaterResult / 10) * 10} л (ближайший стандартный объём)`
                    : `≈ ${Math.ceil(waterHeaterResult)} кВт (рекомендуемая мощность)`}
                </div>
              </div>
            )}
          </div>

          {/* Формула */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px' }}>
              <span style={{ color: '#cbd5e1' }}>Формула:</span> {getWaterHeaterFormula()}
            </div>
            <div style={{ color: '#64748b', fontSize: '12px' }}>
              {calculationMode === "volume" 
                ? "V - объём (л), G - расход (л/мин), t - время (мин), 1.15 - запас"
                : "P - мощность (кВт), V - объём (л), ΔT - разность температур, t - время (ч)"}
            </div>
          </div>
        </div>

        {/* SEO текст */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#38bdf8' }}>
            Как работает расчёт водонагревателя?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
            Этот калькулятор помогает подобрать оптимальный водонагреватель для вашего дома. 
            В зависимости от выбранного режима, он рассчитывает либо <strong>необходимый объём накопительного бойлера</strong>, 
            либо <strong>требуемую мощность проточного нагревателя</strong>.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#38bdf8', marginBottom: '8px' }}>Режим «Объём бойлера»</h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '12px' }}>
                Для накопительных водонагревателей (бойлеров).
              </p>
              <div style={{ backgroundColor: '#334155', padding: '12px', borderRadius: '6px' }}>
                <code style={{ color: '#38bdf8', fontSize: '14px' }}>V = G × t × 1.15</code>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#38bdf8', marginBottom: '8px' }}>Режим «Мощность нагрева»</h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '12px' }}>
                Для проточных водонагревателей и контуров ГВС котлов.
              </p>
              <div style={{ backgroundColor: '#334155', padding: '12px', borderRadius: '6px' }}>
                <code style={{ color: '#38bdf8', fontSize: '14px' }}>P = (V × 1.16 × ΔT) / t</code>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#38bdf8' }}>Практические рекомендации</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Для семьи 3-4 человека</strong> обычно достаточно бойлера на 80-100 литров</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Температура холодной воды</strong> летом 15-20°C, зимой 5-10°C</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Расход воды:</strong> душ 6-8 л/мин, кран умывальника 4-6 л/мин</li>
            <li>• Для точного проектирования системы рекомендуется консультация со специалистом</li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}