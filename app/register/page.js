"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav"; // Import Nav component

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send a request to the backend to create the user
    try {
      const response = await fetch("http://localhost:3003/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      // Redirect to login after successful registration
      router.push("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {" "}
      {/* Adjust padding top to account for navbar */}
      <Nav /> {/* Add Nav component */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Create Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-lg">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-2 p-2 border rounded"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 p-2 border rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded mt-4"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
