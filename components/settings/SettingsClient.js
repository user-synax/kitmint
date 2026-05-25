'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, CreditCard, CheckCircle2, Calendar, Save, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SettingsClient({ user }) {
  const { update } = useSession();
  const [name, setName] = useState(user.name || '');
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (name.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    setIsUpdatingName(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await update({ name });
        toast.success('Name updated successfully');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPassword: passwords.current, 
          newPassword: passwords.new 
        }),
      });
      if (res.ok) {
        setPasswords({ current: '', new: '' });
        toast.success('Password updated successfully');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your account and subscription</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full sm:w-auto bg-[#111111] border border-[#111827] p-1 flex">
          <TabsTrigger value="account" className="flex-1 sm:flex-none data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-primary-text">
            <User className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex-1 sm:flex-none data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-primary-text">
            <CreditCard className="w-4 h-4 mr-2" />
            Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6 mt-6">
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-text-primary">Profile Information</CardTitle>
              <CardDescription className="text-text-secondary">Update your display name and email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdateName} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Full Name</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="bg-surface-3 border-border focus:border-primary/50 h-11"
                      disabled={isUpdatingName}
                    />
                    <Button 
                      type="submit" 
                      disabled={isUpdatingName || name === user.name} 
                      className="bg-primary hover:bg-primary-hover text-white h-11 font-bold touch-target-mobile"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Email Address</label>
                <Input 
                  value={user.email} 
                  disabled 
                  className="bg-surface-2 border-border opacity-50 cursor-not-allowed h-11"
                />
                <p className="text-[10px] text-text-muted">Email cannot be changed</p>
              </div>
            </CardContent>
          </Card>

          {user.password && (
            <Card className="bg-[#111111] border-border">
              <CardHeader>
                <CardTitle className="text-text-primary">Security</CardTitle>
                <CardDescription className="text-text-secondary">Change your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Current Password</label>
                      <Input 
                        type="password" 
                        value={passwords.current} 
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        className="bg-surface-3 border-border focus:border-primary/50 h-11"
                        disabled={isUpdatingPassword}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">New Password</label>
                      <Input 
                        type="password" 
                        value={passwords.new} 
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        className="bg-surface-3 border-border focus:border-primary/50 h-11"
                        disabled={isUpdatingPassword}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isUpdatingPassword || !passwords.current || !passwords.new} 
                    className="w-full sm:w-auto bg-surface-2 border-border text-text-primary hover:bg-surface-3 h-11 font-bold touch-target-mobile mt-4"
                  >
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plan" className="space-y-6 mt-6">
          <Card className="bg-[#111111] border-border overflow-hidden">
            <div className="bg-primary/5 border-b border-primary/10 p-5 sm:p-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-primary-text uppercase tracking-widest mb-1">Current Plan</p>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary capitalize">{user.plan}</h3>
              </div>
              <Badge className="bg-primary text-white px-3 py-1">
                {user.plan === 'free' ? 'Active' : 'Premium'}
              </Badge>
            </div>
            <CardContent className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Usage this month</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-text-primary">{user.kitsGeneratedThisMonth || 0}</span>
                    <span className="text-text-muted">/ {user.plan === 'free' ? '3' : 'Unlimited'} kits</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted mt-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Resets on {new Date(user.monthResetDate).toLocaleDateString()}
                  </div>
                </div>

                {user.plan === 'free' && (
                  <div className="bg-surface-2 border border-border rounded-xl p-5 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3">
                      <Badge className="bg-primary/20 text-primary-text border-none text-[10px]">UPGRADE</Badge>
                    </div>
                    <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Pro Benefits
                    </h4>
                    <ul className="text-xs text-text-secondary space-y-2.5">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        Unlimited brand kits
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        Premium AI models & logic
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        Block-level kit refreshing
                      </li>
                    </ul>
                    <Button className="mt-5 w-full bg-primary hover:bg-primary-hover text-white font-bold h-10 touch-target-mobile">
                      Coming Soon
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
