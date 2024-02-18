import axios from "axios";
import FormData from "form-data";
import { wa } from "../supabaseconf.js";
import fs from "fs";
import OpenAI from "openai";

const manage_audio = async (incomingMessage) => {
 
  const messageid = incomingMessage.audio.id;
  const accessToken = process.env.CLOUD_API_ACCESS_TOKEN;

  console.log("msgid", messageid);


  const response = await axios.request(config);

  const meta_media_url = response.data.url;

  console.log("meta_media_url", meta_media_url);

  const message = {
    body: "Please wait ...⏳",
    preview_url: false,
  };

await  wa.messages.text(message, incomingMessage.from.phone);

  const resp = await axios.get(meta_media_url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const media = resp.data;

 
  let transcript;


    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
  });
  
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Replace with your OpenAI API key

    const audioPath = "audio.mp3"; // Assuming this is the path where you save the downloaded audio file

    // Write the downloaded audio to a file
    await fs.writeFileSync(audioPath, media);

    // Transcribe the audio using OpenAI API
    const transcription = await openai.audio.transcriptions.create({
      file: await fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
      // Make sure to pass your OpenAI API key in the headers
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
    });


    const transcription_english = await openai.audio.translations.create({
      file: await fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
      // Make sure to pass your OpenAI API key in the headers
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    transcript = transcription;
    
    const voice_res={
      language: transcript.language,
      text: transcription_english.text,
    };


    // Remove the temporary audio file
   await fs.unlinkSync(audioPath);
  

  console.log("uuufff");
  return voice_res;
};


export { manage_audio };
