import { useEffect, useState } from "react"
import * as productApi from "../api/productApi";

export const useProducts = ()=>{

    const [products, setProducts] = useState([]);
    

      useEffect(() => {
        (async()=>{
            const productData = await productApi.productListAction();
            setProducts(productData.data);
        })()
    }, []);
    
    return {products,setProducts};









    
}