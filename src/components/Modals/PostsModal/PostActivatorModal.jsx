import { Backdrop, Box, Button, Fade, Modal, TextField, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close"
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
const PostActivatorModal = ({
    handleModal=()=>{},
     endDate=dayjs(),
     startDate=dayjs(),
     fields=null,
     setStartDate=()=>{},
     setEndDate=()=>{},
      handleSubmitActivate=()=>{}
    }) => {
      
  return (
    <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={true}
    onClose={handleModal}
    closeAfterTransition
    slots={{ backdrop: Backdrop}}
    slotProps={{
      backdrop: {
        timeout: 500,
      },
    }}
    className="custom-modal"
  >
    <Fade in={!!fields}>
      <Box>
        <Box className="modal-body">
          <a onClick={handleModal} className="close-btn">
            <CloseIcon className="icon" />
          </a>
          <Typography className="main-title" component="h2">
            Activate
          </Typography>
          <form onSubmit={handleSubmitActivate}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              className="datePicker-box"
              style={{ width: "100%" }}
            >
              <div>
                <DatePicker
                  label="Start Date"
                  fullWidth
                  className="datePicker-field"
                  variant="outlined"
                  style={{ marginBottom: "20px" }}
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="End Date"
                  fullWidth
                  className="datePicker-field"
                  variant="outlined"
                  style={{ marginBottom: "20px" }}
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </LocalizationProvider>
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

export default PostActivatorModal