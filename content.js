function isGitHubRepoPage() {
  const path = window.location.pathname.split('/');
  return path.length >= 3 && !path[2].includes('.');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getRepoInfo" && isGitHubRepoPage()) {
    const repoName = window.location.hostname + window.location.pathname;
    chrome.runtime.sendMessage({ action: "generateQuestions", repoName });
  }
});