const aurora = {
  name: "Aurora",
  health: 150,
  strength: 25,
  xp:0,

// Return the character description
describe() {
    return `${this.name} has ${this.health} health points and ${this
      .strength} as strength and ${this.xp} as xp`;
}
};

// TODO: create the character object here

// Aurora is harmed by an arrow
aurora.health -= 20;

// Aurora equips a strength necklace
aurora.strength += 10;

// Aurora learn a new skill
aurora.xp += 15;

console.log(aurora.describe());

const dog={
  name:"fang",
  species:"boarhound",
  size:75,

  describe(){
    return `${this.name} is a ${this.species} dog measuring ${this.size}` 
  },

  bark(){
    return "Grr!"

  },
  sound(){
    return `Look, a cat! ${dog.name} barks: ${dog.bark()}`
  },

}

console.log(dog.describe());
console.log(dog.sound());

const r = Number(prompt("Enter the circle radius:"));

// TODO: create the circle object here
const circle = {
  radius: r,
  
  circumference() {
    return 2 * Math.PI * this.radius;
  },
  
  area() {
    return Math.PI * this.radius * this.radius;
  }
};

console.log(`Its circumference is ${circle.circumference()}`);
console.log(`Its area is ${circle.area()}`);
