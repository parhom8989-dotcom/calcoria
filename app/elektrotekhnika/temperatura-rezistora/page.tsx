// app/elektrotekhnika/temperatura-rezistora/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function TemperaturaRezistoraPage() {
  // Режим расчета
  const [mode, setMode] = useState<string>('temperature'); // 'temperature', 'power', 'resistance'
  
  // Основные параметры
  const [power, setPower] = useState<string>('0.25');
  const [resistance, setResistance] = useState<string>('1000');
  const [current, setCurrent] = useState<string>('0.015');
  const [voltage, setVoltage] = useState<string>('15');
  
  // Тепловые параметры
  const [ambientTemp, setAmbientTemp] = useState<string>('25');
  const [maxTemp, setMaxTemp] = useState<string>('155');
  const [thermalResistance, setThermalResistance] = useState<string>('200');
  
  // Физические параметры резистора
  const [resistorType, setResistorType] = useState<string>('metal-film');
  const [resistorSize, setResistorSize] = useState<string>('0805');
  const [mountingType, setMountingType] = useState<string>('pcb');
  
  // Результаты
  const [result, setResult] = useState<{
    temperature: number;
    temperatureRise: number;
    powerDissipated: number;
    maxAllowedPower: number;
    safetyMargin: number;
    warnings: string[];
    recommendations: string[];
    thermalTimeConstant?: number;
    timeToOverheat?: number;
  } | null>(null);

  // Типы резисторов (тепловые характеристики)
  const resistorTypes = {
    'metal-film': { name: 'Металлоплёночный', thermalResistance: 200, maxTemp: 155, color: '#3b82f6' },
    'carbon-film': { name: 'Углеродный', thermalResistance: 250, maxTemp: 125, color: '#8b5cf6' },
    'wirewound': { name: 'Проволочный', thermalResistance: 150, maxTemp: 200, color: '#ef4444' },
    'ceramic': { name: 'Керамический', thermalResistance: 100, maxTemp: 175, color: '#f59e0b' },
    'thick-film': { name: 'Толстоплёночный', thermalResistance: 180, maxTemp: 150, color: '#10b981' },
    'thin-film': { name: 'Тонкоплёночный', thermalResistance: 220, maxTemp: 125, color: '#06b6d4' },
  };

  // Стандартные размеры SMD резисторов
  const smdSizes = {
    '0201': { name: '0201', power: 0.05, thermalResistance: 500, dimensions: '0.6×0.3mm' },
    '0402': { name: '0402', power: 0.1, thermalResistance: 400, dimensions: '1.0×0.5mm' },
    '0603': { name: '0603', power: 0.1, thermalResistance: 300, dimensions: '1.6×0.8mm' },
    '0805': { name: '0805', power: 0.125, thermalResistance: 200, dimensions: '2.0×1.25mm' },
    '1206': { name: '1206', power: 0.25, thermalResistance: 150, dimensions: '3.2×1.6mm' },
    '1210': { name: '1210', power: 0.5, thermalResistance: 100, dimensions: '3.2×2.5mm' },
    '2010': { name: '2010', power: 0.75, thermalResistance: 80, dimensions: '5.0×2.5mm' },
    '2512': { name: '2512', power: 1, thermalResistance: 60, dimensions: '6.3×3.2mm' },
  };

  // Типы монтажа
  const mountingTypes = {
    'pcb': { name: 'На плате', derating: 1.0, description: 'Стандартный монтаж' },
    'with-heatsink': { name: 'С радиатором', derating: 0.7, description: 'Улучшенное охлаждение' },
    'free-air': { name: 'В воздухе', derating: 0.5, description: 'Плохое охлаждение' },
    'enclosed': { name: 'В корпусе', derating: 0.3, description: 'Плохое охлаждение' },
  };

  // Типовые мощности резисторов
  const typicalPowers = [
    { value: '0.125', label: '1/8 Вт', desc: 'Маломощные' },
    { value: '0.25', label: '1/4 Вт', desc: 'Стандарт' },
    { value: '0.5', label: '1/2 Вт', desc: 'Средние' },
    { value: '1', label: '1 Вт', desc: 'Мощные' },
    { value: '2', label: '2 Вт', desc: 'Силовые' },
  ];

  // Типовые температуры
  const typicalTemperatures = [
    { value: '25', label: '25°C', desc: 'Комнатная' },
    { value: '40', label: '40°C', desc: 'Жарко' },
    { value: '60', label: '60°C', desc: 'Внутри корпуса' },
    { value: '85', label: '85°C', desc: 'Промышленная' },
  ];

  // Форматирование температуры
  const formatTemperature = (temp: number): string => {
    return temp.toFixed(1) + '°C';
  };

  // Расчет температуры резистора
  const calculate = () => {
    const P = parseFloat(power) || 0;
    const R = parseFloat(resistance) || 0;
    const I = parseFloat(current) || 0;
    const V = parseFloat(voltage) || 0;
    const T_amb = parseFloat(ambientTemp) || 25;
    const T_max = parseFloat(maxTemp) || 155;
    const R_th = parseFloat(thermalResistance) || 200;
    
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Расчет рассеиваемой мощности в зависимости от режима
    let calculatedPower = P;
    
    if (mode === 'resistance') {
      // Расчет мощности по сопротивлению и току/напряжению
      if (I > 0 && R > 0) {
        calculatedPower = I * I * R; // P = I²R
      } else if (V > 0 && R > 0) {
        calculatedPower = (V * V) / R; // P = V²/R
      }
    } else if (mode === 'temperature') {
      // Расчет мощности уже задан
      calculatedPower = P;
    }

    // Расчет температуры
    const temperatureRise = calculatedPower * R_th; // ΔT = P × R_th
    const temperature = T_amb + temperatureRise;
    
    // Расчет максимально допустимой мощности
    const maxAllowedPower = (T_max - T_amb) / R_th;
    
    // Запас по мощности (%)
    const safetyMargin = maxAllowedPower > 0 
      ? ((maxAllowedPower - calculatedPower) / maxAllowedPower) * 100 
      : -100;

    // Проверки и предупреждения
    if (temperature > T_max) {
      warnings.push(`🔥 ПЕРЕГРЕВ! Температура (${formatTemperature(temperature)}) превышает максимальную (${T_max}°C)`);
    } else if (temperature > T_max * 0.8) {
      warnings.push(`⚠️ Высокая температура: ${formatTemperature(temperature)} (близко к максимуму)`);
    }

    if (safetyMargin < 0) {
      warnings.push(`❌ Превышена допустимая мощность на ${Math.abs(safetyMargin).toFixed(1)}%`);
    } else if (safetyMargin < 20) {
      warnings.push(`⚠️ Маленький запас по мощности: ${safetyMargin.toFixed(1)}%`);
    }

    if (temperatureRise > 100) {
      warnings.push('🌡️ Очень большой перегрев - проверьте охлаждение');
    }

    if (calculatedPower > 1 && R_th > 100) {
      warnings.push('💨 Высокое тепловое сопротивление при большой мощности');
    }

    // Рекомендации
    if (temperature > T_max) {
      recommendations.push('➡️ Увеличьте тепловое сопротивление (лучшее охлаждение)');
      recommendations.push('➡️ Используйте резистор большей мощности');
      recommendations.push('➡️ Добавьте радиатор или вентилятор');
    } else if (safetyMargin > 50) {
      recommendations.push('✅ Большой запас - можно использовать меньший резистор');
    }

    if (R_th > 250) {
      recommendations.push('➡️ Тепловое сопротивление слишком высокое - улучшите охлаждение');
    }

    // Расчет постоянной времени нагрева (приблизительно)
    // Для типичного резистора: τ = C_th × R_th, где C_th ~ 1-10 Дж/°C
    const thermalCapacitance = 5; // Дж/°C, примерное значение
    const thermalTimeConstant = thermalCapacitance * R_th; // секунды
    
    // Расчет времени до перегрева (если превышена мощность)
    let timeToOverheat: number | undefined;
    if (temperature > T_max) {
      // Примерный расчет: t = τ × ln((T_max - T_amb)/(T_max - temperature))
      // Упрощенная формула для понимания масштаба времени
      timeToOverheat = thermalTimeConstant * 0.1; // Примерная оценка
    }

    // Для SMD резисторов добавляем специфичные проверки
    const selectedSize = smdSizes[resistorSize as keyof typeof smdSizes];
    if (selectedSize && calculatedPower > selectedSize.power) {
      warnings.push(`⚠️ Мощность превышает номинал для SMD ${resistorSize} (${selectedSize.power}Вт)`);
    }

    setResult({
      temperature,
      temperatureRise,
      powerDissipated: calculatedPower,
      maxAllowedPower,
      safetyMargin,
      warnings,
      recommendations,
      thermalTimeConstant,
      timeToOverheat
    });
  };

  // Автоматический пересчет
  useEffect(() => {
    calculate();
  }, [mode, power, resistance, current, voltage, ambientTemp, maxTemp, thermalResistance, resistorType, resistorSize, mountingType]);

  // Сброс
  const resetCalculator = () => {
    setPower('0.25');
    setResistance('1000');
    setCurrent('0.015');
    setVoltage('15');
    setAmbientTemp('25');
    setMaxTemp('155');
    setThermalResistance('200');
    setResult(null);
  };

  // Выбор типа резистора
  const selectResistorType = (type: string) => {
    setResistorType(type);
    const resistor = resistorTypes[type as keyof typeof resistorTypes];
    if (resistor) {
      setThermalResistance(resistor.thermalResistance.toString());
      setMaxTemp(resistor.maxTemp.toString());
    }
  };

  // Выбор размера SMD
  const selectResistorSize = (size: string) => {
    setResistorSize(size);
    const smd = smdSizes[size as keyof typeof smdSizes];
    if (smd) {
      setThermalResistance(smd.thermalResistance.toString());
      // Устанавливаем типичную мощность для этого размера
      const typicalPower = smd.power * 0.8; // 80% от максимальной
      setPower(typicalPower.toString());
    }
  };

  // Выбор типа монтажа
  const selectMountingType = (type: string) => {
    setMountingType(type);
    const mount = mountingTypes[type as keyof typeof mountingTypes];
    if (mount) {
      // Корректируем тепловое сопротивление в зависимости от монтажа
      const baseResistance = parseFloat(thermalResistance) || 200;
      const adjustedResistance = baseResistance / mount.derating;
      setThermalResistance(adjustedResistance.toFixed(0));
    }
  };

  // Выбор типовой мощности
  const selectTypicalPower = (value: string) => {
    setPower(value);
  };

  // Выбор типовой температуры
  const selectTypicalTemperature = (value: string) => {
    setAmbientTemp(value);
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
              color: '#10b981'
            }}>
              🌡️ Калькулятор температуры резистора
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт нагрева резистора, теплового режима и допустимой мощности
            </p>
          </div>

          {/* Кнопки навигации */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <a 
              href="/elektrotekhnika"
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
            >
              ← В каталог
            </a>
            
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
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Выбор режима */}
<div style={{ marginBottom: '24px' }}>
  <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
    Режим расчета
  </h3>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '20px',
    width: '100%'
  }}>
    <button
      type="button"
      onClick={() => setMode('temperature')}
      style={{
        padding: '12px 4px',
        backgroundColor: mode === 'temperature' ? '#10b981' : '#334155',
        color: 'white',
        border: `2px solid ${mode === 'temperature' ? '#10b981' : '#475569'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 'clamp(12px, 2.5vw, 14px)',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 'bold' }}>🌡️ По мощности</div>
      <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', opacity: 0.8, marginTop: '2px' }}>температура</div>
    </button>
    
    <button
      type="button"
      onClick={() => setMode('resistance')}
      style={{
        padding: '12px 4px',
        backgroundColor: mode === 'resistance' ? '#10b981' : '#334155',
        color: 'white',
        border: `2px solid ${mode === 'resistance' ? '#10b981' : '#475569'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 'clamp(12px, 2.5vw, 14px)',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 'bold' }}>🔌 По току/</div>
      <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', opacity: 0.8, marginTop: '2px' }}>напряжению</div>
    </button>
    
    <button
      type="button"
      onClick={() => setMode('power')}
      style={{
        padding: '12px 4px',
        backgroundColor: mode === 'power' ? '#10b981' : '#334155',
        color: 'white',
        border: `2px solid ${mode === 'power' ? '#10b981' : '#475569'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 'clamp(12px, 2.5vw, 14px)',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: '1.3',
        minHeight: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 'bold' }}>⚡ Макс.</div>
      <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', opacity: 0.8, marginTop: '2px' }}>мощность</div>
    </button>
  </div>
</div>

          {/* Выбор типа резистора */}
<div style={{ marginBottom: '24px' }}>
  <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
    Тип резистора
  </h3>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginBottom: '20px',
    width: '100%'
  }}>
    {Object.entries(resistorTypes).map(([key, resistor]) => (
      <button
        key={key}
        type="button"
        onClick={() => selectResistorType(key)}
        style={{
          padding: '12px 8px',
          backgroundColor: resistorType === key ? resistor.color : '#334155',
          color: 'white',
          border: `2px solid ${resistorType === key ? resistor.color : '#475569'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          transition: 'all 0.3s',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: '1.3',
          minHeight: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {resistor.name}
      </button>
    ))}
  </div>
</div>

          {/* Размер SMD (для SMD резисторов) */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Размер SMD (опционально)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {Object.entries(smdSizes).map(([key, size]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectResistorSize(key)}
                  style={{
                    padding: '8px 4px',
                    backgroundColor: resistorSize === key ? '#f59e0b' : '#334155',
                    color: 'white',
                    border: `2px solid ${resistorSize === key ? '#f59e0b' : '#475569'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '11px'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{size.name}</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>{size.power}Вт</div>
                </button>
              ))}
            </div>
          </div>

          {/* Тип монтажа */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Условия монтажа
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {Object.entries(mountingTypes).map(([key, mount]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectMountingType(key)}
                  style={{
                    padding: '10px 6px',
                    backgroundColor: mountingType === key ? '#3b82f6' : '#334155',
                    color: 'white',
                    border: `2px solid ${mountingType === key ? '#3b82f6' : '#475569'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '12px'
                  }}
                >
                  {mount.name}
                </button>
              ))}
            </div>
          </div>

          {/* Основные параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Электрические параметры
            </h3>
            
            {/* Быстрый выбор мощности */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1' }}>
                  Рассеиваемая мощность (Вт)
                </label>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {typicalPowers.map((pwr) => (
                  <button
                    key={pwr.value}
                    type="button"
                    onClick={() => selectTypicalPower(pwr.value)}
                    style={{
                      padding: '8px 4px',
                      backgroundColor: power === pwr.value ? '#10b981' : '#334155',
                      color: 'white',
                      border: `1px solid ${power === pwr.value ? '#10b981' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{pwr.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{pwr.desc}</div>
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.001"
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
                placeholder="Например: 0.25"
              />
            </div>
            
            {/* Сопротивление */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Сопротивление резистора (Ω)
              </label>
              <input
                type="number"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Например: 1000"
              />
            </div>
            
            {/* Ток и напряжение для режима "по току/напряжению" */}
            {mode === 'resistance' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Ток через резистор (А)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 0.015"
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    Напряжение на резисторе (В)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={voltage}
                    onChange={(e) => setVoltage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#334155',
                      border: '1px solid #475569',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 15"
                  />
                </div>
              </>
            )}
          </div>

          {/* Тепловые параметры */}
          <div style={{ 
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#f59e0b', marginBottom: '16px', fontSize: '18px' }}>
              🌡️ Тепловые параметры
            </h3>
            
            {/* Температура окружающей среды */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1' }}>
                  Температура окружающей среды (°C)
                </label>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые значения:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {typicalTemperatures.map((temp) => (
                  <button
                    key={temp.value}
                    type="button"
                    onClick={() => selectTypicalTemperature(temp.value)}
                    style={{
                      padding: '8px 4px',
                      backgroundColor: ambientTemp === temp.value ? '#f59e0b' : '#334155',
                      color: 'white',
                      border: `1px solid ${ambientTemp === temp.value ? '#f59e0b' : '#475569'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{temp.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{temp.desc}</div>
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="1"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(e.target.value)}
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
            
            {/* Максимальная температура */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Максимальная температура резистора (°C)
              </label>
              <input
                type="number"
                step="1"
                value={maxTemp}
                onChange={(e) => setMaxTemp(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Например: 155"
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Обычно: 125°C (углеродные), 155°C (металлоплёночные), 200°C (проволочные)
              </p>
            </div>
            
            {/* Тепловое сопротивление */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Тепловое сопротивление (°C/Вт)
              </label>
              <input
                type="number"
                step="1"
                value={thermalResistance}
                onChange={(e) => setThermalResistance(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Например: 200"
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Чем меньше, тем лучше охлаждение: 50-100 (с радиатором), 100-200 (на плате), 200+ (в воздухе)
              </p>
            </div>
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
            {result ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  {/* Основной результат - температура */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: result.temperature > parseFloat(maxTemp) ? '#ef4444' : '#10b981', marginBottom: '8px' }}>
                      {formatTemperature(result.temperature)}
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                      Температура резистора
                    </div>
                    <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                      Окружающая: {ambientTemp}°C + нагрев: {result.temperatureRise.toFixed(1)}°C
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                        {result.powerDissipated.toFixed(3)} Вт
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Рассеиваемая мощность</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
                        {result.maxAllowedPower.toFixed(3)} Вт
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Максимально допустимая</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        color: result.safetyMargin > 20 ? '#10b981' : result.safetyMargin > 0 ? '#f59e0b' : '#ef4444', 
                        marginBottom: '4px' 
                      }}>
                        {result.safetyMargin.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Запас по мощности</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#1e293b', 
                      padding: '16px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px' }}>
                        {result.temperatureRise.toFixed(1)}°C
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Перегрев</div>
                    </div>
                  </div>
                  
                  {/* Тепловая постоянная времени */}
                  {result.thermalTimeConstant && (
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '16px',
                      backgroundColor: '#1e293b',
                      borderRadius: '8px'
                    }}>
                      <div style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '8px' }}>
                        ⏱️ Тепловая инерция
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        <div>• Постоянная времени нагрева: {result.thermalTimeConstant.toFixed(0)} с</div>
                        {result.timeToOverheat && (
                          <div>• Примерное время до перегрева: {result.timeToOverheat.toFixed(0)} с</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Предупреждения */}
                  {result.warnings.length > 0 && (
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '16px',
                      backgroundColor: result.temperature > parseFloat(maxTemp) ? '#431407' : '#451a03',
                      borderRadius: '8px',
                      border: `1px solid ${result.temperature > parseFloat(maxTemp) ? '#ef4444' : '#f59e0b'}`
                    }}>
                      <div style={{ 
                        color: result.temperature > parseFloat(maxTemp) ? '#ef4444' : '#f59e0b', 
                        fontWeight: 'bold', 
                        marginBottom: '8px' 
                      }}>
                        {result.temperature > parseFloat(maxTemp) ? '⚠️ ОПАСНОСТЬ ПЕРЕГРЕВА' : '⚠️ Внимание'}
                      </div>
                      <div style={{ color: result.temperature > parseFloat(maxTemp) ? '#fca5a5' : '#fed7aa', fontSize: '14px' }}>
                        {result.warnings.map((warning, index) => (
                          <div key={index} style={{ marginBottom: '4px' }}>• {warning}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Рекомендации */}
                  {result.recommendations.length > 0 && (
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '16px',
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: '1px solid #10b981'
                    }}>
                      <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>
                        💡 Рекомендации
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {result.recommendations.map((rec, index) => (
                          <div key={index} style={{ marginBottom: '4px' }}>• {rec}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    const text = `Температура: ${formatTemperature(result.temperature)}, Мощность: ${result.powerDissipated.toFixed(3)}Вт, Запас: ${result.safetyMargin.toFixed(1)}%`;
                    navigator.clipboard.writeText(text);
                    alert('Результаты скопированы!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#10b981',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                >
                  📋 Копировать результаты
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🌡️</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите мощность, сопротивление и тепловые параметры
                </div>
              </div>
            )}
          </div>

          {/* Формула */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              ΔT = P × R<sub>th</sub>
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Перегрев = Мощность × Тепловое сопротивление
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#10b981' }}>
            Теория: Нагрев резисторов
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.6' }}>
            Резисторы нагреваются при прохождении тока из-за рассеивания электрической мощности в виде тепла. 
            Температура резистора зависит от рассеиваемой мощности, теплового сопротивления и температуры окружающей среды.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>🌡️ Основные формулы</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Перегрев:</strong> ΔT = P × R<sub>th</sub></p>
                <p>• <strong>Температура:</strong> T = T<sub>amb</sub> + ΔT</p>
                <p>• <strong>Максимальная мощность:</strong> P<sub>max</sub> = (T<sub>max</sub> - T<sub>amb</sub>) ÷ R<sub>th</sub></p>
                <p>• <strong>Мощность от тока:</strong> P = I² × R</p>
                <p>• <strong>Мощность от напряжения:</strong> P = V² ÷ R</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>🔥 Тепловое сопротивление</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p><strong>R<sub>th</sub></strong> - сопротивление теплопередаче (°C/Вт):</p>
                <p>• <strong>50-100 °C/Вт:</strong> С радиатором, хорошее охлаждение</p>
                <p>• <strong>100-200 °C/Вт:</strong> На плате, стандартные условия</p>
                <p>• <strong>200-400 °C/Вт:</strong> В воздухе, плохое охлаждение</p>
                <p>• <strong>400+ °C/Вт:</strong> В корпусе, очень плохое охлаждение</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '8px' }}>⚡ Типы резисторов</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Проволочные:</strong> R<sub>th</sub> ≈ 150°C/Вт, T<sub>max</sub> ≈ 200°C</p>
                <p>• <strong>Металлоплёночные:</strong> R<sub>th</sub> ≈ 200°C/Вт, T<sub>max</sub> ≈ 155°C</p>
                <p>• <strong>Углеродные:</strong> R<sub>th</sub> ≈ 250°C/Вт, T<sub>max</sub> ≈ 125°C</p>
                <p>• <strong>Керамические:</strong> R<sub>th</sub> ≈ 100°C/Вт, T<sub>max</sub> ≈ 175°C</p>
                <p>• <strong>SMD (0805):</strong> R<sub>th</sub> ≈ 200°C/Вт, P<sub>max</sub> ≈ 0.125Вт</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#10b981' }}>🔢 Практические примеры</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>Резистор 1кΩ, 0.25Вт</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                T<sub>amb</sub>=25°C, R<sub>th</sub>=200°C/Вт<br/>
                ΔT = 0.25 × 200 = 50°C<br/>
                T = 25 + 50 = 75°C ✅
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>SMD 0805 на полной мощности</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                P=0.125Вт, R<sub>th</sub>=200°C/Вт<br/>
                ΔT = 0.125 × 200 = 25°C<br/>
                T = 25 + 25 = 50°C ✅
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>Перегрузка 100Ω, 1Вт</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                T<sub>amb</sub>=40°C, R<sub>th</sub>=250°C/Вт<br/>
                ΔT = 1 × 250 = 250°C<br/>
                T = 40 + 250 = 290°C ❌
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>С радиатором 10Ω, 5Вт</div>
              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                T<sub>amb</sub>=25°C, R<sub>th</sub>=50°C/Вт<br/>
                ΔT = 5 × 50 = 250°C<br/>
                T = 25 + 250 = 275°C ❌
              </div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '8px' }}>💡 Практические советы</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Всегда держите запас 20-30%</strong> по мощности и температуре</p>
              <p>• <strong>Для SMD резисторов:</strong> учитывайте размер и площадь охлаждения</p>
              <p>• <strong>При параллельном соединении</strong> мощность делится между резисторами</p>
              <p>• <strong>Используйте теплопроводящую пасту</strong> для улучшения охлаждения</p>
              <p>• <strong>При температуре выше 100°C</strong> срок службы резко сокращается</p>
              <p>• <strong>Проверяйте не только мощность, но и температуру</strong> - ключевой параметр!</p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>⚠️ Опасные ситуации</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Температура выше T<sub>max</sub>:</strong> разрушение резистора, пожар</p>
              <p>• <strong>Длительная перегрузка:</strong> изменение сопротивления, нестабильность</p>
              <p>• <strong>Нагрев соседних компонентов:</strong> тепловое воздействие на всю схему</p>
              <p>• <strong>Пайка SMD компонентов:</strong> при перегреве отрываются от платы</p>
              <p>• <strong>Влажность + высокая температура:</strong> коррозия, короткие замыкания</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}