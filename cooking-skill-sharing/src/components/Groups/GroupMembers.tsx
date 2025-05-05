import { useState } from 'react'
import Image from 'next/image'
import { Search, Shield, MoreHorizontal, UserMinus, Crown } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface GroupMember {
  id: string
  username: string
  profilePicture?: string
  joinedAt: string
  isAdmin: boolean
}

interface GroupMembersProps {
  members: GroupMember[]
  isAdmin: boolean
}

export default function GroupMembers({ members, isAdmin }: GroupMembersProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [showActions, setShowActions] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  
  const filteredMembers = members.filter(member => 
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/groups/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove member');
      }

      toast({
        title: "Member removed",
        description: "The member has been removed from the group.",
        variant: "default",
      });
      
      setConfirmRemove(null);
      // Refresh the members list
      window.location.reload();
    } catch (err: any) {
      console.error('Error removing member:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  const handlePromoteToAdmin = async (memberId: string) => {
    try {
      const response = await fetch(`/api/groups/members/${memberId}/promote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to promote member');
      }

      toast({
        title: "Member promoted",
        description: "The member has been promoted to admin.",
        variant: "default",
      });
      
      setShowActions(null);
      // Refresh the members list
      window.location.reload();
    } catch (err: any) {
      console.error('Error promoting member:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to promote member. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Members ({members.length})</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Member
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Joined
              </th>
              {isAdmin && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {member.profilePicture ? (
                          <Image
                            src={member.profilePicture}
                            alt={member.username}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {member.isAdmin ? (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Member
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(member.joinedAt)}
                  </td>
                  {isAdmin && (
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === member.id ? null : member.id)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        
                        {showActions === member.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                            {!member.isAdmin && (
                              <button
                                onClick={() => handlePromoteToAdmin(member.id)}
                                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                                Promote to Admin
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setShowActions(null)
                                setConfirmRemove(member.id)
                              }}
                              className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove from Group
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Confirmation Modal */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Remove Member</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to remove this member from the group? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveMember(confirmRemove)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
