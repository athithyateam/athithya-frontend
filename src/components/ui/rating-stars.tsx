import { Star } from "lucide-react";

export interface RatingStarsProps {
  average?: number;
  count?: number;
}

export function RatingStars({ average = 0, count = 0 }: RatingStarsProps) {
  const rounded = Math.round(average * 2) / 2;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const diff = rounded - i;
    if (diff >= 1) return "full";
    if (diff === 0.5) return "half";
    return "empty";
  });

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-0.5">
        {stars.map((s, i) => (
          <Star
            key={i}
            size={15}
            className={
              s === "full" || s === "half"
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-neutral-700"
            }
          />
        ))}
      </div>
      {count > 0 ? (
        <>
          <span className="font-medium text-gray-800 dark:text-neutral-200">
            {Number(average).toFixed(1)}
          </span>
          <span className="text-gray-500 dark:text-neutral-400">({count})</span>
        </>
      ) : (
        <span className="text-xs text-gray-400">No ratings yet</span>
      )}
    </div>
  );
}
