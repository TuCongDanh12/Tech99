import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Select, Input, Button, Alert, Flex } from "antd";

const { Option } = Select;

const FancyForm = () => {
  const [tokens, setTokens] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://interview.switcheo.com/prices.json")
      .then((response) => {
        const tokenData = response.data.reduce((uniqueTokens, { currency, price }) => {
          if (!uniqueTokens.find((token) => token.symbol === currency)) {
            uniqueTokens.push({
              symbol: currency,
              price,
              imageUrl: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`,
            });
          }
          return uniqueTokens;
        }, []);
        

        setTokens(tokenData);
      })
      .catch(() => setError("Failed to fetch token data."));
  }, []);

  const handleSwap = (values) => {
    const { from, to, amount } = values;

    if (from === to) {
      setError("Cannot swap the same token.");
      return;
    }

    const fromTokenData = tokens.find((token) => token.symbol === from);
    const toTokenData = tokens.find((token) => token.symbol === to);

    if (!fromTokenData || !toTokenData) {
      setError("Invalid token selection.");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      const rate = fromTokenData.price / toTokenData.price;
      setExchangeRate(rate * parseFloat(amount));
      setLoading(false);
    }, 1000); // Simulate loading delay
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Currency Swap</h1>
        {error && (
          <Alert message={error} type="error" className="mb-4" showIcon />
        )}
        <Form
          layout="vertical"
          onFinish={handleSwap}
          initialValues={{ amount: "", from: null, to: null }}
        >
          {/* From Token */}
          <Form.Item
            name="from"
            label={<span style={{ color: "white" }}>From</span>}
            rules={[{ required: true, message: "Please select a token" }]}
          >
            <Select placeholder="Select a token">
              {tokens.map((token) => (
                <Option key={token.symbol} value={token.symbol}>
                  <Flex align="center" justify="start" gap={5}>
                    <img
                      src={token.imageUrl}
                      alt={token.symbol}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-base font-medium">
                      {token.symbol}
                    </span>
                  </Flex>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* To Token */}
          <Form.Item
            name="to"
            label={<span style={{ color: "white" }}>To</span>}
            rules={[{ required: true, message: "Please select a token" }]}
          >
            <Select placeholder="Select a token">
              {tokens.map((token) => (
                <Option key={token.symbol} value={token.symbol}>
                  <Flex align="center" justify="start" gap={5}>
                    <img
                      src={token.imageUrl}
                      alt={token.symbol}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-base font-medium">
                      {token.symbol}
                    </span>
                  </Flex>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Amount */}
          <Form.Item
            name="amount"
            label={<span style={{ color: "white" }}>Amount</span>}
            rules={[
              { required: true, message: "Please enter an amount" },
              { pattern: /^[0-9]*\.?[0-9]+$/, message: "Enter a valid number" },
            ]}
          >
            <Input placeholder="Enter amount" type="number" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Swap
            </Button>
          </Form.Item>
        </Form>

        {/* Exchange Rate Result */}
        {exchangeRate && (
          <div className="mt-4 p-4 bg-green-100 rounded text-green-800">
            <p>{exchangeRate.toFixed(4)} for the entered amount.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FancyForm;
