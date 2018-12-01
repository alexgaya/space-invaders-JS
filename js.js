/**
*Objeto canvas predefinido
*/
let myCanvas = {
	canvas : document.createElement('canvas'),

	//Crea el canvas y llama a la función del bucle principal del juego
	start : function(){
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.context = this.canvas.getContext('2d');
		container.insertBefore(this.canvas,container.childNodes[0]);
		this.interval = setInterval(mainLoop,20);
	},

	//Limpia todo lo que se haya dibujado en el canvas
	clear : function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	}
}

//Array que almacena las balas de los enemigos
let enemyBullets = [];

//Array que almacena las teclas para saber si están siendo o no pulsadas
let keys = [];

//Array que almacena los enemigos
let enemies = [];

//Variable que evita que el jugador dispare demasiadas balas por segundo
let count = 0;

//Variable que almacena el nivel en el que se encuentra el jugador
let lvl = 1;

//Variable que almacena el nombre del jugador
let name;

//Variable que almacena la puntuación del jugador
let points = 0;


/**
*Función que espera a que cargue la página y entonces lee js
*/
window.onload = function(){
	document.getElementById("button").onclick = function(){setName()};
	document.getElementById("win").onclick = function(){devOptWin()};
	document.getElementById("lose").onclick = function(){devOptLose()};
	document.getElementById("hide").onclick = function(){devOptHide()};
	document.getElementById("pause").onclick = function(){devOptPause()};
	document.getElementById("lvlTres").onclick = function(){devOptLvlTres()};
	document.getElementById("lvlSeis").onclick = function(){devOptLvlSeis()};
	document.getElementById("deleteAllCookies").onclick = function(){devOptDeleteAllCookies()};
	let container = document.getElementById('container');
	window.addEventListener('keydown',keysPressed,false);
	window.addEventListener('keyup',keysReleased,false);
}


/**
*Según el nivel, crea nave y enemigos o un boss
*/
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
	console.log(`Game started \nActual level: ${lvl}`);
	myCanvas.start();
}


/**
*Añade el código de la tecla como índice del array keys[] y le
*añade true
*
*@param event  Evento onkeydown pasado por parámetro
*/
function keysPressed(event){
	keys[event.keyCode] = true;
}


/**
*Cambia le valor de la tecla a false al dejar de pulsarse
*
*@param event  Evento onkeydown pasado por parámetro
*/
function keysReleased(event){
	keys[event.keyCode] = false;
	if(keys[32] == false) count = 0;
}


/**
*Borra una cookie específica
*
*@param name Nombre de la cookie que se quiere borrar
*/
function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


/**
*Recoge el nombre introducido por el usuario y lo guarda en la variable name
*/
function setName(){
	name = document.getElementById("name").value;
	console.log(`Player name: ${name.toUpperCase()}`);
	document.getElementById("setName").style.display = "none";
	startGame();
}


/**
*Algoritmo de ordenación burbuja mejorado
*
*@param a Array con las cookies
*/
function bubble(a){
	let swap = true;
	let j = 0;
	while(swap){
		swap = false;
		for(let i = 1; i < a.length - j; i++){
			//Separa la cookie en nombre y valor y compara los valores los cuales debe parsear
			//a int para poder hacer el cálculo
			if(parseInt(a[i].split('=')[1]) > parseInt(a[i - 1].split('=')[1])){
				let aux = a[i];
				a[i] = a[i - 1];
				a[i - 1] = aux;
				swap = true;
			}
		}
		j++;
	}
	console.log(`Ranking:`);
	for(let i = 0; i < a.length; i++){
		console.log(a[i]);
	}
	return a;
}


/**
*Muestra el ranking en pantalla al finalizar la partida utilizando las cookies
*/
function showRanking(){

	let ctx = myCanvas.context;
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";

	let array = document.cookie.split('; ');
	let cookieName, cookieValue;
	let position = 40;

	//Ordena las cookies de mayor a menor utilizando el algoritmo de burbuja mejorado
	array = bubble(array);

	for(let i = 0; i < array.length; i++){
		cookieName = array[i].split('=')[0];
		cookieValue = array[i].split('=')[1];

		ctx.fillText(cookieName + "  " + cookieValue + " points", 10, position);
		position += 40;
	}
}


/**
*Loop principal que mantiene el juego en constante ejecución
*/
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
					points -= 100;
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

/**
*Muestra en pantalla un mensaje de que se está cargando el siguiente nivel
*/
function nextLevelScreen(){
	let ctx = myCanvas.context;
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
	ctx.fillText("Loading level " + (lvl + 1), 150, 250);
}

/**
*Muestra en pantalla un mensaje de derrota y crea la cookie
*/
function youLost(){
	let ctx = myCanvas.context;
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
	ctx.fillText("You lost!", 200, 250);
	let expires = new Date();
	expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * 30);
	document.cookie = `${name}=${points}; expires=${expires.toGMTString()}`;
}

/**
*Muestra en pantalla un mensaje de felicidades y crea la cookie
*/
function congratulations(){
	let ctx = myCanvas.context;
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
	ctx.fillText("Congratulations, you have won!", 50, 250);
	let expires = new Date();
	//Caducidad de un mes
	expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * 30);
	document.cookie = `${name}=${points}; expires=${expires.toGMTString()}`;
}

/**
*Comprueba si el jugador ha perdido o ha ganado mediante:
*El jugador se ha quedado sin vida (Pierde)
*Todos los enemigos han sido eliminados (Gana)
*El boss se ha quedado sin vida (Gana)
*Los enemigos han impactado en el inferior del área de juego (Pierde)
*El boss ha impactado en el inferior del área de juego (Pierde)
*/
function checkGameStatus(){
	switch(lvl){
		case 1:
		case 2:
			if(ship.hp <= 0){
				myCanvas.clear();
				count = 0;
				enemies = [];
				enemyBullets = [];
				delete ship;
				clearInterval(myCanvas.interval);
				console.log("You lost!");
				youLost();
				setTimeout(function(){
					myCanvas.clear();
					showRanking();
				}, 3000);
				break;
			}
			if(enemies.length == 0){
				myCanvas.clear();
				count = 0;
				enemies = [];
				enemyBullets = [];
				delete ship;
				clearInterval(myCanvas.interval);
				console.log("You win!");
				console.log("Starting...");
				if(lvl <= 5) nextLevelScreen();
				else congratulations();
				setTimeout(function(){
					if(lvl <= 5){
						lvl++;
						startGame();
					} else{
						myCanvas.clear();
						showRanking();
					}
				}, 3000);
			}
			break;
		case 3:
		case 6:
			if(ship.hp <= 0){
				myCanvas.clear();
				count = 0;
				enemies = [];
				enemyBullets = [];
				delete ship;
				clearInterval(myCanvas.interval);
				console.log("You lost!");
				youLost();
				setTimeout(function(){
					myCanvas.clear();
					showRanking();
				}, 3000);
				break;
			}
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
				if(lvl <= 5) nextLevelScreen();
				else congratulations();
				setTimeout(function(){			
					if(lvl <= 5){
						lvl++;
						startGame();
					} else{
						myCanvas.clear();
						showRanking();
					}
				}, 3000);
				break;
			}

			if(fboss.y >= 420){
				myCanvas.clear();
				count = 0;
				enemies = [];
				enemyBullets = [];
				delete fboss;
				delete ship;
				clearInterval(myCanvas.interval);
				console.log("You lost!");
				youLost();
				setTimeout(function(){
					myCanvas.clear();
					showRanking();
				}, 3000);
			}
			break;
		case 4:
		case 5:
			if(ship.hp <= 0){
				myCanvas.clear();
				count = 0;
				enemies = [];
				enemyBullets = [];
				delete ship;
				clearInterval(myCanvas.interval);
				console.log("You lost!");
				youLost();
				setTimeout(function(){
					myCanvas.clear();
					showRanking();
				}, 3000);
				break;
			}
			if(enemies.length == 0){
				myCanvas.clear();
				count = 0;
				enemies = [];
				enemyBullets = [];
				delete ship;
				clearInterval(myCanvas.interval);
				console.log("You Win!");
				console.log("Starting...");
				if(lvl <= 5) nextLevelScreen();
				else congratulations();
				setTimeout(function(){
					if(lvl <= 5){
						lvl++;
						startGame();
					} else{
						myCanvas.clear();
						showRanking();
					}
				}, 3000);
				break;
			}

			for(let i = 0; i < enemies.length; i++){
				if(enemies[i].y >= 480){
					enemies.splice(i,1);
					myCanvas.clear();
					count = 0;
					enemies = [];
					enemyBullets = [];
					delete ship;
					clearInterval(myCanvas.interval);
					console.log("You lost!");
					youLost();
					setTimeout(function(){
						myCanvas.clear();
						showRanking();
					}, 3000);
					break;
				}
			}
			break;
	}
}

/**
*Genera los enemigos al empezar el nivel
*/
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

/**
*Retorna true si el valor pasado por parámetro es un objeto o función
*Retorna false si el valor pasado por parámetro es nulo
*
*@param val Objeto o nulo
*/
function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}



  //////////////////
 ///CONSTRUCTORS///
//////////////////


/**
*Constructor para la nave del jugador
*
*@param x  Posición en el eje de la x
*@param y  Posición en el eje de la y
*@param width  Ancho de la nave
*@param height  Altura de la nave
*/
function spaceship(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.bullets = [];
	this.hp = 10;

	/*Dibuja la barra de vida del jugador*/
	this.showHp = function(){
		ctx = myCanvas.context;
		if(this.hp <= 5 && this.hp > 2) ctx.fillStyle = "orange";
		else if(this.hp <= 2) ctx.fillStyle = "red";
		else ctx.fillStyle = "green";
		ctx.fillRect(265, 10, this.hp * 22, 5);
		ctx.strokeRect(260, 5, 230, 15);
	}

	/*Dibuja la nave del jugador*/
	this.show = function(){
		//Evita que la nave se salga del canvas
		if(this.x<0) this.x = 0;
		if(this.x>500-this.width) this.x = 500 - this.width;

		ctx = myCanvas.context;
		ctx.fillStyle = "blue";
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}

	/**
	*Recorre todas las balas lanzadas por el usuario
	*y llama a la funcón que hace que se muestren
	*/
	this.showMyBullets = function(){
		for(let i = 0; i < this.bullets.length; i++){
			this.bullets[i].show();
		}
	}

	/*Permite que la nave se mueva y dispare si el jugador pulsa las teclas*/
	this.controls = function(){
		//Derecha
		if(keys[39]){
			this.x += 6;
		}
		//Izquierda
		if(keys[37]){
			this.x += -6;
		}
		//Espacio (disparar)
		if(keys[32]){
			//Si count es 0 o dividiéndola entre 10 y da resto 0 entonces dispara una bala
			if(count % 10 == 0 || count == 0){
				if(count == 0) count = 1;
				this.bullets.push(new bullet(this.x + (this.height/2 - 1),this.y - (this.width/2 - 1),2,5,3,"red"));
			}
		}
	}

	/*Elimina al enemigo si una bala ha impactado en él*/
	this.hitEnemy = function(){
		for(let i = 0; i < this.bullets.length; i++){
			for(let j = 0; j < enemies.length; j++){
				if(this.bullets[i].hit(enemies[j])){
					//Elimina al enemigo del array
					enemies.splice(j,1);
					//Añade 100 puntos al score del jugador
					points += 100;
					//Elimina la bala que ha impactado en el enemigo
					this.bullets.splice(i,1);
					//Sale del bucle para evitar que siga mirando si esa bala,
					//la cual ya no existe, ha impactado en algún enemigo
					break;	
				}
			}
		}
	}

	/*Resta vida al boss si una bala ha impactado en él*/
	this.hitBoss = function(){
		for(let i = 0; i < this.bullets.length; i++){
			if(this.bullets[i].hit("boss")){
				//Elimina la bala que ha impactado del array
				this.bullets.splice(i,1);
				//Resta vida al boss
				fboss.hp--;
				//Añade 200 puntos al score del jugador
				points += 200;
			}
		}
	}
}


/**
*Constructor para las balas
*
*@param x Posición en el eje de la x
*@param y Posición en el eje de la y
*@param width  Ancho de la bala
*@param height  Altura de la bala
*@param speed  Velocidad de la bala (movimiento)
*@param color Color de la bala
*/
function bullet(x,y,width,height,speed,color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.color = color;

	/*Dibuja la bala*/
	this.show = function(){
		ctx = myCanvas.context;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		this.y -= this.speed;
	}

	/*Detecta si una bala a impactado en un enemigo, boss o jugador*/
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


/**
*Constructor para las naves enemigas
*
*@param x  Posición en el eje de la x
*@param y  Posición en el eje de la y
*@param width  Ancho de la nave enemiga
*@param height  Altura de la nave enemiga
*/
function enemy(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = .3;

	/*Pinta la nave enemiga en el canvas*/
	this.show = function(){
		ctx = myCanvas.context;
		ctx.fillStyle = "green";
		ctx.fillRect(this.x,this.y,this.width,this.height);
		//Si es nivel 4 o 5 le da movimiento hacia abajo
		if(lvl == 4 || lvl == 5) this.y += this.speed;
	}

	/*Genera una bala que disparará el enemigo*/
	this.shoot = function(){
		enemyBullets.push(new bullet(this.x + (this.height/2 - 1),this.y + (this.width + 1),2,5,-3,"green"));
	}
}


/**
*Constructor para el boss
*
*@param x  Posición en el eje de la x
*@param y  Posición en el eje de la y
*@param width  Ancho del boss
*@param height  Altura del boss
*/
function boss(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hp = 100;
	this.speed = 6;
	this.bullets = [];

	/*Dibuja la barra de vida del boss*/
	this.showHp = function(){
		ctx = myCanvas.context;
		if(this.hp <= 5 && this.hp > 2) ctx.fillStyle = "orange";
		else if(this.hp <= 2) ctx.fillStyle = "red";
		else ctx.fillStyle = "green";
		ctx.fillRect(15, 10, this.hp * 2.3, 5);
		ctx.strokeRect(10, 5, 240, 15);
	}

	/*Dibuja el boss*/
	this.show = function(){
		ctx = myCanvas.context;
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	/*Le da movimiento al boss*/
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

	/*Genera una bala que será disparada*/
	this.shoot = function(){
		this.bullets.push(new bullet(this.x + (this.height/2 - 1),this.y + (this.width + 1),4,7,-9,"green"));
	}

	/*Modifica la vida del jugador si una bala ha impactado en él*/
	this.hitPlayer = function(){
		for(let i = 0; i < this.bullets.length; i++){
			if(this.bullets[i].hit()){
				this.bullets.splice(i,1);
				//Quita un punto de vida del jugador
				ship.hp--;
				//Quita 100 puntos del score del jugador
				points -= 100;
			}
		}
	}
}


  ///////////////////////
 ///DEVELOPER OPTIONS///
///////////////////////


/**
*Enseña las opciones de desarrollador en pantalla (botones)
*/
function showDeveloperOptions(){
	document.getElementById("developerOptions").style.display = "block";
}


/**
*Gana el nivel actual
*/
function devOptWin(){
	enemies = [];
	if(lvl == 3 || lvl == 6) fboss.hp = 0;
}


/**
*Pierde la partida
*/
function devOptLose(){
	ship.hp = 0;
}


/**
*Esconde las opciones de desarrollador
*/
function devOptHide(){
	document.getElementById("developerOptions").style.display = "none";
}


/**
*Pausa y reanuda el juego 
*/
function devOptPause(){
	if(document.getElementById("pause").firstChild.data == "pause"){
		clearInterval(myCanvas.interval);
		document.getElementById("pause").firstChild.data = "unpause";
	} else{
		document.getElementById("pause").firstChild.data = "pause";
		myCanvas.start();
	}
}


/**
*Pasa directamente la nivel 3 (boss)
*/
function devOptLvlTres(){
	if(lvl == 3 || lvl == 6) fboss.hp = 0; 
	lvl = 2;
	enemies = [];
}


/**
*Pasa directamente la nivel 6 (boss)
*/
function devOptLvlSeis(){
	if(lvl == 3 || lvl == 6) fboss.hp = 0; 
	lvl = 5;
	enemies = [];
}


/**
*Borra el ranking (todas las cookies)
*/
function devOptDeleteAllCookies(){
	let cookies = document.cookie.split('; ');
	let cookieName, cookieValue;
	let temp;
	for(let i = 0; i < cookies.length; i++){
		deleteCookie(cookies[i].split('=')[0]);
	}
	console.log("All of the cookies have been deleted");
}