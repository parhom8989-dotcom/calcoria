// app/elektrotekhnika/rezistor-led/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function RezistorLedPage() {
  // Параметры ввода
  const [voltageSupply, setVoltageSupply] = useState<string>('12');
  const [voltageLed, setVoltageLed] = useState<string>('2');
  const [currentLed, setCurrentLed] = useState<string>('20');
  
  // Тип светодиода
  const [ledType, setLedType] = useState<string>('standard');
  const [currentUnit, setCurrentUnit] = useState<string>('mA');
  
  // Результаты
  const [result, setResult] = useState<{
    resistance: number;
    power: number;
    nearestE24: string;
    nearestE12: string;
    colorCode: string;
    recommendation: string;
    currentActual: number;
    powerActual: number;
  } | null>(null);
  
  // Типы светодиодов (типичные напряжения)
  const ledTypes = {
    red: { name: "Красный", voltage: 1.8, color: "#ef4444" },
    green: { name: "Зелёный", voltage: 2.2, color: "#10b981" },
    blue: { name: "Синий", voltage: 3.3, color: "#3b82f6" },
    white: { name: "Белый", voltage: 3.2, color: "#ffffff" },
    yellow: { name: "Жёлтый", voltage: 2.1, color: "#f59e0b" },
    standard: { name: "Стандартный", voltage: 2.0, color: "#8b5cf6" },
    infrared: { name: "Инфракрасный", voltage: 1.5, color: "#dc2626" },
    uv: { name: "Ультрафиолетовый", voltage: 3.5, color: "#a855f7" }
  };
  
  // Стандартный ряд резисторов E24
  const e24Series = [
    1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
    3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
    10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30,
    33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91,
    100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300,
    330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910,
    1000, 1100, 1200, 1300, 1500, 1600, 1800, 2000, 2200, 2400, 2700, 3000,
    3300, 3600, 3900, 4300, 4700, 5100, 5600, 6200, 6800, 7500, 8200, 9100,
    10000, 11000, 12000, 13000, 15000, 16000, 18000, 20000, 22000, 24000, 27000, 30000,
    33000, 36000, 39000, 43000, 47000, 51000, 56000, 62000, 68000, 75000, 82000, 91000,
    100000, 110000, 120000, 130000, 150000, 160000, 180000, 200000, 220000, 240000, 270000, 300000,
    330000, 360000, 390000, 430000, 470000, 510000, 560000, 620000, 680000, 750000, 820000, 910000,
    1000000
  ];
  
  // E12 ряд (более ограниченный)
  const e12Series = [
    10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82,
    100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820,
    1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200,
    10000, 12000, 15000, 18000, 22000, 27000, 33000, 39000, 47000, 56000, 68000, 82000,
    100000, 120000, 150000, 180000, 220000, 270000, 330000, 390000, 470000, 560000, 680000, 820000,
    1000000
  ];
  
  // Найти ближайший стандартный резистор
  const findNearestResistor = (value: number, series: number[]) => {
    return series.reduce((prev, curr) => {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
  };
  
  // Цветовая маркировка резисторов (4 полосы)
  const getColorCode = (value: number) => {
    if (value < 10) return "Слишком мало для стандартных";
    
    const digits = Math.floor(value).toString().split('');
    let code = "";
    
    // Для резисторов < 100 Ом
    if (value < 100) {
      code = "Коричневый-Чёрный-" + (value < 10 ? "Чёрный" : digits[1] === '0' ? "Чёрный" : "Коричневый");
    } 
    // Для резисторов 100-999 Ом
    else if (value < 1000) {
      code = `${getColorName(digits[0])}-${getColorName(digits[1])}-Коричневый`;
    }
    // Для резисторов 1к-9.9к
    else if (value < 10000) {
      const val = value / 1000;
      const valDigits = val.toFixed(1).split('');
      code = `${getColorName(valDigits[0])}-${getColorName(valDigits[1] === '.' ? '0' : valDigits[1])}-Красный`;
    }
    // Для остальных
    else {
      return "Используйте SMD или много полос";
    }
    
    return code + "-Золотой";
  };
  
  const getColorName = (digit: string) => {
    const colors: {[key: string]: string} = {
      '0': 'Чёрный',
      '1': 'Коричневый',
      '2': 'Красный',
      '3': 'Оранжевый',
      '4': 'Жёлтый',
      '5': 'Зелёный',
      '6': 'Синий',
      '7': 'Фиолетовый',
      '8': 'Серый',
      '9': 'Белый'
    };
    return colors[digit] || 'Неизвестно';
  };
  
  // Расчёт
  const calculate = () => {
    const Vs = parseFloat(voltageSupply);
    const Vled = parseFloat(voltageLed);
    let Iled = parseFloat(currentLed);
    
    // Конвертация тока в амперы
    if (currentUnit === 'mA') Iled = Iled / 1000;
    else if (currentUnit === 'μA') Iled = Iled / 1000000;
    
    if (isNaN(Vs) || isNaN(Vled) || isNaN(Iled) || Iled <= 0 || Vs <= Vled) {
      setResult(null);
      return;
    }
    
    // Расчёт сопротивления: R = (Vs - Vled) / I
    const resistanceValue = (Vs - Vled) / Iled;
    
    // Расчёт мощности резистора: P = I² × R
    const powerValue = Iled * Iled * resistanceValue;
    
    // Ближайшие стандартные значения
    const nearestE24 = findNearestResistor(resistanceValue, e24Series);
    const nearestE12 = findNearestResistor(resistanceValue, e12Series);
    
    // Цветовой код
    const colorCode = getColorCode(nearestE24);
    
    // Фактический ток с выбранным резистором
    const currentActual = (Vs - Vled) / nearestE24;
    const powerActual = currentActual * currentActual * nearestE24;
    
    // Рекомендация
    let recommendation = "✅ Подходящий резистор";
    if (powerActual > 0.25) recommendation = "⚠️ Используйте резистор на 0.5Вт или более";
    if (currentActual > Iled * 1.5) recommendation = "⚠️ Ток превышает номинальный";
    if (resistanceValue < 10) recommendation = "❌ Слишком маленькое сопротивление";
    
    setResult({
      resistance: resistanceValue,
      power: powerValue,
      nearestE24: nearestE24.toString(),
      nearestE12: nearestE12.toString(),
      colorCode,
      recommendation,
      currentActual: currentActual * 1000, // в мА
      powerActual
    });
  };
  
  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [voltageSupply, voltageLed, currentLed, currentUnit, ledType]);
  
  // Установка типа светодиода
  const selectLedType = (type: string) => {
    setLedType(type);
    const led = ledTypes[type as keyof typeof ledTypes];
    if (led) {
      setVoltageLed(led.voltage.toString());
    }
  };
  
  // Сброс
  const resetCalculator = () => {
    setVoltageSupply('12');
    setVoltageLed('2');
    setCurrentLed('20');
    setLedType('standard');
    setCurrentUnit('mA');
    setResult(null);
  };
  
  // Копирование
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Результат скопирован!');
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
              💡 Калькулятор резистора для светодиода
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Расчёт ограничительного резистора и подбор из стандартного ряда
            </p>
          </div>

          {/* Кнопки */}
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

          {/* Выбор типа светодиода */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '18px' }}>
              Тип светодиода
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {Object.entries(ledTypes).map(([key, led]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectLedType(key)}
                  style={{
                    padding: '12px 8px',
                    backgroundColor: ledType === key ? led.color : '#334155',
                    color: 'white',
                    border: `2px solid ${ledType === key ? led.color : '#475569'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '12px'
                  }}
                >
                  {led.name}
                </button>
              ))}
            </div>
          </div>

          {/* Параметры */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '18px' }}>
              Параметры цепи
            </h3>
            
            {/* Напряжение питания */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Напряжение питания (В)
              </label>
              <input
                type="number"
                step="0.1"
                value={voltageSupply}
                onChange={(e) => setVoltageSupply(e.target.value)}
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
                3В (батарейка), 5В (USB), 12В (авто), 24В (промышленность)
              </p>
            </div>
            
            {/* Напряжение светодиода */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Падение напряжения на светодиоде (В)
              </label>
              <input
                type="number"
                step="0.01"
                value={voltageLed}
                onChange={(e) => setVoltageLed(e.target.value)}
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
                Обычно: красный 1.8-2.2В, синий/белый 3.0-3.6В
              </p>
            </div>
            
            {/* Ток светодиода */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                Номинальный ток светодиода
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  step="1"
                  value={currentLed}
                  onChange={(e) => setCurrentLed(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
                <select
                  value={currentUnit}
                  onChange={(e) => setCurrentUnit(e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#334155',
                    border: '1px solid #475569',
                    color: 'white',
                    fontSize: '16px',
                    minWidth: '80px'
                  }}
                >
                  <option value="mA">мА</option>
                  <option value="A">А</option>
                  <option value="μA">мкА</option>
                </select>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Стандартные: 5мА (индикация), 20мА (подсветка), 350мА (мощные LED)
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
              <div style={{  }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                    {result.nearestE24} <span style={{ fontSize: '20px' }}>Ω</span>
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    Рекомендуемый резистор (ряд E24)
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
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
                      {result.powerActual.toFixed(3)} Вт
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Мощность на резисторе</div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#1e293b', 
                    padding: '16px', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                      {result.currentActual.toFixed(1)} мА
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Фактический ток</div>
                  </div>
                </div>
                
                {/* Детали */}
                <div style={{ 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Рекомендация:</span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: result.recommendation.includes('✅') ? '#10b98120' : 
                                     result.recommendation.includes('⚠️') ? '#f59e0b20' : '#ef444420',
                      color: result.recommendation.includes('✅') ? '#10b981' : 
                            result.recommendation.includes('⚠️') ? '#f59e0b' : '#ef4444',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {result.recommendation}
                    </span>
                  </div>
                  
                  <div style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '12px' }}>
                    <div>• <strong>Ряд E12:</strong> {result.nearestE12} Ω</div>
                    <div>• <strong>Цветовой код (4 полосы):</strong> {result.colorCode}</div>
                    <div>• <strong>Мощность резистора:</strong> минимум 0.25Вт, лучше 0.5Вт</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => copyToClipboard(`${result.nearestE24}Ω (${result.colorCode})`)}
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
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>💡</div>
                <div style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры для расчёта
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите напряжение питания и параметры светодиода
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
              R = (V<sub>питания</sub> - V<sub>LED</sub>) ÷ I<sub>LED</sub>
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Формула расчёта ограничительного резистора
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
            Зачем нужен резистор для светодиода?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.6' }}>
            Светодиоды — это полупроводниковые приборы с нелинейной ВАХ. Без ограничительного резистора 
            ток через светодиод может достичь опасных значений и вывести его из строя. Резистор выполняет 
            роль простейшего стабилизатора тока.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>Типичные параметры светодиодов</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong style={{color: '#ef4444'}}>Красный:</strong> 1.8-2.2В, 10-20мА</p>
                <p>• <strong style={{color: '#10b981'}}>Зелёный:</strong> 2.0-2.4В, 10-20мА</p>
                <p>• <strong style={{color: '#3b82f6'}}>Синий:</strong> 3.0-3.6В, 10-30мА</p>
                <p>• <strong style={{color: '#ffffff'}}>Белый:</strong> 3.0-3.6В, 20-30мА</p>
                <p>• <strong style={{color: '#f59e0b'}}>Жёлтый:</strong> 2.0-2.2В, 10-20мА</p>
                <p>• <strong>Мощные LED:</strong> 3.0-3.8В, 350-1000мА</p>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>Стандартные ряды резисторов</h3>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <p>• <strong>Ряд E24:</strong> 24 значения на декаду (точный подбор)</p>
                <p>• <strong>Ряд E12:</strong> 12 значений на декаду (наиболее распространён)</p>
                <p>• <strong>Ряд E6:</strong> 6 значений на декаду (для неточных применений)</p>
                <p>• <strong>Стандартные мощности:</strong> 0.125Вт, 0.25Вт, 0.5Вт, 1Вт, 2Вт, 5Вт</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#10b981' }}>Практические советы</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Всегда используйте резистор</strong> — подключение LED напрямую к источнику приведёт к сгоранию</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Выбирайте резистор с запасом по мощности</strong> — если расчёт 0.18Вт, берите 0.25Вт или 0.5Вт</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Для мощных светодиодов</strong> используйте драйверы тока вместо резисторов</li>
            <li style={{ marginBottom: '8px' }}>• <strong>При последовательном соединении LED</strong> используйте один резистор для всей цепочки</li>
            <li>• <strong>При параллельном соединении</strong> каждому светодиоду нужен свой резистор</li>
          </ul>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '8px' }}>💡 Пример расчёта</h4>
            <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
              Для красного светодиода (2В, 20мА) от источника 5В:<br/>
              <strong>R = (5В - 2В) ÷ 0.02А = 150Ω</strong><br/>
              <strong>P = 0.02А × 0.02А × 150Ω = 0.06Вт</strong> → подойдёт резистор 150Ω 0.25Вт
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}