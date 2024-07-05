let userRatings = {};
let bagreDaPeladaId = null;
let craqueDaPeladaId = null;
const urlParams = new URLSearchParams(window.location.search);
const peladaId = urlParams.get('id');

document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o usuário está logado
  if (!localStorage.getItem("Authorization")) {
    window.location.href = "../Login/login.html"; 
    return;
  }

  if (peladaId) {
    getUsers(peladaId);
  } else {
    console.error("Pelada ID is missing from URL");
  }

  document.getElementById("sendRatingsButton").addEventListener("click", function () {
    sendRatings(peladaId);
  });
});

async function getUsers(peladaId) {
  try {
    const key = "Authorization";
    const response = await fetch(`http://localhost:8080/pelada/${peladaId}/participantes`, {
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
          <div class="rating" data-user-id="${user.id}">
            <span class="star" data-value="1">&#9733;</span>
            <span class="star" data-value="2">&#9733;</span>
            <span class="star" data-value="3">&#9733;</span>
            <span class="star" data-value="4">&#9733;</span>
            <span class="star" data-value="5">&#9733;</span>
          </div>
      </div>
    </div>
    `;
    userInfoContainer.innerHTML += userCard;
  });

  document.querySelectorAll('.rating').forEach(rating => {
    rating.addEventListener('click', function (e) {
      if (e.target.classList.contains('star')) {
        const stars = rating.querySelectorAll('.star');
        const ratingValue = e.target.getAttribute('data-value');
        stars.forEach(star => {
          if (star.getAttribute('data-value') <= ratingValue) {
            star.classList.add('selected');
          } else {
            star.classList.remove('selected');
          }
        });
        const userId = rating.getAttribute('data-user-id');
        userRatings[userId] = ratingValue;
      }
    });
  });
}

async function sendRatings(peladaId) {
  try {
    const allPlayersRated = Object.keys(userRatings).length === document.querySelectorAll('.rating').length;
    if (!allPlayersRated) {
      throw new Error("É necessário avaliar todos os jogadores antes de enviar as avaliações.");
    }

    let minRatingUserId = null;
    let maxRatingUserId = null;
    let minRatingValue = Infinity;
    let maxRatingValue = -Infinity;

    for (const [userId, ratingValue] of Object.entries(userRatings)) {
      const numericRating = parseInt(ratingValue);
      if (numericRating < minRatingValue) {
        minRatingValue = numericRating;
        minRatingUserId = userId;
      }
      if (numericRating > maxRatingValue) {
        maxRatingValue = numericRating;
        maxRatingUserId = userId;
      }
    }

    for (const [userId, ratingValue] of Object.entries(userRatings)) {
      const getEndpoint = `http://localhost:8080/estatisticas/${userId}`;
      const getResponse = await fetch(getEndpoint, {
        method: "GET",
        headers: new Headers({
          Authorization: localStorage.getItem("Authorization"),
        }),
      });

      if (!getResponse.ok) {
        throw new Error(`Falha ao obter as estatísticas do usuário ${userId}`);
      }

      const userStats = await getResponse.json();

      const craqueCount = userStats.craque_da_pelada || 0;
      const bagreCount = userStats.bagre_da_pelada || 0;

      const novaNotaGeral = userStats.nota_geral + parseInt(ratingValue);
      const novaAvaliacoes = userStats.avaliacoes + 1;
      const novaNotaParticipacao = novaNotaGeral / novaAvaliacoes;

      const patchEndpoint = `http://localhost:8080/estatisticas/${userId}`;
      const patchResponse = await fetch(patchEndpoint, {
        method: "PATCH",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorization"),
        }),
        body: JSON.stringify({
          nota_geral: novaNotaGeral,
          avaliacoes: novaAvaliacoes,
          nota_participacao: novaNotaParticipacao,
          craque_da_pelada: userId === maxRatingUserId ? craqueCount + 1 : craqueCount,
          bagre_da_pelada: userId === minRatingUserId ? bagreCount + 1 : bagreCount,
        }),
      });

      if (!patchResponse.ok) {
        throw new Error(`Falha ao atualizar o usuário ${userId}`);
      }
    }

    showModalSucesso();
  } catch (error) {
    console.error("Error updating ratings:", error);
    showModalErro();
  }
}

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

function showModalSucesso() {
  const modal = document.getElementById("modal-edicao-concluida");
  modal.style.display = "block";

  const btnFechar = document.getElementById("fechar-modal-edicao");
  btnFechar.addEventListener("click", function () {
    modal.style.display = "none";
    window.location.href = `../DadosDaPartida/DadosDaPartida.html?id=${peladaId}`;
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      window.location.href = `../DadosDaPartida/DadosDaPartida.html?id=${peladaId}`;
    }
  });
}

function showModalErro() {
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
