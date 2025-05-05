import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'online' | 'in-person' | 'hybrid';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxParticipants: number;
  currentParticipants: number;
  organizer: {
    id: number;
    username: string;
    avatar: string;
  };
  tags: string[];
  customFields: Record<string, any>;
}

export const CommunityEvents = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | Event['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Event['status']>('all');
  const [sortBy, setSortBy] = useState<'date' | 'participants'>('date');
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    type: 'online' as Event['type'],
    maxParticipants: 0,
    tags: [] as string[],
    customFields: {} as Record<string, any>,
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [id]);

  const fetchEvents = async () => {
    try {
      // TODO: Implement API call to fetch community events
      // const response = await api.get(`/communities/${id}/events`);
      // setEvents(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load community events.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      // TODO: Implement API call to create event
      // const response = await api.post(`/communities/${id}/events`, newEvent);
      // setEvents((prev) => [response.data, ...prev]);

      setIsCreatingEvent(false);
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        type: 'online',
        maxParticipants: 0,
        tags: [],
        customFields: {},
      });

      toast({
        title: 'Success',
        description: 'Event created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create event.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateEvent = async (
    eventId: number,
    updates: Partial<Omit<Event, 'id' | 'organizer' | 'currentParticipants'>>
  ) => {
    try {
      // TODO: Implement API call to update event
      // await api.put(`/communities/${id}/events/${eventId}`, updates);

      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, ...updates } : event
        )
      );

      toast({
        title: 'Success',
        description: 'Event updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update event.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEvents = async () => {
    try {
      // TODO: Implement API call to delete selected events
      // await api.delete(`/communities/${id}/events`, {
      //   eventIds: selectedEvents,
      // });

      setEvents((prev) =>
        prev.filter((event) => !selectedEvents.includes(event.id))
      );
      setSelectedEvents([]);

      toast({
        title: 'Success',
        description: 'Selected events deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete selected events.',
        variant: 'destructive',
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map((event) => event.id));
    }
  };

  const handleSelectEvent = (eventId: number) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newEvent.tags.includes(newTag.trim())) {
      setNewEvent((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewEvent((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'participants':
          return b.currentParticipants - a.currentParticipants;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Community Events</h1>
        <div className="space-x-4">
          {selectedEvents.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteEvents}>
              Delete Selected ({selectedEvents.length})
            </Button>
          )}
          <Button onClick={() => setIsCreatingEvent(true)}>Create Event</Button>
        </div>
      </div>

      {isCreatingEvent && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Event</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                type="text"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  type="datetime-local"
                  value={newEvent.startDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="datetime-local"
                  value={newEvent.endDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                type="text"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newEvent.type}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    type: e.target.value as Event['type'],
                  })
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full"
              >
                <option value="online">Online</option>
                <option value="in-person">In Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Participants
              </label>
              <Input
                type="number"
                value={newEvent.maxParticipants}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    maxParticipants: parseInt(e.target.value),
                  })
                }
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                />
                <Button onClick={handleAddTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newEvent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove tag</span>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsCreatingEvent(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateEvent}>Create Event</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <Input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="online">Online</option>
          <option value="in-person">In Person</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="date">Date</option>
          <option value="participants">Participants</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedEvents.length === filteredEvents.length &&
                    filteredEvents.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organizer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => handleSelectEvent(event.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {event.description}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={event.organizer.avatar}
                      alt={event.organizer.username}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.organizer.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Start: {new Date(event.startDate).toLocaleString()}</div>
                  <div>End: {new Date(event.endDate).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={event.type}
                    onChange={(e) =>
                      handleUpdateEvent(event.id, {
                        type: e.target.value as Event['type'],
                      })
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="online">Online</option>
                    <option value="in-person">In Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={event.status}
                    onChange={(e) =>
                      handleUpdateEvent(event.id, {
                        status: e.target.value as Event['status'],
                      })
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.currentParticipants} / {event.maxParticipants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="destructive"
                    onClick={() => handleSelectEvent(event.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 