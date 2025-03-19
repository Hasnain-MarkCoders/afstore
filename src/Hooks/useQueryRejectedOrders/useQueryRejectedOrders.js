import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";


function useQueryRejectedOrders(paginationModel) {
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [skusNames, setSkusNames] = useState([]);
    const [pageInfo, setPageInfo] = useState({
      page: 0,
      pageSize: 10
    });
  
    const obj = {
      page: pageInfo.page,
      limit: pageInfo.pageSize
    }
  
    const navigate = useNavigate()
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await API.get(`/customer/hold-rejected-orders`, {
            params: {
              page: (paginationModel.page || 0) + 1,
              limit: (paginationModel.pageSize || obj.pageSize),
              order_status: ["Rejected"],
            },
          });
          const { pagination, lineOrders, skus } = response.data;
  
          setIsLoading(false);
          setRows(lineOrders || []);
          setSkusNames(skus || []);
          setPageInfo({
            ...obj,
            ...paginationModel,
            page: pagination.page - 1,
            pageSize: pagination.limit,
            totalRowCount: pagination.total,
            hasNextPage: pagination.hasNextPage,
          });
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
  
    return { setIsLoading ,isLoading, rows, skusNames, pageInfo };
  }

  export default useQueryRejectedOrders