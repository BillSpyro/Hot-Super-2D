 let testLevel = `
#########
#@..#%.^#
#.......#
#...#..%#
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

 var Enemy = class Enemy {
   constructor(pos) {
     this.pos = pos;
   }

   get type() {
     return "enemy";
   }

   static create(pos) {
     return new Enemy(pos.plus(new Vec(enx, eny)),
       new Vec(0, 0));
   }
 }

 Enemy.prototype.size = new Vec(1, 1);

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

 var entities = {
   ".": "empty",
   "#": "wall",
   "%": Enemy,
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
 let enx = 0
 let eny = 0
 const clearElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};
window.addEventListener("keydown" , event => {
  if (event.key == "s"){
    playery=playery+1
    eny=eny+1
    let el = document.querySelector("div")
    clearElement(el)
    let simpleLevel = new Level(testLevel);
    let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
    display.syncState(State.start(simpleLevel));
  }
})
window.addEventListener("keydown" , event => {
  if (event.key == "w"){
    playery=playery-1
    eny=eny-1
    let el = document.querySelector("div")
    clearElement(el)
    let simpleLevel = new Level(testLevel);
    let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
    display.syncState(State.start(simpleLevel));
  }
})
window.addEventListener("keydown" , event => {
  if (event.key == "a"){
    playerx=playerx-1
    enx=enx-1
    let el = document.querySelector("div")
    clearElement(el)
    let simpleLevel = new Level(testLevel);
    let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
    display.syncState(State.start(simpleLevel));
  }
})
window.addEventListener("keydown" , event => {
  if (event.key == "d"){
    playerx=playerx+ 1
    enx= enx + 1
    let el = document.querySelector("div")
    console.log(el)
    clearElement(el)
    let simpleLevel = new Level(testLevel);
    let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
    display.syncState(State.start(simpleLevel));
  }
})
window.addEventListener("keydown" , event => {
  if (event.key == "ArrowDown"){
    eny=eny+1
    let el = document.querySelector("div")
    clearElement(el)
    let simpleLevel = new Level(testLevel);
    let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
    display.syncState(State.start(simpleLevel));
  }
})
window.addEventListener("keydown" , event => {
  if (event.key == "ArrowUp"){
    eny=eny-1
    let el = document.querySelector("div")
    clearElement(el)
    let simpleLevel = new Level(testLevel);
    let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
    display.syncState(State.start(simpleLevel));
  }
})
window.addEventListener("keydown" , event => {
  if (event.key == "ArrowLeft"){
    enx=enx-1
    let el = document.querySelector("div")
    clearElement(el)
    let simpleLevel = new Level(testLevel);
    let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
    display.syncState(State.start(simpleLevel));
  }
})
window.addEventListener("keydown" , event => {
  if (event.key == "ArrowRight"){
    enx= enx + 1
    let el = document.querySelector("div")
    console.log(el)
    clearElement(el)
    let simpleLevel = new Level(testLevel);
    let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
    display.syncState(State.start(simpleLevel));
  }
})

 DOMDisplay.prototype.syncState = function(state) {
   if (this.actorLayer) this.actorLayer.remove();
   this.actorLayer = drawActors(state.actors);
   this.dom.appendChild(this.actorLayer);
   this.dom.className = `game ${state.status}`;
 };

 let simpleLevel = new Level(testLevel);
 let display = new DOMDisplay(document.body.querySelector("div"), simpleLevel);
 display.syncState(State.start(simpleLevel));
