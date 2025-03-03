document.addEventListener("DOMContentLoaded", function() {
    const cavaloMecanicoSelect = document.getElementById("cavaloMecanico");
    const carretasSelect = document.getElementById("carretas");
    const motoristaSelect = document.getElementById("motorista");
    const btnMontarConjunto = document.getElementById("btnMontarConjunto");
    const btnDesmontarConjunto = document.getElementById("btnDesmontarConjunto");
    const tabelaConjuntos = document.getElementById("tabelaConjuntos");

    carregarVeiculos();
    carregarMotoristas();
    atualizarTabelaConjuntos();

    btnMontarConjunto.addEventListener("click", () => {
        const cavalo = cavaloMecanicoSelect.value;
        const carretas = Array.from(carretasSelect.selectedOptions).map(opt => opt.value);
        const motorista = motoristaSelect.value;

        if (!cavalo || carretas.length === 0 || !motorista) {
            alert("Selecione todos os campos para montar o conjunto!");
            return;
        }

        const conjunto = {
            cavalo,
            carretas,
            motorista
        };

        let conjuntos = JSON.parse(localStorage.getItem("conjuntos")) || [];
        conjuntos.push(conjunto);
        localStorage.setItem("conjuntos", JSON.stringify(conjuntos));

        alert("Conjunto montado com sucesso!");
        atualizarTabelaConjuntos();
    });

    btnDesmontarConjunto.addEventListener("click", () => {
        const cavalo = cavaloMecanicoSelect.value;

        if (!cavalo) {
            alert("Selecione um cavalo mecânico para desmontar o conjunto.");
            return;
        }

        let conjuntos = JSON.parse(localStorage.getItem("conjuntos")) || [];
        conjuntos = conjuntos.filter(conjunto => conjunto.cavalo !== cavalo);
        localStorage.setItem("conjuntos", JSON.stringify(conjuntos));

        alert("Conjunto desmontado!");
        atualizarTabelaConjuntos();
    });

    function carregarVeiculos() {
        const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
        cavaloMecanicoSelect.innerHTML = "";
        carretasSelect.innerHTML = "";

        veiculos.forEach(veiculo => {
            if (veiculo.tipo === "Truck" || veiculo.tipo === "LS" || veiculo.tipo === "Bitrem" || veiculo.tipo === "Rodotrem") {
                const option = document.createElement("option");
                option.value = veiculo.placas[0]; // O cavalo mecânico sempre é a primeira placa
                option.textContent = veiculo.placas[0] + " (" + veiculo.tipo + ")";
                cavaloMecanicoSelect.appendChild(option);
            }

            if (veiculo.tipo !== "Truck") {
                veiculo.placas.slice(1).forEach(placa => {
                    const option = document.createElement("option");
                    option.value = placa;
                    option.textContent = placa + " (Carreta)";
                    carretasSelect.appendChild(option);
                });
            }
        });
    }

    function carregarMotoristas() {
        const motoristas = JSON.parse(localStorage.getItem("motoristas")) || [];
        motoristaSelect.innerHTML = "";
        motoristas.forEach(motorista => {
            const option = document.createElement("option");
            option.value = motorista.nome;
            option.textContent = motorista.nome;
            motoristaSelect.appendChild(option);
        });
    }

    function atualizarTabelaConjuntos() {
        const conjuntos = JSON.parse(localStorage.getItem("conjuntos")) || [];
        tabelaConjuntos.innerHTML = "";

        conjuntos.forEach(conjunto => {
            const row = document.createElement("tr");

            const tdCavalo = document.createElement("td");
            tdCavalo.textContent = conjunto.cavalo;
            row.appendChild(tdCavalo);

            const tdCarretas = document.createElement("td");
            tdCarretas.textContent = conjunto.carretas.join(", ");
            row.appendChild(tdCarretas);

            const tdMotorista = document.createElement("td");
            tdMotorista.textContent = conjunto.motorista;
            row.appendChild(tdMotorista);

            const tdAcoes = document.createElement("td");
            const btnRemover = document.createElement("button");
            btnRemover.textContent = "Desmontar";
            btnRemover.addEventListener("click", () => {
                desmontarConjunto(conjunto.cavalo);
            });
            tdAcoes.appendChild(btnRemover);
            row.appendChild(tdAcoes);

            tabelaConjuntos.appendChild(row);
        });
    }

    function desmontarConjunto(cavalo) {
        let conjuntos = JSON.parse(localStorage.getItem("conjuntos")) || [];
        conjuntos = conjuntos.filter(conjunto => conjunto.cavalo !== cavalo);
        localStorage.setItem("conjuntos", JSON.stringify(conjuntos));
        alert("Conjunto desmontado com sucesso!");
        atualizarTabelaConjuntos();
    }
});
