

import base64
import requests
import mimetypes

import os

from dotenv import load_dotenv
load_dotenv()

ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")


def download_whatsapp_media(media_url, wa_id, type):
    """Downloads a WhatsApp media file from the given URL and saves it to the given path.

  Args:
    .
  """
    headers = {
        'Authorization': f'Bearer {ACCESS_TOKEN}'
    }

    # Send a GET request to the media URL
    response = requests.get(media_url, headers=headers)
    print(response)

    print(response.status_code)
    if response.status_code == 200:
        # Extract the MIME type from the response headers
        content_type = response.headers.get('content-type')
        print(content_type)

        # Use the 'mimetypes' module to determine the file extension based on the MIME type
        file_extension = mimetypes.guess_extension(content_type)
        print(file_extension)

        if file_extension:
            # Build the file path including the determined file extension

            if os.path.exists(f'./db_data/{type}/'):
                pass
            else:
                os.makedirs(f'./db_data/{type}/')

            file_path = f'./db_data/{type}/{wa_id}{file_extension}'

            # Save the media to the specified file path
            with open(file_path, 'wb') as media_file:
                media_file.write(response.content)

            return file_path
        else:
            # logger.error("Could not determine the file extension from the MIME type.",
            #              status_code=response.status_code)
            print("Could not determine the file extension from the MIME type.")
            return None
    else:
        # logger.error("Failed to download media.",
        #              status_code=response.status_code)
        print(f"Failed to download media. Status code: {response.status_code}")
        return None


# OpenAI API Key
api_key = os.getenv("OPENAI_API_KEY")

# Function to encode the image


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def vision_process(image_path, language):

    # Getting the base64 string
    base64_image = encode_image(image_path)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"What's the disease in the leaf?,give me advise to prevent this in three points in {language} language."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
    }

    response = requests.post(
        "https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    return response.json()["choices"][0]["message"]["content"]


