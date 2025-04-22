import { useEffect, useState } from "react";
import Controller from "./components/Controller";
import Main from "./components/Main";
import { grid } from "./data/data";

export default function Home() {
  const [showCard, setShowCard] = useState(null);
  const [showColumn, setShowColumn] = useState(4);
  console.log("From index: ", showColumn);

  //  Update grid

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
        <Controller setShowColumn={setShowColumn} setShowCard={setShowCard} />
        <Main showColumn={showColumn} showCard={showCard} />
      </div>
    </>
  );
}
