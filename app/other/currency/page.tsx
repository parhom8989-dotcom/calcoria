// app/valyuta/konverter-valyut/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function KonverterValyutPage() {
  // Состояния
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('RUB');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRates, setExchangeRates] = useState({ USD: 0, EUR: 0, CNY: 0 });
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  // Цветовая схема #f59e0b
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
    },
    gradient: {
      from: '#f59e0b',
      to: '#fbbf24'
    }
  };

  // Флаг для популярных валют
  const popularCurrencies = ["USD", "EUR", "GBP", "CNY", "TRY", "KZT"];

  // ========== ТВОЙ РАБОЧИЙ КОД ==========
  // Функция загрузки курсов с CBR-XML-Daily.Ru
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
      const data = await response.json();
      
      // Извлекаем курсы к рублю
      setExchangeRates({
        USD: data.Valute.USD.Value,
        EUR: data.Valute.EUR.Value,
        CNY: data.Valute.CNY.Value,
      });

      // Дата обновления
      const date = new Date(data.Date);
      setLastUpdate(`${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`);

    } catch (error) {
      console.error('Ошибка при загрузке курсов валют:', error);
      // Запасные курсы
      setExchangeRates({ USD: 77.1880, EUR: 91.7113, CNY: 11.1582 });
      setLastUpdate('13.02.2026 (офлайн)');
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Загружаем курсы при первом рендере
  useEffect(() => {
    fetchExchangeRates();
    // Обновляем раз в час
    const interval = setInterval(fetchExchangeRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
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

  // Автоконвертация при изменении полей
  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  // Сброс
  const resetConverter = () => {
    setAmount('');
    setFromCurrency('USD');
    setToCurrency('RUB');
    setConvertedAmount(null);
  };

  // Поменять местами
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Форматирование
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Список валют
  const currencies = [
    { code: "USD", name: "Доллар США", flag: "🇺🇸", symbol: "$" },
    { code: "EUR", name: "Евро", flag: "🇪🇺", symbol: "€" },
    { code: "RUB", name: "Российский рубль", flag: "🇷🇺", symbol: "₽" },
    { code: "GBP", name: "Фунт стерлингов", flag: "🇬🇧", symbol: "£" },
    { code: "CNY", name: "Китайский юань", flag: "🇨🇳", symbol: "¥" },
    { code: "TRY", name: "Турецкая лира", flag: "🇹🇷", symbol: "₺" },
    { code: "KZT", name: "Казахстанский тенге", flag: "🇰🇿", symbol: "₸" },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
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
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '32px' }}>💱</span>
              <span style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Конвертер валют
              </span>
            </h1>
            <p style={{ color: COLORS.text.muted }}>
              Курсы ЦБ РФ • Актуально на {lastUpdate || 'загрузка...'} {isLoadingRates && '⏳'}
            </p>
          </div>

          {/* Кнопки навигации */}
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
              onClick={resetConverter}
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

          {/* Популярные валюты */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '24px'
          }}>
            {popularCurrencies.map(code => {
              const currency = currencies.find(c => c.code === code);
              return (
                <button
                  key={code}
                  onClick={() => {
                    setFromCurrency(code);
                    setToCurrency('RUB');
                  }}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: fromCurrency === code ? COLORS.primary : COLORS.background,
                    border: `1px solid ${fromCurrency === code ? COLORS.primary : COLORS.border}`,
                    borderRadius: '20px',
                    color: fromCurrency === code ? 'white' : COLORS.text.main,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{currency?.flag}</span>
                  <span>{code}</span>
                </button>
              );
            })}
          </div>

          {/* Поля ввода */}
          <div style={{ marginBottom: '24px' }}>
            {/* Сумма */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: COLORS.text.main, fontSize: '14px' }}>
                Сумма
              </label>
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
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.border,
                  border: `1px solid #475569`,
                  color: 'white',
                  fontSize: '18px',
                  boxSizing: 'border-box'
                }}
                placeholder="0.00"
              />
            </div>

            {/* Из и В */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Из */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div style={{
                  backgroundColor: COLORS.background,
                  borderRadius: '8px',
                  border: `1px solid ${COLORS.border}`,
                  padding: '4px',
                  position: 'relative'
                }}>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: '16px',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none'
                    }}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code} style={{ backgroundColor: COLORS.background }}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: COLORS.text.muted,
                    pointerEvents: 'none'
                  }}>
                    ▼
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: COLORS.text.muted,
                  fontSize: '16px'
                }}>
                  {currencies.find(c => c.code === fromCurrency)?.symbol}
                </div>
              </div>

              {/* Кнопка обмена */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '4px 0'
              }}>
                <button
                  onClick={swapCurrencies}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: COLORS.primary,
                    border: 'none',
                    borderRadius: '30px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                  }}
                >
                  <span style={{ fontSize: '18px' }}>⇅</span> Поменять местами
                </button>
              </div>

              {/* В */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div style={{
                  backgroundColor: COLORS.background,
                  borderRadius: '8px',
                  border: `1px solid ${COLORS.border}`,
                  padding: '4px',
                  position: 'relative'
                }}>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: '16px',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none'
                    }}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code} style={{ backgroundColor: COLORS.background }}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: COLORS.text.muted,
                    pointerEvents: 'none'
                  }}>
                    ▼
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: COLORS.text.muted,
                  fontSize: '16px'
                }}>
                  {currencies.find(c => c.code === toCurrency)?.symbol}
                </div>
              </div>
            </div>
          </div>

          {/* РЕЗУЛЬТАТ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px',
            background: `linear-gradient(145deg, ${COLORS.background} 0%, #0f1a2e 100%)`
          }}>
            {isLoadingRates ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ color: COLORS.text.muted }}>⏳ Загрузка курсов...</div>
              </div>
            ) : convertedAmount !== null ? (
              <>
                <div style={{ 
                  fontSize: '14px', 
                  color: COLORS.text.muted, 
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  {currencies.find(c => c.code === fromCurrency)?.flag} {fromCurrency} → {currencies.find(c => c.code === toCurrency)?.flag} {toCurrency}
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      У вас есть
                    </div>
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: 'bold',
                      color: COLORS.text.main
                    }}>
                      {formatNumber(parseFloat(amount) || 0)} {fromCurrency}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: COLORS.text.muted, marginBottom: '4px' }}>
                      Получите
                    </div>
                    <div style={{ 
                      fontSize: '36px', 
                      fontWeight: 'bold',
                      background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {formatNumber(convertedAmount)} {toCurrency}
                    </div>
                  </div>
                </div>
                
                {/* Курс */}
                {exchangeRates.USD > 0 && (
                  <div style={{ 
                    paddingTop: '16px', 
                    borderTop: `1px solid ${COLORS.border}`,
                    marginTop: '8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '14px', color: COLORS.text.muted }}>
                      💱 1 {fromCurrency} = {fromCurrency === 'RUB' 
                        ? (1 / exchangeRates[toCurrency as keyof typeof exchangeRates] || 1).toFixed(4)
                        : (exchangeRates[fromCurrency as keyof typeof exchangeRates] || 0).toFixed(2)} {toCurrency === 'RUB' ? '₽' : toCurrency}
                    </div>
                    <div style={{ fontSize: '14px', color: COLORS.text.muted }}>
                      1 {toCurrency} = {toCurrency === 'RUB'
                        ? (exchangeRates[fromCurrency as keyof typeof exchangeRates] || 0).toFixed(2)
                        : (1 / exchangeRates[toCurrency as keyof typeof exchangeRates] || 1).toFixed(4)} {fromCurrency}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ color: COLORS.text.muted }}>Введите сумму для конвертации</div>
              </div>
            )}
            
            {/* Дата обновления */}
            {lastUpdate && (
              <div style={{ 
                marginTop: '16px',
                fontSize: '12px', 
                color: COLORS.text.dark,
                textAlign: 'center'
              }}>
                Курс ЦБ РФ от: {lastUpdate}
              </div>
            )}
          </div>

          {/* Быстрые суммы */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '16px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px'
          }}>
            <div style={{ 
              color: COLORS.primary, 
              fontSize: '15px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚡</span> Быстрые суммы
            </div>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {[100, 500, 1000, 5000, 10000].map(val => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: COLORS.border,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    color: COLORS.text.main,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flex: '0 1 auto'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.border;
                    e.currentTarget.style.color = COLORS.text.main;
                  }}
                >
                  {val.toLocaleString('ru-RU')} {fromCurrency}
                </button>
              ))}
            </div>
          </div>

          {/* Курсы валют */}
          {!isLoadingRates && exchangeRates.USD > 0 && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '8px',
              padding: '16px',
              border: `1px solid ${COLORS.border}`
            }}>
              <div style={{ 
                color: COLORS.primary, 
                fontSize: '15px', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📊</span> Курсы ЦБ РФ к рублю
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px'
              }}>
                <div style={{
                  padding: '12px',
                  backgroundColor: COLORS.card,
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary }}>USD</div>
                  <div style={{ fontSize: '18px', color: 'white' }}>{exchangeRates.USD.toFixed(2)} ₽</div>
                </div>
                <div style={{
                  padding: '12px',
                  backgroundColor: COLORS.card,
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary }}>EUR</div>
                  <div style={{ fontSize: '18px', color: 'white' }}>{exchangeRates.EUR.toFixed(2)} ₽</div>
                </div>
                <div style={{
                  padding: '12px',
                  backgroundColor: COLORS.card,
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary }}>CNY</div>
                  <div style={{ fontSize: '18px', color: 'white' }}>{exchangeRates.CNY.toFixed(2)} ₽</div>
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
            <span style={{ fontSize: '28px' }}>🇷🇺</span>
            <span style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Официальные курсы ЦБ РФ
            </span>
          </h2>
          
          <p style={{ color: COLORS.text.main, marginBottom: '16px', fontSize: '15px' }}>
            Конвертер использует официальные курсы валют Центрального банка Российской Федерации. Курсы обновляются ежедневно в 11:30 по московскому времени.
          </p>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: `rgba(245, 158, 11, 0.1)`,
            borderRadius: '8px',
            border: `1px solid ${COLORS.primary}`
          }}>
            <p style={{ color: COLORS.text.main, fontSize: '14px', margin: 0 }}>
              💡 <strong>Информация:</strong> Курсы ЦБ РФ носят справочный характер. 
              Фактический курс в банках и обменных пунктах может отличаться.
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
            Конвертер валют • Официальные курсы ЦБ РФ • {new Date().getFullYear()} год
          </p>
        </div>
      </div>
    </div>
  );
}