const SUBMITTED = "submitted";
const ACCEPTED = "accepted";
const IN_PRODUCTION = "in_production";
const SHIPPED_OUT = "shipped_out";
const HOLD = "hold";
const CANCELLED = "cancelled";
const REJECTED = "rejected";
const FTYREJECTED = "fty_rejected";
const PENDING = "pending"

const NOT_INVOICED = "not_invoiced";
const READY_TO_INVOICE = "ready_to_invoice";
const INVOICED = "invoiced";

const PAID = "paid";
const NOT_PAID = "not_paid";




export const ORDER_STATUS = {
  SUBMITTED,
  ACCEPTED,
  IN_PRODUCTION,
  SHIPPED_OUT,
  HOLD,
  CANCELLED,
  REJECTED,
  FTYREJECTED,
  PENDING,
}


export const INVOICE_STATUS = {
 NOT_INVOICED,
 READY_TO_INVOICE,
 INVOICED
}


export const PAYMENT_STATUS = {
 PAID,
 NOT_PAID 
}

export const editFieldConfigs = [
    { label: "Po Number", valueKey: "po", type: "text", disabled: true },
    { label: "Po Id", valueKey: "po_id", type: "text", disabled: true },
    { label: "Shipping Address", valueKey: "shipping_address", type: "text" },
    { label: "Name", valueKey: "name", type: "text" },
    { label: "Shipping Name", valueKey: "shipping_name", type: "text" },
    { label: "Zip Code", valueKey: "zip", type: "text" },
    { label: "Quantity", valueKey: "quantity", type: "text" },
    { label: "Email", valueKey: "email", type: "email" },
    { label: "Phone", valueKey: "phone", type: "phone" },
    { label: "Tracking", valueKey: "tracking_number", type: "text" },
    { label: "Size", valueKey: "size", type: "text" },
    { label: "Post Service", valueKey: "post_service", type: "text" },
    { label: "Customer Price", valueKey: "customer_price", type: "text" },
    { label: "Factory Price", valueKey: "factory_price", type: "text" },
    { label: "Factory Price USD", valueKey: "factory_price_usd", type: "text" },
    { label: "Shipment Customer Price", valueKey: "shipment_customer_price", type: "text" },
    { label: "Province", valueKey: "province", type: "text" },
    { label: "City", valueKey: "city", type: "text" },
    { label: "Country", valueKey: "country", type: "text" },
    { label: "Order Status", valueKey: "order_status", type: "select",
       options: [
        ORDER_STATUS.SUBMITTED,
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.IN_PRODUCTION,
        ORDER_STATUS.SHIPPED_OUT,
        ORDER_STATUS.HOLD,
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.CANCELLED,
    ]
     },
    { label: "Invoice Status", valueKey: "invoice_status", type: "select",
       options: [
        INVOICE_STATUS.NOT_INVOICED,
        INVOICE_STATUS.READY_TO_INVOICE,
        INVOICE_STATUS.INVOICED,      

       ] },
    { label: "Payment Status", valueKey: "payment_status", 
      type: "select", 
      options:[
      PAYMENT_STATUS.NOT_PAID,
      PAYMENT_STATUS.PAID
    ] 
  },
    { label: "Remarks", valueKey: "remarks", type: "text" },
    { label: "Admin Remarks", valueKey: "admin_remarks", type: "text" },
    { label: "Customer Note", valueKey: "customer_note", type: "text" },
    { label: "Factory Note", valueKey: "factory_note", type: "text" },
    { label: "Shipping Label", valueKey: "shipping_label", type: "text" }
  ];
  
  export const editNonHoldFieldConfigs = [
    { label: "Po Number", valueKey: "po", type: "text", disabled: true },
    { label: "Po Id", valueKey: "po_id", type: "text", disabled: true },
    { label: "Shipping Address", valueKey: "shipping_address", type: "text", disabled: true },
    { label: "Name", valueKey: "name", type: "text", disabled: true },
    { label: "Shipping Name", valueKey: "shipping_name", type: "text", disabled: true },
    { label: "Zip Code", valueKey: "zip", type: "text", disabled: true },
    { label: "Quantity", valueKey: "quantity", type: "text", disabled: true },
    { label: "Email", valueKey: "email", type: "email", disabled: true },
    { label: "Phone", valueKey: "phone", type: "phone", disabled: true },
    { label: "Tracking", valueKey: "tracking_number", type: "text" },
    { label: "Size", valueKey: "size", type: "text", disabled: true },
    { label: "Post Service", valueKey: "post_service", type: "text", disabled: true },
    { label: "Customer Price", valueKey: "customer_price", type: "text", disabled: true },
    { label: "Factory Price", valueKey: "factory_price", type: "text", disabled: true },
    { label: "Factory Price USD", valueKey: "factory_price_usd", type: "text", disabled: true },
    { label: "Shipment Customer Price", valueKey: "shipment_customer_price", type: "text", disabled: true },
    { label: "Province", valueKey: "province", type: "text", disabled: true },
    { label: "City", valueKey: "city", type: "text",disabled: true },
    { label: "Country", valueKey: "country", type: "text", disabled: true },
    { label: "Order Status", valueKey: "order_status", type: "select",
       options: [
        ORDER_STATUS.SUBMITTED,
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.IN_PRODUCTION,
        ORDER_STATUS.SHIPPED_OUT,
        ORDER_STATUS.HOLD,
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.CANCELLED,
      ], disabled: true },
    { label: "Invoice Status", valueKey: "invoice_status", type: "select", options: [
      INVOICE_STATUS.NOT_INVOICED,
        INVOICE_STATUS.READY_TO_INVOICE,
        INVOICE_STATUS.INVOICED,   
    
    ], disabled: true },
    { label: "Payment Status", valueKey: "payment_status", 
      
      type: "select", 
      options:[
      PAYMENT_STATUS.NOT_PAID,
      PAYMENT_STATUS.PAID
    ] ,
      
      disabled: true },
    { label: "Remarks", valueKey: "remarks", type: "text", disabled: true },
    { label: "Admin Remarks", valueKey: "admin_remarks", type: "text", disabled: true },
    { label: "Customer Note", valueKey: "customer_note", type: "text", disabled: true },
    { label: "Factory Note", valueKey: "factory_note", type: "text", disabled: true },
    { label: "Shipping Label", valueKey: "shipping_label", type: "text", disabled: true }
  ];
  
  export const editCustomerFieldsConfigs = [
    { label: "Shipping Name", valueKey: "shipping_name", type: "text" },
    { label: "Shipping Address", valueKey: "shipping_address", type: "text" },
    { label: "City", valueKey: "city", type: "text" },
    { label: "Province", valueKey: "province", type: "text" },
    { label: "Zip Code", valueKey: "zip", type: "text" },
    { label: "Email", valueKey: "email", type: "email" },
    { label: "Phone", valueKey: "phone", type: "phone" },
  ]
  

  export const filterFields=(pageInfo={}, setPaginationModel=()=>{}, boolRef=false, pageSizeCustomLimit=0)=> {
    return setPaginationModel({
      name: pageInfo?.name || [],
      po: pageInfo?.po || [],
      invoice_status: pageInfo?.invoice_status || [],
      multiple_order_status: pageInfo?.multiple_order_status || [],
      order_status: pageInfo?.order_status || '',
      first_date: pageInfo?.first_date || "",
      last_date: pageInfo?.last_date || "",
      seletedDateType: pageInfo?.seletedDateType || "",
      color: pageInfo?.color || [],
      admin_remarks: pageInfo?.admin_remarks || "",
      all_admin_remarks: pageInfo?.all_admin_remarks || "",
      remarks: pageInfo?.remarks || "",
      all_remarks: pageInfo?.all_remarks || "",
      factory_note: pageInfo?.factory_note || "",
      customer_note: pageInfo?.customer_note || "",
      pageSize: pageInfo?.pageSize + pageSizeCustomLimit,
      page: pageInfo?.page,
      all_customer_note: pageInfo?.all_customer_note || "",
      all_factory_note:pageInfo?.all_factory_note || "",
      all_tag_red: pageInfo?.all_tag_red || "",
      all_tag_blue: pageInfo?.all_tag_blue || "",
      tag_red: pageInfo?.tag_red || [],
      tag_blue: pageInfo?.tag_blue || [],
      all_tag:pageInfo?.all_tag || "",
      bool: boolRef?.current,
    })
  }

export const tabsFilterFields = (props, boolRef) => {
  const { setPaginationModel, pageInfo } = props;
  return setPaginationModel({
    name: pageInfo.name || [],
    po: pageInfo.po || [],
    invoice_status: pageInfo.invoice_status || [],
    multiple_order_status: pageInfo.multiple_order_status || [],
    order_status: pageInfo.order_status || "",
    first_date: pageInfo.first_date || "",
    last_date: pageInfo.last_date || "",
    seletedDateType: pageInfo.seletedDateType || "",
    color: pageInfo.color || [],
    admin_remarks: pageInfo.admin_remarks || "",
    all_admin_remarks: pageInfo.all_admin_remarks || "",
    remarks: pageInfo.remarks || "",
    all_remarks: pageInfo.all_remarks || "",
    factory_note: pageInfo.factory_note || "",
    customer_note: pageInfo.customer_note || "",
    pageSize: pageInfo?.pageSize,
    page: pageInfo?.page,
    tag_blue:pageInfo?.tag_blue || [],
    tag_red:pageInfo?.tag_red || [],
    all_tag_blue:pageInfo?.all_tag_blue || "",
    all_tag_red:pageInfo?.all_tag_red || "",
    bool: boolRef.current,
  });
};



  export const formattedDateTime = (date) => {
    const dateTime = new Date(date);
    const formattedDate = dateTime?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    const timeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedTime = dateTime?.toLocaleTimeString(undefined, timeFormatOptions);

    const formatted = `${formattedDate} ${formattedTime}`;
    return formatted;
  };


  export const chatData = [
    { name: "January", Total: 1200 },
    { name: "February", Total: 2100 },
    { name: "March", Total: 800 },
    { name: "April", Total: 1600 },
    { name: "May", Total: 900 },
    { name: "June", Total: 1700 },
  ];

  

  export const TicketListEditFieldConfigs = [
    { label: "Po Number", valueKey: "po", type: "text", disabled: true },
    { label: "Po Id", valueKey: "po_id", type: "text", disabled: true },
    { label: "Shipping Address", valueKey: "shipping_address", type: "text" },
    { label: "Name", valueKey: "name", type: "text" },
    { label: "Shipping Name", valueKey: "shipping_name", type: "text" },
    { label: "Zip Code", valueKey: "zip", type: "text" },
    { label: "Quantity", valueKey: "quantity", type: "text" },
    { label: "Email", valueKey: "email", type: "email" },
    { label: "Phone", valueKey: "phone", type: "phone" },
    { label: "Tracking", valueKey: "tracking_number", type: "text" },
    { label: "Size", valueKey: "size", type: "text" },
    { label: "Post Service", valueKey: "post_service", type: "text" },
    { label: "Customer Price", valueKey: "customer_price", type: "text" },
    { label: "Factory Price", valueKey: "factory_price", type: "text" },
    { label: "Factory Price USD", valueKey: "factory_price_usd", type: "text" },
    {
      label: "Shipment Customer Price",
      valueKey: "shipment_customer_price",
      type: "text",
    },
    { label: "Province", valueKey: "province", type: "text" },
    { label: "City", valueKey: "city", type: "text" },
    { label: "Country", valueKey: "country", type: "text" },
    {
      label: "Order Status",
      valueKey: "order_status",
      type: "select",
      options: [
        ORDER_STATUS.SUBMITTED,
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.IN_PRODUCTION,
        ORDER_STATUS.SHIPPED_OUT,
        ORDER_STATUS.HOLD,
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.CANCELLED,
     
      ],
    },
    {
      label: "Invoice Status",
      valueKey: "invoice_status",
      type: "select",
      options: [
        INVOICE_STATUS.NOT_INVOICED,
        INVOICE_STATUS.READY_TO_INVOICE,
        INVOICE_STATUS.INVOICED,   
      ],
    },
    { label: "Payment Status", valueKey: "payment_status", 
       type: "select", 
      options:[
      PAYMENT_STATUS.NOT_PAID,
      PAYMENT_STATUS.PAID
    ] 
    
    },
    { label: "Remarks", valueKey: "remarks", type: "text" },
    { label: "Admin Remarks", valueKey: "admin_remarks", type: "text" },
    { label: "Customer Note", valueKey: "customer_note", type: "text" },
    { label: "Factory Note", valueKey: "factory_note", type: "text" },
    { label: "Shipping Label", valueKey: "shipping_label", type: "text" },
  ];




  export const TicketListEditNonHoldFieldConfigs = [
    { label: "Po Number", valueKey: "po", type: "text", disabled: true },
    { label: "Po Id", valueKey: "po_id", type: "text", disabled: true },
    {
      label: "Shipping Address",
      valueKey: "shipping_address",
      type: "text",
      disabled: true,
    },
    { label: "Name", valueKey: "name", type: "text", disabled: true },
    {
      label: "Shipping Name",
      valueKey: "shipping_name",
      type: "text",
      disabled: true,
    },
    { label: "Zip Code", valueKey: "zip", type: "text", disabled: true },
    { label: "Quantity", valueKey: "quantity", type: "text", disabled: true },
    { label: "Email", valueKey: "email", type: "email", disabled: true },
    { label: "Phone", valueKey: "phone", type: "phone", disabled: true },
    { label: "Tracking", valueKey: "tracking_number", type: "text" },
    { label: "Size", valueKey: "size", type: "text", disabled: true },
    {
      label: "Post Service",
      valueKey: "post_service",
      type: "text",
      disabled: true,
    },
    {
      label: "Customer Price",
      valueKey: "customer_price",
      type: "text",
      disabled: true,
    },
    {
      label: "Factory Price",
      valueKey: "factory_price",
      type: "text",
      disabled: true,
    },
    {
      label: "Factory Price USD",
      valueKey: "factory_price_usd",
      type: "text",
      disabled: true,
    },
    {
      label: "Shipment Customer Price",
      valueKey: "shipment_customer_price",
      type: "text",
      disabled: true,
    },
    { label: "Province", valueKey: "province", type: "text", disabled: true },
    { label: "City", valueKey: "city", type: "text", disabled: true },
    { label: "Country", valueKey: "country", type: "text", disabled: true },
    {
      label: "Order Status",
      valueKey: "order_status",
      type: "select",
      options: [
        ORDER_STATUS.SUBMITTED,
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.IN_PRODUCTION,
        ORDER_STATUS.SHIPPED_OUT,
        ORDER_STATUS.HOLD,
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.CANCELLED,
          ],
      disabled: true,
    },
    {
      label: "Invoice Status",
      valueKey: "invoice_status",
      type: "select",
      options: [
         INVOICE_STATUS.NOT_INVOICED,
        INVOICE_STATUS.READY_TO_INVOICE,
        INVOICE_STATUS.INVOICED,   
      ],
      disabled: true,
    },
    {
      label: "Payment Status",
      valueKey: "payment_status",
            type: "select", 
      options:[
      PAYMENT_STATUS.NOT_PAID,
      PAYMENT_STATUS.PAID
    ] ,
      disabled: true,
    },
    { label: "Remarks", valueKey: "remarks", type: "text", disabled: true },
    {
      label: "Admin Remarks",
      valueKey: "admin_remarks",
      type: "text",
      disabled: true,
    },
    {
      label: "Customer Note",
      valueKey: "customer_note",
      type: "text",
      disabled: true,
    },
    {
      label: "Factory Note",
      valueKey: "factory_note",
      type: "text",
      disabled: true,
    },
    {
      label: "Shipping Label",
      valueKey: "shipping_label",
      type: "text",
      disabled: true,
    },
  ];


  export const TicketListEditCustomerFieldsConfigs = [
    { label: "Shipping Name", valueKey: "shipping_name", type: "text" },
    { label: "Shipping Address", valueKey: "shipping_address", type: "text" },
    { label: "City", valueKey: "city", type: "text" },
    { label: "Province", valueKey: "province", type: "text" },
    { label: "Zip Code", valueKey: "zip", type: "text" },
    { label: "Email", valueKey: "email", type: "email" },
    { label: "Phone", valueKey: "phone", type: "phone" },
  ];


  export const getColor = (tagRed, tagBlue) => {
    if (tagRed === null && tagBlue !== null) {
      return "#ADD8E6";
    } else if (tagRed !== null && tagBlue === null) {
      return "#FF7F7F";
    } else {
      return "transparent";
    }
  };


 export const localeDateAndTime=(date)=>{
    const now = new Date(date);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formattedDateTime = now.toLocaleString('en-US', options);
    return formattedDateTime;
  
  }

  export function isEmptyObj(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }
 
