import { Funnel, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function DataSearchCard({
  searchInput,
  searchPlaceholder = "Tìm kiếm...",
  onChange,
  onReset,
  onSearch,
}) {
  return (
    <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-extrabold text-slate-900">
          <Funnel className="size-4 text-orange-500" />
          Bộ lọc tìm kiếm
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="w-full space-y-2 text-sm font-bold text-slate-700 md:max-w-md">
            <span>Từ khóa</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-10 rounded-lg border-slate-200 bg-white pl-10"
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && onSearch()}
                placeholder={searchPlaceholder}
                value={searchInput}
              />
            </div>
          </label>

          <div className="ml-auto flex gap-2">
            <Button
              className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              onClick={onReset}
              variant="outline"
            >
              <RotateCcw className="size-4" />
              Đặt lại
            </Button>
            <Button className="bg-orange-500 font-bold hover:bg-orange-600" onClick={onSearch}>
              <Search className="size-4" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataSearchCard;
