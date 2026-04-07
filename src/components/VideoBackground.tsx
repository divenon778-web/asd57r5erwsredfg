import React, { useEffect, useRef } from 'react';

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeAnimationRef = useRef<number | null>(null);
  const isFadingOut = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeDuration = 250; // ms
    
    const animateOpacity = (startOpacity: number, endOpacity: number, duration: number, onComplete?: () => void) => {
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }

      const startTime = performance.now();
      const currentOpacity = parseFloat(video.style.opacity || '0');
      // If we are interrupting, start from current opacity to avoid snapping
      const actualStartOpacity = isNaN(currentOpacity) ? startOpacity : currentOpacity;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Linear interpolation for opacity
        const newOpacity = actualStartOpacity + (endOpacity - actualStartOpacity) * progress;
        video.style.opacity = newOpacity.toString();

        if (progress < 1) {
          fadeAnimationRef.current = requestAnimationFrame(animate);
        } else {
          if (onComplete) onComplete();
        }
      };

      fadeAnimationRef.current = requestAnimationFrame(animate);
    };

    const handleTimeUpdate = () => {
      if (!video) return;
      
      const timeRemaining = video.duration - video.currentTime;
      
      // Trigger fade out when 0.55 seconds remain
      if (timeRemaining <= 0.55 && !isFadingOut.current) {
        isFadingOut.current = true;
        animateOpacity(1, 0, fadeDuration);
      }
    };

    const handleEnded = () => {
      if (!video) return;
      
      // Ensure opacity is 0 at the end
      video.style.opacity = '0';
      
      // Wait 100ms, reset, replay, and fade back in
      setTimeout(() => {
        video.currentTime = 0;
        video.play().then(() => {
          isFadingOut.current = false;
          animateOpacity(0, 1, fadeDuration);
        }).catch(console.error);
      }, 100);
    };

    const handleLoadedData = () => {
      // Initial fade in on load
      video.style.opacity = '0';
      animateOpacity(0, 1, fadeDuration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadeddata', handleLoadedData);

    // Attempt initial play
    video.play().catch(console.error);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadeddata', handleLoadedData);
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-[#f8f8f8]">
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[115%] h-[115%] object-cover object-top"
        autoPlay
        muted
        playsInline
        style={{ opacity: 0 }}
      />
      {/* Light overlay to ensure text readability against the video */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
    </div>
  );
}
