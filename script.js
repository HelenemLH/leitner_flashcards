let currentCardIndex = 0;
let flashcards = [];

// shuffle function (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// fetch flashcards from the server 
function loadFlashcards(topic) {
    fetch(`get_flashcards.php?topic=${topic}`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                flashcards = data;
                displayQuestion(currentCardIndex);
                document.getElementById("flashcard-container").classList.remove("hidden");
                document.getElementById("check-answer-btn").classList.remove("hidden");
            } else {
                document.getElementById("flashcard-container").innerHTML = "No flashcards available.";
            }
        })
        .catch(error => {
            document.getElementById("flashcard-container").innerHTML = "Error loading flashcards.";
            console.error('Error fetching flashcards:', error);
        });
}

// display current question and shuffled answers
function displayQuestion(index) {
    const flashcard = flashcards[index];
    document.getElementById("question").textContent = flashcard.question;

    const shuffledChoices = shuffle(flashcard.choices);

    document.getElementById("labelA").textContent = shuffledChoices[0].choice;
    document.getElementById("labelB").textContent = shuffledChoices[1].choice;
    document.getElementById("labelC").textContent = shuffledChoices[2].choice;

    document.getElementById("answerA").value = shuffledChoices[0].id;
    document.getElementById("answerB").value = shuffledChoices[1].id;
    document.getElementById("answerC").value = shuffledChoices[2].id;

    document.getElementById("feedbackA").innerHTML = "";
    document.getElementById("feedbackB").innerHTML = "";
    document.getElementById("feedbackC").innerHTML = "";
}

// check if selected answer is correct
function checkAnswer() {
    const selectedChoice = document.querySelector('input[name="flashcard-choice"]:checked');
    
    if (!selectedChoice) {
        alert('Please select an answer!');
        return;
    }

    const selectedChoiceId = parseInt(selectedChoice.value);
    const flashcard = flashcards[currentCardIndex];
    const correctChoice = flashcard.choices.find(choice => choice.is_correct === 1);

    const feedbackIcon = selectedChoiceId === correctChoice.id ? '✔️' : '❌';
    const feedbackElementId = selectedChoiceId === parseInt(document.getElementById("answerA").value) 
        ? "feedbackA" 
        : selectedChoiceId === parseInt(document.getElementById("answerB").value) 
        ? "feedbackB" 
        : "feedbackC";

    document.getElementById(feedbackElementId).innerHTML = feedbackIcon;

    document.getElementById("next-btn").classList.remove('hidden');
}

// move to the next flashcard
function nextFlashcard() {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    displayQuestion(currentCardIndex);
    document.getElementById("next-btn").classList.add('hidden');
    document.getElementById("check-answer-btn").classList.remove('hidden');
}

document.getElementById("start-quiz-btn").addEventListener("click", () => {
    const topic = document.getElementById("topics").value;
    loadFlashcards(topic);
});

document.getElementById("check-answer-btn").addEventListener("click", checkAnswer);
document.getElementById("next-btn").addEventListener("click", nextFlashcard);
