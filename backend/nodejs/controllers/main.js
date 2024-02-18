import { whatsapp1, supabase, wa } from "../supabaseconf.js";
import { remove_msg,getMediaUrl,process_checkup,process_gov} from "./utils.js";
import { manage_audio } from "./audio.js";
import { get_products,make_image,translate_to ,} from "./openai_utils.js";



const mainflow = async (req, res) => {

    
    try {

    

        let body = whatsapp1.parseMessage(req.body);
        console.log("yaay");
    
        // console.log("bodyyyyy", body);
    
        if (body?.isMessage) {
          //console.log("jffff", req.body.entry[0].changes[0].value.messages[0]);
    
          let incomingMessage = body.message;
          let recipientPhone = incomingMessage.from.phone;
          console.log(recipientPhone);
          let recipientName = incomingMessage.from.name;
          let typeOfMsg = incomingMessage.type;
          let message_id = incomingMessage.message_id;
          let msg = "";
         
    
    
    
         const remove= await remove_msg(incomingMessage,res);
    
          if(remove==="exit")
          {
            return "removed";
          }


          if (
            typeOfMsg === "simple_button_message" &&
            incomingMessage.interactive.type === "button_reply" &&
            incomingMessage.interactive.button_reply.id.includes("pdelete")
          ) 
          {
                const db_id= incomingMessage.interactive.button_reply.id.split("_")[1];

                const {data,error} = await supabase
                .from('sellers')
                .delete()
                .eq('id', db_id);

                return "done";
          }

          if (
            typeOfMsg === "simple_button_message" &&
            incomingMessage.interactive.type === "button_reply" &&
            incomingMessage.interactive.button_reply.id === "checkup"
          ) 
          { 

                const {data:farmer,error:err1} = await supabase
                .from('farmers')
                .select('*')
                .eq('farmer_phone', incomingMessage.from.phone);

                const trans_msg=await translate_to(farmer[0].farmer_language,"can you upload a photo of your crop?");
               
                const message =
                {
                    "body": `${trans_msg}`,
                    "preview_url": false
                };
            
              await  wa.messages.text( message, incomingMessage.from.phone );



          }

          console.log("typeOfMsg", typeOfMsg);

          if(typeOfMsg==="media_message" && incomingMessage.image.hasOwnProperty("id"))
          {
          
                  console.log("image");
                  const {data:farmer,error:err1} = await supabase
                    .from('farmers')
                    .select('*')
                    .eq('farmer_phone', incomingMessage.from.phone);


                  const media_url = await getMediaUrl(incomingMessage.image.id);
          
                    console.log("media_url", media_url);

                    const checkup=await process_checkup(media_url.url,farmer[0].farmer_language);

                    const message =
                    {
                        "body": `${checkup}`,
                        "preview_url": false
                    };
                
                  await  wa.messages.text( message, incomingMessage.from.phone );
    

          
          }



          if (
            typeOfMsg === "simple_button_message" &&
            incomingMessage.interactive.type === "button_reply" &&
            incomingMessage.interactive.button_reply.id === "gov"
          )
          {
                const {data:farmer,error:err1} = await supabase
                .from('farmers')
                .update({ farmer_status: "gov" })
                .eq('farmer_phone', incomingMessage.from.phone)
                .select('*');

                const mess="Please provide your age,sex,income,category and other basic details";
                const trans_msg=await translate_to(farmer[0].farmer_language,mess);
                

                const message =
                {
                    "body": `${trans_msg}`,
                    "preview_url": false
                };
            
              await  wa.messages.text( message, incomingMessage.from.phone );


          }




          if (
            typeOfMsg === "simple_button_message" &&
            incomingMessage.interactive.type === "button_reply" &&
            incomingMessage.interactive.button_reply.id === "selling"
          ) 
          {


            const message =
            {
                "body": "ഞിങ്ങളുടെ ഉല്പന്നത്തിന്റെ എല്ലാ കാര്യങ്ങളും ഞിങ്ങളുടെ ഭാഷയിൽ പറയുക (വോയിസ്)",
                "preview_url": false
            };
            
              await  wa.messages.text( message, incomingMessage.from.phone );


            const {data,error} = await supabase
            .from('farmers')
            .update({ farmer_status: "selling" })
            .eq('farmer_phone', incomingMessage.from.phone);


            return "done";

          };


          if (
            typeOfMsg === "radio_button_message" &&
            incomingMessage.interactive.type === "list_reply"
          )
          {
              const description = incomingMessage.interactive.list_reply.description;

              console.log("description", description);

            const {data:farmer,error:err1} = await supabase
            .from('farmers')
            .select('*')
            .eq('farmer_phone', incomingMessage.from.phone);


              const reply=await process_gov(description,farmer[0].farmer_language);

              const message =
              {
                  "body": `${reply}`,
                  "preview_url": false
              };

              await  wa.messages.text( message, incomingMessage.from.phone );



          }
        
         

          if (incomingMessage.audio && incomingMessage.audio.hasOwnProperty("id")) 
          {

            const{data:farmer,error:err1} = await supabase
            .from('farmers')
            .select('*')
            .eq('farmer_phone', incomingMessage.from.phone);

            if(farmer[0].farmer_status==='selling')
            {           

                      const voice_res = await manage_audio(incomingMessage);
                      console.log("transcript", voice_res);

                        const {data,error} = await supabase
                        .from('farmers')
                        .update({ farmer_status: "free",farmer_language:voice_res.language })
                        .eq('farmer_phone', incomingMessage.from.phone);
                        console.log("audioooooo");

                     

                      const ret_json = await get_products(incomingMessage,voice_res.text);

                        
                        let product_text = "This is your product details:\n\n";

                        console.log("pet_json", ret_json.p_json);
                        // Iterate over the keys and values of p_json
                        for (const [key, value] of Object.entries(ret_json.p_json)) {
                          product_text += `${key}: ${value}\n`;
                          
                        }
                        console.log("product_text", product_text);

                      let modifiedText = product_text.replace(/_/g, ' ');

                      console.log("modifiedText", modifiedText);

                        const translated_text = await translate_to(voice_res.language,modifiedText);
                        console.log("translated_text", translated_text);
                                    
                        
                        const self_hosted_image =
                        {
                            "link" : new URL( ret_json.image_url ).href,
                            "caption" : `${translated_text}`
                        };

                      await wa.messages.image( self_hosted_image, incomingMessage.from.phone );
                        
                      await new Promise(resolve => setTimeout(resolve, 1000));

                        const reply_btn_message =
                      {
                          "type": "button",
                          "body": {
                              "text": "delete this product?"
                          },
                          "action": {
                              "buttons": [
                              {
                                  "type": "reply",
                                  "reply": {
                                  "id": `pdelete_${ret_json.id}`,
                                  "title": "Delete"
                                  }
                              }
                              ]
                          }
                      }
      
              await wa.messages.interactive( reply_btn_message, incomingMessage.from.phone );
          
                   

                 return "done";

              }

              if(farmer[0].farmer_status==='gov')
              {

                // const voice_res = await manage_audio(incomingMessage);
                // console.log("transcript", voice_res);

                const {data,error} = await supabase
                .from('farmers')
                .update({ farmer_status: "free" })
                .eq('farmer_phone', incomingMessage.from.phone);
                 console.log("dioooooooooo");                 


                const list_message =
                    {
                        "type": "list",
                        "header": {
                            "type": "text",
                            "text": "HEADER_TEXT"
                        },
                        "body": {
                            "text": "BODY_TEXT"
                        },
                        "footer": {
                            "text": "FOOTER_TEXT"
                        },
                        "action": {
                            "button": "BUTTON_TEXT",
                            "sections": [
                            {
                                "title": "SECTION_1_TITLE",
                                "rows": [
                                  {
                                    "id": "1",
                                    "title": "1",
                                    "description": "Unique package for farmers"
                                  },
                                  {
                                    "id": "2",
                                    "title": "2",
                                    "description": "National Mission on Natural Farming"
                                  },
                                  {
                                    "id": "3",
                                    "title": "3",
                                    "description": "Mission Amrit Sarovar"
                                  },
                                  {
                                    "id": "4",
                                    "title": "4",
                                    "description": "Vibrant Villages Programme"
                                  },
                                  {
                                    "id": "56",
                                    "title": "5",
                                    "description": "Crop insurance schemes"
                                  },
                                  {
                                    "id": "6",
                                    "title": "6",
                                    "description": "Credit facility for farmers"
                                  }
                              ]
                            },
                            ]
                        }
                    }
                         await  wa.messages.interactive( list_message, incomingMessage.from.phone );


                    return "done";
              }



            return "done";
          }





          if (incomingMessage.text && incomingMessage.text.hasOwnProperty("body")) {
            

              // if(incomingMessage.text.body.includes("heyy"))
              // {



              // }









            const {data:farmer, error:err} = await supabase
            .from('farmers')
            .select('*')
            .eq('farmer_phone', incomingMessage.from.phone);

            if(farmer.length===0)
            {

              const {data, error} = await supabase
              .from('farmers')
              .insert([
                  {
                    farmer_name: incomingMessage.from.name,
                    farmer_phone: incomingMessage.from.phone,
                  },
                ]);

            }
           
            
            const reply_btn_message =
            {
                "type": "button",
                "body": {
                    "text": "നിങ്ങൾക്ക് വേണ്ട സേവനം സെലക്ട് ചെയ്യുക"
                },
                "action": {
                    "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                        "id": "selling",
                        "title": "വിഭവങ്ങൾ വിൽക്കുക"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                        "id": "checkup",
                        "title": "കർഷക checkup"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                        "id": "gov",
                        "title": "Gov സ്കീംസ്"
                        }
                    }
                    ]
                }
            }
            
             await wa.messages.interactive( reply_btn_message, incomingMessage.from.phone );

            return "done";
          };

          return "done";    
        
        }



    } catch (error) {
        console.error(error);
    }

};


export { mainflow };