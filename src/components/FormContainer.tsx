"use client";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { FormData } from "@/interfaces/dataInterface";
import { sendForm } from "@/api/cryptoApi";
import { CustomSelect } from "./CustomSelect";
import { useRouter } from "next/navigation";
import { DataContext } from "@/Context/DataContext";

const FormContainer = () => {
  const router = useRouter();
  const { identifier, setIdentifier } = useContext(DataContext);
  const [formData, setFormData] = useState<FormData>({
    expected_output_amount: "",
    input_currency: "",
    notes: "",
  });

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    checkForm();
  };

  const checkForm = () => {
    if (
      formData.expected_output_amount.trim() !== "" &&
      formData.input_currency.trim() !== "" &&
      formData.notes.trim() !== ""
    ) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Formulario enviado:", formData);
    const resp = await sendForm(formData);
    console.log(resp.data.identifier);
    setIsLoading(false);
    setIdentifier(resp.data.identifier);
    router.push("/checkout");
  };

  return (
    <div className="main">
      <h1>Crear pago</h1>
      <form className="main-form" onSubmit={handleSubmit}>
        <div className="main-input-container">
          <label htmlFor="">Importe a pagar</label>
          <input
            type="text"
            name="expected_output_amount"
            placeholder="Añade un importe a pagar"
            value={formData.expected_output_amount}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <CustomSelect setFormData={setFormData} />

        <div className="main-input-container">
          <label htmlFor="">Concepto</label>
          <input
            type="text"
            name="notes"
            placeholder="Añade descripción de pago"
            value={formData.notes}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="main-input-container">
          <button
            type="submit"
            className={
              submitButtonDisabled
                ? "button-continue"
                : "button-continue-active"
            }
            disabled={submitButtonDisabled}
          >
            {!isLoading ? (
              <p>Continuar</p>
            ) : (
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormContainer;
