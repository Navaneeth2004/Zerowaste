import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
  };

  export const UserProvider = ({ children }) => {

    const [userData, setUserData] = useState({
        id:'',
        mail: '',
        username: '',
        phone: '',
        address1: '',
        address2: '',
        idproof:'',
        upi:'',
        collector_return:'',
        subscriber:'',
        status:'',
        city: '',
        state: '',
        zip: '',
        role:''
      });      

      useEffect(() => {
        const loadUserData = async () => {
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          }
        };
        loadUserData();
      }, []);
      
      useEffect(() => {
        const storeUserData = async () => {
            if (userData.mail) {
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
            }
        };
        storeUserData();
    }, [userData]);
      
      const clearUserData = async () => {
        setUserData({
            id:'',
            mail: '',
            username: '',
            phone: '',
            address1: '',
            address2: '',
            idproof:'',
            upi:'',
            collector_return:'',
            subscriber:'',
            status:'',
            city: '',
            state: '',
            zip: '',
            role:''
        });
        await AsyncStorage.removeItem('userData');
      };

      return (
        <UserContext.Provider value={{ userData, setUserData, clearUserData }}>
          {children}
        </UserContext.Provider>
      );
            
  }
