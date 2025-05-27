import React, { useState } from 'react'
import { Button as MUI_BUTTON } from '@mui/material'
const Button = ({
    variant,
    onClick = () => { },
    disabled,
    title,
    loadingText
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const handleClick = async() => {
        try {
            setIsLoading(true)
          await  onClick()
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <MUI_BUTTON
            onClick={handleClick}
            disabled={disabled}
            variant={variant}>
            {isLoading? loadingText??"Loading...":title??"Click Here"}
        </MUI_BUTTON>
    )
}

export default Button
