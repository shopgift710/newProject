// ==================== INTRO SCREEN ====================
const introScreen = document.getElementById('intro-screen');
const beginBtn = document.getElementById('begin-btn');
const mainContent = document.getElementById('main-content');

beginBtn.addEventListener('click', () => {
    introScreen.classList.add('fade-out');
    setTimeout(() => {
        introScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
    }, 800);
});

// ==================== MODAL FUNCTIONALITY ====================
const modalBtns = document.querySelectorAll('.cue-card-btn');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-modal');

modalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modalId = btn.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// ==================== PUZZLE GAME (DRAG & DROP) ====================
const puzzleGrid = document.getElementById('puzzle-grid');
let puzzleState = [];
let draggedElement = null;
let draggedIndex = null;

function initPuzzle() {
    // Create solved state with image names (1-9)
    puzzleState = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Shuffle the puzzle
    shufflePuzzle();

    // Render puzzle
    renderPuzzle();
}

function shufflePuzzle() {
    // Fisher-Yates shuffle algorithm
    for (let i = puzzleState.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzleState[i], puzzleState[j]] = [puzzleState[j], puzzleState[i]];
    }
}

function renderPuzzle() {
    puzzleGrid.innerHTML = '';

    puzzleState.forEach((pieceNum, index) => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.setAttribute('draggable', 'true');
        piece.setAttribute('data-index', index);
        piece.setAttribute('data-piece', pieceNum);

        // Create image element
        const img = document.createElement('img');
        img.src = `files/piece_${pieceNum}.jpg`;
        img.alt = `Piece ${pieceNum}`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '10px';
        img.style.pointerEvents = 'none'; // Prevent image from interfering with drag

        piece.appendChild(img);

        // Add drag event listeners
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragover', handleDragOver);
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener('dragend', handleDragEnd);

        puzzleGrid.appendChild(piece);
    });
}

function handleDragStart(e) {
    draggedElement = e.target;
    draggedIndex = parseInt(e.target.getAttribute('data-index'));
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const dropTarget = e.target.classList.contains('puzzle-piece') ? e.target : e.target.parentElement;
    const dropIndex = parseInt(dropTarget.getAttribute('data-index'));

    if (draggedIndex !== dropIndex) {
        // Swap the pieces in the state array
        [puzzleState[draggedIndex], puzzleState[dropIndex]] = [puzzleState[dropIndex], puzzleState[draggedIndex]];

        // Re-render the puzzle
        renderPuzzle();

        // Check if puzzle is solved
        if (checkWin()) {
            setTimeout(() => {
                triggerConfetti();
            }, 300);
        }
    }

    return false;
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    draggedElement = null;
    draggedIndex = null;
}

function checkWin() {
    // Check if all pieces are in correct order (1-9)
    const solved = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return puzzleState.every((num, index) => num === solved[index]);
}

// Initialize puzzle when page loads
initPuzzle();

// ==================== QUESTION SECTION ====================
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const buttonsContainer = document.querySelector('.buttons-container');

let noBtnClicked = false;

noBtn.addEventListener('mouseenter', () => {
    if (!noBtnClicked) {
        moveNoButton();
    }
});

noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

function moveNoButton() {
    const containerRect = buttonsContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height;

    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;

    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

yesBtn.addEventListener('click', () => {
    noBtnClicked = true;
    triggerConfetti();
    triggerFireworks();

    // Hide the question and show a message
    setTimeout(() => {
        const questionContainer = document.querySelector('.question-container');
        questionContainer.innerHTML = `
            <h3 class="question-text" style="font-size: 3rem; animation: fadeInUp 0.8s ease;">
                Yay! 💕 You made my day! 🎉
            </h3>
        `;
    }, 1000);
});

// ==================== CONFETTI ANIMATION ====================
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Confetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.color = this.randomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    randomColor() {
        const colors = [
            '#ff6b9d', '#c44569', '#ffa07a', '#667eea',
            '#764ba2', '#f093fb', '#f5576c', '#4facfe'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

let confettiArray = [];
let confettiActive = false;
let animationId;

function triggerConfetti() {
    confettiActive = true;
    confettiArray = [];

    for (let i = 0; i < 150; i++) {
        confettiArray.push(new Confetti());
    }

    animateConfetti();

    setTimeout(() => {
        confettiActive = false;
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiArray = [];
    }, 5000);
}

function animateConfetti() {
    if (!confettiActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiArray.forEach(confetti => {
        confetti.update();
        confetti.draw();
    });

    animationId = requestAnimationFrame(animateConfetti);
}

// ==================== FIREWORKS ANIMATION ====================
class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height / 2;
        this.speed = 5;
        this.particles = [];
        this.exploded = false;
        this.color = this.randomColor();
    }

    randomColor() {
        const colors = [
            '#ff6b9d', '#c44569', '#ffa07a', '#667eea',
            '#764ba2', '#f093fb', '#f5576c', '#4facfe'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;

            if (this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.alpha <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            this.particles.forEach(particle => particle.draw());
        }
    }

    isDone() {
        return this.exploded && this.particles.length === 0;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 3 + 1;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.velocity.y += 0.1;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

let fireworksArray = [];
let fireworksActive = false;
let fireworksAnimationId;

function triggerFireworks() {
    fireworksActive = true;
    fireworksArray = [];

    const fireworkInterval = setInterval(() => {
        if (fireworksActive) {
            fireworksArray.push(new Firework());
        }
    }, 300);

    animateFireworks();

    setTimeout(() => {
        fireworksActive = false;
        clearInterval(fireworkInterval);
        setTimeout(() => {
            cancelAnimationFrame(fireworksAnimationId);
            fireworksArray = [];
        }, 3000);
    }, 3000);
}

function animateFireworks() {
    if (!fireworksActive && fireworksArray.length === 0) return;

    fireworksArray.forEach((firework, index) => {
        firework.update();
        firework.draw();

        if (firework.isDone()) {
            fireworksArray.splice(index, 1);
        }
    });

    fireworksAnimationId = requestAnimationFrame(animateFireworks);
}
