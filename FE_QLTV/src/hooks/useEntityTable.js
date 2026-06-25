import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { api, getApiErrorMessage } from "@/lib/api";

function getRowId(row, columns) {
  const primaryColumns = columns.filter((column) => column.primaryKey);
  const idColumns = primaryColumns.length ? primaryColumns : [columns[0]];

  return idColumns.map((column) => row[column.key]);
}

/**
 * Quản lý dữ liệu và các thao tác CRUD cho DataTablePage.
 * Component giao diện chỉ cần lo phần hiển thị.
 */
export function useEntityTable({ apiModule, columns, entityName }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRows = useCallback(
    async (keyword = "") => {
      setLoading(true);
      setError("");

      try {
        const response = keyword
          ? await api.search(apiModule, keyword)
          : await api.getAll(apiModule);
        setRows(response.data ?? []);
      } catch (requestError) {
        const message = getApiErrorMessage(requestError);
        setError(message);
        toast.error("Không thể tải dữ liệu", { description: message });
      } finally {
        setLoading(false);
      }
    },
    [apiModule],
  );

  useEffect(() => {
    let active = true;

    api.getAll(apiModule)
      .then((response) => {
        if (active) setRows(response.data ?? []);
      })
      .catch((requestError) => {
        if (!active) return;

        const message = getApiErrorMessage(requestError);
        setError(message);
        toast.error("Không thể tải dữ liệu", { description: message });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [apiModule]);

  async function createRow(newRow) {
    try {
      const response = await api.create(apiModule, newRow);
      setRows((currentRows) => [...currentRows, response.data ?? newRow]);
      toast.success(`Thêm ${entityName.toLowerCase()} thành công`);
    } catch (requestError) {
      toast.error(`Thêm ${entityName.toLowerCase()} thất bại`, {
        description: getApiErrorMessage(requestError),
      });
      throw requestError;
    }
  }

  async function updateRow(targetRow, updatedRow) {
    try {
      const response = await api.update(apiModule, getRowId(targetRow, columns), updatedRow);
      const savedRow = response.data ?? updatedRow;

      setRows((currentRows) =>
        currentRows.map((row) => (row === targetRow ? savedRow : row)),
      );
      toast.success(`Cập nhật ${entityName.toLowerCase()} thành công`);
    } catch (requestError) {
      toast.error(`Cập nhật ${entityName.toLowerCase()} thất bại`, {
        description: getApiErrorMessage(requestError),
      });
      throw requestError;
    }
  }

  async function deleteRow(targetRow) {
    try {
      await api.remove(apiModule, getRowId(targetRow, columns));
      setRows((currentRows) => currentRows.filter((row) => row !== targetRow));
      toast.success(`Xóa ${entityName.toLowerCase()} thành công`);
    } catch (requestError) {
      toast.error(`Xóa ${entityName.toLowerCase()} thất bại`, {
        description: getApiErrorMessage(requestError),
      });
    }
  }

  return {
    createRow,
    deleteRow,
    error,
    loadRows,
    loading,
    rows,
    setRows,
    updateRow,
  };
}
