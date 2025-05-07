import React from 'react';
import { useNavigate } from 'react-router-dom';

const LearningTab = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-6">
      <p className="text-gray-500 mb-4">
        Create a new meal plan to start your journey.
      </p>
      <button
        onClick={() => navigate('/learning-plans/create')}
        className="px-4 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor"
      >
        Browse Meal Plans
      </button>
    </div>
  );
};

export default LearningTab;