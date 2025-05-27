import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  Backdrop,
  Button,
  Checkbox,
  Fade,
  FormControlLabel,
  FormGroup,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";

import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PupringTable from "../../pages/stores/pupring/PupringTable";
import { useSelector } from "react-redux";
import "./tabs.scss";
import API from "../../api/api";
import CircularProgress from "@mui/material/CircularProgress";
import ColorPlate from "./colorPlate";
import { useNavigate } from "react-router-dom";
import { ORDER_STATUS, tabsFilterFields } from "../../Utils/Utils";
import AutohideSnackbar from "../snackbar/Snackbar";
import UploadButton from "../UploadButton/UploadButton";
import DownloadButton from "../DownloadButton/DownloadButton";

// Function to define the TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  // Main component NavTabs
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const NavTabs = (props) => {
  const { rows, isLoading, pageInfo, setPaginationModel } = props;
  const navigate = useNavigate()
  const [value, setValue] = useState(0);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadinggen, setLoading] = useState(false);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [is_mark_as_invoiced, set_is_mark_as_invoiced] = useState(false)
  const [progressSummary, setProgressSummary] = useState(false);
  const [progressExport, setProgressExport] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })
    // forceAccept
    const [forceAccept, setForceAccept] = useState(null);
    const [loadingForceAccept, setLoadingForceAccept] = useState(false);
    const [forceAcceptError, setForceAcceptError] = useState(null);
  // Initialize state with default values for each checkbox
  const [exportSheet, setExportSheet] = useState("excel");
  const [checkboxValues, setCheckboxValues] = useState([
    { header: "Id", key: "id", width: 10 },
    { header: "Po", key: "po", width: 10 },
    { header: "Po ID", key: "po_id", width: 10 },
    { header: "Name", key: "name", width: 10 },
  ]);

  const [importOptions, setImportOptions] = useState([
  ]);


  // export file code start here
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [generateInvoiceModal, setGenerateInvoiceModal] = useState(false);
  const [isShowExportModal, setIsShowExportModal] = useState(false);
  const filters = [];


// Expected headers (excluding po_id which is always required)
const requiredHeaders = ["po_id", "invoice_status", "order_status", "tracking_number"];

// Function to validate the file
// const validateFile = (jsonData) => {
//   if (!jsonData || jsonData.length === 0) {
//     setError("Invalid file structure.");
//     return false;
//   }

//   // Extract headers from the file
//   const fileHeaders = jsonData[0];

//   // Ensure the file has the required headers
//   if (!requiredHeaders.every((col, index) => fileHeaders[index] === col)) {
//     setError(`File must contain exactly these columns: ${requiredHeaders.join(", ")}`);
//     return false;
//   }

//   // Convert importOptions to a Set for fast lookup
//   const requiredColumns = new Set(importOptions.map(opt => opt.key));

//   // Validate rows
//   for (let i = 1; i < jsonData.length; i++) {
//     const row = jsonData[i];

//     // Ensure `po_id` always has a value
//     if (!row[0]) {
//       setError(`Row ${i + 1}: 'po_id' is required.`);
//       return false;
//     }

//     // Validate only selected columns
//     for (let j = 1; j < requiredHeaders.length; j++) {
//       const columnKey = requiredHeaders[j];

//       if (requiredColumns.has(columnKey) && !row[j]) {
//         setError(`Row ${i + 1}: '${columnKey}' cannot be empty.`);
//         return false;
//       }
//     }
//   }

//   setError(""); // Clear error if validation passes
//   return true;
// };

const validateLargeFile = (jsonData, importOptions, setError, callback) => {

  if (!jsonData || jsonData.length === 0) {
    setError("Invalid file structure.");
    return;
  }

  const worker = new Worker(new URL("./fileValidatorWorker.js", import.meta.url));
  

  worker.postMessage({ jsonData, importOptions });

  worker.onmessage = (event) => {
    const { error, valid } = event.data;
    if (error) {
      console.log("errors===============>", error)
      setError(error);
    } else {
      setError(""); // Clear error if valid
      console.log(valid)
      callback(valid);
    }
    worker.terminate(); // Stop worker after execution
  };
};
const handleFileValidation = (jsonData) => {
  validateLargeFile(jsonData, importOptions, setError, (isValid) => {
    if (isValid) {
      console.log("✅ File is valid, proceed with upload!");
    }
  });
};
// File upload handler
const handleExportFileChange = (e) => {
  setFile(null);
  const selectedFile = e.target.files[0];

  if (!selectedFile) return;
  if (!selectedFile.name.endsWith(".xlsx")) {
    setError("Only .xlsx files are allowed!");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Validate the file initially
    // if (validateFile(jsonData)) {
    //   setFile(selectedFile);
    // }
    if (handleFileValidation(jsonData)) {
   
      setFile(selectedFile);
    }
  };
  console.log("yeah=================================================>")
  console.log(selectedFile)
  setFile(selectedFile)
  reader.readAsArrayBuffer(selectedFile);
};

// Re-run validation when importOptions (checkboxes) change
useEffect(() => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // validateFile(jsonData); // Revalidate when checkboxes change

      handleFileValidation(jsonData); // Revalidate when checkboxes change

    };
    reader.readAsArrayBuffer(file);
  }
}, [importOptions]);



  // export file code end here





  const handleLocalStorage = (ids) => {
    // Save the ID to local storage
    localStorage.setItem('savedId', ids);

    // Redirect to the ticket page
    navigate('/tickets-system');
  };


  const auth = useSelector((state) => state.user);

  // Handle change of tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Ref for handling bool value changes
  const boolRef = React.useRef(false);

  // function to place orders on hold
  const placeOrderOnHold = (ids) => {
    API.post(`/${auth.type}/hold-orders`, {
      order_id: ids,
    }).then((response) => {
      tabsFilterFields(props, boolRef);
      boolRef.current = !boolRef.current;
    });
  };

  // Function to place orders for selected rows
  const selectedWaybill = (id) => {
    API.post(`/factory/place-order-to-yun-express`, {
      order_id: id,
    }).then((response) => {
      tabsFilterFields(props, boolRef);
      boolRef.current = !boolRef.current;
    });
  };
  const selectedLabel = (id) => {
    API.post(`/factory/generate-label`, {
      order_ids: id,
    }).then((response) => {
      tabsFilterFields(props, boolRef);
      boolRef.current = !boolRef.current;

    });
  };
  const seletedPlaceOrder = (id) => {
    API.post(`/factory/place-order`, {
      order_ids: id,
    }).then((response) => {
      tabsFilterFields(props, boolRef);
      boolRef.current = !boolRef.current;
    });
  };

  // Function to combineOrder for selected rows
  const combineOrder = (id) => {
    API.post("/admin/combine-order", {
      order_ids: id,
    }).then((response) => {
      tabsFilterFields(props, boolRef);
      boolRef.current = !boolRef.current;
    });
  };

  // Function to change circle color for selected rows
  const handleColorPlate = (ids, color, key) => {
    API.post(`/${auth?.type}/${key}`, {
      order_ids: ids,
      color: color,
    }).then((response) => {
      tabsFilterFields(props, boolRef);
      boolRef.current = !boolRef.current;
    });
  };

  // function sleep(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

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

  // State for storing the selected orderId
  const [orderId, setOrderId] = useState(null);

  // Function to handle orderId modal
  const handleOrderIdModal = (data) => {
    setOrderId(data);
  };

  // Function to mark orders as selected orderId (Accepted/In-Production/Shipped-Out)
  const selectedOrderId = () => {
    API.post(`/${auth?.type}/${orderId}`, {
      order_id: selectedRow,
    }).then((response) => {
      handleOrderIdModal(null);
      tabsFilterFields(props, boolRef);
      boolRef.current = !boolRef.current;
    });
  };


// 

  //

  // State for storing the selected generateInvoiceModal


  // Check for active po_number filter
  if (pageInfo.po_number && pageInfo.po_number?.length > 0) {
    filters.push({ type: "po_number", value: pageInfo.po_number });
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

  if (pageInfo?.tag_red && pageInfo?.tag_red?.length > 0) {
    filters.push({ type: "tag_red", value: pageInfo?.tag_red });
  }



  if (pageInfo?.tag_blue && pageInfo?.tag_blue?.length > 0) {
    filters.push({ type: "tag_blue", value: pageInfo?.tag_blue });
  }

 

 

  // // Check for active tag_blue filters
  // if (pageInfo?.tag_blue && pageInfo.tag_blue?.length > 0) {
  //   filters.push({ type: "tag_blue", value: pageInfo.tag_blue });
  // }

  // Check for active all_tag_blue filters
  if (pageInfo?.all_tag_blue) {
    filters.push({ type: "all_tag_blue", value: pageInfo.all_tag_blue });
  }
//  Check for active all_tag_red filters
  if (pageInfo?.all_tag_red) {
    filters.push({ type: "all_tag_red", value: pageInfo.all_tag_red });
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
  // Function to Generate Invoice for selected rows
  const selectedMarkAsInvoiced = async (id) => {
    const formData = new FormData();
    // Check for active po_number filter
    if (id.length > 0) {
      filters.push({ type: "order_ids", value: id });
    }

    const requestBody = {
      filter: filters,
      columns: exportSheet == "excel" ? checkboxValues : importOptions,
      exportType: exportSheet,
      // ...other properties you want to include in the request body...
    };

    formData.append("filter", JSON.stringify(filters))
    formData.append("columns", JSON.stringify(exportSheet == "excel" ? checkboxValues : importOptions))
    formData.append("exportType", exportSheet)
    formData.append("is_mark_as_invoiced", is_mark_as_invoiced)
    formData.append("orders", file)
    if (exportSheet == "pdf") {
      setIsLoadingInvoice(true)
    } else {

      setLoading(true);
    }

    try {
      if (exportSheet == "pdf" && !file) {
        return setError("XLSX is mendatory.")
      }
      const response = await API.post(`/${auth.type}/invoice/invoiced`, auth.type == "admin" ? requestBody : formData);
      // if (response.status === 200) {
      //   // props.pageInfo.invoice_status !== "Ready To Invoice" && setGenerateInvoiceModal(false)
      //   window.open(response?.data?.invoice_pdf, "_blank");
      //   downloadURI(response?.data?.items_sheet);
      // }
      if (response.data.success) {
        setAlert({ open: true, message: response.data.message, severity: "success" })
      }
      if (!response.data.success) {
        setAlert({ open: true, message: response.data.message, severity: "error" })
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setIsLoadingInvoice(false);
      tabsFilterFields(props, boolRef);
      boolRef.current = !boolRef.current;
      setCheckboxValues([
        { header: "Id", key: "id", width: 10 },
        { header: "Po", key: "po", width: 10 },
        { header: "Po ID", key: "po_id", width: 10 },
        { header: "Name", key: "name", width: 10 },
      ])

      setImportOptions([])
      setFile(null)

    }
  };
  //

  // Function to handle file change for upload
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle form submission for file upload
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("orders", selectedFile);
      await API.post(`/customer/upload-orders`, formData)
        .then((response) => {
          setPaginationModel({ bool: boolRef.current });
          boolRef.current = !boolRef.current;
        })
        .catch((error) => {
        });
    }
  };

  // Function to get order status for specific tab
  const getOrderStatus = (status) => {
    setPaginationModel({
      order_status: status,
      multiple_order_status: pageInfo?.multiple_order_status || [],
      color: pageInfo?.color || [],
      po_number: pageInfo?.po_number || [],
      first_date: pageInfo?.first_date || "",
      last_date: pageInfo?.last_date || "",
      name: pageInfo?.name || "",
      invoice_status: pageInfo?.invoice_status || [],
      remarks: pageInfo?.remarks || "",
      all_remarks: pageInfo?.all_remarks || "",
      admin_remarks: pageInfo?.admin_remarks || "",
      all_admin_remarks: pageInfo?.all_admin_remarks || "",
      factory_note: pageInfo?.factory_note || "",
      all_factory_note: pageInfo?.all_factory_note,
      customer_note: pageInfo?.customer_note || "",
      all_customer_note: pageInfo?.all_customer_note,
      pageSize: pageInfo?.pageSize,
      tag_blue: pageInfo?.tag_blue || [],
      tag_red: pageInfo?.tag_red || [],
      all_tag_blue: pageInfo?.all_tag_blue || "",
      all_tag_red: pageInfo?.all_tag_red || "",
      page: pageInfo?.page,
      // ...{ ...(status === "Shipped Out" ? { invoice_status: "Ready To Invoice" } : {}) }
    });
  };

  // Function to export orders as Excel file
  const exportFile = () => {
    // Make API call to get the Excel file
    setProgressExport(true);

    // Check for active po_number filter
    if (selectedRow.length > 0) {
      filters.push({ type: "id", value: selectedRow });
    }

    const requestBody = {
      filter: filters
      // ...other properties you want to include in the request body...
    };

    API.post(
      `/${auth.type !== "customer" ? "factory" : "customer"}/download-orders`, requestBody
    )
      .then((response) => {
        setProgressExport(false);
        if (response.data.success) {
          setAlert({ open: true, message: response.data.message, severity: "success" })
        }
        if (!response.data.success) {
          setAlert({ open: true, message: response.data.message, severity: "error" })

        }

      })
      .catch((err) => {
      });
  };

  // Function to export orders summary as Excel file
  const exportSummary = () => {
    setProgressSummary(true);
    API.get(`/admin/orders-summary`, {
      params: {
        from: props?.pageInfo?.first_date || "",
        to: props?.pageInfo?.last_date || "",
      },
    })
      .then((response) => {
        setProgressSummary(false);
        // const path = response.data.path;
        // if (response.status === 200) {
        //   window.location.href = path;
        // }
        if (response.data.success) {
          setAlert({ open: true, message: response.data.message, severity: "success" })
        }
        if (!response.data.success) {
          setAlert({ open: true, message: response.data.message, severity: "error" })
        }
      })
      .catch((error) => {
      });
  };

  //


  const handleCheckboxChange = (event, label) => {
    const { checked, value } = event.target;

    if (checked) {
      // Add the value and label to the array
      setCheckboxValues((prevValues) => [
        ...prevValues,
        { key: value, header: label, width: 10 },
      ]);
    } else {
      // Remove the value and label from the array
      setCheckboxValues((prevValues) =>
        prevValues.filter((item) => item.key !== value)
      );
    }
  };



  const handleimportOptionsChange = (event, label) => {
    const { checked, value } = event.target;

    if (checked) {
      // Add the value and label to the array
      setImportOptions((prevValues) => [
        ...prevValues,
        { key: value, header: label, width: 10 },
      ]);
    } else {
      // Remove the value and label from the array
      setImportOptions((prevValues) =>
        prevValues.filter((item) => item.key !== value)
      );
    }
  };




  const handleForceAccept = () => {
    setLoadingForceAccept(true);
    API.post(`/admin/force-accept`, {
      order_ids: forceAccept
    })
      .then((response) => {
        // setForceAcceptSuccess(response?.data?.message)
        if (response.status === 200) {
          tabsFilterFields(props, boolRef);
          boolRef.current = !boolRef.current;
          setForceAccept(null);
        }
      }).catch((error) => {
        setForceAcceptError(error?.response?.data?.message)
      }).finally(() => {
        setLoadingForceAccept(false);
      })
  };



  // JSX for import/export file buttons
  const importExportFile = (
    <div className="tool-bar">
      {selectedRow.length > 0 &&
        <div style={{ display: 'flex', gap: '10px', textAlign: 'center' }}>
          {auth.type !== 'customer' &&
            <div>
              <h6>Factory Color</h6>
              <ColorPlate selectedRow={selectedRow} handleColorPlate={handleColorPlate} endPointKey={(auth.type === "admin" || auth.type === "suadmin") ? "change-factory-color" : "change-color"} />
            </div>
          }
          {auth.type !== 'factory' &&
            <div>
              <h6>Customer Color</h6>
              <ColorPlate selectedRow={selectedRow} handleColorPlate={handleColorPlate} endPointKey={(auth.type === "admin" || auth.type === "suadmin") ? "change-customer-color" : "change-color"} />
            </div>
          }
        </div>
      }
      <div className="btn-group">
        {/* {auth.type !== "customer" && (
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <Button className="btn btn-primary" type="submit">
              Upload
            </Button>
          </form>
        )} */}
        {
          (auth.type !== "suadmin" && auth.type !== "admin") &&

          <Button
            className="btn btn-primary"


            onClick={exportFile}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            Export{" "}
            {progressExport ? (
              <CircularProgress color="inherit" className="hw-12" />
            ) : (
              <></>
            )}
          </Button>
        }
        {(auth.type === "admin" || auth.type === "suadmin") && (
          <Button
            className="btn btn-primary"
            onClick={exportSummary}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            Export Summary{" "}
            {progressSummary ? (
              <CircularProgress color="inherit" className="hw-12" />
            ) : (
              <></>
            )}
          </Button>
        )}
        {auth.type !== "customer" && selectedRow.length > 0 && (
          <Button
            className="btn btn-primary"
            onClick={() => placeOrderOnHold(selectedRow)}
          >
            Put On Hold
          </Button>
        )}
        {(auth.type === "admin" || auth.type === "suadmin") && selectedRow.length > 0 && (
          <>
            <Button
              className="btn btn-primary"
              onClick={() => selectedWaybill(selectedRow)}
            >
              Get Waybill
            </Button>
            <Button
              className="btn btn-primary"
              onClick={() => selectedLabel(selectedRow)}
            >
              Get Label
            </Button>
            <Button
              className="btn btn-primary"
              onClick={() => seletedPlaceOrder(selectedRow)}
            >
              Place Order
            </Button>
            <Button
              className="btn btn-primary"
              onClick={() => combineOrder(selectedRow)}
            >
              Combine Orders
            </Button>
          </>
        )}
        {(auth.type === "admin" || auth.type === "suadmin") && selectedRow.length > 0 &&
          selectedRow.every(id => props.rows.find(row => row._id === id && row.order_status === ORDER_STATUS.HOLD)) && (
            <Button
              className="btn btn-primary"
              onClick={() => setForceAccept(selectedRow)}
            >
              Force Accept
            </Button>
          )}
        {(auth.type === "admin" || auth.type === "suadmin") && value !== 5 && (
          <Button
            className="btn btn-primary"
            onClick={
              () => { setIsShowExportModal((e) => !e); setExportSheet("excel") }
            }
          // disabled={loadinggen}

          >
            Export

            {loadinggen ? <CircularProgress color="inherit" className="hw-12" /> : ""}

          </Button>
        )}


        {(auth.type === "suadmin") && value !== 5 && (
          <Button
            className="btn btn-primary"
            onClick={
              () => { setGenerateInvoiceModal((e) => !e); setExportSheet("pdf") }
            }
          // disabled={loadinggen}

          >
            {/* {
              auth.type === "admin"?
              "Export "
              :"Generate Invoice"
            } */}
            Import File

            {isLoadingInvoice ? <CircularProgress color="inherit" className="hw-12" /> : ""}

          </Button>
        )}
        {((auth.type === "admin" || auth.type === "suadmin") || auth.type === 'customer') &&
          <Button
            className="btn btn-primary"
            onClick={
              () => handleLocalStorage(selectedRow)
            }
          >
            Tickets
          </Button>
        }
      </div>
    </div>
  );
  return (
    <div className="tabs">
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab
            label="All"
            {...a11yProps(0)}
            onClick={() => getOrderStatus("all")}
          />
          <Tab
            label="Submitted"
            {...a11yProps(1)}
            onClick={() => getOrderStatus(ORDER_STATUS.SUBMITTED)}
          />
          <Tab
            label="Accepted"
            {...a11yProps(2)}
            onClick={() => getOrderStatus(ORDER_STATUS.ACCEPTED)}
          />
          <Tab
            label="In Production"
            {...a11yProps(3)}
            onClick={() => getOrderStatus(ORDER_STATUS.IN_PRODUCTION)}
          />
          <Tab
            label="Shipped Out"
            {...a11yProps(4)}
            onClick={() => {
              getOrderStatus(ORDER_STATUS.SHIPPED_OUT);
            }}
          />
          {/* {(auth.type === "admin" || auth.type === "suadmin" ) && (
            <Tab
              label="Invoiced"
              {...a11yProps(5)}
              onClick={() => getInvoiceStatus()}
            />
          )} */}
        </Tabs>
      </AppBar>

      {/* Order List All */}
      <TabPanel className="" value={value} index={0}>
        {/* {importExportFile} */}
        {value === 0 && (
          <PupringTable
            key="all"
            tabName="all"
            rows={rows}
            isLoading={isLoading}
            pageInfo={pageInfo}
            setPaginationModel={setPaginationModel}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        )}
      </TabPanel>

      {/* Order List Submitted */}
      <TabPanel value={value} index={1}>
        {auth.type !== "customer" && selectedRow.length > 0 && (
          <div className="extra-buttons">
            <Button
              className="btn btn-primary"
              onClick={() => handleOrderIdModal("accept-orders")}
            >
              Mark as Accepted
            </Button>
          </div>
        )}
        {/* {importExportFile} */}
        {value === 1 && (
          <PupringTable
            key="submitted"
            tabName="submitted"
            rows={rows}
            isLoading={isLoading}
            pageInfo={pageInfo}
            setPaginationModel={setPaginationModel}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        )}
      </TabPanel>

      {/* Order List Accepted */}
      <TabPanel value={value} index={2}>
        {/* {importExportFile} */}
        {auth.type !== "customer" && selectedRow.length > 0 && (
          <div className="extra-buttons">
            <Button
              className="btn btn-primary"
              onClick={() => handleOrderIdModal("produce-orders")}
            >
              Mark as In-Production
            </Button>
          </div>
        )}
        {value === 2 && (
          <PupringTable
            key="accepted"
            tabName="accepted"
            rows={rows}
            isLoading={isLoading}
            pageInfo={pageInfo}
            setPaginationModel={setPaginationModel}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        )}
      </TabPanel>

      {/* Order List In-Production */}
      <TabPanel value={value} index={3}>
        {/* {importExportFile} */}
        {auth.type !== "customer" && selectedRow.length > 0 && (
          <div className="extra-buttons">
            <Button
              className="btn btn-primary"
              onClick={() => handleOrderIdModal("ship-orders")}
            >
              Mark as Shipped Out
            </Button>
          </div>
        )}
        {value === 3 && (
          <PupringTable
            tabName="in-production"
            rows={rows}
            isLoading={isLoading}
            pageInfo={pageInfo}
            setPaginationModel={setPaginationModel}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        )}
      </TabPanel>

      {/* Order List Shipped-Out */}
      <TabPanel value={value} index={4}>
        {/* {importExportFile} */}
        {value === 4 && (
          <PupringTable
            tabName="shipped-out"
            rows={rows}
            isLoading={isLoading}
            pageInfo={pageInfo}
            setPaginationModel={setPaginationModel}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        )}
      </TabPanel>

      {/* Invoice  List Invoice */}
      {/* {(auth.type === "admin" || auth.type === "suadmin" ) && (
        <TabPanel value={value} index={5}>
          {importExportFile}
          {value === 5 && (
            <PupringTable
              tabName="invoice"
              rows={rows}
              isLoading={isLoading}
              pageInfo={pageInfo}
              setPaginationModel={setPaginationModel}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
            />
          )}
        </TabPanel>
      )} */}

      {/* Mark As Modal Start */}
      {orderId && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={true}
          onClose={() => handleOrderIdModal(null)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
          className="custom-modal delete-modal"
        >
          <Fade in={!!orderId}>
            <Box>
              <Box className="modal-body">
                <a
                  onClick={() => handleOrderIdModal(null)}
                  className="close-btn"
                >
                  <CloseIcon className="icon" />
                </a>
                <div className="modal-icon">
                  <HelpOutlineIcon />
                </div>
                <Typography component="p">
                  Are you sure want to mark orders as{" "}
                  {orderId === "accept-orders"
                    ? "Accepted"
                    : orderId === "produce-orders"
                      ? "In-Production"
                      : orderId === "ship-orders"
                        ? "Shipped-Out"
                        : ""}
                  ?
                </Typography>
                <Box className="modal-footer">
                  <Button
                    className="btn btn-outline-danger"
                    onClick={() => handleOrderIdModal(null)}
                  >
                    No
                  </Button>
                  <Button
                    className="btn btn-outline-primary"
                    onClick={() => selectedOrderId()}
                  >
                    Yes
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
      {/* Mark As Modal End */}

      {/*  */}


      {/* invoice modal start */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={generateInvoiceModal}
        onClose={() => setGenerateInvoiceModal((e) => !e)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal generate-invoice"
      >
        <Fade in={generateInvoiceModal}>
          <Box>
            <Box className="modal-body">
              <Box sx={{
                display: "flex !important",
                justifyContent: "space-between !important",
                borderRadius: "10px !important",
              }}>

                {/* <div className="modal-icon">
                <FileUploadIcon />
              </div> */}
                <Box sx={{
                  // mb:"50px !important"
                }}>
                  <Typography component="h2" className="heading">
                    File Information
                  </Typography>

                  <Typography component="p">
                    <b>Please check the fields that you would like to update. At least one is required.</b>
                  </Typography>
                </Box>
                <Box sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "start",
                  height: "100%",
                  gap: "10px"
                }}>
                  {/* <DownloadButton title="Download mark as Invoice sample file"/> */}
                  <a
                    onClick={() => setGenerateInvoiceModal((e) => !e)}
                  // className="close-btn"
                  >
                    <CloseIcon className="icon" />
                  </a>

                </Box>
              </Box>
              {/* checkbox start */}
              <Box className="check-fields">
                <FormGroup style={{ gap: "8px" }}>

                {/* <FormControlLabel

style={{ gap: "5px" }}
control={
  <Checkbox
    value="mark_as_invoiced"
    checked={is_mark_as_invoiced}
    onChange={() => set_is_mark_as_invoiced(prev=>!prev)}
  />
}
label="mark_as_invoiced"
/> */}
                  <FormControlLabel

                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="invoice_status"
                        onChange={(e) => handleimportOptionsChange(e, "invoice_status")}
                      />
                    }
                    label="invoice_status"
                  />

                  <FormControlLabel

                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="order_status"
                        onChange={(e) => handleimportOptionsChange(e, "order_status")}
                      />
                    }
                    label="order_status"
                  />


                  <FormControlLabel

                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="tracking_number"
                        onChange={(e) => handleimportOptionsChange(e, "tracking_number")}
                      />
                    }
                    label="tracking_number"
                  />


                </FormGroup>
              </Box>
              {/* checkbox end */}
              <Box className="modal-footer">
                {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
                {auth.type === "suadmin" &&


                  <>

                    {/* <RadioGroup
                  style={{ flexDirection: "row", paddingLeft: "10px" }}
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={exportSheet}
                  name="radio-buttons-group"
                  onChange={(e) =>{
                    if(e.target.value === "excel"){
                      setFile(null)
                      setError(null)
                    }
                    setExportSheet(e.target.value)
                  }}
                >
                  <FormControlLabel
                    value="excel"
                    control={<Radio />}
                    label="Export Sheet"
                  />
                  <FormControlLabel
                  // disabled={true}
                    value="pdf"
                    control={<Radio />}
                    label="Generate Invoice"
                  />
                </RadioGroup> */}
                    {exportSheet === "pdf" && (
                      <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "start",
                        gap: "10px",
                      }}>
                        {/* <DownloadButton onClick={() => { window.location.href = "https://xdtc-media.s3.us-east-2.amazonaws.com/orders.xlsx" }} title="Download mark as Invoice sample file" /> */}
                        {/* <a href="https://xdtc-media.s3.us-east-2.amazonaws.com/orders.xlsx" download> */}
                        <a href="https://xdtc-media.s3.us-east-2.amazonaws.com/sample.xlsx" download>

                        Download Sample File.
                        </a>

                        <Box sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "start",
                          gap: "10px",

                        }}>
                          <UploadButton error={error} file={file} onChange={handleExportFileChange} />


                        </Box>
                        {/* <input type="file" accept=".xlsx" onChange={handleExportFileChange} /> */}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                      </Box>
                    )}
                  </>
                }
                <div
                  style={{
                    flexGrow: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Button
                    sx={{
                      width: "max-content !important",
                      padding: "10px 20px !important",
                    }}
                    className="btn btn-outline-danger"
                    onClick={() => {setGenerateInvoiceModal((e) => !e); setFile(null)}}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={exportSheet != "pdf" || !file || error ||importOptions?.length<1 }
                    sx={{
                      width: "max-content !important",
                      padding: "10px 20px !important",
                      backgroundColor: (exportSheet != "pdf" || !file || error ||importOptions?.length<1) ? "gray !important" : "unset",
                      color: (exportSheet != "pdf" || !file || error ||importOptions?.length<1 ) ? "white !important" : "unset",
                    }}
                    className="btn btn-outline-primary"
                    onClick={() => {
                      if (exportSheet != "pdf") {
                        setGenerateInvoiceModal((e) => !e);
                      }
                      if (exportSheet === "pdf" && file) {
                        setGenerateInvoiceModal((e) => !e);

                      }
                      selectedMarkAsInvoiced(selectedRow);
                    }}
                  >
                    Process File
                  </Button>
                </div>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* invoice modal end */}




      {/* export modal start */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isShowExportModal}
        onClose={() => setIsShowExportModal((e) => !e)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal generate-invoice"
      >
        <Fade in={isShowExportModal}>
          <Box>
            <Box className="modal-body">
              <Box sx={{
                display: "flex !important",
                justifyContent: "space-between !important",
                borderRadius: "10px !important",
              }}>

                {/* <div className="modal-icon">
                <FileUploadIcon />
              </div> */}
                <Box sx={{
                  // mb:"50px !important"
                }}>
                  <Typography component="h2" className="heading">
                    Order Information
                  </Typography>

                  <Typography component="p">
                    <b>Please check the export field.</b>
                  </Typography>
                </Box>
                <Box sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "start",
                  height: "100%",
                  gap: "10px"
                }}>
                  {/* <DownloadButton title="Download mark as Invoice sample file"/> */}
                  <a
                    onClick={() => setIsShowExportModal((e) => !e)}
                  // className="close-btn"
                  >
                    <CloseIcon className="icon" />
                  </a>

                </Box>
              </Box>
              {/* checkbox start */}
              <Box className="check-fields">
                <FormGroup style={{ gap: "8px" }}>
                  <FormControlLabel
                    required
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="id"
                        onChange={(e) => handleCheckboxChange(e, "Id")}
                        disabled
                        checked
                      />
                    }
                    label="Id"
                  />
                  <FormControlLabel
                    required
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="po"
                        onChange={(e) => handleCheckboxChange(e, "Po")}
                        disabled
                        checked
                      />
                    }
                    label="Po"
                  />
                  <FormControlLabel
                    required
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="po_id"
                        onChange={(e) => handleCheckboxChange(e, "Po ID")}
                        disabled
                        checked
                      />
                    }
                    label="Po ID"
                  />
                  <FormControlLabel
                    required
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="name"
                        onChange={(e) => handleCheckboxChange(e, "Name")}
                        disabled
                        checked
                      />
                    }
                    label="Name"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="province"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Province")
                        }
                      />
                    }
                    label="Province"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="order_status"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Order Status")
                        }
                      />
                    }
                    label="Order Status"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="size"
                        onChange={(e) => handleCheckboxChange(e, "Size")}
                      />
                    }
                    label="Size"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="quantity"
                        onChange={(e) => handleCheckboxChange(e, "Size")}
                      />
                    }
                    label="Quantity"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="properties"
                        onChange={(e) => handleCheckboxChange(e, "Properties")}
                      />
                    }
                    label="Properties"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="original_properties"
                        onChange={(e) => handleCheckboxChange(e, "Original Properties")}
                      />
                    }
                    label="Original Properties"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="remarks"
                        onChange={(e) => handleCheckboxChange(e, "Remarks")}
                      />
                    }
                    label="Remarks"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="shipping_address"
                        onChange={(e) => handleCheckboxChange(e, "Shipping Address")}
                      />
                    }
                    label="Shipping Address"
                  />
                </FormGroup>
                <FormGroup style={{ gap: "8px" }}>
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="tracking_number"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Tracking Number")
                        }
                      />
                    }
                    label="Tracking Number"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="invoice_date"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Invoice Date")
                        }
                      />
                    }
                    label="Invoice Date"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="submitted"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Submitted Date")
                        }
                      />
                    }
                    label="Submitted Date"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="accepted"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Accepted Date")
                        }
                      />
                    }
                    label="Accepted Date"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="in_production"
                        onChange={(e) =>
                          handleCheckboxChange(e, "In Production Date")
                        }
                      />
                    }
                    label="In Production Date"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="shipped_out"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Shipped Out Date")
                        }
                      />
                    }
                    label="Shipped Out Date"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="post_service"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Service Code")
                        }
                      />
                    }
                    label="Service Code"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="admin_remarks"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Admin Remarks")
                        }
                      />
                    }
                    label="Admin Remarks"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="phone"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Phone")
                        }
                      />
                    }
                    label="Phone"
                  />
                </FormGroup>
                <FormGroup style={{ gap: "8px" }}>
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="customer_note"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Customer Note")
                        }
                      />
                    }
                    label="Customer Note"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="factory_note"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Factory Note")
                        }
                      />
                    }
                    label="Factory Note"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="shipping_label"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Shipping Label")
                        }
                      />
                    }
                    label="Shipping Label"
                  />

                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="shipping_name"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Shipping Name")
                        }
                      />
                    }
                    label="Shipping Name"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="waybill_number"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Waybill Number")
                        }
                      />
                    }
                    label="Waybill Number"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="invoice_status"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Invoice Status")
                        }
                      />
                    }
                    label="Invoice Status"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="factory_response"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Factory Response")
                        }
                      />
                    }
                    label="Factory Response"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="city"
                        onChange={(e) =>
                          handleCheckboxChange(e, "City")
                        }
                      />
                    }
                    label="City"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="country"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Country")
                        }
                      />
                    }
                    label="Country"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="zip"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Zip")
                        }
                      />
                    }
                    label="Zip"
                  />
                </FormGroup>

                <FormGroup style={{ gap: "8px" }}>
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="factory_price"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Factory Price")
                        }
                      />
                    }
                    label="Factory Price"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="factory_price_usd"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Factory Price USD")
                        }
                      />
                    }
                    label="Factory Price USD"
                  />

                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="customer_price"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Customer Price")
                        }
                      />
                    }
                    label="Customer Price"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="shipment_customer_price"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Shipment Price")
                        }
                      />
                    }
                    label="Customer Shipment Price"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="shipment_local_price_usd"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Yun Express USD")
                        }
                      />
                    }
                    label="Yun Express USD"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="shipment_cost_local"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Yun Express RMB")
                        }
                      />
                    }
                    label="Yun Express RMB"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="email"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Email")
                        }
                      />
                    }
                    label="Email"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="factory_color"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Factory Color")
                        }
                      />
                    }
                    label="Factory Color"
                  />
                  <FormControlLabel
                    style={{ gap: "5px" }}
                    control={
                      <Checkbox
                        value="color"
                        onChange={(e) =>
                          handleCheckboxChange(e, "Customer Color")
                        }
                      />
                    }
                    label="Customer Color"
                  />
                </FormGroup>
              </Box>
              {/* checkbox end */}
              <Box className="modal-footer">
                {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
                {auth.type === "suadmin" &&


                  <>
                    {/*               
              <RadioGroup
                  style={{ flexDirection: "row", paddingLeft: "10px" }}
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={exportSheet}
                  name="radio-buttons-group"
                  onChange={(e) =>{
                    if(e.target.value === "excel"){
                      setFile(null)
                      setError(null)
                    }
                    setExportSheet(e.target.value)
                  }}
                >
                  <FormControlLabel
                    value="excel"
                    control={<Radio />}
                    label="Export Sheet"
                  />
                  <FormControlLabel
                  // disabled={true}
                    value="pdf"
                    control={<Radio />}
                    label="Generate Invoice"
                  />
                </RadioGroup> */}
                    {exportSheet === "pdf" && (
                      <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}>
                        <Box sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                        }}>
                          <UploadButton error={error} file={file} onChange={handleExportFileChange} />
                          <DownloadButton onClick={() => { window.location.href = "https://xdtc-media.s3.us-east-2.amazonaws.com/orders.xlsx" }} title="Download mark as Invoice sample file" />

                        </Box>
                        {/* <input type="file" accept=".xlsx" onChange={handleExportFileChange} /> */}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                      </Box>
                    )}
                  </>
                }
                <div
                  style={{
                    flexGrow: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Button
                    sx={{
                      width: "max-content !important",
                      padding: "10px 20px !important",
                    }}
                    className="btn btn-outline-danger"
                    onClick={() => setIsShowExportModal((e) => !e)}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{
                      width: "max-content !important",
                      padding: "10px 20px !important",
                    }}
                    className="btn btn-outline-primary"
                    onClick={() => {
                      if (exportSheet != "pdf") {
                        setIsShowExportModal((e) => !e);
                      }
                      if (exportSheet === "pdf" && file) {
                        setIsShowExportModal((e) => !e);

                      }
                      selectedMarkAsInvoiced(selectedRow);
                    }}
                  >
                    Export
                  </Button>
                </div>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>


      {/* export modal end */}

      {forceAccept && <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={true}
        onClose={() => setForceAccept(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal delete-modal"
      >
        <Fade in={!!forceAccept} >
          <Box>
            <Box className="modal-body" >
              <a onClick={() => setForceAccept(null)} className="close-btn">
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
                  className="btn btn-outline-primary" disabled={loadingForceAccept}
                  onClick={() => setForceAccept(null)}
                >
                  Cancel
                </Button>
                <Button className="btn btn-outline-danger" disabled={loadingForceAccept} style={{ display: "flex", alignItems: "center", gap: "5px", width: loadingForceAccept ? '120px' : '90px' }} onClick={() => handleForceAccept()}>
                  Procced
                  {loadingForceAccept ? (
                    <CircularProgress color="inherit" className="hw-12" />
                  ) : (
                    <></>
                  )}
                </Button>
              </Box>
              {forceAcceptError && <Typography component="p" color={'red'} style={{ textAlign: "center" }}>
                {forceAcceptError}
              </Typography>}
            </Box>
          </Box>
        </Fade>
      </Modal>}
      {/*  */}
      <AutohideSnackbar
        onClose={() => setAlert({ ...alert, open: false })}
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </div>
  );
};

export default NavTabs;
