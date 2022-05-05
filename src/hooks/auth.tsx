import React, { createContext, useContext, useState } from "react";
import * as AuthSession from "expo-auth-session";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User)

  async function signInWithGoogle() {
    try {
      const CLIENT_ID =
        "504538820063-2fdu6d8n6br7sjviuk2c5r04hdv948v6.apps.googleusercontent.com";
      const REDIRECT_URI = "https://auth.expo.io/@danielreezende/myfinances";
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const urlParams = `?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth${urlParams}`;

      const { params, type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );

        const userInfo = await response.json();

        

        setUser({
          id: userInfo.id,
          name: userInfo.given_name,
          email: userInfo.email,
          photo: userInfo.picture,
        });

        console.log(user);
        // await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }


    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context
}

export { AuthProvider, useAuth  };