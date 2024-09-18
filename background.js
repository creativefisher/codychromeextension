chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('github.com')) {
    chrome.tabs.sendMessage(tabId, { action: "getRepoInfo" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateQuestions") {
    console.error("Received request to generate questions for repo:", request.repoName);
    generateQuestions(request.repoName)
      .then(questions => sendResponse({ questions }))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  } 
//   else if (request.action === "answerQuestion") {
//     answerQuestion(request.repoName, request.question)
//       .then(answer => sendResponse({ answer }))
//       .catch(error => sendResponse({ error: error.message }));
//     return true;
//   }
});

async function generateQuestions(repoName) {
  try {
    const response = await fetch('https://sourcegraph.sourcegraph.com/.api/cody/context', {
      method: 'POST',
      headers: {
        'Authorization': 'token sgp_083d447c8e825813_bf392d93e3d87cef9fecbf3922d29accdad3c357',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        repos: [{ name: repoName }],
        query: "Generate a list of 5 questions about this repository"
      })
    });

    const text = await response.text();
    console.log('Raw API response:', text);

    const data = JSON.parse(text);
    // Process the response to extract questions
    return data.results.map(result => result.chunkContent).flat();
  } catch (error) {
    console.error('Error in generateQuestions:', error);
    throw error;
  }
}

// async function answerQuestion(repoName, question) {
//   const response = await fetch('https://sourcegraph.sourcegraph.com/.api/cody/context', {
//     method: 'POST',
//     headers: {
//       'Authorization': 'token sgp_083d447c8e825813_bf392d93e3d87cef9fecbf3922d29accdad3c357',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       repos: [{ name: repoName }],
//       query: question
//     })
//   });

//   const data = await response.json();
//   // Process the response to extract the answer
//   // This is a simplified example; you'll need to parse the actual response
//   return data.results[0].chunkContent;
// }
