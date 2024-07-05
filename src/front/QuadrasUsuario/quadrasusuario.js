const quadraEndpoint = "http://localhost:8080/quadra/user";

async function getQuadraInfo() {
  try {
    const key = "Authorization";
    const response = await fetch(quadraEndpoint, {
      method: "GET",
      headers: new Headers({
        Authorization: localStorage.getItem(key),
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch quadra info");
    }
    const quadraData = await response.json();
    displayQuadraInfo(quadraData);
  } catch (error) {
    console.error("Error fetching quadra info:", error);
  }
}

const quadraInfoContainer = document.getElementById("quadra-info");

function displayQuadraInfo(quadraData) {
  quadraInfoContainer.innerHTML = "";

  if (quadraData.length === 0) {
    quadraInfoContainer.innerHTML = `
      <div class='erro-nenhuma-quadra-encontrada'>
        <div class='erro-nenhuma-quadra-encontrada-img'>
          <img src='../assets/imagens/erro.svg'>
        </div>
        <br>
        <div class='mensagem-erro'>IH! Não conseguimos encontrar suas quadras</div>
      </div>
    `;
    return;
  }

  quadraData.forEach(quadra => {
    const quadraCard = `
      <div class="quadra-card">
        <div class="quadra-imagem"> 
          <img src="${quadra.fotoQuadra}" alt="Banner da quadra">
        </div>
        <div class="quadra-conteudo"> 
          <h3>${quadra.nomeQuadra}</h3>
          <p class="endereco-quadra"><i class="bi bi-geo-alt-fill"></i> ${quadra.endereco}</p>
          <div class="botoes-container">
            <a class="botoes-card-quadras" href="../EditarQuadra/EditarQuadra.html?id=${quadra.id}"><i class="bi bi-pencil-square"></i> Editar</a>
            <a class="botoes-card-quadras delete-button" data-id="${quadra.id}"><i class="bi bi-trash-fill"></i> Remover </a>
          </div>
        </div>
      </div>
    `;
    quadraInfoContainer.innerHTML += quadraCard;
  });

  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach(button => {
    button.addEventListener("click", function () {
      const quadraId = this.getAttribute("data-id");
      showDeleteQuadraModal(quadraId);
    });
  });
}

let quadraIdToDelete = null;

function showDeleteQuadraModal(quadraId) {
  quadraIdToDelete = quadraId;
  const modal = document.getElementById("deleteQuadraModal");
  modal.style.display = "block";

  const closeModal = () => {
    modal.style.display = "none";
    quadraIdToDelete = null;
  };

  document.querySelector("#deleteQuadraModal .close").onclick = closeModal;
  document.getElementById("cancelDeleteQuadraButton").onclick = closeModal;

  document.getElementById("confirmDeleteQuadraButton").onclick = async () => {
    await deleteQuadra(quadraIdToDelete);
    closeModal();
  };
}

async function deleteQuadra(quadraId) {
  const deleteEndpoint = `http://localhost:8080/quadra/${quadraId}`;

  try {
    const response = await fetch(deleteEndpoint, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    });

    if (response.ok) {
      getQuadraInfo();
    } else {
      console.error("Falha ao excluir quadra");
    }
  } catch (error) {
    console.error("Erro ao excluir quadra:", error);
  }
}

function search() {
  const searchInput = document.getElementById('searchInputQuadra').value.trim().toLowerCase();
  const quadraCards = document.querySelectorAll('.quadra-card');
  const errorMessage = document.getElementById('errorMessage');
  let hasResults = false;

  quadraCards.forEach(card => {
    const nome = card.querySelector('h3').innerText.toLowerCase();
    const endereco = card.querySelector('.endereco-quadra').innerText.toLowerCase();
    const containsKeyword = nome.includes(searchInput) || endereco.includes(searchInput);

    if (containsKeyword) {
      card.style.display = 'block';
      hasResults = true;
    } else {
      card.style.display = 'none';
    }
  });

  if (searchInput === '') {
    quadraCards.forEach(card => {
      card.style.display = 'block';
    });
    errorMessage.style.display = 'none';
    quadraInfoContainer.style.display = 'flex';
  } else {
    if (hasResults) {
      errorMessage.style.display = 'none';
      quadraInfoContainer.style.display = 'flex';
    } else {
      errorMessage.style.display = 'block';
      quadraInfoContainer.style.display = 'none';
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
  getQuadraInfo();
});
