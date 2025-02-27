"use client";

import { format } from "date-fns";
import { Trash2, Calendar } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/type";

interface TodoListProps {
  todos: Todo[];
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({
  todos,
  onToggleStatus,
  onDelete,
}: TodoListProps) {
  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="group flex items-start gap-3 p-4 rounded-lg transition-all bg-gray-50 hover:bg-gray-100 border border-gray-100"
        >
          <Checkbox
            checked={todo.status === "completed"}
            onCheckedChange={() => onToggleStatus(todo.id)}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "font-medium text-slate-900 dark:text-slate-100",
                  todo.status === "completed" &&
                    "line-through text-slate-500 dark:text-slate-400"
                )}
              >
                {todo.title}
              </h3>
              <Badge
                variant={todo.status === "completed" ? "outline" : "default"}
                className={cn(
                  "ml-auto shrink-0",
                  todo.status === "completed"
                    ? "text-green-500 dark:text-green-400"
                    : "bg-blue-500 hover:bg-blue-600"
                )}
              >
                {todo.status === "completed" ? "Completed" : "Pending"}
              </Badge>
            </div>

            {todo.description && (
              <p
                className={cn(
                  "text-sm text-slate-500 dark:text-slate-400 mt-1",
                  todo.status === "completed" && "line-through"
                )}
              >
                {todo.description}
              </p>
            )}

            <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3 w-3 mr-1" />
              {format(todo.date, "PPP")}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(todo.id)}
            className="opacity-50 flex flex-row items-start group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="sr-only">Delete</span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
