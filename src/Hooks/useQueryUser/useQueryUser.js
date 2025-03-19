import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import React, { useEffect } from "react";

function useQueryUser(paginationModel) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const navigate = useNavigate()
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await API.get(`/suadmin/users`, {
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
    }, [paginationModel]);
  
    return { isLoading, data };
  }

  export default useQueryUser