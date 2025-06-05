
import API from "../../api/api";
import { getUpdatedFilters } from "../../Utils/Utils";



export const filterFields = (props, boolRef) => {
    const { setPaginationModel, pageInfo } = props;
    return setPaginationModel({
        name: pageInfo.name || [],
        po: pageInfo.po || [],
        invoice_status: pageInfo.invoice_status || [],
        multiple_order_status: pageInfo.multiple_order_status || [],
        order_status: pageInfo.order_status || "",
        first_date: pageInfo.first_date || "",
        last_date: pageInfo.last_date || "",
        color: pageInfo.color || [],
        admin_remarks: pageInfo.admin_remarks || "",
        remarks: pageInfo.remarks || "",
        factory_note: pageInfo.factory_note || "",
        customer_note: pageInfo.customer_note || "",
        pageSize: pageInfo?.pageSize,
        page: pageInfo?.page,
        bool: boolRef.current,
        all_tag:props?.updatedData,

    });
};

// Function to export orders summary as Excel file
export const exportSummary = (props, setProgressSummary) => {
    setProgressSummary(true);
    API.get(`/admin/orders-summary`, {
        params: {
            from: props?.pageInfo?.first_date || "",
            to: props?.pageInfo?.last_date || "",
        },
    })
        .then((response) => {
            setProgressSummary(false);
            const path = response.data.path;
            if (response.status === 200) {
                window.location.href = path;
            }
        })
        .catch((error) => {
        });
};

// function to place orders on hold
export const placeOrderOnHold = (ids, props, auth, boolRef) => {
    API.post(`/${auth.type}/hold-orders`, {
        order_id: ids,
    }).then((response) => {
        filterFields(props, boolRef);
        boolRef.current = !boolRef.current;
    }).catch(error=>{
        alert(error?.response?.data?.message??error.message??"Error Placing Order on Hold!")

    })
};

// Function to place orders for selected rows
export const selectedWaybill = (id, props, boolRef) => {
    API.post(`/factory/place-order-to-yun-express`, {
        order_id: id,
    }).then((response) => {
        filterFields(props, boolRef);
        boolRef.current = !boolRef.current;
    }).catch(error=>{
        alert(error?.response?.data?.message??error.message??"Error Placing Order on Yun Express!")

    })
};
export const selectedLabel = (id, props, boolRef) => {
    API.post(`/factory/generate-label`, {
        order_ids: id,
    }).then((response) => {
        filterFields(props, boolRef);
        boolRef.current = !boolRef.current;
    }).catch(error=>{
        alert(error?.response?.data?.message??error.message??"Error Generating WayBIll!")
    })
};
export const seletedPlaceOrder = (id, props, boolRef) => {
    API.post(`/factory/place-order`, {
        order_ids: id,
    }).then((response) => {
        filterFields(props, boolRef);
        boolRef.current = !boolRef.current;
    }).catch(error=>{
        alert(error?.response?.data?.message??error.message??"Error Placing Order!")
    })
};

// Function to combineOrder for selected rows
export const combineOrder = (id, props, boolRef) => {
    API.post("/admin/combine-order", {
        order_ids: id,
    }).then((response) => {
        filterFields(props, boolRef);
        boolRef.current = !boolRef.current;
    }).catch(error=>{
        alert(error?.response?.data?.message??error.message??"Error Combining Order!")
    })
};


// Function to Generate Invoice for selected rows
export const selectedMarkAsInvoiced = async (id , props ,  checkboxValues , exportSheet,setloadingGen,boolRef ) => {
    const {pageInfo} = props;
    const filters = [];

    // Check for active po filter
    if (pageInfo.po && pageInfo.po?.length > 0) {
        filters.push({ type: "po", value: pageInfo.po });
    }

    // Check for active order_status filter
    if (pageInfo.order_status?.length === 0 || pageInfo.order_status === "all") {
        if (pageInfo.multiple_order_status?.length > 0) {
            filters.push({
                type: "order_status",
                value: pageInfo.multiple_order_status,
            });
        }
    } else if (pageInfo.order_status) {
        filters.push({ type: "order_status", value: pageInfo.order_status });
    }

    // Check for active color filters
    if (pageInfo.color && pageInfo.color?.length > 0) {
        filters.push({ type: "color", value: pageInfo.color });
    }

    // Check for active invoice_status filter
    if (pageInfo.invoice_status && pageInfo.invoice_status?.length > 0) {
        filters.push({
            type: "invoice_status",
            value: pageInfo.invoice_status || [],
        });
    }

    // Check for active name filters
    if (pageInfo.name && pageInfo.name?.length > 0) {
        filters.push({ type: "name", value: pageInfo.name });
    }

    // Check for active admin_remarks filters
    if (pageInfo.admin_remarks && pageInfo.admin_remarks !== "") {
        filters.push({ type: "admin_remarks", value: [pageInfo.admin_remarks] });
    }

    // Check for active all_admin_remarks filters
    if (pageInfo.all_admin_remarks) {
        filters.push({ type: "all_admin_remarks", value: [pageInfo.all_admin_remarks] });
    }

    // Check for active remarks filters
    if (pageInfo.remarks && pageInfo.remarks !== "") {
        filters.push({ type: "remarks", value: [pageInfo.remarks] });
    }

    // Check for active all_remarks filters
    if (pageInfo.all_remarks) {
        filters.push({ type: "all_remarks", value: [pageInfo.all_remarks] });
    }

    // Check for active factory_note filters
    if (pageInfo.factory_note && pageInfo.factory_note !== "") {
        filters.push({ type: "factory_note", value: [pageInfo.factory_note] });
    }

    // Check for active all_factory_note filters
    if (pageInfo.all_factory_note) {
        filters.push({ type: "all_factory_note", value: [pageInfo.all_factory_note] });
    }

    // Check for active customer_note filters
    if (pageInfo.customer_note && pageInfo.customer_note !== "") {
        filters.push({ type: "customer_note", value: [pageInfo.customer_note] });
    }

    // Check for active all_customer_note filters
    if (pageInfo.all_customer_note) {
        filters.push({ type: "all_customer_note", value: [pageInfo.all_customer_note] });
    }

    // Check for active first date filters
    if (
        pageInfo.first_date &&
        pageInfo.first_date !== "" &&
        pageInfo.last_date === ""
    ) {
        filters.push({
            type: "date",
            value: {
                from: pageInfo.first_date,
            },
        });
    }

    // Check for active first date and last filters
    if (
        pageInfo.first_date !== "" &&
        pageInfo.last_date &&
        pageInfo.last_date !== ""
    ) {
        filters.push({
            type: "date",
            value: {
                from: pageInfo.first_date,
                to: pageInfo.last_date,
            },
        });
    }

    // Check for active po filter
    if (id.length > 0) {
        filters.push({ type: "order_ids", value: id });
    }

    function downloadURI(uri) {
        const name = uri.split("downloads/")[1];
        var link = document.createElement("a");
    
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // delete link;
      }
      const cleanedFilters = getUpdatedFilters(filters)
    const requestBody = {
        filter: cleanedFilters,
        columns: checkboxValues,
        exportType: exportSheet,
        // ...other properties you want to include in the request body...
    };

    setloadingGen(true);
    try {
        const response = await API.post(`/admin/invoice/invoiced`, requestBody);
        if (response.status === 200) {
            // props.pageInfo.invoice_status !== "Ready To Invoice" && setGenerateInvoiceModal(false)
            window.open(response?.data?.invoice_pdf, "_blank");
            downloadURI(response?.data?.items_sheet);
        }
    } catch (error) {
    } finally {
        setloadingGen(false);
        filterFields(props, boolRef);
        boolRef.current = !boolRef.current;
    }
};