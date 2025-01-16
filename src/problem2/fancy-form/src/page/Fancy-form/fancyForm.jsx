import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Select, Input, Button, Alert, Flex, Divider } from "antd";

const { Option } = Select;

const FancyForm = () => {
  const [tokens, setTokens] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromToken, setFromToken] = useState(null); // State lưu token 'from'

  // Fetch token data từ API
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

  // Xử lý sự kiện khi nhấn nút Swap
  const handleSwap = (values) => {
    const { to, amount } = values;

    if (!fromToken || !to || !amount) {
      setError("Please fill in all fields.");
      return;
    }

    if (fromToken === to) {
      setError("Cannot swap the same token.");
      return;
    }

    const fromTokenData = tokens.find((token) => token.symbol === fromToken);
    const toTokenData = tokens.find((token) => token.symbol === to);

    if (!fromTokenData || !toTokenData) {
      setError("Invalid token selection.");
      return;
    }

    setError(""); // Reset lỗi
    setLoading(true); // Bắt đầu loading

    setTimeout(() => {
      // Tính toán tỷ giá
      const rate = fromTokenData.price / toTokenData.price;
      setExchangeRate(rate * parseFloat(amount)); // Tính ra số lượng cần nhận
      setLoading(false); // Dừng loading
    }, 1000); // Giả lập thời gian xử lý
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center !bg-gradient-to-r">
      <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Currency Swap</h1>
        {error && <Alert message={error} type="error" className="mb-4" showIcon />}

        <Form
          layout="vertical"
          onFinish={handleSwap}
          initialValues={{ amount: "", from: null, to: null }}
        >
          {/* Amount: Số lượng bạn muốn chuyển với addonAfter là từ */}
          <Form.Item
            name="amount"
            label={<span className="text-white">Amount</span>}
            rules={[{ required: true, message: "Please enter an amount" }]}
          >
            <Input
              placeholder="Enter amount"
              type="number"
              className="bg-[#2c2c2c] text-white border border-gray-600 rounded"
              addonAfter={
                <Select
                  value={fromToken} // Giữ token đã chọn
                  onChange={setFromToken} // Cập nhật state khi chọn token
                  style={{ width: 100 }}
                >
                  {tokens.map((token) => (
                    <Option key={token.symbol} value={token.symbol}>
                      <Flex align="center" gap={5}>
                        <img
                          src={token.imageUrl}
                          alt={token.symbol}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-white font-medium">{token.symbol}</span>
                      </Flex>
                    </Option>
                  ))}
                </Select>
              }
            />
          </Form.Item>

          {/* To Token (Token bạn muốn nhận) */}
          <Form.Item
            name="to"
            label={<span className="text-white">To</span>}
            rules={[{ required: true, message: "Please select a token" }]}
          >
            <Select placeholder="Select a token" className="bg-[#2c2c2c] text-white border border-gray-600 rounded">
              {tokens.map((token) => (
                <Option key={token.symbol} value={token.symbol}>
                  <Flex align="center" gap={5}>
                    <img
                      src={token.imageUrl}
                      alt={token.symbol}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-white font-medium">{token.symbol}</span>
                  </Flex>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className="bg-yellow-500 text-black rounded">
              Swap
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider className="text-white">Preview Exchange Rate</Divider>

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
