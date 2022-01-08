import asyncio
import json
import websockets
import time
import os

##### the ip of the server is in run.py#########

clients = {} #: {websocket: name}
chat=[]
CHAT_HISTORY=os.environ['CHAT_HISTORY']
historymessage= int(CHAT_HISTORY )             ############## number of messages saved in history #########
@asyncio.coroutine
def client_handler(websocket, path):

    
 
    
    try:
        JSONname = yield from websocket.recv()                        # The first message from the client contain the name of the client 
    except Exception as e:
        return 0
    data=json.loads(JSONname)
    name=data["sender"]
   

   

    
    for key, value in list(clients.items()):                               #Check to see if the user is already connected
        if clients[key] ==name:

            del clients[key]


    clients[websocket] = name



    for i in chat:                                                            #Sends all the messages from history(chat) to the client 

        data = json.loads(i)
        date = data["date"]
        timenow=int(time.time())
        newtime=int((timenow-date)/60)



        newi = json.dumps({"sender": data["sender"], "body": data["body"], 'date': newtime})                   # process the time difference between the actual time and the time of the message sent  

        yield from websocket.send(newi)
    
    while True:
        try:
            messageT =yield from websocket.recv()
            
            message=json.loads(messageT)
            if message["body"]=="":
                pass
            else:
                a = 0

                
                JSONmessage = json.dumps({"sender": name, "body": message["body"], 'date': a})    
                for client, _ in list(clients.items()):    
                    if client != websocket:                                                                 # Send message to all clients 
                        yield from client.send(JSONmessage)
                   

             
                JSONmessage1 = json.dumps({"sender": name, "body": message["body"], 'date': int(time.time())})      
                if len(chat) > historymessage:        
                    chat.pop(0)                                                                     # Keep the history of the messages under {historymessage}
                    chat.append(JSONmessage1)
                else:
                    chat.append(JSONmessage1)



       
       
        except Exception as e:                                                                           # Connection Closed Case
               
                
            del clients[websocket]
            

            websocket.close()
            
            
            
            
          
            break

#
