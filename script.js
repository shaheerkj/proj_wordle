function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
}
async function generateAWord(){
    const WORD_URL = "https://words.dev-apis.com/word-of-the-day?random=1";
    const promise = await fetch(WORD_URL);
    const processedResponse = await promise.json();
    return processedResponse.word.toUpperCase();
}
async function validateAWord(wordForValidation){
    const VALID_URL = "https://words.dev-apis.com/validate-word";
    const response = await fetch(VALID_URL,{
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({word : wordForValidation})
    });
    if(!response.ok){
        throw new error('Bad response!');

    }
    const jsonResponse = await response.json();
    return jsonResponse.validWord;
}
let rows = document.querySelectorAll(".row");
let index = 0;
let rowIndex = 0;
let wordle = '';
let countOfGuesses = 0;

(async function() {
    wordle = await generateAWord();
})();
//wordle = wordle.toUpperCase();

document.addEventListener("keydown",async function(event){
    if (rowIndex >= rows.length) {
        console.error("rowIndex out of bounds: " + rowIndex);
        return;
    }
    
    let divs = rows[rowIndex].querySelectorAll(".element"); 
    if (!divs) {
        console.error("No divs found for rowIndex: " + rowIndex);
        return; 
    }
    let keyPressed = event.key;
    
    if (keyPressed === 'Backspace') {
        if (divs[index].innerText !== '') {
            divs[index].innerText = '';  
        } else if (index > 0) {
            index--;  
            divs[index].innerText = ''; 
        }
    }
    else if(isLetter(keyPressed) && index < 5){
        if(index === 5){
            return;
        }
        else if(divs[index].innerText === ''){
            divs[index].innerText = keyPressed.toUpperCase();
            if(index < divs.length-1)
                index++;
        }
    }
    else if (keyPressed === 'Enter') {
        if (index === 4) {  // Ensure all 5 letters are filled
            let usrString = "";
            divs.forEach(function (div) {
                usrString += div.innerText;
            });
    
            const isValid = await validateAWord(usrString);
            console.log(isValid);
    
            if (isValid) {
                if(wordle===usrString){
                    alert("You won!!");
                    return;
                }
                let wordParts = wordle.split("");
                let usrParts = usrString.split("");
                let arr = wordle.split(""); // Copy of wordle to manipulate
    
                // Step 1: Check for correct letters in correct positions (green)
                for (let i = 0; i < 5; i++) {
                    if (wordParts[i] === usrParts[i]) {
                        divs[i].classList.add("correct");
                        arr[i] = ''; // Mark as used
                        countOfGuesses++;
                    }
                }
    
                // Step 2: Check for correct letters in wrong positions (yellow)
                for (let i = 0; i < 5; i++) {
                    if (arr.includes(usrParts[i]) && wordParts[i] !== usrParts[i]) {
                        divs[i].classList.add("close");
                        let j = arr.indexOf(usrParts[i]);
                        arr[j] = ''; // Mark as used
                    }
                }
    
                // Step 3: Mark remaining letters as incorrect (grey)
                for (let i = 0; i < 5; i++) {
                    if (!divs[i].classList.contains("correct") && !divs[i].classList.contains("close")) {
                        divs[i].classList.add("incorrect");
                    }
                }
    
                rowIndex++;
                index = 0;
                console.log(countOfGuesses);
                console.log(rowIndex);
                // Check if the game is over (either by winning or max attempts)
                if (countOfGuesses === 5 || rowIndex > 5) {
                    alert(`Game over. The word was ${wordle.toLowerCase()}`);
                    return;
                }
    
            } else {
                // Invalid word, show red border
                divs.forEach(function (div) {
                    div.style.border = "2px solid red";
                });
                console.log("Incorrect Word");
            }
        } else {
            console.log("Fill all the letters before pressing Enter.");
        }
    }
})