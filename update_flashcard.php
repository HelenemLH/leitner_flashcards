<?php
require_once 'connect.php';

$data = json_decode(file_get_contents('php://input'), true);
$flashcard_id = $data['flashcard_id'];
$isCorrect = $data['correct'];

// Get current flashcard data
$sql = "SELECT * FROM flashcards WHERE id = :flashcard_id";
$stmt = $pdo->prepare($sql);
$stmt->execute(['flashcard_id' => $flashcard_id]);
$flashcard = $stmt->fetch(PDO::FETCH_ASSOC);

$box = $flashcard['box'];
$next_review_date = $flashcard['next_review_date'];

// Update box and next_review_date
if ($isCorrect) {
    $box = min($box + 1, 5);  // Max box is 5
} else {
    $box = 1;  // Go back to box 1 if incorrect
}

// Define intervals between reviews for each box
$intervals = [1, 2, 5, 10, 20];  // Days between reviews for each box
$next_review_date = date('Y-m-d', strtotime("+{$intervals[$box - 1]} days"));

// Update the flashcard
$sql = "UPDATE flashcards SET box = :box, next_review_date = :next_review_date WHERE id = :flashcard_id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'box' => $box,
    'next_review_date' => $next_review_date,
    'flashcard_id' => $flashcard_id
]);

echo json_encode(['status' => 'success']);
?>