import json
import requests
from bs4 import BeautifulSoup

# Load the filtered JSON data
with open('./filtered.json') as f:
    data = json.load(f)

# Function to scrape data from a URL and write it to a text file
def scrape_and_write(url, filename):
    # Send a GET request to the URL
    response = requests.get(url , verify=False)
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content of the page
        soup = BeautifulSoup(response.content, 'html.parser')
        # Extract the desired data from the page
        # (Replace this part with your specific scraping logic)
        data_to_write = soup.get_text()

        # Write the scraped data to a text file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(data_to_write)
        print(f"Scraped data from {url} and wrote it to {filename}")
    else:
        print(f"Failed to retrieve data from {url}")

# Loop through each item in the filtered data
for item in data['items']:
    # Extract the URL from the contextPath field
    url = f"https://vikaspedia.in{item['contextPath']}"
    # Generate a filename based on the URL
    filename = url.split('/')[-1] + '.txt'
    # Scrape data from the URL and write it to a text file
    scrape_and_write(url, filename)
