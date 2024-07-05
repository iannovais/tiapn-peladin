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
  
  document.getElementById("sairDropdown").style.display = "none";
  
  document.getElementById("dropdown-container").addEventListener("mouseover", function() {
    document.getElementById("sairDropdown").style.display = "block";
    document.getElementById("sairDropdown").style.position = "absolute";
  });
  
  document.getElementById("dropdown-container").addEventListener("mouseout", function() {
    document.getElementById("sairDropdown").style.display = "none";
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    MostrarUserName();
  });