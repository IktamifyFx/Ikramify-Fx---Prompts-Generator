import React from 'react';
import { PromptCard } from '../components/PromptCard';
import { Flame } from 'lucide-react';
import { useOutletContext } from 'react-router';

const TRENDING_PROMPTS = [
  {
    category: "Image Prompts (Midjourney / DALL·E)",
    content: "A hyper-realistic cyberpunk street market at night, neon signs reflecting in puddles, cinematic lighting, 8k resolution, highly detailed, volumetric fog, shot on 35mm lens --ar 16:9 --v 6.0"
  },
  {
    category: "Coding Prompts",
    content: "Act as a Senior React Developer. I need you to review the following component for performance bottlenecks, accessibility issues, and adherence to modern hooks best practices. Provide a refactored version with comments explaining the changes."
  },
  {
    category: "Business Ideas",
    content: "Generate 5 innovative SaaS business ideas targeting the remote work niche. For each idea, provide a target audience, core value proposition, potential monetization strategy, and a basic go-to-market plan."
  },
  {
    category: "YouTube Content",
    content: "Write a highly engaging, fast-paced YouTube script hook (first 30 seconds) about 'The Hidden Dangers of AI'. It must include a pattern interrupt, a bold claim, and an open loop to keep viewers watching."
  }
];

export function Trending() {
  const { user } = useOutletContext<{ user: any }>();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-orange-500/10 rounded-lg">
          <Flame className="text-orange-500" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Trending Prompts</h1>
          <p className="text-gray-400 mt-1">The most popular prompts used by the community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {TRENDING_PROMPTS.map((prompt, index) => (
          <PromptCard
            key={index}
            prompt={prompt.content}
            category={prompt.category}
            index={index}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}
