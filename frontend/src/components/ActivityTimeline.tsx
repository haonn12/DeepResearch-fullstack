import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Activity,
  Info,
  Search,
  TextSearch,
  Brain,
  Pen,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Shield,
  Target,
  Sparkles,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { StepDetailModal } from "./StepDetailModal";

export interface ProcessedEvent {
  id: string;
  title: string;
  data: string | string[];
  timestamp: Date;
  status: 'pending' | 'completed' | 'error';
  rawData?: any;
}

interface ActivityTimelineProps {
  events: ProcessedEvent[];
  isLoading: boolean;
}

export function ActivityTimeline({ events, isLoading }: ActivityTimelineProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: ProcessedEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };
  const getEventIcon = (title: string, index: number) => {
    if (index === 0 && isLoading && events.length === 0) {
      return <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />;
    }
    if (title.toLowerCase().includes("generating") || title.includes("生成搜索查询")) {
      return <TextSearch className="h-4 w-4 text-gray-500" />;
    } else if (title.toLowerCase().includes("thinking") || title.includes("思考")) {
      return <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />;
    } else if (title.toLowerCase().includes("reflection") || title.includes("反思")) {
      return <Brain className="h-4 w-4 text-gray-500" />;
    } else if (title.toLowerCase().includes("research") || title.includes("网络研究") || title.includes("深度研究")) {
      return <Search className="h-4 w-4 text-gray-500" />;
    } else if (title.includes("内容质量评估")) {
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    } else if (title.includes("事实验证") || title.includes("数据验证")) {
      return <Shield className="h-4 w-4 text-green-500" />;
    } else if (title.includes("相关性评估")) {
      return <Target className="h-4 w-4 text-purple-500" />;
    } else if (title.includes("摘要优化") || title.includes("内容总结")) {
      return <Sparkles className="h-4 w-4 text-yellow-500" />;
    } else if (title.includes("生成验证报告")) {
      return <FileText className="h-4 w-4 text-indigo-500" />;
    } else if (title.toLowerCase().includes("finalizing") || title.includes("生成最终答案")) {
      return <Pen className="h-4 w-4 text-gray-500" />;
    } else if (title.includes("搜索处理")) {
      return <Search className="h-4 w-4 text-blue-500" />;
    } else if (title.includes("数据分析")) {
      return <Brain className="h-4 w-4 text-purple-500" />;
    } else if (title.includes("数据处理")) {
      return <Activity className="h-4 w-4 text-orange-500" />;
    } else if (title.includes("信息提取")) {
      return <TextSearch className="h-4 w-4 text-green-500" />;
    } else if (title.includes("处理中")) {
      return <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />;
    } else if (title.includes("等待用户确认")) {
      return <Info className="h-4 w-4 text-yellow-500" />;
    }
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  useEffect(() => {
    if (!isLoading && events.length !== 0) {
      setIsCollapsed(true);
    }
  }, [isLoading, events]);

  return (
    <Card className="border border-gray-200 rounded-lg bg-gray-50 max-h-[500px] relative w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between">
          <div
            className="flex items-center justify-start text-sm w-full cursor-pointer gap-2 text-gray-700"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            研究进程
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronUp className="h-4 w-4 mr-2" />
            )}
          </div>
        </CardDescription>
      </CardHeader>
      {!isCollapsed && (
        <ScrollArea className="max-h-[400px] overflow-y-auto">
          <CardContent className="pt-0">
            {isLoading && events.length === 0 && (
              <div className="relative pl-8 pb-4">
                <div className="absolute left-3 top-3.5 h-full w-0.5 bg-gray-300" />
                <div className="absolute left-0.5 top-2 h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center ring-4 ring-gray-50">
                  <Loader2 className="h-3 w-3 text-gray-500 animate-spin" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    搜索中...
                  </p>
                </div>
              </div>
            )}
            {events.length > 0 ? (
              <div className="space-y-0">
                {events.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="relative pl-8 pb-4 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    {index < events.length - 1 ||
                    (isLoading && index === events.length - 1) ? (
                      <div className="absolute left-3 top-3.5 h-full w-0.5 bg-gray-300" />
                    ) : null}
                    <div className="absolute left-0.5 top-2 h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center ring-4 ring-gray-50">
                      {getEventIcon(event.title, index)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-700 font-medium mb-0.5">
                          {event.title}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {event.status === 'completed' ? '已完成' : event.status === 'pending' ? '进行中' : '错误'}
                        </Badge>
                        <span className="text-xs text-gray-400">点击查看详情</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {typeof event.data === "string"
                          ? event.data
                          : Array.isArray(event.data)
                          ? (event.data as string[]).join(", ")
                          : JSON.stringify(event.data)}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && events.length > 0 && (
                  <div className="relative pl-8 pb-4">
                    <div className="absolute left-0.5 top-2 h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center ring-4 ring-gray-50">
                      <Loader2 className="h-3 w-3 text-gray-500 animate-spin" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        搜索中...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : !isLoading ? ( // Only show "No activity" if not loading and no events
              <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-10">
                <Info className="h-6 w-6 mb-3" />
                <p className="text-sm">暂无活动记录。</p>
                <p className="text-xs text-gray-400 mt-1">
                  时间线将在处理过程中更新。
                </p>
              </div>
            ) : null}
          </CardContent>
        </ScrollArea>
      )}
      {selectedEvent && (
        <StepDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
        />
      )}
    </Card>
  );
}
