import React from 'react';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  tableAriaLabel?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  tableAriaLabel = 'Table',
}: TableProps<T>) {
  return (
    <table
      className="border-collapse table-auto w-full text-sm"
      aria-label={tableAriaLabel}
    >
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th
              key={col.header + idx}
              className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"
              scope="col"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-slate-800">
        {data.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {columns.map((col, colIdx) => (
              <td
                key={col.header + colIdx}
                className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400"
              >
                {col.render ? col.render(row) : String(row[col.accessor] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
