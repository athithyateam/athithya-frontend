export const stringToColor = (str = "Athithya"): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = 30 + Math.abs(hash % 25);
  return `hsl(${h}, 70%, 55%)`;
};

export const stringToGradient = (str = "Athithya"): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = 35 + Math.abs(hash % 20);
  const h2 = h1 - 10;
  return `linear-gradient(135deg, hsl(${h1}, 80%, 60%) 0%, hsl(${h2}, 85%, 45%) 100%)`;
};
