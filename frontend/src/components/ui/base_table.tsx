import { baseTypography } from "@/tokens/base_typography";
import React from "react";

export interface BaseTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  widthClass?: string;
  render: (row: T, index: number) => React.ReactNode;
}

export interface BaseTableProps<T> {
  columns: BaseTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  emptyMessage?: string;
}

export function BaseTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "Belum ada data.",
}: BaseTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-surface-elevated bg-surface-card">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-surface-elevated bg-surface-elevated/70">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 ${baseTypography.xs} font-semibold uppercase tracking-wider text-surface-subtle ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : "text-left"
                } ${col.widthClass || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-elevated">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={`px-4 py-10 text-center ${baseTypography.sm} text-surface-muted`}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={rowKey(row, idx)}
                className="transition-colors hover:bg-surface-elevated/35"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3.5 ${baseTypography.sm} text-surface-foreground ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {col.render(row, idx)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
