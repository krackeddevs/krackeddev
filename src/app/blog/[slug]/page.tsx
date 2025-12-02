import BlogPostClient from './BlogPostClient';
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp, ArrowDown, BookOpen, Code2, Rocket, FileText, MessageSquare, Send } from "lucide-react";
import { posts, type BlogSection } from "../posts";
import { cn } from "@/lib/utils";

const sectionLabels: Record<BlogSection, { label: string; icon: React.ElementType }> = {
  all: { label: "All", icon: FileText },
  learning: { label: "Learning Updates", icon: BookOpen },
  code: { label: "Code Deep Dives", icon: Code2 },
  updates: { label: "Build Logs / Updates", icon: Rocket },
  other: { label: "Other Notes", icon: FileText },
};

const getSectionBadgeColor = (section: Exclude<BlogSection, "all">) => {
  switch (section) {
    case "learning":
      return "bg-green-700/20 text-green-700 border-green-700/40";
    case "code":
      return "bg-blue-700/20 text-blue-700 border-blue-700/40";
    case "updates":
      return "bg-purple-700/20 text-purple-700 border-purple-700/40";
    case "other":
      return "bg-zinc-700/20 text-zinc-700 border-zinc-700/40";
    default:
      return "bg-zinc-700/20 text-zinc-700 border-zinc-700/40";
  }
};

interface Comment {
  id: string;
  author: string;
  body: string;
  timestamp: Date;
  votes: number;
}

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

export default function BlogPostPage() {
  return <BlogPostClient />;
}

