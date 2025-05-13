import React from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import PromptForm from "../components/playground/PromptForm";
import Layout from "../Layout";

export default function Playground() {
  return (
    <Layout currentPageName="Playground">
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center">
              <Wand2 className="mr-2 h-8 w-8 text-indigo-500" />
              <span>Prompt Playground</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Transform your ideas into powerful, optimized prompts for any AI assistant
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PromptForm />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center text-sm text-gray-500"
          >
            <p>
              Tip: Be specific about what you want the AI to do. Include context, format preferences, and any constraints.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 