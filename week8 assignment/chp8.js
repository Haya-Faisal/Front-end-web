word=console.log("enter a word")
console.log(word.lenght)
const lowercaseWord = word.toLowerCase();
console.log(lowercaseWord); 

const uppercaseWord = word.toUpperCase();
console.log(uppercaseWord); 

function countVowels(str) {
    const vowels = 'aeiouAEIOU';
    let count = 0;
    
    for (let char of str) {
        if (vowels.includes(char)) {
            count++;
        }
    }
    return count;
}

const vowelCount = countVowels(word);

function backwards(str){
    return str.split('').reverse().join('');
}

const reverse=backwards(word)

function isPalindrome(str){
    low=0
    high=str.lenght-1
    pali=true
    while (low<high && pali==true){
        if (str[low]==str[high]){
            low+=1
            high-=1
        }
        else{
            pali=false
        }
    }
}