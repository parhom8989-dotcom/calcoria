// app/elektrotekhnika/page.tsx
"use client";

export default function ElektrotekhnikaPage() {
  const calculators = [
    {
      id: 'zakon-oma',
      title: 'Закон Ома',
      description: 'Расчёт напряжения, тока и сопротивления',
      icon: '⚡',
      color: 'from-blue-600 to-cyan-500',
      href: '/elektrotekhnika/zakon-oma'
    },
    {
      id: 'rezistor-led',
      title: 'Резистор для LED',
      description: 'Расчёт резистора для светодиода',
      icon: '💡',
      color: 'from-green-600 to-emerald-500',
      href: '/elektrotekhnika/rezistor-led'
    },
    {
      id: 'delitel-napryazheniya',
      title: 'Делитель напряжения',
      description: 'Расчёт выходного напряжения делителя',
      icon: '📊',
      color: 'from-purple-600 to-pink-500',
      href: '/elektrotekhnika/delitel-napryazheniya'
    },
    {
      id: 'rc-filtr',
      title: 'RC-фильтр',
      description: 'Расчёт постоянной времени и частоты среза',
      icon: '🔄',
      color: 'from-teal-600 to-cyan-500',
      href: '/elektrotekhnika/rc-filtr'
    },
    {
      id: 'puskovoj-kondensator',
      title: 'Пусковой конденсатор',
      description: 'Расчёт для электродвигателя',
      icon: '🌀',
      color: 'from-orange-600 to-amber-500',
      href: '/elektrotekhnika/puskovoj-kondensator'
    },
    {
      id: 'moschnost-tok-napryazhenie',
      title: 'Мощность, ток, напряжение',
      description: 'Расчёт для DC и AC цепей',
      icon: '🔋',
      color: 'from-cyan-600 to-blue-500',
      href: '/elektrotekhnika/moschnost-tok-napryazhenie'
    },
    {
      id: 'parallelnye-rezistory',
      title: 'Параллельные резисторы',
      description: 'Расчёт общего сопротивления',
      icon: '🔌',
      color: 'from-indigo-600 to-purple-500',
      href: '/elektrotekhnika/parallelnye-rezistory'
    },
    {
      id: 'temperatura-rezistora',
      title: 'Температура резистора',
      description: 'Расчёт нагрева и мощности',
      icon: '🌡️',
      color: 'from-red-600 to-pink-500',
      href: '/elektrotekhnika/temperatura-rezistora'
    },
    {
      id: 'tok-kz-avtomat',
      title: 'Ток короткого замыкания',
      description: 'Расчёт тока КЗ и выбор автомата',
      icon: '⚠️',
      color: 'from-yellow-600 to-amber-500',
      href: '/elektrotekhnika/tok-kz-avtomat'
    },
    {
      id: 'kondensatory',
      title: 'Конденсаторы',
      description: 'Последовательное/параллельное соединение',
      icon: '⚡',
      color: 'from-cyan-600 to-teal-500',
      href: '/elektrotekhnika/kondensatory'
    },
    {
      id: 'tajmer-ne555',
      title: 'Таймер NE555',
      description: 'Расчёт для астабильного и моностабильного режимов',
      icon: '⏱️',
      color: 'from-lime-600 to-green-500',
      href: '/elektrotekhnika/tajmer-ne555'
    },
    {
      id: 'setevoj-transformator',
      title: 'Сетевой трансформатор',
      description: 'Расчёт обмоток и сердечника',
      icon: '🔋',
      color: 'from-amber-600 to-orange-500',
      href: '/elektrotekhnika/setevoj-transformator'
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

      {/* КНОПКА "НА ГЛАВНУЮ" В ВЕРХНЕМ ЛЕВОМ УГЛУ */}
      <div style={{ marginBottom: '20px' }}>
        <a 
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#334155',
            color: '#38bdf8',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '1px solid #475569',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#38bdf8';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#334155';
            e.currentTarget.style.color = '#38bdf8';
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
            color: '#38bdf8'
          }}>
            ⚡ Калькуляторы электротехники
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Все необходимые инструменты для расчётов электрических цепей и компонентов
          </p>
        </div>

        {/* СЕТКА КАЛЬКУЛЯТОРОВ - ТОЧНО КАК В ТЕПЛОТЕХНИКЕ */}
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
                e.currentTarget.style.borderColor = '#38bdf8';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(56, 189, 248, 0.2)';
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
                    color: '#38bdf8'
                  }}>
                    {calc.title}
                  </h3>
                  <div style={{
                    height: '3px',
                    width: '40px',
                    backgroundColor: '#38bdf8',
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
                  color: '#38bdf8',
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
          border: '1px solid #334155'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#38bdf8'
          }}>
            О разделе "Электротехника"
          </h2>
          <div style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '16px' }}>
              В этом разделе собраны профессиональные калькуляторы для проектирования и расчёта электрических цепей, 
              подбора компонентов и анализа параметров электронных устройств. Все инструменты разработаны с учётом 
              действующих нормативов и практического опыта.
            </p>
            <p style={{ marginBottom: '16px' }}>
              <strong>Доступные категории расчётов:</strong>
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>• <strong>Основные законы</strong> — закон Ома, мощность, напряжение, ток</li>
              <li style={{ marginBottom: '8px' }}>• <strong>Пассивные компоненты</strong> — резисторы, конденсаторы, катушки</li>
              <li style={{ marginBottom: '8px' }}>• <strong>Цепи и фильтры</strong> — делители напряжения, RC-фильтры</li>
              <li style={{ marginBottom: '8px' }}>• <strong>Электродвигатели</strong> — пусковые конденсаторы, параметры</li>
              <li style={{ marginBottom: '8px' }}>• <strong>Защита и безопасность</strong> — токи КЗ, выбор автоматов</li>
              <li>• <strong>Интегральные схемы</strong> — таймеры, преобразователи</li>
            </ul>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>
              💡 <strong>Совет:</strong> Для проектирования сложных электронных устройств или силовых цепей 
              рекомендуем проконсультироваться с профессиональным инженером-электронщиком.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}