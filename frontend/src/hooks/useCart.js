import { useEffect, useState } from 'react';
import cogoToast from 'cogo-toast';
import * as cartApi from '../api/cartApi';
import { useUserContext } from '../context/UserContext';

export const useCart = () => {
  const { loginUser } = useUserContext();
  const [cartItems, setCartItems] = useState([]);
  const userId = loginUser?.userId;

  // 카트 목록 불러오기
  useEffect(() => {
    if (!userId) {
      setCartItems([]);
      return;
    }
    const fetchCart = async () => {
      const responseJsonObject = await cartApi.cartList(userId);
      if (responseJsonObject.status === 1) {
        const data = responseJsonObject.data;
        /*
        const normalized = data.map(item => ({
          cartItemId: item.cartItemId,
          quantity: item.quantity,
          id: item.product.id,
          userId: item.userId,
          image: item.product.image,
          price: item.product.price,
          name: item.product.name,
          // ✅ 필드명 통일 (중요)
          selectedProductColor: item.selectedProductColor ?? null,
          selectedProductSize: item.selectedProductSize ?? null
        }));
        setCartItems(normalized);
        */

const normalized = Object.values(
  data.reduce((acc, item) => {
    const key = `${item.cartItemId}-${item.selectedProductColor ?? 'NO_COLOR'}-${item.selectedProductSize ?? 'NO_SIZE'}`;

    if (!acc[key]) {
      acc[key] = {
        cartItemId: item.cartItemId,
        quantity: item.quantity,
        id: item.product.id,
        userId: item.userId,
        image: item.product.image,
        price: item.product.price,
        name: item.product.name,
        selectedColor: item.selectedProductColor ?? null,
        selectedSize: item.selectedProductSize ?? null
      };
    } else {
      // ✅ 같은 키면 수량 합산
      acc[key].quantity += item.quantity;
    }

    return acc;
  }, {})
);

setCartItems(normalized);        


      }
    };
    fetchCart();
  }, [userId]);

  // 카트 항목 추가
  const addToCart = async (product) => {
    if (!userId) {
      setCartItems([]);
      cogoToast.info('로그인해주세요.', { position: 'bottom-left' });
      return;
    }

    let cartItemId = null;
          

const exist = cartItems.find(
  item =>
    item.id === product.id &&
    item.selectedColor === product.selectedProductColor &&
    item.selectedSize === product.selectedProductSize
);
    
 
    //const exist = cartItems.find(item => item.id === product.id);
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

    // 기존 상태 업데이트 코드 주석 처리
    /*
    setCartItems((prev) => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        cogoToast.info('Product already in cart', { position: 'bottom-left' });
        return prev.map(item =>
          item.cartItemId === exist.cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      cogoToast.success('Added to cart', { position: 'bottom-left' });
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          cartItemId: cartItemId,
        },
      ];
    });
    */

    // ✅ 수정됨: 상태 업데이트 시에도 선택 수량(product.quantity)만큼 증가
    setCartItems((prev) => {
      //const exist = prev.find(item => item.id === product.id);
      const exist = prev.find(item => item.id === product.id && item.selectedProductColor === product.selectedProductColor && item.selectedProductSize === product.selectedProductSize);
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

  const deleteFromCart = async (cartItemId) => {
    await cartApi.cartDeleteCartItemId(cartItemId);
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    cogoToast.error('Removed from cart', { position: 'bottom-left' });
  };

  const deleteAllFromCart = async () => {
    await cartApi.cartDeleteUserId(userId);
    setCartItems([]);
    cogoToast.error('Cart cleared', { position: 'bottom-left' });
  };

  return { cartItems, addToCart, decreaseCart, deleteFromCart, deleteAllFromCart };
  
};