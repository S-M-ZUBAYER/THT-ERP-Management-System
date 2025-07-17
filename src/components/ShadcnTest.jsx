import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ShadcnTest() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-[350px] p-6 space-y-4 shadow-xl dark:bg-gray-800 bg-white rounded-2xl">
        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          ShadCN Test Interface
        </h1>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
            Your Name
          </Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        <Button className="w-full">Submit</Button>
      </Card>
    </div>
  );
}
