import React, { useState } from 'react';
import { useOutletContext } from 'react-router';
import { Send, Zap, Loader2, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { generatePrompts } from '../lib/ai';
import { PromptCard } from '../components/PromptCard';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const CATEGORIES = [
  "ChatGPT Prompts",
  "Image Prompts (Midjourney / DALL·E)",
  "YouTube Content",
  "Instagram / TikTok",
  "Business Ideas",
  "Coding Prompts"
];

export function Generator() {
  const { user } = useOutletContext<{ user: any }>();
  const [input, setInput] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isProMode, setIsProMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter an idea first.');
      return;
    }

    setIsGenerating(true);
    setPrompts([]);
    
    try {
      const results = await generatePrompts(category, input, isProMode);
      setPrompts(results);
      toast.success('Prompts generated successfully!');
    } catch (error) {
      toast.error('Failed to generate prompts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (prompts.length === 0) return;
    const text = prompts.join('\n\n-------------------\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ikramify-prompts-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Prompts exported as TXT');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Generate <span className="text-neon text-glow">Masterpiece</span> Prompts
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Transform your simple ideas into highly optimized, professional prompts for any AI model in seconds.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="bg-card border border-border p-6 rounded-2xl space-y-6 box-glow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Your Idea</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., A cyberpunk city with flying cars..."
              className="w-full bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all appearance-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isProMode}
                onChange={(e) => setIsProMode(e.target.checked)}
              />
              <div className={cn(
                "w-10 h-6 rounded-full transition-colors",
                isProMode ? "bg-neon" : "bg-border"
              )}></div>
              <div className={cn(
                "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                isProMode ? "translate-x-4" : "translate-x-0"
              )}></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Pro Mode</span>
              <Zap size={14} className={cn(isProMode ? "text-neon" : "text-gray-500")} />
            </div>
          </label>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neon text-darker font-bold px-8 py-3 rounded-lg hover:bg-neon/90 transition-all box-glow disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send size={20} />
                Generate Prompts
              </>
            )}
          </button>
        </div>
      </form>

      {prompts.length > 0 && (
        <div className="space-y-6 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Generated Prompts</h2>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Download size={16} />
              Export All
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {prompts.map((prompt, index) => (
              <PromptCard 
                key={index} 
                prompt={prompt} 
                index={index} 
                user={user} 
                category={category} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
