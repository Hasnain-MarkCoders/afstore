import {
  Box,
  Button,
  Fade,
  Modal,
  TextField,
  Typography,
  TextareaAutosize,
  Backdrop,
  Grid,
  Tooltip,
  IconButton,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import * as React from "react";
import { useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import API from "../../api/api";
import CloseIcon from "@mui/icons-material/Close";
import { useRef } from "react";
import { useSelector } from "react-redux";
import AutohideSnackbar from "../../components/snackbar/Snackbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { GridCloseIcon } from "@mui/x-data-grid";
import { DataGridPro } from "@mui/x-data-grid-pro";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { TicketListEditFieldConfigs , TicketListEditNonHoldFieldConfigs, TicketListEditCustomerFieldsConfigs, filterFields, getColor} from "../../Utils/Utils";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
const formattedDateTime = (date) => {
  const dateTime = new Date(date);
  const formattedDate = dateTime.toLocaleDateString("en-US", {
    // year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedTime = dateTime.toLocaleTimeString(
    undefined,
    timeFormatOptions
  );

  const formatted = `${formattedDate} / ${formattedTime}`;
  return formatted;
};

function customSubstring(str, start, end) {
  if (str && str?.length > end) {
    return str.substring(start, end) + "...";
  } else {
    return str;
  }
}

export default function TicketList({
  rows,
  setPupringId,
  pupringId,
  setData,
  pageInfo,
  setPaginationModel,
  isLoading,
  setSelectedTag,
  isPaginationLoading=false
}) {
  const boolRef = useRef(false);
  const auth = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [fields, setFields] = useState(null);
  const [remarksNote, setRemarksNote] = useState("");
  const [remarksNoteField, setRemarksNoteField] = useState("");
  const [dynamicFormFields, setDynamicFormFields] = useState([]);
  const [propertyAddModal, setPropertyAddModal] = useState(false);
  const [forceAcceptSuccess, setForceAcceptSuccess] = useState(null);
  const [loadingForceAccept, setLoadingForceAccept] = useState(false);
  const [approveOrderError, setApproveOrderError] = useState(null);
  const [forceAcceptError, setForceAcceptError] = useState(null);
  const [forceAccept, setForceAccept] = useState(null);
  const [pair, setPair] = useState(null);
  const [factoryNote, setFactoryNote] = useState(null);
  const [factoryNoteField, setFactoryNoteField] = useState("");
  const [limit, setLimit] = useState(10);

  const handleSelect = React.useCallback(
    (value) => {
      if (pupringId === value._id) {
        setData(value);
      } else {
        setPupringId(value._id);
        setData(value);
      }
    },
    [pupringId, setData, setPupringId]
  );

  const handleLimitChange = (limit)=>{
    setPaginationModel(prev => {
      return {
        ...prev, // Spread the previous state
        ...{ 
          page:0,// Update the page property with the new page value
          pageSize: limit // Update the pageSize property with the new limit value
        }
      };
    });
  }
  const handleNextPage = (limit)=>{
    setPaginationModel(prev => {
      return {
        ...prev, // Spread the previous state
        ...{
          page: ++pageInfo.page, // Update the page property with the new page value
          pageSize: limit // Update the pageSize property with the new limit value
        }
      };
    });
  }

  const handleBackpage = (limit)=>{
    setPaginationModel(prev => {
      return {
        ...prev, // Spread the previous state
        ...{
          page: --pageInfo.page, // Update the page property with the new page value
          pageSize: limit // Update the pageSize property with the new limit value
        }
      };
    });
  }

  const handleApiResponse = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
     filterFields(pageInfo, setPaginationModel, boolRef);
    boolRef.current = !boolRef.current;
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const ticketToClick = rows.find((value) => value._id === pupringId);
      if (ticketToClick) {
        handleSelect(ticketToClick);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [rows, pupringId, handleSelect]);

  

  const getWaybill = (id) => {
    API.post(`/factory/place-order-to-yun-express`, {
      order_id: [id],
    })
      .then((response) => {
        handleApiResponse("Waybill generated successfully!");
      })
      .catch((error) => {
        handleApiResponse("Error generating waybill!", "red");
      });
  };
  const generateLabel = (po_number) => {
    const po = [po_number];
    API.post(`/admin/generate-label`, po)
      .then((response) => {
        handleApiResponse("Label generated successfully!");
      })
      .catch((error) => {
        handleApiResponse("Error generating label!");
      });
  };
  const handleCancelOrder = (id) => {
    const orderId = [id];
    API.post(`/admin/cancel-line-orders`, { order_ids: orderId }).then(
      (response) => {
        handleApiResponse("Order cancelled successfully!");
      }
    );
  };

  const placeOrderOnHold = (ids) => {
    API.post(`/admin/hold-orders`, {
      order_id: ids,
    })
      .then((response) => {
        handleApiResponse("Order placed on hold!");
      })
      .catch((error) => {
        handleApiResponse("Error placing order on hold!");
      });
  };

  const handlePlaceOrder = (id) => {
    API.post(`/factory/place-order`, {
      order_ids: [id],
    })
      .then((response) => {
        handleApiResponse("Order placed successfully!");
      })
      .catch((error) => {
        handleApiResponse("Error placing order!");
      });
  };

  const handleCloseTicket = (id) => {
    API.post(`/customer/close-ticket`, {
      order_id: id,
    }).then((response) => {
      handleApiResponse("Ticket closed successfully!");
    });
  };
  const handleSubmitUpdateLineOrder = async (e) => {
    e.preventDefault();
    API.post(`/${auth?.type}/edit-line-order`, {
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
      handleEditModal(null);
       filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    });
  };

  const handleFactoryNoteModal = (data) => {
    setFactoryNote(data);
    setFactoryNoteField("");
  };

  const handleSubmitremarksNote = async (e) => {
    e.preventDefault();

    API.post(`/admin/add-note`, {
      order_id: remarksNote?._id,
      note: remarksNoteField,
    }).then((response) => {
      handleRemarksNoteModal(null);
       filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    });
  };

  // Handle form submission for updating line order
  const handleSubmitfactoryNote = async (e) => {
    e.preventDefault();

    API.post(`/factory/add-note`, {
      id: factoryNote?._id,
      note: factoryNoteField,
    }).then((response) => {
      handleFactoryNoteModal(null);
       filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    });
  };


  const handleRemarksNoteModal = (data) => {
    setRemarksNote(data);
    setRemarksNoteField("");
  };
  // Handle edit modal for line orders
  const handleEditModal = async (data) => {
    try {
      const response = await API.get(`${auth.type}/sku/get`, {
        params: {
          name: [data?.name],
        },
      });
      setPair(response.data.skus[0].properties.pair);
    } catch (error) {
      if (error?.response?.status === 480) {
        navigate("/login");
      }
    }
    setFields(data);
  };

  // Handle input change in the edit modal
  const handleInput = (e) => {
    const { name, value } = e?.target;
    setFields((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    setDynamicFormFields(
      Array.from({ length: pair }, () => ({ name: "", value: "" }))
    );
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

  // force accept
  const handleForceAcceptModal = (data) => {
    setForceAccept(data);
  };
  const handleForceAccept = () => {
    setLoadingForceAccept(true);
    API.post(`/admin/force-accept`, {
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
    console.log("edit btn from ticketlist")
    await API.post(`/admin/direct-approve`, {
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

  const renderDynamicFormFields = () => {
    return dynamicFormFields.map((field, index) => (
      <div key={index}>
        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          value={field.name}
          onChange={(e) => handleFieldChange(index, "name", e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Value"
          fullWidth
          variant="outlined"
          value={field.value}
          onChange={(e) => handleFieldChange(index, "value", e.target.value)}
          style={{ marginBottom: "10px" }}
        />
      </div>
    ));
  };

  const handlePropertyAdd = async (e) => {
    e.preventDefault();

    // Map dynamicFormFields to the desired format for the API request
    const propertiesToAdd = dynamicFormFields.map((field) => ({
      customizedContent: field.name,
      url: field.value,
    }));

    try {
      const response = await API.post("/customer/add-missing-name", {
        order_id: fields._id,
        properties: propertiesToAdd,
      });
      // Reset states and close the modal after successful addition
      setPropertyAddModal(false);
      setDynamicFormFields([]);
       filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    } catch (error) {
    }
  };



  const [propertyFields, setPropertyFields] = useState(null);
  const handleInputProperties = (e) => {
    const { name, value } = e?.target;
    setPropertyFields((p) => ({ ...p, [name]: value }));
  };
  const handleSubmitUpdateProperties = async (e) => {
    e.preventDefault();

    API.post("/customer/add-missing-name", {
      order_id: fields?._id,
      properties: [propertyFields],
    }).then((response) => {
      setPropertyFields(null);
      handleEditModal(null);
       filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    });
  };

  let propertiesColumns = [];
  if (
    fields?.properties &&
    (fields?.properties[0]?.name || fields?.properties[0]?.value)
  ) {
    propertiesColumns = [
      {
        field: "name",
        headerName: "Name",
        minWidth: 100,
        flex: 1,
        renderCell: (params) => {
          return params.row?.name && <div className="">{params.row?.name}</div>;
        },
      },
      {
        field: "value",
        headerName: "Value",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {

          return params.row?.value?.startsWith("http") ? (
            <Link
              to={params.row?.value}
              className={`cellWithStatus status-btn`}
              target="blank"
            >
              View Image
            </Link>
          ) : (
            params.row?.value
          );
        },
      },
    ];
  } else if (
    fields?.properties &&
    (fields?.properties[0]?.customizedContent ||
      (fields?.properties && fields?.properties[0]?.url))
  ) {
    propertiesColumns = [
      {
        field: "customizedContent",
        headerName: "Name",
        minWidth: 100,
        flex: 1,
        renderCell: (params) => {
          return (
            params.row?.customizedContent && (
              <div className="">{params.row?.customizedContent}</div>
            )
          );
        },
      },
      {
        field: "url",
        headerName: "Value",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {
          return params.row?.url && params.row?.url?.startsWith("http") ? (
            <Link
              to={params.row.url}
              className={`cellWithStatus status-btn`}
              target="blank"
            >
              View Image
            </Link>
          ) : (
            params.row.url
          );
        },
      },
    ];
  } else {
    propertiesColumns = [];
  }

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
            <div
              className="action-icon-btn editBtn"
              disabled={
                params.row.name === "" ||
                params.row.customizedContent === "" ||
                params.row.value === "" ||
                params.row.url === ""
                  ? false
                  : true
              }
            >
              <Tooltip title="Edit">
                <IconButton
                  disabled={
                    params.row.name === "" ||
                    params.row.customizedContent === "" ||
                    params.row.value === "" ||
                    params.row.url === ""
                      ? false
                      : true
                  }
                  onClick={() => setPropertyFields(params.row)}
                  id="edit-field"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>{
        isPaginationLoading?<Box sx={{width:"100%", height:"100%", display:"grid", placeContent:"center"}}><CircularProgress/></Box>:
        <>
      {rows.map((value, index) => (
        <div
          className={`ticket-list-item ${
            value._id === pupringId ? "active" : ""
          }`}
          key={index}
          onClick={() => {
            handleSelect(value);
            setSelectedTag(null);
          }}
          style={{ background: getColor(value.tag_red, value.tag_blue) }}
        >
          <div>
            <span title={value.po} className="name">
              {customSubstring(value.po, 0, 15)}
            </span>
            <span
              className={`selected-color ${value?.color}`}
              //  style={{background: value?.color}}
            ></span>
          </div>
          <div>
            <span className="last-msg" title={value.name}>
              {customSubstring(value.name, 0, 30)}
            </span>
          </div>
          <div>
            {/* <span className="">
              {customSubstring(value?.customer_note[0]?.message, 0, 20)}
            </span> */}
            <span className="sub-values">
              {customSubstring(value?.customer_note[0]?.message, 0, 20)}
            </span>

            {/* <span className="">{customSubstring(value?.customer_note[0]?.tag, 0, 20)}</span> */}
            {/* <span>{formattedDateTime(value?.date)}</span>
             */}
            <span className="sub-values">{formattedDateTime(value?.date)}</span>
          </div>
          <div></div>
          <div>
            {/* <span
              className={
                value?.customer_note?.tag === "blue"
                  ? "note-type-blue" : value?.customer_note?.tag === "red"
                  ? "note-type-red" : "note-type-white"
              }
            >
              {customSubstring(value?.customer_note[0]?.tag, 0, 20)}
            </span> */}
            <span className="sub-values">
              {customSubstring(value?.customer_note[0]?.tag, 0, 20)}
            </span>

            <span>
              <div className="cellAction">
                <div className="ticket-dropdown">
                  <div className="dropbtn">
                    <MoreVertIcon />
                  </div>
                  <ul className="dropdown-contents">
                    {(auth.type === "admin"||auth.type === "suadmin" || auth.type === "customer") && (
                      <>
                        <li>
                          <Button onClick={() => handleEditModal(value)}>
                            Edit Order 
                          </Button>
                        </li>
                        <li>
                          <Button onClick={() => handleCloseTicket(value?._id)}>
                            Close Ticket
                          </Button>
                        </li>
                        </>
                        )}
                        {(auth.type == "admin" ||auth.type == "suadmin")&& (
                          <>
                        <li>
                          <Button onClick={() => handleRemarksNoteModal(value)}>
                            Add Remarks
                          </Button>
                        </li>
                        <li>
                          <Button onClick={() => handleFactoryNoteModal(value)}>
                            Add Factory Note
                          </Button>
                        </li>
                        <li>
                          <Button onClick={() => placeOrderOnHold(value?._id)}>
                            Put On Hold
                          </Button>
                        </li>
                        <li>
                          <Button onClick={() => handleCancelOrder(value?._id)}>
                            Cancel Order
                          </Button>
                        </li>
                        <li>
                          <Button onClick={() => getWaybill(value?._id)}>
                            Get Waybill
                          </Button>
                        </li>
                        <li>
                          <Button onClick={() => generateLabel(value?.po)}>
                            Get Label
                          </Button>
                        </li>
                        <li>
                          <Button onClick={() => handlePlaceOrder(value?._id)}>
                            Place Order
                          </Button>
                        </li>
                        
                      </>
                    )}
                  </ul>
            
                </div>
              </div>
            </span>
          </div>
        </div>
      ))}</>
    }
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
                    <Grid xs="12">
                      {fields?.properties && fields?.properties.length === 0 ? (
                        dynamicFormFields.length !== 0 && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "0 20px",
                            }}
                          >
                            <h2>Add Fields</h2>
                            <div className="action-icon-btn editBtn">
                              <Tooltip title="Add Field">
                                <IconButton
                                  onClick={() => setPropertyAddModal((e) => !e)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        )
                      ) : (
                        <div
                          style={{
                            height: "300px",
                            maxWidth: "1000px",
                            margin: "20px auto",
                            padding: "20px",
                          }}
                        >
                          <DataGridPro
                            className="datagrid"
                            loading={isLoading}
                            // getRowId={(rows) => rows?.customizedContent ? rows?.customizedContent : rows?.name}
                            getRowId={(row) =>
                              row.id ? row.id : Math.random().toString()
                            }
                            rows={fields?.properties}
                            columns={[
                              ...propertiesActionColumn,
                              ...propertiesColumns,
                            ]}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                          />
                        </div>
                      )}
                    </Grid>
                    <Grid xs={12}>
                      <div className="tool-bar">
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue={fields.color}
                          className="colorPlate"
                          style={{ display: 'flex', flexDirection: 'row' }}
                          value={fields.color}
                          onChange={handleInput}
                          name="color"
                        >
                          {[
                            { color: 'red', number: '1' },
                            { color: 'yellow', number: '2' },
                            { color: 'purple', number: '3' },
                            { color: 'green', number: '4' },
                            { color: 'black', number: '5' },
                            { color: 'skyblue', number: '6' },
                            { color: 'sceen', number: '7' },
                            { color: 'darkpurple', number: '8' },
                            { color: 'pink', number: '9' },
                          ].map(({ color, number }) => {
                            const isSelected = fields.color === color;
                            return <FormControlLabel
                              key={color}
                              value={color}
                              // control={<Radio />}
                              label={number}
                              className={`colorOption ${color}`}
                              style={{ margin: 0, border: isSelected ? '2px solid black' : '2px solid transparent' }} // Override default margin
                              labelPlacement="bottom"
                              control={<Radio style={{ display: 'none' }} />} // Hide the actual radio button
                            />
                          })}
                        </RadioGroup>
                      </FormControl>

                        <div style={{ display: "flex", gap: 15 }}>
                          {auth?.type === "admin" &&
                            fields.order_status === "Hold" && (
                              <>
                                <div
                                  className="action-icon-btn editBtn"
                                  onClick={() => handleForceAcceptModal(fields)}
                                >
                                  <Tooltip title="Force Accept">
                                    <IconButton>
                                      <AdsClickIcon />
                                    </IconButton>
                                  </Tooltip>
                                </div>

                                <div
                                  className="action-icon-btn editBtn hello-from-hasnain"
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
                    {(auth.type === "admin"||auth.type === "suadmin") &&
                      fields.order_status === "Hold" &&
                      TicketListEditFieldConfigs.map(
                        (
                          { label, valueKey, type, disabled = false, options },
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
                    {(auth.type === "admin"||auth.type === "suadmin") &&
                      fields.order_status !== "Hold" &&
                      TicketListEditNonHoldFieldConfigs.map(
                        (
                          { label, valueKey, type, disabled = false, options },
                          index
                        ) => (
                          <Grid item xs={12} md={6} lg={4} key={index}>
                            {type === "select" ? (
                              <FormControl fullWidth>
                                <InputLabel id={valueKey}>
                                  {label || ""}
                                </InputLabel>
                                <Select
                                  disabled={(auth.type=="admin" && label=="Invoice Status")}
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
                      fields.order_status === "Hold" &&
                      TicketListEditCustomerFieldsConfigs.map(
                        (
                          { label, valueKey, type, disabled = false, options },
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
                      Update
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Fade>
        </Modal>
      )}
      {propertyFields && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={true}
          onClose={() => setPropertyFields(null)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
          className="custom-modal"
        >
          <Fade in={!!propertyFields}>
            <Box>
              <form onSubmit={handleSubmitUpdateProperties}>
                <Box className="modal-body">
                  <a
                    onClick={() => setPropertyFields(null)}
                    className="close-btn"
                  >
                    <CloseIcon className="icon" />
                  </a>
                  <Typography className="main-title" component="h2">
                    Edit Properties
                  </Typography>
                  <TextField
                    type="text"
                    label={
                      propertyFields.name || propertyFields.name === ""
                        ? "Name"
                        : "Customized Content"
                    }
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: "10px" }}
                    value={
                      propertyFields.name || propertyFields.name === ""
                        ? propertyFields.name
                        : propertyFields.customizedContent
                    }
                    onChange={handleInputProperties}
                    name={
                      propertyFields.name || propertyFields.name === ""
                        ? "name"
                        : "customizedContent"
                    }
                  />
                  <TextField
                    type="text"
                    label={
                      propertyFields.value || propertyFields.value === ""
                        ? "Value"
                        : "URL"
                    }
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: "10px" }}
                    value={
                      propertyFields.value || propertyFields.value === ""
                        ? propertyFields.value
                        : propertyFields.url
                    }
                    onChange={handleInputProperties}
                    name={
                      propertyFields.value || propertyFields.value === ""
                        ? "value"
                        : "url"
                    }
                  />

                  <Box className="modal-footer">
                    <Button
                      className="btn btn-outline-primary"
                      onClick={() => setPropertyFields(null)}
                    >
                      Cancel
                    </Button>
                    <Button className="btn btn-primary" type="submit">
                      Update
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Fade>
        </Modal>
      )}
      {factoryNote && (
        <Modal
          open={true}
          onClose={() => handleFactoryNoteModal(null)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="list-modal"
        >
          <Fade in={!!factoryNote}>
            <Box component={"div"}>
              <Box component={"div"} className="modal-header">
                <Typography className="main-title" component="h2">
                  Add Note
                </Typography>
                <a
                  onClick={() => handleFactoryNoteModal(null)}
                  className="close-btn"
                >
                  <CloseIcon className="icon" />
                </a>
              </Box>
              <form onSubmit={handleSubmitfactoryNote}>
                <Box component={"div"} className="modal-body">
                  <TextField
                    type="text"
                    onChange={(e) => setFactoryNoteField(e.target.value)}
                    fullWidth
                    InputProps={{
                      inputComponent: TextareaAutosize,
                      rows: 3,
                    }}
                    value={factoryNoteField}
                    label="Enter note"
                    variant="outlined"
                  />
                </Box>
                <Box component={"div"} className="modal-footer">
                  <Button
                    className="btn btn-outline-primary"
                    onClick={() => handleFactoryNoteModal(null)}
                  >
                    Cancel
                  </Button>
                  <Button className="btn btn-primary" type="submit">
                    Add Note
                  </Button>
                </Box>
              </form>
            </Box>
          </Fade>
        </Modal>
      )}
      {remarksNote && (
        <Modal
          open={true}
          onClose={() => handleRemarksNoteModal(null)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="list-modal"
        >
          <Fade in={!!remarksNote}>
            <Box component={"div"}>
              <Box component={"div"} className="modal-header">
                <Typography className="main-title" component="h2">
                  Remarks Note Add
                </Typography>
                <a
                  onClick={() => handleRemarksNoteModal(null)}
                  className="close-btn"
                >
                  <GridCloseIcon className="icon" />
                </a>
              </Box>
              <form onSubmit={handleSubmitremarksNote}>
                <Box component={"div"} className="modal-body">
                  <TextField
                    type="text"
                    onChange={(e) => setRemarksNoteField(e.target.value)}
                    fullWidth
                    InputProps={{
                      inputComponent: TextareaAutosize,
                      rows: 3,
                    }}
                    value={remarksNoteField}
                    label="Enter note"
                    variant="outlined"
                  />
                </Box>
                <Box component={"div"} className="modal-footer">
                  {/* <Button className="btn btn-outline-primary" onClick={() => handleCustomerNoteModal(null)}>Cancel</Button> */}
                  <Button className="btn btn-primary" type="submit">
                    Add Remarks
                  </Button>
                </Box>
              </form>
            </Box>
          </Fade>
        </Modal>
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
                  This {forceAccept.po} will be Submitted without any validaion.
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
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={true}
          onClose={() => setApproveOrderError(null)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
          className="custom-modal delete-modal"
        >
          <Fade in={!!approveOrderError}>
            <Box>
              <Box className="modal-body">
                <a
                  onClick={() => setApproveOrderError(null)}
                  className="close-btn"
                >
                  <CloseIcon className="icon" />
                </a>
                <Typography className="main-title" component="h2">
                  Error
                </Typography>
                <Typography component="p">{approveOrderError}</Typography>
                <Box
                  className="modal-footer"
                  style={{ marginBottom: "0px !important" }}
                >
                  <Button
                    className="btn btn-outline-primary"
                    onClick={() => setApproveOrderError(null)}
                  >
                    Ok
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
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
        <Fade in={!!propertyAddModal}>
          <Box>
            <form onSubmit={handlePropertyAdd}>
              <Box className="modal-body">
                <a
                  onClick={() => setPropertyAddModal((e) => !e)}
                  className="close-btn"
                >
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
      <AutohideSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
      {/* {rows && pageInfo?.totalRowCount > pageInfo?.pageSize && ( */}
        <div className="data-load">
          {/* <Button
            className="btn btn-primary"
            disabled={isLoading}
            onClick={() =>filterFields(pageInfo, setPaginationModel, boolRef, 10)}
          >
            See More{isLoading && "..."}
          </Button> */}
          <Box sx={{position:"sticky", bottom:"0px"}}>
          <CustomPagination 
          isLoading={isPaginationLoading}
          handleLimitChange={handleLimitChange}
          setLimit={setLimit}
          limit={limit}
          total={pageInfo?.totalRowCount}
          page={pageInfo.page+1}
          pageSize={pageInfo?.pageSize}
          isNext={rows && pageInfo?.totalRowCount > pageInfo?.pageSize ? false : true}
          isBack={ pageInfo?.page<1}
          handleNextPage={handleNextPage} 
          handleBackpage={handleBackpage}
           />
          </Box>
        </div>
      {/* )} */}
    </>
  );
}
