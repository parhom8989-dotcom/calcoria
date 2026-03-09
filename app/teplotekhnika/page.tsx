"use client";
import Head from 'next/head';

export default function TeplotekhnikaPage() {
  // Список калькуляторов в теплотехнике
  const calculators = [
    {
      id: 'teplovaya-moshchnost',
      title: 'Тепловая мощность',
      description: 'Расчёт мощности по формуле Q = m × c × ΔT',
      icon: '🔥',
      color: 'from-orange-600 to-red-500',
      href: '/teplotekhnika/teplovaya-moshchnost'
    },
    {
      id: 'vodonagrevatel',
      title: 'Водонагреватель',
      description: 'Расчёт объёма бойлера и мощности нагрева',
      icon: '🚰',
      color: 'from-blue-600 to-cyan-500',
      href: '/teplotekhnika/vodonagrevatel'
    },
    {
      id: 'kpd-kotla',
      title: 'КПД котла',
      description: 'Расчёт эффективности отопительного оборудования',
      icon: '⚡',
      color: 'from-green-600 to-emerald-500',
      href: '/teplotekhnika/kpd-kotla'
    },
    {
      id: 'raskhod-teplonositelya',
      title: 'Расход теплоносителя',
      description: 'Расчёт расхода по формуле Q = G × c × ΔT',
      icon: '💧',
      color: 'from-purple-600 to-pink-500',
      href: '/teplotekhnika/raskhod-teplonositelya'
    },
    {
      id: 'podbor-kotla',
      title: 'Подбор котла',
      description: 'Расчёт мощности отопительного котла',
      icon: '🏭',
      color: 'from-blue-600 to-indigo-500',
      href: '/teplotekhnika/podbor-kotla'
    },
    {
      id: 'teplopoteri-pomeshcheniya',
      title: 'Теплопотери помещения',
      description: 'Расчёт потерь тепла через ограждающие конструкции',
      icon: '🏠',
      color: 'from-pink-600 to-rose-500',
      href: '/teplotekhnika/teplopoteri-pomeshcheniya'
    },
    {
      id: 'moschnost-radiatorov',
      title: 'Мощность радиаторов',
      description: 'Расчёт количества секций и мощности радиаторов',
      icon: '🔥',
      color: 'from-blue-600 to-indigo-500',
      href: '/teplotekhnika/moschnost-radiatorov'
    },
    {
      id: 'teplyj-pol',
      title: 'Мощность тёплого пола',
      description: 'Расчёт мощности водяного тёплого пола',
      icon: '🌡️',
      color: 'from-yellow-600 to-amber-500',
      href: '/teplotekhnika/teplyj-pol'
    },
    {
      id: 'teplopoteri-trub',
      title: 'Теплопотери трубопроводов',
      description: 'Расчёт потерь тепла в трубопроводах',
      icon: '📏',
      color: 'from-gray-600 to-slate-500',
      href: '/teplotekhnika/teplopoteri-trub'
    }
  ];

  return (
    <>
      <Head>
        <title>Теплотехника | Калькуляторы отопления и ГВС | Calcoria</title>
        <meta name="description" content="Профессиональные калькуляторы для расчёта систем отопления, водонагревателей, теплопотерь, мощности котлов и радиаторов." />
        <link rel="canonical" href="https://www.calcoria.ru/teplotekhnika" />
      </Head>
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
              🔥 Калькуляторы теплотехники
            </h1>
            <p style={{
              color: '#94a3b8',
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Все необходимые инструменты для расчётов систем отопления и ГВС
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
              О разделе "Теплотехника"
            </h2>
            <div style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '16px' }}>
                В этом разделе собраны профессиональные калькуляторы для проектирования и расчёта систем отопления, 
                горячего водоснабжения и теплоснабжения. Все инструменты разработаны с учётом действующих 
                нормативов и практического опыта.
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Доступные категории расчётов:</strong>
              </p>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '8px' }}>• <strong>Водонагреватели и бойлеры</strong> — подбор объёма и мощности</li>
                <li style={{ marginBottom: '8px' }}>• <strong>Отопительное оборудование</strong> — котлы, радиаторы, теплообменники</li>
                <li style={{ marginBottom: '8px' }}>• <strong>Трубопроводы и гидравлика</strong> — диаметры, потери давления</li>
                <li>• <strong>Тепловые нагрузки</strong> — расчёт потребности в тепле</li>
              </ul>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                💡 <strong>Совет:</strong> Для точного проектирования сложных систем рекомендуем проконсультироваться 
                с профессиональным инженером-теплотехником.
              </p>
              <p style={{ marginTop: '16px', color: '#94a3b8' }}>
                Здесь вы найдёте инструменты для расчёта мощности котла, подбора диаметра труб, определения потерь тепла через ограждающие конструкции и выбора водонагревателя. Калькуляторы помогут как на этапе эскизного проектирования, так и для проверки готовых инженерных решений.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}