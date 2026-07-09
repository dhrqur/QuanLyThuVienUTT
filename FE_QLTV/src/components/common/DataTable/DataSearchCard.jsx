import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function DataSearchCard({
  searchInput,
  searchPlaceholder = "Tìm kiếm...",
  onChange,
  onReset,
  onSearch,
}) {
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      onSearch();
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <label className="block text-sm font-medium text-slate-700">
        Từ khóa
      </label>

      <div className="mt-2 flex flex-col gap-2 md:flex-row">
        <Input
          className="h-10"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={searchPlaceholder}
          value={searchInput}
        />

        <Button className="bg-orange-500 font-bold hover:bg-orange-600" onClick={onSearch}>
          Tìm kiếm
        </Button>
        <Button onClick={onReset} variant="outline">
          Đặt lại
        </Button>
      </div>
    </div>
  );
}

export default DataSearchCard;
