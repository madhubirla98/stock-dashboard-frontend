"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import axios from "axios";
import dynamic from "next/dynamic";
import {
  subDays,
  subMonths,
  subYears,
  startOfYear,
  startOfMonth,
  format,
} from "date-fns";

// Dynamically import ECharts to avoid SSR issues in Next.js
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

// Timeframe options
const TIMEFRAMES = [
  { label: "1 Day", value: "1d" },
  { label: "1 Week", value: "1w" },
  { label: "1 Month", value: "1m" },
  { label: "3 Months", value: "3mo" },
  { label: "1 Year", value: "1y" },
  { label: "Year to Date", value: "ytd" },
  { label: "Month to Date", value: "mtd" },
  { label: "Custom Range", value: "custom" },
];

// Helper: Convert timeframe to date range
const getDateRangeForTimeframe = (timeframe: string) => {
  const today = new Date();
  let start: Date;

  switch (timeframe) {
    case "1d":
      start = subDays(today, 1);
      break;
    case "1w":
      start = subDays(today, 7);
      break;
    case "1m":
      start = subMonths(today, 1);
      break;
    case "3mo":
      start = subMonths(today, 3);
      break;
    case "1y":
      start = subYears(today, 1);
      break;
    case "ytd":
      start = startOfYear(today);
      break;
    case "mtd":
      start = startOfMonth(today);
      break;
    case "custom":
      return null;
    default:
      start = subMonths(today, 1);
  }

  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(today, "yyyy-MM-dd"),
  };
};

export default function DashboardPage() {
  const router = useRouter();

  const [tickers, setTickers] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState("1m");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Auth guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) router.push("/login");
      else setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [router]);

  const handleTickerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    const symbols = value.split(",").map((s) => s.trim());
    setTickers(symbols.filter((s) => s));
  };

  const fetchChartData = async () => {
    if (tickers.length === 0) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();

      const range =
        timeframe === "custom"
          ? customRange
          : getDateRangeForTimeframe(timeframe)!;

      const res = await axios.post(
        "http://localhost:8000/api/stocks",
        {
          tickers,
          timeframe,
          start_date: range.start,
          end_date: range.end,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data.data;

      if (!data || !tickers.length) {
        alert("No data returned");
        setChartData(null);
        setLoading(false);
        return;
      }

      const firstTicker = tickers[0];
      const dates = data[firstTicker].map((entry: any) => entry.Date);

      const series = tickers.map((ticker) => ({
        name: ticker,
        type: "line",
        data: data[ticker].map((entry: any) => entry.Close),
      }));

      const option = {
        title: { text: "Stock Comparison" },
        tooltip: { trigger: "axis" },
        legend: { data: tickers },
        xAxis: { type: "category", data: dates },
        yAxis: { type: "value" },
        series,
      };

      setChartData(option);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stock data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Stock Dashboard</h1>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">
            Enter tickers (comma-separated):
          </label>
          <input
            type="text"
            placeholder="AAPL, MSFT, GOOGL"
            className="w-full p-2 border rounded"
            onChange={handleTickerInput}
          />
        </div>

        <div>
          <label className="block font-semibold">Select Timeframe:</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {TIMEFRAMES.map((tf) => (
              <option key={tf.value} value={tf.value}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>

        {timeframe === "custom" && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold">Start Date:</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold">End Date:</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
            </div>
          </div>
        )}

        <button
          onClick={fetchChartData}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Compare Stocks"}
        </button>
      </div>

      {/* Chart */}
      {chartData && (
        <div className="mt-8">
          <ReactECharts option={chartData} style={{ height: 400 }} />
        </div>
      )}
    </div>
  );
}
