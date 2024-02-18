
import requests
import mimetypes

import os


ACCESS_TOKEN = "test"
#replace with actual acces token from env file using dotenv()


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
            return ("Could not determine the file extension from the MIME type.")
    else:
        # logger.error("Failed to download media.",
        #              status_code=response.status_code)
        return (f"Failed to download media. Status code: {response.status_code}")

link="https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=953131403182947&ext=1708182536&hash=ATtZZBTYMD5alswJ3pmSmBUavD7-iwQMzPG_UKcE9j0hJQ"
print(download_whatsapp_media(media_url=link, type="image", wa_id="123456"))
