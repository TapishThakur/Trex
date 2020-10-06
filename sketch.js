var PLAY = 1;
var END = 0;
var gamestate = PLAY;

var trex,trex_running,trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var message = "Hi Im Tapish How are you"; 

var gameover, gameoverImg;
var restart, restartImg;

var jumpsound,checkpoint,diesound;

function preload()
{
 trex_running =  loadAnimation("trex1.png","trex3.png","trex4.png");
 trex_collided = loadAnimation("trex_collided.png");
  
 groundImage = loadImage("ground2.png");
  
 cloudImage = loadImage("cloud.png");
  
 obstacle1 = loadImage("obstacle1.png");
 obstacle2 = loadImage("obstacle2.png");
 obstacle3 = loadImage("obstacle3.png");
 obstacle4 = loadImage("obstacle4.png");
 obstacle5 = loadImage("obstacle5.png");
 obstacle6 = loadImage("obstacle6.png");
 
 gameoverImg = loadImage("gameOver.png");
 restartImg = loadImage("restart.png");
  
 jumpsound = loadSound("jump.mp3");
 checkpoint = loadSound("checkPoint.mp3");
 diesound = loadSound("die.mp3"); 
}

function setup() 
{
 createCanvas(600, 200);
  
 console.log(message);
  
 trex = createSprite(50,180,20,50);
 trex.addAnimation("running", trex_running);
 trex.addAnimation("collided" , trex_collided)
 trex.scale = 0.5;
  
 ground = createSprite(200,180,400,20);
 ground.addImage("ground",groundImage);
 ground.x = ground.width /2;

 gameover = createSprite(300,70);
 gameover.addImage("GG",gameoverImg);
 gameover.scale = 1;
  
 restart = createSprite(300,110);
 restart.addImage("restart",restartImg);
 restart.scale = 0.4;
  
 invisibleGround = createSprite(200,190,400,10);
 invisibleGround.visible = false;
  
 // create Obstacles and Cloud groups
 obstaclesGroup = new Group();
 cloudsGroup = new Group();
  
 score = 0;
 
 trex.debug = false;
 trex.setCollider("circle",0,0,40); 
}

function draw() 
{
 background(260);
 text("Score: "+ score, 500,50); 
  
  if(gamestate === PLAY)
  {
   //makes the game over and restart icon invisible 
   gameover.visible = false;
   restart.visible = false;
   
   console.log(Math.round(getFrameRate()));
   score = score + Math.round(getFrameRate()/30);
    
   //move the ground
   ground.velocityX = -(4 + score/100)     
   
   if(score % 100 === 0 && score > 0)
   {
    checkpoint.play();
   }
    
   if(keyDown("space")&& trex.y >= 150) 
   {
    trex.velocityY = -10;
    jumpsound.play(); 
   } 
   trex.velocityY = trex.velocityY + 0.8
    
   if (ground.x < 0)
   {
    ground.x = ground.width/2;
   }
   
   //spawn the clouds
   spawnClouds();
     
   //spawn obstacles on the ground
   spawnObstacles(); 
    
   if(trex.isTouching(obstaclesGroup))
   {
    trex.changeAnimation("collided",trex_collided);
    //trex.velocityY = -10
    //jumpsound.play(); 
    gamestate = END;
    diesound.play(); 
   } 
  }  
  
  else if(gamestate === END)
  {
   //makes the gameover r=and restart icon visible
   gameover.visible = true;
   restart.visible = true;
   
   //Restarts the Game
   if(mousePressedOver(restart))
    {
     reset();
    } 
   //stop the ground
   ground.velocityX = 0;
     
   obstaclesGroup.setVelocityXEach(0);
   cloudsGroup.setVelocityXEach(0);
   trex.velocityY = 0;
   
   obstaclesGroup.setLifetimeEach(-1);
   cloudsGroup.setLifetimeEach(-1);
  }
  
  trex.collide(invisibleGround);
  
  console.log(gamestate)
  drawSprites();
}


function spawnObstacles()
{
 if (frameCount % 60 === 0)
 {
  var obstacle = createSprite(400,165,10,40);
  obstacle.velocityX = -(6 + score/100);

   
  //generate random obstacles
  var rand = Math.round(random(1,6));
  switch(rand) 
  {
   case 1: obstacle.addImage(obstacle1);
   break;
   case 2: obstacle.addImage(obstacle2);
   break;
   case 3: obstacle.addImage(obstacle3);
   break;
   case 4: obstacle.addImage(obstacle4);
   break;
   case 5: obstacle.addImage(obstacle5);
   break;
   case 6: obstacle.addImage(obstacle6);
   break;
   default: break;
  }
   
  //assign scale and lifetime to the obstacle           
  obstacle.scale = 0.4;
  obstacle.lifetime = 300;
   
  //adding obstacles to the group
  obstaclesGroup.add(obstacle);
 }
}


function spawnClouds() 
{
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) 
  {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}

//For resseting the game
function reset()
{
 obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();
 score = 0;
 gamestate = PLAY;
 trex.changeAnimation("running",trex_running);  
}