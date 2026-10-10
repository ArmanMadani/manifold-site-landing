// Manifold mark: a 2×2 grid of tiles, each a black stepped parallelogram
// with a colored square in its upper-right notch. Geometry is lifted from
// the original 1024×1024 Illustrator export.
const W = 244.73;
const H = 256;
const X0 = 22.62;

const TILES = [
  { col: 0, row: 0, color: "#243370" },
  { col: 1, row: 0, color: "#3b86a4" },
  { col: 0, row: 1, color: "#eb9e2c" },
  { col: 1, row: 1, color: "#d8312a" },
];

export default function BrandMark({ className }) {
  return (
    <svg
      className={className}
      viewBox={`${X0} 0 ${4 * W} 1024`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {TILES.map(({ col, row, color }) => {
        const x = X0 + col * 2 * W;
        const y = row * 2 * H;
        return (
          <g key={`${col}-${row}`}>
            <polygon
              fill="#0c0d0b"
              points={`${x},${y + H} ${x + W},${y} ${x + W},${y + H} ${x + 2 * W},${y + H} ${x + W},${y + 2 * H} ${x},${y + 2 * H}`}
            />
            <rect fill={color} x={x + W} y={y} width={W} height={H} />
          </g>
        );
      })}
    </svg>
  );
}
