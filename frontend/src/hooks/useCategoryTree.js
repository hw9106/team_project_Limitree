import { useEffect, useState } from "react";
import * as categoryApi from "../api/categoryApi";

const useCategoryTree = () => {
  const [categoryTree, setCategoryTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryTree = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await categoryApi.categoryTree();

        if (isMounted) {
        setCategoryTree(data);
        }

      } catch(err) {
        console.error(err);

        if(isMounted) setError(err);

      } finally {
        if(isMounted) setLoading(false);
      }
    };

    fetchCategoryTree();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categoryTree, loading, error };
};

export default useCategoryTree;
