//@todo: force the user to connect wallet 
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { useRouter } from "next/router";
import { useAccount, useNetwork } from "wagmi";
import styles from "../assets/styles/Liquidity.module.css";
import useIsMounted from "./hooks/useIsMounted";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faGear,
  faSearch,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
  import uniswapv2Router from "./abi/UniswapV2Router02.json";

const Swap: React.FC = () => {
  const router = useRouter();
  const mounted = useIsMounted();
  const account = useAccount();

  const [payCoin, setPayCoin] = useState("ETH");
  const [receiveCoin, setReceiveCoin] = useState("XDC");
  const [tokenA, settokenA] = useState(0); 
  const [tokenB, settokenB] = useState(0);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoins, setFilteredCoins] = useState<string[]>([]);
  const [maxSlippage, setMaxSlippage] = useState<bigint>(BigInt(0));
  const [transactionDeadline, setTransactionDeadline] = useState<bigint>();

  const handleMaxSlippageChange = (e) => {
    setMaxSlippage(e.target.value);
  };

  const handleTransactionDeadlineChange = (e) => {
    setTransactionDeadline(e.target.value);
  };

  const closeModal = () => {
    setShowPayModal(false);
    setShowReceiveModal(false);
  };
  const iconStyle = {
    transform: "rotate(90deg)",
  };

  const addresses = [
    "0x8Ef01C8a344fb9996d919Be082C6632f8383dA2d",
    "0xe99500ab4a413164da49af83b9824749059b46ce",
  ];

  
  const availableCoins = ["ETH", "wXDC"];

  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const getIconForCoin = (coin: string) => {
    switch (coin) {
      case "ETH":
        return "ethereum.png";
      case "wXDC":
        return "xdc.png";
      default:
        return "";
    }
  };

  const openSettingsDropdown = () => {
    setShowSettingsDropdown(true);
  };

  


  
  const {config:addLiquidityConfig,error:addLiquidityError} = usePrepareContractWrite({
      address:'0x945bEa50A15999e30a848c1A98dc7bd1D595d8b2',
      abi:uniswapv2Router.abi,
      functionName:'addLiquidity',
      chainId:51,
      args: ["0x6c726338Df61492f0e30F87CbA7EB111C69D3474","0xe99500ab4a413164da49af83b9824749059b46ce",BigInt(100000000000000000000),BigInt(100000000000000000000),(BigInt(100000000000000000000)),(BigInt(100000000000000000000)),account.address,BigInt(1699537124)],
      onSettled(data,error){
        console.log('addLiquidity',{data,error})
      }
  })
  const{write: addLiquidity,
    isLoading:isaddLiquidityLoading,
    data:addLiquidityData,
    isSuccess:addLiquiditySuccess} = useContractWrite(addLiquidityConfig)





  const addLiqudityFunction = () => {
    console.log("inside add add liquidity")
    if(addLiquidity!=undefined){

      addLiquidity()

      console.log("adrer add liquidity")
    }
  }
  const closeSettingsDropdown = () => {
    setShowSettingsDropdown(false);
  };

  const swapCoins = () => {
    const tempPayCoin = payCoin;
    const temptokenA = tokenA;
    setPayCoin(receiveCoin);
    setReceiveCoin(tempPayCoin);
    settokenA(tokenB);
    settokenB(temptokenA);
  };

  useEffect(() => {
    setFilteredCoins(
      availableCoins.filter((coin) =>
        coin.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div className={styles.swapcontainer}>
      <div className={styles.swappanel}>
        <div className={styles.swapheader}>
          <button className={styles.heading}>Add liquidity</button>
          <button className={styles.iconbtn}>
            <p onClick={openSettingsDropdown}>{maxSlippage}% Slipage</p>
            <FontAwesomeIcon icon={faGear} onClick={openSettingsDropdown} />
          </button>
        </div>
        {/* Settings Dropdown */}
        {showSettingsDropdown && (
          <div className={styles.modalBackdrop}>
            <div className={styles.settingsDropdown}>
              <button
                className={styles.closebutton}
                onClick={closeSettingsDropdown}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
              <br></br>
              <div className={styles.container}>
                <div className={styles.section}>
                  <div className={styles.labelContainer}>
                    <div className={styles.leftLabel}>
                      <p>Max Slippage</p>
                    </div>
                    <div className={styles.rightLabel}>
                      <p>{maxSlippage}%</p>
                    </div>
                  </div>
                  <div className={styles.inputContainer}>
                    <input
                      type="number"
                      value={maxSlippage}
                      onChange={handleMaxSlippageChange}
                      className={styles.inputField}
                      placeholder="0"
                    />
                    <div className={styles.inputText}>%</div>
                  </div>
                </div>
                <div className={styles.section}>
                  <div className={styles.labelContainer}>
                    <div className={styles.leftLabel}>
                      <p>Transaction Deadline</p>
                    </div>
                    <div className={styles.rightLabel}>
                      <p>{transactionDeadline}m</p>
                    </div>
                  </div>
                  <div className={styles.inputContainer}>
                    <input
                      type="number"
                      value={transactionDeadline}
                      onChange={handleTransactionDeadlineChange}
                      className={styles.inputField}
                      placeholder="0"
                    />
                    <div className={styles.inputText}>Minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={styles.swapbody}>
          <div className={styles.boxs}>
            <div>
              <div className={styles.swapsection}>
                <div className={styles.payinput}>
                  <input
                    type="number"
                    placeholder="0"
                    value={tokenA}
                    onChange={(e) => settokenA(parseFloat(e.target.value))}
                  />
                  <button
                    className={styles.paycoin}
                    onClick={() => setShowPayModal(true)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "-10px",
                      }}
                    >
                      <img
                        src={getIconForCoin(payCoin)}
                        alt={payCoin}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "5px",
                        }}
                      />
                      <span>{payCoin}</span>
                      <span>▼</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p
                className={styles.ExButton} // Add a style for the Swap button
                onClick={swapCoins}
              >
                +
              </p>
            </div>
            <div>
              <div className={styles.swapsection}>
                <div className={styles.receiveinput}>
                  <input
                    type="number"
                    placeholder="0"
                    value={tokenB}
                    onChange={(e) => settokenB(parseFloat(e.target.value))}
                  />
                  <button onClick={() => setShowReceiveModal(true)}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "-10px",
                      }}
                    >
                      <img
                        src={getIconForCoin(receiveCoin)}
                        alt={receiveCoin}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "5px",
                        }}
                      />
                      <span>{receiveCoin}</span>
                      <span>▼</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className={styles.txtarea}>
                <p>Prices and pool share</p>
                <div className={styles.boxContainer}>
                  <div className={styles.box}>
                    <p className={styles.boxTextTop}>6210.39</p>
                    <p className={styles.boxTextBottom}>1INCH per ETH</p>
                  </div>
                  <div className={styles.box}>
                    <p className={styles.boxTextTop}>0.00016102</p>
                    <p className={styles.boxTextBottom}>ETH per 1INCH</p>
                  </div>
                  <div className={styles.box}>
                    <p className={styles.boxTextTop}>2.68%</p>
                    <p className={styles.boxTextBottom}>Share of pool</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <br></br>
          </div>
          {mounted && account.isConnected ? (
            <button className={styles.swapButton} onClick={addLiqudityFunction}>Add liquidity</button>
          ) : (
            <button className={styles.swapButtonDisb}>Connect wallet</button>
          )}
        </div>
      </div>
      {showPayModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.coinmodal}>
            <p>Select a coin</p>
            <button className={styles.closebutton} onClick={closeModal}>
              <FontAwesomeIcon icon={faClose} />
            </button>
            <input
              type="text"
              placeholder="Search for a coin"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredCoins
              .filter((coin) => coin !== receiveCoin)
              .map((coin) => (
                <button
                  key={coin}
                  className={styles.listbtn}
                  onClick={() => {
                    setPayCoin(coin);
                    closeModal();
                  }}
                >
                  <img
                    src={getIconForCoin(coin)}
                    alt={coin}
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                  />
                  {coin}
                </button>
              ))}
          </div>
        </div>
      )}
      {showReceiveModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.coinmodal}>
            <p>Select a coin</p>
            <button className={styles.closebutton} onClick={closeModal}>
              <FontAwesomeIcon icon={faClose} />
            </button>
            <input
              type="text"
              placeholder="Search for a coin"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredCoins
              .filter((coin) => coin !== payCoin)
              .map((coin) => (
                <button
                  key={coin}
                  className={styles.listbtn}
                  onClick={() => {
                    setReceiveCoin(coin);
                    closeModal();
                  }}
                >
                  <img
                    src={getIconForCoin(coin)}
                    alt={coin}
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                  />
                  {coin}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Swap;
