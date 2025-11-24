import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function WebsiteCard({ site, handleRouteNavigate }) {
  return (
    <Card className="shadow-md rounded-2xl bg-[#FAFAFA] hover:shadow-xl transition-all duration-200 border border-gray-200">
      <CardContent className="p-5">
        <div
          onClick={() => handleRouteNavigate(site)}
          className="cursor-pointer"
        >
          <img
            src={site.img}
            alt={site.name}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">
            {site.name}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-sm flex items-center gap-1"
            onClick={() => handleRouteNavigate(site)}
          >
            Visit site <ChevronRight size={15} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
