import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentIcon } from "../ui/agent-icon";
import { motion } from "framer-motion";

export default function TemplateFilters({ 
  selectedUse, 
  setSelectedUse, 
  selectedAgents, 
  setSelectedAgents 
}) {
  const uses = [
    { value: "all", label: "All" },
    { value: "coding", label: "Coding" },
    { value: "writing", label: "Writing" },
    { value: "business", label: "Business" },
    { value: "creative", label: "Creative" },
    { value: "education", label: "Education" },
    { value: "analysis", label: "Analysis" }
  ];
  
  const agents = ["gpt", "claude", "gemini", "deepseek", "mistral"];
  
  const toggleAgent = (agent) => {
    setSelectedAgents(prev => {
      if (prev.includes(agent)) {
        return prev.filter(a => a !== agent);
      } else {
        return [...prev, agent];
      }
    });
  };
  
  const clearFilters = () => {
    setSelectedUse("all");
    setSelectedAgents([]);
  };
  
  const isFiltered = selectedUse !== "all" || selectedAgents.length > 0;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-500 mr-2" />
          <span className="font-medium text-gray-700">Filters:</span>
        </div>
        
        {/* Use Case Filter */}
        <div className="flex flex-wrap gap-2">
          {uses.map(use => (
            <Button
              key={use.value}
              variant={selectedUse === use.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedUse(use.value)}
              className={selectedUse === use.value ? 
                "bg-indigo-500 hover:bg-indigo-600" : 
                "text-gray-600 hover:text-indigo-600"
              }
            >
              {use.label}
            </Button>
          ))}
        </div>
        
        <div className="h-6 border-l border-gray-300 mx-2"></div>
        
        {/* Agent Filter */}
        <div className="flex flex-wrap gap-2">
          {agents.map(agent => (
            <AgentIcon
              key={agent}
              agent={agent}
              size="sm"
              selected={selectedAgents.includes(agent)}
              onClick={() => toggleAgent(agent)}
              showName
            />
          ))}
        </div>
        
        {/* Clear Filters */}
        {isFiltered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-red-500 ml-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}