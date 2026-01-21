package com.itwill.wishlist;

import java.util.ArrayList;
import java.util.List;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.Builder;

import com.itwill.product.repository.ProductRepository;
import com.itwill.user.entity.User;
import com.itwill.user.repository.UserRepository;
import com.itwill.wishlist.dto.WishlistDto;
import com.itwill.wishlist.entity.Wishlist;
import com.itwill.wishlist.repository.WishlistRepository;

import jakarta.transaction.Transactional;

@Builder
@Service
public class WishlistServiceImpl implements WishlistService{
    @Autowired
    private WishlistRepository wishlistRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public Long wishlistWrite(WishlistDto wishlistDto) throws Exception {
        wishlistDto.setWishlistId(null); // 신규 생성이므로 ID를 null로 설정
        Wishlist wishlistEntity = Wishlist.toEntity(wishlistDto);

        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!wishlistDto.getWishlistId    :::: " + wishlistDto.getWishlistId() + " :: " + wishlistDto.getProduct());
        Wishlist saved = wishlistRepository.save(wishlistEntity);
        return saved.getWishlistId();
   
    }
    

    @Override
    @Transactional
    public List <WishlistDto> wishlistList(User user) throws Exception {

      List <Wishlist> wishlistEntitys= wishlistRepository.findByUser(user);
      List <WishlistDto> wishlistDtoList = new  ArrayList<WishlistDto>();
      for (Wishlist wishlist : wishlistEntitys) {
        wishlistDtoList.add(WishlistDto.toDto(wishlist));
      }
      //CartDtoMulti cartDtoMulti = CartDtoMulti.toDtoMulti(carts);
      return wishlistDtoList;
    }




    @Override
    @Transactional
    public int wishlistDeleteWishlistId(Wishlist wishlist) throws Exception {
        try {

            Wishlist wishlistFromDb = wishlistRepository.findById(wishlist.getWishlistId())
                                .orElseThrow(() -> new Exception("Wishlist item not found"));

            wishlistRepository.delete(wishlistFromDb);
          
            return 1; // 성공
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // 실패
        }
    }
 
    @Override
    @Transactional
    public int wishlistDeleteUser(User user) throws Exception {
        try {
            wishlistRepository.deleteByUser(user);
            return 1; // 성공
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // 실패
        }
    }
      
}
