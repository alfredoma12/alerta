"use client";

import { useState, useCallback } from "react";
import type { Report } from "@/lib/types";
import { MOCK_REPORTS } from "@/lib/mock-data";

export function useReports() {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filtered = reports.filter((r) => {
    const matchCat = filter === "all" || r.category === filter;
    const matchSearch =
      search.trim() === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const vote = useCallback((id: string, direction: "up" | "down") => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.userVote === direction) {
          return { ...r, votes: r.votes + (direction === "up" ? -1 : 1), userVote: null };
        }
        const delta =
          r.userVote == null
            ? direction === "up"
              ? 1
              : -1
            : direction === "up"
            ? 2
            : -2;
        return { ...r, votes: r.votes + delta, userVote: direction };
      })
    );
  }, []);

  const addReport = useCallback((data: Omit<Report, "id" | "votes" | "userVote" | "createdAt" | "status">) => {
    setIsLoading(true);
    setTimeout(() => {
      const newReport: Report = {
        ...data,
        id: Math.random().toString(36).slice(2),
        votes: 0,
        userVote: null,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setReports((prev) => [newReport, ...prev]);
      setIsLoading(false);
    }, 800);
  }, []);

  return { reports: filtered, filter, setFilter, search, setSearch, vote, addReport, isLoading };
}
