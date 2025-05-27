import { DataGridPro } from "@mui/x-data-grid-pro";
import React ,{ useRef, useState } from "react";
import API from "../../api/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {Box, Button, Fade, IconButton, Backdrop, Modal, Slide,  Tooltip, Typography, AppBar, Dialog  } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from '@mui/icons-material/Send';
import { Toolbar } from "../../components/pagination/paginationDataGrid";
import { formattedDateTime } from "./Home";
import useQueryRejectedOrders from "../../Hooks/useQueryRejectedOrders/useQueryRejectedOrders";
import CustomIcon from "./../../components/CustomIcon/CustomIcon"
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const RejectedOrdersTable = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0, pageSize: 10
  })

  const { skusNames, setIsLoading ,isLoading, rows, pageInfo } = useQueryRejectedOrders(paginationModel);

  const sortedSkus = skusNames?.sort((a, b) => {
    let titleA = a?.title?.toLowerCase();
    let titleB = b?.title?.toLowerCase();

    if (titleA < titleB) {
        return -1;
    }
    if (titleA > titleB) {
        return 1;
    }
    return 0;
});


  const [skus, setSkus] = useState('');
  const boolRef = useRef(false);
  const auth = useSelector(
    state => state.user
  )

  const [fields, setFields] = useState(null)
  const handlePropertiesModal = (data) => {
    setFields(data)
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
    ...(auth.type === "admin" ? [{
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
    ...(auth.type === "admin" ? [{
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
    ...(auth.type === "customer" || auth.type === "admin" ? [{
      field: "customer_note",
      headerName: "Customer Note",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return <div>
          <Tooltip title={params?.row?.customer_note?.join(" , ")}>
            <p>{params?.row?.customer_note?.join(" , ")}</p>
          </Tooltip>
        </div>
      }
    },] : []),
    ...(auth.type === "factory" || auth.type === "admin" ? [{
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
    ...(auth.type === "admin" ? [{
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
    ...((auth.type === "admin") ? [{
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

  // delete Rejected orders
  const [deleteId, setDeleteId] = useState(null);
  const handleDeleteModal = (data) => {
    setDeleteId(data)
  };
  const handleDelete = (id) => {
    API.delete(`/customer/delete-order`, {
      params: {
        order_id: id,
      }
    })
      .then((response) => {
        handleDeleteModal(null);
        setPaginationModel({ bool: boolRef.current });
        boolRef.current = !boolRef.current;
      });
  };

  const changeName = async (id) => {
    setIsLoading(true);
    try {
      console.log("ye hai sku ki id", skus)
      const response = await API.post(`/customer/change-name`, {
        order_id: id,
        sku_id: skus
      });
      setSkus("");
      setPaginationModel({ bool: boolRef.current });
      boolRef.current = !boolRef.current;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 350,
      renderCell: (params) => {
        console.log(params.row)
      
        return (
          <div className="cellAction">
            <select
              style={{
                width: "100%",
                padding: " 5px 2px",
                border: "1px solid black",
                borderRadius: "7px"
              }}
              onChange={(e) => {
                setSkus(e.target.value)
                }}>
              <option>Choose Name</option>
              {sortedSkus && sortedSkus?.map((item, index) => {
                return <option value={item._id}>{item.title}</option>
              })}
            </select>



            <CustomIcon
            title="Submit"
            className="action-icon-btn viewBtn"
            cb={()=>changeName(params.row._id)}
            icon={<SendIcon />}
            />
            <CustomIcon
             title={"Delete"}
             className="action-icon-btn deleteBtn"
             cb={()=>handleDeleteModal(params.row._id)}
             icon={ <DeleteForeverIcon />}
            />
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

  let propertiesColumns = []
  if (fields?.properties[0]?.name){
     propertiesColumns = [
      {
        field: "name", headerName: "Name", minWidth: 100, flex: 1,
        renderCell: (params) => {
          return (params.row?.name &&  <div className="">
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
            params.row?.value
          )
        },
      }
    ];
  }
else{
     propertiesColumns = []
  }

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

{fields && <Dialog
        fullScreen
        open={true}
        // onClose={handleClose}
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
            {fields?.properties &&
              <div style={{ height: "300px", maxWidth: "1000px", margin: "20px auto", padding: "20px" }}>
                <DataGridPro
                  className="datagrid"
                  loading={isLoading}
                  getRowId={(rows) => rows?.customizedContent ? rows?.customizedContent : rows?.name}
                  rows={fields?.properties}
                  columns={[ ...propertiesColumns]}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                />
              </div>
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

{deleteId && <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={true}
        onClose={() => handleDeleteModal(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal delete-modal"
      >
        <Fade in={!!deleteId} >
          <Box>
            <Box className="modal-body" >
              <a onClick={() => handleDeleteModal(null)} className="close-btn">
                <CloseIcon className="icon" />
              </a>
              <Typography className="main-title" component="h2">
                Delete Rejected Order
              </Typography>
              <Typography component="p">
                Are you sure want to delete?
              </Typography>
              <Box className="modal-footer">
                <Button
                  className="btn btn-outline-primary"
                  onClick={() => handleDeleteModal(null)}
                >
                  No
                </Button>
                <Button className="btn btn-outline-danger" onClick={() => handleDelete(deleteId)}>
                  Yes
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>}
    </div>
  );
};

export default RejectedOrdersTable;
