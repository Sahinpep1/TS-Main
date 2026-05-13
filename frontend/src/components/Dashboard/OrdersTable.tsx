/**
 * OrdersTable — TanStack Table with inline assign / unassign actions.
 */
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import type { Coordinate, Truck } from "../../types";
import "./Dashboard.css";

interface OrdersTableProps {
  coordinates: Coordinate[];
  trucks: Truck[];
  onAssign: (coordId: number, truckId: number) => Promise<unknown>;
  onUnassign: (coordId: number) => Promise<unknown>;
}

const STATUS_COLOR: Record<string, string> = {
  pending:  "#f59e0b",
  assigned: "#6366f1",
  delivered: "#22c55e",
};

const col = createColumnHelper<Coordinate>();

export function OrdersTable({ coordinates, trucks, onAssign, onUnassign }: OrdersTableProps) {
  const [sorting, setSorting]             = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter]   = useState("");
  const [assigningId, setAssigningId]     = useState<number | null>(null);
  const [loadingId, setLoadingId]         = useState<number | null>(null);

  const doAssign = async (coordId: number, truckId: number) => {
    setLoadingId(coordId);
    await onAssign(coordId, truckId);
    setAssigningId(null);
    setLoadingId(null);
  };

  const doUnassign = async (coordId: number) => {
    setLoadingId(coordId);
    await onUnassign(coordId);
    setLoadingId(null);
  };

  const columns = useMemo(() => [
    col.accessor("id", {
      header: "ID",
      size: 60,
      cell: (i) => <span className="cell-mono">#{i.getValue()}</span>,
    }),
    col.accessor("name", {
      header: "Customer",
      cell: (i) => <span className="cell-bold">{i.getValue()}</span>,
    }),
    col.accessor("sales_rep", {
      header: "Sales Rep",
      cell: (i) => <span className="badge badge--indigo">{i.getValue()}</span>,
    }),
    col.accessor("status", {
      header: "Status",
      cell: (i) => {
        const s = i.getValue();
        return (
          <span className="badge" style={{ background: `${STATUS_COLOR[s]}22`, color: STATUS_COLOR[s] }}>
            {s}
          </span>
        );
      },
    }),
    col.accessor("assigned_truck_id", {
      header: "Truck",
      cell: (i) => {
        const id = i.getValue();
        if (!id) return <span className="cell-muted">—</span>;
        const t = trucks.find((x) => x.id === id);
        return t ? (
          <span className="cell-truck">
            <span className="truck-dot" style={{ background: t.color }} />
            {t.Plaka}
          </span>
        ) : `#${id}`;
      },
    }),
    col.accessor("Miktar", {
      header: "Miktar",
      cell: (i) => i.getValue().toLocaleString(),
    }),
    col.accessor("Palet", {
      header: "Palet",
      cell: (i) => `${i.getValue()} plt`,
    }),
    col.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const c = row.original;
        if (loadingId === c.id) return <span className="cell-muted">…</span>;

        if (assigningId === c.id) {
          return (
            <span className="action-assign-row">
              <select
                autoFocus
                className="assign-select"
                defaultValue=""
                onChange={(e) => e.target.value && doAssign(c.id, Number(e.target.value))}
              >
                <option value="" disabled>Select truck…</option>
                {trucks.map((t) => (
                  <option key={t.id} value={t.id}>{t.Plaka} – {t.Driver}</option>
                ))}
              </select>
              <button className="btn-cancel" onClick={() => setAssigningId(null)}>✕</button>
            </span>
          );
        }

        return (
          <span className="action-assign-row">
            {c.assigned_truck_id && (
              <button className="btn-unassign" onClick={() => doUnassign(c.id)}>Unassign</button>
            )}
            <button className="btn-assign" onClick={() => setAssigningId(c.id)}>
              {c.assigned_truck_id ? "Reassign" : "Assign"}
            </button>
          </span>
        );
      },
    }),
  ], [trucks, assigningId, loadingId]);

  const table = useReactTable({
    data: coordinates,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  const uniqueReps = useMemo(
    () => [...new Set(coordinates.map((c) => c.sales_rep))].sort(),
    [coordinates]
  );

  const setStatusFilter = (v: string) =>
    setColumnFilters((prev) =>
      v ? [...prev.filter((f) => f.id !== "status"), { id: "status", value: v }]
        : prev.filter((f) => f.id !== "status")
    );

  const setRepFilter = (v: string) =>
    setColumnFilters((prev) =>
      v ? [...prev.filter((f) => f.id !== "sales_rep"), { id: "sales_rep", value: v }]
        : prev.filter((f) => f.id !== "sales_rep")
    );

  return (
    <div className="orders-table-container">
      {/* Toolbar */}
      <div className="orders-toolbar">
        <div className="orders-search-wrap">
          <Search size={14} className="orders-search-icon" />
          <input
            id="orders-search"
            className="orders-search"
            placeholder="Search orders…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <select id="filter-status" className="orders-filter-select" onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="delivered">Delivered</option>
        </select>
        <select id="filter-sales-rep" className="orders-filter-select" onChange={(e) => setRepFilter(e.target.value)}>
          <option value="">All Sales Reps</option>
          {uniqueReps.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <span className="orders-count">{table.getFilteredRowModel().rows.length} orders</span>
      </div>

      {/* Table */}
      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()} style={{ cursor: h.column.getCanSort() ? "pointer" : "default" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {{ asc: <ChevronUp size={12} />, desc: <ChevronDown size={12} /> }[h.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="orders-row">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="orders-pagination">
        <button className="pg-btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>← Prev</button>
        <span className="pg-info">Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
        <button className="pg-btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next →</button>
      </div>
    </div>
  );
}
