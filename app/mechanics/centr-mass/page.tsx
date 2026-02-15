// app/mechanics/centr-mass/page.tsx
"use client";

import { useState, useEffect } from 'react';

// Интерфейсы для типизации
interface Point {
  x: string;
  y: string;
  mass: string;
}

interface TrianglePoint {
  x: string;
  y: string;
}

interface Body {
  type: string;
  x: string;
  y: string;
  mass: string;
  params: any;
}

interface Example {
  name: string;
  type: 'twoPoints' | 'multiplePoints' | 'line' | 'triangle' | 'composite';
  points?: Point[];
  length?: string;
  density?: string;
  bodies?: Body[];
}

export default function CentrMassPage() {
  // Режим расчета
  const [mode, setMode] = useState<'twoPoints' | 'multiplePoints' | 'line' | 'triangle' | 'composite'>('twoPoints');
  
  // Координаты и массы точек
  const [points, setPoints] = useState<Point[]>([
    { x: '1', y: '2', mass: '3' },
    { x: '4', y: '1', mass: '2' }
  ]);
  
  // Для линейного объекта
  const [length, setLength] = useState<string>('10');
  const [density, setDensity] = useState<string>('1');
  
  // Для треугольника
  const [trianglePoints, setTrianglePoints] = useState<TrianglePoint[]>([
    { x: '0', y: '0' },
    { x: '4', y: '0' },
    { x: '2', y: '3' }
  ]);
  
  // Для составного тела
  const [bodies, setBodies] = useState<Body[]>([
    { type: 'rectangle', x: '0', y: '0', mass: '5', params: { width: '2', height: '3' } },
    { type: 'circle', x: '3', y: '2', mass: '3', params: { radius: '1' } }
  ]);
  
  // Результаты
  const [result, setResult] = useState<{
    x: number;
    y: number;
    totalMass: number;
    explanation: string;
    formula: string;
    warnings: string[];
    details: Array<{label: string, value: string}>;
  } | null>(null);

  // Типовые массы (кг)
  const typicalMasses = [
    { value: '1', label: '1 кг', desc: 'Лёгкая' },
    { value: '5', label: '5 кг', desc: 'Средняя' },
    { value: '10', label: '10 кг', desc: 'Тяжёлая' },
    { value: '50', label: '50 кг', desc: 'Очень тяжёлая' },
    { value: '100', label: '100 кг', desc: 'Гигантская' },
    { value: '0.1', label: '0.1 кг', desc: 'Очень лёгкая' },
  ];

  // Типовые координаты (м)
  const typicalCoordinates = [
    { value: '1', label: '1 м', desc: 'Близко' },
    { value: '2', label: '2 м', desc: 'Средне' },
    { value: '5', label: '5 м', desc: 'Далеко' },
    { value: '10', label: '10 м', desc: 'Очень далеко' },
    { value: '0.5', label: '0.5 м', desc: 'Очень близко' },
    { value: '0', label: '0 м', desc: 'В начале' },
  ];

  // Типовые длины (м)
  const typicalLengths = [
    { value: '1', label: '1 м', desc: 'Короткая' },
    { value: '2', label: '2 м', desc: 'Средняя' },
    { value: '5', label: '5 м', desc: 'Длинная' },
    { value: '10', label: '10 м', desc: 'Очень длинная' },
    { value: '0.5', label: '0.5 м', desc: 'Очень короткая' },
    { value: '20', label: '20 м', desc: 'Гигантская' },
  ];

  // Примеры систем
  const examples: Example[] = [
    { 
      name: 'Две гири на рычаге', 
      type: 'twoPoints',
      points: [
        { x: '1', y: '0', mass: '2' },
        { x: '3', y: '0', mass: '1' }
      ]
    },
    { 
      name: 'Три точки в вершинах', 
      type: 'multiplePoints',
      points: [
        { x: '0', y: '0', mass: '1' },
        { x: '3', y: '0', mass: '1' },
        { x: '1.5', y: '2', mass: '1' }
      ]
    },
    { 
      name: 'Однородный стержень', 
      type: 'line',
      length: '6',
      density: '1'
    },
    { 
      name: 'Треугольная пластина', 
      type: 'triangle'
    },
    { 
      name: 'Гантель (2 шара)', 
      type: 'composite',
      bodies: [
        { type: 'circle', x: '0', y: '0', mass: '3', params: { radius: '0.5' } },
        { type: 'circle', x: '2', y: '0', mass: '3', params: { radius: '0.5' } }
      ]
    }
  ];

  // Расчет центра масс
  const calculateCenterOfMass = () => {
    const warnings: string[] = [];
    let totalMass = 0;
    let sumMx = 0;
    let sumMy = 0;
    let formula = '';
    let explanation = '';
    let details: Array<{label: string, value: string}> = [];

    switch(mode) {
      case 'twoPoints':
      case 'multiplePoints':
        // Для дискретных точек
        points.forEach((point, index) => {
          const m = parseFloat(point.mass) || 0;
          const x = parseFloat(point.x) || 0;
          const y = parseFloat(point.y) || 0;
          
          totalMass += m;
          sumMx += m * x;
          sumMy += m * y;
        });
        
        formula = 'X_c = Σ(mᵢ·xᵢ) / Σmᵢ, Y_c = Σ(mᵢ·yᵢ) / Σmᵢ';
        explanation = `Центр масс системы ${points.length} материальных точек`;
        
        details = points.map((point, index) => ({
          label: `Точка ${index + 1}`,
          value: `(${point.x}, ${point.y}) м, масса: ${point.mass} кг`
        }));
        break;
        
      case 'line':
        // Для однородного стержня
        const L = parseFloat(length) || 0;
        const ρ = parseFloat(density) || 0;
        totalMass = L * ρ;
        sumMx = totalMass * (L / 2); // Центр в середине
        sumMy = 0;
        
        formula = 'X_c = L/2, Y_c = 0 (для горизонтального стержня)';
        explanation = `Центр масс однородного стержня длиной ${L} м`;
        
        details = [
          { label: 'Длина стержня', value: `${L} м` },
          { label: 'Плотность', value: `${ρ} кг/м` },
          { label: 'Общая масса', value: `${totalMass.toFixed(2)} кг` }
        ];
        break;
        
      case 'triangle':
        // Для треугольника (центр в точке пересечения медиан)
        const [A, B, C] = trianglePoints;
        const x1 = parseFloat(A.x) || 0;
        const y1 = parseFloat(A.y) || 0;
        const x2 = parseFloat(B.x) || 0;
        const y2 = parseFloat(B.y) || 0;
        const x3 = parseFloat(C.x) || 0;
        const y3 = parseFloat(C.y) || 0;
        
        const centerX = (x1 + x2 + x3) / 3;
        const centerY = (y1 + y2 + y3) / 3;
        
        formula = 'X_c = (x₁ + x₂ + x₃)/3, Y_c = (y₁ + y₂ + y₃)/3';
        explanation = 'Центр масс однородной треугольной пластины';
        
        details = [
          { label: 'Вершина A', value: `(${x1}, ${y1}) м` },
          { label: 'Вершина B', value: `(${x2}, ${y2}) м` },
          { label: 'Вершина C', value: `(${x3}, ${y3}) м` }
        ];
        
        // Используем для расчетов
        totalMass = 1; // Условная масса для однородного тела
        sumMx = centerX * totalMass;
        sumMy = centerY * totalMass;
        break;
        
      case 'composite':
        // Для составного тела
        bodies.forEach((body, index) => {
          const m = parseFloat(body.mass) || 0;
          const x = parseFloat(body.x) || 0;
          const y = parseFloat(body.y) || 0;
          
          totalMass += m;
          sumMx += m * x;
          sumMy += m * y;
        });
        
        formula = 'X_c = Σ(mᵢ·xᵢ) / Σmᵢ, Y_c = Σ(mᵢ·yᵢ) / Σmᵢ';
        explanation = `Центр масс составного тела из ${bodies.length} частей`;
        
        details = bodies.map((body, index) => ({
          label: `Тело ${index + 1} (${body.type})`,
          value: `(${body.x}, ${body.y}) м, масса: ${body.mass} кг`
        }));
        break;
    }

    // Проверки
    if (totalMass <= 0) {
      warnings.push('⚠️ Общая масса должна быть положительной');
      if (mode === 'line' && parseFloat(density) <= 0) {
        warnings.push('⚠️ Плотность должна быть положительной');
      }
    }
    
    if (mode !== 'line' && mode !== 'triangle') {
      points.forEach((point, index) => {
        const m = parseFloat(point.mass);
        if (m <= 0) warnings.push(`⚠️ Масса точки ${index + 1} должна быть положительной`);
      });
    }
    
    if (mode === 'composite') {
      bodies.forEach((body, index) => {
        const m = parseFloat(body.mass);
        if (m <= 0) warnings.push(`⚠️ Масса тела ${index + 1} должна быть положительной`);
      });
    }

    const centerX = totalMass > 0 ? sumMx / totalMass : 0;
    const centerY = totalMass > 0 ? sumMy / totalMass : 0;

    setResult({
      x: centerX,
      y: centerY,
      totalMass,
      explanation,
      formula,
      warnings,
      details
    });
  };

  useEffect(() => {
    calculateCenterOfMass();
  }, [mode, points, length, density, trianglePoints, bodies]);

  const resetCalculator = () => {
    setPoints([
      { x: '1', y: '2', mass: '3' },
      { x: '4', y: '1', mass: '2' }
    ]);
    setLength('10');
    setDensity('1');
    setTrianglePoints([
      { x: '0', y: '0' },
      { x: '4', y: '0' },
      { x: '2', y: '3' }
    ]);
    setBodies([
      { type: 'rectangle', x: '0', y: '0', mass: '5', params: { width: '2', height: '3' } },
      { type: 'circle', x: '3', y: '2', mass: '3', params: { radius: '1' } }
    ]);
  };

  const loadExample = (example: Example) => {
    setMode(example.type);
    
    // Загружаем точки если есть
    if (example.points) {
      setPoints(example.points);
    } else {
      // Сбрасываем точки к начальному значению
      setPoints([
        { x: '1', y: '2', mass: '3' },
        { x: '4', y: '1', mass: '2' }
      ]);
    }
    
    // Загружаем другие параметры
    if (example.length) setLength(example.length);
    if (example.density) setDensity(example.density);
    
    // Загружаем тела если есть
    if (example.bodies) {
      setBodies(example.bodies);
    } else {
      // Сбрасываем тела к начальному значению
      setBodies([
        { type: 'rectangle', x: '0', y: '0', mass: '5', params: { width: '2', height: '3' } },
        { type: 'circle', x: '3', y: '2', mass: '3', params: { radius: '1' } }
      ]);
    }
    
    // Для треугольника сбрасываем вершины
    if (example.type === 'triangle') {
      setTrianglePoints([
        { x: '0', y: '0' },
        { x: '4', y: '0' },
        { x: '2', y: '3' }
      ]);
    }
  };

  const addPoint = () => {
    setPoints([...points, { x: '0', y: '0', mass: '1' }]);
  };

  const removePoint = (index: number) => {
    if (points.length > 2) {
      const newPoints = [...points];
      newPoints.splice(index, 1);
      setPoints(newPoints);
    }
  };

  const updatePoint = (index: number, field: 'x' | 'y' | 'mass', value: string) => {
    const newPoints = [...points];
    newPoints[index][field] = value;
    setPoints(newPoints);
  };

  const updateTrianglePoint = (index: number, field: 'x' | 'y', value: string) => {
    const newPoints = [...trianglePoints];
    newPoints[index][field] = value;
    setTrianglePoints(newPoints);
  };

  const addBody = () => {
    setBodies([...bodies, { 
      type: 'rectangle', 
      x: '0', 
      y: '0', 
      mass: '1', 
      params: { width: '1', height: '1' } 
    }]);
  };

  const removeBody = (index: number) => {
    if (bodies.length > 1) {
      const newBodies = [...bodies];
      newBodies.splice(index, 1);
      setBodies(newBodies);
    }
  };

  const updateBody = (index: number, field: 'x' | 'y' | 'mass' | 'type', value: string) => {
    const newBodies = [...bodies];
    if (field === 'type') {
      newBodies[index].type = value;
      // Установить параметры по умолчанию для нового типа
      if (value === 'circle') {
        newBodies[index].params = { radius: '1' };
      } else if (value === 'rectangle') {
        newBodies[index].params = { width: '1', height: '1' };
      } else if (value === 'point') {
        newBodies[index].params = {};
      }
    } else {
      (newBodies[index] as any)[field] = value;
    }
    setBodies(newBodies);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* КАРТОЧКА КАЛЬКУЛЯТОРА */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #334155',
          backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #4c1d95 100%)'
        }}>
          
          {/* Заголовок */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#a855f7',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              ⚖️ Калькулятор центра масс (центра тяжести)
            </h1>
            <p style={{ color: '#d8b4fe' }}>
              Расчёт центра масс системы материальных точек, тел и составных объектов
            </p>
          </div>

          {/* Кнопки навигации */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <a 
              href="/mechanics"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#7c3aed',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: 'none',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
            >
              ← В каталог
            </a>
            
            <button
              onClick={resetCalculator}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#7c3aed',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
            >
              🔄 Сбросить
            </button>
          </div>

          {/* Выбор режима */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#e9d5ff', marginBottom: '12px', fontSize: '18px' }}>
              Выберите тип системы:
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setMode('twoPoints')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'twoPoints' ? '#a855f7' : '#334155',
                  color: mode === 'twoPoints' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'twoPoints' ? '#a855f7' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'twoPoints') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'twoPoints') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                2 точки
              </button>
              
              <button
                type="button"
                onClick={() => setMode('multiplePoints')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'multiplePoints' ? '#a855f7' : '#334155',
                  color: mode === 'multiplePoints' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'multiplePoints' ? '#a855f7' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'multiplePoints') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'multiplePoints') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Много точек
              </button>
              
              <button
                type="button"
                onClick={() => setMode('line')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'line' ? '#a855f7' : '#334155',
                  color: mode === 'line' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'line' ? '#a855f7' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'line') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'line') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Линейный объект
              </button>
              
              <button
                type="button"
                onClick={() => setMode('triangle')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'triangle' ? '#a855f7' : '#334155',
                  color: mode === 'triangle' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'triangle' ? '#a855f7' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'triangle') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'triangle') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Треугольник
              </button>
              
              <button
                type="button"
                onClick={() => setMode('composite')}
                style={{
                  padding: '12px',
                  backgroundColor: mode === 'composite' ? '#a855f7' : '#334155',
                  color: mode === 'composite' ? '#0f172a' : 'white',
                  border: `2px solid ${mode === 'composite' ? '#a855f7' : '#475569'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (mode !== 'composite') e.currentTarget.style.backgroundColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'composite') e.currentTarget.style.backgroundColor = '#334155';
                }}
              >
                Составное тело
              </button>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#1e293b', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#d8b4fe',
              borderLeft: '4px solid #a855f7',
              borderTop: '1px solid #334155'
            }}>
              {mode === 'twoPoints' && 'X_c = (m₁x₁ + m₂x₂)/(m₁ + m₂), Y_c = (m₁y₁ + m₂y₂)/(m₁ + m₂)'}
              {mode === 'multiplePoints' && 'X_c = Σ(mᵢ·xᵢ) / Σmᵢ, Y_c = Σ(mᵢ·yᵢ) / Σmᵢ'}
              {mode === 'line' && 'Для однородного стержня: X_c = L/2, Y_c = 0'}
              {mode === 'triangle' && 'Для однородного треугольника: X_c = (x₁ + x₂ + x₃)/3, Y_c = (y₁ + y₂ + y₃)/3'}
              {mode === 'composite' && 'X_c = Σ(mᵢ·xᵢ) / Σmᵢ, Y_c = Σ(mᵢ·yᵢ) / Σmᵢ'}
            </div>
          </div>

          {/* Примеры */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#e9d5ff', marginBottom: '12px', fontSize: '18px' }}>
              Примеры систем:
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '16px'
            }}>
              {examples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => loadExample(example)}
                  style={{
                    padding: '10px 8px',
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{example.name}</div>
                  <div style={{ fontSize: '10px', opacity: 0.9 }}>
                    {example.type === 'twoPoints' ? '2 точки' : 
                     example.type === 'multiplePoints' ? 'Много точек' : 
                     example.type === 'line' ? 'Стержень' :
                     example.type === 'triangle' ? 'Треугольник' : 'Составное'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Параметры системы */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#e9d5ff', marginBottom: '16px', fontSize: '18px' }}>
              Параметры системы:
            </h2>
            
           {/* Дискретные точки */}
{(mode === 'twoPoints' || mode === 'multiplePoints') && (
  <div style={{ 
    padding: '16px', 
    backgroundColor: '#1e293b', 
    borderRadius: '8px',
    border: '1px solid #334155',
    marginBottom: '20px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <h3 style={{ color: '#a855f7', fontSize: '16px' }}>
        Материальные точки ({points.length} шт.):
      </h3>
      {mode === 'multiplePoints' && (
        <button
          type="button"
          onClick={addPoint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
        >
          + Добавить точку
        </button>
      )}
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {points.map((point, index) => (
        <div key={index} style={{ 
          padding: '16px',
          backgroundColor: '#0f172a',
          borderRadius: '6px'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{ color: '#cbd5e1', fontWeight: 'bold' }}>
              Точка {index + 1}
            </div>
            {mode === 'multiplePoints' && points.length > 2 && (
              <button
                type="button"
                onClick={() => removePoint(index)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                Удалить
              </button>
            )}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Координата X (м)</div>
              <input
                type="number"
                step="0.1"
                value={point.x}
                onChange={(e) => updatePoint(index, 'x', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Координата Y (м)</div>
              <input
                type="number"
                step="0.1"
                value={point.y}
                onChange={(e) => updatePoint(index, 'y', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
          
          <div>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Масса (кг)</div>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={point.mass}
              onChange={(e) => updatePoint(index, 'mass', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)}
            
            {/* Линейный объект */}
            {mode === 'line' && (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#1e293b', 
                borderRadius: '8px',
                border: '1px solid #334155',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#a855f7', marginBottom: '16px', fontSize: '16px' }}>
                  Однородный стержень:
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ color: '#cbd5e1' }}>Длина стержня (м)</label>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Типовые:</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                      {typicalLengths.slice(0, 3).map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setLength(item.value)}
                          style={{
                            padding: '6px 4px',
                            backgroundColor: length === item.value ? '#a855f7' : '#334155',
                            color: length === item.value ? '#0f172a' : 'white',
                            border: `1px solid ${length === item.value ? '#a855f7' : '#475569'}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            textAlign: 'center',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Длина стержня"
                    />
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ color: '#cbd5e1' }}>Линейная плотность (кг/м)</label>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={density}
                      onChange={(e) => setDensity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Плотность на единицу длины"
                    />
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                      Для стали: ~7.8 кг/м (диаметр 1 см)
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Треугольник */}
            {mode === 'triangle' && (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#1e293b', 
                borderRadius: '8px',
                border: '1px solid #334155',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#a855f7', marginBottom: '16px', fontSize: '16px' }}>
                  Вершины треугольника:
                </h3>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {trianglePoints.map((point, index) => (
                    <div key={index} style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr 1fr',
                      gap: '12px', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#0f172a',
                      borderRadius: '6px'
                    }}>
                      <div style={{ color: '#cbd5e1', minWidth: '80px' }}>
                        Вершина {String.fromCharCode(65 + index)}:
                      </div>
                      
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Координата X (м)</div>
                        <input
                          type="number"
                          step="0.1"
                          value={point.x}
                          onChange={(e) => updateTrianglePoint(index, 'x', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            color: 'white'
                          }}
                        />
                      </div>
                      
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Координата Y (м)</div>
                        <input
                          type="number"
                          step="0.1"
                          value={point.y}
                          onChange={(e) => updateTrianglePoint(index, 'y', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            color: 'white'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Составное тело */}
            {mode === 'composite' && (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#1e293b', 
                borderRadius: '8px',
                border: '1px solid #334155',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: '#a855f7', fontSize: '16px' }}>
                    Составные тела ({bodies.length} шт.):
                  </h3>
                  <button
                    type="button"
                    onClick={addBody}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                  >
                    + Добавить тело
                  </button>
                </div>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {bodies.map((body, index) => (
                    <div key={index} style={{ 
                      padding: '12px',
                      backgroundColor: '#0f172a',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Тип тела</div>
                          <select
                            value={body.type}
                            onChange={(e) => updateBody(index, 'type', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              color: 'white'
                            }}
                          >
                            <option value="rectangle">Прямоугольник</option>
                            <option value="circle">Круг</option>
                            <option value="point">Точка</option>
                          </select>
                        </div>
                        
                        <div>
                          <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Центр X (м)</div>
                          <input
                            type="number"
                            step="0.1"
                            value={body.x}
                            onChange={(e) => updateBody(index, 'x', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              color: 'white'
                            }}
                          />
                        </div>
                        
                        <div>
                          <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Центр Y (м)</div>
                          <input
                            type="number"
                            step="0.1"
                            value={body.y}
                            onChange={(e) => updateBody(index, 'y', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              color: 'white'
                            }}
                          />
                        </div>
                        
                        <div>
                          <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Масса (кг)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={body.mass}
                            onChange={(e) => updateBody(index, 'mass', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              color: 'white'
                            }}
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeBody(index)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        >
                          ×
                        </button>
                      </div>
                      
                      <div style={{ color: '#94a3b8', fontSize: '12px', paddingLeft: '8px' }}>
                        {body.type === 'rectangle' && `Прямоугольник: ширина ${body.params.width} м, высота ${body.params.height} м`}
                        {body.type === 'circle' && `Круг: радиус ${body.params.radius} м`}
                        {body.type === 'point' && 'Точечная масса'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* РЕЗУЛЬТАТЫ */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #334155',
            marginBottom: '20px'
          }}>
            {result ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  {/* Основные результаты */}
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>
                      Координаты центра масс:
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a855f7', marginBottom: '8px' }}>
                      ({result.x.toFixed(4)}, {result.y.toFixed(4)})
                    </div>
                    <div style={{ color: '#d8b4fe', fontSize: '18px' }}>
                      метров
                    </div>
                    <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                      {result.explanation}
                    </div>
                  </div>
                  
                  {/* Детали расчета */}
                  {result.details && result.details.length > 0 && (
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '16px',
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: '1px solid #334155'
                    }}>
                      <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px' }}>
                        📋 Параметры системы:
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                        {result.details.map((item, index) => (
                          <div key={index} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.label}:</span>
                            <span style={{ fontWeight: 'bold', color: '#a855f7' }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Общая масса */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: '1px solid #334155'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '4px' }}>
                          📊 Общая масса системы:
                        </div>
                        <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                          Сумма всех масс
                        </div>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a855f7' }}>
                        {result.totalMass.toFixed(2)} кг
                      </div>
                    </div>
                  </div>
                  
                  {/* Формула */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: '1px solid #334155'
                  }}>
                    <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px' }}>
                      📝 Формула расчета:
                    </div>
                    <div style={{ color: '#e9d5ff', fontSize: '18px', fontFamily: 'monospace' }}>
                      {result.formula}
                    </div>
                  </div>
                  
                  {/* Предупреждения */}
                  {result.warnings.length > 0 && (
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '16px',
                      backgroundColor: '#4c1d95',
                      borderRadius: '8px',
                      border: '1px solid #a855f7'
                    }}>
                      <div style={{ color: '#a855f7', fontWeight: 'bold', marginBottom: '8px' }}>
                        ⚠️ Проверка параметров:
                      </div>
                      <div style={{ color: '#d8b4fe', fontSize: '14px' }}>
                        {result.warnings.map((warning, index) => (
                          <div key={index} style={{ marginBottom: '4px' }}>• {warning}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    const text = `Центр масс: (${result.x.toFixed(4)}, ${result.y.toFixed(4)}) м, Общая масса: ${result.totalMass.toFixed(2)} кг`;
                    navigator.clipboard.writeText(text);
                    alert('Результат скопирован!');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#7c3aed',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    width: '100%',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                >
                  📋 Копировать результат
                </button>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>⚖️</div>
                <div style={{ color: '#d8b4fe', fontSize: '18px', marginBottom: '12px' }}>
                  Введите параметры системы
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Укажите координаты и массы тел для расчёта центра масс
                </div>
              </div>
            )}
          </div>

          {/* Формулы */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid #334155'
          }}>
            <div style={{ color: '#a855f7', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              X_c = Σ(mᵢ·xᵢ) / Σmᵢ, Y_c = Σ(mᵢ·yᵢ) / Σmᵢ
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Основная формула центра масс системы материальных точек
            </div>
          </div>
        </div>

        {/* Объяснение */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#a855f7' }}>
            Теория: Центр масс системы тел
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#a855f7', marginBottom: '8px' }}>📏 Основные формулы</h3>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p><strong>Для системы материальных точек:</strong> X_c = Σ(mᵢ·xᵢ) / Σmᵢ, Y_c = Σ(mᵢ·yᵢ) / Σmᵢ</p>
              <p><strong>Для однородного стержня:</strong> X_c = L/2 (центр в середине)</p>
              <p><strong>Для однородного треугольника:</strong> X_c = (x₁ + x₂ + x₃)/3, Y_c = (y₁ + y₂ + y₃)/3</p>
              <p><strong>Для прямоугольной пластины:</strong> X_c = a/2, Y_c = b/2 (от угла)</p>
              <p><strong>Для круга:</strong> X_c = R, Y_c = R (от центра)</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#a855f7', marginBottom: '8px' }}>⚖️ Практические примеры</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Рычаг с гирями</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Масса 2 кг на 1 м<br/>
                  Масса 1 кг на 3 м<br/>
                  Центр: 1.67 м от 0
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Треугольная пластина</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Вершины: (0,0), (4,0), (0,3)<br/>
                  Центр масс: (1.33, 1)<br/>
                  Пересечение медиан
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Гантель</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Два шара по 3 кг<br/>
                  Расстояние: 2 м<br/>
                  Центр: посередине (1 м)
                </div>
              </div>
              
              <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Лодка с пассажирами</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  Лодка: 100 кг, центр 2 м<br/>
                  Человек: 80 кг, центр 4 м<br/>
                  Новый центр: ~2.67 м
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #a855f7'
          }}>
            <h4 style={{ color: '#a855f7', marginBottom: '8px' }}>💡 Практические советы</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Симметричное тело:</strong> центр масс на оси симметрии</p>
              <p>• <strong>Однородное тело:</strong> центр масс совпадает с геометрическим центром</p>
              <p>• <strong>Разделение на части:</strong> разбейте сложное тело на простые фигуры</p>
              <p>• <strong>Экспериментально:</strong> подвесьте тело в двух точках, центр масс на пересечении отвесов</p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>⚠️ Важные замечания</h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
              <p>• <strong>Центр масс может быть вне тела:</strong> подкова, кольцо, бублик</p>
              <p>• <strong>Для устойчивости:</strong> центр масс должен быть над опорой</p>
              <p>• <strong>В неоднородном поле тяжести:</strong> центр масс и центр тяжести не совпадают</p>
              <p>• <strong>При вращении:</strong> тело стремится вращаться вокруг центра масс</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}