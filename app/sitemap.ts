// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calcoria.ru'; // только один раз
  
  const calculators = [
    // Механика
    { url: 'mechanics', priority: 0.8 }, // убрали слеш в начале
    { url: 'mechanics/rychagi', priority: 0.7 },
    { url: 'mechanics/peredachi', priority: 0.7 },
    { url: 'mechanics/centr-mass', priority: 0.7 },
    { url: 'mechanics/prochnost-balki', priority: 0.7 },
    { url: 'mechanics/horsepower', priority: 0.7 },
    
    // Электротехника
    { url: 'elektrotekhnika', priority: 0.8 },
    { url: 'elektrotekhnika/zakon-oma', priority: 0.7 },
    { url: 'elektrotekhnika/rezistor-led', priority: 0.7 },
    { url: 'elektrotekhnika/solar', priority: 0.7 },
    
    // Теплотехника
    { url: 'teplotekhnika', priority: 0.8 },
    
    // Прочее (other)
    { url: 'other', priority: 0.8 },
    { url: 'other/cement', priority: 0.7 },
    { url: 'other/age', priority: 0.7 },
    { url: 'other/random', priority: 0.7 },
    { url: 'other/password', priority: 0.7 },
    { url: 'other/proportions', priority: 0.7 },
    { url: 'other/clothes-size', priority: 0.7 },
    { url: 'other/plitka', priority: 0.7 },
    { url: 'other/molar', priority: 0.7 },
    { url: 'other/colors', priority: 0.7 },
    { url: 'other/cycle', priority: 0.7 },
    { url: 'other/currency', priority: 0.7 },
    { url: 'other/bmi', priority: 0.7 },
    { url: 'other/pregnancy', priority: 0.7 },
    { url: 'other/equations', priority: 0.7 },
    { url: 'other/transport', priority: 0.7 },
    { url: 'other/mortgage', priority: 0.7 },
    { url: 'other/percentage', priority: 0.7 },
    { url: 'other/moonshine', priority: 0.7 },
    { url: 'other/calories', priority: 0.7 },
    { url: 'other/converter', priority: 0.7 },
    { url: 'other/vat', priority: 0.7 },
    { url: 'other/tire', priority: 0.7 },
    
    // Дополнительные
    { url: 'about', priority: 0.5 },
  ];

  return calculators.map((calc) => ({
    url: `${baseUrl}/${calc.url}`, // добавляем слеш между baseUrl и url
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: calc.priority || 0.6,
  }));
}