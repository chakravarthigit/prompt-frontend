import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2, Sparkles, Copy, Check, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AgentIcon } from "../ui/agent-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "react-router-dom";
import { API_BASE_URL, fetchWithAuth } from "../../utils/api";
import { getCookie } from "../../utils/cookies";

// Map agent keys to Together API model strings
// eslint-disable-next-line no-unused-vars
const agentModelMap = {
  gpt: "meta-llama/Meta-Llama-3-70B-Instruct",
  claude: "anthropic/claude-3-haiku-20240307",
  gemini: "google/gemma-2b-it",
  deepseek: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
  mistral: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  metaLlama: "meta-llama/Llama-Vision-Free"
};

const agents = [
  { key: "gpt", label: "ChatGPT" },
  { key: "claude", label: "Claude" },
  { key: "gemini", label: "Gemini" },
  { key: "deepseek", label: "DeepSeek" },
  { key: "mistral", label: "Mistral" },
  { key: "metaLlama", label: "Meta Llama" }
];

export default function PromptForm() {
  const location = useLocation();
  const [inputPrompt, setInputPrompt] = useState("");
  const [outputPrompt, setOutputPrompt] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("gpt");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // Read template from URL params when component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const template = searchParams.get("template");
    if (template) {
      setInputPrompt(template);
    }
  }, [location]);

  const handlePromptChange = (e) => {
    setInputPrompt(e.target.value);
    if (outputPrompt) {
      setOutputPrompt("");
    }
  };

  const filterThinking = (text) => {
    // Remove <think>...</think> blocks (including multiline)
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  };

  const optimizePrompt = async () => {
    if (!inputPrompt.trim()) {
      setError("Please enter a prompt to optimize");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Get auth token from multiple possible sources
      const authToken = getCookie('authToken') || sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/api/transform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          prompt: inputPrompt,
          model: selectedAgent,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to optimize prompt");
      }
      const data = await response.json();
      setOutputPrompt(filterThinking(data.optimizedPrompt));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!outputPrompt) return;
    navigator.clipboard.writeText(outputPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Input Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Your Prompt</h2>
          <Textarea
            placeholder="Enter your rough prompt idea here..."
            className="min-h-[200px] text-base p-4 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-indigo-400 focus:ring-indigo-400 shadow-sm"
            value={inputPrompt}
            onChange={handlePromptChange}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Target AI Assistant</label>
            <div className="flex flex-wrap gap-2">
              {agents.map((agent) => (
                <AgentIcon
                  key={agent.key}
                  agent={agent.key}
                  selected={selectedAgent === agent.key}
                  onClick={() => setSelectedAgent(agent.key)}
                  showName
                />
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={optimizePrompt}
                disabled={isLoading || !inputPrompt.trim()}
                className="w-full px-4 py-2 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-md flex items-center justify-center"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Transform Prompt
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="ml-2"
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
        {/* Output Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Optimized Prompt</h2>
            <div className="flex items-center gap-3">
              {outputPrompt && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="text-gray-500 hover:text-indigo-600"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {selectedAgent && (
                <div className="flex items-center text-sm text-gray-600">
                  <AgentIcon agent={selectedAgent} size="sm" />
                  <span className="ml-2">Optimized for {agents.find(a => a.key === selectedAgent)?.label}</span>
                </div>
              )}
            </div>
          </div>
          <Card className="relative bg-white/80 backdrop-blur-sm shadow-lg border-purple-100">
            <CardContent className="pt-6 pb-10 px-5">
              {isLoading ? (
                <div className="min-h-[500px] max-h-[650px] flex items-center justify-center overflow-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-8 w-8 text-indigo-500" />
                  </motion.div>
                  <span className="ml-2 text-gray-600 font-medium">Optimizing your prompt...</span>
                </div>
              ) : outputPrompt ? (
                <div className="relative">
                  <div className="overflow-auto max-h-[650px] rounded-md">
                    <Textarea
                      className="min-h-[auto] h-auto text-base lg:text-lg p-6 bg-white/50 border-purple-200 focus:border-indigo-400 focus:ring-indigo-400 shadow-md leading-relaxed w-full font-medium resize-none"
                      value={outputPrompt}
                      readOnly
                      style={{ lineHeight: "1.6", minHeight: "500px", height: "auto" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="min-h-[500px] max-h-[650px] border border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-auto">
                  <p className="text-gray-500 text-center px-4">
                    Your optimized prompt will appear here after transformation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
