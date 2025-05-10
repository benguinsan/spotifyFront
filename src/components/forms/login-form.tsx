"use client";

import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useEffect} from "react";
import {useAppSelector} from "@/lib/hooks";
import Loader from "@/components/general/Loader";
import useLoginForm from "@/hooks/useLoginForm";
import {artistProfileMyUrl, profileMyUrl} from "@/utils/consts";
import ErrorField from "@/components/forms/error-field";
import {ChromeIcon} from "lucide-react";
import {continueWithGoogle} from "@/utils";


export default function LoginForm() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    onSubmit,
  } = useLoginForm();


  const {isAuthenticated, user} = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) redirect(user?.type_profile === "artist" ? artistProfileMyUrl : profileMyUrl);
  }, [isAuthenticated, user?.type_profile]);


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2 mb-6">
        <Button
          variant="outline"
          type="button"
          size="lg"
          className="w-full rounded-full bg-black text-md font-medium border-white/50"
          onClick={continueWithGoogle}
        >
          <ChromeIcon className="mr-2 h-5 w-5"/>
          Continue with Google
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            placeholder="Enter a email"
            className={errors.email ? "border-red-800 border-2" : ""}
            {...register("email")}
          />
          {errors.email && <ErrorField message={errors.email.message}/>}
        </div>
        <div className="space-y-2 pb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Enter a password (min 8 characters with letters and numbers)"
            {...register("password", {
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                message: "Password must contain both letters and numbers"
              }
            })}
            className={errors.password ? "border-red-800 border-2" : ""}
          />
          {errors.password && <ErrorField message={errors.password.message}/>}
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full text-md rounded-full text-gray-200 font-bold bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? <Loader/> : "Log In"}
        </Button>
      </div>
    </form>
  )
}