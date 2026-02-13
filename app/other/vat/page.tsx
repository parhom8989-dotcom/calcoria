// app/nds/kalkulyator-nds/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function KalkulyatorNDSPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"calc_nds" | "add_nds" | "remove_nds" | "total_nds">("calc_nds");
  const [ndsRate, setNdsRate] = useState<number>(20);
  const [customRate, setCustomRate] = useState<string>("");
  const [useCustomRate, setUseCustomRate] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("10000");
  const [result, setResult] = useState<number | null>(null);
  const [ndsAmount, setNdsAmount] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [amountWithoutNds, setAmountWithoutNds] = useState<number | null>(null);
  const [ndsIncluded, setNdsIncluded] = useState<number | null>(null);
  
  // Для расчёта общей суммы НДС
  const [amounts, setAmounts] = useState<string[]>(["10000", "5000", "2500"]);
  const [totalNdsResult, setTotalNdsResult] = useState<number | null>(null);
  const [totalWithNdsResult, setTotalWithNdsResult] = useState<number | null>(null);

  // Цветовая схема #ef4444 (red-500)
  const COLORS = {
    primary: '#ef4444',
    primaryHover: '#dc2626',
    secondary: '#f87171',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#ef4444',
      to: '#f87171'
    }
  };

  // Ставки НДС в РФ
  const NDS_RATES = [
    { value: 20, name: "20% (основная)", description: "Большинство товаров, работ, услуг" },
    { value: 10, name: "10% (льготная)", description: "Продукты, детские товары, книги, медикаменты" },
    { value: 0, name: "0% (нулевая)", description: "Экспорт, международные перевозки" }
  ];

  // Функция расчёта
  const calculate = useCallback(() => {
    const num = parseFloat(amount) || 0;
    
    // Определяем текущую ставку
    let currentRate = ndsRate;
    if (useCustomRate) {
      const custom = parseFloat(customRate);
      currentRate = !isNaN(custom) && custom >= 0 ? custom : 0;
    }
    const rate = currentRate / 100;
    
    switch(calcType) {
      case "calc_nds": // Выделить НДС из суммы
        if (num > 0) {
          const nds = (num * rate) / (1 + rate);
          const withoutNds = num - nds;
          setNdsAmount(nds);
          setAmountWithoutNds(withoutNds);
          setTotalAmount(num);
          setResult(null);
        }
        break;
        
      case "add_nds": // Начислить НДС сверху
        if (num > 0) {
          const nds = num * rate;
          const total = num + nds;
          setNdsAmount(nds);
          setTotalAmount(total);
          setAmountWithoutNds(num);
          setResult(null);
        }
        break;
        
      case "remove_nds": // Убрать НДС из суммы
        if (num > 0) {
          const withoutNds = num / (1 + rate);
          const nds = num - withoutNds;
          setNdsAmount(nds);
          setAmountWithoutNds(withoutNds);
          setTotalAmount(num);
          setResult(null);
        }
        break;
        
      case "total_nds": // Расчёт общей суммы НДС по нескольким счетам
        // Эта логика будет обрабатываться отдельно
        break;
    }
  }, [calcType, amount, ndsRate, customRate, useCustomRate]);

  // Расчёт общей суммы НДС
  const calculateTotalNds = useCallback(() => {
    // Определяем текущую ставку
    let currentRate = ndsRate;
    if (useCustomRate) {
      const custom = parseFloat(customRate);
      currentRate = !isNaN(custom) && custom >= 0 ? custom : 0;
    }
    const rate = currentRate / 100;
    
    let totalNds = 0;
    let totalWithNds = 0;
    
    amounts.forEach(amountStr => {
      const num = parseFloat(amountStr) || 0;
      if (num > 0) {
        const nds = (num * rate) / (1 + rate);
        totalNds += nds;
        totalWithNds += num;
      }
    });
    
    setTotalNdsResult(totalNds);
    setTotalWithNdsResult(totalWithNds);
  }, [amounts, ndsRate, customRate, useCustomRate]);

  // Автоматический пересчёт
  useEffect(() => {
    if (calcType !== "total_nds") {
      calculate();
    } else {
      calculateTotalNds();
    }
  }, [calculate, calculateTotalNds, calcType]);

  // Сброс значений
  const resetCalculator = () => {
    setCalcType("calc_nds");
    setNdsRate(20);
    setCustomRate("");
    setUseCustomRate(false);
    setAmount("10000");
    setAmounts(["10000", "5000", "2500"]);
    setNdsAmount(null);
    setTotalAmount(null);
    setAmountWithoutNds(null);
    setTotalNdsResult(null);
    setTotalWithNdsResult(null);
  };

  // Добавить поле для суммы
  const addAmountField = () => {
    setAmounts([...amounts, ""]);
  };

  // Удалить поле для суммы
  const removeAmountField = (index: number) => {
    if (amounts.length > 1) {
      const newAmounts = [...amounts];
      newAmounts.splice(index, 1);
      setAmounts(newAmounts);
    }
  };

  // Обновить сумму по индексу
  const updateAmount = (index: number, value: string) => {
    const newAmounts = [...amounts];
    newAmounts[index] = value;
    setAmounts(newAmounts);
  };

  // Форматирование чисел
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Получение описания режима
  const getModeDescription = () => {
    switch(calcType) {
      case "calc_nds": return "Выделить НДС из суммы";
      case "add_nds": return "Начислить НДС сверху";
      case "remove_nds": return "Убрать НДС из суммы";
      case "total_nds": return "Общая сумма НДС по нескольким счетам";
      default: return "";
    }
  };

  // Получение формулы
  const getFormula = () => {
    // Определяем текущую ставку
    let currentRate = ndsRate;
    if (useCustomRate) {
      const custom = parseFloat(customRate);
      currentRate = !isNaN(custom) && custom >= 0 ? custom : 0;
    }
    
    switch(calcType) {
      case "calc_nds": return `НДС = Сумма × ${currentRate} ÷ (100 + ${currentRate})`;
      case "add_nds": return `НДС = Сумма × ${currentRate} ÷ 100`;
      case "remove_nds": return `Сумма без НДС = Сумма ÷ (1 + ${currentRate} ÷ 100)`;
      case "total_nds": return `Общий НДС = Σ НДС по каждому счёту`;
      default: return "";
    }
  };

  // Получение текущей ставки для отображения
  const getCurrentRateDisplay = () => {
    if (useCustomRate) {
      const custom = parseFloat(customRate);
      if (!isNaN(custom) && custom >= 0) {
        return `${custom}%`;
      }
      return "—";
    }
    return `${ndsRate}%`;
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
              <span style={{ fontSize: '32px' }}>💰</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Калькулятор НДС
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              Расчёт НДС по стандартным и пользовательским ставкам
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
              onClick={() => setCalcType("calc_nds")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "calc_nds" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "calc_nds" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "calc_nds" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Выделить НДС
            </button>
            <button
              onClick={() => setCalcType("add_nds")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "add_nds" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "add_nds" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "add_nds" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Начислить НДС
            </button>
            <button
              onClick={() => setCalcType("remove_nds")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "remove_nds" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "remove_nds" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "remove_nds" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Убрать НДС
            </button>
            <button
              onClick={() => setCalcType("total_nds")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "total_nds" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "total_nds" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "total_nds" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Общий НДС
            </button>
          </div>

          {/* Выбор ставки НДС */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
              Ставка НДС
            </label>
            
            {/* Кнопки стандартных ставок */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '12px'
            }}>
              {NDS_RATES.map((rate) => (
  <button
    key={rate.value}
    onClick={() => {
      if (rate.value === 20 || rate.value === 10 || rate.value === 0) {
        setNdsRate(rate.value);
      }
      setUseCustomRate(false);
      setCustomRate("");
    }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: !useCustomRate && ndsRate === rate.value 
                      ? COLORS.primary 
                      : COLORS.background,
                    border: `1px solid ${!useCustomRate && ndsRate === rate.value ? COLORS.primary : COLORS.border}`,
                    borderRadius: '8px',
                    color: !useCustomRate && ndsRate === rate.value ? 'white' : COLORS.text.main,
                    fontSize: '16px',
                    fontWeight: !useCustomRate && ndsRate === rate.value ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: useCustomRate ? 0.5 : 1
                  }}
                  disabled={useCustomRate}
                >
                  {rate.name}
                </button>
              ))}
            </div>
            
            {/* Своя ставка */}
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <button
                onClick={() => {
                  setUseCustomRate(!useCustomRate);
                  if (!useCustomRate) {
                    setCustomRate("");
                  }
                }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: useCustomRate 
                    ? COLORS.primary 
                    : COLORS.background,
                  border: `1px solid ${useCustomRate ? COLORS.primary : COLORS.border}`,
                  borderRadius: '8px',
                  color: useCustomRate ? 'white' : COLORS.text.main,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                ✏️ Своя ставка
              </button>
              
              <input
                type="number"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                placeholder="%"
                disabled={!useCustomRate}
                style={{
                  width: '100px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: useCustomRate ? COLORS.border : COLORS.background,
                  border: `1px solid ${useCustomRate ? COLORS.primary : COLORS.border}`,
                  color: useCustomRate ? 'white' : COLORS.text.muted,
                  fontSize: '16px',
                  textAlign: 'center',
                  opacity: useCustomRate ? 1 : 0.5,
                  cursor: useCustomRate ? 'text' : 'not-allowed'
                }}
              />
              <span style={{ color: COLORS.text.muted }}>%</span>
            </div>
            
            {/* Описание текущей ставки */}
            <div style={{ fontSize: '12px', color: COLORS.text.dark }}>
              {!useCustomRate ? (
                NDS_RATES.find(r => r.value === ndsRate)?.description
              ) : (
                customRate ? `Пользовательская ставка: ${customRate}%` : "Введите свою ставку НДС"
              )}
            </div>
          </div>

          {/* Поля ввода в зависимости от режима */}
          {calcType !== "total_nds" ? (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                {calcType === "calc_nds" && "Сумма с НДС (₽)"}
                {calcType === "add_nds" && "Сумма без НДС (₽)"}
                {calcType === "remove_nds" && "Сумма с НДС (₽)"}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid #475569`,
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Введите сумму"
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {[1000, 5000, 10000, 50000, 100000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
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
                    {val.toLocaleString('ru-RU')} ₽
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Режим "Общий НДС" - несколько сумм */
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                Суммы с НДС (₽)
              </label>
              {amounts.map((value, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginBottom: '8px',
                  alignItems: 'center'
                }}>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateAmount(index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder={`Сумма ${index + 1}`}
                  />
                  <button
                    onClick={() => removeAmountField(index)}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: COLORS.background,
                      border: `1px solid ${COLORS.primary}`,
                      borderRadius: '8px',
                      color: COLORS.primary,
                      cursor: 'pointer',
                      fontSize: '16px',
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
                    disabled={amounts.length === 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={addAmountField}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: COLORS.background,
                  border: `1px dashed ${COLORS.primary}`,
                  borderRadius: '8px',
                  color: COLORS.primary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = `rgba(239, 68, 68, 0.1)`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.background;
                }}
              >
                + Добавить сумму
              </button>
            </div>
          )}

          {/* РЕЗУЛЬТАТЫ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px',
            background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
          }}>
            {calcType !== "total_nds" ? (
              <div>
                {/* Основные результаты для 3 режимов */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: ndsAmount !== null && totalAmount !== null && amountWithoutNds !== null 
                    ? '1fr 1fr 1fr' 
                    : '1fr', 
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  {amountWithoutNds !== null && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                        Сумма без НДС
                      </div>
                      <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: COLORS.text.main
                      }}>
                        {formatCurrency(amountWithoutNds)} ₽
                      </div>
                    </div>
                  )}
                  
                  {ndsAmount !== null && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                        Сумма НДС ({getCurrentRateDisplay()})
                      </div>
                      <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: COLORS.primary
                      }}>
                        {formatCurrency(ndsAmount)} ₽
                      </div>
                    </div>
                  )}
                  
                  {totalAmount !== null && calcType !== "add_nds" && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                        Сумма с НДС
                      </div>
                      <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: COLORS.secondary
                      }}>
                        {formatCurrency(totalAmount)} ₽
                      </div>
                    </div>
                  )}
                  
                  {totalAmount !== null && calcType === "add_nds" && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                        Итого с НДС
                      </div>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: 'bold',
                        background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {formatCurrency(totalAmount)} ₽
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Дополнительная информация */}
                <div style={{ 
                  paddingTop: '16px', 
                  borderTop: `1px solid ${COLORS.border}`,
                  marginTop: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: COLORS.text.muted }}>
                    {calcType === "calc_nds" && `НДС ${getCurrentRateDisplay()} выделен из суммы с НДС`}
                    {calcType === "add_nds" && `НДС ${getCurrentRateDisplay()} начислен сверху`}
                    {calcType === "remove_nds" && `НДС ${getCurrentRateDisplay()} убран из суммы`}
                  </div>
                </div>
              </div>
            ) : (
              /* Результаты для режима "Общий НДС" */
              <div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Общая сумма счетов
                    </div>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      color: COLORS.text.main
                    }}>
                      {totalWithNdsResult !== null ? formatCurrency(totalWithNdsResult) : "0.00"} ₽
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Общая сумма НДС ({getCurrentRateDisplay()})
                    </div>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      color: COLORS.primary
                    }}>
                      {totalNdsResult !== null ? formatCurrency(totalNdsResult) : "0.00"} ₽
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  paddingTop: '16px', 
                  borderTop: `1px solid ${COLORS.border}`,
                  marginTop: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: COLORS.text.muted }}>
                    Количество счетов: {amounts.filter(a => parseFloat(a) > 0).length}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ФОРМУЛА */}
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
              marginBottom: '8px',
              fontFamily: 'monospace'
            }}>
              {getFormula()}
            </div>
            <div style={{ color: COLORS.text.dark, fontSize: '14px' }}>
              {getModeDescription()} • Текущая ставка: {getCurrentRateDisplay()}
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
            <span style={{ fontSize: '28px' }}>📋</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Что такое НДС и как его считать?
            </span>
          </h2>
          <p style={{ color: COLORS.text.main, marginBottom: '16px' }}>
            НДС (налог на добавленную стоимость) — косвенный налог, который включён в цену товаров 
            и услуг. В России действуют три ставки: <strong>20%</strong> (основная), <strong>10%</strong> 
            (льготная) и <strong>0%</strong> (экспорт). Калькулятор также позволяет использовать 
            <strong> пользовательские ставки</strong> для любых других значений.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🧮 Формулы расчёта НДС
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>1. Выделить НДС из суммы:</strong><br/>
                  НДС = Сумма × Ставка ÷ (100 + Ставка)
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>2. Начислить НДС сверху:</strong><br/>
                  НДС = Сумма × Ставка ÷ 100<br/>
                  Итого = Сумма + НДС
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>3. Убрать НДС из суммы:</strong><br/>
                  Сумма без НДС = Сумма ÷ (1 + Ставка ÷ 100)<br/>
                  НДС = Сумма − Сумма без НДС
                </p>
                <p>
                  <strong>4. Общий НДС по нескольким счетам:</strong><br/>
                  Суммируйте НДС каждого счёта, выделенный по формуле 1
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
                📊 Когда применяются разные ставки?
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>
                  • <strong>20%:</strong> Большинство товаров, работ и услуг<br/>
                  • <strong>10%:</strong> Продовольственные товары, детские товары, книги, медикаменты<br/>
                  • <strong>0%:</strong> Экспортные операции, международные перевозки<br/>
                  • <strong>Без НДС:</strong> УСН, ЕНВД, патент (освобождение от налога)
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
                🌍 Ставки НДС в разных странах
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>
                  • <strong>Стандартная ставка в ЕС:</strong> 17-27%<br/>
                  • <strong>Германия:</strong> 19%<br/>
                  • <strong>Франция:</strong> 20%<br/>
                  • <strong>Великобритания:</strong> 20%<br/>
                  • <strong>Швейцария:</strong> 7.7%<br/>
                  • <strong>Япония:</strong> 10%<br/>
                  • <strong>США:</strong> Нет федерального НДС, есть Sales Tax (штаты)
                </p>
              </div>
            </div>
          </div>
          
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '12px',
            color: COLORS.primary 
          }}>
            Примеры расчёта
          </h3>
          <ul style={{ color: COLORS.text.main, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Выделить НДС 20% из 120 000 ₽:</strong> 120 000 × 20 ÷ 120 = <strong>20 000 ₽</strong>
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Начислить НДС 10% на 50 000 ₽:</strong> 50 000 × 10% = <strong>5 000 ₽</strong>, итого: <strong>55 000 ₽</strong>
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Убрать НДС 20% из 60 000 ₽:</strong> 60 000 ÷ 1.2 = <strong>50 000 ₽</strong> (без НДС)
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Своя ставка 15% из 115 000 ₽:</strong> 115 000 × 15 ÷ 115 = <strong>15 000 ₽</strong>
            </li>
          </ul>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(239, 68, 68, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Важно:</strong> С 1 января 2024 года в России применяются только 
              ставки 20%, 10% и 0%. Льготные ставки 15% и 7.5% действовали только в 2023 году 
              для отдельных отраслей. Пользовательские ставки предназначены для ознакомления 
              и международных расчётов.
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
            Калькулятор НДС • Стандартные и пользовательские ставки • {new Date().getFullYear()} год
          </p>
          <p style={{ marginTop: '8px' }}>
            Расчёты носят информационный характер. Для точных бухгалтерских расчётов используйте специализированное ПО.
          </p>
        </div>
      </div>
    </div>
  );
}