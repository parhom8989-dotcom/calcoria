// app/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Кнопка назад */}
        <Link href="/" style={{
          display: 'inline-block',
          marginBottom: '30px',
          padding: '10px 20px',
          backgroundColor: '#1e293b',
          color: '#f97316',
          textDecoration: 'none',
          borderRadius: '8px',
          border: '1px solid #334155'
        }}>
          ← На главную
        </Link>

        {/* Заголовок */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid #334155',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '20px',
            background: 'linear-gradient(90deg, #f97316, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            О проекте Calcoria
          </h1>
          
          <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.6' }}>
            Сборник профессиональных онлайн-калькуляторов для инженеров, 
            строителей и всех, кто ценит точные расчёты.
          </p>
        </div>

        {/* Миссия */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid #334155',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: '#f97316' }}>
            🎯 Наша миссия
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: '1.6' }}>
            Мы создаём простые, быстрые и точные инструменты для решения повседневных задач — 
            от строительства до финансов. Никакой воды, только работающие калькуляторы.
          </p>
        </div>

        {/* Что у нас есть */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid #334155',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#f97316' }}>
            📊 Что у нас есть
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>🔧</span>
              <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Механика</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Расчёты балок, момент инерции, прочность</p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>⚡</span>
              <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Электротехника</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Закон Ома, мощность, сопротивление</p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>🌡️</span>
              <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Теплотехника</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Теплопередача, потери энергии</p>
            </div>
            
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>📊</span>
              <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Прочее</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>20+ калькуляторов на все случаи</p>
            </div>
          </div>
        </div>

        {/* Почему нам доверяют */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid #334155',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: '#f97316' }}>
            ✅ Почему нам можно доверять
          </h2>
          <ul style={{ color: '#cbd5e1', lineHeight: '2', paddingLeft: '20px' }}>
            <li>• Все формулы проверены по нормативам</li>
            <li>• Актуальные данные на 2025-2026 гг.</li>
            <li>• Бесплатно и без регистрации</li>
            <li>• Работает на компьютерах, планшетах и телефонах</li>
          </ul>
        </div>

        {/* Контакты */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid #334155',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#f97316' }}>
            📬 Контакты
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
            📧 support@calcoria.ru
          </p>
          <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>
            📱 Telegram: @calcoria
          </p>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            *Calcoria — считаем точно, экономим ваше время.*
          </p>
        </div>
      </div>
    </div>
  );
}