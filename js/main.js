// event listener for the fill set dropdown to toggle showing unicode range form fields
const toggleShowAnswers = (e) => {
    if (document.getElementById('showKey').checked) { Array.from(document.getElementsByClassName('u-highlight')).forEach(el => el.className = `${el.className} u-highlight-on`) }
    else { Array.from(document.getElementsByClassName('u-highlight-on')).forEach(el => el.className = el.className.split(` `).slice(0,2).join(` `)) }
}


const onFillSetChange = (e) => {
    let fillSet = document.getElementById('fillSet').value
    let freqData = document.getElementById('freqData')

    document.getElementById('unicode-range').setAttribute('class', fillSet === 'unicode' ? 'u-visible' : '')

    switch(fillSet) {
        case 'korean':
        case 'words':
            freqData.disabled = false;
            break;
        default: 
            freqData.disabled = true;         
            break;
    }
}

// clear all previous error messages
const clearErrorMessages = () => { 
    let el = document.getElementById('errorMessageContainer');
    while (el.firstChild) { el.removeChild(el.lastChild) }
}

// generate the word search
const generateWordSearch = (e) => {
    e.preventDefault();

    clearErrorMessages();

    let words = document.getElementById('words').value.split(`\n`);
    let sizeX = Number(document.getElementById('size_x').value)
    let sizeY = Number(document.getElementById('size_y').value) ? Number(document.getElementById('size_y').value) : sizeX
    let maxTries = Number(document.getElementById('maxTries').value)
    
    // get an array of allowed directions
    let directions = []
    if (document.getElementById('ltr').checked) { directions.push('ltr') }
    if (document.getElementById('ttb').checked) { directions.push('ttb') }
    if (document.getElementById('rtl').checked) { directions.push('rtl') }
    if (document.getElementById('btt').checked) { directions.push('btt') }
    if (document.getElementById('ne').checked) { directions.push('ne') }
    if (document.getElementById('se').checked) { directions.push('se') }
    if (document.getElementById('sw').checked) { directions.push('sw') }
    if (document.getElementById('nw').checked) { directions.push('nw') }
    

    let freqData = document.getElementById('freqData').checked && !document.getElementById('freqData').disabled

    let fillSet = document.getElementById('fillSet').value
    let fillFn = () => `?`

    if (fillSet === `korean` && freqData) {
        ({ syllables, probabilities } = getKoreanSyllableSet())
        fillFn = () => WordSearch.getRandomCharacterFromFrequencyList(syllables, probabilities)
    }

    else if (fillSet === `korean` && !freqData) {
        ({ syllables } = getKoreanSyllableSet());
        fillFn = () => WordSearch.getRandomCharacterFromFrequencyList(syllables)
    }

    else if (fillSet === `unicode`) {
        let unicodeFrom = Number(document.getElementById('unicode_from').value);
        let unicodeTo = Number(document.getElementById('unicode_to').value);
        fillFn = () => WordSearch.getRandomCharacterFromUnicodeRange(unicodeFrom, unicodeTo)
    }

    else if (fillSet === `words` && freqData) { 
        // Get a list of all of the characters used in #words and their frequencies
        let chars = document.getElementById('words').value.split(`\n`).map(w => w.split(/\s?,\s?/)[0]).join(``).split(``)
        let data = chars.reduce((a, e) => {
            a[e] = a[e] ? a[e] + 1 : 1
            return a
        }, {})

        console.log(data)
        //.filter((e, i, a) => a.indexOf(e) === i)
        fillFn = () => WordSearch.getRandomCharacterFromFrequencyList(Object.keys(data), Object.values(data).map(e => e / chars.length))  
    }

    else if (fillSet === `words` && !freqData) { 
        // Get a list of all of the characters used in #words
        let chars = document.getElementById('words').value.split(`\n`).map(w => w.split(/\s?,\s?/)[0]).join(``).split(``).filter((e, i, a) => a.indexOf(e) === i)
        fillFn = () => WordSearch.getRandomCharacterFromFrequencyList(chars)
    }

    else if (fillSet === `arabic`) { 
        let chars = [];
        for (let i = 1569; i <= 1610; i++) {
            if (i === 1600) { break }
            else { chars.push(String.fromCharCode(i)) }
        }
        fillFn = () => WordSearch.getRandomCharacterFromFrequencyList(chars, chars.map(e => 1 / chars.length))
     }

    else if (fillSet === `ascii-upper`) { fillFn = () => WordSearch.getRandomCharacterFromUnicodeRange(65, 90) }
    else if (fillSet === `ascii-lower`) { fillFn = () => WordSearch.getRandomCharacterFromUnicodeRange(97, 122) }

    else if (fillSet === `none`) { fillFn = () => `` }
    
    let g = new WordSearch({ size: [sizeX, sizeY], fillFn, words, directions, maxTries });
    let result = g.toHTML();

    if (sizeX <= 20) { result.className = "sm" }
    else if (sizeX <= 30 ) { result.className = "md" }
    else if (sizeX <= 40) { result.className = "lg" }
    else { result.className = "xl" }

    document.getElementById('result').replaceChildren(result);
    if (document.getElementById('showKey').checked) { toggleShowAnswers() }

    let wordListContainer = document.getElementById(`hints`);
    let ul = document.createElement(`ul`)
    g.wordList.forEach(word => {
        let li = document.createElement(`li`);
        li.innerText = word;
        ul.appendChild(li)
    })
    wordListContainer.replaceChildren(ul)

}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('fillSet').addEventListener(`change`, onFillSetChange);
    document.getElementById('showKey').addEventListener('change', toggleShowAnswers);
    document.getElementById('generate').addEventListener(`click`, generateWordSearch)
})