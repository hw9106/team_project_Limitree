import { useEffect, useState, useCallback } from 'react';
import cogoToast from 'cogo-toast';
import { useUserContext } from '../context/UserContext';
import * as wishlistApi from '../api/wishlistApi';

export const useWishlist = (initialWishlist = []) => {
  const { loginUser } = useUserContext();
  const userId = loginUser?.userId;

  const [wishlistItems, setWishlistItems] = useState(initialWishlist);

  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      setWishlistItems([]);
      return;
    }
    try {
      const responseJsonObject = await wishlistApi.wishlisList(userId);
      if (responseJsonObject?.status === 1) {
        const data = responseJsonObject.data ?? [];
        const normalized = data.map((item) => ({
          wishlistId: item.wishlistId,
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          discount: item.product.discount,
          stock: item.product.stock,
          image: item.product.image,
          variation: [],
          affiliateLink: null
        }));
        setWishlistItems(normalized);
      } else {
        setWishlistItems([]);
      }
    } catch (e) {
      setWishlistItems([]);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!userId) {
      cogoToast.error('로그인이 필요합니다.', { position: 'bottom-left' });
      return;
    }

    // ✅ 중복 체크는 "현재 wishlistItems"로 먼저 확정 (setState 안에서 flag 쓰지 않기)
    if (wishlistItems.some((x) => x.id === product.id)) {
      cogoToast.info('Product already in wishlist', { position: 'bottom-left' });
      return;
    }

    // ✅ UI 즉시 반영(임시 wishlistId=null)
    setWishlistItems((prev) => [...prev, { ...product, wishlistId: null }]);
    cogoToast.success('Added to wishlist', { position: 'bottom-left' });

    try {
      const sendData = { ...product, userId, id: product.id, wishlistId: null };
      const res = await wishlistApi.wishlisttWriteAction(sendData);

      if (res?.status === 1) {
        // ✅ 서버값으로 즉시 동기화해서 wishlistId 채우기
        await fetchWishlist();
      } else {
        // 실패 롤백
        setWishlistItems((prev) => prev.filter((x) => x.id !== product.id));
        cogoToast.error('위시리스트 저장 실패', { position: 'bottom-left' });
      }
    } catch (e) {
      setWishlistItems((prev) => prev.filter((x) => x.id !== product.id));
      cogoToast.error('위시리스트 저장 실패', { position: 'bottom-left' });
    }
  };

  const deleteFromWishlist = async (productId) => {
    // ✅ 여러 개 중복이 있을 수 있으니 "첫 번째 매칭"을 지움(정교하게 하고 싶으면 UI에서 wishlistId 넘기는 게 베스트)
    const target = wishlistItems.find((x) => x.id === productId);
    if (!target) return;

    // ✅ wishlistId 없으면 절대 state를 건드리지 말고 동기화부터
    if (!target.wishlistId) {
      cogoToast.info('동기화 중입니다. 잠시 후 다시 시도해주세요.', { position: 'bottom-left' });
      await fetchWishlist(); // 한번 동기화 시도
      return;
    }

    try {
      const res = await wishlistApi.wishlistDeleteWishlistId(target.wishlistId);

      // ✅ 삭제 성공일 때만 UI에서 제거 (401/실패면 같이 삭제되는 착시 방지)
      if (res?.status === 1) {
        setWishlistItems((prev) =>
          prev.filter((x) => x.wishlistId !== target.wishlistId)
        );
        cogoToast.error('Removed from wishlist', { position: 'bottom-left' });
      } else {
        cogoToast.error('삭제 실패', { position: 'bottom-left' });
      }
    } catch (e) {
      cogoToast.error('삭제 실패', { position: 'bottom-left' });
    }
  };

  const deleteAllFromWishlist = async () => {
    if (!userId) return;
    try {
      const res = await wishlistApi.wishlistDeleteUserId(userId);
      if (res?.status === 1) {
        setWishlistItems([]);
        cogoToast.error('Wishlist cleared', { position: 'bottom-left' });
      } else {
        cogoToast.error('전체 삭제 실패', { position: 'bottom-left' });
      }
    } catch (e) {
      cogoToast.error('전체 삭제 실패', { position: 'bottom-left' });
    }
  };

  return { wishlistItems, addToWishlist, deleteFromWishlist, deleteAllFromWishlist };
};
