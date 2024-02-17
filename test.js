const axios = require('axios');
const fs = require('fs');

const ACCESS_TOKEN = ""; // Replace with your actual access token

async function downloadWhatsAppMedia(mediaUrl, waId, type) {
  try {
    const response = await axios.get(mediaUrl, {
        responseType: 'arraybuffer', // Important for binary data handling
    headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to download media. Status code: ${response.status}`);
    }

    const contentType = response.headers['content-type'];
    const fileExtension = ".jpg";

    if (!fileExtension) {
      throw new Error("Could not determine the file extension from the MIME type.");
    }

    const filePath = `./${waId}${fileExtension}`

    await fs.promises.writeFile(filePath, response.data); // Use fs.promises for async writing

    return filePath;
  } catch (error) {
    console.error('Error downloading media:', error);
    return null; // Indicate download failure
  }
}

const link = "https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=706164778355231&ext=1708182745&hash=ATv8k5ZWZM-pbPl9OEWzuRJayfMjg3swmJgcedSVycaUsw"
downloadWhatsAppMedia(link, "image", "123456")
  .then(filePath => {
    if (filePath) {
      console.log('Media downloaded successfully:', filePath);
    } else {
      console.log('Media download failed.');
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });