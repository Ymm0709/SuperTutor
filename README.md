# CSP Super Tutor（变量与赋值）- React 版

这是一个使用 React 实现的 CSP Super Tutor，聚焦 AP CSP 中的 **Variables & Assignment** 概念。

- **可视化模型（抽象）**：用 variable 状态前后对比 + 赋值箭头展示赋值如何改变变量的值。
- **互动教学循环**：出题 → 判定 → 提示/HINT → 重测，支持多变量输入与错误诊断。
- **自适应重测**：根据常见误区（把赋值当等号、忽略覆盖、把复制当“跟着变”等）自动给针对性提示与相似题。

## 模式设计（覆盖 AP CSP 变量考点）

应用内提供 3 个模式，对应 AP CSP 中 variable 相关的不同层级：

- **Level 1 · 基础级（Basic）**  
  - 目标：掌握 variable 定义与基础赋值。  
  - 考点：命名规则、单次赋值、基础类型（int/str/bool）、简单读取与输出。

- **Level 2 · 进阶级（Intermediate）**  
  - 目标：理解赋值逻辑与变量运算。  
  - 考点：重新赋值（覆盖）、变量参与算术与字符串运算、两个变量之间的赋值与交换。

- **Level 3 · 挑战级（Challenge）**  
  - 目标：在更复杂语句中跟踪 variable 的变化。  
  - 考点：变量在多步赋值中的流转、变量间复制值 vs 独立值、使用临时变量完成交换等。

## 如何运行

在项目目录执行：

```bash
npm install
npm run dev
```

## 文件说明

- `src/App.jsx`：主应用与教学引擎状态机
- `src/components/Visualization.jsx`：变量与赋值的可视化模型
- `src/components/TeachingLoop.jsx`：出题/判定/提示/重测交互


