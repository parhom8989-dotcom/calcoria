// app/mechanics/page.tsx
"use client";

export default function MechanicsPage() {
  const calculators = [
    {
      id: 'sila-massa-uskorenie',
      title: 'Сила, масса, ускорение',
      description: 'Второй закон Ньютона: F = ma',
      icon: '⚖️',
      color: '#f59e0b',
      href: '/mechanics/sila-massa-uskorenie'
    },
    {
      id: 'rabota-energiya',
      title: 'Работа и энергия',
      description: 'Кинетическая и потенциальная энергия',
      icon: '⚡',
      color: '#10b981',
      href: '/mechanics/rabota-energiya'
    },
    {
      id: 'moshchnost-kpd',
      title: 'Мощность и КПД',
      description: 'Механическая мощность и эффективность',
      icon: '🔋',
      color: '#3b82f6',
      href: '/mechanics/moshchnost-kpd'
    },
    {
      id: 'skorost-put-vremya',
      title: 'Скорость, путь, время',
      description: 'Кинематика: v = s/t',
      icon: '🚗',
      color: '#8b5cf6',
      href: '/mechanics/skorost-put-vremya'
    },
    {
      id: 'gidravlika',
      title: 'Гидравлика',
      description: 'Давление, закон Паскаля, гидростатика',
      icon: '💧',
      color: '#06b6d4',
      href: '/mechanics/gidravlika'
    },
    {
      id: 'shkivy-peredachi',
      title: 'Шкивы и передачи',
      description: 'Ременные передачи, коэффициенты',
      icon: '⚙️',
      color: '#f59e0b',
      href: '/mechanics/shkivy-peredachi'
    },
    {
      id: 'pruzhiny',
      title: 'Пружины',
      description: 'Закон Гука, энергия пружин',
      icon: '🔄',
      color: '#10b981',
      href: '/mechanics/pruzhiny'
    },
    {
      id: 'moment-sily',
      title: 'Момент силы',
      description: 'Крутящий момент, рычаги',
      icon: '🌀',
      color: '#8b5cf6',
      href: '/mechanics/moment-sily'
    },
    {
      id: 'rychagi-ravnovesie',
      title: 'Рычаги и равновесие',
      description: 'Условия равновесия, выигрыш в силе',
      icon: '⚖️',
      color: '#60a5fa',
      href: '/mechanics/rychagi-ravnovesie'
    },
    {
      id: 'peredachi-reduktory',
      title: 'Передачи и редукторы',
      description: 'Зубчатые передачи, передаточные числа',
      icon: '⚙️',
      color: '#ea580c',
      href: '/mechanics/peredachi-reduktory'
    },
    {
      id: 'centr-mass',
      title: 'Центр масс',
      description: 'Центр тяжести системы тел',
      icon: '🎯',
      color: '#a855f7',
      href: '/mechanics/centr-mass'
    },
    {
      id: 'prochnost-balok',
      title: 'Прочность балок',
      description: 'Изгиб, прогиб, напряжение',
      icon: '📏',
      color: '#f59e0b',
      href: '/mechanics/prochnost-balok'
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
            color: '#f59e0b',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '1px solid #475569',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f59e0b';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#334155';
            e.currentTarget.style.color = '#f59e0b';
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
            color: '#f59e0b'
          }}>
            🔧 Калькуляторы механики
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Все необходимые инструменты для расчётов в механике и сопромате
          </p>
        </div>

        {/* СЕТКА КАЛЬКУЛЯТОРОВ - ТОЧНО КАК В ЭЛЕКТРОТЕХНИКЕ */}
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
                e.currentTarget.style.boxShadow = `0 10px 25px rgba(245, 158, 11, 0.2)`;
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
          border: '1px solid #334155'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#f59e0b'
          }}>
            О разделе "Механика"
          </h2>
          <div style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '16px' }}>
              В этом разделе собраны профессиональные калькуляторы для проектирования и расчёта механических систем, 
              подбора компонентов и анализа параметров конструкций. Все инструменты разработаны с учётом 
              действующих нормативов и практического инженерного опыта.
            </p>
            <p style={{ marginBottom: '16px' }}>
              <strong>Доступные категории расчётов:</strong>
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>• <strong>Динамика и кинематика</strong> — сила, масса, ускорение, скорость</li>
              <li style={{ marginBottom: '8px' }}>• <strong>Энергетические расчёты</strong> — работа, энергия, мощность, КПД</li>
              <li style={{ marginBottom: '8px' }}>• <strong>Гидравлика и пневматика</strong> — давление, расход, силы в жидкостях</li>
              <li style={{ marginBottom: '8px' }}>• <strong>Передачи и механизмы</strong> — шкивы, редукторы, зубчатые передачи</li>
              <li style={{ marginBottom: '8px' }}>• <strong>Сопротивление материалов</strong> — прочность балок, изгиб, напряжение</li>
              <li>• <strong>Статика и равновесие</strong> — рычаги, моменты сил, центр масс</li>
            </ul>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>
              💡 <strong>Совет:</strong> Для проектирования ответственных конструкций или сложных механических систем 
              рекомендуем проконсультироваться с профессиональным инженером-механиком.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}