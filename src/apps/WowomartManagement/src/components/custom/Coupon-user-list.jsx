import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SquarePen, NotebookText, Trash2 } from "lucide-react";
// import image from "@/constants/image";
import toast from "react-hot-toast";
import image from "../../constants/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const columns = (handleOpenDialog) => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "email",
    header: "email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "code",
    header: "Coupon Code",
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "tag",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="default"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          style={{
            backgroundColor: "white",
            color: "#004368",
            outline: "none",
          }}
        >
          Tag Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className=" text-center">{row.getValue("tag")}</div>
    ),
  },
  {
    accessorKey: "percentage",
    header: () => <div className="text-right">Percentage</div>,
    cell: ({ row }) => {
      const percentage = row.getValue("percentage");
      return <div className="text-right font-medium">{percentage} %</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.getValue("id");
      const customerId = row.original.customerId;
      const tag = row.original.tag;

      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="h-8 w-8 p-0"
                style={{ backgroundColor: "white", outline: "none" }}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="text-black" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem onSelect={() => handleOpenDialog(id, "update")}>
                <div className="flex items-center justify-items-start pl-4 w-full text-[#004368] ">
                  <SquarePen className=" mr-2 h-4 w-4 " />
                  <span className="  font-medium">Edit</span>
                </div>
              </DropdownMenuItem> */}

              <DropdownMenuItem
                onSelect={() => handleOpenDialog(id, customerId, tag, "view")}
              >
                <div className="flex items-center justify-center w-full text-[#004368]">
                  <NotebookText className="mr-2 h-4 w-4 " />
                  <span className="  font-medium ">Details</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => handleOpenDialog(id, customerId, tag, "delete")}
              >
                <div className="flex items-center justify-center w-full text-[#004368]">
                  <Trash2 className="mr-2 h-4 w-4 " />
                  <span className="  font-medium">Delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function CouponUserList() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [couponUser, setCouponUser] = useState({
    customerId: "",
    customerTag: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/allCouponUserList"
        );
        const result = response.data.result || [];

        setApiData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setApiData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenDialog = (id, customerId, customerTag, type) => {
    setSelectedId(id);
    setDialogType(type);
    setCouponUser({
      customerId: customerId,
      customerTag: customerTag,
    });
    if (type === "view") {
      navigate("/coupon-user-details", { state: { id } });
    } else {
      setDialogOpen(true);
    }
  };

  const handleAction = () => {
    console.log("call");

    switch (dialogType) {
      case "update":
        setDialogOpen(false);
        setTimeout(
          () => navigate("/update-seller", { state: { id: selectedId } }),
          0
        );
        break;
      case "delete":
        axios
          .post(
            "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/deleteAndUpdate",
            {
              id: selectedId,
              customerId: couponUser.customerId,
              tag: couponUser.customerTag,
            }
          )
          .then(() => {
            setDialogOpen(false);
            setApiData((prevData) =>
              prevData.filter((item) => item.id !== selectedId)
            );
            toast.success("Coupon user deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting seller:", error);
            setDialogOpen(false);
            toast.error("Failed to delete coupon user");
          });
        break;
      default:
        break;
    }
  };

  const table = useReactTable({
    data: apiData,
    columns: columns(handleOpenDialog),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full shadow-sm p-4 bg-white rounded-md">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={table.getColumn("tag")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("tag")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="ml-auto"
              style={{ backgroundColor: "white", color: "#004368" }}
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns(handleOpenDialog).length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{ backgroundColor: "white", color: "#004368" }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{ backgroundColor: "white", color: "#004368" }}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="flex flex-col items-center rounded-lg bg-white p-6 max-w-md mx-auto border-none">
          <AlertDialogHeader className="flex flex-col items-center mb-4">
            <AlertDialogTitle className="flex flex-col items-center text-xl font-semibold text-gray-900">
              <div className="w-10 h-10 bg-[#F8D7DA] rounded-full flex items-center justify-center mb-2">
                <img src={image.alert} alt="Alert Icon" className="w-10" />
              </div>
              {dialogType === "view" && "View coupon user"}
              {dialogType === "update" && "Edit coupon user"}
              {dialogType === "delete" && "Delete coupon user"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 text-center">
              {dialogType === "view" &&
                "Are you sure want to view this coupon user?"}
              {dialogType === "update" &&
                "Are you sure want to update this coupon user?"}
              {dialogType === "delete" &&
                "Are you sure want to delete this coupon user?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 ">
            <AlertDialogCancel
              className="px-4 py-2  text-[#004368] rounded-lg  transition-colors ring-0  focus:outline-none focus:ring-0 border-none "
              style={{
                backgroundColor: "#D6E6F0",
                outline: "none",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className="px-4 py-2  text-[#DC3545] rounded-lg  transition-colors"
              style={{
                backgroundColor: "#FFDEDE",
                color: "#DC3545",
              }}
            >
              {dialogType === "delete" ? "Delete" : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
