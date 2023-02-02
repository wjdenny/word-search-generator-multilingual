class WordSearch {
    constructor({ size, fillFn, words, directions, maxTries = 50 }) {
        // Build the grid as a 2-dimensional Array.
        this.grid = new Array(size[1]).fill(null).map(() => new Array(size[0]).fill(null).map(() => null));
        this.key = [];
        this.wordList = [];

        let dn = directions.length

        // separate words from potential comma-separated translation
        words = words.map(w => w.split(/\s?,\s?/))

        // place words 
        for (let i = 0, n = words.length; i < n; i++) {
            let word = words[i][0];
            let key = words[i][1] ? words[i][1] : words[i][0]

            let success = false;
            
            for (let tries = 0; tries < maxTries; tries++) {
                let x = Math.floor(Math.random() * size[1]);
                let y = Math.floor(Math.random() * size[0]);
                let direction = directions[Math.floor(Math.random() * dn)];

                if (this.checkWordFit(x, y, direction, word)) { this.insertWord(x, y, direction, word); success = true; this.wordList.push(key); break }
            }

            if (success === false) { displayError(`Failed to insert word '${word}' after ${maxTries} tries.`) }
        }

        // fill in the blanks
        for (let x = 0, mx = this.grid.length; x < mx; x++) {
            for (let y = 0, my = this.grid[x].length; y < my; y++) {
                if (this.grid[x][y] === null) { this.grid[x][y] = fillFn() }
            }
        }


    }

    static getRandomCharacterFromUnicodeRange(min, max) {
        return String.fromCharCode(min + Math.floor(Math.random() * (max-min)))
    }

    static getRandomCharacterFromFrequencyList(characters, probabilities) {
        if (probabilities === undefined) { probabilities = new Array(characters.length).fill(1/characters.length) }
        if (probabilities.length !== characters.length) { throw new Error(`characters and probabilities arrays must be the same length.`)}
        let r = Math.random(), cumulativeProb = 0;

        for (let i = 0, n = probabilities.length; i < n; i++) {
            cumulativeProb += probabilities[i];
            if (r <= cumulativeProb) { return characters[i] }
        }
        
        return result

    }

    static direction = { 
        ltr: { dx: 0, dy: 1 }, 
        ttb: { dx: 1, dy: 0},
        rtl: { dx: 0, dy: -1},
        btt: { dx: -1, dy: 0},
        ne: { dx: -1, dy: 1},
        se: { dx: 1, dy: 1},
        sw: { dx: 1, dy: -1},
        nw: { dx: -1, dy: -1}
    }

    toString() { return this.grid.map(x => x.join(``)).join(`\n`) }
    toHTML() {
        let table = document.createElement(`table`);
        
        let grid = this.grid.map(x => {
            let tr = document.createElement(`tr`)
            x.map(y => {
                let td = document.createElement(`td`);
                td.textContent = y;
                tr.appendChild(td);
                return td
            });

            table.appendChild(tr);
            return tr
        })

        this.key.forEach(word => {
            word.forEach(letter => {
                let [ x, y, i, className ] = letter;
                grid[x].childNodes[y].className = `${className} u-highlight`
            })
        })

        return table
     }

    // Returns true if the word will fit in the grid and not overwrite other words.
    checkWordFit(x, y, direction, word) {
        let { dx, dy } = WordSearch.direction[direction]

        for (let i = 0, n = word.length; i < n; i++) {
            let nx = x + i * dx;
            let ny = y + i * dy;

            if ((nx > -1 && ny > -1 && nx < this.grid.length && ny < this.grid[nx].length) === false) { return false }

            // && this.grid[nx][ny] !== word[i] allows overlap of words that both use the same character
            if (this.grid[nx][ny] !== null && this.grid[nx][ny] !== word[i]) { return false }
        }

        return true
    }

    insertWord(x, y, direction, word) { 
        let { dx, dy } = WordSearch.direction[direction]
        let key = []
        for (let i = 0, n = word.length; i < n; i++) {
            let nx = x + i * dx;
            let ny = y + i * dy;
            this.grid[nx][ny] = word[i];
            let position = `mid`;
            if (i == 0) { position = `first`}
            else if (i == (n-1)) { position = `last` }

            key.push([nx, ny, i, `${direction}-${position}` ])
          }

          this.key.push(key)
    }
}

function displayError(errorMessage) {
    let el = document.createElement('div');
    el.setAttribute('class', 'error');
    el.innerHTML = errorMessage;
    document.getElementById(`errorMessageContainer`).appendChild(el)
}