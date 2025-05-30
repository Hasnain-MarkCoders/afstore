import axios from "axios";

const API = axios.create({
  // baseURL: "https://anton.markcoders.com/linton_backend/api",
  baseURL: "https://afstore.lintonusa.com/server/api/",
  // baseURL: "https://5g3t370z-4242.inc1.devtunnels.ms/api/",
  // baseURL: "https://pqzfs3nc-4242.inc1.devtunnels.ms/api/",

  


  // baseURL: "https://9hjl5qp6-5000.inc1.devtunnels.ms/api",
  // baseURL: "https://pxgl3cx4-5000.euw.devtunnels.ms/api",


  // baseURL: "https://aws.markcoders.com/server/api",
  // baseURL: "https://xdtc.lintonusa.com/server/api",
  // baseURL: "https://anton.markcoders.com/linton-prod/api/",

});
API.interceptors.request.use(
  (request) => {
    const auth = "Bearer " + localStorage.getItem("token");
    request.headers["Accept"] = "application/json";
    request.headers["Authorization"] = auth;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default API;

//https://aws.markcoders.com/server/api  //Staging
//https://xdtc.lintonusa.com/server/api  //Production
//http://localhost:6001/api              //Local
//http://192.168.18.83:6001/api          //Local
