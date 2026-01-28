// app/teplotekhnika/vodonagrevatel/page.tsx
"use client"; // Важно! Этот калькулятор использует состояние (useState)

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Droplet } from 'lucide-react'; // Импортируем нужные иконки

export default function VodonagrevatelPage() {
  // ========== СОСТОЯНИЕ ДЛЯ РАСЧЁТА ВОДОНАГРЕВАТЕЛЯ (ГВС) ==========
  const [waterConsumption, setWaterConsumption] = useState<string>("");
  const [waterTempIn, setWaterTempIn] = useState<string>("10");
  const [waterTempOut, setWaterTempOut] = useState<string>("55");
  const [heatingTime, setHeatingTime] = useState<string>("60");
  const [waterHeaterResult, setWaterHeaterResult] = useState<number | null>(null);
  const [calculationMode, setCalculationMode] = useState<"volume" | "power">("volume");

  // ========== ФУНКЦИИ ДЛЯ РАСЧЁТОВ ==========
  const calculateWaterHeater = useCallback(() => {
    const flowRate = parseFloat(waterConsumption) || 0;
    const tempIn = parseFloat(waterTempIn) || 10;
    const tempOut = parseFloat(waterTempOut) || 55;
    const time = parseFloat(heatingTime) || 60;
    
    const waterHeatCapacity = 1.16;
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
          result = (volume * waterHeatCapacity * deltaTemp) / timeHours;
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

  const resetWaterHeaterCalc = () => {
    setWaterConsumption("");
    setWaterTempIn("10");
    setWaterTempOut("55");
    setHeatingTime("60");
    setWaterHeaterResult(null);
    setCalculationMode("volume");
  };

  const getWaterHeaterUnit = () => {
    return calculationMode === "volume" ? "литров" : "кВт";
  };

  const getWaterHeaterFormula = () => {
    if (calculationMode === "volume") {
      return "V = G × t × 1.15";
    } else {
      return "P = (V × 1.16 × ΔT) / t";
    }
  };

  // ========== ВИЗУАЛЬНАЯ ЧАСТЬ СТРАНИЦЫ ==========
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Контейнер, который ограничивает ширину на ПК */}
      <div className="mx-auto px-4 py-8 max-w-6xl">
        
        {/* 1. Заголовок и описание для SEO */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Калькулятор расчёта водонагревателя (ГВС)</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Определите необходимый объём бойлера или дополнительную мощность котла для обеспечения дома горячей водой.
          Расчёт для систем горячего водоснабжения.
        </p>
        
        {/* 2. Карточка с калькулятором */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl mb-8">
          
          <button
            onClick={resetWaterHeaterCalc}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-sky-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-sky-600/20 rounded-xl">
              <Droplet className="w-7 h-7 text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Расчёт водонагревателя</h2>
          </div>
          
          {/* Код вашего калькулятора */}
          <div className="space-y-4">
            {/* Переключатель режимов */}
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setCalculationMode("volume")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${calculationMode === "volume" ? "bg-sky-600 text-white" : "bg-gray-700 text-gray-300"}`}
              >
                Объём бойлера
              </button>
              <button
                onClick={() => setCalculationMode("power")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${calculationMode === "power" ? "bg-sky-600 text-white" : "bg-gray-700 text-gray-300"}`}
              >
                Мощность нагрева
              </button>
            </div>
            
            {calculationMode === "volume" ? (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Расход горячей воды (л/мин)
                </label>
                <input
                  type="number"
                  placeholder="Например: 8"
                  value={waterConsumption}
                  onChange={(e) => setWaterConsumption(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Типовые значения: душ 6-8 л/мин, кран 4-6 л/мин
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Объём водонагревателя (л)
                </label>
                <input
                  type="number"
                  placeholder="Например: 100"
                  value={waterConsumption}
                  onChange={(e) => setWaterConsumption(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Температура холодной воды (°C)
                </label>
                <input
                  type="number"
                  value={waterTempIn}
                  onChange={(e) => setWaterTempIn(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Температура ГВС (°C)
                </label>
                <input
                  type="number"
                  value={waterTempOut}
                  onChange={(e) => setWaterTempOut(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Желаемое время нагрева (мин)
              </label>
              <input
                type="number"
                value={heatingTime}
                onChange={(e) => setHeatingTime(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
              />
              <p className="text-xs text-gray-400 mt-1">
                {calculationMode === "volume" 
                  ? "За какое время должен нагреться полный объём" 
                  : "За какое время должен нагреться указанный объём"}
              </p>
            </div>
          </div>

          {/* Блок с результатом */}
          <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <p className="text-3xl font-bold text-sky-400">
              {waterHeaterResult !== null ? `${waterHeaterResult.toFixed(1)} ${getWaterHeaterUnit()}` : "—"}
            </p>
            <p className="text-gray-400 mt-2">
              {calculationMode === "volume" 
                ? "Рекомендуемый объём бойлера" 
                : "Требуемая мощность нагрева"}
            </p>
            
            {waterHeaterResult !== null && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-300">
                  {calculationMode === "volume" 
                    ? `≈ ${Math.ceil(waterHeaterResult / 10) * 10} л (ближайший стандартный объём)`
                    : `≈ ${Math.ceil(waterHeaterResult)} кВт (с учётом КПД оборудования)`}
                </p>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              <span>Формула: {getWaterHeaterFormula()}</span>
              <p className="text-xs text-gray-400 mt-1">
                {calculationMode === "volume" 
                  ? "V - объём, G - расход, t - время, 1.15 - запас"
                  : "P - мощность, V - объём, ΔT - разность температур, t - время"}
              </p>
            </div>
          </div>
        </div>
        
        {/* 3. Пояснительный текст для SEO */}
        <div className="prose prose-invert max-w-none">
          <h2>Что такое система ГВС и как её рассчитывать?</h2>
          <p>Горячее водоснабжение (ГВС) — неотъемлемая часть комфорта в любом доме. Правильный расчёт позволяет выбрать оптимальное оборудование и избежать лишних затрат.</p>
          
          <h3>Как работает этот калькулятор?</h3>
          <p>В зависимости от выбранного режима, калькулятор рассчитывает либо необходимый объём накопительного водонагревателя (бойлера), либо требуемую мощность проточного нагревателя или дополнительного контура котла.</p>
          
          <h3>Формулы расчёта</h3>
          <ul>
            <li><strong>Объём бойлера:</strong> V = G × t × 1.15, где G — расход воды (л/мин), t — время нагрева (мин), 1.15 — коэффициент запаса.</li>
            <li><strong>Мощность нагрева:</strong> P = (V × 1.16 × ΔT) / t, где V — объём воды (л), ΔT — разность температур (°C), t — время (ч), 1.16 — теплоёмкость воды (Вт·ч/л·К).</li>
          </ul>
          
          <h3>Практические советы</h3>
          <p>Для семьи из 3-4 человек обычно достаточно бойлера на 80-100 литров. Если у вас несколько точек водоразбора, используйте в расчёте суммарный расход.</p>
        </div>
      </div>
    </div>
  );
}