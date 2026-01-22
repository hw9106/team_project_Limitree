import { authHeaders } from "./authHeader";
const BACKEND_SERVER='http://localhost:8080';

/* 
  상품 리스트
*/
export const productListAction = async () => {
  const response = await fetch(`${BACKEND_SERVER}/product/list`, {
    method: "GET"

  });
  
  return await response.json();
};

/*
  상품 등록
*/
export const addProduct = async (sendJsonObject) => {
  const response = await fetch(`${BACKEND_SERVER}/product/create`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(sendJsonObject)
  });
  return await response.json();
  };

/*
  상품 수정 (수정하고 싶은것만 보낼수 있는지 테스트 해보기!)
*/
export const updateProduct = async(productId,sendJsonObject)=>{
  const response = await fetch(`${BACKEND_SERVER}/product/update/${productId}`,{
    method:"PUT",
    headers:{"Content-Type":"application/json",
              "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    credentials: 'include',
    body:JSON.stringify(sendJsonObject)
  });
  return await response.json();
};

/*
  상품 PK로 삭제
*/
export const deleteProductById=async(productId)=>{
  const response= await fetch(`${BACKEND_SERVER}/product/delete/${productId}`,
    {
        method:"DELETE",
        headers: {
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    credentials: 'include'
    });
    const responseJsonObject= await response.json();
  return responseJsonObject;
  }
  /*
    상품 전체삭제
  */
  export const deleteAll = async()=>{
  const response = await fetch(`${BACKEND_SERVER}/admin/product/deleteAll`,{
    method:"DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    credentials: 'include'
  });
  return await response.json();
}
 
 /*
  상품 ID로 조회
 */
export const findProductById = async(productId)=>{
  const response =  await fetch(`${BACKEND_SERVER}/product/${productId}`,{
    method:"GET",
     headers: authHeaders(),
  });
  return await response.json();
}




