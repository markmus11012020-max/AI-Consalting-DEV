import { Calculator } from "@/components/sections/calculator";
import { Cases } from "@/components/sections/cases";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { PainPoints } from "@/components/sections/pain-points";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { TechStack } from "@/components/sections/tech-stack";
import { TradingBots } from "@/components/sections/trading-bots";
import { Trust } from "@/components/sections/trust";
import { SectionDivider } from "@/components/layout/section";
import { AGENT_USE_CASE, FAQ, SERVICES, USE_CASES } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        legalName: SITE.company.legalName,
        alternateName: SITE.company.shortName,
        taxID: SITE.company.inn,
        url: SITE.url,
        logo: `${SITE.url}/icon.svg`,
        image: `${SITE.url}/opengraph-image`,
        description: SITE.description,
        email: SITE.contacts.email,
        telephone: SITE.contacts.phone,
        areaServed: {
          "@type": "Country",
          name: "Россия",
        },
        sameAs: [
          "https://github.com/markmus11012020-max",
          SITE.contacts.telegramUrl,
          SITE.contacts.telegramSalesUrl,
        ],
        knowsAbout: [
          "Генеративный ИИ",
          "ИИ-агенты",
          "RAG-системы",
          "Торговые боты",
          "Hyperliquid",
          "dYdX",
          "FastAPI",
          "Spring Boot",
          "ФЗ-152",
          "ФЗ-115",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Направления внедрения ИИ",
          itemListElement: [...USE_CASES, AGENT_USE_CASE, ...SERVICES].map(
            (item) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: item.title,
                description: item.summary,
              },
            }),
          ),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}/#faq`,
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <SectionDivider />
      <PainPoints />
      <SectionDivider />
      <Services />
      <SectionDivider />
      <Cases />
      <SectionDivider />
      <TradingBots />
      <SectionDivider />
      <Calculator />
      <SectionDivider />
      <Process />
      <SectionDivider />
      <Trust />
      <SectionDivider />
      <TechStack />
      <SectionDivider />
      <Faq />
      <SectionDivider />
      <Contact />
    </main>
  );
}
