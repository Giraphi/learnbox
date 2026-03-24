Design:

- The `____` looks shit. maybe we add a little svg illustration? Maybe an animated cloud of particles?
- Excessive game Icons is cringe?
- think about general design intention: 8bit game or "cool" design?
- Animation when we tap a word

Features:

- Explore mode: Shows advanced vocabs as practise cards. the ones we don't know are added to vocabulary
- App icon

Learning Algorithm:

- Only one level change for a word per day. Iterate over the words (randomly with equal probability) that have no level-change for today
- If all words have a level change for that day, switch to "free practise" (indicate this on the word card)

Technical:

- Should I go through the implementation from time to time and make sure I understand everything?
- PWA capabilities not really used yet? serviceworker? what happens if the phone is offline? do the function still work? are the pages cached?
- hit area für bottom navigation bzw. wenigstens bissl horizontal padding in den buttons
