<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=utf-8');

    $mysqli = new mysqli("localhost", "tasks", "", "tasks");

    if (isset($_GET['task'])) {
        $task = (int)$_GET['task'];

        $sql = "SELECT * FROM tasks WHERE id=" . $task;

        if ($result = $mysqli->query($sql)) {
            if ($result->num_rows > 0) {
                $res = $result->fetch_row();
                $taskid = $res[0];

                $return = [
                    'id' => $taskid,
                    'task' => $res[1],
                    'description' => $res[2],
                    'due' => $res[3],
                    'completed' => $res[4] == 1 ? true : false,
                ];
            } else {
                $return = null;
            }
        }
    } else {
        $sql = "SELECT * FROM tasks";

        if ($result = $mysqli->query($sql)) {
            if ($result->num_rows > 0) {
                while($row = $result->fetch_array()) {
                    $return[] = [
			            'id' => $row['id'],
                        'task' => $row['task'], 
                        'description' => $row['description'],
                        'due' => $row['due'],
                        'completed' => $row['completed'] == 1 ? true : false,
                    ];
                }
            } else {
                $return = null;
            }
        }
    }

    echo json_encode($return);
?>