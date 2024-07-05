async function signup() {
    var formularioAtual = document.querySelector('.form-login:not([style*="none"])');
    if (!formularioAtual) {
        console.error("Elemento de formulário não encontrado.");
        return;
    }
    var camposObrigatorios = formularioAtual.querySelectorAll('[required]');
    var camposValidos = true;

    for (var i = 0; i < camposObrigatorios.length; i++) {
        if (camposObrigatorios[i].value.trim() === '') {
            camposValidos = false;
            camposObrigatorios[i].reportValidity();
            break;
        }
    }

    var emailInput = formularioAtual.querySelector('#input-email');
    if (emailInput && !emailInput.checkValidity()) {
        camposValidos = false;
        emailInput.reportValidity();
    }

    var senhaInput = formularioAtual.querySelector('#input-senha');
    var confirmarSenhaInput = formularioAtual.querySelector('#input-confirmar-senha');
    var erroConfirmarSenha = formularioAtual.querySelector('#erro-confirmar-senha');
    if (senhaInput && confirmarSenhaInput) {
        if (senhaInput.value !== confirmarSenhaInput.value) {
            camposValidos = false;
            adicionarErroSenha();
        } else {
            removerErroSenha();
            erroConfirmarSenha.style.display = 'none';
        }
    }

    var telefoneInput = formularioAtual.querySelector('#input-telefone');
    if (telefoneInput && telefoneInput.value.length > 11) {
        camposValidos = false;
        exibirAvisoTelefone();
    } else {
        removerAvisoTelefone();
    }

    if (camposValidos) {
        let username = document.getElementById("input-apelido").value;
        let password = document.getElementById("input-senha").value;
        let nomeUsuario = document.getElementById("input-nome").value;
        let dataNascimento = document.getElementById("input-nascimento").value;
        let email = document.getElementById("input-email").value;
        let posicao = document.querySelector('input[name="posicao"]:checked').value;
        let telefone = document.getElementById("input-telefone").value;

        let fotoInput = document.getElementById("input-foto").files[0];
        let fotoPerfil = '../assets/imgs_users/sem-foto.png';

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

                fotoPerfil = uploadResult.filePath;
            } catch (error) {
                console.error("Erro ao fazer upload da imagem:", error);
                alert("Erro ao fazer upload da imagem: " + error.message);
                return;
            }
        }

        let userData = {
            username: username,
            password: password,
            nomeUsuario: nomeUsuario,
            dataNascimento: dataNascimento,
            email: email,
            posicao: posicao,
            fotoPerfil: fotoPerfil,
            telefone: telefone
        };

        const response = await fetch("http://localhost:8080/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf8",
                Accept: "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            showModalEdicaoConcluida();
        } else {
            showModalErroCadastro();
        }
    }
}

function exibirAvisoTelefone() {
    var avisoTelefone = document.querySelector('#aviso-telefone');
    if (avisoTelefone) {
        avisoTelefone.style.display = 'block';
    }
}

function removerAvisoTelefone() {
    var avisoTelefone = document.querySelector('#aviso-telefone');
    if (avisoTelefone) {
        avisoTelefone.style.display = 'none';
    }
}

function mostrarForm(id) {
    var formularioAtual = document.querySelector('.form-login:not([style*="none"])');
    if (!formularioAtual) {
        console.error("Elemento de formulário não encontrado.");
        return;
    }
    var camposObrigatorios = formularioAtual.querySelectorAll('[required]');
    var camposValidos = true;

    for (var i = 0; i < camposObrigatorios.length; i++) {
        if (camposObrigatorios[i].value.trim() === '') {
            camposValidos = false;
            camposObrigatorios[i].reportValidity();
            break;
        }
    }

    var emailInput = formularioAtual.querySelector('#input-email');
    if (emailInput && !emailInput.checkValidity()) {
        camposValidos = false;
        emailInput.reportValidity();
    }

    var senhaInput = formularioAtual.querySelector('#input-senha');
    var confirmarSenhaInput = formularioAtual.querySelector('#input-confirmar-senha');
    var erroConfirmarSenha = formularioAtual.querySelector('#erro-confirmar-senha');
    if (senhaInput && confirmarSenhaInput) {
        if (senhaInput.value !== confirmarSenhaInput.value) {
            camposValidos = false;
            adicionarErroSenha();
        } else {
            removerErroSenha();
            erroConfirmarSenha.style.display = 'none';
        }
    }

    var telefoneInput = formularioAtual.querySelector('#input-telefone');
    if (telefoneInput && telefoneInput.value.length > 11) {
        camposValidos = false;
        exibirAvisoTelefone();
    } else {
        removerAvisoTelefone();
    }

    if (camposValidos) {
        document.getElementById(id).style.display = 'block';
        formularioAtual.style.display = 'none';
    }
}

function voltarForm(id) {
    var formularioAtual = document.querySelector('.form-login:not([style*="none"])');
    if (!formularioAtual) {
        console.error("Elemento de formulário não encontrado.");
        return;
    }

    document.getElementById(id).style.display = 'block';
    formularioAtual.style.display = 'none';
}

function adicionarErroSenha() {
    var senhaInput = document.querySelector('#input-senha');
    var confirmarSenhaInput = document.querySelector('#input-confirmar-senha');
    var erroConfirmarSenha = document.querySelector('#erro-confirmar-senha');

    if (senhaInput && confirmarSenhaInput) {
        senhaInput.classList.add('erro');
        confirmarSenhaInput.classList.add('erro');
        erroConfirmarSenha.style.display = 'block';
    }
}

function removerErroSenha() {
    var senhaInput = document.querySelector('#input-senha');
    var confirmarSenhaInput = document.querySelector('#input-confirmar-senha');
    var erroConfirmarSenha = document.querySelector('#erro-confirmar-senha');

    if (senhaInput && confirmarSenhaInput) {
        senhaInput.classList.remove('erro');
        confirmarSenhaInput.classList.remove('erro');
        erroConfirmarSenha.style.display = 'none';
    }
}

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

function showToast(id) {
    var toastElList = [].slice.call(document.querySelectorAll(id));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
}

function showModalEdicaoConcluida() {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
        window.location.href = "../Login/login.html";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            window.location.href = "../Login/login.html";
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