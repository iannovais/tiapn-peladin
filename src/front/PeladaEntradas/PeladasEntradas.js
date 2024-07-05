const peladaEndpoint = "http://localhost:8080/participacoes/user/participacoes";

async function getPeladaInfo() {
  try {
    const key = "Authorization";
    const response = await fetch(peladaEndpoint, {
      method: "GET",
      headers: new Headers({
        Authorization: localStorage.getItem(key),
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch pelada info");
    }
    const peladaData = await response.json();
    displayPeladaInfo(peladaData);
  } catch (error) {
    console.error("Error fetching pelada info:", error);
  }
}

const peladaInfoContainer = document.getElementById("pelada-info");

function displayPeladaInfo(peladaData) {
  peladaInfoContainer.innerHTML = "";

  if (peladaData.length === 0) {
    peladaInfoContainer.innerHTML = `
      <div class='erro-nenhuma-pelada-encontrada'>
        <div class='erro-nenhuma-pelada-encontrada-img'>
          <img src='../assets/imagens/erro.svg'>
        </div>
        <br>
        <div class='mensagem-erro'>IH! Não conseguimos encontrar suas peladas</div>
      </div>
    `;
    return;
  }

  peladaData.forEach(pelada => {
    const peladaCard = document.createElement('div');
    peladaCard.classList.add('pelada-card');
    peladaCard.dataset.peladaId = pelada.id;
    peladaCard.innerHTML = `
      <div class="pelada-imagem"> 
        <img src="${pelada.foto}" alt="Banner da pelada">
      </div>
      <div class="pelada-conteudo"> 
        <h3>${pelada.nome}</h3>
        <p class="endereco-pelada"><i class="bi bi-currency-dollar"></i> ${pelada.valorPelada}</p>
        <div class="botoes-container" id="botoes-container-${pelada.id}">
        </div>
      </div>
    `;

    peladaInfoContainer.appendChild(peladaCard);

    const botoesContainer = document.getElementById(`botoes-container-${pelada.id}`);

    switch (pelada.status) {
      case 'criada':
        botoesContainer.innerHTML = `
          <button class="login-botao-entrar" id="botao-ver-participantes-${pelada.id}">Ver info</button>
        `;
        break;
      case 'em_andamento':
        if (pelada.user.id == getLoggedUserId()) {
          botoesContainer.innerHTML = `
            <button class="login-botao-entrar" id="botao-ver-tela-jogo-${pelada.id}">Tela Jogo</button>
          `;
        } else {
          botoesContainer.innerHTML = `
          <button class="login-botao-entrar" id="botao-ver-participantes-${pelada.id}">Ver info</button>
          `;
        }
        break;
      case 'aguardando_avaliacoes':
        if (pelada.user.id == getLoggedUserId()) {
          botoesContainer.innerHTML = `
            <button class="login-botao-entrar" id="botao-avaliar-participacao-${pelada.id}">Avaliar Participação</button>
          `;
        } else {
          botoesContainer.innerHTML = `
            <button class="login-botao-entrar" id="botao-inserir-dados-${pelada.id}">Inserir Dados</button>
          `;
        }
        break;
      case 'encerrada':
        botoesContainer.innerHTML = `
          <button class="login-botao-entrar" id="botao-ver-participantes-${pelada.id}">Ver info</button>
        `;
        break;
      default:
        break;
    }

    const verParticipantesButton = document.getElementById(`botao-ver-participantes-${pelada.id}`);
    if (verParticipantesButton) {
      verParticipantesButton.addEventListener('click', function () {
        redirectToInfoPelada(pelada.id);
      });
    }

    const verTelaJogo = document.getElementById(`botao-ver-tela-jogo-${pelada.id}`);
    if (verTelaJogo) {
      verTelaJogo.addEventListener('click', function () {
        redirectToTelaJogo(pelada.id);
      });
    }

    const avaliarParticipacaoButton = document.getElementById(`botao-avaliar-participacao-${pelada.id}`);
    if (avaliarParticipacaoButton) {
      avaliarParticipacaoButton.addEventListener('click', function () {
        redirectToAvaliarJogadores(pelada.id);
      });
    }

    const inserirDadosButton = document.getElementById(`botao-inserir-dados-${pelada.id}`);
    if (inserirDadosButton) {
      inserirDadosButton.addEventListener('click', function () {
        redirectToInserirDados(pelada.id);
      });
    }

  });
}

function getLoggedUserId() {
  return localStorage.getItem("loggedUserId");
}

function redirectToInfoPelada(peladaId) {
  window.location.href = `../InfoPelada/InfoPelada.html?id=${peladaId}`;
}

function redirectToTelaJogo(peladaId) {
  window.location.href = `../TelaJogos/TelaJogos.html?id=${peladaId}`;
}

function redirectToAvaliarJogadores(peladaId) {
  window.location.href = `../AvaliarParticipacao/AvaliarParticipacao.html?id=${peladaId}`;
}

function redirectToInserirDados(peladaId) {
  window.location.href = `../DadosDaPartida/DadosDaPartida.html?id=${peladaId}`;
}

function search() {
  const searchInput = document.getElementById('searchInputPelada').value.trim().toLowerCase();
  const peladaCards = document.querySelectorAll('.pelada-card');
  const errorMessage = document.getElementById('errorMessage');
  let hasResults = false;

  peladaCards.forEach(card => {
    const nome = card.querySelector('h3').innerText.toLowerCase();
    const endereco = card.querySelector('.endereco-pelada').innerText.toLowerCase();
    const containsKeyword = nome.includes(searchInput) || endereco.includes(searchInput);

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

function checkAuthentication() {
  const key = "Authorization";
  if (!localStorage.getItem(key)) {
    window.location.href = "../Login/Login.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();
  getPeladaInfo();
});
