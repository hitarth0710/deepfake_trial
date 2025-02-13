import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function PrivacyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="group">
          <Shield className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
          Privacy Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <section>
            <h3 className="text-lg font-semibold mb-2">
              1. Information We Collect
            </h3>
            <p className="text-muted-foreground">
              We collect information that you provide directly to us, including
              when you: upload videos for analysis, create an account, or
              contact us for support.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">
              2. How We Use Your Information
            </h3>
            <p className="text-muted-foreground">
              We use the information we collect to provide and improve our
              deepfake detection services, analyze usage patterns, and ensure
              platform security.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">3. Data Security</h3>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access or
              disclosure.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">4. Your Rights</h3>
            <p className="text-muted-foreground">
              You have the right to access, correct, or delete your personal
              information. Contact us to exercise these rights.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
