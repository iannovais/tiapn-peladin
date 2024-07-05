async function login() {
    let username = document.getElementById("input-usuario").value;
    let password = document.getElementById("input-senha").value;

    const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json; charset=utf8",
            Accept: "application/json",
        }),
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    let key = "Authorization";
    let token = response.headers.get(key);
    window.localStorage.setItem(key, token);

    if (response.ok) {
        window.location = "../PaginaPrincipal/paginaprincipal.html";
    } else {
        document.getElementById("senha-incorreta").style.display = "block";
    }
};
