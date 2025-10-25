"use client";
import styled from "styled-components";
import ImgIdModal from "./ImgIdModal";
import CommentModal from "./CommentModal";

export default function ClickedOnCommentSty({ selectedPostId }) {
  return (
    <Container role="dialog" aria-modal="true">
      <LeftPane>
        <PaneInner>
          <ImgIdModal imgId={selectedPostId} />
        </PaneInner>
      </LeftPane>

      <RightPane>
        <PaneInner>
          <CommentModal imgId={selectedPostId} />
        </PaneInner>
      </RightPane>
    </Container>
  );
}

/* Layout */
const Container = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  height: 84vh;
  max-height: 100vh;
  /* gap: 1rem; */
  padding: 1rem;

  @media (max-width: 820px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftPane = styled.div`
  flex: 2 1 0%;
  min-width: 320px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  /* border-radius: 12px; */
  overflow: hidden;
`;

const RightPane = styled.div`
  flex: 1 1 0%;
  min-width: 300px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #0f2730;
  border-radius: 0 12px 12px 0;
  overflow: hidden;

  @media (max-width: 820px) {
    border-radius: 0 0 12px 12px;
  }
`;

const PaneInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;
