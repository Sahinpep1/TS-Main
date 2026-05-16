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
  type RowSelectionState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import type { Coordinate, Truck } from "../../types";
import { MultiSelect } from "../ui/MultiSelect";
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
  const [loadingIds, setLoadingIds]       = useState<number[]>([]);
  const [rowSelection, setRowSelection]   = useState<RowSelectionState>({});
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [selectedReps, setSelectedReps] = useState<Set<string>>(new Set());
  const [selectedTrucks, setSelectedTrucks] = useState<Set<string>>(new Set());

  const doAssign = async (coordId: number, truckId: number, isAssigned: boolean) => {
    setLoadingIds((prev) => [...prev, coordId]);
    if (isAssigned) {
      await onUnassign(coordId);
    }
    await onAssign(coordId, truckId);
    setAssigningId(null);
    setLoadingIds((prev) => prev.filter((id) => id !== coordId));
  };

  const doUnassign = async (coordId: number) => {
    setLoadingIds((prev) => [...prev, coordId]);
    await onUnassign(coordId);
    setLoadingIds((prev) => prev.filter((id) => id !== coordId));
  };

  const columns = useMemo(() => [
    col.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Select row"
        />
      ),
    }),
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
      filterFn: (row, columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      cell: (i) => <span className="badge badge--indigo">{i.getValue()}</span>,
    }),
    col.accessor("status", {
      header: "Status",
      filterFn: (row, columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true;
        return filterValue.includes(row.getValue(columnId));
      },
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
      filterFn: (row, columnId, filterValue: (number | null)[]) => {
        if (!filterValue?.length) return true;
        return filterValue.includes(row.getValue(columnId));
      },
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
        const isAnyLoading = loadingIds.length > 0;
        
        if (loadingIds.includes(c.id)) return <span className="cell-muted">…</span>;

        if (c.status === "delivered") {
          return <span className="cell-muted">Delivered</span>;
        }

        if (assigningId === c.id) {
          return (
            <span className="action-assign-row">
              <select
                autoFocus
                className="assign-select"
                defaultValue=""
                disabled={isAnyLoading}
                onChange={(e) => e.target.value && doAssign(c.id, Number(e.target.value), !!c.assigned_truck_id)}
              >
                <option value="" disabled>Select truck…</option>
                {trucks.map((t) => (
                  <option key={t.id} value={t.id}>{t.Plaka} – {t.Driver}</option>
                ))}
              </select>
              <button className="btn-cancel" disabled={isAnyLoading} onClick={() => setAssigningId(null)}>✕</button>
            </span>
          );
        }

        return (
          <span className="action-assign-row">
            {c.assigned_truck_id && (
              <button className="btn-unassign" disabled={isAnyLoading} onClick={() => doUnassign(c.id)}>Unassign</button>
            )}
            <button className="btn-assign" disabled={isAnyLoading} onClick={() => setAssigningId(c.id)}>
              {c.assigned_truck_id ? "Reassign" : "Assign"}
            </button>
          </span>
        );
      },
    }),
  ], [trucks, assigningId, loadingIds]);

  const table = useReactTable({
    data: coordinates,
    columns,
    state: { sorting, columnFilters, globalFilter, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  const doBulkAssign = async (truckId: number) => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (!selectedRows.length) return;
    
    const coords = selectedRows.map((r) => r.original);
    setLoadingIds((prev) => [...prev, ...coords.map(c => c.id)]);
    
    for (const c of coords) {
      if (c.assigned_truck_id) {
        await onUnassign(c.id);
      }
      await onAssign(c.id, truckId);
    }
    
    setLoadingIds((prev) => prev.filter((id) => !coords.some(c => c.id === id)));
    setRowSelection({});
  };

  const doBulkUnassign = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (!selectedRows.length) return;
    
    const ids = selectedRows.map((r) => r.original.id);
    setLoadingIds((prev) => [...prev, ...ids]);
    
    for (const id of ids) {
      await onUnassign(id);
    }
    
    setLoadingIds((prev) => prev.filter((id) => !ids.includes(id)));
    setRowSelection({});
  };

  const uniqueReps = useMemo(
    () => [...new Set(coordinates.map((c) => c.sales_rep))].sort(),
    [coordinates]
  );

  const statusOptions = [
    { value: "pending", label: "Pending", color: STATUS_COLOR["pending"] },
    { value: "assigned", label: "Assigned", color: STATUS_COLOR["assigned"] },
    { value: "delivered", label: "Delivered", color: STATUS_COLOR["delivered"] },
  ];

  const repOptions = uniqueReps.map(r => ({ value: r, label: r }));

  const truckOptions = [
    { value: "null", label: "Unassigned" },
    ...trucks.map(t => ({ value: String(t.id), label: `${t.Plaka} - ${t.Driver}`, color: t.color }))
  ];

  const handleStatusChange = (next: Set<string>) => {
    setSelectedStatuses(next);
    setColumnFilters(prev => {
      const cleaned = prev.filter(f => f.id !== "status");
      if (next.size === 0) return cleaned;
      return [...cleaned, { id: "status", value: Array.from(next) }];
    });
  };

  const handleRepChange = (next: Set<string>) => {
    setSelectedReps(next);
    setColumnFilters(prev => {
      const cleaned = prev.filter(f => f.id !== "sales_rep");
      if (next.size === 0) return cleaned;
      return [...cleaned, { id: "sales_rep", value: Array.from(next) }];
    });
  };

  const handleTruckChange = (next: Set<string>) => {
    setSelectedTrucks(next);
    setColumnFilters(prev => {
      const cleaned = prev.filter(f => f.id !== "assigned_truck_id");
      if (next.size === 0) return cleaned;
      return [...cleaned, { id: "assigned_truck_id", value: Array.from(next).map(v => v === "null" ? null : Number(v)) }];
    });
  };

  return (
    <div className="orders-table-container">
      {/* Toolbar */}
      <div className="orders-toolbar" style={{ flexWrap: "wrap", gap: "10px" }}>
        {Object.keys(rowSelection).length > 0 && (
          <div className="orders-bulk-actions" style={{ display: "flex", gap: "8px", alignItems: "center", marginRight: "auto", background: "#e0e7ff", padding: "4px 8px", borderRadius: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#4338ca" }}>
              {Object.keys(rowSelection).length} selected
            </span>
            <select
              className="assign-select"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) doBulkAssign(Number(e.target.value));
              }}
              style={{ padding: "4px 8px", fontSize: "13px", height: "auto" }}
            >
              <option value="" disabled>Bulk Assign to…</option>
              {trucks.map((t) => (
                <option key={t.id} value={t.id}>{t.Plaka}</option>
              ))}
            </select>
            <button 
              className="btn-unassign" 
              onClick={doBulkUnassign}
              style={{ padding: "4px 8px", fontSize: "13px", height: "auto" }}
            >
              Bulk Unassign
            </button>
          </div>
        )}
        <div className="orders-search-wrap" style={{ marginLeft: Object.keys(rowSelection).length > 0 ? "0" : "auto" }}>
          <Search size={14} className="orders-search-icon" />
          <input
            id="orders-search"
            className="orders-search"
            placeholder="Search orders…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div style={{ width: "160px" }}>
          <MultiSelect
            label="Status"
            options={statusOptions}
            selected={selectedStatuses}
            onChange={handleStatusChange}
          />
        </div>
        <div style={{ width: "160px" }}>
          <MultiSelect
            label="Sales Rep"
            options={repOptions}
            selected={selectedReps}
            onChange={handleRepChange}
          />
        </div>
        <div style={{ width: "200px" }}>
          <MultiSelect
            label="Truck"
            options={truckOptions}
            selected={selectedTrucks}
            onChange={handleTruckChange}
          />
        </div>
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
