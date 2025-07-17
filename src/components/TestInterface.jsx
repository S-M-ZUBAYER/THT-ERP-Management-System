// src/components/TestInterface.jsx
import { Button } from "../components/ui/button";

export default function TestInterface() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-sans flex items-center justify-center">
      <div className="p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-800 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">🚀 ShadCN UI Test</h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          If you see this, Tailwind, shadcn/ui, and Inter font are all working!
        </p>
        <Button className="w-full">Click Me</Button>
      </div>
    </div>
  );
}
