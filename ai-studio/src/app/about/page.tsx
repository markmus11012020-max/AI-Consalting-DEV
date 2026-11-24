import type { Metadata } from "next";

import { AboutContact } from "@/components/about/about-contact";
import { AboutExperience } from "@/components/about/about-experience";
import { AboutHero } from "@/components/about/about-hero";
import { AboutEducation, AboutSkills } from "@/components/about/about-skills";
import { AboutWorks } from "@/components/about/about-works";
import { SectionDivider } from "@/components/layout/section";
import { ABOUT_PROFILE } from "@/lib/about";
import { SITE } from "@/lib/site";

const title = "Обо мне — Гульназ Мусина, AI Product Manager";
const description =
  "HR-профиль Гульназ Мусиной: AI Product Manager / Product Owner с опытом более 20 лет в финансах, консалтинге и управлении. Call-Pilot, КликЮрист, Aillix, RAG, HITL и ФЗ-152.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/about",
    siteName: SITE.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}/about#person`,
        name: ABOUT_PROFILE.name,
        alternateName: ABOUT_PROFILE.shortName,
        jobTitle: ABOUT_PROFILE.role,
        description: ABOUT_PROFILE.summary,
        url: `${SITE.url}/about`,
        image: `${SITE.url}/about/opengraph-image`,
        email: ABOUT_PROFILE.email,
        telephone: ABOUT_PROFILE.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: ABOUT_PROFILE.location,
          addressCountry: "RU",
        },
        worksFor: {
          "@type": "Organization",
          name: "AILLIX",
          url: SITE.url,
        },
        sameAs: [
          ABOUT_PROFILE.github,
          SITE.url,
          "https://call-pilot.ru",
          "https://clickjurist.ru",
          ABOUT_PROFILE.telegram,
        ],
        knowsAbout: [
          "AI Product Management",
          "Prompt Engineering",
          "Agentic AI",
          "RAG",
          "Human-in-the-loop",
          "QA звонков",
          "FastAPI",
          "Spring Boot",
          "PostgreSQL",
          "ФЗ-152",
          "ФЗ-115",
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE.url}/about#page`,
        url: `${SITE.url}/about`,
        name: title,
        description,
        mainEntity: { "@id": `${SITE.url}/about#person` },
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE.url}/#website`,
          url: SITE.url,
          name: SITE.name,
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

      <AboutHero />
      <SectionDivider />
      <AboutWorks />
      <SectionDivider />
      <AboutExperience />
      <SectionDivider />
      <AboutSkills />
      <SectionDivider />
      <AboutEducation />
      <SectionDivider />
      <AboutContact />
    </main>
  );
}
