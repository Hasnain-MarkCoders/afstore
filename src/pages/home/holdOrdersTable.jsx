import React from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { useEffect, useRef, useState } from "react";
import API from "../../api/api";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Fade, IconButton, Backdrop, Modal, Slide, TextField, Tooltip, Typography, AppBar, Dialog } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Toolbar } from "../../components/pagination/paginationDataGrid";
import { formattedDateTime } from "./Home";
import OrderEditModal from "../../components/Modals/OrdersModals/OrderEditModal";
import useQueryHoldOrdersTable from "../../Hooks/useQueryHoldOrdersTable/useQueryHoldOrdersTable";
import CustomIcon from "../../components/CustomIcon/CustomIcon";
import { v4 as uuidv4 } from 'uuid';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const HoldOrdersTable = () => {
  const [propertyAddModal, setPropertyAddModal] = useState(false);
  const [dynamicFormFields, setDynamicFormFields] = useState([]);
  const [pair, setPair] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setDynamicFormFields(Array.from({ length: pair }, () => ({ name: '', value: '' })));
  }, [pair]);

  const handleFieldChange = (index, field, value) => {
    const updatedFields = dynamicFormFields.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setDynamicFormFields(updatedFields);
  };


  const navigate = useNavigate()
  const auth = useSelector(
    state => state.user
  )
  
const handleRemoveProperty = (item) => {
  setLoading(true)
  const newData = [...fields?.properties?.filter(x=>x._id!=item._id)]
      setFields(prev => ({
        ...prev,
        properties:newData,
      }));
      API.post('/customer/add-missing-name', {
      order_id: fields?._id,
      properties: [...newData]
    }).then((response) => {
  setLoading(false)
    }).catch(error=>{
  setLoading(false)
      alert(error?.response?.data?.message??error?.message??"Error Removing Property")
    }).finally(()=>{

   setPaginationModel({ bool: boolRef.current });
      boolRef.current = !boolRef.current;
    })

};



  const userColumns = [
    {
      field: "po_id", headerName: "Po Id", minWidth: 240, flex: 1
    },
    {
      field: "multiple",
      headerName: "Multiple",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const handleSubmit = () => {
          setPaginationModel({ po_number: [params.row.po] });
        }
        return (
          <div className="cellAction">
            <Button className="action-btn" disabled={!params.row.multiple} onClick={() => { handleSubmit() }}>
              {params.row.multiple ? "Yes" : "No"} {params.row.multiple}
            </Button>
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200
    },
    ...(auth.type === "admin" || auth.type==="suadmin"? [{
      field: "admin_remarks",
      headerName: "Admin Remarks",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return <div>
          <Tooltip title={params?.row?.admin_remarks}>
            <p>{params?.row?.admin_remarks}</p>
          </Tooltip>
        </div>
      }
    },] : []),
    ...(auth.type === "admin" || auth.type==="suadmin"? [{
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return <div>
          <Tooltip title={params?.row?.remarks}>
            <p>{params?.row?.remarks}</p>
          </Tooltip>
        </div>
      }
    },] : []),
    ...(auth.type === "customer" || auth.type === "admin" || auth.type==="suadmin"? [{
      field: "customer_note",
      headerName: "Customer Note",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return <div>
          <Tooltip title={params?.row?.customer_note[0]?.message}>
            <p>{params?.row?.customer_note[0]?.message}</p>
          </Tooltip>
        </div>
      }
    },] : []),
    ...(auth.type === "factory" || auth.type === "admin" || auth.type==="suadmin"? [{
      field: "factory_note",
      headerName: "Factory Note",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return <div>
          <Tooltip title={params?.row?.factory_note?.join(" , ")}>
            <p>{params?.row?.factory_note?.join(" , ")}</p>
          </Tooltip>
        </div>
      }
    },] : []),
    ...(auth.type !== "customer" ? [{
      field: "shipping_label",
      headerName: "Shipping Label",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (params.row.shipping_label !== null &&
          <Link to={params.row.shipping_label} className="cellWithStatus" target="blank" >
            Label URL
          </Link>
        );
      },
    },] : []),
    ...(auth.type === "admin" || auth.type==="suadmin"? [{
      field: "shipment_customer_price",
      headerName: "Shiptment Price",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return !!params.row.shipment_customer_price ? `$${params.row.shipment_customer_price}` : ""
      }
    },
    {
      field: "customer_price",
      headerName: "Customer Price",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return !!params?.row?.customer_price ? `$${params?.row?.customer_price}` : ""
      }
    },
    {
      field: "shipment_local_price_usd",
      headerName: "YE Shipment USD",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return !!params?.row?.shipment_local_price_usd ? `$${params?.row?.shipment_local_price_usd}` : ""
      }
    },
    {
      field: "shipment_local_price",
      headerName: "YE Shipment RMB",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return !!params?.row?.shipment_local_price ? `¥${params?.row?.shipment_local_price}` : ""
      }
    },
    {
      field: "factory_price_usd",
      headerName: "Factory Price USD",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return !!params.row.factory_price_usd ? `$${params.row.factory_price_usd}` : ""
      }
    }] : []),
    ...(auth.type !== "customer" ? [{
      field: "factory_price",
      headerName: "Factory Price",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return !!params.row.factory_price ? `¥${params.row.factory_price}` : ""
      }
    },] : []),
    {
      field: "date",
      headerName: "Date",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (!!params.row.date ? formattedDateTime(params.row.date): null)
      },
    },
    {
      field: "submitted",
      headerName: "Submitted Date",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (!!params.row.submitted ? formattedDateTime(params.row.submitted) : null)
      },
    },
    {
      field: "accepted",
      headerName: "Accepted Date",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (!!params.row.accepted ? formattedDateTime(params.row.accepted) : null)
      },
    },
    {
      field: "in_production",
      headerName: "In-Production Date",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (!!params.row.in_production ? formattedDateTime(params.row.in_production) : null)
      },
    },
    {
      field: "shipped_out",
      headerName: "Shipped Out Date",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (!!params.row.shipped_out ? formattedDateTime(params.row.shipped_out) : null)
      },
    },
    ...(auth.type !== "customer" ? [{
      field: "waybill_number",
      headerName: "WayBill Number",
      flex: 1,
      minWidth: 190
    },] : []),
    {
      field: "tracking_number",
      headerName: "Tracking Number",
      flex: 1,
      minWidth: 150
    },
    {
      field: "order_status",
      headerName: "Order Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus status-btn ${params.row.order_status ? "complete" : ""}`}>
            {params.row.order_status}
          </div>
        );
      }
    },
    ...((auth.type === "admin")|| auth.type==="suadmin" ? [{
      field: "invoice_status",
      headerName: "Invoice Status",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus status-btn ${params.row.invoice_status ? "complete" : ""}`}>
            {params.row.invoice_status}
          </div>
        );
      }
    }] : []),
  ];


  const [paginationModel, setPaginationModel] = useState({
    page: 0, pageSize: 10
  })

  const { isLoading, rows, pageInfo } = useQueryHoldOrdersTable(paginationModel);


  const boolRef = useRef(false);
  
  const [fields, setFields] = useState(null)
  const handlePropertiesModal = async (data) => {
    if (!data) {
    setFields(null);
    return;
  }
    try{

      const response = await API.get(`${auth.type}/sku/get`, {
        params: {
          name: [data?.name]
        }
      })
      setPair(response.data.skus[0].properties.pair)
    } catch(error) {
      if(error?.response?.status === 480) {
        navigate("/login");
      }
    }
    const newData = {...data, properties: data.properties.map(item=>({...item,_id:uuidv4()}))}
    setFields(newData)
  };

  const renderDynamicFormFields = () => {
    return dynamicFormFields.map((field, index) => (
      <div key={index}>
        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          value={field.name}
          onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Value"
          fullWidth
          variant="outlined"
          value={field.value}
          onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
          style={{ marginBottom: "10px" }}
        />
      </div>
    ));
  };


  let propertiesColumns = []
  if (fields?.properties && (fields?.properties[0]?.name || fields?.properties[0]?.value)) {
    propertiesColumns = [
      {
        field: "name", headerName: "Name", minWidth: 100, flex: 1,
        renderCell: (params) => {
          return (params.row?.name && <div className="">
            {params.row?.name}
          </div>
          );
        }
      },
      {
        field: "value",
        headerName: "Value",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {

          return (
            params.row?.value?.startsWith("http") ?
              <Link to={params.row?.value} className={`cellWithStatus status-btn`} target="blank">
                View Image
              </Link>
              : params.row?.value
          )
        },
      }
    ];
  } else if (fields?.properties && (fields?.properties[0]?.customizedContent || fields?.properties && fields?.properties[0]?.url)) {
    propertiesColumns = [
      {
        field: "customizedContent", headerName: "Name", minWidth: 100, flex: 1,
        renderCell: (params) => {
          return (params.row?.customizedContent && <div className="">
            {params.row?.customizedContent}
          </div>
          );
        }
      },
      {
        field: "url",
        headerName: "Value",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {
          return (
            params.row?.url && params.row?.url?.startsWith("http") ?
              <Link to={params.row.url} className={`cellWithStatus status-btn`} target="blank">
                View Image
              </Link>
              : params.row.url
          )
        },
      }
    ];
  } else {
    propertiesColumns = []
  }


  const [propertyFields, setPropertyFields] = useState(null)
  const handleEditModal = (data) => {
    setPropertyFields(data)
  };
  const handleInput = (e) => {
    const { name, value } = e?.target;
    setPropertyFields(p => ({ ...p, [name]: value }))
  }
  const handleSubmitUpdateProperties = async (e) => {
    setLoading(true)
    e.preventDefault();
    console.log(propertyFields)
   return API.post('/customer/add-missing-name', {
      order_id: fields?._id,
      properties: isAdding?[...fields.properties,propertyFields]:[...fields.properties]
    }).then((response) => {
    setLoading(false)
      handleEditModal(null);
      handlePropertiesModal(null);
      setPaginationModel({ bool: boolRef.current });
      boolRef.current = !boolRef.current;
    }).catch(error=>{
    setLoading(false)

      alert(error?.response?.data?.message??error?.message??"Error added property")
    }).finally(()=>{
   setPaginationModel({ bool: boolRef.current });
      boolRef.current = !boolRef.current;
    })
  };


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {

        return (
          <div className="cellAction">

            <CustomIcon
             title={"View Properties"}
             className="action-icon-btn viewBtn"
             cb={()=>handlePropertiesModal(params.row)}
             icon={ <RemoveRedEyeIcon />}
            />
         
          </div>
        );
      },
    },
  ];

  // Column definition for the action column in the data grid
  const propertiesActionColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 70,
      renderCell: (params) => {
        return (
          <div className="cellAction">

            <CustomIcon
            isDisabled={(params.row.value===""||params.row.url==="")?false:true}
             title={"Edit"}
             className="action-icon-btn editBtn"
             cb={()=>{handleEditModal(params.row);;setIsAdding(false)}}
             icon={ <EditIcon />}
            />
                      <CustomIcon
            title="Remove"
            className="action-icon-btn editBtn"
            cb={() => handleRemoveProperty(params?.row)}
            icon={<CloseIcon />}
          />
          </div>
        );
      },
    },
  ];

  const handlePagination = (fieldName, value) => {
    setPaginationModel(prev => ({
      ...prev, [fieldName]: value
    }))
  }

  return (
    <div className="datatable">
      {rows &&
        <DataGridPro
          className="datagrid"
          getRowId={(rows) => rows?._id}
          rows={rows}
          columns={[...actionColumn, ...userColumns]}
          rowsPerPageOptions={[10, 25, 50, 100]}
          rowCount={pageInfo?.totalRowCount || 1}
          onPageSizeChange={(x) => handlePagination("pageSize", x)}
          onPageChange={(x) => handlePagination("page", x)}
          pageSize={pageInfo?.pageSize || 10}
          page={pageInfo?.page || 0}
          loading={isLoading}
          paginationMode="server"
          pagination
          components={{
            Toolbar,
          }}
        />}
      
      {propertyFields && 
        <OrderEditModal
        loading={loading}
        title={isAdding?"Add":"Edit"}
        handleInput={(e)=>handleInput(e)}
        handleSubmitUpdateProperties={(e)=>handleSubmitUpdateProperties(e)}
        handleEditModal={() => handleEditModal(null)}
        propertyFields={propertyFields}
        
        />
     }

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={propertyAddModal}
        onClose={() => setPropertyAddModal((e) => !e)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal"
      >
        <Fade in={!!propertyAddModal} >
          <Box>
            <form>
              <Box className="modal-body" >
                <a onClick={() => setPropertyAddModal((e) => !e)} className="close-btn">
                  <CloseIcon className="icon" />
                </a>
                <Typography className="main-title" component="h2">
                  Add Properties
                </Typography>
                  {renderDynamicFormFields()}

                <Box className="modal-footer">
                  <Button
                    className="btn btn-outline-primary"
                    onClick={() => setPropertyAddModal((e) => !e)}
                  >
                    Cancel
                  </Button>
                  <Button className="btn btn-primary" type="submit">
                    Add
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>

      {fields && <Dialog
        fullScreen
        open={true}
        onClose={() => handlePropertiesModal(null)}
        TransitionComponent={Transition}
        style={{ maxWidth: "1100px", marginLeft: "auto" }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Box style={{ display: "flex", alignItems: "center", padding: "10px 15px", background: "#6439ff" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => handlePropertiesModal(null)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, textAlign: "center" }} variant="h6" component="div">
              Properties
            </Typography>

          </Box>
        </AppBar>
        <Box>
          <Box className="modal-body" >
             <div style={{ display: "flex", justifyContent: "space-between", margin: "20px auto", padding: "20px" }}>
                <h2>Add Fields</h2>
                <div className="action-icon-btn editBtn">
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() =>{ handleEditModal({name:"", value:""});setIsAdding(true)}}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            {fields?.properties && fields?.properties.length > 0 ?
            <>
            
          
             
              <div style={{ height: "300px", maxWidth: "1000px", margin: "20px auto", padding: "20px" }}>
                <DataGridPro
                  key={fields.properties.map(p => p._id).join(',')} 
                  className="datagrid"
                  loading={isLoading}
                  getRowId={(row) => row._id}
                  rows={fields?.properties}
                  columns={[...propertiesActionColumn, ...propertiesColumns]}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                />
              </div>
            </>
            :""
            }

            <div className="view-list" >
              <div className="left" style={{ maxWidth: "1000px", margin: "20px auto", padding: "20px" }}>
                <div className="item">
                  <div className="details">
                    <h1 className="itemTitle">Order Details</h1>
                    {/*  */}
                    {fields && Object?.entries(fields)?.map(([keys, values]) => {
                      return (typeof values === "string") ?
                        <div className="detailItem" key={keys}>
                          <span className="itemKey" >{keys}:</span>
                          <span className="itemValue">{values}</span>
                        </div> : <></>
                    })}
                    {fields?.admin_remarks && auth?.type === "admin" && <div className="detailItem">
                      <span className="itemKey">Admin Remarks:</span>
                      <span className="itemValue">{fields?.admin_remarks}</span>
                    </div>}
                    {fields?.factory_note && auth?.type !== "customer" && <div className="detailItem">
                      <span className="itemKey">Factory Note:</span>
                      <span className="itemValue">{fields?.factory_note?.join(" , ")}</span>
                    </div>}
                    {fields?.customer_note && auth?.type !== "factory" && <div className="detailItem">
                      <span className="itemKey">Customer Note:</span>
                      <span className="itemValue">{fields?.customer_note?.join(" , ")}</span>
                    </div>}
                  </div>
                  {/*  */}
                </div>
              </div>
            </div>
          </Box>
        </Box>
      </Dialog>
      }
    </div>
  );
};

export default HoldOrdersTable;
