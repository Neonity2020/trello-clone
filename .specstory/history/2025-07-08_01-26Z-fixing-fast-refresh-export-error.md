<!-- Generated by SpecStory -->

# Fixing fast refresh export error (2025-07-08 01:26Z)

_**User**_

For the code present, we get this error:
```
Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.
```
How can I resolve this? If you propose a fix, please make it concise.

---

_**Assistant**_

你遇到的错误是因为 `src/contexts/BoardContext.tsx` 文件同时导出了组件（`BoardProvider`）和非组件（如 `useBoard`、类型定义等）。Vite/React Fast Refresh 要求每个文件只导出组件，非组件内容应单独放到其他文件。

**简明修复方案：**

1. 新建 `src/contexts/boardTypes.ts`，把所有类型（如 `Board`、`List`、`Card` 等接口）移到这里。
2. 新建 `src/contexts/useBoard.ts`，只导出 `useBoard` 钩子。
3. `BoardContext.tsx` 只保留 `BoardProvider` 组件和 context 定义，其他都 import 进来。

这样可以彻底解决 Fast Refresh 报错。

需要我帮你自动拆分这些文件吗？

---

_**User**_

是的

---

_**Assistant**_



---

