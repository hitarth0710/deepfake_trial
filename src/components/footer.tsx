import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
            <div className="text-2xl font-bold font-mono">MaskOff</div>
          </div>
          <p className="text-gray-400 text-sm max-w-xs">
            Advanced deepfake detection platform helping organizations verify
            content authenticity.
          </p>
          <div className="space-y-2">
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              TERMS OF SERVICE
            </div>
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              PRIVACY POLICY
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">FEATURES</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              VIDEO DETECTION
            </div>
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              AUDIO ANALYSIS
            </div>
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              TEXT VERIFICATION
            </div>
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              API ACCESS
            </div>
          </div>
        </div>

        {/* Updates Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">STAY UPDATED</h3>
          <div className="space-y-4">
            <Input
              placeholder="EMAIL ADDRESS"
              type="email"
              className="bg-transparent border-0 border-b border-gray-700 rounded-none px-0 text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-gray-400"
            />
            <Button
              variant="outline"
              className="rounded-full border-gray-700 text-gray-400 hover:text-white hover:border-white transition-colors"
            >
              SUBSCRIBE TO UPDATES
            </Button>
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">SUPPORT</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              DOCUMENTATION
            </div>
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              API REFERENCE
            </div>
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              HELP CENTER
            </div>
            <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
              CONTACT US
            </div>
          </div>
        </div>

        {/* Mobile Support Links - Only visible on mobile */}
        <div className="md:hidden col-span-1 space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer">
              HELP CENTER
            </div>
            <div className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer">
              API DOCS
            </div>
            <div className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer">
              CONTACT US
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
