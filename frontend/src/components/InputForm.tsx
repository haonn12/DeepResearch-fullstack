import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Send, StopCircle, Zap, Cpu } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Updated InputFormProps
interface InputFormProps {
  onSubmit: (inputValue: string, effort: string, model: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [internalInputValue, setInternalInputValue] = useState("");
  const [effort, setEffort] = useState("medium");
  const [model, setModel] = useState("deepseek-chat");

  const handleInternalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!internalInputValue.trim()) return;
    onSubmit(internalInputValue, effort, model);
    setInternalInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit with Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  const isSubmitDisabled = !internalInputValue.trim() || isLoading;

  return (
    <form
      onSubmit={handleInternalSubmit}
      className={`flex flex-col gap-2 p-3 pb-4`}
    >
      <div className="flex flex-row items-center justify-between bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
        <Textarea
          value={internalInputValue}
          onChange={(e) => setInternalInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请输入您想要研究的问题..."
          className="w-full text-gray-900 placeholder-gray-500 resize-none border-0 focus:outline-none focus:ring-0 outline-none focus-visible:ring-0 shadow-none bg-transparent md:text-base min-h-[56px] max-h-[200px]"
          rows={1}
        />
        <div className="ml-3">
          {isLoading ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-400 hover:bg-red-50 p-2 cursor-pointer rounded-full transition-all duration-200"
              onClick={onCancel}
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              className={`${
                isSubmitDisabled
                  ? "text-gray-400"
                  : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              } p-2 cursor-pointer rounded-full transition-all duration-200`}
              disabled={isSubmitDisabled}
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-row gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors duration-200">
            <Brain className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">深度</span>
            <Select value={effort} onValueChange={setEffort}>
              <SelectTrigger className="w-[80px] bg-transparent border-none text-sm font-medium cursor-pointer">
                <SelectValue placeholder="深度" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem
                  value="low"
                  className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer text-gray-900"
                >
                  低
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer text-gray-900"
                >
                  中
                </SelectItem>
                <SelectItem
                  value="high"
                  className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer text-gray-900"
                >
                  高
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors duration-200">
            <Cpu className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">模型</span>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[140px] bg-transparent border-none text-sm font-medium cursor-pointer">
                <SelectValue placeholder="模型" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem
                  value="deepseek-chat"
                  className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer text-gray-900"
                >
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-500" /> DeepSeek
                  </div>
                </SelectItem>
                <SelectItem
                  value="deepseek-reasoner"
                  className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer text-gray-900"
                >
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-purple-500" /> DeepSeek 推理
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>
    </form>
  );
};
