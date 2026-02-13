// app/other/converter/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function UniversalConverterPage() {
  // Состояния конвертера
  const [category, setCategory] = useState<"length" | "area" | "volume" | "weight" | "time" | "temperature" | "speed" | "data" | "pressure" | "energy" | "power" | "angle" | "cooking" | "fuel" | "digital">("length");
  
  const [fromUnit, setFromUnit] = useState<string>("meter");
  const [toUnit, setToUnit] = useState<string>("kilometer");
  const [inputValue, setInputValue] = useState<string>("1");
  const [result, setResult] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  // Цветовая схема #3b82f6 (blue-500)
  const COLORS = {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#60a5fa',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#3b82f6',
      to: '#60a5fa'
    }
  };

  // Замените объявление UNITS на этот код:

// Типы для единиц
interface StandardUnit {
  id: string;
  name: string;
  symbol: string;
  factor: number;
}

interface TemperatureUnit {
  id: string;
  name: string;
  symbol: string;
}

type UnitType = StandardUnit | TemperatureUnit;

// Единицы измерения (15+ категорий, только основные единицы)
const UNITS: Record<string, UnitType[]> = {
  // 1. Длина (8 основных единиц)
  length: [
    { id: "kilometer", name: "Километр", symbol: "км", factor: 1000 },
    { id: "meter", name: "Метр", symbol: "м", factor: 1 },
    { id: "centimeter", name: "Сантиметр", symbol: "см", factor: 0.01 },
    { id: "millimeter", name: "Миллиметр", symbol: "мм", factor: 0.001 },
    { id: "mile", name: "Мили", symbol: "mi", factor: 1609.34 },
    { id: "yard", name: "Ярд", symbol: "yd", factor: 0.9144 },
    { id: "foot", name: "Фут", symbol: "ft", factor: 0.3048 },
    { id: "inch", name: "Дюйм", symbol: "in", factor: 0.0254 }
  ],
  
  // 2. Площадь (8 основных единиц)
  area: [
    { id: "square_kilometer", name: "Кв. километр", symbol: "км²", factor: 1000000 },
    { id: "square_meter", name: "Кв. метр", symbol: "м²", factor: 1 },
    { id: "hectare", name: "Гектар", symbol: "га", factor: 10000 },
    { id: "are", name: "Ар (сотка)", symbol: "ар", factor: 100 },
    { id: "square_centimeter", name: "Кв. сантиметр", symbol: "см²", factor: 0.0001 },
    { id: "acre", name: "Акр", symbol: "ac", factor: 4046.86 },
    { id: "square_mile", name: "Кв. миля", symbol: "mi²", factor: 2590000 },
    { id: "square_foot", name: "Кв. фут", symbol: "ft²", factor: 0.092903 }
  ],
  
  // 3. Объём (8 основных единиц)
  volume: [
    { id: "cubic_meter", name: "Куб. метр", symbol: "м³", factor: 1 },
    { id: "liter", name: "Литр", symbol: "л", factor: 0.001 },
    { id: "milliliter", name: "Миллилитр", symbol: "мл", factor: 0.000001 },
    { id: "gallon_us", name: "Галлон (US)", symbol: "gal", factor: 0.00378541 },
    { id: "gallon_uk", name: "Галлон (UK)", symbol: "gal UK", factor: 0.00454609 },
    { id: "cubic_foot", name: "Куб. фут", symbol: "ft³", factor: 0.0283168 },
    { id: "cubic_inch", name: "Куб. дюйм", symbol: "in³", factor: 0.0000163871 },
    { id: "barrel", name: "Баррель", symbol: "bbl", factor: 0.158987 }
  ],
  
  // 4. Вес (8 основных единиц)
  weight: [
    { id: "tonne", name: "Тонна", symbol: "т", factor: 1000 },
    { id: "kilogram", name: "Килограмм", symbol: "кг", factor: 1 },
    { id: "gram", name: "Грамм", symbol: "г", factor: 0.001 },
    { id: "milligram", name: "Миллиграмм", symbol: "мг", factor: 0.000001 },
    { id: "pound", name: "Фунт", symbol: "lb", factor: 0.453592 },
    { id: "ounce", name: "Унция", symbol: "oz", factor: 0.0283495 },
    { id: "carat", name: "Карат", symbol: "ct", factor: 0.0002 },
    { id: "stone", name: "Стоун", symbol: "st", factor: 6.35029 }
  ],
  
  // 5. Время (8 основных единиц)
  time: [
    { id: "year", name: "Год", symbol: "год", factor: 31536000 },
    { id: "month", name: "Месяц", symbol: "мес", factor: 2592000 },
    { id: "week", name: "Неделя", symbol: "нед", factor: 604800 },
    { id: "day", name: "День", symbol: "дн", factor: 86400 },
    { id: "hour", name: "Час", symbol: "ч", factor: 3600 },
    { id: "minute", name: "Минута", symbol: "мин", factor: 60 },
    { id: "second", name: "Секунда", symbol: "с", factor: 1 },
    { id: "millisecond", name: "Миллисекунда", symbol: "мс", factor: 0.001 }
  ],
  
  // 6. Температура (специальная конвертация)
  temperature: [
    { id: "celsius", name: "Цельсий", symbol: "°C" },
    { id: "fahrenheit", name: "Фаренгейт", symbol: "°F" },
    { id: "kelvin", name: "Кельвин", symbol: "K" }
  ] as TemperatureUnit[],
  
  // 7. Скорость (6 основных единиц)
  speed: [
    { id: "km_per_h", name: "Км/ч", symbol: "км/ч", factor: 0.277778 },
    { id: "m_per_s", name: "М/с", symbol: "м/с", factor: 1 },
    { id: "mile_per_h", name: "Мили/ч", symbol: "mph", factor: 0.44704 },
    { id: "knot", name: "Узел", symbol: "уз", factor: 0.514444 },
    { id: "foot_per_s", name: "Фут/с", symbol: "ft/s", factor: 0.3048 },
    { id: "mach", name: "Маха", symbol: "Ma", factor: 340.3 }
  ],
  
  // 8. Данные (8 основных единиц)
  data: [
    { id: "terabyte", name: "Терабайт", symbol: "ТБ", factor: 1099511627776 },
    { id: "gigabyte", name: "Гигабайт", symbol: "ГБ", factor: 1073741824 },
    { id: "megabyte", name: "Мегабайт", symbol: "МБ", factor: 1048576 },
    { id: "kilobyte", name: "Килобайт", symbol: "КБ", factor: 1024 },
    { id: "byte", name: "Байт", symbol: "Б", factor: 1 },
    { id: "bit", name: "Бит", symbol: "бит", factor: 0.125 },
    { id: "terabit", name: "Терабит", symbol: "Тбит", factor: 137438953472 },
    { id: "gigabit", name: "Гигабит", symbol: "Гбит", factor: 134217728 }
  ],
  
  // 9. Давление (6 основных единиц)
  pressure: [
    { id: "pascal", name: "Паскаль", symbol: "Па", factor: 1 },
    { id: "bar", name: "Бар", symbol: "бар", factor: 100000 },
    { id: "atm", name: "Атмосфера", symbol: "атм", factor: 101325 },
    { id: "psi", name: "PSI", symbol: "psi", factor: 6894.76 },
    { id: "mmhg", name: "мм рт.ст.", symbol: "мм рт.ст.", factor: 133.322 },
    { id: "kgf_per_cm2", name: "кгс/см²", symbol: "кгс/см²", factor: 98066.5 }
  ],
  
  // 10. Энергия (6 основных единиц)
  energy: [
    { id: "joule", name: "Джоуль", symbol: "Дж", factor: 1 },
    { id: "kilojoule", name: "Килоджоуль", symbol: "кДж", factor: 1000 },
    { id: "calorie", name: "Калория", symbol: "кал", factor: 4.184 },
    { id: "kilocalorie", name: "Килокалория", symbol: "ккал", factor: 4184 },
    { id: "watt_hour", name: "Ватт-час", symbol: "Вт·ч", factor: 3600 },
    { id: "kilowatt_hour", name: "Киловатт-час", symbol: "кВт·ч", factor: 3600000 }
  ],
  
  // 11. Мощность (6 основных единиц)
  power: [
    { id: "watt", name: "Ватт", symbol: "Вт", factor: 1 },
    { id: "kilowatt", name: "Киловатт", symbol: "кВт", factor: 1000 },
    { id: "horsepower", name: "Лошадиная сила", symbol: "л.с.", factor: 735.499 },
    { id: "megawatt", name: "Мегаватт", symbol: "МВт", factor: 1000000 },
    { id: "btu_per_h", name: "BTU/ч", symbol: "BTU/ч", factor: 0.293071 },
    { id: "ton_refrigeration", name: "Тонна охлаждения", symbol: "TR", factor: 3516.85 }
  ],
  
  // 12. Углы (5 основных единиц)
  angle: [
    { id: "degree", name: "Градус", symbol: "°", factor: Math.PI/180 },
    { id: "radian", name: "Радиан", symbol: "рад", factor: 1 },
    { id: "gradian", name: "Град", symbol: "град", factor: Math.PI/200 },
    { id: "turn", name: "Оборот", symbol: "об", factor: 2*Math.PI },
    { id: "arcminute", name: "Минута дуги", symbol: "′", factor: Math.PI/10800 }
  ],
  
  // 13. Кулинария (6 основных единиц)
  cooking: [
    { id: "teaspoon", name: "Чайная ложка", symbol: "ч.л.", factor: 0.005 },
    { id: "tablespoon", name: "Столовая ложка", symbol: "ст.л.", factor: 0.015 },
    { id: "cup", name: "Чашка", symbol: "чашка", factor: 0.24 },
    { id: "milliliter_cook", name: "Миллилитр", symbol: "мл", factor: 0.001 },
    { id: "liter_cook", name: "Литр", symbol: "л", factor: 1 },
    { id: "fluid_ounce", name: "Жидкая унция", symbol: "fl oz", factor: 0.0295735 }
  ],
  
  // 14. Расход топлива (5 основных единиц)
  fuel: [
    { id: "km_per_l", name: "Км на литр", symbol: "км/л", factor: 1 },
    { id: "l_per_100km", name: "Литров на 100км", symbol: "л/100км", factor: 100 },
    { id: "mpg_us", name: "MPG (US)", symbol: "MPG US", factor: 0.425144 },
    { id: "mpg_uk", name: "MPG (UK)", symbol: "MPG UK", factor: 0.354006 },
    { id: "miles_per_l", name: "Мили на литр", symbol: "миль/л", factor: 1.60934 }
  ],
  
  // 15. Цифровые единицы (6 основных единиц)
  digital: [
    { id: "pixel", name: "Пиксель", symbol: "px", factor: 1 },
    { id: "point", name: "Пункт", symbol: "pt", factor: 1.33333 },
    { id: "em", name: "Em", symbol: "em", factor: 16 },
    { id: "rem", name: "Rem", symbol: "rem", factor: 16 },
    { id: "inch_digital", name: "Дюйм", symbol: "in", factor: 96 },
    { id: "centimeter_digital", name: "Сантиметр", symbol: "см", factor: 37.7953 }
  ]
};

  // Получение текущих единиц
  const currentUnits = UNITS[category];
  const fromUnitData = currentUnits.find(u => u.id === fromUnit);
  const toUnitData = currentUnits.find(u => u.id === toUnit);

  // Функция конвертации
  const convert = useCallback(() => {
    const value = parseFloat(inputValue) || 0;
    
    if (category === "temperature") {
      // Специальные формулы для температуры
      let tempInCelsius = 0;
      
      // Конвертируем в Цельсии
      switch(fromUnit) {
        case "celsius":
          tempInCelsius = value;
          break;
        case "fahrenheit":
          tempInCelsius = (value - 32) * 5/9;
          break;
        case "kelvin":
          tempInCelsius = value - 273.15;
          break;
      }
      
      // Конвертируем из Цельсиев в целевую единицу
      let convertedValue = 0;
      switch(toUnit) {
        case "celsius":
          convertedValue = tempInCelsius;
          break;
        case "fahrenheit":
          convertedValue = (tempInCelsius * 9/5) + 32;
          break;
        case "kelvin":
          convertedValue = tempInCelsius + 273.15;
          break;
      }
      
      setResult(convertedValue);
      setConversionRate(convertedValue / value || 1);
      
    } else if (category === "fuel") {
      // Специальная конвертация для расхода топлива
      let valueInBase = 0;
      
      // Конвертируем в базовую единицу (км/л)
      switch(fromUnit) {
        case "km_per_l":
          valueInBase = value;
          break;
        case "l_per_100km":
          valueInBase = 100 / value;
          break;
        case "mpg_us":
          valueInBase = value * 0.425144;
          break;
        case "mpg_uk":
          valueInBase = value * 0.354006;
          break;
        case "miles_per_l":
          valueInBase = value * 1.60934;
          break;
      }
      
      // Конвертируем из базовой в целевую
      let convertedValue = 0;
      switch(toUnit) {
        case "km_per_l":
          convertedValue = valueInBase;
          break;
        case "l_per_100km":
          convertedValue = 100 / valueInBase;
          break;
        case "mpg_us":
          convertedValue = valueInBase / 0.425144;
          break;
        case "mpg_uk":
          convertedValue = valueInBase / 0.354006;
          break;
        case "miles_per_l":
          convertedValue = valueInBase / 1.60934;
          break;
      }
      
      setResult(convertedValue);
      setConversionRate(convertedValue / value || 1);
      
    } else {
  // Обычная конвертация через факторы
  // Проверяем, что это стандартные единицы с фактором
  const fromHasFactor = 'factor' in fromUnitData!;
  const toHasFactor = 'factor' in toUnitData!;
  
  if (fromUnitData && toUnitData && fromHasFactor && toHasFactor) {
    const fromFactor = (fromUnitData as StandardUnit).factor;
    const toFactor = (toUnitData as StandardUnit).factor;
    
    const valueInBase = value * fromFactor;
    const convertedValue = valueInBase / toFactor;
    const conversionRateValue = convertedValue / value;
    
    setResult(convertedValue);
    setConversionRate(conversionRateValue);
  }
}
  }, [category, fromUnit, toUnit, inputValue, fromUnitData, toUnitData]);

  // Автоматическая конвертация
  useEffect(() => {
    convert();
  }, [convert]);

  // Сброс значений
  const resetConverter = () => {
    setCategory("length");
    setFromUnit("meter");
    setToUnit("kilometer");
    setInputValue("1");
    setResult(null);
    setConversionRate(null);
  };

  // Поменять единицы местами
  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Форматирование числа
  const formatNumber = (num: number) => {
    if (num === 0) return "0";
    
    // Для очень больших или очень маленьких чисел используем научную нотацию
    if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6);
    }
    
    // Определяем количество знаков после запятой
    const absNum = Math.abs(num);
    let decimals = 6;
    
    if (absNum >= 1000) decimals = 2;
    else if (absNum >= 100) decimals = 3;
    else if (absNum >= 10) decimals = 4;
    else if (absNum >= 1) decimals = 5;
    else if (absNum >= 0.1) decimals = 6;
    else if (absNum >= 0.01) decimals = 7;
    else if (absNum >= 0.001) decimals = 8;
    
    // Форматируем с разделителями тысяч
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
      notation: absNum > 1e6 ? 'scientific' : 'standard'
    }).format(num);
  };

  // Получить описание категории
  const getCategoryDescription = () => {
    switch(category) {
      case "length": return "Линейные размеры и расстояния";
      case "area": return "Площади поверхностей и земельных участков";
      case "volume": return "Ёмкости и объёмы жидкостей, газов";
      case "weight": return "Масса веществ и предметов";
      case "time": return "Промежутки времени";
      case "temperature": return "Температурные шкалы";
      case "speed": return "Скорость движения";
      case "data": return "Объёмы цифровых данных";
      case "pressure": return "Давление жидкостей и газов";
      case "energy": return "Энергия, работа, теплота";
      case "power": return "Мощность, скорость передачи энергии";
      case "angle": return "Углы и их измерение";
      case "cooking": return "Кулинарные меры объёма";
      case "fuel": return "Расход топлива транспортных средств";
      case "digital": return "Единицы измерения в цифровом дизайне";
      default: return "";
    }
  };

  // Получить иконку для категории
  const getCategoryIcon = () => {
    switch(category) {
      case "length": return "📏";
      case "area": return "📐";
      case "volume": return "🫙";
      case "weight": return "⚖️";
      case "time": return "⏰";
      case "temperature": return "🌡️";
      case "speed": return "🚗";
      case "data": return "💾";
      case "pressure": return "🌀";
      case "energy": return "⚡";
      case "power": return "🔋";
      case "angle": return "📐";
      case "cooking": return "🍳";
      case "fuel": return "⛽";
      case "digital": return "🖥️";
      default: return "📊";
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КОНВЕРТЕРА */}
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
              <span style={{ fontSize: '32px' }}>📐</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Универсальный конвертер
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              12+ категорий измерений с основными единицами
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
              onClick={resetConverter}
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

          {/* Переключатель категорий (3 колонки по 5 категорий) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '24px',
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '12px'
          }}>
            {[
              { id: "length", name: "Длина", icon: "📏" },
              { id: "area", name: "Площадь", icon: "📐" },
              { id: "volume", name: "Объём", icon: "🫙" },
              { id: "weight", name: "Вес", icon: "⚖️" },
              { id: "time", name: "Время", icon: "⏰" },
              { id: "temperature", name: "Температура", icon: "🌡️" },
              { id: "speed", name: "Скорость", icon: "🚗" },
              { id: "data", name: "Данные", icon: "💾" },
              { id: "pressure", name: "Давление", icon: "🌀" },
              { id: "energy", name: "Энергия", icon: "⚡" },
              { id: "power", name: "Мощность", icon: "🔋" },
              { id: "angle", name: "Углы", icon: "📐" },
              { id: "cooking", name: "Кулинария", icon: "🍳" },
              { id: "fuel", name: "Расход топлива", icon: "⛽" },
              { id: "digital", name: "Цифровые", icon: "🖥️" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id as any);
                  // Устанавливаем разумные значения по умолчанию для каждой категории
                  switch(cat.id) {
                    case "length": setFromUnit("meter"); setToUnit("kilometer"); break;
                    case "area": setFromUnit("square_meter"); setToUnit("hectare"); break;
                    case "volume": setFromUnit("liter"); setToUnit("milliliter"); break;
                    case "weight": setFromUnit("kilogram"); setToUnit("gram"); break;
                    case "time": setFromUnit("hour"); setToUnit("minute"); break;
                    case "temperature": setFromUnit("celsius"); setToUnit("fahrenheit"); break;
                    case "speed": setFromUnit("km_per_h"); setToUnit("m_per_s"); break;
                    case "data": setFromUnit("megabyte"); setToUnit("gigabyte"); break;
                    case "pressure": setFromUnit("bar"); setToUnit("psi"); break;
                    case "energy": setFromUnit("joule"); setToUnit("calorie"); break;
                    case "power": setFromUnit("watt"); setToUnit("kilowatt"); break;
                    case "angle": setFromUnit("degree"); setToUnit("radian"); break;
                    case "cooking": setFromUnit("cup"); setToUnit("milliliter_cook"); break;
                    case "fuel": setFromUnit("l_per_100km"); setToUnit("km_per_l"); break;
                    case "digital": setFromUnit("pixel"); setToUnit("point"); break;
                  }
                }}
                style={{
                  padding: '12px',
                  background: category === cat.id 
                    ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                    : COLORS.border,
                  color: category === cat.id ? 'white' : COLORS.text.main,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: category === cat.id ? 'bold' : 'normal',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                <span style={{ fontSize: '12px' }}>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Панель конвертации */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr auto 1fr', 
              gap: '16px',
              alignItems: 'end',
              marginBottom: '16px'
            }}>
              {/* ИЗ */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                  Из:
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  {currentUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Кнопка обмена */}
              <div style={{ alignSelf: 'center' }}>
                <button
                  onClick={swapUnits}
                  style={{
                    padding: '12px',
                    backgroundColor: COLORS.primary,
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '20px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                    e.currentTarget.style.transform = 'rotate(180deg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  🔄
                </button>
              </div>

              {/* В */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                  В:
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: COLORS.border,
                    border: `1px solid #475569`,
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  {currentUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Поле ввода */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                Значение для конвертации:
              </label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid #475569`,
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Введите число"
              />
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginTop: '8px',
                flexWrap: 'wrap'
              }}>
                {[0.1, 1, 10, 100, 1000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInputValue(val.toString())}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: COLORS.background,
                      border: `1px solid ${COLORS.primary}`,
                      borderRadius: '4px',
                      color: COLORS.primary,
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.primary;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.background;
                      e.currentTarget.style.color = COLORS.primary;
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px',
            background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>{getCategoryIcon()}</span>
              <div>
                <div style={{ fontSize: '16px', color: COLORS.text.muted }}>
                  {getCategoryDescription()}
                </div>
                <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
                  {fromUnitData?.name} → {toUnitData?.name}
                </div>
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr auto 1fr', 
              gap: '16px',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', color: COLORS.text.main, fontWeight: 'bold' }}>
                  {formatNumber(parseFloat(inputValue) || 0)}
                </div>
                <div style={{ fontSize: '14px', color: COLORS.text.muted }}>
                  {fromUnitData?.symbol}
                </div>
              </div>
              
              <div style={{ fontSize: '20px', color: COLORS.primary }}>→</div>
              
              <div style={{ textAlign: 'left' }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold',
                  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {result !== null ? formatNumber(result) : "—"}
                </div>
                <div style={{ fontSize: '14px', color: COLORS.text.muted }}>
                  {toUnitData?.symbol}
                </div>
              </div>
            </div>
            
            {/* КОЭФФИЦИЕНТ КОНВЕРТАЦИИ */}
            {conversionRate !== null && Math.abs(conversionRate - 1) > 0.000001 && (
              <div style={{ 
                paddingTop: '16px', 
                borderTop: `1px solid ${COLORS.border}`,
                marginTop: '16px'
              }}>
                <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '4px' }}>
                  Коэффициент конвертации:
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}>
                  1 {fromUnitData?.symbol} = {formatNumber(conversionRate)} {toUnitData?.symbol}
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  color: COLORS.secondary,
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  marginTop: '4px'
                }}>
                  1 {toUnitData?.symbol} = {formatNumber(1/conversionRate)} {fromUnitData?.symbol}
                </div>
              </div>
            )}
          </div>

          {/* ИНФОРМАЦИЯ О КАТЕГОРИИ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '16px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px'
          }}>
            <div style={{ 
              color: COLORS.primary, 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              textAlign: 'center'
            }}>
              ℹ️ О категории "{category === "length" ? "Длина" : 
                              category === "area" ? "Площадь" :
                              category === "volume" ? "Объём" :
                              category === "weight" ? "Вес" :
                              category === "time" ? "Время" :
                              category === "temperature" ? "Температура" :
                              category === "speed" ? "Скорость" :
                              category === "data" ? "Данные" :
                              category === "pressure" ? "Давление" :
                              category === "energy" ? "Энергия" :
                              category === "power" ? "Мощность" :
                              category === "angle" ? "Углы" :
                              category === "cooking" ? "Кулинария" :
                              category === "fuel" ? "Расход топлива" :
                              "Цифровые единицы"}"
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '12px'
            }}>
              {currentUnits.slice(0, 6).map(unit => (
                <div
                  key={unit.id}
                  style={{
                    padding: '10px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    color: COLORS.text.main,
                    fontSize: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {unit.symbol}
                  </div>
                  <div style={{ fontSize: '11px', color: COLORS.text.muted }}>
                    {unit.name}
                  </div>
                </div>
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
            fontSize: '24px', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🌐</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Универсальный конвертер единиц
            </span>
          </h2>
          <p style={{ color: COLORS.text.main, marginBottom: '16px' }}>
            Этот конвертер объединяет 15+ категорий измерений с самыми используемыми единицами.
            От повседневных конвертаций длины и веса до специализированных расчётов давления,
            энергии и цифровых единиц — всё в одном инструменте.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                📊 Популярные категории
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '6px' }}>• <strong>Длина и расстояние:</strong> метры, километры, мили, футы</p>
                <p style={{ marginBottom: '6px' }}>• <strong>Вес и масса:</strong> килограммы, граммы, фунты, унции</p>
                <p style={{ marginBottom: '6px' }}>• <strong>Объём и ёмкость:</strong> литры, миллилитры, галлоны</p>
                <p style={{ marginBottom: '6px' }}>• <strong>Время:</strong> часы, минуты, дни, недели</p>
                <p>• <strong>Температура:</strong> Цельсий, Фаренгейт, Кельвин</p>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🔧 Специализированные категории
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '6px' }}>• <strong>Технические:</strong> давление, энергия, мощность</p>
                <p style={{ marginBottom: '6px' }}>• <strong>Цифровые:</strong> байты, биты, пиксели, пункты</p>
                <p style={{ marginBottom: '6px' }}>• <strong>Транспорт:</strong> скорость, расход топлива</p>
                <p style={{ marginBottom: '6px' }}>• <strong>Кулинария:</strong> чайные/столовые ложки, чашки</p>
                <p>• <strong>Геометрия:</strong> углы, площади, объёмы</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '12px',
            color: COLORS.primary 
          }}>
            Практическое применение
          </h3>
          <ul style={{ color: COLORS.text.main, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Путешествия:</strong> конвертация валют не нужна, но мили в километры и Фаренгейт в Цельсий — обязательно
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Кулинария:</strong> американские рецепты (чашки) в метрические (граммы и миллилитры)
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Строительство и ремонт:</strong> дюймы в сантиметры, квадратные футы в квадратные метры
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Фитнес и здоровье:</strong> калории в джоули, фунты в килограммы
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Техника и автомобили:</strong> лошадиные силы в киловатты, расход топлива в разных системах
            </li>
            <li>
              • <strong>Учёба и работа:</strong> конвертация любых единиц для проектов и расчётов
            </li>
          </ul>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(59, 130, 246, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Совет:</strong> Используйте кнопку обмена (↻) между полями "Из" и "В" для быстрой 
              обратной конвертации. Коэффициенты конвертации отображаются в обе стороны для вашего удобства.
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
            Универсальный конвертер единиц • 15+ категорий • Основные единицы измерений • {new Date().getFullYear()} год
          </p>
          <p style={{ marginTop: '8px' }}>
            Все коэффициенты конвертации проверены. Для научных расчётов высокой точности 
            используйте специализированные инструменты.
          </p>
        </div>
      </div>
    </div>
  );
}