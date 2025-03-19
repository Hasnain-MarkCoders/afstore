
import { Backdrop, Box, Button, Fade, FormControl, InputLabel,Select, MenuItem, Modal, TextField, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close"

const SKUEditModal = ({
  handleEditModal=()=>{},
  fields=null,
  sku="",
  setSku=()=>{},
  sku_id="",
  setSkuId=()=>{},
  unit_price=null,
  setUnitPrice=()=>{},
 handleInput=()=>{},
 handleSubmitUpdateSKU=()=>{}

}) => {
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
                <form onSubmit={handleSubmitUpdateSKU}>
                  <Box className="modal-body">
                    <a
                      onClick={handleEditModal}
                      className="close-btn"
                    >
                      <CloseIcon className="icon" />
                    </a>
                    <Typography className="main-title" component="h2">
                      Update SKU
                    </Typography>
                                 <TextField type="text"
                                    label="SKU"
                                    fullWidth
                                    variant="outlined"
                                    style={{ marginBottom: "20px" }}
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    required
                                  />
                     <TextField type="text"
                     disabled={true}
                                    label="SKU_ID"
                                    fullWidth
                                    variant="outlined"
                                    style={{ marginBottom: "20px" }}
                                    value={sku_id}
                                    onChange={(e) => setSkuId(e.target.value)}
                                    required
                                  />
                                  <TextField type="number"
                                  inputProps={{ min: 0 }}
                                  label="UNIT_PRICE"
                                  fullWidth
                                  variant="outlined"
                                  style={{ marginBottom: "20px" }}
                                  value={unit_price}
                                  onChange={(e) => setUnitPrice(e.target.value)}
                                  required
                                />

                    {/* <TextField
                      type="text"
                      label="Title"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                      value={fields?.title}
                      onChange={handleInput}
                      name="title"
                    />
                     <TextField
                      type="text"
                      label="Ename"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                      value={fields?.ename}
                      onChange={handleInput}
                      name="ename"
                    />
                     <TextField
                      type="text"
                      label="Cname"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                      value={fields?.cname}
                      onChange={handleInput}
                      name="cname"
                    />
                    <TextField
                      type="text"
                      label="Production Time"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                      value={fields?.production_time}
                      onChange={handleInput}
                      name="production_time"
                    />
                    <TextField
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      label="Factory Price RMB"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                      value={fields?.factory_price}
                      onChange={handleInput}
                      name="factory_price"
                    />
                    <TextField
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      label="Customer Price USD"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                      value={fields?.customer_price}
                      onChange={handleInput}
                      name="customer_price"
                    />
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label="Pair"
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "10px" }}
                      value={fields?.properties.pair}
                      onChange={handleInput}
                      name="pair"
                    />
                    <FormControl fullWidth style={{ marginBottom: "20px" }}>
                      <InputLabel id="demo-select-small-label">Name</InputLabel>
                      <Select
                        value={fields?.properties?.name}
                        label="Name"
                        onChange={handleInput}
                        name="name"
                      >
                        <MenuItem value={"mandatory"}>Mandatory</MenuItem>
                        <MenuItem value={"optional"}>Optional</MenuItem>
                        <MenuItem value={"not_mandatory"}>Not Mandatory</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth style={{ marginBottom: "20px" }}>
                      <InputLabel id="demo-select-small-label">Image</InputLabel>
                      <Select
                        value={fields?.properties?.image}
                        label="Image"
                        onChange={handleInput}
                        name="image"
                      >
                        <MenuItem value={"mandatory"}>Mandatory</MenuItem>
                        <MenuItem value={"optional"}>Optional</MenuItem>
                        <MenuItem value={"not_mandatory"}> Not Mandatory </MenuItem>
                      </Select>
                    </FormControl> */}
                    {/* <FormGroup>
                    <FormControlLabel control={<Switch checked={fields.properties.name} name='name'  onChange={handleInput} />} label="Property Name" />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel control={<Switch checked={fields.properties.image} name='image' onChange={handleInput} />} label="Property Image" />
                  </FormGroup> */}

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

export default SKUEditModal