export async function enhancePrompt(rawPrompt: string): Promise<string> {
  const systemInstruction = `You are an expert UI/UX designer and prompt engineer. 
  Your job is to take a raw, unstructured user prompt for a web UI and enhance it into a highly structured, professional prompt ready for a code generation AI.
  Output the enhanced prompt in a clean text format with the following sections:
  [Layout]
  [Typography]
  [Components]
  [Behavior/Interactions]
  [Color Palette]
  
  Do not include any conversational filler, markdown bolding, or pleasantries. Just the structured prompt text.`;

  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: rawPrompt }
        ],
        model: 'openai'
      })
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.text();
  } catch (error) {
    console.error("Error enhancing prompt with API, using local fallback:", error);
    return fallbackEnhance(rawPrompt);
  }
}

export async function fixPrompt(brokenPrompt: string): Promise<string> {
  const systemInstruction = `You are an expert prompt engineer. 
  The user will provide a broken, messy, or ineffective prompt for generating UI code.
  Your job is to fix it. Clarify ambiguities, add missing standard UI details (like responsiveness, accessibility, modern design trends), and output a clean, highly effective prompt.
  Output ONLY the fixed prompt text. No conversational filler or markdown formatting.`;

  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: brokenPrompt }
        ],
        model: 'openai'
      })
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.text();
  } catch (error) {
    console.error("Error fixing prompt with API, using local fallback:", error);
    return fallbackFix(brokenPrompt);
  }
}

// Local heuristic fallback engine in case the free API is down or blocked
function fallbackEnhance(prompt: string): string {
  return `[Layout]
Responsive, modern layout based on the core idea: "${prompt.slice(0, 60)}${prompt.length > 60 ? '...' : ''}"
Centered container with maximum width of 1200px.
Flexbox/Grid used for structural alignment.

[Typography]
Primary Font: Inter or system-sans.
Headings: Bold, tight tracking (e.g., 48px to 64px for hero).
Body: 16px to 18px, relaxed line height (1.6).

[Components]
- Main content area derived from user input
- Navigation/Header (if applicable)
- Call to Action buttons with hover states

[Behavior/Interactions]
- Smooth hover transitions (150ms ease-in-out)
- Focus rings for accessibility
- Mobile-responsive stacking

[Color Palette]
- Background: #ffffff (Light) or #0f172a (Dark)
- Primary Accent: #3b82f6 (Blue)
- Text: #1e293b (High contrast)
- Muted: #64748b`;
}

function fallbackFix(prompt: string): string {
  return `Create a modern, responsive web interface based on this concept: "${prompt}". 
Ensure the layout uses CSS Grid or Flexbox for proper alignment across mobile, tablet, and desktop screens. 
Implement a clean typography hierarchy using a modern sans-serif font. 
Include accessible, high-contrast colors, interactive hover states for all clickable elements, and proper spacing (padding/margins) to let the design breathe.`;
}
