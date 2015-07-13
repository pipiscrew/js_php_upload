<?php
//var_dump($_FILES);
//var_dump($_POST);
//
//
//exit;
 
$filename = $_POST["ftp_filename"];
$overwrite = $_POST["overwrite"];
 
//the data got
//array(1) { ["myfile"]=> array(5) {
//["name"]=> string(6) "70.jpg"
//["type"]=> string(10) "image/jpeg"
//["tmp_name"]=> string(18) "/var/tmp/php7HREDP"
//["error"]=> int(0) ["size"]=> int(15229) } }
 
    $target_dir = "prod_img/";
    $target_file = $target_dir . $filename;//. basename($_FILES["myfile"]["name"]);
 
    if (file_exists($target_file))
        if ($overwrite==0)
        {
            echo "file already exists";
            exit;
        }
 
    if (move_uploaded_file($_FILES["myfile"]["tmp_name"], $target_file)) {
        echo json_encode(array("filename"=>$target_file,"msg"=>"uploaded"));
        //echo "uploaded";
    } else {
        echo json_encode(array("filename"=>$target_file,"msg"=>"Sorry, there was an error uploading your file."));
    }
 
?>