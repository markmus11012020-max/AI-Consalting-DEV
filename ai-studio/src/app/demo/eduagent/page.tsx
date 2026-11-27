import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Layers,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section, SectionDivider } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const title = "EduAgent — демонстрация AI-слоя для СДО";
const description =
  "Как работает EduAgent: RAG-ассистент с цитатами, генерация тестов и презентаций, HITL-проверка преподавателем, Moodle, аналитика и eval.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/demo/eduagent" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/demo/eduagent",
    siteName: SITE.name,
    title,
    description,
    images: ["/demo/eduagent/dashboard.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/demo/eduagent/dashboard.png"],
  },
  robots: { index: true, follow: true },
};

const metrics = [
  { value: "108", label: "функциональных требований в ТЗ" },
  { value: "10", label: "backend-тестов в CI" },
  { value: "1.0", label: "hit@5 на демо-golden set" },
  { value: "4", label: "LLM-провайдера в одном шлюзе" },
];

const features = [
  {
    icon: Layers,
    title: "RAG с цитатами",
    text: "Ответы только по материалам курса. Ссылки на страницы PDF и слайды PPTX, честный отказ без контекста.",
  },
  {
    icon: Sparkles,
    title: "Контент-фабрика",
    text: "Тесты по Bloom, задания с рубриками и презентации PPTX. Blueprint, валидация и дедупликация.",
  },
  {
    icon: ShieldCheck,
    title: "HITL и экспорт",
    text: "Преподаватель утверждает каждый элемент. Экспорт в Moodle XML, GIFT, DOCX и PPTX.",
  },
  {
    icon: Workflow,
    title: "LMS и локальные LLM",
    text: "Moodle Web Services, Bitrix24, встраиваемый виджет. OpenAI, Ollama, LM Studio и vLLM.",
  },
];

const screens = [
  {
    eyebrow: "01 · Обзор",
    title: "Один экран для продукта и качества",
    description:
      "Стоимость, latency, approval rate и пробелы в знаниях собраны в панели преподавателя.",
    bullets: [
      "Стоимость и токены по каждому вызову",
      "p95 latency и доля утверждённого контента",
      "Темы, где студенты не получили ответ",
    ],
    image: "/demo/eduagent/dashboard.png",
    alt: "Панель EduAgent с метриками, последними генерациями и пробелами в знаниях",
  },
  {
    eyebrow: "02 · RAG-чат",
    title: "Студент получает ответ с источником",
    description:
      "Гибридный поиск по материалам курса, streaming-ответ и панель цитат с фрагментами лекций.",
    bullets: [
      "Цитаты на страницы и слайды",
      "Отказ, если в материалах нет ответа",
      "Эскалация преподавателю в один клик",
    ],
    image: "/demo/eduagent/chat.png",
    alt: "Чат EduAgent с ответом и панелью источников",
  },
  {
    eyebrow: "03 · Генерация",
    title: "Тест по Bloom за один запуск",
    description:
      "Выберите модуль, тему, количество вопросов, типы и уровни Bloom — система соберёт blueprint и запустит генерацию.",
    bullets: [
      "Один или несколько правильных ответов",
      "Объяснение и ссылка на источник",
      "Прогресс и история генераций",
    ],
    image: "/demo/eduagent/generate.png",
    alt: "Форма генерации теста в EduAgent",
  },
  {
    eyebrow: "04 · HITL",
    title: "Преподаватель утверждает каждый вопрос",
    description:
      "Review-очередь, редактор вопроса, approve/reject и экспорт только проверенных материалов.",
    bullets: [
      "Правка формулировок и вариантов",
      "Версии и комментарии проверки",
      "Moodle XML, GIFT, DOCX, PPTX",
    ],
    image: "/demo/eduagent/review.png",
    alt: "Очередь проверки и редактор тестового вопроса EduAgent",
  },
  {
    eyebrow: "05 · Аналитика",
    title: "Видно, где курс не отвечает",
    description:
      "Аналитика активности и пробелов помогает обновлять материалы, а не гадать, что непонятно студентам.",
    bullets: [
      "Сообщения и сессии по курсу",
      "Средняя уверенность retrieval",
      "Топ вопросов без ответа",
    ],
    image: "/demo/eduagent/analytics.png",
    alt: "Аналитика курса EduAgent",
  },
  {
    eyebrow: "06 · Eval",
    title: "Качество измеряется, а не декларируется",
    description:
      "Golden set с вопросами по демо-курсу, hit@5, MRR и citation accuracy. В CI используется mock-провайдер.",
    bullets: [
      "Retrieval hit@5 и MRR",
      "Citation accuracy",
      "История запусков и сравнение",
    ],
    image: "/demo/eduagent/evals.png",
    alt: "Страница eval в EduAgent",
  },
  {
    eyebrow: "07 · Виджет",
    title: "Ассистент встраивается в СДО",
    description:
      "Один script-тег добавляет чат в Moodle, Bitrix24 или корпоративный портал. Без cookies, с короткоживущим токеном.",
    bullets: [
      "Shadow DOM и изоляция стилей",
      "Токен ограничен курсом",
      "Цитаты и эскалация внутри виджета",
    ],
    image: "/demo/eduagent/embed.png",
    alt: "Демо-страница встраиваемого виджета EduAgent",
  },
];

const scenario = [
  {
    step: "01",
    title: "Загрузите материалы",
    text: "PDF, DOCX, PPTX или Markdown. Система извлечёт текст с якорями страниц и слайдов.",
  },
  {
    step: "02",
    title: "Задайте вопрос",
    text: "Студент получает ответ с цитатами или честный отказ и кнопку эскалации.",
  },
  {
    step: "03",
    title: "Сгенерируйте тест",
    text: "Blueprint по Bloom, типы вопросов и сложность. Валидация и дедупликация — автоматически.",
  },
  {
    step: "04",
    title: "Проверьте и утвердите",
    text: "Преподаватель правит вопрос, утверждает или отклоняет. Черновики не попадают в экспорт.",
  },
  {
    step: "05",
    title: "Экспортируйте в Moodle",
    text: "Moodle XML, GIFT, DOCX или PPTX. Пакет готов к импорту в курс.",
  },
  {
    step: "06",
    title: "Посмотрите аналитику",
    text: "Стоимость, latency, approval rate и темы, где материалам не хватает ответа.",
  },
];

const stack = [
  "FastAPI",
  "Next.js",
  "PostgreSQL",
  "pgvector",
  "Redis",
  "Docker",
  "OpenAI",
  "Ollama",
  "LM Studio",
  "vLLM",
];

export default function EduAgentDemoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EduAgent",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description,
    url: `${SITE.url}/demo/eduagent`,
    sameAs: "https://github.com/markmus11012020-max/EduAgent",
    offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]"
        />
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <Badge variant="accent" className="mb-5">
                <GraduationCap className="h-3.5 w-3.5" />
                Демонстрация сервиса
              </Badge>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
                EduAgent —{" "}
                <span className="text-gradient">AI-слой для СДО</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Платформа, которая превращает материалы курса в базу знаний,
                тесты, задания, презентации и ассистента с цитатами. С
                обязательной проверкой преподавателя и интеграцией с Moodle.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a
                    href="https://github.com/markmus11012020-max/EduAgent"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Открыть код на GitHub
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href="#scenario">
                    Смотреть сценарий
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {["open-source", "Moodle", "RAG", "HITL", "Ollama / vLLM"].map(
                  (item) => (
                    <Tag key={item} tone="indigo">
                      {item}
                    </Tag>
                  ),
                )}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <GlowCard className="overflow-hidden p-2.5">
                <Image
                  src="/demo/eduagent/dashboard.png"
                  alt="Панель EduAgent"
                  width={1440}
                  height={1000}
                  priority
                  className="h-auto w-full rounded-xl border border-border"
                />
              </GlowCard>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <Reveal key={metric.label} delay={0.05 * index}>
                <GlowCard className="h-full p-4">
                  <p className="font-display text-2xl font-bold tracking-[-0.03em] text-primary">
                    {metric.value}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">
                    {metric.label}
                  </p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider />

      <Section id="features" labelledBy="features-title">
        <Container>
          <Reveal>
            <SectionHeading
              id="features-title"
              eyebrow="Что внутри"
              title={
                <>
                  Не «чат с PDF», а{" "}
                  <span className="text-gradient">управляемый AI-контур</span>
                </>
              }
              description="Retrieval, генерация, проверка, экспорт и измерение качества связаны в один процесс."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={0.05 * index}>
                <GlowCard className="h-full p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                    {feature.text}
                  </p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider />

      <Section id="screens" labelledBy="screens-title">
        <Container>
          <Reveal>
            <SectionHeading
              id="screens-title"
              eyebrow="Экраны"
              title={
                <>
                  Как выглядит{" "}
                  <span className="text-gradient">рабочий процесс</span>
                </>
              }
              description="Скриншоты демо-курса «Основы финансового анализа». Данные синтетические."
            />
          </Reveal>

          <div className="mt-12 space-y-6">
            {screens.map((screen, index) => (
              <Reveal key={screen.title} delay={0.04 * (index % 2)}>
                <GlowCard className="overflow-hidden">
                  <div
                    className={cn(
                      "grid gap-0 lg:grid-cols-2",
                      index % 2 === 1 && "lg:[&>div:first-child]:order-2",
                    )}
                  >
                    <div className="flex flex-col justify-center p-6 sm:p-8">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        {screen.eyebrow}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold leading-tight sm:text-2xl">
                        {screen.title}
                      </h3>
                      <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
                        {screen.description}
                      </p>
                      <ul className="mt-5 space-y-2">
                        {screen.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2 text-[13.5px] leading-relaxed text-foreground/80"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/35 p-3 sm:p-4">
                      <Image
                        src={screen.image}
                        alt={screen.alt}
                        width={1440}
                        height={1000}
                        className="h-auto w-full rounded-xl border border-border"
                      />
                    </div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider />

      <Section id="scenario" labelledBy="scenario-title">
        <Container>
          <Reveal>
            <SectionHeading
              id="scenario-title"
              eyebrow="Сценарий"
              title={
                <>
                  Пять минут —{" "}
                  <span className="text-gradient">от лекции до теста</span>
                </>
              }
              description="Демо-сценарий, который можно повторить на локальном стенде или на созвоне."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenario.map((item, index) => (
              <Reveal key={item.step} delay={0.04 * index}>
                <GlowCard className="h-full p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {item.step}
                    </span>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider />

      <Section id="stack" labelledBy="stack-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <SectionHeading
                id="stack-title"
                eyebrow="Технологии"
                title={
                  <>
                    Один шлюз —{" "}
                    <span className="text-gradient">любая модель</span>
                  </>
                }
                description="Внешний OpenAI-совместимый API или локальный инференс. Смена провайдера не меняет бизнес-логику."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <GlowCard className="p-6 sm:p-7">
                <div className="flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <Tag key={item} tone="indigo">
                      {item}
                    </Tag>
                  ))}
                </div>
                <div className="mt-6 space-y-3 border-t border-border pt-5">
                  {[
                    "Moodle XML / GIFT и загрузка файлов в draft area",
                    "PII-маскирование и RBAC на уровне курса",
                    "Docker Compose, CI и golden set для регрессий",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-foreground/80"
                    >
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </GlowCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section id="demo-cta" labelledBy="demo-cta-title">
        <Container>
          <Reveal>
            <GlowCard className="overflow-hidden p-7 sm:p-10">
              <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    Open-source
                  </p>
                  <h2
                    id="demo-cta-title"
                    className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
                  >
                    Код, ТЗ и демо-сценарий открыты
                  </h2>
                  <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
                    Репозиторий содержит backend, frontend, Docker Compose,
                    Alembic, golden set и 10 тестов. Локальный стенд поднимается
                    на SQLite и mock-провайдере, production — на
                    PostgreSQL/pgvector и Redis.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button asChild>
                    <a
                      href="https://github.com/markmus11012020-max/EduAgent"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      GitHub EduAgent
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/#contact">
                      Обсудить внедрение
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
