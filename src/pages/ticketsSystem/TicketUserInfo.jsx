import { Box, Button, Fade, Modal, Typography, Backdrop } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import * as React from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutohideSnackbar from '../../components/snackbar/Snackbar';
import { localeDateAndTime } from '../../Utils/Utils';

export default function   TicketUserInfo({ data }) {
  const auth = useSelector((state) => state.user);
  const [snackbar, setSnackbar] = React.useState({
    open:false,
    message:""
  })

  const [propertiesData, setPropertiesData] = React.useState(null);
  // Function to format keys
  const formatKey = (key) => {
    // Replace underscores with spaces
    let formattedKey = key.replace(/_/g, ' ');
    // Capitalize the first letter of each word
    formattedKey = formattedKey.replace(/\b\w/g, c => c.toUpperCase());
    return formattedKey;
  };

  // const keysToDisplay = ["name", "po_id", 'order_status', 'quantity', 'color', 'date', 'email', 'phone', 'shipping_name', 'shipping_address', 'city', 'country', 'zip', 'customer_price',"tracking_number"]; // Define keys you want to display
  const keysToDisplay = ["name", "po","po_id","waybill_number", 'order_status', 'quantity', 'color', 'date', 'email', 'phone', 'shipping_name', 'shipping_address', 'city', 'country', 'zip', 'customer_price', "factory_color","tracking_number"]; 
  
  // Define keys you want to display

  const shouldDisplayKey = (key) => {
    // Add your condition here to determine if a key should be displayed
    return keysToDisplay.includes(key);
  };

  let userColumns = []
  if (data?.properties && (data?.properties[0]?.name || data?.properties[0]?.value)) {
    userColumns = [
      {
        field: "name", headerName: "Name", minWidth: 100, flex: 1,
        renderCell: (params) => {
          return (params.row?.name && <div>
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
  } else {
    userColumns = []
  }

  const handleCopy=(field,text)=>{
    navigator.clipboard.writeText(text)
    setSnackbar({
      open:true,
      message:`${field} Copied to clipboad.`
    })
  }
  return (
    <div className="user-details">
      {data ? Object.entries(data)?.map(([key, value], index) => {
        if (shouldDisplayKey(key)) {
          return (
            <div key={index}>
            {key === "factory_color" && auth.type !== "admin" ? null :
            <>
            
              <div className="detailItem" key={key}>
                <Box sx={{
                  display:"flex",
                  alignItems:"center",
                  gap:"10px"
                }}>
                {["po","name", "tracking_number", "waybill_number"].includes(key)?<Tooltip title={`Copy ${key}`}><ContentCopyIcon style={{cursor:"pointer"}} onClick={()=>handleCopy(key, value)}/></Tooltip>:null}
                <p className="itemKey">{formatKey(key)}:</p>
                </Box>
                <p className="itemValue">
                  {key.includes("color") ? 
                    (auth.type === "admin" && key === "factory_color" ? 
                      <>
                        <span style={{display:"inline-block", width:"10px", height:"10px", background:value === "purple" ? "#6439ff" : value}}></span>
                      </> 
                      : 
                      <>
                      
                      <span style={{display:"inline-block", width:"10px", height:"10px", background:value  === "purple" ? "#6439ff" : value}}></span>
                      </>

                    ) 
                    : 
                    key=="date"?localeDateAndTime(value):value??"N/A"
                  }
                </p>
              </div>
              </>
            }
          </div>
          );
        } else {
          return null; // Skip rendering for other keys
        }
      }) :
        <div className='loader'>
           <span>Select Ticket</span>
        </div>
      }
      {data?.properties?.length > 0 &&
        <Button className='btn btn-primary' onClick={() => setPropertiesData(data.properties)}>Properties</Button>
      }
      {/* Modal for editing line orders */}
      {propertiesData && <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={true}
        onClose={() => setPropertiesData(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal edit-modal"
      >
        <Fade in={!!propertiesData} >
          <Box>

            <Box className="modal-body" >
              <a onClick={() => setPropertiesData(null)} className="close-btn">
                <CloseIcon className="icon" />
              </a>
              <Typography className="main-title" component="h2">
                Properties
              </Typography>
              <div className="datatable skuTable" style={{ position: "relative", minHeight: '150px' }}>

                {data?.properties &&
                  <DataGridPro
                    className="datagrid"
                    getRowId={(row) => row.id ? row.id : Math.random().toString()}
                    rows={data?.properties}
                    columns={userColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                  />
                }
              </div>

              <Box className="modal-footer">
                <Button
                  className="btn btn-outline-primary"
                  onClick={() => setPropertiesData(null)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>}
      <AutohideSnackbar open = {snackbar.open} message = {snackbar.message} onClose={()=>setSnackbar({open:false, message:""})}/>

    </div>
  );
}
