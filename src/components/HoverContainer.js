"use client";
import styled from "styled-components";

/**
 * Reusable hover container component.
 * You can pass props to control:
 * - background (overlay color)
 * - gap (space between overlay children)
 * - radius (border radius)
 * - transition (fade speed)
 */
export default function HoverContainer({
  children,
  overlayContent,
  background = "rgba(0,0,0,0.45)",
  radius = "8px",
  gap = "1.2rem",
  transition = "160ms ease",
  ...rest
}) {
  return (
    <Wrapper $radius={radius} {...rest}>
      {children}
      <Overlay $background={background} $gap={gap} $transition={transition}>
        {overlayContent}
      </Overlay>
    </Wrapper>
  );
}

/* base wrapper */
const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ $radius }) => $radius};
  overflow: hidden;

  /* reveal overlay on hover */
  &:hover > div {
    opacity: 1;
  }
`;

/* overlay layer */
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ $gap }) => $gap};
  background: ${({ $background }) => $background};
  opacity: 0;
  transition: opacity ${({ $transition }) => $transition};
  pointer-events: none;
`;
