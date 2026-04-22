# CLAUDE.md — project conventions for us-trivia-game

Vite + React 18 app for studying American history. Every session draws
`SESSION_SIZE` (default 20) random questions from `QUESTIONS`. Pushes to
`main` auto-deploy to https://fxcircus.github.io/us-trivia-game/ via
`.github/workflows/deploy.yml`.

## Where things live

- `src/App.jsx` — all views, renderers, helpers, scoring
- `src/data/wiki.js` — reference chapters (`WIKI`)
- `src/data/questions.js` — trivia pool (`QUESTIONS`)
- `src/data/speeches.js` — full passages for Memorize mode (`SPEECHES`)

---

## Authoring new questions

Every new question MUST follow these rules. The `AnswerReveal` component
renders a rich post-submission panel using fields on the question object,
so the quality of the authored metadata determines the quality of the UX.

### Required per question

- `id` — unique slug
- `type` — one of `multiple` | `complete` | `truefalse` | `match-year` | `order`
- `category` — short label (e.g. `'Presidents'`, `'Bill of Rights'`)
- `prompt` — the question itself
- Type-specific payload (`choices`/`answer`, `blanks`, `pairs`, `items`/`correctOrder`)

### Strongly recommended on every question

- **`wikiRef: { chapter, num }`** — point at the specific wiki entry this
  question tests. This powers the "Open in wiki" deep-link AND, for
  amendment chapters, auto-renders the full amendment text in the answer.
  Skip only when the question genuinely spans multiple entries
  (`match-year`, `order`, cross-chapter trivia).
- **`date: '...'`** — every answer should show a date. For events with a
  known specific date (speeches, assassinations, inaugurations, ratification
  days), set it explicitly. For amendment questions, you can omit `date`
  and it falls back to the wiki entry's `year`.
- **`explanation: '...'`** — italic gloss that teaches the *why*, not just
  the *what*. Skip if the prompt + amendment text + date already say it.

### Optional

- `hint: '...'` — only for `complete` type. Hidden behind a "Show hint"
  button by default.
- `suppressAmendmentText: true` — set when the prompt already quotes the
  amendment in full (e.g. `q5`/`q9`). Otherwise leave it off — the app
  will display the wiki text for amendment-chapter refs.
- `distractors: [year, ...]` — **required on every `match-year` question.**
  3–5 plausible decoy years so the pool isn't a permutation of the
  correct answers. Pick distractors spanning different centuries.

### President names in choices

The app auto-enriches MC choices. If **every** choice in `choices` matches
a title in the `presidents` chapter of `WIKI`, each option renders as
`Name · Nth, years` (Cleveland and Trump get both terms combined).

Rules:

- Use plain names in data: `'John F. Kennedy'`, not `'John F. Kennedy (35th, 1961–1963)'`.
- All or nothing: if one choice is a president and another isn't, nothing
  gets enriched — keep choice sets homogeneous when this matters.
- In prompts and explanations, if you mention a president by name, add
  their ordinal + years parenthetically where context warrants:
  `'Cleveland served as the 22nd and 24th president (1885–1889, 1893–1897).'`

### "Firsts/lasts" and superlative questions about presidents

Include at least one president who hasn't appeared in prior question
choices. Keeps the pool varied across a full session — avoid always
recycling the same ~20 names.

### Category consistency (drives session diversification)

`buildSession` caps each session at `MAX_PER_CATEGORY` (currently 2)
questions per `category` string. This means **two questions with the same
exact category string are interchangeable for the cap**. Implications:

- **Reuse existing category labels** rather than inventing per-question
  variants. If you add 5 new "amendments" questions, use `'Bill of Rights'`
  (or the relevant existing label), not `'Bill of Rights · Q3'`. Otherwise
  the cap effectively becomes 1-per-question and doesn't diversify.
- **Split large topical clumps into one category per cluster**, not per
  question. The pattern `'Statehood · Year'` vs `'Statehood · Order'`
  works: two distinct categories, capped independently, so a session can
  hold at most 2+2 = 4 statehood questions.
- **Single-label clumps are fine for small topics.** If you add 6
  "Supreme Court" questions, keep all 6 under `'Supreme Court'`; the cap
  will expose 2 per session.

### Distractor spacing

For MC and match-year questions, distractors should be **visibly different
from the correct answer**, not clustered around it. "Consecutive year"
or "consecutive ordinal" distractors tell the user "the answer is in this
narrow window" — they may guess without knowing.

- **Year distractors**: spread across decades or eras. Don't use three
  years within 5 of the correct answer. Good: `['1790', '1850', '1890', '1959']`.
  Bad: `['1787', '1788', '1789', '1790']`.
- **Ordinal distractors**: spread across the full ordinal range. For the
  50 states, aim for distractors ≥ 10 positions apart. Good for Vermont
  (14th): `['1st', '14th', '27th', '39th']`. Bad: `['13th', '14th', '15th', '16th']`.
- **Match-year distractors**: the `distractors` array should include at
  least 3 plausible decoys chosen from different eras.

### Avoiding dumb questions

- **Don't let labels telegraph the answer.** The `order` question using
  items `['13th Amendment', '19th Amendment', '22nd Amendment', '26th Amendment']`
  is broken — the numerical labels *are* the chronological order. Always
  rewrite such items as descriptions (`'Abolition of slavery'` etc.).
- **Don't write easy True/False.** If the statement is trivially true
  (`'The 21st Amendment repealed Prohibition'` — anyone who's heard of the
  21st knows this), convert to MC where the user has to pick between
  plausible distractors (18th / 21st / 22nd / 27th). Reserve T/F for
  statements where the *surface-plausible* answer is actually wrong
  (e.g. `'The Declaration of Independence was signed on July 4, 1776'` —
  false; most delegates signed August 2).
- **Watch for ambiguity.** The original `q7` ("Which amendment contains
  the clause 'nor be deprived of life, liberty, or property, without due
  process of law'") has two defensible answers (5th and 14th both
  contain due-process clauses). Tighten prompts to admit a single answer
  or restructure the question.

### Template: multiple choice

```js
{
  id: 'p9',
  type: 'multiple',
  category: 'Presidents',
  prompt: 'Which president signed the Emancipation Proclamation?',
  choices: ['Andrew Johnson', 'Abraham Lincoln', 'Ulysses S. Grant', 'James Buchanan'],
  answer: 1,
  explanation: 'Lincoln issued the preliminary proclamation after Antietam and the final version on January 1, 1863.',
  wikiRef: { chapter: 'presidents', num: 16 },
  date: 'January 1, 1863',
}
```

### Template: match-year

```js
{
  id: 'q13',
  type: 'match-year',
  category: 'Chronology',
  prompt: 'Match each event to its year.',
  pairs: [
    { item: 'Louisiana Purchase', year: 1803 },
    { item: 'Emancipation Proclamation', year: 1863 },
    { item: 'Moon landing', year: 1969 },
    { item: '9/11 attacks', year: 2001 },
  ],
  distractors: [1776, 1865, 1929, 1989],   // required
}
```

---

## Authoring new wiki entries

Shape: `{ num, title, year, text, notes }`

- `num` — canonical index (president number, amendment number, or
  chapter-specific sequence).
- `year` — single year (`1863`) or range (`'1885–1889'`). This is what
  `AnswerReveal` falls back to when a question has no explicit `date`.
- `text` — main prose or the quoted amendment text itself.
- `notes` — optional secondary context (shown in smaller muted type).

For amendments specifically: `text` should be the actual amendment text
(or a faithful excerpt when very long), since the app pulls it directly
to show in answer reveals.

---

## Memorize passages (`src/data/speeches.js`)

- Each entry: `{ id, title, author, year, context, lines: string[] }`.
- `lines` is an ordered array of strings. Memorize mode joins them with
  spaces for word-level LCS scoring and renders them one per line for
  display. Break at natural sentence or verse boundaries.
- **Always wrap in backticks** (`` ` ``) so apostrophes, double quotes,
  em dashes, and ellipses don't need escaping.
- Entries with empty `lines` are hidden from the Memorize tab, so it's
  fine to ship scaffolds and populate later.

---

## Deploy + verification

Every push to `main` triggers `.github/workflows/deploy.yml` (Vite build
→ upload-pages-artifact → deploy-pages). **Green CI is not proof of a
successful deploy.** After any push:

1. Wait for the workflow to complete (`gh run watch <id>`).
2. Curl the live URL and confirm the returned HTML references the new
   bundle hash — e.g.
   `curl -sS https://fxcircus.github.io/us-trivia-game/ | grep -oE 'assets/index-[^"]+\.js'`
   should match the `dist/assets/index-*.js` from the local build.
3. Also fetch the JS bundle directly to confirm 200.

If the Vite `base` ever changes (e.g. repo rename), update it in
`vite.config.js` AND in this document.
