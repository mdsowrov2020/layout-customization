import React from "react";
import { grid } from "../data/data";
import { Select, Typography } from "antd";

interface CustomGridSelectProps {
  selectedCardId: string;
  currentValue: number;
  onChange: (value: number) => void;
}

const CustomGridSelect: React.FC<CustomGridSelectProps> = ({
  selectedCardId,
  currentValue,
  onChange,
}) => {
  const gridOptions = grid.map((val) => ({
    label: `${val.title}`,
    value: val.value,
  }));

  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <Typography.Text strong>
        Set column for card ID: {selectedCardId}
      </Typography.Text>
      <Select
        style={{ width: 200, marginLeft: 10 }}
        placeholder="Select column span"
        options={gridOptions}
        onChange={onChange}
        value={currentValue}
      />
    </div>
  );
};

export default CustomGridSelect;
