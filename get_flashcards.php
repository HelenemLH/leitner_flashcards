<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'connect.php';

$topic = isset($_GET['topic']) ? $_GET['topic'] : 'JavaScript';

$sql = "SELECT * FROM flashcards WHERE topic = :topic";
$stmt = $pdo->prepare($sql);
$stmt->execute(['topic' => $topic]);

$flashcards = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($flashcards) {
    foreach ($flashcards as &$flashcard) {
        $flashcard_id = $flashcard['id'];
        $sql_choices = "SELECT * FROM choices WHERE flashcard_id = :flashcard_id";
        $stmt_choices = $pdo->prepare($sql_choices);
        $stmt_choices->execute(['flashcard_id' => $flashcard_id]);
        $flashcard['choices'] = $stmt_choices->fetchAll(PDO::FETCH_ASSOC);
    }

    header('Content-Type: application/json');
    echo json_encode($flashcards);
} else {
    echo json_encode([]);
}
?>