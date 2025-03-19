import React, { useRef, useState } from "react";
import {
    Box,
    Button,
    TextField,
} from "@mui/material";
import "./filter.scss";
import '../style.scss';

const SkuFilter = (props) => {
    const [name, setName] = useState("");
    const boolRef = useRef(false);

    const handleFilterSubmit = () => {
        props.setPaginationModel({
            name: name?.length > 0 ? name?.split(/[ ,\n]+/) : [] ,
        });
        boolRef.current = !boolRef.current
        console.log(name?.length > 0 ? name?.split(/[ ,\n]+/) : [])
    };
    const handleReset = async () => {
        setName("");
        props.setPaginationModel({
            name: [],
            bool: boolRef.current
        });
        boolRef.current = !boolRef.current
    };

    return (
        <div className="filterContainer">
            <Box component="form">
                <Box component="div" className="top-bar">
                    <Box component="div">
                         <TextField
                            type="text"
                            label="Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>

                    <Box component="div" className="btn-group">
                        <Button
                            className="btn btn-primary"
                            onClick={handleReset}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Reset
                        </Button>
                        <Button
                            className="btn btn-primary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleFilterSubmit}
                        >
                            Query
                        </Button>
                    </Box>
                </Box>

            </Box>
        </div>
    );
};

export default SkuFilter