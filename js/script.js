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

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var bricks = [];
for(var c = 0; c < brickColumnCount; c++)
{
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++)
    {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

function draw()
{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBall(x,y,ballRadius);
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    x+=dx;
    y+=dy;
    checkBallPos();
    checkPaddleInputs();
    requestAnimationFrame(draw);
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
function drawBricks()
{
    for(var c = 0; c < brickColumnCount; c++)
    {
        for(var r = 0; r < brickRowCount; r++)
        {
            if(bricks[c][r].status > 0)
            {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                drawBrick(brickX,brickY,brickWidth,brickHeight,"#0095DD");
            }
            
        }
    }
}
function drawBrick(x,y,width,height,color)
{
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();

}
function drawScore()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}
function drawLives()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
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
function ballTouchingBrick()
{
    for(var c = 0; c < brickColumnCount; c++)
    {
        for(var r = 0; r < brickRowCount; r++)
        {
            var b = bricks[c][r];
            if(b.status > 0)
            {
                if(x > b.x && x < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight)
                {
                    dy=-dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount)
                    {
                        alert("A winner is y ou !");
                        document.location.reload();
                        
                    }
                }
            }
        }
    }
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
    ballTouchingBrick()
    
}
function gameOver()
{
    lives -= 1;
    if(lives <= 0)
    {
        alert("Game over bro");
        document.location.reload();
        
    }
    else
    {
        if(dy > 0)
        {
            dy = -dy;
        }
        x = cenX;
        y = cenY;
    }
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
document.addEventListener("mousemove", mouseMoveHandler, false);
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
function mouseMoveHandler(e)
{
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width)
    {
        paddleX = relativeX - paddleWidth/2;
    }
}
draw();


