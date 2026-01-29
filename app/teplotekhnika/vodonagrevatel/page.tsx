// app/teplotekhnika/vodonagrevatel/page.tsx
"use client";

import { useState } from 'react';

export default function VodonagrevatelPage() {
  const [consumption, setConsumption] = useState("8");

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Карточка */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #334155'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#38bdf8'
          }}>
            🚰 Калькулятор водонагревателя
          </h1>
          
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
            Проверка работы страницы. Введите расход воды:
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '8px' }}>Расход воды (л/мин):</div>
            <input
              type="number"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>
          
          {/* Результат */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #334155'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#38bdf8' }}>
              {(parseFloat(consumption) || 0) * 15} литров
            </div>
            <div style={{ color: '#94a3b8', marginTop: '8px' }}>
              Примерный объём бойлера
            </div>
          </div>
        </div>
        
        {/* Информация */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Что дальше?</h2>
          <p style={{ color: '#cbd5e1' }}>
            1. Установите Node.js с сайта nodejs.org<br/>
            2. Перезапустите VS Code<br/>
            3. После установки Tailwind стили станут красивее
          </p>
        </div>
        
      </div>
    </div>
  );
}