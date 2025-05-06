import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/Navbar';
import { useToast } from '../../common/Toast';
import { API_BASE_URL } from '../../../config/apiConfig';

const ViewUserLearningPlans = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Fetch current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    let isMounted = true;

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/auth');
            return;
          }
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        if (isMounted) {
          setCurrentUser(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching user:', error);
          addToast('Failed to load user data. Please try again.', 'error');
        }
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [navigate, addToast]);

  // Fetch learning plans when currentUser.id is available
  useEffect(() => {
    if (!currentUser?.id) return;

    let isMounted = true;

    const fetchLearningPlans = async () => {
      setIsLoadingPlans(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/learning-plan/user/${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Meal plans: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          console.log('Fetched user Meal plans:', data); // Debug the response
          setLearningPlans(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching Meal plans:', error);
          addToast('Failed to load Meal plans. Please try again.', 'error');
          setLearningPlans([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPlans(false);
          setIsLoading(false);
        }
      }
    };

    fetchLearningPlans();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, addToast, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Meal plan?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/learning-plan/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete Meal plan');
      }

      setLearningPlans(learningPlans.filter((plan) => plan.id !== id));
      addToast('Meal plan deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting Meal plan:', error);
      addToast('Failed to delete Meal plan. Please try again.', 'error');
    }
  };

  const handleEdit = (id) => {
    navigate(`/learning-plans/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-DarkColor"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={currentUser} />
      <div className="max-w-5xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Meal Plans</h1>
          {currentUser && (
            <button
              onClick={() => navigate('/learning-plans/create')}
              className="px-4 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor"
            >
              Create New Plan
            </button>
          )}
        </div>

        {isLoadingPlans ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-DarkColor"></div>
          </div>
        ) : learningPlans.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No Meal plans found. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {learningPlans.map((plan) => (
              <div key={plan.id} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{plan.title || 'Untitled'}</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(plan.id)}
                      className="text-DarkColor hover:text-ExtraDarkColor"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{plan.description || 'No description'}</p>
                <div className="text-gray-600 mb-4">
                  <span>
                    Duration:{' '}
                    {Array.isArray(plan.weeks) && plan.weeks.length > 0
                      ? `${plan.weeks.length} weeks`
                      : 'N/A'}
                  </span>
                </div>

                {plan.resources && Array.isArray(plan.resources) && plan.resources.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Resources</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {plan.resources.map((resource, index) => (
                        <li key={index} className="text-gray-600">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-DarkColor hover:underline"
                          >
                            {resource.title || 'Untitled Resource'}
                          </a>{' '}
                          ({resource.type || 'Unknown'})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.weeks && Array.isArray(plan.weeks) && plan.weeks.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline</h3>
                    <div className="space-y-4">
                      {plan.weeks.map((week, index) => (
                        <div key={index} className="border-l-2 border-DarkColor pl-4">
                          <h4 className="text-sm font-medium text-gray-700">
                            {week.title || `Week ${index + 1}`}
                          </h4>
                          <p className="text-gray-600">{week.description || 'No description'}</p>
                          {week.status && typeof week.status === 'string' && (
                            <span
                              className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                                week.status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : week.status === 'In Progress'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {week.status}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUserLearningPlans;