"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Cog, Thermometer, Calculator } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

// Состояние для калькулятора возраста
  const [birthDate, setBirthDate] = useState('');
  const [ageInDays, setAgeInDays] = useState<number | null>(null);

  // Состояние для калькулятора цемента
  const [cementArea, setCementArea] = useState('');
  const [cementThickness, setCementThickness] = useState('');
  const [bagsResult, setBagsResult] = useState<number | null>(null);

  // Состояние для калькулятора солнечных панелей
  // Стало:
const [energyConsumption, setEnergyConsumption] = useState('');
const [panelPower, setPanelPower] = useState('');
const [sunHours, setSunHours] = useState('');
  const [solarResult, setSolarResult] = useState<{
    panelsNeeded: number;
    totalPower: number;
    monthlyGeneration: number;
    coveragePercent: number;
    approximateCost: number;
  } | null>(null);

// Добавляем состояние для генератора случайных чисел
const [minValue, setMinValue] = useState('');
const [maxValue, setMaxValue] = useState('');
const [count, setCount] = useState('');
const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

// Состояние для генератора паролей
const [passwordLength, setPasswordLength] = useState('');
const [useUppercase, setUseUppercase] = useState(true);
const [useLowercase, setUseLowercase] = useState(true);
const [useNumbers, setUseNumbers] = useState(true);
const [useSymbols, setUseSymbols] = useState(false);
const [generatedPassword, setGeneratedPassword] = useState('');

// Состояние для калькулятора ИМТ
const [height, setHeight] = useState(''); // Рост в см
const [weight, setWeight] = useState(''); // Вес в кг
const [bmiResult, setBmiResult] = useState<number | null>(null); // Числовой результат
const [bmiCategory, setBmiCategory] = useState(''); // Категория (норма и т.д.)

// Состояние для конвертера валют
const [amount, setAmount] = useState('');
const [fromCurrency, setFromCurrency] = useState('USD');
const [toCurrency, setToCurrency] = useState('RUB');
const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
const [exchangeRates, setExchangeRates] = useState({ USD: 0, EUR: 0, CNY: 0 });
const [isLoadingRates, setIsLoadingRates] = useState(false);

// Состояние для калькулятора плитки/ламината
const [roomArea, setRoomArea] = useState(''); // Площадь комнаты в м²
const [tileWidth, setTileWidth] = useState(''); // Ширина плитки в см
const [tileHeight, setTileHeight] = useState(''); // Длина плитки в см
const [tilesPerBox, setTilesPerBox] = useState(''); // Штук в упаковке
const [tileResult, setTileResult] = useState<{
  tilesNeeded: number;
  boxesNeeded: number;
  totalArea: number;
} | null>(null);

// Состояние для калькулятора молярной массы
const [formula, setFormula] = useState(''); // Например: H2O, C6H12O6
const [molarMass, setMolarMass] = useState<number | null>(null);
const [error, setError] = useState('');

// Словарь атомных масс для основных элементов (г/моль)
const atomicMasses: Record<string, number> = {
  // Основные элементы
  'H': 1.01,    // Водород
  'C': 12.01,   // Углерод
  'O': 16.00,   // Кислород
  'N': 14.01,   // Азот
  'S': 32.07,   // Сера
  'P': 30.97,   // Фосфор
  'Cl': 35.45,  // Хлор
  'Br': 79.90,  // Бром
  'I': 126.90,  // Йод
  
  // Металлы
  'Na': 22.99,  // Натрий
  'K': 39.10,   // Калий
  'Mg': 24.31,  // Магний
  'Ca': 40.08,  // Кальций
  'Fe': 55.85,  // Железо
  'Zn': 65.38,  // Цинк
  'Cu': 63.55,  // Медь
  'Al': 26.98,  // Алюминий
  'Ag': 107.87, // Серебро
  'Au': 196.97, // Золото
  
  // Другие важные
  'F': 19.00,   // Фтор
  'Si': 28.09,  // Кремний
  'He': 4.00,   // Гелий
  'Ne': 20.18,  // Неон
  'Ar': 39.95,  // Аргон
};

// Состояние для цветовой гаммы
const [baseColor, setBaseColor] = useState('#3B82F6'); // Начальный цвет - синий Tailwind
const [complementaryColor, setComplementaryColor] = useState('#FF6B35'); // Его дополнение
const [hue, setHue] = useState(210); // Оттенок в градусах (0-360)
const [copiedColor, setCopiedColor] = useState('');

// Состояние для калькулятора цикла
const [lastPeriodDate, setLastPeriodDate] = useState('');
const [cycleLength, setCycleLength] = useState('28');
const [cycleResults, setCycleResults] = useState<{
  nextPeriod: string;
  nextAfterNext: string;
  ovulation: string;
  fertileStart: string;
  fertileEnd: string;
} | null>(null);

// Конвертер лошадиных сил (обновленная версия)
const [hpValue, setHpValue] = useState('');
const [hpFrom, setHpFrom] = useState('metric'); // Из какой единицы
const [hpTo, setHpTo] = useState('watts'); // В какую единицу
const [hpResult, setHpResult] = useState<number | null>(null);
const [showHpResult, setShowHpResult] = useState(false);


  const categories = [
    { title: "Механика", icon: <Cog className="w-6 h-6 text-blue-400" />, description: "Расчёты балки, момент инерции, прочность материалов.", link: "/mechanics" },
    { title: "Электротехника", icon: <Zap className="w-6 h-6 text-yellow-400" />, description: "Закон Ома, сопротивление, конденсаторы, делители напряжения.", link: "/electrotech" },
    { title: "Теплотехника", icon: <Thermometer className="w-6 h-6 text-orange-400" />, description: "Теплопередача, потери энергии, тепловые балансы.", link: "/teplotekhnika" },
    { title: "Прочее", icon: <Calculator className="w-6 h-6 text-green-400" />, description: "Расчет НДС, конвертер единиц, ипотечный калькулятор и др.", link: "/prochee" },
  ];

    // Функция расчета возраста в днях
  const calculateAgeInDays = () => {
    if (!birthDate) return;
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    // Разница в миллисекундах
    const diffMs = today.getTime() - birth.getTime();
    // Конвертация в дни
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    setAgeInDays(diffDays);
  };

  // Сброс
  const resetAgeCalculator = () => {
    setBirthDate('');
    setAgeInDays(null);
  };

  // Функция расчета мешков цемента
  const calculateCementBags = () => {
    const area = parseFloat(cementArea) || 0;
    const thickness = parseFloat(cementThickness) || 0;
    
    if (area <= 0 || thickness <= 0) {
      setBagsResult(null);
      return;
    }
    
    // Формула: площадь (м²) × толщина (м) × плотность (2000 кг/м³) ÷ 25 кг/мешок
    const volume = area * (thickness / 1000); // толщина в мм → метры
    const weight = volume * 2000; // кг
    const bags = Math.ceil(weight / 25); // округляем вверх
    
    setBagsResult(bags);
  };

  // Сброс
  const resetCementCalculator = () => {
    setCementArea('');
    setCementThickness('');
    setBagsResult(null);
  };

  // Функция расчета солнечных панелей
  const calculateSolarPanels = () => {
    const consumption = parseFloat(energyConsumption) || 0;
    const power = parseFloat(panelPower) || 0;
    const hours = parseFloat(sunHours) || 0;
    
    if (consumption <= 0 || power <= 0 || hours <= 0) {
      setSolarResult(null);
      return;
    }
    
    // Расчет:
    // 1. Сколько нужно энергии в день (кВт·ч)
    const dailyNeeded = consumption / 30;
    
    // 2. Сколько одна панель генерирует в день (кВт·ч)
    const panelDailyGen = (power * hours) / 1000;
    
    // 3. Сколько панелей нужно
    const panelsNeeded = Math.ceil(dailyNeeded / panelDailyGen);
    
    // 4. Общая мощность (кВт)
    const totalPower = (panelsNeeded * power) / 1000;
    
    // 5. Генерация в месяц (кВт·ч)
    const monthlyGeneration = panelsNeeded * panelDailyGen * 30;
    
    // 6. Процент покрытия потребления
    const coveragePercent = Math.min(100, (monthlyGeneration / consumption) * 100);
    
    // 7. Примерная стоимость (40 000 руб за 1 кВт)
    const approximateCost = Math.round(totalPower * 40000);
    
    setSolarResult({
      panelsNeeded,
      totalPower,
      monthlyGeneration,
      coveragePercent,
      approximateCost
    });
  };

 // Сброс (пустые поля)
const resetSolarCalculator = () => {
  setEnergyConsumption('');  // ← Пусто вместо '300'
  setPanelPower('');        // ← Пусто вместо '400'
  setSunHours('');          // ← Пусто вместо '4'
  setSolarResult(null);
};

// Функция генерации случайных чисел
const generateRandomNumbers = () => {
  const min = parseInt(minValue) || 1;
  const max = parseInt(maxValue) || 100;
  const numCount = Math.min(6, Math.max(1, parseInt(count) || 3));
  
  if (min >= max) {
    // Если минимум больше или равен максимуму, меняем местами
    const temp = min;
    setMinValue(max.toString());
    setMaxValue(temp.toString());
    return;
  }
  
  const numbers: number[] = [];
  for (let i = 0; i < numCount; i++) {
    numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  
  setRandomNumbers(numbers);
};

// Функция сброса
const resetRandomGenerator = () => {
  setMinValue('');
  setMaxValue('');
  setCount('');
  setRandomNumbers([]);
};

// Функция генерации пароля
const generatePassword = () => {
  const length = parseInt(passwordLength) || 12;
  
  // Наборы символов
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Собираем доступные символы
  let chars = '';
  if (useUppercase) chars += uppercase;
  if (useLowercase) chars += lowercase;
  if (useNumbers) chars += numbers;
  if (useSymbols) chars += symbols;
  
  // Если ничего не выбрано, используем буквы и цифры
  if (!chars) {
    chars = uppercase + lowercase + numbers;
    setUseUppercase(true);
    setUseLowercase(true);
    setUseNumbers(true);
  }
  
  // Генерация пароля
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  setGeneratedPassword(password);
};

const resetPasswordGenerator = () => {
  setPasswordLength(''); // ← вот проблема!
  setUseUppercase(true);
  setUseLowercase(true);
  setUseNumbers(true);
  setUseSymbols(false);
  setGeneratedPassword('');
};

// Функция оценки сложности пароля
const getPasswordStrength = (pass: string) => {
  if (!pass) return { text: '', color: 'gray' };
  
  const length = pass.length;
  
  // Простая проверка без сложных regex
  const hasUpper = pass !== pass.toLowerCase();
  const hasLower = pass !== pass.toUpperCase();
  const hasNumbers = /\d/.test(pass);
  const hasSymbols = /[^A-Za-z0-9]/.test(pass);
  
  let types = 0;
  if (hasUpper) types++;
  if (hasLower) types++;
  if (hasNumbers) types++;
  if (hasSymbols) types++;
  
  // Определяем сложность
  if (length < 8 || types === 1) {
    return { text: 'Слабый', color: 'text-red-400' };
  } else if (length < 12 || types <= 2) {
    return { text: 'Средний', color: 'text-yellow-400' };
  } else {
    return { text: 'Сильный', color: 'text-green-400' };
  }
};

// Функция копирования пароля
const copyToClipboard = () => {
  if (!generatedPassword) return;
  
  navigator.clipboard.writeText(generatedPassword)
    .then(() => {
      // Можно добавить уведомление, но пока просто копируем
      alert('Пароль скопирован!');
    })
    .catch(err => {
      console.error('Ошибка копирования:', err);
    });
};

const calculateBMI = () => {
  // Преобразуем пустые строки в 0 для проверки
  const h = parseFloat(height) || 0;
  const w = parseFloat(weight) || 0;

  if (h > 0 && w > 0) {
    const bmi = w / ((h/100) * (h/100)); // Учли перевод см в метры
    const roundedBmi = Math.round(bmi * 10) / 10;

    setBmiResult(roundedBmi);

    if (bmi < 18.5) setBmiCategory('Дефицит массы');
    else if (bmi < 25) setBmiCategory('Норма');
    else if (bmi < 30) setBmiCategory('Избыточный вес');
    else setBmiCategory('Ожирение');
  }
};

// Функция сброса
const resetBMICalculator = () => {
  setHeight('');
  setWeight('');
  setBmiResult(null);
  setBmiCategory('');
};

// Функция загрузки курсов с CBR-XML-Daily.Ru
const fetchExchangeRates = async () => {
  setIsLoadingRates(true);
  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();
    
    // Извлекаем курсы USD и EUR к рублю
    setExchangeRates({
      USD: data.Valute.USD.Value,
      EUR: data.Valute.EUR.Value,
      CNY: data.Valute.CNY.Value, 
    });
  } catch (error) {
    console.error('Ошибка при загрузке курсов валют:', error);
    // Можно задать курсы по умолчанию на случай ошибки
    setExchangeRates({ USD: 90.0, EUR: 98.0, CNY: 12.5 });
  } finally {
    setIsLoadingRates(false);
  }
};

// Загружаем курсы при первом рендере компонента
useEffect(() => {
  fetchExchangeRates();
}, []);

// Функция конвертации валют
const convertCurrency = () => {
  const value = parseFloat(amount);
  if (!value || value <= 0) {
    setConvertedAmount(null);
    return;
  }

  // Все расчеты ведутся через рубли
  const ratesInRub = {
    RUB: 1,
    USD: exchangeRates.USD,
    EUR: exchangeRates.EUR,
    CNY: exchangeRates.CNY,
  };

  // Конвертируем: Сумма -> Рубли -> Целевая валюта
  const amountInRubles = value * ratesInRub[fromCurrency as keyof typeof ratesInRub];
  const result = amountInRubles / ratesInRub[toCurrency as keyof typeof ratesInRub];
  
  setConvertedAmount(Number(result.toFixed(2)));
};

// Функция сброса конвертера
const resetCurrencyConverter = () => {
  setAmount('');
  setFromCurrency('USD');
  setToCurrency('RUB');
  setConvertedAmount(null);
};

// Функция расчета плитки/ламината
const calculateTiles = () => {
  const area = parseFloat(roomArea) || 0;
  const width = parseFloat(tileWidth) || 0;
  const height = parseFloat(tileHeight) || 0;
  const perBox = parseInt(tilesPerBox) || 0;

  if (area > 0 && width > 0 && height > 0 && perBox > 0) {
    // Площадь одной плитки в м² (см → м)
    const tileArea = (width / 100) * (height / 100);
    
    // Нужное количество плиток (площадь комнаты / площадь плитки + запас 10%)
    const tilesNeeded = Math.ceil(area / tileArea * 1.1);
    
    // Количество упаковок
    const boxesNeeded = Math.ceil(tilesNeeded / perBox);
    
    // Общая площадь покрытия (для проверки)
    const totalArea = tilesNeeded * tileArea;

    setTileResult({
      tilesNeeded,
      boxesNeeded,
      totalArea: Number(totalArea.toFixed(2))
    });
  }
};

// Функция сброса
const resetTileCalculator = () => {
  setRoomArea('');
  setTileWidth('');
  setTileHeight('');
  setTilesPerBox('');
  setTileResult(null);
};

// Функция расчета молярной массы
const calculateMolarMass = () => {
  setError('');
  setMolarMass(null);
  
  if (!formula.trim()) return;
  
  let totalMass = 0;
  let i = 0;
  const input = formula.trim();
  
  try {
    while (i < input.length) {
      // 1. Определяем символ элемента (одна или две буквы)
      let element = '';
      if (i < input.length && /[A-Z]/.test(input[i])) {
        element = input[i];
        i++;
        if (i < input.length && /[a-z]/.test(input[i])) {
          element += input[i];
          i++;
        }
         element = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
      } else {
        setError('Некорректная формула. Начните с заглавной буквы элемента.');
        return;
      }
      
      // 2. Проверяем, есть ли элемент в словаре
      if (!atomicMasses[element]) {
        setError(`Элемент "${element}" не найден в базе.`);
        return;
      }
      
      // 3. Определяем количество атомов (если есть цифры)
      let count = 1;
      let numStr = '';
      while (i < input.length && /[0-9]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      if (numStr) {
        count = parseInt(numStr, 10);
      }
      
      // 4. Добавляем массу элемента * количество
      totalMass += atomicMasses[element] * count;
    }
    
    if (totalMass > 0) {
      setMolarMass(Number(totalMass.toFixed(2)));
    } else {
      setError('Не удалось рассчитать массу.');
    }
  } catch (err) {
    setError('Ошибка при разборе формулы. Примеры: H2O, CO2, NaCl');
  }
};

// Функция сброса
const resetMolarMassCalculator = () => {
  setFormula('');
  setMolarMass(null);
  setError('');
};

// Функция расчета дополнительного цвета
const calculateComplementary = (colorHex: string) => {
  // Преобразуем HEX в HSL
const hexToHsl = (hex: string):number => {
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
      return 0; // Возвращаем 0 при неверном формате
    }
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    
    if (max !== min) {
      if (max === r) h = (g - b) / (max - min);
      else if (max === g) h = 2 + (b - r) / (max - min);
      else h = 4 + (r - g) / (max - min);
      
      h *= 60;
      if (h < 0) h += 360;
    }
    
    return Math.round(h);
  };
  
  // Преобразуем HSL в HEX
  const hslToHex = (h:number): string=> {
    h = h % 360;
    if (h < 0) h += 360;
    
    // Фиксированные насыщенность и яркость для чистых цветов
    const s = 70;
    const l = 60;
    
    const c = (1 - Math.abs(2 * l/100 - 1)) * s/100;
    const x = c * (1 - Math.abs((h/60) % 2 - 1));
    const m = l/100 - c/2;
    
    let r, g, b;
    
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    const rgbToHex = (val: number): string => {
      const hex = Math.round((val + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${rgbToHex(r)}${rgbToHex(g)}${rgbToHex(b)}`.toUpperCase();
  };
  
  const baseHue = hexToHsl(colorHex);
  const compHue = (baseHue + 180) % 360;
  
  setHue(baseHue);
  setComplementaryColor(hslToHex(compHue));
};

// Обработчик изменения цвета
const handleColorChange = (color: string) => {
  setBaseColor(color);
  calculateComplementary(color);
};

// Функция копирования цвета
const copyColorToClipboard = (color: string) => {
  navigator.clipboard.writeText(color);
  setCopiedColor(color);
  setTimeout(() => setCopiedColor(''), 1500);
};

// Функция сброса
const resetColorCalculator = () => {
  setBaseColor('#3B82F6');
  setComplementaryColor('#FF6B35');
  setHue(210);
  setCopiedColor('');
};

// Инициализация при загрузке
useEffect(() => {
  calculateComplementary(baseColor);
}, []);

// Функция расчета цикла
const calculateCycle = () => {
  if (!lastPeriodDate) return;
  
  const lastDate = new Date(lastPeriodDate);
  const length = parseInt(cycleLength) || 28;
  
  // Проверка на корректность длины цикла
  if (length < 21 || length > 35) {
    alert('Длина цикла обычно составляет 21-35 дней. Проверьте ввод.');
    return;
  }
  
  // Даты следующих месячных
  const nextPeriod = new Date(lastDate);
  nextPeriod.setDate(nextPeriod.getDate() + length);
  
  const nextAfterNext = new Date(nextPeriod);
  nextAfterNext.setDate(nextAfterNext.getDate() + length);
  
  // Овуляция (за 14 дней до следующих месячных)
  const ovulation = new Date(nextPeriod);
  ovulation.setDate(ovulation.getDate() - 14);
  
  // Окно фертильности (5 дней до овуляции + день овуляции)
  const fertileStart = new Date(ovulation);
  fertileStart.setDate(fertileStart.getDate() - 5);
  const fertileEnd = new Date(ovulation);
  
  setCycleResults({
    nextPeriod: nextPeriod.toLocaleDateString('ru-RU'),
    nextAfterNext: nextAfterNext.toLocaleDateString('ru-RU'),
    ovulation: ovulation.toLocaleDateString('ru-RU'),
    fertileStart: fertileStart.toLocaleDateString('ru-RU'),
    fertileEnd: fertileEnd.toLocaleDateString('ru-RU'),
  });
};

// Функция сброса
const resetCycleCalculator = () => {
  setLastPeriodDate('');
  setCycleLength('28');
  setCycleResults(null);
};

// Функция сброса
const resetHorsepowerCalculator = () => {
  setHpValue('');
  setHpFrom('metric');
  setHpTo('watts');
  setHpResult(null);
  setShowHpResult(false); // Возвращаем к форме
};

// Функция для получения названия единицы
const getUnitName = (unit: string): string => {
  switch(unit) {
    case 'metric': return 'Метрические л.с.';
    case 'mechanical': return 'Механические л.с.';
    case 'electric': return 'Электрические л.с.';
    case 'watts': return 'Ватты (Вт)';
    case 'kilowatts': return 'Киловатты (кВт)';
    default: return '';
  }
};

// Функция для получения символа единицы
const getUnitSymbol = (unit: string): string => {
  switch(unit) {
    case 'metric': return 'л.с. (PS)';
    case 'mechanical': return 'л.с. (hp)';
    case 'electric': return 'л.с. (эл.)';
    case 'watts': return 'Вт';
    case 'kilowatts': return 'кВт';
    default: return '';
  }
};

const convertHorsepower = () => {
  if (!hpValue) return;
  
  const value = parseFloat(hpValue);
  if (isNaN(value)) return;
  
  const toWatts: Record<string, number> = {
    metric: 735.49875,
    mechanical: 745.699872,
    electric: 746.0,
    watts: 1,
    kilowatts: 1000
  };
  
  const watts = value * toWatts[hpFrom];
  const result = watts / toWatts[hpTo];
  
  setHpResult(Number(result.toFixed(2)));
  setShowHpResult(true); // Показываем результат
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-6">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold tracking-wide text-white drop-shadow-md">⚙️ Calcoria</h1>
        <p className="text-gray-400 mt-2 text-lg">Центр инженерных расчетов и не только</p>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto px-4 md:px-6">
  {categories.map((cat) => (
    <div
      key={cat.title}
      onClick={() => router.push(cat.link)}
      className="bg-gray-800 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02] transition duration-300 rounded-2xl cursor-pointer p-4 flex flex-col h-full"
    >
      <div className="flex items-center space-x-2 border-b border-gray-700 pb-2">
        {cat.icon}
        <h2 className="text-xl text-white">{cat.title}</h2>
      </div>
      <div className="flex-1">
        <p className="text-gray-400 text-sm mt-4">{cat.description}</p>
      </div>
    </div>
  ))}
</main>

                  {/* Мини-калькуляторы для главной */}
      <div className="max-w-6xl mx-auto mt-20"> {/* ← Увеличил отступ mt-20 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
                    {/* МЕШКИ ЦЕМЕНТА */}
          <div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-600/20 rounded-lg">
                <span className="text-green-400 font-bold text-sm">🏗️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Мешки цемента</h3>
                <p className="text-gray-400 text-xs">Расход для стяжки</p>
              </div>
              {(cementArea || cementThickness || bagsResult !== null) && (
                <button 
                  onClick={resetCementCalculator}
                  className="p-1 rounded-full bg-gray-700 hover:bg-green-500/20 transition duration-200 group"
                  title="Сбросить"
                >
                  <svg 
                    className="w-4 h-4 text-gray-400 group-hover:text-green-400 group-hover:rotate-180 transition-transform duration-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
            
            {bagsResult !== null ? (
              /* РЕЗУЛЬТАТ */
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-xs text-gray-400 mb-1 text-center">Потребуется</p>
                <p className="text-2xl font-bold text-green-400">{bagsResult}</p>
                <p className="text-xs text-gray-500 mt-1">мешков по 25 кг</p>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {cementArea} м² × {cementThickness} мм
                </p>
              </div>
            ) : (
              /* ПОЛЯ ВВОДА */
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <input 
                    type="number" 
                    value={cementArea}
                    onChange={(e) => setCementArea(e.target.value)}
                    className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
                    placeholder="Площадь (м²)"
                    min="0.1"
                    step="0.1"
                  />
                  <input 
                    type="number" 
                    value={cementThickness}
                    onChange={(e) => setCementThickness(e.target.value)}
                    className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
                    placeholder="Толщина (мм)"
                    min="10"
                    step="5"
                  />
                </div>
                <button 
                  onClick={calculateCementBags}
                  disabled={!cementArea || !cementThickness}
                  className={`w-full p-2 text-sm rounded font-medium transition ${cementArea && cementThickness ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
                >
                  {cementArea && cementThickness ? 'Рассчитать' : 'Введите данные'}
                </button>
              </div>
            )}
          </div>
          
                                       {/* СОЛНЕЧНЫЕ ПАНЕЛИ */}
          <div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-yellow-600/20 rounded-lg">
                <span className="text-yellow-400 font-bold text-sm">☀️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Солнечные панели</h3>
                <p className="text-gray-400 text-xs">Расчёт для дома</p>
              </div>
              {(energyConsumption || panelPower || sunHours || solarResult !== null) && (
                <button 
                  onClick={resetSolarCalculator}
                  className="p-1 rounded-full bg-gray-700 hover:bg-yellow-500/20 transition duration-200 group"
                  title="Сбросить"
                >
                  <svg 
                    className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 group-hover:rotate-180 transition-transform duration-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
            
            {solarResult !== null ? (
              /* РЕЗУЛЬТАТ (как в мешках цемента) */
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-xs text-gray-400 mb-2 text-center">Нужно панелей</p>
                <p className="text-3xl font-bold text-yellow-400">{solarResult.panelsNeeded}</p>
                <p className="text-xs text-gray-500 mt-1">шт × {panelPower} Вт</p>
                <p className="text-xs text-gray-400 mt-3">
                  {solarResult.totalPower.toFixed(1)} кВт • {solarResult.coveragePercent.toFixed(0)}% покрытия
                </p>
              </div>
            ) : (
              /* ПОЛЯ ВВОДА */
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <input 
                    type="number" 
                    value={energyConsumption}
                    onChange={(e) => setEnergyConsumption(e.target.value)}
                    className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
                    placeholder="Потребление (кВт·ч/месяц)"
                    min="50"
                    step="10"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      value={panelPower}
                      onChange={(e) => setPanelPower(e.target.value)}
                      className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
                      placeholder="Мощн.(Вт)"
                      min="100"
                      step="50"
                    />
                    <input 
                      type="number" 
                      value={sunHours}
                      onChange={(e) => setSunHours(e.target.value)}
                      className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
                      placeholder="Солнца в день (ч)"
                      min="1"
                      max="10"
                      step="0.5"
                    />
                  </div>
                </div>
                <button 
                  onClick={calculateSolarPanels}
                  disabled={!energyConsumption || !panelPower || !sunHours}
                  className={`w-full p-2 text-sm rounded font-medium transition ${energyConsumption && panelPower && sunHours ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
                >
                  Рассчитать
                </button>
              </div>
            )}
          </div>
          
                                        {/* ВОЗРАСТ В ДНЯХ */}
          <div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col"> {/* ← h-[240px] и flex-col */}
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-600/20 rounded-lg">
                <span className="text-blue-400 font-bold text-sm">📅</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Возраст в днях</h3>
                <p className="text-gray-400 text-xs">Сколько дней вы прожили</p>
              </div>
              {(birthDate || ageInDays !== null) && (
                <button 
                  onClick={resetAgeCalculator}
                  className="p-1 rounded-full bg-gray-700 hover:bg-blue-500/20 transition duration-200 group"
                  title="Сбросить"
                >
                  <svg 
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:rotate-180 transition-transform duration-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="flex-1 space-y-3"> {/* ← flex-1 занимает оставшееся место */}
              <div>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <button 
                onClick={calculateAgeInDays}
                disabled={!birthDate}
                className={`w-full p-2 text-sm rounded font-medium transition ${birthDate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed'}`}
              >
                {birthDate ? 'Посчитать дни' : 'Введите дату'}
              </button>
              
              {ageInDays !== null && (
                <div className="p-2 bg-gray-900 rounded-lg text-center overflow-hidden"> {/* ← overflow-hidden */}
                  <p className="text-xs text-gray-400">Вы прожили</p>
                  <p className="text-lg font-bold text-blue-400 truncate">{ageInDays.toLocaleString('ru-RU')}</p>
                  <p className="text-xs text-gray-500">дней</p>
                </div>
              )}
            </div>
          </div>
          
             {/*Генератор случайных чисел:*/}
<div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-purple-600/20 rounded-lg">
      <span className="text-purple-400 font-bold text-sm">🎲</span>
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-white">Случайные числа</h3>
      <p className="text-gray-400 text-xs">Генератор целых чисел</p>
    </div>
    {(minValue.trim() !== '' || maxValue.trim() !== '' || count.trim() !== '' || randomNumbers.length > 0) && ( 
      <button 
        onClick={resetRandomGenerator}
        className="p-1 rounded-full bg-gray-700 hover:bg-purple-500/20 transition duration-200 group"
        title="Сбросить"
      >
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-purple-400 group-hover:rotate-180 transition-transform duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )}
  </div>
  
  {randomNumbers.length > 0 ? (
  /* РЕЗУЛЬТАТ - список чисел */
  <div className="flex-1 flex flex-col">
    <div className="mb-2">
      <p className="text-xs text-gray-400 text-center">
        {minValue} → {maxValue} • {count} чисел
      </p>
    </div>
    <div className="flex-1 overflow-y-auto">
      {/* НОВАЯ СЕТКА БЕЗ ФОНА */}
      <div className="grid grid-cols-3 gap-1">
        {randomNumbers.map((num, index) => (
          <div 
            key={index} 
            className="rounded p-1 text-center"
          >
            <p className="text-sm font-bold text-purple-400">{num}</p>
            <p className="text-[10px] text-gray-500">#{index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
) : ( 

    /* ПОЛЯ ВВОДА */
    <div className="flex-1 space-y-3">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="number"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
            placeholder="От"
            min="-9999"
            max="9999"
          />
          <input 
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
            placeholder="До"
            min="-9999"
            max="9999"
          />
        </div>
        <input 
          type="number"
          value={count}
          onChange={(e) => {
            const val = Math.min(6, Math.max(1, parseInt(e.target.value) || 1));
            setCount(val.toString());
          }}
          className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
          placeholder="Количество (1-6)"
          min="1"
          max="6"
        />
      </div>
      <button 
        onClick={generateRandomNumbers}
        disabled={!minValue || !maxValue || !count}
        className={`w-full p-2 text-sm rounded font-medium transition ${minValue && maxValue && count ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
      >
        Сгенерировать
      </button>
    </div>
   )} 
</div>    

{/* ГЕНЕРАТОР ПАРОЛЕЙ - 5-я карточка */}
<div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-cyan-600/20 rounded-lg">
      <span className="text-cyan-400 font-bold text-sm">🔒</span>
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-white">Генератор паролей</h3>
      <p className="text-gray-400 text-xs">Безопасные пароли</p>
    </div>
    {(passwordLength || generatedPassword) && ( 
      <button 
        onClick={resetPasswordGenerator}
        className="p-1 rounded-full bg-gray-700 hover:bg-cyan-500/20 transition duration-200 group"
        title="Сбросить"
      >
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-transform duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )}
  </div>
  
  {generatedPassword ? (
    /* РЕЗУЛЬТАТ - пароль */
    <div className="flex-1 flex flex-col">
      <div className="mb-2">
        <p className="text-xs text-gray-400 text-center">Сгенерированный пароль</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-gray-900 rounded-lg p-3 w-full text-center mb-2">
          <p className="text-lg font-mono text-cyan-400 break-all">{generatedPassword}</p>
        </div>
        <div className="flex gap-2 w-full">
          <button 
            onClick={copyToClipboard}
            className="flex-1 p-2 text-sm bg-cyan-600 hover:bg-cyan-700 rounded font-medium"
          >
            Копировать
          </button>
          <button 
            onClick={generatePassword}
            className="flex-1 p-2 text-sm bg-gray-700 hover:bg-gray-600 rounded font-medium"
          >
            Ещё
          </button>
        </div>
      </div>
    </div>
  ) : (
    /* НАСТРОЙКИ */
    <div className="flex-1 space-y-3">
      <div className="space-y-2">
        <input 
  type="text"
  inputMode="numeric"
  value={passwordLength}
  onChange={(e) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      const num = val === '' ? '' : Math.min(32, Math.max(4, parseInt(val) || 4));
      setPasswordLength(num.toString());
    }
  }}
  className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
  placeholder="Длина пароля (4-32)"
/>
        
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-300">A-Z</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={useLowercase}
              onChange={(e) => setUseLowercase(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-300">a-z</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-300">0-9</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-300">!@#$%</span>
          </label>
        </div>
      </div>
      
      <button 
        onClick={generatePassword}
        disabled={!useUppercase && !useLowercase && !useNumbers && !useSymbols}
        className={`w-full p-2 text-sm rounded font-medium transition ${(useUppercase || useLowercase || useNumbers || useSymbols) ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
      >
        Сгенерировать пароль
      </button>
    </div>
  )}
</div>

{/* КАЛЬКУЛЯТОР ИМТ - ФИКСИРОВАННЫЙ РАЗМЕР */}
<div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-pink-600/20 rounded-lg">
      <span className="text-pink-400 font-bold text-sm">⚖️</span>
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-white">Индекс массы тела</h3>
      <p className="text-gray-400 text-xs">Калькулятор ИМТ</p>
    </div>
    {(height || weight || bmiResult !== null) && (
      <button 
        onClick={resetBMICalculator}
        className="p-1 rounded-full bg-gray-700 hover:bg-pink-500/20 transition duration-200 group"
        title="Сбросить"
      >
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-pink-400 group-hover:rotate-180 transition-transform duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )}
  </div>

  {bmiResult !== null ? (
    /* КОМПАКТНЫЙ РЕЗУЛЬТАТ */
    <div className="flex-1 flex flex-col items-center justify-center p-2">
      {/* Шкала */}
      <div className="w-full mb-3">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Дефицит</span>
          <span>Норма</span>
          <span>Избыток</span>
        </div>
        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden flex mb-1">
          <div className="h-full bg-blue-500" style={{ width: '18.5%' }}></div>
          <div className="h-full bg-green-500" style={{ width: '24%' }}></div>
          <div className="h-full bg-yellow-500" style={{ width: '20%' }}></div>
          <div className="h-full bg-red-500" style={{ flex: 1 }}></div>
        </div>
        <div className="flex justify-between text-[8px] text-gray-500">
          <span>16</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
      </div>
      
      {/* Результат */}
      <p className="text-xs text-gray-400">Ваш ИМТ</p>
      <p className="text-2xl font-bold text-pink-400 my-1">{bmiResult}</p>
      <p className={`text-xs font-medium ${
        bmiCategory === 'Норма' ? 'text-green-400' :
        bmiCategory === 'Дефицит массы' ? 'text-blue-400' :
        bmiCategory === 'Избыточный вес' ? 'text-yellow-400' : 'text-red-400'
      }`}>
        {bmiCategory}
      </p>
      <p className="text-[10px] text-gray-500 mt-2">{height} см • {weight} кг</p>
    </div>
  ) : (
    /* ИСПРАВЛЕННЫЕ ПОЛЯ ВВОДА */
    <div className="flex-1 space-y-3">
      <div className="space-y-2">
        <input 
          type="text"
          inputMode="decimal"
          value={height}
          onChange={(e) => {
            const val = e.target.value;
            // Разрешаем только цифры и пустую строку
            if (val === '' || /^\d*\.?\d*$/.test(val)) {
              setHeight(val);
            }
          }}
          className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
          placeholder="Рост (см, например: 175)"
        />
        <input 
          type="text"
          inputMode="decimal"
          value={weight}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || /^\d*\.?\d*$/.test(val)) {
              setWeight(val);
            }
          }}
          className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
          placeholder="Вес (кг, например: 70)"
        />
      </div>
      <button 
        onClick={calculateBMI}
        disabled={!height || !weight}
        className={`w-full p-2 text-sm rounded font-medium transition ${height && weight ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
      >
        Рассчитать ИМТ
      </button>
    </div>
  )}
</div>

{/* КОНВЕРТЕР ВАЛЮТ */}
<div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-emerald-600/20 rounded-lg">
      <span className="text-emerald-400 font-bold text-sm">💱</span>
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-white">Конвертер валют</h3>
      <div className="flex items-center gap-2">
        <p className="text-gray-400 text-xs">Актуальные курсы</p>
        {isLoadingRates && (
          <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
    {(amount || convertedAmount !== null) && (
      <button 
        onClick={resetCurrencyConverter}
        className="p-1 rounded-full bg-gray-700 hover:bg-emerald-500/20 transition duration-200 group"
        title="Сбросить"
      >
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 group-hover:rotate-180 transition-transform duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )}
  </div>

  {convertedAmount !== null ? (
    /* РЕЗУЛЬТАТ КОНВЕРТАЦИИ */
    <div className="flex-1 flex flex-col items-center justify-center">
      <p className="text-xs text-gray-400 mb-1 text-center">Результат конвертации</p>
      <p className="text-2xl font-bold text-emerald-400">
        {convertedAmount.toLocaleString('ru-RU')}
      </p>
      <p className="text-sm text-gray-300 mt-1">{toCurrency}</p>
      <p className="text-xs text-gray-500 mt-3 text-center">
        {amount} {fromCurrency} → {convertedAmount} {toCurrency}
      </p>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Курс: 1 {fromCurrency} = {(exchangeRates[fromCurrency as keyof typeof exchangeRates] || 1).toFixed(2)} RUB
      </p>
    </div>
  ) : (
    /* ПОЛЯ ВВОДА И ВЫБОРА ВАЛЮТ */
    <div className="flex-1 space-y-3">
      <div className="space-y-2">
        <input 
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || /^\d*\.?\d*$/.test(val)) {
              setAmount(val);
            }
          }}
          className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
          placeholder="Сумма для конвертации"
        />
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <select 
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600 appearance-none pr-8"
            >
              <option value="USD">USD (Доллар)</option>
              <option value="EUR">EUR (Евро)</option>
              <option value="CNY">CNY (Юань)</option>
              <option value="RUB">RUB (Рубль)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select 
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600 appearance-none pr-8"
            >
              <option value="RUB">RUB (Рубль)</option>
              <option value="USD">USD (Доллар)</option>
              <option value="EUR">EUR (Евро)</option>
              <option value="CNY">CNY (Юань)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={convertCurrency}
        disabled={!amount || isLoadingRates}
        className={`w-full p-2 text-sm rounded font-medium transition ${amount && !isLoadingRates ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
      >
        {isLoadingRates ? 'Загрузка курсов...' : 'Конвертировать'}
      </button>
      
      {!isLoadingRates && exchangeRates.USD > 0 && (
  <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-700">
    <p>Курс ЦБ РФ: USD = {exchangeRates.USD.toFixed(2)}₽, EUR = {exchangeRates.EUR.toFixed(2)}₽,</p>
  </div>
   )}
    </div>
  )}
</div>

{/* РАСЧЕТ ПЛИТКИ/ЛАМИНАТА - КОМПАКТНЫЙ */}
<div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
  <div className="flex items-center gap-2 mb-2">
    <div className="p-1 bg-amber-600/20 rounded-lg">
      <span className="text-amber-400 font-bold text-sm">🧱</span>
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-white">Плитка/Ламинат</h3>
      <p className="text-gray-400 text-xs">Расчёт для комнаты</p>
    </div>
    {(roomArea || tileWidth || tileHeight || tilesPerBox || tileResult !== null) && (
      <button onClick={resetTileCalculator} className="p-1 rounded-full bg-gray-700 hover:bg-amber-500/20 transition" title="Сбросить">
        <svg className="w-4 h-4 text-gray-400 hover:text-amber-400 hover:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )}
  </div>

  {tileResult !== null ? (
    <div className="flex-1 flex flex-col justify-center p-1">
      <div className="text-center mb-2">
        <p className="text-xs text-gray-400">Нужно упаковок</p>
        <p className="text-2xl font-bold text-amber-400">{tileResult.boxesNeeded}</p>
        <p className="text-xs text-gray-500">({tileResult.tilesNeeded} шт.)</p>
      </div>
      <div className="space-y-0.5 text-xs">
        <div className="flex justify-between"><span className="text-gray-400">Площадь:</span><span className="text-gray-300">{roomArea} м²</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Размер:</span><span className="text-gray-300">{tileWidth}×{tileHeight} см</span></div>
        <div className="flex justify-between"><span className="text-gray-400">В упаковке:</span><span className="text-gray-300">{tilesPerBox} шт.</span></div>
      </div>
    </div>
  ) : (
    <div className="flex-1 space-y-2">
      <div className="space-y-1.5">
        <input 
          type="text" inputMode="decimal" value={roomArea} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d*\.?\d*$/.test(val)) setRoomArea(val); }}
          className="w-full p-1.5 text-sm bg-gray-700 rounded text-white border border-gray-600" placeholder="Площадь (м²)"
        />
        <div className="grid grid-cols-2 gap-1.5">
          <input type="text" inputMode="decimal" value={tileWidth} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d*\.?\d*$/.test(val)) setTileWidth(val); }}
            className="w-full p-1.5 text-sm bg-gray-700 rounded text-white border border-gray-600" placeholder="Ширина (см)"
          />
          <input type="text" inputMode="decimal" value={tileHeight} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d*\.?\d*$/.test(val)) setTileHeight(val); }}
            className="w-full p-1.5 text-sm bg-gray-700 rounded text-white border border-gray-600" placeholder="Длина (см)"
          />
        </div>
        <input type="text" inputMode="numeric" value={tilesPerBox} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d+$/.test(val)) setTilesPerBox(val); }}
          className="w-full p-1.5 text-sm bg-gray-700 rounded text-white border border-gray-600" placeholder="Штук в упаковке"
        />
      </div>
      <button 
        onClick={calculateTiles}
        disabled={!roomArea || !tileWidth || !tileHeight || !tilesPerBox}
        className={`w-full p-1.5 text-sm rounded font-medium ${roomArea && tileWidth && tileHeight && tilesPerBox ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
      >
        Рассчитать
      </button>
    </div>
  )}
</div>

{/* КАЛЬКУЛЯТОР МОЛЯРНОЙ МАССЫ */}
<div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-violet-600/20 rounded-lg">
      <span className="text-violet-400 font-bold text-sm">🧪</span>
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-white">Молярная масса</h3>
      <p className="text-gray-400 text-xs">Химические формулы</p>
    </div>
    {(formula || molarMass !== null || error) && (
      <button 
        onClick={resetMolarMassCalculator}
        className="p-1 rounded-full bg-gray-700 hover:bg-violet-500/20 transition duration-200 group"
        title="Сбросить"
      >
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-violet-400 group-hover:rotate-180 transition-transform duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )}
  </div>

  {molarMass !== null ? (
    /* РЕЗУЛЬТАТ */
    <div className="flex-1 flex flex-col items-center justify-center">
      <p className="text-xs text-gray-400 mb-1">Молярная масса</p>
      <p className="text-2xl font-bold text-violet-400">{molarMass}</p>
      <p className="text-sm text-gray-300 mt-1">г/моль</p>
      <p className="text-xs text-gray-500 mt-3 text-center">Формула: {formula}</p>
      <div className="mt-2 text-xs text-gray-400 text-center">
        <p>Поддерживаются: H, C, O, N, Na, Cl, Fe, Mg и др.</p>
      </div>
    </div>
  ) : (
    /* ПОЛЕ ВВОДА */
    <div className="flex-1 space-y-3">
      <div className="space-y-2">
        <input 
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600 font-mono"
          placeholder="Введите формулу (H2O, CO2, NaCl)"
        />
        {error && (
          <div className="p-2 bg-red-900/30 border border-red-700/50 rounded text-xs text-red-300">
            {error}
          </div>
        )}
      </div>
      
      <button 
        onClick={calculateMolarMass}
        disabled={!formula}
        className={`w-full p-2 text-sm rounded font-medium transition ${formula ? 'bg-violet-600 hover:bg-violet-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
      >
        Рассчитать массу
      </button>
    </div>
  )}
</div>

{/* ЦВЕТОВАЯ ГАММА - КОМПЛЕМЕНТАРНАЯ */}
<div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-indigo-600/20 rounded-lg">
      <span className="text-indigo-400 font-bold text-sm">🎨</span>
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-white">Цветовая гамма</h3>
      <p className="text-gray-400 text-xs">Дополнительные цвета</p>
    </div>
    {copiedColor && (
      <div className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
        Скопировано!
      </div>
    )}
    {(baseColor !== '#3B82F6' || copiedColor) && (
      <button 
        onClick={resetColorCalculator}
        className="p-1 rounded-full bg-gray-700 hover:bg-indigo-500/20 transition duration-200 group"
        title="Сбросить"
      >
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 group-hover:rotate-180 transition-transform duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )}
  </div>

  {/* ОСНОВНОЙ КОНТЕНТ */}
  <div className="flex-1 flex flex-col">
    {/* КОМПАКТНЫЕ ЦВЕТОВЫЕ МЕТКИ */}
<div className="flex items-center gap-2 mb-3">
  <div className="flex items-center gap-1.5">
    <div 
      className="w-6 h-6 rounded border border-gray-600"
      style={{ backgroundColor: baseColor }}
      title="Основной цвет"
    ></div>
    <span className="text-xs font-mono text-white">{baseColor}</span>
  </div>
  <div className="text-gray-500">→</div>
  <div className="flex items-center gap-1.5">
    <div 
      className="w-6 h-6 rounded border border-gray-600"
      style={{ backgroundColor: complementaryColor }}
      title="Дополнительный цвет"
    ></div>
    <span className="text-xs font-mono text-white">{complementaryColor}</span>
  </div>
</div>
    
    {/* КНОПКИ КОПИРОВАНИЯ */}
    <div className="grid grid-cols-2 gap-2 mb-3">
      <button 
        onClick={() => copyColorToClipboard (baseColor)}
        className="p-2 text-xs bg-gray-700 hover:bg-gray-600 rounded font-medium flex items-center justify-center gap-1"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Копировать {baseColor}
      </button>
      <button 
        onClick={() => copyColorToClipboard(complementaryColor)}
        className="p-2 text-xs bg-gray-700 hover:bg-gray-600 rounded font-medium flex items-center justify-center gap-1"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Копировать {complementaryColor}
      </button>
    </div>
    
    {/* ВЫБОР ЦВЕТА И HEX-ПОЛЕ */}
    <div className="space-y-2">
      <div className="flex gap-2">
        <input 
          type="color"
          value={baseColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-10 h-10 cursor-pointer rounded border border-gray-600"
          title="Выберите цвет"
        />
        <input 
          type="text"
          value={baseColor}
          onChange={(e) => handleColorChange(e.target.value.toUpperCase())}
          className="flex-1 p-2 text-sm bg-gray-700 rounded text-white border border-gray-600 font-mono"
          placeholder="#RRGGBB"
          maxLength={7}
        />
      </div>
      
      <div className="text-xs text-gray-400 text-center">
        <p>Выберите цвет или введите HEX-код.</p>
      </div>
    </div>
  </div>
</div>

{/* КАЛЬКУЛЯТОР ЦИКЛА */}
<div className="bg-gray-800 rounded-xl p-4 border border-green-500/20 min-h-[200px] sm:min-h-[240px] flex flex-col">
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-rose-600/20 rounded-lg">
      <span className="text-rose-300 font-bold text-sm">📅</span>
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-white">Цикл-трекер</h3>
      <p className="text-gray-400 text-xs">Календарь цикла</p>
    </div>
    {(lastPeriodDate || cycleResults !== null) && (
      <button 
        onClick={resetCycleCalculator}
        className="p-1 rounded-full bg-gray-700 hover:bg-rose-500/20 transition duration-200 group"
        title="Сбросить"
      >
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-rose-300 group-hover:rotate-180 transition-transform duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )}
  </div>

  {cycleResults !== null ? (
    /* РЕЗУЛЬТАТЫ РАСЧЕТА */
    <div className="flex-1 flex flex-col">
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Следующие:</span>
          <span className="text-rose-300 font-semibold">{cycleResults.nextPeriod}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Через месяц:</span>
          <span className="text-rose-300 font-semibold">{cycleResults.nextAfterNext}</span>
        </div>
        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400">Овуляция:</span>
            <span className="text-amber-300 font-semibold">{cycleResults.ovulation}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Фертильное окно:</span>
            <span className="text-emerald-300 text-[10px]">{cycleResults.fertileStart} - {cycleResults.fertileEnd}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto text-[10px] text-gray-500 text-center pt-2 border-t border-gray-700">
        <p>Это приблизительный прогноз. Цикл может варьироваться.</p>
      </div>
    </div>
  ) : (

<div className="flex-1 space-y-2">
  <div className="space-y-1.5">
        <div>
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-xs text-gray-400">
          Начало последних месячных
        </label>
        <div 
          className="w-3 h-3 rounded-full bg-gray-700 text-[8px] leading-none flex items-center justify-center text-gray-500 cursor-help hover:bg-gray-600 transition"
          title="Обычная длина цикла: 21-35 дней (среднее 28)"
        >
          ?
        </div>
      </div>
      <input 
        type="date"
        value={lastPeriodDate}
        onChange={(e) => setLastPeriodDate(e.target.value)}
        className="w-full p-1.5 text-sm bg-gray-700 rounded text-white border border-gray-600"
        max={new Date().toISOString().split('T')[0]}
      />
    </div>
    
    <div>
      <label className="text-xs text-gray-400 block mb-0.5">Длина цикла (дней)</label>
      <div className="flex items-center gap-1">
        <input 
          type="range"
          min="21"
          max="35"
          step="1"
          value={cycleLength}
          onChange={(e) => setCycleLength(e.target.value)}
          className="flex-1"
        />
        <span className="text-rose-300 font-bold text-sm w-6 text-center">{cycleLength}</span>
      </div>
      <div className="flex justify-between text-[9px] text-gray-500 mt-0.5 px-1">
        <span>21</span>
        <span>28</span>
        <span>35</span>
      </div>
    </div>
  </div>
  
  <button 
    onClick={calculateCycle}
    disabled={!lastPeriodDate}
    className={`w-full p-1.5 text-sm rounded font-medium ${lastPeriodDate ? 'bg-rose-600 hover:bg-rose-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
  >
    Рассчитать
  </button>
</div>
)}
</div>

{/* КАЛЬКУЛЯТОР Л.С. (версия как ИМТ) */}
<div className="bg-gray-800 rounded-xl p-4 border border-blue-500/20 h-[240px] flex flex-col">
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-blue-600/20 rounded-lg">
      <span className="text-blue-400 font-bold text-sm">⚙️</span>
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-white">Калькулятор Л.С.</h3>
      <p className="text-gray-400 text-xs">л.с. ↔ Вт ↔ кВт</p>
    </div>
    {(hpValue || showHpResult) && (
      <button 
        onClick={resetHorsepowerCalculator}
        className="p-1 rounded-full bg-gray-700 hover:bg-blue-500/20 transition duration-200 group"
        title="Сбросить"
      >
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:rotate-180 transition-transform duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )}
  </div>

  {showHpResult && hpResult !== null ? (
    /* ПОЛНОЭКРАННЫЙ РЕЗУЛЬТАТ */
    <div className="flex-1 flex flex-col items-center justify-center">
      <p className="text-xs text-gray-400 mb-1 text-center">
        {hpValue} {getUnitSymbol(hpFrom)} =
      </p>
      <p className="text-2xl font-bold text-blue-400">{hpResult}</p>
      <p className="text-sm text-gray-300 mt-1">{getUnitSymbol(hpTo)}</p>
      <p className="text-xs text-gray-500 mt-3 text-center">
        {getUnitName(hpFrom)} → {getUnitName(hpTo)}
      </p>
    </div>
  ) : (
    /* КОМПАКТНАЯ ФОРМА ВВОДА */
    <div className="flex-1 space-y-3">
      <div className="space-y-2">
        <input 
          type="text"
          inputMode="decimal"
          value={hpValue}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || /^\d*\.?\d*$/.test(val)) {
              setHpValue(val);
            }
          }}
          className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600"
          placeholder="Введите значение"
        />
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <select 
              value={hpFrom}
              onChange={(e) => setHpFrom(e.target.value)}
              className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600 appearance-none pr-8"
            >
              <option value="metric">Метрич. л.с.</option>
              <option value="mechanical">Механич. л.с.</option>
              <option value="electric">Электрич. л.с.</option>
              <option value="watts">Ватты</option>
              <option value="kilowatts">Киловатты</option>
            </select>
          </div>
          
          <div className="relative">
            <select 
              value={hpTo}
              onChange={(e) => setHpTo(e.target.value)}
              className="w-full p-2 text-sm bg-gray-700 rounded text-white border border-gray-600 appearance-none pr-8"
            >
              <option value="watts">Ватты</option>
              <option value="kilowatts">Киловатты</option>
              <option value="metric">Метрич. л.с.</option>
              <option value="mechanical">Механич. л.с.</option>
              <option value="electric">Электрич. л.с.</option>
            </select>
          </div>
        </div>
      </div>
      
      <button 
        onClick={convertHorsepower}
        disabled={!hpValue}
        className={`w-full p-2 text-sm rounded font-medium transition ${hpValue ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
      >
        Рассчитать
      </button>
    </div>
  )}
</div>

</div> {/* ← Закрываем div.grid для мини-калькуляторов */}
    </div> {/* ← Закрываем div.max-w-6xl.mx-auto.mt-20 */}
 <footer className="text-center mt-10 text-gray-500 text-sm">© {new Date().getFullYear()} Calcoria. Все права защищены.</footer>
</div>
);
}