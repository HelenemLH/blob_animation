const summaryButton = document.getElementById('summary-button');

summaryButton.addEventListener('click', async () => {
    let selectedText = getSelectedText();
    
    if (selectedText) {
        let aiResponse = await getAIResponse(selectedText);
        
        // Display the response in the summary section
        document.getElementById("summary-text").innerText = aiResponse.summary; // Assuming API returns an object with 'summary'
        
        // Now, update the quiz section with questions if returned
        createQuiz(aiResponse.quiz); // Assuming API returns a 'quiz' field
    } else {
        alert("No text selected!");
    }
});
