import React from "react";
import { motion } from "framer-motion";
import { Wand2, LayoutGrid, BookOpenCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import IllustratedBox from "../IllustratedBox";

export default function FeaturesSection() {
  const features = [
    {
      title: "Prompt Playground",
      description: "Transform rough ideas into optimized prompts for any AI assistant. Select your target model and watch the magic happen.",
      icon: <Wand2 className="h-10 w-10 text-indigo-500" />,
      href: "Playground",
      delay: 0
    },
    {
      title: "Compare Across Agents",
      description: "See how your prompt performs differently across ChatGPT, Claude, Gemini, and more in a side-by-side view.",
      icon: <LayoutGrid className="h-10 w-10 text-purple-500" />,
      href: "Compare",
      delay: 0.1
    },
    {
      title: "Ready-Made Templates",
      description: "Choose from a variety of expert-crafted prompt templates for different use cases and AI models.",
      icon: <BookOpenCheck className="h-10 w-10 text-pink-500" />,
      href: "Templates",
      delay: 0.2
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-tr from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Make Your AI Conversations <span className="text-indigo-600">Magical</span>
            </p>
            <p className="max-w-3xl mt-5 mx-auto text-xl text-gray-500">
              Explore all the ways PromptWizard can transform your AI interactions
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Link key={index} to={createPageUrl(feature.href)} className="block">
              <IllustratedBox
                title={feature.title}
                description={feature.description}
                illustration={feature.icon}
                animationDelay={feature.delay}
                className="h-full hover:shadow-lg transition-shadow duration-300"
              />
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-indigo-500 mr-2" />
            <span className="text-lg font-medium text-gray-700">
              Join thousands of prompt wizards crafting magical AI conversations
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}