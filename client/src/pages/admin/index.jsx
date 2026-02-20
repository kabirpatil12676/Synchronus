import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { HOST } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from "recharts";

const AdminPanel = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({ users: 0, messages: 0, channels: 0 });
    const [users, setUsers] = useState([]);
    const [channels, setChannels] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchChannels();
        fetchFeedbacks();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await apiClient.get(`${HOST}/api/admin/stats`, {
                withCredentials: true,
            });
            setStats(res.data.stats);
        } catch (e) {
            console.log(e);
            toast.error("Failed to fetch dashboard stats");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await apiClient.get(`${HOST}/api/admin/users`, {
                withCredentials: true,
            });
            setUsers(res.data.users);
        } catch (e) {
            console.log(e);
        }
    };

    const fetchChannels = async () => {
        try {
            const res = await apiClient.get(`${HOST}/api/admin/channels`, {
                withCredentials: true,
            });
            setChannels(res.data.channels);
        } catch (e) {
            console.log(e);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const res = await apiClient.get(`${HOST}/api/admin/feedbacks`, {
                withCredentials: true,
            });
            setFeedbacks(res.data.feedbacks);
        } catch (e) {
            console.log(e);
        }
    };

    const handleLogout = () => {
        navigate("/chat");
    };

    const reportData = [
        { name: "Users", count: stats.users },
        { name: "Messages", count: stats.messages },
        { name: "Groups", count: stats.channels },
    ];

    const pieData = [
        { name: "Setup Complete", value: users.filter(u => u.profileSetup).length },
        { name: "Setup Pending", value: users.filter(u => !u.profileSetup).length },
    ];
    const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981"];

    return (
        <div className="min-h-[100vh] w-full bg-[#1b1c24] text-white p-10 flex flex-col gap-8">
            <div className="flex justify-between items-center bg-[#2a2b33] p-6 rounded-2xl border border-[#2f303b]">
                <h1 className="text-3xl font-bold tracking-wider">Admin Dashboard</h1>
                <Button
                    onClick={handleLogout}
                    className="bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg px-6"
                >
                    Back to Chat
                </Button>
            </div>

            <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="bg-transparent border-b-2 border-[#2f303b] rounded-none w-full flex justify-start gap-5">
                    {["Dashboard", "Users", "Groups", "Feedbacks", "Reports"].map(
                        (tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab.toLowerCase()}
                                className="data-[state=active]:bg-transparent data-[state=active]:text-purple-500 data-[state=active]:border-b-purple-500 border-b-2 border-transparent rounded-none px-4 py-2 text-neutral-400 font-semibold transition-colors duration-300"
                            >
                                {tab}
                            </TabsTrigger>
                        )
                    )}
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="mt-8 flex gap-8">
                    <div className="bg-[#2a2b33] p-10 rounded-2xl flex-1 border border-[#2f303b] flex flex-col items-center justify-center gap-4 hover:border-purple-500 transition-colors duration-300">
                        <h2 className="text-xl text-neutral-400">Total Users</h2>
                        <p className="text-6xl font-black text-purple-500">{stats.users}</p>
                    </div>
                    <div className="bg-[#2a2b33] p-10 rounded-2xl flex-1 border border-[#2f303b] flex flex-col items-center justify-center gap-4 hover:border-blue-500 transition-colors duration-300">
                        <h2 className="text-xl text-neutral-400">Total Messages</h2>
                        <p className="text-6xl font-black text-blue-500">{stats.messages}</p>
                    </div>
                    <div className="bg-[#2a2b33] p-10 rounded-2xl flex-1 border border-[#2f303b] flex flex-col items-center justify-center gap-4 hover:border-green-500 transition-colors duration-300">
                        <h2 className="text-xl text-neutral-400">Total Groups</h2>
                        <p className="text-6xl font-black text-green-500">{stats.channels}</p>
                    </div>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="mt-8">
                    <div className="bg-[#2a2b33] p-6 rounded-2xl border border-[#2f303b]">
                        <h2 className="text-2xl font-bold mb-6">User Profiles</h2>
                        <div className="grid grid-cols-4 gap-4 text-neutral-400 font-semibold mb-4 px-4 border-b border-[#2f303b] pb-2">
                            <span>Email</span>
                            <span>First Name</span>
                            <span>Last Name</span>
                            <span>Profile Setup</span>
                        </div>
                        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {users.map((u) => (
                                <div
                                    key={u._id}
                                    className="grid grid-cols-4 gap-4 bg-[#1b1c24] p-4 rounded-lg items-center hover:bg-[#20212a] transition-colors"
                                >
                                    <span className="truncate">{u.email}</span>
                                    <span>{u.firstName || "-"}</span>
                                    <span>{u.lastName || "-"}</span>
                                    <span>
                                        {u.profileSetup ? (
                                            <span className="text-green-500 font-medium">Yes</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">No</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Groups Tab */}
                <TabsContent value="groups" className="mt-8">
                    <div className="bg-[#2a2b33] p-6 rounded-2xl border border-[#2f303b]">
                        <h2 className="text-2xl font-bold mb-6">Groups & Channels</h2>
                        <div className="grid grid-cols-3 gap-4 text-neutral-400 font-semibold mb-4 px-4 border-b border-[#2f303b] pb-2">
                            <span>Group Name</span>
                            <span>Admin</span>
                            <span>Members</span>
                        </div>
                        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {channels.map((c) => (
                                <div
                                    key={c._id}
                                    className="grid grid-cols-3 gap-4 bg-[#1b1c24] p-4 rounded-lg items-center hover:bg-[#20212a] transition-colors"
                                >
                                    <span className="font-semibold text-purple-400">{c.name}</span>
                                    <span>{c.admin ? `${c.admin.firstName} ${c.admin.lastName}` : "Unknown"}</span>
                                    <span className="text-neutral-300">{c.members?.length || 0} Members</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Feedbacks Tab */}
                <TabsContent value="feedbacks" className="mt-8">
                    <div className="bg-[#2a2b33] p-6 rounded-2xl border border-[#2f303b]">
                        <h2 className="text-2xl font-bold mb-6">User Feedbacks</h2>
                        <div className="grid grid-cols-3 gap-4 text-neutral-400 font-semibold mb-4 px-4 border-b border-[#2f303b] pb-2">
                            <span>Rating</span>
                            <span className="col-span-2">Feedback Content</span>
                        </div>
                        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {feedbacks.map((f) => (
                                <div
                                    key={f._id}
                                    className="grid grid-cols-3 gap-4 bg-[#1b1c24] p-4 rounded-lg items-center hover:bg-[#20212a] transition-colors"
                                >
                                    <span className="text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1 rounded w-max">★ {f.rating} / 5</span>
                                    <span className="col-span-2 text-neutral-300" title={f.feedback}>
                                        {f.feedback}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="mt-8">
                    <div className="bg-[#2a2b33] p-8 rounded-2xl border border-[#2f303b]">
                        <h2 className="text-3xl font-bold mb-8 text-white">System Analytics</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Bar Chart */}
                            <div className="bg-[#1b1c24] p-6 rounded-xl border border-[#2f303b]">
                                <h3 className="text-xl font-semibold mb-6 text-neutral-400">Total Counts Summary</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2f303b" vertical={false} />
                                            <XAxis dataKey="name" stroke="#a3a3a3" tickLine={false} axisLine={false} />
                                            <YAxis stroke="#a3a3a3" tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#2a2b33", borderColor: "#2f303b", borderRadius: "8px" }}
                                                itemStyle={{ color: "#fff" }}
                                                cursor={{ fill: "#2a2b33" }}
                                            />
                                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                                {reportData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Area Chart Demo */}
                            <div className="bg-[#1b1c24] p-6 rounded-xl border border-[#2f303b]">
                                <h3 className="text-xl font-semibold mb-6 text-neutral-400">Engagement Volume</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={reportData}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2f303b" vertical={false} />
                                            <XAxis dataKey="name" stroke="#a3a3a3" tickLine={false} axisLine={false} />
                                            <YAxis stroke="#a3a3a3" tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#2a2b33", borderColor: "#2f303b", borderRadius: "8px" }}
                                            />
                                            <Area type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCount)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pie Chart */}
                            <div className="bg-[#1b1c24] p-6 rounded-xl border border-[#2f303b]">
                                <h3 className="text-xl font-semibold mb-6 text-neutral-400">Profile Completion Rate</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#2a2b33", borderColor: "#2f303b", borderRadius: "8px" }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminPanel;
