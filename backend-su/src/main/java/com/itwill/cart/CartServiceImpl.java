package com.itwill.cart;

import java.util.ArrayList;
import java.util.List;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.Builder;

import com.itwill.cart.dto.CartDtoSingle;
import com.itwill.cart.entity.Cart;
import com.itwill.cart.repository.CartRepository;
import com.itwill.product.entity.Product;
import com.itwill.product.repository.ProductRepository;
import com.itwill.user.entity.User;
import com.itwill.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Builder
@Service
public class CartServiceImpl implements CartService{
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public String cartWriteSingle(CartDtoSingle cartDtoSingle) throws Exception {

      Cart cartEntity = Cart.toEntitySingle(cartDtoSingle);

      if (cartEntity.getCartItemId() == null || cartEntity.getCartItemId().isBlank()) {
          cartEntity.setCartItemId(UUID.randomUUID().toString());
      }
      System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!CartEntity.getQuantity    :::: " + cartEntity.getQuantity());
      Cart saved = cartRepository.save(cartEntity);
      return saved.getCartItemId();
   
    }
    

    @Override
    @Transactional
    public List <CartDtoSingle> cartList(User user) throws Exception {

      List <Cart> carts= cartRepository.findByUser(user);
      List <CartDtoSingle> cartDtoSingles = new  ArrayList<CartDtoSingle>();
      for (Cart cart : carts) {
        cartDtoSingles.add(CartDtoSingle.toDto(cart));
        System.out.println("베베 ############################# cartDtoSingle    -- " + cart.getSelectedProductColor() + "  -- " + cart.getSelectedProductSize() + "  ----- " + cart.getProduct().getName() + "  ----- " + cart.getProduct().getImage());
      }
      //CartDtoMulti cartDtoMulti = CartDtoMulti.toDtoMulti(carts);
      return cartDtoSingles;
    }

    @Override
    @Transactional
    public int cartDeleteCartItemId(String cartItemId) throws Exception {
        try {
            cartRepository.deleteByCartItemId(cartItemId);
            return 1; // 성공
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // 실패
        }
    }


    @Override
    @Transactional
    public int cartDeleteCartItemId(Cart cartEntity) throws Exception {
        try {
            //Cart cartEntity = Cart.toEntitySingle(cartDtoSingle);
Cart cartFromDb = cartRepository.findById(cartEntity.getCartItemId())
                    .orElseThrow(() -> new Exception("Cart item not found"));

cartRepository.delete(cartFromDb);
/* 
            User userEntity = userRepository.findById(cartEntity.getUser().getUserId())
                      .orElseThrow(() -> new Exception("User not found"));

            Product productEntity = productRepository.findById(cartEntity.getProduct().getId())
              .orElseThrow(() -> new Exception("Product not found"));     
            cartEntity.setUser(userEntity);
            cartEntity.setProduct(productEntity);                   
            cartRepository.deleteByCartItemId(cartEntity);
*/            
            return 1; // 성공
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // 실패
        }
    }

    @Override
    @Transactional
    public int cartDeleteUser(User user) throws Exception {
        try {
            cartRepository.deleteByUser(user);
            return 1; // 성공
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // 실패
        }
    }
}
