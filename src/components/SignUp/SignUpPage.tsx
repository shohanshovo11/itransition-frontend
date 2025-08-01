import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passwordHash: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/users/register", formData);

      toast.success("User registered successfully.");
      console.log(response);
      localStorage.setItem("token", response.data.token);
      navigate("/users");
    } catch (error: any) {
      console.error("Registration failed:", error);

      const message = error.response?.data || "Something went wrong.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-6 p-8 bg-zinc-900 rounded-2xl shadow-2xl text-white"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Create an Account</h2>
          <p className="text-sm text-zinc-400">
            Join us by filling in your details
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-300">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            required
            maxLength={100}
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-zinc-800 text-white placeholder:text-zinc-500 border border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            maxLength={100}
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="bg-zinc-800 text-white placeholder:text-zinc-500 border border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-300">
            Password
          </Label>
          <Input
            id="password"
            name="passwordHash"
            type="password"
            required
            placeholder="••••••••"
            value={formData.passwordHash}
            onChange={handleChange}
            className="bg-zinc-800 text-white placeholder:text-zinc-500 border border-zinc-700"
          />
        </div>

        <Button type="submit" className="w-full">
          Sign Up
        </Button>

        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
