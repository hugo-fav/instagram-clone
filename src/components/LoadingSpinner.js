// src/components/LoadingSpinner.js
import React from "react";
import styled, { keyframes } from "styled-components";

/* ---------- keyframes ---------- */
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%   { transform: scale(1); opacity: 1; }
  50%  { transform: scale(1.3); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
`;

/* ---------- layout ---------- */
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* full-screen center */
`;

/* spinner container */
const SpinnerShell = styled.div`
  position: relative;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
`;

/* rotating ring */
const Ring = styled.div`
  box-sizing: border-box;
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: ${(p) => p.thickness}px solid ${(p) => p.color};
  border-top-color: transparent;
  animation: ${rotate} ${(p) => p.speed}s linear infinite;
`;

/* pulsing center dot */
const Dot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(p) => Math.max(6, Math.round(p.thickness * 1.2))}px;
  height: ${(p) => Math.max(6, Math.round(p.thickness * 1.2))}px;
  background: ${(p) => p.color};
  border-radius: 50%;
  animation: ${pulse} ${(p) => Math.max(0.7, p.speed * 0.75)}s ease-in-out
    infinite;
`;

/* ---------- component ---------- */
export default function LoadingSpinner({
  size = 70, // px
  color = "#3498db", // default: blue
  thickness = 6, // px
  speed = 1.4, // seconds per rotation
  label = "Loading...",
}) {
  return (
    <Wrapper role="status" aria-label={label}>
      <SpinnerShell size={size}>
        <Ring size={size} thickness={thickness} color={color} speed={speed} />
        <Dot size={size} thickness={thickness} color={color} speed={speed} />
      </SpinnerShell>
    </Wrapper>
  );
}
