import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterBarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterBar = ({ currentFilter, onFilterChange }: FilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const cuisines = [
    'Italian',
    'Mexican',
    'Indian',
    'Chinese',
    'Japanese',
    'Thai',
    'Mediterranean',
    'American',
    'French',
    'Vietnamese',
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const cookingTimes = ['Quick (< 30 min)', 'Medium (30-60 min)', 'Long (> 60 min)'];

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const applyFilters = () => {
    // TODO: Implement filter application logic
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedCuisines([]);
    setSelectedDifficulty('');
    setSelectedTime('');
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => onFilterChange('latest')}
            className={`px-4 py-2 rounded-full ${
              currentFilter === 'latest'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => onFilterChange('trending')}
            className={`px-4 py-2 rounded-full ${
              currentFilter === 'trending'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => onFilterChange('following')}
            className={`px-4 py-2 rounded-full ${
              currentFilter === 'following'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Following
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Cuisine</h4>
              <div className="flex flex-wrap gap-2">
                {cuisines.map(cuisine => (
                  <button
                    key={cuisine}
                    onClick={() => handleCuisineToggle(cuisine)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCuisines.includes(cuisine)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Difficulty</h4>
              <div className="flex space-x-2">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedDifficulty === difficulty
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Cooking Time</h4>
              <div className="flex space-x-2">
                {cookingTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTime === time
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 