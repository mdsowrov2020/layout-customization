// import { Card, Checkbox, Col, Row, Select, Typography } from "antd";
// import React, { useEffect, useState } from "react";
// import { charts, grid, responsive, statistics } from "../data/data";

// const Controller = ({ setShowColumn, setShowCard, setScreen }) => {
//   const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);
//   const [options, setOptions] = useState([]);

//   const gridCustom = grid.map((data) => {
//     return { value: data.value, label: data.title };
//   });

//   const responsiveScreen = responsive.map((data) => {
//     return {
//       value: JSON.stringify({ min: data.min, max: data.max }),
//       label: data.device,
//     };
//   });

//   // Select card for visible to user
//   const onChange = (value: string) => {
//     setShowCard(value);
//   };

//   // Grid customization
//   const onChangeColumn = (value: string) => {
//     setShowColumn(value);
//   };

//   // Set screen
//   const onChangeScreen = (value: string) => {
//     const parsed = JSON.parse(value);
//     setScreen(parsed);
//   };

//   const handleCheckboxChange = (key: string) => (e) => {
//     setSelectedCheckbox(e.target.checked ? key : null);
//     console.log(`Checked ${key} = ${e.target.checked}`);
//   };

//   const isDisabled = (key: string) =>
//     selectedCheckbox !== null && selectedCheckbox !== key;

//   useEffect(() => {
//     let data;
//     if (selectedCheckbox === "stats") {
//       data = statistics.map((data) => {
//         return { value: data.id, label: data.name, component: data.component };
//       });

//       setOptions(data);
//     }

//     if (selectedCheckbox === "charts") {
//       data = charts.map((data) => {
//         return { value: data.id, label: data.name, component: data.component };
//       });
//       setOptions(data);
//     }
//   }, [selectedCheckbox]);

//   return (
//     <div>
//       <Card>
//         <Row gutter={[16, 16]}>
//           <Col span={4}>
//             <Checkbox
//               checked={selectedCheckbox === "stats"}
//               disabled={isDisabled("stats")}
//               onChange={handleCheckboxChange("stats")}
//             >
//               Select stats
//             </Checkbox>
//           </Col>
//           <Col span={4}>
//             <Checkbox
//               checked={selectedCheckbox === "charts"}
//               disabled={isDisabled("charts")}
//               onChange={handleCheckboxChange("charts")}
//             >
//               Select charts
//             </Checkbox>
//           </Col>
//           {/* <Col span={4}>
//             <Checkbox
//               checked={selectedCheckbox === "xs"}
//               disabled={isDisabled("xs")}
//               onChange={handleCheckboxChange("xs")}
//             >
//               Select extra small device
//             </Checkbox>
//           </Col>
//           <Col span={4}>
//             <Checkbox
//               checked={selectedCheckbox === "sm"}
//               disabled={isDisabled("sm")}
//               onChange={handleCheckboxChange("sm")}
//             >
//               Select small device
//             </Checkbox>
//           </Col>
//           <Col span={4}>
//             <Checkbox
//               checked={selectedCheckbox === "md"}
//               disabled={isDisabled("md")}
//               onChange={handleCheckboxChange("md")}
//             >
//               Select medium device
//             </Checkbox>
//           </Col>
//           <Col span={4}>
//             <Checkbox
//               checked={selectedCheckbox === "lg"}
//               disabled={isDisabled("lg")}
//               onChange={handleCheckboxChange("lg")}
//             >
//               Select large device
//             </Checkbox>
//           </Col>
//           <Col span={4}>
//             <Checkbox
//               checked={selectedCheckbox === "xl"}
//               disabled={isDisabled("xl")}
//               onChange={handleCheckboxChange("xl")}
//             >
//               Select extra large device
//             </Checkbox>
//           </Col> */}

//           <Col span={24}>
//             <Typography>Select Screen (Responsive)</Typography>
//             <Select
//               placeholder="Select screen size"
//               optionFilterProp="label"
//               onChange={onChangeScreen}
//               options={responsiveScreen}
//               style={{ width: "100%" }}
//             />
//           </Col>
//           <Col span={12}>
//             <Typography>Select components</Typography>
//             <Select
//               mode="tags"
//               placeholder="Select components"
//               optionFilterProp="label"
//               onChange={onChange}
//               options={options}
//               style={{ width: "100%" }}
//             />
//           </Col>
//           <Col span={12}>
//             <Typography>Select grid</Typography>
//             <Select
//               placeholder="Select column size"
//               optionFilterProp="label"
//               onChange={onChangeColumn}
//               options={gridCustom}
//               style={{ width: "100%" }}
//             />
//           </Col>
//         </Row>
//       </Card>
//     </div>
//   );
// };

// export default Controller;

// ==========================================================   New  ===============================================================
import {
  Card,
  Checkbox,
  Col,
  Row,
  Select,
  Typography,
  Button,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { charts, grid, responsive, statistics } from "../data/data";

interface ControllerProps {
  setDefaultStatsGrid: (value: number) => void;
  setDefaultChartsGrid: (value: number) => void;
  setVisibleStats: (ids: string[]) => void;
  setVisibleCharts: (ids: string[]) => void;
  setScreenSize: (size: { min: number; max: number | null } | null) => void;
  setSelectionType: (type: string | null) => void;
  visibleStats: string[];
  visibleCharts: string[];
  defaultStatsGrid: number;
  defaultChartsGrid: number;
  resetStats: () => void;
  resetCharts: () => void;
}

const Controller = ({
  setDefaultStatsGrid,
  setDefaultChartsGrid,
  setVisibleStats,
  setVisibleCharts,
  setScreenSize,
  setSelectionType,
  visibleStats,
  visibleCharts,
  defaultStatsGrid,
  defaultChartsGrid,
  resetStats,
  resetCharts,
}: ControllerProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const [tempStatsGrid, setTempStatsGrid] = useState(defaultStatsGrid);
  const [tempChartsGrid, setTempChartsGrid] = useState(defaultChartsGrid);

  const gridOptions = grid.map((item) => ({
    value: item.value,
    label: item.title,
  }));
  const screenOptions = [
    { value: null, label: "Show all screens" },
    ...responsive.map((item) => ({
      value: JSON.stringify({ min: item.min, max: item.max }),
      label: item.device,
    })),
  ];

  const handleTabChange =
    (tab: string) => (e: { target: { checked: boolean } }) => {
      const isChecked = e.target.checked;
      setActiveTab(isChecked ? tab : null);
      setSelectionType(isChecked ? tab : null);
      setSelectedComponents([]);
    };

  useEffect(() => {
    if (activeTab === "stats") {
      setSelectedComponents(visibleStats);
      setTempStatsGrid(defaultStatsGrid);
    } else if (activeTab === "charts") {
      setSelectedComponents(visibleCharts);
      setTempChartsGrid(defaultChartsGrid);
    }
  }, [activeTab, visibleStats, visibleCharts]);

  const handleSaveSettings = () => {
    if (!activeTab) {
      message.warning("Please select either Stats or Charts before saving.");
      return;
    }

    if (activeTab === "stats") {
      setVisibleStats(
        selectedComponents.length > 0
          ? selectedComponents
          : statistics.map((s) => s.id)
      );
      setDefaultStatsGrid(tempStatsGrid);
      message.success(`Statistics settings saved with grid ${tempStatsGrid}`);
    } else {
      setVisibleCharts(
        selectedComponents.length > 0
          ? selectedComponents
          : charts.map((c) => c.id)
      );
      setDefaultChartsGrid(tempChartsGrid);
      message.success(`Charts settings saved with grid ${tempChartsGrid}`);
    }

    setScreenSize(selectedScreen ? JSON.parse(selectedScreen) : null);
    setActiveTab(null);
    setSelectionType(null);
  };

  const handleReset = (type: "stats" | "charts") => {
    if (type === "stats") {
      resetStats();
      setTempStatsGrid(4);
    } else {
      resetCharts();
      setTempChartsGrid(12);
    }
    setSelectedComponents([]);
    setSelectedScreen(null);
  };

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={5}>Component Selector</Typography.Title>
        </Col>

        <Col span={12}>
          <Checkbox
            checked={activeTab === "stats"}
            onChange={handleTabChange("stats")}
          >
            Statistics
          </Checkbox>
          <Button
            type="link"
            onClick={() => handleReset("stats")}
            style={{ marginLeft: 8 }}
          >
            Reset Stats
          </Button>
        </Col>
        <Col span={12}>
          <Checkbox
            checked={activeTab === "charts"}
            onChange={handleTabChange("charts")}
          >
            Charts
          </Checkbox>
          <Button
            type="link"
            onClick={() => handleReset("charts")}
            style={{ marginLeft: 8 }}
          >
            Reset Charts
          </Button>
        </Col>

        <Col span={24}>
          <Typography.Text strong>Screen Size Filter</Typography.Text>
          <Select
            options={screenOptions}
            onChange={setSelectedScreen}
            value={selectedScreen}
            style={{ width: "100%", marginTop: 8 }}
            allowClear
          />
        </Col>

        <Col span={24}>
          <Typography.Text strong>
            Select{" "}
            {activeTab === "stats"
              ? "Statistics"
              : activeTab === "charts"
              ? "Charts"
              : "Components"}
          </Typography.Text>
          <Select
            mode="multiple"
            options={
              activeTab === "stats"
                ? statistics.map((s) => ({ value: s.id, label: s.name }))
                : activeTab === "charts"
                ? charts.map((c) => ({ value: c.id, label: c.name }))
                : []
            }
            value={selectedComponents}
            onChange={setSelectedComponents}
            style={{ width: "100%", marginTop: 8 }}
            disabled={!activeTab}
          />
        </Col>

        <Col span={24}>
          <Typography.Text strong>
            {activeTab === "stats"
              ? "Statistics"
              : activeTab === "charts"
              ? "Charts"
              : ""}{" "}
            Grid Layout
          </Typography.Text>
          <Select
            options={gridOptions}
            value={activeTab === "stats" ? tempStatsGrid : tempChartsGrid}
            onChange={
              activeTab === "stats" ? setTempStatsGrid : setTempChartsGrid
            }
            style={{ width: "100%", marginTop: 8 }}
            disabled={!activeTab}
          />
        </Col>

        <Col span={24}>
          <Button
            type="primary"
            onClick={handleSaveSettings}
            style={{ width: "100%" }}
          >
            Save{" "}
            {activeTab === "stats"
              ? "Statistics"
              : activeTab === "charts"
              ? "Charts"
              : ""}{" "}
            Settings
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default Controller;
