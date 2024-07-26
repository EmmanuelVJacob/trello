import axiosInstance from "../utils/axiosInstance";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import Link from "next/link";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Signup: FC = () => {
  const router = useRouter();

  const submitForm = (values: any) => {
    axiosInstance
      .post("/signup", {
        email: values?.email,
        password: values?.password,
        username: values?.username,
      })
      .then((res: any) => {
        if (res.status === 200) {
          toast.success(res?.data?.message, { autoClose: 3000 });

          router.push("/signin");
        } else {
          toast.error(res?.data?.message);
          console.log(`Error ${res?.data}`);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };

  //Yup
  const passRegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Length of the name is too short!")
      .required("username is required!"),

    email: Yup.string()
      .email("Invlaid email address!")
      .required("Email is required!"),

    password: Yup.string()
      .matches(
        passRegExp,
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
      )
      .required("Password is required!"),
  });

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.push("/");
    }
  }, [router]);

  const googleSignUp = async (credentials: any) => {
    try {
      const res = await axiosInstance.post("/googleSignUp", { credentials });
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        localStorage.setItem("accessToken", res?.data?.data?.accessToken);
        localStorage.setItem("userDetails", res?.data?.data?.username);
        router.push("/");
      } else {
        toast.error(res?.data?.messge);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId="969952852580-q77urroi4f3chu5hlua9nqpvq6vl1gje.apps.googleusercontent.com">
        <section className="bg-gray-900 dark:bg-white">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <h1 className="flex items-center mb-6 text-2xl font-semibold text-white dark:text-black">
              Trello
            </h1>

            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                  Sign up
                </h1>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    username: "",
                  }}
                  validationSchema={validationSchema}
                  validateOnChange={true}
                  onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true); // Set button state to disable during API call
                    submitForm(values);
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4 md:space-y-6">
                      <div>
                        <label
                          htmlFor="username"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Username
                        </label>

                        <Field
                          type="username"
                          name="username"
                          id="username"
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="username"
                          required={true}
                        />

                        <div className="text-red-500">
                          <ErrorMessage name="username" component="div" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email
                        </label>

                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="name@company.com"
                          required={true}
                        />

                        <div className="text-red-500">
                          <ErrorMessage name="email" component="div" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Password
                        </label>

                        <Field
                          type="password"
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required={true}
                        />

                        <div className="text-red-500">
                          <ErrorMessage name="password" component="div" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full text-black dark:text-white 
                    bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-grey-200"
                        disabled={isSubmitting}
                      >
                        Sign up
                      </button>
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          googleSignUp(credentialResponse);
                        }}
                        onError={() => {
                          console.log("login faliled");
                          // setEmailErr("Login Failed");
                        }}
                        type="standard"
                        size="large"
                        text="continue_with"
                        shape="square"
                      />
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                          href="/signin"
                          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                          Sign in
                        </Link>
                      </p>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      </GoogleOAuthProvider>
    </>
  );
};

export default Signup;
