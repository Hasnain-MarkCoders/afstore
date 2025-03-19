import * as React from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Lightbox from "react-lightbox-component";
import "react-lightbox-component/build/css/index.css";
import { Box, Typography } from "@mui/material";

const formattedDateTime = (date) => {
  const dateTime = new Date(date);
  const formattedDate = dateTime.toLocaleDateString("en-US", {
    // year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedTime = dateTime.toLocaleTimeString(
    undefined,
    timeFormatOptions
  );

  const formatted = `${formattedDate} / ${formattedTime}`;
  return formatted;
};

export default function TicketChat({ data, loading, displayImages }) {
  const auth = useSelector((state) => state.user);
  const containerRef = React.useRef(null);

  // Function to scroll to the bottom of the container
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when component mounts or when new data is loaded
  React.useEffect(() => {
    scrollToBottom();
  }, [data]); // You might need to add other dependencies if needed

  return (
    <div
      ref={containerRef}
      className={`ticket-chat-body${
        displayImages && displayImages.length > 0 ? " uploaded-media" : ""
      }`}
    >
      {data ? (
        data.customer_note.length > 0 ? (
          data?.customer_note
            ?.slice()
            ?.reverse()
            .map((value, index) => {
              return (
                <div
                  className={`ticket-text ${
                    value.type === auth?.type ? "sender" : "reciver"
                  }`}
                  key={index}
                >
                  {/* // Inside your component */}
                  {value?.image && Array.isArray(value.image) && (
                    <div className="chat-image">
                      <Lightbox
                        images={value?.image?.map((img) => ({ src: img }))}
                      />
                    </div>
                  )}
                
                  {value?.message && <p>{value?.message}</p>}
                  <span>{value.tag}</span>
                  <span>{formattedDateTime(value?.time)}</span>
                  {data?.ticket_info?.is_closed?
                  <Box sx={{display:"flex", flexDirection:"column", gap:"3px", mt:"1vw"}}>
                    <Typography
                      sx={{
                        background: "transparent !important",
                        boxShadow: "none !important",
                        color: "red !important",
                        p:"0 !important"
                      }}
                    >
                      Ticket Closed{" "}
                    </Typography>

                    <Typography
                      sx={{
                        background: "transparent !important",
                        color: "red !important",
                        boxShadow: "none !important",
                        p:"0 !important"

                      }}
                    >
                      {data?.ticket_info?.closed_by}
                    </Typography>
                    <Typography
                      sx={{
                        background: "transparent !important",
                        color: "red !important",
                        boxShadow: "none !important",
                        p:"0 !important"

                      }}
                    >
                      {data?.ticket_info?.date}
                    </Typography>
                  </Box>
                  :null
                  }
                </div>
              );
            })
        ) : (
          <div className="loader">
            <span>No Comments</span>
          </div>
        )
      ) : (
        <div className="loader">
          {loading ? <CircularProgress /> : <span>Select Ticket</span>}
        </div>
      )}
    </div>
  );
}
