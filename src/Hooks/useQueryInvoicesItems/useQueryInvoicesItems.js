import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { useSelector } from "react-redux";
import {INVOICE_STATUS } from "./../../Utils/Utils"

function useQueryInvoicesItems(paginationModel) {
    const auth  = useSelector(state=>state.user)
  
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
  
    useEffect(() => {
      const controller = new AbortController()
      const fetchData = async () => {
        try {
          const response = await API.post(`/${auth.type}/line-orders`, 
             {

              filter:[{type:"invoice_status" , value:INVOICE_STATUS.INVOICED }]
            },
            {
              params: {
                page: (paginationModel.page || 0) + 1,
                limit: (paginationModel.pageSize || obj.pageSize)
              },
              signal :controller.signal
            }
           
          );
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
          if (error.code === 'ERR_CANCELED') return
          if (error?.response?.status === 480) {
            navigate("/login");
          }
          setIsLoading(false);
        }
      };
  
      setIsLoading(true);
      fetchData();
      return ()=>{
        controller.abort()
      }
    }, [paginationModel]);
  
    return { isLoading, rows, pageInfo };
  }

  export default useQueryInvoicesItems