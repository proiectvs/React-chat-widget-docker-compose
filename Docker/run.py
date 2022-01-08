#!/usr/bin/env python3

import os
import socket
BACKEND_LISTEN_IP = str(os.environ['BACKEND_LISTEN_IP'])
BACKEND_LISTEN_PORT = os.environ['BACKEND_LISTEN_PORT']



LISTEN_ADDRESS = (BACKEND_LISTEN_IP, BACKEND_LISTEN_PORT)


import websockets
from server import client_handler
start_server = websockets.serve(client_handler, *LISTEN_ADDRESS)

import asyncio
asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever()