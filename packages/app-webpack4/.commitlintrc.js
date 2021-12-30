/*
  build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
  ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
  docs：文档更新
  feat：新增功能
  merge：分支合并 Merge branch ? of ?
  fix：bug 修复
  perf：性能, 体验优化
  refactor：重构代码(既没有新增功能，也没有修复 bug)
  style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
  test：新增测试用例或是更新现有测试
  revert：回滚某个更早之前的提交
  chore：不属于以上类型的其他类型
*/

module.exports = {
  extends: ['@tutor/commitlint-recommended'],
};
