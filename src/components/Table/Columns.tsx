import { ColumnDef } from "@tanstack/react-table";
import { User } from "./types";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.getValue("id").toString().slice(0, 8),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last Login",
    cell: ({ row }) => new Date(row.getValue("lastLoginAt")).toLocaleString(),
  },
  {
    accessorKey: "isBlocked",
    header: "Blocked",
    cell: ({ row }) => (row.getValue("isBlocked") ? "Yes" : "No"),
  },
  {
    accessorKey: "isDeleted",
    header: "Deleted",
    cell: ({ row }) => (row.getValue("isDeleted") ? "Yes" : "No"),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => alert(`Edit ${row.original.id}`)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => alert(`Delete ${row.original.id}`)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];
