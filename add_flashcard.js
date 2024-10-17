document.getElementById('add-flashcard-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const question = document.getElementById('question').value;
    const topic = document.getElementById('topic').value;
    const choiceA = document.getElementById('choiceA').value;
    const choiceB = document.getElementById('choiceB').value;
    const choiceC = document.getElementById('choiceC').value;
    const correct = document.getElementById('correct').value;

    const correctAnswerIndex = correct === 'A' ? 0 : correct === 'B' ? 1 : 2;

    const data = {
        question: question,
        topic: topic,
        choices: [
            { choice: choiceA, is_correct: correctAnswerIndex === 0 ? 1 : 0 },
            { choice: choiceB, is_correct: correctAnswerIndex === 1 ? 1 : 0 },
            { choice: choiceC, is_correct: correctAnswerIndex === 2 ? 1 : 0 }
        ]
    };

    fetch('add_flashcard.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {
        document.getElementById('response').innerHTML = result;
        document.getElementById('add-flashcard-form').reset();
    })
    .catch(error => {
        document.getElementById('response').innerHTML = 'Error adding flashcard.';
        console.error('Error:', error);
    });
});
