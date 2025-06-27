
import React, { useState } from 'react';
import { MemoryCard } from '../components/MemoryCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { Slideshow } from '../components/Slideshow';
import { Play, Grid, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const memories = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop',
    personName: "Sarah",
    relationship: "Daughter",
    category: "family",
    voiceMessage: "This is Sarah, your daughter. We took this photo last Christmas when you made your famous apple pie.",
    description: "Christmas Day 2023 - Making apple pie together"
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop',
    personName: "Emma",
    relationship: "Granddaughter",
    category: "family",
    voiceMessage: "Hi Grandma! This is Emma, your granddaughter. Remember when we went to the park and fed the ducks?",
    description: "Emma at the park - Duck feeding day"
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
    personName: "Living Room",
    relationship: "Home",
    category: "places",
    voiceMessage: "This is your favorite living room where you love to read and watch TV. Your blue chair is right by the window.",
    description: "Your comfortable living room"
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop',
    personName: "Safari Trip",
    relationship: "Memory",
    category: "events",
    voiceMessage: "Remember our wonderful safari trip? You were so excited to see the zebras and antelopes. What an adventure we had!",
    description: "African Safari Adventure 2019"
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=300&fit=crop',
    personName: "Farm Visit",
    relationship: "Memory",
    category: "events",
    voiceMessage: "This was at Uncle Tom's farm. You loved petting the gentle ox and talking about your childhood on the farm.",
    description: "Visit to Uncle Tom's farm"
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1452960962994-acf4fd70b632?w=400&h=300&fit=crop',
    personName: "David",
    relationship: "Son",
    category: "family",
    voiceMessage: "This is David, your son. We went to see the sheep together. You said they reminded you of your father's farm.",
    description: "David and the sheep - Countryside walk"
  }
];

const categories = [
  { id: 'all', name: 'All Memories', icon: Grid },
  { id: 'family', name: 'Family', icon: Users },
  { id: 'events', name: 'Events', icon: Play },
  { id: 'places', name: 'Places', icon: Grid }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredMemories = selectedCategory === 'all' 
    ? memories 
    : memories.filter(memory => memory.category === selectedCategory);

  if (isSlideshow) {
    return (
      <Slideshow 
        memories={filteredMemories}
        onExit={() => setIsSlideshow(false)}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                📕 Memory Book
              </h1>
              <p className="text-lg text-gray-600">
                Your precious memories with loved ones
              </p>
            </div>
            <Button 
              onClick={() => setIsSlideshow(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg rounded-full shadow-lg"
              disabled={filteredMemories.length === 0}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Slideshow
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Memory Grid */}
        <div className="mt-8">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No memories found for this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemories.map((memory) => (
                <MemoryCard 
                  key={memory.id} 
                  memory={memory}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
