import { Backdrop, Box, Button, Fade, Modal, TextField, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";

const AddCountryModal = ({open=false, handleAddCountryModal=()=>{},setCountry=()=>{}, setFirstItemPrice=()=>{}, country="",nItemPrice="",firstItemPrice="",setnNItemPrice=()=>{},handleSubmitAddCountry=()=>{}, errorMsg=""}) => {
  return (
    <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={open}
    onClose={handleAddCountryModal}
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
          <a onClick={handleAddCountryModal} className="close-btn">
            <CloseIcon className="icon" />
          </a>
          <Typography className="main-title" component="h2">
            Add Shipment Price
          </Typography>
          <form onSubmit={handleSubmitAddCountry}>
            <TextField type="text"
              label="Country"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            <TextField type="number"
              label="First Item Price"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={firstItemPrice}
              onChange={(e) => setFirstItemPrice(e.target.value)}
              required
            />
            <TextField type="number"
              label="N Item Price"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "10px" }}
              value={nItemPrice}
              onChange={(e) => setnNItemPrice(e.target.value)}
              required
            />
             {errorMsg &&
              <p className="text-danger" style={{ marginBottom: "25px", color: "red", textAlign:"center" }}>{errorMsg}</p>
            }
            <Box className="modal-footer">
              <Button
                className="btn btn-outline-primary"
                onClick={handleAddCountryModal}
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
  )
}

export default AddCountryModal