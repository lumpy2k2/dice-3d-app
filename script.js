// --- Datenmodell
const diceConfig = [
  { id: 1, color: 0x4caf50, name: "Würfel 1 (1,2)", values: [1, 2] },
  { id: 2, color: 0xffeb3b, name: "Würfel 2 (3,4)", values: [3, 4] },
  { id: 3, color: 0x2196f3, name: "Würfel 3 (5,6)", values: [5, 6] }
];

let currentDice = null;
let diceScene = null;

// --- UI‑Elemente
const menu = document.getElementById("menu");
const result = document.getElementById("result");
const rollResultEl = document.getElementById("roll-result");
const diceContainer = document.getElementById("dice-container");
const resetBtn = document.getElementById("reset");

const diceBtns = [
  document.getElementById("dice1"),
  document.getElementById("dice2"),
  document.getElementById("dice3")
];

// --- Würfel‑Auswahl
diceBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    currentDice = diceConfig[idx];
    menu.style.display = "none";
    result.style.display = "block";

    // Würfel animieren
    rollDice();
  });
});

resetBtn.addEventListener("click", () => {
  if (diceScene) {
    diceScene.remove();
    diceScene = null;
  }
  menu.style.display = "block";
  result.style.display = "none";
  rollResultEl.textContent = "";
});

// --- 3D‑Würfel mit Three.js
function rollDice() {
  const resultVal = currentDice.values[Math.floor(Math.random() * 2)]; // 1‑seitig auf 1 oder 2
  rollResultEl.textContent = `Gewürfelt: ${resultVal} (${currentDice.name})`;

  diceContainer.innerHTML = ""; // leeren für neuen Würfel

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(200, 200);
  renderer.setClearColor(0x1a1a1a);
  diceContainer.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 0, 8);

  // Licht
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Würfel (Cube)
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = [];
  for (let i = 0; i < 6; i++) {
    materials.push(new THREE.MeshStandardMaterial({
      color: currentDice.color,
      emissive: 0x333333,
      flatShading: true
    }));
  }
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  // Zahlen als einfache Texte (1 oder 2) auf der Oberseite
  const textGeometry = new THREE.TextGeometry
  // (nur illustrativ: in echter 3D‑App würde man Textures oder SVG benutzen)
  // Hier: wir nutzen nur eine „mock“‑Face‑Anzeige per Rotation

  // Zufällige Wurfdrehung
  const targetX = Math.random() * Math.PI * 4;
  const targetY = Math.random() * Math.PI * 4;

  let t = 0;
  function animate() {
    if (t < 1) {
      t += 0.03;
      cube.rotation.x = targetX * t;
      cube.rotation.y = targetY * t;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    } else {
      cube.rotation.x = targetX;
      cube.rotation.y = targetY;
      renderer.render(scene, camera);
    }
  }
  animate();

  diceScene = scene;
}