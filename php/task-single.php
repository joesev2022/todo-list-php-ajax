<?php 

    include('database.php');

    $id = $_POST['id'];

    if(isset($id)){
        $query = "SELECT * FROM tareas WHERE id ='$id'";

        $result = mysqli_query($connection, $query);

        if(!$result){
            die('Error Fail'.mysqli_error($connection));
        }

        $json = array();

        while($row = mysqli_fetch_array($result)){
            $json[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description']                
            );
        }
        
        $jsonString = json_encode($json[0]);
        echo $jsonString;
    }

?>