import styled from "styled-components";
import ImgIdModal from "./ImgIdModal";
import CommentModal from "./CommentModal";

export default function ClickedOnCommentSty({selectedPostId}) {
  return (
    <Container>
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

const Container = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 820px) {
    flex-direction: column;
  }
`;

/* Left and right panes always reserve space even if their child hides itself */
const LeftPane = styled.div`
  flex: 2 1 0%;
  min-width: 360px; /* reserves space on small/medium screens */
  box-sizing: border-box;
  display: flex;
  justify-content: center;
`;

const RightPane = styled.div`
  flex: 1 1 0%;
  min-width: 300px; /* reserves sidebar width */
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
`;

/* Inner wrapper holds the actual component. If the child returns null or sets display:none,
   this wrapper still keeps the layout space. */
const PaneInner = styled.div`
  width: 100%;
  display: block;
`;
