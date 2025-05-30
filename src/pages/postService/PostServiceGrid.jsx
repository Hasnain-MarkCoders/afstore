import React, { useEffect, useState, useRef } from "react";
import API from "../../api/api";
import { DataGridPro } from "@mui/x-data-grid-pro";
import DoneIcon from "@mui/icons-material/Done";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  Box,
  Button,
  Modal,
  Typography,
  Fade,
  Backdrop,
  Container,
  TextField,
  TextareaAutosize,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Switch,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import ErrorModal from "../../components/Modals/ErrorModal";
import PostEditModal from "../../components/Modals/PostsModal/PostEditModal";
import PostActivatorModal from "../../components/Modals/PostsModal/PostActivatorModal";
import CustomIcon from "../../components/CustomIcon/CustomIcon";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import EditStateModal from "../../components/EditStateModal/EditStateModal";
import MakePremiumPostServiceModal from "../../components/MakePremiumPostServiceModal/MakePremiumPostServiceModal";
import DeletePostServiceModal from "../../components/DeletePostServiceModal/DeletePostServiceModal";
import { useSelector } from "react-redux";

const formattedDateTime = (date) => {
  const dateTime = new Date(date);
  const formattedDate = dateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Format options for date and time
  const timeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const formattedTime = dateTime.toLocaleTimeString(
    undefined,
    timeFormatOptions
  );

  const formatted = `${formattedDate}`;
  return formatted;
};


const PostServiceGrid = ({ rows, isLoading , handleRefresh=()=>{}, setPaginationModel=()=>{}}) => {
  const [paginationModelPostService, setPaginationModelPostSrevice] = useState({
    page: 0,        // Current page index (0-based)
    pageSize: 12,   // Number of rows per page
  });

  // Handle pagination changes
  const handlePaginationModelChange = (newModel) => {
    setPaginationModelPostSrevice(newModel);
  };
  const auth = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: '',
  });
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());
  // add modal
  const [fields, setFields] = React.useState(null);
  const [editFields, setEditFields] = React.useState(null);
  const [PremiumPostServiceField, setPremiumPostServiceField] = useState(null)
  const [deletePostService, setDeletePostService] = useState(null)
  const boolRef = useRef(false);

  const [serviceError, setServiceError] = useState(null);
  const handleSetServiceError = (data) => {
    setServiceError(data);
  };
  const handleEditModal = (data) => {
    setEditFields(data);
  };

  const handleDeletePostServiceModal = (data) => {
    setDeletePostService(data);
  };



  const handleModal = (data) => {
    setFields(data);
  };

  const handleSubmitActivate = async (e) => {
    e.preventDefault();

    await API.post(`/admin/set-post-service`, {
      id: fields._id,
      start_date: startDate,
      end_date: endDate,
    })
      .then((responce) => {
        setFields(null);
        setPaginationModel({ bool: boolRef.current });
        boolRef.current = !boolRef.current;
        // Reset the form fields
        setStartDate(dayjs());
        setEndDate(dayjs());
      })
      .catch((error) => {
        handleSetServiceError(error?.response?.data?.message);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  const handlePremium =async(data)=>{
    try{
      setLoading(true)
    const response = await API.post(`${auth.type}/toggle-premium`, data);
    handleRefresh()
    if (response.data){
      setSnackbar({
        open: true,
        message: response?.data?.message,
        severity: 'success',
      });
    }

      
    }catch(error){ 
      setSnackbar({
        open: true,
        message: error?.message,
        severity: 'error',
      });
    }finally{
      setLoading(false)
    }
  }

const columns = [
  {
    field: "country",
    headerName: "Country",
    flex: 1,
 
  },
  {
    field: "country_code",
    headerName: "Country Code",
    flex: 1,
  
  },
  {
    field: "loss_code",
    headerName: "Loss Code",
    flex: 1,
  
  },
  {
    field: "service",
    headerName: "Service",
    flex: 1,
   
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    renderCell: (params) => {
      return (
        <>
            <Chip
              label={
                new Date(params.row.date).toLocaleDateString() + " | " +
                new Date(params.row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
              }
            />
        </>

      );
    },
   
  },
  {
    field: "states",
    headerName: "States",
    flex: 1,
    renderCell: (params) => {
      const states = params.row.state
      return (
        <Box sx={{overflowX:"auto"}}>
          {states?.map((state) => (
            <Chip
            disabled={loading}
            onClick= {()=>{
              const data = {id:params.row._id, state:state.name}
              handlePremium(data)
              // alert(JSON.stringify(params.row))
            }}
              key={state._id}
              label={state.name}
              color={state.is_premium ? "primary" : "default"}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>

      );
    },

    
  },
  {
    field: "state",
    headerName: "Action",
    flex: 1,
    renderCell: (params) => {
      const states = params.row.state
      return (
        <>
         { auth.type =="suadmin" &&<CustomIcon
             title={"Edit"}
             className="action-icon-btn editBtn"
             cb={()=>{handleEditModal({_id:params.row._id, states, loss_code:params.row.loss_code,service:params.row.service })}}
             icon={<EditIcon/>}
            />}
             {/* <CustomIcon
             title={"Premium"}
             className="action-icon-btn editBtn"
             cb={()=>{handlePremiumPostServiceModal({_id:params.row._id, states}); console.log(states)}}
             icon={<StarBorderIcon/>}
            /> */}
               <CustomIcon
             title={"Delete"}
             className="action-icon-btn editBtn"
             cb={()=>{handleDeletePostServiceModal({_id:params.row._id, states}); console.log(states)}}
             icon={<DeleteForeverIcon/>}
            />
        
        </>

      );
    },
  },

  
];
  

  return (
    <Box className="datatable" sx={{ height: "calc(100vh - 180px)" }}>
      <DataGridPro
        // rows={rows}
        // getRowId={(row) => row._id}
        // columns={[...columns]}
        // pageSize={12}
        // pagination
        // disableSelectionOnClick={true}
        // autoHeight
        // rowsPerPageOptions={[12, 20, 30, 40, 50]}
        // onPaginationModelChange={handlePaginationModelChange}
        // // pageSizeOptions={[5, 10, 20, 50]}
        // loading={isLoading}
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        pagination
        paginationModel={paginationModelPostService}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[12, 20, 30, 40, 50]} // Corrected prop name
        rowsPerPageOptions={[12, 20, 30, 40, 50]}

        loading={isLoading}

        disableRowSelectionOnClick
        initialState={{
          pagination: {
            pageSize: 12, // Set your default page size here
          },
        }}
      />
          
      {fields && (
        <PostActivatorModal 
        cb={handleRefresh}
        handleModal={() => handleModal(null)}
        fields={fields}
        handleSubmitActivate={(e)=>handleSubmitActivate(e)}
        endDate={endDate}
        startDate={startDate}
        setStartDate={(e)=>setStartDate(e)}
        setEndDate={(e)=>setEndDate(e)}
      />
      )}
            
          { editFields && <EditStateModal
          cb={handleRefresh}
            open={!!editFields}
            handleClose={()=>handleEditModal(null)}
            postService={editFields||{}}
            />}


          { PremiumPostServiceField && <MakePremiumPostServiceModal
          cb={handleRefresh}
            open={!!PremiumPostServiceField}
            handleClose={()=>setPremiumPostServiceField(null)}
            postService={PremiumPostServiceField||{}}
            />}

            {
             deletePostService && <DeletePostServiceModal
             cb={handleRefresh}
              
              open={!!deletePostService}
              handleClose={()=>setDeletePostService(null)}
              postService={deletePostService||{}}
              />
            }
      {/* {editFields && (
       <PostEditModal
       handleEditModal={()=>handleEditModal(null)}
       editFields={editFields}
       handleSubmitEdit={()=>handleSubmitEdit()}
       handleInput={(e)=>handleInput(e)}
     />
      )} */}
        

        <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
        </Snackbar>
      {serviceError && (
       <ErrorModal
       reason={serviceError}
       handleErrorModal={()=> handleSetServiceError(null)}
       />
      )}
       
    </Box>
  );
};

export default PostServiceGrid;
