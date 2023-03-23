/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import "./asset/App.css";
import Input from "./components/CurrencyRow";

// const BASE_URL = "http://api.coinlayer.com/api/list?access_key=6eaaef94917f752a90d477d387252510";
// const BASE_URL ="https://api.apilayer.com/exchangerates_data/latest?symbols=symbols&base=EUR?access_key=bMr0RjYp1GSX7FEBExYG1zdciQWXKf3m";
function App() {
    const [currencyOptions, setCurrencyOption] = useState([]);
    const [fromCurency, setFromCurency] = useState();
    const [toCurency, setToCurency] = useState();
    const [exchangeRate, setExchangeRate] = useState();
    const [amount, setAmount] = useState(1);
    const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

    let toAmount, fromAmount;
    if (amountInFromCurrency) {
        fromAmount = amount;
        toAmount = amount * exchangeRate;
    } else {
        toAmount = amount;
        fromAmount = amount / exchangeRate;
    }

    var myHeaders = new Headers();
    myHeaders.append("apikey", "R0LF1Tigapo0bdMPIJHvZ73Al04DcXPq");
    // /eslint-disable-next-line
    var requestOptions = useMemo(()=>({
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
    }));

    useEffect(() => {
        fetch(
            "https://api.apilayer.com/exchangerates_data/latest?symbols=&base=EUR",
            requestOptions
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                const firstCurrency = Object.keys(data.rates)[0];
                setCurrencyOption([data.base, ...Object.keys(data.rates)]);
                setFromCurency(data.base);
                setToCurency(firstCurrency);
                setExchangeRate(data.rates[firstCurrency]);
            });
        // return () => {

        // };
    }, []);

    useEffect(() => {
        if (fromCurency != null && toCurency != null) {
            fetch(
                `https://api.apilayer.com/exchangerates_data/latest?symbols=${toCurency}&base=${fromCurency}`,
                requestOptions
            )
            // fetch(`${BASE_URL}?base=${fromCurency}&symbol=${toCurency}`)
                .then((res) => res.json())
                .then((data) => setExchangeRate(data.rates[toCurency]));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromCurency, toCurency]);

    function handleFromAmountChange(e) {
        setAmount(e.target.value);
        setAmountInFromCurrency(true);
    }
    function handleToAmountChange(e) {
        setAmount(e.target.value);
        setAmountInFromCurrency(false);
    }

    return (
        <>
            <h1>Converter </h1>
            <Input
                currencyOptions={currencyOptions}
                selectedCurrency={fromCurency}
                onChangeCurrency={(e) => {
                    setFromCurency(e.target.value);
                }}
                onChangeAmount={handleFromAmountChange}
                amount={fromAmount}
            />
            <div className="equal">=</div>
            <Input
                currencyOptions={currencyOptions}
                selectedCurrency={toCurency}
                onChangeCurrency={(e) => {
                    setToCurency(e.target.value);
                }}
                onChangeAmount={handleToAmountChange}
                amount={toAmount}
            />
        </>
    );
}

export default App;
