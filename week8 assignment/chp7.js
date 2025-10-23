const musketeers=["Athos", "Porthos","Aramis"]
for (let i = 0; i < musketeers.length; i++) {
  console.log(musketeers[i])
}
musketeers.push("D'Artagnan")

musketeers.forEach(musketeer => {
  // Use myElement to access each array element one by one
  console.log(musketeer)
});

musketeers.splice(2,1)

for (const musketeer of musketeers) {
  console.log(musketeer);
}

const values = [3, 11, 7, 2, 9, 10];
total=0
for (let i=0;i<values.length;i++){
    total+=values[i]
}

console.log(total)

const maxiArray = [3, 11, 7, 2, 9, 10];
maxi=0
for (const ele of maxiArray){
    if (ele>maxi){
        maxi=ele
    }

}