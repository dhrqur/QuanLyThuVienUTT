import { formatDisplayDate } from "@/utils/dateUtils";

export function getDisplayValue(column, row) {
  if (column.displayValue) return column.displayValue(row) ?? "Chưa có";
  const value = row[column.key];
  return column.inputType === "date" ? formatDisplayDate(value) || "Chưa có" : value ?? "Chưa có";
}

export function getColumnWidth(column, compactTable) {
  const width = column.widthValue ?? 128;
  return compactTable
    ? Math.min(Math.max(width, 64), 112)
    : Math.min(Math.max(width, 88), 190);
}

export function getRowKey(row, columns) {
  const primaryColumns = columns.filter((column) => column.primaryKey);
  return (primaryColumns.length ? primaryColumns : [columns[0]])
    .map((column) => row[column.key])
    .join("-");
}

export function getNextGeneratedValue(rows, columnOrKey) {
  const column = typeof columnOrKey === "string" ? { key: columnOrKey } : columnOrKey;
  const { key, generatedPrefix = "", generatedStart = 1, generatedWidth = 3 } = column;
  const values = rows
    .map((row) => String(row[key] ?? "").match(/^(.*?)(\d+)$/))
    .filter(Boolean)
    .map((match) => ({ number: Number(match[2]), prefix: match[1], width: match[2].length }));

  if (!values.length) {
    return `${generatedPrefix}${String(generatedStart).padStart(generatedWidth, "0")}`;
  }

  const highest = values.reduce((current, value) => value.number > current.number ? value : current);
  return `${highest.prefix}${String(highest.number + 1).padStart(highest.width, "0")}`;
}
