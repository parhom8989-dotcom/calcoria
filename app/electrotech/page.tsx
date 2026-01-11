"use client";

import { useState, useEffect, } from "react";
import { Copy, RotateCcw, Home } from "lucide-react";

/* ---------- УТИЛИТЫ ---------- */
const convertToBase = (value: string, fromUnit: string) => {
  const v = parseFloat(value);
  if (isNaN(v)) return NaN;
  switch (fromUnit) {
    case "mV": return v / 1000;
    case "kV": return v * 1000;
    case "mA": return v / 1000;
    case "µA": return v / 1_000_000;
    case "kΩ": return v * 1000;
    case "MΩ": return v * 1_000_000;
    case "nF": return v * 1e-9;
    case "pF": return v * 1e-12;
    case "µF": return v * 1e-6;
    case "W": return v;
    case "kW": return v * 1000;
    default: return v;
  }
};

const convertFromBase = (value: number, toUnit: string) => {
  if (isNaN(value)) return NaN;
  switch (toUnit) {
    case "mV": return value * 1000;
    case "kV": return value / 1000;
    case "mA": return value * 1000;
    case "µA": return value * 1_000_000;
    case "kΩ": return value / 1000;
    case "MΩ": return value / 1_000_000;
    case "nF": return value * 1e9;
    case "pF": return value * 1e12;
    case "µF": return value * 1e6;
    case "W": return value;
    case "kW": return value / 1000;
    default: return value;
  }
};

const getNearestE24 = (value: number) => {
  const e24 = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];
  let v = value;
  let mult = 1;
  while (v >= 10) { v /= 10; mult *= 10; }
  while (v < 1) { v *= 10; mult /= 10; }
  const best = e24.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
  return (best * mult).toFixed(0);
};

const formatTime = (seconds: number): string => {
  if (seconds < 1e-6) {
    return `${(seconds * 1e9).toFixed(2)} нс`;
  } else if (seconds < 1e-3) {
    return `${(seconds * 1e6).toFixed(2)} мкс`;
  } else if (seconds < 1) {
    return `${(seconds * 1e3).toFixed(2)} мс`;
  } else if (seconds < 60) {
    return `${seconds.toFixed(2)} с`;
  } else if (seconds < 3600) {
    return `${(seconds / 60).toFixed(2)} мин`;
  } else {
    return `${(seconds / 3600).toFixed(2)} ч`;
  }
};

/* ---------- КЛИЕНТСКИЙ КОМПОНЕНТ ---------- */
export default function ElectrotechClient() {
  /* ==== 1. Закон Ома ==== */
  const [ohmType, setOhmType] = useState<"R" | "U" | "I">("R");
  const [U, setU] = useState("");
  const [I, setI] = useState("");
  const [R, setR] = useState("");
  const [UUnit, setUUnit] = useState("V");
  const [IUnit, setIUnit] = useState("A");
  const [RUnit, setRUnit] = useState("Ω");
  const [ohmResult, setOhmResult] = useState<number | null>(null);
  const [ohmError, setOhmError] = useState("");

  /* ==== 2. LED ==== */
  const [ledV, setLedV] = useState("");
  const [ledI, setLedI] = useState("");
  const [ledResult, setLedResult] = useState<number | null>(null);
  const [ledError, setLedError] = useState("");

  /* ==== 3. Делитель напряжения ==== */
  const [vin, setVin] = useState("");
  const [r1, setR1] = useState("");
  const [r2, setR2] = useState("");
  const [r1Unit, setR1Unit] = useState("Ω");
  const [r2Unit, setR2Unit] = useState("Ω");
  const [vout, setVout] = useState<number | null>(null);
  const [dividerError, setDividerError] = useState("");

  /* ==== 4. RC-фильтр ==== */
  const [rcR, setRcR] = useState("");
  const [rcC, setRcC] = useState("");
  const [rcRUnit, setRcRUnit] = useState("kΩ");
  const [rcCUnit, setRcCUnit] = useState("µF");
  const [rcTau, setRcTau] = useState<number | null>(null);
  const [rcFc, setRcFc] = useState<number | null>(null);
  const [rcError, setRcError] = useState("");

  /* ==== 5. Пусковой конденсатор ==== */
  const [motorV, setMotorV] = useState("");
  const [motorI, setMotorI] = useState("");
  const [motorFreq, setMotorFreq] = useState("50");
  const [motorCosPhi, setMotorCosPhi] = useState("0.9");
  const [motorCap, setMotorCap] = useState<number | null>(null);
  const [motorError, setMotorError] = useState("");

  /* ==== 6. Мощность DC/AC ==== */
  const [powerMode, setPowerMode] = useState<"DC" | "AC">("DC");
  const [powerP, setPowerP] = useState("");
  const [powerU, setPowerU] = useState("");
  const [powerI, setPowerI] = useState("");
  const [powerPUnit, setPowerPUnit] = useState("W");
  const [powerCosPhi, setPowerCosPhi] = useState("1");
  const [powerResult, setPowerResult] = useState<{ value: number; unit: string; label: string } | null>(null);
  const [powerError, setPowerError] = useState("");

  /* ==== 7. Параллельные резисторы ==== */
  const [parallelResistors, setParallelResistors] = useState<{ value: string; unit: string }[]>([
    { value: "", unit: "Ω" },
    { value: "", unit: "Ω" },
  ]);
  const [parallelResult, setParallelResult] = useState<{
    value: number;
    unit: string;
    inverseSum: number;
    e24List: string[];
  } | null>(null);
  const [parallelError, setParallelError] = useState("");

  /* ==== 8. Температура и мощность резистора ==== */
  const [resV, setResV] = useState("");
  const [resR, setResR] = useState("");
  const [resRUnit, setResRUnit] = useState("Ω");
  const [resPower, setResPower] = useState<number | null>(null);
  const [resCurrent, setResCurrent] = useState<number | null>(null);
  const [resTemp, setResTemp] = useState<number | null>(null);
  const [recommendedPower, setRecommendedPower] = useState("0.5");

  /* ==== 9. Ток короткого замыкания ==== */
  const [ikzU, setIkzU] = useState("230");
  const [ikzR, setIkzR] = useState("0.5");
  const [ikzIn, setIkzIn] = useState("");
  const [ikzResult, setIkzResult] = useState<number | null>(null);
  const [ikzAuto, setIkzAuto] = useState("16");

  /* ==== 10. Конденсаторы последовательно/параллельно ==== */
  const [caps, setCaps] = useState(["", ""]);
  const [capUnits, setCapUnits] = useState(["мкФ", "мкФ"]);
  const [capMode, setCapMode] = useState<"parallel"|"series">("parallel");
  const [totalCap, setTotalCap] = useState<number|null>(null);

    /* ==== 11. Таймер NE555 ==== */
  const [timerMode, setTimerMode] = useState<"astable"|"monostable">("astable");
  const [r1_555, setR1_555] = useState("1");
  const [r2_555, setR2_555] = useState("1");
  const [c_555, setC_555] = useState("1");
  const [r_mono, setR_mono] = useState("1");
  const [c_mono, setC_mono] = useState("1");
  // Единицы измерения для NE555
  const [r1Unit555, setR1Unit555] = useState("kΩ");
  const [r2Unit555, setR2Unit555] = useState("kΩ");
  const [cUnit555, setCUnit555] = useState("µF");
  const [rUnitMono, setRUnitMono] = useState("kΩ");
  const [cUnitMono, setCUnitMono] = useState("µF");
  const [result555, setResult555] = useState<{
    freq?: number;
    period?: number;
    highTime?: number;
    lowTime?: number;
    duty?: number;
    time?: number;
  } | null>(null);


  /* ==== 12. СЕТЕВОЙ ТРАНСФОРМАТОР ==== */
  const [transformerType, setTransformerType] = useState<"calculateWires" | "calculateCore">("calculateWires");
  const [transformerPower, setTransformerPower] = useState("50");
  const [primaryVoltage, setPrimaryVoltage] = useState("220");
  const [secondaryVoltage, setSecondaryVoltage] = useState("12");
  const [coreArea, setCoreArea] = useState("5");
  const [magneticInduction, setMagneticInduction] = useState("1.2");
  const [transformerResult, setTransformerResult] = useState<{
    primaryTurns?: number;
    secondaryTurns?: number;
    primaryCurrent?: number;
    secondaryCurrent?: number;
    primaryWireDiameter?: number;
    secondaryWireDiameter?: number;
    coreAreaResult?: number;
    windowArea?: number;
  } | null>(null);

  /* ---------- ФУНКЦИИ ДЛЯ КОНДЕНСАТОРОВ ---------- */
  const addCap = () => setCaps([...caps, ""]);
  const removeCap = (i:number) => setCaps(caps.filter((_,idx)=>idx!==i));
  const updateCap = (i:number, val:string) => { const a=[...caps]; a[i]=val; setCaps(a); };
  const updateUnit = (i:number, unit:string) => { const a=[...capUnits]; a[i]=unit; setCapUnits(a); };

  const calcCaps = () => {
    const values = caps.map((v,i) => parseFloat(v) || 0).map((v,i) => v * (capUnits[i]==="пФ"?1e-12:capUnits[i]==="нФ"?1e-9:1e-6));
    if (values.every(v=>v===0)) return setTotalCap(null);
    const result = capMode==="parallel" 
      ? values.reduce((a,b)=>a+b,0) 
      : 1/values.filter(v=>v>0).reduce((a,b)=>a+1/b,0);
    setTotalCap(result);
  };

  const formatCap = (val:number) => val>=1e-3 ? `${(val*1e6).toFixed(2)} мкФ` : val>=1e-6 ? `${(val*1e9).toFixed(2)} нФ` : `${(val*1e12).toFixed(0)} пФ`;

  /* ---------- ФУНКЦИИ ДЛЯ NE555 ---------- */
  const calcNE555 = () => {
    if (timerMode === "astable") {
      const R1 = parseFloat(r1_555) || 0;
      const R2 = parseFloat(r2_555) || 0;
      const C = parseFloat(c_555) || 0;
      
      if (R1 > 0 && R2 > 0 && C > 0) {
        // Конвертируем кОм в Ом и мкФ в Ф
        const R1_ohm = R1 * 1000;
        const R2_ohm = R2 * 1000;
        const C_farad = C * 1e-6;
        
        // Правильные формулы для NE555 в астабильном режиме
        const period = 0.693 * (R1_ohm + 2 * R2_ohm) * C_farad;
        const freq = 1.44 / ((R1_ohm + 2 * R2_ohm) * C_farad);
        const highTime = 0.693 * (R1_ohm + R2_ohm) * C_farad;
        const lowTime = 0.693 * R2_ohm * C_farad;
        const dutyCycle = (highTime / period) * 100;
        
        setResult555({ 
          freq: freq,
          period: period,
          highTime: highTime,
          lowTime: lowTime,
          duty: dutyCycle 
        });
      } else {
        setResult555(null);
      }
    } else {
      const R = parseFloat(r_mono) || 0;
      const C = parseFloat(c_mono) || 0;
      
      if (R > 0 && C > 0) {
        // Конвертируем кОм в Ом и мкФ в Ф
        const R_ohm = R * 1000;
        const C_farad = C * 1e-6;
        
        // Правильная формула для моностабильного режима
        const pulseWidth = 1.1 * R_ohm * C_farad;
        
        setResult555({ 
          time: pulseWidth
        });
      } else {
        setResult555(null);
      }
    }
  };

  /* ---------- ФУНКЦИЯ ДЛЯ ТОКА КЗ ---------- */
  const calcIKZ = () => {
    const U = parseFloat(ikzU) || 230;
    const R = parseFloat(ikzR) || 0;
    const In = parseFloat(ikzIn) || 0;

    if (R <= 0 || isNaN(R)) {
      setIkzResult(null);
      setIkzAuto("—");
      return;
    }

    const Iкз = Math.round(U / R);
    const autos = [6,10,16,20,25,32,40,50,63,80,100,125];
    const recommended = In === 0 ? 16 : autos.find(a => a >= In * 1.45) || 125;

    setIkzResult(Iкз);
    setIkzAuto(recommended.toString());
  };

  /* ---------- ОСНОВНЫЕ РАСЧЁТЫ ---------- */
  const calcOhm = () => {
    setOhmError("");
    setOhmResult(null);
    const u = convertToBase(U, UUnit);
    const i = convertToBase(I, IUnit);
    const r = convertToBase(R, RUnit);
    const hasU = !isNaN(u) && U !== "";
    const hasI = !isNaN(i) && I !== "";
    const hasR = !isNaN(r) && R !== "";

    if (ohmType === "R" && hasU && hasI) {
      if (i === 0) return setOhmError("Ток не может быть 0");
      setOhmResult(u / i);
    } else if (ohmType === "U" && hasI && hasR) {
      setOhmResult(r * i);
    } else if (ohmType === "I" && hasU && hasR) {
      if (r === 0) return setOhmError("Сопротивление не может быть 0");
      setOhmResult(u / r);
    } else {
      setOhmError("Введите два значения");
    }
  };

  const calcLed = () => {
    setLedError("");
    const v = parseFloat(ledV);
    const i = parseFloat(ledI) / 1000;
    if (!isNaN(v) && !isNaN(i) && i !== 0) {
      setLedResult(v / i);
    } else {
      setLedError(i === 0 ? "Ток не может быть 0" : "Введите корректные числа");
      setLedResult(null);
    }
  };

  const calcDivider = () => {
    setDividerError("");
    const vinVal = parseFloat(vin);
    const r1Val = convertToBase(r1, r1Unit);
    const r2Val = convertToBase(r2, r2Unit);
    if (!isNaN(vinVal) && !isNaN(r1Val) && !isNaN(r2Val) && (r1Val + r2Val) !== 0) {
      setVout(vinVal * r2Val / (r1Val + r2Val));
    } else {
      setDividerError((r1Val + r2Val) === 0 ? "Сумма R не может быть 0" : "Введите корректные числа");
      setVout(null);
    }
  };

  const calcRC = () => {
    setRcError("");
    const R = convertToBase(rcR, rcRUnit);
    const C = convertToBase(rcC, rcCUnit);
    if (!isNaN(R) && !isNaN(C) && R !== 0 && C !== 0) {
      const tau = R * C;
      const fc = 1 / (2 * Math.PI * tau);
      setRcTau(tau);
      setRcFc(fc);
    } else {
      setRcError("Введите корректные R и C");
      setRcTau(null);
      setRcFc(null);
    }
  };

  const calcMotorCap = () => {
    setMotorError("");
    const V = parseFloat(motorV);
    const I = parseFloat(motorI);
    const f = parseFloat(motorFreq);
    const cosPhi = parseFloat(motorCosPhi);
    if (!isNaN(V) && !isNaN(I) && !isNaN(f) && !isNaN(cosPhi) && I !== 0 && f !== 0 && cosPhi !== 0 && cosPhi <= 1) {
      const cap = (I / (2 * Math.PI * f * V * cosPhi)) * 1_000_000;
      setMotorCap(cap);
    } else {
      setMotorError("Введите корректные значения (cos φ ≤ 1)");
      setMotorCap(null);
    }
  };

  const calcPower = () => {
    setPowerError("");
    const P = convertToBase(powerP, powerPUnit);
    const U = parseFloat(powerU);
    const I = parseFloat(powerI);
    const cosPhi = parseFloat(powerCosPhi) || 1;

    if (isNaN(cosPhi) || cosPhi < 0 || cosPhi > 1) {
      return setPowerError("cos φ должен быть от 0 до 1");
    }

    const known = [!isNaN(P), !isNaN(U), !isNaN(I)].filter(Boolean).length;
    if (known < 2) {
      setPowerResult(null);
      return;
    }

    let result;
    if (powerMode === "DC") {
      if (!isNaN(P) && !isNaN(U)) result = { value: P / U, unit: "А", label: "I = P / U" };
      else if (!isNaN(P) && !isNaN(I)) result = { value: P / I, unit: "В", label: "U = P / I" };
      else if (!isNaN(U) && !isNaN(I)) result = { value: U * I, unit: powerPUnit, label: "P = U × I" };
    } else {
      if (!isNaN(P) && !isNaN(U)) result = { value: P / (U * cosPhi), unit: "А", label: "I = P / (U × cos φ)" };
      else if (!isNaN(P) && !isNaN(I)) result = { value: P / (I * cosPhi), unit: "В", label: "U = P / (I × cos φ)" };
      else if (!isNaN(U) && !isNaN(I)) result = { value: U * I * cosPhi, unit: powerPUnit, label: "P = U × I × cos φ" };
    }

    if (result && !isNaN(result.value)) {
      setPowerResult(result);
    } else {
      setPowerError("Некорректные данные");
      setPowerResult(null);
    }
  };

  const calcParallel = () => {
    setParallelError("");
    const values = parallelResistors
      .map(r => convertToBase(r.value, r.unit))
      .filter(v => !isNaN(v) && v > 0);

    if (values.length < 2) {
      setParallelResult(null);
      return;
    }

    const inverseSum = values.reduce((sum, r) => sum + 1 / r, 0);
    const totalR = 1 / inverseSum;

    let unit = "Ω";
    let displayR = totalR;
    if (totalR >= 1_000_000) { displayR /= 1_000_000; unit = "MΩ"; }
    else if (totalR >= 1000) { displayR /= 1000; unit = "kΩ"; }

    const e24List = parallelResistors
      .filter(r => r.value !== "")
      .map(r => `${getNearestE24(convertToBase(r.value, r.unit))} ${r.unit}`);

    setParallelResult({
      value: displayR,
      unit,
      inverseSum,
      e24List,
    });
  };

  const calcResistorHeat = () => {
    const U = parseFloat(resV);
    const R = convertToBase(resR, resRUnit);
    if (isNaN(U) || isNaN(R) || R <= 0) {
      setResPower(null);
      setResCurrent(null);
      setResTemp(null);
      return;
    }

    const P = (U * U) / R;                    // мощность, Вт
    const I = (U / R) * 1000;                  // ток, мА
    const tempRise = P * 90;                   // средний нагрев ~90 °C на 1 Вт
    const temp = 25 + tempRise;                // от комнатной температуры

    const powers = [0.125, 0.25, 0.5, 1, 2, 5, 10];
    const recommended = powers.find(p => p >= P * 1.5) || 10;

    setResPower(P);
    setResCurrent(I);
    setResTemp(temp);
    setRecommendedPower(recommended.toString());
  };

  /* ---------- АВТО-РАСЧЁТЫ ---------- */
  useEffect(() => { if (U || I || R) calcOhm(); }, [U, I, R, ohmType, UUnit, IUnit, RUnit]);
  useEffect(() => { if (ledV || ledI) calcLed(); }, [ledV, ledI]);
  useEffect(() => { if (vin || r1 || r2) calcDivider(); }, [vin, r1, r2, r1Unit, r2Unit]);
  useEffect(() => { if (rcR || rcC) calcRC(); }, [rcR, rcC, rcRUnit, rcCUnit]);
  useEffect(() => { if (motorV || motorI || motorFreq || motorCosPhi) calcMotorCap(); }, [motorV, motorI, motorFreq, motorCosPhi]);
  useEffect(() => { if (powerP || powerU || powerI || powerCosPhi) calcPower(); }, [powerP, powerU, powerI, powerPUnit, powerCosPhi, powerMode]);
  useEffect(() => { calcParallel(); }, [parallelResistors]);
  useEffect(() => { calcResistorHeat(); }, [resV, resR, resRUnit]);
  useEffect(() => { calcIKZ(); }, [ikzU, ikzR, ikzIn]);
  useEffect(() => { calcCaps(); }, [caps, capUnits, capMode]);
  useEffect(() => { calcNE555(); }, [timerMode, r1_555, r2_555, c_555, r_mono, c_mono]);
  useEffect(() => { calcCaps(); }, [caps, capUnits, capMode]);

  // ========== USEFFECT ДЛЯ NE555 ==========
  useEffect(() => {
    const convertResistorToOhms = (value: number, unit: string): number => {
      switch (unit) {
        case "Ω": return value;
        case "kΩ": return value * 1000;
        case "MΩ": return value * 1000000;
        default: return value;
      }
    };

    const convertCapacitorToFarads = (value: number, unit: string): number => {
      switch (unit) {
        case "pF": return value * 1e-12;
        case "nF": return value * 1e-9;
        case "µF": return value * 1e-6;
        case "mF": return value * 1e-3;
        default: return value;
      }
    };

    if (timerMode === "astable") {
      const R1_val = parseFloat(r1_555) || 0;
      const R2_val = parseFloat(r2_555) || 0;
      const C_val = parseFloat(c_555) || 0;
      
      if (R1_val > 0 && R2_val > 0 && C_val > 0) {
        const R1_ohm = convertResistorToOhms(R1_val, r1Unit555);
        const R2_ohm = convertResistorToOhms(R2_val, r2Unit555);
        const C_farad = convertCapacitorToFarads(C_val, cUnit555);
        
        const period = 0.693 * (R1_ohm + 2 * R2_ohm) * C_farad;
        const freq = 1.44 / ((R1_ohm + 2 * R2_ohm) * C_farad);
        const highTime = 0.693 * (R1_ohm + R2_ohm) * C_farad;
        const lowTime = 0.693 * R2_ohm * C_farad;
        const dutyCycle = (highTime / period) * 100;
        
        setResult555({ 
          freq: freq,
          period: period,
          highTime: highTime,
          lowTime: lowTime,
          duty: dutyCycle 
        });
      } else {
        setResult555(null);
      }
    } else {
      const R_val = parseFloat(r_mono) || 0;
      const C_val = parseFloat(c_mono) || 0;
      
      if (R_val > 0 && C_val > 0) {
        const R_ohm = convertResistorToOhms(R_val, rUnitMono);
        const C_farad = convertCapacitorToFarads(C_val, cUnitMono);
        const pulseWidth = 1.1 * R_ohm * C_farad;
        
        setResult555({ 
          time: pulseWidth
        });
      } else {
        setResult555(null);
      }
    }
  }, [timerMode, r1_555, r2_555, c_555, r_mono, c_mono, r1Unit555, r2Unit555, cUnit555, rUnitMono, cUnitMono]);

// ========== ФУНКЦИЯ РАСЧЕТА ТРАНСФОРМАТОРА ==========
 const calculateTransformer = () => {
  console.log("РАСЧЕТ ТРАНСФОРМАТОРА ЗАПУЩЕН");
  
  const P = parseFloat(transformerPower) || 50;
  const U1 = parseFloat(primaryVoltage) || 220;
  const U2 = parseFloat(secondaryVoltage) || 12;
  const S = parseFloat(coreArea) || 5;
  const B = parseFloat(magneticInduction) || 1.2;

  console.log("Параметры:", { P, U1, U2, S, B, type: transformerType });

  if (transformerType === "calculateWires") {
    // Расчет числа витков на вольт
    const wPerVolt = 50 / (B * S); // формула для 50Гц
    
    const primaryTurns = Math.round(wPerVolt * U1);
    const secondaryTurns = Math.round(wPerVolt * U2 * 1.05); // +5% на потери
    
    // Расчет токов
    const primaryCurrent = P / U1;
    const secondaryCurrent = P / U2;
    
    // Расчет диаметров проводов (плотность тока 2.5 А/мм²)
    const primaryWireDiameter = Math.sqrt(primaryCurrent / 2.5 / Math.PI) * 2; // в мм
    const secondaryWireDiameter = Math.sqrt(secondaryCurrent / 2.5 / Math.PI) * 2; // в мм
    
    // Расчет площади окна
    const windowArea = S * 2.5; // эмпирическая формула
    
    console.log("Результат обмоток:", { 
      primaryTurns, 
      secondaryTurns,
      primaryWireDiameter,
      secondaryWireDiameter 
    });
    
    setTransformerResult({
      primaryTurns,
      secondaryTurns,
      primaryCurrent,
      secondaryCurrent,
      primaryWireDiameter,
      secondaryWireDiameter,
      windowArea
    });
  } else {
    // Расчет сечения сердечника по мощности
    const S_calculated = 1.2 * Math.sqrt(P); // эмпирическая формула
    
    console.log("Результат сердечника:", S_calculated);
    
    setTransformerResult({
      coreAreaResult: S_calculated
    });
  }
};

  
  // ========== РАСЧЕТ ТРАНСФОРМАТОРА ==========
  useEffect(() => {
console.log("useEffect ДЛЯ ТРАНСФОРМАТОРА СРАБОТАЛ!");
    calculateTransformer();
  }, [transformerType, transformerPower, primaryVoltage, secondaryVoltage, coreArea, magneticInduction]);

  // Функция копирования в буфер обмена
  const copyToClipboard = (text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-10">
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
      <h1 className="text-3xl font-bold text-center mb-10">Электротехнические калькуляторы</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">

        {/* ========== 1. ЗАКОН ОМА ========== */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:border-blue-500 transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Закон Ома</h2>
            <button onClick={() => { setOhmType("R"); setU(""); setI(""); setR(""); setOhmResult(null); setOhmError(""); }} className="text-gray-400 hover:text-white"><RotateCcw size={20} /></button>
          </div>
          <select value={ohmType} onChange={(e) => setOhmType(e.target.value as any)} className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white">
            <option value="R">Найти сопротивление R</option>
            <option value="U">Найти напряжение U</option>
            <option value="I">Найти ток I</option>
          </select>
          {ohmType !== "U" && (
            <div className="flex gap-2 mb-3">
              <input type="number" placeholder="U" value={U} onChange={(e) => setU(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
              <select value={UUnit} onChange={(e) => setUUnit(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white">
                <option value="V">В</option>
                <option value="mV">мВ</option>
                <option value="kV">кВ</option>
              </select>
            </div>
          )}
          {ohmType !== "I" && (
            <div className="flex gap-2 mb-3">
              <input type="number" placeholder="I" value={I} onChange={(e) => setI(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
              <select value={IUnit} onChange={(e) => setIUnit(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white">
                <option value="A">А</option>
                <option value="mA">мА</option>
                <option value="µA">мкА</option>
              </select>
            </div>
          )}
          {ohmType !== "R" && (
            <div className="flex gap-2 mb-3">
              <input type="number" placeholder="R" value={R} onChange={(e) => setR(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
              <select value={RUnit} onChange={(e) => setRUnit(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white">
                <option value="Ω">Ом</option>
                <option value="kΩ">кОм</option>
                <option value="MΩ">МОм</option>
              </select>
            </div>
          )}
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center">
            {ohmError ? <p className="text-red-400">{ohmError}</p> : ohmResult !== null ? (
              <>
                <p className="text-3xl font-bold text-blue-400">{convertFromBase(ohmResult, ohmType === "U" ? UUnit : ohmType === "I" ? IUnit : RUnit).toFixed(3)}</p>
                <p className="text-gray-300">{ohmType === "U" ? UUnit : ohmType === "I" ? IUnit : RUnit}</p>
                <button onClick={() => copyToClipboard(convertFromBase(ohmResult, ohmType === "U" ? UUnit : ohmType === "I" ? IUnit : RUnit).toFixed(3))} className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"><Copy size={14} /> копировать</button>
              </>
            ) : <p className="text-gray-500">Введите два значения</p>}
          </div>
        </div>

        {/* ========== 2. LED ========== */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-green-500 transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Резистор для LED</h2>
            <button onClick={() => { setLedV(""); setLedI(""); setLedResult(null); setLedError(""); }} className="text-gray-400 hover:text-white"><RotateCcw size={20} /></button>
          </div>
          <input type="number" placeholder="Напряжение питания (В)" value={ledV} onChange={(e) => setLedV(e.target.value)} className="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
          <div className="flex gap-2 mb-4">
            <input type="number" placeholder="Ток LED (мА)" value={ledI} onChange={(e) => setLedI(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <div className="p-3 rounded-lg bg-gray-700 text-white flex items-center">мА</div>
          </div>
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center">
            {ledError ? <p className="text-red-400">{ledError}</p> : ledResult !== null ? (
              <>
                <p className="text-3xl font-bold text-green-400">{ledResult.toFixed(0)} Ω</p>
                <p className="text-gray-300 text-sm">E24: {getNearestE24(ledResult)} Ω</p>
                <button onClick={() => copyToClipboard(ledResult.toFixed(0))} className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"><Copy size={14} /> копировать</button>
              </>
            ) : <p className="text-gray-500">Введите напряжение и ток</p>}
          </div>
        </div>

        {/* ========== 3. ДЕЛИТЕЛЬ НАПРЯЖЕНИЯ ========== */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-purple-500 transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Делитель напряжения</h2>
            <button onClick={() => { setVin(""); setR1(""); setR2(""); setVout(null); setDividerError(""); }} className="text-gray-400 hover:text-white"><RotateCcw size={20} /></button>
          </div>
          <input type="number" placeholder="Входное напряжение (В)" value={vin} onChange={(e) => setVin(e.target.value)} className="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
          <div className="flex gap-2 mb-3">
            <input type="number" placeholder="R1" value={r1} onChange={(e) => setR1(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <select value={r1Unit} onChange={(e) => setR1Unit(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white">
              <option value="Ω">Ом</option>
              <option value="kΩ">кОм</option>
              <option value="MΩ">МОм</option>
            </select>
          </div>
          <div className="flex gap-2 mb-4">
            <input type="number" placeholder="R2" value={r2} onChange={(e) => setR2(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <select value={r2Unit} onChange={(e) => setR2Unit(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white">
              <option value="Ω">Ом</option>
              <option value="kΩ">кОм</option>
              <option value="MΩ">МОм</option>
            </select>
          </div>
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center">
            {dividerError ? <p className="text-red-400">{dividerError}</p> : vout !== null ? (
              <>
                <p className="text-3xl font-bold text-purple-400">{vout.toFixed(3)} В</p>
                <p className="text-gray-300 text-sm mt-1">R1 ≈ {getNearestE24(convertToBase(r1, r1Unit))} {r1Unit} | R2 ≈ {getNearestE24(convertToBase(r2, r2Unit))} {r2Unit}</p>
                <button onClick={() => copyToClipboard(vout.toFixed(3))} className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"><Copy size={14} /> копировать</button>
              </>
            ) : <p className="text-gray-500">Введите Vin, R1, R2</p>}
          </div>
        </div>

        {/* ========== 4. RC-ФИЛЬТР ========== */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-teal-500 transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">RC-фильтр</h2>
            <button onClick={() => { setRcR(""); setRcC(""); setRcTau(null); setRcFc(null); setRcError(""); }} className="text-gray-400 hover:text-white"><RotateCcw size={20} /></button>
          </div>
          <div className="flex gap-2 mb-3">
            <input type="number" placeholder="R" value={rcR} onChange={(e) => setRcR(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <select value={rcRUnit} onChange={(e) => setRcRUnit(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white">
              <option value="Ω">Ом</option>
              <option value="kΩ">кОм</option>
              <option value="MΩ">МОм</option>
            </select>
          </div>
          <div className="flex gap-2 mb-4">
            <input type="number" placeholder="C" value={rcC} onChange={(e) => setRcC(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <select value={rcCUnit} onChange={(e) => setRcCUnit(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white">
              <option value="µF">мкФ</option>
              <option value="nF">нФ</option>
              <option value="pF">пФ</option>
            </select>
          </div>
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center">
            {rcError ? <p className="text-red-400">{rcError}</p> : rcTau !== null ? (
              <>
                <p className="text-2xl font-bold text-teal-400">τ = {(rcTau * 1000).toFixed(3)} мс</p>
                <p className="text-lg text-teal-300">fc = {rcFc!.toFixed(1)} Гц</p>
                <p className="text-gray-300 text-sm mt-2">R ≈ {getNearestE24(convertToBase(rcR, rcRUnit))} {rcRUnit}</p>
                <button onClick={() => copyToClipboard(`τ=${(rcTau * 1000).toFixed(3)}мс, fc=${rcFc!.toFixed(1)}Гц`)} className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"><Copy size={14} /> копировать</button>
              </>
            ) : <p className="text-gray-500">Введите R и C</p>}
          </div>
        </div>

        {/* ========== 5. ПУСКОВОЙ КОНДЕНСАТОР ========== */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-orange-500 transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Пусковой конденсатор для электродвигателя</h2>
            <button onClick={() => { setMotorV(""); setMotorI(""); setMotorFreq("50"); setMotorCosPhi("0.9"); setMotorCap(null); setMotorError(""); }} className="text-gray-400 hover:text-white"><RotateCcw size={20} /></button>
          </div>
          <input type="number" placeholder="Напряжение V (В)" value={motorV} onChange={(e) => setMotorV(e.target.value)} className="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
          <input type="number" placeholder="Ток I (А)" value={motorI} onChange={(e) => setMotorI(e.target.value)} className="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
          <div className="flex gap-2 mb-3">
            <input type="number" placeholder="Частота f (Гц)" value={motorFreq} onChange={(e) => setMotorFreq(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <div className="p-3 rounded-lg bg-gray-700 text-white flex items-center">Гц</div>
          </div>
          <div className="flex gap-2 mb-4">
            <input type="number" step="0.01" placeholder="cos φ (0.8–0.95)" value={motorCosPhi} onChange={(e) => setMotorCosPhi(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <div className="p-3 rounded-lg bg-gray-700 text-white flex items-center">(коэф. мощности)</div>
          </div>
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center">
            {motorError ? <p className="text-red-400">{motorError}</p> : motorCap !== null ? (
              <>
                <p className="text-3xl font-bold text-orange-400">{motorCap.toFixed(2)} мкФ</p>
                <p className="text-gray-300 text-sm mt-1">C = I / (2π f V cos φ)</p>
                <button onClick={() => copyToClipboard(motorCap.toFixed(2))} className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"><Copy size={14} /> копировать</button>
              </>
            ) : <p className="text-gray-500">Введите V, I, f, cos φ</p>}
          </div>
        </div>

        {/* ========== 6. МОЩНОСТЬ DC/AC ========== */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-cyan-500 transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Мощность, ток, напряжение</h2>
            <button onClick={() => { setPowerMode("DC"); setPowerP(""); setPowerU(""); setPowerI(""); setPowerCosPhi("1"); setPowerResult(null); setPowerError(""); }} className="text-gray-400 hover:text-white"><RotateCcw size={20} /></button>
          </div>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setPowerMode("DC")} className={`flex-1 p-2 rounded-lg font-medium transition ${powerMode === "DC" ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-300"}`}>Постоянный</button>
            <button onClick={() => setPowerMode("AC")} className={`flex-1 p-2 rounded-lg font-medium transition ${powerMode === "AC" ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-300"}`}>Переменный</button>
          </div>
          <div className="flex gap-2 mb-3">
            <input type="number" placeholder="Мощность P" value={powerP} onChange={(e) => setPowerP(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <select value={powerPUnit} onChange={(e) => setPowerPUnit(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white">
              <option value="W">Вт</option>
              <option value="kW">кВт</option>
            </select>
          </div>
          <div className="flex gap-2 mb-3">
            <input type="number" placeholder="Напряжение U" value={powerU} onChange={(e) => setPowerU(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <div className="p-3 rounded-lg bg-gray-700 text-white flex items-center">В</div>
          </div>
          <div className="flex gap-2 mb-3">
            <input type="number" placeholder="Ток I" value={powerI} onChange={(e) => setPowerI(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            <div className="p-3 rounded-lg bg-gray-700 text-white flex items-center">А</div>
          </div>
          {powerMode === "AC" && (
            <div className="flex gap-2 mb-4">
              <input type="number" step="0.01" min="0" max="1" placeholder="cos φ" value={powerCosPhi} onChange={(e) => setPowerCosPhi(e.target.value)} className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
              <div className="p-3 rounded-lg bg-gray-700 text-white flex items-center">(0.1–1)</div>
            </div>
          )}
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center">
            {powerError ? <p className="text-red-400">{powerError}</p> : powerResult ? (
              <>
                <p className="text-3xl font-bold text-cyan-400">{powerResult.value.toFixed(3)} {powerResult.unit}</p>
                <p className="text-gray-300 text-sm mt-1">{powerResult.label}</p>
                <button onClick={() => copyToClipboard(powerResult.value.toFixed(3))} className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"><Copy size={14} /> копировать</button>
              </>
            ) : <p className="text-gray-500">Введите любые два значения</p>}
          </div>
        </div>

        {/* ========== 7. ПАРАЛЛЕЛЬНЫЕ РЕЗИСТОРЫ ========== */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-indigo-500 transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Параллельные резисторы</h2>
            <button
              onClick={() => {
                setParallelResistors([{ value: "", unit: "Ω" }, { value: "", unit: "Ω" }]);
                setParallelResult(null);
                setParallelError("");
              }}
              className="text-gray-400 hover:text-white"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <div className="space-y-3 mb-4">
            {parallelResistors.map((res, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder={`R${index + 1}`}
                  value={res.value}
                  onChange={(e) => {
                    const newRes = [...parallelResistors];
                    newRes[index].value = e.target.value;
                    setParallelResistors(newRes);
                  }}
                  className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                />
                <select
                  value={res.unit}
                  onChange={(e) => {
                    const newRes = [...parallelResistors];
                    newRes[index].unit = e.target.value;
                    setParallelResistors(newRes);
                  }}
                  className="p-3 rounded-lg bg-gray-700 text-white"
                >
                  <option value="Ω">Ом</option>
                  <option value="kΩ">кОм</option>
                  <option value="MΩ">МОм</option>
                </select>
                {parallelResistors.length > 1 && (
                  <button
                    onClick={() => {
                      const newRes = parallelResistors.filter((_, i) => i !== index);
                      setParallelResistors(newRes.length > 0 ? newRes : [{ value: "", unit: "Ω" }]);
                    }}
                    className="text-red-400 hover:text-red-300 text-xl"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setParallelResistors([...parallelResistors, { value: "", unit: "Ω" }])}
            className="w-full p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition mb-4"
          >
            + Добавить резистор
          </button>

          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center">
            {parallelError ? (
              <p className="text-red-400">{parallelError}</p>
            ) : parallelResult !== null ? (
              <>
                <p className="text-3xl font-bold text-indigo-400">
                  {parallelResult.value.toFixed(3)} {parallelResult.unit}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  1/R = {parallelResult.inverseSum.toFixed(6)}
                </p>
                <p className="text-gray-300 text-xs mt-2">
                  {parallelResult.e24List.join(" | ")}
                </p>
                <button
                  onClick={() => copyToClipboard(parallelResult.value.toFixed(3))}
                  className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"
                >
                  <Copy size={14} /> копировать
                </button>
              </>
            ) : (
              <p className="text-gray-500">Введите хотя бы два резистора</p>
            )}
          </div>
        </div>

        {/* ========== 8. ТЕМПЕРАТУРА И МОЩНОСТЬ РЕЗИСТОРА ========== */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-red-500 transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Температура резистора</h2>
            <button onClick={() => { setResV(""); setResR(""); setResPower(null); }} className="text-gray-400 hover:text-white">
              <RotateCcw size={20} />
            </button>
          </div>

          <input
            type="number"
            placeholder="Напряжение на резисторе, В"
            value={resV}
            onChange={(e) => setResV(e.target.value)}
            className="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
          />

          <div className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="Сопротивление"
              value={resR}
              onChange={(e) => setResR(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
            />
            <select value={resRUnit} onChange={(e) => setResRUnit(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white">
              <option value="Ω">Ом</option>
              <option value="kΩ">кОм</option>
              <option value="MΩ">МОм</option>
            </select>
          </div>

          <div className="p-4 bg-gray-900 rounded-lg border border-gray-600 text-center space-y-3">
            {resPower !== null && resTemp !== null && resCurrent !== null ? (
              <>
                <div>
                  <p className="text-3xl font-bold text-red-400">{resPower.toFixed(3)} Вт</p>
                  <p className="text-sm text-gray-300">P = U²/R</p>
                </div>

                <div className="text-2xl font-bold text-orange-400">
                  {resTemp.toFixed(0)} °C
                  <div className={`text-sm mt-1 ${resTemp > 120 ? "text-red-400" : resTemp > 80 ? "text-yellow-400" : "text-green-400"}`}>
                    {resTemp > 120 ? "Перегрев!" : resTemp > 80 ? "Горячо!" : "Безопасно"}
                  </div>
                </div>

                <p className="text-cyan-400 text-lg">Ток: {resCurrent.toFixed(1)} мА</p>

                <p className="text-sm text-gray-300">
                  Нужен резистор ≥ <span className="text-green-400 font-bold">{recommendedPower} Вт</span><br/>
                  E24: {getNearestE24(convertToBase(resR, resRUnit))} {resRUnit}
                </p>

                <button
                  onClick={() => copyToClipboard(`${resPower.toFixed(3)}Вт, ${resTemp.toFixed(0)}°C`)}
                  className="mt-3 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"
                >
                  <Copy size={14} /> копировать
                </button>
              </>
            ) : (
              <p className="text-gray-500">Введите напряжение и сопротивление</p>
            )}
          </div>
        </div>

        {/* ========== 9. ТОК КОРОТКОГО ЗАМЫКАНИЯ ========== */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-yellow-500 transition">
          <h2 className="text-xl font-bold text-white mb-4">Ток КЗ и выбор автомата</h2>

          <div className="space-y-3">
            <input type="number" placeholder="Напряжение сети (220/380 В)" value={ikzU} onChange={e=>setIkzU(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
            
            <div className="flex gap-2">
              <input type="number" placeholder="Сопротивление петли" value={ikzR} onChange={e=>setIkzR(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
              <div className="p-3 bg-gray-600 rounded-lg text-white">Ом</div>
            </div>

            <input type="number" placeholder="Номинальный ток нагрузки, А" value={ikzIn} onChange={e=>setIkzIn(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
          </div>

          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center space-y-2">
            {ikzResult ? (
              <>
                <p className="text-3xl font-bold text-red-400">{ikzResult.toFixed(0)} А</p>
                <p className="text-sm text-gray-300">Ток короткого замыкания</p>
                <p className="text-xl font-bold text-cyan-400">
                  Рекомендуемый автомат: <span className="text-green-400">{ikzAuto} А</span>
                </p>
              </>
            ) : (
              <p className="text-gray-500">Введите данные</p>
            )}
          </div>
        </div>

        {/* ========== 10. КОНДЕНСАТОРЫ ========== */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-cyan-500 transition">
          <h2 className="text-xl font-bold text-white mb-4">Конденсаторы последовательно / параллельно</h2>

          <div className="flex gap-3 mb-4">
            <button onClick={() => setCapMode("parallel")} className={`flex-1 py-2 rounded-lg font-medium transition ${capMode==="parallel" ? "bg-cyan-600" : "bg-gray-700"}`}>Параллельно</button>
            <button onClick={() => setCapMode("series")} className={`flex-1 py-2 rounded-lg font-medium transition ${capMode==="series" ? "bg-cyan-600" : "bg-gray-700"}`}>Последовательно</button>
          </div>

          <div className="space-y-3">
            {caps.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input type="number" placeholder="Ёмкость" value={c} onChange={e => updateCap(i, e.target.value)}
                  className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400" />
                <select value={capUnits[i]} onChange={e => updateUnit(i, e.target.value)}
                  className="p-3 rounded-lg bg-gray-700 text-white">
                  <option value="пФ">пФ</option>
                  <option value="нФ">нФ</option>
                  <option value="мкФ">мкФ</option>
                </select>
                {caps.length > 1 && <button onClick={() => removeCap(i)} className="p-3 text-red-400 hover:text-red-300">×</button>}
              </div>
            ))}
            <button onClick={addCap} className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-cyan-400 text-sm">+ Добавить конденсатор</button>
          </div>

          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center space-y-2">
            {totalCap !== null ? (
              <>
                <p className="text-3xl font-bold text-cyan-400">{formatCap(totalCap)}</p>
                <p className="text-sm text-gray-300">Общая ёмкость</p>
                <button onClick={() => copyToClipboard(formatCap(totalCap))} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto">
                  <Copy size={14} /> копировать
                </button>
              </>
            ) : <p className="text-gray-500">Введите значения</p>}
          </div>
        </div>

        {/* ========== 11. ТАЙМЕР NE555 ========== */}
<div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-lime-400 transition">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">Таймер NE555</h2>
    <button 
      onClick={() => {
        setTimerMode("astable");
        setR1_555("1");
        setR2_555("1");
        setC_555("1");
        setR_mono("1");
        setC_mono("1");
        setR1Unit555("kΩ");
        setR2Unit555("kΩ");
        setCUnit555("µF");
        setRUnitMono("kΩ");
        setCUnitMono("µF");
        setResult555(null);
      }} 
      className="text-gray-400 hover:text-white"
    >
      <RotateCcw size={20} />
    </button>
  </div>

  <div className="flex gap-2 mb-4">
    <button 
      onClick={() => setTimerMode("astable")} 
      className={`flex-1 py-2 rounded-lg font-medium transition ${timerMode === "astable" ? "bg-lime-600 text-white" : "bg-gray-700 text-gray-300"}`}
    >
      Астабильный
    </button>
    <button 
      onClick={() => setTimerMode("monostable")} 
      className={`flex-1 py-2 rounded-lg font-medium transition ${timerMode === "monostable" ? "bg-lime-600 text-white" : "bg-gray-700 text-gray-300"}`}
    >
      Моностабильный
    </button>
  </div>

  {timerMode === "astable" ? (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="R1" 
          value={r1_555} 
          onChange={e => setR1_555(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <select 
          value={r1Unit555} 
          onChange={e => setR1Unit555(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 text-white"
        >
          <option value="Ω">Ω</option>
          <option value="kΩ">kΩ</option>
          <option value="MΩ">MΩ</option>
        </select>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="R2" 
          value={r2_555} 
          onChange={e => setR2_555(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <select 
          value={r2Unit555} 
          onChange={e => setR2Unit555(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 text-white"
        >
          <option value="Ω">Ω</option>
          <option value="kΩ">kΩ</option>
          <option value="MΩ">MΩ</option>
        </select>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="C" 
          value={c_555} 
          onChange={e => setC_555(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <select 
          value={cUnit555} 
          onChange={e => setCUnit555(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 text-white"
        >
          <option value="pF">pF</option>
          <option value="nF">nF</option>
          <option value="µF">µF</option>
          <option value="mF">mF</option>
        </select>
      </div>
    </div>
  ) : (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="R" 
          value={r_mono} 
          onChange={e => setR_mono(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <select 
          value={rUnitMono} 
          onChange={e => setRUnitMono(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 text-white"
        >
          <option value="Ω">Ω</option>
          <option value="kΩ">kΩ</option>
          <option value="MΩ">MΩ</option>
        </select>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="C" 
          value={c_mono} 
          onChange={e => setC_mono(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <select 
          value={cUnitMono} 
          onChange={e => setCUnitMono(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 text-white"
        >
          <option value="pF">pF</option>
          <option value="nF">nF</option>
          <option value="µF">µF</option>
          <option value="mF">mF</option>
        </select>
      </div>
    </div>
  )}

  <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center">
    {result555 ? (
      <>
        {timerMode === "astable" && result555.freq !== undefined ? (
          <>
            <p className="text-3xl font-bold text-lime-400">
              {result555.freq < 1 
                ? `${(result555.freq * 1000).toFixed(2)} мГц` 
                : result555.freq < 1000 
                  ? `${result555.freq.toFixed(2)} Гц` 
                  : result555.freq < 1000000 
                    ? `${(result555.freq / 1000).toFixed(2)} кГц` 
                    : `${(result555.freq / 1000000).toFixed(2)} МГц`}
            </p>
            <div className="text-gray-300 text-sm mt-2 space-y-1">
              {result555.period !== undefined && (
                <p>Период: {formatTime(result555.period)}</p>
              )}
              {result555.highTime !== undefined && (
                <p>Время HIGH: {formatTime(result555.highTime)}</p>
              )}
              {result555.lowTime !== undefined && (
                <p>Время LOW: {formatTime(result555.lowTime)}</p>
              )}
              {result555.duty !== undefined && (
                <p>Скважность: {result555.duty.toFixed(1)}%</p>
              )}
            </div>
          </>
        ) : timerMode === "monostable" && result555.time !== undefined ? (
          <>
            <p className="text-3xl font-bold text-lime-400">
              {formatTime(result555.time)}
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Длительность импульса
            </p>
          </>
        ) : (
          <p className="text-gray-500">Рассчитываем...</p>
        )}
        <button 
          onClick={() => {
            if (timerMode === "astable" && result555.freq !== undefined) {
              copyToClipboard(result555.freq.toFixed(2));
            } else if (timerMode === "monostable" && result555.time !== undefined) {
              copyToClipboard(result555.time.toFixed(2));
            }
          }} 
          className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"
        >
          <Copy size={14} /> копировать
        </button>
      </>
    ) : (
      <p className="text-gray-500">Введите значения компонентов</p>
    )}
  </div>
</div>

{/* ========== 12. СЕТЕВОЙ ТРАНСФОРМАТОР ========== */}
<div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-amber-500 transition">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">Сетевой трансформатор</h2>
    <button 
      onClick={() => {
        setTransformerType("calculateWires");
        setTransformerPower("50");
        setPrimaryVoltage("220");
        setSecondaryVoltage("12");
        setCoreArea("5");
        setMagneticInduction("1.2");
        setTransformerResult(null);
      }} 
      className="text-gray-400 hover:text-white"
    >
      <RotateCcw size={20} />
    </button>
  </div>

  <div className="flex gap-2 mb-4">
    <button 
      onClick={() => setTransformerType("calculateWires")} 
      className={`flex-1 py-2 rounded-lg font-medium transition ${transformerType === "calculateWires" ? "bg-amber-600 text-white" : "bg-gray-700 text-gray-300"}`}
    >
      Расчет обмоток
    </button>
    <button 
      onClick={() => setTransformerType("calculateCore")} 
      className={`flex-1 py-2 rounded-lg font-medium transition ${transformerType === "calculateCore" ? "bg-amber-600 text-white" : "bg-gray-700 text-gray-300"}`}
    >
      Расчет сердечника
    </button>
  </div>

  {transformerType === "calculateWires" ? (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="Мощность, Вт" 
          value={transformerPower} 
          onChange={e => setTransformerPower(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <div className="p-3 rounded-lg bg-gray-700 text-white">Вт</div>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="Первичное напряжение" 
          value={primaryVoltage} 
          onChange={e => setPrimaryVoltage(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <div className="p-3 rounded-lg bg-gray-700 text-white">В</div>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="Вторичное напряжение" 
          value={secondaryVoltage} 
          onChange={e => setSecondaryVoltage(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <div className="p-3 rounded-lg bg-gray-700 text-white">В</div>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="number" 
          step="0.1"
          placeholder="Сечение сердечника" 
          value={coreArea} 
          onChange={e => setCoreArea(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <div className="p-3 rounded-lg bg-gray-700 text-white">см²</div>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="number" 
          step="0.1"
          placeholder="Магнитная индукция" 
          value={magneticInduction} 
          onChange={e => setMagneticInduction(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <div className="p-3 rounded-lg bg-gray-700 text-white">Тл</div>
      </div>
    </div>
  ) : (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="Мощность, Вт" 
          value={transformerPower} 
          onChange={e => setTransformerPower(e.target.value)} 
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
        />
        <div className="p-3 rounded-lg bg-gray-700 text-white">Вт</div>
      </div>
      
      <div className="text-gray-300 text-sm p-3 bg-gray-900 rounded-lg">
        Формула: S = 1.2 × √P<br/>
        S — сечение сердечника (см²)<br/>
        P — мощность (Вт)
      </div>
    </div>
  )}

  <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600 text-center">
    {transformerResult ? (
      <>
        {transformerType === "calculateWires" && transformerResult.primaryTurns !== undefined ? (
          <>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-800 rounded">
                  <p className="text-amber-400 font-bold">{transformerResult.primaryTurns}</p>
                  <p className="text-xs text-gray-400">витков первичной</p>
                </div>
                <div className="p-2 bg-gray-800 rounded">
                  <p className="text-amber-400 font-bold">{transformerResult.secondaryTurns}</p>
                  <p className="text-xs text-gray-400">витков вторичной</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-800 rounded">
                  <p className="text-cyan-400 font-bold">{transformerResult.primaryWireDiameter?.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">мм диаметр первичной</p>
                </div>
                <div className="p-2 bg-gray-800 rounded">
                  <p className="text-cyan-400 font-bold">{transformerResult.secondaryWireDiameter?.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">мм диаметр вторичной</p>
                </div>
              </div>
              
              <div className="p-2 bg-gray-800 rounded">
                <p className="text-green-400 font-bold">{transformerResult.windowArea?.toFixed(1)} см²</p>
                <p className="text-xs text-gray-400">площадь окна сердечника</p>
              </div>
              
              <div className="text-xs text-gray-400 mt-2">
                Ток первичный: {transformerResult.primaryCurrent?.toFixed(2)}А<br/>
                Ток вторичный: {transformerResult.secondaryCurrent?.toFixed(2)}А
              </div>
            </div>
            
            <button 
              onClick={() => copyToClipboard(`Первичная: ${transformerResult.primaryTurns} витков, ${transformerResult.primaryWireDiameter?.toFixed(2)}мм; Вторичная: ${transformerResult.secondaryTurns} витков, ${transformerResult.secondaryWireDiameter?.toFixed(2)}мм`)} 
              className="mt-3 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"
            >
              <Copy size={14} /> копировать данные
            </button>
          </>
        ) : transformerType === "calculateCore" && transformerResult.coreAreaResult !== undefined ? (
          <>
            <p className="text-3xl font-bold text-amber-400">
              {transformerResult.coreAreaResult.toFixed(1)} см²
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Сечение сердечника для {transformerPower}Вт
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Примерные размеры: {Math.sqrt(transformerResult.coreAreaResult).toFixed(1)}×{Math.sqrt(transformerResult.coreAreaResult).toFixed(1)}см
            </p>
            <button 
              onClick={() => {
  if (transformerResult?.coreAreaResult) {
    copyToClipboard(transformerResult.coreAreaResult.toFixed(1));
  }
}}
              className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto"
            >
              <Copy size={14} /> копировать
            </button>
          </>
        ) : (
          <p className="text-gray-500">Рассчитываем...</p>
        )}
      </>
    ) : (
      <p className="text-gray-500">Введите параметры трансформатора</p>
    )}
  </div>
</div>

      </div> {/* Закрывающий тег для grid */}
    </div> /* Закрывающий тег для основного контейнера */
  );
}