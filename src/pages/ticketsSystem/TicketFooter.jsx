import { Box, Button, CircularProgress } from '@mui/material';
import * as React from 'react';
import API from '../../api/api';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SendIcon from '@mui/icons-material/Send';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import {useDropzone} from 'react-dropzone';


export default function TicketFooter({ data, setPaginationModel, isLoading, displayImages, setDisplayImages, pageInfo, selectedTag, setSelectedTag,setDropDownTag,dropDownTag,getTags, updatedData=false,
  setUpdatedData=()=>{}}) {
  const [imageUploadLoading, setImageUploadLoading] = React.useState(false);
  const [addComment, setAddComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const boolRef = React.useRef(false);

  const filterFields = () => {
    return setPaginationModel({
      name: pageInfo.name || [],
      po_number: pageInfo.po_number || [],
      invoice_status: pageInfo.invoice_status || [],
      multiple_order_status: pageInfo.multiple_order_status || [],
      order_status: pageInfo.order_status || "",
      first_date: pageInfo.first_date || "",
      last_date: pageInfo.last_date || "",
      selectedDateType: pageInfo.selectedDateType || "",
      color: pageInfo.color || [],
      admin_remarks: pageInfo.admin_remarks || "",
      all_admin_remarks: pageInfo.all_admin_remarks || "",
      remarks: pageInfo.remarks || "",
      all_remarks: pageInfo.all_remarks || "",
      factory_note: pageInfo.factory_note || "",
      customer_note: pageInfo.customer_note || "",
      pageSize: pageInfo?.pageSize,
      page: pageInfo?.page,
      all_customer_note: pageInfo.all_customer_note || "",
      all_factory_note: pageInfo.all_factory_note,
      all_tag_red: pageInfo.all_tag_red || "",
      all_tag_blue: pageInfo.all_tag_blue || "",
      tag_red: pageInfo.tag_red || [],
      tag_blue: pageInfo.tag_blue || [],
      all_tag:updatedData,
      bool: boolRef.current,
    });
  };

  // Handle form submission for updating line order
  const handleAddComment = async (e) => {
    setLoading(true);
    API.post(`/customer/add-note`, {
      id: data?._id,
      note: addComment,
      image: displayImages,
      tag: selectedTag 
    }).then((response) => {
      setAddComment('');
      setDisplayImages(null);
      setSelectedTag(null)
      filterFields();
    }).catch((error) => {
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleImageChange = async (event) => {
    setImageUploadLoading(true);
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await API.post(`/customer/add-image`, formData);
      // Assuming response.data contains new images to display
      if (response && displayImages) {
        setDisplayImages([...displayImages, ...response.data.url])
      } else {
        setDisplayImages(response.data.url); // Update display with new images
      }
    } catch (error) {
    } finally {
      setImageUploadLoading(false);
    }
  };

  const [mediaClass, setMediaClass] = React.useState(false)

  // 

  return (
    <>
      <div className={`ticket-chat-footer${displayImages && displayImages.length > 0 ? ' with-media' : ''}`}>
        {/* <form action=""> */}
        {displayImages && displayImages.length > 0 && <div className='upload-images'>
          {displayImages?.map((val, key) => {
            return (
              <div className='image-wrapper' key={key}>
                <img src={val}  className='image-item' />
                <div className='delete-image' onClick={() => {
                  setDisplayImages(currentImages =>
                    currentImages.filter((_, imgIndex) => imgIndex !== key)
                  );
                }}>
                  <DeleteForeverIcon style={{ color: 'red' }} />
                </div>
              </div>
            )
          })
          }
          {displayImages.length < 5 &&
            <div className='image-wrapper'>
              <Button component="label" disabled={imageUploadLoading} className='image-item'>
                {imageUploadLoading ? <CircularProgress /> : <AddIcon />}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg, image/png, image/gif, image/svg"
                  onChange={handleImageChange}
                />
              </Button>
            </div>
          }

        </div>}
        <div className='ticket-bar'>
          <input className='chat-input' value={addComment} onChange={(e) => setAddComment(e.target.value)} placeholder="Enter Comment" disabled={!data} />
          <div className='ticket-btns'>
          {data?.po_id && <div className={`dropdown`}>
                                <span className='ticket-btn' onClick={()=>setDropDownTag((e)=>!e)}>
                                <ArrowDropUpIcon />
                                </span>
                                <ul className="dropdown-content" style={{display:dropDownTag ? 'block' : 'none'}}>
                                    <li className="type"><span>Red : message to Linton</span></li>
                                    {getTags?.filter(item => item.type === 'red').map((item, index) => (
                                        <li key={`red-${index}`} className={`${selectedTag && selectedTag?.value === item?.name ? 'active' : ''}`} onClick={() => {setSelectedTag({type : item.type , value: item.name}); setDropDownTag((e)=>!e)}}>
                                            {item.name}
                                        </li>
                                    ))}
                                    <li className="type"><span>Blue : message to pupring</span></li>
                                    {getTags?.filter(item => item.type === 'blue').map((item, index) => (
                                        <li key={`blue-${index}`} className={`${selectedTag && selectedTag?.value === item?.name ? 'active' : ''}`} onClick={() => {setSelectedTag({type : item.type , value: item.name}); setDropDownTag((e)=>!e)}}>
                                            {item.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>}
            {(!displayImages || displayImages.length === 0) &&
              <Box sx={{ position: 'relative' }}>
                <Button
                  className='ticket-btn'
                  component="label"
                  accept="image/jpeg, image/png, image/gif, image/svg"
                  disabled={(!data || imageUploadLoading)}
                  style={{ background: imageUploadLoading && '#fff' }}
                >
                  <AddPhotoAlternateIcon />
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg, image/png, image/gif, image/svg"
                    onChange={handleImageChange}
                  />
                </Button>
                
                {imageUploadLoading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      // backgroundColor: '#ffffff04',

                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}

              </Box>
            }
           
            <Box sx={{ position: 'relative' }}>
              <Button className='ticket-btn' disabled={!selectedTag || !data || loading || isLoading
                || (!addComment && (!displayImages || displayImages.length === 0))
              } onClick={() => handleAddComment()}><SendIcon /></Button>
              {loading || (isLoading && data) && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </div>
        </div>
        {/* </form> */}
      </div>
    </>
  );
}
