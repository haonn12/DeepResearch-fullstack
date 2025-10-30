import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Trash2, Search, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date | string | number;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date | string | number) => {
    let dateObj: Date;
    
    // 确保转换为Date对象
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      // 如果无法解析，返回默认值
      return '未知时间';
    }
    
    // 检查Date对象是否有效
    if (isNaN(dateObj.getTime())) {
      return '未知时间';
    }
    
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return dateObj.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return dateObj.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-96'} bg-gray-50 border-r border-gray-200 flex flex-col h-screen transition-all duration-300`}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <Button
          onClick={onToggleCollapse}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100 text-gray-600"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
        {!isCollapsed && (
          <Button
            onClick={onNewConversation}
            className="flex-1 ml-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center gap-2 transition-colors px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            新建对话
          </Button>
        )}
      </div>
      
      {/* 收起状态下的新建对话按钮 */}
      {isCollapsed && (
        <div className="p-3 border-b border-gray-200">
          <Button
            onClick={onNewConversation}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center transition-colors p-2"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索对话..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-2">
          {!isCollapsed && (
            filteredConversations.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchTerm ? '未找到匹配的对话' : '暂无对话历史'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                    currentConversationId === conversation.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate mb-1">
                        {conversation.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      <span className="text-xs text-gray-400">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-gray-400 hover:text-red-500 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )
          )}
          </div>
        </ScrollArea>
      </div>

    </div>
  );
};