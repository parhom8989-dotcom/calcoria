// app/mechanics/silamassa/page.tsx
export default function SilamassaPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Основной контейнер с ограничением ширины */}
      <div className="mx-auto px-4 py-8 max-w-6xl">
        
        {/* 1. Заголовок и описание */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Конвертер силы и массы</h1>
        <p className="text-gray-400 mb-8 text-lg">Расчёт и конвертация между Ньютонами (Н), килограмм-силами (кгс) и другими единицами.</p>
        
        {/* 2. Карточка с калькулятором */}
        <div className="bg-gray-800 p-6 rounded-xl mb-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Онлайн-калькулятор</h2>
          
          <div className="space-y-4">
            {/* Поле ввода значения */}
            <div>
              <label className="block mb-2">Введите значение:</label>
              <input 
                type="number" 
                className="w-full p-3 bg-gray-700 rounded border border-gray-600" 
                placeholder="0" 
              />
            </div>
            
            {/* Выбор единиц измерения */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Из единицы:</label>
                <select className="w-full p-3 bg-gray-700 rounded border border-gray-600">
                  <option>Ньютоны (Н)</option>
                  <option>Килограмм-силы (кгс)</option>
                  <option>Дина (дин)</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2">В единицу:</label>
                <select className="w-full p-3 bg-gray-700 rounded border border-gray-600">
                  <option>Килограмм-силы (кгс)</option>
                  <option>Ньютоны (Н)</option>
                  <option>Дина (дин)</option>
                </select>
              </div>
            </div>
            
            {/* Кнопка расчета */}
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors">
              Рассчитать
            </button>
          </div>
          
          {/* Блок с результатом */}
          <div className="mt-6 p-4 bg-gray-900 rounded">
            <h3 className="text-xl font-semibold">Результат:</h3>
            <p className="text-3xl mt-2 text-green-400">0 кгс</p>
          </div>
        </div>
        
        {/* 3. Пояснительный текст для SEO */}
        <div className="prose prose-invert max-w-none">
          <h2>Что такое сила и масса?</h2>
          <p>Сила — векторная физическая величина, являющаяся мерой воздействия на данное тело со стороны других тел...</p>
          
          <h3>Основные формулы</h3>
          <p>Второй закон Ньютона: F = m · a, где F — сила, m — масса, a — ускорение.</p>
          
          <h3>Таблица перевода единиц</h3>
          <ul>
            <li><strong>1 Ньютон (Н)</strong> = 0.10197 килограмм-силы (кгс)</li>
            <li><strong>1 килограмм-сила (кгс)</strong> = 9.80665 Ньютонов (Н)</li>
            <li><strong>1 Н</strong> = 100000 дин (дин)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}