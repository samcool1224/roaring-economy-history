# The Roaring Economy

### A Walk Through America's Boom, 1919–1929

An interactive museum of the American economy in the 1920s. Walk a top-down museum with
an entrance hall, a central rotunda and three themed wings; step through six exhibit
doors; read the evidence, play an activity in each room, and finish in the Economic
Council with a stock-market simulation that shows what borrowed money does on the way
up and on the way down.

Built with **Vite + React + TypeScript**, with **Phaser 3** for the walkable museum. No
backend, no accounts, no API keys. Progress saves in the visitor's browser.

---

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev        # open http://localhost:5173
```

Production build: `npm run build`, then `npm run preview`.

## Publish it with GitHub Pages

This repository includes `.github/workflows/deploy.yml`, which builds and publishes the
site every time you push to `main`.

1. On GitHub, open the repository's **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push any change (or open **Actions → Deploy to GitHub Pages → Run workflow**).

The site appears at `https://<your-username>.github.io/<repository-name>/` after the
workflow finishes, usually within two minutes. On a free GitHub account the repository
must be **public** for Pages to work.

---

## Adding the photographs and narration

Every media file has a fixed name and folder. Add a file with the right name and the
site picks it up automatically; leave one out and nothing breaks.

### Photographs → `public/media/images/`

The extension can be `.jpg`, `.jpeg`, `.png`, `.webp` or `.gif`.

| Filename | Shown in | What it is |
| --- | --- | --- |
| `ex1-grocery` | Exhibit 1 | Grocery store / prices |
| `ex1-farm-money` | Exhibits 1, 5 | Farm mortgage or foreclosure |
| `ex1-war-surplus` | Exhibit 1 | Military surplus |
| `ex2-assembly-line` ✓ included | Exhibit 2 | Model T assembly line |
| `ex2-radio` | Exhibit 2 | 1920s radio |
| `ex2-stock-certificate` | Exhibit 2 | Stock certificate |
| `ex2-assembly-model` | Exhibit 2 | Assembly-line model |
| `ex3-model-t-family` | Exhibits 3, 4, 5 | Family in a Model T |
| `ex3-refrigerator` | Exhibit 3 | Electric refrigerator |
| `ex3-washing-machine` | Exhibit 3 | Electric washing machine |
| `ex3-stock-ticker` | Exhibit 3 | Stock ticker machine |
| `ex4-skyscraper` ✓ included | Exhibit 4 | Skyscraper design |
| `ex4-suburban-house` | Exhibit 4 | Suburban house |
| `ex4-farm-tractor` | Exhibit 4 | Farm tractor |
| `ex5-department-store-ad` | Exhibit 5 | Department store advertisement |
| `ex5-farm-mortgage` ✓ included | Exhibit 5 | Mortgage document |

The source page for each photograph is recorded in `src/data/media.ts` and credited in
the site's References panel.

### Narration audio → `public/media/narration/`

| Filename | Exhibit |
| --- | --- |
| `exhibit01-postwar.mp3` | 1 — The Newsroom |
| `exhibit02-ford.mp3` | 2 — Ford's Factory |
| `exhibit03-credit.mp3` | 3 — The Credit Craze |
| `exhibit04-three-americas.mp3` | 4 — Three Americas |
| `exhibit05-two-lives.mp3` | 5 — Two American Lives |
| `exhibit06-verdict.mp3` | 6 — The Economic Verdict |

Each exhibit's introduction shows an audio player when its file is present. `.m4a` and
`.wav` also work, and an `.mp4` video with the same name is used if there is no audio
file. Visitors press play themselves; narration never starts on its own.

### Background music (optional) → `public/media/music/`

Visitors can turn background music on or off from the title screen or the **♫ Music**
button in the top bar (it starts off). With nothing uploaded, the museum plays an original
1920s-style piano tune generated in the browser. To use your own recording instead, upload
it as `background.mp3`. It loops quietly, dips while narration plays and pauses while a
film is open.

### Archival films

The three archival films play from YouTube, so they need no upload. They are set in
`src/data/media.ts` under `FILMS`:

| Exhibit | Film |
| --- | --- |
| 2 | Model T assembly line |
| 3 | The stock exchange |
| 4 | The agricultural depression |

### Checking what is installed

Add `?dev=1` to the end of the address (for example `http://localhost:5173/?dev=1`).
Missing photographs are then labelled with the exact filename they need, and a small
panel can mark exhibits complete for testing. Visitors never see this without the flag.

---

## How the museum works

```
              ┌──────── NORTH GALLERY ────────┐        Exhibits 3 · 4
              └───────────────┬───────────────┘
                        north corridor
 ┌─ WEST WING ─┐─ west corr. ─┤  ROTUNDA  ├─ east corr. ─┌─ EAST WING ─┐
  Exhibits 2 (top) · 1 (bottom)              Exhibits 5 (top) · 6 (bottom)
                        south corridor
                  ┌───── ENTRANCE HALL ─────┐
```

Doors run **1 → 6 clockwise** around the rotunda. **All six exhibits are open from the
start** and can be visited in any order. Leaving an exhibit puts you back at its door.

| Where | Controls |
| --- | --- |
| Museum | `W A S D` or arrow keys to walk · `E` to enter a door |
| Anywhere | `M` map · `?` help · `Esc` closes any window |
| Inside an exhibit | Point and click; `Tab` + `Enter` work everywhere |

To finish each of Exhibits 1–5: open the three lesson stations, complete the room's
activity, and answer four questions correctly. Each question has four choices; **one
wrong answer restarts that quiz from question 1** (reading and the activity stay done,
and there is no limit on attempts). Each finished room earns an evidence card.

Exhibit 6 asks the visitor to read the two Essential Question plaques, run the
three-round stock simulation, choose the verdict that fits the evidence, and cite one
evidence card.

---

## Editing the content

| What | File |
| --- | --- |
| Lesson text, room titles, evidence cards, Essential Questions | `src/data/exhibits.ts` |
| The 20 quiz questions and answers | `src/data/questions.ts` |
| Photographs, gallery order, archival films | `src/data/media.ts` |
| References panel sources | `src/data/sources.ts` |
| Quiz rules | `src/components/CFU.tsx` |
| Floor plan, doors and their order | `src/game/HallScene.ts` (`AREAS`, `DOORS`) |
| Colours and layout | `src/styles/app.css` |
| Each activity | `src/games/*.tsx` |

## Notes on accuracy

All prices, budgets, assembly "ticks" and the stock in the final game
(`National Motor Industries`) are invented teaching examples and are labelled that way
where they appear. Sound effects are synthesised in code and start switched off. Key
dates the museum relies on: Ford's moving assembly line, 1913; the $5 day, 1914; more
than 15 million Model Ts built 1908–1927, with the price falling from $850 to as little
as $260; the 1920 census as the first with an urban majority; the 1920–21 recession
coming before the boom; and the 1929 crash as one cause of the Depression, not the only
one.
