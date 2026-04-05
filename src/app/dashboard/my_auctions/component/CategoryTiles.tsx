"use client";

import React from "react";
import BarChartComponent from "../../component/charts/BarChart";

const CategoryTiles = () => {
  const chartData = [
    { name: "Cars", count: 750, fill: "#004d40" },
    { name: "Electronics", count: 800, fill: "#1E88E5" },
    { name: "House items", count: 950, fill: "#4DD0E1" },
    { name: "Office equipments", count: 200, fill: "#B2EBF2" },
    { name: "Others", count: 350, fill: "#00796B" },
  ];

  return (
    <div
      className="w-full h-full rounded-xl space-y-6 p-6 bg-white"
      style={{
        boxShadow: "0px 1px 3px 0px #1018281A",
      }}
    >
      <h1 className="text-[#363435] font-bold text-base">Categories</h1>
      <div className="bg-white max-h-[150px] min-h-[100px] h-full w-full">
        <BarChartComponent data={chartData} barSize={48} />
      </div>
      <div className="flex items-center space-x-3 justify-center">
        {chartData.map((category, id) => (
          <div key={id} className="flex items-center space-x-2">
            <div
              className="w-5 h-5 rounded-full"
              style={{ background: category.fill }}
            ></div>
            <p className="text-xs text-[#585757]">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTiles;
