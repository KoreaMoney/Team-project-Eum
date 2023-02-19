import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import * as SocketIOClient from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
  const socketClient = useRef<SocketIOClient.Socket>();
  const socket = io('http://localhost:5000');

  useEffect((): any => {
    // socket.io 연결
    socketClient.current = socket.on('connect', () => {
      console.log(socket.id);
    });
  }, []);

  return <div></div>;
};

export default Chat;
