
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;
        
        return (
          <Button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-3 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${
              isSelected
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-blue-50 shadow-md'
            }`}
          >
            <Icon className="mr-2 h-5 w-5" />
            {category.name}
          </Button>
        );
      })}
    </div>
  );
};
