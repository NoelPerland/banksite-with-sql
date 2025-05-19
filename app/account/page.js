// app/account/page.js
"use client";

import { useState, useEffect } from "react";
import Nav from "../../components/Nav"; //

export default function AccountPage() {
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          `http://localhost:3003/account/${user.id}`
        );
        const data = await response.json();
        if (response.ok) {
          setBalance(data.balance);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch account data");
      }
    };

    fetchBalance();
  }, [user]);

  const handleDeposit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3003/account/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setBalance(data.new_balance);
      setAmount("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Nav />
      <h1 className="text-4xl font-bold mb-4">Account</h1>
      {error && <p className="text-red-500">{error}</p>}
      <p className="text-xl mb-4">Balance: ${balance}</p>
      <form className="space-y-4" onSubmit={handleDeposit}>
        <div>
          <label htmlFor="amount" className="block text-lg">
            Deposit Amount
          </label>
          <input
            type="number"
            id="amount"
            className="mt-2 p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded mt-4"
        >
          Deposit
        </button>
      </form>
    </div>
  );
}
