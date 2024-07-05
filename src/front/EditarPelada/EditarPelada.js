const urlParams = new URLSearchParams(window.location.search);
const peladaId = urlParams.get('id');

function ajustarDataParaUTC(data) {
    let dataOriginal = new Date(data);
    let dataUTC = new Date(Date.UTC(dataOriginal.getFullYear(), dataOriginal.getMonth(), dataOriginal.getDate() + 2));
    return dataUTC.toISOString().split('T')[0];
}

async function checkLogin() {
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
        preencherCampos(peladaData);
    } catch (error) {
        console.error("Erro no FETCH da pelada: ", error);
    }
}

function preencherCampos(peladaData) {
    var data = new Date(peladaData.data);
    var dataFormatada = data.toISOString().split('T')[0];

    document.getElementById('input-nome-pelada').value = peladaData.nome;
    document.getElementById('input-descricao-pelada').value = peladaData.descricao;
    document.getElementById('input-duracao-pelada').value = peladaData.duracao.split(':')[0] + ':' + peladaData.duracao.split(':')[1];
    document.getElementById('input-horario-pelada').value = peladaData.hora.split(':')[0] + ':' + peladaData.hora.split(':')[1];
    document.getElementById('input-data-pelada').value = dataFormatada;
    document.getElementById('input-valor-pelada').value = peladaData.valorPelada;
    document.getElementById('preview-imagem').src = peladaData.foto;
    document.getElementById('preview-imagem').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    getPeladaInfo(peladaId);
});

async function updatePelada() {
    try {
        const endpoint = `http://localhost:8080/pelada/${peladaId}`;

        const nome = document.getElementById("input-nome-pelada").value;
        const descricao = document.getElementById("input-descricao-pelada").value;
        const duracao = document.getElementById("input-duracao-pelada").value + ":00";
        const hora = document.getElementById("input-horario-pelada").value + ":00";
        const data = ajustarDataParaUTC(document.getElementById("input-data-pelada").value);
        const valorPelada = parseFloat(document.getElementById("input-valor-pelada").value);
        const fotoInput = document.getElementById("input-foto").files[0];

        const peladaData = {
            nome,
            descricao,
            duracao,
            hora,
            data,
            valorPelada
        };

        if (fotoInput) {
            const formData = new FormData();
            formData.append('foto', fotoInput);

            try {
                const uploadResponse = await fetch('../CadastrarPelada/upload.php', {
                    method: 'POST',
                    body: formData
                });

                const uploadResult = await uploadResponse.json();

                if (!uploadResult.success) {
                    throw new Error(uploadResult.message);
                }

                peladaData.foto = uploadResult.filePath;
            } catch (error) {
                console.error("Erro ao fazer upload da imagem:", error);
                alert("Erro ao fazer upload da imagem: " + error.message);
                return;
            }
        } else {
            peladaData.foto = document.getElementById('preview-imagem').src;
        }

        const response = await fetch(endpoint, {
            method: "PATCH",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(peladaData)
        });

        if (response.ok) {
            showModalEdicaoConcluida();
        } else {
            showModalErroCadastro();
        }

    } catch (error) {
        console.error("Erro ao atualizar os dados da pelada:", error);
        alert("Erro ao atualizar os dados da pelada: " + error.message);
    }
}

document.getElementById("botao-salvar-editar").addEventListener("click", updatePelada);

function exibirImagem(event) {
    var input = event.target;
    var reader = new FileReader();

    reader.onload = function () {
        var imgElement = document.getElementById('preview-imagem');
        imgElement.src = reader.result;
        imgElement.style.display = 'block';
    }

    reader.readAsDataURL(input.files[0]);
}

document.getElementById('input-foto').addEventListener('change', exibirImagem);

document.getElementById('preview-imagem').addEventListener('click', function () {
    document.getElementById('input-foto').click();
});

function showModalEdicaoConcluida() {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
        window.location.href = "../PeladasUsuario/peladasusuario.html";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            window.location.href = "../PeladasUsuario/peladasusuario.html";
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
