document.getElementById("btnImportarCRLV").addEventListener("click", async function() {
    const fileInput = document.getElementById("documentoCRLV").files[0];

    if (!fileInput) {
        alert("Por favor, selecione um arquivo CRLV em PDF.");
        return;
    }

    const formData = new FormData();
    formData.append("documentoCRLV", fileInput);

    try {
        const response = await fetch("http://127.0.0.1:5000/extrair_crlv", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById("placa").value = data.placa || "";
            document.getElementById("renavam").value = data.renavam || "";
            document.getElementById("chassi").value = data.chassi || "";
            document.getElementById("marca").value = data.marca || "";
            document.getElementById("modelo").value = data.modelo || "";
            document.getElementById("ano").value = data.ano || "";
        } else {
            alert("Erro ao processar o CRLV: " + data.message);
        }
    } catch (error) {
        alert("Falha na importação do CRLV. Verifique o console para mais detalhes.");
        console.error(error);
    }
});
