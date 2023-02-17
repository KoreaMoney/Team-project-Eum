import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import * as SocketIOClient from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';

const Chat = () => {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [connectedUsers, setConnectedUsers] = useState(
    [] as { id: string; username: string }[]
  );

  const socketClient = useRef<SocketIOClient.Socket>();
  const socket = io('http://localhost:5000');

  useEffect((): any => {
    // socket.io 연결
    socketClient.current = socket.on('connect', () => {
      console.log('socket.id', socket.id);
    });

    if (socketClient.current) {
      socketClient.current.on('username-taken', () => {
        toast.error('username is taken');
      });
      socketClient.current.on('username-submitted-successfully', () => {
        setConnected(true);
      });
      socketClient.current.on(
        'get-connected-users',
        (connectedUsers: { id: string; username: string }[]) => {
          setConnectedUsers(
            connectedUsers.filter((user) => user.username !== username)
          );
        }
      );
    }
  }, []);

  const handleConnection = () => {
    if (socketClient.current) {
      socketClient.current.emit('handle-connection');
    }
  };

  return (
    <div>
      {!connected && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConnection();
          }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="입력하기"
          />
          <button type="submit">버튼</button>
        </form>
      )}
      {connected && <div>Connected</div>}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Chat;
