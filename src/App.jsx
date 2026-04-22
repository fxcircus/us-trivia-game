import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sun, Moon, Search, ChevronRight, Check, X, RotateCcw,
  BookOpen, Home, Flame, Trophy, Eye, EyeOff, Brain, Clock, ArrowLeft,
  Calendar, ExternalLink,
} from 'lucide-react';

const THEME_IDS = ['dark', 'light', 'us'];
import { WIKI } from './data/wiki.js';
import { QUESTIONS } from './data/questions.js';
import { SPEECHES } from './data/speeches.js';

// Number of questions per play session, sampled randomly from the pool.
const SESSION_SIZE = 20;

// Maximum number of questions from any single `category` that may appear
// in one session. Prevents runs like 6 "State Capitals" or 4 "Statehood
// · Year" from dominating a 20-question session. Tune here if needed.
const MAX_PER_CATEGORY = 2;

function buildSession() {
  const shuffled = shuffle(QUESTIONS);
  const counts = new Map();
  const picked = [];
  const overflow = [];

  for (const q of shuffled) {
    const cat = q.category || '_uncategorized';
    const count = counts.get(cat) || 0;
    if (count < MAX_PER_CATEGORY) {
      picked.push(q);
      counts.set(cat, count + 1);
      if (picked.length === SESSION_SIZE) return picked;
    } else {
      overflow.push(q);
    }
  }

  // Pool exhausted and we still couldn't fill the session under the cap
  // (would only happen with a very narrow pool). Fall back to overflow.
  while (picked.length < SESSION_SIZE && overflow.length > 0) {
    picked.push(overflow.shift());
  }
  return picked;
}

// ============================================================
// WIKI LOOKUP + PRESIDENT ENRICHMENT
// ============================================================

const AMENDMENT_CHAPTERS = new Set(['bill-of-rights', 'reconstruction', 'progressive', 'modern']);

function getWikiEntry(ref) {
  if (!ref) return null;
  const chapter = WIKI.find((c) => c.id === ref.chapter);
  if (!chapter) return null;
  return chapter.entries.find((e) => e.num === ref.num) || null;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Build name -> [{ num, year }, ...] map so names used more than once
// (Cleveland 22/24, Trump 45/47) combine their entries.
const PRESIDENT_TERMS = (() => {
  const map = new Map();
  const chapter = WIKI.find((c) => c.id === 'presidents');
  if (!chapter) return map;
  for (const e of chapter.entries) {
    if (!map.has(e.title)) map.set(e.title, []);
    map.get(e.title).push({ num: e.num, year: e.year });
  }
  return map;
})();

function presidentLabel(name) {
  const terms = PRESIDENT_TERMS.get(name);
  if (!terms || terms.length === 0) return name;
  if (terms.length === 1) return `${name} · ${ordinal(terms[0].num)}, ${terms[0].year}`;
  const nums = terms.map((t) => ordinal(t.num)).join(' & ');
  const years = terms.map((t) => t.year).join(', ');
  return `${name} · ${nums}, ${years}`;
}

// ============================================================
// STORAGE HELPERS (localStorage)
// ============================================================

const STORAGE_KEYS = {
  theme: 'pref:theme',
  sessions: 'data:sessions',
  streak: 'data:streak',
  totals: 'data:totals',
  memorize: 'data:memorize',
};

function storageGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}
function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ============================================================
// UTILITIES
// ============================================================

function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetween(a, b) {
  const ms = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b) - new Date(a)) / ms);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Word-level scoring via LCS alignment.
function normalizeWords(s) {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, ' ')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreRecall(expected, actual) {
  const expWords = normalizeWords(expected);
  const actWords = normalizeWords(actual);
  const m = expWords.length;
  const n = actWords.length;
  if (m === 0) return { correct: 0, total: 0, pct: 0, matched: [], expWords, actWords };
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = expWords[i - 1] === actWords[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const matched = new Array(m).fill(false);
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (expWords[i - 1] === actWords[j - 1]) {
      matched[i - 1] = true;
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  const correct = matched.filter(Boolean).length;
  return {
    correct,
    total: m,
    pct: m ? Math.round((100 * correct) / m) : 0,
    matched,
    expWords,
    actWords,
  };
}

// Replace each word's trailing letters with underscores, keeping punctuation.
function firstLetterCue(text) {
  return text.replace(/[A-Za-z][A-Za-z']*/g, (w) => w[0] + '_'.repeat(w.length - 1));
}

// ============================================================
// THEME
// ============================================================

const THEMES = {
  light: {
    bg: '#fafaf7',
    surface: '#ffffff',
    text: '#111111',
    muted: '#6b6b6b',
    border: '#e5e3dc',
    accent: '#1a1a1a',
    correct: '#2d6a4f',
    wrong: '#b5341a',
    heatEmpty: '#eeece4',
    heatScale: ['#eeece4', '#d4e7c5', '#95c17b', '#4d8c3a', '#1f5c1f'],
    subtle: '#f5f3ed',
  },
  dark: {
    bg: '#0e0e0c',
    surface: '#1a1a17',
    text: '#f0ede4',
    muted: '#8a877e',
    border: '#2a2924',
    accent: '#f0ede4',
    correct: '#4ea374',
    wrong: '#d96b4d',
    heatEmpty: '#1f1e1a',
    heatScale: ['#1f1e1a', '#2d4a2d', '#487a44', '#68ab5a', '#9bd47b'],
    subtle: '#17171412',
  },
  // Full red-white-blue. Warm near-white backgrounds let the flag colors
  // pop: vibrant Old Glory Blue for text, Old Glory Red as the accent on
  // active tab underlines, and a heatmap that runs cream → blue → navy
  // → red so high-activity days light up in the flag's peak color.
  us: {
    bg: '#fefcf5',
    surface: '#ffffff',
    text: '#002868',
    muted: '#5a73a6',
    border: '#dce3ec',
    accent: '#bf0a30',
    correct: '#2e7d47',
    wrong: '#bf0a30',
    heatEmpty: '#f0e8d4',
    heatScale: ['#f0e8d4', '#c8d6ea', '#6a8bc7', '#1f3a8f', '#bf0a30'],
    subtle: '#f7f1dc',
  },
};

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [tab, setTab] = useState('home');
  const [sessions, setSessions] = useState({});
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastDate: null });
  const [totals, setTotals] = useState({ played: 0, correct: 0 });
  const [loaded, setLoaded] = useState(false);

  // Lifted Play state — survives tab switches so progress isn't lost.
  const [playQueue, setPlayQueue] = useState(buildSession);
  const [playIndex, setPlayIndex] = useState(0);
  const [playScore, setPlayScore] = useState({ c: 0, w: 0 });
  const [playFinished, setPlayFinished] = useState(false);

  // Deep-linking from Play → Wiki. Setting this to a fresh { chapter, num }
  // object triggers WikiView to open that chapter and scroll to the entry.
  const [wikiDeep, setWikiDeep] = useState(null);
  // Tracks whether the user arrived at Wiki via "Open in wiki" from a Play
  // answer — used to show a "Back to question" affordance on Wiki.
  const [fromPlay, setFromPlay] = useState(false);
  const openInWiki = (ref) => {
    if (!ref) return;
    setWikiDeep({ chapter: ref.chapter, num: ref.num });
    setFromPlay(true);
    setTab('wiki');
  };
  // Clear the "came from Play" flag on any tab change away from Wiki.
  useEffect(() => {
    if (tab !== 'wiki') setFromPlay(false);
  }, [tab]);

  const t = THEMES[theme];

  useEffect(() => {
    const savedTheme = storageGet(STORAGE_KEYS.theme, 'dark');
    setTheme(THEME_IDS.includes(savedTheme) ? savedTheme : 'dark');
    setSessions(storageGet(STORAGE_KEYS.sessions, {}));
    setStreak(storageGet(STORAGE_KEYS.streak, { current: 0, longest: 0, lastDate: null }));
    setTotals(storageGet(STORAGE_KEYS.totals, { played: 0, correct: 0 }));
    setLoaded(true);
  }, []);

  // Cycle dark → light → us → dark.
  const toggleTheme = () => {
    const idx = THEME_IDS.indexOf(theme);
    const next = THEME_IDS[(idx + 1) % THEME_IDS.length] || 'dark';
    setTheme(next);
    storageSet(STORAGE_KEYS.theme, next);
  };

  const recordAnswer = (correct) => {
    const key = todayKey();
    const today = sessions[key] || { count: 0, correct: 0, total: 0 };
    const nextSessions = {
      ...sessions,
      [key]: {
        count: today.count + 1,
        correct: today.correct + (correct ? 1 : 0),
        total: today.total + 1,
      },
    };
    setSessions(nextSessions);
    storageSet(STORAGE_KEYS.sessions, nextSessions);

    const nextTotals = {
      played: totals.played + 1,
      correct: totals.correct + (correct ? 1 : 0),
    };
    setTotals(nextTotals);
    storageSet(STORAGE_KEYS.totals, nextTotals);

    if (streak.lastDate !== key) {
      let current = 1;
      if (streak.lastDate) {
        const gap = daysBetween(streak.lastDate, key);
        if (gap === 1) current = streak.current + 1;
        else if (gap === 0) current = streak.current;
        else current = 1;
      }
      const nextStreak = {
        current,
        longest: Math.max(current, streak.longest),
        lastDate: key,
      };
      setStreak(nextStreak);
      storageSet(STORAGE_KEYS.streak, nextStreak);
    }
  };

  const resetAll = async () => {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    const empty = {
      sessions: {},
      streak: { current: 0, longest: 0, lastDate: null },
      totals: { played: 0, correct: 0 },
    };
    setSessions(empty.sessions);
    setStreak(empty.streak);
    setTotals(empty.totals);
    storageSet(STORAGE_KEYS.sessions, empty.sessions);
    storageSet(STORAGE_KEYS.streak, empty.streak);
    storageSet(STORAGE_KEYS.totals, empty.totals);
    storageSet(STORAGE_KEYS.memorize, {});
  };

  if (!loaded) {
    return (
      <div style={{ background: t.bg, color: t.text, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'ui-serif, Georgia, serif' }}>
        <span style={{ letterSpacing: '0.2em', fontSize: 12, textTransform: 'uppercase', color: t.muted }}>Loading</span>
      </div>
    );
  }

  return (
    <div style={{
      background: t.bg,
      color: t.text,
      minHeight: '100vh',
      fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
      transition: 'background-color 200ms ease, color 200ms ease',
    }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }
        ::selection { background: ${t.text}; color: ${t.bg}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .fade-in { animation: fadeIn 280ms ease both; }
        .mono { font-family: "JetBrains Mono", "SF Mono", ui-monospace, monospace; }
      `}</style>

      <Header theme={theme} t={t} toggleTheme={toggleTheme} tab={tab} setTab={setTab} />

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '32px 20px 80px' }}>
        {tab === 'home' && (
          <HomeView t={t} sessions={sessions} setTab={setTab} />
        )}
        {/* PlayView stays mounted (just hidden) so per-question state —
            selected option, typed blanks, shown hint, submission result —
            is preserved when the user leaves Play for Wiki or Stats. */}
        <div style={{ display: tab === 'play' ? 'block' : 'none' }}>
          <PlayView
            t={t}
            onAnswer={recordAnswer}
            queue={playQueue}
            setQueue={setPlayQueue}
            index={playIndex}
            setIndex={setPlayIndex}
            score={playScore}
            setScore={setPlayScore}
            finished={playFinished}
            setFinished={setPlayFinished}
            openInWiki={openInWiki}
          />
        </div>
        {tab === 'memorize' && (
          <MemorizeView t={t} />
        )}
        {tab === 'wiki' && (
          <WikiView
            t={t}
            deepLink={wikiDeep}
            showBackToPlay={fromPlay}
            onBackToPlay={() => setTab('play')}
          />
        )}
        {tab === 'stats' && (
          <StatsView t={t} sessions={sessions} streak={streak} totals={totals} resetAll={resetAll} />
        )}
      </main>
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================

function Header({ theme, t, toggleTheme, tab, setTab }) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'play', label: 'Play' },
    { id: 'memorize', label: 'Memorize' },
    { id: 'wiki', label: 'Wiki' },
    { id: 'stats', label: 'Stats' },
  ];
  return (
    <header style={{
      borderBottom: `1px solid ${t.border}`,
      background: t.bg,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>Americana</span>
          <span className="mono" style={{ fontSize: 10, color: t.muted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>trivia</span>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: 'transparent',
            border: `1px solid ${t.border}`,
            color: t.text,
            width: 34, height: 34,
            borderRadius: 999,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          {theme === 'dark' && <Moon size={15} />}
          {theme === 'light' && <Sun size={15} />}
          {theme === 'us' && <span style={{ fontSize: 15, lineHeight: 1 }}>🇺🇸</span>}
        </button>
      </div>
      <nav style={{ maxWidth: 780, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 0, overflowX: 'auto' }}>
        {tabs.map(({ id, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${active ? t.accent : 'transparent'}`,
                color: active ? t.text : t.muted,
                padding: '10px 14px 12px',
                fontSize: 13,
                cursor: 'pointer',
                letterSpacing: '0.02em',
                transition: 'all 150ms ease',
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

// ============================================================
// HOME VIEW
// ============================================================

function HomeView({ t, sessions, setTab }) {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 40, fontWeight: 400, lineHeight: 1.1, margin: '24px 0 8px', letterSpacing: '-0.02em' }}>
        American history, <em style={{ fontStyle: 'italic', color: t.muted }}>tested.</em>
      </h1>
      <p style={{ fontSize: 15, color: t.muted, maxWidth: 520, lineHeight: 1.55, margin: '0 0 40px' }}>
        Study, recall, and test yourself across the Constitution, presidents, speeches, and more. Mixed question types, daily streaks, full reference, and a Memorize mode for committing passages to memory.
      </p>

      <Heatmap t={t} sessions={sessions} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 32 }}>
        <button
          onClick={() => setTab('play')}
          style={{
            background: t.text, color: t.bg,
            border: 'none', padding: '14px 22px',
            fontSize: 14, letterSpacing: '0.05em',
            textTransform: 'uppercase', cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          Begin a session →
        </button>
        <button
          onClick={() => setTab('memorize')}
          style={{
            background: 'transparent', color: t.text,
            border: `1px solid ${t.text}`, padding: '14px 22px',
            fontSize: 14, letterSpacing: '0.05em',
            textTransform: 'uppercase', cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          Memorize passages
        </button>
      </div>
    </div>
  );
}

function StatCard({ t, label, value, suffix, icon }) {
  return (
    <div style={{
      border: `1px solid ${t.border}`,
      padding: '14px 16px',
      background: t.surface,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: t.muted, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
        {icon}
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.01em' }}>
        {value} {suffix && <span style={{ fontSize: 12, color: t.muted, fontWeight: 400 }}>{suffix}</span>}
      </div>
    </div>
  );
}

// ============================================================
// HEATMAP
// ============================================================

function Heatmap({ t, sessions }) {
  const cells = useMemo(() => {
    const weeks = 26;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = weeks * 7;
    const start = new Date(today);
    start.setDate(today.getDate() - (totalDays - 1));

    const grid = [];
    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        if (date > today) { col.push(null); continue; }
        const key = todayKey(date);
        const session = sessions[key];
        col.push({ key, date, count: session ? session.total : 0 });
      }
      grid.push(col);
    }
    return grid;
  }, [sessions]);

  const level = (count) => {
    if (!count) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 10) return 3;
    return 4;
  };

  return (
    <section style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.muted, margin: 0 }}>Activity</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: t.muted }}>
          <span>Less</span>
          {t.heatScale.map((c, i) => (
            <span key={i} style={{ width: 10, height: 10, background: c, border: `1px solid ${t.border}` }} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div style={{ overflowX: 'auto', paddingBottom: 6 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {cells.map((col, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {col.map((cell, di) => (
                <div
                  key={di}
                  title={cell ? `${cell.key}: ${cell.count} answered` : ''}
                  style={{
                    width: 12, height: 12,
                    background: cell ? t.heatScale[level(cell.count)] : 'transparent',
                    border: cell ? `1px solid ${t.border}` : 'none',
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PLAY VIEW
// ============================================================

function PlayView({ t, onAnswer, queue, setQueue, index, setIndex, score, setScore, finished, setFinished, openInWiki }) {
  const q = queue[index];

  const handleResult = (correct) => {
    onAnswer(correct);
    setScore((s) => ({ c: s.c + (correct ? 1 : 0), w: s.w + (correct ? 0 : 1) }));
  };

  const next = () => {
    if (index + 1 >= queue.length) setFinished(true);
    else setIndex(index + 1);
  };

  const restart = () => {
    setQueue(buildSession());
    setIndex(0);
    setScore({ c: 0, w: 0 });
    setFinished(false);
  };

  if (finished) {
    const total = score.c + score.w;
    const pct = total ? Math.round((score.c / total) * 100) : 0;
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.muted, marginBottom: 16 }}>Session complete</div>
        <div style={{ fontSize: 72, fontWeight: 300, letterSpacing: '-0.03em' }}>{pct}%</div>
        <div style={{ fontSize: 14, color: t.muted, marginTop: 8 }}>{score.c} correct · {score.w} incorrect</div>
        <button
          onClick={restart}
          style={{
            marginTop: 32,
            background: t.text, color: t.bg,
            border: 'none', padding: '12px 24px',
            fontSize: 13, letterSpacing: '0.05em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          New session
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <span className="mono" style={{ fontSize: 11, color: t.muted, letterSpacing: '0.1em' }}>
          {String(index + 1).padStart(2, '0')} / {String(queue.length).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
          <span style={{ color: t.correct }}>✓ {score.c}</span>
          <span style={{ color: t.wrong }}>✗ {score.w}</span>
        </div>
      </div>

      <Progress t={t} value={(index / queue.length) * 100} />

      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.muted, marginBottom: 12 }}>
          {q.category} · {labelForType(q.type)}
        </div>
        <QuestionRenderer key={q.id} q={q} t={t} onResult={handleResult} onNext={next} openInWiki={openInWiki} />
      </div>
    </div>
  );
}

function labelForType(type) {
  return {
    multiple: 'Multiple choice',
    complete: 'Complete the text',
    truefalse: 'True or false',
    'match-year': 'Match to year',
    order: 'Chronological order',
  }[type] || type;
}

function Progress({ t, value }) {
  return (
    <div style={{ height: 2, background: t.border, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, background: t.text, transition: 'width 300ms ease' }} />
    </div>
  );
}

// ============================================================
// QUESTION RENDERERS
// ============================================================

function QuestionRenderer({ q, t, onResult, onNext, openInWiki }) {
  const common = { q, t, onResult, onNext, openInWiki };
  switch (q.type) {
    case 'multiple': return <MultipleChoice {...common} />;
    case 'complete': return <CompleteText {...common} />;
    case 'truefalse': return <TrueFalse {...common} />;
    case 'match-year': return <MatchYear {...common} />;
    case 'order': return <OrderItems {...common} />;
    default: return null;
  }
}

function MultipleChoice({ q, t, onResult, onNext, openInWiki }) {
  const [picked, setPicked] = useState(null);
  const submitted = picked !== null;

  // If every choice looks like a known president name, enrich with number + years.
  const enrichedChoices = useMemo(() => {
    const allPresidents = q.choices.every((c) => PRESIDENT_TERMS.has(c));
    if (!allPresidents) return q.choices;
    return q.choices.map(presidentLabel);
  }, [q.choices]);

  const pick = (i) => {
    if (submitted) return;
    setPicked(i);
    onResult(i === q.answer);
  };

  return (
    <div>
      <p style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.4, margin: '0 0 24px', letterSpacing: '-0.01em' }}>{q.prompt}</p>
      <div style={{ display: 'grid', gap: 10 }}>
        {enrichedChoices.map((c, i) => {
          const isCorrect = submitted && i === q.answer;
          const isWrong = submitted && i === picked && i !== q.answer;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={submitted}
              style={{
                textAlign: 'left',
                background: isCorrect ? t.correct + '22' : isWrong ? t.wrong + '22' : t.surface,
                color: t.text,
                border: `1px solid ${isCorrect ? t.correct : isWrong ? t.wrong : t.border}`,
                padding: '14px 16px',
                fontSize: 15,
                cursor: submitted ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 10,
                transition: 'all 150ms ease',
              }}
            >
              <span>{c}</span>
              {isCorrect && <Check size={16} color={t.correct} style={{ flexShrink: 0 }} />}
              {isWrong && <X size={16} color={t.wrong} style={{ flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
      {submitted && <AnswerReveal q={q} t={t} openInWiki={openInWiki} />}
      {submitted && <NextButton t={t} onClick={onNext} />}
    </div>
  );
}

function CompleteText({ q, t, onResult, onNext, openInWiki }) {
  const [values, setValues] = useState(q.blanks.map(() => ''));
  const [submitted, setSubmitted] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const results = q.blanks.map((b, i) => values[i].trim().toLowerCase() === b.toLowerCase());
  const allCorrect = results.every(Boolean);

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    onResult(allCorrect);
  };

  const parts = q.prompt.split('____');

  return (
    <div>
      <p style={{ fontSize: 18, lineHeight: 1.6, margin: '0 0 24px', letterSpacing: '-0.005em' }}>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < q.blanks.length && (
              <input
                value={values[i]}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = e.target.value;
                  setValues(next);
                }}
                disabled={submitted}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1.5px solid ${submitted ? (results[i] ? t.correct : t.wrong) : t.text}`,
                  color: submitted && !results[i] ? t.wrong : t.text,
                  padding: '2px 4px',
                  fontSize: 18,
                  width: Math.max(q.blanks[i].length * 9 + 20, 80),
                  outline: 'none',
                  margin: '0 4px',
                  textAlign: 'center',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </p>
      {q.hint && !submitted && (
        hintShown ? (
          <p style={{ fontSize: 12, color: t.muted, fontStyle: 'italic', margin: '-4px 0 8px' }}>
            Hint: {q.hint}
          </p>
        ) : (
          <button
            onClick={() => setHintShown(true)}
            style={{
              background: 'transparent',
              border: `1px solid ${t.border}`,
              color: t.muted,
              padding: '5px 12px',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              margin: '-4px 0 8px',
              display: 'inline-block',
            }}
          >
            Show hint
          </button>
        )
      )}
      {submitted && !allCorrect && (
        <p style={{ fontSize: 13, color: t.muted, marginTop: 8 }}>
          Correct answer{q.blanks.length > 1 ? 's' : ''}: <strong style={{ color: t.text }}>{q.blanks.join(', ')}</strong>
        </p>
      )}
      {submitted && <AnswerReveal q={q} t={t} openInWiki={openInWiki} />}
      {!submitted ? (
        <button onClick={submit} style={primaryBtn(t)}>
          Check answer
        </button>
      ) : (
        <NextButton t={t} onClick={onNext} />
      )}
    </div>
  );
}

function TrueFalse({ q, t, onResult, onNext, openInWiki }) {
  const [picked, setPicked] = useState(null);
  const submitted = picked !== null;

  const pick = (val) => {
    if (submitted) return;
    setPicked(val);
    onResult(val === q.answer);
  };

  return (
    <div>
      <p style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.4, margin: '0 0 24px' }}>{q.prompt}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[true, false].map((val) => {
          const label = val ? 'True' : 'False';
          const isCorrect = submitted && val === q.answer;
          const isWrong = submitted && val === picked && val !== q.answer;
          return (
            <button
              key={label}
              onClick={() => pick(val)}
              disabled={submitted}
              style={{
                background: isCorrect ? t.correct + '22' : isWrong ? t.wrong + '22' : t.surface,
                color: t.text,
                border: `1px solid ${isCorrect ? t.correct : isWrong ? t.wrong : t.border}`,
                padding: '20px 16px',
                fontSize: 16,
                cursor: submitted ? 'default' : 'pointer',
                letterSpacing: '0.02em',
                transition: 'all 150ms ease',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      {submitted && <AnswerReveal q={q} t={t} openInWiki={openInWiki} />}
      {submitted && <NextButton t={t} onClick={onNext} />}
    </div>
  );
}

function MatchYear({ q, t, onResult, onNext, openInWiki }) {
  const years = useMemo(() => {
    const pairYears = q.pairs.map((p) => p.year);
    const distractors = q.distractors || [];
    return shuffle([...pairYears, ...distractors]);
  }, [q.id]);
  const [assignments, setAssignments] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (item, year) => {
    if (submitted) return;
    setAssignments((a) => ({ ...a, [item]: year }));
  };

  const allAssigned = q.pairs.every((p) => assignments[p.item] !== undefined);
  const allCorrect = q.pairs.every((p) => assignments[p.item] === p.year);

  const submit = () => {
    if (!allAssigned || submitted) return;
    setSubmitted(true);
    onResult(allCorrect);
  };

  return (
    <div>
      <p style={{ fontSize: 20, lineHeight: 1.4, margin: '0 0 24px' }}>{q.prompt}</p>
      <div style={{ display: 'grid', gap: 10 }}>
        {q.pairs.map((p) => {
          const picked = assignments[p.item];
          const correct = submitted && picked === p.year;
          const wrong = submitted && picked !== p.year;
          return (
            <div key={p.item} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              border: `1px solid ${correct ? t.correct : wrong ? t.wrong : t.border}`,
              padding: '10px 14px',
              background: correct ? t.correct + '15' : wrong ? t.wrong + '15' : t.surface,
            }}>
              <span style={{ fontSize: 14 }}>{p.item}</span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => set(p.item, y)}
                    disabled={submitted}
                    style={{
                      background: picked === y ? t.text : 'transparent',
                      color: picked === y ? t.bg : t.text,
                      border: `1px solid ${t.border}`,
                      padding: '4px 10px',
                      fontSize: 12,
                      cursor: submitted ? 'default' : 'pointer',
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  >{y}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {submitted && !allCorrect && (
        <div style={{ marginTop: 12, fontSize: 13, color: t.muted }}>
          Correct: {q.pairs.map((p) => `${p.item.split(' (')[0]} → ${p.year}`).join(' · ')}
        </div>
      )}
      {submitted && <AnswerReveal q={q} t={t} openInWiki={openInWiki} />}
      {!submitted ? (
        <button
          onClick={submit}
          disabled={!allAssigned}
          style={{ ...primaryBtn(t), opacity: allAssigned ? 1 : 0.4, cursor: allAssigned ? 'pointer' : 'not-allowed' }}
        >
          Check answers
        </button>
      ) : (
        <NextButton t={t} onClick={onNext} />
      )}
    </div>
  );
}

function OrderItems({ q, t, onResult, onNext, openInWiki }) {
  const [order, setOrder] = useState(() => shuffle(q.items.map((_, i) => i)));
  const [submitted, setSubmitted] = useState(false);

  const move = (from, to) => {
    if (submitted) return;
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    const [spliced] = next.splice(from, 1);
    next.splice(to, 0, spliced);
    setOrder(next);
  };

  const isCorrect = order.every((idx, i) => idx === q.correctOrder[i]);

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    onResult(isCorrect);
  };

  return (
    <div>
      <p style={{ fontSize: 20, lineHeight: 1.4, margin: '0 0 24px' }}>{q.prompt}</p>
      <div style={{ display: 'grid', gap: 8 }}>
        {order.map((itemIdx, i) => {
          const correctHere = submitted && itemIdx === q.correctOrder[i];
          const wrongHere = submitted && itemIdx !== q.correctOrder[i];
          return (
            <div key={itemIdx} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1px solid ${correctHere ? t.correct : wrongHere ? t.wrong : t.border}`,
              background: correctHere ? t.correct + '15' : wrongHere ? t.wrong + '15' : t.surface,
              padding: '10px 14px',
            }}>
              <span className="mono" style={{ fontSize: 11, color: t.muted, width: 18 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 15 }}>{q.items[itemIdx]}</span>
              {!submitted && (
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => move(i, i - 1)} disabled={i === 0} style={iconBtn(t, i === 0)}>↑</button>
                  <button onClick={() => move(i, i + 1)} disabled={i === order.length - 1} style={iconBtn(t, i === order.length - 1)}>↓</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {submitted && !isCorrect && (
        <div style={{ marginTop: 12, fontSize: 13, color: t.muted }}>
          Correct order: {q.correctOrder.map((idx) => q.items[idx]).join(' → ')}
        </div>
      )}
      {submitted && <AnswerReveal q={q} t={t} openInWiki={openInWiki} />}
      {!submitted ? (
        <button onClick={submit} style={primaryBtn(t)}>Check order</button>
      ) : (
        <NextButton t={t} onClick={onNext} />
      )}
    </div>
  );
}

// ============================================================
// ANSWER REVEAL — unified post-submission panel across question types.
// Shows date, explanation, amendment text (pulled from wiki for amendment
// chapters), and an "Open in wiki" deep-link.
// ============================================================

function AnswerReveal({ q, t, openInWiki }) {
  const entry = getWikiEntry(q.wikiRef);
  const date = q.date || (entry ? String(entry.year) : null);
  const showAmendmentText =
    entry && q.wikiRef && AMENDMENT_CHAPTERS.has(q.wikiRef.chapter) && !q.suppressAmendmentText;

  const hasContent = date || q.explanation || showAmendmentText || q.wikiRef;
  if (!hasContent) return null;

  return (
    <div style={{
      marginTop: 16,
      padding: '14px 16px',
      background: t.surface,
      border: `1px solid ${t.border}`,
    }}>
      {date && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: t.muted,
          marginBottom: (q.explanation || showAmendmentText || q.wikiRef) ? 10 : 0,
        }}>
          <Calendar size={11} />
          {date}
        </div>
      )}
      {q.explanation && (
        <p style={{
          margin: (showAmendmentText || q.wikiRef) ? '0 0 12px' : 0,
          fontSize: 13,
          color: t.muted,
          fontStyle: 'italic',
          lineHeight: 1.55,
        }}>
          {q.explanation}
        </p>
      )}
      {showAmendmentText && (
        <blockquote style={{
          margin: q.wikiRef ? '0 0 12px' : 0,
          padding: '8px 0 8px 12px',
          borderLeft: `2px solid ${t.border}`,
          fontSize: 13,
          lineHeight: 1.65,
          color: t.text,
        }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: t.muted, marginBottom: 6,
          }}>
            {entry.title}
          </div>
          {entry.text}
        </blockquote>
      )}
      {q.wikiRef && openInWiki && (
        <button
          onClick={() => openInWiki(q.wikiRef)}
          style={{
            background: 'transparent',
            border: `1px solid ${t.border}`,
            color: t.text,
            padding: '6px 12px',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <ExternalLink size={11} />
          Open in wiki
        </button>
      )}
    </div>
  );
}

function iconBtn(t, disabled) {
  return {
    background: 'transparent',
    border: `1px solid ${t.border}`,
    color: disabled ? t.muted : t.text,
    width: 28, height: 28,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 12,
    opacity: disabled ? 0.4 : 1,
  };
}

function primaryBtn(t) {
  return {
    marginTop: 20,
    background: t.text, color: t.bg,
    border: 'none', padding: '12px 20px',
    fontSize: 13, letterSpacing: '0.05em',
    textTransform: 'uppercase', cursor: 'pointer',
    width: '100%',
  };
}

function secondaryBtn(t) {
  return {
    background: 'transparent', color: t.text,
    border: `1px solid ${t.border}`,
    padding: '12px 20px',
    fontSize: 13, letterSpacing: '0.05em',
    textTransform: 'uppercase', cursor: 'pointer',
  };
}

function NextButton({ t, onClick }) {
  return (
    <button onClick={onClick} style={primaryBtn(t)}>
      Continue →
    </button>
  );
}

// ============================================================
// WIKI VIEW
// ============================================================

function WikiView({ t, deepLink, showBackToPlay, onBackToPlay }) {
  const [query, setQuery] = useState('');
  const [openChapter, setOpenChapter] = useState(null);

  useEffect(() => {
    if (!deepLink) return;
    setOpenChapter(deepLink.chapter);
    setQuery('');
    const id = `wiki-${deepLink.chapter}-${deepLink.num}`;
    // Wait for the expanded chapter to render entries, then scroll.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }, [deepLink]);

  const filtered = useMemo(() => {
    if (!query.trim()) return WIKI;
    const q = query.toLowerCase();
    return WIKI.map((chapter) => ({
      ...chapter,
      entries: chapter.entries.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.text.toLowerCase().includes(q) ||
        (e.notes && e.notes.toLowerCase().includes(q)) ||
        String(e.num).includes(q) ||
        String(e.year).includes(q)
      ),
    })).filter((c) => c.entries.length > 0 || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="fade-in">
      {showBackToPlay && (
        <button
          onClick={onBackToPlay}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: t.text, color: t.bg,
            border: 'none',
            padding: '8px 14px',
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginTop: 16,
          }}
        >
          <ArrowLeft size={12} />
          Back to question
        </button>
      )}
      <h1 style={{ fontSize: 32, fontWeight: 400, margin: '24px 0 20px', letterSpacing: '-0.02em' }}>Reference</h1>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        border: `1px solid ${t.border}`,
        padding: '10px 14px',
        marginBottom: 28,
        background: t.surface,
      }}>
        <Search size={14} color={t.muted} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search amendments, years, keywords..."
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: t.text, fontSize: 14,
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: t.muted, cursor: 'pointer' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: t.muted, fontStyle: 'italic' }}>No matches.</p>
      )}

      {filtered.map((chapter) => {
        const open = openChapter === chapter.id || query.trim().length > 0;
        return (
          <div key={chapter.id} style={{ marginBottom: 28, borderTop: `1px solid ${t.border}` }}>
            <button
              onClick={() => setOpenChapter(open ? null : chapter.id)}
              style={{
                width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none',
                color: t.text, cursor: 'pointer',
                padding: '20px 0',
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16,
              }}
            >
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>{chapter.title}</h2>
                <p style={{ fontSize: 13, color: t.muted, margin: '4px 0 0', lineHeight: 1.5, maxWidth: 560 }}>{chapter.summary}</p>
              </div>
              <ChevronRight size={16} color={t.muted} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 200ms ease', flexShrink: 0 }} />
            </button>
            {open && (
              <div style={{ paddingBottom: 12 }}>
                {chapter.entries.map((e) => (
                  <article
                    key={e.num}
                    id={`wiki-${chapter.id}-${e.num}`}
                    style={{
                      padding: '16px 0',
                      borderTop: `1px solid ${t.border}`,
                      scrollMarginTop: 96,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                      <span className="mono" style={{ fontSize: 11, color: t.muted, letterSpacing: '0.1em' }}>№ {e.num}</span>
                      <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>{e.title}</h3>
                      <span className="mono" style={{ fontSize: 11, color: t.muted, marginLeft: 'auto' }}>{e.year}</span>
                    </div>
                    <blockquote style={{
                      margin: 0, padding: '8px 0 8px 14px',
                      borderLeft: `2px solid ${t.border}`,
                      fontSize: 14, lineHeight: 1.65, fontStyle: 'italic',
                      color: t.text,
                    }}>
                      {e.text}
                    </blockquote>
                    {e.notes && (
                      <p style={{ fontSize: 12, color: t.muted, margin: '10px 0 0', lineHeight: 1.5 }}>{e.notes}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// MEMORIZE VIEW
// ============================================================

const STUDY_OPTIONS = [30, 60, 120, 0]; // 0 = no timer

function MemorizeView({ t }) {
  const available = useMemo(() => SPEECHES.filter((s) => s.lines && s.lines.length > 0), []);
  const [selectedId, setSelectedId] = useState(null);
  const [stage, setStage] = useState('select'); // 'select' | 'study' | 'recall' | 'score'
  const [studySeconds, setStudySeconds] = useState(60);
  const [useCue, setUseCue] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [recall, setRecall] = useState('');
  const [result, setResult] = useState(null);

  const speech = available.find((s) => s.id === selectedId) || null;

  useEffect(() => {
    if (stage !== 'study' || studySeconds === 0) return;
    setTimeLeft(studySeconds);
    const int = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(int);
          setStage('recall');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(int);
  }, [stage, studySeconds]);

  const pick = (id) => {
    setSelectedId(id);
    setRecall('');
    setResult(null);
    setStage('study');
  };

  const skipToRecall = () => setStage('recall');

  const submitRecall = () => {
    const expected = speech.lines.join(' ');
    setResult(scoreRecall(expected, recall));
    setStage('score');
  };

  const tryAgain = () => {
    setRecall('');
    setResult(null);
    setStage('study');
  };

  const back = () => {
    setSelectedId(null);
    setRecall('');
    setResult(null);
    setStage('select');
  };

  if (available.length === 0) {
    return (
      <div className="fade-in">
        <h1 style={{ fontSize: 32, fontWeight: 400, margin: '24px 0 16px', letterSpacing: '-0.02em' }}>Memorize</h1>
        <p style={{ fontSize: 15, color: t.muted, lineHeight: 1.6, maxWidth: 560 }}>
          No passages loaded yet. Open <span className="mono" style={{ fontSize: 13 }}>src/data/speeches.js</span> and paste text into the <span className="mono" style={{ fontSize: 13 }}>lines</span> array for any speech to enable it here.
        </p>
      </div>
    );
  }

  if (stage === 'select' || !speech) {
    return (
      <MemorizeSelect
        t={t}
        speeches={available}
        studySeconds={studySeconds}
        setStudySeconds={setStudySeconds}
        useCue={useCue}
        setUseCue={setUseCue}
        onPick={pick}
      />
    );
  }

  if (stage === 'study') {
    return (
      <MemorizeStudy
        t={t}
        speech={speech}
        timeLeft={studySeconds === 0 ? null : timeLeft}
        onReady={skipToRecall}
        onBack={back}
      />
    );
  }

  if (stage === 'recall') {
    return (
      <MemorizeRecall
        t={t}
        speech={speech}
        useCue={useCue}
        value={recall}
        setValue={setRecall}
        onSubmit={submitRecall}
        onBack={back}
      />
    );
  }

  if (stage === 'score') {
    return (
      <MemorizeScore
        t={t}
        speech={speech}
        result={result}
        onTryAgain={tryAgain}
        onBack={back}
      />
    );
  }

  return null;
}

function MemorizeSelect({ t, speeches, studySeconds, setStudySeconds, useCue, setUseCue, onPick }) {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 32, fontWeight: 400, margin: '24px 0 8px', letterSpacing: '-0.02em' }}>Memorize</h1>
      <p style={{ fontSize: 14, color: t.muted, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 560 }}>
        Flash-recall: study a passage for a set time, then type it from memory. We score at the word level using alignment — missing, extra, and reordered words are all counted.
      </p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.muted, margin: '0 0 10px' }}>
          Study timer
        </h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STUDY_OPTIONS.map((s) => {
            const active = studySeconds === s;
            const label = s === 0 ? 'No timer' : `${s}s`;
            return (
              <button
                key={s}
                onClick={() => setStudySeconds(s)}
                style={{
                  background: active ? t.text : 'transparent',
                  color: active ? t.bg : t.text,
                  border: `1px solid ${active ? t.text : t.border}`,
                  padding: '8px 14px',
                  fontSize: 12,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={useCue}
            onChange={(e) => setUseCue(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: 14 }}>
            First-letter cue during recall
            <span style={{ color: t.muted, fontSize: 12, marginLeft: 8, fontStyle: 'italic' }}>
              shows F___ s____ a__ s____ as scaffold
            </span>
          </span>
        </label>
      </section>

      <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.muted, margin: '0 0 10px' }}>
        Passages ({speeches.length})
      </h2>
      <div style={{ display: 'grid', gap: 0, borderTop: `1px solid ${t.border}` }}>
        {speeches.map((s) => {
          const wordCount = normalizeWords(s.lines.join(' ')).length;
          return (
            <button
              key={s.id}
              onClick={() => onPick(s.id)}
              style={{
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${t.border}`,
                color: t.text,
                padding: '16px 0',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 4 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 12, color: t.muted, letterSpacing: '0.02em' }}>
                  {s.author} · {s.year} · <span className="mono">{wordCount} words</span>
                </div>
              </div>
              <ChevronRight size={16} color={t.muted} style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MemorizeStudy({ t, speech, timeLeft, onReady, onBack }) {
  return (
    <div className="fade-in">
      <TopBar t={t} onBack={onBack} title="Study" />

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 0 18px' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>{speech.title}</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{speech.author} · {speech.year}</div>
        </div>
        {timeLeft !== null && (
          <div className="mono" style={{
            fontSize: 20, color: timeLeft <= 10 ? t.wrong : t.text,
            letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Clock size={14} /> {timeLeft}s
          </div>
        )}
      </div>

      {speech.context && (
        <p style={{ fontSize: 12, color: t.muted, fontStyle: 'italic', lineHeight: 1.5, margin: '0 0 20px' }}>
          {speech.context}
        </p>
      )}

      <article style={{
        border: `1px solid ${t.border}`,
        background: t.surface,
        padding: '20px 22px',
        fontSize: 16,
        lineHeight: 1.75,
      }}>
        {speech.lines.map((line, i) => (
          <p key={i} style={{ margin: i === 0 ? 0 : '10px 0 0' }}>{line}</p>
        ))}
      </article>

      <button onClick={onReady} style={primaryBtn(t)}>
        I'm ready — recall now
      </button>
    </div>
  );
}

function MemorizeRecall({ t, speech, useCue, value, setValue, onSubmit, onBack }) {
  const cueText = useMemo(() => firstLetterCue(speech.lines.join('\n')), [speech]);
  const wordTarget = useMemo(() => normalizeWords(speech.lines.join(' ')).length, [speech]);
  const wordsTyped = normalizeWords(value).length;

  return (
    <div className="fade-in">
      <TopBar t={t} onBack={onBack} title="Recall" />

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 0 18px' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>{speech.title}</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{speech.author} · {speech.year}</div>
        </div>
        <div className="mono" style={{ fontSize: 12, color: t.muted, letterSpacing: '0.05em' }}>
          {wordsTyped} / {wordTarget}
        </div>
      </div>

      {useCue && (
        <pre style={{
          margin: '0 0 14px',
          padding: '14px 16px',
          background: t.surface,
          border: `1px solid ${t.border}`,
          color: t.muted,
          fontFamily: 'ui-monospace, "SF Mono", monospace',
          fontSize: 13,
          lineHeight: 1.9,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
        }}>{cueText}</pre>
      )}

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type from memory. Don't worry about punctuation or capitalization — only words are scored."
        autoFocus
        rows={useCue ? 8 : 14}
        style={{
          width: '100%',
          background: t.surface,
          border: `1px solid ${t.border}`,
          color: t.text,
          padding: '14px 16px',
          fontSize: 15,
          lineHeight: 1.7,
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />

      <button onClick={onSubmit} style={primaryBtn(t)} disabled={!value.trim()}>
        Check recall
      </button>
    </div>
  );
}

function MemorizeScore({ t, speech, result, onTryAgain, onBack }) {
  const color = result.pct >= 90 ? t.correct : result.pct >= 60 ? t.text : t.wrong;
  return (
    <div className="fade-in">
      <TopBar t={t} onBack={onBack} title="Result" />

      <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.muted, marginBottom: 12 }}>
          {speech.title}
        </div>
        <div style={{ fontSize: 64, fontWeight: 300, letterSpacing: '-0.03em', color }}>{result.pct}%</div>
        <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>
          {result.correct} / {result.total} words matched
        </div>
      </div>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.muted, margin: '0 0 10px' }}>
          Word-by-word
        </h2>
        <p style={{
          border: `1px solid ${t.border}`,
          background: t.surface,
          padding: '16px 18px',
          lineHeight: 1.9,
          fontSize: 15,
          margin: 0,
        }}>
          {result.expWords.map((w, i) => (
            <span key={i} style={{
              color: result.matched[i] ? t.correct : t.wrong,
              background: result.matched[i] ? t.correct + '12' : t.wrong + '10',
              padding: '1px 4px',
              marginRight: 4,
              marginBottom: 3,
              display: 'inline-block',
              borderRadius: 2,
            }}>{w}</span>
          ))}
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.muted, margin: '0 0 10px' }}>
          Full passage
        </h2>
        <article style={{
          border: `1px solid ${t.border}`,
          background: t.surface,
          padding: '16px 18px',
          fontSize: 15, lineHeight: 1.75,
        }}>
          {speech.lines.map((line, i) => (
            <p key={i} style={{ margin: i === 0 ? 0 : '10px 0 0' }}>{line}</p>
          ))}
        </article>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 28 }}>
        <button onClick={onTryAgain} style={primaryBtn(t)}>Try again</button>
        <button onClick={onBack} style={secondaryBtn(t)}>Pick another</button>
      </div>
    </div>
  );
}

function TopBar({ t, onBack, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 20px' }}>
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: `1px solid ${t.border}`,
          color: t.text,
          padding: '6px 10px',
          fontSize: 12,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}
      >
        <ArrowLeft size={12} /> Back
      </button>
      <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.muted }}>
        {title}
      </span>
    </div>
  );
}

// ============================================================
// STATS VIEW
// ============================================================

function StatsView({ t, sessions, streak, totals, resetAll }) {
  const accuracy = totals.played ? Math.round((totals.correct / totals.played) * 100) : 0;
  const activeDays = Object.keys(sessions).length;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 32, fontWeight: 400, margin: '24px 0 24px', letterSpacing: '-0.02em' }}>Stats</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
        <StatCard t={t} label="Answered" value={totals.played} />
        <StatCard t={t} label="Correct" value={totals.correct} />
        <StatCard t={t} label="Accuracy" value={`${accuracy}%`} />
        <StatCard t={t} label="Active days" value={activeDays} />
        <StatCard t={t} label="Current streak" value={streak.current} suffix={streak.current === 1 ? 'day' : 'days'} icon={<Flame size={14} />} />
        <StatCard t={t} label="Longest streak" value={streak.longest} suffix={streak.longest === 1 ? 'day' : 'days'} icon={<Trophy size={14} />} />
      </div>

      <Heatmap t={t} sessions={sessions} />

      <button
        onClick={resetAll}
        style={{
          marginTop: 48,
          background: 'transparent',
          color: t.muted,
          border: `1px solid ${t.border}`,
          padding: '10px 16px',
          fontSize: 12,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}
      >
        <RotateCcw size={12} /> Reset all progress
      </button>
    </div>
  );
}
