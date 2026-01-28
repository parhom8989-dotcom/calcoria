// app/page.tsx - ПОЛНАЯ ГЛАВНАЯ СТРАНИЦА
"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Данные для популярных калькуляторов
  const popularCalculators = [
    { id: 1, name: "Мешки цемента", desc: "Расход для стяжки", icon: "🏗️", category: "other", url: "/other/cement" },
    { id: 2, name: "Солнечные панели", desc: "Расчёт для дома", icon: "☀️", category: "electrical", url: "/electrical/solar" },
    { id: 3, name: "Возраст в днях", desc: "Сколько дней вы прожили", icon: "📅", category: "other", url: "/other/age" },
    { id: 4, name: "Случайные числа", desc: "Генератор целых чисел", icon: "🔢", category: "other", url: "/other/random" },
    { id: 5, name: "Генератор паролей", desc: "Безопасные пароли", icon: "🔒", category: "other", url: "/other/password" },
    { id: 6, name: "Индекс массы тела", desc: "Калькулятор ИМТ", icon: "⚖️", category: "other", url: "/other/bmi" },
    { id: 7, name: "Конвертер валют", desc: "Актуальные курсы", icon: "💱", category: "other", url: "/other/currency" },
    { id: 8, name: "Плитка/Ламинат", desc: "Расчёт для комнаты", icon: "🧱", category: "other", url: "/other/tiles" },
    { id: 9, name: "Молярная масса", desc: "Химические формулы", icon: "⚗️", category: "other", url: "/other/molar" },
    { id: 10, name: "Цветовая гамма", desc: "Дополнительные цвета", icon: "🎨", category: "other", url: "/other/colors" },
    { id: 11, name: "Цикл-трекер", desc: "Календарь цикла", icon: "📅", category: "other", url: "/other/cycle" },
    { id: 12, name: "Калькулятор Л.С.", desc: "л.с. ⇄ Вт ⇄ кВт", icon: "⚙️", category: "mechanics", url: "/mechanics/horsepower" },
  ];

  return (
    <>
      {/* 1. ШАПКА САЙТА */}
      <header>
        <div className="header-container">
          <Link href="/" className="logo">
            <span className="logo-icon">⚙️</span>
            <span>Calcoria</span>
          </Link>
          
          <nav>
            <a href="#mechanics">Механика</a>
            <a href="#electrical">Электротехника</a>
            <a href="#thermal">Теплотехника</a>
            <a href="#other">Прочее</a>
            <a href="#about">О нас</a>
          </nav>
          
          <div className="header-search">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Найти калькулятор..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="theme-toggle" title="Переключить тему">
            🌙
          </button>
        </div>
      </header>

      {/* 2. ГЛАВНЫЙ БАННЕР */}
      <section className="hero">
        <h1>Calcoria - Центр инженерных расчётов</h1>
        <p>Более 20 профессиональных калькуляторов для инженеров, строителей и специалистов</p>
        
        <div className="hero-search">
          <span className="hero-search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Поиск по калькуляторам..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="stats">
          <span>✨ 15,000+ расчётов выполнено</span>
        </div>
      </section>

      {/* 3. КАТЕГОРИИ */}
      <div className="container">
        <h2 className="section-title">Категории расчётов</h2>
        <div className="categories-grid">
          <div className="category-card blue">
            <span className="category-icon">⚙️</span>
            <h3>Механика</h3>
            <p>Расчёты балки, момент инерции, прочность материалов</p>
          </div>
          
          <div className="category-card yellow">
            <span className="category-icon">⚡</span>
            <h3>Электротехника</h3>
            <p>Закон Ома, сопротивление, конденсаторы, делители напряжения</p>
          </div>
          
          <div className="category-card orange">
            <span className="category-icon">🌡️</span>
            <h3>Теплотехника</h3>
            <p>Теплопередача, потери энергии, тепловые балансы, изоляция</p>
          </div>
          
          <div className="category-card green">
            <span className="category-icon">📊</span>
            <h3>Прочее</h3>
            <p>Конвертеры единиц, ипотечный калькулятор и другое</p>
          </div>
        </div>

        {/* 4. ПОПУЛЯРНЫЕ КАЛЬКУЛЯТОРЫ */}
        <h2 className="section-title">Популярные калькуляторы</h2>
        <div className="calculators-grid">
          {popularCalculators.map(calc => (
            <Link 
              href={calc.url} 
              key={calc.id}
              className="calc-card"
              data-category={calc.category}
              data-name={calc.name.toLowerCase()}
            >
              <span className="calc-icon">{calc.icon}</span>
              <h4>{calc.name}</h4>
              <p>{calc.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. ПОЛНЫЙ ПОДВАЛ (FOOTER) */}
      <footer>
        <div className="footer-container">
          <div className="footer-section">
            <a href="/" className="logo" style={{marginBottom: '1rem', display: 'inline-flex'}}>
              <span className="logo-icon">⚙️</span>
              <span>Calcoria</span>
            </a>
            <p>Профессиональные онлайн калькуляторы для инженерных расчётов. Точные, быстрые и бесплатные инструменты для специалистов.</p>
            <div className="social-links">
              <a href="#" title="ВКонтакте">📘</a>
              <a href="#" title="Telegram">📱</a>
              <a href="#" title="YouTube">📺</a>
              <a href="#" title="Email">✉️</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Категории</h4>
            <ul className="footer-links">
              <li><a href="#mechanics">Механика</a></li>
              <li><a href="#electrical">Электротехника</a></li>
              <li><a href="#thermal">Теплотехника</a></li>
              <li><a href="#other">Прочее</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Информация</h4>
            <ul className="footer-links">
              <li><a href="#about">О нас</a></li>
              <li><a href="#contact">Контакты</a></li>
              <li><a href="#privacy">Конфиденциальность</a></li>
              <li><a href="#terms">Условия использования</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Помощь</h4>
            <ul className="footer-links">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#guides">Инструкции</a></li>
              <li><a href="#feedback">Обратная связь</a></li>
              <li><a href="#support">Техподдержка</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Calcoria. Все права защищены. | Сделано с ❤️ для инженеров</p>
        </div>
      </footer>
    </>
  );
}