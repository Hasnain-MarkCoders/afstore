import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

function useQueryInvoices(paginationModel) {
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
      const fetchData = async () => {
        try {
          const response = await API.get(`/admin/invoice/get-invoice`, {
            params: {
              page: (paginationModel.page || 0) + 1,
              limit: (paginationModel.pageSize || obj.pageSize),
              po_number: (paginationModel.po_number || obj.po_number),
            },
          });
          const { pagination, invoices } = response.data;
  
          setIsLoading(false);
          setRows(invoices || []);
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

  export default useQueryInvoices