import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://calcoria.ru',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://calcoria.ru/teplotekhnika', // ваша страница калькулятора
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
   {
  url: 'https://calcoria.ru/mechanics', // адрес новой страницы
  lastModified: new Date(), // сегодняшняя дата
  changeFrequency: 'monthly', // как часто меняется страница
  priority: 0.7, // важность от 0.1 до 1.0
}, 
{
  url: 'https://calcoria.ru/electrotech', // адрес новой страницы
  lastModified: new Date(), // сегодняшняя дата
  changeFrequency: 'monthly', // как часто меняется страница
  priority: 0.7, // важность от 0.1 до 1.0
}, 
{
  url: 'https://calcoria.ru/prochee', // адрес новой страницы
  lastModified: new Date(), // сегодняшняя дата
  changeFrequency: 'monthly', // как часто меняется страница
  priority: 0.7, // важность от 0.1 до 1.0
}  
    // Добавьте сюда все остальные страницы вашего сайта в таком же формате
  ]
}
