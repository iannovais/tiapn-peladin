const urlParams = new URLSearchParams(window.location.search);
const quadraId = urlParams.get('id');

async function checkLogin() {
    const token = localStorage.getItem("Authorization");
    if (!token) {
        window.location.href = "../Login/login.html";
    }
}

async function getQuadraInfo(quadraId) {
    try {
        const response = await fetch(`http://localhost:8080/quadra/${quadraId}`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });
        if (!response.ok) {
            throw new Error("Falha ao realizar o FETCH das informações da quadra");
        }
        const quadraData = await response.json();
        preencherCampos(quadraData);
    } catch (error) {
        console.error("Erro no FETCH da quadra: ", error);
    }
}

function preencherCampos(quadraData) {
    document.getElementById('input-nome-quadra').value = quadraData.nomeQuadra;
    document.getElementById('input-endereco').value = quadraData.endereco;
    document.getElementById('input-aluguel').value = quadraData.valorAluguel;
    document.getElementById('input-capacidade').value = quadraData.capacidade;
    document.getElementById('input-contato').value = quadraData.contatoDono;
    document.getElementById('input-descricao').value = quadraData.description;

    if (quadraData.fotoQuadra) {
        document.getElementById('preview-imagem').src = quadraData.fotoQuadra;
        document.getElementById('preview-imagem').style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    getQuadraInfo(quadraId);
});

async function updateQuadra() {
    try {
        const endpoint = `http://localhost:8080/quadra/${quadraId}`;

        const nomeQuadra = document.getElementById("input-nome-quadra").value;
        const endereco = document.getElementById("input-endereco").value;
        const valorAluguel = parseFloat(document.getElementById("input-aluguel").value);
        const capacidade = parseInt(document.getElementById("input-capacidade").value);
        const contatoDono = document.getElementById("input-contato").value;
        const description = document.getElementById("input-descricao").value;
        const fotoInput = document.getElementById("input-foto").files[0];

        const telefoneError = document.getElementById("telefone-error");
        const enderecoError = document.getElementById("endereco-error");

        let valid = true;

        if (contatoDono.length > 11) {
            telefoneError.style.display = 'block';
            valid = false;
        } else {
            telefoneError.style.display = 'none';
        }

        if (endereco.length < 8) {
            enderecoError.style.display = 'block';
            valid = false;
        } else {
            enderecoError.style.display = 'none';
        }

        if (!valid) {
            return;
        }

        const quadraData = {
            nomeQuadra,
            endereco,
            valorAluguel,
            capacidade,
            contatoDono,
            description
        };

        if (fotoInput) {
            const formData = new FormData();
            formData.append('foto', fotoInput);

            try {
                const uploadResponse = await fetch('../CadastrarQuadra/upload.php', {
                    method: 'POST',
                    body: formData
                });

                const uploadResult = await uploadResponse.json();

                if (!uploadResult.success) {
                    throw new Error(uploadResult.message);
                }

                quadraData.fotoQuadra = uploadResult.filePath;
            } catch (error) {
                console.error("Erro ao fazer upload da imagem:", error);
                alert("Erro ao fazer upload da imagem: " + error.message);
                return;
            }
        } else {
            quadraData.fotoQuadra = document.getElementById('preview-imagem').src;
        }

        const response = await fetch(endpoint, {
            method: "PATCH",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quadraData)
        });

        if (response.ok) {
            showModalEdicaoConcluida();
        } else {
            showModalErroCadastro();
        }

    } catch (error) {
        console.error("Erro ao atualizar os dados da quadra:", error);
        alert("Erro ao atualizar os dados da quadra: " + error.message);
    }
}

document.getElementById("botao-salvar-editar").addEventListener("click", updateQuadra);

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

document.getElementById('preview-imagem').addEventListener('click', function () {
    document.getElementById('input-foto').click();
});

function showModalEdicaoConcluida() {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
        window.location.href = "../QuadrasUsuario/quadrasusuario.html";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            window.location.href = "../QuadrasUsuario/quadrasusuario.html";
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
