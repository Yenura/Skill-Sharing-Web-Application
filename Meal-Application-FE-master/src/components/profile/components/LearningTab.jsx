import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/Toast';
import { API_BASE_URL } from '../../../config/apiConfig';

const LearningTab = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);
  const [otherLearningPlans, setOtherLearningPlans] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingOtherPlans, setIsLoadingOtherPlans] = useState(false);
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
          headers: {
            Authorization: `Bearer ${token}`,
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

  // Fetch user's learning plans
  useEffect(() => {
    if (!currentUser?.id) return;

    let isMounted = true;

    const fetchLearningPlans = async () => {
      setIsLoadingPlans(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/learning-plan/user/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch meal plans: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          // Filter for plans created by the user (sourcePlanId is null)
          const createdPlans = data.filter((plan) => !plan.sourcePlanId);
          setLearningPlans(createdPlans);
          // Filter for followed plans (sourcePlanId is not null)
          const followedPlans = data.filter((plan) => plan.sourcePlanId);
          setOtherLearningPlans(followedPlans);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching meal plans:', error);
          addToast('Failed to load meal plans. Please try again.', 'error');
          setLearningPlans([]);
          setOtherLearningPlans([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPlans(false);
          setIsLoadingOtherPlans(false);
          setIsLoading(false);
        }
      }
    };

    fetchLearningPlans();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, addToast, navigate]);

  // Fetch usernames for followed plans' original creators
  useEffect(() => {
    if (otherLearningPlans.length === 0) return;

    let isMounted = true;

    const fetchUsernames = async () => {
      setIsLoadingUsernames(true);
      try {
        const token = localStorage.getItem('token');
        const uniqueSourcePlanIds = [...new Set(otherLearningPlans.map((plan) => plan.sourcePlanId).filter(Boolean))];
        const userMapTemp = {};

        await Promise.all(
          uniqueSourcePlanIds.map(async (sourcePlanId) => {
            try {
              // Fetch the original plan to get its userId
              const planResponse = await fetch(`${API_BASE_URL}/learning-plan/${sourcePlanId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!planResponse.ok) {
                if (planResponse.status === 401) {
                  localStorage.removeItem('token');
                  addToast('Session expired. Please log in again.', 'error');
                  navigate('/auth');
                  return;
                }
                console.warn(`Failed to fetch plan ${sourcePlanId}: ${planResponse.status}`);
                return;
              }

              const planData = await planResponse.json();
              const userId = planData.userId;

              // Fetch the user
              const userResponse = await fetch(`${API_BASE_URL}/users/by-id/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!userResponse.ok) {
                if (userResponse.status === 401) {
                  localStorage.removeItem('token');
                  addToast('Session expired. Please log in again.', 'error');
                  navigate('/auth');
                  return;
                }
                console.warn(`Failed to fetch user ${userId}: ${userResponse.status}`);
                userMapTemp[sourcePlanId] = 'Unknown';
                return;
              }

              const userData = await userResponse.json();
              userMapTemp[sourcePlanId] = userData.username || 'Unknown';
            } catch (error) {
              console.error(`Error fetching user for plan ${sourcePlanId}:`, error);
              userMapTemp[sourcePlanId] = 'Unknown';
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
  }, [otherLearningPlans, addToast, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meal plan?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/learning-plan/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete meal plan');
      }

      setLearningPlans(learningPlans.filter((plan) => plan.id !== id));
      setOtherLearningPlans(otherLearningPlans.filter((plan) => plan.id !== id));
      setSelectedPlan(null); // Reset detailed view if deleted plan is selected
      addToast('Meal plan deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      addToast('Failed to delete meal plan. Please try again.', 'error');
    }
  };

  const handleEdit = (id) => {
    navigate(`/learning-plans/edit/${id}`);
  };

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
          addToast(errorData.error || 'Cannot follow this meal plan.', 'error');
          return;
        }
        if (response.status === 404) {
          addToast('Meal plan not found.', 'error');
          return;
        }
        throw new Error(`Failed to follow meal plan: ${response.status}`);
      }

      addToast('Meal plan followed successfully!', 'success');
      // Refresh followed plans
      const userPlansResponse = await fetch(`${API_BASE_URL}/learning-plan/user/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userPlansResponse.ok) {
        const updatedPlans = await userPlansResponse.json();
        setOtherLearningPlans(updatedPlans.filter((plan) => plan.sourcePlanId));
      }
    } catch (error) {
      console.error('Error following meal plan:', error);
      addToast(error.message || 'Failed to follow meal plan.', 'error');
    }
  };

  const calculateProgress = (weeks) => {
    if (!Array.isArray(weeks) || weeks.length === 0) return 0;
    const completedWeeks = weeks.filter((week) => week.status === 'Completed').length;
    return Math.round((completedWeeks / weeks.length) * 100);
  };

  const handleWeekStatusChange = async (planId, weekIndex, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
    const isOwnPlan = learningPlans.some((plan) => plan.id === planId);
    const plansToUpdate = isOwnPlan ? learningPlans : otherLearningPlans;
    const setPlansToUpdate = isOwnPlan ? setLearningPlans : setOtherLearningPlans;

    const updatedPlans = plansToUpdate.map((plan) => {
      if (plan.id === planId) {
        const updatedWeeks = plan.weeks.map((week, index) =>
          index === weekIndex ? { ...week, status: newStatus } : week
        );
        return { ...plan, weeks: updatedWeeks };
      }
      return plan;
    });

    // Optimistically update UI
    setPlansToUpdate(updatedPlans);
    if (selectedPlan && selectedPlan.id === planId) {
      const updatedSelectedPlan = { ...selectedPlan, weeks: updatedPlans.find((p) => p.id === planId).weeks };
      setSelectedPlan(updatedSelectedPlan);
    }

    // Update backend
    try {
      const token = localStorage.getItem('token');
      const planToUpdate = updatedPlans.find((p) => p.id === planId);
      const response = await fetch(`${API_BASE_URL}/learning-plan/${planId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planToUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update week status');
      }
    } catch (error) {
      console.error('Error updating week status:', error);
      addToast('Failed to update week status. Please try again.', 'error');
      // Revert UI on failure
      const originalPlans = plansToUpdate.map((plan) => {
        if (plan.id === planId) {
          const revertedWeeks = plan.weeks.map((week, index) =>
            index === weekIndex ? { ...week, status: currentStatus } : week
          );
          return { ...plan, weeks: revertedWeeks };
        }
        return plan;
      });
      setPlansToUpdate(originalPlans);
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan({ ...selectedPlan, weeks: originalPlans.find((p) => p.id === planId).weeks });
      }
    }
  };

  // CSS classes (unchanged)
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
    createButton: "px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center",
    planCardContainer: "grid gap-6 md:grid-cols-2",
    planCard: "bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200",
    planCardHeader: "flex justify-between items-center mb-4",
    planTitle: "text-xl font-semibold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors duration-200",
    actionsContainer: "flex space-x-3",
    editButton: "text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200",
    deleteButton: "text-red-500 hover:text-red-700 font-medium text-sm transition-colors duration-200",
    followButton: "text-green-600 hover:text-green-800 font-medium text-sm transition-colors duration-200",
    description: "text-gray-600 mb-4 line-clamp-2",
    metaInfo: "text-gray-500 text-sm flex items-center gap-2",
    sectionDivider: "my-12 border-t border-gray-200",
    sectionTitle: "text-2xl font-bold text-gray-800 mb-6",
    breadcrumbs: "flex space-x-6 items-center mb-6",
    breadcrumbLink: "text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors duration-200 flex items-center gap-1",
    detailCard: "bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6",
    detailTitle: "text-2xl font-bold text-gray-800 mb-3",
    authorContainer: "flex items-center mb-5 text-gray-600",
    authorIcon: "w-5 h-5 mr-2 text-gray-500",
    sectionTitleInner: "text-lg font-semibold text-gray-800 mb-3",
    divider: "border-t border-gray-100 my-6",
    resourceList: "space-y-3 mb-6",
    resourceItem: "flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200",
    resourceIcon: "w-5 h-5 mr-3 text-gray-500",
    progressBar: "w-full bg-gray-200 rounded-full h-2.5 mb-4",
    progressFill: "bg-green-500 h-2.5 rounded-full",
    weekItem: "flex items-start p-4 border-l-4 border-transparent hover:bg-gray-50 transition-colors duration-200 rounded-r-lg",
    weekItemCompleted: "flex items-start p-4 border-l-4 border-green-500 bg-green-50 hover:bg-green-50 transition-colors duration-200 rounded-r-lg",
    checkbox: "mr-3 mt-1 h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-colors duration-200",
    weekTitle: "font-medium text-gray-700 mb-1",
    weekDescription: "text-gray-600 text-sm",
    shareButton: "text-gray-500 hover:text-indigo-600 transition-colors duration-200",
    likeButton: "text-gray-500 hover:text-pink-600 transition-colors duration-200",
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
      <div className={styles.wrapper}>
        {selectedPlan ? (
          <div>
            <div className={styles.breadcrumbs}>
              <button onClick={handleBackToList} className={styles.breadcrumbLink}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Plans
              </button>
              {selectedPlan.userId === currentUser.id && (
                <button onClick={() => navigate('/learning-plans/create')} className={styles.breadcrumbLink}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  New Plan
                </button>
              )}
            </div>

            <div className={styles.detailCard}>
              <div className="flex justify-between">
                <h2 className={styles.detailTitle}>{selectedPlan.title || 'Untitled'}</h2>
                <div className="flex space-x-3">
                  {selectedPlan.userId === currentUser.id ? (
                    <>
                      {/* <button onClick={() => handleEdit(selectedPlan.id)} className={styles.editButton}>
                        Edit Plan
                      </button>
                      <button onClick={() => handleDelete(selectedPlan.id)} className={styles.deleteButton}>
                        Delete
                      </button> */}
                    </>
                  ) : selectedPlan.sourcePlanId ? (
                    <button onClick={() => handleDelete(selectedPlan.id)} className={styles.deleteButton}>
                      Unfollow
                    </button>
                  ) : (
                    <button onClick={() => handleFollowPlan(selectedPlan.id)} className={styles.followButton}>
                      Follow
                    </button>
                  )}
                  <button className={styles.likeButton}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </button>
                  <button className={styles.shareButton}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      ></path>
                    </svg>
                  </button>
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
                <span>
                  {selectedPlan.sourcePlanId
                    ? `Followed by ${currentUser?.name || 'User'} (Created by @${isLoadingUsernames ? 'Loading...' : userMap[selectedPlan.sourcePlanId] || 'Unknown'})`
                    : selectedPlan.userId === currentUser.id
                    ? currentUser?.name
                    : userMap[selectedPlan.id] || 'Unknown'}
                </span>
              </div>

              <div className="mb-4">
                <h3 className={styles.sectionTitleInner}>About This Plan</h3>
                <p className="text-gray-600 leading-relaxed">{selectedPlan.description || 'No description provided for this meal plan.'}</p>
              </div>

              <div className={styles.divider}></div>

              {selectedPlan.resources && Array.isArray(selectedPlan.resources) && selectedPlan.resources.length > 0 && (
                <div className="mb-6">
                  <h3 className={styles.sectionTitleInner}>Meal Plan Resources</h3>
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

              {selectedPlan.weeks && Array.isArray(selectedPlan.weeks) && selectedPlan.weeks.length > 0 && (
                <div>
                  <div className={styles.divider}></div>

                  <div className="flex justify-between items-center mb-4">
                    <h3 className={styles.sectionTitleInner}>Weekly Plan</h3>
                    <span className="text-gray-600 font-medium">Progress: {calculateProgress(selectedPlan.weeks)}%</span>
                  </div>

                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${calculateProgress(selectedPlan.weeks)}%` }}></div>
                  </div>

                  <div className="mt-6 space-y-2">
                    {selectedPlan.weeks.map((week, index) => (
                      <div
                        key={index}
                        className={week.status === 'Completed' ? styles.weekItemCompleted : styles.weekItem}
                      >
                        {(selectedPlan.userId === currentUser.id || selectedPlan.sourcePlanId) && (
                          <input
                            type="checkbox"
                            checked={week.status === 'Completed'}
                            onChange={() => handleWeekStatusChange(selectedPlan.id, index, week.status)}
                            className={styles.checkbox}
                          />
                        )}
                        <div>
                          <h4 className={styles.weekTitle}>{week.title || `Week ${index + 1}`}</h4>
                          <p className={styles.weekDescription}>
                            {week.description || 'No description provided for this week.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* My Meal Plans Section */}
            <div>
              <div className={styles.headerContainer}>
                <h1 className={styles.headerTitle}>My Meal Plans</h1>
                <button 
  onClick={() => navigate('/learning-plans/create')} 
  className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
>
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
  Create New Plan
</button>
              </div>

              {isLoadingPlans ? (
                <div className="flex justify-center items-center py-12">
                  <div className={styles.loadingPlanSpinner}></div>
                </div>
              ) : learningPlans.length === 0 ? (
                <div className={styles.emptyContainer}>
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <p className={styles.emptyText}>No meal plans found. Create one to get started!</p>
                  <button
                    onClick={() => navigate('/learning-plans/create')}
                    className="mt-4 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition-colors duration-200 font-medium"
                  >
                    Create My First Plan
                  </button>
                </div>
              ) : (
                <div className={styles.planCardContainer}>
                  {learningPlans.map((plan) => (
                    <div key={plan.id} className={styles.planCard}>
                      <div className={styles.planCardHeader}>
                        <h2 className={styles.planTitle} onClick={() => handleViewPlan(plan)}>
                          {plan.title || 'Untitled Plan'}
                        </h2>
                        <div className={styles.actionsContainer}>
                          <button onClick={() => handleEdit(plan.id)} className={styles.editButton}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(plan.id)} className={styles.deleteButton}>
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className={styles.description}>
                        {plan.description || 'No description provided for this meal plan.'}
                      </p>

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
              )}
            </div>

            {/* Followed Meal Plans Section */}
            <div className={styles.sectionDivider}></div>
            <div>
              <h1 className={styles.sectionTitle}>Followed Meal Plans</h1>
              {isLoadingOtherPlans ? (
                <div className="flex justify-center items-center py-12">
                  <div className={styles.loadingPlanSpinner}></div>
                </div>
              ) : otherLearningPlans.length === 0 ? (
                <div className={styles.emptyContainer}>
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <p className={styles.emptyText}>No followed meal plans found.</p>
                  <button
                    onClick={() => navigate('/learning-plans')}
                    className="mt-4 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition-colors duration-200 font-medium"
                  >
                    Discover Plans to Follow
                  </button>
                </div>
              ) : (
                <div className={styles.planCardContainer}>
                  {otherLearningPlans.map((plan) => (
                    <div key={plan.id} className={styles.planCard}>
                      <div className={styles.planCardHeader}>
                        <h2 className={styles.planTitle} onClick={() => handleViewPlan(plan)}>
                          {plan.title || 'Untitled Plan'}
                        </h2>
                        <div className={styles.actionsContainer}>
                          <button onClick={() => handleDelete(plan.id)} className={styles.deleteButton}>
                            Unfollow
                          </button>
                        </div>
                      </div>

                      <p className={styles.description}>
                        {plan.description || 'No description provided for this meal plan.'}
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
                        <span>by @{isLoadingUsernames ? 'Loading...' : userMap[plan.sourcePlanId] || 'Unknown'}</span>
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningTab;