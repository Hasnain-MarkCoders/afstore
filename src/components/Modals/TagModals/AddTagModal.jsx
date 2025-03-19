
import React from 'react'
import { Backdrop, Box, Button, Fade, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";

const AddTagModal = ({open=false, handleModal=()=>{}, handleSubmitAddTag=()=>{}, setType=()=>{},type="red" , name="", setName=()=>{}}) => {
    
  return (
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
                    Add Tags
                  </Typography>
                  <form onSubmit={handleSubmitAddTag}>
                  <FormControl fullWidth style={{ marginBottom: "20px" }}>
                      <InputLabel id="demo-select-small-label">Type</InputLabel>
                      <Select
                        value={type}
                        label="Type"
                        onChange={(e) =>setType(e.target.value)}  
                      >
                        <MenuItem value={"red"}>Red</MenuItem>
                        <MenuItem value={"blue"}>Blue</MenuItem> 
                      </Select>
                    </FormControl>
                    <TextField type="text"
                      label="Name"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
  )
}

export default AddTagModal