import { createContext, useContext, useMemo } from 'react';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  username: string;
  email: string;
  iat: string;
  exp: string;
}

const jwt = localStorage.getItem('jwt');
const decodedToken: DecodedToken = jwt_decode(jwt!);

const JwtContext = createContext<{
  jwt: string | null;
  decodedToken: DecodedToken;
} | null>(null);

interface JwtContextProviderProps {
  children: React.ReactNode;
}

export function JwtContextProvider({ children }: JwtContextProviderProps) {
  const socketProviderValue = useMemo(() => ({ jwt, decodedToken }), []);
  return (
    <JwtContext.Provider value={socketProviderValue}>
      {children}
    </JwtContext.Provider>
  );
}

export function useJwtContext() {
  const context = useContext(JwtContext);
  if (!context) {
    throw new Error(
      'useJwtContext must be used within a SocketContextProvider'
    );
  }
  return context;
}
