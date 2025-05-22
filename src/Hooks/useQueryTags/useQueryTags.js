import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
function useQueryTags(
endpoint="",
 redirect="", 
 paginationModel={
    page: 0, pageSize: 10
  }
) {
    const [isLoading, setIsLoading] =  useState(true);
    const [rows, setRows] = useState([]);
    const navigate = useNavigate()
  
    useEffect(() => {
      const controller = new AbortController()
      const fetchData = async () => {
        try {
          const response = await API.get(endpoint, {signal:controller.signal});
          setIsLoading(false);
          setRows(response.data || []); 
        } catch (error) {
          if (error?.response?.status === 480) {
            navigate(redirect);
          }
          setIsLoading(false);
        }
      };
  
      setIsLoading(true);
      fetchData();
      return()=>{
        controller.abort()
      }
    }, [paginationModel]);
  
    return { isLoading, rows };
  }

  export default useQueryTags