import { useCallback, useState } from "react";

export default function OpenCommentWhenImgClicked() {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const handleOpenComments = useCallback((postId) => {
    setSelectedPostId(postId);
    setShowCommentModal(true);
  }, []);

  const handleCloseComments = useCallback(() => {
    setSelectedPostId(null);
    setShowCommentModal(false);
  }, []);

  return {
    handleOpenComments,
    handleCloseComments,
    showCommentModal,
    selectedPostId,
  };
}
