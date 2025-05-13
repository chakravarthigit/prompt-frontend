import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import CompareForm from "../components/compare/CompareForm";
import Layout from "../Layout";

export default function Compare() {
  return (
    <Layout currentPageName="Compare">
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center">
              <LayoutGrid className="mr-2 h-8 w-8 text-indigo-500" />
              <span>Compare Across Assistants</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              See how your prompt transforms differently for each AI assistant
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CompareForm />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center text-sm text-gray-500"
          >
            <p>
              Each AI assistant has different capabilities and syntaxes. 
              This comparison helps you tailor your prompts for the best results.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 