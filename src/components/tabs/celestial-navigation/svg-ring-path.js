/**
 * @param {object} d
 * @param {number} d.rMajor
 * @param {number} [d.rMinor]
 * @param {number} [d.gapCenterDeg]
 * @param {number} [d.gapDeg]
 * @param {number} [d.gapAngleDeg]
 */
export function svgRingPath(d) {
  if (!d.gapDeg) {
    const rMinorCircle = d.rMinor
      ? `m 0.2 ${d.rMajor - d.rMinor}
a ${d.rMinor} ${d.rMinor} 0 1 1 -0.2 0
z`
      : "";
    return `M -0.1, ${-d.rMajor}
a ${d.rMajor} ${d.rMajor} 0 1 0 0.2 0
z
${rMinorCircle}`;
  }
  const toRad = Math.PI / 180;
  const gapAngleDeg = d.gapAngleDeg === undefined ? d.gapDeg / 2 : d.gapAngleDeg;
  const edge0 = toRad * (d.gapCenterDeg + d.gapDeg / 2);
  const c0 = Math.cos(edge0), s0 = Math.sin(edge0);
  const edge1 = toRad * (d.gapCenterDeg - d.gapDeg / 2);
  const c1 = Math.cos(edge1), s1 = Math.sin(edge1);
  const x = d.rMajor / d.rMinor * Math.sin(toRad * (d.gapDeg / 2 - gapAngleDeg));
  const innerAngle = Math.asin(x) + toRad * gapAngleDeg;
  const edge2 = toRad * d.gapCenterDeg + innerAngle;
  const c2 = Math.cos(edge2), s2 = Math.sin(edge2);
  const edge3 = toRad * d.gapCenterDeg - innerAngle;
  const c3 = Math.cos(edge3), s3 = Math.sin(edge3);
  const big = d.gapDeg <= 180 ? 1 : 0;
  return `M ${c0 * d.rMajor - 1e-3 * s0} ${s0 * d.rMajor + 1e-3 * c0}
A ${d.rMajor} ${d.rMajor} 0 ${big} 1 ${c1 * d.rMajor + 1e-3 * s1} ${s1 * d.rMajor - 1e-3 * c1}
L ${c3 * d.rMinor + 1e-3 * s3} ${s3 * d.rMinor - 1e-3 * c3}
A ${d.rMinor} ${d.rMinor} 0 ${big} 0 ${c2 * d.rMinor - 1e-3 * s2} ${s2 * d.rMinor + 1e-3 * c2}
z`;
}
