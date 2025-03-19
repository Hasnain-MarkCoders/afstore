import "./widget.scss";
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArticleIcon from '@mui/icons-material/Article';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import API from "../../api/api";

const Widget = ({ type }) => {

  const [length, setLength] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useSelector(
    state => state.user
  )

  useEffect(() => {
    setIsLoading(true)
    API.get(`/${auth?.type}/length`)
    .then((response) => {
        setLength(response?.data)
      }).catch(err=>{
        console.log(err)
      }).finally(()=>{
        setIsLoading(false)
      })
  }, [])



  let data;
  //temporary
  const lineOrders = length?.ordersLength;
  const users = length?.usersLength;
  const skus = length?.skusLength;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        // link: "/users",
        // linkText: "See all users",
        totalLength: users,
        icon: (
          <PersonIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        isMoney: false,
        link: "/afstore",
        linkText: "View all orders",
        totalLength: lineOrders,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
      case "sku":
      data = {
        title: "SKU",
        isMoney: false,
        link: "/sku",
        linkText: "View all sku",
        totalLength: skus,
        icon: (
          <ArticleIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
   default:
      break;
  }

  return (
    <div className="widget"> 
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.totalLength ? data.totalLength :isLoading? <div className="lds-facebook"><div></div><div></div><div></div></div>:"N/A"}
        </span>
        <Link to={data.link} className="link">{data.linkText}</Link>
      </div>
      <div className="right">
        {/* <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div> */}
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
