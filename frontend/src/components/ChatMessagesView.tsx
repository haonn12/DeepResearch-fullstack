import type React from "react";
import type { Message } from "@langchain/langgraph-sdk";
import { Loader2, Copy, CopyCheck } from "lucide-react";
import { InputForm } from "@/components/InputForm";
import { Button } from "@/components/ui/button";
import { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ActivityTimeline,
  ProcessedEvent,
} from "@/components/ActivityTimeline"; // Assuming ActivityTimeline is in the same dir or adjust path

// Markdown component props type from former ReportView
type MdComponentProps = {
  className?: string;
  children?: ReactNode;
  [key: string]: any;
};

// Markdown components (from former ReportView.tsx)
const mdComponents = {
  h1: ({ className, children, ...props }: MdComponentProps) => (
    <h1 className={cn("text-2xl font-bold mt-4 mb-2", className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ className, children, ...props }: MdComponentProps) => (
    <h2 className={cn("text-xl font-bold mt-3 mb-2", className)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }: MdComponentProps) => (
    <h3 className={cn("text-lg font-bold mt-3 mb-1", className)} {...props}>
      {children}
    </h3>
  ),
  p: ({ className, children, ...props }: MdComponentProps) => (
    <p className={cn("mb-3 leading-7", className)} {...props}>
      {children}
    </p>
  ),
  a: ({ className, children, href, ...props }: MdComponentProps) => {
    // 检查是否是引用链接（包含完整URL）
    const isReference = href && (href.startsWith('http') || href.startsWith('https'));
    
    if (isReference) {
      return (
        <span className="inline-flex items-center">
          <Badge className="text-xs mx-1 px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm">
            <a
              className={cn("text-blue-700 hover:text-blue-800 text-xs font-medium flex items-center gap-1", className)}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
              <span className="text-blue-500">🔗</span>
            </a>
          </Badge>
        </span>
      );
    }
    
    // 普通链接
    return (
      <a
        className={cn("text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 font-medium transition-colors", className)}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  ul: ({ className, children, ...props }: MdComponentProps) => (
    <ul className={cn("list-disc pl-6 mb-3", className)} {...props}>
      {children}
    </ul>
  ),
  ol: ({ className, children, ...props }: MdComponentProps) => (
    <ol className={cn("list-decimal pl-6 mb-3", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ className, children, ...props }: MdComponentProps) => (
    <li className={cn("mb-1", className)} {...props}>
      {children}
    </li>
  ),
  blockquote: ({ className, children, ...props }: MdComponentProps) => (
    <blockquote
      className={cn(
        "border-l-4 border-gray-300 pl-4 italic my-3 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }: MdComponentProps) => (
    <code
      className={cn(
        "bg-gray-100 rounded px-1 py-0.5 font-mono text-xs",
        className
      )}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ className, children, ...props }: MdComponentProps) => (
    <pre
      className={cn(
        "bg-gray-100 p-3 rounded-lg overflow-x-auto font-mono text-xs my-3",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  hr: ({ className, ...props }: MdComponentProps) => (
    <hr className={cn("border-gray-300 my-4", className)} {...props} />
  ),
  table: ({ className, children, ...props }: MdComponentProps) => (
    <div className="my-3 overflow-x-auto">
      <table className={cn("border-collapse w-full", className)} {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ className, children, ...props }: MdComponentProps) => (
    <th
      className={cn(
        "border border-gray-300 px-3 py-2 text-left font-bold",
        className
      )}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ className, children, ...props }: MdComponentProps) => (
    <td
      className={cn("border border-gray-300 px-3 py-2", className)}
      {...props}
    >
      {children}
    </td>
  ),
};

// Props for HumanMessageBubble
interface HumanMessageBubbleProps {
  message: Message;
  mdComponents: typeof mdComponents;
}

// HumanMessageBubble Component
const HumanMessageBubble: React.FC<HumanMessageBubbleProps> = ({
  message,
  mdComponents,
}) => {
  return (
    <div
      className={`text-gray-700 rounded-3xl break-words min-h-7 bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border border-gray-200 max-w-[100%] sm:max-w-[90%] px-4 pt-3 rounded-br-lg`}
    >
      <ReactMarkdown components={mdComponents}>
        {typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.content)}
      </ReactMarkdown>
    </div>
  );
};

// Props for AiMessageBubble
interface AiMessageBubbleProps {
  message: Message;
  historicalActivity: ProcessedEvent[] | undefined;
  mdComponents: typeof mdComponents;
  handleCopy: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
}

// AiMessageBubble Component
const AiMessageBubble: React.FC<AiMessageBubbleProps> = ({
  message,
  historicalActivity,
  mdComponents,
  handleCopy,
  copiedMessageId,
}) => {
  // 只显示历史活动，不再显示实时活动
  const shouldShowActivity = historicalActivity && historicalActivity.length > 0;

  // 提取引用来源
  const extractSources = () => {
    if (!historicalActivity) return [];
    
    const sources: any[] = [];
    historicalActivity.forEach(event => {
      if (event.rawData?.web_research?.sources_gathered) {
        sources.push(...event.rawData.web_research.sources_gathered);
      }
      if (event.rawData?.finalize_answer?.sources_gathered) {
        sources.push(...event.rawData.finalize_answer.sources_gathered);
      }
    });
    
    // 去重
    const uniqueSources = sources.filter((source, index, self) => 
      index === self.findIndex(s => s.url === source.url || s.value === source.value)
    );
    
    return uniqueSources;
  };

  const sources = extractSources();

  return (
    <div className={`relative break-words flex flex-col w-full`}>
      {shouldShowActivity && (
        <div className="mb-3 border-b border-gray-200 pb-3 text-xs w-full">
          <ActivityTimeline
            events={historicalActivity}
            isLoading={false}
          />
        </div>
      )}
      <ReactMarkdown components={mdComponents}>
        {typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.content)}
      </ReactMarkdown>
      
      {/* 引用来源部分 */}
      {sources.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-full"></div>
            <h4 className="text-base font-semibold text-gray-800">📚 引用来源</h4>
            <Badge variant="outline" className="text-xs bg-white border-blue-200 text-blue-700">
              {sources.length} 个来源
            </Badge>
          </div>
          <div className="grid gap-3">
            {sources.map((source, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <a 
                    href={source.url || source.value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm underline decoration-2 underline-offset-2 transition-colors block mb-1"
                  >
                    {source.title || source.label || '未命名来源'}
                  </a>
                  {source.title && source.title !== (source.url || source.value) && (
                    <p className="text-xs text-gray-600 break-all leading-relaxed">{source.url || source.value}</p>
                  )}
                  {source.content && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{source.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Button
        variant="default"
        className={`cursor-pointer bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 self-end mt-2 ${
          message.content && (typeof message.content === "string" ? message.content.length > 0 : true) ? "visible" : "hidden"
        }`}
        onClick={() =>
          handleCopy(
            typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content),
            message.id!
          )
        }
      >
        {copiedMessageId === message.id ? "已复制" : "复制"}
        {copiedMessageId === message.id ? <CopyCheck /> : <Copy />}
      </Button>
    </div>
  );
};

interface ChatMessagesViewProps {
  messages: Message[];
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: (inputValue: string, effort: string, model: string) => void;
  onCancel: () => void;
  liveActivityEvents: ProcessedEvent[];
  historicalActivities: Record<string, ProcessedEvent[]>;
}

export function ChatMessagesView({
  messages,
  isLoading,
  scrollAreaRef,
  onSubmit,
  onCancel,
  liveActivityEvents,
  historicalActivities,
}: ChatMessagesViewProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const handleCopy = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  
  return (
    <div className="flex flex-col h-full chat-messages-container overflow-hidden">
      {/* 消息显示区域 - 原生滚动 */}
      <div 
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden native-scrollbar chat-scroll-area"
        ref={scrollAreaRef}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(115, 115, 115, 0.4) rgba(243, 244, 246, 0.1)',
        }}
      >
        <div className="p-4 md:p-6 space-y-2 w-full">
          {/* 统一的实时ActivityTimeline - 只在加载时显示在顶部 */}
          {isLoading && liveActivityEvents.length > 0 && (
            <div className="mb-4 w-full">
              <ActivityTimeline
                events={liveActivityEvents}
                isLoading={true}
              />
            </div>
          )}
          
          {messages.map((message, index) => {

            return (
              <div key={message.id || `msg-${index}`} className="space-y-3 w-full">
                <div
                  className={`flex items-start gap-3 w-full ${
                    message.type === "human" ? "justify-end" : ""
                  }`}
                >
                  {message.type === "human" ? (
                    <HumanMessageBubble
                      message={message}
                      mdComponents={mdComponents}
                    />
                  ) : (
                    <AiMessageBubble
                        message={message}
                        historicalActivity={historicalActivities[message.id!]}
                        mdComponents={mdComponents}
                        handleCopy={handleCopy}
                        copiedMessageId={copiedMessageId}
                      />
                  )}
                </div>
              </div>
            );
          })}
          
          {/* 简化的加载状态 - 只在没有消息或最后是人类消息时显示 */}
          {isLoading && 
            (messages.length === 0 || messages[messages.length - 1].type === "human") && 
            liveActivityEvents.length === 0 && (
              <div className="flex items-start gap-3 mt-3">
                <div className="relative group max-w-[85%] md:max-w-[80%] rounded-xl p-3 shadow-sm break-words bg-gray-100 text-gray-900 rounded-bl-none w-full min-h-[56px]">
                  <div className="flex items-center justify-start h-full">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500 mr-2" />
                    <span>处理中...</span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
      
      {/* 输入框区域 - 固定在底部 */}
      <div className="flex-shrink-0 input-form-container sticky bottom-0 z-10">
        <InputForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
