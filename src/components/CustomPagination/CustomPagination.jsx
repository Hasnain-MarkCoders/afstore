import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box, Typography, Button } from '@mui/material';
const CustomPagination = ({handleBackpage=()=>{},handleLimitChange=()=>{},isBack=false,total=10, page=1, handleNextPage=()=>{},pageSize=5,isLoading=false,isNext=true, setLimit=()=>{}}) => {
    let temp = page
    const [input, setInput] = React.useState(10); // Set default value to 10

    const handleChange = (event) => {
        setInput(event.target.value);
        setLimit(event.target.value)
        handleLimitChange(event.target.value)
    };

    return (
        <Box sx={{
            p:"10px",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between"
        }}>
                <Box sx={{
                    display:"flex",
                    alignItems:"center",
                    gap:"8px"
                }}>
                        <Typography sx={{fontSize:{
                            lg:"1rem",
                            xs:"10px"
                        }}}>Rows per page: </Typography>
                        <FormControl sx={{ minWidth: 10, minHeight:"10px" , height:"auto"}}>
                            <Select
                            disabled={isLoading}
                            sx={{
                                fontSize:{
                                    lg:"1rem",
                                    xs:"10px"
                                }
                            }}
                                value={input}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>

                            </Select>
                        </FormControl>
                </Box>
                <Box sx={{
                    display:"flex",
                    alignItems:"center",
                    gap:"10px"
                }}>
              <Typography sx={{
    fontSize: {
        lg: "1rem",
        xs: "10px"
    }
}}>


    {(pageSize*--temp)+" - "+ pageSize*page} of {total}
</Typography>
    
                <Box sx={{
                    display:"flex",
                    alignItems:"center",
                    gap:"10px",
                }}>
                    <Button 
                    disabled={ isLoading || isBack}
                    onClick={()=>handleBackpage(input)}
                    
                    sx={{
                        fontSize:{
                            lg:"1rem",
                            xs:"10px"
                        },
                        width:"10px !important",
                        minWidth:"10px",
                        color:"black",
                        fontWeight:"bold"

                    }}>
                        {"<"}
                    </Button>
                    <Button
                    disabled={isLoading || isNext}
                    onClick={()=>handleNextPage(input)}
                    sx={{
                        fontSize:{
                            lg:"1rem",
                            xs:"10px"
                        },
                        width:"10px !important",
                        minWidth:"10px",
                        color:"black",
                        fontWeight:"bold"

                    }}>
                        {">"}
                    </Button>
                </Box>
                </Box>
               
            </Box>
    )
}

export default CustomPagination;
