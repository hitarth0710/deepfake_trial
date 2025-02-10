import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Code, FileText } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />
      <div className="container pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-muted-foreground mb-8">
            Learn how to integrate and use MaskOff's powerful video analysis and
            transformation tools.
          </p>

          <Tabs defaultValue="quickstart" className="space-y-8">
            <TabsList>
              <TabsTrigger value="quickstart">
                <BookOpen className="h-4 w-4 mr-2" />
                Quickstart
              </TabsTrigger>
              <TabsTrigger value="api">
                <Code className="h-4 w-4 mr-2" />
                API Reference
              </TabsTrigger>
              <TabsTrigger value="guides">
                <FileText className="h-4 w-4 mr-2" />
                Guides
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quickstart" className="space-y-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h2>Getting Started</h2>
                <p>Follow these steps to start using DeepAI in your project:</p>
                <ol>
                  <li>Sign up for an account</li>
                  <li>Get your API key from the dashboard</li>
                  <li>Install our SDK</li>
                  <li>Make your first API call</li>
                </ol>
                <Button>View Installation Guide</Button>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h2>API Reference</h2>
                <p>Explore our comprehensive API documentation:</p>
                <ul>
                  <li>Authentication</li>
                  <li>Video Analysis API</li>
                  <li>Video Transformation API</li>
                  <li>Webhooks</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h2>Guides & Tutorials</h2>
                <p>Learn how to implement specific features:</p>
                <ul>
                  <li>Deepfake Detection Guide</li>
                  <li>Video Style Transfer Tutorial</li>
                  <li>Batch Processing Guide</li>
                  <li>Error Handling Best Practices</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
