// // app/context/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { User, login as apiLogin, register as apiRegister } from "../api/auth";

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   login: (mobile: string, password: string) => Promise<void>;
//   register: (
//     name: string,
//     mobile: string,
//     preferredLanguage: string,
//     location: string,
//     password: string
//   ) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Restore token on app start
//   useEffect(() => {
//     const bootstrap = async () => {
//       const storedToken = await AsyncStorage.getItem("token");
//       const storedUser = await AsyncStorage.getItem("user");
//       if (storedToken && storedUser) {
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       }
//       setLoading(false);
//     };
//     bootstrap();
//   }, []);

//   // Login
//   const login = async (mobile: string, password: string) => {
//     const res = await apiLogin({ mobile, password });
//     setToken(res.data.token);
//     setUser(res.data.user);
//     await AsyncStorage.setItem("token", res.data.token);
//     await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
//   };

//   // Register
//   const register = async (
//     name: string,
//     mobile: string,
//     preferredLanguage: string,
//     location: string,
//     password: string
//   ) => {

//     const res = await apiRegister({ name, mobile, preferredLanguage, location, password });
//     setToken(res.data.token);
//     setUser(res.data.user);
//     await AsyncStorage.setItem("token", res.data.token);
//     await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
//   };

//   // Logout
//   const logout = async () => {
//     setToken(null);
//     setUser(null);
//     await AsyncStorage.removeItem("token");
//     await AsyncStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user ,token, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };


// // app/context/AuthContext.tsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Speech from "expo-speech";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { User, login as apiLogin, register as apiRegister } from "../api/auth";

// async function getSupportedLanguage(preferredLang: string): Promise<string> {
//   try {
//     console.log("preffered lang:: ", preferredLang)
//     const voices = await Speech.getAvailableVoicesAsync();
//     const hasPreferred = voices.some(v => v.language.startsWith(preferredLang));
//     return hasPreferred ? preferredLang : "en";
//   } catch (error) {
//     console.error("Error checking voices:", error);
//     return "en"; // fallback
//   }
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   supportedLang: string | undefined;
//   login: (mobile: string, password: string) => Promise<void>;
//   register: (
//     name: string,
//     mobile: string,
//     preferredLanguage: string,
//     location: string,
//     password: string
//   ) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [supportedLang, setSupportedLang] = useState<string | null>(null);

//   // Restore token + language on app start
//   useEffect(() => {
//     const bootstrap = async () => {
//       const storedToken = await AsyncStorage.getItem("token");
//       const storedUser = await AsyncStorage.getItem("user");
//       const storedLang = await AsyncStorage.getItem("supportedLang");

//       if (storedToken && storedUser) {
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       }
//       if (storedLang) {
//         setSupportedLang(storedLang);
//       }
//       setLoading(false);
//     };
//     bootstrap();
//   }, []);

//   // Login
//   const login = async (mobile: string, password: string) => {
//     const res = await apiLogin({ mobile, password });
//     setToken(res.data.token);
//     setUser(res.data.user);
//     await AsyncStorage.setItem("token", res.data.token);
//     await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

//     // after login, check device support for preferred lang
//     const finalLang = await getSupportedLanguage(res.data.user.preferredLanguage);
//     setSupportedLang(finalLang);
//     await AsyncStorage.setItem("supportedLang", finalLang);
//   };

//   // Register
//   const register = async (
//     name: string,
//     mobile: string,
//     preferredLanguage: string,
//     location: string,
//     password: string
//   ) => {
//     const res = await apiRegister({ name, mobile, preferredLanguage, location, password });
//     setToken(res.data.token);
//     setUser(res.data.user);
//     await AsyncStorage.setItem("token", res.data.token);
//     await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

//     const finalLang = await getSupportedLanguage(preferredLanguage);
//     setSupportedLang(finalLang);
//     await AsyncStorage.setItem("supportedLang", finalLang);
//   };

//   // Logout
//   const logout = async () => {
//     setToken(null);
//     setUser(null);
//     setSupportedLang(null);
//     await AsyncStorage.multiRemove(["token", "user", "supportedLang"]);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, token, loading, supportedLang, login, register, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };


// app/context/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, login as apiLogin, register as apiRegister } from "../api/auth";

async function getSupportedLanguage(preferredLang: string | undefined): Promise<string> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    console.log("device voices:", voices.map(v => v.language).slice(0, 20)); // debug

    const pref = (preferredLang ?? "en").split("-")[0].toLowerCase(); // 'hi' from 'hi-IN'
    const hasPreferred = voices.some(v => {
      const lang = (v.language ?? "").split("-")[0].toLowerCase();
      return lang === pref;
    });

    return hasPreferred ? pref : "en";
  } catch (error) {
    console.error("Error checking voices:", error);
    return "en";
  }
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  supportedLang: string | undefined;
  login: (mobile: string, password: string) => Promise<void>;
  register: (
    name: string,
    mobile: string,
    preferredLanguage: string,
    location: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportedLang, setSupportedLang] = useState<string | undefined>(undefined);

  // Restore token + language on app start — and call getSupportedLanguage if needed
  useEffect(() => {
    const bootstrap = async () => {
      
      try {

        // await AsyncStorage.removeItem("supportedLang") // testing
        const [storedToken, storedUserStr, storedLang] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user"),
          AsyncStorage.getItem("supportedLang"),
        ]);

        if (storedToken && storedUserStr) {
          setToken(storedToken);
          setUser(JSON.parse(storedUserStr));
        }
        if (storedLang) {
          // if we've already computed supportedLang earlier, use it
          setSupportedLang(storedLang);
          console.log("restored supportedLang from storage:", storedLang);
        } else {
          // compute supported lang now (use user's preferredLanguage if available)
          const parsedUser: { preferredLanguage?: string } | null = storedUserStr
            ? JSON.parse(storedUserStr)
            : null;
          const preferredFromUser = parsedUser?.preferredLanguage;
          // sending hindi for the demo 
          const finalLang = await getSupportedLanguage('hi-IN'); 
          // const finalLang = await getSupportedLanguage(preferredFromUser);
          setSupportedLang(finalLang);
          await AsyncStorage.setItem("supportedLang", finalLang);
          console.log("detected and stored supportedLang:", finalLang);
        }
      } catch (err) {
        console.error("bootstrap error:", err);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  // Login
  const login = async (mobile: string, password: string) => {
    const res = await apiLogin({ mobile, password });
    setToken(res.data.token);
    setUser(res.data.user);
    await AsyncStorage.setItem("token", res.data.token);
    await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

    // check device support for user's preferred language after login
    const finalLang = await getSupportedLanguage(res.data.user.preferredLanguage);
    setSupportedLang(finalLang);
    await AsyncStorage.setItem("supportedLang", finalLang);
    console.log("login -> supportedLang:", finalLang);
  };

  // Register
  const register = async (
    name: string,
    mobile: string,
    preferredLanguage: string,
    location: string,
    password: string
  ) => {
    const res = await apiRegister({ name, mobile, preferredLanguage, location, password });
    setToken(res.data.token);
    setUser(res.data.user);
    await AsyncStorage.setItem("token", res.data.token);
    await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

    const finalLang = await getSupportedLanguage(preferredLanguage);
    setSupportedLang(finalLang);
    await AsyncStorage.setItem("supportedLang", finalLang);
    console.log("register -> supportedLang:", finalLang);
  };

  // Logout
  const logout = async () => {
    setToken(null);
    setUser(null);
    setSupportedLang(undefined);
    await AsyncStorage.multiRemove(["token", "user", "supportedLang"]);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, supportedLang, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
