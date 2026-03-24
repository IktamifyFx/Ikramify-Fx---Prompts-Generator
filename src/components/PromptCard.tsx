import React, { useState } from 'react';
import { Copy, Bookmark, Wand2, Check, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { improvePrompt } from '../lib/ai';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'sonner';

interface PromptCardProps {
  key?: React.Key;
  prompt: string;
  index: number;
  user: any;
  category?: string;
  isSaved?: boolean;
  onDelete?: () => void;
}

export function PromptCard({ prompt: initialPrompt, index, user, category = 'General', isSaved = false, onDelete }: PromptCardProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isCopied, setIsCopied] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured. Please add env vars.');
      return;
    }
    if (!user) {
      toast.error('Please login to save prompts.');
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_prompts')
        .insert([
          { user_id: user.id, content: prompt, category }
        ]);

      if (error) throw error;
      setSaved(true);
      toast.success('Prompt saved to history!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save prompt');
    }
  };

  const handleImprove = async () => {
    setIsImproving(true);
    try {
      const improved = await improvePrompt(prompt);
      setPrompt(improved);
      toast.success('Prompt improved successfully!');
    } catch (error) {
      toast.error('Failed to improve prompt');
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-xl p-5 hover:border-neon/30 transition-colors group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-neon opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold px-2 py-1 bg-border rounded text-gray-300">
          {category}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleImprove}
            disabled={isImproving}
            className="p-1.5 text-gray-400 hover:text-neon hover:bg-neon-dim rounded transition-colors disabled:opacity-50"
            title="Improve Prompt with AI"
          >
            <Wand2 size={16} className={cn(isImproving && "animate-spin")} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-border rounded transition-colors"
            title="Copy"
          >
            {isCopied ? <Check size={16} className="text-neon" /> : <Copy size={16} />}
          </button>
          {onDelete ? (
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saved}
              className={cn(
                "p-1.5 rounded transition-colors",
                saved 
                  ? "text-neon bg-neon-dim" 
                  : "text-gray-400 hover:text-neon hover:bg-neon-dim"
              )}
              title="Save"
            >
              <Bookmark size={16} className={cn(saved && "fill-current")} />
            </button>
          )}
        </div>
      </div>
      
      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
        {prompt}
      </p>
    </motion.div>
  );
}
