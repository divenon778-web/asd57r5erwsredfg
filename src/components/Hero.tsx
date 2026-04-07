import React from 'react';
import { PromptBuilder } from './PromptBuilder';

export function Hero() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-[160px] pb-12 px-6">
      <div className="flex flex-col items-center text-center w-full max-w-4xl mx-auto">
        


        {/* Headline */}
        <h1 className="font-display font-bold text-[80px] leading-[0.95] tracking-tight text-[#000] mb-6">
          Build & Fix Prompts<br />Instantly
        </h1>

        {/* Subtitle */}
        <p className="font-body text-[18px] leading-relaxed text-[#505050] max-w-[600px] mb-[44px]">
          Transform messy ideas into structured, production-ready prompts. 
          Our AI engine cleans, enhances, and formats your input for optimal UI generation.
        </p>

        {/* Prompt Builder Module */}
        <PromptBuilder />
      </div>
    </div>
  );
}
