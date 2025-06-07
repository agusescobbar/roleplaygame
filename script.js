let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'palo', power: 5 },
  { name: 'daga', power: 30 },
  { name: 'martillo pesado', power: 50 },
  { name: 'espada', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "bestia",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
];
const locations = [
  {
    name: "centro ciudad",
    "button text": ["A la ciudad", "A la cueva", "Pelear con el Dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Estas en el centro de la ciudad, un cartel dice \"Tienda\"."
  },
  {
    name: "tienda",
    "button text": ["10 de vida(10 oro)", "Arma (30 oro)", "Ir al centro de la ciudad"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Entraste a la tienda"
  },
  {
    name: "Cueva",
    "button text": ["Pelear slime", "Pelear bestia", "Ir al centro de la ciudad"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Entraste a la cueva, vas a encontrar enemigos."
  },
  {
    name: "Pelear",
    "button text": ["Atacar", "Esquivar", "Huir"],
    "button functions": [attack, dodge, goTown],
    text: "Estas peleando contra un enemigo!"
  },
  {
    name: "Matar enemigo",
    "button text": ["Ir al centro de la ciudad", "Ir al centro de la ciudad", "Ir al centro de la ciudad"],
    "button functions": [goTown, goTown, goTown],
    text: 'El enemigo grita "Arg!" al morir. Vos ganas experiencia y un poco de oro.'
  },
  {
    name: "Perder",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "Moriste. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "Mataste al dragon! GANASTE! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Ir al centro de la ciudad?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Encontraste un juego secreto. Elegi un numero arriba, entre 10 numeros si el que elegis es el indicado vos ganas!!!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "No tenes tanto Oro para comprar vida...";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Vos ahora tenes " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " En tu inventario tenes: " + inventory;
    } else {
      text.innerText = "No tenes tanto Oro para comprar un arma...";
    }
  } else {
    text.innerText = "Ya tenes la mejor arma!";
    button2.innerText = "Vender tu arma por 15 de oro";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Vos vendiste tu " + currentWeapon + ".";
    text.innerText += " En tu inventario tenes: " + inventory;
  } else {
    text.innerText = "No vendas tu unica arma!!!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "El " + monsters[fighting].name + " ataca.";
  text.innerText += " Vos atacas con tu " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Fallaste...";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Tu " + inventory.pop() + " se rompio.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Vos esquivaste el ataque de " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["palo"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Vos elegiste " + guess + ". Estos son los numeros randoms:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Bien! Ganaste 20 de Oro!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Mal! Perdiste 10 de Vida!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
