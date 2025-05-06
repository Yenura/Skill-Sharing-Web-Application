import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/apiConfig';

// Add refreshTrigger prop to cause component to refresh when meal plan updates change
const LearningStreakSection = ({ user, refreshTrigger }) => {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastLearningDate: null,
    heatmapData: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  // Include refreshTrigger in the dependency array to refetch when it changes
  useEffect(() => {
    if (user) {
      fetchStreakData();
    }
  }, [user, refreshTrigger]);

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/learning/streak/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch streak data');
      }

      const data = await response.json();
      setStreakData(data);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        <h2 className="text-lg font-semibold text-ExtraDarkColor mb-4 flex items-center">
          <i className='bx bx-flame mr-2'></i>Healthy Streak
        </h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-DarkColor"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-lg font-semibold text-ExtraDarkColor mb-4 flex items-center">
        <i className='bx bx-flame mr-2'></i>Healthy Streak
      </h2>
      
      {/* Enhanced Current Streak Display */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`text-4xl font-bold ${streakData.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'} flex items-center`}>
            {streakData.currentStreak}
            <span className="ml-2 text-sm font-medium text-gray-600">days</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-700">Current Streak</div>
            {streakData.currentStreak > 0 ? (
              <div className="text-xs text-orange-600">
                <i className='bx bxs-flame-alt mr-1'></i>
                {streakData.currentStreak > 7 ? 'On fire!' : 'Keep it up!'}
              </div>
            ) : (
              <div className="text-xs text-gray-500">Start planing your meal today!</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          {/* Streak flame animation for active streaks */}
          {streakData.currentStreak > 0 && (
            <div className="relative">
              <i className={`bx bxs-flame text-5xl ${
                streakData.currentStreak > 30 ? 'text-red-500' :
                streakData.currentStreak > 14 ? 'text-orange-500' :
                streakData.currentStreak > 7 ? 'text-amber-500' : 'text-yellow-500'
              } animate-pulse`}></i>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm">
                {streakData.currentStreak}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-indigo-600">{streakData.longestStreak}</div>
          <div className="text-sm text-gray-500">Longest Streak</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-green-600">
            {Object.keys(streakData.heatmapData || {}).length}
          </div>
          <div className="text-sm text-gray-500">Active Days</div>
        </div>
      </div>
      
      {/* Next Milestone Progress */}
      {streakData.currentStreak > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Current: {streakData.currentStreak} days</span>
            <span>
              {streakData.currentStreak < 3 ? 'Next: 3 days' :
               streakData.currentStreak < 7 ? 'Next: 7 days' :
               streakData.currentStreak < 14 ? 'Next: 14 days' : 
               streakData.currentStreak < 30 ? 'Next: 30 days' : 'Maximum milestone reached!'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${
              streakData.currentStreak >= 30 ? 'bg-green-600' :
              streakData.currentStreak >= 14 ? 'bg-blue-600' :
              streakData.currentStreak >= 7 ? 'bg-purple-600' : 'bg-orange-600'
            }`} style={{ 
              width: `${
                streakData.currentStreak >= 30 ? '100' :
                streakData.currentStreak >= 14 ? Math.min(100, (streakData.currentStreak / 30) * 100) :
                streakData.currentStreak >= 7 ? Math.min(100, (streakData.currentStreak / 14) * 100) :
                streakData.currentStreak >= 3 ? Math.min(100, (streakData.currentStreak / 7) * 100) :
                Math.min(100, (streakData.currentStreak / 3) * 100)
              }%` 
            }}></div>
          </div>
        </div>
      )}
      
      {streakData.lastLearningDate && (
        <div className="mb-4 text-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
          Last planing activity: <span className="font-medium">{new Date(streakData.lastLearningDate).toLocaleDateString()}</span>
        </div>
      )}
      
      {/* Improved Activity Heatmap */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <i className='bx bx-calendar-check mr-1'></i> Planing Activity
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {Object.keys(streakData.heatmapData || {}).length > 0 ? (
            <div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {Object.entries(streakData.heatmapData)
                  .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                  .slice(-30)
                  .map(([date, count]) => {
                    // Format date for tooltip
                    const formattedDate = new Date(date).toLocaleDateString(undefined, { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric'
                    });
                    
                    return (
                      <div 
                        key={date} 
                        className={`w-6 h-6 rounded-sm border border-gray-200 flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                          count > 3 ? 'bg-green-700 hover:bg-green-800' : 
                          count > 2 ? 'bg-green-600 hover:bg-green-700' : 
                          count > 1 ? 'bg-green-500 hover:bg-green-600' : 
                          'bg-green-400 hover:bg-green-500'
                        }`}
                        title={`${formattedDate}: ${count} learning ${count === 1 ? 'update' : 'updates'}`}
                      >
                        {count > 1 && (
                          <span className="text-[10px] text-white font-bold">{count}</span>
                        )}
                      </div>
                    );
                  })
                }
              </div>
              <div className="mt-3 flex justify-center items-center text-xs text-gray-500">
                <div className="flex items-center gap-1 mr-3">
                  <div className="w-3 h-3 bg-green-400 border border-gray-200 rounded-sm"></div>
                  <span>1</span>
                </div>
                <div className="flex items-center gap-1 mr-3">
                  <div className="w-3 h-3 bg-green-500 border border-gray-200 rounded-sm"></div>
                  <span>2</span>
                </div>
                <div className="flex items-center gap-1 mr-3">
                  <div className="w-3 h-3 bg-green-600 border border-gray-200 rounded-sm"></div>
                  <span>3</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-700 border border-gray-200 rounded-sm"></div>
                  <span>4+</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4 text-sm">
              <i className='bx bx-calendar-x text-3xl mb-2 text-gray-400'></i>
              <p>No meal activity recorded yet</p>
              <p className="text-xs mt-1">Start meal plan to build your streak!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Streak Badges - Keep this section */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Streak Achievements</h3>
        <div className="flex space-x-3 justify-center">
          <div className={`text-center p-2 ${streakData.currentStreak >= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
            <i className='bx bxs-flame text-2xl'></i>
            <div className="text-xs mt-1">3 Days</div>
          </div>
          <div className={`text-center p-2 ${streakData.longestStreak >= 7 ? 'text-purple-500' : 'text-gray-400'}`}>
            <i className='bx bxs-flame text-2xl'></i>
            <div className="text-xs mt-1">7 Days</div>
          </div>
          <div className={`text-center p-2 ${streakData.longestStreak >= 14 ? 'text-blue-500' : 'text-gray-400'}`}>
            <i className='bx bxs-flame text-2xl'></i>
            <div className="text-xs mt-1">14 Days</div>
          </div>
          <div className={`text-center p-2 ${streakData.longestStreak >= 30 ? 'text-green-500' : 'text-gray-400'}`}>
            <i className='bx bxs-flame text-2xl'></i>
            <div className="text-xs mt-1">30 Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStreakSection;
