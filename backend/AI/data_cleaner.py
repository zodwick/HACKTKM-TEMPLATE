import json

# Load the JSON data from the file
with open('./maindata.json') as f:
    data = json.load(f)

# Filter items where contextPath starts with '/schemesall/schemes-for-farmers/'
filtered_items = [item for item in data['items'] if item['contextPath'].startswith('/schemesall/schemes-for-farmers/')]

# Create a new dictionary to hold the filtered data
filtered_data = {
    "totalElements": len(filtered_items),
 
    "items": filtered_items
}

# Write the filtered data to a new JSON file
with open('./filtered.json', 'w') as f:
    json.dump(filtered_data, f, indent=4)
