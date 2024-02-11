import React, { useState, useEffect } from "react";
import { getCoins } from "@/api/cryptoApi";
import Image from "next/image";
import rightArrow from "../assets/images/arrow-right.svg";
import closeIcon from "../assets/images/close.svg";
import searchIcon from "../assets/images/search-normal.svg";
import arrowDown from "../assets/images/arrow-down.svg";
import btcIcon from "../assets/images/btc-icon.svg";
import blueCheck from "../assets/images/tick-circle.svg";
import { Currencies } from "@/interfaces/dataInterface";

interface Props {
  setFormData: (formData: any) => void;
}

export const CustomSelect = ({ setFormData }: Props) => {
  const [coins, setCoins] = useState<Currencies[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    image: btcIcon,
    name: "BTC_TEST",
  });
  const [searchItem, setSearchItem] = useState("");
  useEffect(() => {
    const loadCoins = async () => {
      const res = await getCoins();
      console.log(res.data);
      setCoins(res.data);
    };
    loadCoins();
  }, []);

  const handleChange = (e: any) => {
    setSearchItem(e.target.value);
  };

  const results = !searchItem
    ? coins
    : coins.filter((dato) =>
        dato.name.toLowerCase().includes(searchItem.toLocaleLowerCase())
      );

  return (
    <>
      <div className="select-coin-title">
        <p>Selecciona moneda</p>
      </div>
      <div className="select-coin-container" onClick={() => setVisible(true)}>
        <div className="select-coin-desc-container">
          <Image src={selectedCoin.image} alt="BTC" width={20} height={20} />
          <p>{selectedCoin.name}</p>
        </div>

        <Image src={arrowDown} alt="Search" width={20} height={20} />
      </div>

      {visible && (
        <div className="main-modal">
          <div className="main-modal-container">
            <div className="main-modal-title-container">
              <h2>Seleccionar Criptomoneda</h2>
              <Image
                src={closeIcon}
                alt="Close Modal"
                width={20}
                height={20}
                onClick={() => setVisible(false)}
              />
            </div>
            <div className="modal-input-container">
              <Image
                src={searchIcon}
                alt="Search"
                width={20}
                height={20}
                className="modal-search-icon"
              />
              <input
                type="text"
                placeholder="Buscar"
                onChange={handleChange}
                value={searchItem}
              />
            </div>
            {results.map((c, index) => (
              <div
                className="modal-items-container"
                key={index}
                onClick={() => {
                  setSelectedCoin({
                    image: c.image,
                    name: c.name,
                  });
                  setVisible(false);
                  setFormData((formData: any) => ({
                    ...formData,
                    input_currency: c.blockchain,
                  }));
                }}
              >
                <div className="modal-items-coin-desc">
                  <img src={c.image} alt={c.name} className="item-image" />
                  <div className="modal-items-coin-name-desc">
                    <p>{c.name}</p>
                    <p>{c.symbol}</p>
                  </div>
                </div>
                {c.name === selectedCoin.name ? (
                  <Image
                    src={blueCheck}
                    alt="right arrow"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image
                    src={rightArrow}
                    alt="right arrow"
                    width={20}
                    height={20}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
