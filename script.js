const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");
const mainContent = document.getElementById("mainContent");
const modal = document.getElementById("storyModal");
const storyContent = document.getElementById("storyContent");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

startBtn.onclick = () => {
    intro.style.display = "none";
    mainContent.classList.remove("hidden");
};

// Story Modal
function openStory(num) {
    modal.classList.remove("hidden");
    storyContent.innerHTML = `
        <h2>Memory ${num}</h2>
        <p>This was such a special moment ❤️</p>
        <div>
            <img src="files/story${num}_1.jpg">
            <img src="files/story${num}_2.jpg">
            <img src="files/story${num}_3.jpg">
        </div>
    `;
}

function closeStory() {
    modal.classList.add("hidden");
}

// Puzzle
let solved = false;
document.querySelectorAll(".puzzle-piece").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.style.background = "#ff4d6d";
        checkPuzzle();
    });
});

function checkPuzzle() {
    if (solved) return;
    const allPink = [...document.querySelectorAll(".puzzle-piece")]
        .every(btn => btn.style.background !== "");
    if (allPink) {
        solved = true;
        launchConfetti();
    }
}

// Moving NO button
noBtn.addEventListener("mouseover", () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
});

yesBtn.addEventListener("click", () => {
    launchConfetti();
});

// Simple Confetti
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function launchConfetti() {
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
        ctx.fillRect(x, y, 5, 5);
    }
}
