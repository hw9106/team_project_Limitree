const BACKEND_SERVER = "http://localhost:8080";

export const categoryTree = async () => {
    const response = await fetch(`${BACKEND_SERVER}/api/categories/tree`, {
        method: "GET",
        headers: {
            "Content-type" : "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("카테고리 조회 실패");
    }

    const data = await response.json();
    
    return data;
};