


const remove_msg = async (incomingMessage) => {
    // Check if msg is older than 1 min
    const timestamp_str = incomingMessage.timestamp;
    console.log("timestamp_str", timestamp_str);
    const timestamp = new Date(parseInt(timestamp_str) * 1000); // Convert Unix timestamp to milliseconds
    const current_utc_time = new Date();
    const time_difference = current_utc_time - timestamp;
    const one_minute = 1 * 60 * 1000; // Convert 1 minute to milliseconds
  
    if (time_difference > one_minute) {
      // Data stored successfully
      console.log("remove msg", time_difference);
      return "exit";
    }
  
    return "proceed";
  };
  


  export {remove_msg};