import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/features/users/userApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import dayjs from "dayjs";

export default function UserList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () => userApi.getUsers({ page, search }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-quicksand">User List</h1>
      </div>

       {/* Search */}
       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search user by name or email" 
            className="pl-9 w-full rounded-full border-gray-200 bg-gray-50/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                   <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.data?.users?.length === 0 ? (
               <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                   No users found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.users?.map((user, index) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-gray-500">{((page - 1) * 10) + index + 1}</TableCell>
                  <TableCell className="font-medium text-neutral-900">{user.name}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {user.createdAt ? dayjs(user.createdAt).format("DD MMM YYYY, HH:mm") : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination */}
       <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data?.data?.pagination?.total || 0)} of {data?.data?.pagination?.total} entries</span>
        <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => p + 1)}
              disabled={page >= (data?.data?.pagination?.totalPages || 1)}
            >
              Next
            </Button>
        </div>
      </div>
    </div>
  );
}
