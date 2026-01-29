// components/calculators/WaterHeaterCalculator.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Droplet } from 'lucide-react';

export default function WaterHeaterCalculator() {
  const [waterConsumption, setWaterConsumption] = useState<string>("");
  const [waterTempIn, setWaterTempIn] = useState<string>("10");
  const [waterTempOut, setWaterTempOut] = useState<string>("55");
  const [heatingTime, setHeatingTime] = useState<string>("60");
  const [waterHeaterResult, setWaterHeaterResult] = useState<number | null>(null);
  const [calculationMode, setCalculationMode] = useState<"volume" | "power">("volume");

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

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
      <button
        onClick={resetWaterHeaterCalc}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-sky-500/20 transition-all duration-300 group"
        title="Сбросить значения"
      >
        <RefreshCw className="w-5 h-5 text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
      </button>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-sky-600/20 rounded-xl">
          <Droplet className="w-7 h-7 text-sky-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Расчёт водонагревателя</h2>
      </div>
      
      <div className="space-y-6">
        {/* Переключатель режимов */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setCalculationMode("volume")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${calculationMode === "volume" ? "bg-sky-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          >
            Объём бойлера
          </button>
          <button
            onClick={() => setCalculationMode("power")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${calculationMode === "power" ? "bg-sky-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          >
            Мощность нагрева
          </button>
        </div>
        
        {/* Поля ввода */}
        <div className="space-y-4">
          {calculationMode === "volume" ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Расход горячей воды (л/мин)
              </label>
              <input
                type="number"
                placeholder="Например: 8"
                value={waterConsumption}
                onChange={(e) => setWaterConsumption(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-2">
                Типовые значения: душ 6-8 л/мин, кран 4-6 л/мин
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Объём водонагревателя (л)
              </label>
              <input
                type="number"
                placeholder="Например: 100"
                value={waterConsumption}
                onChange={(e) => setWaterConsumption(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Температура холодной воды (°C)
              </label>
              <input
                type="number"
                value={waterTempIn}
                onChange={(e) => setWaterTempIn(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Температура ГВС (°C)
              </label>
              <input
                type="number"
                value={waterTempOut}
                onChange={(e) => setWaterTempOut(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Желаемое время нагрева (мин)
            </label>
            <input
              type="number"
              value={heatingTime}
              onChange={(e) => setHeatingTime(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-2">
              {calculationMode === "volume" 
                ? "За какое время должен нагреться полный объём" 
                : "За какое время должен нагреться указанный объём"}
            </p>
          </div>
        </div>
        
        {/* Результат */}
        <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-700">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-sky-400 mb-2">
              {waterHeaterResult !== null ? `${waterHeaterResult.toFixed(1)} ${getWaterHeaterUnit()}` : "—"}
            </p>
            <p className="text-gray-400">
              {calculationMode === "volume" 
                ? "Рекомендуемый объём бойлера" 
                : "Требуемая мощность нагрева"}
            </p>
          </div>
          
          {waterHeaterResult !== null && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-300 text-center">
                {calculationMode === "volume" 
                  ? `≈ ${Math.ceil(waterHeaterResult / 10) * 10} л (ближайший стандартный объём)`
                  : `≈ ${Math.ceil(waterHeaterResult)} кВт (с учётом КПД оборудования)`}
              </p>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <div className="inline-block p-3 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="font-medium">Формула:</span> {getWaterHeaterFormula()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {calculationMode === "volume" 
                  ? "V - объём, G - расход, t - время, 1.15 - запас"
                  : "P - мощность, V - объём, ΔT - разность температур, t - время"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}