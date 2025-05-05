import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface Member {
  id: number;
  username: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'banned';
  contributions: number;
  customFields: Record<string, any>;
}

export const CommunityMembers = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Member['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Member['status']>('all');
  const [sortBy, setSortBy] = useState<'joined' | 'active' | 'contributions'>('joined');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  useEffect(() => {
    try {
      const response = await fetch(`/api/communities/${id}/members`);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      setMembers(data);
    } catch (error) {
    setMembers(data);
      // const response = await api.get(`/communities/${id}/members`);
      // setMembers(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load community members.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMemberRole = async (memberId: number, newRole: Member['role']) => {
    try {
      // TODO: Implement API call to update member role
      await fetch(`/api/communities/${id}/members/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });
      setMembers((prev: Member[]) =>
        prev.map((member: Member) =>
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );

      toast({
        title: 'Success',
        description: 'Member role updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update member role.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateMemberStatus = async (memberId: number, newStatus: Member['status']) => {
    try {
      await fetch(`/api/communities/${id}/members/${memberId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      // await api.put(`/communities/${id}/members/${memberId}/status`, {
      setMembers((prev: Member[]) =>
        prev.map((member: Member) =>
          member.id === memberId ? { ...member, status: newStatus } : member
        )
      );
          member.id === memberId ? { ...member, status: newStatus } : member
        )
      );

      toast({
        title: 'Success',
        description: 'Member status updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update member status.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMembers = async () => {
    try {
      await fetch(`/api/communities/${id}/members`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberIds: selectedMembers,
      }),
      prev.filter((member: Member) => !selectedMembers.includes(member.id))

      setMembers((prev) =>
      prev.filter((member) => !selectedMembers.includes(member.id))
      );
      setSelectedMembers([]);

      toast({
      title: 'Success',
      description: 'Selected members removed successfully.',
      });
    } catch (error) {
      toast({
      title: 'Error',
      description: 'Failed to remove selected members.',
      variant: 'destructive',
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map((member) => member.id));
    }
  };

  const handleSelectMember = (memberId: number) => {
    setSelectedMembers((prev: number[]) =>
      prev.includes(memberId)
        ? prev.filter((id: number) => id !== memberId)
        : [...prev, memberId]
    );
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
    .filter((member: Member) => {

  const filteredMembers = members
    .filter((member) => {
      const matchesSearch =
        member.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    .sort((a: Member, b: Member) => {
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'joined':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
        case 'active':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        case 'contributions':
          return b.contributions - a.contributions;
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
        <h1 className="text-2xl font-bold">Community Members</h1>
        {selectedMembers.length > 0 && (
          <Button variant="destructive" onClick={handleRemoveMembers}>
            Remove Selected ({selectedMembers.length})
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <Input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="member">Member</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="joined">Joined Date</option>
          <option value="active">Last Active</option>
          <option value="contributions">Contributions</option>
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
                    selectedMembers.length === filteredMembers.length &&
                    filteredMembers.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contributions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => handleSelectMember(member.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleUpdateMemberRole(
                        member.id,
                        e.target.value as Member['role']
                      )
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={member.status}
                    onChange={(e) =>
                      handleUpdateMemberStatus(
                        member.id,
                        e.target.value as Member['status']
                      )
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(member.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(member.lastActive).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.contributions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="destructive"
                    onClick={() => handleSelectMember(member.id)}
                  >
                    Remove
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
