import { useEffect, useState } from 'react';
import cogoToast from 'cogo-toast';
import { useUserContext } from '../context/UserContext';
import * as compareApi from '../api/compareApi';

export const useCompare = (initialCompare = []) => {
  const { loginUser } = useUserContext();
  const userId = loginUser?.userId;
  const [compareItems, setCompareItems] = useState(initialCompare);

  const addToCompare = async(product) => {
    
    if (!userId) {
      cogoToast.error('로그인이 필요합니다.',{position: 'bottom-left'});
      return;
    }
    
    if (compareItems.length>=4) {
      cogoToast.error('You can compare up to 4 items.',{position:'bottom-left'});
      return;
    }

    const exist = compareItems.find(item => item.id === product.id);
    if (exist) {
      cogoToast.info('Product already in compare', { position: 'bottom-left' });
      return;
    }

    // API 호출
    const sendData = {
      ...product,
      userId: userId,
      productId: product.id,
      compareItemId: null
    };
    console.log('전송할 데이터: ', sendData);
    const responseJsonObject = await compareApi.addToCompareAction(sendData);
    console.log("CompareAdd: ", responseJsonObject);

    // API 성공 시 compareItemId와 함께 state에 추가
    if (responseJsonObject.status === 1) {
      setCompareItems((prev) => [
        ...prev, 
        { ...product, compareItemId: responseJsonObject.data }
      ]);
      cogoToast.success('Added to compare', { position: 'bottom-left' });
    }
  };

//compare 목록 불러오기
useEffect(()=>{
  if (!userId) {
    setCompareItems([]);
    return;
  }
  const fetchCompare = async ()=>{
    const responseJsonObject = await compareApi.compareList(userId);
    console.log('Compare API Response:', responseJsonObject);
    if (responseJsonObject.status ===1) {
      const data = responseJsonObject.data;
      console.log('Compare data:', data);
      const normalized = data.map(item =>({
        ...item.productDto,
        compareItemId:item.compareItemId

      }));
      console.log('Normalized items:', normalized);
      setCompareItems(normalized);
    }
  };
  fetchCompare();
},[userId]);


  const deleteFromCompare = async(product) => {
    const productId = typeof product === 'object' ? product.id : product;
    console.log('추출된 productId: ',productId);

    // compareItemId 찾기 - 전달된 객체에서 직접 가져오거나 배열에서 찾기
    let compareId = null;
    if (typeof product === 'object' && product.compareItemId) {
      compareId = product.compareItemId;
    } else {
      const targetItem = compareItems.find(item => item.id === productId);
      console.log('targetItem:', targetItem);
      if(!targetItem){
        console.log('해당 상품을 찾을 수 없습니다.');
        return;
      }
      compareId = targetItem.compareItemId;
    }

    console.log("Delete CompareItemId: ",compareId);
    const responseJsonObject = await compareApi.compareDeleteCompareId(compareId);
    console.log("Delete response: ",responseJsonObject);

    if(responseJsonObject.status ===1){
      setCompareItems((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  

  const deleteAllFromCompare = async() => {
    await compareApi.compareDeleteByUserId(userId);
    setCompareItems([]);
    cogoToast.error('Compare list cleared', { position: 'bottom-left' });
  };

  return { compareItems, addToCompare, deleteFromCompare, deleteAllFromCompare };
};