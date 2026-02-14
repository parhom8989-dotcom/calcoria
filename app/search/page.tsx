// app/search/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// Все калькуляторы сайта (общая база данных)
const allCalculators = [
  // Механика
  { id: 101, name: "Калькулятор Л.С.", desc: "л.с. ⇄ Вт ⇄ кВт", icon: "⚙️", category: "mechanics", url: "/mechanics/horsepower", keywords: "лошадиные силы мощность киловатты ватты" },
  { name: "Сила, масса, ускорение", desc: "Второй закон Ньютона: F = ma", icon: "⚖️", category: "mechanics", url: "/mechanics/sila-massa-uskorenie", keywords: "сила масса ускорение второй закон Ньютона" },
  { name: "Работа и энергия", desc: "Механическая работа, кинетическая и потенциальная энергия", icon: "⚡", category: "mechanics", url: "/mechanics/rabota-energiya", keywords: "механическая работа кинетическая ускорение потенциальная энергия" },
  // Электротехника
  { id: 201, name: "Солнечные панели", desc: "Расчёт для дома", icon: "☀️", category: "electrical", url: "/elektrotekhnika/solar", keywords: "солнечные батареи энергия электричество" },
  
  // Теплотехника
  { id: 301, name: "Тепловая мощность", desc: "Расчёт тепловой мощности", icon: "🔥", category: "teplotekhnika", url: "/teplotekhnika/teplovaya-moshchnost", keywords: "тепло энергия Q m c ΔT" },
  
  // Прочее (other)
  { id: 1, name: "Мешки цемента", desc: "Расход для стяжки", icon: "🏗️", category: "other", url: "/other/cement", keywords: "цемент стяжка пол строительство бетон" },
  { id: 2, name: "Солнечные панели", desc: "Расчёт для дома", icon: "☀️", category: "other", url: "/other/solar", keywords: "солнечные батареи энергия электричество" },
  { id: 3, name: "Возраст в днях", desc: "Сколько дней вы прожили", icon: "📅", category: "other", url: "/other/age", keywords: "возраст дни рождения дата" },
  { id: 4, name: "Случайные числа", desc: "Генератор целых чисел", icon: "🔢", category: "other", url: "/other/random", keywords: "рандом генератор числа" },
  { id: 5, name: "Генератор паролей", desc: "Безопасные пароли", icon: "🔒", category: "other", url: "/other/password", keywords: "пароль безопасность генератор" },
  { id: 6, name: "Калькулятор пропорций", desc: "Решение пропорций вида a:b = c:d", icon: "⚖️", category: "other", url: "/other/proportions", keywords: "пропорции отношения математика" },
  { id: 7, name: "Конвертер размеров одежды", desc: "Перевод размеров между EU/US/RU", icon: "👕", category: "other", url: "/other/clothes-size", keywords: "одежда размер eu us ru конвертер" },
  { id: 8, name: "Плитка/Ламинат", desc: "Расчёт для комнаты", icon: "🔲", category: "other", url: "/other/plitka", keywords: "плитка ламинат пол расчёт" },
  { id: 9, name: "Молярная масса", desc: "Химические формулы", icon: "⚗️", category: "other", url: "/other/molar", keywords: "химия молярная масса формула" },
  { id: 10, name: "Цветовая гамма", desc: "Генератор цветовых палитр", icon: "🎨", category: "other", url: "/other/colors", keywords: "цвет палитра hex rgb дизайн" },
  { id: 11, name: "Цикл-трекер", desc: "Календарь цикла", icon: "📅", category: "other", url: "/other/cycle", keywords: "цикл календарь женский" },
  { id: 12, name: "Конвертер валют", desc: "Актуальные курсы валют", icon: "💱", category: "other", url: "/other/currency", keywords: "валюта доллар евро рубль курс" },
  { id: 13, name: "Ипотечный калькулятор", desc: "Расчёт аннуитетных платежей", icon: "🏠", category: "other", url: "/other/mortgage", keywords: "ипотека кредит платёж процент" },
  { id: 14, name: "Калькулятор процентов", desc: "Проценты, увеличение, уменьшение", icon: "📊", category: "other", url: "/other/percentage", keywords: "проценты процент налог скидка" },
  { id: 15, name: "Калькулятор самогонщика", desc: "Разбавление спирта", icon: "⚗️", category: "other", url: "/other/moonshine", keywords: "самогон спирт вода разбавление" },
  { id: 16, name: "Калькулятор калорий", desc: "Норма калорий и БЖУ", icon: "🍎", category: "other", url: "/other/calories", keywords: "калории бжу питание диета" },
  { id: 17, name: "Конвертер единиц", desc: "Длина, вес, объём", icon: "📐", category: "other", url: "/other/converter", keywords: "конвертер длина вес объём" },
  { id: 18, name: "Калькулятор НДС", desc: "20%, 10%, 0%", icon: "💰", category: "other", url: "/other/vat", keywords: "ндс налог процент" },
  { id: 19, name: "Шинный калькулятор", desc: "Сравнение размеров шин", icon: "🚗", category: "other", url: "/other/tire", keywords: "шины резина колёса размер" },
  { id: 20, name: "Калькулятор ИМТ", desc: "Индекс массы тела", icon: "⚖️", category: "other", url: "/other/bmi", keywords: "имт вес рост индекс" },
  { id: 21, name: "Калькулятор беременности", desc: "Сроки, дата родов", icon: "👶", category: "other", url: "/other/pregnancy", keywords: "беременность срок роды" },
  { id: 22, name: "Калькулятор уравнений", desc: "Линейные уравнения", icon: "📐", category: "other", url: "/other/equations", keywords: "уравнение математика" },
  { id: 23, name: "Транспортный налог", desc: "Расчёт налога", icon: "🚗", category: "other", url: "/other/transport", keywords: "налог транспорт лошадиные силы" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // Фильтрация калькуляторов по запросу
  const results = query.trim() === '' ? [] : allCalculators.filter(calc => {
    const searchStr = `${calc.name} ${calc.desc} ${calc.keywords || ''}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Шапка с поиском */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '20px 0',
          borderBottom: '1px solid #334155'
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
          
          <form action="/search" method="GET" style={{ flex: '0 1 400px' }}>
            <div style={{
              display: 'flex',
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Поиск калькуляторов..."
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <button type="submit" style={{
                padding: '12px 20px',
                background: '#f97316',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Найти
              </button>
            </div>
          </form>
        </header>

        {/* Результаты поиска */}
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>
            {query ? `Результаты поиска: "${query}"` : 'Поиск калькуляторов'}
          </h1>
          
          {query === '' ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              backgroundColor: '#1e293b',
              borderRadius: '12px'
            }}>
              <p style={{ color: '#94a3b8', fontSize: '18px' }}>
                Введите поисковый запрос
              </p>
            </div>
          ) : results.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              backgroundColor: '#1e293b',
              borderRadius: '12px'
            }}>
              <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '10px' }}>
                😕 По запросу "{query}" ничего не найдено
              </p>
              <p style={{ color: '#64748b' }}>
                Попробуйте изменить запрос или выбрать другой калькулятор
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {results.map(calc => (
                <Link href={calc.url} key={calc.url} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #334155',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{ fontSize: '32px', marginBottom: '10px', display: 'block' }}>{calc.icon}</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', color: 'white' }}>
                      {calc.name}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '5px' }}>{calc.desc}</p>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: '#0f172a',
                      borderRadius: '4px',
                      color: '#f97316',
                      fontSize: '12px'
                    }}>
                      {calc.category === 'mechanics' ? 'Механика' :
                       calc.category === 'electrical' ? 'Электротехника' :
                       calc.category === 'teplotekhnika' ? 'Теплотехника' : 'Прочее'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', color: 'white' }}>Загрузка...</div>}>
      <SearchContent />
    </Suspense>
  );
}