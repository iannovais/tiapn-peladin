const idUsuario = localStorage.getItem('loggedUserId');
const urlParams = new URLSearchParams(window.location.search);
const peladaId = urlParams.get('id');

async function checkLogin() {
    const token = localStorage.getItem("Authorization");
    if (!token) {
        window.location.href = "../Login/login.html";
    }
}

async function updateEstatistica() {
    try {
        const endpoint = `http://localhost:8080/estatisticas/${idUsuario}`;

        const golsNovos = parseInt(document.getElementById("gols").value);
        const assistenciasNovas = parseInt(document.getElementById("assistencias").value);
        const defesasNovas = parseInt(document.getElementById("defesas").value);

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });

        if (!response.ok) {
            throw new Error("Falha ao obter as informações atuais da estatística");
        }

        const estatisticaData = await response.json();

        const gols = estatisticaData.gols + golsNovos;
        const assistencias = estatisticaData.assistencias + assistenciasNovas;
        const defesas = estatisticaData.defesas + defesasNovas;
        const ata = estatisticaData.ata + (golsNovos * 0.1);
        const forca = estatisticaData.forca + (assistenciasNovas * 0.1);
        const def = estatisticaData.def + (defesasNovas * 0.1);
        const overall = (ata + forca + def) / 3;

        const estatisticaAtualizada = {
            gols,
            assistencias,
            defesas,
            ata,
            forca,
            def,
            overall
        };

        const patchResponse = await fetch(endpoint, {
            method: "PATCH",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(estatisticaAtualizada)
        });

        if (!patchResponse.ok) {
            throw new Error("Falha ao atualizar a estatística");
        }

        await updateParticipacaoStatus();

        showModalEdicaoConcluida();
    } catch (error) {
        console.error("Erro ao atualizar as estatísticas da partida:", error);
        alert("Erro ao atualizar as estatísticas da partida: " + error.message);
    }
}

async function updateParticipacaoStatus() {
    try {
        const participacaoEndpoint = `http://localhost:8080/participacoes/${idUsuario}/${peladaId}`;
        const statusAtualizado = { status: "avaliou" };

        console.log(`Endpoint: ${participacaoEndpoint}`);
        console.log('Status Atualizado:', statusAtualizado);

        const response = await fetch(participacaoEndpoint, {
            method: "PATCH",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(statusAtualizado)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta da API:', errorText);
            throw new Error("Falha ao atualizar o status da participação");
        }
    } catch (error) {
        console.error("Erro ao atualizar o status da participação:", error);
        alert("Erro ao atualizar o status da participação: " + error.message);
    }
}

function showModalEdicaoConcluida() {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
        window.location.href = "../PeladaEntradas/PeladasEntradas.html";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            window.location.href = "../PeladaEntradas/PeladasEntradas.html";
        }
    });
}

function showModalErroCadastro() {
    const modal = document.getElementById("modal-erro-cadastro");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-erro");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
});

document.getElementById("stats-form").addEventListener("submit", function (event) {
    event.preventDefault();
    updateEstatistica();
});

document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const input = this.parentNode.querySelector('input[type="number"]');
        const action = this.dataset.action;
        if (action === 'increase') {
            input.value = parseInt(input.value) + 1;
        } else if (action === 'decrease') {
            input.value = parseInt(input.value) - 1 >= 0 ? parseInt(input.value) - 1 : 0;
        }
    });
});
