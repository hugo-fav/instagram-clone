import { X } from "lucide-react";
import styled from "styled-components";

const ModalBackground = styled.div`
  margin-bottom: 4rem;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  overflow-y: hidden;
`;

/* Constrained modal content so inner panes can scroll */
const ModalContent = styled.div`
  position: relative;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  width: min(980px, 96%);
  max-width: 980px;
  max-height: 90vh; 
  display: flex;
  flex-direction: row; 
  overflow: hidden; 
 
`;

/* inner scroll container for children: fills available height */
const ModalBody = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: row; 
  height: 100%;
  gap: 1rem;
  overflow: hidden; 
`;

/* close button positioned inside ModalContent */
const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: #fff;
  cursor: pointer;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
`;

export default function CommentandLikeModal({ children, onClose }) {
  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close">
          <X />
        </CloseButton>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalBackground>
  );
}
