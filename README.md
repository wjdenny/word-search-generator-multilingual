# Multilingual Word Search Puzzle Generator
This project is a multilingual word search puzzle generator in your browser. The only word search puzzle generators I could find online only used the Latin alphabet. This project has presets for Korean, but you can use any range of Unicode characters you'd like. If you want to suggest adding presets for other languages, you can post [an issue](https://github.com/wjdenny/word-search-generator-multilingual/issues). I designed this to be useful in language acquisition practice, particularly in developing reading fluency and sight reading skills.

There's no interaction for solving the puzzle, and it's fairly easy to find out the answer key while still in the browser. It's meant to be printed, either on paper or as a PDF and then used on a tablet.

## Development environment
I use Jekyll to serve the project as this is easily handled through GitHub
Pages. For local deployment, you can clone the repo, install Jekyll on your
system globally, and run `jekyll serve` in the project directory.

## Filled with probabilities
One of the presets uses Korean syllable frequency data from [Dr. Kang](http://nlp.kookmin.ac.kr/) from [Kookmin University](https://www.kookmin.ac.kr/).

- <http://nlp.kookmin.ac.kr/data/syl-1.txt>
- <http://nlp.kookmin.ac.kr/data/syl-2.txt>

This allows the word search puzzle generator to do weighted sampling to provide more realistic distractors.

## What's next?
- I want to clean up and document the code and look for ways to optimize it. 
- I want to add presets for more languages to make it easier for folks to use.

Got ideas? Post [an issue](https://github.com/wjdenny/word-search-generator-multilingual/issues).
