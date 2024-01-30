import React, { useState } from "react";
import { Table, Button, Upload, Alert } from "antd";
import Papa from "papaparse";
import type { DataItem } from "./types";
import { validateData, TableColumns } from "./helpers";

const App: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isInvalidData, setIsInvalidData] = useState<boolean>(false);

  const handleUpload = (file: File) => {
    setIsInvalidData(false);
    Papa.parse(file, {
      complete: (result) => {
        const parsedData = result.data.slice(0, -1);
        const validatedData = validateData(parsedData);
        validatedData.forEach((row) => {
          if (row.fullName === "" || row.email === "" || row.age === 0) {
            setIsInvalidData(true);
          }
        });
        setData(validatedData);
      },
      header: true,
    });
  };

  return (
    <div className="center">
      <Upload
        accept=".csv"
        showUploadList={false}
        beforeUpload={(file) => {
          handleUpload(file);
          return false;
        }}>
        <Button>Select CSV File</Button>
      </Upload>
      <Table<DataItem> dataSource={data} columns={TableColumns} />
      {isInvalidData && (
        <Alert message="File format is not correct" type="error" />
      )}
    </div>
  );
};

export default App;
