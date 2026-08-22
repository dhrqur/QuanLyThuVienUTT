import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function DataSearchCard({
  hasActiveConditions = false,
  searchInput,
  searchPlaceholder = "Tìm kiếm...",
  onChange,
  onReset,
  onSearch,
}) {
  const canReset = hasActiveConditions || Boolean(searchInput.trim());

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      onSearch();
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            aria-label="Từ khóa tìm kiếm"
            className="h-10 pl-9"
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            value={searchInput}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button className="h-10 bg-orange-500 px-4 font-bold hover:bg-orange-600" onClick={onSearch} type="button">
            Tìm kiếm
          </Button>
          {canReset ? (
            <Button className="h-10 px-3 text-slate-500" onClick={onReset} title="Xóa tìm kiếm và sắp xếp" type="button" variant="ghost">
              <RotateCcw className="size-4" />
              <span className="hidden sm:inline">Đặt lại</span>
            </Button>
          ) : null}
        </div>
      </div>

    </div>
  );
}

export default DataSearchCard;
