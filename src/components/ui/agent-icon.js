import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, BookOpen, FlaskConical, Brain } from "lucide-react";

// Import custom agent icons
import chatgptIcon from "../../assets/chatgpt-icon.png";
import claudeIcon from "../../assets/claude-ai-icon.png";
import geminiIcon from "../../assets/google-gemini-icon.png";
import deepseekIcon from "../../assets/deepseek-logo-icon.png";
import mistralIcon from "../../assets/mistral-ai-icon.png";
import metaIcon from "../../assets/meta_6033716.png";

const agentMotionProps = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 }
};

const agentConfigMap = {
  gpt: {
    name: "ChatGPT",
    icon: Bot,
    iconSrc: chatgptIcon,
    color: "bg-emerald-100 text-emerald-600 border-emerald-200",
    hoverColor: "hover:bg-emerald-200 hover:text-emerald-700",
    description: "GPT-4.1-nano"
  },
  claude: {
    name: "Claude",
    icon: BookOpen,
    iconSrc: claudeIcon,
    color: "bg-violet-100 text-violet-600 border-violet-200",
    hoverColor: "hover:bg-violet-200 hover:text-violet-700",
    description: "Claude 3 Haiku"
  },
  gemini: {
    name: "Gemini",
    icon: Sparkles,
    iconSrc: geminiIcon,
    color: "bg-sky-100 text-sky-600 border-sky-200",
    hoverColor: "hover:bg-sky-200 hover:text-sky-700",
    description: "Gemma 2B"
  },
  deepseek: {
    name: "DeepSeek",
    icon: FlaskConical,
    iconSrc: deepseekIcon,
    color: "bg-amber-100 text-amber-600 border-amber-200",
    hoverColor: "hover:bg-amber-200 hover:text-amber-700",
    description: "DeepSeek R1"
  },
  mistral: {
    name: "Mistral",
    icon: Brain,
    iconSrc: mistralIcon,
    color: "bg-rose-100 text-rose-600 border-rose-200",
    hoverColor: "hover:bg-rose-200 hover:text-rose-700",
    description: "Mistral 7B"
  },
  metaLlama: {
    name: "Meta Llama",
    icon: Brain,
    iconSrc: metaIcon,
    color: "bg-blue-100 text-blue-600 border-blue-200",
    hoverColor: "hover:bg-blue-200 hover:text-blue-700",
    description: "Llama Vision Free"
  }
};

export function AgentIcon({ agent, size = "md", selected = false, onClick, showName = true, showDescription = false, className = "" }) {
  const config = agentConfigMap[agent];
  if (!config) return null;
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base"
  };
  
  // eslint-disable-next-line no-unused-vars
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const imageSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  return (
    <motion.div
      {...agentMotionProps}
      onClick={onClick}
      className={`
        flex flex-col items-center rounded-xl border cursor-pointer transition-all
        ${selected ? 
          `${config.color} border-2 shadow-sm` : 
          `bg-white/60 border-gray-200 ${config.hoverColor}`
        }
        ${className}
      `}
    >
      <div className={`rounded-xl ${sizeClasses[size]} flex flex-col items-center`}>
        <div className="flex items-center justify-center">
          {/* Use custom PNG image instead of Lucide icon */}
          <img 
            src={config.iconSrc} 
            alt={config.name} 
            className={`${imageSizes[size]} object-contain`} 
          />
          {showName && <span className={`ml-2 font-medium ${selected ? '' : 'text-gray-700'}`}>{config.name}</span>}
        </div>
        
        {showDescription && config.description && (
          <p className="mt-1 text-xs text-gray-500 text-center">{config.description}</p>
        )}
      </div>
    </motion.div>
  );
}