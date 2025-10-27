import { X } from "lucide-react";
import styled from "styled-components";

const ModalBackground = styled.div`
  position: fixed;
  /* top: 0;
  left: 0;
  right: 0;
  bottom: 0; */
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  /* position: relative; */
  /* background: #222; */
  padding: 2rem;
  border-radius: 12px;
  min-width: 350px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;

  &:hover {
    color: #e63946;
  }
`;

export default function CommentandLikeModal({ children, onClose }) {
  return (
    <ModalBackground>
      <CloseButton onClick={onClose}>
        <X />
      </CloseButton>
      <ModalContent>{children}</ModalContent>
    </ModalBackground>
  );
}
