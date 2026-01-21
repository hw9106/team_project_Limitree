import {authHeaders} from "./authHeader";

const BACKEND_SERVER='http://localhost:8080';


//wishlist 저장
export const wishlisttWriteAction = async (sendJsonObject)=>{
    const response= await fetch(`${BACKEND_SERVER}/wishlist`,{
        method:'POST',
        headers: authHeaders({
            'Content-type':'application/json'
        }),
        body:JSON.stringify(sendJsonObject)
    });
    
    return await response.json();
}



export const wishlisList=async(userId)=>{
	const response= await fetch(`${BACKEND_SERVER}/wishlist/${userId}`,
    {
        method:"GET",
        headers: authHeaders(),   
    });
	
	return await response.json();
}

export const wishlistDeleteWishlistId=async(wishlistId)=>{
	const response= await fetch(`${BACKEND_SERVER}/wishlist/${wishlistId}`,
    {
        method:"DELETE",
        headers: authHeaders(),
    });
    
	return await response.json();
}


export const wishlistDeleteUserId=async(userId)=>{
	const response= await fetch(`${BACKEND_SERVER}/wishlists/${userId}`,
    {
        method:"DELETE",
        headers: authHeaders(),
    });
    
	return await response.json();
}

