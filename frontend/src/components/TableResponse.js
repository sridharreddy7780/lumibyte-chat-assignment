// src/components/TableResponse.jsx
import React from 'react';

export default function TableResponse({ table }) {
  if (!table) return null;

  const cols = table.columns || [];
  const rows = table.rows || table.data || [];

  return (
    <div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-gray-50/70 dark:bg-gray-900/60">
        Structured Answer
      </div>
      <table className="min-w-full text-xs">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {cols.map((c, idx) => (
              <th
                key={idx}
                className="px-3 py-2 text-left font-semibold whitespace-nowrap"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-t border-gray-100 dark:border-gray-800 odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
            >
              {r.map((cell, j) => (
                <td key={j} className="px-3 py-2 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
