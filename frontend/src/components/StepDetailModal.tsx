import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProcessedEvent } from "./ActivityTimeline";
import ReactMarkdown from "react-markdown";

interface StepDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ProcessedEvent | null;
}

export function StepDetailModal({ isOpen, onClose, event }: StepDetailModalProps) {
  if (!event) return null;

  const renderDetailContent = () => {
    if (!event.rawData) {
      return (
        <div className="text-gray-500 text-center py-8">
          <p>暂无详细数据</p>
        </div>
      );
    }

    const { rawData } = event;

    // 根据不同的步骤类型渲染不同的详细信息
    if (event.title === "生成搜索查询") {
      const queries = rawData.generate_query?.search_query || [];
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
              生成的搜索查询
            </h4>
            <div className="space-y-3">
              {queries.map((query: any, index: number) => (
                <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-semibold text-base text-gray-800 leading-relaxed">{query.query || query}</p>
                  {query.rationale && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{query.rationale}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (event.title === "网络研究") {
      const sources = rawData.web_research?.sources_gathered || [];
      const webResults = rawData.web_research?.web_research_result || [];
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              收集的资源 ({sources.length})
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {sources.map((source: any, index: number) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs font-medium px-2 py-1 bg-white border-blue-200 text-blue-700">{source.label}</Badge>
                  </div>
                  <a 
                    href={source.value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium underline decoration-2 underline-offset-2 transition-colors"
                  >
                    {source.value}
                  </a>
                </div>
              ))}
            </div>
          </div>
          {webResults.length > 0 && (
            <div>
              <Separator className="my-6 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                研究结果
              </h4>
              <div className="space-y-4 max-h-72 overflow-y-auto">
                {webResults.map((result: string, index: number) => (
                  <div key={index} className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm">
                    <ReactMarkdown className="text-sm prose prose-sm max-w-none leading-relaxed text-gray-700">
                      {result}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (event.title === "反思分析") {
      const reflection = rawData.reflection || {};
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-orange-600 rounded-full"></div>
              反思结果
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100 shadow-sm">
                <p className="text-base font-semibold text-gray-800 mb-3">信息是否充分:</p>
                <Badge variant={reflection.is_sufficient ? "default" : "destructive"} className="px-3 py-1 text-sm font-medium">
                  {reflection.is_sufficient ? "是" : "否"}
                </Badge>
              </div>
              {reflection.knowledge_gap && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-2">知识空白:</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{reflection.knowledge_gap}</p>
                </div>
              )}
              {reflection.follow_up_queries && reflection.follow_up_queries.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">后续查询建议:</p>
                  <div className="space-y-2">
                    {reflection.follow_up_queries.map((query: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span>{query}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (event.title === "内容质量评估") {
      const quality = rawData.assess_content_quality?.content_quality || {};
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-green-600 rounded-full"></div>
              质量评估结果
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 shadow-sm">
                <p className="text-base font-semibold text-gray-800">质量评分: 
                  <span className="text-emerald-600 font-bold text-lg ml-1">
                    {quality.quality_score != null ? (quality.quality_score * 100).toFixed(1) : '0.0'}%
                  </span>
                </p>
              </div>
              {quality.reliability_assessment && (
                <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-2">可靠性评估:</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{quality.reliability_assessment}</p>
                </div>
              )}
              {quality.content_gaps && quality.content_gaps.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">内容空白:</p>
                  <div className="space-y-2">
                    {quality.content_gaps.map((gap: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span>{gap}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {quality.improvement_suggestions && quality.improvement_suggestions.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">改进建议:</p>
                  <div className="space-y-2">
                    {quality.improvement_suggestions.map((suggestion: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-green-500 font-bold mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (event.title === "事实验证") {
      const verification = rawData.verify_facts?.fact_verification || {};
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-red-400 to-pink-600 rounded-full"></div>
              事实验证结果
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
                <p className="text-base font-semibold text-gray-800">验证置信度: 
                  <span className="text-green-600 font-bold text-lg ml-1">
                    {verification.confidence_score != null ? (verification.confidence_score * 100).toFixed(1) : '0.0'}%
                  </span>
                </p>
              </div>
              {verification.verified_facts && verification.verified_facts.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">已验证事实 ({verification.verified_facts.length}):</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {verification.verified_facts.map((fact: any, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-green-500 font-bold mt-0.5">✓</span>
                        <span>{typeof fact === 'string' ? fact : JSON.stringify(fact)}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {verification.disputed_claims && verification.disputed_claims.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">争议声明 ({verification.disputed_claims.length}):</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {verification.disputed_claims.map((claim: any, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">⚠</span>
                        <span>{typeof claim === 'string' ? claim : JSON.stringify(claim)}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {verification.verification_sources && verification.verification_sources.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">验证来源:</p>
                  <div className="space-y-2">
                    {verification.verification_sources.map((source: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span>{source}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (event.title === "相关性评估") {
      const relevance = rawData.assess_relevance?.relevance_assessment || {};
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-full"></div>
              相关性评估结果
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
                <p className="text-base font-semibold text-gray-800">相关性评分: 
                  <span className="text-purple-600 font-bold text-lg ml-1">
                    {relevance.relevance_score != null ? (relevance.relevance_score * 100).toFixed(1) : '0.0'}%
                  </span>
                </p>
              </div>
              {relevance.key_topics_covered && relevance.key_topics_covered.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">已覆盖关键主题:</p>
                  <div className="space-y-2">
                    {relevance.key_topics_covered.map((topic: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2 px-3 py-1 text-sm font-medium bg-white border-green-200 text-green-700">{topic}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {relevance.missing_topics && relevance.missing_topics.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">缺失主题:</p>
                  <div className="space-y-2">
                    {relevance.missing_topics.map((topic: string, index: number) => (
                      <Badge key={index} variant="destructive" className="mr-2 mb-2 px-3 py-1 text-sm font-medium">{topic}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {relevance.content_alignment && (
                <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-2">内容一致性:</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{relevance.content_alignment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (event.title === "摘要优化") {
      const optimization = rawData.optimize_summary?.summary_optimization || {};
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-purple-400 to-violet-600 rounded-full"></div>
              摘要优化结果
            </h4>
            <div className="space-y-4">
              {optimization.optimized_summary && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">优化后的摘要:</p>
                  <ReactMarkdown className="text-sm prose prose-sm max-w-none text-gray-700 leading-relaxed">
                    {optimization.optimized_summary}
                  </ReactMarkdown>
                </div>
              )}
              {optimization.key_insights && optimization.key_insights.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">关键洞察 ({optimization.key_insights.length}):</p>
                  <div className="space-y-2">
                    {optimization.key_insights.map((insight: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span>{insight}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {optimization.actionable_items && optimization.actionable_items.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800 mb-3">可行建议 ({optimization.actionable_items.length}):</p>
                  <div className="space-y-2">
                    {optimization.actionable_items.map((item: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-green-500 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {optimization.confidence_level && (
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-base font-semibold text-gray-800">置信度等级: 
                    <span className="text-purple-600 font-bold text-lg ml-1">
                      {optimization.confidence_level}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (event.title === "生成验证报告") {
      const report = rawData.generate_verification_report?.verification_report || "";
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">验证报告</h4>
            <div className="p-3 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
              <ReactMarkdown className="text-sm prose prose-sm max-w-none">
                {report}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      );
    }

    if (event.title === "生成最终答案") {
      const finalData = rawData.finalize_answer || {};
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">最终答案详情</h4>
            <div className="space-y-3">
              {finalData.final_confidence_score != null && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium">综合置信度: {(finalData.final_confidence_score * 100).toFixed(1)}%</p>
                </div>
              )}
              {finalData.quality_enhanced_summary && (
                <div className="p-3 bg-blue-50 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">增强摘要:</p>
                  <ReactMarkdown className="text-sm prose prose-sm max-w-none">
                    {finalData.quality_enhanced_summary}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 默认显示原始数据
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">原始数据</h4>
          <div className="p-3 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(rawData, null, 2)}
            </pre>

          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-2xl border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            查看此步骤的详细分析结果和数据洞察
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] overflow-y-auto">
          <div className="pr-6 space-y-6">
            {renderDetailContent()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}