import { Calculator } from "@/components/sections/calculator";
import { Contact } from "@/components/sections/contact";
import { Expertise } from "@/components/sections/expertise";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { Solutions } from "@/components/sections/solutions";
import { Trust } from "@/components/sections/trust";
import { UseCases } from "@/components/sections/use-cases";
import { SectionDivider } from "@/components/layout/section";
import { AGENT_USE_CASE, USE_CASES } from "@/lib/content";
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
        url: SITE.url,
        description: SITE.description,
        email: SITE.contacts.email,
        telephone: SITE.contacts.phone,
        areaServed: {
          "@type": "Country",
          name: "Россия",
        },
        knowsAbout: [
          "Генеративный ИИ",
          "ИИ-агенты",
          "RAG-системы",
          "FastAPI",
          "Spring Boot",
          "ФЗ-152",
          "ФЗ-115",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Направления внедрения ИИ",
          itemListElement: [...USE_CASES, AGENT_USE_CASE].map((item) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: item.title,
              description: item.summary,
            },
          })),
        },
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
      <UseCases />
      <SectionDivider />
      <Expertise />
      <SectionDivider />
      <Solutions />
      <SectionDivider />
      <Process />
      <SectionDivider />
      <Trust />
      <Calculator />
      <SectionDivider />
      <Faq />
      <SectionDivider />
      <Contact />
    </main>
  );
}
