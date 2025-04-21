const player = document.getElementById("player");
const video = document.getElementById("video");
const playPause = document.getElementById("playPause");
const mute = document.getElementById("mute");
const volumeContainer = document.querySelector(".volume-container");
const volumeBar = document.querySelector(".volume-bar");
const volumeThumb = document.querySelector(".volume-thumb");
const volumeIcon = document.getElementById("volume-icon");
const fullscreen = document.getElementById("fullscreen");
const pip = document.getElementById("pip");
const speedToggle = document.getElementById("speed-toggle");
const speedMenu = document.getElementById("speed-menu");
const speedOptions = speedMenu.querySelectorAll("li");
const download = document.getElementById("download");
const track = video.textTracks[0]; // pega o primeiro track
const icon = toggleSubtitles.querySelector("span"); // pega o ícone dentro do botão
const loop = document.getElementById("loop");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");
const progressThumb = document.querySelector(".progress-thumb");
const pausedOverlay = document.getElementById("pausedOverlay");
const timeDisplay = document.getElementById("timeDisplay");
const timeDisplayFull = document.getElementById("timeDisplay-full");
const playOverlay = document.getElementById("play-overlay");
const controls = document.querySelector(".controls");
const saveFrame = document.getElementById("save-frame");
const restartVideo = document.getElementById("restart-video");
const toggleLoopMenu = document.getElementById("toggle-loop");
const togglePipMenu = document.getElementById("toggle-pip");
const toggleSubtitlesMenu = document.getElementById("toggle-subtitles");

// MENU DE CONTEXTO PERSONALIZADO

const customContextMenu = document.getElementById("custom-context-menu");

// Desativa o menu original
video.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const rect = video.getBoundingClientRect();
  const menuWidth = 180;
  const menuHeight = customContextMenu.offsetHeight;

  let left = e.clientX;
  let top = e.clientY;

  if (left + menuWidth > window.innerWidth) {
    left = window.innerWidth - menuWidth;
  }

  if (top + menuHeight > window.innerHeight) {
    top = window.innerHeight - menuHeight;
  }

  customContextMenu.style.left = `${left}px`;
  customContextMenu.style.top = `${top}px`;
  customContextMenu.style.display = "block";
});

// Ocultar menu ao clicar fora
window.addEventListener("click", () => {
  customContextMenu.style.display = "none";
});

// Funções do menu
customContextMenu.querySelector("#save-frame").addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  const link = document.createElement("a");
  link.download = "frame.jpg";
  link.href = canvas.toDataURL("image/jpeg");
  link.click();
});

customContextMenu.querySelector("#restart-video").addEventListener("click", () => {
  video.currentTime = 0;
  video.play();
});

customContextMenu.querySelector("#toggle-loop").addEventListener("click", () => {
  video.loop = !video.loop;
  loop.classList.toggle("loop-active", video.loop);
});

customContextMenu.querySelector("#toggle-pip").addEventListener("click", () => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
});

customContextMenu.querySelector("#toggle-subtitles").addEventListener("click", () => {
  const isShowing = track.mode === "showing";
  track.mode = isShowing ? "hidden" : "showing";
  if (!isShowing) {
    icon.classList.add("cc-active");
  } else {
    icon.classList.remove("cc-active");
  }
});

// TEMPO

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

video.addEventListener("loadedmetadata", () => {
  timeDisplay.textContent = formatTime(0);
});

video.addEventListener("timeupdate", () => {
  const percent = (video.currentTime / video.duration) * 100;
  progress.style.width = percent + "%";
  timeDisplay.textContent = formatTime(video.currentTime);
  timeDisplayFull.textContent = formatTime(video.duration);
});

// PAUSE E PLAY OVERLAY

playOverlay.addEventListener("click", () => {
  video.play();
  playOverlay.style.display = "none";
});

video.addEventListener("play", () => {
  playOverlay.style.display = "none";
});

video.addEventListener("play", function handleFirstPlay() {
  controls.classList.remove("not-started");
  video.removeEventListener("play", handleFirstPlay); // só uma vez
});

video.addEventListener("pause", () => {
  if (video.currentTime > 0 && !video.ended) {
    pausedOverlay.style.display = "flex";
  }
});

video.addEventListener("play", () => {
  pausedOverlay.style.display = "none";
  player.classList.remove("show-controls");
  playPause.innerHTML = '<span class="material-icons">pause</span>';
});

video.addEventListener("pause", () => {
  pausedOverlay.style.display = "flex";
  player.classList.add("show-controls");
  playPause.innerHTML = '<span class="material-icons">play_arrow</span>';
});

pausedOverlay.addEventListener("click", () => {
  playPause.click();
});

playPause.addEventListener("click", () => {
  if (video.paused) video.play();
  else video.pause();
});

video.addEventListener("click", () => {
  playPause.click();
});

// AVANÇAR E RETROCEDER com feedback

function showSeekSideFeedback(direction) {
  const left = document.getElementById("seek-left");
  const right = document.getElementById("seek-right");

  const target = direction === "left" ? left : right;

  target.style.opacity = "1";
  target.style.transform = "translateY(-50%) scale(1.1)";

  setTimeout(() => {
    target.style.opacity = "0";
    target.style.transform = "translateY(-50%) scale(1)";
  }, 400);
}

// VOLUME

let lastVolume = video.volume; // guarda o último volume antes do mute

mute.addEventListener("click", () => {
  if (video.muted || video.volume === 0) {
    video.muted = false;
    video.volume = lastVolume;
    updateVolumeUI(lastVolume);
  } else {
    lastVolume = video.volume > 0 ? video.volume : 0.5;
    video.muted = true;
    updateVolumeUI(0);
  }
  updateVolumeIcon();
});

function updateVolumeUI(volume) {
  const percent = volume * 100;
  volumeBar.style.width = percent + "%";
  volumeThumb.style.left = percent + "%";
  updateVolumeIcon();
}

function updateVolumeIcon() {
  if (video.muted || video.volume === 0) {
    volumeIcon.textContent = "volume_off";
  } else if (video.volume < 0.5) {
    volumeIcon.textContent = "volume_down";
  } else {
    volumeIcon.textContent = "volume_up";
  }
}

// Inicialização
video.volume = 1;
updateVolumeUI(video.volume);

volumeContainer.addEventListener("click", (e) => {
  const rect = volumeContainer.getBoundingClientRect();
  const newVolume = (e.clientX - rect.left) / rect.width;
  video.volume = Math.max(0, Math.min(1, newVolume));
  video.muted = false;
  updateVolumeUI(video.volume);
});

let isDraggingVolume = false;

volumeThumb.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDraggingVolume = true;
});

document.addEventListener("mousemove", (e) => {
  if (isDraggingVolume) {
    const rect = volumeContainer.getBoundingClientRect();
    let newVolume = (e.clientX - rect.left) / rect.width;
    newVolume = Math.max(0, Math.min(1, newVolume));
    video.volume = newVolume;
    video.muted = false;
    updateVolumeUI(newVolume);
  }
});

document.addEventListener("mouseup", () => {
  if (isDraggingVolume) {
    isDraggingVolume = false;
  }
});

function changeVolumeByArrow(amount) {
  let newVolume = Math.min(1, Math.max(0, video.volume + amount));
  video.volume = newVolume;
  video.muted = false;
  updateVolumeUI(newVolume);
  lastVolume = newVolume > 0 ? newVolume : lastVolume;
}

// FULLSCREEN

fullscreen.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

video.addEventListener("play", () => {
  hasStarted = true;
});

video.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// PICTURE IN PICTURE

pip.addEventListener("click", () => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
});

// VELOCIDADE

speedToggle.addEventListener("click", () => {
  speedMenu.classList.toggle("show");
});

speedOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const speed = parseFloat(option.dataset.speed);
    video.playbackRate = speed;

    speedOptions.forEach((opt) => opt.classList.remove("active"));
    option.classList.add("active");

    speedMenu.classList.remove("show");
  });
});

document.addEventListener("click", (e) => {
  const isClickInside =
    speedToggle.contains(e.target) || speedMenu.contains(e.target);

  if (!isClickInside) {
    speedMenu.classList.remove("show");
  }
});

// DOWNLOAD

download.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = video.currentSrc;
  a.download = "Ainz_VS_Gazef_Dublado.mp4";
  a.click();
});

// LEGENDAS

track.mode = "hidden";

toggleSubtitles.addEventListener("click", () => {
  const isShowing = track.mode === "showing";
  track.mode = isShowing ? "hidden" : "showing";

  if (!isShowing) {
    icon.classList.add("cc-active");
  } else {
    icon.classList.remove("cc-active");
  }
});

// LOOP

loop.addEventListener("click", () => {
  video.loop = !video.loop;
  loop.classList.toggle("loop-active", video.loop);
});

// BARRA DE PROGRESSO DO VÍDEO

let isDraggingProgress = false;

progressContainer.addEventListener("mousedown", (e) => {
  isDraggingProgress = true;
  updateProgressFromEvent(e);
});

document.addEventListener("mousemove", (e) => {
  if (isDraggingProgress) {
    updateProgressFromEvent(e);
  }
});

document.addEventListener("mouseup", () => {
  isDraggingProgress = false;
});

function updateProgressFromEvent(e) {
  const rect = progressContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(1, x / rect.width));
  video.currentTime = percent * video.duration;
  updateProgressBar();
}

function updateProgressBar() {
  const percent = (video.currentTime / video.duration) * 100;
  progress.style.width = `${percent}%`;
}

function updateProgressBar() {
  const percent = (video.currentTime / video.duration) * 100;
  progress.style.width = `${percent}%`;
  progressThumb.style.left = `${percent}%`;
}

// Também atualize enquanto o vídeo toca normalmente
video.addEventListener("timeupdate", updateProgressBar);

// ESMAECER

let inactivityTimeout;

function showControls() {
  player.classList.remove("hide-controls");
}

function hideControls() {
  player.classList.add("hide-controls");
}

function resetInactivityTimer() {
  showControls();
  clearTimeout(inactivityTimeout);

  // Tempo diferente dependendo da posição do mouse
  const timeoutDuration = controls.matches(":hover") ? 5000 : 3000;

  inactivityTimeout = setTimeout(hideControls, timeoutDuration);
}

// Detectar movimentação dentro do player
player.addEventListener("mousemove", resetInactivityTimer);
player.addEventListener("click", resetInactivityTimer);
player.addEventListener("mouseleave", () => {
  clearTimeout(inactivityTimeout);
  hideControls();
});

// Iniciar timer ao carregar
resetInactivityTimer();

  // KEYDOWN

  let hasStarted = false;

  document.addEventListener("keydown", (e) => {

    if (!hasStarted) return;

    if (e.code === "Space") {
      e.preventDefault(); // evita que a página role
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }

    if (e.key === "Escape") {
      speedMenu.classList.remove("show");
    }

    if (e.key.toLowerCase() === "f") {
      if (!document.fullscreenElement) {
        player.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }

    if (e.key.toLowerCase() === "c") {
      const isShowing = track.mode === "showing";
      track.mode = isShowing ? "hidden" : "showing";

      if (!isShowing) {
        icon.classList.add("cc-active");
      } else {
        icon.classList.remove("cc-active");
      }
    }
  
    if (e.key === "ArrowRight") {
      video.currentTime = Math.min(video.duration, video.currentTime + 5);
      showSeekSideFeedback("right");
    }
  
    if (e.key === "ArrowLeft") {
      video.currentTime = Math.max(0, video.currentTime - 5);
      showSeekSideFeedback("left");
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      changeVolumeByArrow(0.1); // Aumenta volume
    }
  
    if (e.key === "ArrowDown") {
      e.preventDefault();
      changeVolumeByArrow(-0.1); // Diminui volume
    }
  });