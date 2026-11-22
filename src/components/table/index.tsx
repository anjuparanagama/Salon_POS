import { useMemo } from "react";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
  type RowData,
} from "@tanstack/react-table";

type TableRecord = Record<string, unknown>;

export type TableProps<T extends TableRecord> = {
  data: T[];
};

const features = tableFeatures({});

function formatHeader(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function Table<T extends TableRecord & RowData>({
  data,
}: TableProps<T>) {
  const columns = useMemo(() => {
    const helper = createColumnHelper<typeof features, T>();
    const keys = Object.keys(data[0] ?? {});

    return helper.columns(
      keys.map((key) =>
        helper.accessor((row) => row[key], {
          id: key,
          header: formatHeader(key),
          cell: (info) => formatCellValue(info.getValue()),
        }),
      ),
    );
  }, [data]);

  const table = useTable({
    features,
    columns,
    data,
  });

  return (
    <table className="w-full min-w-lg border-collapse text-left text-sm text-slate-600">
      <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-700">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border-b border-slate-200 px-4 py-3 font-semibold"
                scope="col"
              >
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
            >
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              className="px-4 py-8 text-center text-slate-500"
              colSpan={Math.max(columns.length, 1)}
            >
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
