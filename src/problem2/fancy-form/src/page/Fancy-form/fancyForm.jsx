import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Select, Input, Button, Alert, Divider, Flex } from "antd";
import { SwapOutlined } from "@ant-design/icons";

const { Option } = Select;

const FancyForm = () => {
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversionResult, setConversionResult] = useState(); // State for conversion result
  const [form] = Form.useForm();

  // Fetch token data on component mount
  useEffect(() => {
    axios
      .get("https://interview.switcheo.com/prices.json")
      .then((response) => {
        const tokenData = response.data.reduce(
          (uniqueTokens, { currency, price }) => {
            if (!uniqueTokens.find((token) => token.symbol === currency)) {
              uniqueTokens.push({
                symbol: currency,
                price,
                imageUrl: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`,
              });
            }
            return uniqueTokens;
          },
          []
        );
        setTokens(tokenData);
      })
      .catch(() => {
        setError("Failed to load tokens.");
      });
  }, []);

  // Handle token swap logic
  const handleSwap = (values) => {
    setLoading(true);
    const { amount, from, to } = values;

    // Check if tokens are selected
    const fromToken = tokens.find((token) => token.symbol === from);
    const toToken = tokens.find((token) => token.symbol === to);

    if (fromToken && toToken) {
      // Perform conversion logic
      const toAmount = (amount * fromToken.price) / toToken.price;
      const newResult = {
        fromAmount: amount,
        fromSymbol: from,
        toAmount: toAmount.toFixed(4), // Limit decimal points to 2
        toSymbol: to,
      };

      // Set immediate result to be shown
      setConversionResult(newResult);
      console.log(conversionResult);
    } else {
      setError("Invalid token data.");
    }
    setLoading(false);
  };

  // Handle token switch
  const handleSwitchTokens = () => {
    form.validateFields().then((values) => {
      form.setFieldsValue({
        from: values.to,
        to: values.from,
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Currency Swap
        </h1>

        {/* Error message */}
        {error && (
          <Alert message={error} type="error" className="mb-4" showIcon />
        )}

        {/* Form for swap */}
        <Form
          layout="vertical"
          onFinish={handleSwap}
          initialValues={{
            amount: "",
            from: tokens[0]?.symbol,
            to: tokens[1]?.symbol,
          }}
          form={form}
        >
          {/* Amount input */}
          <Form.Item
            name="amount"
            label={<span className="!text-white">Amount</span>}
            rules={[{ required: true, message: "Please enter an amount" }]}
          >
            <Input
              placeholder="Enter amount"
              type="number"
              className="bg-[#2c2c2c] text-white border border-gray-600 rounded"
              addonAfter={
                <Form.Item name="from" noStyle>
                  <Select  showSearch style={{ width: 100 }}>
                    {tokens.map((token) => (
                      <Option key={token.symbol} value={token.symbol}>
                        <Flex align="center" gap={5}>
                          <img
                            src={token.imageUrl}
                            alt={token.symbol}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="text-white font-medium">
                            {token.symbol}
                          </span>
                        </Flex>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              }
            />
          </Form.Item>

          {/* Swap button */}
          <div className="flex justify-center mb-4">
            <Button
              type="text"
              icon={<SwapOutlined />}
              size="large"
              className="!text-white"
              onClick={handleSwitchTokens}
            />
          </div>

          {/* To token selection */}
          <Form.Item
            name="to"
            label={<span className="!text-white">To</span>}
            rules={[{ required: true, message: "Please select a token" }]}
          >
            <Select
              showSearch
              placeholder="Select a token"
              className="bg-[#2c2c2c] text-white border border-gray-600 rounded"
              name="to"
            >
              {tokens.map((token) => (
                <Option key={token.symbol} value={token.symbol}>
                  <Flex align="center" gap={5}>
                    <img
                      src={token.imageUrl}
                      alt={token.symbol}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-white font-medium">
                      {token.symbol}
                    </span>
                  </Flex>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Submit button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="!bg-[#f5dd42] text-black rounded"
            >
              Convert
            </Button>
          </Form.Item>
        </Form>

        {/* Conversion result display */}
        {conversionResult && conversionResult.fromAmount && (
          <div className="mt-6 text-white text-center">
            <h2 className="text-xl font-semibold">Conversion Result</h2>
            <div>
              <Flex  align="center">
                
                <span className="font-medium ">
                  {conversionResult.fromAmount} {conversionResult.fromSymbol}
                </span>
                <img
                  src={
                    tokens.find(
                      (token) => token.symbol === conversionResult.fromSymbol
                    )?.imageUrl
                  }
                  alt={conversionResult.fromSymbol}
                  className="w-6 h-6 object-contain !mr-2"
                />
                <span className="mx-2">=</span>
                
                <span className="font-medium">
                  {conversionResult.toAmount} {conversionResult.toSymbol}
                </span>
                <img
                  src={
                    tokens.find(
                      (token) => token.symbol === conversionResult.toSymbol
                    )?.imageUrl
                  }
                  alt={conversionResult.toSymbol}
                  className="w-6 h-6 object-contain mr-2"
                />
              </Flex>
            </div>
          </div>
        )}

        <Divider className="border-t border-white" />
      </div>
    </div>
  );
};

export default FancyForm;
