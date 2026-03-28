import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ErrorDisplay({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <Card className="mx-auto max-w-md text-center">
      <p className="text-error mb-4">{message}</p>
      {retry && (
        <Button variant="outline" onClick={retry}>
          Try Again
        </Button>
      )}
    </Card>
  );
}
