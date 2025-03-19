import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


const userColumns = [
  { field: "email", headerName: "Email", flex: 1 },
  {
    field: "name",
    headerName: "Name",
    flex:1,
  },
  {
    field: "type",
    headerName: "Type",
    flex: 1
  },
  {
    field: "status",
    headerName: "Status",
    flex:1,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

const List = () => {
  const rows = [
    {
      id: 1,
      group: "Group 1",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      fb_group_id: "123456789",
      category: "Category",
      cost: "10$",
    },
    {
      id: 2,
      group: "Group 1",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      fb_group_id: "123456789",
      category: "Category",
      cost: "10$",
    },
    {
      id: 3,
      group: "Group 1",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      fb_group_id: "123456789",
      category: "Category",
      cost: "10$",
    },
    {
      id: 4,
      group: "Group 1",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      fb_group_id: "123456789",
      category: "Category",
      cost: "10$",
    },
    {
      id: 5,
      group: "Group 1",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      fb_group_id: "123456789",
      category: "Category",
      cost: "10$",
    },
  ];
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Id</TableCell>
            <TableCell className="tableCell">Group Name</TableCell>
            <TableCell className="tableCell">FB Group Id</TableCell>
            <TableCell className="tableCell">Category</TableCell>
            <TableCell className="tableCell">Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.img} alt="" className="image" />
                  {row.group}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.fb_group_id}</TableCell>
              <TableCell className="tableCell">{row.category}</TableCell>
              <TableCell className="tableCell">{row.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
