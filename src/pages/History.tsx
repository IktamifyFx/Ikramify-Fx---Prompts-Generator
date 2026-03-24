import React, { useEffect, useState } from 'react';
import { useOutletContext, Navigate } from 'react-router';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PromptCard } from '../components/PromptCard';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

export function History() {
  const { user } = useOutletContext<{ user: any }>();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && isSupabaseConfigured()) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error: any) {
      toast.error('Failed to load history: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPrompts(prompts.filter(p => p.id !== id));
      toast.success('Prompt deleted');
    } catch (error: any) {
      toast.error('Failed to delete prompt');
    }
  };

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Supabase Not Configured</h2>
        <p className="text-gray-400">Please add your Supabase URL and Anon Key to the environment variables to use the History feature.</p>
      </div>
    );
  }

  const filteredPrompts = prompts.filter(p => 
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your History</h1>
          <p className="text-gray-400 mt-1">Manage your saved prompts</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-neon transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-neon" size={32} />
        </div>
      ) : filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredPrompts.map((prompt, index) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt.content}
              category={prompt.category}
              index={index}
              user={user}
              isSaved={true}
              onDelete={() => handleDelete(prompt.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <p className="text-gray-400">No saved prompts found.</p>
        </div>
      )}
    </div>
  );
}
