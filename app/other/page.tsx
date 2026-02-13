// app/other/page.tsx
"use client";

export default function OtherPage() {
  const calculators = [
    {
      id: 'mortgage',
      title: 'Ипотечный калькулятор',
      description: 'Расчёт аннуитетных платежей, переплат',
      icon: '🏠',
      color: '#06b6d4',
      href: '/other/mortgage'
    },
    {
      id: 'percentage',
      title: 'Калькулятор процентов',
      description: '5 типов расчётов: %, увеличение, уменьшение',
      icon: '📊',
      color: '#8b5cf6',
      href: '/other/percentage'
    },
    {
      id: 'moonshine',
      title: 'Калькулятор самогонщика',
      description: 'Разбавление спирта водой, смешивание жидкостей',
      icon: '⚗️',
      color: '#f59e0b',
      href: '/other/moonshine'
    },
    {
      id: 'calories',
      title: 'Калькулятор калорий',
      description: 'Норма калорий и БЖУ по формуле Миффлина',
      icon: '🍎',
      color: '#10b981',
      href: '/other/calories'
    },
    {
      id: 'converter',
      title: 'Конвертер единиц',
      description: 'Длина, вес, объём - более 12 единиц измерения',
      icon: '📐',
      color: '#3b82f6',
      href: '/other/converter'
    },
    {
      id: 'vat',
      title: 'Калькулятор НДС',
      description: 'Налог на добавленную стоимость: 20%, 10%, 0%',
      icon: '💰',
      color: '#ef4444',
      href: '/other/vat'
    },
    {
      id: 'tire',
      title: 'Шинный калькулятор',
      description: 'Сравнение размеров шин, соответствие ПДД',
      icon: '🚗',
      color: '#ea580c',
      href: '/other/tire'
    },
    {
      id: 'currency',
      title: 'Конвертер валют',
      description: 'Актуальные курсы валют, исторические данные',
      icon: '💱',
      color: '#f59e0b',
      href: '/other/currency'
    },
    {
      id: 'bmi',
      title: 'Калькулятор ИМТ',
      description: 'Индекс массы тела, рекомендации по весу',
      icon: '⚖️',
      color: '#10b981',
      href: '/other/bmi'
    },
    {
      id: 'pregnancy',
      title: 'Калькулятор беременности',
      description: 'Сроки, дата родов, триместры',
      icon: '👶',
      color: '#ec4899',
      href: '/other/pregnancy'
    },
    {
      id: 'yravneniya',
      title: 'Калькулятор уравнений',
      description: 'Расход на 100 км, стоимость поездки',
      icon: '📐',
      color: '#6366f1',
      href: '/other/yravneniya'
    },
    {
      id: 'transport',
      title: 'Транспортный налог',
      description: 'Расчёт чаевых в ресторанах, кафе',
      icon: '💳',
      color: '#8b5cf6',
      href: '/other/transport'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>

      {/* КНОПКА "НА ГЛАВНУЮ" */}
      <div style={{ marginBottom: '20px' }}>
        <a 
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#334155',
            color: '#06b6d4',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '1px solid #475569',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#06b6d4';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#334155';
            e.currentTarget.style.color = '#06b6d4';
          }}
        >
          ← На главную
        </a>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* ШАПКА */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          padding: '32px 0'
        }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#06b6d4'
          }}>
            📊 Прочие калькуляторы
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Все необходимые инструменты для повседневной жизни и бизнеса
          </p>
        </div>

        {/* СЕТКА КАЛЬКУЛЯТОРОВ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {calculators.map((calc) => (
            <a
              key={calc.id}
              href={calc.href}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #334155',
                textDecoration: 'none',
                color: 'white',
                display: 'block',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = calc.color;
                e.currentTarget.style.boxShadow = `0 10px 25px ${calc.color}20`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontSize: '32px',
                  marginRight: '16px'
                }}>
                  {calc.icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    color: calc.color
                  }}>
                    {calc.title}
                  </h3>
                  <div style={{
                    height: '3px',
                    width: '40px',
                    backgroundColor: calc.color,
                    borderRadius: '2px'
                  }}></div>
                </div>
              </div>
              
              <p style={{
                color: '#cbd5e1',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {calc.description}
              </p>
              
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  Нажмите для открытия
                </span>
                <span style={{
                  color: calc.color,
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* ИНФОРМАЦИОННЫЙ БЛОК */}
        <div style={{
  backgroundColor: '#1e293b',
  borderRadius: '16px',
  padding: '32px',
  marginTop: '48px',
  border: '1px solid #334155'
}}>
  <h2 style={{
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#06b6d4'
  }}>
     О разделе "Прочее"
  </h2>
  
  <p style={{
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '1.7',
    marginBottom: '24px'
  }}>
    В этом разделе собраны полезные онлайн-калькуляторы для повседневных задач, бизнеса и хобби. 
    Все инструменты разработаны с учётом актуальных нормативов и формул, обеспечивая точность 
    и удобство использования на любых устройствах.
  </p>

  <p style={{
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '1.7',
    marginBottom: '16px'
  }}>
    <strong style={{ color: '#06b6d4' }}>Доступные категории расчётов:</strong>
  </p>

  <ul style={{
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '2',
    marginBottom: '24px',
    paddingLeft: '20px'
  }}>
    <li>• <strong>Финансовые расчёты</strong> — ипотека, НДС, проценты</li>
    <li>• <strong>Конвертеры величин</strong> — длина, вес, объём, валюта</li>
    <li>• <strong>Здоровье и образ жизни</strong> — ИМТ, калории, беременность</li>
    <li>• <strong>Автомобильные расчёты</strong> — транспортный налог, шины</li>
    <li>• <strong>Хобби и развлечения</strong> — самогонщик, уравнения</li>
  </ul>

  <div style={{
    marginTop: '24px',
    padding: '20px',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: '12px',
    border: '1px solid #06b6d4'
  }}>
    <p style={{
      color: '#cbd5e1',
      fontSize: '15px',
      lineHeight: '1.6',
      margin: 0
    }}>
      💡 <strong style={{ color: '#06b6d4' }}>Совет:</strong> Для финансовых расчётов используйте актуальные данные, 
      для медицинских показателей (ИМТ, калории) рекомендуется консультация со специалистом.
    </p>
  </div>
</div>

      </div>
    </div>
  );
}