function toggleKeyHighlighting() {
    if (document.getElementById('showKey').checked) { Array.from(document.getElementsByClassName('key')).forEach(el => el.className = 'key-highlight') }
    else { Array.from(document.getElementsByClassName('key-highlight')).forEach(el => el.className = 'key') }
}

document.getElementById('words').value = `동물,animals\n돼지,pig\n개구리,frog\n개,dog\n하마,hippo\n여우,fox\n곰,bear\n토끼,rabbit`;
document.getElementById('characters').addEventListener(`change`, e => {
    let el = document.getElementById('characters')

    document.getElementById('unicode-option').setAttribute('class', el.value === 'unicode' ? 'selected' : '')
})

document.getElementById('showKey').addEventListener('change', toggleKeyHighlighting)

document.getElementById('submit').addEventListener(`click`, e => {
    e.preventDefault();
    // Clear all previous error messages.
    let emc = document.getElementById('errorMessageContainer');
    while (emc.firstChild) { emc.removeChild(emc.lastChild) }

    let words = document.getElementById('words').value.split(`\n`);
    let sizeX = Number(document.getElementById('size_x').value)
    let sizeY = Number(document.getElementById('size_y').value) ? Number(document.getElementById('size_y').value) : sizeX
    let maxTries = Number(document.getElementById('maxTries').value)
    
    let directions = []
    if (document.getElementById('ltr').checked) { directions.push('ltr') }
    if (document.getElementById('ttb').checked) { directions.push('ttb') }
    if (document.getElementById('rtl').checked) { directions.push('rtl') }
    if (document.getElementById('btt').checked) { directions.push('btt') }
    if (document.getElementById('ne').checked) { directions.push('ne') }
    if (document.getElementById('se').checked) { directions.push('se') }
    if (document.getElementById('sw').checked) { directions.push('sw') }
    if (document.getElementById('nw').checked) { directions.push('nw') }
    
    let characters = document.getElementById('characters').value
    let fillFn = () => `?`

    if (characters === `koreanFreq`) {
        ({ syllables, probabilities } = getKoreanSyllableSet())
        fillFn = () => WordSearch.getRandomCharacterFromFrequencyList(syllables, probabilities)
    }

    else if (characters === `koreanFlat`) {
        ({ syllables } = getKoreanSyllableSet());
        fillFn = () => WordSearch.getRandomCharacterFromFrequencyList(syllables)
    }

    else if (characters === `unicode`) {
        let unicodeFrom = Number(document.getElementById('unicode_from').value);
        let unicodeTo = Number(document.getElementById('unicode_to').value);
        console.log(unicodeFrom, unicodeTo, WordSearch.getRandomCharacterFromUnicodeRange(unicodeFrom, unicodeTo))
        fillFn = () => WordSearch.getRandomCharacterFromUnicodeRange(unicodeFrom, unicodeTo)
    }

    else if (characters === `words`) { 
        // Get a list of all of the characters used in #words
        let l = document.getElementById('words').value.split(`\n`).map(w => w.split(/\s?,\s?/)[0]).join(``).split(``).filter((e, i, a) => a.indexOf(e) === i)
        fillFn = () => WordSearch.getRandomCharacterFromFrequencyList(l, new Array(l.length).fill(1 / l.length))
    }

    else if (characters === `none`) { fillFn = () => `` }
    
    let g = new WordSearch({ size: [sizeX, sizeY], fillFn, words, directions, maxTries });
    let result = g.toHTML();

    document.getElementById('result').replaceChildren(result);
    toggleKeyHighlighting();

    let wordListContainer = document.getElementById(`wordList`);
    let ul = document.createElement(`ul`)
    g.wordList.forEach(word => {
        let li = document.createElement(`li`);
        li.innerText = word;
        ul.appendChild(li)
    })
    console.log(wordListContainer)
    wordListContainer.replaceChildren(ul)

})