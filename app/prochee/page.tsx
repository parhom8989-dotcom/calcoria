"use client";
import { Home, RefreshCw, TrendingDown, DollarSign, Calendar, Percent, Calculator, TrendingUp, ArrowUpRight, ArrowDownRight, Droplets, Thermometer, Activity, Flame, Ruler, Settings } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function OtherCalculatorsPage() {
  // ========== ИПОТЕЧНЫЙ КАЛЬКУЛЯТОР ==========
  const [loanAmount, setLoanAmount] = useState("3000000");
  const [interestRate, setInterestRate] = useState("7.5");
  const [loanTerm, setLoanTerm] = useState("20");
  const [downPaymentPercent, setDownPaymentPercent] = useState("10");
  const [downPaymentAmount, setDownPaymentAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [overpaymentPercent, setOverpaymentPercent] = useState<number | null>(null);

  const calculateMortgage = useCallback(() => {
    const P = parseFloat(loanAmount) || 0;
    const r = parseFloat(interestRate) || 0;
    const n = parseFloat(loanTerm) || 0;
    const dpPercent = parseFloat(downPaymentPercent) || 0;
    
    let dpAmount = parseFloat(downPaymentAmount) || 0;
    if (!downPaymentAmount && dpPercent > 0) {
      dpAmount = (P * dpPercent) / 100;
      setDownPaymentAmount(dpAmount.toFixed(0));
    }
    
    const principal = P - dpAmount;
    
    if (principal <= 0 || r <= 0 || n <= 0) {
      setMonthlyPayment(null);
      setTotalInterest(null);
      setTotalPayment(null);
      setOverpaymentPercent(null);
      return;
    }
    
    const monthlyRate = (r / 100) / 12;
    const months = n * 12;
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;
    const overpaymentPercent = (totalInterest / principal) * 100;
    
    setMonthlyPayment(monthlyPayment);
    setTotalInterest(totalInterest);
    setTotalPayment(totalPayment);
    setOverpaymentPercent(overpaymentPercent);
  }, [loanAmount, interestRate, loanTerm, downPaymentPercent, downPaymentAmount]);

  useEffect(() => {
    calculateMortgage();
  }, [calculateMortgage]);

  const resetMortgageCalculator = () => {
    setLoanAmount("3000000");
    setInterestRate("7.5");
    setLoanTerm("20");
    setDownPaymentPercent("10");
    setDownPaymentAmount("");
  };

  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return "0 ₽";
    return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  };

  const handleDownPaymentPercentChange = (value: string) => {
    setDownPaymentPercent(value);
    const percent = parseFloat(value) || 0;
    const amount = (parseFloat(loanAmount) * percent) / 100;
    setDownPaymentAmount(amount.toFixed(0));
  };

  const handleDownPaymentAmountChange = (value: string) => {
    setDownPaymentAmount(value);
    const amount = parseFloat(value) || 0;
    const loan = parseFloat(loanAmount) || 1;
    const percent = (amount / loan) * 100;
    setDownPaymentPercent(percent.toFixed(1));
  };

  // ========== КАЛЬКУЛЯТОР ПРОЦЕНТОВ ==========
  const [calcType, setCalcType] = useState("percent_of_number");
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [percentResult, setPercentResult] = useState<number | null>(null);
  const [percentValue, setPercentValue] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);

  const calculatePercentage = useCallback(() => {
    const num1 = parseFloat(number1) || 0;
    const num2 = parseFloat(number2) || 0;
    
    let calculatedResult = 0;
    let calculatedPercent = 0;
    let calculatedValue = 0;
    
    switch(calcType) {
      case "percent_of_number":
        calculatedValue = (num1 * num2) / 100;
        calculatedResult = calculatedValue;
        calculatedPercent = num2;
        break;
      case "percentage_increase":
        calculatedValue = (num1 * num2) / 100;
        calculatedResult = num1 + calculatedValue;
        calculatedPercent = num2;
        break;
      case "percentage_decrease":
        calculatedValue = (num1 * num2) / 100;
        calculatedResult = num1 - calculatedValue;
        calculatedPercent = num2;
        break;
      case "percentage_change":
        if (num1 !== 0) {
          calculatedPercent = ((num2 - num1) / Math.abs(num1)) * 100;
          calculatedResult = num2;
          calculatedValue = num2 - num1;
        }
        break;
      case "find_percentage":
        if (num2 !== 0) {
          calculatedPercent = (num1 / num2) * 100;
          calculatedResult = num1;
          calculatedValue = num1;
        }
        break;
    }
    
    setPercentResult(isNaN(calculatedResult) ? null : calculatedResult);
    setPercentValue(isNaN(calculatedValue) ? null : calculatedValue);
    setPercentage(isNaN(calculatedPercent) ? null : calculatedPercent);
  }, [calcType, number1, number2]);

  useEffect(() => {
    calculatePercentage();
  }, [calculatePercentage]);

  const resetPercentageCalculator = () => {
    setNumber1("");
    setNumber2("");
    setPercentResult(null);
    setPercentValue(null);
    setPercentage(null);
    setCalcType("percent_of_number");
  };

     // ========== КАЛЬКУЛЯТОР САМОГОНЩИКА ==========
  const [moonshineCalcType, setMoonshineCalcType] = useState('dilute');
  const [moonshineInput1, setMoonshineInput1] = useState('');
  const [moonshineInput2, setMoonshineInput2] = useState('');
  const [moonshineInput3, setMoonshineInput3] = useState('');
  const [moonshineResult, setMoonshineResult] = useState<number | null>(null);
  const [moonshineResult2, setMoonshineResult2] = useState<number | null>(null);

  // Функции расчёта для самогонного калькулятора
  const calculateMoonshine = useCallback(() => {
    const val1 = parseFloat(moonshineInput1) || 0;
    const val2 = parseFloat(moonshineInput2) || 0;
    const val3 = parseFloat(moonshineInput3) || 0;

    switch (moonshineCalcType) {
      case 'dilute': // Разбавление спирта водой
        // Вода = (Объём * (КрепостьДо / КрепостьПосле - 1))
        if (val3 > 0 && val3 < val2) {
          const waterNeeded = val1 * (val2 / val3 - 1);
          setMoonshineResult(waterNeeded);
          setMoonshineResult2(val1 + waterNeeded);
        } else {
          setMoonshineResult(null);
          setMoonshineResult2(null);
        }
        break;
        
      case 'mix': // Смешивание двух жидкостей
  // Нужна крепость второй жидкости (четвертое поле)
  // Сейчас её нет — временно считаем нулевой
  const strength2 = 0; // Будет вводиться в отдельном поле
  
  // Общий объём и средняя крепость
  const totalVolume = val1 + val3;
  const totalStrength = (val1 * val2 + val3 * strength2) / totalVolume;
  setMoonshineResult(totalVolume);
  setMoonshineResult2(totalStrength);
  break;
        
      default:
        setMoonshineResult(null);
        setMoonshineResult2(null);
    }
  }, [moonshineCalcType, moonshineInput1, moonshineInput2, moonshineInput3]);

  useEffect(() => {
    calculateMoonshine();
  }, [calculateMoonshine]);

  const resetMoonshineCalculator = () => {
    setMoonshineInput1('');
    setMoonshineInput2('');
    setMoonshineInput3('');
    setMoonshineCalcType('dilute');
  };
    const formatNumber = (num: number | string | null): string => {
    if (num === null) return "0";
    
    // Преобразуем в число, если это строка
    const numberValue = typeof num === 'string' ? parseFloat(num) : num;
    
    // Проверяем, что это валидное число
    if (isNaN(numberValue)) return "0";
    
    return numberValue.toFixed(2);
  };

  // ========== КАЛЬКУЛЯТОР КАЛОРИЙ ==========
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState('1.2');
  const [caloriesResult, setCaloriesResult] = useState<number | null>(null);
  const [proteinResult, setProteinResult] = useState<number | null>(null);

  // Расчёт калорий и БЖУ
  const calculateCalories = useCallback(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    const a = parseFloat(age) || 0;
    const activity = parseFloat(activityLevel) || 1.2;

    if (w > 0 && h > 0 && a > 0) {
      // Формула Миффлина-Сан Жеора
      let bmr;
      if (gender === 'male') {
        bmr = 10 * w + 6.25 * h - 5 * a + 5;
      } else {
        bmr = 10 * w + 6.25 * h - 5 * a - 161;
      }
      
      const tdee = bmr * activity; // Дневная норма с учётом активности
      setCaloriesResult(tdee);
      setProteinResult(w * 1.8); // Норма белка: 1.8г на кг веса
    } else {
      setCaloriesResult(null);
      setProteinResult(null);
    }
  }, [gender, weight, height, age, activityLevel]);

  useEffect(() => {
    calculateCalories();
  }, [calculateCalories]);

  const resetCaloriesCalculator = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setActivityLevel('1.2');
    setGender('male');
  };

  // ========== КОНВЕРТЕР ЕДИНИЦ ==========
  const [converterCategory, setConverterCategory] = useState('length');
  const [converterFromValue, setConverterFromValue] = useState('');
  const [converterFromUnit, setConverterFromUnit] = useState('m');
  const [converterToUnit, setConverterToUnit] = useState('km');
  const [convertedResult, setConvertedResult] = useState<number | null>(null);

// ========== КАЛЬКУЛЯТОР НДС ==========
const [vatType, setVatType] = useState('withVAT'); // 'withVAT' или 'withoutVAT'
const [vatAmount, setVatAmount] = useState('');
const [vatRate, setVatRate] = useState('20'); // 20% по умолчанию
const [vatResult, setVatResult] = useState<{
  amountWithoutVAT?: number;
  amountWithVAT?: number;
  vatValue?: number;
} | null>(null);

// ========== ШИННЫЙ КАЛЬКУЛЯТОР ==========
const [tireWidth1, setTireWidth1] = useState('205');
const [tireProfile1, setTireProfile1] = useState('55');
const [tireDiameter1, setTireDiameter1] = useState('16');

const [tireWidth2, setTireWidth2] = useState('215');
const [tireProfile2, setTireProfile2] = useState('60');
const [tireDiameter2, setTireDiameter2] = useState('17');

const [tireResult, setTireResult] = useState<{
  diameter1?: number;
  diameter2?: number;
  diameterDiff?: number;
  diameterPercent?: number;
  speedometerDiff?: number;
  odometerDiff?: number;
  profileHeight1?: number;
  profileHeight2?: number;
  isLegal?: boolean;
} | null>(null);

  // Единицы измерения для каждой категории
  const unitCategories = {
    length: [
      { value: 'mm', label: 'Миллиметры (мм)', factor: 0.001 },
      { value: 'cm', label: 'Сантиметры (см)', factor: 0.01 },
      { value: 'm', label: 'Метры (м)', factor: 1 },
      { value: 'km', label: 'Километры (км)', factor: 1000 },
      { value: 'in', label: 'Дюймы (in)', factor: 0.0254 },
      { value: 'ft', label: 'Футы (ft)', factor: 0.3048 },
    ],
    weight: [
      { value: 'g', label: 'Граммы (г)', factor: 1 },
      { value: 'kg', label: 'Килограммы (кг)', factor: 1000 },
      { value: 't', label: 'Тонны (т)', factor: 1000000 },
      { value: 'oz', label: 'Унции (oz)', factor: 28.3495 },
      { value: 'lb', label: 'Фунты (lb)', factor: 453.592 },
    ],
    volume: [
      { value: 'ml', label: 'Миллилитры (мл)', factor: 1 },
      { value: 'l', label: 'Литр (л)', factor: 1000 },
      { value: 'm3', label: 'Куб. метр (м³)', factor: 1000000 },
      { value: 'gal', label: 'Галлон (gal)', factor: 3785.41 },
      { value: 'fl-oz', label: 'Жидк. унция (fl oz)', factor: 29.5735 },
    ]
  };

  // Функция конвертации
  const calculateConversion = useCallback(() => {
    const value = parseFloat(converterFromValue) || 0;
    
    if (value <= 0) {
      setConvertedResult(null);
      return;
    }

    const units = unitCategories[converterCategory as keyof typeof unitCategories];
    const fromUnit = units.find(u => u.value === converterFromUnit);
    const toUnit = units.find(u => u.value === converterToUnit);

    if (fromUnit && toUnit) {
      // Конвертируем в базовые единицы, затем в целевую
      const valueInBase = value * fromUnit.factor;
      const result = valueInBase / toUnit.factor;
      setConvertedResult(result);
    }
  }, [converterCategory, converterFromValue, converterFromUnit, converterToUnit]);

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  const resetConverter = () => {
    setConverterFromValue('');
    setConverterFromUnit('m');
    setConverterToUnit('km');
    setConverterCategory('length');
  };

// Функция расчета НДС
const calculateVAT = useCallback(() => {
  const amount = parseFloat(vatAmount) || 0;
  
  if (amount <= 0) {
    setVatResult(null);
    return;
  }

  // Преобразуем ставку в число (убираем '%' если есть)
  const rateStr = vatRate.toString().replace('%', '');
  const rate = parseFloat(rateStr) || 0;
  
  let vatValue = 0;
  let amountWithoutVAT = 0;
  let amountWithVAT = 0;

  if (vatType === 'withVAT') {
    // Сумма ВВЕДЕНА С НДС
    amountWithoutVAT = amount / (1 + rate / 100);
    vatValue = amount - amountWithoutVAT;
    amountWithVAT = amount;
  } else {
    // Сумма ВВЕДЕНА БЕЗ НДС
    vatValue = (amount * rate) / 100;
    amountWithoutVAT = amount;
    amountWithVAT = amount + vatValue;
  }

  setVatResult({
    amountWithoutVAT,
    amountWithVAT,
    vatValue
  });
}, [vatAmount, vatRate, vatType]);

useEffect(() => {
  calculateVAT();
}, [calculateVAT]);

// Функция сброса калькулятора НДС
const resetVATCalculator = () => {
  setVatAmount('');
  setVatRate('20');
  setVatType('withVAT');
  setVatResult(null);
};

// Функция расчета шин
const calculateTires = useCallback(() => {
  const width1 = parseFloat(tireWidth1) || 0;
  const profile1 = parseFloat(tireProfile1) || 0;
  const diameter1Inch = parseFloat(tireDiameter1) || 0;

  const width2 = parseFloat(tireWidth2) || 0;
  const profile2 = parseFloat(tireProfile2) || 0;
  const diameter2Inch = parseFloat(tireDiameter2) || 0;

  if (width1 <= 0 || profile1 <= 0 || diameter1Inch <= 0 ||
      width2 <= 0 || profile2 <= 0 || diameter2Inch <= 0) {
    setTireResult(null);
    return;
  }

  // Расчет диаметров в мм
  const diameter1 = (width1 * profile1 / 100) * 2 + diameter1Inch * 25.4;
  const diameter2 = (width2 * profile2 / 100) * 2 + diameter2Inch * 25.4;
  
  // Разница в %
  const diameterDiff = diameter2 - diameter1;
  const diameterPercent = (diameterDiff / diameter1) * 100;
  
  // Погрешность спидометра (на 100 км/ч)
  const speedometerDiff = 100 * diameterPercent / 100;
  
  // Погрешность одометра (на 1000 км)
  const odometerDiff = 1000 * diameterPercent / 100;
  
  // Высота профиля
  const profileHeight1 = width1 * profile1 / 100;
  const profileHeight2 = width2 * profile2 / 100;
  
  // Проверка по ПДД (допуск ±3% для легковых)
  const isLegal = Math.abs(diameterPercent) <= 3;

  setTireResult({
    diameter1,
    diameter2,
    diameterDiff,
    diameterPercent,
    speedometerDiff,
    odometerDiff,
    profileHeight1,
    profileHeight2,
    isLegal
  });
}, [tireWidth1, tireProfile1, tireDiameter1, tireWidth2, tireProfile2, tireDiameter2]);

useEffect(() => {
  calculateTires();
}, [calculateTires]);

// Функция сброса
const resetTireCalculator = () => {
  setTireWidth1('205');
  setTireProfile1('55');
  setTireDiameter1('16');
  setTireWidth2('215');
  setTireProfile2('60');
  setTireDiameter2('17');
};

  // ========== РЕНДЕР СТРАНИЦЫ ==========
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-10 px-4">
            {/* Шапка: заголовок по центру, кнопка справа */}
      <div className="max-w-7xl mx-auto mb-12 relative">
        {/* Контейнер для выравнивания */}
        <div className="flex items-center">
          {/* Левая часть (пустая для баланса) */}
          <div className="flex-1"></div>
          
          {/* Заголовок по центру */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-300 tracking-tight text-center flex-2">
            Прочие калькуляторы
          </h1>
          
          {/* Кнопка справа */}
          <div className="flex-1 flex justify-end">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            >
              <Home className="w-4 h-4" />
              На главную
            </a>
          </div>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        
        {/* КАЛЬКУЛЯТОР 1: ИПОТЕКА */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 relative">
          
          <button
            onClick={resetMortgageCalculator}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-cyan-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-600/20 rounded-xl">
              <Home className="w-6 h-6 text-cyan-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Ипотечный калькулятор</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-sm font-mono text-cyan-300">Аннуитетные платежи</p>
            <p className="text-xs text-gray-400 mt-1">M = P × [r(1+r)ⁿ] / [(1+r)ⁿ−1]</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Стоимость недвижимости
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
                  min="0"
                  step="100000"
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  ₽
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {["1000000", "3000000", "5000000"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setLoanAmount(amount)}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-cyan-700 rounded-lg transition-colors"
                  >
                    {(parseInt(amount)/1000000).toFixed(0)}M ₽
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Percent className="w-4 h-4 inline mr-1" />
                Первоначальный взнос
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input 
                    type="number" 
                    value={downPaymentPercent}
                    onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
                    className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    %
                  </div>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={downPaymentAmount}
                    onChange={(e) => handleDownPaymentAmountChange(e.target.value)}
                    className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
                    min="0"
                    step="10000"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    ₽
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {["0", "10", "15", "20", "30"].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => handleDownPaymentPercentChange(percent)}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-cyan-700 rounded-lg transition-colors"
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Percent className="w-4 h-4 inline mr-1" />
                  Ставка (% год.)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
                    min="0.1"
                    max="30"
                    step="0.1"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    %
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["6.5", "7.5", "8.5", "9.5"].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setInterestRate(rate)}
                      className="px-2 py-1 text-xs bg-gray-700 hover:bg-cyan-700 rounded-lg transition-colors"
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Срок (лет)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
                    min="1"
                    max="30"
                    step="1"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    лет
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["5", "10", "15", "20", "30"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className="px-2 py-1 text-xs bg-gray-700 hover:bg-cyan-700 rounded-lg transition-colors"
                    >
                      {term} лет
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-cyan-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-cyan-400" />
              <p className="text-lg font-medium text-gray-300">Ежемесячный платеж</p>
            </div>
            <p className="text-3xl font-bold text-cyan-400">
              {monthlyPayment !== null ? formatCurrency(monthlyPayment) : "0 ₽"}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div className="bg-gray-800 p-2 rounded-lg">
                <p className="text-gray-400">Общая сумма</p>
                <p className="font-medium text-cyan-300">{formatCurrency(totalPayment)}</p>
              </div>
              <div className="bg-gray-800 p-2 rounded-lg">
                <p className="text-gray-400">Переплата</p>
                <p className="font-medium text-cyan-300">{formatCurrency(totalInterest)}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Срок: {loanTerm} лет | Ставка: {interestRate}% годовых
            </div>
          </div>

          <div className="mt-4 p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/10">
            <p className="text-xs text-cyan-300/80 text-center">
              💡 Сумма кредита: {formatCurrency(parseFloat(loanAmount) - (parseFloat(downPaymentAmount) || 0))}
            </p>
            {overpaymentPercent !== null && (
              <p className="text-xs text-cyan-300/80 text-center mt-1">
                Переплата: {overpaymentPercent.toFixed(1)}% от суммы кредита
              </p>
            )}
          </div>
        </div>

        {/* КАЛЬКУЛЯТОР 2: ПРОЦЕНТЫ */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 relative">
          
          <button
            onClick={resetPercentageCalculator}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-purple-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-purple-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-600/20 rounded-xl">
              <Percent className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Калькулятор процентов</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-sm font-mono text-purple-300">Калькулятор процентов</p>
            <p className="text-xs text-gray-400 mt-1">5 типов расчета</p>
          </div>
          
          <select 
            value={calcType} 
            onChange={(e) => setCalcType(e.target.value)} 
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="percent_of_number">% от числа</option>
            <option value="percentage_increase">Увеличение на %</option>
            <option value="percentage_decrease">Уменьшение на %</option>
            <option value="percentage_change">Изменение в %</option>
            <option value="find_percentage">Сколько % составляет</option>
          </select>
          
          <div className="space-y-4">
            {calcType === "percent_of_number" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Число
                  </label>
                  <input 
                    type="number" 
                    placeholder="Введите число" 
                    value={number1} 
                    onChange={(e) => setNumber1(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Процент (%)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Введите процент" 
                    value={number2} 
                    onChange={(e) => setNumber2(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
              </>
            )}
            
            {(calcType === "percentage_increase" || calcType === "percentage_decrease") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Исходное число
                  </label>
                  <input 
                    type="number" 
                    placeholder="Введите число" 
                    value={number1} 
                    onChange={(e) => setNumber1(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {calcType === "percentage_increase" ? "Увеличить на (%)" : "Уменьшить на (%)"}
                  </label>
                  <input 
                    type="number" 
                    placeholder="Введите процент" 
                    value={number2} 
                    onChange={(e) => setNumber2(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
              </>
            )}
            
            {calcType === "percentage_change" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Начальное значение
                  </label>
                  <input 
                    type="number" 
                    placeholder="Начальное значение" 
                    value={number1} 
                    onChange={(e) => setNumber1(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Конечное значение
                  </label>
                  <input 
                    type="number" 
                    placeholder="Конечное значение" 
                    value={number2} 
                    onChange={(e) => setNumber2(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
              </>
            )}
            
            {calcType === "find_percentage" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Часть
                  </label>
                  <input 
                    type="number" 
                    placeholder="Часть от целого" 
                    value={number1} 
                    onChange={(e) => setNumber1(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Целое
                  </label>
                  <input 
                    type="number" 
                    placeholder="Целое число" 
                    value={number2} 
                    onChange={(e) => setNumber2(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-purple-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-purple-400" />
              <p className="text-lg font-medium text-gray-300">Результат</p>
            </div>
            
            {percentResult !== null && (
              <div className="space-y-3">
                <p className="text-3xl font-bold text-purple-400">
                  {percentResult.toFixed(2)}
                </p>
                
                {percentage !== null && (
                  <div className={`p-2 rounded-lg ${calcType === "percentage_decrease" ? "bg-red-900/30" : calcType === "percentage_increase" ? "bg-green-900/30" : "bg-gray-800"}`}>
                    <div className="flex items-center justify-center gap-2">
                      {calcType === "percentage_decrease" && <ArrowDownRight className="w-4 h-4 text-red-400" />}
                      {calcType === "percentage_increase" && <ArrowUpRight className="w-4 h-4 text-green-400" />}
                      <span className="text-sm">
                        {calcType === "percentage_change" ? "Изменение: " : ""}
                        {percentage >= 0 ? "+" : ""}{formatNumber(percentage)}%
                      </span>
                    </div>
                  </div>
                )}
                
                {percentValue !== null && percentValue !== 0 && (
                  <div className="text-sm text-gray-400">
                    {calcType === "percent_of_number" && `${formatNumber(number1)} × ${formatNumber(number2)}% = ${formatNumber(percentValue)}`}
                    {calcType === "percentage_increase" && `${formatNumber(number1)} + ${formatNumber(percentValue)} = ${formatNumber(percentResult)}`}
                    {calcType === "percentage_decrease" && `${formatNumber(number1)} - ${formatNumber(percentValue)} = ${formatNumber(percentResult)}`}
                    {calcType === "percentage_change" && `Разница: ${formatNumber(percentValue)}`}
                  </div>
                )}
              </div>
            )}
            
            {percentResult === null && (
              <p className="text-xl text-gray-500 py-4">Введите данные для расчета</p>
            )}
          </div>
        </div>

        {/* КАЛЬКУЛЯТОР 3: САМОГОНЩИКА */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-amber-500 transition-all duration-300 relative">
          
          <button
            onClick={resetMoonshineCalculator}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-amber-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-600/20 rounded-xl">
              <Droplets className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Калькулятор самогонщика</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-sm font-mono text-amber-300">Калькулятор дистилляции</p>
            <p className="text-xs text-gray-400 mt-1">Разбавление и смешивание</p>
          </div>
          
          {/* Выбор типа расчёта */}
          <select 
            value={moonshineCalcType} 
            onChange={(e) => setMoonshineCalcType(e.target.value)} 
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="dilute">Разбавить водой</option>
            <option value="mix">Смешать жидкости</option>
          </select>
          
          {/* Поля ввода */}
          <div className="space-y-4">
            {moonshineCalcType === 'dilute' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Объём спирта (мл)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Например, 1000" 
                    value={moonshineInput1} 
                    onChange={(e) => setMoonshineInput1(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Крепость до (%)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Например, 80" 
                    value={moonshineInput2} 
                    onChange={(e) => setMoonshineInput2(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Желаемая крепость (%)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Например, 40" 
                    value={moonshineInput3} 
                    onChange={(e) => setMoonshineInput3(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
              </>
            )}
            
            {moonshineCalcType === 'mix' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Жидкость 1: Объём (мл)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Объём первой" 
                    value={moonshineInput1} 
                    onChange={(e) => setMoonshineInput1(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Жидкость 1: Крепость (%)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Крепость первой" 
                    value={moonshineInput2} 
                    onChange={(e) => setMoonshineInput2(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Жидкость 2: Объём (мл)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Объём второй" 
                    value={moonshineInput3} 
                    onChange={(e) => setMoonshineInput3(e.target.value)} 
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
                  />
                </div>
              </>
            )}
          </div>

          {/* Блок с результатами */}
          <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-amber-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Thermometer className="w-5 h-5 text-amber-400" />
              <p className="text-lg font-medium text-gray-300">Результат</p>
            </div>
            
            {moonshineResult !== null && (
              <div className="space-y-3">
                {moonshineCalcType === 'dilute' && (
                  <>
                    <p className="text-2xl font-bold text-amber-400">
                      Воды: {moonshineResult.toFixed(0)} мл
                    </p>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Общий объём:</p>
                      <p className="text-xl text-amber-300">{moonshineResult2?.toFixed(0) || 0} мл</p>
                    </div>
                  </>
                )}
                
                {moonshineCalcType === 'mix' && (
                  <>
                    <p className="text-2xl font-bold text-amber-400">
                      Крепость: {moonshineResult2?.toFixed(1) || 0}%
                    </p>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Общий объём:</p>
                      <p className="text-xl text-amber-300">{moonshineResult?.toFixed(0)} мл</p>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {moonshineResult === null && (
              <p className="text-gray-500 py-4">Введите данные для расчёта</p>
            )}
          </div>
        </div>

               {/* КАЛЬКУЛЯТОР 4: КАЛОРИЙ */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-green-500 transition-all duration-300 relative">
          
          <button
            onClick={resetCaloriesCalculator}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-green-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-green-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-600/20 rounded-xl">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Калькулятор калорий</h2>
          </div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-sm font-mono text-green-300">Норма калорий и БЖУ</p>
            <p className="text-xs text-gray-400 mt-1">Формула Миффлина-Сан Жеора</p>
          </div>
          
          {/* Выбор пола */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 p-3 rounded-lg ${gender === 'male' ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Мужчина
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 p-3 rounded-lg ${gender === 'female' ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Женщина
            </button>
          </div>
          
          {/* Основные поля */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Вес (кг)
              </label>
              <input 
                type="number" 
                placeholder="Например, 70" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Рост (см)
              </label>
              <input 
                type="number" 
                placeholder="Например, 175" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Возраст (лет)
              </label>
              <input 
                type="number" 
                placeholder="Например, 30" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
              />
            </div>
            
            {/* Уровень активности */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Активность
              </label>
              <select 
                value={activityLevel} 
                onChange={(e) => setActivityLevel(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
              >
                <option value="1.2">Минимальная (офис)</option>
                <option value="1.375">Слабая (1-3 тренировки)</option>
                <option value="1.55">Умеренная (3-5 тренировок)</option>
                <option value="1.725">Высокая (6-7 тренировок)</option>
                <option value="1.9">Экстремальная (спорт + работа)</option>
              </select>
            </div>
          </div>

          {/* Результаты */}
          <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-green-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-green-400" />
              <p className="text-lg font-medium text-gray-300">Дневная норма</p>
            </div>
            
            {caloriesResult !== null ? (
              <div className="space-y-3">
                <p className="text-3xl font-bold text-green-400">
                  {caloriesResult.toFixed(0)} <span className="text-lg">ккал</span>
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <p className="text-gray-400">Белки</p>
                    <p className="text-green-300 font-medium">{proteinResult?.toFixed(1)} г</p>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <p className="text-gray-400">Углеводы</p>
                    <p className="text-green-300 font-medium">{(caloriesResult * 0.5 / 4).toFixed(1)} г</p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 mt-2">
                  Поддержание веса · {gender === 'male' ? 'Мужчина' : 'Женщина'} · Активность: {activityLevel}x
                </div>
              </div>
            ) : (
              <p className="text-gray-500 py-4">Введите ваши данные</p>
            )}
          </div>
        </div>
       
                {/* КАЛЬКУЛЯТОР 5: КОНВЕРТЕР ЕДИНИЦ */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 relative">
          
          <button
            onClick={resetConverter}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-blue-500/20 transition-all duration-300 group"
            title="Сбросить значения"
          >
            <RefreshCw className="w-5 h-5 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
  <div className="p-3 bg-blue-600/20 rounded-xl">
    <Ruler className="w-6 h-6 text-blue-500" />
  </div>
  <div>
    <h2 className="text-xl font-bold text-white leading-tight">Конвертер</h2>
    <h2 className="text-2xl font-bold text-white-400 leading-tight">единиц</h2>
  </div>
</div>
          
          <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
            <p className="text-sm font-mono text-blue-300">Конвертация величин</p>
            <p className="text-xs text-gray-400 mt-1">Длина, вес, объём</p>
          </div>
          
          {/* Выбор категории */}
          <div className="mb-4">
            <select 
              value={converterCategory} 
              onChange={(e) => setConverterCategory(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            >
              <option value="length">Длина</option>
              <option value="weight">Вес</option>
              <option value="volume">Объём</option>
            </select>
          </div>
          
          {/* Поля ввода */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Исходное значение
              </label>
              <div className="flex gap-2">
  <div className="flex-1">
    <input 
      type="number" 
      placeholder="Например, 100" 
      value={converterFromValue} 
      onChange={(e) => setConverterFromValue(e.target.value)} 
      className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" 
    />
  </div>
  {/* НОВЫЙ КОД (вставить вместо старого): */}
<select 
  value={converterFromUnit} 
  onChange={(e) => setConverterFromUnit(e.target.value)} 
  className="w-32 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 text-xs"
>
  {/* Все опции ниже - один большой список */}
  {/* ДЛИНА */}
  <option value="m">м (метры)</option>
  <option value="km">км (километры)</option>
  <option value="cm">см (сантиметры)</option>
  <option value="mm">мм (миллиметры)</option>
  <option value="in">дюймы (≈ 2.54 см)</option>
  <option value="ft">футы (≈ 30.5 см)</option>
  
  {/* ВЕС */}
  <option value="g">г (граммы)</option>
  <option value="kg">кг (килограммы)</option>
  <option value="t">т (тонны)</option>
  <option value="oz">унции (oz ≈ 28 г)</option>
  <option value="lb">фунты (lb ≈ 454 г)</option>
  
  {/* ОБЪЕМ */}
  <option value="ml">мл (миллилитры)</option>
  <option value="l">л (литры)</option>
  <option value="m3">м³ (кубометры)</option>
  <option value="fl-oz">жидк. унция (fl oz ≈ 30 мл)</option>
  <option value="gal">галлоны (gal ≈ 3.78 л)</option>
</select>
</div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-gray-500">→</div>
            </div>
            
            {/* БЛОК 2: Результат */}
<div>
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Результат
  </label>
  <div className="flex gap-2">
    <div className="flex-1 min-w-0">
      <div className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white overflow-hidden">
        <div className="truncate">
          {convertedResult !== null ? convertedResult.toFixed(4) : '0'}
        </div>
      </div>
    </div>
    
    {/* ЭТОТ SELECT НУЖНО ЗАМЕНИТЬ */}
    <select 
      value={converterToUnit} 
      onChange={(e) => setConverterToUnit(e.target.value)} 
      className="w-32 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 text-xs"
    >
      <optgroup label="─── Длина ───">
        <option value="m">м (метры)</option>
        <option value="km">км (километры)</option>
        <option value="cm">см (сантиметры)</option>
        <option value="mm">мм (миллиметры)</option>
        <option value="in">дюймы (in ≈ 2.54 см)</option>
        <option value="ft">футы (ft ≈ 30.5 см)</option>
      </optgroup>
      <optgroup label="─── Вес ───">
        <option value="g">г (граммы)</option>
        <option value="kg">кг (килограммы)</option>
        <option value="t">т (тонны)</option>
        <option value="oz">унции (oz ≈ 28 г)</option>
        <option value="lb">фунты (lb ≈ 454 г)</option>
      </optgroup>
      <optgroup label="─── Объём ───">
        <option value="ml">мл (миллилитры)</option>
        <option value="l">л (литры)</option>
        <option value="m3">м³ (кубометры)</option>
        <option value="fl-oz">жидк. унция (fl oz ≈ 30 мл)</option>
        <option value="gal">галлоны (gal ≈ 3.78 л)</option>
      </optgroup>
    </select>
  </div>
</div>
          </div>

          {/* Быстрые конвертации - ЗАМЕНИТЬ ЭТИ 3 КНОПКИ */}
<div className="mt-6 p-4 bg-gray-900 rounded-xl border border-blue-500/20">
  <p className="text-sm font-medium text-gray-300 mb-2">Популярные конвертации</p>
  <div className="flex flex-wrap gap-2">
    <button
      onClick={() => {
        setConverterCategory('length');
        setConverterFromUnit('m');
        setConverterToUnit('ft');
        setConverterFromValue('1');
      }}
      className="px-3 py-1 text-sm bg-gray-800 hover:bg-blue-800 rounded-lg transition-colors"
    >
      1 м → футы
    </button>
    <button
      onClick={() => {
        setConverterCategory('weight');
        setConverterFromUnit('kg');
        setConverterToUnit('lb');
        setConverterFromValue('1');
      }}
      className="px-3 py-1 text-sm bg-gray-800 hover:bg-blue-800 rounded-lg transition-colors"
    >
      1 кг → фунты
    </button>
    <button
      onClick={() => {
        setConverterCategory('volume');
        setConverterFromUnit('l');
        setConverterToUnit('gal');
        setConverterFromValue('1');
      }}
      className="px-3 py-1 text-sm bg-gray-800 hover:bg-blue-800 rounded-lg transition-colors"
    >
      1 л → галлоны
    </button>
  </div>
</div>
        </div>

{/* КАЛЬКУЛЯТОР 6: НДС */}
<div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-red-500 transition-all duration-300 relative">
  
  <button
    onClick={resetVATCalculator}
    className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-red-500/20 transition-all duration-300 group"
    title="Сбросить значения"
  >
    <RefreshCw className="w-5 h-5 text-red-400 group-hover:rotate-180 transition-transform duration-500" />
  </button>
  
  <div className="flex items-center gap-3 mb-6">
  <div className="p-3 bg-red-600/20 rounded-xl">
    <Percent className="w-6 h-6 text-red-500" />
  </div>
  <div>
    <h2 className="text-xl font-bold text-white leading-tight">Калькулятор</h2>
    <h2 className="text-2xl font-bold text-white-400 leading-tight">НДС</h2>
  </div>
</div>
  
  <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
    <p className="text-sm font-mono text-red-300">Налог на добавленную стоимость</p>
    <p className="text-xs text-gray-400 mt-1">20%, 10%, 0% и расчётные ставки</p>
  </div>
  
  {/* Переключатель типа расчета */}
  <div className="flex gap-2 mb-6">
    <button onClick={() => setVatType('withVAT')} className={`flex-1 p-3 rounded-lg ${vatType === 'withVAT' ? 'bg-red-700 text-white' : 'bg-gray-700 text-gray-300'}`}>
      Сумма с НДС
    </button>
    <button onClick={() => setVatType('withoutVAT')} className={`flex-1 p-3 rounded-lg ${vatType === 'withoutVAT' ? 'bg-red-700 text-white' : 'bg-gray-700 text-gray-300'}`}>
      Сумма без НДС
    </button>
  </div>

  {/* Поле ввода суммы */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {vatType === 'withVAT' ? 'Сумма с НДС' : 'Сумма без НДС'}
    </label>
    <div className="relative">
      <input type="number" placeholder="Введите сумму" value={vatAmount} onChange={(e) => setVatAmount(e.target.value)} className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600" min="0" step="0.01"/>
      <div className="absolute left-3 top-3 text-gray-400">₽</div>
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
      {["100", "1000", "5000", "10000"].map((amount) => (
        <button key={amount} onClick={() => setVatAmount(amount)} className="px-2 py-1 text-xs bg-gray-700 hover:bg-red-700 rounded-lg transition-colors">
          {amount} ₽
        </button>
      ))}
    </div>
  </div>

    {/* Выбор ставки НДС */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-300 mb-2">Ставка НДС</label>
    
    <div className="grid grid-cols-3 gap-2 mb-3">
      {['20', '10', '0'].map((rate) => (
        <button key={rate} onClick={() => setVatRate(rate)} className={`p-3 rounded-lg ${vatRate === rate ? 'bg-red-700 text-white' : 'bg-gray-700 text-gray-300'}`}>
          {rate}%
        </button>
      ))}
    </div>
    
    <div className="relative">
      <input type="number" value={vatRate} onChange={(e) => setVatRate(e.target.value)} className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-white border border-gray-600" min="0" max="100" step="0.1" placeholder="Или введите свою ставку"/>
      <div className="absolute left-3 top-3 text-gray-400">%</div>
    </div>
    
    <div className="mt-2 text-xs text-gray-400">
      {['20', '10', '0'].includes(vatRate) ? `Основная ставка НДС — ${vatRate}%` : `Ваша ставка: ${vatRate}%`}
    </div>
  </div>

    {/* Блок с результатами */}
  <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-red-500/20">
    <div className="flex items-center justify-center gap-2 mb-4">
      <Calculator className="w-5 h-5 text-red-400" />
      <p className="text-lg font-medium text-gray-300">Результат</p>
    </div>
    
    {vatResult ? (
      <div className="space-y-4">
  <div className="grid grid-cols-2 gap-3">
    {/* БЛОК 1: Сумма без НДС */}
    <div className="bg-gray-800 p-3 rounded-lg">
      <p className="text-sm text-gray-400">Сумма без НДС</p>
      <p className="text-xl font-bold text-green-400 break-all">
        {vatResult.amountWithoutVAT ? 
          vatResult.amountWithoutVAT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") 
          : '0.00'} ₽
      </p>
    </div>
    
    {/* БЛОК 2: Сумма с НДС */}
    <div className="bg-gray-800 p-3 rounded-lg">
      <p className="text-sm text-gray-400">Сумма с НДС</p>
      <p className="text-xl font-bold text-blue-400 break-all">
        {vatResult.amountWithVAT ? 
          vatResult.amountWithVAT.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") 
          : '0.00'} ₽
      </p>
    </div>
  </div>
  
  {/* БЛОК 3: Сумма НДС */}
  <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-300">Сумма НДС</p>
        <p className="text-2xl font-bold text-red-400 break-all">
          {vatResult.vatValue ? 
            vatResult.vatValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") 
            : '0.00'} ₽
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">Ставка</p>
        <p className="text-lg font-medium text-red-300">
          {vatRate}%
        </p>
      </div>
    </div>
  </div>
</div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">Введите сумму для расчета</p>
        <p className="text-xs text-gray-600 mt-2">Используйте быстрые кнопки или введите свою сумму</p>
      </div>
    )}
  </div>

  {/* Информационная подсказка */}
  <div className="mt-4 p-3 bg-red-900/10 rounded-lg border border-red-500/10">
    <p className="text-xs text-red-300/80 text-center">💡 В России основная ставка НДС — 20%</p>
  </div>
</div> {/* ← Конец карточки НДС (ТОЛЬКО ОДИН </div>!) */}

{/* КАЛЬКУЛЯТОР 7: ШИННЫЙ */}
<div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 relative md:col-span-2">
  
  <button onClick={resetTireCalculator} className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-orange-500/20 transition-all duration-300 group" title="Сбросить значения">
    <RefreshCw className="w-5 h-5 text-orange-400 group-hover:rotate-180 transition-transform duration-500" />
  </button>
  
  <div className="flex items-center gap-3 mb-6">
    <div className="p-3 bg-orange-600/20 rounded-xl">
      <Settings className="w-8 h-8 text-orange-500" />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-bold text-white leading-tight">Шинный калькулятор</span>
    </div>
  </div>
  
  <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center">
    <p className="text-sm font-mono text-orange-300">Сравнение размеров шин</p>
    <p className="text-xs text-gray-400 mt-1">205/55 R16 → 215/60 R17</p>
  </div>

  <div className="grid grid-cols-2 gap-6 mb-8">
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
      <h3 className="text-orange-300 mb-3 text-center">Старая шина</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Ширина</label>
          <input type="number" value={tireWidth1} onChange={(e) => setTireWidth1(e.target.value)} className="w-full p-3 text-center rounded-lg bg-gray-800 text-white border border-gray-600" placeholder="205" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Профиль</label>
          <input type="number" value={tireProfile1} onChange={(e) => setTireProfile1(e.target.value)} className="w-full p-3 text-center rounded-lg bg-gray-800 text-white border border-gray-600" placeholder="55" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Диаметр</label>
          <input type="number" value={tireDiameter1} onChange={(e) => setTireDiameter1(e.target.value)} className="w-full p-3 text-center rounded-lg bg-gray-800 text-white border border-gray-600" placeholder="16" />
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="inline-block px-3 py-1 bg-gray-800 rounded-lg text-orange-300 font-mono">
          {tireWidth1}/{tireProfile1} R{tireDiameter1}
        </div>
      </div>
    </div>

    <div className="bg-gray-900 p-4 rounded-xl border border-green-700/30">
      <h3 className="text-green-300 mb-3 text-center">Новая шина</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Ширина</label>
          <input type="number" value={tireWidth2} onChange={(e) => setTireWidth2(e.target.value)} className="w-full p-3 text-center rounded-lg bg-gray-800 text-white border border-gray-600" placeholder="215" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Профиль</label>
          <input type="number" value={tireProfile2} onChange={(e) => setTireProfile2(e.target.value)} className="w-full p-3 text-center rounded-lg bg-gray-800 text-white border border-gray-600" placeholder="60" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Диаметр</label>
          <input type="number" value={tireDiameter2} onChange={(e) => setTireDiameter2(e.target.value)} className="w-full p-3 text-center rounded-lg bg-gray-800 text-white border border-gray-600" placeholder="17" />
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="inline-block px-3 py-1 bg-gray-800 rounded-lg text-green-300 font-mono">
          {tireWidth2}/{tireProfile2} R{tireDiameter2}
        </div>
      </div>
    </div>
  </div>

  <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-orange-500/20">
    <div className="flex items-center justify-center gap-2 mb-4">
      <Calculator className="w-5 h-5 text-orange-400" />
      <p className="text-lg font-medium text-gray-300">Результаты сравнения</p>
    </div>
    
    {tireResult ? (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Разница диаметра</p>
            <p className={`text-xl font-bold ${tireResult.diameterPercent && tireResult.diameterPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {tireResult.diameterPercent ? tireResult.diameterPercent.toFixed(2) : '0.00'}%
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Погрешность спидометра</p>
            <p className="text-xl font-bold text-orange-400">
              {tireResult.speedometerDiff ? tireResult.speedometerDiff.toFixed(2) : '0.00'} км/ч
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Соответствие ПДД</p>
              <p className={`text-2xl font-bold ${tireResult.isLegal ? 'text-green-400' : 'text-red-400'}`}>
                {tireResult.isLegal ? '✅ Допустимо' : '❌ Превышение'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Допуск</p>
              <p className="text-lg font-medium text-orange-300">
                ±3%
              </p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">Введите размеры шин для расчета</p>
      </div>
    )}
  </div>

  {tireResult && (
    <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700">
      <h3 className="text-orange-300 mb-3 text-center">Детали расчета</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs text-gray-400">Диаметр старой</p>
          <p className="text-lg font-medium text-orange-300">
            {tireResult.diameter1 ? tireResult.diameter1.toFixed(1) : '0.0'} мм
          </p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs text-gray-400">Диаметр новой</p>
          <p className="text-lg font-medium text-green-300">
            {tireResult.diameter2 ? tireResult.diameter2.toFixed(1) : '0.0'} мм
          </p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs text-gray-400">Разница по высоте</p>
          <p className="text-lg font-medium text-blue-300">
            {tireResult.diameterDiff ? tireResult.diameterDiff.toFixed(1) : '0.0'} мм
          </p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs text-gray-400">Погрешность одометра</p>
          <p className="text-lg font-medium text-purple-300">
            {tireResult.odometerDiff ? Math.abs(tireResult.odometerDiff).toFixed(1) : '0.0'} км
          </p>
        </div>
      </div>
    </div>
  )}

  <div className="mt-4 p-3 bg-orange-900/10 rounded-lg border border-orange-500/10">
    <p className="text-xs text-orange-300/80 text-center">
      💡 По ПДД отклонение диаметра не должно превышать ±3%
    </p>
  </div>

</div>

{/* КОНЕЦ ШИННОГО КАЛЬКУЛЯТОРА */}

</div> {/* ← Этот закрывающий </div> - конец ВСЕЙ карточки калькулятора НДС */}
    
      
      <div className="text-center mt-20 text-gray-500">
        <p className="text-lg">Набор прочих калькуляторов для любых жизненных ситуаций! </p>
        <p className="text-sm mt-2 text-gray-600">Добавь сайт в закладки чтобы не потерять</p>
      </div>
    </div> 
  );
}