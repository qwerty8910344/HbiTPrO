const zodiacSigns = [
  { name: 'Aries', start: [3, 21], end: [4, 19], icon: '♈', vibe: 'Bold energy ahead. Take the lead today.' },
  { name: 'Taurus', start: [4, 20], end: [5, 20], icon: '♉', vibe: 'Strength and stability are your allies now.' },
  { name: 'Gemini', start: [5, 21], end: [6, 20], icon: '♊', vibe: 'New connections will spark brilliant ideas.' },
  { name: 'Cancer', start: [6, 21], end: [7, 22], icon: '♋', vibe: 'Listen to your intuition; it is rarely wrong.' },
  { name: 'Leo', start: [7, 23], end: [8, 22], icon: '♌', vibe: 'Your charisma is at its peak. Shine bright.' },
  { name: 'Virgo', start: [8, 23], end: [9, 22], icon: '♍', vibe: 'Precision is your superpower today.' },
  { name: 'Libra', start: [9, 23], end: [10, 22], icon: '♎', vibe: 'Balance brings clarity to your toughest choices.' },
  { name: 'Scorpio', start: [10, 23], end: [11, 21], icon: '♏', vibe: 'Transformation is coming. Embrace the depth.' },
  { name: 'Sagittarius', start: [11, 22], end: [12, 21], icon: '♐', vibe: 'Adventure calls! Look beyond the horizon.' },
  { name: 'Capricorn', start: [12, 22], end: [1, 19], icon: '♑', vibe: 'Patience and discipline lead to mastery.' },
  { name: 'Aquarius', start: [1, 20], end: [2, 18], icon: '♒', vibe: 'Innovation is in your DNA. Think different.' },
  { name: 'Pisces', start: [2, 19], end: [3, 20], icon: '♓', vibe: 'Creative flow is high. Dive into your dreams.' }
];

export const getZodiacSign = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return zodiacSigns.find(sign => {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    return (month === sm && day >= sd) || (month === em && day <= ed);
  }) || zodiacSigns[9]; // Default Capricorn for edge case
};

const vibeParts = {
  subjects: ['Your energy', 'The universe', 'A deep focus', 'New opportunity', 'Financial clarity', 'A secret spark', 'Stability', 'Transformation', 'Adventure', 'Creative flow'],
  actions: ['is aligning with', 'is expanding through', 'leads you toward', 'is unlocking', 'reveals', 'is shifting into', 'guides you to', 'is heightened by'],
  results: ['your greatest ambition.', 'a hidden truth.', 'unprecedented success.', 'major breakthroughs.', 'peace and harmony.', 'joyful connections.', 'bold new beginnings.']
};

export const getDailyHoroscope = (signName, date = new Date()) => {
  if (!signName) return null;
  
  // Use day of year as a seed
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const signIndex = zodiacSigns.findIndex(s => s.name === signName);
  
  // Deterministic indexing to ensure 365 unique results
  const getIndex = (arr, offset) => (dayOfYear + signIndex + offset) % arr.length;
  
  const sub = vibeParts.subjects[getIndex(vibeParts.subjects, 0)];
  const act = vibeParts.actions[getIndex(vibeParts.actions, 5)];
  const res = vibeParts.results[getIndex(vibeParts.results, 12)];
  
  return {
    vibe: `${sub} ${act} ${res}`,
    number: ((dayOfYear * (signIndex + 1)) % 88) + 1,
    color: ['Elite Green', 'Royal Gold', 'Deep Space', 'Electric Blue', 'Solar Flame', 'Obsidian White', 'Neon Mint'][getIndex([0,1,2,3,4,5,6], 7)],
    score: 80 + ((dayOfYear + signIndex) % 21) // Always high Elite level 80-100
  };
};
