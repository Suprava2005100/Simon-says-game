// Game variables
let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];
let started = false;
let level = 0;
let highestScore = localStorage.getItem('simonHighScore') || 0;

// DOM elements
let h2 = document.querySelector("h2");
let currentLevelDisplay = document.getElementById("current-level");
let highestScoreDisplay = document.getElementById("highest-score");

let startBtn = document.querySelector("#start-btn");


startBtn.addEventListener("click", function () {
    if (!started) {
        started = true;
        levelUp();
        startBtn.style.display = "none"; 
    }
});

// Initialize displays
highestScoreDisplay.innerText = highestScore;
currentLevelDisplay.innerText = level;

// Start game on keypress
document.addEventListener("keypress", function() {
    if (started == false) {
        console.log("game started");
        started = true;
        levelUp();
    }
});


function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userFlash");
    setTimeout(function() {
        btn.classList.remove("userFlash");
    }, 250);
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level} - Watch carefully!`;
    currentLevelDisplay.innerText = level;

    // Generate random button
    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    let randbtn = document.querySelector(`.${randColor}`);
    
    gameSeq.push(randColor);
    console.log("Game sequence:", gameSeq);

    // Add delay before showing the flash
    setTimeout(() => {
        gameFlash(randbtn);
        setTimeout(() => {
            h2.innerText = `Level ${level} - Your turn!`;
        }, 300);
    }, 600);
}

// Check user answer
function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        // Correct so far
        if (userSeq.length == gameSeq.length) {
            // User completed the sequence correctly
            setTimeout(levelUp, 1000);
        }
    } else {
        // Wrong answer - game over
        gameOver();
    }
}

// Game over function
function gameOver() {
    // Update highest score if current level is higher
    if (level > highestScore) {
        highestScore = level;
        localStorage.setItem('simonHighScore', highestScore);
        highestScoreDisplay.innerText = highestScore;
        h2.innerHTML = `🎉 NEW HIGH SCORE! 🎉<br>Score: <b>${level}</b><br>Press any key or Start button to start again.`;
    } else {
        h2.innerHTML = `Game Over!<br>Your score: <b>${level}</b><br>Press any key or Start button to start again.`;
    }
    
    // Add game over visual effect
    document.querySelector("body").classList.add("game-over");
    setTimeout(function() {
        document.querySelector("body").classList.remove("game-over");
    }, 150);
    
    reset();
}

function btnPress() {
    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    console.log("User sequence:", userSeq);

    checkAns(userSeq.length - 1);
}

// Add event listeners to all buttons
let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

// Reset game function
function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    currentLevelDisplay.innerText = level;
    startBtn.style.display = "inline-block";
}

// Keyboard support for buttons (1-4 keys)
document.addEventListener("keydown", function(event) {
    if (started) {
        let keyMap = {
            '1': 'red',
            '2': 'yellow', 
            '3': 'green',
            '4': 'purple'
        };
        
        let color = keyMap[event.key];
        if (color) {
            let btn = document.querySelector(`.${color}`);
            btn.click();
        }
    }
});

//Display entire sequence for debugging
function displaySequence() {
    gameSeq.forEach((color, index) => {
        setTimeout(() => {
            let btn = document.querySelector(`.${color}`);
            gameFlash(btn);
        }, (index + 1) * 600);
    });
}
