import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ButtonGroup,
  Tooltip,
  Backdrop,
  Fade,
  Checkbox,
} from "@mui/material";
import { Link } from "react-router-dom";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import MultipleSelectCheckmarks from "./../multipleSelect";
import { useSelector } from "react-redux";
import "./../filter.scss";
import "./../../style.scss";
import API from "../../../api/api";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";
import { INVOICE_STATUS, ORDER_STATUS } from "../../../Utils/Utils";
const TicketSystemFilter = (props) => {
  const [wayBill, setWayBill] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openPOIDSModal, setOpenPOIDSModal] = useState(false);
  const [POIDS, SETPOIDS] = useState("");
  const [selectedDateType, setSelectedDateType] = useState("date");
  const [query, setQuery] = useState("");
  const [quickQuery, setQuickQuery] = useState("");
  const [short, setShort] = useState(false);
  const [status, setStatus] = useState([]);
  const [color, setColor] = useState([]);
  const [factoryColor, setFactoryColor] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [allRemarks, setAllRemarks] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [allAdminRemarks, setAllAdminRemarks] = useState(false);
  const [factoryNote, setFactoryNote] = useState("");
  const [allFactoryNote, setAllFactoryNote] = useState(false);
  const [customerNote, setCustomerNote] = useState("");
  const [allCustomerNote, setAllCustomerNote] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState([]);
  const [shareDocs, setShareDocs] = useState();
  const [shareDocsModal, setShareDocsModal] = useState(false);
  const [tagBlue, setTagBlue] = useState([]);
  const [tagRed, setTagRed] = useState([]);
  const [allTagBlue, setAllTagBlue] = useState(false);
  const [allTagRed, setAllTagRed] = useState(false);
  const boolRef = useRef(false);
  const [date, setDate] = useState({first_date:"", last_date:""})
  const [getTags, setGetTags] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/customer/get-tags`);
        setGetTags(response.data);
      } catch (error) {}
    };
    fetchData();
  }, []);

  const formattedDate = (date) => {
    const changeFormate = new Date(date);
    const dateFix = changeFormate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return dateFix === "Invalid Date" ? "" : dateFix;
  };

  const handleFilterSubmit = () => {
    props.setPaginationModel({
      po: query.split(/[ ,\n]+/),
      po_ids: POIDS.split(/[, \n]+/),
      multiple_order_status: status,
      order_status: props.pageInfo.order_status,
      invoice_status: invoiceStatus,
      selectedDateType: selectedDateType,
      first_date: formattedDate(date?.first_date) || "",
      last_date: formattedDate(date?.last_date) || "",
      name: quickQuery?.length > 0 ? quickQuery?.split(",") : [],
      color: color,
      factory_color: factoryColor,
      admin_remarks: adminRemarks,
      remarks: remarks,
      factory_note: factoryNote,
      customer_note: customerNote,
      all_admin_remarks: allAdminRemarks,
      all_remarks: allRemarks,
      all_factory_note: allFactoryNote,
      all_customer_note: allCustomerNote,
      all_tag_blue: allTagBlue,
      all_tag_red: allTagRed,
      all_tag: props?.getUpdatedData,
      tag_blue: tagBlue,
      tag_red: tagRed,
      bool: boolRef.current,
    });
    boolRef.current = !boolRef.current;
  };

  const auth = useSelector((state) => state.user);

  const handleModal = () => {
    setOpenModal((current) => !current);
  };
   const handlePOIDSModal = () => {
    setOpenPOIDSModal((current) => !current);
  };


  const handleSubmit = () => {
    props.setPaginationModel({
    po: query.split(/[ ,\n]+/),
      po_ids: POIDS.split(/[, \n]+/),
      multiple_order_status: status,
      order_status: props.pageInfo.order_status,
      invoice_status: invoiceStatus,
      selectedDateType: selectedDateType,
      first_date: formattedDate(date?.first_date) || "",
      last_date: formattedDate(date?.last_date) || "",
      name: quickQuery?.length > 0 ? quickQuery?.split(",") : [],
      color: color,
      factory_color: factoryColor,
      admin_remarks: adminRemarks,
      remarks: remarks,
      factory_note: factoryNote,
      customer_note: customerNote,
      all_admin_remarks: allAdminRemarks,
      all_remarks: allRemarks,
      all_factory_note: allFactoryNote,
      all_customer_note: allCustomerNote,
      all_tag_blue: allTagBlue,
      all_tag_red: allTagRed,
      all_tag: props?.getUpdatedData,
      tag_blue: tagBlue,
      tag_red: tagRed,
      bool: boolRef.current,
    });
    handleModal();
  };
    const handleSubmitPOIDSFIlTER = () => {
    props.setPaginationModel({
    po: query.split(/[ ,\n]+/),
      po_ids: POIDS.split(/[, \n]+/),
      multiple_order_status: status,
      order_status: props.pageInfo.order_status,
      invoice_status: invoiceStatus,
      selectedDateType: selectedDateType,
      first_date: formattedDate(date?.first_date) || "",
      last_date: formattedDate(date?.last_date) || "",
      name: quickQuery?.length > 0 ? quickQuery?.split(",") : [],
      color: color,
      factory_color: factoryColor,
      admin_remarks: adminRemarks,
      remarks: remarks,
      factory_note: factoryNote,
      customer_note: customerNote,
      all_admin_remarks: allAdminRemarks,
      all_remarks: allRemarks,
      all_factory_note: allFactoryNote,
      all_customer_note: allCustomerNote,
      all_tag_blue: allTagBlue,
      all_tag_red: allTagRed,
      all_tag: props?.getUpdatedData,
      tag_blue: tagBlue,
      tag_red: tagRed,
      bool: boolRef.current,
    });
    handlePOIDSModal();
  };

  const handleReset = async () => {
    localStorage.removeItem("savedId");
    if (props?.setSavedItem) {
      props?.setSavedItem([]);
    }
    setDate({first_date:"", last_date:""})
    setSelectedDateType("date");
    setQuickQuery("");
    setQuery("");
    SETPOIDS("")
    setInvoiceStatus([]);
    setStatus([]);
    setColor([]);
    setFactoryColor([]);
    setAdminRemarks("");
    setRemarks("");
    setFactoryNote("");
    setCustomerNote("");
    setAllAdminRemarks(false);
    setAllRemarks(false);
    setAllFactoryNote(false);
    setAllCustomerNote(false);
    setTagBlue([]);
    setTagRed([]);
    setAllTagBlue(false);
    setAllTagRed(false);
    props.setUpdatedData(false);
    props.setPaginationModel({
      _id: [],
      order_status:
        props.pageInfo.order_status === "all"
          ? []
          : props.pageInfo.order_status,
      multiple_order_status: [],
      po: [],
      first_date: "",
      last_date: "",
      name: [],
      invoiceStatus: [],
      color: [],
      factory_color: [],
      remarks: "",
      admin_remarks: "",
      factory_note: "",
      customer_note: "",
      all_remarks: false,
      all_admin_remarks: false,
      all_factory_note: false,
      all_customer_note: false,
      all_tag_blue: false,
      all_tag_red: false,
      all_tag: false,
      tag_red: [],
      tag_blue: [],
      bool: boolRef.current,
    });
    boolRef.current = !boolRef.current;
  };

  useEffect((e) => {
    (auth?.type === "admin" || auth?.type === "customer") &&
      API.get(`/${auth?.type}/get-docs-link`).then((response) => {
        setShareDocs(response.data.docs);
      });
  }, []);

  const handleSubmitEditShareDocs = async (e) => {
    e.preventDefault();

    API.post(`/${auth?.type}/change-docs-link`, {
      docs_link: shareDocs,
    }).then((response) => {
      setShareDocsModal((e) => !e);
    });
  };

  useEffect(() => {
    handleFilterSubmit();
  }, [props?.getUpdatedData]);

  return (
    <div className="filterContainer">
      <Box component="form">
        <Box component="div" className="top-bar">
          <Box component="div">
            <TextField
              type="text"
              label="Name"
              variant="outlined"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
            />

                        <FormControl onClick={handlePOIDSModal}>
                          <InputLabel>Enter PoID </InputLabel>
                          <Select
                            labelId="Enter PoID"
                            value={!!POIDS ? POIDS?.split("\n") : POIDS}
                            label="Enter PoID"
                            // onChange={(e) => setWayBill(e?.target?.value)}
                            disabled
                            renderValue={(selected) => selected?.join(", ")}
                          >
                            <MenuItem value={POIDS}>{POIDS}</MenuItem>
                          </Select>
                        </FormControl>

            <FormControl onClick={handleModal}>
              <InputLabel>Enter Po Number</InputLabel>
              <Select
                labelId="Enter Po Number"
                value={!!query ? query?.split("\n") : query}
                label="Enter Po Number"
                onChange={(e) => setWayBill(e?.target?.value)}
                disabled
                renderValue={(selected) => selected?.join(", ")}
              >
                <MenuItem value={query}>{query}</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="demo-multiple-checkbox-label">
                Date Type
              </InputLabel>
              <Select
                label="Date Type"
                className="select-date-type"
                labelId="date-type-label"
                value={selectedDateType}
                onChange={(e) => setSelectedDateType(e.target.value)}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="submitted_date">Submitted Date</MenuItem>
                <MenuItem value="accepted_date">Accepted Date</MenuItem>
                <MenuItem value="in_production_date">
                  In Production Date
                </MenuItem>
                <MenuItem value="shipped_out_date">Shipped Out</MenuItem>
                {auth.type === "factory" ? null : (
                  <MenuItem value="last_comment_date">
                    Last Ticket Date
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <CustomDatePicker
            date={date?.first_date}
            setDate={setDate}
            name="first_date"
            />
          <CustomDatePicker
            date={date?.last_date}
            setDate={setDate}
            name="last_date"
            
            />
            <Modal
              open={openModal}
              onClose={handleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="list-modal"
            >
              <Box component={"div"}>
                <Box component={"div"} className="modal-header">
                  <Typography className="main-title" component="h2">
                    Enter Po Number
                  </Typography>
                  <a onClick={handleModal} className="close-btn">
                    <CloseIcon className="icon" />
                  </a>
                </Box>
                <Box component={"div"} className="modal-body">
                  <TextField
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    fullWidth
                    InputProps={{
                      inputComponent: TextareaAutosize,
                      rows: 3,
                    }}
                    value={query}
                    label="Quick query"
                    variant="outlined"
                  />
                </Box>
                <Box component={"div"} className="modal-footer">
                  <Button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setQuery("");
                      handleModal();
                      props.setPaginationModel({ po: [] });
                    }}
                  >
                    All Clear
                  </Button>
                  <Button className="btn btn-primary" onClick={handleSubmit}>
                    Query
                  </Button>
                </Box>
              </Box>
            </Modal>


                        <Modal
                          open={openPOIDSModal}
                          onClose={handlePOIDSModal}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                          className="list-modal"
                        >
                          <Box component={"div"}>
                            <Box component={"div"} className="modal-header">
                              <Typography className="main-title" component="h2">
                                Enter PoIds
                              </Typography>
                              <a onClick={handlePOIDSModal} className="close-btn">
                                <CloseIcon className="icon" />
                              </a>
                            </Box>
                            <Box component={"div"} className="modal-body">
                              <TextField
                                type="text"
                                onChange={(e) => SETPOIDS(e.target.value)}
                                fullWidth
                                InputProps={{
                                  inputComponent: TextareaAutosize,
                                  rows: 3,
                                }}
                                value={POIDS}
                                label="Quick query POIDS"
                                variant="outlined"
                              />
                            </Box>
                            <Box component={"div"} className="modal-footer">
                              <Button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                  SETPOIDS("");
                                  handlePOIDSModal();
                                  props.setPaginationModel({ po_ids: [] });
                                }}
                              >
                                All Clear
                              </Button>
                              <Button className="btn btn-primary" onClick={handleSubmitPOIDSFIlTER}>
                                Query
                              </Button>
                            </Box>
                          </Box>
                        </Modal>
            

            <MultipleSelectCheckmarks
              label="Invoice Status"
              checkValue={invoiceStatus}
              setCheckValue={setInvoiceStatus}
              // names={["Not invoiced", "Ready To Invoice", "Invoiced"]}
                names={
                              [
                                INVOICE_STATUS.NOT_INVOICED,
                                INVOICE_STATUS.READY_TO_INVOICE,
                                INVOICE_STATUS.INVOICED
                              ]
                            }
            />
          </Box>

          <Box component="div" className="btn-group">
            {auth.type === "admin" ? (
              <>
                {props.shareDocs && (
                  <ButtonGroup>
                    <Link
                      target="_blank"
                      className="btn btn-primary"
                      style={{
                        borderTopRightRadius: "0",
                        borderBottomRightRadius: 0,
                        borderRight: "1px solid #ffffff",
                      }}
                      to={shareDocs}
                    >
                      Shared Docs
                    </Link>
                    <Button
                      className="btn btn-primary"
                      style={{
                        borderTopLeftRadius: "0",
                        borderBottomLeftRadius: 0,
                        fontSize: "14px",
                        lineHeight: "14px",
                      }}
                      onClick={() => setShareDocsModal((e) => !e)}
                    >
                      <Tooltip title="Edit">
                        <EditIcon />
                      </Tooltip>
                    </Button>
                  </ButtonGroup>
                )}
              </>
            ) : (
              auth.type !== "factory" &&
              props.shareDocs && (
                <Link
                  target="_blank"
                  className="btn btn-primary"
                  to={shareDocs}
                >
                  Shared Docs
                </Link>
              )
            )}
            <Button
              className="btn btn-primary"
              onClick={handleReset}
              sx={{ mt: 3, mb: 2 }}
            >
              Reset
            </Button>
            <Button
              className="btn btn-primary"
              onClick={() => setShort((current) => !current)}
              sx={{ mt: 3, mb: 2 }}
            >
              {short ? "Less" : "More"} Filters
            </Button>
            <Button
              className="btn btn-primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleFilterSubmit}
            >
              Query
            </Button>
          </Box>
        </Box>

        {short && (
          <Box component={"div"} className="collapse">
            <MultipleSelectCheckmarks
              label="Order Status"
              checkValue={status}
              setCheckValue={setStatus}
              names={
                auth.type === "customer"
                  ? [
                      // "Submitted",
                      // "Accepted",
                      // "In Production",
                      // "Shipped Out",
                      // "Hold",
                      // "Rejected",
                      // "Cancelled",
                      // "Pending"
                      // new Status
                      ORDER_STATUS.SUBMITTED,
                      ORDER_STATUS.ACCEPTED,
                      ORDER_STATUS.IN_PRODUCTION,
                      ORDER_STATUS.SHIPPED_OUT,
                      ORDER_STATUS.HOLD,
                      ORDER_STATUS.REJECTED,
                      ORDER_STATUS.CANCELLED,
                      ORDER_STATUS.PENDING,
                    ]
                  : [
                      // "Submitted",
                      // "Accepted",
                      // "In Production",
                      // "Shipped Out",
                      // "Hold",
                      // "Rejected",
                      // "Cancelled",
                      // "FtyRejected",
                      // "Pending"
                      // new Status

                        ORDER_STATUS.SUBMITTED,
                        ORDER_STATUS.ACCEPTED,
                        ORDER_STATUS.IN_PRODUCTION,
                        ORDER_STATUS.SHIPPED_OUT,
                        ORDER_STATUS.HOLD,
                        ORDER_STATUS.REJECTED,
                        ORDER_STATUS.CANCELLED,
                        ORDER_STATUS.PENDING,
                        ORDER_STATUS.FTYREJECTED
                    ]
              }
            />
            {auth.type !== "customer" && (
              <MultipleSelectCheckmarks
                label="Factory Color"
                checkValue={factoryColor}
                setCheckValue={setFactoryColor}
                names={[
                  "red",
                  "yellow",
                  "purple",
                  "green",
                  "black",
                  "skyblue",
                  "sceen",
                  "darkpurple",
                  "pink",
                ]}
              />
            )}
            {auth.type !== "factory" && (
              <>
                <MultipleSelectCheckmarks
                  label="Customer Color"
                  checkValue={color}
                  setCheckValue={setColor}
                  names={[
                    "red",
                    "yellow",
                    "purple",
                    "green",
                    "black",
                    "skyblue",
                    "sceen",
                    "darkpurple",
                    "pink",
                  ]}
                />
                {getTags && (
                  <>
                    <Checkbox
                      checked={allTagRed}
                      onChange={(e) => setAllTagRed(e.target.checked)}
                    />
                    <MultipleSelectCheckmarks
                      label="Tag Red"
                      checkValue={tagRed}
                      setCheckValue={setTagRed}
                      names={getTags
                        ?.filter((item) => item.type === "red")
                        .map((item) => item.name)}
                    />
                    <Checkbox
                      checked={allTagBlue}
                      onChange={(e) => setAllTagBlue(e.target.checked)}
                    />
                    <MultipleSelectCheckmarks
                      label="Tag Blue"
                      checkValue={tagBlue}
                      setCheckValue={setTagBlue}
                      names={getTags
                        ?.filter((item) => item.type === "blue")
                        .map((item) => item.name)}
                    />
                  </>
                )}
              </>
            )}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                gap: "15px",
              }}
            >
              {auth.type === "admin" && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Checkbox
                    checked={allAdminRemarks}
                    onChange={(e) => setAllAdminRemarks(e.target.checked)}
                  />
                  <TextField
                    type="text"
                    label="Admin Remarks"
                    variant="outlined"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    disabled={allAdminRemarks}
                  />
                </div>
              )}
              {auth.type === "admin" && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Checkbox
                    checked={allRemarks}
                    onChange={(e) => setAllRemarks(e.target.checked)}
                  />
                  <TextField
                    type="text"
                    label="Remarks"
                    variant="outlined"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    disabled={allRemarks}
                  />
                </div>
              )}
              {(auth.type === "admin" || auth.type === "factory") && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Checkbox
                    checked={allFactoryNote}
                    onChange={(e) => setAllFactoryNote(e.target.checked)}
                  />
                  <TextField
                    type="text"
                    label="Factory Note"
                    variant="outlined"
                    value={factoryNote}
                    onChange={(e) => setFactoryNote(e.target.value)}
                    disabled={allFactoryNote}
                  />
                </div>
              )}
              {(auth.type === "admin" || auth.type === "customer") && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Checkbox
                    checked={allCustomerNote}
                    onChange={(e) => setAllCustomerNote(e.target.checked)}
                  />
                  <TextField
                    type="text"
                    label="Customer Note"
                    variant="outlined"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    disabled={allCustomerNote}
                  />
                </div>
              )}
            </div>
          </Box>
        )}
      </Box>

      {/*  */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={shareDocsModal}
        onClose={(e) => setShareDocsModal(!e)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal"
      >
        <Fade in={shareDocsModal}>
          <Box>
            <Box className="modal-body">
              <a onClick={(e) => setShareDocsModal(!e)} className="close-btn">
                <CloseIcon className="icon" />
              </a>
              <Typography className="main-title" component="h2">
                Edit Shared Link
              </Typography>
              <form onSubmit={handleSubmitEditShareDocs}>
                <TextField
                  type="text"
                  label="Shared Docs"
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "20px" }}
                  value={shareDocs}
                  onChange={(e) => setShareDocs(e.target.value)}
                />
                <Box className="modal-footer">
                  <Button
                    className="btn btn-outline-primary"
                    onClick={(e) => setShareDocsModal(!e)}
                  >
                    Cancel
                  </Button>
                  <Button className="btn btn-primary" type="submit">
                    Edit
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/*  */}
    </div>
  );
};

export default TicketSystemFilter;
