import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import Layout from "../Layout";

export default function Home() {
  return (
    <Layout currentPageName="Home">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
    </Layout>
  );
}