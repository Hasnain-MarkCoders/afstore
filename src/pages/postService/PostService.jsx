import React, { useState, useRef } from "react";
import { Box, Button, Modal, Typography, Fade, Backdrop, Container, TextField, TextareaAutosize, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Switch, FormControlLabel, FormGroup, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import PostServiceGrid from "./PostServiceGrid";
import CloseIcon from "@mui/icons-material/Close";
import useQueryPostService from "../../Hooks/useQueryPostService/useQueryPostService";
import AddPostServiceModal from "../../components/AddServiceModal/AddServiceModal";

export const PostService = ({ setShowSideBar }) => {

  const [paginationModel, setPaginationModel] = useState({})
  const [refresh, setRefresh] = useState(false);
  const { isLoading, data } = useQueryPostService(paginationModel, refresh);
  const [addServiceError, setAddServiceError] = useState(null)
  const handleAddServiceError = (data) => {
    setAddServiceError(data);
  };

  // add modal
  const [open, setOpen] = React.useState(false);
  const handleModal = () => {
    setOpen((prevOpenModal) => !prevOpenModal);
  };
  const handleRefresh=()=>{
    setRefresh((prev)=>!prev)
  }

  const boolRef = useRef(false);

  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="post-service">
        <div className="add-category" >
          <h2 className="page-title">Post Service</h2> 
          <div style={{display:'flex' , alignItems:'center' , gap: 10}}>
          {/* <Button onClick={handleResetSchedule} className="btn btn-outline-primary">
            Reset All Schedule
          </Button> */}
          <Button onClick={handleModal} className="btn btn-outline-primary">
            Add Service
          </Button>
          </div>
          <AddPostServiceModal cb={handleRefresh} open={open} handleClose={()=>{setOpen(false)}}/>
          {/* <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
            className="custom-modal"
          >
            <Fade in={open} >
              <Box>
                <Box className="modal-body" >
                  <a onClick={handleModal} className="close-btn">
                    <CloseIcon className="icon" />
                  </a>
                  <Typography className="main-title" component="h2">
                    Add Service Post
                  </Typography>
                  <form onSubmit={handleSubmitAddServicePost}>
                    <TextField type="text"
                      label="Service Code"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                      value={serviceCode}
                      onChange={(e) => setServiceCode(e.target.value)}
                      required
                    />
                     <TextField type="text"
                      label="Service Type"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      required
                    />
                     <TextField
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      label="Service Cost"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                      value={serviceCost}
                      onChange={(e) => setServiceCost(e.target.value)}
                      required
                    />
                    <Box className="modal-footer">
                      <Button
                        className="btn btn-outline-primary"
                        onClick={handleModal}
                      >
                        Cancel
                      </Button>
                      <Button className="btn btn-primary" type="submit">
                        Add
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Box>
            </Fade>
          </Modal> */}
        </div>
        <PostServiceGrid handleRefresh={handleRefresh} rows={data} isLoading={isLoading} setPaginationModel={setPaginationModel}  />
      </div>
    </Container>
    {addServiceError &&
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={true}
        onClose={() => handleAddServiceError(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal delete-modal"
      >
        <Fade in={!!addServiceError} >
          <Box>
            <Box className="modal-body" >
              <a onClick={() => handleAddServiceError(null)} className="close-btn">
                <CloseIcon className="icon" />
              </a>
              <Typography className="main-title" component="h2" color={'red'}>
                Error
              </Typography>
              <Typography component="p">
                {addServiceError}
              </Typography>
              <Box className="modal-footer">
                <Button className="btn btn-outline-primary" onClick={() => handleAddServiceError(null)}>
                  Ok
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    }
  </>
  );
};
