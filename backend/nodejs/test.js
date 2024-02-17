import axios from 'axios';
import fs from 'fs';

async function downloadWhatsAppMedia(mediaUrl, waId, type) {
  try {
    const response = await axios.get(mediaUrl, {
        responseType: 'arraybuffer', // Important for binary data handling
    headers: {
        'Authorization': `Bearer ${process.env.ACCESSTOKEN}`
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

export { downloadWhatsAppMedia};