"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define the component's props
interface BarChartProps {
  data: { name: string; count: number; fill: string }[]; // Data for the chart
  barSize?: number; // Optional prop to set the bar size
  margin?: { top: number; right: number; left: number; bottom: number }; // Optional margins
  tickFontSize?: number; // Optional prop to set the font size of the axis ticks
}

const BarChartComponent: React.FC<BarChartProps> = ({
  data,
  barSize = 40, // Default bar size
  margin = { top: 0, right: 0, left: 0, bottom: 0 }, // Default margins
  tickFontSize = 12, // Default tick font size
}) => {
  return (
    <div className="w-full h-full bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* Apply custom font size to the XAxis and YAxis */}
          <XAxis dataKey="name" tick={{ fontSize: tickFontSize }} />
          <YAxis tick={{ fontSize: tickFontSize }} />
          <Tooltip />
          <Bar dataKey="count" fill="#004d40" barSize={barSize} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
