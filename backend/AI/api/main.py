from pydantic import BaseModel
from typing import Union
from fastapi import FastAPI, Request
from openai import OpenAI
from dotenv import load_dotenv
from utils import download_whatsapp_media, vision_process
load_dotenv()
client = OpenAI()
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


class Schemedetails(BaseModel):
    scheme_name: str
    language: str


@app.post("/scheme")
async def get_scheme(schema: Schemedetails):

    schema.scheme_name = schema.scheme_name.strip()
    schema.scheme_name = schema.scheme_name.replace(" ", "-")
    with open("test.json", "w") as file:
        file.write(schema.json())

    with open(f'../scrapped_data/{schema.scheme_name}.txt', "r", encoding="utf-8") as file:
        schemedata = file.read()
    opeaniresponse = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": f"You are a bot designed to help answer questions about {schema.scheme_name} to famers . use simple language and avoid jargon . The details of the scheme are as follows : {schemedata}"
            },
            {
                "role": "user",
                "content": f"Summarize the scheme {schema.scheme_name} in {schema.language} language."
            }
        ],
        temperature=1,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    xtx = (opeaniresponse.choices[0].message.content)
    return {"result": str(xtx)}


class Item(BaseModel):
    link: str
    language: str


@app.post("/vision")
async def create_item(item: Item):

    file_path = download_whatsapp_media(item.link, "1234", "vision")
    if not file_path:
        return {"error": "Failed to download media."}

    visiondata = vision_process(file_path, item.language)

    return {"result": visiondata}
