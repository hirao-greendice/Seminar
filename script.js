const grid = document.querySelector("#light-grid");
const root = document.documentElement;
const inputs = {
  rows: document.querySelector("#rows"),
  columns: document.querySelector("#columns"),
  speed: document.querySelector("#speed"),
  groupOneColor: document.querySelector("#group-one-color"),
  groupTwoColor: document.querySelector("#group-two-color"),
  sameColor: document.querySelector("#same-color"),
  offColor: document.querySelector("#off-color"),
  backgroundColor: document.querySelector("#background-color"),
  gap: document.querySelector("#gap"),
  lightSize: document.querySelector("#light-size"),
};
const speedValue = document.querySelector("#speed-value");
const controls = document.querySelector("#controls");
const settingsToggle = document.querySelector("#settings-toggle");
const toggleButton = document.querySelector("#toggle");
const resetButton = document.querySelector("#reset");

let lights = [];
let activeParity = 0;
let timerId;
let isPlaying = true;

settingsToggle.addEventListener("click", () => {
  const willOpen = controls.hidden;
  controls.hidden = !willOpen;
  settingsToggle.setAttribute("aria-expanded", String(willOpen));
});

function createGrid() {
  const rows = Number(inputs.rows.value);
  const columns = Number(inputs.columns.value);
  grid.replaceChildren();
  lights = [];
  grid.style.gridTemplateColumns = `repeat(${columns}, var(--light-spacing))`;
  grid.style.gridTemplateRows = `repeat(${rows}, var(--light-spacing))`;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const light = document.createElement("span");
      light.className = "light";
      light.dataset.parity = String((row + column) % 2);
      light.setAttribute("aria-hidden", "true");
      grid.append(light);
      lights.push(light);
    }
  }

  updateLights();
  updateLightSize();
}

function updateLightSize() {
  const size = `${inputs.lightSize.value}px`;
  lights.forEach((light) => {
    light.style.width = size;
    light.style.height = size;
  });
}

function updateLights() {
  lights.forEach((light) => {
    light.classList.toggle("is-on", Number(light.dataset.parity) === activeParity);
  });
}

function startTimer() {
  clearInterval(timerId);
  if (!isPlaying) return;

  timerId = setInterval(() => {
    activeParity = activeParity === 0 ? 1 : 0;
    updateLights();
  }, Number(inputs.speed.value));
}

function updateAppearance() {
  if (inputs.sameColor.checked) {
    inputs.groupTwoColor.value = inputs.groupOneColor.value;
  }
  root.style.setProperty("--group-one-color", inputs.groupOneColor.value);
  root.style.setProperty("--group-two-color", inputs.groupTwoColor.value);
  root.style.setProperty("--off-color", inputs.offColor.value);
  root.style.setProperty("--background-color", inputs.backgroundColor.value);
  root.style.setProperty("--light-spacing", `${inputs.gap.value}px`);
}

[inputs.rows, inputs.columns].forEach((input) => {
  input.addEventListener("change", createGrid);
});

inputs.speed.addEventListener("input", () => {
  speedValue.value = `${inputs.speed.value}ms`;
  startTimer();
});

[inputs.groupOneColor, inputs.groupTwoColor, inputs.offColor, inputs.backgroundColor, inputs.gap].forEach((input) => {
  input.addEventListener("input", updateAppearance);
});

inputs.lightSize.addEventListener("input", updateLightSize);

inputs.sameColor.addEventListener("change", () => {
  inputs.groupTwoColor.disabled = inputs.sameColor.checked;
  updateAppearance();
});

toggleButton.addEventListener("click", () => {
  isPlaying = !isPlaying;
  toggleButton.textContent = isPlaying ? "一時停止" : "再生";
  startTimer();
});

resetButton.addEventListener("click", () => {
  inputs.rows.value = 20;
  inputs.columns.value = 20;
  inputs.speed.value = 300;
  inputs.groupOneColor.value = "#ff2738";
  inputs.groupTwoColor.value = "#2775ff";
  inputs.sameColor.checked = false;
  inputs.groupTwoColor.disabled = false;
  inputs.offColor.value = "#000000";
  inputs.backgroundColor.value = "#08090b";
  inputs.gap.value = 24;
  inputs.lightSize.value = 16;
  speedValue.value = "300ms";
  activeParity = 0;
  isPlaying = true;
  toggleButton.textContent = "一時停止";
  updateAppearance();
  createGrid();
  startTimer();
});

updateAppearance();
createGrid();
startTimer();
