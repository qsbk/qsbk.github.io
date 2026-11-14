---
title: Agentic RL 阅读清单
date: 2026-11-14
tags: [阅读清单, 后训练, Agentic RL]
---

为 agentic-tool-rl 项目准备的阅读清单，按从基础到前沿排列。

**读法：** 前两个阶段以博客为主，先看图，不硬啃公式。论文先读摘要、引言、方法图和实验表，看不懂的公式先跳过。⭐ 为必读，其余选读。

**时间：** 共约 4 周，每天 1–2 小时。项目开发不用等读完，读到第 3 阶段时正好开始接 verl 训练。

## 第 0 阶段：补基础（约 1 周，以博客为主）

| | 材料 | 读它为了什么 |
|---|---|---|
| ⭐ | Jay Alammar《The Illustrated Transformer》（jalammar.github.io），中文改写版见 `workSpace/学习笔记/图解Transformer中文版.html` | 大模型的底层结构，熟悉的话可以跳过 |
| ⭐ | OpenAI Spinning Up：*Part 1: Key Concepts in RL*、*Part 3: Intro to Policy Optimization*（spinningup.openai.com） | 强化学习入门：策略、奖励、策略梯度 |
| ⭐ | Nathan Lambert《RLHF Book》（rlhfbook.com），先读前几章 | 后训练全貌：SFT、奖励模型、RLHF |
| | Lilian Weng《Policy Gradient Algorithms》（lilianweng.github.io） | 想弄懂 PPO 的推导时再看 |

## 第 1 阶段：后训练核心论文（约 1 周）

| | 论文 | 重点看什么 |
|---|---|---|
| ⭐ | **InstructGPT**：*Training language models to follow instructions with human feedback*（arXiv 2203.02155） | SFT → 奖励模型 → PPO 三步流程，后训练的起点 |
| | **PPO**（arXiv 1707.06347） | 只看算法框和 clip 的含义 |
| ⭐ | **DeepSeekMath**（arXiv 2402.03300）第 4 节 | **GRPO 的出处**，项目训练就用它，一定要看懂 |
| ⭐ | **DeepSeek-R1**（arXiv 2501.12948） | 只靠可验证奖励做 RL 就能训出推理能力，RLVR 热潮的起点 |
| | **DAPO**（arXiv 2503.14476） | GRPO 的工程改进：熵坍缩、clip-higher，和训练稳定性直接相关 |
| | **Qwen3 技术报告**（arXiv 2505.09388） | 项目用的模型，看后训练和蒸馏部分 |

## 第 2 阶段：工具调用与 Agent（约 1 周）

| | 材料 | 重点看什么 |
|---|---|---|
| ⭐ | Lilian Weng《LLM Powered Autonomous Agents》 | Agent 基本概念：规划、记忆、工具 |
| ⭐ | **ReAct**（arXiv 2210.03629） | 思考 → 调工具 → 看结果的循环，项目的 rollout 就是这个模式 |
| | **Toolformer**（arXiv 2302.04761） | 模型学会调工具的早期工作 |
| ⭐ | **τ-bench**（arXiv 2406.12045） | 和项目最像的评测：有状态的模拟系统 + 按最终状态判分 |
| ⭐ | **BFCL** 伯克利函数调用排行榜（gorilla.cs.berkeley.edu/leaderboard），看 multi-turn 说明 | 项目的分布外评测，要知道它测什么、怎么判分 |
| | 综述 *The Landscape of Agentic Reinforcement Learning for LLMs: A Survey*（arXiv 2509.02547） | 当地图用，翻目录和分类图 |

## 第 3 阶段：用 RL 训练工具调用（约 1 周，和项目直接相关）

| | 论文 | 和项目的关系 |
|---|---|---|
| ⭐ | **ToolRL**（arXiv 2504.13958，NeurIPS 2025） | 工具调用奖励怎么设计，直接前辈 |
| | **Tool-N1**（arXiv 2505.00024） | 同样数据下 RL 比 SFT 好 |
| | **RAGEN**（arXiv 2504.20073） | 多轮 Agent RL 的训练崩溃问题 |
| | **verl / HybridFlow**（arXiv 2409.19256） | 项目用的训练框架，看框架图 |
| ⭐ | **Fission-GRPO**（arXiv 2601.15625） | Qwen3-1.7B + verl + 注入错误，**要超过的基线**（BFCL v4 multi-turn 20.38） |
| | **EnvFactory**（arXiv 2605.18703） | 1.7B / 4B 在 BFCL 上的参照数字 |

## 第 4 阶段：幻觉、撒谎、奖励作弊（论文主线，重点读）

| | 材料 | 和项目的关系 |
|---|---|---|
| ⭐ | Lilian Weng《Reward Hacking in Reinforcement Learning》（2024） | **奖励作弊入门最佳材料** |
| | Lilian Weng《Extrinsic Hallucinations in LLMs》 | 幻觉的基本概念 |
| ⭐ | OpenAI《Why Language Models Hallucinate》（arXiv 2509.04664） | 只给对错二值的评分会奖励瞎猜，论文的理论动机 |
| ⭐ | **The Reasoning Trap**（arXiv 2510.22977，ACL 2026） | 推理 RL 会让工具幻觉变多 |
| | **TruthRL**（ICML 2026，按标题搜） | 三档奖励（答对 / 弃答 / 瞎编）减少幻觉，奖励设计的近亲 |
| | Anthropic《Natural Emergent Misalignment from Reward Hacking》（arXiv 2511.18397） | 工业界真实的奖励作弊案例 |
| ⭐ | **StateAlign**（arXiv 2611.16304） | **最接近项目的工作**：覆盖"该问不问"，没覆盖谎报操作、编造 ID、危险操作、故障注入 |
| | Advani，τ²-bench 上的虚假成功（arXiv 2606.09863） | Agent 谎称成功的比例，论文动机 |

## 相关

- 方向调研报告：`workSpace/reports/后训练论文方向调研.md`
- 项目路线图：`workSpace/agentic-tool-rl/README.md`
