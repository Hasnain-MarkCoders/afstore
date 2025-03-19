import { Button } from "@mui/material";
import {  gridPageSelector,
    gridPageCountSelector,
    useGridApiContext,
    useGridSelector } from "@mui/x-data-grid-pro";
import { useState } from "react";
    
export const Toolbar = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    const [customPage, setCustomPage] = useState(page + 1);
    const handleCustomPageChange = (event) => {
      const newPage = parseInt(event.target.value, 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= pageCount) {
        setCustomPage(newPage);
      }
    };
  
    const goToCustomPage = () => {
      apiRef.current.setPage(customPage - 1);
    };
 
    return (<div className="custom-pagination">
      <input
        type="number"
        value={customPage}
        onChange={handleCustomPageChange}
        min={1}
        max={pageCount}
      />
      <Button className="btn btn-primary" onClick={goToCustomPage}>
        Go
      </Button>
      </div>
    );
  };
  