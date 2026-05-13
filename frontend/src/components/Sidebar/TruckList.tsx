import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { Truck as TruckIcon, Search, ChevronUp, ChevronDown } from "lucide-react";
import type { Truck } from "../../types";
import "./Sidebar.css";

interface TruckListProps {
  trucks: Truck[];
  selectedTruckId: number | null;
  onSelectTruck: (truckId: number) => void;
}

const columnHelper = createColumnHelper<Truck>();

export default function TruckList({ trucks, selectedTruckId, onSelectTruck }: TruckListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return trucks.filter(t =>
      t.Plaka.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.Driver.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [trucks, searchQuery]);

  const columns = useMemo(() => [
    columnHelper.accessor("Plaka", {
      header: "Plaka",
      cell: (info) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: info.row.original.color
          }} />
          <span style={{ fontWeight: 'bold' }}>{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("Miktar", {
      header: "Miktar",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("Palet", {
      header: "Palet",
      cell: (info) => {
        const percent = Math.round((info.getValue() / info.row.original.Capacity) * 100);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>{info.getValue()} plt</span>
            <div style={{ width: '40px', height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}>
              <div style={{
                width: `${Math.min(percent, 100)}%`,
                height: '100%',
                backgroundColor: percent > 90 ? '#ef4444' : '#22c55e',
                borderRadius: '2px'
              }} />
            </div>
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="sidebar__truck-list-container">
      <div className="sidebar__section-header">
        <h2 className="sidebar__section-title">
          <TruckIcon size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Fleet ({filteredData.length})
        </h2>
      </div>

      <div className="sidebar__search-wrapper">
        <Search size={16} className="search-icon" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search trucks..."
          className="sidebar__search-input"
        />
      </div>

      <div className="sidebar__table-container">
        <table className="tanstack-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ChevronUp size={14} />,
                        desc: <ChevronDown size={14} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                onClick={() => onSelectTruck(row.original.id)}
                className={selectedTruckId === row.original.id ? 'selected' : ''}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
