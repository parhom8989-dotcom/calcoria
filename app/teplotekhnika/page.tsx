"use client";

import { useState, useEffect, useCallback } from 'react';
import { Flame, Gauge, Droplets, Home, RefreshCw, ThermometerSun, Factory, Droplet, Wrench, GitMerge } from "lucide-react";

export default function TeplotekhnikaPage() {
  // ========== 1. ТЕПЛОВАЯ МОЩНОСТЬ ==========
  const [calc1Type, setCalc1Type] = useState("power");
  const [mass1, setMass1] = useState("");
  const [tempDiff1, setTempDiff1] = useState("");
  const [heatCap1, setHeatCap1] = useState("4.19");
  const [power1, setPower1] = useState("");
  const [result1, setResult1] = useState<number | null>(null);

  // ========== 2. КПД КОТЛА ==========
  const [calc2Type, setCalc2Type] = useState("efficiency");
  const [fuelEnergy, setFuelEnergy] = useState("");
  const [usefulHeat, setUsefulHeat] = useState("");
  const [efficiencyPercent, setEfficiencyPercent] = useState("");
  const [result2, setResult2] = useState<number | null>(null);

// ========== 3. РАСХОД ТЕПЛОНОСИТЕЛЯ ==========
const [calc3Type, setCalc3Type] = useState("flow_rate");
const [heatLoad, setHeatLoad] = useState("");
const [tempDiff3, setTempDiff3] = useState("");
const [flowRate, setFlowRate] = useState("");
const [specificHeat, setSpecificHeat] = useState("4.19");
const [result3, setResult3] = useState<number | null>(null);

// ========== 4. ТЕПЛОПОТЕРИ ПОМЕЩЕНИЯ ==========
const [calc4Type, setCalc4Type] = useState("heat_loss"); // Тип расчета
const [roomArea, setRoomArea] = useState(""); // Площадь (м²)
const [roomHeight, setRoomHeight] = useState(""); // Высота (м)
const [tempInside, setTempInside] = useState("20"); // Температура внутри (°C)
const [tempOutside, setTempOutside] = useState("-10"); // Температура снаружи (°C)
const [heatLossCoeff, setHeatLossCoeff] = useState("0.8"); // Коэффициент k (Вт/м³·K)
const [result4, setResult4] = useState<number | null>(null);

// ========== 5. МОЩНОСТЬ ТЁПЛОГО ПОЛА ==========
const [floorArea, setFloorArea] = useState<string>(""); // Площадь укладки (м²)
const [roomTemp, setRoomTemp] = useState<string>("20"); // Желаемая температура в комнате (°C)
const [floorType, setFloorType] = useState<"tile" | "laminate" | "linoleum">("tile"); // Тип покрытия
const [heatingMode, setHeatingMode] = useState<"comfort" | "primary">("comfort"); // Режим работы
const [floorPowerResult, setFloorPowerResult] = useState<number | null>(null); // Результат (Вт) <- ОСНОВНОЕ ИСПРАВЛЕНИЕ
const [specificPower, setSpecificPower] = useState<number | null>(null); // Удельная мощность (Вт/м²)

// ========== 6. ПОДБОР КОТЛА ==========
const [totalHeatLoad, setTotalHeatLoad] = useState<string>(""); // Суммарная нагрузка (Вт)
const [boilerType, setBoilerType] = useState<"gas" | "electric" | "solid">("gas");
const [safetyMargin, setSafetyMargin] = useState<string>("15");
const [boilerEfficiency, setBoilerEfficiency] = useState<string>("92");
const [recommendedBoilerPower, setRecommendedBoilerPower] = useState<number | null>(null);
const [formulaDetails, setFormulaDetails] = useState<string>("");
  
// ========== 7. РАСЧЁТ ВОДОНАГРЕВАТЕЛЯ (ГВС) ==========
const [waterConsumption, setWaterConsumption] = useState<string>(""); // Расход воды (л/мин)
const [waterTempIn, setWaterTempIn] = useState<string>("10"); // Температура холодной воды (°C)
const [waterTempOut, setWaterTempOut] = useState<string>("55"); // Желаемая температура ГВС (°C)
const [heatingTime, setHeatingTime] = useState<string>("60"); // Время нагрева (мин)
const [waterHeaterResult, setWaterHeaterResult] = useState<number | null>(null); // Результат (л или кВт)
const [calculationMode, setCalculationMode] = useState<"volume" | "power">("volume"); // Режим расчёта: 'volume' - объём, 'power' - мощность

// ========== 8. ТЕПЛОПОТЕРИ ТРУБОПРОВОДОВ ==========
const [pipeDiameter, setPipeDiameter] = useState<string>("");
const [pipeLength, setPipeLength] = useState<string>("");
const [pipeTemp, setPipeTemp] = useState<string>("70");
const [ambientTemp, setAmbientTemp] = useState<string>("20");
const [insulationThickness, setInsulationThickness] = useState<string>("0");
const [insulationMaterial, setInsulationMaterial] = useState<string>("mineral_wool");
const [pipeMaterial, setPipeMaterial] = useState<string>("steel");
const [pipeWallThickness, setPipeWallThickness] = useState<string>("3");
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
    color: "bg-gray-500/20 text-gray-300", 
    icon: "⚙️" 
  },
  stainless_steel: { 
    name: "Нержавейка", 
    lambda: 16, 
    color: "bg-gray-400/20 text-gray-300", 
    icon: "✨" 
  },
  copper: { 
    name: "Медь", 
    lambda: 401, 
    color: "bg-amber-600/20 text-amber-300", 
    icon: "🔶" 
  },
  aluminum: { 
    name: "Алюминий", 
    lambda: 237, 
    color: "bg-gray-300/20 text-gray-200", 
    icon: "🔩" 
  },
  ppr: { 
    name: "Полипропилен (PPR)", 
    lambda: 0.24, 
    color: "bg-green-500/20 text-green-300", 
    icon: "🟢" 
  },
  pex: { 
    name: "Сшитый полиэтилен (PEX)", 
    lambda: 0.41, 
    color: "bg-blue-500/20 text-blue-300", 
    icon: "🔵" 
  },
  pvc: { 
    name: "ПВХ", 
    lambda: 0.19, 
    color: "bg-white/20 text-gray-200", 
    icon: "⚪" 
  },
  metal_plastic: { 
    name: "Металлопластик", 
    lambda: 0.45, 
    color: "bg-purple-500/20 text-purple-300", 
    icon: "🟣" 
  }
};

// Справочник материалов изоляции
const insulationMaterials = {
  mineral_wool: { 
    name: "Минеральная вата", 
    lambda: 0.045, 
    color: "bg-yellow-500/20 text-yellow-300" 
  },
  polyurethane: { 
    name: "Пенополиуретан", 
    lambda: 0.03, 
    color: "bg-blue-500/20 text-blue-300" 
  },
  foam_rubber: { 
    name: "Вспененный каучук", 
    lambda: 0.038, 
    color: "bg-green-500/20 text-green-300" 
  },
  eps: { 
    name: "Пенополистирол", 
    lambda: 0.037, 
    color: "bg-purple-500/20 text-purple-300" 
  },
  basalt: { 
    name: "Базальтовое волокно", 
    lambda: 0.042, 
    color: "bg-red-500/20 text-red-300" 
  },
  aerogel: { 
    name: "Аэрогель", 
    lambda: 0.015, 
    color: "bg-teal-500/20 text-teal-300" 
  },
  none: { 
    name: "Без изоляции", 
    lambda: 1.0, 
    color: "bg-gray-500/20 text-gray-300" 
  }
};


// === ФУНКЦИИ ДЛЯ КАЛЬКУЛЯТОРА 1 ===
  const calculate1 = useCallback(() => {
    const m = parseFloat(mass1) || 0;
    const ΔT = parseFloat(tempDiff1) || 0;
    const c = parseFloat(heatCap1) || 4.19;
    const Q = parseFloat(power1) || 0;
    
    let result = 0;
    
    switch(calc1Type) {
      case "power": // Q = m·c·ΔT
        result = m * c * ΔT;
        break;
      case "mass": // m = Q/(c·ΔT)
        if (c && ΔT) result = Q / (c * ΔT);
        break;
      case "temp_diff": // ΔT = Q/(m·c)
        if (m && c) result = Q / (m * c);
        break;
      case "heat_cap": // c = Q/(m·ΔT)
        if (m && ΔT) result = Q / (m * ΔT);
        break;
    }
    
    setResult1(isNaN(result) ? null : result);
  }, [calc1Type, mass1, tempDiff1, heatCap1, power1]);

  useEffect(() => { calculate1(); }, [calculate1]);

  const reset1 = () => {
    setMass1(""); setTempDiff1(""); setHeatCap1("4.19"); setPower1(""); 
    setResult1(null); setCalc1Type("power");
  };

  const getUnit1 = () => {
    switch(calc1Type) {
      case "power": return "кВт";
      case "mass": return "кг/с";
      case "temp_diff": return "°C";
      case "heat_cap": return "кДж/(кг·K)";
      default: return "";
    }
  };

  const getFormula1 = () => {
  switch(calc1Type) {
    case "power": return "Q = m × c × ΔT";
    case "mass": return "m = Q / (c × ΔT)";
    case "temp_diff": return "ΔT = Q / (m × c)";
    case "heat_cap": return "c = Q / (m × ΔT)";
    default: return "Q = m × c × ΔT";
  }
};

  const renderInputs1 = () => {
    switch(calc1Type) {
      case "power":
        return (
          <>
            <input type="number" placeholder="Массовый расход m (кг/с)" value={mass1} onChange={(e) => setMass1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
            <input type="number" placeholder="Теплоемкость c (кДж/(кг·K))" value={heatCap1} onChange={(e) => setHeatCap1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
            <input type="number" placeholder="Разность температур ΔT (°C)" value={tempDiff1} onChange={(e) => setTempDiff1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
          </>
        );
      case "mass":
        return (
          <>
            <input type="number" placeholder="Тепловая мощность Q (кВт)" value={power1} onChange={(e) => setPower1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
            <input type="number" placeholder="Теплоемкость c (кДж/(кг·K))" value={heatCap1} onChange={(e) => setHeatCap1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
            <input type="number" placeholder="Разность температур ΔT (°C)" value={tempDiff1} onChange={(e) => setTempDiff1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
          </>
        );
      case "temp_diff":
        return (
          <>
            <input type="number" placeholder="Тепловая мощность Q (кВт)" value={power1} onChange={(e) => setPower1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
            <input type="number" placeholder="Массовый расход m (кг/с)" value={mass1} onChange={(e) => setMass1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
            <input type="number" placeholder="Теплоемкость c (кДж/(кг·K))" value={heatCap1} onChange={(e) => setHeatCap1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
          </>
        );
      case "heat_cap":
        return (
          <>
            <input type="number" placeholder="Тепловая мощность Q (кВт)" value={power1} onChange={(e) => setPower1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
            <input type="number" placeholder="Массовый расход m (кг/с)" value={mass1} onChange={(e) => setMass1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
            <input type="number" placeholder="Разность температур ΔT (°C)" value={tempDiff1} onChange={(e) => setTempDiff1(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
          </>
        );
      default: return null;
    }
  };

  // === ФУНКЦИИ ДЛЯ КАЛЬКУЛЯТОРА 2 ===
  const calculate2 = useCallback(() => {
    const Q_fuel = parseFloat(fuelEnergy) || 0;
    const Q_useful = parseFloat(usefulHeat) || 0;
    const η = parseFloat(efficiencyPercent) || 0;
    
    let result = 0;
    
    switch(calc2Type) {
      case "efficiency": // η = (Q_полезн / Q_затрач) × 100%
        if (Q_fuel > 0) {
          result = (Q_useful / Q_fuel) * 100;
        }
        break;
        
      case "useful_heat": // Q_полезн = Q_затрач × (η / 100)
        if (η > 0) {
          result = Q_fuel * (η / 100);
        }
        break;
        
      case "fuel_energy": // Q_затрач = Q_полезн / (η / 100)
        if (η > 0) {
          result = Q_useful / (η / 100);
        }
        break;
    }
    
    setResult2(isNaN(result) ? null : result);
  }, [calc2Type, fuelEnergy, usefulHeat, efficiencyPercent]);

  useEffect(() => { calculate2(); }, [calculate2]);

  const reset2 = () => {
    setFuelEnergy("");
    setUsefulHeat("");
    setEfficiencyPercent("");
    setResult2(null);
    setCalc2Type("efficiency");
  };

  const getUnit2 = () => {
    switch(calc2Type) {
      case "efficiency": return "%";
      case "useful_heat": return "кВт";
      case "fuel_energy": return "кВт";
      default: return "";
    }
  };

const getFormula2 = () => {
  switch(calc2Type) {
    case "efficiency": return "η = (Q_полезн / Q_затрач) × 100%";
    case "useful_heat": return "Q_полезн = Q_затрач × (η / 100)";
    case "fuel_energy": return "Q_затрач = Q_полезн / (η / 100)";
    default: return "η = (Q_полезн / Q_затрач) × 100%";
  }
};

  const renderInputs2 = () => {
    switch(calc2Type) {
      case "efficiency":
        return (
          <>
            <input 
              type="number" 
              placeholder="Затраченная энергия Q_затрач (кВт)" 
              value={fuelEnergy} 
              onChange={(e) => setFuelEnergy(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Полезное тепло Q_полезн (кВт)" 
              value={usefulHeat} 
              onChange={(e) => setUsefulHeat(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
            />
          </>
        );
        
      case "useful_heat":
        return (
          <>
            <input 
              type="number" 
              placeholder="Затраченная энергия Q_затрач (кВт)" 
              value={fuelEnergy} 
              onChange={(e) => setFuelEnergy(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="КПД системы η (%)" 
              value={efficiencyPercent} 
              onChange={(e) => setEfficiencyPercent(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
            />
          </>
        );
        
      case "fuel_energy":
        return (
          <>
            <input 
              type="number" 
              placeholder="Полезное тепло Q_полезн (кВт)" 
              value={usefulHeat} 
              onChange={(e) => setUsefulHeat(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="КПД системы η (%)" 
              value={efficiencyPercent} 
              onChange={(e) => setEfficiencyPercent(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
            />
          </>
        );
        
      default:
        return null;
    }
  };

// === ФУНКЦИИ ДЛЯ КАЛЬКУЛЯТОРА 3 ===
const calculate3 = useCallback(() => {
  const Q = parseFloat(heatLoad) || 0; // Тепловая нагрузка (кВт)
  const ΔT = parseFloat(tempDiff3) || 0; // Разность температур (°C)
  const G = parseFloat(flowRate) || 0; // Расход (кг/с)
  const c = parseFloat(specificHeat) || 4.19; // Теплоемкость (кДж/(кг·K))
  
  let result = 0;
  
  switch(calc3Type) {
    case "flow_rate": // G = Q / (c × ΔT)
      if (c > 0 && ΔT > 0) {
        result = Q / (c * ΔT);
      }
      break;
      
    case "heat_load": // Q = G × c × ΔT
      result = G * c * ΔT;
      break;
      
    case "temp_diff": // ΔT = Q / (G × c)
      if (G > 0 && c > 0) {
        result = Q / (G * c);
      }
      break;
      
    case "specific_heat": // c = Q / (G × ΔT)
      if (G > 0 && ΔT > 0) {
        result = Q / (G * ΔT);
      }
      break;
  }
  
  setResult3(isNaN(result) ? null : result);
}, [calc3Type, heatLoad, tempDiff3, flowRate, specificHeat]);

useEffect(() => { calculate3(); }, [calculate3]);

const reset3 = () => {
  setHeatLoad("");
  setTempDiff3("");
  setFlowRate("");
  setSpecificHeat("4.19");
  setResult3(null);
  setCalc3Type("flow_rate");
};

const getUnit3 = () => {
  switch(calc3Type) {
    case "flow_rate": return "кг/с";
    case "heat_load": return "кВт";
    case "temp_diff": return "°C";
    case "specific_heat": return "кДж/(кг·K)";
    default: return "";
  }
};

const getFormula3 = () => {
  switch(calc3Type) {
    case "flow_rate": return "G = Q / (c × ΔT)";
    case "heat_load": return "Q = G × c × ΔT";
    case "temp_diff": return "ΔT = Q / (G × c)";
    case "specific_heat": return "c = Q / (G × ΔT)";
    default: return "Q = G × c × ΔT";
  }
};

const renderInputs3 = () => {
  switch(calc3Type) {
    case "flow_rate":
      return (
        <>
          <input 
            type="number" 
            placeholder="Тепловая нагрузка Q (кВт)" 
            value={heatLoad} 
            onChange={(e) => setHeatLoad(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Разность температур ΔT (°C)" 
            value={tempDiff3} 
            onChange={(e) => setTempDiff3(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Теплоемкость c (кДж/(кг·K))" 
            value={specificHeat} 
            onChange={(e) => setSpecificHeat(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <p className="text-sm text-gray-400">По умолчанию: вода (4.19)</p>
        </>
      );
      
    case "heat_load":
      return (
        <>
          <input 
            type="number" 
            placeholder="Расход G (кг/с)" 
            value={flowRate} 
            onChange={(e) => setFlowRate(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Разность температур ΔT (°C)" 
            value={tempDiff3} 
            onChange={(e) => setTempDiff3(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Теплоемкость c (кДж/(кг·K))" 
            value={specificHeat} 
            onChange={(e) => setSpecificHeat(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
        </>
      );
      
    case "temp_diff":
      return (
        <>
          <input 
            type="number" 
            placeholder="Тепловая нагрузка Q (кВт)" 
            value={heatLoad} 
            onChange={(e) => setHeatLoad(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Расход G (кг/с)" 
            value={flowRate} 
            onChange={(e) => setFlowRate(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Теплоемкость c (кДж/(кг·K))" 
            value={specificHeat} 
            onChange={(e) => setSpecificHeat(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
        </>
      );
      
    case "specific_heat":
      return (
        <>
          <input 
            type="number" 
            placeholder="Тепловая нагрузка Q (кВт)" 
            value={heatLoad} 
            onChange={(e) => setHeatLoad(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Расход G (кг/с)" 
            value={flowRate} 
            onChange={(e) => setFlowRate(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Разность температур ΔT (°C)" 
            value={tempDiff3} 
            onChange={(e) => setTempDiff3(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
        </>
      );
      
    default:
      return null;
  }
};

// === ФУНКЦИИ ДЛЯ КАЛЬКУЛЯТОРА 4 ===
const calculate4 = useCallback(() => {
  const area = parseFloat(roomArea) || 0; // Площадь (м²)
  const height = parseFloat(roomHeight) || 0; // Высота (м)
  const Tin = parseFloat(tempInside) || 0; // Температура внутри (°C)
  const Tout = parseFloat(tempOutside) || 0; // Температура снаружи (°C)
  const k = parseFloat(heatLossCoeff) || 0; // Коэффициент (Вт/м³·K)
  
  let result = 0;
  
  switch(calc4Type) {
    case "heat_loss": // Q = V × k × ΔT
      if (area > 0 && height > 0 && k > 0) {
        const volume = area * height; // Объем (м³)
        const ΔT = Tin - Tout; // Разность температур
        result = volume * k * ΔT; // Вт
      }
      break;
      
    case "volume": // V = Q / (k × ΔT)
      if (k > 0) {
        const ΔT = Tin - Tout;
        const Q = parseFloat(roomArea) || 0; // Здесь roomArea - это Q
        if (ΔT > 0) {
          result = Q / (k * ΔT);
        }
      }
      break;
      
    case "coefficient": // k = Q / (V × ΔT)
      if (area > 0 && height > 0) {
        const volume = area * height;
        const ΔT = Tin - Tout;
        const Q = parseFloat(heatLossCoeff) || 0; // Здесь heatLossCoeff - это Q
        if (volume > 0 && ΔT > 0) {
          result = Q / (volume * ΔT);
        }
      }
      break;
      
    case "temp_diff": // ΔT = Q / (V × k)
      if (area > 0 && height > 0 && k > 0) {
        const volume = area * height;
        const Q = parseFloat(tempInside) || 0; // Здесь tempInside - это Q
        if (volume > 0) {
          result = Q / (volume * k);
        }
      }
      break;
  }
  

  
  setResult4(isNaN(result) ? null : result);
}, [calc4Type, roomArea, roomHeight, tempInside, tempOutside, heatLossCoeff]);



useEffect(() => { calculate4(); }, [calculate4]);

const reset4 = () => {
  setRoomArea("");
  setRoomHeight("");
  setTempInside("20");
  setTempOutside("-10");
  setHeatLossCoeff("0.8");
  setResult4(null);
  setCalc4Type("heat_loss");
};



const getUnit4 = () => {
  switch(calc4Type) {
    case "heat_loss": return "Вт";
    case "volume": return "м³";
    case "coefficient": return "Вт/м³·K";
    case "temp_diff": return "°C";
    default: return "";
  }
};

const getFormula4 = () => {
  switch(calc4Type) {
    case "heat_loss": return "Q = V × k × ΔT";
    case "volume": return "V = Q / (k × ΔT)";
    case "coefficient": return "k = Q / (V × ΔT)";
    case "temp_diff": return "ΔT = Q / (V × k)";
    default: return "Q = V × k × ΔT";
  }
};



const renderInputs4 = () => {
  // Автоматический расчет разницы температур для наглядности
  const tempIn = parseFloat(tempInside) || 0;
  const tempOut = parseFloat(tempOutside) || 0;
  const deltaT = tempIn - tempOut;

  switch(calc4Type) {
    case "heat_loss":
      return (
        <>
          <input 
            type="number" 
            placeholder="Площадь помещения (м²)" 
            value={roomArea} 
            onChange={(e) => setRoomArea(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Высота потолков (м)" 
            value={roomHeight} 
            onChange={(e) => setRoomHeight(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          
          {/* НАГЛЯДНЫЙ БЛОК ДЛЯ ТЕМПЕРАТУР */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="font-medium text-white mb-3">📊 Температурные условия</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Внутри помещения, °C</label>
                <input 
                  type="number" 
                  placeholder="Пример: 22"
                  value={tempInside} 
                  onChange={(e) => setTempInside(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">Желаемая комнатная температура</p>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Снаружи (улица), °C</label>
                <input 
                  type="number" 
                  placeholder="Пример: -5"
                  value={tempOutside} 
                  onChange={(e) => setTempOutside(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">Минимальная уличная температура</p>
              </div>
            </div>
            
            {/* БЛОК, КОТОРЫЙ АВТОМАТИЧЕСКИ СЧИТАЕТ И ПОКАЗЫВАЕТ РАЗНИЦУ */}
            <div className="mt-4 p-3 bg-gray-900 rounded-lg text-center">
              <p className="text-sm text-gray-400">Расчетная разница температур (ΔT)</p>
              <p className="text-2xl font-bold text-cyan-400">
                {deltaT} °C
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Используется в формуле: <span className="font-mono">Q = V × k × ΔT</span>
              </p>
            </div>
          </div>
          {/* КОНЕЦ БЛОКА ТЕМПЕРАТУР */}

          <input 
            type="number" 
            placeholder="Коэффициент теплопотерь k (Вт/м³·K)" 
            value={heatLossCoeff} 
            onChange={(e) => setHeatLossCoeff(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <p className="text-sm text-gray-400">
            <span className="font-medium">Подсказка:</span> k ≈ 0.8 (новое утепление), 1.5 (среднее), 2.0+ (старый дом)
          </p>
        </>
      );
      
    case "volume":
      return (
        <>
          <input 
            type="number" 
            placeholder="Теплопотери Q (Вт)" 
            value={roomArea} 
            onChange={(e) => setRoomArea(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Коэффициент k (Вт/м³·K)" 
            value={heatLossCoeff} 
            onChange={(e) => setHeatLossCoeff(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          
          {/* Тот же наглядный блок для температур */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="font-medium text-white mb-3">📊 Температурные условия</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Внутри, °C</label>
                <input 
                  type="number" 
                  value={tempInside} 
                  onChange={(e) => setTempInside(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Снаружи, °C</label>
                <input 
                  type="number" 
                  value={tempOutside} 
                  onChange={(e) => setTempOutside(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-900 rounded-lg text-center">
              <p className="text-sm text-gray-400">Расчетная ΔT</p>
              <p className="text-xl font-bold text-cyan-400">{deltaT} °C</p>
            </div>
          </div>
        </>
      );
      
    case "coefficient":
      return (
        <>
          <input 
            type="number" 
            placeholder="Теплопотери Q (Вт)" 
            value={heatLossCoeff} 
            onChange={(e) => setHeatLossCoeff(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Площадь помещения (м²)" 
            value={roomArea} 
            onChange={(e) => setRoomArea(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Высота потолков (м)" 
            value={roomHeight} 
            onChange={(e) => setRoomHeight(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="font-medium text-white mb-3">📊 Температурные условия</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Внутри, °C</label>
                <input 
                  type="number" 
                  value={tempInside} 
                  onChange={(e) => setTempInside(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Снаружи, °C</label>
                <input 
                  type="number" 
                  value={tempOutside} 
                  onChange={(e) => setTempOutside(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-900 rounded-lg text-center">
              <p className="text-sm text-gray-400">Расчетная ΔT</p>
              <p className="text-xl font-bold text-cyan-400">{deltaT} °C</p>
            </div>
          </div>
        </>
      );
      
    case "temp_diff":
      return (
        <>
          <input 
            type="number" 
            placeholder="Теплопотери Q (Вт)" 
            value={tempInside} 
            onChange={(e) => setTempInside(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Площадь помещения (м²)" 
            value={roomArea} 
            onChange={(e) => setRoomArea(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Высота потолков (м)" 
            value={roomHeight} 
            onChange={(e) => setRoomHeight(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Коэффициент k (Вт/м³·K)" 
            value={heatLossCoeff} 
            onChange={(e) => setHeatLossCoeff(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" 
          />
          <p className="text-sm text-gray-400">
            Для этого расчета введите в поле "Теплопотери Q" желаемую мощность обогрева.
          </p>
        </>
      );
      
    default:
      return null;
  }
};

// === ФУНКЦИИ ДЛЯ КАЛЬКУЛЯТОРА 5 ===
const calculateFloorPower = useCallback(() => {
  const area = parseFloat(floorArea) || 0;
  
  // Базовая удельная мощность в зависимости от режима и покрытия (Вт/м²)
  // Явно указываем типы ключей
  const basePowerMap = {
    'comfort': { 'tile': 140, 'laminate': 110, 'linoleum': 120 },
    'primary': { 'tile': 180, 'laminate': 140, 'linoleum': 150 }
  } as const; // 'as const' фиксирует типы значений
  
  // Безопасное получение значения с проверкой типов
  let basePower = 130; // значение по умолчанию
  
  if (
    (heatingMode === 'comfort' || heatingMode === 'primary') &&
    (floorType === 'tile' || floorType === 'laminate' || floorType === 'linoleum')
  ) {
    // TypeScript теперь уверен в типах, ошибки не будет
    basePower = basePowerMap[heatingMode][floorType];
  }
  
  // Корректировка по температуре (примерная логика)
  const tempAdjustment = ((parseFloat(roomTemp) || 20) - 20) * 2;
  const adjustedSpecificPower = Math.max(basePower + tempAdjustment, 90);
  
  if (area > 0) {
    const totalPower = area * adjustedSpecificPower;
    setSpecificPower(adjustedSpecificPower);
    setFloorPowerResult(totalPower);
  } else {
    setSpecificPower(null);
    setFloorPowerResult(null);
  }
}, [floorArea, roomTemp, floorType, heatingMode]);

useEffect(() => {
  calculateFloorPower();
}, [calculateFloorPower]);

const resetFloorCalc = () => {
  setFloorArea("");
  setRoomTemp("20");
  setFloorType("tile"); // Здесь "tile" уже подходит под тип
  setHeatingMode("comfort");
  setFloorPowerResult(null);
  setSpecificPower(null);
};

const getFloorFormula = () => {
  return "P = S × q";
};

// === ФУНКЦИИ ДЛЯ КАЛЬКУЛЯТОРА 6 ===
const calculateBoilerPower = useCallback(() => {
  const load = parseFloat(totalHeatLoad) || 0; // Нагрузка в Вт
  const margin = parseFloat(safetyMargin) || 0; // Запас в %
  const efficiency = parseFloat(boilerEfficiency) || 100; // КПД в %

  // Проверяем, что все значения валидны и больше 0
  if (load > 0 && efficiency > 0 && efficiency <= 100) {
    // 1. Учитываем запас мощности
    const loadWithMargin = load * (1 + margin / 100);
    // 2. Учитываем КПД котла
    const requiredInputPower = loadWithMargin / (efficiency / 100);
    // 3. Переводим в кВт и округляем
    const resultInKw = Number((requiredInputPower / 1000).toFixed(2));

    // Проверяем, что результат - валидное число
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

useEffect(() => {
  calculateBoilerPower();
}, [calculateBoilerPower]);

const resetBoilerCalc = () => {
  setTotalHeatLoad("");
  setBoilerType("gas");
  setSafetyMargin("15");
  setBoilerEfficiency("92");
  setRecommendedBoilerPower(null);
  setFormulaDetails("");
};



// Функция для получения КПД по умолчанию в зависимости от типа котла
const getDefaultEfficiency = (type: string) => {
  const efficiencies: Record<string, string> = {
    'gas': '92',      // Современный газовый
    'electric': '99', // Электрический
    'solid': '85'     // Твердотопливный
  };
  return efficiencies[type] || '92';
};

// === ФУНКЦИИ ДЛЯ КАЛЬКУЛЯТОРА 7 ===
const calculateWaterHeater = useCallback(() => {
  const flowRate = parseFloat(waterConsumption) || 0; // Расход воды (л/мин)
  const tempIn = parseFloat(waterTempIn) || 10;
  const tempOut = parseFloat(waterTempOut) || 55;
  const time = parseFloat(heatingTime) || 60;
  
  // Константы
  const waterHeatCapacity = 1.16; // Теплоёмкость воды, Вт·ч/(л·К)
  const deltaTemp = tempOut - tempIn; // Разность температур
  
  if (deltaTemp > 0) {
    let result = 0;
    
    if (calculationMode === "volume") {
      // Расчёт необходимого объёма бойлера: V = (G × t) / 60
      // где G - расход (л/мин), t - время нагрева (мин)
      if (flowRate > 0 && time > 0) {
        result = (flowRate * time) / 60; // Переводим в литры в час -> литры
        // Увеличиваем на 15% для запаса
        result = result * 1.15;
      }
    } else {
      // Расчёт необходимой мощности: P = (V × c × ΔT) / t
      // где V - объём (л), c = 1.16, ΔT - разность температур, t - время (ч)
      const volume = flowRate; // В этом режиме flowRate - это объём в литрах
      if (volume > 0 && time > 0) {
        const timeHours = time / 60; // Переводим минуты в часы
        result = (volume * waterHeatCapacity * deltaTemp) / timeHours; // Результат в Вт
        result = result / 1000; // Переводим в кВт
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
 
// === ФУНКЦИЯ РАСЧЕТА ТЕПЛОПОТЕРЬ ===
const calculatePipeLoss = useCallback(() => {
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

// === АВТОМАТИЧЕСКИЙ РАСЧЕТ ПРИ ИЗМЕНЕНИИ ПАРАМЕТРОВ ===
useEffect(() => {
  calculatePipeLoss();
}, [calculatePipeLoss]);

// === ФУНКЦИЯ СБРОСА ВСЕХ ЗНАЧЕНИЙ ===
const resetPipeCalc = () => {
  setPipeDiameter("");
  setPipeLength("");
  setPipeTemp("70");
  setAmbientTemp("20");
  setInsulationThickness("0");
  setInsulationMaterial("mineral_wool");
  setPipeMaterial("steel");
  setPipeWallThickness("3");
  setPipeResult(null);
};

// === ФУНКЦИЯ ДЛЯ ФОРМИРОВАНИЯ РЕКОМЕНДАЦИЙ ===
const getInsulationAdvice = (recommended: number, current: number, material: string) => {
  const materialName = insulationMaterials[material as keyof typeof insulationMaterials]?.name || material;
  
  if (current === 0) return `Рекомендуется: ${recommended} мм ${materialName}`;
  if (current >= recommended) return `✓ Изоляция достаточна (${materialName})`;
  return `Увеличить до ${recommended} мм ${materialName}`;
};

// === ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ЦВЕТА МАТЕРИАЛА ===
const getMaterialColor = (material: string) => {
  const colors: Record<string, string> = {
    mineral_wool: "bg-yellow-500/20 text-yellow-300",
    polyurethane: "bg-blue-500/20 text-blue-300",
    foam_rubber: "bg-green-500/20 text-green-300",
    eps: "bg-purple-500/20 text-purple-300",
    basalt: "bg-red-500/20 text-red-300",
    aerogel: "bg-teal-500/20 text-teal-300",
    none: "bg-gray-500/20 text-gray-300"
  };
  return colors[material] || "bg-gray-500/20 text-gray-300";
};

// === ФУНКЦИЯ РАСЧЕТА ЭКОНОМИИ ===
const calculateSavings = (currentLoss: number, recommendedLoss: number, energyPrice: number = 5) => {
  const savingsPerYear = (currentLoss - recommendedLoss) * 8760 / 1000 * energyPrice;
  return {
    savingsPerYear: savingsPerYear.toFixed(0),
    percentage: recommendedLoss > 0 ? ((currentLoss - recommendedLoss) / currentLoss * 100).toFixed(0) : "0"
  };
};

return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
            {/* Шапка: кнопка "На главную" справа */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-end">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            На главную
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* ЗАГОЛОВОК */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">
            🔥 Калькуляторы теплотехники
          </h1>
        </div>

        {/* СЕТКА - 4 КАЛЬКУЛЯТОРА В ОДНОМ РЯДУ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* ========== КАЛЬКУЛЯТОР 1: Тепловая мощность ========== */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 relative">
            
            <button
              onClick={reset1}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-orange-500/20 transition-all duration-300 group"
              title="Сбросить значения"
            >
              <RefreshCw className="w-5 h-5 text-orange-400 group-hover:rotate-180 transition-transform duration-500" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-600/20 rounded-xl">
                <Flame className="w-7 h-7 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Тепловая мощность</h2>
            </div>
            
            <select 
              value={calc1Type} 
              onChange={(e) => setCalc1Type(e.target.value)} 
              className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
            >
              <option value="power">Найти мощность Q</option>
              <option value="mass">Найти массовый расход m</option>
              <option value="temp_diff">Найти ΔT</option>
              <option value="heat_cap">Найти теплоемкость c</option>
            </select>
            
            <div className="space-y-3 mb-4">
              {renderInputs1()}
            </div>

            <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-700 text-center">
              <p className="text-3xl font-bold text-orange-400">
                {result1 !== null ? result1.toFixed(2) : "0.00"}
              </p>
              <p className="text-gray-400 mt-2">{getUnit1()}</p>
              <div className="mt-4 text-sm text-gray-500">
               <span>Формула: {getFormula1()}</span>
               </div>
            </div>
          </div>
          {/* ========== КОНЕЦ КАЛЬКУЛЯТОРА 1 ========== */}

          {/* ========== КАЛЬКУЛЯТОР 2: КПД системы ========== */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 relative">
            
            <button
              onClick={reset2}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-blue-500/20 transition-all duration-300 group"
              title="Сбросить значения"
            >
              <RefreshCw className="w-5 h-5 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <Gauge className="w-7 h-7 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">КПД системы</h2>
            </div>
            
            <select 
              value={calc2Type} 
              onChange={(e) => setCalc2Type(e.target.value)} 
              className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
            >
              <option value="efficiency">Найти КПД η</option>
              <option value="useful_heat">Найти полезное тепло</option>
              <option value="fuel_energy">Найти затраченную энергию</option>
            </select>
            
            <div className="space-y-3 mb-4">
              {renderInputs2()}
            </div>

            <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-700 text-center">
              <p className="text-3xl font-bold text-blue-400">
                {result2 !== null ? result2.toFixed(2) : "0.00"}
              </p>
              <p className="text-gray-400 mt-2">{getUnit2()}</p>
              <div className="mt-4 text-sm text-gray-500">
               <span>Формула: {getFormula2()}</span>
             </div>
              {calc2Type === "efficiency" && result2 !== null && (
                <div className="mt-3">
                  {result2 > 90 && <p className="text-green-400 text-sm">Отличный КПД!</p>}
                  {result2 >= 70 && result2 <= 90 && <p className="text-yellow-400 text-sm">Хороший КПД</p>}
                  {result2 < 70 && <p className="text-red-400 text-sm">Низкий КПД</p>}
                </div>
              )}
            </div>
          </div>
          {/* ========== КОНЕЦ КАЛЬКУЛЯТОРА 2 ========== */}
          
            {/* ========== КАЛЬКУЛЯТОР 3: Расход теплоносителя ========== */}
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 relative">
    
    <button
      onClick={reset3}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-emerald-500/20 transition-all duration-300 group"
      title="Сбросить значения"
    >
      <RefreshCw className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
    </button>
    
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-emerald-600/20 rounded-xl">
        <Droplets className="w-7 h-7 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-white">Расход теплоносителя</h2>
    </div>
    
    <select 
      value={calc3Type} 
      onChange={(e) => setCalc3Type(e.target.value)} 
      className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
    >
      <option value="flow_rate">Найти расход G</option>
      <option value="heat_load">Найти тепловую нагрузку Q</option>
      <option value="temp_diff">Найти ΔT</option>
      <option value="specific_heat">Найти теплоемкость c</option>
    </select>
    
    <div className="space-y-3 mb-4">
      {renderInputs3()}
    </div>

    <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-700 text-center">
      <p className="text-3xl font-bold text-emerald-400">
        {result3 !== null ? result3.toFixed(2) : "0.00"}
      </p>
      <p className="text-gray-400 mt-2">{getUnit3()}</p>
      <div className="mt-4 text-sm text-gray-500">
        <span>Формула: {getFormula3()}</span>
</div>
    </div>
  </div>

  {/* ========== КАЛЬКУЛЯТОР 4: Теплопотери помещения ========== */}
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 relative">
    
    <button
      onClick={reset4}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-purple-500/20 transition-all duration-300 group"
      title="Сбросить значения"
    >
      <RefreshCw className="w-5 h-5 text-purple-400 group-hover:rotate-180 transition-transform duration-500" />
    </button>
    
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-purple-600/20 rounded-xl">
        <Home className="w-7 h-7 text-purple-500" />
      </div>
      <h2 className="text-2xl font-bold text-white">Теплопотери помещения</h2>
    </div>
    
    <select 
      value={calc4Type} 
      onChange={(e) => setCalc4Type(e.target.value)} 
      className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
    >
      <option value="heat_loss">Найти теплопотери Q</option>
      <option value="volume">Найти объем помещения V</option>
      <option value="coefficient">Найти коэффициент k</option>
      <option value="temp_diff">Найти ΔT</option>
    </select>
    
    <div className="space-y-3 mb-4">
      {renderInputs4()}
    </div>

    <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-700 text-center">
      <p className="text-3xl font-bold text-purple-400">
        {result4 !== null ? result4.toFixed(2) : "0.00"}
      </p>
      <p className="text-gray-400 mt-2">{getUnit4()}</p>
      <div className="mt-4 text-sm text-gray-500">
        <span>Формула: {getFormula4()}</span>
      </div>
      {calc4Type === "heat_loss" && result4 !== null && result4 > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-400">
            ≈ {(result4 / 1000).toFixed(2)} кВт
          </p>
        </div>
      )}
    </div>
  </div>

{/* ========== КАЛЬКУЛЯТОР 5: Мощность тёплого пола ========== */}
<div className="lg:col-span-1 col-span-full"> {/* ВАЖНО: Заменили классы */}
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-amber-500 transition-all duration-300 relative h-full">
    
    <button
      onClick={resetFloorCalc}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-amber-500/20 transition-all duration-300 group"
      title="Сбросить значения"
    >
      <RefreshCw className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
    </button>
    
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-amber-600/20 rounded-xl">
        <ThermometerSun className="w-7 h-7 text-amber-500" />
      </div>
      <h2 className="text-2xl font-bold text-white">Мощность тёплого пола</h2>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Площадь укладки (м²)
        </label>
        <input
          type="number"
          placeholder="Например: 15"
          value={floorArea}
          onChange={(e) => setFloorArea(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Желаемая температура в комнате (°C)
        </label>
        <input
          type="number"
          placeholder="20"
          value={roomTemp}
          onChange={(e) => setRoomTemp(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Тип напольного покрытия
        </label>
        <select
  value={floorType}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "tile" || value === "laminate" || value === "linoleum") {
      setFloorType(value);
    }
  }}
  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
>
          <option value="tile">Керамическая плитка</option>
          <option value="laminate">Ламинат / Паркет</option>
          <option value="linoleum">Линолеум / Ковролин</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Режим работы системы
        </label>
        <select
  value={heatingMode}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "comfort" || value === "primary") {
      setHeatingMode(value);
    }
  }}
  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
>
          <option value="comfort">Комфортный подогрев (+ к радиаторам)</option>
          <option value="primary">Основное отопление</option>
        </select>
      </div>
    </div>

    {/* Блок с результатом */}
    <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-700 text-center">
      <p className="text-3xl font-bold text-amber-400">
        {floorPowerResult !== null ? `${Math.round(floorPowerResult)} Вт` : "—"}
      </p>
      <p className="text-gray-400 mt-2">Общая мощность</p>
      
      {specificPower !== null && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-lg text-amber-300">
            {Math.round(specificPower)} Вт/м²
          </p>
          <p className="text-sm text-gray-400">Удельная мощность</p>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <span>Формула: {getFloorFormula()}</span>
        <p className="text-xs mt-1 text-gray-400">P — мощность, S — площадь, q — удельная мощность</p>
      </div>
    </div>
  </div>
</div>

{/* ========== КАЛЬКУЛЯТОР 6: Подбор котла ========== */}
<div className="lg:col-span-1 col-span-full">
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-slate-400 transition-all duration-300 relative h-full">
    
    <button
      onClick={resetBoilerCalc}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-slate-500/20 transition-all duration-300 group"
      title="Сбросить значения"
    >
      <RefreshCw className="w-5 h-5 text-slate-300 group-hover:rotate-180 transition-transform duration-500" />
    </button>
    
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-slate-700/50 rounded-xl">
        <Factory className="w-7 h-7 text-slate-300" />
      </div>
      <h2 className="text-2xl font-bold text-white">Подбор котла</h2>
    </div>
    
    <div className="space-y-4">
  {/* Улучшенный блок с инструкцией */}
  <div className="mb-4 p-4 bg-gray-800/40 rounded-lg border border-gray-700">
    <label className="block text-lg font-medium text-white mb-3">
      Шаг 1: Откуда взять это число?
    </label>
    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 mb-4">
      <li>Откройте <span className="text-purple-300">Калькулятор №4 «Теплопотери помещения»</span></li>
      <li>Заполните площадь, высоту, температуры</li>
      <li>Скопируйте число из результата (оно в <span className="font-mono">Вт</span>)</li>
      <li>Вставьте его в поле ниже</li>
    </ol>
    
    <label className="block text-sm text-gray-300 mb-2">
      Вставьте сюда результат расчёта теплопотерь (в ваттах):
    </label>
    <input
      type="number"
      placeholder="Пример: 6624"
      value={totalHeatLoad}
      onChange={(e) => setTotalHeatLoad(e.target.value)}
      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
    />
    
    {result4 !== null && (
      <button
        type="button"
        onClick={() => setTotalHeatLoad(Math.round(result4).toString())}
        className="mt-3 w-full text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
      >
        🎯 Использовать мои теплопотери ({Math.round(result4)} Вт)
      </button>
    )}
  </div>
  
  {/* Остальные поля калькулятора (тип котла, запас мощности, КПД) */}
  <div>
    <label className="block text-sm text-gray-300 mb-2">
      Тип котла
    </label>
    <select
  value={boilerType}
  onChange={(e) => {
    const value = e.target.value;
    // Явная проверка, что значение соответствует типу
    if (value === "gas" || value === "electric" || value === "solid") {
      setBoilerType(value);
      setBoilerEfficiency(getDefaultEfficiency(value));
    }
  }}
  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
>
      <option value="gas">Газовый котёл</option>
      <option value="electric">Электрический котёл</option>
      <option value="solid">Твердотопливный котёл</option>
    </select>
  </div>
      
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Запас мощности ({safetyMargin}%)
        </label>
        <input
          type="range"
          min="0"
          max="30"
          step="5"
          value={safetyMargin}
          onChange={(e) => setSafetyMargin(e.target.value)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>15%</span>
          <span>30%</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-gray-300 mb-2">
          КПД котла (%)
        </label>
        <input
          type="number"
          min="50"
          max="100"
          step="1"
          placeholder="92"
          value={boilerEfficiency}
          onChange={(e) => setBoilerEfficiency(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
        />
      </div>
    </div>

    {/* Блок с результатом */}
    <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-700 text-center">
      <p className="text-3xl font-bold text-slate-300">
        {recommendedBoilerPower !== null ? `${recommendedBoilerPower.toFixed(2)} кВт` : "—"}
      </p>
      <p className="text-gray-400 mt-2">Рекомендуемая мощность котла</p>
      
      {recommendedBoilerPower !== null && (
        <>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-300">
              Для {boilerType === 'gas' ? 'газового' : boilerType === 'electric' ? 'электрического' : 'твердотопливного'} котла
            </p>
            <p className="text-xs text-gray-400 mt-1">
              С учётом {safetyMargin}% запаса и КПД {boilerEfficiency}%
            </p>
          </div>
          
          {formulaDetails && (
            <div className="mt-4 text-xs text-gray-500 font-mono bg-gray-800 p-3 rounded">
              {formulaDetails}
            </div>
          )}
        </>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <span>P_котла = (P_нагр + запас) / (КПД / 100)</span>
      </div>
    </div>
  </div>
</div>

{/* ========== КАЛЬКУЛЯТОР 7: Расчёт водонагревателя ========== */}
<div className="lg:col-span-1 col-span-full">
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-sky-500 transition-all duration-300 relative h-full">
    
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
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}
      
      <div className="grid grid-cols-2 gap-4">
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
</div>

       {/* ========== КАЛЬКУЛЯТОР 8: Теплопотери трубопроводов ========== */}
<div className="lg:col-span-1 col-span-full">
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 relative h-full">
    
    <button
      onClick={resetPipeCalc}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-emerald-500/20 transition-all duration-300 group"
      title="Сбросить значения"
    >
      <RefreshCw className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
    </button>
    
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-emerald-600/20 rounded-xl">
        <GitMerge className="w-7 h-7 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-white">Теплопотери труб</h2>
    </div>
    
    <div className="space-y-4">
      {/* Основные параметры */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Диаметр трубы (мм)
          </label>
          <input
            type="number"
            placeholder="25, 32, 40"
            value={pipeDiameter}
            onChange={(e) => setPipeDiameter(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
            min="10"
            max="500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Длина участка (м)
          </label>
          <input
            type="number"
            placeholder="10, 15, 20"
            value={pipeLength}
            onChange={(e) => setPipeLength(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
            min="0.1"
            step="0.1"
          />
        </div>
      </div>
      
      {/* Температуры */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Температура в трубе (°C)
          </label>
          <input
            type="number"
            value={pipeTemp}
            onChange={(e) => setPipeTemp(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
            min="0"
            max="200"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Темп. окружения (°C)
          </label>
          <input
            type="number"
            value={ambientTemp}
            onChange={(e) => setAmbientTemp(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
            min="-30"
            max="40"
          />
        </div>
      </div>
      
      {/* Материал трубы */}
      <div className="bg-gray-900/50 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-white">
            Материал трубы
          </label>
          <div className="px-3 py-1 bg-gray-800 rounded-lg">
            <span className="text-sm text-emerald-400 font-bold">
              λ = {pipeMaterials[pipeMaterial as keyof typeof pipeMaterials]?.lambda.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400 ml-1">Вт/(м·K)</span>
          </div>
        </div>
        
        {/* Выбор материала трубы кнопками */}
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(pipeMaterials).map(([key, material]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPipeMaterial(key)}
              className={`p-2 rounded-lg border transition-all flex flex-col items-center justify-center ${
                pipeMaterial === key 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
              } ${material.color}`}
              title={`${material.name} (λ = ${material.lambda} Вт/(м·K))`}
            >
              <span className="text-lg mb-1">{material.icon}</span>
              <span className="text-xs font-medium truncate w-full text-center">
                {material.name}
              </span>
            </button>
          ))}
        </div>
        
        {/* Толщина стенки трубы */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm text-gray-300">
              Толщина стенки трубы
            </label>
            <span className="text-sm font-medium text-emerald-400">
              {pipeWallThickness} мм
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={pipeWallThickness}
            onChange={(e) => setPipeWallThickness(e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 мм</span>
            <span>5.5 мм</span>
            <span>10 мм</span>
          </div>
        </div>
      </div>
      
      {/* Изоляция */}
      <div className="bg-gray-900/50 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-white">
            Теплоизоляция
          </label>
          <div className={`px-3 py-1 rounded-lg ${insulationMaterials[insulationMaterial as keyof typeof insulationMaterials]?.color || 'bg-gray-800'}`}>
            <span className="text-sm font-bold">
              λ = {insulationMaterials[insulationMaterial as keyof typeof insulationMaterials]?.lambda.toFixed(3)}
            </span>
            <span className="text-xs ml-1">Вт/(м·K)</span>
          </div>
        </div>
        
        {/* Выбор материала изоляции */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">
            Материал изоляции
          </label>
          <select
            value={insulationMaterial}
            onChange={(e) => setInsulationMaterial(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none appearance-none"
          >
            {Object.entries(insulationMaterials).map(([key, material]) => (
              <option key={key} value={key} className="bg-gray-800">
                {material.name} (λ = {material.lambda.toFixed(3)} Вт/(м·K))
              </option>
            ))}
          </select>
        </div>
        
        {/* Толщина изоляции */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm text-gray-300">
              Толщина изоляции
            </label>
            <span className="text-sm font-medium text-emerald-400">
              {insulationThickness} мм
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={insulationThickness}
            onChange={(e) => setInsulationThickness(e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 мм</span>
            <span>50 мм</span>
            <span>100 мм</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {parseInt(insulationThickness) === 0 
              ? "⚠️ Без изоляции потери максимальны" 
              : `Текущая: ${insulationThickness} мм ${insulationMaterials[insulationMaterial as keyof typeof insulationMaterials]?.name}`}
          </p>
        </div>
      </div>
    </div>

    {/* Блок с результатом */}
    <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-700">
      {pipeResult ? (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {pipeResult.totalLoss.toFixed(0)} <span className="text-lg">Вт</span>
            </p>
            <p className="text-gray-400 text-sm">Общие потери тепла</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <p className="text-lg font-semibold text-emerald-300">
                {pipeResult.lossPerMeter.toFixed(1)} Вт/м
              </p>
              <p className="text-xs text-gray-400">На 1 метре</p>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <p className="text-lg font-semibold text-amber-300">
                {pipeResult.energyLossPerYear.toFixed(0)} кВт·ч
              </p>
              <p className="text-xs text-gray-400">Годовые потери</p>
            </div>
          </div>
          
          {/* Информация о сопротивлениях */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-blue-500/10 rounded">
              <p className="text-blue-300 font-medium">
                {pipeResult.pipeResistance > 0.001 
                  ? pipeResult.pipeResistance.toExponential(2) 
                  : pipeResult.pipeResistance.toFixed(4)}
              </p>
              <p className="text-xs text-blue-200">R трубы (K/W)</p>
            </div>
            <div className="text-center p-2 bg-yellow-500/10 rounded">
              <p className="text-yellow-300 font-medium">
                {pipeResult.insulationResistance > 0.001 
                  ? pipeResult.insulationResistance.toExponential(2) 
                  : pipeResult.insulationResistance.toFixed(4)}
              </p>
              <p className="text-xs text-yellow-200">R изоляции (K/W)</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Эффективность:</span>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                pipeResult.efficiency === "Высокая" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                pipeResult.efficiency === "Средняя" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}>
                {pipeResult.efficiency}
              </span>
            </div>
            
            <p className="text-sm text-gray-300 mb-3">
              {getInsulationAdvice(
                pipeResult.recommendedInsulation, 
                parseInt(insulationThickness),
                insulationMaterial
              )}
            </p>
            
            {/* Блок с экономией */}
            {parseInt(insulationThickness) < pipeResult.recommendedInsulation && (
              <div className="mt-3 p-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💰</span>
                  <p className="text-sm font-medium text-white">Экономический эффект:</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <p className="text-xl font-bold text-emerald-400">
                      {calculateSavings(pipeResult.totalLoss, pipeResult.totalLoss * 0.3).percentage}%
                    </p>
                    <p className="text-xs text-gray-300">Снижение потерь</p>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <p className="text-xl font-bold text-amber-400">
                      {calculateSavings(pipeResult.totalLoss, pipeResult.totalLoss * 0.3).savingsPerYear} ₽
                    </p>
                    <p className="text-xs text-gray-300">Экономия в год</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  *Расчет при цене тепловой энергии 5 руб/кВт·ч
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <GitMerge className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Введите параметры для расчёта</p>
          <p className="text-sm text-gray-500 mt-2">
            Укажите диаметр, длину и температуры
          </p>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-400 text-center">
          Q = (2πLΔT) / [ln(r₂/r₁)/λ₁ + ln(r₃/r₂)/λ₂] <br/>
          λ₁ - теплопроводность трубы, λ₂ - теплопроводность изоляции
        </p>
      </div>
    </div>
  </div>
</div>
       
        </div> {/* ========== КОНЕЦ СЕТКИ ========== */}

        {/* ПОДВАЛ */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            Набор тепловых калькуляторов для учёбы и работы!
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Добавь сайт в закладки чтобы не потерять
          </p>
        </div>
      </div>
    </div>
  );
}