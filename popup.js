document.addEventListener('DOMContentLoaded', () => {
  const questionSelect = document.getElementById('questionSelect');
  const answerDiv = document.getElementById('answer');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const tmpurl = new URL(tab.url);
    const repoName = tmpurl.hostname + tmpurl.pathname;
    chrome.runtime.sendMessage({ action: "generateQuestions", repoName }, (response) => {
      if (response.error) {
        answerDiv.textContent = `Error: ${response.error}`;
      } else {
        response.questions.forEach((question, index) => {
          const option = document.createElement('option');
          option.value = question;
          option.textContent = `Question ${index + 1}`;
          questionSelect.appendChild(option);
        });
      }
    });
  });

//   questionSelect.addEventListener('change', (event) => {
//     const selectedQuestion = event.target.value;
//     if (selectedQuestion) {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const tab = tabs[0];

//         const tmpurl = new URL(tab.url);
//         const repoName = tmpurl.hostname + tmpurl.pathname;

//         chrome.runtime.sendMessage({ action: "answerQuestion", repoName, question: selectedQuestion }, (response) => {
//           if (response.error) {
//             answerDiv.textContent = `Error: ${response.error}`;
//           } else {
//             answerDiv.textContent = response.answer;
//           }
//         });
//       });
//     }
//   });
});
