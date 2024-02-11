"use client";
import { DataContext } from "@/Context/DataContext";
import { getOrderInfo } from "@/api/cryptoApi";
import { InfoData } from "@/interfaces/dataInterface";
import React, { useContext, useEffect, useState } from "react";
//
import QRCode from "react-qr-code";
import metamaskLogo from "../assets/images/metamask-logo.svg";
import Image from "next/image";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";
import timer from "../assets/images/timer.svg";
import Countdown from "react-countdown";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const CheckoutContainer = () => {
  const router = useRouter();

  const { identifier, setSuccess } = useContext(DataContext);

  const [paymentData, setPaymentData] = useState<InfoData[]>([]);

  const [qrPayment, setQrPayment] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const [walletAddress, setWalletAddress] = useState<any>("");

  async function requestAccount() {
    try {
      const accounts = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });

      console.log("Account: ", accounts);
      setWalletAddress(accounts);
    } catch (error) {
      console.log("Error connecting...");
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Account:", await signer.getAddress());
    }
  }

  useEffect(() => {
    const getInfo = async () => {
      const res = await getOrderInfo(identifier);
      setPaymentData(res.data);
      console.log("PaymentData: ", paymentData);
    };
    getInfo();
    requestAccount();

    const socket = new WebSocket(
      `wss://payments.pre-bnvo.com/ws/${identifier}`
    );

    socket.onopen = (event) => {
      console.log(event);
      console.log("Connected");
    };

    socket.onclose = (event) => {
      console.log(event);
      console.log("Disconnected");
    };

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      // No responde se completa por el formato del address y no se puede completar el pago
      if (payload.success) {
        setSuccess(true);
      }
      console.log(payload);
    };

    socket.onerror = (error) => {
      console.log(error)
      setSuccess(false)
    }
  }, []);

  const formattedDate = (date: any) => {
    return date.slice(8, 10) + "/" + date.slice(5, 7) + "/" + date.slice(0, 4);
  };

  const renderer = ({ minutes, seconds, completed }: any) => {
    if (completed) {
      router.push("/finish");
    }
    return (
      <span>
        {minutes}:{seconds}
      </span>
    );
  };

  return (
    <>
      {paymentData.map((payment) => (
        <div className="checkout-cards-container" key={payment.identifier}>
          <div className="checkout-resume-container">
            <h2>Resumen del pedido</h2>
            <div className="checkout-resume-inner-container">
              <div className="checkout-resume-item-container-div">
                <div className="checkout-resume-item-container">
                  <p className="inner-dark-text">Importe:</p>
                  <p>
                    <span className="inner-dark-text">
                      {payment.fiat_amount} {payment.fiat}
                    </span>
                  </p>
                </div>
                <hr />
              </div>
              <div className="checkout-resume-item-container-div">
                <div className="checkout-resume-item-container">
                  <p className="inner-dark-text">Moneda seleccionada:</p>
                  <p className="inner-dark-text">{payment.currency_id}</p>
                </div>
                <hr />
              </div>
              <div className="checkout-resume-item-container-div">
                <div className="checkout-resume-item-container">
                  <p className="inner-dark-text">Comercio:</p>
                  <p>{payment.merchant_device}</p>
                </div>
                <div className="checkout-resume-item-container">
                  <p className="inner-dark-text">Fecha:</p>
                  <p>{formattedDate(payment.created_at)}</p>
                </div>
                <hr />
              </div>
              <div className="checkout-resume-item-container-div">
                <div className="checkout-resume-item-container">
                  <p className="inner-dark-text">Concepto:</p>
                  <p>{payment.notes}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-payment-container">
            <h2>Realizar el pago</h2>

            <div className="checkout-payment-inner-container">
              <div className="checkout-payment-options-container">
                <Image src={timer} alt="timer" width={20} height={20} />
                <Countdown
                  date={new Date(payment.expired_time)}
                  renderer={renderer}
                />
              </div>
              <div className="checkout-payment-options-container">
                <button
                  className={
                    isActive
                      ? "checkout-payment-option-active"
                      : "checkout-payment-option"
                  }
                  onClick={() => {
                    setQrPayment(true);
                    setIsActive(true);
                  }}
                >
                  Smart QR
                </button>
                <button
                  className={
                    isActive
                      ? "checkout-payment-option"
                      : "checkout-payment-option-active"
                  }
                  onClick={() => {
                    setQrPayment(false);
                    setIsActive(false);
                  }}
                >
                  Web 3
                </button>
              </div>
              {qrPayment ? (
                <div className="checkout-payment-options-container qr-container">
                  <QRCode value={payment.address} />
                </div>
              ) : (
                <>
                  <div className="checkout-payment-options-container metamask-container">
                    <div onClick={() => requestAccount()}>
                      <Image
                        src={metamaskLogo}
                        alt="metamask logo"
                        width={120}
                        height={60}
                      />
                    </div>
                  </div>
                  {walletAddress && (
                    <div
                      className="wallet-description-container"
                      onClick={() => connectWallet()}
                    >
                      <p className="inner-dark-text">Connect with wallet:</p>
                      <p className="long-text">{walletAddress}</p>
                    </div>
                  )}
                </>
              )}

              <div className="checkout-payment-options-container">
                <p>
                  Enviar{" "}
                  <span className="inner-dark-text">
                    {payment.crypto_amount} {payment.currency_id}
                  </span>
                </p>
              </div>
              <div className="checkout-payment-options-container">
                <p className="long-text">{payment.address}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CheckoutContainer;
