import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { useSelector } from "react-redux";


function useQueryPostService(paginationModel, refresh=false) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const navigate = useNavigate()
    const auth = useSelector(state=>state.user)
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await API.get(`/${auth.type}/get-post-services`, {
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