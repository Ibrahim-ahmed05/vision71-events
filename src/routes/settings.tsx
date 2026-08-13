import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { readSheetsConfig, writeSheetsConfig } from "@/lib/events/config";
import type { SheetsConfig } from "@/lib/events/types";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const [config, setConfig] = useState<SheetsConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setConfig(readSheetsConfig());
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      writeSheetsConfig(config);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!config) {
    return (
      <PageHeader
        title="Settings"
        subtitle="Loading..."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Configure your spreadsheet connection and data sources."
      />

      <div className="max-w-2xl space-y-6">
        {/* Spreadsheet Configuration */}
        <Card className="px-6 py-6">
          <h3 className="mb-4 text-base font-semibold">Google Sheets Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Spreadsheet ID
              </label>
              <Input
                value={config.spreadsheetId}
                onChange={(e) =>
                  setConfig({ ...config, spreadsheetId: e.target.value })
                }
                placeholder="e.g. 1BxiMVs0XRA5nFMKe..."
                className="font-mono text-xs"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                From the URL: sheets.google.com/spreadsheets/d/{"{ID}"}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Trade Shows Sheet Name
              </label>
              <Input
                value={config.tradeShowsSheet}
                onChange={(e) =>
                  setConfig({ ...config, tradeShowsSheet: e.target.value })
                }
                placeholder="e.g. Trade Shows"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Tech Events Sheet Name
              </label>
              <Input
                value={config.techEventsSheet}
                onChange={(e) =>
                  setConfig({ ...config, techEventsSheet: e.target.value })
                }
                placeholder="e.g. Tech Events"
              />
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="border-dashed bg-muted/30 px-6 py-6">
          <h3 className="mb-3 text-sm font-semibold">Setup Instructions</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary flex-shrink-0">
                1
              </span>
              <span>Create a public Google Sheet with your event data</span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary flex-shrink-0">
                2
              </span>
              <span>Copy the spreadsheet ID from the URL</span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary flex-shrink-0">
                3
              </span>
              <span>Ensure the sheet is publicly readable</span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary flex-shrink-0">
                4
              </span>
              <span>Update the sheet names if they differ from the default</span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary flex-shrink-0">
                5
              </span>
              <span>Click Save and refresh the app</span>
            </li>
          </ol>
        </Card>

        {/* Action Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
          <p className="flex items-center text-sm text-muted-foreground">
            Data is cached for 5 minutes. Changes take effect on next sync.
          </p>
        </div>
      </div>
    </>
  );
}
