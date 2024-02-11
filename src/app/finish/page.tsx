'use client'
import React, { useContext } from "react";
import cancelIcon from "../../assets/images/cancel-icon.svg";
import greenCheck from "../../assets/images/green-check.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataContext } from "@/Context/DataContext";


const FinishPage = () => {
  const {success} = useContext(DataContext)
  console.log("Success: ", success)
  const router = useRouter()
  return (
    <div className="finish-container">
      {
        success ? (
          <Image src={greenCheck} alt="success" width={80} height={80} />
        ) : (
          <Image src={cancelIcon} alt="success" width={80} height={80} />
        )
      }
      {
        success ? (
          <h2>Pago completado</h2>
        ) : (
          <h2>Pago cancelado</h2>
        )
      }
      <p>
        Lorem ipsum dolor sit amet consectetur. Laoreet blandit auctor et varius
        dolor elit facilisi enim. Nulla ut ut eu nunc.
      </p>
      <button onClick={() => router.push('/')}>
        Crear nuevo pago
      </button>
    </div>
  );
};

export default FinishPage;
