# Memory Game

A configurable memory-matching game for one to four players, built with Vue 3 and Pinia. Pick a theme, a player count and a grid size, then race to clear the board — with a combo system that rewards uninterrupted streaks.

Based on the [Frontend Mentor "Memory game" challenge](https://www.frontendmentor.io/challenges/memory-game-vFEJURgVYr), extended with combo scoring, bonus points and confetti feedback.

## Gameplay

- **Two themes** — numbers, or icons drawn from Remix Icon
- **One to four players** — turns rotate automatically; solo play is timed instead
- **Two grid sizes** — 4×4 (8 pairs) or 6×6 (18 pairs)
- **Combo system** — consecutive matches raise a multiplier up to 4×. Hitting the cap converts the streak into a bonus point and resets it. The window for keeping a combo alive shrinks as the multiplier climbs (`max(1000, 5000 - multiplier × 500)` ms), so later links are harder to hold than the first.
- **Scoring** — bonus points fold into the final tally, and ties are resolved by listing every player who reached the top score
- **Confetti** — green bursts for a plain match, brand colours during a combo, fireworks on completion

## Tech stack

| | |
|---|---|
| Framework | Vue 3 (`<script setup>` SFCs) |
| State | Pinia |
| Language | TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Remix Icon |
| Effects | fast-confetti |

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Vite prints the local URL when it starts.

Other scripts: `npm run build` (type-checks with `vue-tsc`, then builds), `npm run preview`.

## Project structure

```
src/
  views/
    StartGame.vue      options screen with slide-in/out transitions
    TheGame.vue        the board
  components/
    game/layout/       header, main and footer regions of the board
    score/             end-of-game modal
    UI/                buttons, cards, container, pair card, modal, logo
  store/
    gameConfig.ts      options, player roster, deck preparation
    game.ts            turn order, matching, combos, timer, win detection
    modal.ts           modal visibility
  models/              enums and interfaces
  constants/index.ts   default options and the theme seeds
  utils/helpers.ts     Fisher-Yates shuffle, clock formatting
```

## Implementation notes

State is split across three Pinia stores rather than one. `gameConfig` owns everything chosen before the game begins — theme, players, grid size — and builds the deck by slicing the seed to `gridSize / 2`, doubling it and shuffling. `game` owns everything that changes during play. Keeping them apart means restarting a round rebuilds the deck without touching the roster.

Both stores use the setup syntax, so the reactive graph is plain `ref` / `computed` / `watch`. Win detection, confetti and the score modal are driven by watchers on `isGameFinished` and `matchedCards` rather than by explicit calls from the click handler.

The deck shuffle is Fisher-Yates and mutates in place — worth knowing if you reuse `shuffleArray` on an array you still need in its original order.

## Credits

Design from [Frontend Mentor](https://www.frontendmentor.io). Implementation by [@cancomertpay](https://github.com/cancomertpay).
