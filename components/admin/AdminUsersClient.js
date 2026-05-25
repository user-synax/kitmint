"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, UserCog, RefreshCcw } from "lucide-react";

export default function AdminUsersClient() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser._id,
          kitsGeneratedThisMonth: editingUser.kitsGeneratedThisMonth,
          plan: editingUser.plan
        }),
      });

      if (!res.ok) throw new Error("Failed to update user");
      
      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#111111] border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white">Users Management</CardTitle>
            <CardDescription className="text-zinc-400">
              Total Users: {users.length}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchUsers}
            className="border-zinc-800 hover:bg-zinc-900"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-800">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">User</TableHead>
                  <TableHead className="text-zinc-400">Plan</TableHead>
                  <TableHead className="text-zinc-400 text-center">Total Credits</TableHead>
                  <TableHead className="text-zinc-400 text-center">Used</TableHead>
                  <TableHead className="text-zinc-400 text-center">Left</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} className="border-zinc-800 hover:bg-zinc-900/30">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={user.plan === 'pro' 
                          ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/5" 
                          : "border-zinc-700 text-zinc-400"}
                      >
                        {(user.plan || 'free').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-zinc-300">
                      {user.totalCredits}
                    </TableCell>
                    <TableCell className="text-center text-zinc-300">
                      {user.usedCredits}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={user.leftCredits === 0 ? "text-red-500" : "text-emerald-500"}>
                        {user.leftCredits}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingUser(user)}
                        className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
                      >
                        <UserCog className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-[#111111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit User Credits</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update {editingUser?.name}'s plan and credit usage.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Plan</label>
              <Select 
                value={editingUser?.plan} 
                onValueChange={(val) => setEditingUser({...editingUser, plan: val})}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Select Plan" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Kits Used This Month</label>
              <Input 
                type="number" 
                value={editingUser?.kitsGeneratedThisMonth} 
                onChange={(e) => setEditingUser({...editingUser, kitsGeneratedThisMonth: parseInt(e.target.value)})}
                className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500/50"
              />
              <p className="text-[10px] text-zinc-500 italic">
                Free plan limit is 3. Adjusting this will change their 'left' credits.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditingUser(null)}
              className="border-zinc-800 text-white hover:bg-zinc-900"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={isUpdating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
