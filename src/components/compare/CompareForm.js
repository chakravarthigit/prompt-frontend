import React, { useState } from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { Wand2, Sparkles, AlertCircle, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AgentIcon } from "../ui/agent-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { API_BASE_URL } from "../../utils/api";
import "./CompareResults.css";

// Function to format responses with basic syntax highlighting - will be used in future updates
// eslint-disable-next-line no-unused-vars
const formatResponse = (text) => {
  if (!text) return "";
  
  // Ensure text is a string
  if (typeof text !== 'string') {
    try {
      text = JSON.stringify(text);
    } catch (e) {
      text = String(text);
    }
  }
  
  // Basic safety to prevent HTML issues
  text = text.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;');
  
  // Format code blocks
  let formattedText = text.replace(
    /```([a-z]*)([\s\S]*?)```/g, 
    '<div class="code-block"><div class="code-header">$1</div><pre><code>$2</code></pre></div>'
  );
  
  // Format inline code
  formattedText = formattedText.replace(
    /`([^`]+)`/g, 
    '<code class="inline-code">$1</code>'
  );
  
  // Format markdown headings
  formattedText = formattedText.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  formattedText = formattedText.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  formattedText = formattedText.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  formattedText = formattedText.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  
  // Format lists
  formattedText = formattedText.replace(/^\* (.*)$/gm, '<li>$1</li>');
  formattedText = formattedText.replace(/^- (.*)$/gm, '<li>$1</li>');
  formattedText = formattedText.replace(/^(\d+)\. (.*)$/gm, '<li>$2</li>');
  
  // Format bold and italic
  formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  formattedText = formattedText.replace(/\*(.+?)\*/g, '<em>$1</em>');
  formattedText = formattedText.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Format blockquotes
  formattedText = formattedText.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
  
  // Convert line breaks to <br>
  formattedText = formattedText.replace(/\n/g, '<br>');
  
  return formattedText;
};

export default function CompareForm() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [outputs, setOutputs] = useState({});
  const [selectedAgents, setSelectedAgents] = useState(["gpt", "claude", "gemini"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedAgent, setCopiedAgent] = useState(null);
  const [agentRatings, setAgentRatings] = useState({});

  const agents = ["gpt", "claude", "gemini", "deepseek", "mistral", "metaLlama"];

  const handlePromptChange = (e) => {
    setInputPrompt(e.target.value);
    // Reset outputs when input changes
    if (Object.keys(outputs).length > 0) {
      setOutputs({});
      setAgentRatings({});
    }
  };

  const toggleAgentSelection = (agent) => {
    setSelectedAgents(prev => {
      if (prev.includes(agent)) {
        return prev.filter(a => a !== agent);
      } else {
        return [...prev, agent];
      }
    });
  };

  const filterThinking = (text) => {
    // Make sure text exists before trying to replace content
    if (!text) return '';
    
    // Only remove specifically formatted <think> tags
    const filtered = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    
    // Add debug logging to check what's happening with responses
    console.log("Original response:", text?.substring(0, 100) + "...");
    console.log("Filtered response:", filtered?.substring(0, 100) + "...");
    
    return filtered;
  };

  const compareAcrossAgents = async () => {
    if (!inputPrompt.trim()) {
      setError("Please enter a prompt to compare");
      return;
    }

    if (selectedAgents.length === 0) {
      setError("Please select at least one AI assistant");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Call the backend API to compare across the selected models
      const response = await fetch(`${API_BASE_URL}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: inputPrompt, 
          models: selectedAgents 
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to compare across assistants");
      }

      const data = await response.json();
      
      // Debug the raw response data
      console.log("API Response:", data);
      
      // Process the results and filter out thinking content
      const newOutputs = {};
      data.results.forEach(result => {
        // Log each individual result for debugging
        console.log(`Response for ${result.model}:`, result);
        
        // Ensure the response is a string before processing
        // Use optimizedPrompt instead of response since that's what the API returns
        const responseText = typeof result.optimizedPrompt === 'string' 
          ? result.optimizedPrompt 
          : JSON.stringify(result.optimizedPrompt);
          
        newOutputs[result.model] = filterThinking(responseText);
      });
      
      console.log("Processed outputs:", newOutputs);
      setOutputs(newOutputs);
      setAgentRatings({});
    } catch (error) {
      setError(error.message || "Failed to generate comparison. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (agent) => {
    if (!outputs[agent]) return;
    
    navigator.clipboard.writeText(outputs[agent]);
    setCopiedAgent(agent);
    setTimeout(() => setCopiedAgent(null), 2000);
  };
  
  const rateResponse = (agent, isPositive) => {
    setAgentRatings(prev => ({
      ...prev,
      [agent]: isPositive
    }));
  };

  const getCardColor = (agent) => {
    switch(agent) {
      case 'gpt':
        return 'from-emerald-400 to-teal-500';
      case 'claude':
        return 'from-purple-400 to-indigo-500';
      case 'gemini':
        return 'from-blue-400 to-cyan-500';
      case 'deepseek':
        return 'from-yellow-400 to-amber-500';
      case 'mistral':
        return 'from-rose-400 to-pink-500';
      case 'metaLlama':
        return 'from-blue-400 to-indigo-500';
      default:
        return 'from-indigo-400 to-purple-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-bold text-gray-800">Your Prompt</h2>
            <p className="text-gray-500">
              Enter your prompt to see how it would be optimized for different AI assistants
            </p>
          </div>
          
          <Textarea
            placeholder="Enter your prompt here..."
            className="min-h-[150px] text-base p-4 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-indigo-400 focus:ring-indigo-400 shadow-sm"
            value={inputPrompt}
            onChange={handlePromptChange}
          />
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <h3 className="text-md font-medium text-gray-700">Select AI Assistants to Compare</h3>
              <div className="flex flex-wrap gap-3">
                {agents.map((agent) => (
                  <AgentIcon
                    key={agent}
                    agent={agent}
                    selected={selectedAgents.includes(agent)}
                    onClick={() => toggleAgentSelection(agent)}
                    showName
                    showDescription={false}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Compare Button */}
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                onClick={compareAcrossAgents}
                disabled={isLoading || !inputPrompt.trim() || selectedAgents.length === 0}
                className="px-8 py-2 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-md flex items-center space-x-2"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Compare Across Assistants
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
        
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-8 w-8 text-indigo-500" />
            </motion.div>
            <span className="ml-2 text-gray-600 font-medium">Comparing across assistants...</span>
          </div>
        ) : Object.keys(outputs).length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Comparison Results</h2>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {selectedAgents.map((agent) => (
                <Card 
                  key={agent} 
                  className="bg-white/80 backdrop-blur-sm shadow-lg border-purple-100 relative overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getCardColor(agent)}`}></div>
                  <CardHeader className="pb-2 pt-6">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AgentIcon agent={agent} size="md" showName={false} />
                      <span>{agent.charAt(0).toUpperCase() + agent.slice(1)}</span>
                      {agentRatings[agent] !== undefined && (
                        <span className={`ml-auto text-sm px-2 py-1 rounded-full ${agentRatings[agent] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {agentRatings[agent] ? 'Best Response' : 'Needs Improvement'}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mt-2">
                      {outputs[agent] ? (
                        <div className="overflow-auto max-h-[400px]">
                          <Textarea
                            className="min-h-[auto] h-auto text-base p-4 bg-white/50 border-purple-200 focus:border-indigo-400 focus:ring-indigo-400 shadow-sm leading-relaxed w-full font-medium resize-none"
                            value={outputs[agent]}
                            readOnly
                            style={{ lineHeight: "1.6", minHeight: "300px", height: "auto" }}
                          />
                        </div>
                      ) : (
                        <div className="min-h-[300px] border border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-auto p-4">
                          <p className="text-gray-500 text-center">
                            Optimized prompt will appear here after comparison
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-2 bg-gray-50">
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => rateResponse(agent, true)}
                              className={`${agentRatings[agent] === true ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" /> Best
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mark as best response</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => rateResponse(agent, false)}
                              className={`${agentRatings[agent] === false ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" /> Needs Work
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mark as needs improvement</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(agent)}
                            className="text-gray-500 hover:text-indigo-600"
                          >
                            {copiedAgent === agent ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                            {copiedAgent === agent ? "Copied" : "Copy"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copiedAgent === agent ? "Copied!" : "Copy to clipboard"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="min-h-[400px] border border-dashed border-gray-300 rounded-lg flex items-center justify-center p-6">
            <p className="text-gray-500 text-center">
              Enter your prompt and select AI assistants to compare optimized versions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
