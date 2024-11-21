import React, { useState } from "react";
import { usePostDataMutation } from "../app/api/apiSlice";
import {
  Input,
  Button,
  Select,
  Typography,
  Alert,
  Card,
  Space,
  message,
} from "antd";
import { useTitle } from "../hooks/useTitle";
import "antd/dist/reset.css";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

function Inputdata() {
  const [input, setInput] = useState(""); // State for input JSON
  const [filter, setFilter] = useState(["Alphabets"]); // State for filter options
  const [postData, { data: response, error, isLoading }] =
    usePostDataMutation(); // API mutation hook

  useTitle(response?.roll_number || "App"); // Dynamic page title

  const handleSubmit = async () => {
    try {
      message.destroy(); // Clear previous messages

      // Validate input: Check if input is empty
      if (!input.trim()) {
        message.error("Input cannot be empty.");
        return;
      }

      // Parse the input as JSON
      const parsedData = JSON.parse(input.trim());
      console.log("Submitting Data:", parsedData); // Debugging

      // Send the parsed data via API
      const apiResponse = await postData(parsedData).unwrap();
      console.log("API Response:", apiResponse); // Debugging API response

      message.success("Data submitted successfully!");
    } catch (err) {
      // Enhanced error handling
      const errorMessage =
        err instanceof SyntaxError
          ? "Invalid JSON format."
          : err?.message || "An unexpected error occurred.";
      message.error(errorMessage);
      console.error("Submission Error:", err); // Debugging error details
    }
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  // Filtering the API response based on selected filters
  const filteredResponse = {
    numbers: filter.includes("Numbers") ? response?.numbers : [],
    alphabets: filter.includes("Alphabets") ? response?.alphabets : [],
    highest_lowercase_alphabet: filter.includes("Highest lowercase alphabet")
      ? response?.highest_lowercase_alphabet
      : [],
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <Title level={2}>
        {response?.roll_number || "Please submit JSON data"}
      </Title>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Text Area for JSON input */}
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter JSON data"
          rows={4}
          style={{ marginBottom: "10px" }}
        />

        {/* Submit Button */}
        <Button type="primary" onClick={handleSubmit} loading={isLoading}>
          Submit
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Error"
            description={error.message || "Error occurred"}
            type="error"
            showIcon
          />
        )}

        {/* Display filtered response */}
        {response && (
          <>
            <Select
              mode="multiple"
              value={filter}
              onChange={handleFilterChange}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <Option value="Alphabets">Alphabets</Option>
              <Option value="Numbers">Numbers</Option>
              <Option value="Highest lowercase alphabet">
                Highest lowercase alphabet
              </Option>
            </Select>

            {/* Card to display filtered response */}
            <Card title="Filtered Response" style={{ width: "100%" }}>
              {filter.includes("Numbers") && (
                <Card type="inner" title="Numbers">
                  <pre>{JSON.stringify(filteredResponse.numbers, null, 2)}</pre>
                </Card>
              )}
              {filter.includes("Alphabets") && (
                <Card type="inner" title="Alphabets">
                  <pre>
                    {JSON.stringify(filteredResponse.alphabets, null, 2)}
                  </pre>
                </Card>
              )}
              {filter.includes("Highest lowercase alphabet") && (
                <Card type="inner" title="Highest Lowercase Alphabet">
                  <pre>
                    {JSON.stringify(
                      filteredResponse.highest_lowercase_alphabet,
                      null,
                      2
                    )}
                  </pre>
                </Card>
              )}
            </Card>
          </>
        )}
      </Space>
    </div>
  );
}

export default Inputdata;
