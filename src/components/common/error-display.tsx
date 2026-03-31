"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ErrorDisplay({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <Card className="mx-auto max-w-md text-center bg-surface-elevated">
      <CardContent className="py-6">
        <p className="text-error mb-4">{message}</p>
        {retry && (
          <Button variant="outline" onClick={retry}>
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
