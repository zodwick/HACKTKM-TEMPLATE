from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
client = OpenAI()

audio_file = open("./mlaudio.ogg", "rb")
transcript = client.audio.translations.create(
    file=audio_file,
    model="whisper-1",
    response_format="verbose_json",
)

print(transcript.language)
