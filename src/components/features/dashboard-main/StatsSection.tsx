"use client";

import { useCountAnimation } from "@/hooks/useCountAnimation";

interface Stat {
  targetValue: number;
  suffix: string;
  label: string;
  isDecimal?: boolean;
  decimalStr?: string;
}

const STATS: Stat[] = [
  {
    targetValue: 319,
    suffix: "%",
    label: "Target Reduksi Emisi 2030",
    isDecimal: true,
    decimalStr: "31,9%",
  },
  {
    targetValue: 5100,
    suffix: "+",
    label: "Komunitas Terdaftar di Jawa Timur",
  },
  {
    targetValue: 60,
    suffix: "%",
    label: "Peningkatan Engagement via Gamification",
  },
];

function StatItem({ stat, isLast }: { stat: Stat; isLast: boolean }) {
  const { value, ref } = useCountAnimation(stat.targetValue, 1800);

  const display = stat.isDecimal
    ? value < stat.targetValue
      ? `${(value / 10).toFixed(1).replace(".", ",")}%`
      : stat.decimalStr ?? `${stat.suffix}`
    : `${value.toLocaleString("id-ID")}${stat.suffix}`;

  return (
    <div
      ref={ref}
      className="flex flex-1 flex-col items-center px-8 py-4"
      style={
        !isLast
          ? { borderRight: "1px solid rgba(255,255,255,0.2)" }
          : undefined
      }
    >
      <span
        className="mb-2 font-extrabold leading-none"
        style={{ fontSize: "56px", color: "#7AC74F", fontFamily: "inherit" }}
      >
        {display}
      </span>
      <p
        className="text-center text-sm leading-relaxed"
        style={{ color: "rgba(255,255,255,0.7)", maxWidth: "160px" }}
      >
        {stat.label}
      </p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section
      className="w-full py-16"
      style={{ backgroundColor: "#2D5F3F" }}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center divide-y divide-white/20 sm:flex-row sm:divide-x sm:divide-y-0">
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} isLast={i === STATS.length - 1} />
        ))}
      </div>
    </section>
  );
}
