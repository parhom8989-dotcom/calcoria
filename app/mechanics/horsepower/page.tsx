// app/mechanics/horsepower/page.tsx
"use client";

import { useState, useCallback } from 'react';

export default function HorsepowerCalculatorPage() {
  // Состояния калькулятора
  const [hp, setHp] = useState<string>("100");
  const [kw, setKw] = useState<string>("74.57");
  const [w, setW] = useState<string>("74570");
  const [ps, setPs] = useState<string>("101.39");
  const [hpMechanical, setHpMechanical] = useState<string>("98.63");
  const [btuPerMin, setBtuPerMin] = useState<string>("4241.0");
  const [kcalPerHour, setKcalPerHour] = useState<string>("64120");
  
  const [activeInput, setActiveInput] = useState<"hp" | "kw" | "w" | "ps" | "hp_mech" | "btu" | "kcal">("hp");

  // Цветовая схема
  const COLORS = {
    primary: '#f59e0b',
    primaryHover: '#d97706',
    secondary: '#fbbf24',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    }
  };

  // Константы пересчёта
  const CONSTANTS = {
    hpToKw: 0.7457,      // 1 л.с. = 0.7457 кВт
    hpToW: 745.7,        // 1 л.с. = 745.7 Вт
    hpToPs: 1.01387,     // 1 л.с. = 1.01387 PS
    hpToHpMech: 0.9863,  // 1 л.с. = 0.9863 hp (британская)
    hpToBtuMin: 42.41,   // 1 л.с. = 42.41 BTU/мин
    hpToKcalHour: 641.2, // 1 л.с. = 641.2 ккал/ч
  };

  // Пересчёт из л.с.
  const calculateFromHp = (value: number) => {
    setHp(value.toFixed(2));
    setKw((value * CONSTANTS.hpToKw).toFixed(2));
    setW((value * CONSTANTS.hpToW).toFixed(0));
    setPs((value * CONSTANTS.hpToPs).toFixed(2));
    setHpMechanical((value * CONSTANTS.hpToHpMech).toFixed(2));
    setBtuPerMin((value * CONSTANTS.hpToBtuMin).toFixed(1));
    setKcalPerHour((value * CONSTANTS.hpToKcalHour).toFixed(0));
  };

  // Пересчёт из кВт
  const calculateFromKw = (value: number) => {
    const hpValue = value / CONSTANTS.hpToKw;
    setHp(hpValue.toFixed(2));
    setKw(value.toFixed(2));
    setW((value * 1000).toFixed(0));
    setPs((hpValue * CONSTANTS.hpToPs).toFixed(2));
    setHpMechanical((hpValue * CONSTANTS.hpToHpMech).toFixed(2));
    setBtuPerMin((hpValue * CONSTANTS.hpToBtuMin).toFixed(1));
    setKcalPerHour((hpValue * CONSTANTS.hpToKcalHour).toFixed(0));
  };

  // Пересчёт из Вт
  const calculateFromW = (value: number) => {
    const hpValue = value / CONSTANTS.hpToW;
    setHp(hpValue.toFixed(2));
    setKw((value / 1000).toFixed(2));
    setW(value.toFixed(0));
    setPs((hpValue * CONSTANTS.hpToPs).toFixed(2));
    setHpMechanical((hpValue * CONSTANTS.hpToHpMech).toFixed(2));
    setBtuPerMin((hpValue * CONSTANTS.hpToBtuMin).toFixed(1));
    setKcalPerHour((hpValue * CONSTANTS.hpToKcalHour).toFixed(0));
  };

  // Пересчёт из PS
  const calculateFromPs = (value: number) => {
    const hpValue = value / CONSTANTS.hpToPs;
    setHp(hpValue.toFixed(2));
    setKw((hpValue * CONSTANTS.hpToKw).toFixed(2));
    setW((hpValue * CONSTANTS.hpToW).toFixed(0));
    setPs(value.toFixed(2));
    setHpMechanical((hpValue * CONSTANTS.hpToHpMech).toFixed(2));
    setBtuPerMin((hpValue * CONSTANTS.hpToBtuMin).toFixed(1));
    setKcalPerHour((hpValue * CONSTANTS.hpToKcalHour).toFixed(0));
  };

  // Пересчёт из механической л.с.
  const calculateFromHpMech = (value: number) => {
    const hpValue = value / CONSTANTS.hpToHpMech;
    setHp(hpValue.toFixed(2));
    setKw((hpValue * CONSTANTS.hpToKw).toFixed(2));
    setW((hpValue * CONSTANTS.hpToW).toFixed(0));
    setPs((hpValue * CONSTANTS.hpToPs).toFixed(2));
    setHpMechanical(value.toFixed(2));
    setBtuPerMin((hpValue * CONSTANTS.hpToBtuMin).toFixed(1));
    setKcalPerHour((hpValue * CONSTANTS.hpToKcalHour).toFixed(0));
  };

  // Пересчёт из BTU/мин
  const calculateFromBtu = (value: number) => {
    const hpValue = value / CONSTANTS.hpToBtuMin;
    setHp(hpValue.toFixed(2));
    setKw((hpValue * CONSTANTS.hpToKw).toFixed(2));
    setW((hpValue * CONSTANTS.hpToW).toFixed(0));
    setPs((hpValue * CONSTANTS.hpToPs).toFixed(2));
    setHpMechanical((hpValue * CONSTANTS.hpToHpMech).toFixed(2));
    setBtuPerMin(value.toFixed(1));
    setKcalPerHour((hpValue * CONSTANTS.hpToKcalHour).toFixed(0));
  };

  // Пересчёт из ккал/ч
  const calculateFromKcal = (value: number) => {
    const hpValue = value / CONSTANTS.hpToKcalHour;
    setHp(hpValue.toFixed(2));
    setKw((hpValue * CONSTANTS.hpToKw).toFixed(2));
    setW((hpValue * CONSTANTS.hpToW).toFixed(0));
    setPs((hpValue * CONSTANTS.hpToPs).toFixed(2));
    setHpMechanical((hpValue * CONSTANTS.hpToHpMech).toFixed(2));
    setBtuPerMin((hpValue * CONSTANTS.hpToBtuMin).toFixed(1));
    setKcalPerHour(value.toFixed(0));
  };

  // Обработчик изменения
  const handleInputChange = (value: string, type: typeof activeInput) => {
    // Просто обновляем конкретное поле, ничего не пересчитываем
    switch (type) {
      case "hp":
        setHp(value);
        break;
      case "kw":
        setKw(value);
        break;
      case "w":
        setW(value);
        break;
      case "ps":
        setPs(value);
        break;
      case "hp_mech":
        setHpMechanical(value);
        break;
      case "btu":
        setBtuPerMin(value);
        break;
      case "kcal":
        setKcalPerHour(value);
        break;
    }
    setActiveInput(type);
  };

  // Функция расчёта (вызывается по кнопке)
  const calculate = () => {
    const value = parseFloat(
      activeInput === "hp" ? hp :
      activeInput === "kw" ? kw :
      activeInput === "w" ? w :
      activeInput === "ps" ? ps :
      activeInput === "hp_mech" ? hpMechanical :
      activeInput === "btu" ? btuPerMin :
      kcalPerHour
    );

    if (isNaN(value)) return;

    switch (activeInput) {
      case "hp":
        calculateFromHp(value);
        break;
      case "kw":
        calculateFromKw(value);
        break;
      case "w":
        calculateFromW(value);
        break;
      case "ps":
        calculateFromPs(value);
        break;
      case "hp_mech":
        calculateFromHpMech(value);
        break;
      case "btu":
        calculateFromBtu(value);
        break;
      case "kcal":
        calculateFromKcal(value);
        break;
    }
  };

  // Сброс
  const resetCalculator = () => {
    setHp("100");
    setKw("74.57");
    setW("74570");
    setPs("101.39");
    setHpMechanical("98.63");
    setBtuPerMin("4241.0");
    setKcalPerHour("64120");
    setActiveInput("hp");
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КАЛЬКУЛЯТОРА */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: `1px solid ${COLORS.border}`
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>⚙️</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Конвертер лошадиных сил
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Перевод между различными единицами мощности
              </p>
            </div>
          </div>

          {/* КНОПКИ */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <a 
              href="/"
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: COLORS.border,
                color: COLORS.text.main,
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: `1px solid ${COLORS.border}`,
                textAlign: 'center'
              }}
            >
              ← На главную
            </a>
            <button
              onClick={resetCalculator}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: COLORS.border,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.primary,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* ПОЛЯ ВВОДА */}
          <div style={{ marginBottom: '24px' }}>
            
            {/* Метрическая л.с. */}
            <div style={{
              backgroundColor: activeInput === "hp" ? `${COLORS.primary}20` : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '8px',
              border: activeInput === "hp" ? `1px solid ${COLORS.primary}` : 'none'
            }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                🐎 Лошадиные силы (метрические)
              </label>
              <input
                type="number"
                value={hp}
                onChange={(e) => handleInputChange(e.target.value, "hp")}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="л.с."
                step="1"
              />
            </div>

            {/* Киловатты */}
            <div style={{
              backgroundColor: activeInput === "kw" ? `${COLORS.primary}20` : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '8px',
              border: activeInput === "kw" ? `1px solid ${COLORS.primary}` : 'none'
            }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                ⚡ Киловатты (кВт)
              </label>
              <input
                type="number"
                value={kw}
                onChange={(e) => handleInputChange(e.target.value, "kw")}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="кВт"
                step="0.1"
              />
            </div>

            {/* Ватты */}
            <div style={{
              backgroundColor: activeInput === "w" ? `${COLORS.primary}20` : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '8px',
              border: activeInput === "w" ? `1px solid ${COLORS.primary}` : 'none'
            }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                💡 Ватты (Вт)
              </label>
              <input
                type="number"
                value={w}
                onChange={(e) => handleInputChange(e.target.value, "w")}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Вт"
                step="10"
              />
            </div>

            {/* PS (немецкая) */}
            <div style={{
              backgroundColor: activeInput === "ps" ? `${COLORS.primary}20` : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '8px',
              border: activeInput === "ps" ? `1px solid ${COLORS.primary}` : 'none'
            }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                🇩🇪 PS (немецкие л.с.)
              </label>
              <input
                type="number"
                value={ps}
                onChange={(e) => handleInputChange(e.target.value, "ps")}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="PS"
                step="0.1"
              />
            </div>

            {/* Британская л.с. */}
            <div style={{
              backgroundColor: activeInput === "hp_mech" ? `${COLORS.primary}20` : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '8px',
              border: activeInput === "hp_mech" ? `1px solid ${COLORS.primary}` : 'none'
            }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                🇬🇧 hp (британские)
              </label>
              <input
                type="number"
                value={hpMechanical}
                onChange={(e) => handleInputChange(e.target.value, "hp_mech")}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="hp"
                step="0.1"
              />
            </div>

            {/* BTU/мин */}
            <div style={{
              backgroundColor: activeInput === "btu" ? `${COLORS.primary}20` : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '8px',
              border: activeInput === "btu" ? `1px solid ${COLORS.primary}` : 'none'
            }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                🔥 BTU/мин
              </label>
              <input
                type="number"
                value={btuPerMin}
                onChange={(e) => handleInputChange(e.target.value, "btu")}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="BTU/мин"
                step="1"
              />
            </div>

            {/* ккал/ч */}
            <div style={{
              backgroundColor: activeInput === "kcal" ? `${COLORS.primary}20` : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              border: activeInput === "kcal" ? `1px solid ${COLORS.primary}` : 'none'
            }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                🔋 ккал/ч
              </label>
              <input
                type="number"
                value={kcalPerHour}
                onChange={(e) => handleInputChange(e.target.value, "kcal")}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="ккал/ч"
                step="10"
              />
            </div>
          </div>

          {/* КНОПКА РАСЧЁТА */}
          <button
            onClick={calculate}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: COLORS.primary,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primaryHover;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary;
            }}
          >
            💡 Пересчитать все значения
          </button>

          {/* БЫСТРЫЕ ЗНАЧЕНИЯ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '16px',
            border: `1px solid ${COLORS.border}`
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.primary }}>
              ⚡ Популярные значения
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {[50, 100, 150, 200, 250, 300].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    setActiveInput("hp");
                    setHp(val.toString());
                    calculateFromHp(val);
                  }}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: COLORS.card,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    color: COLORS.text.main,
                    fontSize: '13px',
                    cursor: 'pointer',
                    flex: '1 0 auto',
                    maxWidth: '80px'
                  }}
                >
                  {val} л.с.
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SEO ТЕКСТ */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${COLORS.border}`
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: COLORS.primary
          }}>
            ⚙️ Что такое лошадиная сила?
          </h2>
          
          <p style={{ color: COLORS.text.main, fontSize: '15px', marginBottom: '16px' }}>
            Лошадиная сила (л.с.) — внесистемная единица мощности. В мире существует несколько 
            различных стандартов, поэтому так важно уметь переводить мощность в киловатты — 
            официальную единицу измерения мощности в международной системе СИ.
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            📊 Соотношения единиц
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                1 л.с. (метрическая)
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                = 0.7457 кВт<br/>
                = 745.7 Вт<br/>
                = 1.0139 PS<br/>
                = 0.9863 hp<br/>
                = 42.41 BTU/мин<br/>
                = 641.2 ккал/ч
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                1 кВт (киловатт)
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                = 1.341 л.с.<br/>
                = 1000 Вт<br/>
                = 1.36 PS<br/>
                = 1.34 hp<br/>
                = 56.87 BTU/мин<br/>
                = 859.8 ккал/ч
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Совет:</strong> Введите значение в любом поле и нажмите кнопку "Пересчитать", 
              чтобы получить все остальные значения. Поля можно редактировать независимо.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}