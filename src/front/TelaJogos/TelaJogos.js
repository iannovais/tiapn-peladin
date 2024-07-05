document.addEventListener("DOMContentLoaded", function () {
    checkAuthentication();
    const urlParams = new URLSearchParams(window.location.search);
    const peladaId = urlParams.get('id');

    if (peladaId) {
        getPeladaInfo(peladaId);
    } else {
        console.error("peladaId não encontrado na URL");
    }
});

let participantes = [];

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
        await getParticipantes(peladaId);
    } catch (error) {
        console.error("Erro no FETCH da pelada: ", error);
    }
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
        participantes = await response.json();
        preencherListaParticipantes(participantes);
    } catch (error) {
        console.error("Erro no FETCH dos participantes da pelada: ", error);
    }
}

function preencherListaParticipantes(participantesData) {
    if (!participantesData) return;

    const listaParticipantes = document.getElementById('lista-participantes-jogos');
    listaParticipantes.innerHTML = '';

    participantesData.forEach(participante => {
        const listItem = document.createElement('div');
        listItem.classList.add('participante-item');

        const participanteInfo = document.createElement('span');
        participanteInfo.innerText = `${participante.username}`;
        participanteInfo.classList.add('participante-info');

        const selectNumber = document.createElement('select');
        selectNumber.classList.add('input-number', 'custom-select');
        selectNumber.dataset.id = participante.id;

        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.innerText = 'Selecione';
        selectNumber.appendChild(optionDefault);

        const option1 = document.createElement('option');
        option1.value = '1';
        option1.innerText = 'Time 1';
        selectNumber.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = '2';
        option2.innerText = 'Time 2';
        selectNumber.appendChild(option2);

        selectNumber.addEventListener('change', atualizarTimes);

        listItem.appendChild(participanteInfo);
        listItem.appendChild(selectNumber);

        listaParticipantes.appendChild(listItem);
    });
}

function preencherCamposPelada(peladaData) {
    document.getElementById('nome-pelada').innerText = peladaData.nome;
}

function atualizarTimes() {
    const time1List = document.getElementById('time1-list');
    const time2List = document.getElementById('time2-list');

    time1List.innerHTML = '';
    time2List.innerHTML = '';

    participantes.forEach(participante => {
        const inputElement = document.querySelector(`.input-number[data-id='${participante.id}']`);
        if (inputElement) {
            const teamNumber = parseInt(inputElement.value);
            const listItem = document.createElement('li');
            listItem.innerText = participante.username;

            if (teamNumber === 1) {
                time1List.appendChild(listItem);
            } else if (teamNumber === 2) {
                time2List.appendChild(listItem);
            }
        }
    });
}

let timerInterval;
let timeRemaining;
let isMuted = false;
const audio = new Audio('../assets/sons/Alarm.wav');

audio.volume = 1.0;

function startTimer() {
    const durationInput = document.getElementById('duration');
    const duration = parseInt(durationInput.value) * 60;

    if (isNaN(duration) || duration <= 0) {
        showModalErro();
        return;
    }

    timeRemaining = duration;
    updateTimerDisplay();
    resetTimer();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            if (!isMuted) {
                audio.play();
            }
            showModalSucesso();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('duration').value = '';
    audio.pause();
    audio.currentTime = 0;
}

function toggleMute() {
    isMuted = !isMuted;
    const muteButton = document.getElementById('mute-button');
    if (isMuted) {
        muteButton.innerHTML = '<i class="bi bi-volume-down"></i>';
        muteButton.classList.add('muted');
    } else {
        muteButton.innerHTML = '<i class="bi bi-volume-mute"></i>';
        muteButton.classList.remove('muted');
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

function showModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

function setVolume(value) {
    audio.volume = value;
}

const volumeControl = document.getElementById('volume');

volumeControl.addEventListener('input', function () {
    const value = (volumeControl.value - volumeControl.min) / (volumeControl.max - volumeControl.min);
    volumeControl.style.background = 'linear-gradient(to right, var(--corprincipal) 0%, var(--corprincipal) ' + (value * 100) + '%, var(--cortextoprincipal) ' + (value * 100) + '%, var(--cortextoprincipal) 100%)';
});

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

function checkAuthentication() {
    const key = "Authorization";
    const token = localStorage.getItem(key);
    if (!token) {
        window.location.href = "../Login/login.html"; 
    }
}
