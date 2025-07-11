"use client";

import apiClient from "@/utils/api-client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

interface FetchUserResponse {
  token: string;
  status: string;
  user: {
    role: string;
  };
}

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const [error, setError] = useState("");

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { data } = await apiClient.post<FetchUserResponse>(
        "/auth/login",
        formData
      );
      localStorage.setItem("token", data.token);
      if (data.user.role === "developer")
        return router.push("/freelancer/profile");
      else router.push("/client/profile");
    } catch (err) {
      if (err instanceof AxiosError) setError(err.response?.data.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
    >
      <h2 className="text-4xl font-bold">Log in</h2>

      {error && <p className="label text-error text-sm">{error}</p>}

      <div className="space-y-1">
        <label className="label font-semibold">Email</label>
        <input
          className="input w-full"
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="label text-error text-sm">Email is required</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="label font-semibold">Password</label>
        <input
          className="input w-full"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="label text-error text-sm">Password is required</p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting && <span className="loading loading-spinner"></span>}
        {!isSubmitting && "Sign in"}
      </button>
    </form>
  );
};

export default LoginPage;
