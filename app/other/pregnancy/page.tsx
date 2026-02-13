// app/beremennost/kalkulyator-beremennosti/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function KalkulyatorBeremennostiPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"byLMP" | "byDate" | "byBirth">("byLMP");
  
  // Дата первого дня последних месячных (ПДПМ)
  const [lmpDate, setLmpDate] = useState<string>(() => {
    const today = new Date();
    const fourWeeksAgo = new Date(today);
    fourWeeksAgo.setDate(today.getDate() - 28);
    return fourWeeksAgo.toISOString().split('T')[0];
  });
  
  // Дата зачатия
  const [conceptionDate, setConceptionDate] = useState<string>(() => {
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    return twoWeeksAgo.toISOString().split('T')[0];
  });
  
  // Предполагаемая дата родов (ПДР)
  const [dueDate, setDueDate] = useState<string>("");
  
  // Результаты
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [trimester, setTrimester] = useState<number | null>(null);
  const [weeksLeft, setWeeksLeft] = useState<number | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  
  // Информация о триместрах
  const [trimesterInfo, setTrimesterInfo] = useState({
    name: "",
    description: "",
    babySize: "",
    babyWeight: "",
    symptoms: [] as string[],
    recommendations: [] as string[]
  });

  // Цветовая схема #ec4899 (розовый)
  const COLORS = {
    primary: '#ec4899',
    primaryHover: '#db2777',
    secondary: '#f472b6',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#ec4899',
      to: '#f472b6'
    },
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };

  // Данные по неделям беременности
  const getWeekInfo = (week: number) => {
    if (week <= 13) {
      return {
        trimester: 1,
        name: "Первый триместр",
        description: "Формирование основных органов и систем плода",
        babySize: week === 4 ? "маковое зернышко" :
                 week === 5 ? "яблочное семечко" :
                 week === 6 ? "чечевица" :
                 week === 7 ? "черника" :
                 week === 8 ? "фасоль" :
                 week === 9 ? "виноградина" :
                 week === 10 ? "кумкват" :
                 week === 11 ? "инжир" :
                 week === 12 ? "лайм" : "лимон",
        babyWeight: week <= 12 ? "менее 14 г" : "около 20 г",
        symptoms: [
          "Тошнота, утреннее недомогание",
          "Повышенная утомляемость",
          "Чувствительность к запахам",
          "Набухание груди",
          "Частое мочеиспускание"
        ],
        recommendations: [
          "Начать прием фолиевой кислоты",
          "Вставать на учет в женскую консультацию",
          "Сбалансированное питание",
          "Исключить алкоголь и курение",
          "Избегать стрессов"
        ]
      };
    } else if (week <= 27) {
      return {
        trimester: 2,
        name: "Второй триместр",
        description: "Активный рост плода, развитие органов чувств",
        babySize: week === 13 ? "лимон" :
                 week === 14 ? "персик" :
                 week === 15 ? "апельсин" :
                 week === 16 ? "авокадо" :
                 week === 17 ? "гранат" :
                 week === 18 ? "манго" :
                 week === 19 ? "томат" :
                 week === 20 ? "банан" :
                 week === 21 ? "морковь" :
                 week === 22 ? "кабачок" :
                 week === 23 ? "баклажан" :
                 week === 24 ? "кукуруза" :
                 week === 25 ? "брокколи" :
                 week === 26 ? "цветная капуста" : "кочан салата",
        babyWeight: week <= 16 ? "80-150 г" :
                    week <= 20 ? "250-300 г" :
                    week <= 24 ? "500-600 г" : "800-900 г",
        symptoms: [
          "Уменьшение токсикоза",
          "Появление шевелений плода",
          "Рост живота",
          "Пигментация кожи",
          "Возможны отеки"
        ],
        recommendations: [
          "Второй скрининг (18-21 неделя)",
          "Контроль давления и веса",
          "Умеренная физическая активность",
          "Бандаж при необходимости",
          "Подготовка груди к кормлению"
        ]
      };
    } else {
      return {
        trimester: 3,
        name: "Третий триместр",
        description: "Завершение созревания, подготовка к родам",
        babySize: week === 28 ? "баклажан" :
                 week === 29 ? "тыква" :
                 week === 30 ? "капуста" :
                 week === 31 ? "кокос" :
                 week === 32 ? "дыня" :
                 week === 33 ? "ананас" :
                 week === 34 ? "мускусная дыня" :
                 week === 35 ? "канталупа" :
                 week === 36 ? "папайя" :
                 week === 37 ? "арбузик" :
                 week === 38 ? "арбуз" :
                 week === 39 ? "арбуз" : "небольшой арбуз",
        babyWeight: week <= 32 ? "1.5-1.8 кг" :
                    week <= 36 ? "2.2-2.7 кг" : "2.8-3.5+ кг",
        symptoms: [
          "Одышка, изжога",
          "Боли в спине",
          "Частые позывы в туалет",
          "Тренировочные схватки",
          "Бессонница"
        ],
        recommendations: [
          "Третий скрининг (30-34 недели)",
          "Выбор роддома",
          "Сбор сумки в роддом",
          "Курсы для будущих родителей",
          "Контроль шевелений плода"
        ]
      };
    }
  };

  // Расчёт даты родов по Негеле (от первого дня последних месячных)
  const calculateDueDateFromLMP = useCallback((lmp: Date) => {
    const due = new Date(lmp);
    due.setDate(due.getDate() + 280); // 40 недель = 280 дней
    return due;
  }, []);

  // Расчёт даты родов от даты зачатия
  const calculateDueDateFromConception = useCallback((conception: Date) => {
    const due = new Date(conception);
    due.setDate(due.getDate() + 266); // 38 недель = 266 дней от зачатия
    return due;
  }, []);

  // Расчёт даты зачатия от даты родов
  const calculateConceptionFromDueDate = useCallback((due: Date) => {
    const conception = new Date(due);
    conception.setDate(conception.getDate() - 266);
    return conception;
  }, []);

  // Основная функция расчёта
  const calculate = useCallback(() => {
    let due: Date | null = null;
    let current: Date | null = new Date();
    
    switch(calcType) {
      case "byLMP":
        if (lmpDate) {
          const lmp = new Date(lmpDate);
          if (!isNaN(lmp.getTime())) {
            due = calculateDueDateFromLMP(lmp);
            setDueDate(due.toISOString().split('T')[0]);
            
            // Расчёт текущего срока
            const diffTime = current.getTime() - lmp.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays <= 294) { // до 42 недель
              const weeks = Math.floor(diffDays / 7);
              const days = diffDays % 7;
              setCurrentWeek(weeks);
              setCurrentDay(days);
              
              // Триместр
              const info = getWeekInfo(weeks);
              setTrimester(info.trimester);
              
              // Осталось дней
              const daysLeftTotal = 280 - diffDays;
              setWeeksLeft(Math.floor(daysLeftTotal / 7));
              setDaysLeft(daysLeftTotal % 7);
              
              // Прогресс
              setProgress(Math.min(100, Math.round((diffDays / 280) * 100)));
              
              // Информация о триместре
              setTrimesterInfo(info);
            }
          }
        }
        break;
        
      case "byDate":
        if (conceptionDate) {
          const conception = new Date(conceptionDate);
          if (!isNaN(conception.getTime())) {
            due = calculateDueDateFromConception(conception);
            setDueDate(due.toISOString().split('T')[0]);
            
            // Расчёт текущего срока от зачатия + 2 недели
            const lmpEstimated = new Date(conception);
            lmpEstimated.setDate(lmpEstimated.getDate() - 14);
            
            const diffTime = current.getTime() - lmpEstimated.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays <= 294) {
              const weeks = Math.floor(diffDays / 7);
              const days = diffDays % 7;
              setCurrentWeek(weeks);
              setCurrentDay(days);
              
              const info = getWeekInfo(weeks);
              setTrimester(info.trimester);
              
              const daysLeftTotal = 280 - diffDays;
              setWeeksLeft(Math.floor(daysLeftTotal / 7));
              setDaysLeft(daysLeftTotal % 7);
              
              setProgress(Math.min(100, Math.round((diffDays / 280) * 100)));
              setTrimesterInfo(info);
            }
          }
        }
        break;
        
      case "byBirth":
        if (dueDate) {
          due = new Date(dueDate);
          if (!isNaN(due.getTime())) {
            const conception = calculateConceptionFromDueDate(due);
            setConceptionDate(conception.toISOString().split('T')[0]);
            
            // Расчёт текущего срока
            const lmpEstimated = new Date(conception);
            lmpEstimated.setDate(lmpEstimated.getDate() - 14);
            
            const diffTime = current.getTime() - lmpEstimated.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays <= 294) {
              const weeks = Math.floor(diffDays / 7);
              const days = diffDays % 7;
              setCurrentWeek(weeks);
              setCurrentDay(days);
              
              const info = getWeekInfo(weeks);
              setTrimester(info.trimester);
              
              const daysLeftTotal = 280 - diffDays;
              setWeeksLeft(Math.floor(daysLeftTotal / 7));
              setDaysLeft(daysLeftTotal % 7);
              
              setProgress(Math.min(100, Math.round((diffDays / 280) * 100)));
              setTrimesterInfo(info);
            }
          }
        }
        break;
    }
  }, [calcType, lmpDate, conceptionDate, dueDate]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    const today = new Date();
    const fourWeeksAgo = new Date(today);
    fourWeeksAgo.setDate(today.getDate() - 28);
    setLmpDate(fourWeeksAgo.toISOString().split('T')[0]);
    
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    setConceptionDate(twoWeeksAgo.toISOString().split('T')[0]);
    
    setDueDate("");
    setCalcType("byLMP");
    setCurrentWeek(null);
    setCurrentDay(null);
    setTrimester(null);
    setWeeksLeft(null);
    setDaysLeft(null);
    setProgress(null);
  };

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '32px' }}>👶</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Калькулятор беременности
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              Срок беременности • Дата родов • Триместры • Развитие плода
            </p>
          </div>

          {/* КНОПКИ НАВИГАЦИИ */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/"
              style={{
                flex: '1 1 200px',
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
            
            <button
              onClick={resetCalculator}
              style={{
                flex: '1 1 200px',
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
              onClick={() => setCalcType("byLMP")}
              style={{
                flex: '1 1 150px',
                padding: '12px',
                background: calcType === "byLMP" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "byLMP" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "byLMP" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              📅 По месячным
            </button>
            <button
              onClick={() => setCalcType("byDate")}
              style={{
                flex: '1 1 150px',
                padding: '12px',
                background: calcType === "byDate" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "byDate" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "byDate" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              ❤️ По зачатию
            </button>
            <button
              onClick={() => setCalcType("byBirth")}
              style={{
                flex: '1 1 150px',
                padding: '12px',
                background: calcType === "byBirth" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "byBirth" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "byBirth" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              🍼 По дате родов
            </button>
          </div>

          {/* ПОЛЯ ВВОДА */}
          <div style={{ marginBottom: '24px' }}>
            {calcType === "byLMP" && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                  Первый день последних месячных
                </label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: 'white',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '8px' }}>
                  Дата первого дня последней менструации
                </p>
              </div>
            )}

            {calcType === "byDate" && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                  Дата зачатия (если известна)
                </label>
                <input
                  type="date"
                  value={conceptionDate}
                  onChange={(e) => setConceptionDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: 'white',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '8px' }}>
                  Если точная дата зачатия неизвестна, используйте расчёт по месячным
                </p>
              </div>
            )}

            {calcType === "byBirth" && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                  Предполагаемая дата родов
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: 'white',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{ fontSize: '12px', color: COLORS.text.dark, marginTop: '8px' }}>
                  Рассчитает дату зачатия и текущий срок
                </p>
              </div>
            )}
          </div>

          {/* РЕЗУЛЬТАТЫ */}
          {currentWeek !== null && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${COLORS.border}`,
              marginBottom: '20px',
              background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
            }}>
              {/* Прогресс бар */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '12px',
                  color: COLORS.text.muted
                }}>
                  <span>🌱 Зачатие</span>
                  <span>🤰 {currentWeek} неделя</span>
                  <span>👶 Роды</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: COLORS.border,
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{
                  textAlign: 'right',
                  fontSize: '12px',
                  color: COLORS.primary,
                  marginTop: '4px'
                }}>
                  {progress}% пройдено
                </div>
              </div>

              {/* Основные показатели */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    Текущий срок
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.primary }}>
                    {currentWeek}
                  </div>
                  <div style={{ fontSize: '14px', color: COLORS.text.muted }}>
  недель {currentDay !== null && currentDay > 0 ? `${currentDay} ${currentDay === 1 ? 'день' : currentDay <= 4 ? 'дня' : 'дней'}` : ''}
</div>
                </div>

                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    Триместр
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.primary }}>
                    {trimester}
                  </div>
                  <div style={{ fontSize: '14px', color: COLORS.text.muted }}>
                    {trimester === 1 && "Первый"}
                    {trimester === 2 && "Второй"}
                    {trimester === 3 && "Третий"}
                  </div>
                </div>

                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    Осталось
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.secondary }}>
                    {weeksLeft}
                  </div>
                  <div style={{ fontSize: '14px', color: COLORS.text.muted }}>
                    недель {daysLeft && daysLeft > 0 ? `${daysLeft} ${['день', 'дня', 'дней'][daysLeft === 1 ? 0 : daysLeft <= 4 ? 1 : 2]}` : ''}
                  </div>
                </div>
              </div>

              {/* Даты */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: COLORS.card,
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    Предполагаемая дата родов (ПДР)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.text.main }}>
                    {formatDate(dueDate)}
                  </div>
                </div>
                {calcType !== "byLMP" && (
                  <div>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Первый день последних месячных
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.text.main }}>
                      {calcType === "byDate" && conceptionDate && formatDate(new Date(new Date(conceptionDate).setDate(new Date(conceptionDate).getDate() - 14)).toISOString().split('T')[0])}
                      {calcType === "byBirth" && dueDate && formatDate(new Date(new Date(dueDate).setDate(new Date(dueDate).getDate() - 280)).toISOString().split('T')[0])}
                    </div>
                  </div>
                )}
              </div>

              {/* Информация о неделе */}
              <div style={{
                padding: '16px',
                backgroundColor: COLORS.card,
                borderRadius: '8px',
                border: `1px solid ${COLORS.primary}`
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '12px' }}>
                  {trimesterInfo.name} ({currentWeek} неделя)
                </h3>
                <p style={{ color: COLORS.text.main, fontSize: '14px', marginBottom: '12px' }}>
                  {trimesterInfo.description}
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    backgroundColor: COLORS.background,
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Размер плода</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary }}>
                      {trimesterInfo.babySize}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: COLORS.background,
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted }}>Вес плода</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary }}>
                      {trimesterInfo.babyWeight}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginTop: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '8px' }}>
                      🤰 Ощущения
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: COLORS.text.muted, fontSize: '13px' }}>
                      {trimesterInfo.symptoms.map((symptom, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '8px' }}>
                      💡 Рекомендации
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: COLORS.text.muted, fontSize: '13px' }}>
                      {trimesterInfo.recommendations.map((rec, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '28px' }}>📋</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Как рассчитать срок беременности и дату родов?
            </span>
          </h2>
          
          <p style={{ color: COLORS.text.main, marginBottom: '16px', fontSize: '15px' }}>
            Калькулятор беременности помогает определить текущий срок, предполагаемую дату родов 
            и получить информацию о развитии плода по неделям. Расчёт основан на акушерском сроке 
            (40 недель = 280 дней от первого дня последних месячных).
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                📅 Первый триместр (1-13 недель)
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p>• Формирование всех органов и систем</p>
                <p>• Закладка нервной трубки, сердца</p>
                <p>• Появляется сердцебиение (6 недель)</p>
                <p>• Формируются ручки и ножки</p>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                👶 Второй триместр (14-27 недель)
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p>• Активный рост плода</p>
                <p>• Первые шевеления (18-22 недели)</p>
                <p>• Формирование половых органов</p>
                <p>• Ребёнок слышит звуки</p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🍼 Третий триместр (28-40 недель)
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p>• Накопление подкожного жира</p>
                <p>• Ребёнок занимает положение к родам</p>
                <p>• Созревание лёгких</p>
                <p>• Подготовка к появлению на свет</p>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', color: COLORS.primary, marginBottom: '12px' }}>
            Методы расчёта даты родов
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                📊 Правило Негеле
              </h4>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                От первого дня последних месячных отнять 3 месяца и прибавить 7 дней.
                Например: первый день последних месячных 01.01.2026 → 
                отнимаем 3 месяца (01.10.2025) → прибавляем 7 дней = 08.10.2025
              </p>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                📏 По УЗИ
              </h4>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Наиболее точный метод в первом триместре (до 12 недель). 
                Врач измеряет копчико-теменной размер плода и определяет срок.
              </p>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h4 style={{ fontSize: '16px', color: COLORS.text.main, marginBottom: '8px' }}>
                🏃 По первому шевелению
              </h4>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Повторнородящие чувствуют шевеления в среднем на 18-й неделе, 
                первородящие — на 20-й неделе. Метод ориентировочный.
              </p>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', color: COLORS.primary, marginBottom: '12px' }}>
            Важные обследования по неделям
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.primary}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                5-8 недель
              </div>
              <div style={{ fontSize: '13px', color: COLORS.text.muted }}>
                УЗИ для подтверждения беременности
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.primary}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                11-13 недель
              </div>
              <div style={{ fontSize: '13px', color: COLORS.text.muted }}>
                Первый скрининг (УЗИ + кровь)
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.primary}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                18-21 неделя
              </div>
              <div style={{ fontSize: '13px', color: COLORS.text.muted }}>
                Второй скрининг (УЗИ + кровь)
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.primary}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '4px' }}>
                30-34 недели
              </div>
              <div style={{ fontSize: '13px', color: COLORS.text.muted }}>
                Третий скрининг (УЗИ + допплер)
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(236, 72, 153, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Важно:</strong> Калькулятор беременности даёт ориентировочные результаты. 
              Только 5% женщин рожают точно в рассчитанную дату. Нормой считаются роды в период 
              с 38 по 42 неделю беременности. Всегда консультируйтесь с вашим врачом!
            </p>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            border: `1px solid ${COLORS.border}`
          }}>
            <h4 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '12px' }}>
              📚 Интересные факты о беременности
            </h4>
            <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>• Самая долгая зарегистрированная беременность длилась 375 дней (обычно 280).</li>
              <li style={{ marginBottom: '8px' }}>• На 8-й неделе у плода уже есть отпечатки пальцев.</li>
              <li style={{ marginBottom: '8px' }}>• Ребёнок в утробе может икать, зевать, сосать палец.</li>
              <li style={{ marginBottom: '8px' }}>• Плацента вырабатывает гормоны, которые влияют на настроение матери.</li>
              <li style={{ marginBottom: '8px' }}>• Сердцебиение плода можно услышать с 6-й недели на УЗИ.</li>
              <li style={{ marginBottom: '8px' }}>• Ребёнок начинает слышать звуки с 16-18 недели.</li>
              <li>• За беременность матка увеличивается в 500 раз!</li>
            </ul>
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
            Калькулятор беременности • Срок, дата родов, триместры • Развитие плода по неделям • {new Date().getFullYear()} год
          </p>
        </div>
      </div>
    </div>
  );
}