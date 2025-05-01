import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axiosInstance from "./../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        
        if (response.data) {
          updateUser(response.data);
          setLoading(false); // Turn off loading when data is available
        }
      } catch (error) {
        console.error("Failed to fetch userInfo", error);
        clearUser();
        navigate("/login");
        setLoading(false); // Ensure loading turns off even on error
      }
    };

    fetchUserInfo();
  }, [updateUser, clearUser, navigate, user]);

  return { loading };
};
