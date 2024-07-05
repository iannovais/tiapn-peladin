const peladaEndpoint = "http://localhost:8080/pelada/user";

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
    const peladaCard = `
      <div class="pelada-card">
        <div class="pelada-imagem"> 
          <img src="${pelada.foto}" alt="Banner da pelada">
        </div>
        <div class="pelada-conteudo"> 
          <h3>${pelada.nome}</h3>
          <p class="endereco-pelada"><i class="bi bi-currency-dollar"></i> ${pelada.valorPelada}</p>
          <div class="botoes-container">
            <a class="botoes-card-peladas" href="../EditarPelada/EditarPelada.html?id=${pelada.id}"><i class="bi bi-pencil-square"></i> Editar</a>
            <a class="botoes-card-quadras delete-button" data-id="${pelada.id}"><i class="bi bi-trash-fill"></i> Remover </a>
          </div>
        </div>
      </div>
    `;
    peladaInfoContainer.innerHTML += peladaCard;
  });

  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach(button => {
    button.addEventListener("click", function () {
      const peladaId = this.getAttribute("data-id");
      showDeletePeladaModal(peladaId);
    });
  });
}

let peladaIdToDelete = null;

function showDeletePeladaModal(peladaId) {
  peladaIdToDelete = peladaId;
  const modal = document.getElementById("deletePeladaModal");
  modal.style.display = "block";

  const closeModal = () => {
    modal.style.display = "none";
    peladaIdToDelete = null;
  };

  document.querySelector("#deletePeladaModal .close").onclick = closeModal;
  document.getElementById("cancelDeletePeladaButton").onclick = closeModal;

  document.getElementById("confirmDeletePeladaButton").onclick = async () => {
    await deletePelada(peladaIdToDelete);
    closeModal();
  };
}

async function deletePelada(peladaId) {
  const deleteEndpoint = `http://localhost:8080/pelada/${peladaId}`;

  try {
    const response = await fetch(deleteEndpoint, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    });

    if (response.ok) {
      getPeladaInfo();
    } else {
      console.error("Falha ao excluir pelada");
    }
  } catch (error) {
    console.error("Erro ao excluir pelada:", error);
  }
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
  const token = localStorage.getItem(key);
  if (!token) {
    window.location.href = "../Login/login.html"; 
  }
}

document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();
  getPeladaInfo();
});
