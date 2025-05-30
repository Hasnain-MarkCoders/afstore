import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

function useQueryTicketSystem(paginationModel, setIsPaginationLoading=()=>{}) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [rows, setRows] = React.useState([]);
  
    const [pageInfo, setPageInfo] = React.useState({
      page: 0,
      pageSize: 10,
      _id: [],
      po_number: [],
      po_ids:[],
      first_date: "",
      last_date: "",
      name: [],
      order_status: [],
      multiple_order_status: [],
      invoice_status: [],
      totalRowCount: 1,
      color: [],
      factory_color: [],
      remarks: "",
      admin_remarks: "",
      customer_note: "",
      factory_note: "",
      all_remarks: false,
      all_admin_remarks: false,
      all_customer_note: false,
      all_factory_note: false,
      tag_blue: [],
      tag_red: [],
      all_tag_blue: "",
      all_tag_red: "",
      all_tag:[]
    });
  
    const obj = {
      _id: pageInfo._id,
      page: pageInfo.po_number.length < 0 ? pageInfo.page : 0,
      limit: pageInfo.pageSize,
      po_number: pageInfo.po_number,
      first_date: pageInfo.first_date,
      last_date: pageInfo.last_date,
      name: pageInfo.name,
      invoice_status: pageInfo.invoice_status,
      color: pageInfo.color,
      factory_color: pageInfo.factory_color,
      admin_remarks: pageInfo.admin_remarks,
      remarks: pageInfo.remarks,
      customer_note: pageInfo.customer_note,
      factory_note: pageInfo.factory_note,
      order_status: pageInfo.order_status,
      multiple_order_status: pageInfo.multiple_order_status,
      all_remarks: pageInfo.remarks,
      all_admin_remarks: pageInfo.admin_remarks,
      all_customer_note: pageInfo.customer_note,
      all_factory_note: pageInfo.all_factory_note,
      tag_blue: pageInfo.tag_blue,
      tag_red: pageInfo.tag_red,
      all_tag_blue: pageInfo.all_tag_blue,
      all_tag_red: pageInfo.all_tag_red,
      all_tag:pageInfo.all_tag
    };
  
    //
    const filters = [];
    
  
    const savedItem = localStorage.getItem("savedId");
    if (savedItem !== null) {
      // console.log("Retrieved item:", savedItem);
    } else {
      // console.log('No item found for key "myKey"');
    }
  
       if (paginationModel.po_ids && paginationModel.po_ids?.length > 0) {
      filters.push({ type: "po_id", value: paginationModel.po_ids });
    }
    // console.log(paginationModel._id);
    // Check for active po_number filter
    if (paginationModel._id && paginationModel._id?.length > 0) {
      filters.push({ type: "_id", value: paginationModel._id });
    }
  
    // Check for active po_number filter
    if (paginationModel.po_number && paginationModel.po_number?.length > 0) {
      filters.push({ type: "po_number", value: paginationModel.po_number });
    }
  
    // Check for active order_status filter
    if (
      paginationModel.order_status?.length === 0 ||
      paginationModel.order_status === "all"
    ) {
      if (paginationModel.multiple_order_status?.length > 0) {
        filters.push({
          type: "order_status",
          value: paginationModel.multiple_order_status,
        });
      }
    } else if (paginationModel.order_status) {
      filters.push({ type: "order_status", value: paginationModel.order_status });
    }
  
    // Check for active color filters
    if (paginationModel.color && paginationModel.color?.length > 0) {
      filters.push({ type: "color", value: paginationModel.color });
    }
  
    // Check for active factory_color filters
    if (
      paginationModel.factory_color &&
      paginationModel.factory_color?.length > 0
    ) {
      filters.push({
        type: "factory_color",
        value: paginationModel.factory_color,
      });
    }
  
    // Check for active tag_red filters
    if (paginationModel.tag_red && paginationModel.tag_red?.length > 0) {
      filters.push({ type: "tag_red", value: paginationModel.tag_red });
    }
  
    // Check for active tag_red filters
    if (paginationModel.all_tag_red) {
      filters.push({ type: "all_tag_red", value: paginationModel.tag_red });
    }
  
    // Check for active tag_red filters
    if (paginationModel.all_tag_blue) {
      filters.push({ type: "all_tag_blue", value: paginationModel.all_tag_blue });
    }
  
    // Check for active tag_blue filters
    if (paginationModel.tag_blue && paginationModel.tag_blue?.length > 0) {
      filters.push({ type: "tag_blue", value: paginationModel.tag_blue });
    }
  
    if (paginationModel.all_tag) {
      filters.push({ type: "all_tag", value: paginationModel.all_tag });
    }
  
    // Check for active invoice_status filter
    if (
      paginationModel.invoice_status &&
      paginationModel.invoice_status?.length > 0
    ) {
      filters.push({
        type: "invoice_status",
        value: paginationModel.invoice_status || obj?.invoice_status,
      });
    }
  
    // Check for active name filters
    if (paginationModel.name && paginationModel.name?.length > 0) {
      filters.push({ type: "name", value: paginationModel.name });
    }
  
    // Check for active admin_remarks filters
    if (paginationModel.admin_remarks && paginationModel.admin_remarks !== "") {
      filters.push({
        type: "admin_remarks",
        value: [paginationModel.admin_remarks],
      });
    }
  
    // Check for active all_admin_remarks filters
    if (paginationModel.all_admin_remarks) {
      filters.push({
        type: "all_admin_remarks",
        value: paginationModel.all_admin_remarks,
      });
    }
  
    // Check for active remarks filters
    if (paginationModel.remarks && paginationModel.remarks !== "") {
      filters.push({ type: "remarks", value: [paginationModel.remarks] });
    }
  
    // Check for active all_remarks filters
    if (paginationModel.all_remarks) {
      filters.push({ type: "all_remarks", value: paginationModel.all_remarks });
    }
  
    // Check for active factory_note filters
    if (paginationModel.factory_note && paginationModel.factory_note !== "") {
      filters.push({
        type: "factory_note",
        value: [paginationModel.factory_note],
      });
    }
  
    // Check for active all_factory_note filters
    if (paginationModel.all_factory_note) {
      filters.push({
        type: "all_factory_note",
        value: paginationModel.all_factory_note,
      });
    }
  
    // Check for active customer_note filters
    if (paginationModel.customer_note && paginationModel.customer_note !== "") {
      filters.push({
        type: "customer_note",
        value: [paginationModel.customer_note],
      });
    }
  
    // Check for active all_customer_note filters
    if (paginationModel.all_customer_note) {
      filters.push({
        type: "all_customer_note",
        value: paginationModel.all_customer_note,
      });
    }
  
    // Check for active first date filters
    if (
      paginationModel.first_date &&
      paginationModel.first_date !== "" &&
      paginationModel.last_date === ""
    ) {
      filters.push({
        type: paginationModel.selectedDateType,
        value: {
          from: paginationModel.first_date,
        },
      });
    }
  
    // Check for active first date and last filters
    if (
      paginationModel.first_date !== "" &&
      paginationModel.last_date &&
      paginationModel.last_date !== ""
    ) {
      filters.push({
        type: paginationModel.selectedDateType,
        value: {
          from: paginationModel.first_date,
          to: paginationModel.last_date,
        },
      });
    }
    const auth = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
      const controller = new AbortController()
      const fetchData = async () => {
        try {
          
          const queryParams = {
            page: (paginationModel.page || obj.page) + 1,
            limit: paginationModel.pageSize || 10,
          };
  
          const requestBody = {
            filter: filters,
            // ...other properties you want to include in the request body...
          };
  
          const response = await API.post(
            `/${auth?.type}/line-orders`,
            requestBody,
            { params: queryParams , signal:controller.signal}
          );
          // console.log("main", response.data);
          const { pagination, lineOrders } = response.data;
  
          setIsLoading(false);
          setIsPaginationLoading(false)
          setRows(lineOrders || []);
          setPageInfo({
            ...obj,
            ...paginationModel,
            page: pagination.page - 1,
            pageSize: pagination.limit,
            totalRowCount: pagination.total,
            order_status: paginationModel.order_status || [],
            color: paginationModel.color || [],
            factory_color: paginationModel.factory_color || [],
            po_number: paginationModel.po_number || [],
            first_date: paginationModel.first_date || "",
            last_date: paginationModel.last_date || "",
            name: paginationModel.name || "",
            invoice_status: paginationModel.invoice_status || [],
            hasNextPage: pagination.hasNextPage,
          });
        } catch (error) {
          console.log(error);
          if (error?.response?.status === 480) {
            navigate("/login");
          }
          setIsLoading(false);
          setIsPaginationLoading(false)
        }
      };
      setIsPaginationLoading(true)
      setIsLoading(true);
      fetchData();
      return()=>{
        controller.abort()
      }
    }, [paginationModel]);
    return { isLoading, rows, pageInfo };
  }

  export default useQueryTicketSystem