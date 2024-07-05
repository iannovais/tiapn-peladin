async function updateUser() {
    try {
        const telefone = document.getElementById("input-telefone").value;
        const telefoneError = document.getElementById("telefone-error");

        if (telefone.length !== 11) {
            telefoneError.style.display = 'block';
            return;
        } else {
            telefoneError.style.display = 'none';
        }

        const endpoint = `http://localhost:8080/user/${localStorage.getItem('id')}`;

        const userData = {
            username: document.getElementById("input-apelido").value,
            nome_usuario: document.getElementById("input-nome").value,
            telefone: telefone,
            posicao: document.querySelector('input[name="posicao"]:checked').value,
        };

        const fotoInput = document.getElementById("input-foto").files[0];

        if (fotoInput) {
            const formData = new FormData();
            formData.append('foto', fotoInput);

            try {
                const uploadResponse = await fetch('../Registro/upload.php', {
                    method: 'POST',
                    body: formData
                });

                const uploadResult = await uploadResponse.json();

                if (!uploadResult.success) {
                    throw new Error(uploadResult.message);
                }

                userData.foto_perfil = uploadResult.filePath;
            } catch (error) {
                console.error("Erro ao fazer upload da imagem:", error);
                alert("Erro ao fazer upload da imagem: " + error.message);
                return;
            }
        } else {
            userData.foto_perfil = document.getElementById('preview-imagem').src;
        }

        const response = await fetch(endpoint, {
            method: "PATCH",
            headers: new Headers({
                Authorization: localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const oldUsername = localStorage.getItem("oldUsername");
            const newUsername = userData.username;
            if (oldUsername !== newUsername) {
                showModalEdicaoConcluida(true);
            } else {
                showModalEdicaoConcluida(false);
            }
        } else {
            showModalErroCadastro();
        }
    } catch (error) {
        console.error("Erro ao atualizar os dados do usuário:", error);
    }
}

document.getElementById('preview-imagem').addEventListener('click', function () {
    document.getElementById('input-foto').click();
});

document.getElementById("botao-salvar-editar").addEventListener("click", updateUser);

async function preencherCamposUsuario() {
    try {
        const endpoint = "http://localhost:8080/user/info";

        const response = await fetch(endpoint, {
            method: "GET",
            headers: new Headers({
                Authorization: localStorage.getItem("Authorization"),
            })
        });

        if (!response.ok) {
            throw new Error("Não foi possível obter os dados do usuário.");
        }

        const userData = await response.json();
        localStorage.setItem("oldUsername", userData.username);

        document.getElementById("input-apelido").value = userData.username;
        document.getElementById("input-nome").value = userData.nomeUsuario;
        document.getElementById("input-telefone").value = userData.telefone;
        document.getElementById("preview-imagem").src = userData.fotoPerfil;
        document.getElementById("preview-imagem").style.display = "block";
        document.getElementById(userData.posicao).checked = true;
        localStorage.setItem('id', userData.id);

    } catch (error) {
        console.error("Erro ao preencher os campos do formulário:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    preencherCamposUsuario();
});

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

function showModalEdicaoConcluida(editouUsername) {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
        if (editouUsername) {
            Deslogar();
        } else {
            window.location.href = "../PaginaPrincipal/paginaprincipal.html";
        }
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            if (editouUsername) {
                Deslogar();
            } else {
                window.location.href = "../PaginaPrincipal/paginaprincipal.html";
            }
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

function Deslogar() {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("loggedUserId");
    window.location = "../Login/login.html";
}

function checkLogin() {
    const token = localStorage.getItem("Authorization");
    if (!token) {
        window.location.href = "../Login/login.html";
    }
}
