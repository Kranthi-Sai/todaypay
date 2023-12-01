import React, { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import "./App.css";

function App() {
  const [, setRates] = useState();
  const [ratesFetched, setRatesFetched] = useState(false);
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [output, setOutput] = useState();

  const currencies = ["INR", "USD","AED","GBP","CAD","SGD","EUR","JPY","PKR","ZAR","ALL"];

  const getRates = async () => {
    // fetch the data from API
    const response = await fetch(
      "https://v6.exchangerate-api.com/v6/74e774aa4523f9fd19238d10/latest/INR"
    ).then((response) => response.json());
    if (response.result === "success") {
      setRates(response.conversion_rates);
      setRatesFetched(true);
    }
  };

  useEffect(() => {
    getRates();
  }, []);

  const calculateOutput = async () => {
    // fetch the selected from currency rates
    const response = await fetch(
     `https://v6.exchangerate-api.com/v6/74e774aa4523f9fd19238d10/latest/${fromCurrency}`
    ).then((response) => response.json());
    const fetchedRates = response.conversion_rates;
    const CurrencyRate = fetchedRates[toCurrency];
    const output = amount * CurrencyRate;
    const roundedOutput = parseFloat(output.toFixed(5));
    setOutput(roundedOutput);
  };

  return (
    <div className="element">
      <div className="main">
       <div className="input-amount">
        <label className="amount">Amount:</label>
        <CurrencyInput className="input-design"
          value={amount}
          onValueChange={(amount) => setAmount(amount)}
          intlConfig={{ locale: "en-US", currency: fromCurrency }}
          allowDecimals={true}
          allowNegativeValue={false}
        />
      </div>

      <div className="input-from">
        <label className="amount">From:</label>
        <select className="input-design"
          id="from"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {ratesFetched ? (
           currencies.map((currency,index) => (
            <option key={index} value={currency}>
              {currency}
            </option>
          ))
          ) : (
            <option defaultValue>INR</option>
          )}
        </select>
      </div>

      <div className="input-to">
        <label className="amount">To:</label>
        <select className="input-design"
          id="to"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {ratesFetched ? (
            currencies.map((currency,index) => (
              <option key={index} value={currency}>
                {currency}
              </option>
            ))
          ) : (
            <option defaultValue>USD</option>
          )}
        </select>
      </div>
      <button className="btn" onClick={() => calculateOutput()}>
        Calculate
      </button>
      <div className="output">
        <label>Output: {output}</label>
      </div>
      </div>
      
    </div>
  );
}

export default App;
