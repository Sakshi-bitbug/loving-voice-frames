
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Mic, Search, Users } from 'lucide-react';
import { Memory } from './MemoryCard';

interface SlideshowProps {
  memories: Memory[];
  onExit: () => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const Slideshow: React.FC<SlideshowProps> = ({
  memories,
  onExit,
  currentIndex,
  onIndexChange
}) => {
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentMemory = memories[currentIndex];

  // Auto-advance slides
  useEffect(() => {
    if (isAutoPlay && !isPlayingVoice) {
      intervalRef.current = setInterval(() => {
        onIndexChange((currentIndex + 1) % memories.length);
      }, 5000); // 5 seconds per slide
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlay, isPlayingVoice, currentIndex, memories.length, onIndexChange]);

  const playVoiceMessage = () => {
    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentMemory.voiceMessage);
    utterance.rate = 0.7; // Even slower for slideshow
    utterance.pitch = 1.1;
    utterance.volume = 0.9;

    utterance.onstart = () => {
      setIsPlayingVoice(true);
    };

    utterance.onend = () => {
      setIsPlayingVoice(false);
    };

    utterance.onerror = () => {
      setIsPlayingVoice(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const nextSlide = () => {
    onIndexChange((currentIndex + 1) % memories.length);
  };

  const prevSlide = () => {
    onIndexChange((currentIndex - 1 + memories.length) % memories.length);
  };

  if (!currentMemory) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">No memories to display</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${currentMemory.imageUrl})`,
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              <Play className="mr-2 h-4 w-4" />
              {isAutoPlay ? 'Pause' : 'Play'}
            </Button>
            <span className="text-white/80">
              {currentIndex + 1} of {memories.length}
            </span>
          </div>
          
          <Button
            onClick={onExit}
            className="bg-white/20 hover:bg-red-500 text-white border-white/20"
          >
            <Search className="mr-2 h-4 w-4" />
            Exit Slideshow
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            {/* Image */}
            <div className="mb-8 relative">
              <img 
                src={currentMemory.imageUrl}
                alt={currentMemory.description}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
              >
                →
              </button>
            </div>

            {/* Memory Info */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{currentMemory.personName}</h2>
                  <p className="text-xl text-blue-300">{currentMemory.relationship}</p>
                </div>
              </div>

              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                {currentMemory.description}
              </p>

              {/* Voice Message Button */}
              <Button
                onClick={playVoiceMessage}
                className={`px-8 py-4 text-xl font-medium rounded-full transition-all duration-300 ${
                  isPlayingVoice
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <Mic className="mr-3 h-6 w-6" />
                {isPlayingVoice ? 'Speaking...' : 'Listen to Memory'}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6">
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / memories.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
