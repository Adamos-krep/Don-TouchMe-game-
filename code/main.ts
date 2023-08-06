import kaboom from "kaboom"
import "kaboom/global"

kaboom({
  background: [100,100,0],
})



loadSprite("monster", "/sprites/favicon.png")
loadSprite("wall", "/sprites/steel.png")
loadSprite("people", "/sprites/people.png")
loadSound("score", "/sounds/score.mp3")
loadSound("justice", "/sounds/justice.mp4")





const monster = add([
  sprite("monster"),
  scale(2),
  pos(700,300),
  z(1),
  area(),
  "monster",
])

const speed = 350;
const enemeyspeed = 280;
//Moving up
onKeyDown("up", ()=>{
  monster.move(0, -speed)
})

//down
onKeyDown("down", ()=>{
  monster.move(0, speed)
})

//left
onKeyDown("left", ()=>{
  monster.move(-speed, 0)
})

//right
onKeyDown("right", ()=>{
  monster.move(speed, 0)
})

//The game width and height
const gamewidth = 1000;
const gameheight = 600;
width(()=>{
  gamewidth
})

height(()=>{
  gameheight
})

const Text = add([
  text("Let me touch you :D"),
  pos(5, 5),
  color(144, 238, 144),
  scale(1),
]);

monster.onCollide("people",(people)=>{
  destroy(monster)
  play("score")
  add([
    text("You lost"),
    pos(500,300),
    scale(2),
    color(255,0,0)
  ])
  
})

//Add people ai
const people = add([
  sprite("people"),
  scale(2),
  pos(200, 300),
  area(),
  state("move", [ "idle","attack", "move" ]),
  "people",
])

people.onStateEnter("idle", async() =>{
  await wait(0.5)
  people.enterState("attack")
})

const SpaceBetweenMonsterAndPeople = 100;

people.onStateEnter("attack", async () => {
  const dir = monster.pos.sub(people.pos).unit();
  add([
    pos(people.pos),
    move(dir),
  ])

  
  people.enterState("move")
});

people.onStateEnter("move", async () => {
	await wait(2)
	people.enterState("idle")
})


people.onStateUpdate("move", () => {
	if (!monster.exists()) return
	const dir = monster.pos.sub(people.pos).unit()
	people.move(dir.scale(enemeyspeed))
})

//Note: a part of this code was from the kaboom website I used because this is my first time using it.

//Add a timer(30 second)
let timeinsec = 30;
let timer = add([
  text(`You have: ${timeinsec}s`),
  pos(950,5),
])

function updateTimerDisplay() {
  timer.text = `You have: ${timeinsec}s`;
}

loop(1, () => {
  timeinsec--;
  updateTimerDisplay();

  
  if (timeinsec <= 0) {
    
    destroy(timer);
    timeinsec = 0;
    add([
      text("You Won"),
      pos(500,300),
      scale(2),
      color(255,0,0),
      destroyAll()
  ])
    return;
  }
});