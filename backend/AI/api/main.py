from typing import Union
from fastapi import FastAPI
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
client = OpenAI()
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/schemequestion/{scheme_name}")
def read_item(scheme_name: str, q: Union[str, None] = None):
    with open(f'../scrapped_data/{scheme_name}.txt', "r") as file:
        schemedata = file.read()
    opeaniresponse = client.chat.completions.create(
        model="gpt-3",
        messages=[
            {
              "role": "system",
                "content": f"You are a bot designed to help answer questions about {scheme_name} to famers . use simple language and avoid jargon . The details of the scheme are as follows : {schemedata}"
            },
            {
                "role": "user",
                "content": q
            }
        ],
        temperature=1,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    xtx = (opeaniresponse.choices[0].message.content)
    return str(xtx)
