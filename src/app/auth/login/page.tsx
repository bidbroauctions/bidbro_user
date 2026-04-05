"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import Button from "../../../components/form/button";
import Input from "../../../components/form/input";
import { useSearchParams, useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import classNames from "classnames";
import ReUseModal from "../../../components/Modal/ReUseModal";
import { maskEmail } from "../../helpers/maskEmail";
import * as Yup from "yup";
import { useFormik } from "formik";
import Image from "next/image";
import GoogleIcon from "@/assets/icons/GoogleIcon.png";
import Link from "next/link";
import {
  sendOtp,
  VerifyOtp,
  initialSocialAuth,
  VerifySocialAuth,
} from "../api/AuthService";
import { ApiSuccessResponse, User, VerifyOtpResponse } from "@/types";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserStore";
import { useAppContext } from "@/context/AppContext";

// Email validation schema using Yup
const emailValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [isOtpBtnDisabled, setIsOtpBtnDisabled] = useState(true);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const { setUser, setCompany } = useUserStore();
  const { isLoading, setLoading } = useAppContext();

  // Memoized verification function for Google Auth
  const verifySocialAuth = useCallback(
    async (idToken: string, provider: string, authType: "LOGIN") => {
      const response = (await VerifySocialAuth({
        idToken,
        provider,
        authType,
      })) as ApiSuccessResponse<VerifyOtpResponse>;

      if (!response.success) {
        toast.error(response.message, { position: "top-center" });
        return;
      }

      setUser(
        response.data.user as User,
        response.data.accessToken,
        response.data.refreshToken
      );
      if (response.data.company?.id) {
        setCompany(response.data.company);
      }
      if (response.data.status === "ACTIVE") router.push("/dashboard");
      else {
        // Check if company object exists in response
        if (Object.keys(response.data?.company || {}).length > 0) {
          router.push("/auth/complete_registration/company");
        } else {
          router.push("/auth/complete_registration/user");
        }
      }
    },
    [router, setCompany, setUser]
  );

  // Handle OTP button state based on OTP input length
  useEffect(() => {
    setIsOtpBtnDisabled(otp.length < 6);
  }, [otp]);

  // Check if both email and otp query params exist
  useEffect(() => {
    if (searchParams.has("otp") && searchParams.has("email")) {
      setOpenOtpModal(true);
    } else {
      setOpenOtpModal(false);
    }

    // Handle social auth if 'data' query param exists
    const dataParam = searchParams.get("data");
    if (dataParam) {
      const data: { idToken: string; provider: string } = JSON.parse(
        atob(dataParam)
      );
      verifySocialAuth(data.idToken, data.provider, "LOGIN");
    }
  }, [searchParams, verifySocialAuth]);

  // Formik for email validation and submission
  const formik = useFormik({
    initialValues: { email: searchParams.get("email") || "" },
    validationSchema: emailValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const response = await sendOtp({
        email: values.email,
        authType: "LOGIN",
      });
      if (!response.success) {
        toast.error(response.message, { position: "top-center" });
        setLoading(false);
        return;
      }
      const params = new URLSearchParams();
      params.set("email", values.email);
      params.set("otp", "true");
      router.push(`/auth/login?${params.toString()}`);
      setLoading(false);
    },
  });

  // Function to handle OTP verification
  async function verifyOtp() {
    setLoading(true);
    const response = (await VerifyOtp({
      email: formik.values.email,
      otp,
      authType: "LOGIN",
    })) as ApiSuccessResponse<VerifyOtpResponse>;

    if (!response.success) {
      toast.error(response.message, { position: "top-center" });
      setLoading(false);
      return;
    }

    setUser(
      response.data.user as User,
      response.data.accessToken,
      response.data.refreshToken
    );
    if (response.data.company?.id) {
      setCompany(response.data.company);
    }
    setLoading(false);
    if (response.data.status === "ACTIVE") {
      router.push("/dashboard");
    } else {
      if (Object.keys(response.data?.company || {}).length > 0) {
        router.push("/auth/complete_registration/company");
      } else {
        router.push("/auth/complete_registration/user");
      }
    }
  }

  // Function to handle Google login initiation
  async function handleSocialAuth(provider: string) {
    const response = await initialSocialAuth(provider, "login");
    if (response.success) {
      window.location.href = response.data.initializationUrl;
    } else {
      toast.error(response.message, { position: "top-center" });
    }
  }

  return (
    <div>
      <div className="w-1/3 mx-auto flex justify-center items-center h-[80vh]">
        <div className="space-y-6 w-full">
          <div className="text-center space-y-2">
            <h1 className="text-3xl leading-9 text-header font-bold">Log in</h1>
            <p className="text-highlight text-base font-normal leading-6">
              Please provide your details to continue
            </p>
          </div>
          <div>
            <Button
              label="Login with Google"
              buttonType="outline"
              onClick={() => handleSocialAuth("google")}
              className="!text-[#344054] font-semibold !border text-base !border-[#D0D5DD]"
              icon={
                <Image
                  src={GoogleIcon}
                  alt="Google Icon"
                  width={24}
                  height={24}
                />
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="w-full h-[1px] bg-[#EAECF0]"></div>
            <div className="text-[#667085]">Or</div>
            <div className="w-full h-[1px] bg-[#EAECF0]"></div>
          </div>

          {/* Formik Form */}
          <form className="space-y-6 w-full" onSubmit={formik.handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="Enter Email"
              onChange={formik.handleChange}
              value={formik.values.email}
              name="email"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}

            <Button
              label="Proceed"
              disabled={!(formik.isValid && formik.dirty) || isLoading}
              type="submit"
              loading={isLoading}
            />
          </form>
          <div className="text-center mt-6 flex gap-2 items-center justify-center text-base">
            <span className="text-[#475467]">Don&apos;t have an account?</span>
            <Link href={`/auth/sign_up?${searchParams.toString()}`}>
              <span className=" text-[#F68B36] font-bold">Sign up</span>
            </Link>
          </div>
        </div>
      </div>

      {openOtpModal && (
        <ReUseModal
          open={openOtpModal}
          setOpen={setOpenOtpModal}
          closeOnOverlayClick={false}
          parentClassName="sm:max-w-xl w-1/3"
          addCloseIcon={true}
        >
          <div className="space-y-6 w-full p-14 pb-20">
            <div className="text-center space-y-2 my-6">
              <h1 className="text-2xl font-normal text-header">
                Enter One-Time-Pin
              </h1>
            </div>

            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="number"
              containerStyle={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
              }}
              inputStyle={{
                width: "50px",
                height: "50px",
                fontSize: "20px",
                textAlign: "center",
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  className={classNames(
                    `w-full border-b-2 border-b-black focus:outline-none focus:border-black focus:border-b-2 focus:ring-none px-3 py-2 text-sm leading-5 text-black`,
                    {
                      "border-b-0 focus:border-b-0": props.value,
                    }
                  )}
                />
              )}
            />
            <p className="text-highlight text-base font-normal leading-6 text-center">
              Kindly enter OTP sent to your email ending{" "}
              {maskEmail(formik.values.email)}
            </p>

            <Button
              label="Login"
              onClick={verifyOtp}
              disabled={isOtpBtnDisabled}
            />
          </div>
        </ReUseModal>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
}
