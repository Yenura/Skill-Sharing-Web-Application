import { useState } from 'react'
import { Tab } from '@headlessui/react'
import RecipeFeed from '@/components/Recipe/RecipeFeed'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface ProfileTabsProps {
  userId: number
}

export default function ProfileTabs({ userId }: ProfileTabsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="bg-white rounded-lg shadow-md">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex border-b border-gray-200">
          <Tab
            className={({ selected }) =>
              classNames(
                'px-4 py-3 text-sm font-medium focus:outline-none',
                selected
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }
          >
            Posted Recipes
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'px-4 py-3 text-sm font-medium focus:outline-none',
                selected
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }
          >
            Saved Recipes
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'px-4 py-3 text-sm font-medium focus:outline-none',
                selected
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }
          >
            Communities
          </Tab>
        </Tab.List>

        <Tab.Panels className="p-4">
          <Tab.Panel>
            <RecipeFeed />
          </Tab.Panel>
          <Tab.Panel>
            <div className="text-center py-8 text-gray-500">
              Saved recipes will appear here
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mock communities data */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h3 className="font-medium text-gray-900">Italian Cooking</h3>
                <p className="text-sm text-gray-500 mt-1">1.2k members</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h3 className="font-medium text-gray-900">Asian Fusion</h3>
                <p className="text-sm text-gray-500 mt-1">850 members</p>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
} 