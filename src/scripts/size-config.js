const settingsContainer = document.getElementById("settings-container")

// Esconde os botões individuais em telas pequenas
function toggleResponsiveControls() {
  const isSmall = window.innerWidth < 600;
  document.getElementById("loop").style.display = isSmall ? "none" : "inline-block";
  document.getElementById("speed-toggle").style.display = isSmall ? "none" : "inline-block";
  document.getElementById("toggleSubtitles").style.display = isSmall ? "none" : "inline-block";
  document.getElementById("download").style.display = isSmall ? "none" : "inline-block";
  settingsContainer.style.display = isSmall ? "inline-block" : "none";
}

window.addEventListener("resize", toggleResponsiveControls);
window.addEventListener("load", toggleResponsiveControls);

// Abrir/fechar menu
const settingsToggle = document.getElementById("settings-toggle");
const settingsMenu = document.getElementById("settings-menu");
settingsToggle.addEventListener("click", () => {
  settingsMenu.classList.toggle("hidden");
  settingsToggle.classList.toggle("rotate");
});

// Ações dos itens do menu
const settingsLoop = document.getElementById("settings-loop");
const settingsSpeed = document.getElementById("settings-speed");
const settingsSubtitles = document.getElementById("settings-subtitles");
const settingsDownload = document.getElementById("settings-download");

settingsLoop.addEventListener("click", () => loop.click());
settingsSpeed.addEventListener("click", () => speedToggle.click());
settingsSubtitles.addEventListener("click", () => toggleSubtitles.click());
settingsDownload.addEventListener("click", () => download.click());