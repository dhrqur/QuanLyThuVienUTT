import { useMemo, useState } from "react";
import { Pencil, Plus, Save } from "lucide-react";

import DatePickerInput from "@/components/common/DatePickerInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getNextGeneratedValue } from "@/components/common/dataTableUtils";
import { hasErrors, validateGenericEntityForm } from "@/utils/formValidation";

function EntityFormDialog({ columns, entityName, mode, onSave, renderFormExtra, row, rows, title }) {
  const isEdit = mode === "edit";
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);
  const formId = `entity-form-${mode}-${row?.[columns[0].key] ?? "new"}`;
  const formColumns = columns.filter((column) => !column.formHidden);
  const formGridClass = formColumns.length <= 4 ? "md:grid-cols-2" : "md:grid-cols-3";

  const dialogTitle = useMemo(
    () => (isEdit ? `Cập nhật ${entityName.toLowerCase()}` : `Thêm ${entityName.toLowerCase()}`),
    [entityName, isEdit],
  );

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);
    setErrors({});

    if (nextOpen) {
      setFormValues(
        Object.fromEntries(
          formColumns.map((column) => [
            column.key,
            getDefaultValue({ column, isEdit, row, rows }),
          ]),
        ),
      );
    }
  }

  function handleFieldChange(key, value) {
    setFormValues((currentValues) => {
      const nextValues = { ...currentValues, [key]: value };

      formColumns.forEach((column) => {
        if (column.dependsOn === key) {
          nextValues[column.key] = "";
        }
      });

      return nextValues;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validateGenericEntityForm({ columns, formData, isEdit });

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    const nextRow = {};

    formColumns.forEach((column) => {
      if (column.primaryKey && isEdit) {
        nextRow[column.key] = row?.[column.key];
        return;
      }

      const value = formData.get(column.key);
      if (value === null) return;
      if (isEdit && column.keepExistingWhenBlank && value === "") return;

      nextRow[column.key] = column.inputType === "number" ? Number(value) : value;
    });

    const loanDetails = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("SachMuon["))
      .map(([key, value]) => ({
        MaSach: key.slice("SachMuon[".length, -1),
        SoLuong: Number(value),
      }));

    if (loanDetails.length) {
      nextRow.ChiTiet = loanDetails;
    }

    setSaving(true);
    try {
      await onSave(nextRow);
      setErrors({});
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={
            isEdit
              ? "border-orange-200 bg-orange-50 px-1.5 text-orange-700 hover:bg-orange-100"
              : "bg-orange-500 font-bold shadow-sm shadow-orange-500/20 hover:bg-orange-600"
          }
          size={isEdit ? "xs" : "default"}
          variant={isEdit ? "outline" : "default"}
        >
          {isEdit ? <Pencil className="size-3" /> : <Plus className="size-4" />}
          {title}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-6xl p-0" onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader className="border-b border-slate-100 px-6 py-5">
          <DialogTitle className="text-xl font-extrabold text-slate-900">{dialogTitle}</DialogTitle>
          <DialogDescription className="sr-only">{dialogTitle}.</DialogDescription>
        </DialogHeader>

        <form className={`grid max-h-[65vh] gap-5 overflow-y-auto px-6 py-6 ${formGridClass}`} id={formId} noValidate onSubmit={handleSubmit}>
          {formColumns.map((column) => (
            <FormField
              column={column}
              error={errors[column.key]}
              formValues={formValues}
              isEdit={isEdit}
              key={column.key}
              onFieldChange={handleFieldChange}
              row={row}
              rows={rows}
            />
          ))}
          {renderFormExtra?.({ isEdit, row })}
        </form>

        <DialogFooter className="border-t border-slate-100 bg-slate-50 px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Hủy</Button>
          </DialogClose>
          <Button className="bg-orange-500 font-bold hover:bg-orange-600" disabled={saving} form={formId} type="submit">
            <Save className="size-4" />
            {isEdit ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormField({ column, error, formValues, isEdit, onFieldChange, row, rows }) {
  const isLockedPrimaryKey = column.primaryKey && (isEdit || column.autoGenerated);
  const isRequired = column.required !== false && !(isEdit && column.requiredOnCreate);
  const defaultValue = getDefaultValue({ column, isEdit, row, rows });

  return (
    <label className="space-y-2 text-sm font-bold text-slate-700">
      <span>
        {column.displayLabel ?? column.label}
        {isRequired && !isLockedPrimaryKey ? <span className="ml-1 text-rose-500">*</span> : null}
      </span>
      {renderInput({
        column,
        defaultValue,
        error,
        formValues,
        isLockedPrimaryKey,
        isRequired,
        onFieldChange,
      })}
      {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}
    </label>
  );
}

function getDefaultValue({ column, isEdit, row, rows }) {
  if (isEdit) return column.clearOnEdit ? "" : row?.[column.key] ?? "";
  if (column.autoGenerated) return getNextGeneratedValue(rows, column.key);
  return "";
}

function renderInput({
  column,
  defaultValue,
  error,
  formValues,
  isLockedPrimaryKey,
  isRequired,
  onFieldChange,
}) {
  const inputErrorClass = error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200";

  if (column.inputType === "date") {
    return <DatePickerInput className={error ? "rounded-lg ring-2 ring-rose-100" : ""} defaultValue={defaultValue} name={column.key} required={isRequired} />;
  }

  if (column.options) {
    const options = typeof column.options === "function"
      ? column.options(formValues)
      : column.options;
    const isWaitingForDependency = column.dependsOn && !formValues[column.dependsOn];

    return (
      <select
        className={`h-10 w-full rounded-lg border px-3 text-sm font-medium outline-none transition focus:ring-3 ${inputErrorClass} ${
          isLockedPrimaryKey || isWaitingForDependency
            ? "bg-slate-50 text-slate-500"
            : "bg-white text-slate-700"
        }`}
        disabled={isLockedPrimaryKey || isWaitingForDependency}
        name={column.key}
        onChange={(event) => onFieldChange(column.key, event.target.value)}
        value={formValues[column.key] ?? defaultValue}
      >
        <option value="">
          {isWaitingForDependency ? column.dependencyPlaceholder ?? "-- Chọn dữ liệu trước --" : "-- Chọn --"}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Input
      className={`h-10 rounded-lg ${inputErrorClass} ${isLockedPrimaryKey ? "bg-slate-50 text-slate-500" : ""}`}
      defaultValue={defaultValue}
      name={column.key}
      placeholder={column.placeholder ?? `Nhập ${column.displayLabel ?? column.label}`}
      readOnly={isLockedPrimaryKey}
      type={column.inputType ?? "text"}
    />
  );
}

export default EntityFormDialog;
