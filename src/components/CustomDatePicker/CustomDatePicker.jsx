import { TextField } from '@mui/material'
import React, { useEffect } from 'react'

const CustomDatePicker = ({
    name="",
    date="",
    setDate=()=>{}
}) => {
  return (
    <TextField
    type="date"
    label={name}
    name={name}
    onChange={(e) =>setDate(prevDate=>({...prevDate, [name]:e.target.value}))}
    value={date}
    variant="outlined"
    InputLabelProps={{
      shrink: true, // This will keep the label on top
    }}
  />
  )
}

export default CustomDatePicker