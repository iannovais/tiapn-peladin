const idUsuario = localStorage.getItem('loggedUserId');

async function checkLogin() {
    const token = localStorage.getItem("Authorization");
    if (!token) {
        window.location.href = "../Login/login.html";
    }
}

async function cadastrarQuadra(event) {
    event.preventDefault();

    const endpoint = `http://localhost:8080/quadra`;

    const nomeQuadra = document.getElementById("input-nome-quadra").value;
    const endereco = document.getElementById("input-endereco").value;
    const valorAluguel = parseFloat(document.getElementById('input-aluguel').value);
    const capacidade = parseInt(document.getElementById("input-capacidade").value);
    const contatoDono = document.getElementById("input-contato").value;
    const description = document.getElementById("input-descricao").value;
    const fotoInput = document.getElementById("input-foto").files[0];

    const telefoneError = document.getElementById("telefone-error");
    const enderecoError = document.getElementById("endereco-error");

    if (contatoDono.length > 11) {
        telefoneError.innerText = "O número de telefone não pode ter mais de 11 dígitos.";
        telefoneError.style.display = 'block';
        return;
    } else {
        telefoneError.style.display = 'none';
    }

    if (endereco.length < 8) {
        enderecoError.innerText = "O endereço deve ter no mínimo 8 caracteres.";
        enderecoError.style.display = 'block';
        return;
    } else {
        enderecoError.style.display = 'none';
    }

    const quadraData = {
        fotoQuadra: '../assets/imgs_quadras/sem-foto-quadra.jpeg',
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
            const uploadResponse = await fetch('upload.php', {
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
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
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
        console.error("Erro ao cadastrar a quadra:", error);
        alert("Erro ao cadastrar a quadra: " + error.message);
    }
}

document.getElementById("botao-salvar-editar").addEventListener("click", cadastrarQuadra);

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

function showModalEdicaoConcluida() {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
        window.location.href = "../QuadrasUsuario/QuadrasUsuario.html";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            window.location.href = "../QuadrasUsuario/QuadrasUsuario.html";
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
    preencherContato();
    document.getElementById("botao-salvar-editar").addEventListener("click", cadastrarQuadra);
});

async function preencherContato() {
    try {
        const response = await fetch('http://localhost:8080/user/info', {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar informações do usuário.");
        }

        const userData = await response.json();
        document.getElementById("input-contato").value = userData.telefone;
    } catch (error) {
        console.error("Erro ao buscar o telefone do usuário:", error);
    }
}
