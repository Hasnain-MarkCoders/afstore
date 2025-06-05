import React, { useState, useRef, useEffect } from "react";
import { Button, Container } from "@mui/material";
import SKUTable from "../sku/SKUTable";
import "./sku.scss";
import '../styles.scss'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import API from "../../api/api";
import { useSelector } from "react-redux";
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
  const [isLoadingAddSKU, setIsLoadingAddSKU] = useState(false)

const DEFAULT = { enabled: false, code: '7113.11.5000', scope: 'US' };
  const [hscodeSettings, setHscodeSettings] = useState(DEFAULT);
  const [addData, setData] = useState({
    sku:"",
    sku_id:"",
    keys: {},
    factory_price:"",
    customer_price:"",
    ename:"",
    cname:"",
    production_time:""
  })
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
    setIsLoadingAddSKU(true)
    e.preventDefault();
    return API.post(`/${auth?.type}/sku/add`, {
      ...addData,
      keys: addData.keys,
      hscode:hscodeSettings
    })
      .then((responce) => {
        handleModal();
        setPaginationModel({ bool: boolRef.current })
        boolRef.current = !boolRef.current
        setData({
          sku:"",
          sku_id:"",
          keys: {},
          factory_price:"",
          customer_price:"",
          ename:"",
          cname:"",
          hscodeSettings:DEFAULT,

        })

      }).catch((error) => {
        handleAddSkuError(error?.response?.data?.message)
      }).finally(()=>{
        setIsLoadingAddSKU(false)
      })

  };

  const addNewKey = () => {
    const newKey = `key${Object.keys(addData.keys).length + 1}`;
    setData((prev) => ({
      ...prev,
      keys: { ...prev.keys, [newKey]: "" },
    }));
  };
  

  const updateKeyValue = (key, value) => {
    setData((prev) => ({
      ...prev,
      keys: { ...prev.keys, [key]: value },
    }));
  };
  
  const removeKey = (key) => {
    setData((prev) => {
      const updatedKeys = { ...prev.keys };
      delete updatedKeys[key];
      return { ...prev, keys: updatedKeys };
    });
  };

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
                isLoading ={isLoadingAddSKU}
                keys={addData.keys}
                sku={addData.sku}
                sku_id={addData.sku_id}
                _p={addData._p}
                customerPrice={addData.customer_price}
                factoryPrice={addData.factory_price}
                ename={addData.ename}
                cname={addData.cname}
                set_p={(e) => { setData({ ...addData, _p: e }) }}
                setCustomerPrice={(e) => { setData({ ...addData, customer_price: e }) }}
                productionTime = {addData.production_time}
                setProductionTime={(e) => { setData({ ...addData, production_time: e }) }}
                setFactoryPrice={(e) => { setData({ ...addData, factory_price: e }) }}
                setEname={(e) => { setData({ ...addData, ename: e }) }}
                setCname={(e) => { setData({ ...addData, cname: e }) }}
                setSku={(e) => { setData({ ...addData, sku: e }) }}
                setSkuId={(e) => { setData({ ...addData, sku_id: e }) }}
                setUnitPrice={(e) => { setData({ ...addData, unit_price: e }) }}
                open={open} 
                handleModal={() => { handleModal() }} 
                handleSubmitAddSKU={(e) => { handleSubmitAddSKU(e) }}
                addNewKey={addNewKey}
                updateKeyValue={updateKeyValue}
                removeKey={removeKey}
                hscodeSettings={hscodeSettings}
                setHscodeSettings={setHscodeSettings}
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
