import React from "react";
import { Select, Typography } from "antd";
import { GridOption } from "@/pages/model/type";

interface CustomGridSelectProps {
  currentValue: number;
  onChange: (value: number) => void;
  selectedCardId: string;
}

const CustomGridSelect: React.FC<CustomGridSelectProps> = ({
  currentValue,
  onChange,
  selectedCardId,
}) => {
  const gridOptions: GridOption[] = [
    { value: 4, title: "4 columns" },
    { value: 6, title: "6 columns" },
    { value: 8, title: "8 columns" },
    { value: 12, title: "12 columns" },
    { value: 24, title: "24 columns" },
  ];

  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <Typography.Text strong>
        Set column for card ID: {selectedCardId}
      </Typography.Text>
      <Select
        style={{ width: 200, marginLeft: 10 }}
        placeholder="Select column span"
        options={gridOptions.map((opt) => ({
          label: opt.title,
          value: opt.value,
        }))}
        onChange={onChange}
        value={currentValue}
      />
    </div>
  );
};

export default CustomGridSelect;
