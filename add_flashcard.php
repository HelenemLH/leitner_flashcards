<?php
require_once 'connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['question'], $data['topic'], $data['choices'])) {
    $question = $data['question'];
    $topic = $data['topic'];
    $choices = $data['choices'];

    // insert flashcard
    $sql = "INSERT INTO flashcards (question, box, next_review_date, topic) VALUES (:question, 1, CURDATE(), :topic)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':question', $question);
    $stmt->bindParam(':topic', $topic);
    $stmt->execute();

    // get last inserted flashcard ID
    $flashcard_id = $pdo->lastInsertId();

    // insert choices
    foreach ($choices as $choice) {
        $sql_choice = "INSERT INTO choices (flashcard_id, choice, is_correct) VALUES (:flashcard_id, :choice, :is_correct)";
        $stmt_choice = $pdo->prepare($sql_choice);
        $stmt_choice->bindParam(':flashcard_id', $flashcard_id);
        $stmt_choice->bindParam(':choice', $choice['choice']);
        $stmt_choice->bindParam(':is_correct', $choice['is_correct']);
        $stmt_choice->execute();
    }

    echo "Flashcard added successfully!";
} else {
    echo "Error: Invalid input.";
}
?>