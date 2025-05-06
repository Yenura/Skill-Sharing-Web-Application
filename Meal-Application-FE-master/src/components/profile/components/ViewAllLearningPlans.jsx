import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/Toast';
import { API_BASE_URL } from '../../../config/apiConfig';
import Navbar from '../../common/Navbar';

const ViewAllLearningPlans = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);
  const [followedPlanIds, setFollowedPlanIds] = useState(new Set());
  const [userMap, setUserMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingUsernames, setIsLoadingUsernames] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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
          headers: { Authorization: `Bearer ${token}` },
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

  // Fetch all learning plans
  useEffect(() => {
    let isMounted = true;

    const fetchLearningPlans = async () => {
      setIsLoadingPlans(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/learning-plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Meal
             plans: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          // Filter out owned plans that are also followed to avoid duplication
          const filteredPlans = data.filter(plan => {
            if (plan.userId === currentUser?.id && followedPlanIds.has(plan.id)) {
              return false; // Exclude owned plan if it's followed
            }
            return true;
          });
          setLearningPlans(filteredPlans);
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
  }, [addToast, currentUser?.id, followedPlanIds]);

  // Fetch followed plans
  useEffect(() => {
    if (!currentUser?.id) return;

    let isMounted = true;

    const fetchFollowedPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/learning-plan/user/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch followed plans: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          // Extract sourcePlanId for followed plans
          const followedIds = new Set(data.filter(plan => plan.sourcePlanId).map(plan => plan.sourcePlanId));
          setFollowedPlanIds(followedIds);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching followed plans:', error);
          addToast('Failed to load followed plans. Please try again.', 'error');
        }
      }
    };

    fetchFollowedPlans();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, addToast]);

  // Fetch usernames
  useEffect(() => {
    if (learningPlans.length === 0) return;

    let isMounted = true;

    const fetchUsernames = async () => {
      setIsLoadingUsernames(true);
      try {
        const token = localStorage.getItem('token');
        const uniqueUserIds = [...new Set(learningPlans.map((plan) => plan.userId).filter(Boolean))];
        const userMapTemp = {};

        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            try {
              const response = await fetch(`${API_BASE_URL}/users/by-id/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok) {
                if (response.status === 401) {
                  localStorage.removeItem('token');
                  addToast('Session expired. Please log in again.', 'error');
                  navigate('/auth');
                  return;
                }
                console.warn(`Failed to fetch user ${userId}: ${response.status}`);
                userMapTemp[userId] = 'Unknown';
                return;
              }

              const userData = await response.json();
              userMapTemp[userId] = userData.username || 'Unknown';
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error);
              userMapTemp[userId] = 'Unknown';
            }
          })
        );

        if (isMounted) {
          setUserMap(userMapTemp);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching usernames:', error);
          addToast('Failed to load usernames.', 'error');
        }
      } finally {
        if (isMounted) {
          setIsLoadingUsernames(false);
        }
      }
    };

    fetchUsernames();

    return () => {
      isMounted = false;
    };
  }, [learningPlans, addToast, navigate]);

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
  };

  const handleFollowPlan = async (planId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/learning-plan/follow/${planId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          addToast('Session expired. Please log in again.', 'error');
          navigate('/auth');
          return;
        }
        if (response.status === 400) {
          const errorData = await response.json();
          addToast(errorData.error || 'Cannot follow this Meal plan.', 'error');
          return;
        }
        if (response.status === 404) {
          addToast('Meal plan not found.', 'error');
          return;
        }
        throw new Error(`Failed to follow Meal plan: ${response.status}`);
      }

      // Update followed plans
      setFollowedPlanIds(prev => new Set([...prev, planId]));
      addToast('Meal plan followed successfully! View it in your followed plans.', 'success');
      navigate('/profile');
    } catch (error) {
      console.error('Error following Meal plan:', error);
      addToast(error.message || 'Failed to follow Meal plan.', 'error');
    }
  };

  const calculateProgress = (weeks) => {
    if (!Array.isArray(weeks) || weeks.length === 0) return 0;
    const completedWeeks = weeks.filter((week) => week.status === 'Completed').length;
    return Math.round((completedWeeks / weeks.length) * 100);
  };

  // CSS classes
  const styles = {
    container: "min-h-screen bg-gradient-to-b from-blue-50 to-white",
    wrapper: "max-w-5xl mx-auto pt-8 pb-12 px-4 sm:px-6 lg:px-8",
    loadingContainer: "flex justify-center items-center min-h-screen",
    loadingSpinner: "animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600",
    loadingPlanSpinner: "animate-spin rounded-full h-8 w-8 border-t-3 border-b-3 border-indigo-600",
    emptyContainer: "text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100",
    emptyText: "text-gray-500 font-medium",
    headerContainer: "flex justify-between items-center mb-8",
    headerTitle: "text-2xl font-bold text-gray-800",
    planCardContainer: "grid gap-6 md:grid-cols-2",
    planCard: "bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200",
    planCardHeader: "flex justify-between items-center mb-4",
    planTitle: "text-xl font-semibold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors duration-200",
    actionsContainer: "flex space-x-3",
    followButton: "text-green-600 hover:text-green-800 font-medium text-sm transition-colors duration-200",
    followingText: "text-gray-500 font-medium text-sm",
    description: "text-gray-600 mb-4 line-clamp-2",
    metaInfo: "text-gray-500 text-sm flex items-center gap-2",
    breadcrumbs: "flex space-x-6 items-center mb-6",
    breadcrumbLink: "text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors duration-200 flex items-center gap-1",
    detailCard: "bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6",
    detailTitle: "text-2xl font-bold text-gray-800 mb-3",
    authorContainer: "flex items-center mb-5 text-gray-600",
    authorIcon: "w-5 h-5 mr-2 text-gray-500",
    sectionTitle: "text-lg font-semibold text-gray-800 mb-3",
    divider: "border-t border-gray-100 my-6",
    resourceList: "space-y-3 mb-6",
    resourceItem: "flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200",
    resourceIcon: "w-5 h-5 mr-3 text-gray-500",
    progressBar: "w-full bg-gray-200 rounded-full h-2.5 mb-4",
    progressFill: "bg-green-500 h-2.5 rounded-full",
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar user={currentUser} />
      <div className={styles.wrapper}>
        {selectedPlan ? (
          <div>
            <div className={styles.breadcrumbs}>
              <button onClick={handleBackToList} className={styles.breadcrumbLink}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to All Plans
              </button>
            </div>

            <div className={styles.detailCard}>
              <div className="flex justify-between">
                <h2 className={styles.detailTitle}>{selectedPlan.title || 'Untitled'}</h2>
                <div className="flex space-x-3">
                  {selectedPlan.userId !== currentUser?.id && !followedPlanIds.has(selectedPlan.id) && (
                    <button onClick={() => handleFollowPlan(selectedPlan.id)} className={styles.followButton}>
                      Follow
                    </button>
                  )}
                  {followedPlanIds.has(selectedPlan.id) && (
                    <span className={styles.followingText}>Following</span>
                  )}
                </div>
              </div>

              <div className={styles.authorContainer}>
                <svg className={styles.authorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <span>Created by @{isLoadingUsernames ? 'Loading...' : userMap[selectedPlan.userId] || 'Unknown'}</span>
              </div>

              <div className="mb-4">
                <h3 className={styles.sectionTitle}>About This Plan</h3>
                <p className="text-gray-600 leading-relaxed">{selectedPlan.description || 'No description provided for this Meal plan.'}</p>
              </div>

              <div className={styles.divider}></div>

              {selectedPlan.resources && Array.isArray(selectedPlan.resources) && selectedPlan.resources.length > 0 && (
                <div className="mb-6">
                  <h3 className={styles.sectionTitle}>Learning Resources</h3>
                  <ul className={styles.resourceList}>
                    {selectedPlan.resources.map((resource, index) => (
                      <li key={index} className={styles.resourceItem}>
                        {resource.url ? (
                          <svg className={styles.resourceIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            ></path>
                          </svg>
                        ) : resource.type === 'Course' ? (
                          <svg className={styles.resourceIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            ></path>
                          </svg>
                        ) : (
                          <svg className={styles.resourceIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            ></path>
                          </svg>
                        )}
                        {resource.url ? (
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {resource.title || 'Untitled Resource'}
                          </a>
                        ) : (
                          <span>{resource.title || 'Untitled Resource'}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : isLoadingPlans ? (
          <div className="flex justify-center items-center py-12">
            <div className={styles.loadingPlanSpinner}></div>
          </div>
        ) : learningPlans.length === 0 ? (
          <div className={styles.emptyContainer}>
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <p className={styles.emptyText}>No Meal plans found.</p>
          </div>
        ) : (
          <div>
            <div className={styles.headerContainer}>
              <h1 className={styles.headerTitle}>All Meal Plans</h1>
            </div>

            <div className={styles.planCardContainer}>
              {learningPlans.map((plan) => (
                <div key={plan.id} className={styles.planCard}>
                  <div className={styles.planCardHeader}>
                    <h2 className={styles.planTitle} onClick={() => handleViewPlan(plan)}>
                      {plan.title || 'Untitled Plan'}
                    </h2>
                    <div className={styles.actionsContainer}>
                      {plan.userId !== currentUser?.id && !followedPlanIds.has(plan.id) && (
                        <button onClick={() => handleFollowPlan(plan.id)} className={styles.followButton}>
                          Follow
                        </button>
                      )}
                      {followedPlanIds.has(plan.id) && (
                        <span className={styles.followingText}>Following</span>
                      )}
                    </div>
                  </div>

                  <p className={styles.description}>
                    {plan.description || 'No description provided for this Meal plan.'}
                  </p>

                  <div className={styles.metaInfo}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    {/* <span>by @{isLoadingUsernames ? 'Loading...' : userMap[plan.userId] || 'Unknown'}</span> */}
                  </div>

                  {Array.isArray(plan.weeks) && plan.weeks.length > 0 && (
                    <div className="mb-4">
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${calculateProgress(plan.weeks)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Progress: {calculateProgress(plan.weeks)}%</span>
                        <span>{plan.weeks.length} {plan.weeks.length === 1 ? 'week' : 'weeks'}</span>
                      </div>
                    </div>
                  )}

                  <div className={styles.metaInfo}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>
                      {Array.isArray(plan.weeks) && plan.weeks.length > 0
                        ? `${plan.weeks.length} ${plan.weeks.length === 1 ? 'week' : 'weeks'} duration`
                        : 'No timeline set'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllLearningPlans;