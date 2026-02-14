// app/other/password/page.tsx
"use client";

import { useState, useCallback, useEffect } from 'react';

export default function PasswordGeneratorPage() {
  // Состояния генератора
  const [length, setLength] = useState<number>(12);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [strength, setStrength] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  // Цветовая схема
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
  weak: '#ef4444',
  medium: '#f59e0b',
  strong: '#10b981',
  veryStrong: '#3b82f6',
  success: '#10b981'  
};  

  // Наборы символов
  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const SIMILAR = 'il1Lo0O';

  // Генерация пароля
  const generatePassword = useCallback(() => {
    let chars = '';
    
    if (includeUppercase) chars += UPPERCASE;
    if (includeLowercase) chars += LOWERCASE;
    if (includeNumbers) chars += NUMBERS;
    if (includeSymbols) chars += SYMBOLS;

    // Проверка, что выбран хотя бы один тип символов
    if (chars.length === 0) {
      setPassword('Выберите хотя бы один тип символов');
      return;
    }

    // Исключение похожих символов
    let availableChars = chars;
    if (excludeSimilar) {
      availableChars = chars.split('').filter(char => !SIMILAR.includes(char)).join('');
    }

    // Генерация пароля
    let generated = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      generated += availableChars[randomIndex];
    }

    setPassword(generated);
    
    // Сохраняем в историю
    setHistory(prev => [generated, ...prev].slice(0, 10));
    
    // Оценка надежности
    evaluateStrength(generated);
    
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar]);

  // Оценка надежности пароля
  const evaluateStrength = (pwd: string) => {
    let score = 0;
    
    // Длина
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    
    // Разные типы символов
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    // Разнообразие (чем больше уникальных символов, тем лучше)
    const uniqueChars = new Set(pwd.split('')).size;
    if (uniqueChars > pwd.length * 0.7) score += 1;
    
    setStrength(score);
  };

  // Копирование в буфер обмена
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Не удалось скопировать');
    }
  };

  // Генерация при первом рендере
  useEffect(() => {
    generatePassword();
  }, []);

  // Получение цвета надежности
  const getStrengthColor = () => {
    if (strength <= 3) return COLORS.weak;
    if (strength <= 5) return COLORS.medium;
    if (strength <= 7) return COLORS.strong;
    return COLORS.veryStrong;
  };

  // Получение текста надежности
  const getStrengthText = () => {
    if (strength <= 3) return 'Слабый';
    if (strength <= 5) return 'Средний';
    if (strength <= 7) return 'Надежный';
    return 'Очень надежный';
  };

  // Информация о пароле
  const getPasswordInfo = () => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const uniqueCount = new Set(password.split('')).size;
    
    return { hasUpper, hasLower, hasNumber, hasSymbol, uniqueCount };
  };

  const info = getPasswordInfo();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА ГЕНЕРАТОРА */}
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: `1px solid ${COLORS.border}`
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🔒</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                Генератор паролей
              </h1>
              <p style={{ color: COLORS.text.muted, fontSize: '14px' }}>
                Создайте надежный и уникальный пароль
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
              onClick={generatePassword}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: COLORS.primary,
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              🔄 Сгенерировать
            </button>
          </div>

          {/* ПОЛЕ С ПАРОЛЕМ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '20px',
              fontFamily: 'monospace',
              textAlign: 'center',
              padding: '16px',
              backgroundColor: COLORS.card,
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`,
              marginBottom: '12px',
              wordBreak: 'break-all',
              color: COLORS.primary,
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>
              {password}
            </div>

            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={copyToClipboard}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: copied ? COLORS.success : COLORS.card,
                  border: `1px solid ${copied ? COLORS.success : COLORS.border}`,
                  borderRadius: '6px',
                  color: copied ? 'white' : COLORS.text.main,
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
              >
                {copied ? '✓ Скопировано!' : '📋 Копировать'}
              </button>
            </div>
          </div>

          {/* НАСТРОЙКИ */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: COLORS.primary }}>
              Настройки пароля
            </h3>

            {/* Длина пароля */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', color: COLORS.text.muted }}>
                  Длина пароля: {length} символов
                </label>
              </div>
              <input
                type="range"
                min="4"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.primary} ${(length/32)*100}%, ${COLORS.border} ${(length/32)*100}%)`,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {[4, 8, 12, 16, 20, 24, 28, 32].map(val => (
                  <button
                    key={val}
                    onClick={() => setLength(val)}
                    style={{
                      padding: '4px 6px',
                      backgroundColor: length === val ? COLORS.primary : 'transparent',
                      border: `1px solid ${length === val ? COLORS.primary : COLORS.border}`,
                      borderRadius: '4px',
                      color: length === val ? 'white' : COLORS.text.muted,
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Чекбоксы */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: COLORS.text.main }}>
                  Заглавные буквы (A-Z)
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: COLORS.text.main }}>
                  Строчные буквы (a-z)
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: COLORS.text.main }}>
                  Цифры (0-9)
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: COLORS.text.main }}>
                  Спецсимволы (!@#$%)
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: COLORS.text.main }}>
                  Исключить похожие (il1Lo0O)
                </span>
              </label>
            </div>
          </div>

          {/* ИНДИКАТОР НАДЕЖНОСТИ */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '8px',
            padding: '16px',
            border: `1px solid ${COLORS.border}`,
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: COLORS.text.muted }}>Надежность пароля:</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: getStrengthColor() }}>
                {getStrengthText()}
              </span>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: COLORS.border,
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{
                width: `${(strength / 9) * 100}%`,
                height: '100%',
                backgroundColor: getStrengthColor(),
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '12px'
            }}>
              <div style={{ color: info.hasUpper ? COLORS.success : COLORS.text.dark }}>
                {info.hasUpper ? '✅' : '❌'} Заглавные
              </div>
              <div style={{ color: info.hasLower ? COLORS.success : COLORS.text.dark }}>
                {info.hasLower ? '✅' : '❌'} Строчные
              </div>
              <div style={{ color: info.hasNumber ? COLORS.success : COLORS.text.dark }}>
                {info.hasNumber ? '✅' : '❌'} Цифры
              </div>
              <div style={{ color: info.hasSymbol ? COLORS.success : COLORS.text.dark }}>
                {info.hasSymbol ? '✅' : '❌'} Символы
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: '4px', color: COLORS.text.dark }}>
                Уникальных символов: {info.uniqueCount} из {password.length}
              </div>
            </div>
          </div>

          {/* ИСТОРИЯ */}
          {history.length > 1 && (
            <div style={{
              backgroundColor: COLORS.background,
              borderRadius: '8px',
              padding: '16px',
              border: `1px solid ${COLORS.border}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: COLORS.text.muted }}>
                Последние пароли:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.slice(1, 5).map((pwd, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      color: COLORS.text.dark,
                      padding: '8px',
                      backgroundColor: COLORS.card,
                      borderRadius: '4px',
                      wordBreak: 'break-all'
                    }}
                  >
                    {pwd}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* СОВЕТЫ */}
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
            <span style={{ fontWeight: 'bold', color: COLORS.primary }}>Советы по безопасности:</span>
          </div>
          <p style={{ marginBottom: '6px' }}>• Используйте пароли длиной не менее 12 символов</p>
          <p style={{ marginBottom: '6px' }}>• Комбинируйте разные типы символов</p>
          <p style={{ marginBottom: '6px' }}>• Не используйте один пароль для всех сервисов</p>
          <p style={{ marginBottom: '6px' }}>• Меняйте пароли раз в 3-6 месяцев</p>
          <p style={{ marginBottom: '6px' }}>• Используйте менеджер паролей</p>
          <p style={{ marginTop: '8px', fontSize: '12px', color: COLORS.text.dark }}>
            Надежный пароль содержит все 4 типа символов и имеет длину от 12 знаков.
          </p>
        </div>
      </div>
    </div>
  );
}