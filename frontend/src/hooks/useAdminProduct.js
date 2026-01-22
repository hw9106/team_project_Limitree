import { useState } from 'react';
import cogoToast from 'cogo-toast';
import * as cartApi from '../api/cartApi';
import { useUserContext } from '../context/UserContext';

export const useCart = () => {
  const { loginUser } = useUserContext();
  const [cartItems, setCartItems] = useState([]);
  const userId = loginUser?.userId;



  // 카트 항목 추가
  const addToCart = async (product) => {
    if (!userId) {
      setCartItems([]);
      cogoToast.info('로그인해주세요.', { position: 'bottom-left' });
      return;
    }

    let cartItemId = null;
    const exist = cartItems.find(item => item.id === product.id);

    if (exist) {
      // START 기존 항목 수량 변경
      for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === product.id) {
          const sendData = {
            ...cartItems[i],
            // ✅ 수정됨: 기존 수량 + 선택한 수량(product.quantity)로 변경
            quantity: (cartItems[i].quantity ?? 0) + (product.quantity ?? 1),
            cartItemId: cartItems[i].cartItemId,
            userId,
            id: product.id
          };
          cartItemId = cartItems[i].cartItemId;

          // ✅ 수정됨: product 객체에도 선택 수량 반영
          product.quantity = product.quantity ?? 1;

          console.log("헤이 sendData :: ", sendData);
          await cartApi.cartModifyCartItem(sendData);
          break;
        }
      }
      // END 기존 항목 수량 변경
    } else {
      // START 신규 등록
      const sendData = {
        ...product,
        id: product.id,
        userId,
        // ✅ 수정됨: 신규 등록 시에도 선택 수량 사용
        quantity: product.quantity ?? 1
      };
      console.log("헤이 sendData :: ", sendData);
      const responseJsonObject = await cartApi.cartWriteAction(sendData);
      cartItemId = responseJsonObject.data;
      product.cartItemId = cartItemId;
      // END 신규 등록
    }


    // ✅ 수정됨: 상태 업데이트 시에도 선택 수량(product.quantity)만큼 증가
    setCartItems((prev) => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        return prev.map(item =>
          item.cartItemId === exist.cartItemId
            ? { ...item, quantity: item.quantity + (product.quantity ?? 1) }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          quantity: product.quantity ?? 1,
          cartItemId: cartItemId,
        },
      ];
    });

    cogoToast.success('Added to cart', { position: 'bottom-left' });
  };

  const decreaseCart = async (cartItemId) => {
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].cartItemId === cartItemId) {
        const sendData = {
          ...cartItems[i],
          quantity: cartItems[i].quantity - 1
        };
        if (sendData.quantity <= 0) {
          await cartApi.cartDeleteCartItemId(cartItemId);
          return;
        } else {
          await cartApi.cartModifyCartItem(sendData);
        }
        break;
      }
    }

    setCartItems(prev =>
      prev
        .map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const deleteFromAdminProduct = async (id) => {
    alert("여기까지 오니?????");
    /*
    await cartApi.cartDeleteCartItemId(id);
    setCartItems(prev => prev.filter(item => item.id !== id));
    cogoToast.error('Removed from cart', { position: 'bottom-left' });
    */
  };

  const deleteAllFromCart = async () => {
    await cartApi.cartDeleteUserId(userId);
    setCartItems([]);
    cogoToast.error('Cart cleared', { position: 'bottom-left' });
  };

  return { cartItems, addToCart, decreaseCart, deleteFromAdminProduct, deleteAllFromCart };
};
