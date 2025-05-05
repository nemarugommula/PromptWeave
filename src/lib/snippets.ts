export interface Snippet {
  id: string;
  category: string;
  title: string;
  description?: string;
  content: string;
}

// Static list of prompt snippets organized by category
export const SNIPPETS: Snippet[] = [
  {
    id: 'tool-desc-1',
    category: 'Tool Descriptions',
    title: 'Tool Description Example',
    description: 'Describe a tool usage or purpose',
    content: '### Tool Description\n\nThis tool allows you to ...'
  },
  {
    id: 'task-boilerplate-1',
    category: 'Task Boilerplates',
    title: 'Summarization Task',
    description: 'Boilerplate for summarizing text',
    content: '### Task: Summarize Text\n\nPlease provide a concise summary of the following:'
  },
  {
    id: 'common-format-1',
    category: 'Common Formats',
    title: 'Bullet List',
    description: 'Insert a bullet list template',
    content: '- item 1\n- item 2\n- item 3'
  }
  // Prompt Paradigms
  ,{
    id: 'paradigm-react-1',
    category: 'Prompt Paradigms',
    title: 'ReAct Prompt',
    description: 'Reasoning + Acting template',
    content: `Thought: I need to find the weather.
Action: search("weather in Paris")
Observation: It's 20°C and sunny.
Thought: I have enough information.
Answer: It's 20°C and sunny in Paris.`
  }
  ,{
    id: 'paradigm-cot-1',
    category: 'Prompt Paradigms',
    title: 'Chain-of-Thought',
    description: 'Step-by-step reasoning template',
    content: `Question: What is 15% of 200?
Let's think step-by-step.
Step 1: 10% of 200 is 20.
Step 2: 5% of 200 is 10.
Final Answer: 30`
  }
  ,{
    id: 'paradigm-tot-1',
    category: 'Prompt Paradigms',
    title: 'Tree-of-Thought',
    description: 'Multiple reasoning paths exploration template',
    content: `Problem: What career should Alice choose?
Path 1: Interest in biology → medicine
Path 2: Interest in design → UX
Path 3: Interest in code → software engineering
Evaluation: Path 3 aligns best with long-term goals
Final Answer: Software Engineering`
  }
  ,{
    id: 'paradigm-role-1',
    category: 'Prompt Paradigms',
    title: 'Role-Based Prompt',
    description: 'Multi-agent or simulated persona template',
    content: `# System
You are a senior lawyer specializing in privacy law.

# User
What are GDPR implications of tracking cookies?

# Assistant
Cookies must be consented explicitly under GDPR...`
  }
  ,{
    id: 'paradigm-plan-1',
    category: 'Prompt Paradigms',
    title: 'Plan-and-Act Loop',
    description: 'AutoGPT / Plan-and-Act self-reflection template',
    content: `{
  "goal": "Summarize the latest news",
  "plan": ["Search news", "Filter for latest", "Summarize"],
  "current_step": 1,
  "action": "search('latest tech news')"
}`
  }
  ,{
    id: 'paradigm-fewshot-1',
    category: 'Prompt Paradigms',
    title: 'Few-Shot Example',
    description: 'Example-based instruction template',
    content: `Input: Translate "Hello" to French.
Output: Bonjour

Input: Translate "Goodbye" to French.
Output: Au revoir

Input: Translate "Thank you" to French.
Output: Merci`
  }
  ,{
    id: 'paradigm-schema-1',
    category: 'Prompt Paradigms',
    title: 'Schema-based Prompting',
    description: 'Function call / JSON schema template',
    content: `{
  "name": "get_weather",
  "parameters": {
    "location": "New York",
    "unit": "Celsius"
  }
}`
  }
  // Function Templates
  ,{
    id: 'func-template-system-1',
    category: 'Function Templates',
    title: 'System Role Template',
    description: 'Template for defining system role',
    content: `# System
You are an AI assistant that follows instructions carefully.`
  }
  ,{
    id: 'func-template-tooldef-1',
    category: 'Function Templates',
    title: 'Tool Definition',
    description: 'JSON schema for tool definition',
    content: `{
  "name": "search",
  "description": "Searches the web for information",
  "parameters": {
    "query": "string"
  }
}`
  }
  ,{
    id: 'func-template-instructions-1',
    category: 'Function Templates',
    title: 'Prompt Instructions',
    description: 'Instruction formatting template',
    content: `Please follow these instructions:
1. Summarize the key points.
2. Keep it under 100 words.
3. Provide examples where appropriate.`
  }
  ,{
    id: 'func-template-output-1',
    category: 'Function Templates',
    title: 'Output Formatting',
    description: 'Template for output formatting',
    content: 'Output:\n```json\n{\n  "summary": "string",\n  "examples": ["string"]\n}\n```'
  }
  ,{
    id: 'func-template-safety-1',
    category: 'Function Templates',
    title: 'Safety Warnings',
    description: 'Safety and compliance template',
    content: `Please ensure the content adheres to privacy and safety guidelines. Avoid sensitive data.`
  }
  ,{
    id: 'func-template-callback-1',
    category: 'Function Templates',
    title: 'Callback/Response Template',
    description: 'Template for callback or API response',
    content: `{
  "status": "success",
  "data": {...}
}`
  }
];