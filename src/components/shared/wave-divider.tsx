type Props = { flip?: boolean; darkToLight?: boolean };

export function WaveDivider({ flip, darkToLight }: Props) {
  const fromColor = darkToLight ? "#302e2f" : "#f0eff0";
  const toColor = darkToLight ? "#f0eff0" : "#302e2f";

  return (
    <div
      className={`w-full overflow-hidden ${flip ? "rotate-180" : ""}`}
      style={{ marginTop: "-1px", marginBottom: "-1px" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1920 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <rect width="1920" height="100" fill={fromColor} />
        <path
          d="M0 60C320 20 640 90 960 50C1280 10 1600 80 1920 40V100H0V60Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
