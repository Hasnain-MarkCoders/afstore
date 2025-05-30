import React from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

function useQueryRawOrders(paginationModel) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [rows, setRows] = React.useState([]);
    const [pageInfo, setPageInfo] = React.useState({
      page: 0,
      pageSize: 5
    });
  
    const obj = {
      page: pageInfo.page,
      limit: pageInfo.pageSize
    }
  
    const navigate = useNavigate()
  
    React.useEffect(() => {
      const controller = new AbortController()
      const fetchData = async () => {
        try {
          const response = await API.get('/suadmin/orders', {
            params: {
              page: (paginationModel.page || 0) + 1,
              limit: (paginationModel.pageSize || obj.pageSize)
            },
            signal:controller.signal
          });
          const { pagination, orders } = response.data;
  
          setIsLoading(false);
          setRows(orders || []);
          setPageInfo({
            ...obj,
            ...paginationModel,
            page: pagination.page - 1,
            pageSize: pagination.limit,
            totalRowCount: pagination.total,
            hasNextPage: pagination.hasNextPage,
          });
        } catch (error) {
          if (error.code === 'ERR_CANCELED') return
          if (error?.response?.status === 480) {
            navigate("/login");
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
  
    return { isLoading, rows, pageInfo };
  }

  export default useQueryRawOrders