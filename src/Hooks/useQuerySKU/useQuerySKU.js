import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { useSelector } from "react-redux";



function useQuerySKU(paginationModel) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [rows, setRows] = React.useState([]);
    const [pageInfo, setPageInfo] = React.useState({
      page: 0,
      pageSize: 10,
      name: [],
    });
  
    const obj = {
      page: pageInfo.page,
      limit: pageInfo.pageSize,
      name: pageInfo.name,
    }
  
    const auth = useSelector(
      state => state.user
    )
    const navigate = useNavigate()
  
    React.useEffect(() => {
      const controller = new AbortController()
      const fetchData = async () => {
        try {
          const response = await API.get(`/${auth?.type}/sku/get`, {
            params: {
              page: (paginationModel.page || 0) + 1,
              limit: (paginationModel.pageSize || obj.pageSize),
              name: [(paginationModel.name || obj.name)],
            },
            signal:controller.signal
          });
          const { pagination, skus } = response.data;
  
          setIsLoading(false);
          setRows(skus || []);
          setPageInfo({
            ...obj,
            ...paginationModel,
            page: pagination.page - 1,
            pageSize: pagination.limit,
            totalRowCount: pagination.total,
            name: paginationModel.name,
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

  export default useQuerySKU