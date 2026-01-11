"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { Wrench, Battery, Zap, RefreshCw, Car, Droplets, Cog, GitPullRequest, RotateCw, Scale, Target, Ruler, Home } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function MechanicaCalculators() {
  // === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 1 ===
  const [calc1Type, setCalc1Type] = useState("force");
  const [mass, setMass] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [frictionCoeff, setFrictionCoeff] = useState("");
  const [forceResult, setForceResult] = useState<number | null>(null);
  const [g] = useState(9.81);

  // === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 2 ===
const [calc2Type, setCalc2Type] = useState("work");
const [force2, setForce2] = useState("");
const [distance, setDistance] = useState("");
const [mass2, setMass2] = useState("");
const [velocity, setVelocity] = useState("");
const [height, setHeight] = useState("");
const [energyResult, setEnergyResult] = useState<number | null>(null);
  
  // === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 3 ===
  const [calc3Type, setCalc3Type] = useState("power");
  const [work, setWork] = useState("");
  const [time, setTime] = useState("");
  const [force3, setForce3] = useState("");
  const [speed, setSpeed] = useState("");
  const [usefulPower, setUsefulPower] = useState("");
  const [totalPower, setTotalPower] = useState("");
  const [efficiencyPercent, setEfficiencyPercent] = useState("");
  const [powerResult, setPowerResult] = useState<number | null>(null);

  // === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 4 ===
  const [calc4Type, setCalc4Type] = useState("speed");
  const [distance4, setDistance4] = useState("");
  const [time4, setTime4] = useState("");
  const [speed4, setSpeed4] = useState("");
  const [distanceUnit4, setDistanceUnit4] = useState("m");
  const [timeUnit4, setTimeUnit4] = useState("s");
  const [speedUnit4, setSpeedUnit4] = useState("m/s");
  const [speedResult, setSpeedResult] = useState<number | null>(null);

  // === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 5 (ГИДРАВЛИКА) ===
  const [calc5Type, setCalc5Type] = useState("pressure");
  const [force5, setForce5] = useState("");
  const [area5, setArea5] = useState("");
  const [pressure5, setPressure5] = useState("");
  const [density, setDensity] = useState("1000");
  const [height5, setHeight5] = useState("");
  const [flowRate, setFlowRate] = useState("");
  const [pipeArea, setPipeArea] = useState("");
  const [velocity5, setVelocity5] = useState("");
  const [hydraulicResult, setHydraulicResult] = useState<number | null>(null);

  // === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 6 (ШКИВЫ) ===
  const [calc6Type, setCalc6Type] = useState("speed_ratio");
  const [driveDiameter, setDriveDiameter] = useState("");
  const [drivenDiameter, setDrivenDiameter] = useState("");
  const [driveSpeed, setDriveSpeed] = useState("");
  const [drivenSpeed, setDrivenSpeed] = useState("");
  const [transmissionRatio, setTransmissionRatio] = useState("");
  const [centerDistance, setCenterDistance] = useState("");
  const [beltLength, setBeltLength] = useState("");
  const [pulleyResult, setPulleyResult] = useState<number | null>(null);

  // === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 7 (ПРУЖИНЫ) ===
  const [calc7Type, setCalc7Type] = useState("force");
  const [springConstant, setSpringConstant] = useState("");
  const [displacement, setDisplacement] = useState("");
  const [springForce, setSpringForce] = useState("");
  const [initialLength, setInitialLength] = useState("");
  const [finalLength, setFinalLength] = useState("");
  const [potentialEnergy, setPotentialEnergy] = useState("");
  const [springResult, setSpringResult] = useState<number | null>(null);

  // === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 8 (МОМЕНТ СИЛЫ) ===
const [calc8Type, setCalc8Type] = useState("moment");
const [force8, setForce8] = useState("");           // Сила F (Н)
const [leverArm, setLeverArm] = useState("");       // Плечо d (м)
const [angle, setAngle] = useState("90");           // Угол α между F и рычагом (°), по умолчанию 90°
const [moment8, setMoment8] = useState("");         // Момент M (Н·м)
const [inertia, setInertia] = useState("");         // Момент инерции I (кг·м²)
const [angularAccel, setAngularAccel] = useState(""); // Угловое ускорение α (рад/с²)
const [torqueResult, setTorqueResult] = useState<number | null>(null);

// === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 9 (РЫЧАГИ И РАВНОВЕСИЕ) ===
const [calc9Type, setCalc9Type] = useState("equilibrium");
const [leverForce1, setLeverForce1] = useState("");   // Сила F1 (Н)
const [leverArm1, setLeverArm1] = useState("");       // Плечо l1 (м)
const [leverForce2, setLeverForce2] = useState("");   // Сила F2 (Н)
const [leverArm2, setLeverArm2] = useState("");       // Плечо l2 (м)
const [mechanicalAdvantage, setMechanicalAdvantage] = useState(""); // Выигрыш в силе (k)
const [efficiencyPercentLever, setEfficiencyPercentLever] = useState(""); // КПД η (%)
const [inputWork, setInputWork] = useState("");       // Затраченная работа A_затр (Дж)
const [outputWork, setOutputWork] = useState("");     // Полезная работа A_полезн (Дж)
const [leverResult, setLeverResult] = useState<number | null>(null);

// === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 10 (ПЕРЕДАЧИ И РЕДУКТОРЫ) ===
const [calc10Type, setCalc10Type] = useState("gear_ratio");
const [driverGearTeeth, setDriverGearTeeth] = useState("");   // Число зубьев ведущей шестерни Z1
const [drivenGearTeeth, setDrivenGearTeeth] = useState("");   // Число зубьев ведомой шестерни Z2
const [driverGearSpeed, setDriverGearSpeed] = useState("");   // Обороты ведущей n1 (об/мин)
const [drivenGearSpeed, setDrivenGearSpeed] = useState("");   // Обороты ведомой n2 (об/мин)
const [driverGearTorque, setDriverGearTorque] = useState(""); // Крутящий момент ведущей M1 (Н·м)
const [drivenGearTorque, setDrivenGearTorque] = useState(""); // Крутящий момент ведомой M2 (Н·м)
const [gearEfficiency, setGearEfficiency] = useState("95");   // КПД передачи η (%)
const [gearModule, setGearModule] = useState("");             // Модуль зацепления m (мм)
const [gearPitchDiameter, setGearPitchDiameter] = useState(""); // Делительный диаметр d (мм)
const [gearResult, setGearResult] = useState<number | null>(null);

// === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 11 (ЦЕНТР МАСС) ===
const [calc11Type, setCalc11Type] = useState("center_mass_2d");
const [cmMass1, setCmMass1] = useState(""); // Масса m₁ (кг)
const [x1, setX1] = useState("");       // Координата x₁ (м)
const [y1, setY1] = useState("");       // Координата y₁ (м)
const [cmMass2, setCmMass2] = useState(""); // Масса m₂ (кг)
const [x2, setX2] = useState("");       // Координата x₂ (м)
const [y2, setY2] = useState("");       // Координата y₂ (м)
const [cmMass3, setCmMass3] = useState(""); // Масса m₃ (кг)
const [x3, setX3] = useState("");       // Координата x₃ (м)
const [y3, setY3] = useState("");       // Координата y₃ (м)
const [totalMass, setTotalMass] = useState(""); // Общая масса M (кг)
const [centerX, setCenterX] = useState("");     // Координата X центра масс (м)
const [centerY, setCenterY] = useState("");     // Координата Y центра масс (м)
const [centerMassResult, setCenterMassResult] = useState<{x: number | null, y: number | null, totalMass: number | null}>({x: null, y: null, totalMass: null});

// === СОСТОЯНИЯ ДЛЯ КАЛЬКУЛЯТОРА 12 (ПРОЧНОСТЬ БАЛОК) ===
const [calc12Type, setCalc12Type] = useState("beam_deflection");
const [beamLoad, setBeamLoad] = useState("");        // Нагрузка P (Н)
const [beamLength, setBeamLength] = useState("");    // Длина балки L (м)
const [beamPosition, setBeamPosition] = useState(""); // Положение нагрузки a (м) - для несимметричной
const [youngModulus, setYoungModulus] = useState("200000"); // Модуль Юнга E (МПа) - сталь ≈ 200000
const [momentInertia, setMomentInertia] = useState(""); // Момент инерции I (м⁴)
const [beamWidth, setBeamWidth] = useState("");      // Ширина сечения b (мм)
const [beamHeight, setBeamHeight] = useState("");    // Высота сечения h (мм)
const [bendingMoment, setBendingMoment] = useState(""); // Изгибающий момент M (Н·м)
const [sectionModulus, setSectionModulus] = useState(""); // Момент сопротивления W (м³)
const [bendingStress, setBendingStress] = useState(""); // Напряжение изгиба σ (МПа)
const [beamResult, setBeamResult] = useState<number | null>(null);

  // Функция расчета силы
  const calculateForce = useCallback(() => {
    const m = parseFloat(mass) || 0;
    const a = parseFloat(acceleration) || 0;
    const μ = parseFloat(frictionCoeff) || 0;
    
    let result = 0;
    
    switch(calc1Type) {
      case "force": result = m * a; break;
      case "mass": if (a !== 0) result = m / a; break;
      case "accel": if (m !== 0) result = a / m; break;
      case "weight": result = m * g; break;
      case "friction": result = μ * m * g; break;
    }
    
    setForceResult(isNaN(result) ? null : result);
  }, [calc1Type, mass, acceleration, frictionCoeff, g]);

  // Функция расчета энергии
  const calculateEnergy = useCallback(() => {
    const input1 = parseFloat(force2) || 0;
    const input2 = parseFloat(distance) || 0;
    const m = parseFloat(cmMass2) || 0;
    const v = parseFloat(velocity) || 0;
    const h = parseFloat(height) || 0;
    
    let result = 0;
    
    switch(calc2Type) {
      case "work": result = input1 * input2; break;
      case "force": if (input2 !== 0) result = input1 / input2; break;
      case "distance": if (input2 !== 0) result = input1 / input2; break;
      case "kinetic": result = 0.5 * m * v * v; break;
      case "potential": result = m * g * h; break;
    }
    
    setEnergyResult(isNaN(result) ? null : result);
  }, [calc2Type, force2, distance, cmMass2, velocity, height, g]);

  // Функция расчета мощности
  const calculatePower = useCallback(() => {
    const A = parseFloat(work) || 0;
    const t = parseFloat(time) || 0;
    const F = parseFloat(force3) || 0;
    const v = parseFloat(speed) || 0;
    const P_useful = parseFloat(usefulPower) || 0;
    const P_total = parseFloat(totalPower) || 0;
    const η_percent = parseFloat(efficiencyPercent) || 0;
    
    let result = 0;
    
    switch(calc3Type) {
      case "power": 
        if (t !== 0) result = A / t;
        else if (F !== 0 && v !== 0) result = F * v;
        break;
      case "work": 
        if (t !== 0) result = A * t;
        break;
      case "time": 
        if (A !== 0) result = A / t;
        break;
      case "efficiency": 
        if (P_total !== 0) result = (P_useful / P_total) * 100;
        break;
      case "useful_power": 
        result = (η_percent / 100) * P_total;
        break;
    }
    
    setPowerResult(isNaN(result) ? null : result);
  }, [calc3Type, work, time, force3, speed, usefulPower, totalPower, efficiencyPercent]);

  // Функция конвертации единиц расстояния
  const convertDistance = useCallback((value: number, unit: string): number => {
    switch(unit) {
      case "km": return value * 1000;
      case "m": return value;
      case "cm": return value / 100;
      default: return value;
    }
  }, []);

  // Функция конвертации единиц времени
  const convertTime = useCallback((value: number, unit: string): number => {
    switch(unit) {
      case "h": return value * 3600;
      case "min": return value * 60;
      case "s": return value;
      default: return value;
    }
  }, []);

  // Функция расчета скорости
  const calculateSpeed = useCallback(() => {
    const s = parseFloat(distance4) || 0;
    const t = parseFloat(time4) || 0;
    const v = parseFloat(speed4) || 0;
    
    if (s === 0 && t === 0 && v === 0) {
      setSpeedResult(null);
      return;
    }
    
    let result = 0;
    
    switch(calc4Type) {
      case "speed": 
        if (t !== 0) {
          const s_m = convertDistance(s, distanceUnit4);
          const t_s = convertTime(t, timeUnit4);
          result = s_m / t_s;
        }
        break;
      case "distance": 
        const v_m_s = speedUnit4 === "km/h" ? (v * 1000 / 3600) : v;
        const t_s = convertTime(t, timeUnit4);
        result = v_m_s * t_s;
        break;
      case "time": 
        if (v !== 0) {
          const s_m = convertDistance(s, distanceUnit4);
          const v_m_s = speedUnit4 === "km/h" ? (v * 1000 / 3600) : v;
          result = s_m / v_m_s;
        }
        break;
    }
    
    setSpeedResult(isNaN(result) ? null : result);
  }, [calc4Type, distance4, time4, speed4, distanceUnit4, timeUnit4, speedUnit4, convertDistance, convertTime]);

  // Функция расчета гидравлики
  const calculateHydraulics = useCallback(() => {
    const F = parseFloat(force5) || 0;
    const A = parseFloat(area5) || 0;
    const P = parseFloat(pressure5) || 0;
    const ρ = parseFloat(density) || 1000;
    const h = parseFloat(height5) || 0;
    const Q = parseFloat(flowRate) || 0;
    const A_pipe = parseFloat(pipeArea) || 0;
    const v = parseFloat(velocity5) || 0;
    
    let result = 0;
    
    switch(calc5Type) {
      case "pressure": 
        if (A !== 0) result = F / A;
        break;
      case "force": 
        result = P * A;
        break;
      case "area": 
        if (P !== 0) result = F / P;
        break;
      case "hydrostatic": 
        result = ρ * g * h;
        break;
      case "flow_rate": 
        result = A_pipe * v;
        break;
      case "velocity": 
        if (A_pipe !== 0) result = Q / A_pipe;
        break;
      case "pipe_diameter": 
        if (v !== 0) {
          const A = Q / v;
          result = 2 * Math.sqrt(A / Math.PI);
        }
        break;
    }
    
    setHydraulicResult(isNaN(result) ? null : result);
  }, [calc5Type, force5, area5, pressure5, density, height5, flowRate, pipeArea, velocity5, g]);

  // Функция расчета шкивов
  const calculatePulleys = useCallback(() => {
    const d1 = parseFloat(driveDiameter) || 0;
    const d2 = parseFloat(drivenDiameter) || 0;
    const n1 = parseFloat(driveSpeed) || 0;
    const n2 = parseFloat(drivenSpeed) || 0;
    const i = parseFloat(transmissionRatio) || 0;
    const L = parseFloat(centerDistance) || 0;
    const l = parseFloat(beltLength) || 0;
    
    let result = 0;
    
    switch(calc6Type) {
      case "speed_ratio": 
        if (d2 !== 0 && d1 !== 0) result = d1 / d2;
        else if (n2 !== 0 && n1 !== 0) result = n2 / n1;
        break;
      case "driven_speed": 
        if (d1 !== 0 && d2 !== 0) result = (n1 * d1) / d2;
        else if (i !== 0) result = n1 / i;
        break;
      case "drive_speed": 
        if (d1 !== 0 && d2 !== 0) result = (n2 * d2) / d1;
        else if (i !== 0) result = n2 * i;
        break;
      case "driven_diameter": 
        if (n1 !== 0 && n2 !== 0) result = (d1 * n1) / n2;
        else if (i !== 0) result = d1 / i;
        break;
      case "belt_length": 
        if (d1 !== 0 && d2 !== 0 && L !== 0) {
          result = 2 * L + (Math.PI * (d1 + d2) / 2) + (Math.pow(d2 - d1, 2) / (4 * L));
        }
        break;
      case "center_distance": 
        if (d1 !== 0 && d2 !== 0 && l !== 0) {
          const sumD = d1 + d2;
          const diffD = d2 - d1;
          const part1 = l - (Math.PI * sumD) / 2;
          const part2 = Math.sqrt(Math.pow(part1, 2) - Math.pow(diffD, 2) / 2);
          result = (part1 + part2) / 4;
        }
        break;
    }
    
    setPulleyResult(isNaN(result) ? null : result);
  }, [calc6Type, driveDiameter, drivenDiameter, driveSpeed, drivenSpeed, transmissionRatio, centerDistance, beltLength]);

  // Функция расчета пружин
  const calculateSpring = useCallback(() => {
    const k = parseFloat(springConstant) || 0;
    const x = parseFloat(displacement) || 0;
    const F = parseFloat(springForce) || 0;
    const L0 = parseFloat(initialLength) || 0;
    const L = parseFloat(finalLength) || 0;
    const Ep = parseFloat(potentialEnergy) || 0;
    
    let result = 0;
    
    switch(calc7Type) {
      case "force": 
        if (x !== 0) result = k * x;
        else if (L0 !== 0 && L !== 0) result = k * (L - L0);
        break;
      case "constant": 
        if (x !== 0 && F !== 0) result = F / x;
        else if (L0 !== 0 && L !== 0 && F !== 0) result = F / (L - L0);
        break;
      case "displacement": 
        if (k !== 0 && F !== 0) result = F / k;
        else if (L0 !== 0) result = L - L0;
        break;
      case "energy": 
        if (k !== 0 && x !== 0) result = 0.5 * k * x * x;
        else if (k !== 0 && L0 !== 0 && L !== 0) {
          const ΔL = L - L0;
          result = 0.5 * k * ΔL * ΔL;
        }
        break;
      case "length_change": 
        if (k !== 0 && F !== 0) result = F / k;
        break;
    }
    
    setSpringResult(isNaN(result) ? null : result);
  }, [calc7Type, springConstant, displacement, springForce, initialLength, finalLength, potentialEnergy]);

// Функция расчета момента силы
const calculateTorque = useCallback(() => {
  const F = parseFloat(force8) || 0;
  const d = parseFloat(leverArm) || 0;
  const α_deg = parseFloat(angle) || 90; // угол в градусах
  const M = parseFloat(moment8) || 0;
  const I = parseFloat(inertia) || 0;
  const α_rad = parseFloat(angularAccel) || 0;
  
  // Конвертируем угол в радианы
  const α_rad_from_deg = (α_deg * Math.PI) / 180;
  
  let result = 0;
  
  switch(calc8Type) {
    case "moment": 
      result = F * d * Math.sin(α_rad_from_deg);
      break;
    case "force": 
      if (d !== 0 && Math.sin(α_rad_from_deg) !== 0) {
        result = M / (d * Math.sin(α_rad_from_deg));
      }
      break;
    case "lever": 
      if (F !== 0 && Math.sin(α_rad_from_deg) !== 0) {
        result = M / (F * Math.sin(α_rad_from_deg));
      }
      break;
    case "angle": 
      if (F !== 0 && d !== 0 && M !== 0) {
        const sinα = M / (F * d);
        // Ограничиваем значение sinα от -1 до 1
        const clampedSinα = Math.max(-1, Math.min(1, sinα));
        result = (Math.asin(clampedSinα) * 180) / Math.PI;
      }
      break;
    case "moment_inertia": 
      result = I * α_rad;
      break;
    case "angular_accel": 
      if (I !== 0) result = M / I;
      break;
    case "inertia": 
      if (α_rad !== 0) result = M / α_rad;
      break;
  }
  
  setTorqueResult(isNaN(result) ? null : result);
}, [calc8Type, force8, leverArm, angle, moment8, inertia, angularAccel]);

// Функция расчета рычагов и равновесия
const calculateLever = useCallback(() => {
  const F1 = parseFloat(leverForce1) || 0;
  const l1 = parseFloat(leverArm1) || 0;
  const F2 = parseFloat(leverForce2) || 0;
  const l2 = parseFloat(leverArm2) || 0;
  const k = parseFloat(mechanicalAdvantage) || 0;
  const η = parseFloat(efficiencyPercentLever) || 100; // По умолчанию 100% (идеальный механизм)
  const A_in = parseFloat(inputWork) || 0;
  const A_out = parseFloat(outputWork) || 0;
  
  let result = 0;
  
  switch(calc9Type) {
    case "equilibrium": // Условие равновесия F1*l1 = F2*l2
      if (F1 !== 0 && l1 !== 0 && F2 !== 0) {
        result = (F1 * l1) / F2; // Найти l2
      } else if (F1 !== 0 && l1 !== 0 && l2 !== 0) {
        result = (F1 * l1) / l2; // Найти F2
      } else if (F1 !== 0 && F2 !== 0 && l2 !== 0) {
        result = (F2 * l2) / F1; // Найти l1
      } else if (l1 !== 0 && F2 !== 0 && l2 !== 0) {
        result = (F2 * l2) / l1; // Найти F1
      }
      break;
      
    case "force_gain": // Выигрыш в силе k = F2/F1 = l1/l2
      if (k !== 0 && F1 !== 0) {
        result = F1 * k; // Найти F2
      } else if (k !== 0 && F2 !== 0) {
        result = F2 / k; // Найти F1
      } else if (l1 !== 0 && l2 !== 0) {
        result = l1 / l2; // Найти k
      }
      break;
      
    case "efficiency": // КПД η = (A_полезн / A_затрач) * 100%
      if (A_in !== 0) {
        result = (A_out / A_in) * 100;
      }
      break;
      
    case "input_work": // Затраченная работа A_затр = A_полезн / (η/100)
      if (η !== 0) {
        result = A_out / (η / 100);
      }
      break;
      
    case "output_work": // Полезная работа A_полезн = A_затр * (η/100)
      result = A_in * (η / 100);
      break;
  }
  
  setLeverResult(isNaN(result) ? null : result);
}, [calc9Type, leverForce1, leverArm1, leverForce2, leverArm2, mechanicalAdvantage, efficiencyPercentLever, inputWork, outputWork]);

// Функция расчета передач и редукторов
const calculateGear = useCallback(() => {
  const Z1 = parseFloat(driverGearTeeth) || 0;
  const Z2 = parseFloat(drivenGearTeeth) || 0;
  const n1 = parseFloat(driverGearSpeed) || 0;
  const n2 = parseFloat(drivenGearSpeed) || 0;
  const M1 = parseFloat(driverGearTorque) || 0;
  const M2 = parseFloat(drivenGearTorque) || 0;
  const η = parseFloat(gearEfficiency) || 100; // КПД в процентах
  const m = parseFloat(gearModule) || 0;       // Модуль в мм
  const d = parseFloat(gearPitchDiameter) || 0; // Диаметр в мм
  
  let result = 0;
  
  switch(calc10Type) {
    case "gear_ratio": // Передаточное отношение i = Z2/Z1 = n1/n2
      if (Z1 !== 0 && Z2 !== 0) {
        result = Z2 / Z1;
      } else if (n1 !== 0 && n2 !== 0) {
        result = n1 / n2;
      }
      break;
      
    case "driven_speed": // Обороты ведомой n2 = n1 * (Z1/Z2)
      if (n1 !== 0 && Z1 !== 0 && Z2 !== 0) {
        result = n1 * (Z1 / Z2);
      }
      break;
      
    case "driver_speed": // Обороты ведущей n1 = n2 * (Z2/Z1)
      if (n2 !== 0 && Z1 !== 0 && Z2 !== 0) {
        result = n2 * (Z2 / Z1);
      }
      break;
      
    case "torque_ratio": // Отношение моментов M2/M1 = i * η
      const i = Z2 / Z1;
      result = i * (η / 100);
      break;
      
    case "driven_torque": // Момент ведомой M2 = M1 * i * (η/100)
      if (M1 !== 0 && Z1 !== 0 && Z2 !== 0) {
        const i = Z2 / Z1;
        result = M1 * i * (η / 100);
      }
      break;
      
    case "driver_torque": // Момент ведущей M1 = M2 / (i * (η/100))
      if (M2 !== 0 && Z1 !== 0 && Z2 !== 0) {
        const i = Z2 / Z1;
        result = M2 / (i * (η / 100));
      }
      break;
      
    case "gear_module": // Модуль m = d/Z
      if (d !== 0 && (Z1 !== 0 || Z2 !== 0)) {
        const Z = Z1 !== 0 ? Z1 : Z2;
        result = d / Z;
      }
      break;
      
    case "pitch_diameter": // Делительный диаметр d = m * Z
      if (m !== 0 && (Z1 !== 0 || Z2 !== 0)) {
        const Z = Z1 !== 0 ? Z1 : Z2;
        result = m * Z;
      }
      break;
  }
  
  setGearResult(isNaN(result) ? null : result);
}, [calc10Type, driverGearTeeth, drivenGearTeeth, driverGearSpeed, drivenGearSpeed, driverGearTorque, drivenGearTorque, gearEfficiency, gearModule, gearPitchDiameter]);

// Функция расчета центра масс
const calculateCenterMass = useCallback(() => {
  const m1 = parseFloat(cmMass1) || 0;
  const mx1 = parseFloat(x1) || 0;
  const my1 = parseFloat(y1) || 0;
  const m2 = parseFloat(cmMass2) || 0;
  const mx2 = parseFloat(x2) || 0;
  const my2 = parseFloat(y2) || 0;
  const m3 = parseFloat(cmMass3) || 0;
  const mx3 = parseFloat(x3) || 0;
  const my3 = parseFloat(y3) || 0;
  const M = parseFloat(totalMass) || 0;
  const Xc = parseFloat(centerX) || 0;
  const Yc = parseFloat(centerY) || 0;
  
  let resultX = 0;
  let resultY = 0;
  let resultM = 0;
  
  switch(calc11Type) {
    case "center_mass_2d": // Центр масс для 2-3 тел в 2D
      resultM = m1 + m2 + m3;
      if (resultM !== 0) {
        resultX = (m1 * mx1 + m2 * mx2 + m3 * mx3) / resultM;
        resultY = (m1 * my1 + m2 * my2 + m3 * my3) / resultM;
      }
      break;
      
    case "center_mass_1d": // Центр масс на прямой (одно измерение)
      resultM = m1 + m2 + m3;
      if (resultM !== 0) {
        resultX = (m1 * mx1 + m2 * mx2 + m3 * mx3) / resultM;
        resultY = 0;
      }
      break;
      
    case "find_mass": // Найти недостающую массу при известном центре масс
      if (m1 !== 0 && m2 !== 0 && Xc !== 0) {
        // Для простоты считаем на прямой
        const sumMx = m1 * mx1 + m2 * mx2;
        resultM = (sumMx - Xc * m1 - Xc * m2) / (Xc - mx3);
      }
      break;
      
    case "find_coordinate": // Найти координату тела при известном центре масс
      resultM = m1 + m2 + m3;
      if (resultM !== 0 && m3 !== 0) {
        // Ищем x3, если известны Xc и все массы
        resultX = ((Xc * resultM) - (m1 * mx1 + m2 * mx2)) / m3;
      }
      break;
  }
  
  setCenterMassResult({
    x: isNaN(resultX) ? null : resultX,
    y: isNaN(resultY) ? null : resultY,
    totalMass: isNaN(resultM) ? null : resultM
  });
}, [calc11Type, cmMass1, x1, y1, cmMass2, x2, y2, cmMass3, x3, y3, totalMass, centerX, centerY]);

// Функция расчета прочности балок
const calculateBeam = useCallback(() => {
  const P = parseFloat(beamLoad) || 0;
  const L = parseFloat(beamLength) || 0;
  const a = parseFloat(beamPosition) || 0;
  const E = parseFloat(youngModulus) || 200000; // МПа
  const I = parseFloat(momentInertia) || 0;
  const b = parseFloat(beamWidth) || 0;
  const h = parseFloat(beamHeight) || 0;
  const M = parseFloat(bendingMoment) || 0;
  const W = parseFloat(sectionModulus) || 0;
  const σ = parseFloat(bendingStress) || 0;
  
  // Конвертация мм в метры для размеров сечения
  const b_m = b / 1000;
  const h_m = h / 1000;
  
  let result = 0;
  
  switch(calc12Type) {
    case "beam_deflection": // Прогиб консольной балки f = (P·L³)/(3·E·I)
      if (E !== 0 && I !== 0 && L !== 0) {
        // Консольная балка с нагрузкой на конце
        result = (P * Math.pow(L, 3)) / (3 * E * 1e6 * I); // E в Па (МПа * 10^6)
      }
      break;
      
    case "bending_moment": // Изгибающий момент M = P·L/4 (для балки на двух опорах с нагрузкой посредине)
      if (P !== 0 && L !== 0) {
        result = (P * L) / 4;
      }
      break;
      
    case "bending_stress": // Напряжение изгиба σ = M/W
      if (W !== 0 && M !== 0) {
        result = M / W; // Результат в Па
      }
      break;
      
    case "section_modulus_rect": // Момент сопротивления прямоугольника W = (b·h²)/6
      if (b !== 0 && h !== 0) {
        result = (b_m * Math.pow(h_m, 2)) / 6;
      }
      break;
      
    case "moment_inertia_rect": // Момент инерции прямоугольника I = (b·h³)/12
      if (b !== 0 && h !== 0) {
        result = (b_m * Math.pow(h_m, 3)) / 12;
      }
      break;
      
    case "max_load": // Максимальная нагрузка P_max = (4·[σ]·W)/L
      if (σ !== 0 && W !== 0 && L !== 0) {
        result = (4 * σ * 1e6 * W) / L; // σ в Па
      }
      break;
      
    case "beam_length": // Максимальная длина L_max = (4·[σ]·W)/P
      if (σ !== 0 && W !== 0 && P !== 0) {
        result = (4 * σ * 1e6 * W) / P;
      }
      break;
  }
  
  setBeamResult(isNaN(result) ? null : result);
}, [calc12Type, beamLoad, beamLength, beamPosition, youngModulus, momentInertia, beamWidth, beamHeight, bendingMoment, sectionModulus, bendingStress]);

  // Авторасчеты
  useEffect(() => {
    calculateForce();
  }, [calculateForce]);

  useEffect(() => {
    calculateEnergy();
  }, [calculateEnergy]);

  useEffect(() => {
    calculatePower();
  }, [calculatePower]);

  useEffect(() => {
    calculateSpeed();
  }, [calculateSpeed]);

  useEffect(() => {
    calculateHydraulics();
  }, [calculateHydraulics]);

  useEffect(() => {
    calculatePulleys();
  }, [calculatePulleys]);

  useEffect(() => {
    calculateSpring();
  }, [calculateSpring]);

  useEffect(() => {
  calculateTorque();
}, [calculateTorque]);

useEffect(() => {
  calculateLever();
}, [calculateLever]);

useEffect(() => {
  calculateGear();
}, [calculateGear]);

useEffect(() => {
  calculateCenterMass();
}, [calculateCenterMass]);

useEffect(() => {
  calculateBeam();
}, [calculateBeam]);

  // Функции сброса
  const resetCalculator1 = () => {
    setMass("");
    setAcceleration("");
    setFrictionCoeff("");
    setForceResult(null);
  };

  const resetCalculator2 = () => {
    setForce2("");
    setDistance("");
    setMass2("");
    setVelocity("");
    setHeight("");
    setEnergyResult(null);
  };

  const resetCalculator3 = () => {
    setWork("");
    setTime("");
    setForce3("");
    setSpeed("");
    setUsefulPower("");
    setTotalPower("");
    setEfficiencyPercent("");
    setPowerResult(null);
  };

  const resetCalculator4 = () => {
    setDistance4("");
    setTime4("");
    setSpeed4("");
    setSpeedResult(null);
  };

  const resetCalculator5 = () => {
    setForce5("");
    setArea5("");
    setPressure5("");
    setDensity("1000");
    setHeight5("");
    setFlowRate("");
    setPipeArea("");
    setVelocity5("");
    setHydraulicResult(null);
  };

  const resetCalculator6 = () => {
    setDriveDiameter("");
    setDrivenDiameter("");
    setDriveSpeed("");
    setDrivenSpeed("");
    setTransmissionRatio("");
    setCenterDistance("");
    setBeltLength("");
    setPulleyResult(null);
  };

  const resetCalculator7 = () => {
    setSpringConstant("");
    setDisplacement("");
    setSpringForce("");
    setInitialLength("");
    setFinalLength("");
    setPotentialEnergy("");
    setSpringResult(null);
  };

  const resetCalculator8 = () => {
  setForce8("");
  setLeverArm("");
  setAngle("90");
  setMoment8("");
  setInertia("");
  setAngularAccel("");
  setTorqueResult(null);
};

const resetCalculator9 = () => {
  setLeverForce1("");
  setLeverArm1("");
  setLeverForce2("");
  setLeverArm2("");
  setMechanicalAdvantage("");
  setEfficiencyPercentLever("");
  setInputWork("");
  setOutputWork("");
  setLeverResult(null);
};

const resetCalculator10 = () => {
  setDriverGearTeeth("");
  setDrivenGearTeeth("");
  setDriverGearSpeed("");
  setDrivenGearSpeed("");
  setDriverGearTorque("");
  setDrivenGearTorque("");
  setGearEfficiency("95");
  setGearModule("");
  setGearPitchDiameter("");
  setGearResult(null);
};

const resetCalculator11 = () => {
  setCmMass1("");
  setX1("");
  setY1("");
  setCmMass2("");
  setX2("");
  setY2("");
  setCmMass3("");
  setX3("");
  setY3("");
  setTotalMass("");
  setCenterX("");
  setCenterY("");
  setCenterMassResult({x: null, y: null, totalMass: null});
};

const resetCalculator12 = () => {
  setBeamLoad("");
  setBeamLength("");
  setBeamPosition("");
  setYoungModulus("200000");
  setMomentInertia("");
  setBeamWidth("");
  setBeamHeight("");
  setBendingMoment("");
  setSectionModulus("");
  setBendingStress("");
  setBeamResult(null);
};

  // Вспомогательные функции
  const getResultUnit = () => {
    switch(calc1Type) {
      case "force": return "Н";
      case "mass": return "кг";
      case "accel": return "м/с²";
      case "weight": return "Н";
      case "friction": return "Н";
      default: return "";
    }
  };

  const getEnergyResultUnit = () => {
    switch(calc2Type) {
      case "work": return "Дж";
      case "force": return "Н";
      case "distance": return "м";
      case "kinetic": return "Дж";
      case "potential": return "Дж";
      default: return "";
    }
  };

  const getEnergyFormula = () => {
    switch(calc2Type) {
      case "work": return "A = F × s";
      case "force": return "F = A / s";
      case "distance": return "s = A / F";
      case "kinetic": return "Ek = ½mv²";
      case "potential": return "Ep = mgh";
      default: return "";
    }
  };

  const getPowerResultUnit = () => {
    switch(calc3Type) {
      case "power": return "Вт";
      case "work": return "Дж";
      case "time": return "с";
      case "efficiency": return "%";
      case "useful_power": return "Вт";
      default: return "";
    }
  };

  const getPowerFormula = () => {
    switch(calc3Type) {
      case "power": return "P = A/t = F×v";
      case "work": return "A = P × t";
      case "time": return "t = A / P";
      case "efficiency": return "η = (Pполезн/Pзатрач) × 100%";
      case "useful_power": return "Pполезн = η × Pзатрач";
      default: return "";
    }
  };

  const getSpeedResultUnit = () => {
    switch(calc4Type) {
      case "speed": return speedUnit4;
      case "distance": return "м";
      case "time": 
        const result = speedResult || 0;
        if (result >= 3600) return "ч";
        if (result >= 60) return "мин";
        return "с";
      default: return "";
    }
  };

  const getSpeedFormula = () => {
    switch(calc4Type) {
      case "speed": return "v = s ÷ t";
      case "distance": return "s = v × t";
      case "time": return "t = s ÷ v";
      default: return "";
    }
  };

  const getHydraulicResultUnit = () => {
    switch(calc5Type) {
      case "pressure": return "Па";
      case "force": return "Н";
      case "area": return "м²";
      case "hydrostatic": return "Па";
      case "flow_rate": return "м³/с";
      case "velocity": return "м/с";
      case "pipe_diameter": return "м";
      default: return "";
    }
  };

  const getHydraulicFormula = () => {
    switch(calc5Type) {
      case "pressure": return "p = F / A";
      case "force": return "F = p × A";
      case "area": return "A = F / p";
      case "hydrostatic": return "p = ρgh";
      case "flow_rate": return "Q = A × v";
      case "velocity": return "v = Q / A";
      case "pipe_diameter": return "D = 2√(Q÷vπ)";
      default: return "";
    }
  };

  const getPulleyResultUnit = () => {
    switch(calc6Type) {
      case "speed_ratio": return "";
      case "driven_speed": return "об/мин";
      case "drive_speed": return "об/мин";
      case "driven_diameter": return "мм";
      case "belt_length": return "мм";
      case "center_distance": return "мм";
      default: return "";
    }
  };

  const getPulleyFormula = () => {
    switch(calc6Type) {
      case "speed_ratio": return "i = D₁/D₂ = n₂/n₁";
      case "driven_speed": return "n₂ = n₁ × D₁/D₂";
      case "drive_speed": return "n₁ = n₂ × D₂/D₁";
      case "driven_diameter": return "D₂ = D₁ × n₁/n₂";
      case "belt_length": return "L = 2C + π(D₁+D₂)/2 + (D₂-D₁)²/4C";
      case "center_distance": return "C ≈ [L - π(D₁+D₂)/2 + √((L-π(D₁+D₂)/2)² - 2(D₂-D₁)²)]/4";
      default: return "";
    }
  };

  const getSpringResultUnit = () => {
    switch(calc7Type) {
      case "force": return "Н";
      case "constant": return "Н/м";
      case "displacement": return "м";
      case "energy": return "Дж";
      case "length_change": return "м";
      default: return "";
    }
  };

  const getSpringFormula = () => {
    switch(calc7Type) {
      case "force": return "F = k × Δx";
      case "constant": return "k = F / Δx";
      case "displacement": return "Δx = F / k";
      case "energy": return "Ep = ½kΔx²";
      case "length_change": return "Δx = F / k";
      default: return "";
    }
  };

  const getTorqueResultUnit = () => {
  switch(calc8Type) {
    case "moment": return "Н·м";
    case "force": return "Н";
    case "lever": return "м";
    case "angle": return "°";
    case "moment_inertia": return "Н·м";
    case "angular_accel": return "рад/с²";
    case "inertia": return "кг·м²";
    default: return "";
  }
};

const getTorqueFormula = () => {
  switch(calc8Type) {
    case "moment": return "M = F × d × sin(α)";
    case "force": return "F = M / (d × sin(α))";
    case "lever": return "d = M / (F × sin(α))";
    case "angle": return "α = arcsin(M / (F × d))";
    case "moment_inertia": return "M = I × α";
    case "angular_accel": return "α = M / I";
    case "inertia": return "I = M / α";
    default: return "";
  }
};

const getLeverResultUnit = () => {
  switch(calc9Type) {
    case "equilibrium": 
      // Определяем, что ищем: если F1, l1, F2 заданы, ищем l2 (м), и т.д.
      if (leverForce1 && leverArm1 && leverForce2 && !leverArm2) return "м";
      if (leverForce1 && leverArm1 && leverArm2 && !leverForce2) return "Н";
      if (leverForce1 && leverForce2 && leverArm2 && !leverArm1) return "м";
      if (leverArm1 && leverForce2 && leverArm2 && !leverForce1) return "Н";
      return "";
    case "force_gain": 
      if (mechanicalAdvantage && leverForce1 && !leverForce2) return "Н"; // Ищем F2
      if (mechanicalAdvantage && leverForce2 && !leverForce1) return "Н"; // Ищем F1
      return ""; // Ищем k (безразмерный)
    case "efficiency": return "%";
    case "input_work": return "Дж";
    case "output_work": return "Дж";
    default: return "";
  }
};

const getLeverFormula = () => {
  switch(calc9Type) {
    case "equilibrium": return "F₁ × l₁ = F₂ × l₂";
    case "force_gain": return "k = F₂ / F₁ = l₁ / l₂";
    case "efficiency": return "η = (A_полезн / A_затрач) × 100%";
    case "input_work": return "A_затрач = A_полезн / (η / 100)";
    case "output_work": return "A_полезн = A_затрач × (η / 100)";
    default: return "";
  }
};

const getGearResultUnit = () => {
  switch(calc10Type) {
    case "gear_ratio": 
    case "torque_ratio": 
      return ""; // Безразмерная величина
    case "driven_speed": 
    case "driver_speed": 
      return "об/мин";
    case "driven_torque": 
    case "driver_torque": 
      return "Н·м";
    case "gear_module": 
      return "мм";
    case "pitch_diameter": 
      return "мм";
    default: 
      return "";
  }
};

const getGearFormula = () => {
  switch(calc10Type) {
    case "gear_ratio": return "i = Z₂/Z₁ = n₁/n₂";
    case "driven_speed": return "n₂ = n₁ × (Z₁/Z₂)";
    case "driver_speed": return "n₁ = n₂ × (Z₂/Z₁)";
    case "torque_ratio": return "M₂/M₁ = i × η";
    case "driven_torque": return "M₂ = M₁ × i × η";
    case "driver_torque": return "M₁ = M₂ / (i × η)";
    case "gear_module": return "m = d / Z";
    case "pitch_diameter": return "d = m × Z";
    default: return "";
  }
};

const getCenterMassResultUnit = () => {
  switch(calc11Type) {
    case "center_mass_2d": 
    case "center_mass_1d": 
      return "м";
    case "find_mass": 
      return "кг";
    case "find_coordinate": 
      return "м";
    default: 
      return "";
  }
};

const getCenterMassFormula = () => {
  switch(calc11Type) {
    case "center_mass_2d": 
      return "Xc = Σ(mᵢ·xᵢ) / Σmᵢ, Yc = Σ(mᵢ·yᵢ) / Σmᵢ";
    case "center_mass_1d": 
      return "Xc = Σ(mᵢ·xᵢ) / Σmᵢ";
    case "find_mass": 
      return "m₃ = (Xc·Σm - Σ(mᵢ·xᵢ)) / (x₃ - Xc)";
    case "find_coordinate": 
      return "x₃ = (Xc·Σm - Σ(mᵢ·xᵢ)) / m₃";
    default: 
      return "";
  }
};

const getBeamResultUnit = () => {
  switch(calc12Type) {
    case "beam_deflection": return "м";
    case "bending_moment": return "Н·м";
    case "bending_stress": return "МПа";
    case "section_modulus_rect": return "м³";
    case "moment_inertia_rect": return "м⁴";
    case "max_load": return "Н";
    case "beam_length": return "м";
    default: return "";
  }
};

const getBeamFormula = () => {
  switch(calc12Type) {
    case "beam_deflection": return "f = (P·L³)/(3·E·I)";
    case "bending_moment": return "M = P·L/4";
    case "bending_stress": return "σ = M / W";
    case "section_modulus_rect": return "W = (b·h²)/6";
    case "moment_inertia_rect": return "I = (b·h³)/12";
    case "max_load": return "P_max = (4·[σ]·W)/L";
    case "beam_length": return "L_max = (4·[σ]·W)/P";
    default: return "";
  }
};

  const renderPowerInputs = () => {
    switch(calc3Type) {
      case "power":
        return (
          <>
            <input 
              type="number" 
              placeholder="Работа A (Дж)" 
              value={work} 
              onChange={(e) => setWork(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Время t (с)" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <div className="text-center text-gray-400 text-sm my-2">или</div>
            <input 
              type="number" 
              placeholder="Сила F (Н)" 
              value={force3} 
              onChange={(e) => setForce3(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Скорость v (м/с)" 
              value={speed} 
              onChange={(e) => setSpeed(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "work":
        return (
          <>
            <input 
              type="number" 
              placeholder="Мощность P (Вт)" 
              value={work} 
              onChange={(e) => setWork(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Время t (с)" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "time":
        return (
          <>
            <input 
              type="number" 
              placeholder="Работа A (Дж)" 
              value={work} 
              onChange={(e) => setWork(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Мощность P (Вт)" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "efficiency":
        return (
          <>
            <input 
              type="number" 
              placeholder="Полезная мощность Pп (Вт)" 
              value={usefulPower} 
              onChange={(e) => setUsefulPower(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Затраченная мощность Pз (Вт)" 
              value={totalPower} 
              onChange={(e) => setTotalPower(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "useful_power":
        return (
          <>
            <input 
              type="number" 
              placeholder="КПД η (%)" 
              value={efficiencyPercent} 
              onChange={(e) => setEfficiencyPercent(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Затраченная мощность Pз (Вт)" 
              value={totalPower} 
              onChange={(e) => setTotalPower(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      default:
        return null;
    }
  };

  const renderHydraulicInputs = () => {
    switch(calc5Type) {
      case "pressure":
        return (
          <>
            <input 
              type="number" 
              placeholder="Сила F (Н)" 
              value={force5} 
              onChange={(e) => setForce5(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Площадь A (м²)" 
              value={area5} 
              onChange={(e) => setArea5(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "force":
        return (
          <>
            <input 
              type="number" 
              placeholder="Давление p (Па)" 
              value={pressure5} 
              onChange={(e) => setPressure5(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Площадь A (м²)" 
              value={area5} 
              onChange={(e) => setArea5(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "area":
        return (
          <>
            <input 
              type="number" 
              placeholder="Сила F (Н)" 
              value={force5} 
              onChange={(e) => setForce5(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Давление p (Па)" 
              value={pressure5} 
              onChange={(e) => setPressure5(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "hydrostatic":
        return (
          <>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Плотность ρ (кг/м³)" 
                value={density} 
                onChange={(e) => setDensity(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
              <div className="text-sm text-gray-400 flex items-center whitespace-nowrap">
                вода ≈ 1000
              </div>
            </div>
            <input 
              type="number" 
              placeholder="Высота h (м)" 
              value={height5} 
              onChange={(e) => setHeight5(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "flow_rate":
        return (
          <>
            <input 
              type="number" 
              placeholder="Площадь трубы A (м²)" 
              value={pipeArea} 
              onChange={(e) => setPipeArea(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Скорость v (м/с)" 
              value={velocity5} 
              onChange={(e) => setVelocity5(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "velocity":
        return (
          <>
            <input 
              type="number" 
              placeholder="Расход Q (м³/с)" 
              value={flowRate} 
              onChange={(e) => setFlowRate(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Площадь трубы A (м²)" 
              value={pipeArea} 
              onChange={(e) => setPipeArea(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "pipe_diameter":  
        return (
          <>
            <input 
              type="number" 
              placeholder="Расход Q (м³/с)" 
              value={flowRate} 
              onChange={(e) => setFlowRate(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Скорость v (м/с)" 
              value={velocity5} 
              onChange={(e) => setVelocity5(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      default:
        return null;
    }
  };

  const renderPulleyInputs = () => {
    switch(calc6Type) {
      case "speed_ratio":
        return (
          <>
            <input 
              type="number" 
              placeholder="Диаметр ведущего D₁ (мм)" 
              value={driveDiameter} 
              onChange={(e) => setDriveDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Диаметр ведомого D₂ (мм)" 
              value={drivenDiameter} 
              onChange={(e) => setDrivenDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <div className="text-center text-gray-400 text-sm my-2">или</div>
            <input 
              type="number" 
              placeholder="Обороты ведущего n₁ (об/мин)" 
              value={driveSpeed} 
              onChange={(e) => setDriveSpeed(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Обороты ведомого n₂ (об/мин)" 
              value={drivenSpeed} 
              onChange={(e) => setDrivenSpeed(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "driven_speed":
        return (
          <>
            <input 
              type="number" 
              placeholder="Обороты ведущего n₁ (об/мин)" 
              value={driveSpeed} 
              onChange={(e) => setDriveSpeed(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Диаметр ведущего D₁ (мм)" 
              value={driveDiameter} 
              onChange={(e) => setDriveDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Диаметр ведомого D₂ (мм)" 
              value={drivenDiameter} 
              onChange={(e) => setDrivenDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "drive_speed":
        return (
          <>
            <input 
              type="number" 
              placeholder="Обороты ведомого n₂ (об/мин)" 
              value={drivenSpeed} 
              onChange={(e) => setDrivenSpeed(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Диаметр ведущего D₁ (мм)" 
              value={driveDiameter} 
              onChange={(e) => setDriveDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Диаметр ведомого D₂ (мм)" 
              value={drivenDiameter} 
              onChange={(e) => setDrivenDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "driven_diameter":
        return (
          <>
            <input 
              type="number" 
              placeholder="Диаметр ведущего D₁ (мм)" 
              value={driveDiameter} 
              onChange={(e) => setDriveDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Обороты ведущего n₁ (об/мин)" 
              value={driveSpeed} 
              onChange={(e) => setDriveSpeed(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Обороты ведомого n₂ (об/мин)" 
              value={drivenSpeed} 
              onChange={(e) => setDrivenSpeed(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "belt_length":
        return (
          <>
            <input 
              type="number" 
              placeholder="Диаметр ведущего D₁ (мм)" 
              value={driveDiameter} 
              onChange={(e) => setDriveDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Диаметр ведомого D₂ (мм)" 
              value={drivenDiameter} 
              onChange={(e) => setDrivenDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Межосевое расстояние C (мм)" 
              value={centerDistance} 
              onChange={(e) => setCenterDistance(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      case "center_distance":
        return (
          <>
            <input 
              type="number" 
              placeholder="Диаметр ведущего D₁ (мм)" 
              value={driveDiameter} 
              onChange={(e) => setDriveDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Диаметр ведомого D₂ (мм)" 
              value={drivenDiameter} 
              onChange={(e) => setDrivenDiameter(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Длина ремня L (мм)" 
              value={beltLength} 
              onChange={(e) => setBeltLength(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      default:
        return null;
    }
  };

  const renderSpringInputs = () => {
    switch(calc7Type) {
      case "force":
        return (
          <>
            <input 
              type="number" 
              placeholder="Жёсткость пружины k (Н/м)" 
              value={springConstant} 
              onChange={(e) => setSpringConstant(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <div className="text-center text-gray-400 text-sm my-2">или ввести:</div>
            <input 
              type="number" 
              placeholder="Смещение Δx (м)" 
              value={displacement} 
              onChange={(e) => setDisplacement(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <div className="text-center text-gray-400 text-sm my-2">или длины:</div>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Начальная длина L₀ (м)" 
                value={initialLength} 
                onChange={(e) => setInitialLength(e.target.value)} 
                className="w-1/2 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
              <input 
                type="number" 
                placeholder="Конечная длина L (м)" 
                value={finalLength} 
                onChange={(e) => setFinalLength(e.target.value)} 
                className="w-1/2 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
            </div>
          </>
        );
      
      case "constant":
        return (
          <>
            <input 
              type="number" 
              placeholder="Сила F (Н)" 
              value={springForce} 
              onChange={(e) => setSpringForce(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Смещение Δx (м)" 
              value={displacement} 
              onChange={(e) => setDisplacement(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <div className="text-center text-gray-400 text-sm my-2">или длины:</div>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Начальная длина L₀ (м)" 
                value={initialLength} 
                onChange={(e) => setInitialLength(e.target.value)} 
                className="w-1/2 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
              <input 
                type="number" 
                placeholder="Конечная длина L (м)" 
                value={finalLength} 
                onChange={(e) => setFinalLength(e.target.value)} 
                className="w-1/2 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
            </div>
          </>
        );
      
      case "displacement":
        return (
          <>
            <input 
              type="number" 
              placeholder="Сила F (Н)" 
              value={springForce} 
              onChange={(e) => setSpringForce(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Жёсткость k (Н/м)" 
              value={springConstant} 
              onChange={(e) => setSpringConstant(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <div className="text-center text-gray-400 text-sm my-2">или длины:</div>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Начальная длина L₀ (м)" 
                value={initialLength} 
                onChange={(e) => setInitialLength(e.target.value)} 
                className="w-1/2 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
              <input 
                type="number" 
                placeholder="Конечная длина L (м)" 
                value={finalLength} 
                onChange={(e) => setFinalLength(e.target.value)} 
                className="w-1/2 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
            </div>
          </>
        );
      
      case "energy":
        return (
          <>
            <input 
              type="number" 
              placeholder="Жёсткость пружины k (Н/м)" 
              value={springConstant} 
              onChange={(e) => setSpringConstant(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Смещение Δx (м)" 
              value={displacement} 
              onChange={(e) => setDisplacement(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <div className="text-center text-gray-400 text-sm my-2">или длины:</div>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Начальная длина L₀ (м)" 
                value={initialLength} 
                onChange={(e) => setInitialLength(e.target.value)} 
                className="w-1/2 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
              <input 
                type="number" 
                placeholder="Конечная длина L (м)" 
                value={finalLength} 
                onChange={(e) => setFinalLength(e.target.value)} 
                className="w-1/2 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
            </div>
          </>
        );
      
      case "length_change":
        return (
          <>
            <input 
              type="number" 
              placeholder="Сила F (Н)" 
              value={springForce} 
              onChange={(e) => setSpringForce(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <input 
              type="number" 
              placeholder="Жёсткость k (Н/м)" 
              value={springConstant} 
              onChange={(e) => setSpringConstant(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          </>
        );
      
      default:
        return null;
    }
  };

  // Функция отображения полей для калькулятора момента силы
const renderTorqueInputs = () => {
  switch(calc8Type) {
    case "moment":
      return (
        <>
          <input 
            type="number" 
            placeholder="Сила F (Н)" 
            value={force8} 
            onChange={(e) => setForce8(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Плечо d (м)" 
            value={leverArm} 
            onChange={(e) => setLeverArm(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Угол α (°)" 
              value={angle} 
              onChange={(e) => setAngle(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <div className="text-sm text-gray-400 whitespace-nowrap">
              по умолчанию 90°
            </div>
          </div>
        </>
      );
    
    case "force":
    case "lever":
      return (
        <>
          <input 
            type="number" 
            placeholder="Момент M (Н·м)" 
            value={moment8} 
            onChange={(e) => setMoment8(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder={calc8Type === "force" ? "Плечо d (м)" : "Сила F (Н)"} 
            value={calc8Type === "force" ? leverArm : force8} 
            onChange={(e) => calc8Type === "force" ? setLeverArm(e.target.value) : setForce8(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Угол α (°)" 
            value={angle} 
            onChange={(e) => setAngle(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "angle":
      return (
        <>
          <input 
            type="number" 
            placeholder="Момент M (Н·м)" 
            value={moment8} 
            onChange={(e) => setMoment8(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Сила F (Н)" 
            value={force8} 
            onChange={(e) => setForce8(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Плечо d (м)" 
            value={leverArm} 
            onChange={(e) => setLeverArm(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "moment_inertia":
      return (
        <>
          <input 
            type="number" 
            placeholder="Момент инерции I (кг·м²)" 
            value={inertia} 
            onChange={(e) => setInertia(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Угловое ускорение α (рад/с²)" 
            value={angularAccel} 
            onChange={(e) => setAngularAccel(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "angular_accel":
    case "inertia":
      return (
        <>
          <input 
            type="number" 
            placeholder="Момент M (Н·м)" 
            value={moment8} 
            onChange={(e) => setMoment8(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder={calc8Type === "angular_accel" ? "Момент инерции I (кг·м²)" : "Угловое ускорение α (рад/с²)"} 
            value={calc8Type === "angular_accel" ? inertia : angularAccel} 
            onChange={(e) => calc8Type === "angular_accel" ? setInertia(e.target.value) : setAngularAccel(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    default:
      return null;
  }
};

const renderLeverInputs = () => {
  switch(calc9Type) {
    case "equilibrium":
      return (
        <>
          <p className="text-sm text-gray-400 text-center mb-2">Известны три величины, найти четвёртую</p>
          <input 
            type="number" 
            placeholder="Сила F₁ (Н)" 
            value={leverForce1} 
            onChange={(e) => setLeverForce1(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Плечо l₁ (м)" 
            value={leverArm1} 
            onChange={(e) => setLeverArm1(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Сила F₂ (Н)" 
            value={leverForce2} 
            onChange={(e) => setLeverForce2(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Плечо l₂ (м)" 
            value={leverArm2} 
            onChange={(e) => setLeverArm2(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "force_gain":
      return (
        <>
          <p className="text-sm text-gray-400 text-center mb-2">Введите две величины для нахождения третьей</p>
          <input 
            type="number" 
            placeholder="Выигрыш в силе k" 
            value={mechanicalAdvantage} 
            onChange={(e) => setMechanicalAdvantage(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Меньшая сила F₁ (Н)" 
            value={leverForce1} 
            onChange={(e) => setLeverForce1(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Большая сила F₂ (Н)" 
            value={leverForce2} 
            onChange={(e) => setLeverForce2(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <div className="text-center text-gray-400 text-sm my-2">или длины</div>
          <input 
            type="number" 
            placeholder="Длинное плечо l₁ (м)" 
            value={leverArm1} 
            onChange={(e) => setLeverArm1(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Короткое плечо l₂ (м)" 
            value={leverArm2} 
            onChange={(e) => setLeverArm2(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "efficiency":
      return (
        <>
          <input 
            type="number" 
            placeholder="Полезная работа A_полезн (Дж)" 
            value={outputWork} 
            onChange={(e) => setOutputWork(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Затраченная работа A_затрач (Дж)" 
            value={inputWork} 
            onChange={(e) => setInputWork(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "input_work":
      return (
        <>
          <input 
            type="number" 
            placeholder="Полезная работа A_полезн (Дж)" 
            value={outputWork} 
            onChange={(e) => setOutputWork(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="КПД механизма η (%)" 
            value={efficiencyPercentLever} 
            onChange={(e) => setEfficiencyPercentLever(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "output_work":
      return (
        <>
          <input 
            type="number" 
            placeholder="Затраченная работа A_затрач (Дж)" 
            value={inputWork} 
            onChange={(e) => setInputWork(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="КПД механизма η (%)" 
            value={efficiencyPercentLever} 
            onChange={(e) => setEfficiencyPercentLever(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    default:
      return null;
  }
};

const renderGearInputs = () => {
  switch(calc10Type) {
    case "gear_ratio":
      return (
        <>
          <input 
            type="number" 
            placeholder="Зубья ведущей Z₁" 
            value={driverGearTeeth} 
            onChange={(e) => setDriverGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Зубья ведомой Z₂" 
            value={drivenGearTeeth} 
            onChange={(e) => setDrivenGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <div className="text-center text-gray-400 text-sm my-2">или</div>
          <input 
            type="number" 
            placeholder="Обороты ведущей n₁ (об/мин)" 
            value={driverGearSpeed} 
            onChange={(e) => setDriverGearSpeed(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Обороты ведомой n₂ (об/мин)" 
            value={drivenGearSpeed} 
            onChange={(e) => setDrivenGearSpeed(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "driven_speed":
      return (
        <>
          <input 
            type="number" 
            placeholder="Обороты ведущей n₁ (об/мин)" 
            value={driverGearSpeed} 
            onChange={(e) => setDriverGearSpeed(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Зубья ведущей Z₁" 
            value={driverGearTeeth} 
            onChange={(e) => setDriverGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Зубья ведомой Z₂" 
            value={drivenGearTeeth} 
            onChange={(e) => setDrivenGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "driver_speed":
      return (
        <>
          <input 
            type="number" 
            placeholder="Обороты ведомой n₂ (об/мин)" 
            value={drivenGearSpeed} 
            onChange={(e) => setDrivenGearSpeed(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Зубья ведущей Z₁" 
            value={driverGearTeeth} 
            onChange={(e) => setDriverGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Зубья ведомой Z₂" 
            value={drivenGearTeeth} 
            onChange={(e) => setDrivenGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "torque_ratio":
    case "driven_torque":
    case "driver_torque":
      return (
        <>
          {calc10Type !== "torque_ratio" && (
            <input 
              type="number" 
              placeholder={calc10Type === "driven_torque" ? "Момент ведущей M₁ (Н·м)" : "Момент ведомой M₂ (Н·м)"} 
              value={calc10Type === "driven_torque" ? driverGearTorque : drivenGearTorque} 
              onChange={(e) => calc10Type === "driven_torque" ? setDriverGearTorque(e.target.value) : setDrivenGearTorque(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
          )}
          <input 
            type="number" 
            placeholder="Зубья ведущей Z₁" 
            value={driverGearTeeth} 
            onChange={(e) => setDriverGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Зубья ведомой Z₂" 
            value={drivenGearTeeth} 
            onChange={(e) => setDrivenGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="КПД передачи η (%)" 
              value={gearEfficiency} 
              onChange={(e) => setGearEfficiency(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            <div className="text-sm text-gray-400 whitespace-nowrap">
              обычно 90-98%
            </div>
          </div>
        </>
      );
    
    case "gear_module":
      return (
        <>
          <input 
            type="number" 
            placeholder="Делительный диаметр d (мм)" 
            value={gearPitchDiameter} 
            onChange={(e) => setGearPitchDiameter(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Число зубьев Z" 
            value={driverGearTeeth} 
            onChange={(e) => setDriverGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    case "pitch_diameter":
      return (
        <>
          <input 
            type="number" 
            placeholder="Модуль зацепления m (мм)" 
            value={gearModule} 
            onChange={(e) => setGearModule(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
          <input 
            type="number" 
            placeholder="Число зубьев Z" 
            value={driverGearTeeth} 
            onChange={(e) => setDriverGearTeeth(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
          />
        </>
      );
    
    default:
      return null;
  }
};

const renderCenterMassInputs = () => {
  switch(calc11Type) {
    case "center_mass_2d":
      return (
        <>
          <p className="text-sm text-gray-400 text-center mb-2">Тело 1</p>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" placeholder="m₁ (кг)" value={cmMass1} onChange={(e) => setCmMass1(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₁ (м)" value={x1} onChange={(e) => setX1(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="y₁ (м)" value={y1} onChange={(e) => setY1(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
          <p className="text-sm text-gray-400 text-center mb-2">Тело 2</p>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" placeholder="m₂ (кг)" value={cmMass2} onChange={(e) => setCmMass2(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₂ (м)" value={x2} onChange={(e) => setX2(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="y₂ (м)" value={y2} onChange={(e) => setY2(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
          <p className="text-sm text-gray-400 text-center mb-2">Тело 3 (опционально)</p>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" placeholder="m₃ (кг)" value={cmMass3} onChange={(e) => setCmMass3(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₃ (м)" value={x3} onChange={(e) => setX3(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="y₃ (м)" value={y3} onChange={(e) => setY3(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
        </>
      );
    
    case "center_mass_1d":
      return (
        <>
          <p className="text-sm text-gray-400 text-center mb-2">Тело 1</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="m₁ (кг)" value={cmMass1} onChange={(e) => setCmMass1(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₁ (м)" value={x1} onChange={(e) => setX1(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
          <p className="text-sm text-gray-400 text-center mb-2">Тело 2</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="m₂ (кг)" value={cmMass2} onChange={(e) => setCmMass2(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₂ (м)" value={x2} onChange={(e) => setX2(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
          <p className="text-sm text-gray-400 text-center mb-2">Тело 3 (опционально)</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="m₃ (кг)" value={cmMass3} onChange={(e) => setCmMass3(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₃ (м)" value={x3} onChange={(e) => setX3(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
        </>
      );
    
    case "find_mass":
      return (
        <>
          <p className="text-sm text-gray-400 text-center mb-2">Известные тела</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="m₁ (кг)" value={cmMass1} onChange={(e) => setCmMass1(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₁ (м)" value={x1} onChange={(e) => setX1(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="m₂ (кг)" value={cmMass2} onChange={(e) => setCmMass2(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₂ (м)" value={x2} onChange={(e) => setX2(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
          <p className="text-sm text-gray-400 text-center mb-2">Центр масс и координата неизвестного тела</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Xc (м)" value={centerX} onChange={(e) => setCenterX(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₃ (м)" value={x3} onChange={(e) => setX3(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
        </>
      );
    
    case "find_coordinate":
      return (
        <>
          <p className="text-sm text-gray-400 text-center mb-2">Известные тела</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="m₁ (кг)" value={cmMass1} onChange={(e) => setCmMass1(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₁ (м)" value={x1} onChange={(e) => setX1(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="m₂ (кг)" value={cmMass2} onChange={(e) => setCmMass2(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="x₂ (м)" value={x2} onChange={(e) => setX2(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="m₃ (кг)" value={cmMass3} onChange={(e) => setCmMass3(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
          <p className="text-sm text-gray-400 text-center mb-2">Центр масс системы</p>
          <input type="number" placeholder="Xc (м)" value={centerX} onChange={(e) => setCenterX(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
        </>
      );
    
    default:
      return null;
  }
};

const renderBeamInputs = () => {
  switch(calc12Type) {
    case "beam_deflection":
      return (
        <>
          <input type="number" placeholder="Нагрузка P (Н)" value={beamLoad} onChange={(e) => setBeamLoad(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          <input type="number" placeholder="Длина балки L (м)" value={beamLength} onChange={(e) => setBeamLength(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Модуль Юнга E (МПа)" value={youngModulus} onChange={(e) => setYoungModulus(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <div className="text-sm text-gray-400 whitespace-nowrap">сталь ≈ 200000</div>
          </div>
          <input type="number" placeholder="Момент инерции I (м⁴)" value={momentInertia} onChange={(e) => setMomentInertia(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          <p className="text-sm text-gray-400 text-center">или размеры сечения:</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Ширина b (мм)" value={beamWidth} onChange={(e) => setBeamWidth(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="Высота h (мм)" value={beamHeight} onChange={(e) => setBeamHeight(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
        </>
      );
    
    case "bending_moment":
      return (
        <>
          <input type="number" placeholder="Нагрузка P (Н)" value={beamLoad} onChange={(e) => setBeamLoad(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          <input type="number" placeholder="Длина балки L (м)" value={beamLength} onChange={(e) => setBeamLength(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
        </>
      );
    
    case "bending_stress":
      return (
        <>
          <input type="number" placeholder="Изгибающий момент M (Н·м)" value={bendingMoment} onChange={(e) => setBendingMoment(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          <input type="number" placeholder="Момент сопротивления W (м³)" value={sectionModulus} onChange={(e) => setSectionModulus(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
        </>
      );
    
    case "section_modulus_rect":
    case "moment_inertia_rect":
      return (
        <>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Ширина b (мм)" value={beamWidth} onChange={(e) => setBeamWidth(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
            <input type="number" placeholder="Высота h (мм)" value={beamHeight} onChange={(e) => setBeamHeight(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          </div>
        </>
      );
    
    case "max_load":
      return (
        <>
          <input type="number" placeholder="Допускаемое напряжение [σ] (МПа)" value={bendingStress} onChange={(e) => setBendingStress(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          <input type="number" placeholder="Момент сопротивления W (м³)" value={sectionModulus} onChange={(e) => setSectionModulus(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          <input type="number" placeholder="Длина балки L (м)" value={beamLength} onChange={(e) => setBeamLength(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
        </>
      );
    
    case "beam_length":
      return (
        <>
          <input type="number" placeholder="Допускаемое напряжение [σ] (МПа)" value={bendingStress} onChange={(e) => setBendingStress(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          <input type="number" placeholder="Момент сопротивления W (м³)" value={sectionModulus} onChange={(e) => setSectionModulus(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
          <input type="number" placeholder="Нагрузка P (Н)" value={beamLoad} onChange={(e) => setBeamLoad(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" />
        </>
      );
    
    default:
      return null;
  }
};

  const formatSpeedResult = () => {
    if (speedResult === null) return "0.00";
    
    let result = speedResult;
    let unit = getSpeedResultUnit();
    
    if (calc4Type === "time") {
      if (result >= 3600) {
        result = result / 3600;
        unit = "ч";
      } else if (result >= 60) {
        result = result / 60;
        unit = "мин";
      } else {
        unit = "с";
      }
    }
    
    return `${result.toFixed(2)} ${unit}`;
  };

  const formatPulleyResult = () => {
    if (pulleyResult === null) return "0.00";
    
    let result = pulleyResult;
    
    // Для коэффициента передачи - отображать как отношение (например 2.5:1)
    if (calc6Type === "speed_ratio") {
      return `${result.toFixed(3)} : 1`;
    }
    
    return `${result.toFixed(2)} ${getPulleyResultUnit()}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-10 px-4">
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
      <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 text-orange-500 tracking-tight">
        Механические калькуляторы
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">

        {/* ========== 1. СИЛА, МАССА, УСКОРЕНИЕ ========== */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 relative">
          
          <button
            onClick={resetCalculator1}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-orange-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-orange-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-orange-600/20 rounded-xl">
              <Wrench className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Сила, масса, ускорение</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-lg font-mono text-orange-300">F = m × a</p>
            <p className="text-sm text-gray-400 mt-1">Вес: P = m × g | Трение: Fтр = μ × N</p>
          </div>
          
          <select 
            value={calc1Type} 
            onChange={(e) => setCalc1Type(e.target.value)} 
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="force">Найти силу F (Н)</option>
            <option value="mass">Найти массу m (кг)</option>
            <option value="accel">Найти ускорение a (м/с²)</option>
            <option value="weight">Найти вес P (Н)</option>
            <option value="friction">Найти силу трения Fтр (Н)</option>
          </select>
          
          <div className="space-y-4">
            <input 
              type="number" 
              placeholder="Масса m (кг)" 
              value={mass} 
              onChange={(e) => setMass(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
            />
            
            {(calc1Type === "force" || calc1Type === "mass" || calc1Type === "accel") && (
              <input 
                type="number" 
                placeholder="Ускорение a (м/с²)" 
                value={acceleration} 
                onChange={(e) => setAcceleration(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
            )}
            
            {(calc1Type === "friction") && (
              <input 
                type="number" 
                placeholder="Коэффициент трения μ" 
                value={frictionCoeff} 
                onChange={(e) => setFrictionCoeff(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
            )}
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <p className="text-4xl font-bold text-orange-400">
              {forceResult !== null ? forceResult.toFixed(2) : "0.00"}
            </p>
            <p className="text-gray-400 mt-2">{getResultUnit()}</p>
          </div>
        </div>

        {/* ========== 2. РАБОТА И ЭНЕРГИЯ ========== */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-green-500 transition-all duration-300 relative">
          
          <button
            onClick={resetCalculator2}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-green-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-green-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-green-600/20 rounded-xl">
              <Battery className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Работа и энергия</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-lg font-mono text-green-300">A = F × s</p>
            <p className="text-sm text-gray-400 mt-1">Ek = ½mv² | Ep = mgh</p>
          </div>
          
          <select 
            value={calc2Type} 
            onChange={(e) => setCalc2Type(e.target.value)} 
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="work">Найти работу A (Дж)</option>
            <option value="force">Найти силу F (Н)</option>
            <option value="distance">Найти путь s (м)</option>
            <option value="kinetic">Найти кинетическую энергию Ek (Дж)</option>
            <option value="potential">Найти потенциальную энергию Ep (Дж)</option>
          </select>
          
          <div className="space-y-4">
            {calc2Type === "work" && (
              <>
                <input 
                  type="number" 
                  placeholder="Сила F (Н)" 
                  value={force2} 
                  onChange={(e) => setForce2(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
                <input 
                  type="number" 
                  placeholder="Путь s (м)" 
                  value={distance} 
                  onChange={(e) => setDistance(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
              </>
            )}
            
            {calc2Type === "force" && (
              <>
                <input 
                  type="number" 
                  placeholder="Работа A (Дж)" 
                  value={force2} 
                  onChange={(e) => setForce2(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
                <input 
                  type="number" 
                  placeholder="Путь s (м)" 
                  value={distance} 
                  onChange={(e) => setDistance(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
              </>
            )}
            
            {calc2Type === "distance" && (
              <>
                <input 
                  type="number" 
                  placeholder="Работа A (Дж)" 
                  value={force2} 
                  onChange={(e) => setForce2(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
                <input 
                  type="number" 
                  placeholder="Сила F (Н)" 
                  value={distance} 
                  onChange={(e) => setDistance(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
              </>
            )}
            
            {calc2Type === "kinetic" && (
              <>
                <input 
                  type="number" 
                  placeholder="Масса m (кг)" 
                  value={cmMass2} 
                  onChange={(e) => setCmMass2(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
                <input 
                  type="number" 
                  placeholder="Скорость v (м/с)" 
                  value={velocity} 
                  onChange={(e) => setVelocity(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
              </>
            )}
            
            {calc2Type === "potential" && (
              <>
                <input 
                  type="number" 
                  placeholder="Масса m (кг)" 
                  value={cmMass2} 
                  onChange={(e) => setCmMass2(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
                <input 
                  type="number" 
                  placeholder="Высота h (м)" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                />
              </>
            )}
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <p className="text-4xl font-bold text-green-400">
              {energyResult !== null ? energyResult.toFixed(2) : "0.00"}
            </p>
            <p className="text-gray-400 mt-2">{getEnergyResultUnit()}</p>
            <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
              <span>{getEnergyFormula()}</span>
            </div>
          </div>
        </div>

        {/* ========== 3. МОЩНОСТЬ И КПД ========== */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 relative">
          
          <button
            onClick={resetCalculator3}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-blue-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-blue-600/20 rounded-xl">
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Мощность и КПД</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-lg font-mono text-blue-300">P = A/t = F×v</p>
            <p className="text-sm text-gray-400 mt-1">η = (Pполезн/Pзатрач) × 100%</p>
          </div>
          
          <select 
            value={calc3Type} 
            onChange={(e) => setCalc3Type(e.target.value)} 
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="power">Найти мощность P (Вт)</option>
            <option value="work">Найти работу A (Дж)</option>
            <option value="time">Найти время t (с)</option>
            <option value="efficiency">Найти КПД η (%)</option>
            <option value="useful_power">Найти полезную мощность Pп (Вт)</option>
          </select>
          
          <div className="space-y-4">
            {renderPowerInputs()}
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <p className="text-4xl font-bold text-blue-400">
              {powerResult !== null ? powerResult.toFixed(2) : "0.00"}
            </p>
            <p className="text-gray-400 mt-2">{getPowerResultUnit()}</p>
            <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
              <span>{getPowerFormula()}</span>
            </div>
          </div>
        </div>

        {/* ========== 4. СКОРОСТЬ, ПУТЬ, ВРЕМЯ ========== */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 relative">
          
          <button
            onClick={resetCalculator4}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-purple-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-purple-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-purple-600/20 rounded-xl">
              <Car className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Скорость, путь, время</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-lg font-mono text-purple-300">v = s ÷ t</p>
            <p className="text-sm text-gray-400 mt-1">s = v × t | t = s ÷ v</p>
          </div>
          
          <select 
            value={calc4Type} 
            onChange={(e) => setCalc4Type(e.target.value)} 
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="speed">Найти скорость v</option>
            <option value="distance">Найти путь s</option>
            <option value="time">Найти время t</option>
          </select>
          
          <div className="space-y-4">
            {calc4Type === "speed" && (
              <>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Путь s" 
                    value={distance4} 
                    onChange={(e) => setDistance4(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                  <select 
                    value={distanceUnit4} 
                    onChange={(e) => setDistanceUnit4(e.target.value)}
                    className="w-24 p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="m">м</option>
                    <option value="km">км</option>
                    <option value="cm">см</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Время t" 
                    value={time4} 
                    onChange={(e) => setTime4(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                  <select 
                    value={timeUnit4} 
                    onChange={(e) => setTimeUnit4(e.target.value)}
                    className="w-24 p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="s">с</option>
                    <option value="min">мин</option>
                    <option value="h">ч</option>
                  </select>
                </div>
              </>
            )}
            
            {calc4Type === "distance" && (
              <>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Скорость v" 
                    value={speed4} 
                    onChange={(e) => setSpeed4(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                  <select 
                    value={speedUnit4} 
                    onChange={(e) => setSpeedUnit4(e.target.value)}
                    className="w-24 p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="m/s">м/с</option>
                    <option value="km/h">км/ч</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Время t" 
                    value={time4} 
                    onChange={(e) => setTime4(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                  <select 
                    value={timeUnit4} 
                    onChange={(e) => setTimeUnit4(e.target.value)}
                    className="w-24 p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="s">с</option>
                    <option value="min">мин</option>
                    <option value="h">ч</option>
                  </select>
                </div>
              </>
            )}
            
            {calc4Type === "time" && (
              <>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Путь s" 
                    value={distance4} 
                    onChange={(e) => setDistance4(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                  <select 
                    value={distanceUnit4} 
                    onChange={(e) => setDistanceUnit4(e.target.value)}
                    className="w-24 p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="m">м</option>
                    <option value="km">км</option>
                    <option value="cm">см</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Скорость v" 
                    value={speed4} 
                    onChange={(e) => setSpeed4(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                  <select 
                    value={speedUnit4} 
                    onChange={(e) => setSpeedUnit4(e.target.value)}
                    className="w-24 p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="m/s">м/с</option>
                    <option value="km/h">км/ч</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <p className="text-4xl font-bold text-purple-400">
              {formatSpeedResult()}
            </p>
            <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
              <span>{getSpeedFormula()}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========== ВТОРАЯ СТРОКА С 5-М, 6-М И 7-М КАЛЬКУЛЯТОРАМИ ========== */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto mt-8">
        
        {/* ========== 5. ГИДРАВЛИКА ========== */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 relative">
          
          <button
            onClick={resetCalculator5}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-cyan-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-cyan-600/20 rounded-xl">
              <Droplets className="w-8 h-8 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Гидравлика</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-lg font-mono text-cyan-300">p = F/A | p = ρgh</p>
            <p className="text-sm text-gray-400 mt-1">Q = A×v | v = Q/A</p>
          </div>
          
          <select 
            value={calc5Type} 
            onChange={(e) => setCalc5Type(e.target.value)} 
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="pressure">Давление от силы (Па)</option>
            <option value="force">Найти силу F (Н)</option>
            <option value="area">Найти площадь A (м²)</option>
            <option value="hydrostatic">Давление жидкости (Па)</option>
            <option value="flow_rate">Найти расход Q (м³/с)</option>
            <option value="velocity">Найти скорость v (м/с)</option>
            <option value="pipe_diameter">Диаметр трубы: D (м)</option> 
          </select>
          
          <div className="space-y-4">
            {renderHydraulicInputs()}
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <p className="text-4xl font-bold text-cyan-400">
              {hydraulicResult !== null ? hydraulicResult.toFixed(3) : "0.00"}
            </p>
            <p className="text-gray-400 mt-2">{getHydraulicResultUnit()}</p>
            <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
              <span>{getHydraulicFormula()}</span>
            </div>
          </div>
        </div>
        
        {/* ========== 6. ШКИВЫ И РЕМЕННЫЕ ПЕРЕДАЧИ ========== */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-amber-500 transition-all duration-300 relative">
          
          <button
            onClick={resetCalculator6}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-amber-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-amber-600/20 rounded-xl">
              <Cog className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Шкивы и передачи</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-lg font-mono text-amber-300">i = D₁/D₂ = n₂/n₁</p>
            <p className="text-sm text-gray-400 mt-1">n₂ = n₁ × D₁/D₂ | L = 2C + π(D₁+D₂)/2</p>
          </div>
          
          <select 
            value={calc6Type} 
            onChange={(e) => setCalc6Type(e.target.value)} 
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="speed_ratio">Коэффициент передачи i</option>
            <option value="driven_speed">Обороты ведомого n₂ (об/мин)</option>
            <option value="drive_speed">Обороты ведущего n₁ (об/мин)</option>
            <option value="driven_diameter">Диаметр ведомого D₂ (мм)</option>
            <option value="belt_length">Длина ремня L (мм)</option>
            <option value="center_distance">Межосевое расстояние C (мм)</option>
          </select>
          
          <div className="space-y-4">
            {renderPulleyInputs()}
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <p className="text-4xl font-bold text-amber-400">
              {formatPulleyResult()}
            </p>
            <p className="text-gray-400 mt-2">{getPulleyResultUnit()}</p>
            <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
              <span>{getPulleyFormula()}</span>
            </div>
          </div>
        </div>
        
        {/* ========== 7. ПРУЖИНЫ ========== */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-pink-500 transition-all duration-300 relative">
          
          <button
            onClick={resetCalculator7}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-pink-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-pink-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-pink-600/20 rounded-xl">
              <GitPullRequest className="w-8 h-8 text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Пружины</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-lg font-mono text-pink-300">F = k × Δx</p>
            <p className="text-sm text-gray-400 mt-1">Ep = ½kΔx²</p>
          </div>
          
          <select 
            value={calc7Type} 
            onChange={(e) => setCalc7Type(e.target.value)} 
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="force">Найти силу упругости F (Н)</option>
            <option value="constant">Найти жёсткость k (Н/м)</option>
            <option value="displacement">Найти смещение Δx (м)</option>
            <option value="energy">Найти энергию пружины Ep (Дж)</option>
            <option value="length_change">Найти изменение длины Δx (м)</option>
          </select>
          
          <div className="space-y-4">
            {renderSpringInputs()}
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <p className="text-4xl font-bold text-pink-400">
              {springResult !== null ? springResult.toFixed(3) : "0.00"}
            </p>
            <p className="text-gray-400 mt-2">{getSpringResultUnit()}</p>
            <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
              <span>{getSpringFormula()}</span>
            </div>
          </div>
        </div>

        {/* ========== 8. МОМЕНТ СИЛЫ ========== */}
<div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-rose-500 transition-all duration-300 relative">
  
  <button
    onClick={resetCalculator8}
    className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-rose-500/20 transition-all duration-300 group"
    title="Сбросить значения"
  >
    <RefreshCw className="w-5 h-5 text-rose-400 group-hover:rotate-180 transition-transform duration-500" />
  </button>
  
  <div className="flex items-center gap-4 mb-6">
    <div className="p-4 bg-rose-600/20 rounded-xl">
      <RotateCw className="w-8 h-8 text-rose-500" />
    </div>
    <h2 className="text-2xl font-bold text-white">Момент силы</h2>
  </div>
  
  <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
    <p className="text-lg font-mono text-rose-300">M = F × d × sin(α)</p>
    <p className="text-sm text-gray-400 mt-1">M = I × α | 1 Н·м ≈ 0.102 кгс·м</p>
  </div>
  
  <select 
    value={calc8Type} 
    onChange={(e) => setCalc8Type(e.target.value)} 
    className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
  >
    <option value="moment">Найти момент M (Н·м)</option>
    <option value="force">Найти силу F (Н)</option>
    <option value="lever">Найти плечо d (м)</option>
    <option value="angle">Найти угол α (°)</option>
    <option value="moment_inertia">Момент через инерцию M (Н·м)</option>
    <option value="angular_accel">Найти угловое ускорение α (рад/с²)</option>
    <option value="inertia">Найти момент инерции I (кг·м²)</option>
  </select>
  
  <div className="space-y-4">
    {renderTorqueInputs()}
  </div>

  <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
    <p className="text-4xl font-bold text-rose-400">
      {torqueResult !== null ? torqueResult.toFixed(3) : "0.000"}
    </p>
    <p className="text-gray-400 mt-2">{getTorqueResultUnit()}</p>
    <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
      <span>{getTorqueFormula()}</span>
    </div>
  </div>
</div>

{/* ========== 9. РЫЧАГИ И УСЛОВИЯ РАВНОВЕСИЯ ========== */}
<div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 relative">
  
  <button
    onClick={resetCalculator9}
    className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-emerald-500/20 transition-all duration-300 group"
    title="Сбросить значения"
  >
    <RefreshCw className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
  </button>
  
  <div className="flex items-center gap-4 mb-6">
    <div className="p-4 bg-emerald-600/20 rounded-xl">
      <Scale className="w-8 h-8 text-emerald-500" />
    </div>
    <h2 className="text-2xl font-bold text-white">Рычаги и равновесие</h2>
  </div>
  
  <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
    <p className="text-lg font-mono text-emerald-300">F₁ × l₁ = F₂ × l₂</p>
    <p className="text-sm text-gray-400 mt-1">k = l₁/l₂ | η = (A_полезн/A_затрач) × 100%</p>
  </div>
  
  <select 
    value={calc9Type} 
    onChange={(e) => setCalc9Type(e.target.value)} 
    className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
  >
    <option value="equilibrium">Условие равновесия рычага</option>
    <option value="force_gain">Выигрыш в силе (k)</option>
    <option value="efficiency">КПД механизма (η)</option>
    <option value="input_work">Найти затраченную работу</option>
    <option value="output_work">Найти полезную работу</option>
  </select>
  
  <div className="space-y-4">
    {renderLeverInputs()}
  </div>

  <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
    <p className="text-4xl font-bold text-emerald-400">
      {leverResult !== null ? leverResult.toFixed(2) : "0.00"}
    </p>
    <p className="text-gray-400 mt-2">{getLeverResultUnit()}</p>
    <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
      <span>{getLeverFormula()}</span>
    </div>
  </div>
</div>

{/* ========== 10. ПЕРЕДАЧИ И РЕДУКТОРЫ ========== */}
<div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-violet-500 transition-all duration-300 relative">
  
  <button
    onClick={resetCalculator10}
    className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-violet-500/20 transition-all duration-300 group"
    title="Сбросить значения"
  >
    <RefreshCw className="w-5 h-5 text-violet-400 group-hover:rotate-180 transition-transform duration-500" />
  </button>
  
  <div className="flex items-center gap-4 mb-6">
    <div className="p-4 bg-violet-600/20 rounded-xl">
      <Cog className="w-8 h-8 text-violet-500" />
    </div>
    <h2 className="text-2xl font-bold text-white">Передачи и редукторы</h2>
  </div>
  
  <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
    <p className="text-lg font-mono text-violet-300">i = Z₂/Z₁ = n₁/n₂</p>
    <p className="text-sm text-gray-400 mt-1">M₂ = M₁ × i × η | d = m × Z</p>
  </div>
  
  <select 
    value={calc10Type} 
    onChange={(e) => setCalc10Type(e.target.value)} 
    className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
  >
    <option value="gear_ratio">Передаточное отношение (i)</option>
    <option value="driven_speed">Обороты ведомой (n₂)</option>
    <option value="driver_speed">Обороты ведущей (n₁)</option>
    <option value="torque_ratio">Отношение моментов (M₂/M₁)</option>
    <option value="driven_torque">Момент ведомой (M₂)</option>
    <option value="driver_torque">Момент ведущей (M₁)</option>
    <option value="gear_module">Модуль зацепления (m)</option>
    <option value="pitch_diameter">Делительный диаметр (d)</option>
  </select>
  
  <div className="space-y-4">
    {renderGearInputs()}
  </div>

  <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
    <p className="text-4xl font-bold text-violet-400">
      {gearResult !== null ? gearResult.toFixed(3) : "0.000"}
    </p>
    <p className="text-gray-400 mt-2">{getGearResultUnit()}</p>
    <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
      <span>{getGearFormula()}</span>
    </div>
  </div>
</div>

{/* ========== 11. ЦЕНТР МАСС (ЦЕНТР ТЯЖЕСТИ) ========== */}
<div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-indigo-500 transition-all duration-300 relative">
  
  <button
    onClick={resetCalculator11}
    className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-indigo-500/20 transition-all duration-300 group"
    title="Сбросить значения"
  >
    <RefreshCw className="w-5 h-5 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
  </button>
  
  <div className="flex items-center gap-4 mb-6">
    <div className="p-4 bg-indigo-600/20 rounded-xl">
      <Target className="w-8 h-8 text-indigo-500" />
    </div>
    <h2 className="text-2xl font-bold text-white">Центр масс</h2>
  </div>
  
  <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
    <p className="text-lg font-mono text-indigo-300">Xc = Σ(mᵢ·xᵢ) / Σmᵢ</p>
    <p className="text-sm text-gray-400 mt-1">Yc = Σ(mᵢ·yᵢ) / Σmᵢ</p>
  </div>
  
  <select 
    value={calc11Type} 
    onChange={(e) => setCalc11Type(e.target.value)} 
    className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
  >
    <option value="center_mass_2d">Центр масс в 2D (x, y)</option>
    <option value="center_mass_1d">Центр масс на прямой (x)</option>
    <option value="find_mass">Найти массу тела</option>
    <option value="find_coordinate">Найти координату тела</option>
  </select>
  
  <div className="space-y-4">
    {renderCenterMassInputs()}
  </div>

  <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
    <div className="space-y-2">
      {centerMassResult.x !== null && (
        <p className="text-2xl font-bold text-indigo-400">
          Xc = {centerMassResult.x.toFixed(3)} м
        </p>
      )}
      {centerMassResult.y !== null && centerMassResult.y !== 0 && (
        <p className="text-2xl font-bold text-indigo-400">
          Yc = {centerMassResult.y.toFixed(3)} м
        </p>
      )}
      {centerMassResult.totalMass !== null && calc11Type !== "find_mass" && (
        <p className="text-lg text-indigo-300">
          Общая масса: {centerMassResult.totalMass.toFixed(3)} кг
        </p>
      )}
      {centerMassResult.totalMass !== null && calc11Type === "find_mass" && (
        <p className="text-2xl font-bold text-indigo-400">
          m₃ = {centerMassResult.totalMass.toFixed(3)} кг
        </p>
      )}
      {centerMassResult.x !== null && calc11Type === "find_coordinate" && (
        <p className="text-2xl font-bold text-indigo-400">
          x₃ = {centerMassResult.x.toFixed(3)} м
        </p>
      )}
      {(centerMassResult.x === null && centerMassResult.y === null && centerMassResult.totalMass === null) && (
        <p className="text-2xl font-bold text-indigo-400">0.000</p>
      )}
    </div>
    <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
      <span>{getCenterMassFormula()}</span>
    </div>
  </div>
</div>

{/* ========== 12. ПРОЧНОСТЬ БАЛОК ========== */}
<div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-amber-500 transition-all duration-300 relative">
  
  <button
    onClick={resetCalculator12}
    className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-amber-500/20 transition-all duration-300 group"
    title="Сбросить значения"
  >
    <RefreshCw className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
  </button>
  
  <div className="flex items-center gap-4 mb-6">
    <div className="p-4 bg-amber-600/20 rounded-xl">
      <Ruler className="w-8 h-8 text-amber-500" />
    </div>
    <h2 className="text-2xl font-bold text-white">Прочность балок</h2>
  </div>
  
  <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
    <p className="text-lg font-mono text-amber-300">σ = M/W | f = (P·L³)/(3·E·I)</p>
    <p className="text-sm text-gray-400 mt-1">W = (b·h²)/6 | I = (b·h³)/12</p>
  </div>
  
  <select 
    value={calc12Type} 
    onChange={(e) => setCalc12Type(e.target.value)} 
    className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
  >
    <option value="beam_deflection">Прогиб балки</option>
    <option value="bending_moment">Изгибающий момент</option>
    <option value="bending_stress">Напряжение изгиба</option>
    <option value="section_modulus_rect">Момент сопротивления (прямоугольник)</option>
    <option value="moment_inertia_rect">Момент инерции (прямоугольник)</option>
    <option value="max_load">Максимальная нагрузка</option>
    <option value="beam_length">Максимальная длина</option>
  </select>
  
  <div className="space-y-4">
    {renderBeamInputs()}
  </div>

  <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 text-center">
    <p className="text-4xl font-bold text-amber-400">
      {beamResult !== null ? beamResult.toFixed(6) : "0.000000"}
    </p>
    <p className="text-gray-400 mt-2">{getBeamResultUnit()}</p>
    <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
      <span>{getBeamFormula()}</span>
    </div>
  </div>
</div>
        
        {/* Пустой блок для выравнивания */}
      
      </div>

      <div className="text-center mt-20 text-gray-500">
  <p className="text-lg">Набор механических калькуляторов для учёбы и работы! 🔧</p>
  <p className="text-sm mt-2 text-gray-600">Добавь сайт в закладки чтобы не потерять</p>
</div>
    </div>
  );
}