import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
import TemplateCard from "@/components/Templates/TemplateCard";
import TemplateFilters from "@/components/Templates/TemplateFilters";
import Layout from "../Layout";

const templateData = [
  {
    id: 1,
    title: "Code Explainer",
    description: "Get detailed explanations of code snippets with improvements and best practices.",
    content: "I need you to explain the following code in detail:\n\n[PASTE CODE HERE]\n\nPlease break down:\n1. What each part does\n2. The logic flow\n3. Any potential issues or improvements\n4. Best practices that could be applied",
    use: "coding",
    agents: ["gpt", "claude"]
  },
  {
    id: 2,
    title: "Blog Post Generator",
    description: "Create engaging, SEO-friendly blog posts with proper structure and formatting.",
    content: "Write a comprehensive blog post about [TOPIC]. The post should:\n- Have an engaging title and introduction\n- Include at least 3 main sections with subheadings\n- Be approximately 1000 words\n- Include a conclusion with a call to action\n- Use an informative, conversational tone\n- Incorporate these keywords naturally: [KEYWORDS]\n\nThe target audience is [AUDIENCE DESCRIPTION].",
    use: "writing",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 3,
    title: "Marketing Copy Reviewer",
    description: "Get feedback on your marketing copy with suggestions for improvement.",
    content: "Please review the following marketing copy and provide detailed feedback:\n\n[PASTE COPY HERE]\n\nConsider these aspects in your review:\n1. Clarity and impact of the message\n2. Persuasiveness and call to action\n3. Target audience appropriateness\n4. Grammar and style\n5. Suggestions for improvement with examples\n\nPlease be specific with your feedback and provide improved versions where relevant.",
    use: "business",
    agents: ["claude", "gpt"]
  },
  {
    id: 4,
    title: "Data Analysis Plan",
    description: "Create a comprehensive plan to analyze a dataset with visualization suggestions.",
    content: "I have a dataset about [TOPIC/DOMAIN] with the following variables:\n\n[LIST VARIABLES]\n\nPlease help me create a comprehensive data analysis plan that includes:\n\n1. Preliminary data exploration steps\n2. Key questions the data could answer\n3. Suggested statistical methods to apply\n4. Recommended visualizations\n5. Potential insights to look for\n6. Common pitfalls to avoid\n\nThe goal of this analysis is to [SPECIFIC GOAL].",
    use: "analysis",
    agents: ["gpt", "gemini"]
  },
  {
    id: 5,
    title: "Creative Story Starter",
    description: "Generate a creative story beginning with rich details and characters.",
    content: "Create an engaging opening scene (approximately 300-500 words) for a story with these elements:\n\nGenre: [GENRE]\nSetting: [SETTING]\nMain Character: [CHARACTER TYPE]\nMood/Tone: [MOOD]\n\nThe opening should:\n- Establish a strong voice and atmosphere\n- Introduce an intriguing situation or question\n- Plant seeds for potential conflict\n- Use vivid sensory details\n- Leave the reader wanting to know what happens next",
    use: "creative",
    agents: ["claude", "gemini", "mistral", "metaLlama"]
  },
  {
    id: 6,
    title: "Learning Concept Explainer",
    description: "Explain complex concepts in a simple, easy-to-understand way with examples.",
    content: "I'm trying to understand the concept of [CONCEPT]. Please explain it to me as if I have no background knowledge on the subject.\n\nIn your explanation:\n1. Define the concept in simple terms\n2. Explain why it's important/relevant\n3. Use easy-to-understand analogies or metaphors\n4. Provide simple real-world examples\n5. Break down any complex ideas into digestible parts\n6. Address common misconceptions\n\nOptional: If appropriate, explain how this concept relates to [RELATED FIELD/CONCEPT].",
    use: "education",
    agents: ["gpt", "claude", "gemini", "mistral"]
  },
  {
    id: 7,
    title: "Resume Optimizer",
    description: "Get feedback and improvements for your resume to stand out to employers.",
    content: "Please review my resume for the following job position and provide specific feedback to improve it:\n\n[PASTE RESUME HERE]\n\nJob Position: [JOB TITLE]\nCompany/Industry: [COMPANY/INDUSTRY]\n\nPlease provide:\n1. Overall assessment (strengths and weaknesses)\n2. Specific improvements for each section\n3. ATS optimization suggestions\n4. Formatting and structure recommendations\n5. Achievement phrasing improvements (using specific metrics where possible)\n6. Skills that should be highlighted or added based on the position\n\nIf you notice any red flags or gaps, please point them out with suggestions to address them.",
    use: "business",
    agents: ["gpt", "claude"]
  },
  {
    id: 8,
    title: "Technical Documentation",
    description: "Create clear technical documentation for developers with proper structure.",
    content: "Please create technical documentation for [FEATURE/COMPONENT]. The documentation should follow these specifications:\n\n1. Clear overview of the purpose and functionality\n2. Technical specifications and requirements\n3. Installation/setup instructions where applicable\n4. Usage examples with code snippets\n5. API reference (methods, parameters, return values)\n6. Common issues and troubleshooting\n7. Best practices for implementation\n\nTarget audience: [SKILL LEVEL] developers familiar with [TECHNOLOGIES].\n\nPlease format the documentation clearly with proper headings, code blocks, and emphasis where needed.",
    use: "coding",
    agents: ["gpt", "claude", "deepseek"]
  },
  {
    id: 9,
    title: "Personalized Learning Plan",
    description: "Generate a customized learning plan for any subject with resources and milestones.",
    content: "Please create a personalized learning plan to help me learn [SUBJECT/SKILL]. Here's my specific situation:\n\nCurrent knowledge level: [BEGINNER/INTERMEDIATE/ADVANCED]\nAvailable time: [HOURS PER WEEK]\nLearning style preference: [VISUAL/READING/PRACTICAL/ETC]\nGoal: [SPECIFIC LEARNING GOAL]\nDeadline/Timeframe: [TIMEFRAME]\n\nPlease include:\n1. A structured week-by-week learning path\n2. Specific resources (books, courses, videos, projects) for each stage\n3. Practice exercises or projects to reinforce learning\n4. Milestones to track progress\n5. Tips to overcome common obstacles\n6. How to test/validate my knowledge acquisition",
    use: "education",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 10,
    title: "Product Review Framework",
    description: "Create a comprehensive, balanced review of a product with pros, cons, and comparisons.",
    content: "Please help me write a comprehensive and balanced review of [PRODUCT NAME].\n\nProduct specifications:\n[KEY SPECIFICATIONS]\n\nMy experience with the product:\n[BRIEF DESCRIPTION OF USAGE]\n\nThe review should include:\n1. An attention-grabbing introduction\n2. Honest evaluation of product design, functionality, and performance\n3. Clear pros and cons with specific examples\n4. Comparison to alternatives in the market\n5. Who would benefit most from this product\n6. Value for money assessment\n7. Final verdict with a rating out of 5 or 10\n\nThe tone should be balanced, objective, and helpful for potential buyers.",
    use: "writing",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 11,
    title: "AI Artwork Prompt",
    description: "Generate detailed prompts for AI image generators with style and composition specifications.",
    content: "Create a detailed prompt for an AI image generator (like DALL-E, Midjourney, or Stable Diffusion) to create an image of:\n\n[BASIC CONCEPT]\n\nPlease expand this basic concept into a detailed prompt that specifies:\n\n1. Subject details (appearance, pose, expression, etc.)\n2. Setting/background elements\n3. Lighting conditions and atmosphere\n4. Art style (e.g., photorealistic, watercolor, digital art, etc.)\n5. Composition guidelines (perspective, framing, focus)\n6. Color palette suggestions\n7. Mood/emotional quality of the image\n8. Any specific inspirations or references to emulate\n\nMake the prompt detailed but concise, using effective keywords that AI image generators respond well to.",
    use: "creative",
    agents: ["gpt", "claude", "deepseek"]
  },
  {
    id: 12,
    title: "Business Problem Solver",
    description: "Analyze a business problem and get structured solutions with implementation plans.",
    content: "I need help solving the following business problem:\n\n[DESCRIBE PROBLEM]\n\nRelevant context:\n- Industry: [INDUSTRY]\n- Company size: [SIZE]\n- Key constraints: [CONSTRAINTS]\n- Previous attempts: [PREVIOUS SOLUTIONS TRIED]\n\nPlease provide a structured analysis including:\n\n1. Problem restatement and clarification\n2. Root cause analysis\n3. 3-5 potential solutions with pros and cons for each\n4. Recommended solution with justification\n5. Implementation roadmap with key milestones\n6. Potential challenges and mitigation strategies\n7. Success metrics to track effectiveness\n\nPlease be specific and practical in your recommendations.",
    use: "business",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 13,
    title: "Algorithm Problem Solver",
    description: "Get step-by-step solutions to algorithm and data structure problems with explanations.",
    content: "I need help solving the following algorithm problem:\n\n[PROBLEM DESCRIPTION]\n\nPlease provide:\n1. A clear explanation of the problem\n2. The intuition behind the solution\n3. A step-by-step approach to solve it\n4. Time and space complexity analysis\n5. Edge cases to consider\n6. Working code implementation in [LANGUAGE]\n7. Alternative approaches if applicable\n\nPlease explain your thought process throughout so I can learn how to approach similar problems in the future.",
    use: "coding",
    agents: ["deepseek", "gpt", "claude"]
  },
  {
    id: 14,
    title: "Code Refactoring Assistant",
    description: "Get guidance on refactoring code for better readability, performance, and maintainability.",
    content: "I need help refactoring the following code to improve its quality:\n\n```[LANGUAGE]\n[CODE]\n```\n\nPlease help with:\n1. Identifying code smells and potential issues\n2. Applying appropriate design patterns where relevant\n3. Improving performance if possible\n4. Making the code more readable and maintainable\n5. Ensuring proper error handling\n6. Following best practices for [LANGUAGE/FRAMEWORK]\n\nPlease explain the reasoning behind each suggested change so I can understand the improvements.",
    use: "coding",
    agents: ["deepseek", "claude", "mistral"]
  },
  {
    id: 15,
    title: "API Documentation Generator",
    description: "Generate comprehensive documentation for APIs with examples and formatting.",
    content: "Please help me create comprehensive documentation for the following API endpoint:\n\nEndpoint: [ENDPOINT]\nMethod: [GET/POST/PUT/DELETE]\nDescription: [BRIEF DESCRIPTION]\n\nRequest Parameters:\n[LIST PARAMETERS WITH TYPES AND DESCRIPTIONS]\n\nRequest Body (if applicable):\n```json\n[JSON STRUCTURE]\n```\n\nResponse Format:\n```json\n[JSON STRUCTURE]\n```\n\nPlease generate detailed documentation including:\n1. A clear overview of the endpoint's purpose\n2. Complete request parameter descriptions with data types, validation rules, and whether they're required\n3. Response field descriptions\n4. Status codes and error responses\n5. At least 2-3 example requests and responses for different scenarios\n6. Any rate limiting or authentication information\n7. Edge cases or important notes for developers\n\nFormat the documentation in a clean, well-structured markdown format suitable for developer documentation.",
    use: "coding",
    agents: ["gpt", "claude", "deepseek"]
  },
  {
    id: 16,
    title: "Design Pattern Explainer",
    description: "Understand software design patterns with practical examples and use cases.",
    content: "Please explain the [DESIGN PATTERN] design pattern in detail.\n\nPlease include:\n1. A clear definition and the problem it solves\n2. The structure and components of the pattern\n3. A simple diagram or explanation of how the components interact\n4. When to use this pattern (and when not to)\n5. Real-world examples of where this pattern is commonly used\n6. A code example in [LANGUAGE] demonstrating the implementation\n7. Advantages and disadvantages\n8. Related patterns and how they compare\n\nMake the explanation accessible to a junior developer who understands programming fundamentals but is new to design patterns.",
    use: "education",
    agents: ["gpt", "claude", "deepseek", "mistral", "metaLlama"]
  },
  {
    id: 17,
    title: "Study Notes Generator",
    description: "Create comprehensive study notes on any topic with key points and examples.",
    content: "Please create comprehensive study notes on the topic of [TOPIC] for a [EDUCATION LEVEL] student.\n\nThe notes should include:\n1. A clear overview of the topic and why it's important\n2. Key concepts and definitions highlighted or bolded for easy reference\n3. The main theories or frameworks\n4. Step-by-step explanations for complex processes\n5. Real-world examples that illustrate the concepts\n6. Common misconceptions or areas where students typically struggle\n7. Visual representations described in text (tables, hierarchies, flowcharts)\n8. Practice questions with answers to test understanding\n9. Summary of the most important points to remember\n\nPlease format these notes in a clear, structured way that facilitates learning and quick reference. Use bullet points, numbering, and sections with headers as appropriate.",
    use: "education",
    agents: ["gpt", "claude", "gemini", "mistral", "metaLlama"]
  },
  {
    id: 18,
    title: "Research Paper Summarizer",
    description: "Get a structured summary of academic papers with key findings and implications.",
    content: "Please create a comprehensive summary of the following research paper:\n\nTitle: [PAPER TITLE]\nAuthors: [AUTHORS]\nJournal/Conference: [PUBLICATION VENUE]\nYear: [YEAR]\n\nPlease structure the summary as follows:\n\n1. Research Question/Objective (What problem were they trying to solve?)\n2. Methodology (How did they approach the problem?)\n3. Key Findings (What were the main results?)\n4. Significance (Why does this matter? What contribution does it make?)\n5. Limitations (What constraints or weaknesses were present in the study?)\n6. Future Work (What follow-up research was suggested?)\n7. Key Terms and Concepts (Explain any important technical terms)\n8. Practical Implications (How could these findings be applied?)\n\nPlease make the summary accessible to someone with undergraduate-level knowledge in [FIELD].",
    use: "education",
    agents: ["claude", "gpt", "gemini"]
  },
  {
    id: 19,
    title: "Database Schema Designer",
    description: "Get help designing database schemas with proper relationships and normalization.",
    content: "I'm designing a database for a [TYPE OF APPLICATION] and need help creating an efficient schema. Here are the requirements:\n\n[DESCRIBE APPLICATION REQUIREMENTS]\n\nThe main entities involved are:\n[LIST MAIN ENTITIES]\n\nPlease help me with:\n\n1. A comprehensive database schema design with tables and their relationships\n2. Field definitions including data types and constraints\n3. Primary keys, foreign keys, and indexing recommendations\n4. Proper normalization (at least 3NF) where appropriate\n5. Sample SQL statements to create the schema\n6. Any performance considerations or optimizations\n7. Recommendations for handling common queries efficiently\n\nIf there are design trade-offs to consider, please explain the options and your recommendations.",
    use: "coding",
    agents: ["gpt", "claude", "deepseek"]
  },
  {
    id: 20,
    title: "Project Architecture Reviewer",
    description: "Get feedback on software architecture with suggestions for improvements.",
    content: "I'd like you to review the architecture for my [TYPE] project and provide feedback.\n\nProject purpose: [DESCRIBE PURPOSE]\nTech stack: [LIST TECHNOLOGIES]\nExpected scale/traffic: [DESCRIBE SCALE]\n\nCurrent architecture:\n[DESCRIBE CURRENT ARCHITECTURE - COMPONENTS, SERVICES, DATA FLOW, ETC.]\n\nMain concerns:\n[LIST ANY SPECIFIC CONCERNS OR QUESTIONS]\n\nPlease provide:\n1. An analysis of strengths and weaknesses in the current architecture\n2. Potential bottlenecks or scaling issues\n3. Security considerations\n4. Suggestions for improvements with justifications\n5. Alternative approaches that might better meet the requirements\n6. Best practices I should consider adopting\n7. Recommendations for monitoring and maintenance\n\nPlease be specific and practical in your recommendations, considering the constraints of my tech stack and resources.",
    use: "coding",
    agents: ["claude", "gpt", "deepseek"]
  },
  {
    id: 21,
    title: "Math Problem Solver",
    description: "Get step-by-step solutions to math problems with detailed explanations.",
    content: "Please solve the following math problem step-by-step:\n\n[PROBLEM]\n\nI need:\n1. A clear explanation of the concepts involved\n2. Every step shown in detail with explanations (not just the final answer)\n3. The reasoning behind each step\n4. Alternative approaches if applicable\n5. How to verify the answer\n\nThis is for educational purposes, so please make your explanation as clear as possible. If there are any formulas or theorems used, please briefly explain them rather than just applying them.",
    use: "education",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 22,
    title: "Project Timeline Creator",
    description: "Generate a realistic project timeline with milestones, tasks, and dependencies.",
    content: "Please help me create a detailed project timeline for the following project:\n\nProject Name: [PROJECT NAME]\nProject Goal: [PROJECT GOAL]\nTeam Size: [TEAM SIZE]\nProject Duration: [ESTIMATED DURATION]\n\nMain project phases and requirements:\n[LIST MAIN PHASES AND REQUIREMENTS]\n\nPlease create a comprehensive project timeline that includes:\n1. Major phases with start and end dates\n2. Key milestones and deliverables\n3. Individual tasks broken down by phase\n4. Task dependencies (which tasks must be completed before others can start)\n5. Resource allocation considerations\n6. Buffer time for unexpected delays\n7. Critical path identification\n8. Risk factors and contingency planning\n\nPlease format this as a week-by-week timeline with clear hierarchy of phases and tasks. For each task, include an estimated duration and the role/resource responsible.",
    use: "business",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 23,
    title: "Competitive Analysis Framework",
    description: "Create a structured competitive analysis with market positioning and SWOT analysis.",
    content: "Please help me create a comprehensive competitive analysis for my [PRODUCT/SERVICE] in the [INDUSTRY] industry.\n\nMy product/service: [BRIEF DESCRIPTION]\nTarget market: [TARGET MARKET]\nKey competitors:\n1. [COMPETITOR 1]\n2. [COMPETITOR 2]\n3. [COMPETITOR 3]\n\nPlease provide:\n\n1. A detailed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for my product/service\n2. A comparative analysis of key competitors including:\n   - Market positioning\n   - Pricing strategies\n   - Key features and offerings\n   - Target audience\n   - Marketing strategies\n   - Unique selling propositions\n3. Gap analysis - what needs are underserved in the market?\n4. Recommendations for differentiation and competitive advantage\n5. Potential market entry or expansion strategies\n6. KPIs to track for measuring competitive performance\n\nPlease be specific and actionable in your analysis and recommendations.",
    use: "business",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 24,
    title: "Interactive Story Generator",
    description: "Create interactive, branching stories with multiple decision points and endings.",
    content: "Please create an interactive story with multiple choice decision points for the reader. The story should:\n\n- Be in the [GENRE] genre\n- Be set in [SETTING/WORLD]\n- Have a main character who is a [CHARACTER TYPE]\n- Include at least 3-4 major decision points that significantly impact the story\n- Have multiple possible endings based on choices\n- Be engaging and descriptive with sensory details\n\nFor the format:\n1. Start with an introduction to the world and character\n2. Present a situation\n3. Provide 2-3 choices for the reader\n4. For each choice, create a separate branch of the story\n5. Each branch should lead to another decision point or conclusion\n\nFeel free to add interesting characters, plot twists, and meaningful consequences for decisions. The story should be appropriate for [AGE GROUP].",
    use: "creative",
    agents: ["claude", "gpt", "mistral"]
  },
  {
    id: 25,
    title: "Debate Preparation Assistant",
    description: "Prepare for debates with structured arguments, counterarguments and evidence.",
    content: "I need to prepare for a debate on the topic: \"[DEBATE TOPIC]\"\n\nI will be arguing the [PRO/CON] position. Please help me prepare by providing:\n\n1. A strong opening statement (2-3 paragraphs)\n2. 3-5 main arguments supporting my position, with each including:\n   - Clear reasoning\n   - Supporting evidence/examples\n   - Anticipated counterarguments and rebuttals\n3. Key statistics or facts that strengthen my position\n4. Weaknesses in the opposing position and how to exploit them\n5. Responses to likely challenges from the opposition\n6. A compelling closing statement summarizing my position\n7. Questions I could ask to challenge the opposition\n\nPlease ensure the arguments are logical, well-structured, and would be persuasive to an audience that is [AUDIENCE DESCRIPTION]. If there are particularly strong ethical, emotional, or logical appeals I should emphasize, please highlight those.",
    use: "education",
    agents: ["claude", "gpt", "gemini", "mistral"]
  },
  {
    id: 26,
    title: "System Requirements Specification",
    description: "Create detailed software requirements specifications with user stories and acceptance criteria.",
    content: "Please help me create a comprehensive System Requirements Specification (SRS) document for the following software project:\n\nProject Name: [PROJECT NAME]\nProject Overview: [BRIEF DESCRIPTION]\nStakeholders: [KEY STAKEHOLDERS]\n\nPlease include the following sections:\n\n1. Introduction\n   - Purpose\n   - Scope\n   - Definitions and Acronyms\n\n2. Overall Description\n   - Product Perspective\n   - User Classes and Characteristics\n   - Operating Environment\n   - Design Constraints\n   - Assumptions and Dependencies\n\n3. Functional Requirements\n   - User stories in the format: \"As a [role], I want [feature] so that [benefit]\"\n   - Each story should include acceptance criteria\n   - Organize by module/feature\n\n4. Non-Functional Requirements\n   - Performance Requirements\n   - Security Requirements\n   - Usability Requirements\n   - Reliability Requirements\n   - Scalability Requirements\n\n5. External Interface Requirements\n   - User Interfaces\n   - APIs/Hardware Interfaces\n   - Integration Requirements\n\nPlease be detailed and specific, particularly with the functional requirements and acceptance criteria. Format this as a well-structured document with appropriate numbering and hierarchy.",
    use: "business",
    agents: ["gpt", "claude", "deepseek"]
  },
  {
    id: 27,
    title: "Academic Essay Outline",
    description: "Generate detailed essay outlines with thesis statements and supporting evidence.",
    content: "Please help me create a detailed outline for an academic essay on the topic: \"[ESSAY TOPIC]\"\n\nThis is for a [GRADE LEVEL/COURSE] assignment.\n\nPlease include:\n\n1. A clear and arguable thesis statement\n2. An introduction section outline with background context\n3. Main body sections with:\n   - Clear topic sentences for each paragraph\n   - Supporting points and evidence to include\n   - How each section connects to the thesis\n   - Potential sources or examples to reference\n4. A conclusion section outline\n5. Potential counterarguments to address\n6. Key academic sources or types of evidence I should look for\n7. Any particularly important concepts, theories, or terminology to include\n\nThe essay should be structured to support a [TYPE OF ARGUMENT] argument, and the expected length is approximately [LENGTH]. Please provide a detailed outline that I can expand into a full essay.",
    use: "education",
    agents: ["gpt", "claude", "gemini", "mistral"]
  },
  {
    id: 28,
    title: "Code Documentation Generator",
    description: "Generate comprehensive documentation for code with explanations and examples.",
    content: "Please help me create comprehensive documentation for the following code:\n\n```[LANGUAGE]\n[CODE]\n```\n\nPlease include:\n\n1. Overall purpose and functionality of the code\n2. Explanation of the key components/classes/functions\n3. For each function/method:\n   - Purpose\n   - Parameters with types and descriptions\n   - Return values\n   - Exceptions/errors that might be thrown\n4. Dependencies and requirements\n5. Usage examples showing common use cases\n6. Edge cases or limitations to be aware of\n7. Any performance considerations\n8. Suggestions for potential improvements or best practices\n\nPlease format the documentation according to standard conventions for [LANGUAGE]. The target audience is other developers who need to understand and potentially modify this code.",
    use: "coding",
    agents: ["deepseek", "gpt", "claude"]
  },
  {
    id: 29,
    title: "Data Analysis Report Creator",
    description: "Generate structured data analysis reports with insights and visualizations.",
    content: "Please help me create a comprehensive data analysis report from the following dataset/information:\n\nDataset Description: [DESCRIBE DATASET]\nAnalysis Objectives: [SPECIFY OBJECTIVES]\nKey Variables: [LIST IMPORTANT VARIABLES]\n\nPlease include the following sections in the report:\n\n1. Executive Summary\n   - Key findings and recommendations\n\n2. Introduction\n   - Dataset description\n   - Analysis objectives\n   - Methodology\n\n3. Exploratory Data Analysis\n   - Summary statistics\n   - Key distributions and trends\n   - Notable correlations or patterns\n\n4. In-depth Analysis\n   - Detailed findings organized by research question/objective\n   - Statistical tests and their results\n   - Interpretation of findings\n\n5. Data Visualization Recommendations\n   - Suggestions for charts/graphs with descriptions\n   - What each visualization would show and why it's valuable\n\n6. Conclusions\n   - Summary of main insights\n   - Limitations of the analysis\n   - Business implications or actionable recommendations\n\n7. Next Steps\n   - Suggestions for further analysis\n   - Additional data that would be valuable\n\nPlease be specific and data-driven in your analysis, and include both descriptive statistics and deeper analytical insights.",
    use: "analysis",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 30,
    title: "Interview Preparation Guide",
    description: "Prepare for job interviews with custom questions and response strategies.",
    content: "Please help me prepare for an upcoming job interview for the position of [JOB TITLE] at [COMPANY/INDUSTRY].\n\nMy background:\n- [BRIEF EXPERIENCE SUMMARY]\n- [KEY SKILLS]\n- [RELEVANT ACHIEVEMENTS]\n\nPlease create a comprehensive interview preparation guide that includes:\n\n1. 15-20 likely interview questions specific to this role and industry, categorized as:\n   - Technical/skill-based questions\n   - Behavioral questions\n   - Situational questions\n   - Company/industry knowledge questions\n\n2. For each question, provide:\n   - The rationale behind why they might ask it\n   - A structured framework for answering\n   - Example response elements to include\n   - Pitfalls to avoid\n\n3. 3-5 strong questions I should ask the interviewer\n\n4. Tips for addressing potential concerns about my background\n\n5. Key company/industry information I should research and potentially reference\n\n6. A preparation checklist for the days leading up to the interview\n\nPlease tailor this to the specific role and industry, focusing on what would set a candidate apart in this particular position.",
    use: "business",
    agents: ["gpt", "claude", "gemini", "mistral"]
  },
  {
    id: 31,
    title: "UX Improvement Analysis",
    description: "Analyze a user interface design and get recommendations for improvements.",
    content: "I need help analyzing and improving the user experience of a [WEBSITE/APP/PRODUCT]. Here's a description of the current interface and user flow:\n\n[DESCRIBE INTERFACE AND FLOW]\n\nTarget users: [DESCRIBE TARGET USERS]\nKey user goals: [LIST MAIN USER GOALS]\nPain points: [LIST KNOWN ISSUES OR COMPLAINTS]\n\nPlease provide a comprehensive UX analysis including:\n\n1. Evaluation of the current design against UX best practices\n2. Identification of potential friction points in the user journey\n3. Accessibility considerations and improvements\n4. Mobile responsiveness analysis (if applicable)\n5. Specific recommendations for improving:\n   - Navigation and information architecture\n   - Visual hierarchy and layout\n   - Interaction design and feedback mechanisms\n   - Content and messaging\n6. Suggestions for user testing approaches to validate improvements\n7. Prioritized list of recommended changes (quick wins vs. larger efforts)\n\nPlease be specific in your recommendations and explain the reasoning behind them in terms of UX principles and expected user benefits.",
    use: "analysis",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 32,
    title: "Performance Optimization Guide",
    description: "Get recommendations for optimizing application performance with specific techniques.",
    content: "I need help optimizing the performance of my [TYPE OF APPLICATION]. Here are the details:\n\nTech stack: [LIST TECHNOLOGIES]\nPerformance issues observed: [DESCRIBE ISSUES]\nCurrent metrics (if available): [LIST METRICS]\n\nApplication structure:\n[BRIEF DESCRIPTION OF CODE/ARCHITECTURE]\n\nPlease provide a comprehensive performance optimization guide including:\n\n1. Potential causes of the performance issues\n2. Specific optimization techniques for this tech stack, including:\n   - Front-end optimizations (if applicable)\n   - Back-end and database optimizations (if applicable)\n   - Network and API optimizations\n   - Resource loading and management\n3. Tools and methods to profile and identify bottlenecks\n4. How to implement each optimization with example code or configuration where relevant\n5. Expected impact of each optimization\n6. How to measure improvements\n7. A prioritized approach (what to optimize first)\n\nPlease focus on practical, implementable solutions rather than general advice, and consider both immediate fixes and longer-term architectural improvements.",
    use: "coding",
    agents: ["deepseek", "gpt", "claude"]
  },
  {
    id: 33,
    title: "Product Launch Plan",
    description: "Create a detailed product launch plan with marketing strategies and timelines.",
    content: "Please help me create a comprehensive product launch plan for my new [PRODUCT/SERVICE].\n\nProduct details:\n- Name: [PRODUCT NAME]\n- Description: [BRIEF DESCRIPTION]\n- Target audience: [TARGET AUDIENCE]\n- Unique selling points: [KEY FEATURES/BENEFITS]\n- Price point: [PRICE]\n- Current stage: [DEVELOPMENT STAGE]\n\nPlease provide a detailed product launch plan including:\n\n1. Pre-launch phase (3 months before launch)\n   - Research and preparation tasks\n   - Initial marketing activities\n   - Beta testing strategy\n\n2. Launch phase\n   - Launch day activities and announcements\n   - PR and media strategy\n   - Marketing campaigns across channels\n   - Customer acquisition tactics\n\n3. Post-launch phase (3 months after launch)\n   - Follow-up marketing activities\n   - User feedback collection and implementation\n   - Optimization strategies\n\nFor each phase, please include:\n- Specific tasks and activities with timelines\n- Required resources and budget considerations\n- KPIs and success metrics\n- Potential challenges and contingency plans\n\nPlease be specific and practical, considering the nature of my product and target audience.",
    use: "business",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 34,
    title: "Security Vulnerability Analysis",
    description: "Identify potential security vulnerabilities in code or systems with mitigation strategies.",
    content: "Please help me identify and address potential security vulnerabilities in the following [CODE/SYSTEM DESCRIPTION]:\n\n```[LANGUAGE]\n[CODE OR SYSTEM DESCRIPTION]\n```\n\nOperating environment: [ENVIRONMENT DETAILS]\nSensitive data handled: [TYPES OF DATA]\nCurrent security measures: [EXISTING MEASURES]\n\nPlease provide a comprehensive security analysis including:\n\n1. Identification of potential vulnerabilities categorized by type (e.g., injection, authentication, data exposure)\n2. Risk assessment for each vulnerability (likelihood and impact)\n3. Detailed explanation of how each vulnerability could be exploited\n4. Specific mitigation strategies with code examples or configuration changes\n5. Recommendations for additional security measures\n6. Secure coding practices relevant to this specific case\n7. Suggestions for ongoing security testing and monitoring\n\nPlease prioritize the vulnerabilities and mitigations based on risk level, and provide both quick fixes and more comprehensive solutions where appropriate.",
    use: "coding",
    agents: ["gpt", "claude", "deepseek"]
  },
  {
    id: 35,
    title: "Scientific Literature Review",
    description: "Generate structured literature reviews on scientific topics with key findings.",
    content: "Please help me create a structured literature review on the topic of [SCIENTIFIC TOPIC]. This is for a [PURPOSE] in the field of [FIELD].\n\nPlease include the following sections:\n\n1. Introduction\n   - Overview of the topic and its significance\n   - Scope of the review (timeframe, specific aspects covered)\n   - Key research questions or objectives addressed in the literature\n\n2. Methodology\n   - Suggest databases and search terms that would be appropriate\n   - Inclusion and exclusion criteria for studies\n\n3. Main Findings\n   - Major themes and patterns in the research\n   - Chronological development of key concepts\n   - Comparison of different theoretical approaches\n   - Summary of empirical findings\n   - Areas of consensus and controversy\n\n4. Gaps and Limitations\n   - Methodological limitations in existing research\n   - Underexplored aspects of the topic\n   - Potential biases in the literature\n\n5. Future Research Directions\n   - Promising avenues for further investigation\n   - Emerging trends and technologies in the field\n\n6. Practical Implications\n   - Applications of the research findings\n   - Relevance to practice or policy\n\nPlease cite specific types of studies that would be relevant (you don't need to provide actual citations, but indicate where they would be needed and what type of evidence would support different points).",
    use: "education",
    agents: ["claude", "gpt", "gemini"]
  },
  {
    id: 36,
    title: "Multimedia Content Script",
    description: "Create scripts for videos, podcasts, or presentations with engaging narratives.",
    content: "Please create a script for a [VIDEO/PODCAST/PRESENTATION] on the topic of [TOPIC].\n\nTarget audience: [AUDIENCE]\nLength: Approximately [LENGTH] minutes\nStyle: [INFORMATIONAL/ENTERTAINING/EDUCATIONAL/PERSUASIVE]\nKey points to cover: [LIST MAIN POINTS]\n\nPlease structure the script as follows:\n\n1. Introduction\n   - Attention-grabbing opening\n   - Brief overview of what will be covered\n   - Why this topic matters to the audience\n\n2. Main Content\n   - Divided into logical sections\n   - Each section should include:\n     * Clear explanations of concepts\n     * Engaging examples or stories\n     * Transitions between sections\n\n3. Conclusion\n   - Summary of key points\n   - Call to action or final thoughts\n   - What the audience should remember or do next\n\nPlease include:\n- Natural, conversational language appropriate for the medium\n- Directions for [VISUALS/SOUND EFFECTS/SLIDES] where appropriate\n- Engagement techniques (questions, analogies, etc.)\n- Notes on pacing, emphasis, or delivery where helpful\n\nThe tone should be [DESIRED TONE] and the content should be accessible to someone with [LEVEL OF FAMILIARITY] with the subject.",
    use: "creative",
    agents: ["claude", "gpt", "gemini", "mistral"]
  },
  {
    id: 37,
    title: "Website Content Strategy",
    description: "Develop a comprehensive content strategy for websites with SEO optimization.",
    content: "Please help me develop a comprehensive content strategy for my website about [TOPIC/BUSINESS].\n\nWebsite purpose: [PURPOSE]\nTarget audience: [AUDIENCE DESCRIPTION]\nKey business goals: [GOALS]\nCurrent content status: [CURRENT SITUATION]\n\nPlease provide a detailed content strategy including:\n\n1. Content Audit and Gap Analysis\n   - Types of content needed for each section\n   - Recommended improvements for existing content\n\n2. Content Pillars and Themes\n   - 3-5 main content pillars aligned with business goals\n   - Subtopics under each pillar\n\n3. Content Types and Mix\n   - Recommended formats (blog posts, guides, case studies, etc.)\n   - Content distribution across the website\n\n4. SEO Strategy\n   - Keyword research approach\n   - On-page SEO recommendations\n   - Topic clusters to build authority\n\n5. Content Calendar\n   - Publishing frequency recommendations\n   - Content prioritization framework\n   - Seasonal or timely content opportunities\n\n6. Content Creation Guidelines\n   - Voice and tone recommendations\n   - Content structure best practices\n   - Length and formatting guidelines\n\n7. Measurement Plan\n   - KPIs for content performance\n   - Tools and methods for tracking effectiveness\n\nPlease be specific and tailored to my particular business and audience, with practical recommendations I can implement.",
    use: "business",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 38,
    title: "Machine Learning Model Evaluator",
    description: "Analyze machine learning model performance with metrics and improvement suggestions.",
    content: "I need help evaluating and improving a machine learning model for [TASK TYPE].\n\nModel details:\n- Type: [MODEL TYPE]\n- Features used: [LIST FEATURES]\n- Target variable: [TARGET]\n- Current performance: [METRICS IF AVAILABLE]\n- Training data size: [SIZE]\n\nPlease provide a comprehensive evaluation and improvement plan including:\n\n1. Evaluation Framework\n   - Appropriate metrics for this type of model and task\n   - Validation strategies (cross-validation, hold-out, etc.)\n   - Baseline models for comparison\n\n2. Performance Analysis\n   - Potential sources of error or bias\n   - Overfitting/underfitting assessment\n   - Feature importance analysis approach\n   - Error analysis methodology\n\n3. Improvement Strategies\n   - Feature engineering suggestions\n   - Hyperparameter tuning approach\n   - Model architecture modifications\n   - Ensemble methods to consider\n   - Data augmentation or collection strategies\n\n4. Implementation Plan\n   - Step-by-step approach to implement improvements\n   - How to measure the impact of each change\n   - Experimentation framework\n\n5. Deployment Considerations\n   - Monitoring recommendations\n   - When and how to retrain\n   - Potential production issues to watch for\n\nPlease be specific to my use case and model type, with practical recommendations rather than general ML advice.",
    use: "analysis",
    agents: ["gpt", "claude", "gemini"]
  },
  {
    id: 39,
    title: "Test Case Generator",
    description: "Generate comprehensive test cases for applications or functions with edge cases.",
    content: "Please help me create comprehensive test cases for the following [FEATURE/FUNCTION/APPLICATION]:\n\n[DESCRIPTION OF WHAT NEEDS TESTING]\n\nSpecifications:\n- Input parameters: [LIST PARAMETERS WITH TYPES/CONSTRAINTS]\n- Expected behavior: [DESCRIBE NORMAL BEHAVIOR]\n- Environment: [RELEVANT ENVIRONMENT DETAILS]\n- Dependencies: [ANY DEPENDENCIES]\n\nPlease provide a structured set of test cases including:\n\n1. Positive Test Cases\n   - Normal/expected usage scenarios\n   - Boundary values that should work\n   - Different valid combinations of inputs\n\n2. Negative Test Cases\n   - Invalid inputs\n   - Boundary values that should fail\n   - Missing required parameters\n   - Malformed data\n\n3. Edge Cases\n   - Extreme values\n   - Unusual combinations\n   - Resource limitations\n   - Timing issues\n\n4. Integration Test Cases\n   - Interaction with dependencies\n   - End-to-end flows\n\nFor each test case, please include:\n- A descriptive test case ID and name\n- Preconditions\n- Test steps with specific inputs\n- Expected results\n- Severity/priority level\n\nPlease format these in a structured way that could be used in a test plan document or testing framework.",
    use: "coding",
    agents: ["gpt", "claude", "deepseek"]
  },
  {
    id: 40,
    title: "Historical Event Analysis",
    description: "Analyze historical events with multiple perspectives, causes and effects.",
    content: "Please provide a comprehensive analysis of the historical event: [HISTORICAL EVENT].\n\nPlease structure the analysis as follows:\n\n1. Background and Context\n   - Relevant preceding events and conditions\n   - Historical context of the period\n   - Key figures and their backgrounds\n\n2. Multiple Perspectives\n   - Different viewpoints on the event from:\n     * Various historical actors involved\n     * Different national/cultural perspectives\n     * Contemporary vs. modern historical interpretations\n\n3. Causes and Contributing Factors\n   - Short-term/immediate causes\n   - Long-term/underlying causes\n   - Trigger events or catalysts\n   - Analysis of how these factors interacted\n\n4. Course of Events\n   - Chronological progression of key developments\n   - Critical decision points and alternatives not taken\n   - Role of contingency vs. deterministic factors\n\n5. Consequences and Significance\n   - Short-term outcomes\n   - Long-term impact and legacy\n   - How this event influenced subsequent historical developments\n   - Modern relevance of this historical event\n\n6. Historiographical Debate\n   - How interpretation of this event has changed over time\n   - Major schools of thought or disagreements among historians\n   - Evidence and methodologies used to study this event\n\nPlease provide a balanced analysis that considers multiple perspectives and avoids presentism (judging past events by contemporary standards). Include references to the types of primary and secondary sources that would be valuable for studying this event.",
    use: "education",
    agents: ["claude", "gpt", "gemini", "mistral"]
  }
];

export default function Templates() {
  const [selectedUse, setSelectedUse] = useState("all");
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  
  const handleCopyTemplate = (content) => {
    navigator.clipboard.writeText(content);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 3000);
  };
  
  const filteredTemplates = templateData.filter(template => {
    const useMatch = selectedUse === "all" || template.use === selectedUse;
    const agentMatch = selectedAgents.length === 0 || 
      selectedAgents.some(agent => template.agents.includes(agent));
    return useMatch && agentMatch;
  });
  
  return (
    <Layout currentPageName="Templates">
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center">
              <BookOpenCheck className="mr-2 h-8 w-8 text-indigo-500" />
              <span>Prompt Templates</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Ready-to-use expert prompt templates for different AI assistants and use cases
            </p>
          </motion.div>
          
          {showCopiedAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Alert className="bg-green-100 border-green-200 text-green-800 shadow-md">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Template copied to clipboard!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <TemplateFilters
              selectedUse={selectedUse}
              setSelectedUse={setSelectedUse}
              selectedAgents={selectedAgents}
              setSelectedAgents={setSelectedAgents}
            />
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onCopy={handleCopyTemplate}
              />
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">
                No templates match your current filters. Try adjusting your selections.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
} 