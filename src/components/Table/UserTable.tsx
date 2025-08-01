import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import User from "@/types/User";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { toast } from "sonner";
import { useBlockUser } from "@/hooks/useBlockUser";
import { useUnblockUser } from "@/hooks/useUnblockUser";
import useDecodeToken from "@/hooks/useDecodeToken";
import { useNavigate } from "react-router-dom";

export function UserTable() {
  const defaultSearch = "";
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const columnHelper = createColumnHelper<User>();
  const [inputValue, setInputValue] = useState(defaultSearch);
  const [globalFilter, setGlobalFilter] = useState(defaultSearch);
  const { mutate: deleteUsers } = useDeleteUser();
  const { mutate: blockUsers } = useBlockUser();
  const { mutate: unblockUsers } = useUnblockUser();
  const user = useDecodeToken();
  console.log(user);
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("users").then((users) => users.data),
    enabled: true,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(inputValue);
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            className="border-white"
            onCheckedChange={(value: boolean) => {
              table.toggleAllRowsSelected(!!value);
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            className="border-white"
            onCheckedChange={(value: boolean) => {
              row.toggleSelected(!!value);
            }}
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("lastLoginAt", {
        header: "Last Login",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("isBlocked", {
        header: "Blocked",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: {
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  const selectedUsers = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div className="space-y-4 lg:px-8">
      <div className="flex gap-4 flex-col md:flex-row md:justify-between md:items-center pt-4">
        <div className="flex gap-2">
          <Button
            onClick={() => {
              const userIds = selectedUsers.map((user) => user.id);
              if (userIds.length > 0) {
                blockUsers(userIds, {
                  onSuccess: () => {
                    toast.success("Users blocked successfully!");
                    table.resetRowSelection();
                    const userExists = userIds.find((id) => id === user?.sub);
                    if (userExists) {
                      navigate("/login");
                    }
                  },
                  onError: (err) => {
                    toast.error(`Failed to block users: ${err.message}`);
                  },
                });
              }
            }}
            className="bg-zinc-800 text-white hover:bg-zinc-700"
            disabled={selectedUsers.length === 0}
          >
            Block
          </Button>
          <Button
            onClick={() => {
              const userIds = selectedUsers.map((user) => user.id);
              if (userIds.length > 0) {
                unblockUsers(userIds, {
                  onSuccess: () => {
                    table.resetRowSelection();
                    toast.success("Users unblocked successfully!");
                  },
                  onError: (err) => {
                    toast.error(`Failed to unblock users: ${err.message}`);
                  },
                });
              }
            }}
            className="bg-zinc-800 text-white hover:bg-zinc-700"
            disabled={selectedUsers.length === 0}
          >
            Unblock
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              const userIds = selectedUsers.map((user) => user.id);
              console.log("Selected users:", userIds);
              if (userIds.length > 0) {
                deleteUsers(userIds, {
                  onSuccess: () => {
                    table.resetRowSelection();
                    toast.success("Users deleted successfully!");
                  },
                  onError: (err) => {
                    toast.error(`Failed to delete users: ${err.message}`);
                  },
                });
              }
            }}
            disabled={selectedUsers.length === 0}
          >
            Delete
          </Button>
        </div>
        <div>
          <Input
            type="text"
            placeholder="Search user..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full border rounded">
          <thead className="bg-zinc-800 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 text-left border-b">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-zinc-900 text-zinc-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-800">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border-b">
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
