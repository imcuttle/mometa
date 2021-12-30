const GIT_BRANCH = process.env.GIT_BRANCH;
const isOnlineBranch = !!GIT_BRANCH && /^(online)$/.test(GIT_BRANCH);
const isTestMainBranch = !!GIT_BRANCH && /^(master$)/.test(GIT_BRANCH);
const isTestOtherBranch = !isOnlineBranch && !isTestMainBranch;

module.exports = {
  isTestOtherBranch,
  isTestMainBranch,
  isOnlineBranch,
  GIT_BRANCH,
};
