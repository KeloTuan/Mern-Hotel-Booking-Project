import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { Link, useNavigate, } from "react-router-dom";
import { useEffect } from "react";

export type SignInFormData={
    email:string;
    password:string;
};

function getCookie(name: string) {
    const dc: string = document.cookie;
    const prefix: string = name + "=";
    let begin: number = dc.indexOf("; " + prefix);
    if (begin === -1) {
        begin = dc.indexOf(prefix);
        if (begin !== 0) return null;
    } else {
        begin += 2;
        let end: number = document.cookie.indexOf(";", begin);
        if (end === -1) {
            end = dc.length;
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    }
}


const SignIn=()=>{
    const {showToast}=useAppContext();
    const navigate=useNavigate();
    const queryClient = useQueryClient();

    const {register,
        formState:{errors},
        handleSubmit
    }=useForm<SignInFormData>();
    const mutation=useMutation(apiClient.signIn,{
        onSuccess:async ()=>{
            showToast({message:"Login successful",type:"SUCCESS"});
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError:(error:Error)=>{
            showToast({message:error.message, type:"ERROR"});
        }
    });

    const onSubmit=handleSubmit((data)=>{
        mutation.mutate(data);
    })

     // Check for the existence of the cookie on component mount
     useEffect(() => {
        const checkLoginStatus = async () => {
            const myCookie = getCookie("auth-token");
            if (myCookie !== null) {
                await queryClient.invalidateQueries("validateToken");
                navigate("/");
            }
        };
        checkLoginStatus();
    }, [navigate, queryClient]);

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input 
                type="email"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("email",{required:"This field is required"})}
                ></input>
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input 
                type="password"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("password",
                {
                    required:"This field is required",
                    minLength:{
                        value:6,
                        message:"Password must be at least 6 character"
                    }
                })}
                ></input>
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            <span>
                <span className="flex items-center justify-between">
                    <span className="text-sm">
                        Not Registered? <Link to="/register" className="underline">Create an account here</Link>
                    </span>
                    <button type="submit" className="rounded-md bg-blue-500 text-white p-2 font-bold hover:bg-blue-700">
                        Login
                    </button>
                    <button type="submit" className="rounded-md bg-blue-500 text-white p-2 font-bold hover:bg-blue-700">
                        Login with Google
                    </button>
                </span>
            </span>
        </form>
    )
};

export default SignIn;