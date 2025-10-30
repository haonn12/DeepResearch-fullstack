import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
import { useState, useEffect, useRef, useCallback } from "react";
import { ProcessedEvent } from "@/components/ActivityTimeline";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessagesView } from "@/components/ChatMessagesView";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { QueryConfirmation } from "@/components/QueryConfirmation";
<<<<<<< HEAD
import { ExportReport } from "@/components/ExportReport";
=======
>>>>>>> 402cf6d6338a7494de78bf81d7428bf9e7f09611

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
  activities: Record<string, ProcessedEvent[]>;
}

export default function App() {
  const [processedEventsTimeline, setProcessedEventsTimeline] = useState<
    ProcessedEvent[]
  >([]);
  const [historicalActivities, setHistoricalActivities] = useState<
    Record<string, ProcessedEvent[]>
  >({});
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('research-conversations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => {
    // 检查是否有选中的对话ID
    const selectedId = sessionStorage.getItem('selectedConversationId');
    if (selectedId) {
      sessionStorage.removeItem('selectedConversationId'); // 清除临时存储
      return selectedId;
    }
    return null;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // 保存对话到本地存储
  useEffect(() => {
    localStorage.setItem('research-conversations', JSON.stringify(conversations));
  }, [conversations]);

  // 添加查询确认相关状态
  const [showQueryConfirmation, setShowQueryConfirmation] = useState(false);
  const [generatedQueries, setGeneratedQueries] = useState<string[]>([]);
<<<<<<< HEAD
  
  // 添加导出报告相关状态
  const [showExportReport, setShowExportReport] = useState(false);
  const [currentReportContent, setCurrentReportContent] = useState("");
  const [currentReportTitle, setCurrentReportTitle] = useState("");
=======
>>>>>>> 402cf6d6338a7494de78bf81d7428bf9e7f09611

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hasFinalizeEventOccurredRef = useRef(false);
  const userScrolledAwayRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const thread = useStream<{
    messages: Message[];
    initial_search_query_count: number;
    max_research_loops: number;
    reasoning_model: string;
  }>({
    apiUrl: import.meta.env.DEV
      ? "http://localhost:2024"
      : "http://localhost:8123",
    assistantId: "agent",
    messagesKey: "messages",
    onUpdateEvent: (event: any) => {
      console.log("收到事件:", event);
      let processedEvent: ProcessedEvent | null = null;
      const eventId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const timestamp = new Date();
      
      if (event.generate_query) {
        const queries = event.generate_query?.search_query || [];
        setGeneratedQueries(queries);
        
        // 检查是否需要用户确认
        if (event.generate_query?.awaiting_user_confirmation) {
          setShowQueryConfirmation(true);
        }
        
        processedEvent = {
          id: eventId,
          title: "生成搜索查询",
          data: queries.join(", ") || "",
          timestamp,
          status: "completed",
          rawData: event
        };
      } else if (event.web_research) {
        const sources = event.web_research.sources_gathered || [];
        const numSources = sources.length;
        const uniqueLabels = [
          ...new Set(sources.map((s: any) => s.label).filter(Boolean)),
        ];
        const exampleLabels = uniqueLabels.slice(0, 3).join(", ");
        processedEvent = {
          id: eventId,
          title: "网络研究",
          data: `收集了 ${numSources} 个资源。相关主题：${
            exampleLabels || "暂无"
          }。`,
          timestamp,
          status: "completed",
          rawData: event
        };
      } else if (event.reflection) {
        processedEvent = {
          id: eventId,
          title: "反思分析",
          data: "分析网络研究结果，评估信息充分性",
          timestamp,
          status: "completed",
          rawData: event
        };
      } else if (event.assess_content_quality) {
        const qualityScore = event.assess_content_quality?.content_quality?.quality_score || 0;
        processedEvent = {
          id: eventId,
          title: "内容质量评估",
          data: `评估内容质量和可靠性，质量评分：${(qualityScore * 100).toFixed(1)}%`,
          timestamp,
          status: "completed",
          rawData: event
        };
      } else if (event.verify_facts) {
        const verifiedFacts = event.verify_facts?.fact_verification?.verified_facts?.length || 0;
        const disputedClaims = event.verify_facts?.fact_verification?.disputed_claims?.length || 0;
        processedEvent = {
          id: eventId,
          title: "事实验证",
          data: `验证研究内容的准确性，已验证事实：${verifiedFacts}个，争议声明：${disputedClaims}个`,
          timestamp,
          status: "completed",
          rawData: event
        };
      } else if (event.assess_relevance) {
        const relevanceScore = event.assess_relevance?.relevance_assessment?.relevance_score || 0;
        processedEvent = {
          id: eventId,
          title: "相关性评估",
          data: `评估内容与查询的相关性，相关性评分：${(relevanceScore * 100).toFixed(1)}%`,
          timestamp,
          status: "completed",
          rawData: event
        };
      } else if (event.optimize_summary) {
        const keyInsights = event.optimize_summary?.summary_optimization?.key_insights?.length || 0;
        processedEvent = {
          id: eventId,
          title: "摘要优化",
          data: `优化研究摘要，提取关键洞察：${keyInsights}个`,
          timestamp,
          status: "completed",
          rawData: event
        };
      } else if (event.generate_verification_report) {
        processedEvent = {
          id: eventId,
          title: "生成验证报告",
          data: "生成综合质量验证报告",
          timestamp,
          status: "completed",
          rawData: event
        };
      } else if (event.wait_for_user_confirmation) {
        // 用户确认节点触发，显示确认界面
        if (event.wait_for_user_confirmation?.awaiting_user_confirmation) {
          // 这里我们已经从之前的generate_query事件中获取了查询
          // 只是确保显示确认界面
          setShowQueryConfirmation(true);
        }
        processedEvent = {
          id: eventId,
          title: "等待用户确认",
          data: "等待用户确认生成的搜索查询",
          timestamp,
          status: "pending",
          rawData: event
        };
      } else if (event.finalize_answer) {
        const finalConfidence = event.finalize_answer?.final_confidence_score || 0;
        processedEvent = {
          id: eventId,
          title: "生成最终答案",
          data: `整理并呈现最终答案，综合置信度：${(finalConfidence * 100).toFixed(1)}%`,
          timestamp,
          status: "completed",
          rawData: event
        };
        hasFinalizeEventOccurredRef.current = true;
      } else {
        // 处理所有其他未识别的事件类型
        const eventKeys = Object.keys(event);
        if (eventKeys.length > 0) {
          const mainKey = eventKeys[0];
          let title = "处理中";
          let data = "正在执行研究任务";
          
          // 根据事件键名推断标题和描述
          if (mainKey.includes('search') || mainKey.includes('query')) {
            title = "搜索处理";
            data = "执行搜索相关操作";
          } else if (mainKey.includes('analyze') || mainKey.includes('analysis')) {
            title = "数据分析";
            data = "分析收集的信息";
          } else if (mainKey.includes('process') || mainKey.includes('processing')) {
            title = "数据处理";
            data = "处理和整理数据";
          } else if (mainKey.includes('validate') || mainKey.includes('validation')) {
            title = "数据验证";
            data = "验证信息的准确性";
          } else if (mainKey.includes('extract') || mainKey.includes('extraction')) {
            title = "信息提取";
            data = "提取关键信息";
          } else if (mainKey.includes('summarize') || mainKey.includes('summary')) {
            title = "内容总结";
            data = "生成内容摘要";
          } else if (mainKey.includes('research')) {
            title = "深度研究";
            data = "进行详细研究分析";
          } else {
            // 使用事件键名作为标题，美化显示
            title = mainKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            data = `执行 ${title} 操作`;
          }
          
          processedEvent = {
            id: eventId,
            title,
            data,
            timestamp,
            status: "completed",
            rawData: event
          };
        }
      }
      if (processedEvent) {
        console.log("添加事件到时间线:", processedEvent);
        setProcessedEventsTimeline((prevEvents) => {
          const newEvents = [...prevEvents, processedEvent!];
          console.log("当前时间线事件:", newEvents);
          return newEvents;
        });
      }
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  // 页面加载时恢复选中的对话
  useEffect(() => {
    if (currentConversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === currentConversationId);
      if (conversation) {
        // 恢复历史活动
        if (conversation.activities) {
          setHistoricalActivities(conversation.activities);
        }
        // 恢复历史消息 - 使用thread.submit来重新加载消息
        if (conversation.messages && conversation.messages.length > 0) {
          // 直接设置thread的messages属性
          setTimeout(() => {
            if (thread.messages.length === 0) {
              // 使用反射来设置内部状态
              const threadInternal = thread as any;
              if (threadInternal.setMessages) {
                threadInternal.setMessages(conversation.messages);
              } else {
                // 如果没有setMessages方法，直接修改messages属性
                Object.defineProperty(thread, 'messages', {
                  value: conversation.messages,
                  writable: true,
                  configurable: true
                });
              }
            }
          }, 100);
        }
      }
    }
  }, [currentConversationId, conversations, thread]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // 如果正在自动滚动，忽略此次滚动事件
      if (isAutoScrollingRef.current) return;

      // 清除之前的定时器
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollTop >= scrollHeight - clientHeight - 50; // 50px tolerance
      
      // 用户手动滚动离开底部
      if (!isNearBottom) {
        userScrolledAwayRef.current = true;
        // 设置定时器，用户停止滚动3秒后重新启用自动滚动
        scrollTimeoutRef.current = setTimeout(() => {
          // 如果用户滚动回到底部附近，重新启用自动滚动
          const currentScrollTop = scrollContainer.scrollTop;
          const currentScrollHeight = scrollContainer.scrollHeight;
          const currentClientHeight = scrollContainer.clientHeight;
          const currentIsNearBottom = currentScrollTop >= currentScrollHeight - currentClientHeight - 50;
          
          if (currentIsNearBottom) {
            userScrolledAwayRef.current = false;
          }
        }, 3000);
      } else {
        // 用户滚动到底部附近，立即重新启用自动滚动
        userScrolledAwayRef.current = false;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // 只有在用户没有手动滚动离开底部时，才自动滚动
    if (scrollAreaRef.current && !userScrolledAwayRef.current) {
      // 设置自动滚动标记
      isAutoScrollingRef.current = true;
      
      requestAnimationFrame(() => {
        const scrollContainer = scrollAreaRef.current;
        if (scrollContainer) {
          const scrollHeight = scrollContainer.scrollHeight;
          const clientHeight = scrollContainer.clientHeight;
          
          // 只有当内容超出视口时才滚动
          if (scrollHeight > clientHeight) {
            scrollContainer.scrollTop = scrollHeight - clientHeight;
          } else {
            scrollContainer.scrollTop = 0;
          }
        }
        
        // 延迟重置自动滚动标记，确保滚动完成
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 100);
      });
    }
  }, [thread.messages]);

  useEffect(() => {
    if (
      hasFinalizeEventOccurredRef.current &&
      !thread.isLoading &&
      thread.messages.length > 0
    ) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      if (lastMessage && lastMessage.type === "ai" && lastMessage.id) {
        setHistoricalActivities((prev) => ({
          ...prev,
          [lastMessage.id!]: [...processedEventsTimeline],
        }));
        
        // 同时更新当前对话的消息和活动
         if (currentConversationId) {
           setConversations(prev => prev.map(c => 
             c.id === currentConversationId 
               ? { 
                   ...c, 
                   messages: thread.messages,
                   activities: {
                     ...c.activities,
                     [lastMessage.id!]: [...processedEventsTimeline]
                   },
                   lastMessage: (() => {
                     const humanMessage = thread.messages.find(m => m.type === 'human');
                     if (humanMessage?.content) {
                       return typeof humanMessage.content === 'string' 
                         ? humanMessage.content 
                         : JSON.stringify(humanMessage.content);
                     }
                     return c.lastMessage;
                   })(),
                   timestamp: new Date()
                 }
               : c
           ));
         }
      }
      hasFinalizeEventOccurredRef.current = false;
    }
  }, [thread.messages, thread.isLoading, processedEventsTimeline, currentConversationId]);

  // 生成对话标题
  const generateConversationTitle = useCallback((firstMessage: string) => {
    return firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + '...' 
      : firstMessage;
  }, []);

  const handleSubmit = useCallback(
    (submittedInputValue: string, effort: string, model: string) => {
      if (!submittedInputValue.trim()) return;
      
      // 如果是新对话，创建对话记录
      if (thread.messages.length === 0) {
        const newConversationId = Date.now().toString();
        const newConversation: Conversation = {
          id: newConversationId,
          title: generateConversationTitle(submittedInputValue),
          lastMessage: submittedInputValue,
          timestamp: new Date(),
          messages: [],
          activities: {}
        };
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversationId);
      }
      
      setProcessedEventsTimeline([]);
      hasFinalizeEventOccurredRef.current = false;

      // convert effort to, initial_search_query_count and max_research_loops
      let initial_search_query_count = 0;
      let max_research_loops = 0;
      switch (effort) {
        case "low":
          initial_search_query_count = 1;
          max_research_loops = 1;
          break;
        case "medium":
          initial_search_query_count = 3;
          max_research_loops = 3;
          break;
        case "high":
          initial_search_query_count = 5;
          max_research_loops = 10;
          break;
      }

      const newMessages: Message[] = [
        ...(thread.messages || []),
        {
          type: "human",
          content: submittedInputValue,
          id: Date.now().toString(),
        },
      ];
      thread.submit({
        messages: newMessages,
        initial_search_query_count: initial_search_query_count,
        max_research_loops: max_research_loops,
        reasoning_model: model,
      });
    },
    [thread, generateConversationTitle]
  );

  const handleCancel = useCallback(() => {
    thread.stop();
    window.location.reload();
  }, [thread]);

  // 对话管理函数
  const handleNewConversation = useCallback(() => {
    // 如果当前有对话，先保存它
    if (currentConversationId && thread.messages.length > 0) {
      const currentConv = conversations.find(c => c.id === currentConversationId);
      if (currentConv) {
        setConversations(prev => prev.map(c => 
          c.id === currentConversationId 
            ? { ...c, messages: thread.messages, activities: historicalActivities }
            : c
        ));
      }
    }
    
    // 重置当前状态
    setCurrentConversationId(null);
    setProcessedEventsTimeline([]);
    setHistoricalActivities({});
    thread.stop();
    window.location.reload();
  }, [currentConversationId, conversations, thread.messages, historicalActivities, thread]);

  const handleSelectConversation = useCallback((id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      // 先保存当前对话状态
      if (currentConversationId && thread.messages.length > 0) {
        setConversations(prev => prev.map(c => 
          c.id === currentConversationId 
            ? { ...c, messages: thread.messages, activities: historicalActivities }
            : c
        ));
      }
      
      // 切换到选中的对话
      setCurrentConversationId(id);
      setHistoricalActivities(conversation.activities || {});
      
      // 重置当前的流状态
      thread.stop();
      setProcessedEventsTimeline([]);
      
      // 保存选中的对话ID并重新加载页面来正确恢复历史对话
      sessionStorage.setItem('selectedConversationId', id);
      window.location.reload();
    }
  }, [conversations, currentConversationId, thread, historicalActivities]);

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      handleNewConversation();
    }
  }, [currentConversationId, handleNewConversation]);

  // 处理用户查询确认
  const handleQueryConfirmation = useCallback(async (action: 'confirm' | 'modify' | 'cancel', queries?: string[]) => {
    try {
      if (action === 'cancel') {
        // 取消整个流程
        thread.stop();
        setShowQueryConfirmation(false);
        return;
      }

      const finalQueries = action === 'modify' && queries ? queries : generatedQueries;
      
      // 停止当前流程
      thread.stop();
      
      // 清除当前的事件时间线
      setProcessedEventsTimeline([]);
      
      // 延迟一下，然后开始新的搜索，跳过查询生成步骤
      setTimeout(() => {
        const confirmMessage: Message = {
          type: "human",
          content: `[查询已确认] ${finalQueries.join(" | ")}`,
          id: Date.now().toString(),
        };

        thread.submit({
          messages: [...thread.messages, confirmMessage],
          initial_search_query_count: finalQueries.length,
          max_research_loops: 3,
          reasoning_model: "deepseek-chat",
        });
      }, 100);

      setShowQueryConfirmation(false);
    } catch (error) {
      console.error("处理查询确认时出错:", error);
      setError("处理查询确认时出错");
    }
  }, [thread, generatedQueries]);

<<<<<<< HEAD
  // 处理导出报告
  const handleExportReport = useCallback(() => {
    // 获取最新的AI消息作为报告内容
    const lastAiMessage = thread.messages
      .filter(msg => msg.type === "ai")
      .pop();
    
    if (lastAiMessage && lastAiMessage.content) {
      const content = typeof lastAiMessage.content === "string" 
        ? lastAiMessage.content 
        : JSON.stringify(lastAiMessage.content);
      
      setCurrentReportContent(content);
      
      // 生成报告标题
      const firstHumanMessage = thread.messages.find(msg => msg.type === "human");
      const title = firstHumanMessage 
        ? (typeof firstHumanMessage.content === "string" 
            ? firstHumanMessage.content 
            : JSON.stringify(firstHumanMessage.content)).substring(0, 50) + "..."
        : "研究报告";
      
      setCurrentReportTitle(title);
      setShowExportReport(true);
    } else {
      alert("没有可导出的报告内容");
    }
  }, [thread.messages]);

=======
>>>>>>> 402cf6d6338a7494de78bf81d7428bf9e7f09611
  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans antialiased overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col h-full">
        {/* 顶部导航栏 */}
        <TopBar 
          conversationTitle={currentConversationId ? conversations.find(c => c.id === currentConversationId)?.title : undefined}
          isLoading={thread.isLoading}
<<<<<<< HEAD
          onExportReport={handleExportReport}
          canExport={thread.messages.some(msg => msg.type === "ai")}
=======
>>>>>>> 402cf6d6338a7494de78bf81d7428bf9e7f09611
        />
        
        {/* 内容区域 */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {thread.messages.length === 0 ? (
            <WelcomeScreen
              handleSubmit={handleSubmit}
              isLoading={thread.isLoading}
              onCancel={handleCancel}
            />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full bg-white">
              <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl text-red-600 font-bold">错误</h1>
                <p className="text-red-600">{JSON.stringify(error)}</p>
                <Button
                  variant="destructive"
                  onClick={() => window.location.reload()}
                >
                  重试
                </Button>
              </div>
            </div>
          ) : (
            <ChatMessagesView
              messages={thread.messages}
              isLoading={thread.isLoading}
              scrollAreaRef={scrollAreaRef}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              liveActivityEvents={processedEventsTimeline}
              historicalActivities={historicalActivities}
            />
          )}
        </div>
      </main>
      
      {/* 查询确认弹窗 */}
      <QueryConfirmation
        queries={generatedQueries}
        onConfirm={handleQueryConfirmation}
        isVisible={showQueryConfirmation}
      />
<<<<<<< HEAD
      
      {/* 导出报告弹窗 */}
      <ExportReport
        reportContent={currentReportContent}
        reportTitle={currentReportTitle}
        isVisible={showExportReport}
        onClose={() => setShowExportReport(false)}
      />
=======
>>>>>>> 402cf6d6338a7494de78bf81d7428bf9e7f09611
    </div>
  );
}
