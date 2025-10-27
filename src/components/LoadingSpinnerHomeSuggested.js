import React from "react";
import styled, { keyframes } from "styled-components";

/* keyframes: one lash grows/brights up, others fade */
const lashPulse = keyframes`
  0%   { opacity: 0.2; transform: scaleY(0.6) translateY(var(--translate)); }
  50%  { opacity: 1;   transform: scaleY(1.2) translateY(var(--translate)); }
  100% { opacity: 0.2; transform: scaleY(0.6) translateY(var(--translate)); }
`;

/* ---------- layout ---------- */

/* Center relative to parent */
const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* spinner shell */
const SpinnerShell = styled.div`
  position: relative;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
`;

/* each lash around the circle */
const Lash = styled.div`
  --r: ${(p) => p.size / 2}px;
  --translate: calc(-1 * var(--r) + ${(p) => p.lashLength / 2}px);

  position: absolute;
  left: 50%;
  top: 50%;
  width: ${(p) => p.lashWidth}px;
  height: ${(p) => p.lashLength}px;
  margin-left: calc(${(p) => p.lashWidth}px * -0.5);
  background: ${(p) => p.color};
  border-radius: 999px;

  transform-origin: 50% 100%;
  transform: rotate(${(p) => p.angle}deg)
    translateY(calc(-1 * var(--r) + ${(p) => p.lashLength / 2}px));

  animation: ${lashPulse} ${(p) => p.speed}s linear infinite;
  animation-delay: ${(p) => p.delay}s;
`;

/* ---------- component ---------- */
export default function LoadingSpinnerHomeSuggested({
  size = 30,
  color = "#fff",
  lashWidth = 5,
  lashLength = 16,
  speed = 1.2,
  count = 12,
  label = "Loading...",
}) {
  const lashes = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i;
    const delay = (speed / count) * i;
    return { angle, delay };
  });

  return (
    <Wrapper role="status" aria-label={label}>
      <SpinnerShell size={size}>
        {lashes.map((lash, i) => (
          <Lash
            key={i}
            size={size}
            color={color}
            lashWidth={lashWidth}
            lashLength={lashLength}
            speed={speed}
            angle={lash.angle}
            delay={lash.delay}
          />
        ))}
      </SpinnerShell>
    </Wrapper>
  );
}
