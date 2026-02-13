// app/ipoteka/ipotechnyy-kalkulyator/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function IpotechnyyKalkulyatorPage() {
  // Состояния калькулятора
  const [calcType, setCalcType] = useState<"payment" | "amount" | "term" | "rate">("payment");
  const [loanAmount, setLoanAmount] = useState<string>("2000000");
  const [interestRate, setInterestRate] = useState<string>("7.5");
  const [loanTerm, setLoanTerm] = useState<string>("20");
  const [monthlyPayment, setMonthlyPayment] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [totalOverpayment, setTotalOverpayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  // Функция расчёта аннуитетного платежа
  const calculateAnnuityPayment = useCallback((
    amount: number,
    rate: number,
    term: number
  ) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;
    
    if (monthlyRate === 0) {
      return amount / numberOfPayments;
    }
    
    const coefficient = (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return amount * coefficient;
  }, []);

  // Функция расчёта
  const calculate = useCallback(() => {
    const amount = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const term = parseFloat(loanTerm) || 0;
    const payment = parseFloat(monthlyPayment) || 0;
    
    let calculatedResult = 0;
    
    switch(calcType) {
      case "payment": // Расчёт ежемесячного платежа
        if (amount > 0 && rate >= 0 && term > 0) {
          calculatedResult = calculateAnnuityPayment(amount, rate, term);
        }
        break;
        
      case "amount": // Расчёт суммы кредита
        if (payment > 0 && rate >= 0 && term > 0) {
          const monthlyRate = rate / 100 / 12;
          const numberOfPayments = term * 12;
          
          if (monthlyRate === 0) {
            calculatedResult = payment * numberOfPayments;
          } else {
            const coefficient = (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            calculatedResult = payment / coefficient;
          }
        }
        break;
        
      case "term": // Расчёт срока кредита
        if (amount > 0 && rate >= 0 && payment > 0) {
          const monthlyRate = rate / 100 / 12;
          
          if (monthlyRate === 0) {
            calculatedResult = amount / payment;
          } else if (payment > amount * monthlyRate) {
            calculatedResult = Math.log(payment / (payment - amount * monthlyRate)) / 
                              Math.log(1 + monthlyRate);
            calculatedResult = calculatedResult / 12; // Переводим месяцы в годы
          }
        }
        break;
        
      case "rate": // Расчёт процентной ставки (упрощённо)
        // Для точного расчёта нужен итерационный метод, здесь упрощение
        if (amount > 0 && term > 0 && payment > 0) {
          const approximateRate = ((payment * term * 12 / amount - 1) / term) * 100 * 0.7;
          calculatedResult = Math.max(0, approximateRate);
        }
        break;
    }
    
    const finalResult = isNaN(calculatedResult) || !isFinite(calculatedResult) ? null : calculatedResult;
    setResult(finalResult);
    
    // Расчёт переплаты и общей суммы
    if (finalResult !== null) {
      let total = 0;
      let overpayment = 0;
      
      switch(calcType) {
        case "payment":
          total = finalResult * term * 12;
          overpayment = total - amount;
          break;
        case "amount":
          total = payment * term * 12;
          overpayment = total - finalResult;
          break;
        case "term":
          total = payment * finalResult * 12;
          overpayment = total - amount;
          break;
        case "rate":
          total = payment * term * 12;
          overpayment = total - amount;
          break;
      }
      
      setTotalPayment(Math.round(total));
      setTotalOverpayment(Math.round(overpayment));
    } else {
      setTotalPayment(0);
      setTotalOverpayment(0);
    }
  }, [calcType, loanAmount, interestRate, loanTerm, monthlyPayment, calculateAnnuityPayment]);

  // Автоматический пересчёт
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Сброс значений
  const resetCalculator = () => {
    setLoanAmount("2000000");
    setInterestRate("7.5");
    setLoanTerm("20");
    setMonthlyPayment("");
    setResult(null);
    setCalcType("payment");
    setTotalOverpayment(0);
    setTotalPayment(0);
  };

  // Форматирование чисел
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(value));
  };

  // Получение единиц измерения
  const getUnit = () => {
    switch(calcType) {
      case "payment": return "₽/мес";
      case "amount": return "₽";
      case "term": return "лет";
      case "rate": return "% годовых";
      default: return "";
    }
  };

  // Получение формулы
  const getFormula = () => {
    switch(calcType) {
      case "payment": return "A = K × S";
      case "amount": return "S = A / K";
      case "term": return "n = log(A/(A - S×i)) / log(1+i)";
      case "rate": return "i ≈ (12A/S - 1/n) × k";
      default: return "A = K × S";
    }
  };

  // Получение описания формулы
  const getFormulaDescription = () => {
    switch(calcType) {
      case "payment": return "A — ежемесячный платёж, S — сумма кредита, K — коэффициент аннуитета";
      case "amount": return "S — сумма кредита, A — ежемесячный платёж, K — коэффициент аннуитета";
      case "term": return "n — срок кредита (мес), A — платёж, S — сумма, i — месячная ставка";
      case "rate": return "i — процентная ставка, A — платёж, S — сумма, n — срок";
      default: return "Формула аннуитетного платежа";
    }
  };

  // Цветовая схема #06b6d4 (cyan-500)
  const COLORS = {
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    secondary: '#22d3ee',
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
    text: {
      main: '#cbd5e1',
      muted: '#94a3b8',
      dark: '#64748b'
    },
    gradient: {
      from: '#06b6d4',
      to: '#22d3ee'
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
    marginBottom: '8px'
  }}>
    <span style={{ marginRight: '10px' }}>🏠</span>
    <span style={{
      background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>
      Ипотечный калькулятор
    </span>
  </h1>
  <p style={{ color: COLORS.text.muted }}>
    Расчёт аннуитетных платежей по ипотеке
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
              onClick={() => setCalcType("payment")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "payment" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "payment" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "payment" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Платёж
            </button>
            <button
              onClick={() => setCalcType("amount")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "amount" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "amount" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "amount" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Сумма кредита
            </button>
            <button
              onClick={() => setCalcType("term")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "term" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "term" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "term" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Срок
            </button>
            <button
              onClick={() => setCalcType("rate")}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                background: calcType === "rate" 
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
                  : 'transparent',
                color: calcType === "rate" ? 'white' : COLORS.text.muted,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: calcType === "rate" ? 'bold' : 'normal',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              Ставка
            </button>
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            {calcType === "payment" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Сумма кредита, ₽
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 2000000"
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[1000000, 2000000, 3000000, 5000000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setLoanAmount(val.toString())}
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
                        {val/1000000} млн
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Процентная ставка, % годовых
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 7.5"
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[6.5, 7.5, 8.5, 9.5].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setInterestRate(val.toString())}
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
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Срок кредита, лет
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 20"
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[5, 10, 15, 20, 25].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setLoanTerm(val.toString())}
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
                        {val} лет
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {calcType === "amount" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Ежемесячный платёж, ₽
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 15000"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Процентная ставка, % годовых
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 7.5"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Срок кредита, лет
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 20"
                  />
                </div>
              </>
            )}

            {calcType === "term" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Сумма кредита, ₽
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 2000000"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Ежемесячный платёж, ₽
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 15000"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Процентная ставка, % годовых
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 7.5"
                  />
                </div>
              </>
            )}

            {calcType === "rate" && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Сумма кредита, ₽
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 2000000"
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Ежемесячный платёж, ₽
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 15000"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main }}>
                    Срок кредита, лет
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: COLORS.border,
                      border: `1px solid #475569`,
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Например: 20"
                  />
                </div>
              </>
            )}
          </div>

          {/* ОСНОВНОЙ РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px',
            background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
              {result !== null ? (
                <span style={{
                  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {calcType === "payment" && `${formatCurrency(result)} ₽`}
                  {calcType === "amount" && `${formatCurrency(result)} ₽`}
                  {calcType === "term" && `${result.toFixed(1)} лет`}
                  {calcType === "rate" && `${result.toFixed(2)} %`}
                </span>
              ) : (
                <span style={{ color: COLORS.text.muted }}>—</span>
              )}
            </div>
            <div style={{ color: COLORS.text.muted, marginBottom: '16px' }}>
              {calcType === "payment" && "Ежемесячный платёж"}
              {calcType === "amount" && "Сумма кредита"}
              {calcType === "term" && "Срок кредита"}
              {calcType === "rate" && "Процентная ставка"}
            </div>
            
            {/* ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ */}
            {result !== null && totalPayment > 0 && (
              <div style={{ 
                paddingTop: '16px', 
                borderTop: `1px solid ${COLORS.border}`,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginTop: '16px'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: COLORS.text.muted, fontSize: '14px' }}>Общая выплата</div>
                  <div style={{ color: COLORS.text.main, fontSize: '18px', fontWeight: 'bold' }}>
                    {formatCurrency(totalPayment)} ₽
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: COLORS.text.muted, fontSize: '14px' }}>Переплата</div>
                  <div style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold' }}>
                    {formatCurrency(totalOverpayment)} ₽
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
              {getFormulaDescription()}
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
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Как работает ипотечный калькулятор?
          </h2>
          <p style={{ color: COLORS.text.main, marginBottom: '16px' }}>
            Калькулятор использует формулу <strong>аннуитетных платежей</strong>, 
            которая является стандартом для большинства ипотечных кредитов в России. 
            Это позволяет точно рассчитать ежемесячный платёж и другие параметры кредита.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                📊 Аннуитетный платёж
              </h3>
              <p style={{ color: COLORS.text.main, fontSize: '14px', marginBottom: '12px' }}>
                Ежемесячный платёж остаётся одинаковым на весь срок кредита.
                Формула расчёта:
              </p>
              <div style={{ 
                backgroundColor: COLORS.border, 
                padding: '12px', 
                borderRadius: '6px',
                fontFamily: 'monospace'
              }}>
                <code style={{ color: COLORS.secondary, fontSize: '14px', lineHeight: '1.6' }}>
                  A = S × (i × (1 + i)ⁿ) / ((1 + i)ⁿ - 1)<br/>
                  где:<br/>
                  A — ежемесячный платёж<br/>
                  S — сумма кредита<br/>
                  i — месячная процентная ставка<br/>
                  n — количество платежей
                </code>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                💰 Что влияет на платёж?
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>• <strong>Сумма кредита:</strong> чем больше, тем выше платёж</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Процентная ставка:</strong> основной фактор стоимости кредита</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Срок кредита:</strong> чем дольше, тем меньше платёж, но больше переплата</p>
                <p>• <strong>Тип платежа:</strong> аннуитетный или дифференцированный</p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: COLORS.background, 
              padding: '16px', 
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ fontSize: '18px', color: COLORS.primary, marginBottom: '8px' }}>
                🏦 Текущие ставки по ипотеке
              </h3>
              <div style={{ color: COLORS.text.main, fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>• <strong>Семейная ипотека:</strong> от 6%</p>
                <p style={{ marginBottom: '8px' }}>• <strong>IT-ипотека:</strong> от 5%</p>
                <p style={{ marginBottom: '8px' }}>• <strong>Стандартная ипотека:</strong> от 7.5%</p>
                <p>• <strong>Льготные программы:</strong> от 4%</p>
              </div>
            </div>
          </div>
          
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '12px',
            color: COLORS.primary 
          }}>
            Советы по расчёту ипотеки
          </h3>
          <ul style={{ color: COLORS.text.main, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Платёж не должен превышать 40%</strong> от вашего ежемесячного дохода
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Учитывайте дополнительные расходы:</strong> страховка, оценка, нотариус
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Сравнивайте предложения</strong> разных банков
            </li>
            <li style={{ marginBottom: '8px' }}>
              • <strong>Рассмотрите досрочное погашение</strong> для уменьшения переплаты
            </li>
            <li>
              • <strong>Используйте налоговый вычет</strong> 13% от суммы ипотеки
            </li>
          </ul>
          
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(6, 182, 212, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Важно:</strong> Данный калькулятор предоставляет ориентировочные расчёты. 
              Точные условия ипотеки уточняйте в банке. 
              Процентные ставки могут меняться в зависимости от программы, суммы и срока кредита.
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
            Ипотечный калькулятор • Версия 1.0 • {new Date().getFullYear()} год
          </p>
          <p style={{ marginTop: '8px' }}>
            Расчеты носят информационный характер. Точные условия уточняйте в банке.
          </p>
        </div>
      </div>
    </div>
  );
}