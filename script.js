 let testLevel = `
#########
#@..#1.^#
#.......#
#...#..2#
#########`;

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
   "@": Player,
   "^": Exit
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
     this.dom = elt("div", {
       class: "game"
     }, drawGrid(level));
     this.actorLayer = null;
     parent.appendChild(this.dom);
   }

   clear() {
     this.dom.remove();
   }
 }

 const scale = 100;

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
   return elt("div", {}, ...actors.map(actor => {
     let rect = elt("div", {
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

 function resetPositions() {
   playerx = 0
   playery = 0
   en1x = 0
   en1y = 0
   en2x = 0
   en2y = 0
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
     let text = document.createElement("p")
     text.textContent = "HOT SUPER"
     text.setAttribute("class", "win")
     let winmsg = document.body.querySelector('#winmsg')
     console.log(winmsg)
     winmsg.appendChild(text)
   }
 }
 const death = function() {
   getPosition()
   if (overlapMulitple(player, enemy1) == true || overlapMulitple(player, enemy2) == true) {
     window.removeEventListener("keydown", keys)
     let text = document.createElement("p")
     text.textContent = "SQUISH"
     text.setAttribute("class", "looser")
     document.body.appendChild(text)
   }
 }
 const load = function() {
   let el = document.querySelector("div")
   clearElement(el)
   let simpleLevel = new Level(testLevel);
   let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
   display.syncState(State.start(simpleLevel));


 }
 window.addEventListener("keydown", keys)

 function keys() {
   if (event.key == "s") {
     playery = playery + 1
     en1y = en1y + 1
     en2y = en2y + 1
     load()
     getPosition()
     if (overlapMulitple(player, wall) == true) {
       playery = playery - 1
     }
     if (overlapMulitple(enemy1, wall) == true) {
       en1y = en1y - 1
     }
     if (overlapMulitple(enemy2, wall) == true) {
       en2y = en2y - 1
     }
     if (overlapMulitple(enemy1, exit) == true) {
       en1y = en1y - 1
     }
     if (overlapMulitple(enemy2, exit) == true) {
       en2y = en2y - 1
     }
     if (overlapMulitple(enemy1, enemy2) == true) {
       en1y = en1y - 1
     }
     load();
     wincon()
     death()
   }
   if (event.key == "w") {
     playery = playery - 1
     en1y = en1y - 1
     en2y = en2y - 1
     load()
     getPosition()
     if (overlapMulitple(player, wall) == true) {
       playery = playery + 1
     }
     if (overlapMulitple(enemy1, wall) == true) {
       en1y = en1y + 1
     }
     if (overlapMulitple(enemy2, wall) == true) {
       en2y = en2y + 1
     }
     if (overlapMulitple(enemy1, exit) == true) {
       en1y = en1y + 1
     }
     if (overlapMulitple(enemy2, exit) == true) {
       en2y = en2y + 1
     }
     if (overlapMulitple(enemy1, enemy2) == true) {
       en1y = en1y + 1
     }
     load()
     wincon()
     death()
   }
   if (event.key == "a") {
     playerx = playerx - 1
     en1x = en1x - 1
     en2x = en2x - 1
     load()
     getPosition()
     if (overlapMulitple(player, wall) == true) {
       playerx = playerx + 1
     }
     if (overlapMulitple(enemy1, wall) == true) {
       en1x = en1x + 1
     }
     if (overlapMulitple(enemy2, wall) == true) {
       en2x = en2x + 1
     }
     if (overlapMulitple(enemy1, exit) == true) {
       en1x = en1x + 1
     }
     if (overlapMulitple(enemy2, exit) == true) {
       en2x = en2x + 1
     }
     if (overlapMulitple(enemy1, enemy2) == true) {
       en1x = en1x + 1
     }
     let el = document.querySelector("div")
     clearElement(el)
     load()
     wincon()
     death()
   }
   if (event.key == "d") {
     playerx = playerx + 1
     en1x = en1x + 1
     en2x = en2x + 1
     load()
     getPosition()
     if (overlapMulitple(player, wall) == true) {
       playerx = playerx - 1
     }
     if (overlapMulitple(enemy1, wall) == true) {
       en1x = en1x - 1
     }
     if (overlapMulitple(enemy2, wall) == true) {
       en2x = en2x - 1
     }
     if (overlapMulitple(enemy1, exit) == true) {
       en1x = en1x - 1
     }
     if (overlapMulitple(enemy2, exit) == true) {
       en2x = en2x - 1
     }
     if (overlapMulitple(enemy1, enemy2) == true) {
       en1x = en1x - 1
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
     let el = document.querySelector("div")
     clearElement(el)
     load()
     death()
   }
 })
 window.addEventListener("keydown", event => {
   if (event.key == "ArrowUp") {
     en1y = en1y - 1
     en2y = en2y - 1
     load()
     death()
   }
 })
 window.addEventListener("keydown", event => {
   if (event.key == "ArrowLeft") {
     en1x = en1x - 1
     en2x = en2x - 1
     load()
     death()
   }
 })
 window.addEventListener("keydown", event => {
   if (event.key == "ArrowRight") {
     en1x = en1x + 1
     en2x = en2x + 1
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
   console.log("Actor1 Left: " + actor1.style.left);
   console.log("Actor1 Top: " + actor1.style.top);
   console.log("Actor2 Left: " + actor2.style.left);
   console.log("Actor2 Top: " + actor2.style.top);
   return actor1.style.left == actor2.style.left &&
     actor1.style.top == actor2.style.top
 }

 function getPosition() {
   player = document.body.querySelector(".player");
   enemy1 = document.body.querySelectorAll(".enemy1");
   enemy2 = document.body.querySelectorAll(".enemy2");
   wall = document.body.querySelectorAll(".wall");
   exit = document.body.querySelector(".exit");
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

 let simpleLevel = new Level(testLevel);
 let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
 display.syncState(State.start(simpleLevel));
 let resetb = document.body.querySelector("button")

 getPosition();

 resetb.addEventListener("click", event => {
   resetPositions();
   let el = document.querySelector("div")
   clearElement(el)
   let simpleLevel = new Level(testLevel);
   let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
   display.syncState(State.start(simpleLevel));
   window.addEventListener("keydown", keys)
   let winmsg = document.body.querySelector('#winmsg')
   clearElement(winmsg)
 });
