import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function SearchableSelect({
  disabled = false,
  name,
  onChange,
  options,
  placeholder = "-- Chọn --",
  quickCreate,
  value = "",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateName, setQuickCreateName] = useState("");
  const selectedOption = options.find((option) => String(option.value) === String(value));
  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return options;
    return options.filter((option) => normalizeText(`${option.label} ${option.value}`).includes(normalizedQuery));
  }, [options, query]);

  return (
    <>
      <PopoverPrimitive.Root
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) setQuery("");
        }}
        open={open}
      >
        <PopoverPrimitive.Trigger asChild>
          <Button
            aria-expanded={open}
            className="h-10 w-full justify-between border-slate-200 bg-white px-3 font-medium text-slate-700 hover:bg-slate-50"
            disabled={disabled}
            role="combobox"
            type="button"
            variant="outline"
          >
            <span className={cn("truncate", !selectedOption && "text-slate-400")}>
              {selectedOption?.label ?? placeholder}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 text-slate-400" />
          </Button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            className="z-[80] w-[var(--radix-popover-trigger-width)] rounded-xl border border-slate-200 bg-white p-2 shadow-xl outline-none"
            sideOffset={5}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                autoFocus
                className="h-9 pl-9"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nhập mã hoặc tên để tìm..."
                value={query}
              />
            </div>

            <div className="mt-2 max-h-56 overflow-y-auto">
              {filteredOptions.length ? filteredOptions.map((option) => (
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-50"
                  disabled={option.disabled}
                  key={option.value}
                  onClick={() => {
                    const accepted = onChange(String(option.value));
                    if (accepted !== false) setOpen(false);
                  }}
                  type="button"
                >
                  <Check className={cn("size-4 shrink-0 text-orange-500", String(option.value) !== String(value) && "invisible")} />
                  <span className="truncate">{option.label}</span>
                </button>
              )) : (
                <p className="px-3 py-5 text-center text-sm text-slate-500">Không tìm thấy dữ liệu phù hợp.</p>
              )}
            </div>

            {quickCreate ? (
              <button
                className="mt-2 flex w-full items-center justify-center gap-2 border-t border-slate-100 px-3 pt-3 pb-1 text-sm font-extrabold text-orange-600 hover:text-orange-700"
                onClick={() => {
                  setQuickCreateName(query);
                  setOpen(false);
                  setQuickCreateOpen(true);
                }}
                type="button"
              >
                <Plus className="size-4" />
                {quickCreate.label}
              </button>
            ) : null}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      <input name={name} type="hidden" value={value} />

      {quickCreate && quickCreateOpen ? (
        <QuickCreateDialog
          initialName={quickCreateName}
          onCreated={(option) => {
            onChange(String(option.value));
            setQuickCreateOpen(false);
          }}
          onOpenChange={setQuickCreateOpen}
          open={quickCreateOpen}
          quickCreate={quickCreate}
        />
      ) : null}
    </>
  );
}

function QuickCreateDialog({ initialName, onCreated, onOpenChange, open, quickCreate }) {
  const [values, setValues] = useState(() => Object.fromEntries(quickCreate.fields.map((field) => [
    field.key,
    field.key === quickCreate.nameField ? initialName : field.defaultValue ?? "",
  ])));
  const [saving, setSaving] = useState(false);

  async function save() {
    const missingField = quickCreate.fields.find(
      (field) => field.required !== false && !String(values[field.key] ?? "").trim(),
    );
    if (missingField) {
      toast.error(`Vui lòng nhập ${missingField.label.toLowerCase()}.`);
      return;
    }

    setSaving(true);
    try {
      const option = await quickCreate.onCreate(values);
      onCreated(option);
      toast.success(`${quickCreate.entityName} đã được thêm và chọn tự động.`);
    } catch (error) {
      toast.error(`Không thể thêm ${quickCreate.entityName.toLowerCase()}`, {
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-slate-100 px-6 py-5">
          <DialogTitle>Thêm nhanh {quickCreate.entityName.toLowerCase()}</DialogTitle>
          <DialogDescription className="sr-only">Biểu mẫu thêm nhanh dữ liệu liên quan.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          {quickCreate.fields.map((field) => (
            <label className={cn("space-y-2 text-sm font-bold text-slate-700", field.fullWidth && "sm:col-span-2")} key={field.key}>
              <span>{field.label}{field.required !== false ? <span className="ml-1 text-rose-500">*</span> : null}</span>
              {field.options ? (
                <select
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-orange-300 focus:ring-3 focus:ring-orange-100"
                  onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                  value={values[field.key] ?? ""}
                >
                  <option value="">-- Chọn --</option>
                  {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              ) : (
                <Input
                  max={field.max}
                  min={field.min}
                  onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                  placeholder={field.placeholder ?? `Nhập ${field.label.toLowerCase()}`}
                  type={field.inputType ?? "text"}
                  value={values[field.key] ?? ""}
                />
              )}
            </label>
          ))}
        </div>
        <DialogFooter className="border-t bg-slate-50 px-6 py-4">
          <Button onClick={() => onOpenChange(false)} type="button" variant="outline">Hủy</Button>
          <Button className="bg-orange-500 font-bold hover:bg-orange-600" disabled={saving} onClick={save} type="button">
            {saving ? "Đang thêm..." : "Thêm và chọn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim();
}

export default SearchableSelect;
