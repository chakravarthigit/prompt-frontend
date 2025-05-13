import React from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentIcon } from "../ui/agent-icon";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TemplateCard({ template, onCopy }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy(template.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getUseColor = (use) => {
    const colors = {
      coding: "bg-blue-100 text-blue-800 border-blue-200",
      writing: "bg-purple-100 text-purple-800 border-purple-200",
      business: "bg-amber-100 text-amber-800 border-amber-200",
      creative: "bg-pink-100 text-pink-800 border-pink-200",
      education: "bg-green-100 text-green-800 border-green-200",
      analysis: "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    return colors[use] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full bg-white/90 backdrop-blur-sm border border-purple-100 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {template.title}
            </CardTitle>
            <BookOpenCheck className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={getUseColor(template.use)}>
              {template.use.charAt(0).toUpperCase() + template.use.slice(1)}
            </Badge>
            {template.agents.map(agent => (
              <AgentIcon key={agent} agent={agent} size="sm" />
            ))}
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-gray-600 line-clamp-3 text-sm">
            {template.description}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            onClick={handleCopy}
          >
            {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Link to={`${createPageUrl("Playground")}?template=${encodeURIComponent(template.content)}`}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              Use Template
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}