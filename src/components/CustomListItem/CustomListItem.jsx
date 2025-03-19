import { Box, Button } from "@mui/material";
import React from "react";

const CustomListItem = ({isVisible = true,style={}, cb = ()=>{}, title = ""}) => {
  return (
    <>
      {isVisible ? (
        <li>
          <Button sx={style} onClick={cb}>{title}</Button>
        </li>
      ) : null}
    </>
  );
};

export default CustomListItem;
