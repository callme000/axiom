"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Deployment = {
  id: string;
  title: string;
  amount: number;
  created_at: string;
};

export default function Dashboard() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("deployments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setDeployments(data || []);
    }

    fetchData();
  }, []);

  async function addDeployment() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not authenticated");
      return;
    }

    const { error } = await supabase.from("deployments").insert({
      title,
      amount: Number(amount),
      user_id: user.id,
    });

    if (error) {
      console.error(error);
      return;
    }

    // Refresh deployments after insert
    const { data } = await supabase
      .from("deployments")
      .select("*")
      .order("created_at", { ascending: false });

    setDeployments(data || []);

    // Clear form
    setTitle("");
    setAmount("");
  }

  return (
    <main className="min-h-screen p-6 bg-white text-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Axiom Dashboard</h1>

        {/* Add Deployment Form */}
        <div className="border rounded-2xl p-4 mb-8 space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold">Add Deployment</h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={addDeployment}
            className="bg-black text-white px-4 py-3 rounded-lg hover:opacity-90 transition"
          >
            Add Deployment
          </button>
        </div>

        {/* Deployment List */}
        <div className="space-y-4">
          {deployments.length === 0 ? (
            <p className="text-gray-500">No deployments yet.</p>
          ) : (
            deployments.map((deployment) => (
              <div
                key={deployment.id}
                className="border rounded-2xl p-4 shadow-sm"
              >
                <h3 className="font-semibold text-lg">{deployment.title}</h3>

                <p className="text-gray-700">KSh {deployment.amount}</p>

                <p className="text-sm text-gray-400 mt-1">
                  {new Date(deployment.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
