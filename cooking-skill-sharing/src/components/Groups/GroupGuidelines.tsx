import React from 'react';
import ReactMarkdown from 'react-markdown';

interface GroupGuidelinesProps {
  guidelines: string;
}

export default function GroupGuidelines({ guidelines }: GroupGuidelinesProps) {
  return (
    <div className="prose prose-orange max-w-none">
      {guidelines ? (
        <ReactMarkdown>{guidelines}</ReactMarkdown>
      ) : (
        <div className="text-center p-8">
          <p className="text-gray-500">No guidelines have been set for this group.</p>
        </div>
      )}
    </div>
  );
}
