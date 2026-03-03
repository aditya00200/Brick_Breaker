const canvas=document.getElementById("ground");
const ctx=canvas.getContext("2d");

let score = 0;
let current_level="";
let highest_score;

let iswin=false;
let isover=false;

canvas.width=900;
canvas.height=580;


let paddle_width=180;
let paddle_height=20;
let paddle_x=(canvas.width-paddle_width)/2;

function draw_paddle(){
    ctx.beginPath();
    ctx.rect(paddle_x,canvas.height-paddle_height-10,paddle_width,paddle_height);
    ctx.fillStyle="#fff";
    ctx.fill();
    ctx.closePath();
}


let ball_radius=10;
let ball_x=paddle_x+paddle_width/2;
let ball_y= canvas.height-paddle_height-10-ball_radius;

function draw_ball(){
    ctx.beginPath();
    ctx.arc(ball_x,ball_y,ball_radius,0,Math.PI*2);
    ctx.fillStyle="#fff";
    ctx.fill();
    ctx.closePath();
}



let brick_width=80;
let brick_height=30;
let brick_padding=10;
let brick_row;
let brick_column=9;
let brick_offset_top=50;
let brick_offset_left=50;

let ball_speed;

function set_level(level){
    if(level=="easy"){
        brick_row=4;
        ball_speed=3;
    }
    else if(level=="medium"){
        brick_row=5;
        ball_speed=4;
    }
    else{
        brick_row=7;
        ball_speed=5;
    }
}

let bricks=[];

function init_bricks(){
    bricks=[];
    for(let r=0;r<brick_row;r++){
        bricks[r]=[];
        
        for(let c=0;c<brick_column;c++){
            bricks[r][c]={
                x:0,
                y:0,
                status:1
            };
        }
    }
}


function draw_bricks(){
    for(let r = 0; r < brick_row; r++){
        for(let c = 0; c < brick_column; c++){

            if(bricks[r][c].status === 1){

                let brick_x = 
                    c * (brick_width + brick_padding) + brick_offset_left;

                let brick_y = 
                    r * (brick_height + brick_padding) + brick_offset_top;

                bricks[r][c].x = brick_x;
                bricks[r][c].y = brick_y;

                ctx.beginPath();
                ctx.rect(brick_x, brick_y, brick_width, brick_height);
                ctx.fillStyle = "#FFEA00";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


    let rightPressed = false;
    let leftPressed = false;

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function keyDownHandler(e){
        if(e.key === "Right" || e.key === "ArrowRight"){
            rightPressed = true;
        } else if(e.key === "Left" || e.key === "ArrowLeft"){
            leftPressed = true;
        }
    }

    function keyUpHandler(e){
        if(e.key === "Right" || e.key === "ArrowRight"){
            rightPressed = false;
        } else if(e.key === "Left" || e.key === "ArrowLeft"){
            leftPressed = false;
        }
    }

    function move_paddle(){
        if(rightPressed && paddle_x < canvas.width - paddle_width){
            paddle_x += 7; 


        } 
        if(leftPressed && paddle_x > 0){
            paddle_x -= 7;
        }
    }



function updateScore(){
    document.getElementById("score").textContent = score;
}


function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    move_paddle();
    move_ball();

    draw_paddle();
    draw_ball();
    draw_bricks();
    collisionDetection();

    requestAnimationFrame(gameLoop);
}

let dx,dy;

function start_game(chosen_level){
    iswin=false;
    isover=false;
    current_level=chosen_level;

    score = 0;
    updateScore();

    let start_screen=document.getElementById("start_screen");
    let score_nav=document.getElementById("score_nav");
    let gameOverScreen=document.getElementById("gameOverScreen");
    let ground=document.getElementById("ground");
    let gameWinScreen=document.getElementById("gameWinScreen");
    

    start_screen.classList.add("hidden");
    score_nav.classList.remove("hidden");
    gameOverScreen.classList.add("hidden");
    ground.classList.remove("hidden");
    gameWinScreen.classList.add("hidden");

    set_level(chosen_level);

    highest_score = localStorage.getItem("high_score_" + current_level) || 0;
    document.getElementById("high_score").innerText = highest_score;

    dx=ball_speed;
    dy=-ball_speed;
    draw_paddle();
    draw_ball();
    init_bricks();
    draw_bricks();

    gameLoop();

}


function restart_game() {
    iswin=false;
    isover=false;
    score=0;
    paddle_x = (canvas.width - paddle_width) / 2;

    ball_x = paddle_x + paddle_width / 2;
    ball_y = canvas.height - paddle_height - 10 - ball_radius;

    dx = 0;
    dy = 0;

    bricks = [];

    document.getElementById("gameWinScreen").classList.add("hidden");
    document.getElementById("start_screen").classList.remove("hidden");
    document.getElementById("score_nav").classList.add("hidden");
    document.getElementById("gameOverScreen").classList.add("hidden");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw_paddle();
    draw_ball();
    updateScore();
}


let restart_button=document.getElementById("restart_button");
restart_button.addEventListener("click",restart_game);

let restart_button_2=document.getElementById("restart_button_2");
restart_button_2.addEventListener("click",restart_game);


let easy_level=document.getElementById("easy_level");
let medium_level=document.getElementById("medium_level");
let hard_level=document.getElementById("hard_level");

easy_level.addEventListener("click",()=>{
    start_game("easy")
    }
);
medium_level.addEventListener("click",()=>{
    start_game("medium")
    }
);
hard_level.addEventListener("click",()=>{
    start_game("hard")
    }
);


function game_over(){
    isover=true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let start_screen=document.getElementById("start_screen");
    let score_nav=document.getElementById("score_nav");
    let gameOverScreen=document.getElementById("gameOverScreen");
    let ground=document.getElementById("ground");
    let gameWinScreen=document.getElementById("gameWinScreen");

    start_screen.classList.add("hidden");
    score_nav.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
    ground.classList.add("hidden");
    gameWinScreen.classList.add("hidden");

    if(score > highest_score){
        highest_score = score;
        localStorage.setItem("high_score_" + current_level, highest_score);
    }

    let end_score=document.getElementById("game_over_score");
    end_score.innerText=score;

}

function game_win(){
    iswin=true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let start_screen=document.getElementById("start_screen");
    let score_nav=document.getElementById("score_nav");
    let gameOverScreen=document.getElementById("gameOverScreen");
    let ground=document.getElementById("ground");
    let gameWinScreen=document.getElementById("gameWinScreen");

    start_screen.classList.add("hidden");
    score_nav.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameWinScreen.classList.remove("hidden");
    ground.classList.add("hidden");

    if(score > highest_score){
        highest_score = score;
        localStorage.setItem("high_score_" + current_level, highest_score);
    }

    let win_score=document.getElementById("game_win_score");
    win_score.innerText=score;

}



dx = ball_speed;
dy = -ball_speed;

function move_ball(){
    if(iswin || isover)return;
    ball_x += dx;
    ball_y += dy;

    if(ball_x + ball_radius > canvas.width || ball_x - ball_radius < 0){
        dx = -dx;
    }
    if(ball_y - ball_radius < 0){ 
        dy = -dy;
    }

    if(ball_y + ball_radius > canvas.height - paddle_height - 10 &&
       ball_x > paddle_x &&
       ball_x < paddle_x + paddle_width/4){
        dx=-dx;
        dy=-dy;
    }
    if(ball_y + ball_radius > canvas.height - paddle_height - 10 &&
       ball_x > paddle_x + paddle_width/4 &&
       ball_x < paddle_x + 3*(paddle_width/4)){
        dy=-dy;
    }
    if(ball_y + ball_radius > canvas.height - paddle_height - 10 &&
       ball_x > paddle_x +3*(paddle_width/4) &&
       ball_x < paddle_x + paddle_width){
        dx=-dx;
        dy=-dy;
    }
    
    if(ball_y + ball_radius > canvas.height){
        game_over();
    }
}



function collisionDetection(){
    for(let r = 0; r < brick_row; r++){
        for(let c = 0; c < brick_column; c++){
            let b = bricks[r][c];
            if(b.status === 1){
                if(ball_x > b.x && ball_x < b.x + brick_width &&
                   ball_y > b.y && ball_y < b.y + brick_height){
                    dy = -dy;
                    b.status = 0; 
                    score += 10;
                    updateScore();

                    if(score === brick_row * brick_column * 10){
                        game_win();
                    }
                }
            }
        }
    }
}


let enterBtn = document.getElementById("enter_game_btn");

enterBtn.addEventListener("click", function(){
    document.getElementById("landing_screen").classList.add("hidden");
    document.getElementById("start_screen").classList.remove("hidden");
});


let backBtn = document.getElementById("back_to_landing");

backBtn.addEventListener("click", function(){
    document.getElementById("start_screen").classList.add("hidden");
    document.getElementById("landing_screen").classList.remove("hidden");
});





