function loadNavbar() {
    const header = document.createElement('header');
    header.id = "header-inicial";

    header.innerHTML = `
    <header>
        <nav class="nav-bar">
            <div class="logo">
                <a href="../PaginaPrincipal/paginaprincipal.html">
                    <img src="../assets/imagens/Peladin transparente.png" alt="">
                </a>
            </div>
            <div class="login-button">
                <ul>
                    <li class="nav-item"><a class="nav-link"> </a></li>
                    <div id="dropdown-container">
                        <li class="nav-item" id="usernamenavDrop">
                            <a class="usernamenav" href="#"></a>
                            <div class="dropdown-deslogar" id="sairDropdown">
                                <a id="botao-sair-nav" onclick="Deslogar()">Sair</a>
                            </div>
                        </li>
                    </div>
                </ul>
            </div>
            <div class="mobile-menu-icon">
                <button onclick="menuShow()">
                    <img class="icon" src="../assets/imagens/menu.svg" alt="">
                </button>
            </div>
        </nav>
        <div class="mobile-menu">
            <ul>
                <li class="nav-item"><a class="usernamenav" href="#">Nome do Usuário</a></li>
            </ul>
        </div>
    </header>
  `;

    document.body.prepend(header);

    document.getElementById("sairDropdown").style.display = "none";

    document.getElementById("dropdown-container").addEventListener("mouseover", function () {
        document.getElementById("sairDropdown").style.display = "block";
        document.getElementById("sairDropdown").style.position = "absolute";
    });

    document.getElementById("dropdown-container").addEventListener("mouseout", function () {
        document.getElementById("sairDropdown").style.display = "none";
    });

    MostrarUserName();
}

document.addEventListener("DOMContentLoaded", loadNavbar);

function menuShow() {
    const menuMobile = document.querySelector('.mobile-menu');
    const icon = document.querySelector('.icon');
    menuMobile.classList.toggle('open');
    icon.src = menuMobile.classList.contains('open') ? "../assets/imagens/fechar-menu.svg" : "../assets/imagens/menu.svg";
}

function MostrarUserName() {
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
            const userName = userInfoData.username;
            const userNameElement = document.querySelector(".usernamenav");
            userNameElement.textContent = userName;
            userNameElement.addEventListener("click", function () {
                const userId = userInfoData.id;
                localStorage.setItem("loggedUserId", userId);
                window.location.href = `../Usuario/usuario.html?id=${userId}`;
            });
        })
        .catch(error => {
            console.error("Error fetching user info:", error);
        });
}

function Deslogar() {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("loggedUserId");
    window.location = "../Login/login.html";
}
