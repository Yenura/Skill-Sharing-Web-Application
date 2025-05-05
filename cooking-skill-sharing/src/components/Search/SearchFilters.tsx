import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

const cookingMethods = [
  'Baking',
  'Grilling',
  'Frying',
  'Steaming',
  'Boiling',
  'Roasting',
  'Slow Cooking',
]

const difficultyLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
]

const cuisineTypes = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'American',
]

const prepTimeRanges = [
  'Quick (under 30 mins)',
  'Medium (30-60 mins)',
  'Long (over 60 mins)',
]

const dietaryRestrictions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
]

interface SearchFiltersProps {
  filters: {
    cookingMethod: string
    difficulty: string
    cuisineType: string
    prepTime: string
    dietaryRestrictions: string[]
  }
  onFiltersChange: (filters: any) => void
}

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const handleDietaryRestrictionChange = (restriction: string) => {
    const newRestrictions = filters.dietaryRestrictions.includes(restriction)
      ? filters.dietaryRestrictions.filter((r) => r !== restriction)
      : [...filters.dietaryRestrictions, restriction]
    
    onFiltersChange({
      ...filters,
      dietaryRestrictions: newRestrictions,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
      
      <div className="space-y-4">
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span>Cooking Method</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <div className="space-y-2">
                  {cookingMethods.map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="radio"
                        name="cookingMethod"
                        value={method}
                        checked={filters.cookingMethod === method}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            cookingMethod: e.target.value,
                          })
                        }
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2">{method}</span>
                    </label>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span>Difficulty</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <div className="space-y-2">
                  {difficultyLevels.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={filters.difficulty === level}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            difficulty: e.target.value,
                          })
                        }
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2">{level}</span>
                    </label>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span>Cuisine Type</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <div className="space-y-2">
                  {cuisineTypes.map((cuisine) => (
                    <label key={cuisine} className="flex items-center">
                      <input
                        type="radio"
                        name="cuisineType"
                        value={cuisine}
                        checked={filters.cuisineType === cuisine}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            cuisineType: e.target.value,
                          })
                        }
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span>Preparation Time</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <div className="space-y-2">
                  {prepTimeRanges.map((range) => (
                    <label key={range} className="flex items-center">
                      <input
                        type="radio"
                        name="prepTime"
                        value={range}
                        checked={filters.prepTime === range}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            prepTime: e.target.value,
                          })
                        }
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2">{range}</span>
                    </label>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span>Dietary Restrictions</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <div className="space-y-2">
                  {dietaryRestrictions.map((restriction) => (
                    <label key={restriction} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.dietaryRestrictions.includes(restriction)}
                        onChange={() => handleDietaryRestrictionChange(restriction)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2">{restriction}</span>
                    </label>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
} 