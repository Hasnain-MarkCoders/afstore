import { Box, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import API from '../../api/api';
import Button from './../../components/Button/Button';
import useAlertStore from '../../zustand/alert';
const emptyArray = []

const LineOrderPropertiesComponent = ({
  fields = emptyArray,
  setFields = () => { },
  isDisabeld = false,
  cb = async () => { }
}) => {
  const {handleAlert}  = useAlertStore()
  const handleCB = async () => {
    try {
      cb()
    } catch (error) {
      console.log(error)
    }
  }

  // helper to clone & replace one entry
  const updateAt = (arr, i, fn) =>
    arr.map((v, idx) => (idx === i ? fn(v) : v));

  const handleKeyChange = (i, newKey) => {
    setFields(f => ({
      ...f,
      properties: updateAt(f.properties, i, obj => {
        const [[, val]] = Object.entries(obj);
        return { [newKey]: val };
      })
    }));
  };

  const handleValueChange = (i, newVal) => {
    setFields(f => ({
      ...f,
      properties: updateAt(f.properties, i, obj => {
        const [[key]] = Object.entries(obj);
        return { [key]: newVal };
      })
    }));
  };

  const saveProperty = async () => {
    let message = null
    try {
    const response = await API.post('/customer/add-missing-name', {
        order_id: fields._id,
        properties: fields.properties
      });
      message = response.data?.message?? "properties saved successfully."

         handleAlert({
        message,
        severity:"success",
        isOpen:true
      })
      await handleCB()
    } catch (error) {
         message = error?.response?.data?.message ?? error.message ?? "Error saving properties."
         handleAlert({
        message,
        severity:"error",
        isOpen:true
      })
      console.log(error)
    } 
  };

  const removeProperty = async i => {
    let message = null 
    if (fields.properties.length == 1) {
      message ="atleast one property is required! you cant delete!"
      return handleAlert({
        message,
        severity:"error",
        isOpen:true
      })
    }
    const newProps = fields.properties.filter((_, idx) => idx !== i);
    setFields(f => ({ ...f, properties: newProps }));
    try {
    
    const response =   await API.post('/customer/add-missing-name', {
        order_id: fields._id,
        properties: newProps
      });
      message = response.data?.message?? "Properties updated successfully."
      handleAlert({
        message,
        severity:"success",
        isOpen:true
      })
      await handleCB()
      
    } catch (error) {
       message = error?.response?.data?.message ?? error.message ?? "Error updating properties."
         handleAlert({
        message,
        severity:"error",
        isOpen:true
      })
      console.log(error)
    } 

  };

  const addProperty = () => {
    setFields(f => ({
      ...f,
      properties: [...f.properties, { "": "" }]
    }));
  };
  useEffect(() => {

  }, [fields])


  return (
    <div>
      {fields?.properties && fields?.properties.length > 0 ?
        <>
          <Box mb={3}>

            <Button 
              title={" Add New Pair"}
            disabled={isDisabeld} variant="contained" onClick={addProperty}/>
           
           
          </Box>

          {fields?.properties?.map((prop, i) => {
           const [[key, val] = ["", ""]] = Object.entries(prop)
            return (
              <Box key={i} display="flex" gap={2} mb={3}>
                <TextField
                  disabled={isDisabeld}
                  label="Key"
                  value={key}
                  onChange={e => handleKeyChange(i, e.target.value)}
                />
                <TextField
                  disabled={isDisabeld}
                  label="Value"
                  value={val}
                  onChange={e => handleValueChange(i, e.target.value)}
                />
                <Button
                  title={"Save"}
                  loadingText="Saving..."
                  disabled={isDisabeld}
                  variant="contained" onClick={saveProperty} />
                <Button
                  title={"Remove"}
                  loadingText="Removing..."
                  disabled={isDisabeld}
                  variant="outlined" onClick={() => removeProperty(i)} />

              </Box>
            );
          })}
        </>
        : ""
      }

    </div>
  )
}

export default LineOrderPropertiesComponent
