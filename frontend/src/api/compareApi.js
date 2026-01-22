const BACKEND_SERVER='http://localhost:8080';

/*
  Compared 등록
*/
export const addToCompareAction = async (sendJsonObject) => {
  const response = await fetch(`${BACKEND_SERVER}/compare/add`, {
    method: "POST",
    headers: {"Content-Type":"application/json",
              "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    credentials: 'include',
    body: JSON.stringify(sendJsonObject)
  });
  return await response.json();
  };


  /*
    Compared 리스트
  */
  export const compareList = async(userId)=>{
    const response = await fetch(`${BACKEND_SERVER}/compare/${userId}`,{
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      },
      credentials: 'include'
    });
    return await response.json();
  }

  /*
    Compared PK로 삭제
  */
  export const compareDeleteCompareId=async(compareId)=>{
	const response= await fetch(`${BACKEND_SERVER}/compare/delete/${compareId}`,
    {
        method:"DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials : 'include'
    });
    const responseJsonObject= await response.json();
	return responseJsonObject;
}

/*
  
*/
export const compareDeleteByUserId = async(userId)=>{
  const response = await fetch(`${BACKEND_SERVER}/compare/user/${userId}`,
    {
    method:"DELETE",
    headers : {
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    credentials : 'include'
});
const responseJsonObject = await response.json();
return responseJsonObject;
}

