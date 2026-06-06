"use client";

import { Header } from "@/components/shared/Header";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CategoriesGrid } from "@/components/landing/CategoriesGrid";
import { ExamplesGallery } from "@/components/landing/ExamplesGallery";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <CategoriesGrid />
        <ExamplesGallery />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
