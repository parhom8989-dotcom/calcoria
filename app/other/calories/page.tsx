// app/kalorii/kalkulyator-kaloriy/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function KalkulyatorKaloriyPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"bmr" | "tdee" | "deficit" | "food">("bmr");
  
  // Основные параметры пользователя
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("30");
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | "very_active">("moderate");
  
  // Для дефицита/профицита
  const [goal, setGoal] = useState<"loss" | "maintain" | "gain">("loss");
  const [weeklyGoal, setWeeklyGoal] = useState<string>("0.5");
  
  // Для расчёта еды
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  
  // Результаты
  const [bmrResult, setBmrResult] = useState<number | null>(null);
  const [tdeeResult, setTdeeResult] = useState<number | null>(null);
  const [calorieTarget, setCalorieTarget] = useState<number | null>(null);
  const [foodCalories, setFoodCalories] = useState<number | null>(null);
  const [macros, setMacros] = useState<{protein: number, carbs: number, fat: number} | null>(null);

  // Цветовая схема #10b981 (emerald-500)
  const COLORS = {
    primary: '#10b981',
    primaryHover: '#059669',
    secondary: '#34d399',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#10b981',
      to: '#34d399'
    }
  };

  // Коэффициенты активности
  const ACTIVITY_FACTORS = {
    sedentary: 1.2,      // Сидячий образ жизни
    light: 1.375,       // Легкая активность (1-3 тренировки в неделю)
    moderate: 1.55,     // Умеренная активность (3-5 тренировок)
    active: 1.725,      // Высокая активность (6-7 тренировок)
    very_active: 1.9    // Очень высокая активность (физическая работа + тренировки)
  };

  // Функция расчёта BMR (базового метаболизма)
  const calculateBMR = useCallback(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    const a = parseFloat(age) || 0;
    
    if (gender === "male") {
      // Формула Миффлина-Сан Жеора для мужчин
      return 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      // Формула Миффлина-Сан Жеора для женщин
      return 10 * w + 6.25 * h - 5 * a - 161;
    }
  }, [gender, weight, height, age]);

  // Функция расчёта TDEE (общего расхода калорий)
  const calculateTDEE = useCallback(() => {
    const bmr = calculateBMR();
    return bmr * ACTIVITY_FACTORS[activityLevel];
  }, [calculateBMR, activityLevel]);

  // Функция расчёта целевого количества калорий
  const calculateCalorieTarget = useCallback(() => {
    const tdee = calculateTDEE();
    
    switch(goal) {
      case "loss":
        const weeklyLoss = parseFloat(weeklyGoal) || 0;
        // 1 кг жира ≈ 7700 ккал
        const dailyDeficit = (weeklyLoss * 7700) / 7;
        return Math.max(tdee - dailyDeficit, 1200); // Не ниже 1200 ккал
      case "gain":
        const weeklyGain = parseFloat(weeklyGoal) || 0;
        const dailySurplus = (weeklyGain * 7700) / 7;
        return tdee + dailySurplus;
      case "maintain":
      default:
        return tdee;
    }
  }, [calculateTDEE, goal, weeklyGoal]);

  // Функция расчёта калорий из БЖУ
  const calculateFoodCalories = useCallback(() => {
    const p = parseFloat(protein) || 0;
    const c = parseFloat(carbs) || 0;
    const f = parseFloat(fat) || 0;
    
    // 1 г белка = 4 ккал, 1 г углеводов = 4 ккал, 1 г жиров = 9 ккал
    const calories = (p * 4) + (c * 4) + (f * 9);
    return {
      calories,
      protein: p,
      carbs: c,
      fat: f
    };
  }, [protein, carbs, fat]);

  // Основная функция расчёта
  const calculate = useCallback(() => {
    switch(calcType) {
      case "bmr":
        setBmrResult(calculateBMR());
        setTdeeResult(null);
        setCalorieTarget(null);
        setFoodCalories(null);
        break;
        
      case "tdee":
        setBmrResult(calculateBMR());
        setTdeeResult(calculateTDEE());
        setCalorieTarget(null);
        setFoodCalories(null);
        break;
        
      case "deficit":
        setBmrResult(calculateBMR());
        setTdeeResult(calculateTDEE());
        setCalorieTarget(calculateCalorieTarget());
        setFoodCalories(null);
        break;
        
      case "food":
        const foodResult = calculateFoodCalories();
        setFoodCalories(foodResult.calories);
        setMacros({ protein: foodResult.protein, carbs: foodResult.carbs, fat: foodResult.fat });
        setBmrResult(null);
        setTdeeResult(null);
        setCalorieTarget(null);
        break;
    }
  }, [calcType, calculateBMR, calculateTDEE, calculateCalorieTarget, calculateFoodCalories]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setGender("male");
    setAge("30");
    setWeight("70");
    setHeight("175");
    setActivityLevel("moderate");
    setGoal("loss");
    setWeeklyGoal("0.5");
    setProtein("");
    setCarbs("");
    setFat("");
    setBmrResult(null);
    setTdeeResult(null);
    setCalorieTarget(null);
    setFoodCalories(null);
    setMacros(null);
    setCalcType("bmr");
  };

  // Форматирование чисел
  const formatNumber = (value: number) => {
    return Math.round(value).toLocaleString('ru-RU');
  };

  // Получение описания уровня активности
  const getActivityDescription = () => {
    switch(activityLevel) {
      case "sedentary": return "Сидячий образ жизни, мало или нет тренировок";
      case "light": return "Легкие тренировки 1-3 раза в неделю";
      case "moderate": return "Умеренные тренировки 3-5 раз в неделю";
      case "active": return "Тяжелые тренировки 6-7 раз в неделю";
      case "very_active": return "Очень тяжелые тренировки, физическая работа";
      default: return "";
    }
  };

  // Получение описания цели
  const getGoalDescription = () => {
    switch(goal) {
      case "loss": return `Похудение на ${weeklyGoal} кг в неделю`;
      case "gain": return `Набор массы на ${weeklyGoal} кг в неделю`;
      case "maintain": return "Поддержание веса";
      default: return "";
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КАЛЬКУЛЯТОРА */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: `1px solid ${COLORS.border}`,
          background: `linear-gradient(145deg, ${COLORS.card} 0%, #1e2a3b 100%)`
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '32px' }}>🍎</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Калькулятор калорий
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              Расчёт нормы калорий, дефицита и состава пищи
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
                backgroundColor: COLORS.border,
                color: COLORS.secondary,
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: `1px solid #475569`,
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.secondary;
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.border;
                e.currentTarget.style.color = COLORS.secondary;
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
                backgroundColor: COLORS.border,
                border: `1px solid #475569`,
                borderRadius: '8px',
                color: COLORS.primary,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.border;
                e.currentTarget.style.color = COLORS.primary;
              }}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Переключатель режимов */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '24px',
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '8px'
          }}>
            <button
              onClick={() => setCalcType("bmr")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "bmr" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "bmr" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "bmr" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Базовый метаболизм
            </button>
            <button
              onClick={() => setCalcType("tdee")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "tdee" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "tdee" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "tdee" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Дневная норма
            </button>
            <button
              onClick={() => setCalcType("deficit")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "deficit" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "deficit" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "deficit" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Цель по калориям
            </button>
            <button
              onClick={() => setCalcType("food")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "food" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "food" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "food" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Калории из БЖУ
            </button>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            {(calcType === "bmr" || calcType === "tdee" || calcType === "deficit") && (
              <>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Пол
                    </label>
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        type="button"
                        onClick={() => setGender("male")}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: gender === "male" 
                            ? COLORS.primary 
                            : COLORS.background,
                          border: `1px solid ${gender === "male" ? COLORS.primary : COLORS.border}`,
                          borderRadius: '6px',
                          color: gender === "male" ? 'white' : COLORS.text.main,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Мужской
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("female")}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: gender === "female" 
                            ? COLORS.primary 
                            : COLORS.background,
                          border: `1px solid ${gender === "female" ? COLORS.primary : COLORS.border}`,
                          borderRadius: '6px',
                          color: gender === "female" ? 'white' : COLORS.text.main,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Женский
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Возраст (лет)
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: COLORS.border,
                        border: `1px solid #475569`,
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Например: 30"
                      min="15"
                      max="100"
                    />
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Вес (кг)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: COLORS.border,
                        border: `1px solid #475569`,
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Например: 70"
                      min="30"
                      max="200"
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Рост (см)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: COLORS.border,
                        border: `1px solid #475569`,
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Например: 175"
                      min="100"
                      max="250"
                    />
                  </div>
                </div>

                {(calcType === "tdee" || calcType === "deficit") && (
                  <div style={{ marginBottom: calcType === "deficit" ? '16px' : '0' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Уровень активности
                    </label>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {Object.entries(ACTIVITY_FACTORS).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActivityLevel(key as any)}
                          style={{
                            padding: '10px 12px',
                            backgroundColor: activityLevel === key 
                              ? COLORS.primary 
                              : COLORS.background,
                            border: `1px solid ${activityLevel === key ? COLORS.primary : COLORS.border}`,
                            borderRadius: '6px',
                            color: activityLevel === key ? 'white' : COLORS.text.main,
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {key === "sedentary" && "Сидячий"}
                          {key === "light" && "Легкий"}
                          {key === "moderate" && "Умеренный"}
                          {key === "active" && "Активный"}
                          {key === "very_active" && "Очень активный"}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '8px' }}>
                      {getActivityDescription()}
                    </div>
                  </div>
                )}

                {calcType === "deficit" && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                        Цель
                      </label>
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button
                          type="button"
                          onClick={() => setGoal("loss")}
                          style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: goal === "loss" 
                              ? '#ef4444' 
                              : COLORS.background,
                            border: `1px solid ${goal === "loss" ? '#ef4444' : COLORS.border}`,
                            borderRadius: '6px',
                            color: goal === "loss" ? 'white' : COLORS.text.main,
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          Похудение
                        </button>
                        <button
                          type="button"
                          onClick={() => setGoal("maintain")}
                          style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: goal === "maintain" 
                              ? COLORS.primary 
                              : COLORS.background,
                            border: `1px solid ${goal === "maintain" ? COLORS.primary : COLORS.border}`,
                            borderRadius: '6px',
                            color: goal === "maintain" ? 'white' : COLORS.text.main,
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          Поддержание
                        </button>
                        <button
                          type="button"
                          onClick={() => setGoal("gain")}
                          style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: goal === "gain" 
                              ? '#3b82f6' 
                              : COLORS.background,
                            border: `1px solid ${goal === "gain" ? '#3b82f6' : COLORS.border}`,
                            borderRadius: '6px',
                            color: goal === "gain" ? 'white' : COLORS.text.main,
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          Набор массы
                        </button>
                      </div>
                    </div>

                    {(goal === "loss" || goal === "gain") && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                          Цель в неделю (кг)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={weeklyGoal}
                          onChange={(e) => setWeeklyGoal(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: COLORS.border,
                            border: `1px solid #475569`,
                            color: 'white',
                            fontSize: '16px'
                          }}
                          placeholder={goal === "loss" ? "Например: 0.5" : "Например: 0.3"}
                          min="0.1"
                          max="2"
                        />
                        <div style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '4px' }}>
                          {goal === "loss" 
                            ? "Рекомендуется: 0.5-1 кг в неделю" 
                            : "Рекомендуется: 0.25-0.5 кг в неделю"}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {calcType === "food" && (
              <>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr', 
                  gap: '16px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Белки (г)
                    </label>
                    <input
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: COLORS.border,
                        border: `1px solid #3b82f6`,
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Например: 25"
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Углеводы (г)
                    </label>
                    <input
                      type="number"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: COLORS.border,
                        border: `1px solid ${COLORS.primary}`,
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Например: 50"
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                      Жиры (г)
                    </label>
                    <input
                      type="number"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: COLORS.border,
                        border: `1px solid #f59e0b`,
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Например: 15"
                    />
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '8px' }}>
                  • 1 г белка = 4 ккал • 1 г углеводов = 4 ккал • 1 г жиров = 9 ккал
                </div>
              </>
            )}
          </div>

          {/* РЕЗУЛЬТАТЫ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px',
            background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
          }}>
            {calcType === "bmr" && bmrResult !== null && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px' }}>
                  Ваш базовый метаболизм (BMR)
                </div>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {formatNumber(bmrResult)} ккал
                </div>
                <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                  Столько калорий ваш организм тратит в состоянии покоя
                </div>
              </div>
            )}

            {calcType === "tdee" && bmrResult !== null && tdeeResult !== null && (
              <div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Базовый метаболизм
                    </div>
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: 'bold',
                      color: COLORS.secondary
                    }}>
                      {formatNumber(bmrResult)} ккал
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Дневная норма (TDEE)
                    </div>
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: 'bold',
                      color: COLORS.primary
                    }}>
                      {formatNumber(tdeeResult)} ккал
                    </div>
                  </div>
                </div>
                <div style={{ 
                  paddingTop: '16px', 
                  borderTop: `1px solid ${COLORS.border}`,
                  textAlign: 'center'
                }}>
                  <div style={{ color: COLORS.text.main, fontSize: '14px', marginBottom: '8px' }}>
                    Уровень активности: <strong>{getActivityDescription()}</strong>
                  </div>
                  <div style={{ color: COLORS.text.muted, fontSize: '12px' }}>
                    Для поддержания веса потребляйте {formatNumber(tdeeResult)} ккал в день
                  </div>
                </div>
              </div>
            )}

            {calcType === "deficit" && bmrResult !== null && tdeeResult !== null && calorieTarget !== null && (
              <div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Ваша норма (TDEE)
                    </div>
                    <div style={{ 
                      fontSize: '22px', 
                      fontWeight: 'bold',
                      color: COLORS.text.main
                    }}>
                      {formatNumber(tdeeResult)} ккал
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Цель по калориям
                    </div>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: 'bold',
                      color: goal === "loss" ? '#ef4444' : goal === "gain" ? '#3b82f6' : COLORS.primary
                    }}>
                      {formatNumber(calorieTarget)} ккал
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  paddingTop: '16px', 
                  borderTop: `1px solid ${COLORS.border}`,
                  textAlign: 'center'
                }}>
                  <div style={{ color: COLORS.text.main, fontSize: '14px', marginBottom: '8px' }}>
                    <strong>{getGoalDescription()}</strong>
                  </div>
                  
                  {goal === "loss" && (
                    <div style={{ color: '#ef4444', fontSize: '12px' }}>
                      Дефицит: {formatNumber(tdeeResult - calorieTarget)} ккал в день
                    </div>
                  )}
                  
                  {goal === "gain" && (
                    <div style={{ color: '#3b82f6', fontSize: '12px' }}>
                      Профицит: {formatNumber(calorieTarget - tdeeResult)} ккал в день
                    </div>
                  )}
                  
                  {goal === "maintain" && (
                    <div style={{ color: COLORS.primary, fontSize: '12px' }}>
                      Баланс калорий для поддержания веса
                    </div>
                  )}
                </div>
              </div>
            )}

            {calcType === "food" && foodCalories !== null && macros !== null && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px' }}>
                    Общая калорийность
                  </div>
                  <div style={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold',
                    background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {formatNumber(foodCalories)} ккал
                  </div>
                </div>
                
                <div style={{ 
                  paddingTop: '16px', 
                  borderTop: `1px solid ${COLORS.border}`
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        marginBottom: '4px'
                      }}>
                        {macros.protein} г
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.text.muted }}>
                        Белки
                      </div>
                      <div style={{ fontSize: '11px', color: COLORS.text.dark }}>
                        {macros.protein * 4} ккал
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: COLORS.primary,
                        marginBottom: '4px'
                      }}>
                        {macros.carbs} г
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.text.muted }}>
                        Углеводы
                      </div>
                      <div style={{ fontSize: '11px', color: COLORS.text.dark }}>
                        {macros.carbs * 4} ккал
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: '#f59e0b',
                        marginBottom: '4px'
                      }}>
                        {macros.fat} г
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.text.muted }}>
                        Жиры
                      </div>
                      <div style={{ fontSize: '11px', color: COLORS.text.dark }}>
                        {macros.fat * 9} ккал
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: `rgba(16, 185, 129, 0.1)`,
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: COLORS.text.main, fontSize: '12px' }}>
                      БЖУ соотношение: 
                      <strong> {Math.round((macros.protein * 4 / foodCalories) * 100)}%</strong> белки • 
                      <strong> {Math.round((macros.carbs * 4 / foodCalories) * 100)}%</strong> углеводы • 
                      <strong> {Math.round((macros.fat * 9 / foodCalories) * 100)}%</strong> жиры
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ИНФОРМАЦИОННАЯ ПАНЕЛЬ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            border: `1px solid ${COLORS.border}`
          }}>
            <div style={{ 
              color: COLORS.primary, 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '8px'
            }}>
              {calcType === "bmr" && "BMR = 10 × вес + 6.25 × рост - 5 × возраст + 5 (муж)"}
              {calcType === "bmr" && gender === "female" && "BMR = 10 × вес + 6.25 × рост - 5 × возраст - 161 (жен)"}
              {calcType === "tdee" && "TDEE = BMR × Коэффициент активности"}
              {calcType === "deficit" && "Цель = TDEE ± (цель_кг × 7700 ÷ 7)"}
              {calcType === "food" && "Калории = Белки×4 + Углеводы×4 + Жиры×9"}
            </div>
            <div style={{ color: COLORS.text.dark, fontSize: '14px' }}>
              {calcType === "bmr" && "Формула Миффлина-Сан Жеора для расчёта базового метаболизма"}
              {calcType === "tdee" && "Общий дневной расход энергии с учётом активности"}
              {calcType === "deficit" && "1 кг жира ≈ 7700 ккал. Безопасный дефицит: 300-500 ккал/день"}
              {calcType === "food" && "Расчёт калорийности по макронутриентам"}
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
            fontSize: '24px', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>📈</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Как правильно считать калории?
            </span>
          </h2>
          <p style={{ color: COLORS.text.main, marginBottom: '16px' }}>
            Подсчёт калорий — это научный подход к контролю веса, основанный на балансе 
            между потребляемой и расходуемой энергией. Понимание своих метаболических 
            потребностей — ключ к достижению фитнес-целей.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🏃‍♂️ Что такое BMR и TDEE?
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>
                  • <strong>BMR (Basal Metabolic Rate)</strong> — базовый метаболизм: 
                  калории, которые организм тратит в состоянии полного покоя на поддержание жизнедеятельности.
                </p>
                <p>
                  • <strong>TDEE (Total Daily Energy Expenditure)</strong> — общий дневной расход энергии: 
                  BMR + калории на физическую активность, пищеварение и терморегуляцию.
                </p>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🥗 Оптимальное распределение БЖУ
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>• <strong>Для похудения:</strong> 40% белки, 30% углеводы, 30% жиры</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Для поддержания:</strong> 30% белки, 40% углеводы, 30% жиры</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Для набора массы:</strong> 25% белки, 50% углеводы, 25% жиры</p>
                <p>• <strong>Минимум белка:</strong> 1.6-2.2 г на кг веса для активных людей</p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                ⚖️ Безопасные темпы изменения веса
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>• <strong>Похудение:</strong> 0.5-1 кг в неделю (дефицит 500-1000 ккал/день)</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Набор массы:</strong> 0.25-0.5 кг в неделю (профицит 250-500 ккал/день)</p>
                <p>• <strong>Минимальная норма:</strong> 1200 ккал/день для женщин, 1500 ккал/день для мужчин</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '12px',
            color: COLORS.primary 
          }}>
            Практические советы
          </h3>
          <ul style={{ color: COLORS.text.main, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Взвешивайтесь утром натощак</strong> для точного отслеживания прогресса
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Используйте кухонные весы</strong> для точного подсчёта порций
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Ведите дневник питания</strong> в приложении (MyFitnessPal, FatSecret)
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Пересчитывайте норму калорий</strong> каждые 4-6 кг изменения веса
            </li>
            <li>
              • <strong>Не опускайтесь ниже BMR</strong> — это замедлит метаболизм
            </li>
          </ul>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(16, 185, 129, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Профессиональный совет:</strong> Фокус на качестве калорий так же важен, как и на количестве. 
              100 ккал из овощей и 100 ккал из сладостей по-разному влияют на голод, энергию и здоровье. 
              Выбирайте цельные, необработанные продукты для лучших результатов.
            </p>
          </div>
        </div>
        
        {/* ФУТЕР */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          textAlign: 'center',
          color: COLORS.text.muted,
          fontSize: '12px',
          borderTop: `1px solid ${COLORS.border}`
        }}>
          <p>
            Калькулятор калорий • Точность по формуле Миффлина-Сан Жеора • {new Date().getFullYear()} год
          </p>
          <p style={{ marginTop: '8px' }}>
            Индивидуальные потребности могут отличаться. Консультируйтесь с диетологом для персональных рекомендаций.
          </p>
        </div>
      </div>
    </div>
  );
}