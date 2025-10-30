import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Code, Globe, Settings } from 'lucide-react';

interface ExportReportProps {
  reportContent: string;
  reportTitle: string;
  isVisible: boolean;
  onClose: () => void;
}

interface ExportOptions {
  format: 'markdown' | 'html' | 'json';
  includeSources: boolean;
  includeMetadata: boolean;
  customTitle: string;
}

export const ExportReport: React.FC<ExportReportProps> = ({
  reportContent,
  reportTitle,
  isVisible,
  onClose
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'markdown',
    includeSources: true,
    includeMetadata: true,
    customTitle: reportTitle
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleExport = async () => {
    if (!reportContent.trim()) {
      alert('没有可导出的报告内容');
      return;
    }

    setIsExporting(true);
    
    try {
      const response = await fetch('http://localhost:2024/export-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_content: reportContent,
          report_title: exportOptions.customTitle || reportTitle,
          format: exportOptions.format,
          include_sources: exportOptions.includeSources,
          include_metadata: exportOptions.includeMetadata
        })
      });

      if (!response.ok) {
        throw new Error(`导出失败: ${response.statusText}`);
      }

      // 获取文件名
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `report_${Date.now()}.${exportOptions.format}`;

      // 下载文件
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onClose();
    } catch (error) {
      console.error('导出失败:', error);
      alert(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'markdown':
        return <FileText className="h-4 w-4" />;
      case 'html':
        return <Globe className="h-4 w-4" />;
      case 'json':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'markdown':
        return 'Markdown格式，适合在GitHub、Notion等平台查看';
      case 'html':
        return 'HTML格式，可在浏览器中直接打开查看';
      case 'json':
        return 'JSON格式，适合程序处理和数据分析';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 bg-white shadow-2xl">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            导出研究报告
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            选择导出格式和选项，将报告保存到本地
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* 报告标题 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">报告标题</label>
              <Input
                value={exportOptions.customTitle}
                onChange={(e) => setExportOptions(prev => ({ ...prev, customTitle: e.target.value }))}
                placeholder="请输入报告标题..."
                className="w-full"
              />
            </div>

            {/* 导出格式 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">导出格式</label>
              <Select
                value={exportOptions.format}
                onValueChange={(value: 'markdown' | 'html' | 'json') => 
                  setExportOptions(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="markdown">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Markdown (.md)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="html">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>HTML (.html)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span>JSON (.json)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {getFormatDescription(exportOptions.format)}
              </p>
            </div>

            {/* 导出选项 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSources"
                  checked={exportOptions.includeSources}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeSources: !!checked }))
                  }
                />
                <label htmlFor="includeSources" className="text-sm text-gray-700">
                  包含引用来源
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeMetadata: !!checked }))
                  }
                />
                <label htmlFor="includeMetadata" className="text-sm text-gray-700">
                  包含报告元数据（生成时间、格式等）
                </label>
              </div>
            </div>

            {/* 预览信息 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">导出预览</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>格式: {exportOptions.format.toUpperCase()}</div>
                <div>标题: {exportOptions.customTitle || reportTitle}</div>
                <div>包含来源: {exportOptions.includeSources ? '是' : '否'}</div>
                <div>包含元数据: {exportOptions.includeMetadata ? '是' : '否'}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              取消
            </Button>
            
            <Button
              onClick={handleExport}
              disabled={isExporting || !reportContent.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  导出中...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  导出报告
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

