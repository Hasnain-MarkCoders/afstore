import {
  Box,
  Button,
  Fade,
  Modal,
  TextField,
  Typography,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import API from "../../api/api";
import CloseIcon from "@mui/icons-material/Close";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { TicketListEditFieldConfigs, TicketListEditNonHoldFieldConfigs, TicketListEditCustomerFieldsConfigs, filterFields, getColor, ORDER_STATUS } from "../../Utils/Utils";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import PupringNote from "../../components/Modals/PupringTableModals/PupringNote";
import LineOrderPropertiesComponent from "../../components/LineOrderPropertiesComponent/LineOrderPropertiesComponent";
import useAlertStore from "../../zustand/alert";
const formattedDateTime = (date) => {
  const dateTime = new Date(date);
  const formattedDate = dateTime.toLocaleDateString("en-US", {
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
  isPaginationLoading = false
}) {
  const boolRef = useRef(false);
  const auth = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [fields, setFields] = useState(null);
  const [remarksNote, setRemarksNote] = useState("");
  const [remarksNoteField, setRemarksNoteField] = useState("");
  const [forceAcceptSuccess, setForceAcceptSuccess] = useState(null);
  const [loadingForceAccept, setLoadingForceAccept] = useState(false);
  const [approveOrderError, setApproveOrderError] = useState(null);
  const [forceAcceptError, setForceAcceptError] = useState(null);
  const [forceAccept, setForceAccept] = useState(null);
  const [factoryNote, setFactoryNote] = useState(null);
  const [factoryNoteField, setFactoryNoteField] = useState("");
  const [isLineOrderUpdating, setIsLineOrderUpdating] = useState(false)
  const {handleAlert} = useAlertStore()

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

  const handleLimitChange = (limit) => {
    setPaginationModel(prev => {
      return {
        ...prev, // Spread the previous state
        ...{
          page: 0,// Update the page property with the new page value
          pageSize: limit // Update the pageSize property with the new limit value
        }
      };
    });
  }
  const handleNextPage = (limit) => {
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

  const handleBackpage = (limit) => {
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

  const handleApiResponse = (message, isSuccess=true, isRefetch=false) => {
      handleAlert({
      isOpen:true,
      message,
      severity:isSuccess? "success":"error"
    }
    )
    if(isRefetch){
      filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    }
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
    let message =null
    API.post(`/factory/place-order-to-yun-express`, {
      order_id: [id],
    })
      .then((response) => {
      message =response.data?.message?? "Waybill generated successfully!"
        handleApiResponse(message, true , true);
      })
      .catch(error => {
        message = error?.response?.data?.message ?? error.message ?? "Error Generating Waybill!"
        handleApiResponse(message, false , false);

      })
  };
  const generateLabel = (po_number) => {
    let message = null
    const po = [po_number];
    API.post(`/admin/generate-label`, po)
      .then((response) => {
        message = response.data?.message??"Label generated successfully!"
        handleApiResponse(message, true, true);
      })
      .catch(error => {
        message =error?.response?.data?.message ?? error.message ?? "Error Generating Label!" 
        handleApiResponse(message, false, false);
      })
  };
  const handleCancelOrder = (id) => {
    let message = null
    const orderId = [id];
    API.post(`/${auth.type}/cancel-line-orders`, { order_ids: orderId }).then(
      (response) => {
        message =response.data?.message?? "Order cancelled successfully!"
        handleApiResponse(message, true, true);
      }
    ).catch(error => {
      message =error?.response?.data?.message ?? error.message ?? "Error Cancelling the Order!" 
        handleApiResponse(message, false, false);
    });
  };

  const placeOrderOnHold = (ids) => {
    let message = null
    API.post(`/${auth.type}/hold-orders`, {
      order_id: ids,
    })
      .then((response) => {
        message = response.data?.message??"Order placed on hold!"
        handleApiResponse(message, true, true);
      })
      .catch(error => {
        message = error?.response?.data?.message ?? error.message ?? "Error Placing Order ON Hold!" 
        handleApiResponse(message, false, false);
      })
  };

  const handlePlaceOrder = (id) => {
    let message = null
    API.post(`/factory/place-order`, {
      order_ids: [id],
    })
      .then((response) => {
        message =response.data?.message?? "Order placed successfully!"
        handleApiResponse(message, true, true);
      })
      .catch((error) => {
        message = error?.response?.data?.message ?? error.message ?? "Error Placing Order!"
        handleApiResponse(message, false, false);
      });
  };

  const handleCloseTicket = (id) => {
    let message = null
    API.post(`/customer/close-ticket`, {
      order_id: id,
    }).then((response) => {
      message = response.data?.message?? "Ticket closed successfully!"
      handleApiResponse(message, true, true);
    }).catch(error => {
      message = error?.response?.data?.message ?? error.message ?? "Error Closing Ticket!"
      handleApiResponse(message, false, false);
    })
  };
  const handleSubmitUpdateLineOrder = async (e) => {
    let message = null
    e.preventDefault();
    setIsLineOrderUpdating(true)
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
        message =response.data?.message?? "Line order updated"
      handleApiResponse(message, true, false);
      handleEditModal(null);
      filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    }).catch(error => {
      message = error?.response?.data?.message ?? error.message ?? "Error Editing Order!"
      handleApiResponse(message, false, false);

    }).finally(() => {
      setIsLineOrderUpdating(false)
    })
  };

  const handleFactoryNoteModal = (data) => {
    setFactoryNote(data);
    setFactoryNoteField("");
  };

  const handleSubmitremarksNote = async (e) => {
    let message = null
    e.preventDefault();

    return API.post(`/${auth.type}/add-note`, {
      order_id: remarksNote?._id,
      note: remarksNoteField,
    }).then((response) => {
      handleRemarksNoteModal(null);
      message = response.data?.message??"Note added successfully"
      handleApiResponse(message, true,false)
      filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    }).catch(error=>{
       message = error?.response?.data?.message ?? error.message ?? "Error submitting note"
      handleApiResponse(message, false, false)
    })
  };

  // Handle form submission for updating line order
  const handleSubmitfactoryNote = async (e) => {
    let message = null
    e.preventDefault();

    return API.post(`/factory/add-note`, {
      id: factoryNote?._id,
      note: factoryNoteField,
    }).then((response) => {
      handleFactoryNoteModal(null);
      message =response.data?.message?? "Note added successfully"
      handleApiResponse(message, true, false)
      filterFields(pageInfo, setPaginationModel, boolRef);
      boolRef.current = !boolRef.current;
    }).catch(error => {
      message = error?.response?.data?.message ?? error.message ?? "Error Adding Note!"
      handleApiResponse(message, false, false)
    })
  };


  const handleRemarksNoteModal = (data) => {
    setRemarksNote(data);
    setRemarksNoteField("");
  };
  // Handle edit modal for line orders
  const handleEditModal = async (data) => {
    let message = null
    try {
      setFields(data);
      const response = await API.get(`${auth.type}/sku/get`, {
        params: {
          name: [data?.name],
        },
      });
    } catch (error) {
      message = error?.response?.data?.message ?? error.message ?? "Error Editing SKU!"
      handleApiResponse(message, false, false)
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
    let message = null
    setLoadingForceAccept(true);
    API.post(`/${auth.type}/force-accept`, {
      order_ids: [forceAccept._id],
    })
      .then((response) => {
        setForceAcceptSuccess(response?.data?.message);
        handleForceAcceptModal(null);
        message = response.data?.message??"Force accepted successfully"
        handleApiResponse(message, true, false)
        filterFields(pageInfo, setPaginationModel, boolRef);
        boolRef.current = !boolRef.current;
      })
      .catch((error) => {
        message =error?.response?.data?.message ?? error.message ?? "Error Force Accepting Order!" 
      handleApiResponse(message, false, false)
        setForceAcceptError(error?.response?.data?.message);
      })
      .finally(() => {
        setLoadingForceAccept(false);
      });
  };

  // Approve
  const handleApproveModal = async (data) => {
    let message = null
    await API.post(`/${auth.type}/direct-approve`, {
      id: data._id,
    })
      .then((response) => {
        setForceAcceptSuccess(response?.data?.message);
        message = response.data?.message??"Direct approve successfully"
        handleApiResponse(message, true, false)

        filterFields(pageInfo, setPaginationModel, boolRef);
        boolRef.current = !boolRef.current;
      })
      .catch((error) => {
        setApproveOrderError(error?.response?.data?.message);
        message = error?.response?.data?.message ?? error.message ?? "Error Direct Approving the Order!"
        handleApiResponse(message, false, false)
      });
  };



  return (
    <>{
      isPaginationLoading ? <Box sx={{ width: "100%", height: "100%", display: "grid", placeContent: "center" }}><CircularProgress /></Box> :
        <>
          {rows.map((value, index) => (
            <div
              className={`ticket-list-item ${value._id === pupringId ? "active" : ""
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
                ></span>
              </div>
              <div>
                <span className="last-msg" title={value.name}>
                  {customSubstring(value.name, 0, 30)}
                </span>
              </div>
              <div>

                <span className="sub-values">
                  {customSubstring(value?.customer_note[0]?.message, 0, 20)}
                </span>
                <span className="sub-values">{formattedDateTime(value?.date)}</span>
              </div>
              <div></div>
              <div>

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
                        {(auth.type === "admin" || auth.type === "suadmin" || auth.type === "customer") && (
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
                        {(auth.type == "admin" || auth.type == "suadmin") && (
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
                    <Box sx={{
                      padding: "20px"
                    }}>

                      <LineOrderPropertiesComponent
                        isDisabeld={true}
                        fields={fields}
                        setFields={setFields}
                      />
                    </Box>
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
                          {auth.type === "admin" || auth.type === "suadmin"&&
                            fields.order_status === ORDER_STATUS.HOLD && (
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
                    {(auth.type === "admin" || auth.type === "suadmin") &&
                      fields.order_status === ORDER_STATUS.HOLD &&
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
                    {(auth.type === "admin" || auth.type === "suadmin") &&
                      fields.order_status !== ORDER_STATUS.HOLD &&
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

    
    
      <div className="data-load">
        <Box sx={{ position: "sticky", bottom: "0px" }}>
          <CustomPagination
            isLoading={isPaginationLoading}
            handleLimitChange={handleLimitChange}
            setLimit={setLimit}
            limit={limit}
            total={pageInfo?.totalRowCount}
            page={pageInfo.page + 1}
            pageSize={pageInfo?.pageSize}
            isNext={rows && pageInfo?.totalRowCount > pageInfo?.pageSize ? false : true}
            isBack={pageInfo?.page < 1}
            handleNextPage={handleNextPage}
            handleBackpage={handleBackpage}
          />
        </Box>
      </div>
    </>
  );
}
