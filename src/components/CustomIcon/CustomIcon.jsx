import { Box, IconButton, Tooltip } from '@mui/material'
import React from 'react'

const CustomIcon = ({cb=()=>{},title="", style={},isDisabled=false,className="", icon=<></>}) => {
  return (
    <Box
    disabled={isDisabled}
            onClick={cb}
            className={className}>
              <Tooltip title={title}>
                <IconButton sx={style}>
                  {icon}
                </IconButton>
              </Tooltip>
            </Box>
  )
}

export default CustomIcon