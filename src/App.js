import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { Users } from "./pages/users/User";
import { Invoices } from "./pages/invoices/files/Invoices";
import { SKU } from "./pages/sku/SKU";
import PupringViewList from "./pages/stores/pupring/PupringViewList";
import ProtectedRoute from "./components/ProtectedRoute";
import Pupring from "./pages/stores/pupring/Pupring";
import "./style.scss";
import SKUViewList from "./pages/sku/SKUViewList";
import { ExchangeRate } from "./pages/exchangeRate/ExchangeRate";
import ViewExchangeRate from "./pages/exchangeRate/ViewExchangeRate";
import { InvoicesItems } from "./pages/invoices/items/InvoicesItems";
import RawOrders from "./pages/stores/rawOrders/RawOrders";
import RawOrdersViewList from "./pages/stores/rawOrders/RawOrdersViewList";
import { PostService } from "./pages/postService/PostService";
import Tracking from "./pages/tracking/Tracking";
import { TicketsSystem } from "./pages/ticketsSystem/TicketsSystem";
import Tags from "./pages/tags/Tags";
import { DynamicProperties } from "./pages/DynamicProperties/DynamicProperties";
import Exports from "./pages/Exports/Exports";
import Settings from "./pages/Settings/Settings";
import { getToken, messaging, onMessage } from "./firebase";
import API from "./api/api";
import { useDispatch, useSelector } from "react-redux";
import { handleRefresh } from "./redux/slices/authSlice";
function App() {
    const pathname = window?.location?.pathname
  const dispatch = useDispatch()
  const auth = useSelector(state=>state.user)
  // const saveToken =async (token)=>{
  //   const response = await API.post(`/update-token`, {
  //    token,
  //    email:auth?.email
  //   });
  // }
  // const requestForToken =async () => {
  //   if ('serviceWorker' in navigator) {
  //     await navigator.serviceWorker.register('firebase-messaging-sw.js', {
  //       scope: '/',
  //     });
  //   }
  //     try {
  //       const newToken = await getToken(messaging, { vapidKey: 'BAtDdy_r_vQ8eyuu3ATFOR0zXgZ8ibiK5mj2aUAmyfB-ZrRk1agsXDhMB3nKPdQWswbdCQUSuLFZFA05GBi5HNU' });
  //       if(newToken){
  //         await saveToken(newToken);
  //       }
  //     } catch (error) {
  //       console.error("Failed to refresh token:", error);
  //     }

  // };
// useEffect(()=>{
//   if(!pathname.includes("/login")){
//     requestForToken()
//     onMessage(messaging, (payload) => {
//       console.log('Message received in foreground:', payload);
    
//       const notificationTitle = payload.notification.title;
//       const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.image,
//       };
//       dispatch(handleRefresh())
//       new Notification(notificationTitle, notificationOptions);
//     });
//   }
// },[])


  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <main
      className={`main-section ${
        showSideBar ? "showSideBar" : ""
      }`}
    >
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home setShowSideBar={setShowSideBar} />
                </ProtectedRoute>
              }
            />
            <Route path="afstore">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Pupring setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
              

              
              <Route
                path=":pupringId"
                element={
                  <ProtectedRoute>
                    <PupringViewList setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
                
            </Route>
            <Route path="download-center">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Exports setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
                
            </Route>
            <Route path="settings">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Settings setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
                
            </Route>
            <Route path="raw-orders">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <RawOrders setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":orderId"
                element={
                  <ProtectedRoute>
                    <RawOrdersViewList setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="users">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Users setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
             
            </Route>
            <Route path="tickets-system">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <TicketsSystem setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="tags">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Tags setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* <Route > */}
              <Route
                path="invoices-items"
                element={
                  <ProtectedRoute>
                    <InvoicesItems setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }/>
            {/* </Route> */}
            {/* <Route> */}
              <Route
                path="invoices"
                element={
                  <ProtectedRoute>
                    <Invoices setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
            {/* </Route> */}
            <Route path="exchange-rate">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <ExchangeRate setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":exchangeRateId"
                element={
                  <ProtectedRoute>
                    <ViewExchangeRate setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="post-service">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <PostService setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="tracking">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Tracking setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="sku">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <SKU setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":skuId"
                element={
                  <ProtectedRoute>
                    <SKUViewList setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="dynamic-properties">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <DynamicProperties setShowSideBar={setShowSideBar} />
                  </ProtectedRoute>
                }
              />
             
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
