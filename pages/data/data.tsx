import ActiveUserCard from "../ui/ActiveUserCard";
import FreeUserCard from "../ui/FreeUserCard";
import StatisticCard from "../ui/StatisticCard";
import TotalExpenseCard from "../ui/TotalExpenseCard";
import TotalSaleCard from "../ui/TotalSaleCard";
import UserCountCard from "../ui/UserCountCard";

export const statistics = [
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

export const grid = [
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
