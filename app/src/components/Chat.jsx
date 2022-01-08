/* eslint-disable */

// to modify the appearence overwrite Chat.css using the properties from ./node_modules/react-chat-widget/lib/styles.css
import React, { useEffect, useRef, useState } from 'react';





import { Widget, addResponseMessage, addUserMessage, deleteMessages } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import ReconnectingWebSocket from 'reconnecting-websocket';
import './Chat.css';



export const Chat = () => {

    
    const [name, setname] = useState(getRandomString(7));      //// TO SET USERNAME MODIFY THIS LINE 
    const spamseconds = process.env.REACT_APP_SPAM_SECONDS;  // number of seconds before first message and third message for spam
    const totalmessages = process.env.REACT_APP_CHAT_HISTORY; // number of messages saved inside the chatbox 
    const serverip="ws://"+process.env.REACT_APP_TARGET_HOST+":"+process.env.REACT_APP_TARGET_PORT;
	
	
    function getRandomString(length) {                     
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        var result = '';																		/// FUNCTION FOR RANDOM NAME 

        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    

    const ws = useRef();

    


    const [isConnectionOpen, setConnectionOpen] = useState(false);


    
    let [countMessages, setcountMessages] = useState(0);
   
     
    let [deletecountMessages, setdeletecountMessages] = useState(0);
    var interval = '';
    let [blockmessage, setblockmessage] = useState([]);


    useEffect(() => {
        ws.current = new ReconnectingWebSocket(serverip);                 ////////////////////// SERVER PORT AND IP ///////////////////////////////////////

        

        ws.current.onmessage = (ev) => {



           
            
            countMessages = countMessages + 1										
            const message = JSON.parse(ev.data);
            
            var res = message.body;

            
            if (countMessages + deletecountMessages > totalmessages) {
                deleteMessages(1, deletecountMessages);				// Function to keep total messages lower than the variable when we receive a message 
                deletecountMessages = deletecountMessages + 1;
            }
            


            if (name == message.sender) {
                addUserMessage(res, "Me", message.date, countMessages);      
                


            } else {																	// functions to handle incomming messages 

                addResponseMessage(res, message.sender, message.date, countMessages);
               

                


            }
            


        };


        ws.current.onclose = () => {
            
            setConnectionOpen(false);
            addResponseMessage('Disconected...Retrying!', 'Server')
            console.log('Connection disconected!');                      // handle websocket close 
            
        }


        ws.current.onopen = () => {

            blockmessage[1] = undefined
            blockmessage[2] = undefined
            blockmessage[3] = undefined								// handle websocket open
            countMessages = 0;
            setcountMessages(0);


            clearInterval(interval);
            deleteMessages(0)
            ws.current.send(JSON.stringify({ sender: name, body: "" }));
            console.log('Connection opened!');
            setConnectionOpen(true);

            addResponseMessage('Connected', 'Server', )
               
        };



       
    }, []);

   

    const handleSubmit = (msgText) => {
		

        
        var dif;
        
        if (blockmessage[1] == undefined) {
            blockmessage[1] = new Date();
            
        } else if (blockmessage[2] == undefined) {
            blockmessage[2] = new Date()
                                               // handle spamming for the last 3 messages 
        } else {
            blockmessage[3] = new Date()
            dif = (Math.abs(blockmessage[1] - blockmessage[3]) / 1000)
            blockmessage[1] = blockmessage[2]
            blockmessage[2] = blockmessage[3]


          

        }
        
        countMessages = countMessages + 1

		
        if (dif < spamseconds) {                                                       // the number of seconds between the first message and the third ( spamming )
            
            addUserMessage("Stop Spamming Please", "Server", 0, countMessages)
        } else {
            
            if (countMessages + deletecountMessages > totalmessages) { 											// takes care that there are  only 100 messages saved 
                deleteMessages(1, deletecountMessages);
                deletecountMessages = deletecountMessages + 1
            }
            msgText = msgText.slice(0, 120) 									// max length of a message is 120 words 
            addUserMessage(msgText, "Me", 0, countMessages)
               

            ws.current.send(JSON.stringify({ sender: name, body: msgText }));

            

        }

        return false
    }

    const [color, setColor] = useState('gray');    

    function changecolor() {										/// handle the color of the chat launcher ( troll box )
        if (color == 'rgba(53,63,114,255)') { setColor('gray') }
        if (color == 'gray') { setColor('rgba(53,63,114,255)') }
    }

   
    const getCustomLauncher = (handleToggle) =>
	    <button style={{background:color}}class="button-66" onClick={()=>{handleToggle(); changecolor()}} role="button">Troll Box</button>  // launcher button (troll box )

    return (

        <
        Widget title = "Troll box"
        subtitle = ""


        handleSubmit = { handleSubmit }
       
        launcher = { handleToggle => getCustomLauncher(handleToggle) }

        />

    )
};