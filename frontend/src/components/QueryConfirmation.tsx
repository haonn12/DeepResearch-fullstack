import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit3, Check, X, Plus, Trash2 } from 'lucide-react';

interface QueryConfirmationProps {
  queries: string[];
  onConfirm: (action: 'confirm' | 'modify' | 'cancel', queries?: string[]) => void;
  isVisible: boolean;
}

export const QueryConfirmation: React.FC<QueryConfirmationProps> = ({
  queries,
  onConfirm,
  isVisible
}) => {
  const [editedQueries, setEditedQueries] = useState<string[]>([...queries]);
  const [isEditing, setIsEditing] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleAddQuery = () => {
    setEditedQueries([...editedQueries, '']);
  };

  const handleRemoveQuery = (index: number) => {
    setEditedQueries(editedQueries.filter((_, i) => i !== index));
  };

  const handleQueryChange = (index: number, value: string) => {
    const newQueries = [...editedQueries];
    newQueries[index] = value;
    setEditedQueries(newQueries);
  };

  const handleConfirm = () => {
    onConfirm('confirm');
  };

  const handleModify = () => {
    const validQueries = editedQueries.filter(q => q.trim() !== '');
    if (validQueries.length === 0) {
      alert('请至少保留一个查询');
      return;
    }
    onConfirm('modify', validQueries);
  };

  const handleCancel = () => {
    onConfirm('cancel');
  };

  const hasChanges = JSON.stringify(queries) !== JSON.stringify(editedQueries.filter(q => q.trim() !== ''));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 bg-white shadow-2xl">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-600" />
            确认搜索查询
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            AI 已为您生成以下搜索查询，请确认或修改后继续
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">生成的搜索查询：</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs"
                >
                  {isEditing ? '完成编辑' : '编辑查询'}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddQuery}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    添加
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {isEditing ? (
                editedQueries.map((query, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                    <Input
                      value={query}
                      onChange={(e) => handleQueryChange(index, e.target.value)}
                      className="flex-1 text-sm"
                      placeholder="请输入搜索查询..."
                    />
                    {editedQueries.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuery(index)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                queries.map((query, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <span className="text-sm text-gray-700 flex-1 p-2 bg-gray-50 rounded">
                      {query}
                    </span>
                  </div>
                ))
              )}
            </div>

            {isEditing && hasChanges && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  ⚠️ 您已修改了查询，点击"确认修改"来使用新的查询进行搜索
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              取消
            </Button>
            
            {isEditing && hasChanges ? (
              <Button
                onClick={handleModify}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                确认修改
              </Button>
            ) : (
              <Button
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                确认查询
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 