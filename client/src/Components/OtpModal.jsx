import React, { useState } from "react";
import { auth } from "../firebase"; // Assuming you have correctly initialized Firebase elsewhere
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"; // Import RecaptchaVerifier from firebase/auth

const OtpModal = ({ setUserVerification, offer, product, showToast }) => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const [loading, setLoading] = useState(false); // Track loading state for button

  offer.contactNum = offer.contactNum.trim();

  const closeModal = () => {
    setUserVerification(false);
  };

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
      callback: (response) => {
        console.log("Recaptcha solved successfully");
      },
      "expired-callback": () => {
        console.log("Recaptcha expired");
      },
    });
  };

  const handleSendOtp = () => {
    if (otpSent) return; // Prevent sending OTP if already sent

    setLoading(true); // Set loading state to true
    generateRecaptcha();

    // Ensure the phone number is in international format
    const phoneNumber = `+${offer.contactNum.trim()}`; // For example, "+91" for India

    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setOtpSent(true); // Mark OTP as sent
        showToast("OTP sent on SMS", "success");
        setLoading(false); // Reset loading state after OTP is sent
      })
      .catch((error) => {
        console.error("Error sending SMS: ", error);
        showToast("Error in sending SMS: " + error.message, "warning");
        setLoading(false); // Reset loading state on error
      });
  };

  async function updateOffer() {
    await fetch(
      `http://localhost:5000/products/update-offer?productId=${
        product._id
      }&contactNum=${offer.contactNum}&message=${
        offer.message
      }&token=${localStorage.getItem("token")}`,
      {
        method: "GET",
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Product updated...") {
          setUserVerification(false);
          showToast("Offer sent to the seller", "success");
        } else {
          showToast("Some error occurred in placing the order", "error");
        }
      });
  }

  const verifyOtp = (event) => {
    let otp = event.target.value;
    setOtp(otp);
    updateOffer();
    // if (otp.length === 6) {
    //   let confirmationResult = window.confirmationResult;
    //   confirmationResult
    //     .confirm(otp)
    //     .then(async (result) => {
    //       await fetch(
    //         `http://localhost:5000/products/update-offer?productId=${
    //           product._id
    //         }&contactNum=${offer.contactNum}&message=${
    //           offer.message
    //         }&token=${localStorage.getItem("token")}`,
    //         {
    //           method: "GET",
    //           mode: "cors",
    //         }
    //       )
    //         .then((res) => res.json())
    //         .then((res) => {
    //           if (res.message === "Product updated...") {
    //             setUserVerification(false);
    //             showToast("Offer sent to the seller", "success");
    //           } else {
    //             showToast("Some error occurred in placing the order", "error");
    //           }
    //         });
    //     })
    //     .catch((error) => {
    //       showToast("Wrong OTP entered... Enter the correct OTP", "warning");
    //     });
    // }
  };

  return (
    <div
      id="authentication-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="flex justify-center items-center fixed top-0 right-0 bottom-0 left-0 z-50 bg-black bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Enter the OTP
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            {/* Button to send OTP */}
            <button
              onClick={handleSendOtp}
              className={`w-full py-2 px-3 mb-3 border rounded ${
                loading ? "bg-gray-300" : "bg-blue-500"
              } text-white`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <input
              className="border rounded w-full py-2 px-3 mb-3"
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={verifyOtp}
            />
            <div id="recaptcha"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { OtpModal };
