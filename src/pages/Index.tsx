
import React, { useState } from 'react';
import { MemoryCard, Memory } from '../components/MemoryCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { Slideshow } from '../components/Slideshow';
import { AddMemoryForm } from '../components/AddMemoryForm';
import { Play, Grid, Users, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [userMemories, setUserMemories] = useState<Memory[]>([]);

  const filteredMemories = selectedCategory === 'all' 
    ? userMemories 
    : userMemories.filter(memory => memory.category === selectedCategory);

  const handleAddMemory = (newMemory: Omit<Memory, 'id'>) => {
    const memoryWithId: Memory = {
      ...newMemory,
      id: Date.now() // Simple ID generation
    };
    setUserMemories(prev => [...prev, memoryWithId]);
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 py-8">
        <AddMemoryForm 
          onAddMemory={handleAddMemory}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

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
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg rounded-full shadow-lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Add Memory
              </Button>
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
              <div className="mb-6">
                <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-600 mb-2">No Memories Yet</h2>
                <p className="text-xl text-gray-500 mb-6">
                  {selectedCategory === 'all' 
                    ? 'Start building your memory book by adding your first photo and voice message'
                    : `No memories found in the ${categories.find(c => c.id === selectedCategory)?.name} category`
                  }
                </p>
              </div>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-full shadow-lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Add Your First Memory
              </Button>
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
