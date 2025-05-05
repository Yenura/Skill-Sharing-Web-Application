import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface RecipeSearchProps {
  onSearch: (filters: {
    query: string;
    difficulty: string;
    cookingTime: string;
    tags: string[];
  }) => void;
}

export const RecipeSearch = ({ onSearch }: RecipeSearchProps) => {
  const [filters, setFilters] = useState({
    query: '',
    difficulty: '',
    cookingTime: '',
    tags: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!filters.tags.includes(newTag)) {
        setFilters((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
        e.currentTarget.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      difficulty: '',
      cookingTime: '',
      tags: [],
    });
    onSearch({
      query: '',
      difficulty: '',
      cookingTime: '',
      tags: [],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              name="query"
              value={filters.query}
              onChange={handleInputChange}
              placeholder="Search recipes..."
              icon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Select
              name="difficulty"
              value={filters.difficulty}
              onChange={(value) => handleSelectChange('difficulty', value)}
              placeholder="Select difficulty"
              options={[
                { value: '', label: 'All difficulties' },
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
              ]}
            />
          </div>

          <div>
            <Select
              name="cookingTime"
              value={filters.cookingTime}
              onChange={(value) => handleSelectChange('cookingTime', value)}
              placeholder="Select cooking time"
              options={[
                { value: '', label: 'Any time' },
                { value: '15', label: '15 minutes or less' },
                { value: '30', label: '30 minutes or less' },
                { value: '60', label: '1 hour or less' },
                { value: '120', label: 'More than 1 hour' },
              ]}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Add tags (press Enter)"
              onKeyDown={handleTagInput}
              icon={<Filter className="h-5 w-5 text-gray-400" />}
            />
          </div>
        </div>

        {filters.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}; 