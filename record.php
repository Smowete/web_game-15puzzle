<?php

    $db = new PDO("mysql:dbname=15puzzle;host=<----HOST---->;charset=utf8;port=<----PORT---->", "root", "<----PASSWORD---->");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (!isset($_GET["username"]) ||
        !isset($_GET["moves"]) ||
        !isset($_GET["time"])
            ) {
        header("HTTP/1.1 Bad request");
        die("missing parameters");
    }
    
    $username = $_GET["username"];
    $moves = $_GET["moves"];
    $time = $_GET["time"];
    
    $rowsAffected = $db->exec("
        INSERT INTO records
            (username, moves, time)
        VALUES
            ('$username', '$moves', '$time')
    ");
    
    print(json_encode(["result" => "success"]));



?>