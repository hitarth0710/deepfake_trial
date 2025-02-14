import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DocumentationDialog() {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Documentation</DialogTitle>
          <DialogDescription>
            Learn how to use MaskOff's features and capabilities.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <section>
            <h3 className="font-medium mb-2">Getting Started</h3>
            <p className="text-sm text-muted-foreground">
              Quick start guide and basic concepts.
            </p>
          </section>
          <section>
            <h3 className="font-medium mb-2">Features</h3>
            <p className="text-sm text-muted-foreground">
              Detailed documentation of all features.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
