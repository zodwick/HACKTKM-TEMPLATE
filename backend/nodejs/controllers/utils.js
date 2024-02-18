
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();


  


const getMediaUrl = async (media_id)=>{
    const headers = {
        'Authorization': `Bearer ${process.env.ACCESSTOKEN}`
    };
    console.log("media_id", media_id);
    console.log("headers", headers);
    try {
        const response = await axios.get(
            `https://graph.facebook.com/v18.0/${media_id}/`, { headers });

        if (response.status === 200) {
            return response.data;
        } else {
            // Handle non-200 status codes if needed
            console.error(`Failed to get media URL. Status Code: ${response.status}`);
            return null;
        }
    } catch (error) {
        // Handle request errors
        console.error('Error fetching media URL:', error.message);
        return null;
    }
}; 


// const downloadmedia = async(mediaUrl, waId, type)=> {
 
//   try {
//     console.log("daffd",process.env.ACCESSTOKEN);

//     const response = await axios.get(mediaUrl, {
//         responseType: 'arraybuffer', // Important for binary data handling
//     headers: {
//         'Authorization': `Bearer ${process.env.ACCESSTOKEN}`
//       },
//     });

//     if (response.status !== 200) {
//       throw new Error(`Failed to download media. Status code: ${response.status}`);
//     }

//     const contentType = response.headers['content-type'];
//     const fileExtension = ".jpg";

//     if (!fileExtension) {
//       throw new Error("Could not determine the file extension from the MIME type.");
//     }

//     const filePath = `./jeff${fileExtension}`

//     await fs.promises.writeFile(filePath, response.data); // Use fs.promises for async writing

//     return filePath;
//   } catch (error) {
//     console.error('Error downloading media:', error);
//     return null; // Indicate download failure
//   }
// }

const process_checkup = async (mediaurl,language) => {
   
  const url = 'https://5c05-210-212-227-194.ngrok-free.app/vision';
  const body = {
    link: `${mediaurl}`,
    language: `${language}`
  };
  console.log("body", body);
  try {
    const response = await axios.post(url, body);
    console.log('API Response:', response.data.result);
    return response.data; // Returning the response data if needed
  } catch (error) {
    console.error('Error calling Vision API:', error);
    throw error; // Re-throwing the error for handling at a higher level if needed
  }

};

const process_gov = async (scheme,language) => {
   
  const url = 'https://5c05-210-212-227-194.ngrok-free.app/scheme';
  const body = {
    scheme_name: `${scheme}`,
    language: `${language}`
  };
  console.log("body", body);
  try {
    const response = await axios.post(url, body);
    console.log('API Response:', response.data.result);
    return response.data.result; // Returning the response data if needed
  } catch (error) {
    console.error('Error calling Vision API:', error);
    throw error; // Re-throwing the error for handling at a higher level if needed
  }

};




export {remove_msg , getMediaUrl, process_checkup, process_gov};