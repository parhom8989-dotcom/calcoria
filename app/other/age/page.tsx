// app/other/age/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function AgeCalculatorPage() {
  // Состояния калькулятора
  const [birthDate, setBirthDate] = useState<string>(() => {
    // Устанавливаем дату 30 лет назад как значение по умолчанию
    const date = new Date();
    date.setFullYear(date.getFullYear() - 30);
    return date.toISOString().split('T')[0];
  });
  
  const [targetDate, setTargetDate] = useState<string>(() => {
    // Сегодняшняя дата по умолчанию
    return new Date().toISOString().split('T')[0];
  });

  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
    nextBirthday: string;
    nextBirthdayDays: number;
    isBirthday: boolean;
  } | null>(null);

  // Цветовая схема
  const COLORS = {
    primary: '#8b5cf6', // фиолетовый
    primaryHover: '#7c3aed',
    secondary: '#a78bfa',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    success: '#10b981',
    warning: '#f59e0b'
  };

  // Расчёт возраста
  const calculate = useCallback(() => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
      setResult(null);
      return;
    }

    // Проверка, что дата рождения не позже целевой даты
    if (birth > target) {
      setResult(null);
      return;
    }

    // Разница в миллисекундах
    const diffMs = target.getTime() - birth.getTime();
    
    // Общее количество дней
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Общее количество недель
    const totalWeeks = parseFloat((totalDays / 7).toFixed(1));
    
    // Часы, минуты, секунды
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    // Вычисляем годы, месяцы, дни
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    // Корректировка дней
    if (days < 0) {
      months -= 1;
      // Получаем последний день предыдущего месяца
      const lastMonthDate = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonthDate.getDate();
    }

    // Корректировка месяцев
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Проверка, является ли целевая дата днём рождения
    const isBirthday = (target.getDate() === birth.getDate() && 
                       target.getMonth() === birth.getMonth());

    // Расчёт следующего дня рождения
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < target) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // Форматирование даты следующего дня рождения
    const nextBirthdayStr = nextBirthday.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthday: nextBirthdayStr,
      nextBirthdayDays: daysToNextBirthday,
      isBirthday
    });

  }, [birthDate, targetDate]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const resetCalculator = () => {
    const thirtyYearsAgo = new Date();
    thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
    setBirthDate(thirtyYearsAgo.toISOString().split('T')[0]);
    setTargetDate(new Date().toISOString().split('T')[0]);
  };

  const setToday = () => {
    setTargetDate(new Date().toISOString().split('T')[0]);
  };

  // Форматирование чисел с разделителями
  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU');
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
                Сколько дней вы прожили
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Точный возраст в днях, часах и минутах
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
                Дата рождения
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
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

            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px', display: 'block' }}>
                Дата расчёта
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid ${COLORS.border}`,
                  color: 'white',
                  fontSize: '16px',
                  marginBottom: '8px'
                }}
              />
              <button
                onClick={setToday}
                style={{
                  padding: '6px 12px',
                  backgroundColor: COLORS.background,
                  border: `1px solid ${COLORS.primary}`,
                  borderRadius: '6px',
                  color: COLORS.primary,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📅 Сегодня
              </button>
            </div>
          </div>

          {/* РЕЗУЛЬТАТ */}
          {result && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${COLORS.border}`
            }}>
              
              {/* Если сегодня день рождения */}
              {result.isBirthday && (
                <div style={{
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  fontWeight: 'bold'
                }}>
                  🎉 С днём рождения! 🎉
                </div>
              )}

              {/* Основной возраст */}
              <div style={{
                backgroundColor: COLORS.card,
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '8px' }}>
                  Ваш точный возраст
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.primary }}>
                  {result.years} лет {result.months} мес {result.days} дн
                </div>
              </div>

              {/* Общее количество дней */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ backgroundColor: COLORS.card, padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Всего дней</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.success }}>
                    {formatNumber(result.totalDays)}
                  </div>
                </div>
                <div style={{ backgroundColor: COLORS.card, padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>Всего недель</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.warning }}>
                    {formatNumber(result.totalWeeks)}
                  </div>
                </div>
              </div>

              {/* Часы, минуты, секунды */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ backgroundColor: COLORS.card, padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: COLORS.text.muted }}>Часов</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {formatNumber(result.totalHours)}
                  </div>
                </div>
                <div style={{ backgroundColor: COLORS.card, padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: COLORS.text.muted }}>Минут</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {formatNumber(result.totalMinutes)}
                  </div>
                </div>
                <div style={{ backgroundColor: COLORS.card, padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: COLORS.text.muted }}>Секунд</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {formatNumber(result.totalSeconds)}
                  </div>
                </div>
              </div>

              {/* Следующий день рождения */}
              <div style={{
                backgroundColor: COLORS.card,
                padding: '12px',
                borderRadius: '6px',
                fontSize: '13px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: COLORS.text.muted }}>🎂 Следующий день рождения:</span>
                  <span style={{ fontWeight: 'bold', color: COLORS.primary }}>{result.nextBirthday}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: COLORS.text.muted }}>⏳ Осталось дней:</span>
                  <span style={{ fontWeight: 'bold', color: COLORS.warning }}>{result.nextBirthdayDays}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ПОДСКАЗКА */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${COLORS.border}`,
          fontSize: '13px',
          color: COLORS.text.muted
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <span style={{ fontWeight: 'bold', color: COLORS.primary }}>Интересные факты:</span>
          </div>
          <p style={{ marginBottom: '4px' }}>• Средняя продолжительность жизни человека: ~27 000 дней</p>
          <p style={{ marginBottom: '4px' }}>• 10 000 дней — это примерно 27 лет</p>
          <p style={{ marginBottom: '4px' }}>• 20 000 дней — примерно 55 лет</p>
          <p style={{ marginTop: '8px', fontSize: '12px', color: COLORS.text.dark }}>
            Расчёт учитывает високосные годы и разное количество дней в месяцах.
          </p>
        </div>
      </div>
    </div>
  );
}