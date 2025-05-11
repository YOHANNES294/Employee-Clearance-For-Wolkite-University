'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import NewPassword from './NewPassword';

const Verify = ({ userData }) => {
  const [verificationCodes, setVerificationCodes] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resend, setResend] = useState(false);
  const [resendUserData, setResendUserData] = useState([]);
  const router = useRouter();
  const inputRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;
    const updatedCodes = [...verificationCodes];
    updatedCodes[index] = value;
    setVerificationCodes(updatedCodes);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !verificationCodes[index] && index > 0) {
      const updatedCodes = [...verificationCodes];
      updatedCodes[index - 1] = '';
      setVerificationCodes(updatedCodes);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 4);
    if (!/^[a-zA-Z0-9]{1,4}$/.test(pasted)) return;
    const chars = pasted.split('');
    const updatedCodes = ['','','',''].map((_, i) => chars[i] || '');
    setVerificationCodes(updatedCodes);
    const nextEmptyIndex = updatedCodes.findIndex((char) => !char);
    const nextIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
    inputRefs.current[nextIndex]?.focus();
  };

  const resendHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData[0].email,
          userId: userData[0].userId,
        }),
      });

      if (!response.ok) throw new Error('Error sending reset email.');

      const userRes = await fetch(`/api/user/byUserId?userId=${userData[0].userId}`);
      if (!userRes.ok) throw new Error('Error fetching user data.');

      const fetchedData = await userRes.json();
      setResendUserData(fetchedData);
      setResend(true);
      toast.success('A new verification code has been sent to your email.');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while resending the code.');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const enteredCode = verificationCodes.join('');
    let passwordMatch;

    if (resend) {
      passwordMatch = await bcrypt.compare(enteredCode, resendUserData[0]?.verificationCode);
    } else {
      passwordMatch = await bcrypt.compare(enteredCode, userData[0]?.verificationCode);
    }

    if (passwordMatch) {
      setLoading(true);
      setResend(false);
    } else {
      toast.error("Verification code is incorrect.");
    }
  };

  return (
    <>
      {loading ? (
        <NewPassword userData={userData} />
      ) : (
        <div className="flex items-center justify-center min-h-[110vh] bg-[#EAF1FC] px-6 py-10">
          <div className="relative flex w-full max-w-4xl rounded-2xl border-2 border-[#74B3FD] bg-white shadow-2xl overflow-hidden">
            
            {/* Left side with video */}
            <div className="relative w-1/2 hidden md:flex items-center justify-center bg-[#F0F6FF] overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              >
                <source src="/images/logo/forget.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/10 z-0" />
              <div className="relative z-10 flex flex-col justify-between h-full w-full p-6">
                <div className="flex items-center gap-2">
                  <img src="/images/logo/logo.png" alt="Logo" className="w-8 h-8" />
                  <span className="font-semibold text-sm text-white">WKU-ECMS</span>
                </div>
                <button className="text-white hover:text-blue-300">←</button>
              </div>
            </div>

            {/* Right side form */}
            <div className="w-full md:w-1/2 px-10 py-12">
              <h2 className="text-center text-[26px] font-extrabold text-[#3D5AFE] mb-3">Verify Your Account</h2>
              <p className="text-center text-base text-black mb-8">
                Enter the 4 digit code sent to<br />your registered email.
              </p>

              <form onSubmit={onSubmitHandler} className="space-y-6">
                <div className="flex justify-between gap-6" onPaste={handlePaste}>
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={verificationCodes[index]}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      maxLength={1}
                      className="w-20 h-20 text-4xl text-center font-extrabold border-2 border-black focus:border-[#3D5AFE] rounded-full shadow-lg transition duration-300 outline-none"
                      type="text"
                    />
                  ))}
                </div>

                <div className="text-center text-sm text-black mt-2">
                  Didn’t receive a code?
                  <button
                    type="button"
                    onClick={resendHandler}
                    className="ml-1 text-[#3D5AFE] font-semibold hover:underline"
                  >
                    Resend
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-lg rounded-md bg-[#3D5AFE] text-white font-bold hover:bg-blue-600 transition-all shadow-xl"
                >
                  Verify
                </button>

                <p className="text-center text-sm text-[#3D5AFE] mt-4 font-medium">
                  Don’t share the verification code with anyone!
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Verify;
