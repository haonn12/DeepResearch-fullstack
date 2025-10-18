# DeepResearch 全栈项目文件介绍

## 📁 项目结构概览

```
DeepResearch-fullstack/
├── 📁 backend/                    # Python 后端服务
├── 📁 frontend/                   # React 前端应用
├── 📄 docker-compose.yml          # 容器编排配置
├── 📄 Dockerfile                  # 容器化配置
├── 📄 Makefile                    # 构建脚本
├── 📄 README.md                   # 项目说明
├── 📄 LICENSE                     # 开源许可证
├── 📄 studyPlan.md               # 学习计划
└── 📄 Introduction.md             # 本文档
```

---

## 🔧 后端文件详解 (Backend)

### 📁 `backend/` 目录

#### 📄 `pyproject.toml`
**作用**: Python 项目配置文件
**内容**:
- 项目元数据 (名称、版本、作者)
- 依赖管理 (LangGraph, LangChain, FastAPI 等)
- 开发依赖 (mypy, ruff 代码检查工具)
- 构建系统配置

**关键依赖**:
- `langgraph>=0.2.6` - 状态图工作流引擎
- `langchain>=0.3.19` - AI 应用开发框架
- `langchain-deepseek` - DeepSeek AI 模型集成
- `langchain-tavily` - Tavily 搜索 API 集成
- `fastapi` - Web 框架

#### 📄 `langgraph.json`
**作用**: LangGraph 服务配置文件
**内容**:
- 定义依赖关系
- 配置图服务端点
- 设置 HTTP 应用入口
- 环境变量配置

#### 📄 `Makefile`
**作用**: 后端开发命令脚本
**功能**:
- `make dev-backend` - 启动后端开发服务器
- `make dev-frontend` - 启动前端开发服务器
- `make dev` - 同时启动前后端服务

#### 📄 `LICENSE`
**作用**: 后端部分的开源许可证文件

### 📁 `backend/src/agent/` 目录

#### 📄 `__init__.py`
**作用**: Python 包初始化文件
**功能**: 使 `agent` 目录成为 Python 包

#### 📄 `app.py` (73行)
**作用**: FastAPI 应用入口和前端服务
**核心功能**:
- FastAPI 应用实例创建
- 用户查询确认 API 端点 (`/user-confirmation`)
- 前端静态文件服务
- 错误处理和响应管理

**关键代码**:
```python
@app.post("/user-confirmation")
async def handle_user_confirmation(request: QueryConfirmationRequest):
    # 处理用户对生成查询的确认或修改
```

#### 📄 `configuration.py` (61行)
**作用**: 配置管理类
**功能**:
- 定义可配置参数 (模型选择、查询数量、研究循环次数)
- 从运行配置中提取参数
- 提供默认配置值

**关键配置**:
- `query_generator_model` - 查询生成模型
- `reflection_model` - 反思分析模型
- `answer_model` - 最终答案模型
- `number_of_initial_queries` - 初始查询数量
- `max_research_loops` - 最大研究循环次数

#### 📄 `graph.py` (686行)
**作用**: LangGraph 工作流核心文件
**核心功能**:
- 定义完整的研究工作流状态图
- 实现各个处理节点 (查询生成、网络搜索、质量评估等)
- 管理状态流转和条件路由
- 集成外部 API (Tavily Search, DeepSeek)

**主要节点**:
1. `generate_query` - 智能查询生成
2. `web_research` - 网络研究执行
3. `reflection` - 反思和循环控制
4. `assess_content_quality` - 内容质量评估
5. `verify_facts` - 事实验证
6. `assess_relevance` - 相关性评估
7. `optimize_summary` - 摘要优化
8. `finalize_answer` - 最终答案生成

#### 📄 `state.py` (93行)
**作用**: 状态定义和数据结构
**核心类型**:
- `OverallState` - 总体状态管理
- `ReflectionState` - 反思状态
- `WebSearchState` - 网络搜索状态
- `ContentQualityState` - 内容质量状态
- `FactVerificationState` - 事实验证状态
- `RelevanceState` - 相关性状态
- `SummaryOptimizationState` - 摘要优化状态

#### 📄 `prompts.py` (220行)
**作用**: AI 提示词模板集合
**核心提示词**:
- `query_writer_instructions` - 查询生成提示词
- `web_searcher_instructions` - 网络搜索分析提示词
- `reflection_instructions` - 反思分析提示词
- `content_quality_instructions` - 内容质量评估提示词
- `fact_verification_instructions` - 事实验证提示词
- `relevance_assessment_instructions` - 相关性评估提示词
- `summary_optimization_instructions` - 摘要优化提示词

#### 📄 `tools_and_schemas.py` (108行)
**作用**: 工具函数和数据结构定义
**核心类**:
- `SearchQueryList` - 搜索查询列表结构
- `Reflection` - 反思结果结构
- `ContentQualityAssessment` - 内容质量评估结构
- `FactVerification` - 事实验证结构
- `RelevanceAssessment` - 相关性评估结构
- `SummaryOptimization` - 摘要优化结构
- `UserQueryConfirmation` - 用户查询确认结构

#### 📄 `utils.py` (168行)
**作用**: 工具函数集合
**核心函数**:
- `get_research_topic()` - 从消息中提取研究主题
- `resolve_urls()` - URL 解析和映射
- `insert_citation_markers()` - 插入引用标记
- `get_citations()` - 提取引用信息

### 📁 `backend/examples/` 目录

#### 📄 `cli_research.py` (44行)
**作用**: 命令行研究工具示例
**功能**:
- 提供命令行接口运行研究代理
- 支持参数配置 (查询数量、循环次数、模型选择)
- 演示如何直接调用 LangGraph 工作流

**使用方法**:
```bash
python cli_research.py "你的研究问题" --initial-queries 3 --max-loops 2
```

### 📁 `backend/test-agent.ipynb`
**作用**: Jupyter 笔记本测试文件
**功能**: 用于测试和调试研究代理功能

---

## 🎨 前端文件详解 (Frontend)

### 📁 `frontend/` 目录

#### 📄 `package.json`
**作用**: Node.js 项目配置文件
**核心依赖**:
- `react@^19.0.0` - React 19 框架
- `typescript@~5.7.2` - TypeScript 支持
- `vite@^6.3.4` - 构建工具
- `tailwindcss@^4.1.5` - CSS 框架
- `@langchain/langgraph-sdk@^0.0.74` - LangGraph SDK
- `@radix-ui/*` - 无头 UI 组件库

#### 📄 `vite.config.ts` (27行)
**作用**: Vite 构建工具配置
**功能**:
- React 插件配置
- Tailwind CSS 集成
- 路径别名设置 (`@` 指向 `src` 目录)
- 开发服务器代理配置 (API 请求转发到后端)

#### 📄 `tsconfig.json` & `tsconfig.node.json`
**作用**: TypeScript 编译配置
**功能**:
- 编译选项设置
- 路径映射配置
- 类型检查规则

#### 📄 `components.json`
**作用**: shadcn/ui 组件库配置
**功能**:
- UI 组件库样式配置
- 路径别名设置
- 主题和颜色配置

#### 📄 `eslint.config.js`
**作用**: ESLint 代码检查配置
**功能**:
- 代码质量检查规则
- React 和 TypeScript 特定规则

#### 📄 `index.html`
**作用**: HTML 入口文件
**功能**:
- 页面基础结构
- React 应用挂载点
- 元数据配置

### 📁 `frontend/src/` 目录

#### 📄 `main.tsx` (14行)
**作用**: React 应用入口文件
**功能**:
- React 应用初始化
- 路由配置 (BrowserRouter)
- 全局样式导入
- 严格模式启用

#### 📄 `App.tsx` (685行)
**作用**: 主应用组件
**核心功能**:
- 应用状态管理 (对话、活动、配置)
- 流式数据处理和事件处理
- 对话管理 (创建、选择、删除)
- 用户交互处理 (查询确认、报告导出)
- 实时数据更新和滚动控制

**关键状态**:
- `conversations` - 对话历史管理
- `processedEventsTimeline` - 实时活动时间线
- `showQueryConfirmation` - 查询确认界面控制
- `showExportReport` - 报告导出界面控制

#### 📄 `global.css` (273行)
**作用**: 全局样式文件
**功能**:
- Tailwind CSS 导入和配置
- 自定义 CSS 变量定义
- 暗色主题支持
- 动画效果定义
- 滚动条美化
- 响应式布局样式

**关键样式**:
- 自定义颜色主题
- 滚动区域样式优化
- 聊天界面布局
- 动画效果定义

#### 📄 `vite-env.d.ts`
**作用**: Vite 环境类型声明
**功能**: 为 Vite 相关模块提供 TypeScript 类型支持

### 📁 `frontend/src/components/` 目录

#### 📄 `ActivityTimeline.tsx`
**作用**: 活动时间线组件
**功能**:
- 显示研究过程中的实时活动
- 支持不同事件类型的可视化
- 提供活动详情查看功能
- 加载状态和错误处理

#### 📄 `ChatMessagesView.tsx` (410行)
**作用**: 聊天消息显示组件
**功能**:
- 消息气泡渲染 (用户/AI)
- Markdown 内容渲染和样式
- 引用来源显示和管理
- 消息复制功能
- 自动滚动控制
- 历史活动集成

**关键特性**:
- 支持 Markdown 格式的消息内容
- 引用链接的特殊样式处理
- 来源信息的结构化显示
- 响应式布局设计

#### 📄 `ExportReport.tsx`
**作用**: 报告导出组件
**功能**:
- 研究报告的格式化显示
- 多种导出格式支持 (Markdown, PDF 等)
- 报告预览功能
- 下载和分享功能

#### 📄 `InputForm.tsx`
**作用**: 输入表单组件
**功能**:
- 用户输入界面
- 研究强度选择 (低/中/高)
- 模型选择
- 输入验证和提交处理

#### 📄 `QueryConfirmation.tsx`
**作用**: 查询确认组件
**功能**:
- 显示生成的搜索查询
- 允许用户修改查询
- 确认/修改/取消操作
- 模态框界面设计

#### 📄 `Sidebar.tsx`
**作用**: 侧边栏组件
**功能**:
- 对话历史列表
- 对话管理操作 (新建、选择、删除)
- 侧边栏折叠/展开
- 对话搜索和过滤

#### 📄 `StepDetailModal.tsx`
**作用**: 步骤详情模态框
**功能**:
- 显示活动步骤的详细信息
- 原始数据查看
- 步骤状态跟踪

#### 📄 `TopBar.tsx`
**作用**: 顶部导航栏组件
**功能**:
- 应用标题显示
- 加载状态指示
- 报告导出按钮
- 用户操作菜单

#### 📄 `WelcomeScreen.tsx`
**作用**: 欢迎界面组件
**功能**:
- 应用介绍和说明
- 快速开始指导
- 功能特性展示

### 📁 `frontend/src/components/ui/` 目录

#### UI 组件库 (基于 Radix UI)
- `badge.tsx` - 徽章组件
- `button.tsx` - 按钮组件
- `card.tsx` - 卡片组件
- `checkbox.tsx` - 复选框组件
- `dialog.tsx` - 对话框组件
- `input.tsx` - 输入框组件
- `scroll-area.tsx` - 滚动区域组件
- `select.tsx` - 选择器组件
- `separator.tsx` - 分隔符组件
- `tabs.tsx` - 标签页组件
- `textarea.tsx` - 文本域组件

**特点**:
- 无头组件设计 (Headless UI)
- 完全可定制样式
- 无障碍性支持
- TypeScript 类型安全

### 📁 `frontend/src/lib/` 目录

#### 📄 `utils.ts` (7行)
**作用**: 工具函数库
**功能**:
- `cn()` 函数 - 合并 CSS 类名
- 使用 `clsx` 和 `tailwind-merge` 实现智能类名合并

---

## 🐳 容器化和部署文件

#### 📄 `docker-compose.yml` (45行)
**作用**: 多容器服务编排配置
**服务配置**:
- `langgraph-redis` - Redis 缓存服务
- `langgraph-postgres` - PostgreSQL 数据库服务
- `langgraph-api` - 主应用服务

**环境变量**:
- `GEMINI_API_KEY` - Gemini API 密钥
- `LANGSMITH_API_KEY` - LangSmith API 密钥
- `REDIS_URI` - Redis 连接地址
- `POSTGRES_URI` - PostgreSQL 连接地址

#### 📄 `Dockerfile` (64行)
**作用**: 容器镜像构建配置
**功能**:
- 多阶段构建优化
- Python 环境配置
- 依赖安装和优化
- 应用启动配置

#### 📄 `start-dev.bat` & `start-dev.ps1`
**作用**: Windows 开发环境启动脚本
**功能**:
- 自动启动前后端服务
- 环境变量配置
- 错误处理和日志输出

---

## 📋 项目配置文件

#### 📄 `Makefile` (20行)
**作用**: 跨平台构建脚本
**命令**:
- `make help` - 显示帮助信息
- `make dev-frontend` - 启动前端开发服务器
- `make dev-backend` - 启动后端开发服务器
- `make dev` - 同时启动前后端服务

#### 📄 `README.md`
**作用**: 项目说明文档
**内容**: 项目介绍、安装指南、使用方法

#### 📄 `LICENSE`
**作用**: 开源许可证文件
**类型**: MIT 许可证

#### 📄 `studyPlan.md` (533行)
**作用**: 详细的学习计划文档
**内容**: 功能模块分析、学习路线、代码文件对应关系

---

## 🔄 数据流和文件关系

### 后端数据流
```
用户输入 → app.py → graph.py → 各处理节点 → 状态更新 → 响应输出
```

### 前端数据流
```
用户交互 → App.tsx → 组件状态 → API 调用 → 实时更新 → UI 渲染
```

### 文件依赖关系
- **后端**: `graph.py` 是核心，依赖所有其他模块
- **前端**: `App.tsx` 是主控制器，管理所有组件状态
- **配置**: `pyproject.toml` 和 `package.json` 定义依赖关系
- **部署**: `docker-compose.yml` 协调所有服务

---

## 🚀 快速开始

### 开发环境启动
```bash
# 使用 Makefile
make dev

# 或分别启动
make dev-backend  # 启动后端
make dev-frontend # 启动前端
```

### 生产环境部署
```bash
# 使用 Docker Compose
docker-compose up -d
```

### 命令行使用
```bash
# 使用 CLI 工具
python backend/examples/cli_research.py "你的研究问题"
```

---

## 📊 技术栈总结

| 层级 | 技术 | 文件位置 | 主要功能 |
|------|------|----------|----------|
| **后端** | Python + FastAPI | `backend/src/agent/` | API 服务、AI 工作流 |
| **前端** | React 19 + TypeScript | `frontend/src/` | 用户界面、状态管理 |
| **AI** | LangGraph + LangChain | `graph.py`, `prompts.py` | 智能研究流程 |
| **数据库** | PostgreSQL + Redis | `docker-compose.yml` | 数据存储、缓存 |
| **部署** | Docker + Docker Compose | `Dockerfile`, `docker-compose.yml` | 容器化部署 |
| **构建** | Vite + Make | `vite.config.ts`, `Makefile` | 构建和开发工具 |

这个项目展示了现代全栈 AI 应用的完整架构，从智能研究引擎到用户友好的界面，每个文件都有其特定的职责和作用。
