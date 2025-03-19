
import { Backdrop, Box, Button, Fade, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";

const TagEditModal = ({handleSubmitUpdateTag=()=>{},handleInput=()=>{} ,fields=null,handleEditModal=()=>{} }) => {
  return (
    <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={handleEditModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
            className="custom-modal"
          >
            <Fade in={!!fields}>
              <Box>
                <form onSubmit={handleSubmitUpdateTag}>
                  <Box className="modal-body">
                    <a
                      onClick={handleEditModal}
                      className="close-btn"
                    >
                      <CloseIcon className="icon" />
                    </a>
                    <Typography className="main-title" component="h2">
                      Update Tag
                    </Typography>

                    <FormControl fullWidth style={{ marginBottom: "20px" }}>
                      <InputLabel id="demo-select-small-label">Type</InputLabel>
                      <Select
                        value={fields?.type}
                        label="Type"
                        onChange={handleInput}
                        name="type"
                      >
                        <MenuItem value={"red"}>Red</MenuItem>
                        <MenuItem value={"blue"}>Blue</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      type="text"
                      label="Name"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                      value={fields?.name}
                      onChange={handleInput}
                      name="name"
                    />
                    <Box className="modal-footer">
                      <Button
                        className="btn btn-outline-primary"
                        onClick={handleEditModal}
                      >
                        Cancel
                      </Button>
                      <Button className="btn btn-primary" type="submit">
                        Update
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Fade>
          </Modal>
  )
}

export default TagEditModal