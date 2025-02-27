"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, Filter } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import AddTodoDialog from "./AddTodoDialog";
import TodoList from "./TodoList";
import { Button } from "./ui/button";
import { Todo } from "@/types/type";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      title: "Complete project proposal",
      description: "Finish the draft and send for review",
      date: new Date(),
      status: "pending",
    },
    {
      id: 2,
      title: "Buy groceries",
      description: "Milk, eggs, bread, and vegetables",
      date: new Date(Date.now() - 86400000),
      status: "completed",
    },
    {
      id: 3,
      title: "Schedule dentist appointment",
      description: "Call Dr. Smith's office",
      date: new Date(Date.now() + 86400000 * 2),
      status: "pending",
    },
  ]);

  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    let filtered = [...todos];

    if (statusFilter !== "all") {
      filtered = filtered.filter((todo) => todo.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (todo) =>
          format(todo.date, "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd")
      );
    }

    setFilteredTodos(filtered);
  }, [todos, statusFilter, dateFilter]);

  const addTodo = (todo: Omit<Todo, "id">) => {
    const newTodo = {
      ...todo,
      id: todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodoStatus = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: todo.status === "pending" ? "completed" : "pending",
            }
          : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-slate-500 mt-2">
            Organize, filter, and manage your tasks efficiently
          </p>
        </header>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? (
                    format(dateFilter, "PPP")
                  ) : (
                    <span>Filter by date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={(date) => setDateFilter(date)}
                  initialFocus
                />
                {dateFilter && (
                  <div className="p-3 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDateFilter(undefined)}
                      className="w-full"
                    >
                      Clear date filter
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-1"
          >
            <Plus className="size-4" />
            Add Task
          </Button>
        </div>

        <TodoList
          todos={filteredTodos}
          onToggleStatus={toggleTodoStatus}
          onDelete={deleteTodo}
        />

        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">
              {todos.length === 0
                ? "No tasks yet. Add your first task!"
                : "No tasks match your filters."}
            </p>
          </div>
        )}
      </div>

      <AddTodoDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddTodo={addTodo}
      />
    </div>
  );
}
