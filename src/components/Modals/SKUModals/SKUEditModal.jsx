
import { Backdrop, Box, Button, Fade, IconButton, Modal, TextField, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete";
const SKUEditModal = ({
  handleEditModal = () => { },
  fields = null,
  sku = "",
  setSku = () => { },
  sku_id = "",
  setSkuId = () => { },
  unit_price = null,
  setUnitPrice = () => { },
  handleSubmitUpdateSKU = () => { },
  handleAddKey = () => { },
  handleUpdateKey = () => { },
  handleRemoveKey = () => { },
  keys = {},
  isLoading=false
}) => {

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={true}
      onClose={isLoading ? ()=>{}:handleEditModal}
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
                onClick={isLoading ? ()=>{}:handleEditModal}
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
              <TextField 
              type="number"
                inputProps={{ min: 0, step: "any" }}
                label="UNIT_PRICE"
                fullWidth
                variant="outlined"
                style={{ marginBottom: "20px" }}
                value={unit_price}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
              <Typography variant='h6'>
                Custom SKU Properties
              </Typography>
              <Box>
                {
                  Object.entries(keys).map(([key, value]) => (
                    <Box sx={{
                      display: "flex",
                      alignItems: "center"
                    }}>

                      <TextField
                        fullWidth
                        onChange={(e) => { handleUpdateKey(key, e.target.value) }}
                        value={value}
                        variant='outlined'
                        label={`Property.${key}`}
                      />
                      <IconButton color="error" onClick={()=>{handleRemoveKey(key)}}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))
                }
                <Button 
                sx={{
                  my:"20px"
                }}
                onClick={handleAddKey}
                variant='outlined'>
                  + Add New Property
                </Button>
              </Box>

              <Box className="modal-footer">
                <Button
                  className="btn btn-outline-primary"
                  onClick={isLoading ? ()=>{}:handleEditModal}
                >
                  Cancel
                </Button>
                <Button className="btn btn-primary" type="submit">
                  {isLoading ? "Updating..." :"Update"}
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