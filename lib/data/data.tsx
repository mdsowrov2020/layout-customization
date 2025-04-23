import BarChartLib from "../../pages/components/BarChartLib";
import ComposeChart from "../../pages/components/ComposeChart";
import PieChartLib from "../../pages/components/PieChartLib";
import { Chart, GridOption, Statistic } from "../model/type";
import ActiveUserCard from "../../pages/ui/ActiveUserCard";
import FreeUserCard from "../../pages/ui/FreeUserCard";
import StatisticCard from "../../pages/ui/StatisticCard";
import TotalExpenseCard from "../../pages/ui/TotalExpenseCard";
import TotalSaleCard from "../../pages/ui/TotalSaleCard";
import UserCountCard from "../../pages/ui/UserCountCard";

export const statistics: Statistic[] = [
  {
    id: 1,
    name: "Active user",
    grid: 4,
    component: <ActiveUserCard />,
  },
  {
    id: 2,
    name: "Free user",
    grid: 4,
    component: <FreeUserCard />,
  },
  {
    id: 3,
    name: "Statistic",
    grid: 4,
    component: <StatisticCard />,
  },
  {
    id: 4,
    name: "Total expense",
    grid: 4,
    component: <TotalExpenseCard />,
  },
  {
    id: 5,
    name: "Total sale",
    grid: 4,
    component: <TotalSaleCard />,
  },
  {
    id: 6,
    name: "User count",
    grid: 4,
    component: <UserCountCard />,
  },
];

export const grid: GridOption[] = [
  {
    id: 2,
    value: 24,
    title: "Grid : 24",
  },
  {
    id: 1,
    value: 12,
    title: "Grid : 12",
  },

  {
    id: 3,
    value: 8,
    title: "Grid : 8",
  },
  {
    id: 4,
    value: 6,
    title: "Grid : 6",
  },
  {
    id: 5,
    value: 4,
    title: "Grid : 4",
  },
];

export const responsive = [
  {
    id: 1,
    device: "Extra small",
    min: 0,
    max: 576,
  },
  {
    id: 2,
    device: "Small",
    min: 576,
    max: 768,
  },

  {
    id: 3,
    device: "Medium",
    min: 768,
    max: 992,
  },
  {
    id: 4,
    device: "Large",
    min: 992,
    max: 1200,
  },
  {
    id: 5,
    device: "Extra large",
    min: 1400,
    max: null,
  },
];

export const charts: Chart[] = [
  {
    id: 1,
    name: "Bar chart",
    grid: 8,
    component: <BarChartLib />,
  },
  {
    id: 2,
    name: "Compose chart",
    grid: 8,
    component: <ComposeChart />,
  },
  {
    id: 3,
    name: "Pie chart",
    grid: 8,
    component: <PieChartLib />,
  },
];
