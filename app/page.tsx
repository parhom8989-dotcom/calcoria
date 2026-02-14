// app/page.tsx
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Данные для популярных калькуляторов
  const popularCalculators = [
    { id: 1, name: "Мешки цемента", desc: "Расход для стяжки", icon: "🏗️", category: "other", url: "/other/cement" },
    { id: 2, name: "Солнечные панели", desc: "Расчёт для дома", icon: "☀️", category: "electrical", url: "/elektrotekhnika/solar" },
    { id: 3, name: "Возраст в днях", desc: "Сколько дней вы прожили", icon: "📅", category: "other", url: "/other/age" },
    { id: 4, name: "Случайные числа", desc: "Генератор целых чисел", icon: "🔢", category: "other", url: "/other/random" },
    { id: 5, name: "Генератор паролей", desc: "Безопасные пароли", icon: "🔒", category: "other", url: "/other/password" },
    { id: 6, name: "Калькулятор пропорций", desc: "Решение пропорций вида a:b = c:d", icon: "⚖️", category: "other", url: "/other/proportions" },
    { id: 7, name: "Конвертер размеров одежды", desc: "Перевод размеров между EU/US/RU", icon: "👕", category: "other", url: "/other/clothes-size" },
    { id: 8, name: "Плитка/Ламинат", desc: "Расчёт для комнаты", icon: "🔲", category: "other", url: "/other/plitka" },
    { id: 9, name: "Молярная масса", desc: "Химические формулы", icon: "⚗️", category: "other", url: "/other/molar" },
    { id: 10, name: "Цветовая гамма", desc: "Дополнительные цвета", icon: "🎨", category: "other", url: "/other/colors" },
    { id: 11, name: "Цикл-трекер", desc: "Календарь цикла", icon: "📅", category: "other", url: "/other/cycle" },
    { id: 12, name: "Калькулятор Л.С.", desc: "л.с. ⇄ Вт ⇄ кВт", icon: "⚙️", category: "mechanics", url: "/mechanics/horsepower" },
  ];

  // Фильтрация калькуляторов по поисковому запросу
  const filteredCalculators = useMemo(() => {
    if (!searchQuery.trim()) return popularCalculators;
    
    const query = searchQuery.toLowerCase().trim();
    return popularCalculators.filter(calc => 
      calc.name.toLowerCase().includes(query) || 
      calc.desc.toLowerCase().includes(query)
    );
  }, [searchQuery, popularCalculators]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* ВЕСЬ КОНТЕНТ В ОДНОМ ПОТОКЕ */}
      
      {/* 1. ШАПКА САЙТА С ПОИСКОМ */}
<header style={{
  borderBottom: '1px solid #334155',
  padding: '15px 20px',
  backgroundColor: '#0f172a'
}}>
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px'
  }}>
    <Link href="/" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <span style={{ fontSize: '32px' }}>⚙️</span>
      <span>Calcoria</span>
    </Link>
    
    <nav style={{
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      <a href="/mechanics" style={{ color: '#94a3b8', textDecoration: 'none' }}>Механика</a>
      <a href="/elektrotekhnika" style={{ color: '#94a3b8', textDecoration: 'none' }}>Электротехника</a>
      <a href="/teplotekhnika" style={{ color: '#94a3b8', textDecoration: 'none' }}>Теплотехника</a>
      <a href="/other" style={{ color: '#94a3b8', textDecoration: 'none' }}>Прочее</a>
      <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>О нас</a>
    </nav>
    
    {/* ПОИСК В ШАПКЕ (ТЕПЕРЬ РАБОТАЕТ) */}
    <form action="/search" method="GET" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flex: '1 1 300px',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        flex: '1 1 250px'
      }}>
        <span style={{ color: '#64748b', margin: '0 10px' }}>🔍</span>
        <input
          type="text"
          name="q"
          placeholder="Найти калькулятор..."
          style={{
            flex: 1,
            padding: '10px 10px 10px 0',
            background: 'transparent',
            border: 'none',
            color: 'white',
            outline: 'none'
          }}
        />
        <button type="submit" style={{
          padding: '8px 15px',
          background: '#f97316',
          border: 'none',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Найти
        </button>
      </div>
      
      <button style={{
        background: 'transparent',
        border: 'none',
        color: '#94a3b8',
        fontSize: '20px',
        cursor: 'pointer'
      }}>
        🌙
      </button>
    </form>
  </div>
</header>

      {/* 2. ГЛАВНЫЙ БАННЕР (БЕЗ ПОИСКА) */}
      <section style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: 'white'
          }}>
            Calcoria - Центр инженерных расчётов
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            marginBottom: '30px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Более 20 профессиональных калькуляторов для инженеров, строителей и специалистов
          </p>
          
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '30px',
            color: '#fbbf24',
            fontSize: '14px'
          }}>
            ✨ 15,000+ расчётов выполнено
          </div>
        </div>
      </section>

      {/* 3. КАТЕГОРИИ */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Категории расчётов
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '50px'
        }}>
          {/* 1. МЕХАНИКА */}
<a href="/mechanics" style={{ textDecoration: 'none' }}>
  <div style={{
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #3b82f6',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <span style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>⚙️</span>
    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#3b82f6' }}>Механика</h3>
    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Расчёты балки, момент инерции, прочность материалов</p>
  </div>
</a>

{/* 2. ЭЛЕКТРОТЕХНИКА */}
<a href="/elektrotekhnika" style={{ textDecoration: 'none' }}>
  <div style={{
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #f59e0b',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.3)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <span style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>⚡</span>
    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#f59e0b' }}>Электротехника</h3>
    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Закон Ома, сопротивление, конденсаторы, делители</p>
  </div>
</a>

{/* 3. ТЕПЛОТЕХНИКА */}
<a href="/teplotekhnika" style={{ textDecoration: 'none' }}>
  <div style={{
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #f97316',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(249, 115, 22, 0.3)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <span style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>🌡️</span>
    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#f97316' }}>Теплотехника</h3>
    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Теплопередача, потери энергии, тепловые балансы, изоляция</p>
  </div>
</a>

{/* 4. ПРОЧЕЕ */}
<a href="/other" style={{ textDecoration: 'none' }}>
  <div style={{
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #10b981',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <span style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>📊</span>
    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#10b981' }}>Прочее</h3>
    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Конвертеры единиц, ипотечный калькулятор и другое</p>
  </div>
</a>
        </div>

        {/* 4. ПОПУЛЯРНЫЕ КАЛЬКУЛЯТОРЫ */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Популярные калькуляторы'}
        </h2>
        
        {filteredCalculators.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '50px'
          }}>
            {filteredCalculators.map(calc => (
              <Link href={calc.url} key={calc.id} style={{ textDecoration: 'none' }}>
                <div style={{
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid #334155',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
}}
onMouseOver={(e) => {
  e.currentTarget.style.transform = 'translateY(-4px)';
  e.currentTarget.style.borderColor = '#f97316';
  e.currentTarget.style.boxShadow = '0 10px 25px rgba(249, 115, 22, 0.2)';
}}
onMouseOut={(e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.borderColor = '#334155';
  e.currentTarget.style.boxShadow = 'none';
}}>
                  <span style={{ fontSize: '32px', marginBottom: '10px', display: 'block' }}>{calc.icon}</span>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', color: 'white' }}>
                    {calc.name}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{calc.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            marginBottom: '50px'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>
              😕 По запросу "{searchQuery}" ничего не найдено
            </p>
          </div>
        )}
      </div>

      {/* 5. ПОДВАЛ (FOOTER) */}
      <footer style={{
        backgroundColor: '#0f172a',
        borderTop: '1px solid #334155',
        padding: '40px 20px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              <span style={{ fontSize: '28px' }}>⚙️</span>
              <span>Calcoria</span>
            </Link>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              Профессиональные онлайн калькуляторы для инженерных расчётов. Точные, быстрые и бесплатные инструменты для специалистов.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#" style={{ color: '#64748b', fontSize: '20px', textDecoration: 'none' }}>📘</a>
              <a href="#" style={{ color: '#64748b', fontSize: '20px', textDecoration: 'none' }}>📱</a>
              <a href="#" style={{ color: '#64748b', fontSize: '20px', textDecoration: 'none' }}>📺</a>
              <a href="#" style={{ color: '#64748b', fontSize: '20px', textDecoration: 'none' }}>✉️</a>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: 'white' }}>Категории</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><a href="/mechanics" style={{ color: '#94a3b8', textDecoration: 'none' }}>Механика</a></li>
              <li style={{ marginBottom: '10px' }}><a href="/elektrotekhnika" style={{ color: '#94a3b8', textDecoration: 'none' }}>Электротехника</a></li>
              <li style={{ marginBottom: '10px' }}><a href="/teplotekhnika" style={{ color: '#94a3b8', textDecoration: 'none' }}>Теплотехника</a></li>
              <li style={{ marginBottom: '10px' }}><a href="/other" style={{ color: '#94a3b8', textDecoration: 'none' }}>Прочее</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: 'white' }}>Информация</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>О нас</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Контакты</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Конфиденциальность</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Условия использования</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: 'white' }}>Помощь</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><a href="#faq" style={{ color: '#94a3b8', textDecoration: 'none' }}>FAQ</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#guides" style={{ color: '#94a3b8', textDecoration: 'none' }}>Инструкции</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#feedback" style={{ color: '#94a3b8', textDecoration: 'none' }}>Обратная связь</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#support" style={{ color: '#94a3b8', textDecoration: 'none' }}>Техподдержка</a></li>
            </ul>
          </div>
        </div>
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid #334155',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px'
        }}>
          <p>© 2026 Calcoria. Все права защищены. | Сделано с ❤️ для инженеров</p>
        </div>
      </footer>
    </div>
  );
}