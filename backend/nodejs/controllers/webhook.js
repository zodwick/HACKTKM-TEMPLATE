//import { manage_audio } from "./test.js";
import fs from  "fs";
import { mainflow } from "./main.js";


const webhook_get = async (req, res) => {

    // const VERIFY_TOKEN = "Zyadha!@#123";
    const VERIFY_TOKEN = "test";

    console.log("yyyyyyyyyyy");
    // Parse params from the webhook verification request
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    console.log(token);

    // Check if a token and mode were sent
    if (!mode || !token) {
        return res.status(403).send({ error: "Missing mode or token" });
    }


};


const webhook_post = async (req, res) => {
    try {
        console.log("yeeeeey");
        //console.log(req);
       
        console.log("ans : ",req.body);
        //dump the console to a json file
        // const logs = [];
        // const originalLog = console.log;
        // console.log = function (message) {
        //     logs.push(message);
        //     originalLog.apply(console, arguments);
        // };

        // // Write console output and req.body to JSON file
        // const dataToWrite = {
        //     reqBody: req.body,
        //     consoleLogs: logs
        // };

        // const filename = 'console_output.json';
        // fs.writeFile(filename, JSON.stringify(dataToWrite, null, 2), (err) => {
        //     if (err) {
        //         console.error('Error writing JSON file:', err);
        //     } else {
        //         console.log('JSON file saved:', filename);
        //     }
        // });




        await mainflow(req, res);

       console.log("exit");

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(200);
    }
};




export { webhook_get, webhook_post};