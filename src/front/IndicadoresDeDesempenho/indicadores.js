document.addEventListener("DOMContentLoaded", async function () {
    verificarAutenticacao();
    
    const urlParams = new URLSearchParams(window.location.search);
    const peladaId = urlParams.get('id');
    getPeladaInfo(peladaId);

    try {
        const peladasPerMonth = await fetchPeladasPerMonth();
        createPeladasChart(peladasPerMonth);
    } catch (error) {
        console.error("Erro ao inicializar o gráfico de peladas:", error);
    }

    renderChart();
    renderParticipacaoChart();

});

function verificarAutenticacao() {
    const token = localStorage.getItem("Authorization");
    if (!token) {
        window.location.href = "../Login/login.html"; // Redireciona para a página de login
    }
}

async function getPeladaInfo(peladaId) {
    try {
        const response = await fetch(`http://localhost:8080/pelada/${peladaId}`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });
        if (!response.ok) {
            throw new Error("Falha ao realizar o FETCH das informações da pelada");
        }
        const peladaData = await response.json();
        preencherCamposPelada(peladaData);
        preencherCamposQuadra(peladaData.quadra);
        preencherCamposDonoPelada(peladaData.user);
        getParticipantes(peladaId);
    } catch (error) {
        console.error("Erro no FETCH da pelada: ", error);
    }
}

function preencherCamposPelada(peladaData) {
    document.getElementById('nome-pelada').innerText = peladaData.nome;
    document.getElementById('duracao-pelada').innerText = peladaData.duracao;
    document.getElementById('horario-pelada').innerText = peladaData.hora;
    const dataPelada = new Date(peladaData.data);
    const dataFormatada = dataPelada.toLocaleDateString('pt-BR');
    document.getElementById('data-pelada').innerText = dataFormatada;
    document.getElementById('valor-pelada').innerText = peladaData.valorPelada;

    const imgElement = document.getElementById('foto-pelada');
    if (peladaData.foto) {
        imgElement.src = peladaData.foto;
        imgElement.style.display = 'block';
    }
}

function preencherCamposQuadra(quadraData) {
    if (!quadraData) return;

    document.getElementById('nome-quadra').innerText = quadraData.nomeQuadra;
    document.getElementById('endereco-quadra').innerText = quadraData.endereco;
}

function preencherCamposDonoPelada(donoData) {
    if (!donoData) return;

    const imgElement = document.getElementById('foto-dono');
    if (donoData.fotoPerfil) {
        imgElement.src = donoData.fotoPerfil;
        imgElement.style.display = 'block';
    }
    document.getElementById('nome-dono').innerText = donoData.username;
    document.getElementById('email-dono').innerText = donoData.email;
    document.getElementById('telefone-dono').innerText = donoData.telefone;
}

async function getParticipantes(peladaId) {
    try {
        const response = await fetch(`http://localhost:8080/pelada/${peladaId}/participantes`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });
        if (!response.ok) {
            throw new Error("Falha ao realizar o FETCH dos participantes da pelada");
        }
        const participantes = await response.json();
        preencherListaParticipantes(participantes);
    } catch (error) {
        console.error("Erro no FETCH dos participantes da pelada: ", error);
    }
}

function preencherListaParticipantes(participantes) {
    if (!participantes) return;

    const listaParticipantes = document.getElementById('lista-participantes');
    listaParticipantes.innerHTML = '';

    participantes.forEach(participante => {
        const listItem = document.createElement('div');
        listItem.className = 'participante-item';
        listItem.innerHTML = `<div id="infopelada-posicao-jogador">${participante.posicao}</div>${participante.username}`;
        listaParticipantes.appendChild(listItem);
    });
}

function copyToClipboard(elementId) {
    var copyText = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(copyText).then(function () {
        showModalSucesso()
    }, function (err) {
        console.error('Erro ao copiar: ', err);
    });
}

function showModalSucesso() {
    const modal = document.getElementById("modal-edicao-concluida");
    modal.style.display = "block";

    const btnFechar = document.getElementById("fechar-modal-edicao");
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}



async function fetchData() {
    try {
        const response = await fetch('http://localhost:8080/quadra/valor-medio-por-dia', {
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });

        if (!response.ok) {
            throw new Error("Falha ao obter os dados do servidor.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

async function renderChart() {
    const data = await fetchData();

    if (!data) return;

    const labels = data.map(item => new Date(item.data).toLocaleDateString());
    const valores = data.map(item => item.valorMedio);

    const ctx = document.getElementById('graficoValorMedio').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                borderColor: 'rgb(68, 166, 66)',
                backgroundColor: 'rgb(68, 166, 66)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#2d2e2d'
                    }
                },
                y: {
                    grid: {
                        color: '#2d2e2d'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

async function fetchPeladasPerMonth() {
    try {
        const response = await fetch("http://localhost:8080/pelada/peladas-por-mes", {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Não foi possível obter os dados de peladas por mês.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        throw error;
    }
}

function createPeladasChart(data) {
    const ctx = document.getElementById('peladasPorMesChart').getContext('2d');

    const sortedData = Object.entries(data).sort((a, b) => new Date(a[0]) - new Date(b[0]));

    const labels = sortedData.map(entry => entry[0]);
    const values = sortedData.map(entry => entry[1]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Peladas por Mês',
                data: values,
                backgroundColor: 'rgb(68, 166, 66)',
                borderColor: 'rgb(68, 166, 66)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#2d2e2d'
                    }
                },
                y: {
                    grid: {
                        color: '#2d2e2d'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

async function fetchParticipacaoData() {
    try {
        const response = await fetch('http://localhost:8080/participacoes/media-participacoes-mes', {
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });

        if (!response.ok) {
            throw new Error("Falha ao obter os dados do servidor.");
        }

        const data = await response.json();
        console.log(data); // Adicionado para verificar a estrutura dos dados
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

async function renderParticipacaoChart() {
    const data = await fetchParticipacaoData();

    if (typeof data !== 'object' || data === null) {
        console.error("Os dados retornados não são um objeto:", data);
        return;
    }


    const sortedData = Object.entries(data).sort((a, b) => new Date(a[0]) - new Date(b[0]));

    const labels = sortedData.map(entry => entry[0]);
    const valores = sortedData.map(entry => entry[1]);

    const ctx = document.getElementById('mediaParticipacoesPorMesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                borderColor: 'rgb(68, 166, 66)',
                backgroundColor: 'rgb(68, 166, 66)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#2d2e2d'
                    }
                },
                y: {
                    grid: {
                        color: '#2d2e2d'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}