import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { setIsAdmin } = useAppStore();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (username === "admin1234@gmail.com" && password === "password") {
            setIsAdmin(true);
            toast.success("Admin Login Successful");
            navigate("/admin");
        } else {
            toast.error("Invalid Admin Credentials");
        }
    };

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-[#1b1c24] text-white">
            <div className="bg-[#2a2b33] p-10 rounded-3xl shadow-2xl flex flex-col gap-8 w-[90vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] items-center border border-[#2f303b]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
                    <p className="text-sm text-neutral-400">Please login to access</p>
                </div>
                <div className="w-full flex flex-col gap-5 text-black">
                    <Input
                        placeholder="Username"
                        type="text"
                        className="rounded-full p-6 bg-white border-none"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        className="rounded-full p-6 bg-white border-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleLogin();
                        }}
                    />
                    <Button
                        className="rounded-full p-6 mt-2 bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </div>
                <Button
                    variant="link"
                    className="text-neutral-400 hover:text-white"
                    onClick={() => navigate("/auth")}
                >
                    Back to User Login
                </Button>
            </div>
        </div>
    );
};

export default AdminLogin;
