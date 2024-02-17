import { createClient } from "@supabase/supabase-js";
import WhatsappCloudAPI from "whatsappcloudapi_wrapper";
import { config as dotenvConfig } from "dotenv";
import WhatsApp from "whatsapp";

dotenvConfig();

const options = {
  db: {
    schema: "public",
  },
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: true,
  },
  global: {
    headers: { "x-my-custom-header": "my-app-name" },
  },
};

// Create a Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  options
);

// Create a WhatsappCloudAPI instance
const whatsapp1 = new WhatsappCloudAPI({
  accessToken: process.env.ACCESSTOKEN,
  senderPhoneNumberId: process.env.WA_PHONE_NUMBER_ID,
  WABA_ID: process.env.WABA_ID,
});

const senderNumber = process.env.WA_PHONE_NUMBER_ID;
const wa = new WhatsApp(senderNumber);

// Export the Supabase client and WhatsappCloudAPI instance
export { supabase, whatsapp1, wa };
