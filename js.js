let myCanvas = {
	canvas : document.createElement('canvas'),


	start : function(){
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.context = this.canvas.getContext('2d');
		container.insertBefore(this.canvas,container.childNodes[0]);
		this.interval = setInterval(mainLoop,20);
	},

	clear : function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	}
}

let enemyBullets = [];
let keys = [];
let enemies = [];
let count = 0;
let lvl = 1;

window.onload = function(){
	document.getElementById("win").onclick = function(){devOptWin()};
	document.getElementById("lose").onclick = function(){devOptLose()};
	document.getElementById("hide").onclick = function(){devOptHide()};
	document.getElementById("pause").onclick = function(){devOptPause()};
	document.getElementById("lvlTres").onclick = function(){devOptLvlTres()};
	document.getElementById("lvlSeis").onclick = function(){devOptLvlSeis()};
	let container = document.getElementById('container');
	window.addEventListener('keydown',keysPressed,false);
	window.addEventListener('keyup',keysReleased,false);
	startGame();
}

function startGame(){
	switch(lvl){
		case 1:
			ship = new spaceship(240,480,20,20);
			genEnemies();
			break;

		case 2:
			ship = new spaceship(240,480,20,20);
			genEnemies();
			break;

		case 3:
			ship = new spaceship(240,480,20,20);
			fboss = new boss(210,40,80,80);
			break;

		case 4: 
			ship = new spaceship(240,480,20,20);
			genEnemies();
			break;

		case 5: 
			ship = new spaceship(240,480,20,20);
			genEnemies();
			break;

		case 6: 
			ship = new spaceship(240,480,20,20);
			fboss = new boss(210,40,80,80);
			break;

		default: 
			break;
	}
	console.log("Game started");
	console.log(`Actual level: ${lvl}`);
	myCanvas.start();
}

function keysPressed(event){
	keys[event.keyCode] = true;
}

function keysReleased(event){
	keys[event.keyCode] = false;
	if(keys[32] == false) {
		count = 0;
	}
}



function mainLoop(){
	myCanvas.clear();
	if(lvl == 3 || lvl == 6){
		fboss.showHp();
		fboss.show();
		fboss.move();
		
	} else {
		for(let i = 0; i < enemies.length; i++){
			enemies[i].show();
			//0.3% chance to shoot every enemy in every loop
			if((Math.random() * 100) > 99.7) enemies[i].shoot();
		}
		for(let i = 0; i < enemyBullets.length; i++){
				enemyBullets[i].show();
				//HIT
				if(enemyBullets[i].hit()){
					enemyBullets.splice(i,1);
					ship.hp--;
				}
		}
	}
	ship.show();
	ship.controls();
	ship.showMyBullets();
	if(lvl == 3 || lvl == 6){
		ship.hitBoss();
		if((Math.random() * 100) > 94.5) fboss.shoot();
		for(let i = 0; i < fboss.bullets.length; i++){
			fboss.bullets[i].show();
		}
		fboss.hitPlayer();
	} 
	else{ 
		ship.hitEnemy();	
	}
	ship.showHp();
	if(count != 0) count ++;
	checkGameStatus();
}

/*function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo(a) {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later');
  a = true;
}*/

function nextLevelScreen(){
	let ctx = myCanvas.context;
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
	ctx.fillText("Loading level " + (lvl + 1), 150, 250);
}

function checkGameStatus(){
	if(ship.hp <= 0){
		myCanvas.clear();
		count = 0;
		enemies = [];
		enemyBullets = [];
		delete ship;
		clearInterval(myCanvas.interval);
		console.log("You lost!");
		setTimeout(function(){}, 3000);
	}
	if(lvl == 3 || lvl == 6){
		if(fboss.hp <= 0){
			myCanvas.clear();
			count = 0;
			enemies = [];
			enemyBullets = [];
			delete ship;
			delete fboss;
			clearInterval(myCanvas.interval);
			console.log("You win!");
			console.log("Starting...");
			nextLevelScreen()
			setTimeout(function(){			
				lvl++;
				startGame();
			}, 3000);
			
		}
	} else {
		//ERROR HERE
		if(lvl == 4 || lvl == 5){
			for(let i = 0; i < enemies.length; i++){
				if(enemies[i].y >= 480){
					enemies.splice(i,1);
				}
			}
			if(enemies.length == 0){
				myCanvas.clear();
				count = 0;
				enemies = [];
				enemyBullets = [];
				delete ship;
				clearInterval(myCanvas.interval);
				console.log("You lost!");
				setTimeout(function(){}, 3000);
			}
		} else {
			if(enemies.length == 0){
				myCanvas.clear();
				count = 0;
				enemies = [];
				enemyBullets = [];
				delete ship;
				clearInterval(myCanvas.interval);
				console.log("You win!");
				console.log("Starting...");
				nextLevelScreen()
				setTimeout(function(){			
					lvl++;
					startGame();
				}, 3000);
			}
		}		
	}
}

function genEnemies(){
	for(let i = 0; i < 11; i++){
		enemies.push(new enemy(65+i*35,70,20,20));
		for(let j = 0; j < 1; j++){
			enemies.push(new enemy(65+i*35,40,20,20));
			if(lvl == 2 || lvl == 5)
			enemies.push(new enemy(65+i*35,100,20,20));
		}
	}
}


function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}



  //////////////////
 ///CONSTRUCTORS///
//////////////////

function spaceship(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.bullets = [];
	this.hp = 10;

	this.showHp = function(){
		ctx = myCanvas.context;
		if(this.hp <= 5 && this.hp > 2) ctx.fillStyle = "orange";
		else if(this.hp <= 2) ctx.fillStyle = "red";
		else ctx.fillStyle = "green";
		ctx.fillRect(265, 10, this.hp * 22, 5);
		ctx.strokeRect(260, 5, 230, 15);
	}

	this.show = function(){
		if(this.x<0) this.x = 0;
		if(this.x>500-this.width) this.x = 500 - this.width;
		ctx = myCanvas.context;
		ctx.fillStyle = "blue";
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}

	this.showMyBullets = function(){
		for(let i = 0; i < this.bullets.length; i++){
			this.bullets[i].show();
		}
	}

	this.controls = function(){
		if(keys[39]){
			this.x += 6;
		}
		if(keys[37]){
			this.x += -6;
		}
		if(keys[32]){
			if(count % 10 == 0 || count == 0){
				if(count == 0) count = 1;
				this.bullets.push(new bullet(this.x + (this.height/2 - 1),this.y - (this.width/2 - 1),2,5,3,"red"));
			}
		}
	}

	this.hitEnemy = function(){
		for(let i = 0; i < this.bullets.length; i++){
			for(let j = 0; j < enemies.length; j++){
				if(this.bullets[i].hit(enemies[j])){
					enemies.splice(j,1);
					this.bullets.splice(i,1);
					break;	
				}
			}
		}
	}

	this.hitBoss = function(){
		for(let i = 0; i < this.bullets.length; i++){
			if(this.bullets[i].hit("boss")){
				this.bullets.splice(i,1);
				fboss.hp--;
			}
		}
	}
}

function bullet(x,y,width,height,speed,color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.color = color;

	this.show = function(){
		ctx = myCanvas.context;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		this.y -= this.speed;
	}


	this.hit = function(enemy){
		if(isObject(enemy)){
			if(this.x<enemy.x+enemy.width &&
				this.x+this.width>enemy.x &&
				this.y<enemy.y+enemy.height &&
				this.height+this.y>enemy.y)
				return true;
		} else if(enemy == "boss"){
			if(this.x<fboss.x+fboss.width &&
				this.x+this.width>fboss.x &&
				this.y<fboss.y+fboss.height &&
				this.height+this.y>fboss.y)
				return true;
		} else {
			if(this.x<ship.x+ship.width &&
				this.x+this.width>ship.x &&
				this.y<ship.y+ship.height &&
				this.height+this.y>ship.y)
				return true;
		}
	}
}

function enemy(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = .3;

	this.show = function(){
		ctx = myCanvas.context;
		ctx.fillStyle = "green";
		ctx.fillRect(this.x,this.y,this.width,this.height);
		if(lvl == 4 || lvl == 5) this.y += this.speed;
	}

	this.shoot = function(){
		enemyBullets.push(new bullet(this.x + (this.height/2 - 1),this.y + (this.width + 1),2,5,-3,"green"));
	}
}

function boss(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hp = 100;
	this.speed = 6;
	this.bullets = [];

	this.showHp = function(){
		ctx = myCanvas.context;
		if(this.hp <= 5 && this.hp > 2) ctx.fillStyle = "orange";
		else if(this.hp <= 2) ctx.fillStyle = "red";
		else ctx.fillStyle = "green";
		ctx.fillRect(15, 10, this.hp * 2.3, 5);
		ctx.strokeRect(10, 5, 240, 15);
	}

	this.show = function(){
		ctx = myCanvas.context;
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	this.move = function(){
		this.x += this.speed;
		if(this.x <= 10){
			this.speed = +6;
		}
		if(this.x >= 410){
			this.speed = -6;
		}
		if(lvl == 6) this.y += .1;
	}

	this.shoot = function(){
		this.bullets.push(new bullet(this.x + (this.height/2 - 1),this.y + (this.width + 1),4,7,-9,"green"));
	}

	this.hitPlayer = function(){
		for(let i = 0; i < this.bullets.length; i++){
			if(this.bullets[i].hit()){
				this.bullets.splice(i,1);
				ship.hp--;
			}
		}
	}
}


  ///////////////////////
 ///DEVELOPER OPTIONS///
///////////////////////

function showDeveloperOptions(){
	document.getElementById("developerOptions").style.display = "block";
}

function devOptWin(){
	enemies = [];
	if(lvl == 3 || lvl == 6) fboss.hp = 0;
}

function devOptLose(){
	ship.hp = 0;
}

function devOptHide(){
	document.getElementById("developerOptions").style.display = "none";
}

function devOptPause(){
	if(document.getElementById("pause").firstChild.data == "pause"){
		clearInterval(myCanvas.interval);
		document.getElementById("pause").firstChild.data = "unpause";
	} else{
		document.getElementById("pause").firstChild.data = "pause";
		myCanvas.start();
	}
}

function devOptLvlTres(){
	if(lvl == 3 || lvl == 6) fboss.hp = 0; 
	lvl = 2;
	enemies = [];
}

function devOptLvlSeis(){
	if(lvl == 3 || lvl == 6) fboss.hp = 0; 
	lvl = 5;
	enemies = [];
}