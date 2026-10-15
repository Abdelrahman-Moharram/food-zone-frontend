import React, { useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { beautify_date, numberToMoney } from "../utils/helper";
import { Loading } from "../Loaders";
import { EmptyData } from "../Common/Alerts";

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  isLoading: boolean;

  /** columns to hide (like ids, fn, etc.) */
  fnKeys?: string[];

  /** columns whose values should be formatted as amounts */
  amounts?: string[];

  /** columns whose values should be formatted as dates */
  dates?: string[];

  /** Show # counter column */
  showCounter?: boolean;
  selectCols?: boolean;

  /** Optional start / end cell renderers */
  startOptions?: (row: T) => React.ReactNode;
  startOptionsHeader?: string;

  options?: (row: T) => React.ReactNode;
  optionsHeader?: string;

  /** Empty content props */
  emptyText?: string;

  colLengthLimit?: number;
}

/** A simple dropdown for column selection */
const ColumnSelector: React.FC<{
  allColumns: string[];
  selected: string[];
  onToggle: (col: string) => void;
}> = ({ allColumns, selected, onToggle }) => {
  return (
    <div className="inline-block relative">
      <details className="cursor-pointer select-none">
        <summary className="px-3 py-1 bg-gray-100 border rounded text-sm">
          Select Columns
        </summary>
        <div className="absolute mt-1 p-2 bg-white border rounded shadow w-48 z-10">
          {allColumns.map((col) => (
            <label
              key={col}
              className="flex items-center text-sm space-x-2 py-1"
            >
              <input
                type="checkbox"
                checked={selected.includes(col)}
                onChange={() => onToggle(col)}
              />
              <span>{col}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
};

function DataTable<T extends Record<string, any>>({
  data,
  isLoading,
  fnKeys = [],
  amounts = [],
  dates = ["date", "DATE", "تاريخ", "created", "Created"],
  showCounter = false,
  startOptions,
  startOptionsHeader,
  options,
  optionsHeader,
  emptyText,
  selectCols = false,
  colLengthLimit = 70,
}: DataTableProps<T>) {
  /** --- derive table columns --- */

  const allCols = useMemo(() => {
    if (!data?.length) return [];
    return Object.keys(data[0]).filter((c) => !fnKeys.includes(c));
  }, [data, fnKeys]);

  const toggleCol = (col: string) => {
    setVisibleCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
    );
  };

  const [visibleCols, setVisibleCols] = useState<string[]>([]);

  useEffect(() => {
    if (allCols.length && visibleCols.length === 0) {
      setVisibleCols(allCols);
    }
  }, [allCols]);

  /** --- table helpers --- */
  const showCellWithOverlay = (val: any) => {
    if (typeof val !== "string" || val.length < colLengthLimit) return val;

    const id = "tt-" + Math.random().toString(36).slice(2);

    return (
      <div>
        <div
          data-tooltip-id={id}
          data-tooltip-content={val}
          className="cursor-default large-table-cell"
        >
          {val.slice(0, colLengthLimit)} ...
        </div>

        <Tooltip
          id={id}
          variant="dark"
          className="whitespace-normal max-w-sm" // Tailwind
        />
      </div>
    );
  };

  const renderCell = (row: T, col: string) => {
    const val = row[col];
    if (val == null || val === "") return null;

    if (amounts.filter((i) => col.toLocaleLowerCase().includes(i)).length)
      return <>{numberToMoney(val)}</>;

    if (dates.filter((i) => col.toLocaleLowerCase().includes(i)).length)
      return beautify_date(val, true);

    if (typeof val === "string") {
      const normalized = val.toLowerCase().trim();
      const success = [
        "approved",
        "accepted",
        "مقبول",
        "ناجح",
        "success",
        "s",
        "a",
        "نجح",
      ];
      const rejected = [
        "failed",
        "مرفوض",
        "rejected",
        "r",
        "f",
        "fail",
        "فشل",
        "error",
      ];

      if (rejected.includes(normalized))
        return <span className="text-red-600 font-semibold">{val}</span>;

      if (success.includes(normalized))
        return <span className="text-green-600 font-semibold">{val}</span>;
    }

    return showCellWithOverlay(val);
  };

  /** --- main render --- */
  return (
    <div className="space-y-3">
      {/* column selector */}
      {allCols.length > 0 && selectCols && (
        <ColumnSelector
          allColumns={allCols}
          selected={visibleCols}
          onToggle={toggleCol}
        />
      )}

      <div className="overflow-x-auto overflow-y-hidden rounded-lg border">
        {isLoading ? (
          <Loading />
        ) : data && data.length > 0 ? (
          <table className="w-full text-center">
            <thead>
              <tr className="text-center bg-primary text-white">
                {startOptions && (
                  <th className="py-2 px-4">{startOptionsHeader ?? ""}</th>
                )}
                {showCounter && <th className="py-2 px-4">#</th>}
                {visibleCols.map((col) => (
                  <th
                    key={col}
                    className="border border-gray-200 whitespace-nowrap px-4 py-4 font-bold"
                  >
                    {col}
                  </th>
                ))}
                {options && (
                  <th className="py-2 px-4">{optionsHeader ?? ""}</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={idx}>
                  {startOptions && (
                    <td className="border border-gray-200 px-4 py-2">
                      {startOptions(row)}
                    </td>
                  )}
                  {showCounter && (
                    <td className="border border-gray-200 px-4 py-2">
                      {idx + 1}
                    </td>
                  )}

                  {visibleCols.map((col) => (
                    <td
                      key={col}
                      className="border border-gray-200 whitespace-nowrap px-4 py-2"
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}

                  {options && (
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="flex justify-center">{options(row)}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : emptyText ? (
          <EmptyData height="200px" message={emptyText} />
        ) : null}
      </div>
    </div>
  );
}

export default DataTable;
