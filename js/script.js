var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const cenX = canvas.width/2;
const cenY = canvas.height - 30;

var x = cenX;
var y = cenY;

var ballRadius = 10;

var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var moveRight = false;
var moveLeft = false;

function draw()
{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBall(x,y,ballRadius);
    drawPaddle();
    x+=dx;
    y+=dy;
    checkBallPos();
    checkPaddleInputs();
}
function drawBall(x,y,radius)
{
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2,false);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function ballTouchingPaddle()
{
    if(x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius)
    {
        if(y + ballRadius > canvas.height - paddleHeight)
        {
            return true;
        }
    }
    return false;
}
function checkBallPos()
{
    let rEdge = canvas.width - ballRadius;
    let lEdge = ballRadius;
    let bEdge = canvas.height - ballRadius;
    let tEdge = ballRadius;
    if(x > rEdge || x < lEdge)
    {
        dx = -dx;
    }
    else if(y < tEdge)
    {
        dy = -dy;
    }
    else if(y > bEdge)
    {
        gameOver();
    }
    if(ballTouchingPaddle())
    {
        dy = -dy;
    }
    
}
function gameOver()
{
    alert("Game over bro");
    document.location.reload();
    clearInterval(interval);
}
function checkPaddleInputs()
{
    if(moveRight)
    {
        paddleX += 7;
    }
    else if(moveLeft)
    {
        paddleX -= 7;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e)
{
    if(e.key == "Right" || e.key == "ArrowRight")
    {
        moveRight = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft")
    {
        moveLeft = true;
    }
}
function keyUpHandler(e)
{
    if(e.key == "Right" || e.key == "ArrowRight")
    {
        moveRight = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft")
    {
        moveLeft = false;
    }
}
var interval = setInterval(draw,10);

