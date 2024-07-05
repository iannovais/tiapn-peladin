const userEndpoint = "http://localhost:8080/user";

async function getUsers() {
  try {
    verificarAutenticacao(); 
    const key = "Authorization";
    const response = await fetch(userEndpoint, {
      method: "GET",
      headers: new Headers({
        Authorization: localStorage.getItem(key),
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch usuario info");
    }
    const userData = await response.json();

    const loggedUserId = parseInt(localStorage.getItem("loggedUserId"));

    const filteredUserData = userData.filter(user => user.id !== loggedUserId);

    displayUserInfo(filteredUserData);
  } catch (error) {
    console.error("Error fetching usuario info:", error);
  }
}

function verificarAutenticacao() {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    window.location.href = "../Login/Login.html"; 
  }
}

function displayUserInfo(userData) {
  const userInfoContainer = document.getElementById("usuario-info");
  userInfoContainer.innerHTML = "";

  if (userData.length === 0) {
    userInfoContainer.innerHTML = `
      <div class='erro-nenhum-usuario-encontrado'>
        <div class='erro-nenhum-usuario-encontrado-img'>
          <img src='../assets/imagens/erro.svg'>
        </div>
        <br>
        <div class='mensagem-erro'>IH! Não conseguimos encontrar usuários</div>
      </div>
    `;
    return;
  }

  userData.forEach(user => {
    const userCard = `
    <div class="usuario-card">
      <div class="usuario-imagem">
        <img src="${user.fotoPerfil}" alt="Foto de Perfil">
      </div>
      <div class="usuario-conteudo">
        <h3 class="busca-username">${user.username}</h3>
        <p class="busca-nome">${user.nomeUsuario}</p>
        <a class="botoes-card-usuario" href="../Usuario/usuario.html?id=${user.id}"><i class="bi bi-pencil-square"></i> Ver Perfil</a>
      </div>
    </div>
    `;
    userInfoContainer.innerHTML += userCard;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  getUsers();
});

function search() {
  const searchInput = document.getElementById('searchInputUsuario').value.toLowerCase();
  const faqItems = document.querySelectorAll('.usuario-card');
  const errorMessage = document.getElementById('errorMessage');
  const userInfoContainer = document.getElementById('usuario-info');
  let hasResults = false;

  faqItems.forEach(item => {
    const username = item.querySelector('.busca-username').innerText.toLowerCase();
    const nomeUsuario = item.querySelector('.busca-nome').innerText.toLowerCase();
    const containsKeyword = username.includes(searchInput) || nomeUsuario.includes(searchInput);

    if (containsKeyword) {
      item.style.display = 'block';
      hasResults = true;
    } else {
      item.style.display = 'none';
    }
  });

  if (searchInput === '') {
    faqItems.forEach(card => {
      card.style.display = 'block';
    });
    errorMessage.style.display = 'none';
    userInfoContainer.style.display = 'flex';
  } else {
    if (hasResults) {
      errorMessage.style.display = 'none';
      userInfoContainer.style.display = 'flex';
    } else {
      errorMessage.style.display = 'block';
      userInfoContainer.style.display = 'none';
    }
  }
}
