import React, { useState } from 'react';
import { Sparkles, Paperclip, Mic, LayoutTemplate, Wand2, ArrowRight, Loader2, Copy, Check, Beaker } from 'lucide-react';
import { fixPrompt } from '../lib/ai';

export function PromptBuilder() {
  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isOptimized, setIsOptimized] = useState(false);
  const [viewMode, setViewMode] = useState<'raw' | 'optimized'>('raw');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDemoPrompt = () => {
    const demoPrompts = [
      "make a website for my dog it needs to be blue and have a picture of him and a contact form also maybe a blog but idk just make it look cool",
      "i need a python script that downloads videos from youtube and converts them to mp3 and then uploads them to google drive automatically every day at 5pm",
      "write an essay about the french revolution but make it sound like it was written by a gen z teenager on tiktok",
      "create a react component that is a button but when you click it it turns into a modal and the modal has a form with 10 fields and validates all of them using regex"
    ];
    const randomPrompt = demoPrompts[Math.floor(Math.random() * demoPrompts.length)];
    setPrompt(randomPrompt);
    setViewMode('raw');
    setIsOptimized(false);
  };

  const handleFix = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await fixPrompt(prompt);
      setOptimizedPrompt(result);
      setIsOptimized(true);
      setViewMode('optimized');
    } catch (error) {
      console.error(error);
      alert("Failed to fix prompt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[728px] bg-[rgba(0,0,0,0.24)] backdrop-blur-xl rounded-[18px] p-2 shadow-2xl border border-white/10">
      {/* Top System Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[rgba(90,225,76,0.89)] shadow-[0_0_8px_rgba(90,225,76,0.6)]"></div>
            <span className="text-xs font-medium text-white/90 uppercase tracking-wider">Ready</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isOptimized && (
            <div className="flex bg-black/40 rounded-full p-0.5 border border-white/10">
              <button 
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${viewMode === 'raw' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                Raw
              </button>
              <button 
                onClick={() => setViewMode('optimized')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${viewMode === 'optimized' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                Optimized
              </button>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-white/60">
            <span className="text-xs font-medium">Struc v1</span>
          </div>
        </div>
      </div>

      {/* Main Input Area */}
      <div className="bg-white rounded-[14px] shadow-inner overflow-hidden flex flex-col transition-all duration-300 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-black mb-2" />
            <span className="text-sm font-medium text-gray-600">Fixing prompt...</span>
          </div>
        )}
        <div className="p-[34px] pb-4 min-h-[200px] max-h-[500px] overflow-y-auto">
          {viewMode === 'raw' ? (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste or write your prompt here..."
              className="w-full h-full min-h-[140px] resize-none outline-none text-[16px] font-body leading-relaxed text-[#000] placeholder:text-gray-400 bg-transparent"
            />
          ) : (
            <div className="w-full h-full min-h-[140px] text-[15px] font-mono leading-relaxed text-[#000] bg-transparent whitespace-pre-wrap text-left">
              {optimizedPrompt}
            </div>
          )}
        </div>

        {/* Bottom Action Row */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-[#f8f8f8]">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-[#000] hover:bg-gray-200/50 rounded-lg transition-colors" title="Attach File">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-[#000] hover:bg-gray-200/50 rounded-lg transition-colors" title="Voice Input">
              <Mic className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
            <button 
              onClick={handleDemoPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#000] hover:bg-gray-200/50 rounded-lg transition-colors"
            >
              <Beaker className="w-4 h-4" />
              Demo Prompt
            </button>
            {viewMode === 'optimized' && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#000] hover:bg-gray-200/50 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-400">
              {prompt.length} / 2000
            </span>
            <button 
              onClick={handleFix}
              disabled={isLoading || !prompt.trim()}
              className="flex items-center justify-center w-8 h-8 bg-[#000] text-white rounded-lg hover:bg-black/80 transition-colors shadow-sm disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
