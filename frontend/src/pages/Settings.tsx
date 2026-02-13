import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Lock, Save, Bell, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings = () => {
    const { user } = useAuth();
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        // TODO: Implement profile update API
        setTimeout(() => {
            setIsSaving(false);
            alert('Profile updated successfully!');
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
                <p className="text-gray-400 text-sm mt-1">Manage your account settings and preferences</p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <User className="w-5 h-5 text-blue-500" />
                        </div>
                        <CardTitle>Profile Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                        </label>
                        <Input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="bg-gray-800/50 border-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                type="email"
                                value={email}
                                disabled
                                className="pl-10 bg-gray-800/30 border-gray-700 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div className="pt-4">
                        <Button onClick={handleSaveProfile} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-green-500" />
                        </div>
                        <CardTitle>Security</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Change Password
                        </label>
                        <Button variant="secondary" size="sm">
                            <Lock className="w-4 h-4 mr-2" />
                            Update Password
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                            We recommend using a strong password that you don't use elsewhere
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Bell className="w-5 h-5 text-purple-500" />
                        </div>
                        <CardTitle>Notifications</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-white">Email Notifications</p>
                            <p className="text-xs text-gray-500">Receive emails when documents are sent to you</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-white">Document Completion Alerts</p>
                            <p className="text-xs text-gray-500">Get notified when all signatures are collected</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">Account Created</span>
                            <span className="text-white font-medium">
                                {(user as any)?.created_at ? new Date((user as any).created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">User ID</span>
                            <span className="text-white font-mono text-xs">{user?.id}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-400">Account Status</span>
                            <span className="text-green-500 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Active
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
