import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const WebsiteCard = ({
  site,
  handleRouteNavigate,
  activeTab,
  defaultEnabled,
}) => {
  const [enabled, setEnabled] = useState(false);

  // ✅ Sync with defaultEnabled when it changes (e.g., when new user selected)
  useEffect(() => {
    setEnabled(defaultEnabled || false);
  }, [defaultEnabled]);

  return (
    <Card className="shadow-md rounded-2xl bg-[#FAFAFA] hover:shadow-xl transition-all duration-200 border border-gray-200">
      <CardContent className="p-5">
        <div
          onClick={() => handleRouteNavigate(site)}
          className="cursor-pointer"
        >
          <img
            src={site.image}
            alt={site.title}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-800">{site.title}</h2>

          {activeTab === "admin" ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-sm flex items-center gap-1"
              onClick={() => handleRouteNavigate(site)}
            >
              Visit site <ChevronRight size={15} />
            </Button>
          ) : (
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-10 h-5 rounded-full transition relative ${
                enabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${
                  enabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteCard;
