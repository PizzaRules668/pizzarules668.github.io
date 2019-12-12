let gravity = 0.7;
let xMove = 0;
let run = true
let dpi = window.devicePixelRatio;

function startGame() {
  document.getElementById("start").style.display = "none"
  game.start()
}

function component(x, y, height, width, context) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
  this.context = context
  this.uniqueContext = this.context
  this.context.fillStyle = "#2530A4"


  this.update = function () {

    if (this.x <= 5) {
      this.x = 5
    }

    if (this.x >= 288) {
      this.x = 288
    }
    if (this.y >= 125) {
      this.y = 125
      this.context.fillRect(this.x, this.y, this.width, this.height)
    } else {
      this.context.fillRect(this.x, this.y, this.width, this.height)
    }

    if (gravity >= 2.3) {
      if (player.y >= 125) { air = false }
      gravity = 2.3
    }
    if (gravity <= -2) {
      air = true
      gravity = -2
    }
  }

  this.draw = function () {
    this.context.fillRect(this.x, this.y, this.width, this.height)
  }

  this.crashWith = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
      (mytop > otherbottom) ||
      (myright < otherleft) ||
      (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

let player;
let ground;
let platforms = [];
let obstacles = [];
let context;
let time = 1000
let air = false;
let score = 0


let game = {
  area: "",
  newObstacle: "",
  interval: "",
  platform: "",
  changeTime: "",
  start: function () {
    this.area = document.createElement("canvas")
    this.context = this.area.getContext("2d");
    context = this.context;
    document.body.insertBefore(this.area, document.body.childNodes[0]);
    time = 1000
    this.context.clearRect(0, 0, this.area.width, this.area.height);
    //Player component
    player = new component(20, 20, 10, 10, this.context)
    player.update()
    //Ground component
    ground = new component(-10, 135, 1000, 1000, this.context)
    ground.draw()


    this.interval = setInterval(Update, 1);
    this.newObstacle = setInterval(newObstacle, time);
    this.changeTime = setInterval(changeTime, 7000)
    this.platform = setInterval(newPlatform, 3000)


  },
  clear: function () {
    this.context.clearRect(0, 0, this.area.width, this.area.height);
  }
}
function newPlatform() {
  platform = new component(900, 80, 6, 90, context)
  platform.update()
  platforms.push(platform)
}
function changeTime() {
  time -= 100
  game.newObstacle = setInterval(newObstacle, time)
}

function Update() {
  game.clear()
  player.y += gravity
  score += 1
  context.fillText(score, (game.area.width / 2) - 20, 40);
  context.fillStyle = "#2530A4"
  context.font = "30px Impact, Charcoal, sans-serif"
 

  if (gravity >= 0) {
    gravity += 0.025
  }

  if (gravity < 0) {
    gravity += 0.025
  }

  player.x += xMove


  player.update()
  ground.draw()

  for (i of obstacles) {


    if (i.crashWith(player)) {
      clearInterval(game.interval)
      clearInterval(game.newObstacle)
      clearInterval(game.platform)
      clearInterval(game.changeTime)
      player = ""
      ground = ""
      platform = ""
      time = 1000
      swal("Game over!", "Score : " + String(score)).then(function() {
        location.reload()
      })
      run = false
    } else {
      i.x -= 1.25
      i.draw()
    }
  }

  for (i of platforms) {
    i.x -= 1.25
    i.draw()

    if (i.crashWith(player)) {
      player.y = i.y - 10
      air = false
    }
  }

}

function newObstacle() {
  obstacle = new component(900, 135, 10, 10, context)
  obstacle.update()
  obstacles.push(obstacle)
  //game.start()
}

function Up() {
  gravity = -2.4
  air = true
  Update()
}

function Right() {
  xMove = 0.6
  Update()
}

function Left() {
  xMove = -0.6
  Update()
}
$(document).ready(function () {
  $(document).keydown(function (e) {
    if (run) {
      if (e.key == "ArrowUp") {
        if (air == false) {
          Up()
          e.preventDefault();
          xMove = 0
        }
      } else if (e.key == "ArrowRight") {
        Right()
        e.preventDefault();
        
      } else if (e.key == "ArrowLeft") {
        Left()
        e.preventDefault();
      }
    }
  })

  $(document).keyup(function () {
    xMove = 0
  })
})

