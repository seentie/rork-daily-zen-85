export interface DailyQuote {
  text: string;
  author: string;
}

export const QUOTES: DailyQuote[] = [
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
  { text: "The present moment is the only time over which we have dominion.", author: "Thích Nhất Hạnh" },
  { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  { text: "Your calm mind is the ultimate weapon against your challenges.", author: "Bryant McGill" },
  { text: "Within you there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "Mindfulness isn't difficult, we just need to remember to do it.", author: "Sharon Salzberg" },
  { text: "The best way to take care of the future is to take care of the present moment.", author: "Thích Nhất Hạnh" },
  { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thích Nhất Hạnh" },
  { text: "The mind is like water. When it's agitated, it becomes difficult to see. When it's calm, everything becomes clear.", author: "Prasad Mahes" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
  { text: "The only way to live is by accepting each minute as an unrepeatable miracle.", author: "Tara Brach" },
  { text: "Meditation is not evasion; it is a serene encounter with reality.", author: "Thích Nhất Hạnh" },
  { text: "Your goal is not to battle with the mind, but to witness the mind.", author: "Swami Muktananda" },
  { text: "The things that matter most in our lives are not fantastic or grand. They are moments when we touch one another.", author: "Jack Kornfield" },
  { text: "Be where you are; otherwise you will miss your life.", author: "Buddha" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thích Nhất Hạnh" },
  { text: "Life is a dance. Mindfulness is witnessing that dance.", author: "Amit Ray" },
  { text: "The little things? The little moments? They aren't little.", author: "Jon Kabat-Zinn" },
  { text: "Paradise is not a place; it's a state of consciousness.", author: "Sri Chinmoy" },
  { text: "When we are mindful, deeply in touch with the present moment, our understanding of what is going on deepens.", author: "Thích Nhất Hạnh" },
  { text: "The art of living... is neither careless drifting on the one hand nor fearful clinging to the past on the other.", author: "Alan Watts" },
  { text: "Wherever you are, be there totally.", author: "Eckhart Tolle" },
  { text: "The way to live in the present is to remember that 'This too shall pass.'", author: "Unknown" },
  { text: "Nothing ever exists entirely alone; everything is in relation to everything else.", author: "Buddha" },
  { text: "If you want to conquer the anxiety of life, live in the moment, live in the breath.", author: "Amit Ray" },
  { text: "Mindfulness is a way of befriending ourselves and our experience.", author: "Jon Kabat-Zinn" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
];

export function getDailyQuote(date: Date): DailyQuote {
  // Use date to generate a consistent index for the day
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % QUOTES.length;
  return QUOTES[index];
}