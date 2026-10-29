
ТЕХНИЧЕСКОЕ ЗАДАНИЕ (ТЗ)

Проект: Разработка высокотехнологичного сайта-визитки для ИИ-студии (AI Studio)
Инженерный бэкэнд команды: Гульназ Мусина (AI-разработчик & Архитектор решений)
Стек разработки: Next.js 15+ (App Router, TypeScript), Tailwind CSS v3+, Shadcn UI, Lucide React, Framer Motion.
Целевая платформа деплоя: Yandex Cloud (Ubuntu VM / Object Storage).

1. Концепция и визуальный стиль (UI/UX)

• Тема оформления: Глубокий премиальный Dark Mode. Основной фон — #030712 (gray-950) и веб-слои #090d16. Исключить использование чистого, тяжелого черного цвета (#000000) и устаревших желтых оттенков.
• Акценты и эффекты: Индиго (#4f46e5), фиолетовый (#a855f7), неоновые тонкие границы карт (border-white/5 или border-indigo-500/20), эффекты стеклянного размытия (backdrop-blur-md) и фоновые радиальные градиенты со свечением (blur-3xl, opacity-20).
• Анимации: Мягкий микро-скейлинг при наведении (hover), плавное появление блоков при скролле (Scroll Reveal через Framer Motion).
• Адаптивность: Строгий подход Mobile-First. Идеальное масштабирование и автоматическая подстройка под ширину экрана без горизонтального скролла на любых устройствах.

2. Архитектура и структура кода (Фронтенд)

Проект должен иметь чистую компонентную структуру:
• src/app/ — роутинг, глобальные стили (globals.css) и конфигурация разметки.
• src/components/ui/ — атомарные компоненты из библиотеки Shadcn UI (кнопки, чекбоксы, формы, инпуты).
• src/components/sections/ — изолированные крупные секции лендинга (Hero, Expertise, Solutions, Calculator, Contacts).
• src/types/ — строгие типы TypeScript для калькулятора и форм.

3. Структура страниц и контентные блоки (Single Page)


3.1. Sticky Header (Навигация)

• Слева: Минималистичный логотип с градиентной иконкой и текстом AI.STUDIO.
• Центр: Навигационные ссылки-якоря: Экспертиза, Проекты, Калькулятор стоимости.
• Справа: Контрастная кнопка Связаться, плавно перенаправляющая к подвалу сайта.

3.2. Hero Section (Главный экран)

• Визуальный маркер: Тонкий интерактивный бейдж «Студия умной автоматизации процессов» с пульсирующей фиолетовой точкой (animate-pulse).
• Главный H1: Заголовок «Интегрируем Генеративный ИИ в реальный бизнес». Слова «Генеративный ИИ» выделить градиентом (Indigo-to-Purple).
• Текст: Фокус на создании автономных ИИ-агентов, интеллектуальных RAG-систем и быстром выводе на рынок Live MVPs без многомесячных затрат на классическую веб-разработку.
• CTA: Две кнопки — основная («Рассчитать MVP стоимость») и вторичная («Смотреть проекты»).

3.3. Блок компетенций и экспертизы (#expertise)

Сетка карточек, детально отражающая весь технологический стек и навыки команды:
• AI & Prompt Engineering: Проектирование сложных цепочек инструкций (Prompt Chaining), управление контекстом LLM (Token Economy), настройка Stop Sequences и Prompt Caching. Автономные агенты (Agentic AI) с памятью и RAG архитектурой (Metadata-Driven).
• Backend & Инфраструктура: Асинхронный Python (FastAPI, SQLAlchemy, Pydantic v2), Java (Spring Boot 3.x, Spring Data JPA/Hibernate, Maven), контейнеризация через Docker / Docker Compose и деплой на Linux (Ubuntu VM) в Yandex Cloud.
• Комплаенс и Безопасность: Проектирование корпоративных систем с учетом требований ФЗ-152 (Персональные данные) и ФЗ-115 (AML-комплаенс). Алгоритмы локального маскирования, токенизации и анонимизации конфиденциальных данных в памяти JVM/Python перед вызовом внешних LLM.

3.4. Архитектура реализованных решений (#solutions)

Блок представляет собой сетку, содержащую подробное описание ваших ключевых продуктов. Включите карточки для FinTech Compliance AI-Orchestrator (микросервис AML-комплаенса на Java 17 / Spring Boot 3.2.5), асинхронного сервиса классификации Helpdesk AI Backend на FastAPI, интеллектуального ИИ-ассистента Universal AI SQL Assistant на основе Metadata-Driven RAG и генератора отчетности AI Client Report Generator & CRM. Каждая карточка должна сопровождаться интерактивными тегами стека технологий.

3.5. Интерактивный калькулятор стоимости MVP

Реализуйте полноценный калькулятор стоимости и сроков на базе React State:
• Выбор чекбоксами: Платформа (Web-интерфейс, Telegram, VK), Архитектура ИИ (Простой чат-бот, ИИ-Агент с контекстной памятью, RAG-база знаний), Дополнительные интеграции (ФЗ-152 комплаенс, AmoCRM API, платежный шлюз Robokassa).
• Динамический автоматический пересчет итоговой стоимости проекта и сроков разработки «на лету» без перезагрузки страницы.

3.6. Валидируемая лид-форма и Контакты (#contact)

• Форма сбора заявок: Поля «Имя», «Telegram / Телефон», «Описание задачи». Реализуйте строгую валидацию полей.
• Прямые контактные данные: Email gmusina@list.ru, Telegram @GulnazM1101, телефон +7 (962) 609-00-01.

4. Требования к реализации для ИИ-агента

На основе предоставленных данных разверни и закодируй весь проект, уделяя особое внимание чистоте типов TypeScript, отказу от тестовых текстовых заглушек и полной технической точности b2b-описаний. Код должен быть полностью монолитным, масштабируемым и готовым к развертыванию.

Сводная таблица параметров проекта сайта-визитки


Атрибут спецификации	Описание требований
Стек технологий	Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
Цветовая палитра	Deep Dark Mode (основные фоны #030712 и #090d16, акценты Indigo/Purple)
Интерактивные модули	Динамический MVP Cost Calculator на React State, валидируемая лид-форма
Проекты в портфолио	FinTech Compliance AI-Orchestrator, Helpdesk AI Backend, Universal AI SQL Assistant, CRM-скрипты
Инфраструктура	Поддержка деплоя в Yandex Cloud (Ubuntu VM / Object Storage)


пример кода:
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #030712;
    color: #f3f4f6;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    scroll-behavior: smooth;
  }
}

/* Эффект футуристичного неонового бордера для карточек */
.glow-card {
  position: relative;
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
}

.glow-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    to bottom right, 
    rgba(99, 102, 241, 0.25), /* Indigo */
    rgba(168, 85, 247, 0.05), /* Purple */
    transparent 60%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* Радиальные фоновые ИИ-свечения */
.bg-radial-glow {
  background: radial-gradient(
    circle 800px at 50% -100px, 
    rgba(99, 102, 241, 0.12), /* Indigo */
    rgba(168, 85, 247, 0.06),  /* Purple */
    transparent 70%
  );
}


пример кода:
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        studioDark: "#090d16",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
