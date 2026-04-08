export interface ZodiacSign {
  name: string;
  start: [number, number];
  end: [number, number];
  icon: string;
  vibe: string;
}

export const zodiacSigns: ZodiacSign[] = [
  { name: 'Aries', start: [3, 21], end: [4, 19], icon: '♈', vibe: 'Take the lead today. Your energy is unmatched.' },
  { name: 'Taurus', start: [4, 20], end: [5, 20], icon: '♉', vibe: 'Inner strength will reveal a path to wealth.' },
  { name: 'Gemini', start: [5, 21], end: [6, 20], icon: '♊', vibe: 'Brilliant ideas arise from casual conversations.' },
  { name: 'Cancer', start: [6, 21], end: [7, 22], icon: '♋', vibe: 'Your intuition is at an all-time high today.' },
  { name: 'Leo', start: [7, 23], end: [8, 22], icon: '♌', vibe: 'Radiate confidence. The world is watching you.' },
  { name: 'Virgo', start: [8, 23], end: [9, 22], icon: '♍', vibe: 'Strategic precision solves long-standing issues.' },
  { name: 'Libra', start: [9, 23], end: [10, 22], icon: '♎', vibe: 'Harmony in relationships creates new openings.' },
  { name: 'Scorpio', start: [10, 23], end: [11, 21], icon: '♏', vibe: 'Dive deep. A transformation is now imminent.' },
  { name: 'Sagittarius', start: [11, 22], end: [12, 21], icon: '♐', vibe: 'Expand your vision. Adventure is calling you.' },
  { name: 'Capricorn', start: [12, 22], end: [1, 19], icon: '♑', vibe: 'Patience and discipline lead to total mastery.' },
  { name: 'Aquarius', start: [1, 20], end: [2, 18], icon: '♒', vibe: 'Innovation is your DNA. Think light-years ahead.' },
  { name: 'Pisces', start: [2, 19], end: [3, 20], icon: '♓', vibe: 'Creative flows are peaking. Manifest your dream.' }
];

export const getZodiacSign = (dateString: string | null): ZodiacSign | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return zodiacSigns.find(sign => {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    return (month === sm && day >= sd) || (month === em && day <= ed);
  }) || zodiacSigns[9];
};

const subjects = ['Your focus', 'The universe', 'Creative flow', 'New opportunity', 'Financial clarity', 'A secret spark', 'Stability', 'Transformation', 'Leadership'];
const actions = ['is aligning with', 'is expanding through', 'leads you toward', 'is unlocking', 'reveals', 'is shifting into', 'guides you to'];
const results = ['your highest ambition.', 'a hidden truth.', 'unprecedented success.', 'major breakthroughs.', 'peace and harmony.', 'bold new beginnings.'];

export const getDailyHoroscope = (signName: string, date = new Date()) => {
  if (!signName) return null;
  
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date as any) - (start as any);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const signIndex = zodiacSigns.findIndex(s => s.name === signName);
  const getIndex = (arr: any[], offset: number) => (dayOfYear + signIndex + offset) % arr.length;
  
  return {
    vibe: `${subjects[getIndex(subjects, 0)]} ${actions[getIndex(actions, 3)]} ${results[getIndex(results, 7)]}`,
    luckyNumber: ((dayOfYear * (signIndex + 1)) % 88) + 1,
    luckyColor: ['Emerald', 'Royal Gold', 'Deep Space', 'Neon Mint', 'Solar Flame'][getIndex([0,1,2,3,4], 5)],
    accuracy: 95 + ((dayOfYear + signIndex) % 5), // Drives the 95-99% badge
    energyLevel: 80 + ((dayOfYear + signIndex) % 21)
  };
};
