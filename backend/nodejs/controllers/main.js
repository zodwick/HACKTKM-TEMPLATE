import { whatsapp1, supabase, wa } from "../supabaseconf.js";
import { remove_msg } from "./utils.js";
import { manage_audio } from "./audio.js";



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


            return "done";

          };


         

          if (incomingMessage.audio.id) 
          {

            console.log("audioooooo");
            const transcript = await manage_audio(incomingMessage);
            console.log("transcript", transcript);
            
            
             

            return "done";
          }





          if (incomingMessage.text && incomingMessage.text.hasOwnProperty("body")) {
            
            const {data, error} = await supabase
            .from('farmers')
            .insert([
                {
                  farmer_name: incomingMessage.from.name,
                  farmer_phone: incomingMessage.from.phone,
                },
              ]);
            


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





          
        
        }


        return "done";

    } catch (error) {
        console.error(error);
        return "error";
    }

};


export { mainflow };