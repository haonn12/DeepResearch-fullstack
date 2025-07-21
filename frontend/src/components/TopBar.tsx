import React from 'react';
import { MessageSquare } from 'lucide-react';

interface TopBarProps {
  conversationTitle?: string;
  isLoading?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ conversationTitle, isLoading }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h1 className="text-lg font-semibold text-gray-900">
          {conversationTitle || 'DeepSearch Agent'}
        </h1>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>思考中...</span>
          </div>
        )}
      </div>
    </div>
  );
};