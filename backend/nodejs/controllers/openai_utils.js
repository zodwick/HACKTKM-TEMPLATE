import axios from 'axios';
import { whatsapp1, supabase, wa,openai } from "../supabaseconf.js";
import dotenv from "dotenv";


dotenv.config();



const translate_to = async (language,msg) => {

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content: `translate the below text to ${language}.
                                              ${msg}
                                                        `,
            },
        ],
        temperature: 0.1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
}

const get_products = async (incomingMessage,text) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content: `I will give a text from product details, and return a JSON of all product details including product_name as mandatory, price, and all the details without making new unspecified keys and values in the json
                            text: ${text}
                            `,
            },
        ],
        temperature: 0.1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    console.log(response.choices[0].message.content);
    const temp_json = response.choices[0].message.content;
    const p_json = JSON.parse(temp_json);

    console.log("pppppppp", p_json.product_name);
   const image_url=await make_image(p_json.product_name);
   

    const {data,error} = await supabase
    .from('sellers')
    .insert([
        {
            farmer_id: incomingMessage.from.phone,
            products: p_json,
            image_url: image_url,
            farmer_name: incomingMessage.from.name,
            
        },
        ]).select('*');

        

    const ret_json = {
        p_json: p_json,
        image_url: image_url,
        id: data[0].id
        };
          

    return ret_json;
};

const make_image = async (product) => {
    console.log("product", product);
    const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
            model: "dall-e-2",
            prompt: `small basket of ${product}, which look like natural ${product}`,
            n: 1,
            size: "512x512",
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        }
    );

    const image_url = response.data.data[0].url;
    console.log(image_url);
    return image_url;
};

const processimage = async (imageUrl,language) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `What’s the disease in the leaf?,give me advise to prevent this in three points in ${language}`,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageUrl,
                            "detail": "low",
                        },
                    },
                ],
            },
        ],
        max_tokens: 1000,
    });
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
};

const process_gov = async (incomingMessage) => {




};


export {translate_to,get_products,make_image,processimage};