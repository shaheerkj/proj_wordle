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
    else if(keyPressed === 'Enter'){
        if(index === 4 && divs[index].innerText !== ''){
            let usrString = "";
            divs.forEach(function(div){
                usrString += div.innerText;
            })
            const isValid = await validateAWord(usrString);
            console.log(isValid);
            if(isValid){
                // divs.forEach(function(div){
                //     div.style.backgroundColor = "#538D4E";
                //     div.style.color = "white";
                // })
                // rowIndex++;
                // index = 0;
                let wordParts = wordle.split("");
                let usrParts = usrString.split("");
                console.log(usrParts);
                console.log(wordParts);
                for(let i = 0; i < 5; i++){
                    if(wordParts[i] === usrParts[i]){
                        divs[i].classList.add("correct");
                        console.log(`Added class 'correct' to div ${i}`);
                    }
                    else if(wordParts.includes(usrParts[i])){

                    }
                }
            }
            else {

                divs.forEach(function(div){
                    div.style.border = "2px solid red";
                })
                console.log("Incorrect Word")
            }
        }
        else {
            console.log("Fill all the letters before pressing Enter.");
        }
    } 
    console.log(index);
    console.log(wordle);
})