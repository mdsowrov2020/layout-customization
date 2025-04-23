import React from "react";
import { Select, Typography } from "antd";
import { GridOption } from "@/pages/model/type";
import { grid } from "../data/data";

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
  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <Typography.Text strong>
        Set column for card ID: {selectedCardId}
      </Typography.Text>
      <Select
        style={{ width: 200, marginLeft: 10 }}
        placeholder="Select column span"
        options={grid.map((opt) => ({
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
