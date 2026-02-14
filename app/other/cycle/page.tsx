// app/other/cycle-tracker/page.tsx
"use client";

import { useState, useCallback, useEffect } from 'react';

export default function CycleTrackerPage() {
  // Состояния калькулятора
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 14); // 2 недели назад для примера
    return date.toISOString().split('T')[0];
  });
  
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  
  const [nextPeriod, setNextPeriod] = useState<string>("");
  const [ovulationDate, setOvulationDate] = useState<string>("");
  const [fertileWindow, setFertileWindow] = useState<{ start: string; end: string } | null>(null);
  const [safeDays, setSafeDays] = useState<{ before: string; after: string } | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string>("");
  const [daysUntilNext, setDaysUntilNext] = useState<number | null>(null);

  // Цветовая схема
  const COLORS = {
    primary: '#ec4899', // розовый
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
    period: '#ef4444',
    ovulation: '#f59e0b',
    fertile: '#10b981',
    safe: '#3b82f6'
  };

  // Функция форматирования даты
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Расчёт всех дат
  const calculateCycle = useCallback(() => {
    const lastDate = new Date(lastPeriodDate);
    
    // Следующая менструация
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + cycleLength);
    setNextPeriod(formatDate(nextDate));
    
    // Дней до следующей
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUntilNext(diffDays >= 0 ? diffDays : 0);

    // Овуляция (обычно за 14 дней до следующей менструации)
    const ovulation = new Date(nextDate);
    ovulation.setDate(nextDate.getDate() - 14);
    setOvulationDate(formatDate(ovulation));

    // Фертильные дни (овуляция ± 3 дня)
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 3);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(ovulation.getDate() + 3);
    setFertileWindow({
      start: formatDate(fertileStart),
      end: formatDate(fertileEnd)
    });

    // Безопасные дни
    const lastPeriodEnd = new Date(lastDate);
    lastPeriodEnd.setDate(lastDate.getDate() + periodLength - 1);
    
    const safeBefore = new Date(lastPeriodEnd);
    safeBefore.setDate(lastPeriodEnd.getDate() + 1);
    
    const safeAfter = new Date(fertileEnd);
    safeAfter.setDate(fertileEnd.getDate() + 1);
    
    setSafeDays({
      before: `${formatDateShort(safeBefore)} — ${formatDateShort(fertileStart)}`,
      after: `${formatDateShort(safeAfter)} — ${formatDateShort(nextDate)}`
    });

    // Определение текущей фазы
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const last = new Date(lastDate);
    last.setHours(0, 0, 0, 0);
    
    const periodEnd = new Date(lastDate);
    periodEnd.setDate(lastDate.getDate() + periodLength - 1);
    periodEnd.setHours(0, 0, 0, 0);
    
    const ovul = new Date(ovulation);
    ovul.setHours(0, 0, 0, 0);
    
    const fertileStartDate = new Date(ovul);
    fertileStartDate.setDate(ovul.getDate() - 3);
    fertileStartDate.setHours(0, 0, 0, 0);
    
    const fertileEndDate = new Date(ovul);
    fertileEndDate.setDate(ovul.getDate() + 3);
    fertileEndDate.setHours(0, 0, 0, 0);

    if (currentDate >= last && currentDate <= periodEnd) {
      setCurrentPhase("Менструация");
    } else if (currentDate >= fertileStartDate && currentDate <= fertileEndDate) {
      setCurrentPhase("Фертильные дни");
    } else if (currentDate > periodEnd && currentDate < fertileStartDate) {
      setCurrentPhase("Фолликулярная фаза");
    } else if (currentDate > fertileEndDate && currentDate < nextDate) {
      setCurrentPhase("Лютеиновая фаза");
    } else {
      setCurrentPhase("—");
    }

  }, [lastPeriodDate, cycleLength, periodLength]);

  useEffect(() => {
    calculateCycle();
  }, [calculateCycle]);

  const resetCalculator = () => {
    const date = new Date();
    date.setDate(date.getDate() - 14);
    setLastPeriodDate(date.toISOString().split('T')[0]);
    setCycleLength(28);
    setPeriodLength(5);
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
            <span style={{ fontSize: '32px' }}>📅</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Календарь менструального цикла
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Расчёт фаз цикла, овуляции и безопасных дней
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
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                Первый день последних месячных
              </label>
              <input
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Длина цикла (дни)
                </label>
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '16px'
                  }}
                  min="20"
                  max="40"
                  step="1"
                />
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {[26, 28, 30, 32].map(val => (
                    <button
                      key={val}
                      onClick={() => setCycleLength(val)}
                      style={{
                        padding: '2px 6px',
                        backgroundColor: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '4px',
                        color: COLORS.text.muted,
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                  Длительность месячных
                </label>
                <input
                  type="number"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(parseInt(e.target.value) || 5)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    color: 'white',
                    fontSize: '16px'
                  }}
                  min="3"
                  max="8"
                  step="1"
                />
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {[3, 4, 5, 6, 7].map(val => (
                    <button
                      key={val}
                      onClick={() => setPeriodLength(val)}
                      style={{
                        padding: '2px 6px',
                        backgroundColor: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '4px',
                        color: COLORS.text.muted,
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${COLORS.border}`
          }}>
            
            {/* Текущая фаза */}
            <div style={{
              backgroundColor: COLORS.card,
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                Текущая фаза цикла
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.primary }}>
                {currentPhase}
              </div>
            </div>

            {/* Основные даты */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                backgroundColor: COLORS.card,
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>
                  Следующие месячные
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.period }}>
                  {nextPeriod}
                </div>
                {daysUntilNext !== null && (
                  <div style={{ fontSize: '11px', color: COLORS.text.dark, marginTop: '4px' }}>
                    через {daysUntilNext} дн.
                  </div>
                )}
              </div>

              <div style={{
                backgroundColor: COLORS.card,
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>
                  Овуляция
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.ovulation }}>
                  {ovulationDate}
                </div>
              </div>
            </div>

            {/* Фертильные дни */}
            {fertileWindow && (
              <div style={{
                backgroundColor: COLORS.card,
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: `1px solid ${COLORS.fertile}`
              }}>
                <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '8px', textAlign: 'center' }}>
                  🌸 Фертильные дни (вероятность зачатия)
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '13px', color: COLORS.fertile }}>
                    {fertileWindow.start}
                  </div>
                  <span style={{ color: COLORS.text.dark }}>—</span>
                  <div style={{ fontSize: '13px', color: COLORS.fertile }}>
                    {fertileWindow.end}
                  </div>
                </div>
              </div>
            )}

            {/* Безопасные дни */}
            {safeDays && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    ✅ Безопасные до овуляции
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.safe }}>
                    {safeDays.before}
                  </div>
                </div>

                <div style={{
                  backgroundColor: COLORS.card,
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted, marginBottom: '4px' }}>
                    ✅ Безопасные после овуляции
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.safe }}>
                    {safeDays.after}
                  </div>
                </div>
              </div>
            )}

            {/* Прогресс-бар цикла */}
            {daysUntilNext !== null && (
              <div style={{
                marginTop: '8px',
                padding: '12px',
                backgroundColor: COLORS.card,
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                  fontSize: '11px',
                  color: COLORS.text.dark
                }}>
                  <span>День 1</span>
                  <span>Овуляция</span>
                  <span>День {cycleLength}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: COLORS.border,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Менструация */}
                  <div style={{
                    width: `${(periodLength / cycleLength) * 100}%`,
                    height: '100%',
                    backgroundColor: COLORS.period,
                    float: 'left'
                  }} />
                  {/* Фертильные дни */}
                  <div style={{
                    width: `${(7 / cycleLength) * 100}%`,
                    height: '100%',
                    backgroundColor: COLORS.fertile,
                    float: 'left',
                    marginLeft: `${((cycleLength - 14 - 3) / cycleLength) * 100}%`
                  }} />
                </div>
              </div>
            )}
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
            📊 О менструальном цикле
          </h2>
          
          <p style={{ color: COLORS.text.main, fontSize: '15px', marginBottom: '16px' }}>
            Менструальный цикл — это регулярные изменения в организме женщины, 
            подготавливающие её к беременности. Средняя продолжительность цикла составляет 28 дней, 
            но нормой считается от 21 до 35 дней.
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            🔬 Фазы цикла
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px',
              borderLeft: `4px solid ${COLORS.period}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.period, marginBottom: '4px' }}>
                1. Менструальная фаза (дни 1-5)
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Отторжение эндометрия, выделения. Первый день кровотечения считается первым днём цикла.
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px',
              borderLeft: `4px solid ${COLORS.secondary}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.secondary, marginBottom: '4px' }}>
                2. Фолликулярная фаза (дни 6-13)
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Созревание фолликулов, рост эндометрия. Уровень эстрогена повышается.
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px',
              borderLeft: `4px solid ${COLORS.fertile}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.fertile, marginBottom: '4px' }}>
                3. Овуляция (день 14)
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Выход яйцеклетки из яичника. Самое благоприятное время для зачатия.
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.background,
              padding: '12px',
              borderRadius: '8px',
              borderLeft: `4px solid ${COLORS.ovulation}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.ovulation, marginBottom: '4px' }}>
                4. Лютеиновая фаза (дни 15-28)
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                Подготовка к беременности. Если зачатия не происходит, уровень гормонов падает.
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.main }}>
            💡 Важные факты
          </h3>

          <ul style={{ color: COLORS.text.muted, fontSize: '14px', paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}>• <strong>Овуляция</strong> происходит примерно за 14 дней до следующей менструации</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Фертильные дни</strong> — овуляция и 5 дней до неё (жизнеспособность сперматозоидов)</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Яйцеклетка</strong> живёт 12-24 часа после овуляции</li>
            <li style={{ marginBottom: '8px' }}>• <strong>Сперматозоиды</strong> могут жить в организме женщины до 5 дней</li>
            <li style={{ marginBottom: '8px' }}>• Календарный метод <strong>не является надёжным</strong> средством контрацепции</li>
          </ul>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Важно:</strong> Календарный метод не подходит для контрацепции при нерегулярном цикле. 
              Для точного определения овуляции используйте тесты на овуляцию или измерение базальной температуры. 
              При любых вопросах обращайтесь к гинекологу.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}