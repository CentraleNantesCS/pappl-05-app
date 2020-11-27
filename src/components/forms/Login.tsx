/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router';
import axios from '../../utils/axios';
import { ActionType } from '../../utils/reducer';
import { useStateContext } from '../../utils/state';

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

type LoginError = {
  message: string
};

export default function Login() {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [loginErrors, setLoginErrors] = useState<LoginError[]>();
  const { dispatch } = useStateContext();
  const history = useHistory();

  const onSubmit = async ({ email, password, remember }: FormData) => {
    // Get CSRF-Cookie
    try {
      let response = await axios.post('/login', {
        email,
        password,
        remember
      })
      // Save token to localstorage
      localStorage.setItem('token', response.data.token);
      dispatch!({ type: ActionType.GET_USER })
      // Redirect user
      history.replace("/")
    } catch (error) {
      console.log(error)
      const response = error.response;
      setLoginErrors(response?.data?.errors.map((e: LoginError) => e.message) || [])
    }
  }

  return (
    <div className="lg:w-2/5 md:w-2/3 sm:w-2/3  m-auto card sm:rounded-lg sm:px-10 flex flex-col">
      <div className="text-3xl mx-auto py-4 mb-10">
        Connexion
      </div>
      {loginErrors &&
        <div
          className="flex items-center px-4 pSe connectery-3 mb-4 text-sm font-bold text-white bg-red-500"
          role="alert"
        >
          <svg
            className="w-4 h-4 mr-2 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"
            />
          </svg>
          {loginErrors ? loginErrors.join(" ") : "Unknown error."}
        </div>
      }

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email"
          className="block text-sm font-medium leading-5 text-gray-700">Email</label>

        <div className="mt-1 rounded-md shadow-sm">
          <input type="email" ref={register({ required: true })}  className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" name="email" id="email" placeholder="Email" />
        </div>
        {errors.email && <span className="mt-2 text-sm text-red-600">Email is is required</span>}

        {!showForgotPass &&
          <div className="mt-6">
            <label htmlFor="password"
              className="block text-sm font-medium leading-5 text-gray-700" >Mot de passe</label>

            <div className="mt-1 rounded-md shadow-sm">
              <input ref={register({ required: true })} autoFocus type="password" className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" name="password" id="password" placeholder="Mot de passe" />
            </div>
            {errors.password && <span className="mt-2 text-sm text-red-600">Password is is required</span>}
          </div>
        }

        <div className="flex items-center justify-between mt-6">

          {!showForgotPass &&
            <div className="flex items-center">
              <input
                id="remember"
                ref={register}
                name="remember"
                type="checkbox"
                className="w-4 h-4 transition duration-150 ease-in-out text-primary form-checkbox"
              />

              <label
                htmlFor="remember"
                className="block ml-2 text-sm leading-5 text-gray-900"
              >
                Remember
            </label>
            </div>
          }
          {!showForgotPass &&
            <div className="text-sm leading-5">
              <div onClick={() => setShowForgotPass(true)} className="font-medium text-indigo-600 transition duration-150 ease-in-out cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline">
                Mot de passe oublié?
            </div>
            </div>
          }
          {showForgotPass &&
            <div className="text-sm leading-5">
              <div onClick={() => setShowForgotPass(false)} className="font-medium text-indigo-600 transition duration-150 ease-in-out cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline">
                Non c'est bon?
            </div>
            </div>
          }
        </div>

        <div className="my-2">
          <span className="block w-full rounded-md shadow-sm">
            <button className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700" name="login" type="submit" ref={register}>
              {showForgotPass ? "Réinitialiser mon mot de passe" : "Se connecter"}
            </button>
          </span>
        </div>
      </form>
    </div>
  )
}