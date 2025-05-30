import { DataGridPro } from "@mui/x-data-grid-pro";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/api";
import {
  Box,
  Backdrop,
  Button,
  Fade,
  Modal,
  TextField,
  Typography,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import "./styles.scss";
import { Toolbar } from "../../../components/pagination/paginationDataGrid";
import CircularProgress from "@mui/material/CircularProgress";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorModal from "../../../components/Modals/ErrorModal";
import {
  editFieldConfigs,
  editNonHoldFieldConfigs,
  editCustomerFieldsConfigs,
  filterFields,
  formattedDateTime,
  ORDER_STATUS,
} from "../../../Utils/Utils";
import PupringNote from "../../../components/Modals/PupringTableModals/PupringNote";
import CustomListItem from "../../../components/CustomListItem/CustomListItem";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutohideSnackbar from "../../../components/snackbar/Snackbar";
import LineOrderPropertiesComponent from "../../../components/LineOrderPropertiesComponent/LineOrderPropertiesComponent";
const PupringTable = ({
  tabName,
  isLoading = false,
  rows = [],
  pageInfo = {},
  setPaginationModel,
  selectedRow,
  setSelectedRow,
}) => {
  // Accessing user authentication data from Redux store
  const auth = useSelector((state) => state.user);
  const navigate = useNavigate();
  const boolRef = useRef(false);
  const [fields, setFields] = useState(null);
  const [factoryNote, setFactoryNote] = useState(null);
  const [factoryNoteField, setFactoryNoteField] = useState("");
  const [remarksNote, setRemarksNote] = useState(null);
  const [remarksNoteField, setRemarksNoteField] = useState("");
  const [customerNote, setCustomerNote] = useState(null);
  const [customerNoteField, setCustomerNoteField] = useState("");
  const [isLineOrderUpdating, setIsLineOrderUpdating] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ""
  })
  // Helper function to format date and time

  const handleLocalStorage = (id) => {
    // Save the ID to local storage
    localStorage.setItem("savedId", [id]);

    // Redirect to the ticket page
    navigate("/tickets-system");
  };

  // Handle form submission for updating line order
  const handleSubmitUpdateLineOrder = async (e) => {
    setIsLineOrderUpdating(true)
    e.preventDefault();
    return API.post(`/${auth?.type}/edit-line-order`, {
      id: fields._id,
      shipping_address: fields.shipping_address,
      name: fields.name,
      quantity: fields.quantity,
      shipping_name: fields.shipping_name,
      zip: fields.zip,
      email: fields.email,
      phone: fields.phone,
      tracking_number: fields.tracking_number,
      size: fields.size,
      post_service: fields.post_service,
      customer_price: fields.customer_price,
      factory_price: fields.factory_price,
      factory_price_usd: fields.factory_price_usd,
      shipment_customer_price: fields.shipment_customer_price,
      province: fields.province,
      city: fields.city,
      country: fields.country,
      order_status: fields.order_status,
      invoice_status: fields.invoice_status,
      payment_status: fields.payment_status,
      remarks: fields.remarks,
      admin_remarks: fields.admin_remarks,
      customer_note: fields.customer_note,
      factory_note: fields.factory_note,
      shipping_label: fields.shipping_label,
      color: fields.color,
    }).then((response) => {
      setIsLineOrderUpdating(false)
      handleEditModal(null);
      filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    }).catch(error => {
      setIsLineOrderUpdating(false)
      alert(error?.response?.data?.message ?? error.message ?? "Error Editing Line Order!")

    })
  };

  const handleFactoryNoteModal = (data) => {
    setFactoryNote(data);
    setFactoryNoteField("");
  };

  // Handle form submission for updating line order
  const handleSubmitfactoryNote = async (e) => {
    e.preventDefault();
    return API.post(`/factory/add-note`, {
      id: factoryNote?._id,
      note: factoryNoteField,
    }).then((response) => {
      handleFactoryNoteModal(null);
      filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    }).catch(error => {
      alert(error?.response?.data?.message ?? error.message ?? "Error adding note!")
    })
      ;
  };

  const handleCustomerNoteModal = (data) => {
    setCustomerNote(data);
    setCustomerNoteField("");
  };

  // Handle form submission for updating line order
  const handleSubmitcustomerNote = async (e) => {
    e.preventDefault();

    return API.post(`/customer/add-note`, {
      id: customerNote?._id,
      note: customerNoteField,
    }).then((response) => {
      handleCustomerNoteModal(null);
      filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    });
  };

  const handleRemarksNoteModal = (data) => {
    setRemarksNote(data);
    setRemarksNoteField("");
  };

  // Handle form submission for updating line order
  const handleSubmitremarksNote = async (e) => {
    e.preventDefault();

    return API.post(`/${auth.type}/add-note`, {
      order_id: remarksNote?._id,
      note: remarksNoteField,
    }).then((response) => {
      handleRemarksNoteModal(null);
      filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    });
  };

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text)
    setSnackbar({
      open: true,
      message: `${field} Copied to clipboad.`
    })
  }

  const userColumns = [
    {
      field: "po_id",
      headerName: "Po Id",
      minWidth: 240,
      flex: 1,
      renderCell: params => {
        return (<Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <Tooltip onClick={() => handleCopy("PO number", params.row.po_id)} sx={{
            cursor: "pointer"
          }} title="Copy PO number">
            <ContentCopyIcon />
          </Tooltip>
          <Typography>

            {params.row.po_id}
          </Typography>
        </Box>)
      }
    },
    {
      field: "multiple",
      headerName: "Multiple",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const handleSubmit = () => {
          setPaginationModel({ po_number: [params.row.po] });
        };
        return (
          <div className="cellAction">
            <Button
              className="action-btn"
              disabled={!params.row.multiple}
              onClick={() => {
                handleSubmit();
              }}
            >


              {/* {params.row.multiple ? "Yes" : "No"} {params.row.multiple} */}
              {params.row.multiple ? "Yes" : "No"}
            </Button>
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        // console.log(params.row)
        return (<Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <Tooltip onClick={() => handleCopy("Name", params.row.name)} sx={{
            cursor: "pointer"
          }} title="Copy Title">
            <ContentCopyIcon />
          </Tooltip>
          <Typography>

            {params.row.name}
          </Typography>
        </Box>)
      }
    },
    ...(auth.type === "admin" || auth.type === "suadmin"
      ? [
        {
          field: "color",
          headerName: "Color",
          flex: 1,
          minWidth: 200,
          renderCell: (params) => {
            return (
              <div
                className="color-box"
                style={{
                  display: "flex",
                  borderRadius: "50px",
                  overflow: "hidden",
                  boxShadow: "0 0 10px lightgray",
                }}
              >
                <div
                  className={params?.row?.factory_color}
                  style={{ flexGrow: 1, padding: "7px 10px" }}
                >
                  Factory
                </div>
                <div
                  className={params?.row?.color}
                  style={{ flexGrow: 1, padding: "7px 10px" }}
                >
                  Customer
                </div>
              </div>
            );
          },
        },
      ]
      : []),
    ...(auth.type === "admin" || auth.type === "suadmin"
      ? [
        {
          field: "admin_remarks",
          headerName: "Admin Remarks",
          flex: 1,
          minWidth: 200,
          renderCell: (params) => {
            return (
              <div>
                <Tooltip title={params?.row?.admin_remarks}>
                  <p>{params?.row?.admin_remarks}</p>
                </Tooltip>
              </div>
            );
          },
        },
      ]
      : []),
    ...(auth.type === "admin" || auth.type === "suadmin"
      ? [
        {
          field: "remarks",
          headerName: "Remarks",
          flex: 1,
          minWidth: 200,
          renderCell: (params) => {
            return (
              <div>
                <Tooltip title={params?.row?.remarks}>
                  <p>{params?.row?.remarks}</p>
                </Tooltip>
              </div>
            );
          },
        },
      ]
      : []),
    ...(auth.type === "customer" || auth.type === "admin" || auth.type === "suadmin"
      ? [
        {
          field: "tag_red",
          headerName: "Tag Red",
          flex: 1,
          minWidth: 200,
          renderCell: (params) => {
            return (
              <div>
                <Tooltip title={params?.row?.tag_red}>
                  <p>{params?.row?.tag_red}</p>
                </Tooltip>
              </div>
            );
          },
        },
        {
          field: "tag_blue",
          headerName: "Tag Blue",
          flex: 1,
          minWidth: 200,
          renderCell: (params) => {
            return (
              <div>
                <Tooltip title={params?.row?.tag_blue}>
                  <p>{params?.row?.tag_blue}</p>
                </Tooltip>
              </div>
            );
          },
        },
        {
          field: "customer_note",
          headerName: "Customer Note",
          flex: 1,
          minWidth: 200,
          renderCell: (params) => {
            return (
              <div>
                <Tooltip title={params?.row?.customer_note[0]?.message}>
                  <p>{params?.row?.customer_note[0]?.message}</p>
                </Tooltip>
              </div>
            );
          },
        },
      ]
      : []),
    ...(auth.type === "factory" || auth.type === "admin" || auth.type === "suadmin"
      ? [
        {
          field: "factory_note",
          headerName: "Factory Note",
          flex: 1,
          minWidth: 200,
          renderCell: (params) => {
            return (
              <div>
                <Tooltip title={params?.row?.factory_note?.join(" , ")}>
                  <p>{params?.row?.factory_note?.join(" , ")}</p>
                </Tooltip>
              </div>
            );
          },
        },
      ]
      : []),
    ...(auth.type !== "customer"
      ? [
        {
          field: "shipping_label",
          headerName: "Shipping Label",
          flex: 1,
          minWidth: 120,
          renderCell: (params) => {
            return (
              params.row.shipping_label !== null && (
                <Link
                  to={params.row.shipping_label}
                  className="cellWithStatus"
                  target="blank"
                >
                  Label URL
                </Link>
              )
            );
          },
        },
      ]
      : []),
    ...(auth.type === "admin" || auth.type === "suadmin"
      ? [
        {
          field: "shipment_customer_price",
          headerName: "Shiptment Price",
          flex: 1,
          minWidth: 120,
          renderCell: (params) => {
            return !!params.row.shipment_customer_price
              ? `$${params.row.shipment_customer_price}`
              : "";
          },
        },
        {
          field: "customer_price",
          headerName: "Customer Price",
          flex: 1,
          minWidth: 120,
          renderCell: (params) => {
            return !!params?.row?.customer_price
              ? `$${params?.row?.customer_price}`
              : "";
          },
        },
        {
          field: "shipment_local_price_usd",
          headerName: "YE Shipment USD",
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            return !!params?.row?.shipment_local_price_usd
              ? `$${params?.row?.shipment_local_price_usd}`
              : "";
          },
        },
        {
          field: "shipment_local_price",
          headerName: "YE Shipment RMB",
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            return !!params?.row?.shipment_local_price
              ? `¥${params?.row?.shipment_local_price}`
              : "";
          },
        },
        {
          field: "factory_price_usd",
          headerName: "Factory Price USD",
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            return !!params.row.factory_price_usd
              ? `$${params.row.factory_price_usd}`
              : "";
          },
        },
      ]
      : []),
    ...(auth.type !== "customer"
      ? [
        {
          field: "factory_price",
          headerName: "Factory Price",
          flex: 1,
          minWidth: 120,
          renderCell: (params) => {
            return !!params.row.factory_price
              ? `¥${params.row.factory_price}`
              : "";
          },
        },
      ]
      : []),
    {
      field: "date",
      headerName: "Date",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return !!params.row.date ? formattedDateTime(params.row.date) : null;
      },
    },
    ...(tabName === "submitted" || tabName === "all"
      ? [
        {
          field: "submitted",
          headerName: "Submitted Date",
          minWidth: 200,
          flex: 1,
          renderCell: (params) => {
            return !!params.row.submitted
              ? formattedDateTime(params.row.submitted)
              : null;
          },
        },
      ]
      : []),
    ...(auth.type === "factory" || auth.type === "admin" || auth.type === "suadmin"
      ? [
        {
          field: "factory_response",
          headerName: "Factory Response",
          flex: 1,
          minWidth: 200,
          renderCell: (params) => {
            return !!params.row.factory_response
              ? params.row.factory_response
              : "";
          },
        },
      ]
      : []),
    ...(tabName === "accepted" || tabName === "all"
      ? [
        {
          field: "accepted",
          headerName: "Accepted Date",
          minWidth: 200,
          flex: 1,
          renderCell: (params) => {
            return !!params.row.accepted
              ? formattedDateTime(params.row.accepted)
              : null;
          },
        },
      ]
      : []),
    ...(tabName === "in-production" || tabName === "all"
      ? [
        {
          field: "in_production",
          headerName: "In-Production Date",
          minWidth: 200,
          flex: 1,
          renderCell: (params) => {
            return !!params.row.in_production
              ? formattedDateTime(params.row.in_production)
              : null;
          },
        },
      ]
      : []),
    ...(tabName === "shipped-out" || tabName === "all"
      ? [
        {
          field: "shipped_out",
          headerName: "Shipped Out Date",
          minWidth: 200,
          flex: 1,
          renderCell: (params) => {
            return !!params.row.shipped_out
              ? formattedDateTime(params.row.shipped_out)
              : null;
          },
        },
      ]
      : []),
    ...(auth.type !== "customer"
      ? [
        {
          field: "waybill_number",
          headerName: "WayBill Number",
          flex: 1,
          minWidth: 190,
          renderCell: params => {
            return (<Box sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <Tooltip onClick={() => handleCopy("Waybill", params.row.waybill_number ?? "")} sx={{
                cursor: "pointer"
              }} title="Copy waybill ">
                <ContentCopyIcon />
              </Tooltip>
              <Typography>

                {params.row.waybill_number ?? "N/A"}
              </Typography>
            </Box>)
          }
        },
      ]
      : []),
    {
      field: "tracking_number",
      headerName: "Tracking Number",
      flex: 1,
      minWidth: 150,
      renderCell: params => {
        return (<Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <Tooltip onClick={() => handleCopy("Tracking number", params.row.tracking_number ?? "")} sx={{
            cursor: "pointer"
          }} title="Copy Tracking Number">
            <ContentCopyIcon />
          </Tooltip>
          <Typography>

            {params.row.tracking_number ?? "N/A"}
          </Typography>
        </Box>)
      }
    },
    {
      field: "order_status",
      headerName: "Order Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        return (
          <div
            className={`cellWithStatus status-btn ${params.row.order_status ? "complete" : ""
              }`}
          >
            {params.row.order_status}
          </div>
        );
      },
    },
    ...(auth.type === "admin" || auth.type === "suadmin"
      ? [
        {
          field: "invoice_status",
          headerName: "Invoice Status",
          minWidth: 200,
          flex: 1,
          renderCell: (params) => {
            return (
              <div
                className={`cellWithStatus status-btn ${params.row.invoice_status ? "complete" : ""
                  }`}
              >
                {params.row.invoice_status}
              </div>
            );
          },
        },
      ]
      : []),
  ];

  // Column definition for the action column in the data grid
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const placeOrder = (id) => {
          API.post(`/factory/place-order-to-yun-express`, {
            order_id: id,
          }).then((response) => {
            filterFields(pageInfo, setPaginationModel, boolRef);
            boolRef.current = !boolRef.current;
          }).catch((error) => {
            alert(error?.response?.data?.message ?? error.message ?? "Error Placing Order!")
          });
        };

        const generateLabel = (po_number) => {
          const po = [po_number];
          API.post(`/factory/generate-label`, po).then((response) => {
            filterFields(pageInfo, setPaginationModel, boolRef);
            boolRef.current = !boolRef.current;
          }).catch((error) => {
            alert(error?.response?.data?.message ?? error.message ?? "Error Generating WayBill!")
          });
        };

        const handleCancelOrder = (id) => {
          const orderId = [id];
          API.post(`/${auth.type}/cancel-line-orders`, {
            order_ids: orderId,
          }).then((response) => {
            filterFields(pageInfo, setPaginationModel, boolRef);
            boolRef.current = !boolRef.current;
          }).catch((error) => {
            alert(error?.response?.data?.message ?? error.message ?? "Error Cancelling Order!")
          });



        };
        const placeOrderOnHold = (row) => {
          API.post(`/${auth.type}/hold-orders`, {
            order_id: row?._id,
          })
            .then((response) => {
              filterFields(pageInfo, setPaginationModel, boolRef);
              boolRef.current = !boolRef.current;
              alert(response?.data?.message ?? "Order placed on hold!");
            })
            .catch(error => {
              alert(error?.response?.data?.message ?? error.message ?? "Error Placing Order ON Hold!")

            })
        };

        return (
          <div className="cellAction">
            <div
              className={`dropdown ${auth.type === "customer"
                  ? params?.row?.color
                  : auth.type === "factory"
                    ? params?.row?.factory_color
                    : "gray"
                }`}
            >
              <MoreVertIcon />
              <ul className="dropdown-content ">
                <CustomListItem
                  title="View"
                  style={{ fontWeight: 600 }}

                  cb={() => window.open(`/afstore/${params.row._id}`, '_blank', 'noopener,noreferrer')}
                />

                <CustomListItem
                  isVisible={auth.type === "suadmin" || auth.type === "admin"}
                  title="Add Remarks"
                  style={{ fontWeight: 600 }}
                  cb={() => handleRemarksNoteModal(params.row)}
                />
                <CustomListItem
                  isVisible={auth.type === "suadmin" || auth.type === "admin" || auth.type === "factory"}
                  title={auth.type === "factory"
                    ? "Add Note"
                    : "Add Factory Note"}
                  style={{ fontWeight: 600 }}
                  cb={() => handleFactoryNoteModal(params.row)}
                />
                <CustomListItem
                  isVisible={auth.type === "customer" || auth.type === "suadmin" || auth.type === "admin"}
                  title={auth.type === "customer"
                    ? "Add Note"
                    : "Add Customer Note"}
                  style={{ fontWeight: 600 }}
                  cb={() => handleCustomerNoteModal(params.row)}
                />
                <CustomListItem
                  isVisible={auth.type != "customer"}
                  title={"Put On Hold"}
                  style={{ fontWeight: 600 }}
                  cb={() => placeOrderOnHold(params.row)}
                />

                <CustomListItem
                  isVisible={auth.type === "suadmin" || auth.type === "admin" || auth.type === "customer"}
                  title={"Edit"}
                  style={{ fontWeight: 600 }}
                  cb={() => handleEditModal(params.row)}
                />

                <CustomListItem
                  isVisible={auth.type !== "customer"}
                  title={"Place Order"}
                  style={{ fontWeight: 600 }}
                  cb={() => placeOrder(params.row._id)}
                />

                <CustomListItem
                  isVisible={auth.type !== "customer"}
                  title={" Get Label"}
                  style={{ fontWeight: 600 }}
                  cb={() => generateLabel(params.row.po)}
                />

                <CustomListItem
                  isVisible={(auth.type === "suadmin" || auth.type === "admin")}
                  title={"Cancel Order"}
                  style={{ fontWeight: 600 }}
                  cb={() => handleCancelOrder(params.row?._id)}
                />
                <CustomListItem
                  isVisible={auth.type === "suadmin" || auth.type === "admin" || auth.type === "customer"}
                  title={"Ticket"}
                  style={{ fontWeight: 600 }}
                  cb={() => handleLocalStorage(params.row?._id)}
                />
              </ul>
            </div>
          </div>
        );
      },
    },
  ];

  // dialog box
  const [forceAccept, setForceAccept] = useState(null);
  const [loadingForceAccept, setLoadingForceAccept] = useState(false);
  const [forceAcceptSuccess, setForceAcceptSuccess] = useState(null);
  const [forceAcceptError, setForceAcceptError] = useState(null);
  const [approveOrderError, setApproveOrderError] = useState(null);
  // Handle edit modal for line orders
  const handleEditModal = async (data) => {
    try {
      setFields(data);
      const response = await API.get(`${auth.type}/sku/get`, {
        params: {
          name: [data?.name],
        },
      });
    } catch (error) {
      if (error?.response?.status === 480) {
        navigate("/login");
      }
    }
  };

  // Handle input change in the edit modal
  const handleInput = (e) => {
    const { name, value } = e?.target;
    setFields((p) => ({ ...p, [name]: value }));
  };



  // force accept
  const handleForceAcceptModal = (data) => {
    setForceAccept(data);
  };
  const handleForceAccept = () => {
    setLoadingForceAccept(true);
    API.post(`/${auth.type}/force-accept`, {
      order_ids: [forceAccept._id],
    })
      .then((response) => {
        setForceAcceptSuccess(response?.data?.message);
        handleForceAcceptModal(null);
        filterFields(pageInfo, setPaginationModel, boolRef);
        boolRef.current = !boolRef.current;
      })
      .catch((error) => {
        setForceAcceptError(error?.response?.data?.message);
      })
      .finally(() => {
        setLoadingForceAccept(false);
      });
  };

  // Approve
  const handleApproveModal = async (data) => {
    console.log("edit wala ha");
    await API.post(`/${auth.type}/direct-approve`, {
      id: data._id,
    })
      .then((response) => {
        setForceAcceptSuccess(response?.data?.message);
        filterFields(pageInfo, setPaginationModel, boolRef);
        boolRef.current = !boolRef.current;
      })
      .catch((error) => {
        setApproveOrderError(error?.response?.data?.message);
      });
  };

  // get Skus pair

  // Handle selection model change
  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectedRow(newSelectionModel);
  };

  // Handle pagination change
  const handlePagination = (fieldName, value) => {
    setPaginationModel((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleRowClick = (params) => {
    if (params.row) {
      params?.api?.clearSelectedRows();
    }
  };

  return (
    <>
      <div className="datatable">
        {/* DataGrid component */}
        <DataGridPro
          rows={rows}
          pagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          key={tabName}
          getRowId={(rows) => rows._id}
          columns={[...actionColumn, ...userColumns]}
          loading={isLoading}
          rowCount={pageInfo?.totalRowCount || 1}
          onPageSizeChange={(x) => handlePagination("pageSize", x)}
          onPageChange={(x) => handlePagination("page", x)}
          pageSize={pageInfo?.pageSize || 10}
          page={pageInfo?.page || 0}
          paginationMode="server"
          checkboxSelection
          disableSelectionOnClick
          onRowClick={handleRowClick}
          selectionModel={selectedRow}
          onSelectionModelChange={handleSelectionModelChange}
          scrollbarSize={10}
          baseTooltip={true}
          components={{
            Toolbar,
          }}
        // headerTooltip: column.headerName
        />

        {/* Modal for editing line orders */}
        {fields && (
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={() => handleEditModal(null)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
            className="custom-modal edit-modal"
          >
            <Fade in={!!fields}>
              <Box>
                <form onSubmit={handleSubmitUpdateLineOrder}>
                  <Box className="modal-body">
                    <a
                      onClick={() => handleEditModal(null)}
                      className="close-btn"
                    >
                      <CloseIcon className="icon" />
                    </a>
                    <Typography className="main-title" component="h2">
                      Update Line Order
                    </Typography>
                    <Grid container spacing={2}>
                      <Box sx={{
                        padding: "20px"
                      }}>

                        <LineOrderPropertiesComponent
                          isDisabeld={true}
                          fields={fields}
                          setFields={setFields}
                        />
                      </Box>
                      <Grid item xs={12}>
                        <div className="tool-bar">
                          <FormControl>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue={fields.color}
                              className="colorPlate"
                              style={{ display: "flex", flexDirection: "row" }}
                              value={fields.color}
                              onChange={handleInput}
                              name="color"
                            >
                              {[
                                { color: "red", number: "1" },
                                { color: "yellow", number: "2" },
                                { color: "purple", number: "3" },
                                { color: "green", number: "4" },
                                { color: "black", number: "5" },
                                { color: "skyblue", number: "6" },
                                { color: "sceen", number: "7" },
                                { color: "darkpurple", number: "8" },
                                { color: "pink", number: "9" },
                              ].map(({ color, number }) => {
                                const isSelected = fields.color === color;
                                return (
                                  <FormControlLabel
                                    key={color}
                                    value={color}
                                    // control={<Radio />}
                                    label={number}
                                    className={`colorOption ${color}`}
                                    style={{
                                      margin: 0,
                                      border: isSelected
                                        ? "2px solid black"
                                        : "2px solid transparent",
                                    }} // Override default margin
                                    labelPlacement="bottom"
                                    control={
                                      <Radio style={{ display: "none" }} />
                                    } // Hide the actual radio button
                                  />
                                );
                              })}
                            </RadioGroup>
                          </FormControl>

                          <div style={{ display: "flex", gap: 15 }}>
                            {auth.type === "admin" || auth.type === "suadmin"&&
                              fields.order_status === ORDER_STATUS.HOLD && (
                                <>
                                  <div
                                    className="action-icon-btn editBtn"
                                    onClick={() =>
                                      handleForceAcceptModal(fields)
                                    }
                                  >
                                    <Tooltip title="Force Accept">
                                      <IconButton>
                                        <AdsClickIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </div>

                                  <div
                                    className="action-icon-btn editBtn"
                                    onClick={() => handleApproveModal(fields)}
                                  >
                                    <Tooltip title="Approve Order">
                                      <IconButton>
                                        <CheckCircleOutlineIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </>
                              )}
                          </div>
                        </div>
                      </Grid>
                      {(auth.type === "admin" || auth.type === "suadmin") &&
                        fields.order_status === ORDER_STATUS.HOLD &&
                        editFieldConfigs.map(
                          (
                            {
                              label,
                              valueKey,
                              type,
                              disabled = false,
                              options,
                            },
                            index
                          ) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                              {type === "select" ? (
                                <FormControl fullWidth>
                                  <InputLabel id={valueKey}>
                                    {label || ""}
                                  </InputLabel>
                                  <Select
                                    labelId={valueKey}
                                    name={valueKey}
                                    label={valueKey}
                                    id="demo-multiple-checkbox"
                                    value={fields[valueKey]}
                                    onChange={handleInput}
                                  >
                                    {options?.map((name) => {
                                      return (
                                        <MenuItem
                                          key={name}
                                          value={name}
                                          style={{ padding: "4px" }}
                                        >
                                          {name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              ) : (
                                <TextField
                                  type={type}
                                  label={label}
                                  fullWidth
                                  disabled={disabled}
                                  variant="outlined"
                                  style={{ marginBottom: "10px" }}
                                  value={fields[valueKey]}
                                  onChange={handleInput}
                                  name={valueKey}
                                />
                              )}
                            </Grid>
                          )
                        )}
                      {(auth.type === "admin" || auth.type === "suadmin") &&
                        fields.order_status !== ORDER_STATUS.HOLD &&
                        editNonHoldFieldConfigs.map(
                          (
                            {
                              label,
                              valueKey,
                              type,
                              disabled = false,
                              options,
                            },
                            index
                          ) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                              {type === "select" ? (
                                <FormControl fullWidth>
                                  <InputLabel id={valueKey}>
                                    {label || ""}
                                  </InputLabel>
                                  <Select
                                    disabled={(auth.type == "admin" && label == "Invoice Status")}
                                    labelId={valueKey}
                                    name={valueKey}
                                    label={valueKey}
                                    id="demo-multiple-checkbox"
                                    value={fields[valueKey]}
                                    onChange={handleInput}
                                  >
                                    {options?.map((name) => {
                                      return (
                                        <MenuItem
                                          value={name}
                                          style={{ padding: "4px" }}
                                        >
                                          {name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              ) : (
                                <TextField
                                  type={type}
                                  label={label}
                                  fullWidth
                                  disabled={disabled}
                                  variant="outlined"
                                  style={{ marginBottom: "10px" }}
                                  value={fields[valueKey]}
                                  onChange={handleInput}
                                  name={valueKey}
                                />
                              )}
                            </Grid>
                          )
                        )}
                      {auth.type === "customer" &&
                        fields.order_status === ORDER_STATUS.HOLD &&
                        editCustomerFieldsConfigs.map(
                          (
                            {
                              label,
                              valueKey,
                              type,
                              disabled = false,
                              options,
                            },
                            index
                          ) => (
                            <Grid item xs={12} key={index}>
                              {type === "select" ? (
                                <FormControl fullWidth>
                                  <InputLabel id={valueKey}>
                                    {label || ""}
                                  </InputLabel>
                                  <Select
                                    labelId={valueKey}
                                    name={valueKey}
                                    label={valueKey}
                                    id="demo-multiple-checkbox"
                                    value={fields[valueKey]}
                                    onChange={handleInput}
                                  >
                                    {options?.map((name) => {
                                      return (
                                        <MenuItem
                                          key={name}
                                          value={name}
                                          style={{ padding: "4px" }}
                                        >
                                          {name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              ) : (
                                <TextField
                                  type={type}
                                  label={label}
                                  fullWidth
                                  disabled={disabled}
                                  variant="outlined"
                                  style={{
                                    marginBottom: "10px",
                                    display: "block",
                                  }}
                                  value={fields[valueKey]}
                                  onChange={handleInput}
                                  name={valueKey}
                                />
                              )}
                            </Grid>
                          )
                        )}
                    </Grid>
                    <Box className="modal-footer">
                      <Button
                        className="btn btn-outline-primary"
                        onClick={() => handleEditModal(null)}
                      >
                        Cancel
                      </Button>
                      <Button className="btn btn-primary" type="submit">
                        {isLineOrderUpdating ? "Updating..." : "Update"}
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Fade>
          </Modal>
        )}

        {/*Factory Add Note */}
        {factoryNote && (
          <PupringNote
            submitNote={(e) => handleSubmitfactoryNote(e)}
            title={"Add Factory Note"}
            handleModal={() => handleFactoryNoteModal(null)}
            handleField={(e) => setFactoryNoteField(e.target.value)}
            field={factoryNoteField}
            isFade={factoryNote}
          />
        )}

        {/*Remarks Add Note */}
        {remarksNote && (
          <PupringNote
            submitNote={(e) => handleSubmitremarksNote(e)}
            title={"Add Remark Note"}
            handleModal={() => handleRemarksNoteModal(null)}
            handleField={(e) => setRemarksNoteField(e.target.value)}
            field={remarksNoteField}
            isFade={remarksNote}
          />
        )}

        {/*Customer Add Note */}

        {customerNote && (
          <PupringNote
            submitNote={(e) => handleSubmitcustomerNote(e)}
            title={"Add Customer Note"}
            handleModal={() => handleCustomerNoteModal(null)}
            handleField={(e) => setCustomerNoteField(e.target.value)}
            field={customerNoteField}
            isFade={customerNote}
          />
        )}



        {forceAccept && (
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={() => handleForceAcceptModal(null)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
            className="custom-modal delete-modal"
          >
            <Fade in={!!forceAccept}>
              <Box>
                <Box className="modal-body">
                  <a
                    onClick={() => handleForceAcceptModal(null)}
                    className="close-btn"
                  >
                    <CloseIcon className="icon" />
                  </a>
                  <Typography className="main-title" component="h2">
                    Force Accept Order
                  </Typography>
                  <Typography component="p">
                    This {forceAccept.po} will be Submitted without any
                    validaion.
                  </Typography>
                  <Box className="modal-footer">
                    <Button
                      className="btn btn-outline-primary"
                      disabled={loadingForceAccept}
                      onClick={() => handleForceAcceptModal(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn btn-outline-danger"
                      disabled={loadingForceAccept}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        width: loadingForceAccept ? "120px" : "90px",
                      }}
                      onClick={() => handleForceAccept()}
                    >
                      Procced
                      {loadingForceAccept ? (
                        <CircularProgress color="inherit" className="hw-12" />
                      ) : (
                        <></>
                      )}
                    </Button>
                  </Box>
                  {forceAcceptError && (
                    <Typography
                      component="p"
                      color={"red"}
                      style={{ textAlign: "center" }}
                    >
                      {forceAcceptError}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Fade>
          </Modal>
        )}

        {forceAcceptSuccess && (
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={() => setForceAcceptSuccess(null)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
            className="custom-modal delete-modal"
          >
            <Fade in={!!forceAcceptSuccess}>
              <Box>
                <Box className="modal-body">
                  <a
                    onClick={() => setForceAcceptSuccess(null)}
                    className="close-btn"
                  >
                    <CloseIcon className="icon" />
                  </a>
                  <Typography className="main-title" component="h2">
                    Success
                  </Typography>
                  <Typography component="p">{forceAcceptSuccess}</Typography>
                  <Box
                    className="modal-footer"
                    style={{ marginBottom: "0px !important" }}
                  >
                    <Button
                      className="btn btn-outline-primary"
                      onClick={() => setForceAcceptSuccess(null)}
                    >
                      Ok
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Modal>
        )}

        {approveOrderError && (
          <ErrorModal
            reason={approveOrderError}
            handleErrorModal={() => setApproveOrderError(null)}
          />
        )}
      </div>
      <AutohideSnackbar open={snackbar.open} message={snackbar.message} onClose={() => setSnackbar({ open: false, message: "" })} />
    </>
  );
};

export default PupringTable;
