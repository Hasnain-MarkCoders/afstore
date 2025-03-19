import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

function useQueryHoldOrdersTable(paginationModel) {
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [pageInfo, setPageInfo] = useState({
      page: 0,
      pageSize: 10
    });
  
    const obj = {
      page: pageInfo.page,
      limit: pageInfo.pageSize
    }
  
    const navigate = useNavigate()
    const auth = useSelector(
      state => state.user
    )
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const queryParams = {
            page: (paginationModel.page || 0) + 1,
            limit: paginationModel.pageSize || 10,
          };
  
          const requestBody = {
            filter: [{ type: "order_status", value: ["Hold"] }],
            // ...other properties you want to include in the request body...
          };
          const response = await API.post(`/${auth.type}/line-orders`, requestBody, { params: queryParams });
          const { pagination, lineOrders } = response.data;
  
          setIsLoading(false);
          setRows(lineOrders || []);
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
  
    return { isLoading, rows, pageInfo };
  }

  export default useQueryHoldOrdersTable