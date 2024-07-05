const peladaEndpoint = "http://localhost:8080/pelada";
const userPeladasEndpoint = "http://localhost:8080/pelada/user";
const userParticipacoesEndpoint = "http://localhost:8080/participacoes/user/participacoes";

document.addEventListener("DOMContentLoaded", async function () {
  if (!isLoggedIn()) {
    redirectToLogin();
  }
  await pegarUser();
  getPeladaInfo();
});

function isLoggedIn() {
  return localStorage.getItem("Authorization") !== null;
}

function redirectToLogin() {
  window.location.href = "../Login/Login.html";
}

async function getPeladaInfo() {
  try {
    const token = localStorage.getItem("Authorization");

    const response = await fetch(peladaEndpoint, {
      method: "GET",
      headers: new Headers({
        Authorization: token,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pelada info");
    }

    const peladaData = await response.json();

    const userPeladasResponse = await fetch(userPeladasEndpoint, {
      method: "GET",
      headers: new Headers({
        Authorization: token,
      }),
    });

    if (!userPeladasResponse.ok) {
      throw new Error("Failed to fetch user's peladas");
    }

    const userPeladasData = await userPeladasResponse.json();
    const userPeladasIds = userPeladasData.map(pelada => pelada.id);

    const userParticipacoesResponse = await fetch(userParticipacoesEndpoint, {
      method: "GET",
      headers: new Headers({
        Authorization: token,
      }),
    });

    if (!userParticipacoesResponse.ok) {
      throw new Error("Failed to fetch user's participacoes");
    }

    const userParticipacoesData = await userParticipacoesResponse.json();
    const userParticipacoesIds = userParticipacoesData.map(pelada => pelada.id);

    const excludedPeladasIds = [...new Set([...userPeladasIds, ...userParticipacoesIds])];

    displayPeladaInfo(peladaData, excludedPeladasIds);
  } catch (error) {
    console.error("Error fetching pelada info:", error);
  }
}

const peladaInfoContainer = document.getElementById("pelada-info");

function displayPeladaInfo(peladaData, excludedPeladasIds) {
  peladaInfoContainer.innerHTML = "";

  const peladasDisponiveis = peladaData.filter(pelada => pelada.status === "criada" && !excludedPeladasIds.includes(pelada.id));

  if (peladasDisponiveis.length === 0) {
    const userPeladasCount = peladaData.filter(pelada => excludedPeladasIds.includes(pelada.id)).length;
    if (userPeladasCount === 0) {
      peladaInfoContainer.innerHTML = `
        <div class='erro-nenhuma-pelada-encontrada'>
          <div class='erro-nenhuma-pelada-encontrada-img'>
            <img src='../assets/imagens/erro.svg'>
          </div>
          <br>
          <div class='mensagem-erro'>IH! Não temos nenhuma pelada!</div>
        </div>
      `;
    } else {
      peladaInfoContainer.innerHTML = `
        <div class='erro-nenhuma-pelada-encontrada'>
          <div class='erro-nenhuma-pelada-encontrada-img'>
            <img src='../assets/imagens/erro.svg'>
          </div>
          <br>
          <div class='mensagem-erro'>IH! Você já entrou em todas as peladas disponíveis!</div>
        </div>
      `;
    }
    return;
  }

  peladasDisponiveis.forEach(pelada => {
    const peladaCard = `
      <div class="pelada-card" id="pelada-${pelada.id}">
        <div class="pelada-imagem"> 
          <img src="${pelada.foto}" alt="Banner da pelada">
        </div>
        <div class="pelada-conteudo"> 
          <h3>${pelada.nome}</h3>
          <p class="valor-pelada"><i class="bi bi-currency-dollar"></i> ${pelada.valorPelada}</p>
          <div class="botoes-container">
            <a class="botao-card-peladas" onclick="entrarNaPelada(${pelada.id})"><i class="bi bi-box-arrow-in-right"></i> Entrar na Pelada</a>
          </div>
        </div>
      </div>
    `;
    peladaInfoContainer.innerHTML += peladaCard;
  });
}

function search() {
  const searchInput = document.getElementById('searchInputPelada').value.trim().toLowerCase();
  const peladaCards = document.querySelectorAll('.pelada-card');
  const errorMessage = document.getElementById('errorMessage');
  let hasResults = false;

  peladaCards.forEach(card => {
    const nome = card.querySelector('h3').innerText.toLowerCase();
    const containsKeyword = nome.includes(searchInput);

    if (containsKeyword) {
      card.style.display = 'block';
      hasResults = true;
    } else {
      card.style.display = 'none';
    }
  });

  if (searchInput === '') {
    peladaCards.forEach(card => {
      card.style.display = 'block';
    });
    errorMessage.style.display = 'none';
    peladaInfoContainer.style.display = 'flex';
  } else {
    if (hasResults) {
      errorMessage.style.display = 'none';
      peladaInfoContainer.style.display = 'flex';
    } else {
      errorMessage.style.display = 'block';
      peladaInfoContainer.style.display = 'none';
    }
  }
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
    localStorage.setItem("loggedUserId", userData.id);
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    throw error;
  }
}

async function entrarNaPelada(peladaId) {
  const userId = localStorage.getItem("loggedUserId");
  const token = localStorage.getItem("Authorization");

  const participacaoData = {
    user: { id: userId },
    pelada: { id: peladaId }
  };

  function showModalEdicaoConcluida() {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
      modal.style.display = "none";
      window.location.href = `../InfoPelada/InfoPelada.html?id=${peladaId}`;
    });

    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
        window.location.href = `../InfoPelada/InfoPelada.html?id=${peladaId}`;
      }
    });
  }

  try {
    const response = await fetch('http://localhost:8080/participacoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(participacaoData)
    });

    if (response.ok) {
      showModalEdicaoConcluida()
    } else {
      const errorData = await response.json();
      console.error("Erro do servidor:", errorData);
      throw new Error(errorData.message || 'Erro ao entrar na pelada');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Ocorreu um erro ao tentar entrar na pelada.');
  }
}

function redirectToInfoPelada(peladaId) {
  window.location.href = `../InfoPelada/InfoPelada.html?id=${peladaId}`;
}
