import { whatsapp1, supabase, wa } from "../supabaseconf.js";
import { remove_msg, getMediaUrl, downloadmedia } from "./utils.js";
import { manage_audio } from "./audio.js";
import { get_products, make_image, translate_to } from "./openai_utils.js";

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

      if (
        typeOfMsg === "simple_button_message" &&
        incomingMessage.interactive.type === "button_reply" &&
        incomingMessage.interactive.button_reply.id.includes("pdelete")
      ) {
        const db_id = incomingMessage.interactive.button_reply.id.split("_")[1];

        const { data, error } = await supabase
          .from("sellers")
          .delete()
          .eq("id", db_id);

        return "done";
      }

      if (
        typeOfMsg === "simple_button_message" &&
        incomingMessage.interactive.button_reply.id === "checkup"
      ) {
        const message = {
          body: "ഞിങ്ങളുടെ സസ്യത്തിന്റെ ഫോട്ടോ എടുത്ത് അയച്ചു തരുക",
          preview_url: false,
        };

        await wa.messages.text(message, incomingMessage.from.phone);

        return "done";
      }

      console.log("typeOfMsg", typeOfMsg);

      if (
        typeOfMsg === "media_message" &&
        incomingMessage.image.hasOwnProperty("id")
      ) {
        console.log("image");

        const media_url = await getMediaUrl(incomingMessage.image.id);

        console.log("media_url", media_url);

        const download_media = await downloadmedia(media_url, "image");

        return "done";
      }

      if (
        typeOfMsg === "simple_button_message" &&
        incomingMessage.interactive.button_reply.id === "selling"
      ) {
        const message = {
          body: "ഞിങ്ങളുടെ ഉല്പന്നത്തിന്റെ എല്ലാ കാര്യങ്ങളും ഞിങ്ങളുടെ ഭാഷയിൽ പറയുക (വോയിസ്)",
          preview_url: false,
        };

        await wa.messages.text(message, incomingMessage.from.phone);

        const { data, error } = await supabase
          .from("farmers")
          .update({ farmer_status: "selling" })
          .eq("farmer_phone", incomingMessage.from.phone);

        return "done";
      }

      // if (
      //   typeOfMsg === "simple_button_message" &&
      //   incomingMessage.interactive.type === "button_reply" &&
      //   incomingMessage.interactive.button_reply.id === "checkup"
      // )
      // {

      // }

      if (incomingMessage.audio && incomingMessage.audio.hasOwnProperty("id")) {
        const { data: farmer, error: err1 } = await supabase
          .from("farmers")
          .select("*")
          .eq("farmer_phone", incomingMessage.from.phone);

        if (farmer[0].farmer_status === "selling") {
          const voice_res = await manage_audio(incomingMessage);
          console.log("transcript", voice_res);

          const { data, error } = await supabase
            .from("farmers")
            .update({ farmer_status: "free", farmer_lang: voice_res.language })
            .eq("farmer_phone", incomingMessage.from.phone);
          console.log("audioooooo");


          let product_text = "This is your product details:\n\n";

          console.log("pet_json", ret_json.p_json);
          // Iterate over the keys and values of p_json
          for (const [key, value] of Object.entries(ret_json.p_json)) {
            product_text += `${key}: ${value}\n`;
          }
          console.log("product_text", product_text);

          let modifiedText = product_text.replace(/_/g, " ");

          console.log("modifiedText", modifiedText);

          const translated_text = await translate_to(
            voice_res.language,
            modifiedText
          );
          console.log("translated_text", translated_text);

          const self_hosted_image = {
            link: new URL(ret_json.image_url).href,
            caption: `${translated_text}`,
          };

          await wa.messages.image(
            self_hosted_image,
            incomingMessage.from.phone
          );


          const reply_btn_message = {
            type: "button",
            body: {
              text: "delete this product?",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: `pdelete_${ret_json.id}`,
                    title: "Delete",
                  },
                },
              ],
            },
          };

          await wa.messages.interactive(
            reply_btn_message,
            incomingMessage.from.phone
          );

          return "done";
        }
        return "done";
      }

      if (incomingMessage.text && incomingMessage.text.hasOwnProperty("body")) {
        const { data: farmer, error: err } = await supabase
          .from("farmers")
          .select("*")
          .eq("farmer_phone", incomingMessage.from.phone);

        if (farmer.length === 0) {
          const { data, error } = await supabase.from("farmers").insert([
            {
              farmer_name: incomingMessage.from.name,
              farmer_phone: incomingMessage.from.phone,
            },
          ]);
        }

        const reply_btn_message = {
          type: "button",
          body: {
            text: "നിങ്ങൾക്ക് വേണ്ട സേവനം സെലക്ട് ചെയ്യുക",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "selling",
                  title: "വിഭവങ്ങൾ വിൽക്കുക",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "checkup",
                  title: "കർഷക checkup",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "gov",
                  title: "Gov സ്കീംസ്",
                },
              },
            ],
          },
        };

        await wa.messages.interactive(
          reply_btn_message,
          incomingMessage.from.phone
        );

        return "done";
      }

    }

    return "done";
  } catch (error) {
    console.error(error);
    return "error";
  }
};

export { mainflow };
