import React from 'react';
<<<<<<< HEAD
import { MessageSquare, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
=======
import { MessageSquare } from 'lucide-react';
>>>>>>> 402cf6d6338a7494de78bf81d7428bf9e7f09611

interface TopBarProps {
  conversationTitle?: string;
  isLoading?: boolean;
<<<<<<< HEAD
  onExportReport?: () => void;
  canExport?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  conversationTitle, 
  isLoading, 
  onExportReport, 
  canExport = false 
}) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
=======
}

export const TopBar: React.FC<TopBarProps> = ({ conversationTitle, isLoading }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
>>>>>>> 402cf6d6338a7494de78bf81d7428bf9e7f09611
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
<<<<<<< HEAD
      
      {canExport && onExportReport && (
        <Button
          onClick={onExportReport}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          导出报告
        </Button>
      )}
=======
>>>>>>> 402cf6d6338a7494de78bf81d7428bf9e7f09611
    </div>
  );
};