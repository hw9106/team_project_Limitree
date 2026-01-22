import { useEffect, useMemo, useState, useCallback } from "react";
import * as reviewApi from "../api/reviewApi";
import { useUserContext } from "../context/UserContext";
import cogoToast from "cogo-toast";

export const useReview = (product) => {
  const productId = product?.id;

  const { loginUser } = useUserContext();
  const userId = loginUser?.userId;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  useEffect(() => {
    setRating(5);
    setContent("");
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await reviewApi.reviewListByProductAction(productId);
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
         setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const reviewCount = useMemo(() => reviews.length, [reviews]);

  const handleClickStar = useCallback((star) => {
    setRating(star);
  }, []);

  const handleChangeContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const addReview = useCallback(
    async (payload) => {
      if (!userId) {
        cogoToast.info("로그인해주세요.", { position: "bottom-left" });
        return null;
      }
      if (!productId) {
        cogoToast.error("상품 정보가 없습니다.", { position: "bottom-left" });
        return null;
      }
      if (!payload?.content || payload.content.trim() === "") {
        cogoToast.error("리뷰 내용을 입력해주세요.", { position: "bottom-left" });
        return null;
      }

      const newReview = {
        productId,
        rating: payload.rating,
        content: payload.content,
        createdAt: new Date().toISOString().slice(0, 10),
        userId,
        userName: loginUser?.name,
      };

      try {
        // ✅ 변경: 백엔드가 "reviewId(Long)"만 내려주니까 객체 가정 X
        const reviewId = await reviewApi.createReviewAction(productId, newReview); // ✅ 변경

        // ✅ 변경: 프론트 상태에 넣을 때 reviewId를 붙여서 넣기 (key 해결)
        const toInsert = {
          ...newReview,
          reviewId: reviewId ?? `tmp-${Date.now()}`, // ✅ 변경 (혹시 응답 없을 때 임시값)
        };

        setReviews((prev) => [...prev, toInsert]);
        cogoToast.success("리뷰가 등록되었습니다.", { position: "bottom-left" });

        return toInsert;
      } catch (e) {
        console.error("리뷰 등록 실패", e);
        cogoToast.error("리뷰 등록 실패", { position: "bottom-left" });
        return null;
      }
    },
    [userId, productId, loginUser?.name] // ✅ 변경: rating은 payload에서 받으니 deps에서 제거해도 됨
  );

  const handleSubmitReview = useCallback(
    async (e) => {
      e.preventDefault();

      const result = await addReview({ rating, content });
      if (result) {
        setRating(5);
        setContent("");
      }
    },
    [addReview, rating, content]
  );

  return {
    reviews,
    reviewCount,
    loading,
    rating,
    content,
    setRating,
    setContent,
    handleClickStar,
    handleChangeContent,
    handleSubmitReview,
  };
};
