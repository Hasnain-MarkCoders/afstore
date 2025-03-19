import { Backdrop, Box, Button, Fade, FormControl, InputLabel, MenuItem, Modal, Select, TextField, TextareaAutosize, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";


const AddSKUModal = ({open=false, setCname=()=>{},
setEname=()=>{},cname="", ename="", handleModal=()=>{},description="",title="", propertyImage="mandatory", propertyName="mandatory", propertyPair="",factoryPrice="",customerPrice="", handleSubmitAddSKU=()=>{}, setTitle=()=>{}, setDescription=()=>{},setFactoryPrice=()=>{}, setCustomerPrice=()=>{}, setPropertyPair=()=>{}, setPropertyName=()=>{}, setPropertyImage=()=>{}}) => {
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
            Add SKU
          </Typography>
          <form onSubmit={handleSubmitAddSKU}>
            <TextField type="text"
              label="Title"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

<TextField type="text"
              label="Ename"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={ename}
              onChange={(e) => setEname(e.target.value)}
              required
            />

<TextField type="text"
              label="Cname"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={cname}
              onChange={(e) => setCname(e.target.value)}
              required
            />


              

            {/* <TextField type="number"
              inputProps={{ min: 0 }}
              label="SKU ID"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={skuId}
              onChange={(e) => setSkuId(e.target.value)}
              required
            /> */}
            <TextField type="text"
              label="Description"
              fullWidth
              className="field-description"
              InputProps={{
                inputComponent: TextareaAutosize,
                rows: 5
              }}
              variant="outlined"
              style={{ marginBottom: "35px", height: "75px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField 
              inputProps={{ min: 0 }}
              label="Factory Price"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={factoryPrice}
              onChange={(e) => setFactoryPrice(e.target.value)}
            />
            <TextField 
              inputProps={{ min: 0 }}
              label="Customer Price"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={customerPrice}
              onChange={(e) => setCustomerPrice(e.target.value)}
            />
            {/* <TextField type="number"
              inputProps={{ min: 0 }}
              label="Store Id"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
            /> */}
            <TextField type="number"
              inputProps={{ min: 0 }}
              label="Pair"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
              value={propertyPair}
              onChange={(e) => setPropertyPair(e.target.value)}
            />
            <FormControl fullWidth style={{ marginBottom: "20px" }}>
              <InputLabel id="demo-select-small-label">Name</InputLabel>
              <Select
                value={propertyName}
                label="Name"
                onChange={(e) =>setPropertyName(e.target.value)}  
              >
                <MenuItem value={"mandatory"}>Mandatory</MenuItem>
                <MenuItem value={"optional"}>Optional</MenuItem>
                <MenuItem value={"not_mandatory"}>
                  Not Mandatory
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: "20px" }}>
              <InputLabel id="demo-select-small-label">Image</InputLabel>
              <Select
                value={propertyImage}
                label="Image"
                onChange={(e) =>setPropertyImage(e.target.value)}
              >
                <MenuItem value={"mandatory"}>Mandatory</MenuItem>
                <MenuItem value={"optional"}>Optional</MenuItem>
                <MenuItem value={"not_mandatory"}>
                  Not Mandatory
                </MenuItem>
              </Select>
            </FormControl>
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

export default AddSKUModal