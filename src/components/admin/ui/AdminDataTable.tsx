"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Inbox,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

export interface StatusFilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string;

  // Search
  searchable?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;

  // Status Filter
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  statusOptions?: StatusFilterOption[];

  // Actions
  actionsSlot?: React.ReactNode;

  // Pagination
  paginated?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;

  // States
  isLoading?: boolean;
  emptyState?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    actionButton?: React.ReactNode;
  };

  // Interactions
  onRowClick?: (row: T) => void;
  className?: string;
}

export function AdminDataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  searchable = true,
  searchQuery: controlledSearch,
  onSearchChange,
  searchPlaceholder = "Search records...",
  searchFilter,
  statusFilter: controlledStatus,
  onStatusFilterChange,
  statusOptions,
  actionsSlot,
  paginated = true,
  currentPage: controlledPage,
  pageSize = 10,
  totalItems: controlledTotal,
  onPageChange,
  isLoading = false,
  emptyState,
  onRowClick,
  className,
}: AdminDataTableProps<T>) {
  // Internal state when uncontrolled
  const [internalSearch, setInternalSearch] = useState("");
  const [internalStatus, setInternalStatus] = useState("all");
  const [internalPage, setInternalPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(
    null
  );

  const search = controlledSearch !== undefined ? controlledSearch : internalSearch;
  const status = controlledStatus !== undefined ? controlledStatus : internalStatus;
  const page = controlledPage !== undefined ? controlledPage : internalPage;

  const handleSearchChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalSearch(val);
    }
    if (onPageChange) {
      onPageChange(1);
    } else {
      setInternalPage(1);
    }
  };

  const handleStatusChange = (val: string) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(val);
    } else {
      setInternalStatus(val);
    }
    if (onPageChange) {
      onPageChange(1);
    } else {
      setInternalPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  // Filter and sort client-side if data is passed directly and no external handlers
  const filteredData = useMemo(() => {
    let result = [...data];

    // Status filter
    if (status && status !== "all") {
      result = result.filter((item) => {
        const itemStatus = item.status || item.stage || item.role;
        return itemStatus?.toLowerCase() === status.toLowerCase();
      });
    }

    // Search filter
    if (search.trim()) {
      if (searchFilter) {
        result = result.filter((item) => searchFilter(item, search.trim()));
      } else {
        const q = search.toLowerCase();
        result = result.filter((item) => {
          return Object.values(item).some((val) => {
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(q);
          });
        });
      }
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, status, searchFilter, sortConfig]);

  // Pagination calculation
  const isServerPaginated = controlledTotal !== undefined;
  const totalCount = isServerPaginated ? controlledTotal : filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const displayData = useMemo(() => {
    if (!paginated || isServerPaginated) {
      return filteredData;
    }
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, paginated, isServerPaginated, page, pageSize]);

  const startRecord = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalCount);

  const toggleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-[#E5E5E2] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col",
        className
      )}
    >
      {/* Table Toolbar: Search, Filters & Action Button Slot */}
      {(searchable || statusOptions || actionsSlot) && (
        <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-[#E5E5E2] bg-white">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 min-w-0">
            {/* Search Input */}
            {searchable && (
              <div className="relative min-w-[220px] max-w-sm flex-1">
                <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl text-[#111111] placeholder:text-[#858585] focus:outline-none focus:ring-2 focus:ring-[#1400FF]/40 focus:border-[#1400FF] transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#858585] hover:text-[#111111] p-0.5 rounded-full"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Status Filter Pills */}
            {statusOptions && statusOptions.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {statusOptions.map((opt) => {
                  const isActive = (status || "all") === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleStatusChange(opt.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-medium transition-colors shrink-0 whitespace-nowrap border",
                        isActive
                          ? "bg-[rgba(20,0,255,0.08)] text-[#1400FF] border-[#1400FF]/30 font-semibold shadow-xs"
                          : "bg-white text-[#555555] border-[#E5E5E2] hover:bg-[#F0F0ED] hover:text-[#111111]"
                      )}
                    >
                      {opt.label}
                      {opt.count !== undefined && (
                        <span
                          className={cn(
                            "ml-1.5 px-1.5 py-0.2 rounded-full text-[10px]",
                            isActive ? "bg-[#1400FF] text-white" : "bg-[#F0F0ED] text-[#858585]"
                          )}
                        >
                          {opt.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Action slot (e.g. '+ Create Record') */}
          {actionsSlot && <div className="shrink-0 flex items-center gap-2">{actionsSlot}</div>}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F7F5] border-b border-[#E5E5E2] font-mono text-[11px] uppercase tracking-wider text-[#858585]">
              {columns.map((col) => {
                const isSortable = col.sortable;
                const isCurrentSort = sortConfig?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "py-3 px-4 font-semibold whitespace-nowrap select-none",
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left",
                      isSortable && "cursor-pointer hover:text-[#111111] group",
                      col.headerClassName
                    )}
                    onClick={() => isSortable && toggleSort(col.key)}
                  >
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        col.align === "right" && "justify-end",
                        col.align === "center" && "justify-center"
                      )}
                    >
                      <span>{col.header}</span>
                      {isSortable && (
                        <ArrowUpDown
                          className={cn(
                            "w-3 h-3 transition-colors",
                            isCurrentSort
                              ? "text-[#1400FF]"
                              : "text-[#858585]/60 group-hover:text-[#111111]"
                          )}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E5E5E2]/70 text-sm text-[#111111]">
            {/* Loading Skeleton */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <div className="h-4 bg-[#F0F0ED] rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : displayData.length > 0 ? (
              displayData.map((row, index) => {
                const rowKey = keyExtractor ? keyExtractor(row, index) : row.id || index;
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={cn(
                      "group hover:bg-[#F7F7F5]/80 transition-colors",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "py-3.5 px-4 text-sm align-middle",
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left",
                          col.className
                        )}
                      >
                        {col.render ? col.render(row, index) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              /* Empty State */
              <tr>
                <td colSpan={columns.length} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-center text-[#858585]">
                      {emptyState?.icon || <Inbox className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#111111]">
                        {emptyState?.title || "No records found"}
                      </h4>
                      <p className="text-xs text-[#555555] mt-1">
                        {emptyState?.description ||
                          (search
                            ? `No records matching "${search}". Try adjusting your filters.`
                            : "There are currently no records available in this view.")}
                      </p>
                    </div>
                    {emptyState?.actionButton}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {paginated && !isLoading && totalCount > 0 && (
        <div className="p-4 sm:px-5 sm:py-3.5 bg-white border-t border-[#E5E5E2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555555]">
          <div className="font-mono">
            Showing <span className="font-semibold text-[#111111]">{startRecord}</span> to{" "}
            <span className="font-semibold text-[#111111]">{endRecord}</span> of{" "}
            <span className="font-semibold text-[#111111]">{totalCount}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="p-1.5 rounded-lg border border-[#E5E5E2] bg-white text-[#111111] hover:bg-[#F7F7F5] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2.5 py-1 text-xs font-mono font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="p-1.5 rounded-lg border border-[#E5E5E2] bg-white text-[#111111] hover:bg-[#F7F7F5] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
