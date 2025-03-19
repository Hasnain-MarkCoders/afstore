import { Snackbar } from "@mui/material";
// import { useSelector } from "react-redux";

const ColorPlate = ({selectedRow ,handleColorPlate , colorSuccess ,setColorSuccess,endPointKey }) => { 
  const {open , vertical , horizontal} = colorSuccess || {
    open: false,
    vertical: 'top',
    horizontal: 'center',
  };
  // const auth = useSelector((state) => state.user);
  // const endPointKey = (auth?.type === 'customer') ? 'change-color' : (auth.type === "factory") ? "change-color" : "change-cutomer-color";
    return (
      <>
        <div className="color-plate">
            <div
              className="color-palte-item"
              title="Red"
              onClick={() => handleColorPlate(selectedRow, "red" , endPointKey)}
            >
              1
            </div>
            <div
              className="color-palte-item"
              title="Yellow"
              onClick={() => handleColorPlate(selectedRow, "yellow" , endPointKey)}
            >
              2
            </div>
            <div
              className="color-palte-item"
              title="Purple"
              onClick={() => handleColorPlate(selectedRow, "purple" , endPointKey)}
            >
              3
            </div>
            <div
              className="color-palte-item"
              title="Green"
              onClick={() => handleColorPlate(selectedRow, "green" , endPointKey)}
            >
              4
            </div>
            <div
              className="color-palte-item"
              title="Black"
              onClick={() => handleColorPlate(selectedRow, "black" , endPointKey)}
            >
              5
            </div>
            <div
              className="color-palte-item"
              title="Skyblue"
              onClick={() => handleColorPlate(selectedRow, "skyblue" , endPointKey)}
            >
              6
            </div>
            <div
              className="color-palte-item"
              title="Sceen"
              onClick={() => handleColorPlate(selectedRow, "sceen" , endPointKey)}
            >
              7
            </div>
            <div
              className="color-palte-item"
              title="Dark Purple"
              onClick={() => handleColorPlate(selectedRow, "darkpurple" , endPointKey)}
            >
              8
            </div>
            <div
              className="color-palte-item"
              title="Pink"
              onClick={() => handleColorPlate(selectedRow, "pink" , endPointKey)}
            >
              9
            </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={()=>setColorSuccess({ ...colorSuccess, open: false })}
        message="Color applied successfully"
        key={vertical + horizontal}
      />
      </>
  );
}

export default ColorPlate;