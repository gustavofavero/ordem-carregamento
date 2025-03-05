<?php
// Diretório onde os arquivos serão salvos
$uploadDir = '../uploads/cnh_motoristas/';

// Certifica-se de que o diretório existe
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Verifica se um arquivo foi enviado
if (isset($_FILES['cnh_file'])) {
    $fileName = basename($_FILES['cnh_file']['name']);
    $filePath = $uploadDir . $fileName;

    // Move o arquivo para o diretório de upload
    if (move_uploaded_file($_FILES['cnh_file']['tmp_name'], $filePath)) {
        echo "Arquivo enviado com sucesso!";
    } else {
        echo "Erro ao enviar o arquivo.";
    }
} else {
    echo "Nenhum arquivo foi enviado.";
}
?>
