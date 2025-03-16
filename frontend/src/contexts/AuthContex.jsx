import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusCodes as httpStatus } from 'http-status-codes';
import axios from 'axios';



export const AuthContext= createContext({});
const client= axios.create({
    baseURL: "http://localhost:8000/api/v1/users"

})  
export const AuthProvider=({children})=>{
    const authContext= useContext(AuthContext);

    const [userData,setUserData] = useState(authContext);

    const router= useNavigate();


    const handleRegister= async ( name,username, password)=>{
        try{
            let request= await client.post("/register",{
                name:name,
                username:username,
                password:password,
            })

            if(request.status===httpStatus.CREATED){
                return request.data.message;
            }
        }catch(err){
            throw err;

        }
    }

    const handleLogin= async (username,password)=>{
        try{
            console.log("Sending login request with:", { username, password });

            let request= await client.post("/login",{
                username:username,
                password:password
            });
            console.log("Login response:", request.data);


            if(request.status===httpStatus.OK){
                localStorage.setItem("token",request.data.token);
                // router("/home");
            }
        }catch(err){
            throw err;
        }

    }



    const data={
        userData,setUserData, handleRegister,handleLogin
    }
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}