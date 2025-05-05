import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Mock data - replace with API call
const comments = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    },
    content: 'This recipe looks amazing! Can't wait to try it.',
    createdAt: '2024-02-20T10:00:00Z',
    likes: 12,
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    content: 'I made this last night and it was delicious! The crust was perfect.',
    createdAt: '2024-02-20T11:30:00Z',
    likes: 8,
  },
]

const schema = yup.object().shape({
  comment: yup.string().required('Please enter a comment').min(3, 'Comment must be at least 3 characters'),
})

type CommentFormData = {
  comment: string
}

export default function Comments() {
  const [localComments, setLocalComments] = useState(comments)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: CommentFormData) => {
    // In a real app, this would be an API call
    const newComment = {
      id: String(localComments.length + 1),
      user: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      },
      content: data.comment,
      createdAt: new Date().toISOString(),
      likes: 0,
    }
    setLocalComments([newComment, ...localComments])
    reset()
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Your avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="flex-grow">
            <textarea
              {...register('comment')}
              placeholder="Add a comment..."
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              rows={3}
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-500">{errors.comment.message}</p>
            )}
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {localComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <Image
                src={comment.user.avatar}
                alt={comment.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex-grow">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">{comment.user.name}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{comment.likes}</span>
                </button>
                <button className="text-sm text-gray-500 hover:text-blue-500">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 