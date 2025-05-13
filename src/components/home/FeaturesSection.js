import React from "react";
import { motion } from "framer-motion";
import { Wand2, LayoutGrid, BookOpenCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import IllustratedBox from "../IllustratedBox";
import { createPageUrl } from "@/utils";

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
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Powerful tools for</span>
            <span className="block text-indigo-600">AI prompt crafting</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Everything you need to create perfect prompts for any AI assistant
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Link to={createPageUrl(feature.href)} key={index}>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center py-3 px-6 bg-indigo-50 rounded-full">
            <Sparkles className="h-5 w-5 text-indigo-500 mr-2" />
            <span className="text-sm font-medium text-indigo-700">
              New templates added regularly!
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 