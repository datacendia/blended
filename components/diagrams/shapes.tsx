import type { SVGProps } from "react";
import type { Shape } from "@/lib/diagrams/foot";

/** Draw one of the plain shapes the diagram data is written in. */
export function ShapeEl({ shape, ...props }: { shape: Shape } & SVGProps<SVGElement>) {
  const p = props as SVGProps<SVGEllipseElement & SVGRectElement & SVGPathElement>;
  if (shape.kind === "ellipse") return <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} {...p} />;
  if (shape.kind === "rect") return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={2} {...p} />;
  return <path d={shape.d} {...p} />;
}

/**
 * Labels sit on top of coloured areas and outlines; a surface-coloured stroke
 * behind each glyph keeps them readable in both schemes.
 */
export const HALO = { fill: "rgb(var(--ink))", stroke: "rgb(var(--surface))", strokeWidth: 2.5, paintOrder: "stroke", strokeLinejoin: "round" } as const;
