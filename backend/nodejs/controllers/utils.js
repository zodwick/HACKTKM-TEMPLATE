import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const remove_msg = async (incomingMessage) => {
  // Check if msg is older than 1 min
  const timestamp_str = incomingMessage.timestamp;
  console.log("timestamp_str", timestamp_str);
  const current_utc_time = new Date();

  return "proceed";
};

const getMediaUrl = async (media_id) => {
  const headers = {
    Authorization: `Bearer ${process.env.ACCESSTOKEN}`,
  };
  console.log("media_id", media_id);
  console.log("headers", headers);
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${media_id}/`,
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      // Handle non-200 status codes if needed
      console.error(`Failed to get media URL. Status Code: ${response.status}`);
      return null;
    }
  } catch (error) {
    // Handle request errors
    console.error("Error fetching media URL:", error.message);
    return null;
  }
};



export { remove_msg, getMediaUrl, downloadmedia };
