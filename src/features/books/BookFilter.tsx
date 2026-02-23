import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSearchQuery, setCategory } from "@/store/uiSlice"

// Categories could be dynamic, but hardcoding provided/common ones for now or could be a prop
const CATEGORIES = ["Fiction", "Non-Fiction", "Science", "History", "Technology", "Romance", "Mystery"]

export function BookFilter() {
  const dispatch = useAppDispatch()
  const { searchQuery, selectedCategory } = useAppSelector((state) => state.ui)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>
      <div className="w-full sm:w-[180px]">
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => dispatch(setCategory(value === "all" ? null : value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
