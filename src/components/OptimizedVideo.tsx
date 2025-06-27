import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

interface OptimizedVideoProps {
  videoId: string;
  title: string;
  className?: string;
  autoplay?: boolean;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  videoId,
  title,
  className = '',
  autoplay = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(autoplay);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy load video when in viewport
  useEffect(() => {
    if (showVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Preconnect to YouTube domains when video is about to be visible
          const preconnect1 = document.createElement('link');
          preconnect1.rel = 'preconnect';
          preconnect1.href = 'https://www.youtube.com';
          document.head.appendChild(preconnect1);

          const preconnect2 = document.createElement('link');
          preconnect2.rel = 'preconnect';
          preconnect2.href = 'https://www.youtube-nocookie.com';
          document.head.appendChild(preconnect2);

          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [showVideo]);

  const handlePlayClick = () => {
    setShowVideo(true);
    setIsLoaded(true);
  };

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {!showVideo ? (
        // Optimized thumbnail with play button
        <div className="relative cursor-pointer group" onClick={handlePlayClick}>
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover rounded-2xl"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-2xl group-hover:bg-opacity-40 transition-all duration-300">
            <div className="bg-red-600 rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-12 h-12 text-white fill-current ml-1" />
            </div>
          </div>
        </div>
      ) : (
        // Actual YouTube embed with optimized parameters
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=1&disablekb=0&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
          title={title}
          className="w-full h-full rounded-2xl"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

export default OptimizedVideo;