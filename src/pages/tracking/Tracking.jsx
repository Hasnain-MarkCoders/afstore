import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Modal, Typography, Fade, Backdrop, Container, TextField, TextareaAutosize, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Switch, FormControlLabel, FormGroup, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar"; 
import CloseIcon from "@mui/icons-material/Close";
import API from "../../api/api";
import TrackingGrid from "./TrackingGrid";
import useQueryTracking from "../../Hooks/useQueryTracking/useQueryTracking";
const Tracking = ({ setShowSideBar }) => {

  const [paginationModel, setPaginationModel] = useState({})
  const { isLoading, data } = useQueryTracking(paginationModel);

  const [startsWith, setStartsWith] = useState('');
  const [endsWith, setEndsWith] = useState('');
  const [url, setUrl] = useState('');
  const [company, setCompany] = useState('');

  const [addServiceError, setAddServiceError] = useState(null)
  const handleAddTrackingError = (data) => {
    setAddServiceError(data);
  };
  const [open, setOpen] = React.useState(false);
  const handleModal = () => {
    setOpen((prevOpenModal) => !prevOpenModal);
  };

  const boolRef = useRef(false);
  const handleSubmitAddServicePost = async (e) => {
    e.preventDefault();

    API.post(`/admin/tracking/add`, {
      starts_with: startsWith,
      ends_with: endsWith,
      url: url,
      company: company,
    })
      .then((responce) => {
        handleModal();
        setPaginationModel({ bool: boolRef.current })
        boolRef.current = !boolRef.current
        setEndsWith("");
        setStartsWith("");
        setUrl('');
        setCompany('');
      }).catch((error) => {
        handleAddTrackingError(error?.response?.data?.message)
      })

  };
  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="post-service">
        <div className="add-category" >
          <h2 className="page-title">Tracking</h2> 
          <div style={{display:'flex' , alignItems:'center' , gap: 10}}>
          <Button onClick={handleModal} className="btn btn-outline-primary">
            Add Tracking
          </Button>
          </div>
          <Modal
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
                      label="Starts With"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                      value={startsWith}
                      onChange={(e) => setStartsWith(e.target.value)}
                      required
                    />
                     <TextField type="text"
                      label="Ends With"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                      value={endsWith}
                      onChange={(e) => setEndsWith(e.target.value)}
                      required
                    />
                     <TextField type="text"
                      label="URL"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                     <TextField type="text"
                      label="Company"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
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
          </Modal>
        </div>
        <TrackingGrid  rows={data} isLoading={isLoading} setPaginationModel={setPaginationModel}  />
      </div>
    </Container>


    {addServiceError &&
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={true}
        onClose={() => handleAddTrackingError(null)}
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
              <a onClick={() => handleAddTrackingError(null)} className="close-btn">
                <CloseIcon className="icon" />
              </a>
              <Typography className="main-title" component="h2" color={'red'}>
                Error
              </Typography>
              <Typography component="p">
                {addServiceError}
              </Typography>
              <Box className="modal-footer">
                <Button className="btn btn-outline-primary" onClick={() => handleAddTrackingError(null)}>
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


export default Tracking;