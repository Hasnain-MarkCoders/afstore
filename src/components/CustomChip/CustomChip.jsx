import { Box } from '@mui/material'
import React from 'react'

const CustomChip = ({ cb = ()=>{}, className="", isDisabled=false,title=""}) => {
  return (
    <Box onClick={cb}  disabled={isDisabled}  className={className}>
          {title}
        </Box>
  )
}

export default CustomChip