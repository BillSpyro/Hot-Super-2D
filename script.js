 let oldTestLevel = [`
#########
#@..#1.^#
#.......#
#...#..2#
#########`,
   `
#########
#@.1#..^#
#.......#
#2..#...#
#########`,
   `
#########
#@..#1.^#
#.......#
#...#3.2#
#########`,
   `
#########
#@..#4.^#
#.......#
#...#..5#
#########`
 ];

 let testLevel = [`
#####
#..^#
#...#
#@..#
#####`,
   `
#####
#..^#
#.1.#
#@..#
#####`,
   `
####
#^##
#..#
#1##
#.##
#@##
####`,
   `
####
#^##
#..#
#4##
#.##
#@##
####`,
   `
#####
#1.^#
#...#
#.#.#
#@.2#
#####`,
   `
#####
#1.^#
#..3#
#.#.#
#@.2#
#####`,
   `
#######
#.1^2.#
#..#..#
#..#..#
#@....#
#######`,
   `
######
#!5..#
##.#.#
##.#^#
##.###
#@.4!#
######`,
   `
#######
#..^..#
#..3..#
#!1.2!#
#!!.!!#
#@....#
#######`,
   `
!!!!#!!!!!!!
!2......#!!!
!.!!!!!.!!!!
!....!!....!
!!!!.!!!!!.!
!@...#^1...#
!!!!!!!!!!!!`,
   `
###############
######.########
#...#...#...#.#
#.#.#.#.#5#.#.#
#.#.#.#.#.#.#4#
#.#.#.#.#.#.#.#
#@#...#..6#...#
########^###.##
###############`,
   `
#########
#.......#
#.#.#.#.#
#.#.#.#.#
#^#1#2#@#
#########`,
   `
#########
#@.1#..^#
#...#...#
#..2....#
#########`,
   `
######
###^##
###3##
###.##
#1.@2#
###.##
###.##
######`,
   `
#########
#@..#4.^#
#.......#
#...#..5#
#########`,
   `
#########
#@..#1.^#
#.......#
#...#..2#
#########
#c..#3..#
#.......#
#...#..4#
#####.###
#########`,
   `
.....#####.....
...##..^..##...
..#.........#..
.#...........#.
.#...........#.
#....22222....#
#....2...2....#
#....2.@.2....#
#....2...2....#
#....22122....#
.#...........#.
.#...........#.
..#.........#..
...##.....##...
.....#####.....`,
   `
...#####.........#####...
.##.....##.....##.....##.
#...6@....#####...1c....#
#...54....#...#...23....#
.##....^##.....##.....##.
...#####.........#####...

`,
   `
#######################
####!.............1####
#######################
##!#.............@#^#!#
##.#.##############.#.#
##.#.#!!!!!!!!!!!!#.#.#
##.#.#!!!!!!!!!!!!#.#.#
##.#.#!!!!!!!!!!!!#.#.#
##.#.##############.#.#
##4#................#2#
#######################
####!..............6###
#######################
`,
   `
###################
#..............55.#
#@.............44^#
#..............66.#
###################
`
 ];
 let souls = 0;
 let moves = 0;
 let totalMoves = 0;
 let levelNumber = 0
 let namearray = ['wasd to move you daft blue ball', 'They move when you do', 'The Hall', 'Oh Your Approaching Me', 'You are Surrounded From this side', 'What If There Was Another One', 'The Notapenis', 'Pitman', 'Let Them DIE', 'Amazeing', 'Im Coming For You ...Eventually', 'Comb', 'GG EZ', 'Crossroads', 'Mirror', 'I Think I have a Clone Now', "There is no escape", "I see you is where you are going gotem", "Victory loop", "You donated " + souls + " souls you little shit so you get to burn in hell"]
 let scalelist = [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 50, 50, 50, 50, 50, 50]
 let scale = scalelist[levelNumber];
 var Level = class Level {
   constructor(plan) {
     let rows = plan.trim().split("\n").map(l => [...l]);
     this.height = rows.length;
     this.width = rows[0].length;
     this.startActors = [];

     this.rows = rows.map((row, y) => {
       return row.map((ch, x) => {
         let type = entities[ch];
         if (typeof type == "string") return type;
         this.startActors.push(
           type.create(new Vec(x, y), ch));
         return "empty";
       });
     });
   }
 }

 var State = class State {
   constructor(level, actors, status) {
     this.level = level;
     this.actors = actors;
     this.status = status;
   }

   static start(level) {
     return new State(level, level.startActors, "playing");
   }

   get player() {
     return this.actors.find(a => a.type == "player");
   }
 }

 var Vec = class Vec {
   constructor(x, y) {
     this.x = x;
     this.y = y;
   }
   plus(other) {
     return new Vec(this.x + other.x, this.y + other.y);
   }
   times(factor) {
     return new Vec(this.x * factor, this.y * factor);
   }
 }

 var Player = class Player {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "player";
   }

   static create(pos) {
     return new Player(pos.plus(new Vec(playerx, playery)),
       new Vec(0, 0));
   }
 }

 Player.prototype.size = new Vec(1, 1);

 var Clone = class Clone {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "clone";
   }

   static create(pos) {
     return new Clone(pos.plus(new Vec(playerx, playery)),
       new Vec(0, 0));
   }
 }

 Clone.prototype.size = new Vec(1, 1);

 var Pit = class Pit {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "pit";
   }

   static create(pos) {
     return new Pit(pos.plus(new Vec(0, 0)),
       new Vec(0, 0));
   }
 }

 Pit.prototype.size = new Vec(1, 1);

 var Enemy1 = class Enemy1 {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "enemy1";
   }

   static create(pos) {
     return new Enemy1(pos.plus(new Vec(en1x, en1y)),
       new Vec(0, 0));
   }
 }

 Enemy1.prototype.size = new Vec(1, 1);

 var Enemy2 = class Enemy2 {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "enemy2";
   }

   static create(pos) {
     return new Enemy2(pos.plus(new Vec(en2x, en2y)),
       new Vec(0, 0));
   }
 }

 Enemy2.prototype.size = new Vec(1, 1);

 var Enemy3 = class Enemy3 {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "enemy3";
   }

   static create(pos) {
     return new Enemy3(pos.plus(new Vec(en3x, en3y)),
       new Vec(0, 0));
   }
 }

 Enemy3.prototype.size = new Vec(1, 1);

 var OppositeEnemy1 = class OppositeEnemy1 {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "oppositeEnemy1";
   }

   static create(pos) {
     return new OppositeEnemy1(pos.plus(new Vec(oEn1x, oEn1y)),
       new Vec(0, 0));
   }
 }

 OppositeEnemy1.prototype.size = new Vec(1, 1);

 var OppositeEnemy2 = class OppositeEnemy2 {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "oppositeEnemy2";
   }

   static create(pos) {
     return new OppositeEnemy2(pos.plus(new Vec(oEn2x, oEn2y)),
       new Vec(0, 0));
   }
 }

 OppositeEnemy2.prototype.size = new Vec(1, 1);

 var OppositeEnemy3 = class OppositeEnemy3 {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "oppositeEnemy3";
   }

   static create(pos) {
     return new OppositeEnemy3(pos.plus(new Vec(oEn3x, oEn3y)),
       new Vec(0, 0));
   }
 }

 OppositeEnemy3.prototype.size = new Vec(1, 1);

 var Exit = class Exit {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "exit";
   }

   static create(pos) {
     return new Exit(pos.plus(new Vec(0, 0)),
       new Vec(0, 0));
   }
 }

 Exit.prototype.size = new Vec(1, 1);

 var Wall = class Wall {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "wall";
   }

   static create(pos) {
     return new Wall(pos.plus(new Vec(0, 0)),
       new Vec(0, 0));
   }
 }

 Wall.prototype.size = new Vec(1, 1);


 var entities = {
   ".": "empty",
   "#": Wall,
   "1": Enemy1,
   "2": Enemy2,
   "3": Enemy3,
   "4": OppositeEnemy1,
   "5": OppositeEnemy2,
   "6": OppositeEnemy3,
   "@": Player,
   "^": Exit,
   "c": Clone,
   "!": Pit
 };

 function elt(name, attrs, ...children) {
   let dom = document.createElement(name);
   for (let attr of Object.keys(attrs)) {
     dom.setAttribute(attr, attrs[attr]);
   }
   for (let child of children) {
     dom.appendChild(child);
   }
   return dom;
 }

 class DOMDisplay {
   constructor(parent, level) {
     this.dom = elt("div.Game", {
       class: "game"
     }, drawGrid(level));
     this.actorLayer = null;
     parent.appendChild(this.dom);
   }

   clear() {
     this.dom.remove();
   }
 }


 function drawGrid(level) {
   return elt("table", {
     class: "background",
     style: `width: ${level.width * scale}px`
   }, ...level.rows.map(row =>
     elt("tr", {
         style: `height: ${scale}px`
       },
       ...row.map(type => elt("td", {
         class: type
       })))
   ));
 }

 function drawActors(actors) {
   return elt("div.Game", {}, ...actors.map(actor => {
     let rect = elt("div.Game", {
       class: `actor ${actor.type}`
     });
     rect.style.width = `${actor.size.x * scale}px`;
     rect.style.height = `${actor.size.y * scale}px`;
     rect.style.left = `${actor.pos.x * scale}px`;
     rect.style.top = `${actor.pos.y * scale}px`;
     return rect;
   }));
 }

 let playerx = 0
 let playery = 0
 let en1x = 0
 let en1y = 0
 let en2x = 0
 let en2y = 0
 let en3x = 0
 let en3y = 0
 let oEn1x = 0
 let oEn1y = 0
 let oEn2x = 0
 let oEn2y = 0
 let oEn3x = 0
 let oEn3y = 0

 function resetPositions() {
   playerx = 0
   playery = 0
   en1x = 0
   en1y = 0
   en2x = 0
   en2y = 0
   en3x = 0
   en3y = 0
   oEn1x = 0
   oEn1y = 0
   oEn2x = 0
   oEn2y = 0
   oEn3x = 0
   oEn3y = 0
 }

 resetPositions();
 const clearElement = (element) => {
   while (element.firstChild) {
     element.removeChild(element.firstChild);
   }
 };

 const wincon = function() {
   getPosition()
   if (overlap(player, exit) == true) {
     moves = 0;
     if (levelNumber < testLevel.length - 2) {
       window.removeEventListener("keydown", keys)
       window.addEventListener("keydown", nextLevel)
       let winmsg = document.body.querySelector('#winmsg')
       let button = document.createElement("button")
       button.textContent = "Next Level"
       button.setAttribute("class", "next")
       winmsg.appendChild(button)
       let text = document.createElement("p")
       text.textContent = "HOT SUPER"
       text.setAttribute("class", "win")
       winmsg.appendChild(text)
       let nlbutton = winmsg.querySelector('button')
       nlbutton.addEventListener("click", levelnext)

       function levelnext() {
         window.removeEventListener('keydown', nextLevel)
         moves = 0;
         levelNumber = levelNumber + 1
         resetPositions()
         load()
         clearElement(winmsg)
         window.addEventListener("keydown", keys)
       }
     } else {
       if (souls != 0 && levelNumber == testLevel.length - 2) {
         document.querySelector('#levelName').textContent = "You've moved " + totalMoves + " times and donated " + souls + " souls."
         window.removeEventListener("keydown", keys)
         let el = document.querySelector("div.Game")
         clearElement(el)
         let text = document.createElement("p")
         text.textContent = "Congradulations you won"
         text.setAttribute("class", "win")
         let winmsg = document.body.querySelector('#winmsg')
         winmsg.appendChild(text)
         let under = document.createElement("p")
         under.textContent = "try dont die and go to heck"
         under.setAttribute("class", "win")
         winmsg.appendChild(under)
         let button = document.createElement("button")
         button.textContent = "Back to the begining"
         button.setAttribute("class", "next")
         winmsg.appendChild(button)
         let nlbutton = winmsg.querySelector('button')
         nlbutton.addEventListener("click", begining)
         let top = document.querySelector("#levelName")

         function begining() {
           moves = 0;
           totalMoves = 0;
           souls = 0;
           levelNumber = 0
           clearElement(winmsg)
           window.addEventListener("keydown", keys)
           resetPositions()
           load()
         }
       } else {
         if (levelNumber = testLevel.length - 2) {
           levelNumber = levelNumber + 1
         }
         resetPositions()
         let top = document.querySelector("#levelName")
         top.textContent = "You donated " + souls + " souls you little shit so, you get to burn in hell"
         let el = document.querySelector("div")
         el.style.backgroundcolor
         let body = document.querySelector("body");
         body.style.backgroundColor = "darkRed";
         load()
       }
     }
   }
 }

 function nextLevel() {
   if (event.key == " ")
     moves = 0;
   levelNumber = levelNumber + 1
   resetPositions()
   load()
   clearElement(winmsg)
   window.addEventListener("keydown", keys)
   window.removeEventListener('keydown', nextLevel)
 }
 const death = function() {
   getPosition()
   if (overlapMulitple(player, enemy1) == true ||
     overlapMulitple(player, enemy2) == true ||
     overlapMulitple(player, enemy3) == true ||
     overlapMulitple(player, oppositeEnemy1) == true ||
     overlapMulitple(player, oppositeEnemy2) == true ||
     overlapMulitple(player, oppositeEnemy3) == true ||
     overlapMulitple(player, pit) == true) {
     moves = 0;
     window.removeEventListener("keydown", keys)
     let text = document.createElement("p")
     text.textContent = "SQUISH"
     text.setAttribute("class", "looser")
     let winmsg = document.body.querySelector('#winmsg')
     winmsg.appendChild(text)
   }
   if (overlapMulitple(pit, enemy1) == true) {
     enemy1[0].remove();
     en1x = 1000
     en1y = 1000
   }
   if (overlapMulitple(pit, enemy2) == true) {
     enemy2[0].remove();
     en2x = 1000
     en2y = 1000
   }
   if (overlapMulitple(pit, enemy3) == true) {
     enemy3[0].remove();
     en3x = 1000
     en3y = 1000
   }
   if (overlapMulitple(pit, oppositeEnemy1) == true) {
     oppositeEnemy1[0].remove();
     oEn1x = 1000
     oEn1y = 1000
   }
   if (overlapMulitple(pit, oppositeEnemy2) == true) {
     oppositeEnemy2[0].remove();
     oEn2x = 1000
     oEn2y = 1000
   }
   if (overlapMulitple(pit, oppositeEnemy3) == true) {
     oppositeEnemy3[0].remove();
     oEn3x = 1000
     oEn3y = 1000
   }
   if (clone != null) {
     if (overlapMulitple(clone, enemy1) == true ||
       overlapMulitple(clone, enemy2) == true ||
       overlapMulitple(clone, enemy3) == true ||
       overlapMulitple(clone, oppositeEnemy1) == true ||
       overlapMulitple(clone, oppositeEnemy2) == true ||
       overlapMulitple(clone, oppositeEnemy3) == true ||
       overlapMulitple(clone, pit) == true) {
       window.removeEventListener("keydown", keys)
       let text = document.createElement("p")
       text.textContent = "Clone SQUISH"
       text.setAttribute("class", "looser")
       let winmsg = document.body.querySelector('#winmsg')
       winmsg.appendChild(text)
     }
   }
 }
 const load = function() {
   scale = scalelist[levelNumber];
   let stats = document.querySelector("div.Stats")
   clearElement(stats)
   let movesText = document.createElement("p")
   movesText.textContent = "Moves " + moves;
   let soulsText = document.createElement("p")
   soulsText.textContent = "Souls donated " + souls;
   stats.appendChild(movesText)
   stats.appendChild(soulsText)
   let el = document.querySelector("div.Game")
   clearElement(el)
   let top = document.querySelector("#levelName")
   top.textContent = namearray[levelNumber]
   let simpleLevel = new Level(testLevel[levelNumber]);
   let display = new DOMDisplay(document.body.querySelector("div.Game"), simpleLevel);
   display.syncState(State.start(simpleLevel));
   if (levelNumber == testLevel.length - 1 && souls >= 5) {
     document.querySelector('#levelName').textContent = "DIE DIE DIE"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 10) {
     document.querySelector('#levelName').textContent = "YES DIE FOR US"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 20) {
     document.querySelector('#levelName').textContent = "Your souls will fuel us"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 30) {
     document.querySelector('#levelName').textContent = "Oh um thank you, you can just refresh now"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 40) {
     document.querySelector('#levelName').textContent = "You are very determined arnt you"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 50) {
     document.querySelector('#levelName').textContent = "There is nothing left, no point in going on"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 60) {
     document.querySelector('#levelName').textContent = "STOP"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 70) {
     document.querySelector('#levelName').textContent = "Well Okay I'll just leave then"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 80) {
     document.querySelector('#levelName').textContent = "..."
   }
   if (levelNumber == testLevel.length - 1 && souls >= 90) {
     document.querySelector('#levelName').textContent = "Fine, make it 100 and I shall reward you"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 99) {
     document.querySelector('#levelName').textContent = "One more and you will be free"
   }
   if (levelNumber == testLevel.length - 1 && souls >= 100) {
     namearray[0] = "Oh your back"
     namearray[1] = "Well go ahead nothing else changes, there truely is no escape"
     moves = 0;
     totalMoves = 0;
     souls = 0;
     levelNumber = 0
     let body = document.querySelector("body");
     body.style.backgroundColor = "yellow";
     clearElement(winmsg)
     window.addEventListener("keydown", keys)
     resetPositions()
     load()

   }
 }
 window.addEventListener("keydown", reee)

 function reee() {
   if (event.key == 'r') {
     moves = 0;
     souls = souls + 1;
     let soulsText = document.createElement("p")
     soulsText.textContent = "Souls donated " + souls;
     resetPositions();
     load()
     window.addEventListener("keydown", keys)
     let winmsg = document.body.querySelector('#winmsg')
     clearElement(winmsg)


   }

 }
 window.addEventListener("keydown", keys)

 function debugLoad(x) {
   levelNumber = x;
   resetPositions();
   load();
   getPosition();

 }

 function keys() {
   if (event.key == "s") {
     moves = moves + 1;
     totalMoves = totalMoves + 1;
     playery = playery + 1
     en1y = en1y + 1
     en2y = en2y + 1
     en3y = en3y + 1
     oEn1y = oEn1y - 1
     oEn2y = oEn2y - 1
     oEn3y = oEn3y - 1
     load()
     getPosition()
     if (overlapMulitple(player, wall)) {
       playery = playery - 1
     }
     if (overlapMulitple(enemy1, wall) || overlapMulitple(enemy1, exit)) {
       en1y = en1y - 1
     }
     if (overlapMulitple(enemy2, wall) || overlapMulitple(enemy2, exit)) {
       en2y = en2y - 1
     }
     if (overlapMulitple(enemy3, wall) || overlapMulitple(enemy3, exit)) {
       en3y = en3y - 1
     }
     if (overlapMulitple(oppositeEnemy1, wall) || overlapMulitple(oppositeEnemy1, exit)) {
       oEn1y = oEn1y + 1
     }
     if (overlapMulitple(oppositeEnemy2, wall) || overlapMulitple(oppositeEnemy2, exit)) {
       oEn2y = oEn2y + 1
     }
     if (overlapMulitple(oppositeEnemy3, wall) || overlapMulitple(oppositeEnemy3, exit)) {
       oEn3y = oEn3y + 1
     }
     load()
     getPosition()
     if (overlapMulitple(enemy1, enemy2)) {
       en1y = en1y - 1
     }
     if (overlapMulitple(enemy1, enemy3)) {
       en1y = en1y - 1
     }
     if (overlapMulitple(enemy2, enemy3)) {
       en2y = en2y - 1
     }
     load()
     getPosition()
     if (overlapMulitple(enemy1, enemy2)) {
       en1y = en1y - 1
     }
     if (overlapMulitple(enemy1, enemy3)) {
       en1y = en1y - 1
     }
     if (overlapMulitple(enemy2, enemy3)) {
       en2y = en2y - 1
     }
     load()
     getPosition()
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy2)) {
       oEn1y = oEn1y + 1
     }
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy3)) {
       oEn1y = oEn1y + 1
     }
     if (overlapMulitple(oppositeEnemy2, oppositeEnemy3)) {
       oEn2y = oEn2y + 1
     }
     load()
     getPosition()
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy2)) {
       oEn1y = oEn1y + 1
     }
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy3)) {
       oEn1y = oEn1y + 1
     }
     if (overlapMulitple(oppositeEnemy2, oppositeEnemy3)) {
       oEn2y = oEn2y + 1
     }
     load();
     wincon()
     death()
   }
   if (event.key == "w") {
     moves = moves + 1;
     totalMoves = totalMoves + 1;
     playery = playery - 1
     en1y = en1y - 1
     en2y = en2y - 1
     en3y = en3y - 1
     oEn1y = oEn1y + 1
     oEn2y = oEn2y + 1
     oEn3y = oEn3y + 1
     load()
     getPosition()
     if (overlapMulitple(player, wall)) {
       playery = playery + 1
     }
     if (overlapMulitple(enemy1, wall) || overlapMulitple(enemy1, exit)) {
       en1y = en1y + 1
     }
     if (overlapMulitple(enemy2, wall) || overlapMulitple(enemy2, exit)) {
       en2y = en2y + 1
     }
     if (overlapMulitple(enemy3, wall) || overlapMulitple(enemy3, exit)) {
       en3y = en3y + 1
     }
     if (overlapMulitple(oppositeEnemy1, wall) || overlapMulitple(oppositeEnemy1, exit)) {
       oEn1y = oEn1y - 1
     }
     if (overlapMulitple(oppositeEnemy2, wall) || overlapMulitple(oppositeEnemy2, exit)) {
       oEn2y = oEn2y - 1
     }
     if (overlapMulitple(oppositeEnemy3, wall) || overlapMulitple(oppositeEnemy3, exit)) {
       oEn3y = oEn3y - 1
     }
     load()
     getPosition()
     if (overlapMulitple(enemy1, enemy2)) {
       en1y = en1y + 1
     }
     if (overlapMulitple(enemy1, enemy3)) {
       en1y = en1y + 1
     }
     if (overlapMulitple(enemy2, enemy3)) {
       en2y = en2y + 1
     }
     load()
     getPosition()
     if (overlapMulitple(enemy1, enemy2)) {
       en1y = en1y + 1
     }
     if (overlapMulitple(enemy1, enemy3)) {
       en1y = en1y + 1
     }
     if (overlapMulitple(enemy2, enemy3)) {
       en2y = en2y + 1
     }
     load()
     getPosition()
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy2)) {
       oEn1y = oEn1y - 1
     }
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy3)) {
       oEn1y = oEn1y - 1
     }
     if (overlapMulitple(oppositeEnemy2, oppositeEnemy3)) {
       oEn2y = oEn2y - 1
     }
     load()
     getPosition()
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy2)) {
       oEn1y = oEn1y - 1
     }
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy3)) {
       oEn1y = oEn1y - 1
     }
     if (overlapMulitple(oppositeEnemy2, oppositeEnemy3)) {
       oEn2y = oEn2y - 1
     }
     load()
     wincon()
     death()
   }
   if (event.key == "a") {
     moves = moves + 1;
     totalMoves = totalMoves + 1;
     playerx = playerx - 1
     en1x = en1x - 1
     en2x = en2x - 1
     en3x = en3x - 1
     oEn1x = oEn1x + 1
     oEn2x = oEn2x + 1
     oEn3x = oEn3x + 1
     load()
     getPosition()
     if (overlapMulitple(player, wall)) {
       playerx = playerx + 1
     }
     if (overlapMulitple(enemy1, wall) || overlapMulitple(enemy1, exit)) {
       en1x = en1x + 1
     }
     if (overlapMulitple(enemy2, wall) || overlapMulitple(enemy2, exit)) {
       en2x = en2x + 1
     }
     if (overlapMulitple(enemy3, wall) || overlapMulitple(enemy3, exit)) {
       en3x = en3x + 1
     }
     if (overlapMulitple(oppositeEnemy1, wall) || overlapMulitple(oppositeEnemy1, exit)) {
       oEn1x = oEn1x - 1
     }
     if (overlapMulitple(oppositeEnemy2, wall) || overlapMulitple(oppositeEnemy2, exit)) {
       oEn2x = oEn2x - 1
     }
     if (overlapMulitple(oppositeEnemy3, wall) || overlapMulitple(oppositeEnemy3, exit)) {
       oEn3x = oEn3x - 1
     }
     load()
     getPosition()
     if (overlapMulitple(enemy1, enemy2)) {
       en1x = en1x + 1
     }
     if (overlapMulitple(enemy1, enemy3)) {
       en1x = en1x + 1
     }
     if (overlapMulitple(enemy2, enemy3)) {
       en2x = en2x + 1
     }
     load()
     getPosition()
     if (overlapMulitple(enemy1, enemy2)) {
       en1x = en1x + 1
     }
     if (overlapMulitple(enemy1, enemy3)) {
       en1x = en1x + 1
     }
     if (overlapMulitple(enemy2, enemy3)) {
       en2x = en2x + 1
     }
     load()
     getPosition()
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy2)) {
       oEn1x = oEn1x - 1
     }
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy3)) {
       oEn1x = oEn1x - 1
     }
     if (overlapMulitple(oppositeEnemy2, oppositeEnemy3)) {
       oEn2x = oEn2x - 1
     }
     load()
     getPosition()
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy2)) {
       oEn1x = oEn1x - 1
     }
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy3)) {
       oEn1x = oEn1x - 1
     }
     if (overlapMulitple(oppositeEnemy2, oppositeEnemy3)) {
       oEn2x = oEn2x - 1
     }
     load()
     wincon()
     death()
   }
   if (event.key == "d") {
     moves = moves + 1;
     totalMoves = totalMoves + 1;
     playerx = playerx + 1
     en1x = en1x + 1
     en2x = en2x + 1
     en3x = en3x + 1
     oEn1x = oEn1x - 1
     oEn2x = oEn2x - 1
     oEn3x = oEn3x - 1
     load()
     getPosition()
     if (overlapMulitple(player, wall)) {
       playerx = playerx - 1
     }
     if (overlapMulitple(enemy1, wall) || overlapMulitple(enemy1, exit)) {
       en1x = en1x - 1
     }
     if (overlapMulitple(enemy2, wall) || overlapMulitple(enemy2, exit)) {
       en2x = en2x - 1
     }
     if (overlapMulitple(enemy3, wall) || overlapMulitple(enemy3, exit)) {
       en3x = en3x - 1
     }
     if (overlapMulitple(oppositeEnemy1, wall) || overlapMulitple(oppositeEnemy1, exit)) {
       oEn1x = oEn1x + 1
     }
     if (overlapMulitple(oppositeEnemy2, wall) || overlapMulitple(oppositeEnemy2, exit)) {
       oEn2x = oEn2x + 1
     }
     if (overlapMulitple(oppositeEnemy3, wall) || overlapMulitple(oppositeEnemy3, exit)) {
       oEn3x = oEn3x + 1
     }
     load()
     getPosition()
     if (overlapMulitple(enemy1, enemy2)) {
       en1x = en1x - 1
     }
     if (overlapMulitple(enemy1, enemy3)) {
       en1x = en1x - 1
     }
     if (overlapMulitple(enemy2, enemy3)) {
       en2x = en2x - 1
     }
     load()
     getPosition()
     if (overlapMulitple(enemy1, enemy2)) {
       en1x = en1x - 1
     }
     if (overlapMulitple(enemy1, enemy3)) {
       en1x = en1x - 1
     }
     if (overlapMulitple(enemy2, enemy3)) {
       en2x = en2x - 1
     }
     load()
     getPosition()
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy2)) {
       oEn1x = oEn1x + 1
     }
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy3)) {
       oEn1x = oEn1x + 1
     }
     if (overlapMulitple(oppositeEnemy2, oppositeEnemy3)) {
       oEn2x = oEn2x + 1
     }
     load()
     getPosition()
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy2)) {
       oEn1x = oEn1x + 1
     }
     if (overlapMulitple(oppositeEnemy1, oppositeEnemy3)) {
       oEn1x = oEn1x + 1
     }
     if (overlapMulitple(oppositeEnemy2, oppositeEnemy3)) {
       oEn2x = oEn2x + 1
     }
     load()
     wincon()
     death()
   }
 }
 window.addEventListener("keydown", event => {
   if (event.key == "ArrowDown") {
     en1y = en1y + 1
     en2y = en2y + 1
     en3y = en3y + 1
     oEn1y = oEn1y - 1
     oEn2y = oEn2y - 1
     oEn3y = oEn3y - 1
     load()
     death()
   }
 })
 window.addEventListener("keydown", event => {
   if (event.key == "ArrowUp") {
     en1y = en1y - 1
     en2y = en2y - 1
     en3y = en3y - 1
     oEn1y = oEn1y + 1
     oEn2y = oEn2y + 1
     oEn3y = oEn3y + 1
     load()
     death()
   }
 })
 window.addEventListener("keydown", event => {
   if (event.key == "ArrowLeft") {
     en1x = en1x - 1
     en2x = en2x - 1
     en3x = en3x - 1
     oEn1x = oEn1x + 1
     oEn2x = oEn2x + 1
     oEn3x = oEn3x + 1
     load()
     death()
   }
 })
 window.addEventListener("keydown", event => {
   if (event.key == "ArrowRight") {
     en1x = en1x + 1
     en2x = en2x + 1
     en3x = en3x + 1
     oEn1x = oEn1x - 1
     oEn2x = oEn2x - 1
     oEn3x = oEn3x - 1
     load()
     death()
   }
 })
 DOMDisplay.prototype.syncState = function(state) {
   if (this.actorLayer) this.actorLayer.remove();
   this.actorLayer = drawActors(state.actors);
   this.dom.appendChild(this.actorLayer);
   this.dom.className = `game ${state.status}`;
 };

 function overlap(actor1, actor2) {
   return actor1.style.left == actor2.style.left &&
     actor1.style.top == actor2.style.top
 }

 function getPosition() {
   player = document.body.querySelector(".player");
   enemy1 = document.body.querySelectorAll(".enemy1");
   enemy2 = document.body.querySelectorAll(".enemy2");
   enemy3 = document.body.querySelectorAll(".enemy3");
   oppositeEnemy1 = document.body.querySelectorAll(".oppositeEnemy1");
   oppositeEnemy2 = document.body.querySelectorAll(".oppositeEnemy2");
   oppositeEnemy3 = document.body.querySelectorAll(".oppositeEnemy3");
   wall = document.body.querySelectorAll(".wall");
   exit = document.body.querySelector(".exit");
   clone = document.body.querySelector(".clone");
   pit = document.body.querySelectorAll(".pit");
 }

 function overlapMulitple(actor1, actor2) {

   if (actor1.length == undefined && actor2.length == undefined) {
     return overlap(actor1, actor2);

   } else if (actor1.length != undefined && actor2.length == undefined) {

     for (let i = 0; i < actor1.length; i++) {
       if (overlap(actor1[i], actor2)) {

         return true;

       }
     }

     return false;

   } else if (actor1.length == undefined && actor2.length != undefined) {

     for (let i = 0; i < actor2.length; i++) {
       if (overlap(actor1, actor2[i])) {

         return true;

       }
     }

     return false;

   } else {

     for (let i = 0; i < actor1.length; i++) {
       for (let j = 0; j < actor2.length; j++) {
         if (overlap(actor1[i], actor2[j])) {

           return true;

         }
       }
     }

     return false;

   }
 }
 load()
 let resetb = document.body.querySelector("button")
 getPosition();
 resetb.addEventListener("click", event => {
   moves = 0;
   souls = souls + 1;
   resetPositions();
   load()
   window.addEventListener("keydown", keys)
   let winmsg = document.body.querySelector('#winmsg')
   clearElement(winmsg)
 });
