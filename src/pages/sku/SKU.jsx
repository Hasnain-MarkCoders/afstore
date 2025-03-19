import React, { useState, useRef, useEffect } from "react";
import { Button, Container } from "@mui/material";
import SKUTable from "../sku/SKUTable";
import "./sku.scss";
import '../styles.scss'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import API from "../../api/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SkuFilter from "../../components/filter/sku-filter";
import AddSKUModal from "../../components/Modals/SKUModals/AddSKUModal";
import ErrorModal from "../../components/Modals/ErrorModal";
import useQuerySKU from "../../Hooks/useQuerySKU/useQuerySKU";
export const SKU = ({ setShowSideBar }) => {

  const [paginationModel, setPaginationModel] = useState({
    page: 0, pageSize: 10
  })

  const { isLoading, rows, pageInfo } = useQuerySKU(paginationModel);



  const auth = useSelector(
    state => state.user
  )

  const [title, setTitle] = useState("")
  const [cname, setCname] = useState("")
  const [ename, setEname] = useState("")
  // const [skuId, setSkuId] = useState("")
  const [description, setDescription] = useState("")
  const [factoryPrice, setFactoryPrice] = useState("")
  const [customerPrice, setCustomerPrice] = useState("")
  // const [storeId, setStoreId] = useState("")
  const [propertyPair, setPropertyPair] = useState('');
  const [propertyName, setPropertyName] = useState('mandatory');
  const [propertyImage, setPropertyImage] = useState('mandatory');

  const [addSkuError, setAddSkuError] = useState(null)
  const handleAddSkuError = (data) => {
    setAddSkuError(data);
  };

  // add modal
  const [open, setOpen] = React.useState(false);
  const handleModal = () => {
    setOpen((prevOpenModal) => !prevOpenModal);
  };

  const boolRef = useRef(false);
  const handleSubmitAddSKU = async (e) => {
    e.preventDefault();

    API.post(`/${auth?.type}/sku/add`, {
      title,
      description,
      cname,
      ename,
      factory_price: parseFloat(factoryPrice),
      customer_price: parseFloat(customerPrice),
      properties: {
        pair: propertyPair,
        name: propertyName,
        image: propertyImage
      }
    })
      .then((responce) => {
        handleModal();
        setPaginationModel({ bool: boolRef.current })
        boolRef.current = !boolRef.current
        // Reset the form fields
        setTitle("");
        setEname("");
        setCname("");
        setDescription("");
        setFactoryPrice("");
        setCustomerPrice("");
        setPropertyPair("");
        setPropertyImage('mandatory');
        setPropertyName('mandatory');
      }).catch((error) => {
        handleAddSkuError(error?.response?.data?.message)
      })

  };
useEffect(()=>{console.log("ename", ename);console.log("cname", cname)}, [cname, ename])
  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="sku">
        <div className="add-category" >
          <h2 className="page-title">SKU</h2>
          <Button onClick={handleModal} className="btn btn-outline-primary">
            Add SKU
          </Button>

          <AddSKUModal
            cname={cname}
            ename={ename}
            setEname={(e) => { setEname(e) }}
            setCname={(e) => { setCname(e) }}
            open={open} handleModal={() => { handleModal() }} description={description} title={title} propertyImage={propertyImage} propertyName={propertyName} propertyPair={propertyPair} factoryPrice={factoryPrice} customerPrice={customerPrice} handleSubmitAddSKU={(e) => { handleSubmitAddSKU(e) }} setTitle={(e) => { setTitle(e) }} setDescription={(e) => { setDescription(e) }} setFactoryPrice={(e) => { setFactoryPrice(e) }} setCustomerPrice={(e) => { setCustomerPrice(e) }} setPropertyPair={(e) => { setPropertyPair(e) }} setPropertyName={(e) => { setPropertyName(e) }} setPropertyImage={(e) => { setPropertyImage(e) }}
          />
        </div>
        <div>

          <SkuFilter setPaginationModel={setPaginationModel} pageInfo={pageInfo} />
        </div>
        <SKUTable rows={rows} isLoading={isLoading} pageInfo={pageInfo} setPaginationModel={setPaginationModel} />
      </div>
    </Container>

    {addSkuError &&
      <ErrorModal
        reason={addSkuError}
        handleErrorModal={() => handleAddSkuError(null)}
      />
    }
  </>
  );
};
