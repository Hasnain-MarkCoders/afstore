import React, { useRef, useState } from "react";
import { Box, Button, Checkbox, CircularProgress, Fade, FormControlLabel, FormGroup, Modal, Radio, RadioGroup, Typography, Backdrop } from "@mui/material";
import ColorPlate from "./colorPlate";
import { combineOrder, exportSummary, filterFields, placeOrderOnHold, selectedLabel, selectedMarkAsInvoiced, selectedWaybill, seletedPlaceOrder } from "./pupringFunctions";
import { useSelector } from "react-redux";
import API from "../../api/api";
import CloseIcon from "@mui/icons-material/Close";


const checkboxData = [
  {
    group: 'Basic Information',
    checkboxes: [
      { value: 'id', label: 'Id', disabled: true, checked: true },
      { value: 'po', label: 'Po', disabled: true, checked: true },
      { value: 'po_id', label: 'Po ID', disabled: true, checked: true },
      { value: 'name', label: 'Name', disabled: true, checked: true },
      { value: 'order_status', label: 'Order Status' },
      { value: 'size', label: 'Size' },
      { value: 'quantity', label: 'Quantity' },
      { value: 'properties', label: 'Properties' },
      { value: 'original_properties', label: 'Original Properties' },
      { value: 'remarks', label: 'Remarks' },
      { value: 'shipping_address', label: 'Shipping Address' },
    ],
  },
  {
    group: 'Tracking and Dates',
    checkboxes: [
      { value: 'tracking_number', label: 'Tracking Number' },
      { value: 'invoice_date', label: 'Invoice Date' },
      { value: 'submitted', label: 'Submitted Date' },
      { value: 'accepted', label: 'Accepted Date' },
      { value: 'in_production', label: 'In Production Date' },
      { value: 'shipped_out', label: 'Shipped Out Date' },
      { value: 'post_service', label: 'Service Code' },
      { value: 'admin_remarks', label: 'Admin Remarks' },
      { value: 'phone', label: 'Phone' },
    ],
  },
  {
    group: 'Notes and Labels',
    checkboxes: [
      { value: 'customer_note', label: 'Customer Note' },
      { value: 'factory_note', label: 'Factory Note' },
      { value: 'shipping_label', label: 'Shipping Label' },
      { value: 'waybill_number', label: 'Waybill Number' },
      { value: 'invoice_status', label: 'Invoice Status' },
      { value: 'factory_response', label: 'Factory Response' },
      { value: 'city', label: 'City' },
      { value: 'country', label: 'Country' },
      { value: 'zip', label: 'Zip' },
    ],
  },
  {
    group: 'Pricing and Shipping',
    checkboxes: [
      { value: 'factory_price', label: 'Factory Price' },
      { value: 'factory_price_usd', label: 'Factory Price USD' },
      { value: 'customer_price', label: 'Customer Price' },
      { value: 'shipment_customer_price', label: 'Customer Shipment Price' },
      { value: 'shipment_local_price_usd', label: 'Yun Express USD' },
      { value: 'shipment_cost_local', label: 'Yun Express RMB' },
      { value: 'email', label: 'Email' },
      { value: 'factory_color', label: 'Factory Color' },
      { value: 'color', label: 'Customer Color' },
    ],
  },
];




const PupringProperties = (props) => {
  const { rows, data, customerColor, factoryColor, isLoading, pageInfo, setPaginationModel, selectedRow } = props;
  const rowId = selectedRow ? selectedRow : data?._id;
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingGen, setloadingGen] = useState(false);
  const [progressSummary, setProgressSummary] = useState(false);
  const [progressExport, setProgressExport] = useState(false);
  // Initialize state with default values for each checkbox
  const [exportSheet, setExportSheet] = useState("excel");

  const boolRef = useRef(false);
  const auth = useSelector((state) => state.user);
  const [colorSuccess , setColorSuccess] = useState({open: false,
    vertical: 'bottom',
    horizontal: 'left',})
  const handleColorPlate = (ids, color, key) => {
    props.setUpdatedData(true)
    API.post(`/${auth?.type}/${key}`, {
      order_ids: ids,
      color: color,
    }).then((response) => {
      setColorSuccess({ ...colorSuccess, open: true });
      filterFields(props, boolRef);
      boolRef.current = !boolRef.current;
    });
  };


  // generate invoice
  // const initialCheckboxState = checkboxData.reduce((acc, currGroup) => {
  //   currGroup.checkboxes.forEach((checkbox) => {
  //     acc[checkbox.value] = checkbox.checked || false;
  //   });
  //   return acc;
  // }, {});

  const [generateInvoiceModal, setGenerateInvoiceModal] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState([
    { header: "Id", key: "id", width: 10 },
    { header: "Po", key: "po", width: 10 },
    { header: "Po ID", key: "po_id", width: 10 },
    { header: "Name", key: "name", width: 10 },
  ]);

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

  // const renderCheckboxGroups = () =>
  //   checkboxData.map((group, index) => (
  //     <FormGroup key={index} style={{ gap: '8px' }}>
  //       {group.checkboxes.map((checkbox) => (
  //         <FormControlLabel
  //           key={checkbox.value}
  //           control={
  //             <Checkbox
  //               checked={checkboxes[checkbox.value]}
  //               onChange={(e) => handleCheckboxChange(e, checkbox.value)}
  //               value={checkbox.value}
  //               disabled={checkbox.disabled || false}
  //             />
  //           }
  //           label={checkbox.label}
  //           style={{ gap: '5px' }}
  //         />
  //       ))}
  //     </FormGroup>
  //   ));



  return (
    <div className="tool-bar">
      <div style={{ display: 'flex', gap: '10px', textAlign: 'center' }}>
        {factoryColor && auth.type !== 'customer' &&
          <div>
            <h6>Factory Color</h6>
            <ColorPlate setColorSuccess={setColorSuccess} colorSuccess={colorSuccess} selectedRow={rowId} handleColorPlate={handleColorPlate} endPointKey={auth?.type === 'factory' ? 'change-color' : 'change-factory-color'} />
          </div>
        }
        {customerColor && auth.type !== 'factory' &&
          <div>
            <h6>Customer Color</h6>
            <ColorPlate setColorSuccess={setColorSuccess} colorSuccess={colorSuccess} selectedRow={rowId} handleColorPlate={handleColorPlate} endPointKey={auth?.type === 'customer' ? 'change-color' : 'change-customer-color'} />
          </div>
        }
      </div>

      <div className="btn-group">
        {/* {auth.type === "admin" && (
          <Button
            className="btn btn-primary"
            onClick={() => exportSummary(props, setProgressSummary)}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            Export Summary{" "}
            {progressSummary ? (
              <CircularProgress color="inherit" className="hw-12" />
            ) : (
              <></>
            )}
          </Button>
        )} */}
        {/* {auth.type !== "customer" && Array.isArray(rowId) ? rowId.length > 0 : rowId && (
          <Button
            className="btn btn-primary"
            onClick={() => placeOrderOnHold(rowId, props, auth, boolRef)}
          >
            Put On Hold
          </Button>
        )} */}
        {auth.type === "admin" && Array.isArray(rowId) ? rowId.length > 0 : rowId && (
          <>
            {/* <Button
              className="btn btn-primary"
              onClick={() => selectedWaybill(rowId, props, boolRef)}
            >
              Get Waybill
            </Button>
            <Button
              className="btn btn-primary"
              onClick={() => selectedLabel(rowId, props, boolRef)}
            >
              Get Label
            </Button> */}
            {/* <Button
              className="btn btn-primary"
              onClick={() => seletedPlaceOrder(rowId, props, boolRef)}
            >
              Place Order
            </Button> */}
            {/* <Button
              className="btn btn-primary"
              onClick={() => combineOrder(rowId, props, boolRef)}
            >
              Combine Orders
            </Button> */}
          </>
        )}
        {/* {auth.type === "admin" && Array.isArray(rowId) ? rowId.length > 0 : rowId  &&
          rowId.every(id => props.rows.find(row => row._id === id && row.order_status === "Hold")) && (
            <Button
              className="btn btn-primary"
              onClick={() => setForceAccept(rowId)}
            >
              Force Accept
            </Button>
          )} */}
        {/* {auth.type === "admin" && (
          <Button
            className="btn btn-primary"
            onClick={
              () => setGenerateInvoiceModal((e) => !e)
            }
            disabled={loadingGen}
          >
            {loadingGen ? "Generate Invoice..." : "Generate Invoice"}
          </Button>
        )} */}
      </div>


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
              <a
                onClick={() => setGenerateInvoiceModal((e) => !e)}
                className="close-btn"
              >
                <CloseIcon className="icon" />
              </a>
              {/* <div className="modal-icon">
                <FileUploadIcon />
              </div> */}
              <Typography component="p">
                <b>Please check the export field.</b>
              </Typography>
              <Typography component="h2" className="heading">
                Order Information
              </Typography>
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
                <RadioGroup
                  style={{ flexDirection: "row", paddingLeft: "10px" }}
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={exportSheet}
                  name="radio-buttons-group"
                  onChange={(e) => setExportSheet(e.target.value)}
                >
                  <FormControlLabel
                    value="excel"
                    control={<Radio />}
                    label="Export Sheet"
                  />
                  <FormControlLabel
                    value="pdf"
                    control={<Radio />}
                    label="Generate Invoice"
                  />
                </RadioGroup>
                <div
                  style={{
                    flexGrow: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Button
                    className="btn btn-outline-danger"
                    onClick={() => setGenerateInvoiceModal((e) => !e)}
                  >
                    No
                  </Button>
                  <Button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setGenerateInvoiceModal((e) => !e);
                      selectedMarkAsInvoiced(rowId, props, checkboxValues, exportSheet, setloadingGen, boolRef);
                    }}
                  >
                    Yes
                  </Button>
                </div>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

    </div>
  );
}
export default PupringProperties;
