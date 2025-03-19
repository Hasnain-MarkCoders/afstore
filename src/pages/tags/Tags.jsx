import React, { useState, useRef } from "react";
import {  Button, Container } from "@mui/material";
import TagsTable from "./TagsTable";
import "./tags.scss";
import '../styles.scss'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import API from "../../api/api";
import AddTagModal from "../../components/Modals/TagModals/AddTagModal";
import useQueryTags from "../../Hooks/useQueryTags/useQueryTags";
import ErrorModal from "../../components/Modals/ErrorModal";

 const Tags = ({ setShowSideBar }) => {

  const [paginationModel, setPaginationModel] = useState({
    page: 0, pageSize: 10
  })
  const [type, setType] = useState("red")
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false);
  const { isLoading, rows } = useQueryTags("/admin/get-tags", "/login", paginationModel);
  const [tagError, setTagError] = useState(null)
  const handleTagError = (data) => {
    setTagError(data);
  };
  // add modal
  const handleModal = () => {
    setOpen((prevOpenModal) => !prevOpenModal);
  };

  const boolRef = useRef(false);
  const handleSubmitAddTag = async (e) => {
    e.preventDefault();

    API.post(`/admin/add-tag`, {
      name,
      type 
    })
      .then((responce) => {
        handleModal();
        setPaginationModel({ bool: boolRef.current })
        boolRef.current = !boolRef.current
        // Reset the form fields
        setName(""); 
        setType("red"); 
      }).catch((error) => {
        handleTagError(error?.response?.data?.message)
      })

  };

  return (<>
    <Sidebar />
    <Navbar setShowSideBar={setShowSideBar} />
    <Container maxWidth="100" className="contailer-fluid">
      <div className="sku">
        <div className="add-category" >
          <h2 className="page-title">Tags</h2> 

          <Button onClick={handleModal} className="btn btn-outline-primary">
            Add Tag
          </Button>
          <AddTagModal
          open={open}
          handleModal={handleModal}
          handleSubmitAddTag={handleSubmitAddTag}
          setType={setType}
          type={type}
          name={name}
          setName={setName}
          />
        </div> 
        <TagsTable rows={rows} isLoading={isLoading} setPaginationModel={setPaginationModel} />
      </div>
    </Container>
    


    {tagError &&<ErrorModal
    reason={tagError}
    handleErrorModal ={()=>handleTagError(null)}
  />
     
    }
  </>
  );
};

export default Tags;
