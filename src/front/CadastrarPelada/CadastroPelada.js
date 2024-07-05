let selectedQuadraId = null;
let quadraData = [];
let UserId = null;

function ajustarDataParaUTC(data) {
    let dataOriginal = new Date(data);
    let dataUTC = new Date(Date.UTC(dataOriginal.getFullYear(), dataOriginal.getMonth(), dataOriginal.getDate() + 2));
    return dataUTC.toISOString().split('T')[0];
}

async function pegarUser() {
    try {
        const response = await fetch("http://localhost:8080/user/info", {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            }
        });

        if (!response.ok) {
            throw new Error("Não foi possível obter os dados do usuario.");
        }
        const userData = await response.json();
        UserId = userData.id;
        return UserId;
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        throw error;
    }
}

async function carregarQuadras() {
    try {
        const response = await fetch("http://localhost:8080/quadra", {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            }
        });

        if (!response.ok) {
            throw new Error("Não foi possível obter os dados das quadras.");
        }

        quadraData = await response.json();
        displayQuadraInfo(quadraData);
    } catch (error) {
        console.error("Erro ao carregar quadras:", error);
    }
}

async function uploadImagem() {
    const fotoInput = document.getElementById("input-foto").files[0];

    if (fotoInput) {
        const formData = new FormData();
        formData.append('foto', fotoInput);

        try {
            const uploadResponse = await fetch('upload.php', {
                method: 'POST',
                body: formData
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResult.success) {
                throw new Error(uploadResult.message);
            }

            return uploadResult.filePath;
        } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error);
            alert("Erro ao fazer upload da imagem: " + error.message);
            throw error;
        }
    }

    return '../assets/imgs_peladas/sem-foto-pelada.jpg';
}

function exibirImagem(event) {
    var input = event.target;
    var reader = new FileReader();

    reader.onload = function () {
        var imgElement = document.getElementById('preview-imagem');
        imgElement.src = reader.result;
        imgElement.style.display = 'block';
    };

    reader.readAsDataURL(input.files[0]);
}

document.getElementById('preview-imagem').addEventListener('click', function () {
    document.getElementById('input-foto').click();
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        verificarAutenticacao();
        await pegarUser();
        carregarQuadras();
    } catch (error) {
        console.error("Erro na inicialização:", error);
    }
});

function mostrarForm(parteId) {
    const partes = document.querySelectorAll('.parte');
    partes.forEach(parte => parte.classList.add('hidden'));

    document.getElementById(parteId).classList.remove('hidden');
}

const quadraInfoContainer = document.getElementById("quadra-info");

function displayQuadraInfo(quadraData) {
    quadraInfoContainer.innerHTML = "";

    if (quadraData.length === 0) {
        quadraInfoContainer.innerHTML = `
        <div class='erro-nenhuma-quadra-encontrada'>
        <div class='erro-nenhuma-quadra-encontrada-img'>
        <img src='../assets/imagens/erro.svg'>
        </div>
        <br>
        <div class='mensagem-erro'>IH! Não conseguimos encontrar quadras disponíveis</div>
        </div>
        `;
        return;
    }

    quadraData.forEach(quadra => {
        const quadraCard = `
        <div class="quadra-card" data-id="${quadra.id}" onclick="cadastrarPelada(${quadra.id})">
        <div class="quadra-imagem"> 
        <img src="${quadra.fotoQuadra}" alt="Banner da quadra">
        </div>
        <div class="quadra-conteudo"> 
        <h3>${quadra.nomeQuadra}</h3>
        <p class="endereco-quadra"><i class="bi bi-geo-alt-fill"></i> ${quadra.endereco}</p>
        <div class="botoes-container">
        </div>
        </div>
        </div>
        `;
        quadraInfoContainer.innerHTML += quadraCard;
    });
}

async function cadastrarPelada(quadraId) {
    try {
        const endpoint = `http://localhost:8080/pelada`;

        const userId = UserId;
        const imageFilePath = await uploadImagem();

        const dataPelada = ajustarDataParaUTC(document.getElementById("input-data-pelada").value);

        const peladaData = {
            nome: document.getElementById("input-nome-pelada").value,
            descricao: document.getElementById("input-descricao-pelada").value,
            foto: imageFilePath,
            duracao: document.getElementById("input-duracao-pelada").value + ":00",
            hora: document.getElementById("input-horario-pelada").value + ":00",
            data: dataPelada,
            valorPelada: parseFloat(document.getElementById('input-valor-pelada').value),
            status: "criada",
            quadra: {
                id: parseInt(quadraId)
            },
            user: {
                id: parseInt(userId)
            }
        };

        if (!peladaData.nome || !peladaData.descricao || !peladaData.foto ||
            !peladaData.duracao || !peladaData.hora || !peladaData.data || isNaN(peladaData.valorPelada) ||
            !peladaData.status || isNaN(peladaData.quadra.id) || isNaN(peladaData.user.id)) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(peladaData)
        });

        if (response.ok) {
            const peladaCriada = await response.json();
            showModalEdicaoConcluida();
            await entrarNaPelada(peladaCriada.id);
        } else {
            showModalErroCadastro();
        }

    } catch (error) {
        console.error("Erro ao cadastrar a pelada:", error);
        alert("Erro ao cadastrar a pelada: " + error.message);
    }
}

async function entrarNaPelada(peladaId) {
    const userId = localStorage.getItem("loggedUserId");
    const token = localStorage.getItem("Authorization");

    const participacaoData = {
        user: { id: userId },
        pelada: { id: peladaId }
    };

    try {
        const response = await fetch(`http://localhost:8080/participacoes`, {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(participacaoData)
        });

        if (!response.ok) {
            throw new Error("Erro ao entrar na pelada.");
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao entrar na pelada:", error);
        alert("Erro ao entrar na pelada: " + error.message);
    }
}

function showModalEdicaoConcluida() {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
        window.location.href = "../PeladasUsuario/PeladasUsuario.html";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            window.location.href = "../PeladasUsuario/PeladasUsuario.html";
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

function verificarAutenticacao() {
    const token = localStorage.getItem("Authorization");
    if (!token) {
        window.location.href = "../Login/Login.html"; 
    }
}
