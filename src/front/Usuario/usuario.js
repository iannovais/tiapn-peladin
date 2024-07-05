window.addEventListener('DOMContentLoaded', function () {
    if (!localStorage.getItem("Authorization")) {
        window.location.href = "../Login/login.html";
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        if (userId) {
            fetchUserDetails(userId);
            fetchEstatisticas(userId);
        } else {
            showUserName();
        }
    }
});

function fetchUserDetails(userId) {
    const userEndpoint = `http://localhost:8080/user/${userId}`;

    fetch(userEndpoint, {
        method: "GET",
        headers: new Headers({
            Authorization: localStorage.getItem("Authorization"),
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
            return response.json();
        })
        .then(userData => {
            displayUserInfo(userData);
            checkUserId(userData.id);
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
        });
}

function fetchEstatisticas(userId) {
    const estatisticasEndpoint = `http://localhost:8080/estatisticas/${userId}`;

    fetch(estatisticasEndpoint, {
        method: "GET",
        headers: new Headers({
            Authorization: localStorage.getItem("Authorization"),
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch user statistics");
            }
            return response.json();
        })
        .then(estatisticasData => {
            displayEstatisticas(estatisticasData);
        })
        .catch(error => {
            console.error("Error fetching user statistics:", error);
        });
}

function displayUserInfo(userData) {
    const userName = userData.username;
    const userFoto = userData.fotoPerfil;

    const userNameElement = document.querySelector(".usuario-nome");
    userNameElement.textContent = userName;

    const userImageElement = document.querySelector(".usuario-imagem-user");
    userImageElement.innerHTML = '';
    if (userFoto) {
        const img = document.createElement("img");
        img.src = userFoto;
        img.alt = "Foto do usuário";
        img.classList.add("user-photo");
        userImageElement.appendChild(img);
    } else {
        userImageElement.textContent = "Sem foto disponível";
    }
}

function displayEstatisticas(estatisticas) {

    document.getElementById("classificacao-ataque").textContent = parseInt(estatisticas.ata);
    document.getElementById("classificacao-defesa").textContent = parseInt(estatisticas.def);
    document.getElementById("classificacao-forca").textContent = parseInt(estatisticas.forca);
    document.getElementById("numero-jogos").textContent = estatisticas.jogos;
    document.getElementById("numero-gols").textContent = estatisticas.gols;
    document.getElementById("numero-assistencias").textContent = estatisticas.assistencias;
    document.getElementById("numero-defesas").textContent = estatisticas.defesas;
    document.getElementById("numero-craque").textContent = estatisticas.craque_da_pelada + " vezes";
    document.getElementById("numero-bagre").textContent = estatisticas.bagre_da_pelada + " vezes";
}

function checkUserId(pageUserId) {
    const userInfoEndpoint = "http://localhost:8080/user/info";

    fetch(userInfoEndpoint, {
        method: "GET",
        headers: new Headers({
            Authorization: localStorage.getItem("Authorization"),
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch user info");
            }
            return response.json();
        })
        .then(userInfoData => {
            const loggedInUserId = userInfoData.id;

            if (pageUserId !== loggedInUserId) {
                document.querySelector(".editar-perfil").style.display = "none";
                document.querySelector(".deletar-conta").style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error fetching user info:", error);
        });
}

function showModal() {
    const modal = document.getElementById("confirmationModal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("confirmationModal");
    modal.style.display = "none";
}

document.getElementById("deleteButton").addEventListener("click", function () {
    showModal();
});

document.getElementById("confirmDeleteButton").addEventListener("click", function () {
    deleteUser();
});

document.getElementById("cancelDeleteButton").addEventListener("click", function () {
    closeModal();
});

document.querySelector(".modal .close").addEventListener("click", function () {
    closeModal();
});

async function deleteUser() {
    if (!localStorage.getItem("Authorization")) {
        console.error("Usuário não autenticado. Não é possível excluir usuário.");
        return;
    }

    const userInfoEndpoint = "http://localhost:8080/user/info";

    try {
        const userInfoResponse = await fetch(userInfoEndpoint, {
            method: "GET",
            headers: new Headers({
                Authorization: localStorage.getItem("Authorization"),
            }),
        });

        if (!userInfoResponse.ok) {
            throw new Error("Failed to fetch user info");
        }

        const userInfoData = await userInfoResponse.json();
        const userId = userInfoData.id;

        const deleteEndpoint = `http://localhost:8080/user/${userId}`;

        const response = await fetch(deleteEndpoint, {
            method: "DELETE",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            },
        });

        if (response.ok) {
            closeModal();
            window.location = "../login/login.html";
        } else {
            console.error("Falha ao excluir usuário");
        }
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
    }
}