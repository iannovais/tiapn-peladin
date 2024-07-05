<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_FILES["foto"]) && $_FILES["foto"]["error"] == UPLOAD_ERR_OK) {
        $foto_tmp_name = $_FILES["foto"]["tmp_name"];
        $foto_name = basename($_FILES["foto"]["name"]);
        $destination = "../assets/imgs_quadras/" . $foto_name;

        if (move_uploaded_file($foto_tmp_name, $destination)) {
            $foto_caminho = $destination;
            echo json_encode(["success" => true, "filePath" => $foto_caminho]);
        } else {
            echo json_encode(["success" => false, "message" => "Falha ao mover o arquivo para o diretório de destino."]);
        }
    } else {
        $error_message = isset($_FILES["foto"]["error"]) ? $_FILES["foto"]["error"] : "Erro desconhecido.";
        echo json_encode(["success" => false, "message" => "Erro no envio do arquivo de imagem: " . $error_message]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método de requisição inválido."]);
}
?>
