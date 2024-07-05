document.addEventListener("DOMContentLoaded", function () {
    verificarAutenticacao();
    const urlParams = new URLSearchParams(window.location.search);
    const peladaId = urlParams.get('id');
    getPeladaInfo(peladaId);
});

function verificarAutenticacao() {
    const token = localStorage.getItem("Authorization");
    if (!token) {
        window.location.href = "../Login/login.html"; 
    }
}

async function getPeladaInfo(peladaId) {
    try {
        const response = await fetch(`http://localhost:8080/pelada/${peladaId}`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });
        if (!response.ok) {
            throw new Error("Falha ao realizar o FETCH das informações da pelada");
        }
        const peladaData = await response.json();
        preencherCamposPelada(peladaData);
        preencherCamposQuadra(peladaData.quadra);
        preencherCamposDonoPelada(peladaData.user);
        getParticipantes(peladaId);
    } catch (error) {
        console.error("Erro no FETCH da pelada: ", error);
    }
}

function preencherCamposPelada(peladaData) {
    document.getElementById('nome-pelada').innerText = peladaData.nome;
    document.getElementById('duracao-pelada').innerText = peladaData.duracao;
    document.getElementById('horario-pelada').innerText = peladaData.hora;
    const dataPelada = new Date(peladaData.data);
    const dataFormatada = dataPelada.toLocaleDateString('pt-BR');
    document.getElementById('data-pelada').innerText = dataFormatada;
    document.getElementById('valor-pelada').innerText = peladaData.valorPelada;

    const imgElement = document.getElementById('foto-pelada');
    if (peladaData.foto) {
        imgElement.src = peladaData.foto;
        imgElement.style.display = 'block';
    }
}

function preencherCamposQuadra(quadraData) {
    if (!quadraData) return;

    document.getElementById('nome-quadra').innerText = quadraData.nomeQuadra;
    document.getElementById('endereco-quadra').innerText = quadraData.endereco;
}

function preencherCamposDonoPelada(donoData) {
    if (!donoData) return;

    const imgElement = document.getElementById('foto-dono');
    if (donoData.fotoPerfil) {
        imgElement.src = donoData.fotoPerfil;
        imgElement.style.display = 'block';
    }
    document.getElementById('nome-dono').innerText = donoData.username;
    document.getElementById('email-dono').innerText = donoData.email;
    document.getElementById('telefone-dono').innerText = donoData.telefone;
}

async function getParticipantes(peladaId) {
    try {
        const response = await fetch(`http://localhost:8080/pelada/${peladaId}/participantes`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });
        if (!response.ok) {
            throw new Error("Falha ao realizar o FETCH dos participantes da pelada");
        }
        const participantes = await response.json();
        preencherListaParticipantes(participantes);
    } catch (error) {
        console.error("Erro no FETCH dos participantes da pelada: ", error);
    }
}

function preencherListaParticipantes(participantes) {
    if (!participantes) return;

    const listaParticipantes = document.getElementById('lista-participantes');
    listaParticipantes.innerHTML = '';

    participantes.forEach(participante => {
        const listItem = document.createElement('div');
        listItem.className = 'participante-item';
        listItem.innerHTML = `<div id="infopelada-posicao-jogador">${participante.posicao}</div>${participante.username}`;
        listaParticipantes.appendChild(listItem);
    });
}

function copyToClipboard(elementId) {
    var copyText = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(copyText).then(function () {
        showModalSucesso()
    }, function (err) {
        console.error('Erro ao copiar: ', err);
    });
}

function showModalSucesso() {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}
