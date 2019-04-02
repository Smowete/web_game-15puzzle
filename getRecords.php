<?php

    $db = new PDO("mysql:dbname=15puzzle;host=<----HOST---->;charset=utf8;port=<----PORT---->", "root", "<----PASSWORD---->");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (!isset($_GET["mode"])) {
        header("HTTP/1.1 Bad request");
        die("missing parameters");
    }
    
    $mode = $_GET["mode"];
    
    switch ($mode) {
        case "moves":
            //$result_PDOStatement_object = $db->query("SELECT * FROM records ORDER BY moves,time LIMIT 10");
            $result_PDOStatement_object = $db->query("SELECT id, username, time, MIN(moves) FROM records GROUP BY username ORDER BY MIN(moves),time LIMIT 10");
            $result = $result_PDOStatement_object->fetchAll();
            $records = array();
            foreach ($result as $row) {
                $record = array("username" => $row[1], "time" => $row[2], "moves" => $row[3]);
                array_push($records, $record);
            }
            print(json_encode($records));
            break;
        
        case "time":
            //$result_PDOStatement_object = $db->query("SELECT * FROM records ORDER BY time,moves LIMIT 10");
            $result_PDOStatement_object = $db->query("SELECT id, username, MIN(time), moves FROM records GROUP BY username ORDER BY MIN(time),moves LIMIT 10");
            $result = $result_PDOStatement_object->fetchAll();
            $records = array();
            foreach ($result as $row) {
                $record = array("username" => $row[1], "time" => $row[2], "moves" => $row[3]);
                array_push($records, $record);
            }
            print(json_encode($records));
            break;

        default:
            header("HTTP/1.1 Bad request");
            die("Invalid mode");
    }

?>