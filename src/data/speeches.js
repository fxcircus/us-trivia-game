// ============================================================
// SPEECHES — full texts for the Memorize mode.
//
// Shape:
//   id, title, author, year, context
//   lines: ordered array of strings. Memorize mode joins them with spaces
//     for word-level scoring, and renders them one per line for display.
//     Break at natural sentence or verse boundaries.
//
// To populate a speech: open the URL in the PASTE FROM comment, copy the
// text, and add it to `lines` as one string per sentence or line.
// Use backticks (`) so you don't have to escape apostrophes, quotes, or
// em-dashes. Example:
//
//   lines: [
//     `Four score and seven years ago...`,
//     `Now we are engaged in a great civil war...`,
//   ],
//
// Speeches with an empty `lines` array are hidden from the Memorize tab.
// ============================================================

export const SPEECHES = [
  {
    id: 'gettysburg',
    title: 'Gettysburg Address',
    author: 'Abraham Lincoln',
    year: 1863,
    context: `Dedication of the Soldiers' National Cemetery at Gettysburg, Pennsylvania — November 19, 1863. 272 words.`,
    // PASTE FROM: https://www.abrahamlincolnonline.org/lincoln/speeches/gettysburg.htm
    //             (use the "Bliss copy" — the final authoritative version)
    lines: [],
  },
  {
    id: 'jfk-inaugural',
    title: 'Inaugural Address',
    author: 'John F. Kennedy',
    year: 1961,
    context: `East Front of the U.S. Capitol — January 20, 1961. ~1,365 words.`,
    // PASTE FROM: https://www.jfklibrary.org/learn/about-jfk/historic-speeches/inaugural-address
    lines: [],
  },
  {
    id: 'fdr-first-inaugural',
    title: 'First Inaugural Address',
    author: 'Franklin D. Roosevelt',
    year: 1933,
    context: `East Portico of the U.S. Capitol — March 4, 1933, at the depths of the Great Depression. Contains the "only thing we have to fear is fear itself" passage.`,
    // PASTE FROM: https://millercenter.org/the-presidency/presidential-speeches/march-4-1933-first-inaugural-address
    lines: [],
  },
  {
    id: 'fdr-infamy',
    title: 'Day of Infamy Address',
    author: 'Franklin D. Roosevelt',
    year: 1941,
    context: `Joint Session of Congress — December 8, 1941, requesting a declaration of war after the attack on Pearl Harbor. ~510 words.`,
    // PASTE FROM: https://millercenter.org/the-presidency/presidential-speeches/december-8-1941-day-infamy-speech
    lines: [],
  },
  {
    id: 'lincoln-second-inaugural',
    title: 'Second Inaugural Address',
    author: 'Abraham Lincoln',
    year: 1865,
    context: `East Portico of the U.S. Capitol — March 4, 1865, 41 days before his assassination. ~703 words. Closes with "With malice toward none, with charity for all..."`,
    // PASTE FROM: https://millercenter.org/the-presidency/presidential-speeches/march-4-1865-second-inaugural-address
    lines: [],
  },
  {
    id: 'mlk-dream',
    title: 'I Have a Dream (excerpt)',
    author: 'Martin Luther King Jr.',
    year: 1963,
    context: `March on Washington, steps of the Lincoln Memorial — August 28, 1963. This entry is the "I have a dream" refrain section, not the full 17-minute speech.`,
    // PASTE FROM: https://kinginstitute.stanford.edu/i-have-dream-speech-delivered-march-washington
    //             Paste the passages beginning "I have a dream that one day..."
    //             up through "...little black boys and black girls as sisters and brothers."
    lines: [],
  },
  {
    id: 'pledge',
    title: 'Pledge of Allegiance',
    author: 'Francis Bellamy (revised 1954)',
    year: 1892,
    context: `Written by Bellamy in 1892 for the 400th anniversary of Columbus's landing. "Under God" was added by Act of Congress on June 14, 1954. 31 words.`,
    // PASTE FROM: https://en.wikipedia.org/wiki/Pledge_of_Allegiance  (see "Current official version")
    lines: [],
  },
  {
    id: 'constitutional-preamble',
    title: 'Preamble to the Constitution',
    author: 'Constitutional Convention',
    year: 1787,
    context: `Drafted at the Constitutional Convention in Philadelphia, 1787. A single 52-word sentence.`,
    // PASTE FROM: https://www.archives.gov/founding-docs/constitution-transcript
    //             Use only the Preamble — the opening "We the People..." sentence.
    lines: [],
  },
  {
    id: 'declaration-preamble',
    title: 'Declaration of Independence — opening',
    author: 'Thomas Jefferson et al.',
    year: 1776,
    context: `The two most-memorized passages of the Declaration: the "When in the Course of human events..." opening, and the "We hold these truths..." paragraph through "consent of the governed."`,
    // PASTE FROM: https://www.archives.gov/founding-docs/declaration-transcript
    //             Paste the first paragraph ("When in the Course...") and the second paragraph
    //             up through "...consent of the governed." Skip the grievance list that follows.
    lines: [],
  },
  {
    id: 'anthem-v1',
    title: 'The Star-Spangled Banner — Verse 1',
    author: 'Francis Scott Key',
    year: 1814,
    context: `Written September 14, 1814, after witnessing the defense of Fort McHenry. Verse 1 is the one commonly sung.`,
    // PASTE FROM: https://en.wikisource.org/wiki/The_Star-Spangled_Banner  (stanza 1)
    lines: [],
  },
  {
    id: 'anthem-v4',
    title: 'The Star-Spangled Banner — Verse 4',
    author: 'Francis Scott Key',
    year: 1814,
    context: `Closing verse. Its line "And this be our motto: 'In God is our trust'" helped seed the official national motto more than a century later (adopted 1956).`,
    // PASTE FROM: https://en.wikisource.org/wiki/The_Star-Spangled_Banner  (stanza 4)
    lines: [],
  },
];
