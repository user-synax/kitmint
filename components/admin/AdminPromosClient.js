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
import { Loader2, Plus, Trash2, Calendar, Ticket } from "lucide-react";

export default function AdminPromosClient() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: "",
    tier: "monthly",
    usageLimit: 1,
    expiresAt: "",
    discountType: "full_access",
    discountValue: 100
  });

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promos");
      if (!res.ok) throw new Error("Failed to fetch promos");
      const data = await res.json();
      setPromos(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    if (!newPromo.code || !newPromo.expiresAt) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromo),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create promo");
      }
      
      toast.success("Promo code created successfully");
      setShowAddDialog(false);
      setNewPromo({
        code: "",
        tier: "monthly",
        usageLimit: 1,
        expiresAt: "",
        discountType: "full_access",
        discountValue: 100
      });
      fetchPromos();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePromo = async (id) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;
    
    try {
      const res = await fetch("/api/admin/promos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete promo");
      
      toast.success("Promo code deleted");
      fetchPromos();
    } catch (error) {
      toast.error(error.message);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-emerald-500" />
            Promo Codes
          </h2>
          <p className="text-zinc-400 text-sm">Manage subscription promo codes and discounts.</p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Code
        </Button>
      </div>

      <Card className="bg-[#111111] border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Code</TableHead>
                <TableHead className="text-zinc-400">Tier</TableHead>
                <TableHead className="text-zinc-400 text-center">Usage</TableHead>
                <TableHead className="text-zinc-400">Expires</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-zinc-500 italic">
                    No promo codes found. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                promos.map((promo) => (
                  <TableRow key={promo._id} className="border-zinc-800 hover:bg-zinc-900/30">
                    <TableCell>
                      <code className="bg-zinc-800 px-2 py-1 rounded text-emerald-400 font-bold font-mono">
                        {promo.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize border-zinc-700 text-zinc-300">
                        {promo.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-zinc-300">
                      {promo.usedCount} / {promo.usageLimit}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(promo.expiresAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(promo.expiresAt) < new Date() ? (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Expired</Badge>
                      ) : promo.isActive ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>
                      ) : (
                        <Badge className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeletePromo(promo._id)}
                        className="hover:bg-red-500/10 text-zinc-500 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Promo Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#111111] border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Create Promo Code</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Generate a new code to unlock Pro features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Code (e.g. SUMMER50)</label>
              <Input 
                placeholder="PROMOCODE"
                value={newPromo.code} 
                onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500/50 uppercase font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Subscription Tier</label>
                <Select 
                  value={newPromo.tier} 
                  onValueChange={(val) => setNewPromo({...newPromo, tier: val})}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Usage Limit</label>
                <Input 
                  type="number"
                  min="1"
                  value={newPromo.usageLimit} 
                  onChange={(e) => setNewPromo({...newPromo, usageLimit: parseInt(e.target.value)})}
                  className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Expiration Date</label>
              <Input 
                type="date"
                value={newPromo.expiresAt} 
                onChange={(e) => setNewPromo({...newPromo, expiresAt: e.target.value})}
                className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
              className="border-zinc-800 text-white hover:bg-zinc-900"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePromo}
              disabled={isCreating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Promo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
