import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";


function useQueryPostService(paginationModel, refresh=false) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const navigate = useNavigate()
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await API.get(`/admin/get-post-services`, {
            params: paginationModel,
          });
         
          const users = response.data;
          setData(users);
          setIsLoading(false);
        } catch (error) {
          if (error?.response?.status === 480) {
            navigate("/login");
          }
          setIsLoading(false);
        }
      };
  
      setIsLoading(true);
      fetchData();
    }, [paginationModel,refresh]);
  
    return { isLoading, data };
  }

  export default useQueryPostService