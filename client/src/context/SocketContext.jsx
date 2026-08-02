import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext({
  orderSocket: null,
  staffSocket: null
});

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [orderSocket, setOrderSocket] = useState(null);
  const [staffSocket, setStaffSocket] = useState(null);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_API_URL.replace('/api', '');

    // 1. Orders Socket (Public)
    const oSocket = io(`${SOCKET_URL}/orders`, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });
    setOrderSocket(oSocket);

    // 2. Staff Socket (Protected)
    let sSocket = null;
    if (user && ['admin', 'staff'].includes(user.role)) {
      const token = localStorage.getItem('accessToken');
      sSocket = io(`${SOCKET_URL}/staff`, {
        auth: { token },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true
      });
      setStaffSocket(sSocket);
    }

    // Cleanup
    return () => {
      oSocket.disconnect();
      if (sSocket) {
        sSocket.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ orderSocket, staffSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
