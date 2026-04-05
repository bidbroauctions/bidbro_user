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
  initialSocialAuth,
  sendOtp,
  VerifyOtp,
  VerifySocialAuth,
} from "../api/AuthService";
import {
  ApiSuccessResponse,
  User,
  USER_TYPE,
  VerifyOtpResponse,
} from "@/types";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserStore";

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
  const [accountType, setAccountType] = useState<string | null>("user");
  const isCompanyAccount = accountType === "company";
  const { setUser, setCompany } = useUserStore();
  const { user } = useUserStore();

  // Memoized verification function to prevent re-rendering
  const verifySocialAuth = useCallback(
    async (
      idToken: string,
      provider: string,
      authType?: "SIGNUP" | "LOGIN"
    ) => {
      const response = (await VerifySocialAuth({
        idToken,
        provider,
        authType,
      })) as ApiSuccessResponse<VerifyOtpResponse>;

      if (!response.success) {
        toast.error(response.message, {
          position: "top-center",
        });
        return;
      }
      setUser(
        response.data.user as User,
        response.data.accessToken,
        response.data.refreshToken
      );

      if (isCompanyAccount) {
        if (response.data.company?.id) {
          setCompany(response.data.company);
        }
        router.push("/auth/complete_registration/company");
      } else {
        router.push("/auth/complete_registration/user");
      }
    },
    [isCompanyAccount, router, setCompany, setUser]
  );

  useEffect(() => {
    if (searchParams.has("otp") && searchParams.has("email")) {
      setOpenOtpModal(true);
    } else {
      setOpenOtpModal(false);
    }

    if (searchParams.has("accountType")) {
      setAccountType(searchParams.get("accountType"));
    } else {
      setAccountType("user");
    }

    // Decode and handle social auth only if 'data' query param exists
    const dataParam = searchParams.get("data");
    if (dataParam) {
      const data: { idToken: string; provider: string } = JSON.parse(
        atob(dataParam)
      );
      verifySocialAuth(data.idToken, data.provider, "SIGNUP");
    }
  }, [searchParams, verifySocialAuth]);

  useEffect(() => {
    setIsOtpBtnDisabled(otp.length < 6);
  }, [otp]);

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  const userType = (USER_TYPE as Record<string, string>)[
    accountType || "user"
  ] as USER_TYPE;

  // Formik for email validation and submission
  const formik = useFormik({
    initialValues: { email: searchParams.get("email") || "" },
    validationSchema: emailValidationSchema,
    onSubmit: async (values) => {
      const response = await sendOtp({
        email: values.email,
        accountType: userType,
        authType: "SIGNUP",
      });
      if (response.success) {
        const params = new URLSearchParams();
        params.set("email", values.email);
        params.set("otp", "true");
        params.set("accountType", accountType || "user");
        router.push(`?${params.toString()}`);
      } else {
        toast.error(response.message, {
          position: "top-center",
        });
      }
    },
  });

  // Function to handle OTP verification
  async function verifyOtp() {
    const response = (await VerifyOtp({
      email: formik.values.email,
      otp: otp,
      accountType: userType,
      authType: "SIGNUP",
    })) as ApiSuccessResponse<VerifyOtpResponse>;

    if (!response.success) {
      toast.error(response.message, {
        position: "top-center",
      });
      return;
    }
    setUser(
      response.data.user as User,
      response.data.accessToken,
      response.data.refreshToken
    );
    if (isCompanyAccount) {
      if (response.data.company?.id) {
        setCompany(response.data.company);
      }
      router.push("/auth/complete_registration/company");
    } else {
      router.push("/auth/complete_registration/user");
    }
  }

  async function handleSocialAuth(provider: string) {
    const response = await initialSocialAuth(provider, "sign_up");
    if (response.success) {
      window.location.href = response.data.initializationUrl;
    } else {
      toast.error(response.message, {
        position: "top-center",
      });
    }
  }

  return (
    <div>
      <div className="w-1/3 mx-auto flex justify-center items-center h-[80vh]">
        <div className="space-y-6 w-full">
          <div className="text-center space-y-2">
            <h1 className="text-3xl leading-9 text-header font-bold">
              Sign Up
            </h1>
            <p className="text-highlight text-base font-normal leading-6">
              Please provide your details to continue
            </p>
          </div>
          <div>
            <Button
              label="Sign up with Google"
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
              disabled={!(formik.isValid && formik.dirty)}
              type="submit"
            />
          </form>
          <div>
            <Link
              href={`?accountType=${isCompanyAccount ? "user" : "company"}`}
            >
              <Button
                label={`Create a ${
                  isCompanyAccount ? "user" : "company"
                } account instead`}
                buttonType="outline"
                className="!text-[#344054] font-semibold !border text-base !border-[#D0D5DD]"
              />
            </Link>
          </div>
          <div>
            <p className="text-center text-base font-normal leading-6">
              Already have an account?{" "}
              <Link href="/auth/login" passHref>
                <span className="text-foundationYellowY300">Login</span>
              </Link>
            </p>
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
