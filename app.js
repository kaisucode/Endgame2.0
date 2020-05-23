
let port = 5000;

let express = require('express'); // needs this library
let app = express();
let server = require('http').createServer(app).listen(port);
let socket = require('socket.io');
let io = socket(server);
app.use(express.static('public'));

console.log(`server running on port ${port}`);
app.get('/', function(req, res){
	res.redirect("index.html");
});


// constants, exist in both files
const MASS = {
  "player": 1,
  "booleits": 0.1,
  "amoboxes": 1,
  "extralife": 1
};

const RADIUS = {
  "player": 1,
  "booleits": 0.1,
  "extralife": 1,
  "amoboxes": 1
}
const PLAYERS = ["redA", "redB", "bluA", "bluB"];
// constants, exist in both files

let game_environment = {
  "redTeam": {
    "teamlives": 5
  },
  "bluTeam": {
    "teamlives": 5
  },
  "redA": { "booleits": 10, "pos": {"x": 1, "y": 2, "z": 3}, "vel": {"x": 1, "y": 2, "z": 3}, "onPlanet": false },
  "redB": { "booleits": 10, "pos": {"x": 10, "y": 2, "z": 3}, "vel": {"x": 1, "y": 2, "z": 3}, "onPlanet": false },
  "bluA": { "booleits": 10, "pos": {"x": -10, "y": 20, "z": 3}, "vel": {"x": 1, "y": 2, "z": 3}, "onPlanet": false },
  "bluB": { "booleits": 10, "pos": {"x": 20, "y": 20, "z": 3}, "vel": {"x": 1, "y": 2, "z": 3}, "onPlanet": false },
  "environment": {
    "asteroids": [
      {"pos": {"x": 1, "y": 200, "z": 3}, "vel": {"x": 1, "y": 2, "z": 3}, "mass": 4, "r": 10},
      {"pos": {"x": 1, "y": 300, "z": 3}, "vel": {"x": 1, "y": 2, "z": 3}, "mass": 6, "r": 40},
      {"pos": {"x": 1, "y": 400, "z": 3}, "vel": {"x": 1, "y": 2, "z": 3}, "mass": 7, "r": 30}
    ],
    "amoboxes": [
      {"pos": {"x": 1, "y": 2, "z": 100}, "vel": {"x": 1, "y": 2, "z": 3}},
    ],
    "extralife": {"pos": {"x": 1, "y": 2, "z": 200}, "vel": {"x": 1, "y": 2, "z": 3}},
    "booleits": [
      {"pos": {"x": 1, "y": 2, "z": 30}, "vel": {"x": 1, "y": 2, "z": 3}}
    ]
  }
}

playerTaken = {
	"redA": false,
	"redB": false,
	"bluA": false,
	"bluB": false
}

io.sockets.on('connection', function(socket){
	console.log("connected");
	socket.emit("chat message", "GREETINGS FROM SERVER")
	socket.on('disconnect', function(){
		console.log("player disconnected");
	});

	socket.on('pickedTeam', function(choice){
		console.log(playerTaken);
		if(choice["team"] == "red"){
			if(!playerTaken["redA"]){
				socket.emit("whoami", "redA");
				playerTaken["redA"] = true;
			}
			else if(!playerTaken["redB"]){
				socket.emit("whoami", "redB");
				playerTaken["redB"] = true;
			}
			else{
				socket.emit("whoami", "chooseBlu");
			}
		}

		else if(choice["team"] == "blu"){
			if(!playerTaken["bluA"]){
				socket.emit("whoami", "bluA");
				playerTaken["bluA"] = true;
			}
			else if(!playerTaken["bluB"]){
				socket.emit("whoami", "bluB");
				playerTaken["bluB"] = true;
			}
			else{
				socket.emit("whoami", "chooseRed");
			}
		}

		if(playerTaken["redA"] && playerTaken["redB"] && playerTaken["bluA"] && playerTaken["bluB"]){
			socket.broadcast.emit("startGame", "let the hunger games begin");
			socket.emit("startGame", "let the hunger games begin");
		}
 
	})


	socket.on('playerMovementOnPlanet', function(playerMovement){
		console.log("hai");
		let player = playerMovement["role"];
		game_environment[player]["vel"] = playerMovement["vel"];
		console.log(`player ${player} moved`);
	});

	socket.on('shooting', function(action){
		let owner = action["owner"];
		let vel = action["vel"];
		console.log(`player ${owner} shot a booleit`);

		newBooleit = {
			"pos": game_environment[owner]["pos"], 
			"vel": vel
		};

		game_environment[owner]["booleits"]--;
		console.log(game_environment["environment"]["booleits"]);
		game_environment["environment"]["booleits"].push(newBooleit);
	});
});

// function checkForAsteroidCollisions(){
//   if playerCollidesWith
	
// }

// Running timeout for bullet path and asteroid path and player path
// checkForAsteroidCollisons();
// checkForAmoboxCollisons();
// checkForExtralifeCollisons();

function sq (number) {
  return number * number;
}
function vecMagSquared(v){
  return sq(v.x) + sq(v.y) + sq(v.z);
}
function vecDiff(a, b){
  return {"x": a.x-b.x, "y": a.y-b.y, "z": a.z-b.z};
}
function vecDiffMagSquared(a, b){
  return vecMagSquared(vecDiff(a,b));
}

// setTimeout(update, 1000);
// function update(){
//   for(p in PLAYERS){
//     let player = PLAYERS[p];
//     for(i in game_environment.environment.asteroids){
//       let asteroid = game_environment.environment.asteroids[i];
//       if(vecDiffMagSquared(player, asteroid) <= sq(asteroid.radius) + sq()){
//       }
//   }
//   setTimeout(update, 1000);
// };





