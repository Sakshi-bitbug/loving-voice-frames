
import React, { useState, useRef } from 'react';
import { Play, Mic, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface Memory {
  id: number;
  imageUrl: string;
  personName: string;
  relationship: string;
  category: string;
  voiceMessage: string;
  description: string;
}

interface MemoryCardProps {
  memory: Memory;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const playVoiceMessage = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(memory.voiceMessage);
    utterance.rate = 0.8; // Slower speech for better comprehension
    utterance.pitch = 1.1; // Slightly higher pitch for warmth
    utterance.volume = 0.9;

    utterance.onstart = () => {
      setIsPlaying(true);
      setHasPlayed(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={memory.imageUrl} 
            alt={memory.description}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              onClick={playVoiceMessage}
              className={`rounded-full w-16 h-16 shadow-lg transition-all duration-300 ${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isPlaying ? (
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Person Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{memory.personName}</h3>
              <p className="text-blue-600 font-medium">{memory.relationship}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {memory.description}
          </p>

          {/* Voice Message Control */}
          <Button
            onClick={playVoiceMessage}
            className={`w-full py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : hasPlayed
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Mic className="mr-2 h-5 w-5" />
            {isPlaying ? 'Playing...' : hasPlayed ? 'Play Again' : 'Listen to Message'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
