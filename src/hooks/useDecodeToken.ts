import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  exp: number;
  email?: string;
  role?: string;
  [key: string]: any;
}

const useDecodeToken = () => {
  const decoded = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }, []);

  return decoded;
};

export default useDecodeToken;
