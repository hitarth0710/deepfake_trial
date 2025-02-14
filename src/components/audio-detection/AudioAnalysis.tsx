import { useState } from "react";
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AudioAnalysisProps {
  file: File | null;
  onAnalysisComplete?: (result: any) => void;
}

export function AudioAnalysis({
  file,
  onAnalysisComplete,
}: AudioAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    result?: "REAL" | "FAKE";
    confidence?: number;
    waveform_data?: number[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setAnalyzing(true);
      setProgress(0);

      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Call the API to analyze the audio
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.audio}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!analyzing && !result && (
        <Button
          onClick={handleAnalyze}
          size="lg"
          className="w-full md:w-auto"
          disabled={!file}
        >
          Start Analysis
        </Button>
      )}

      {analyzing && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Analyzing Audio</h3>
            <Progress value={progress} />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing... {progress}%
            </div>
          </div>
        </Card>
      )}

      {result && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Analysis Results</h3>
              <Badge
                variant={result.result === "FAKE" ? "destructive" : "default"}
                className="text-sm"
              >
                {result.result === "FAKE" ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-1" />
                    AI Generated Audio
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Natural Audio
                  </>
                )}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence Score</span>
                <span>{result.confidence?.toFixed(1)}%</span>
              </div>
              <Progress
                value={result.confidence}
                className={result.result === "FAKE" ? "bg-destructive/20" : ""}
                indicatorClassName={
                  result.result === "FAKE" ? "bg-destructive" : ""
                }
              />
            </div>

            {result.waveform_data && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Waveform Analysis</h4>
                <div className="h-24 bg-muted rounded-md p-2">
                  <div className="h-full flex items-center">
                    {result.waveform_data.map((value, index) => (
                      <div
                        key={index}
                        className="w-1 bg-primary mx-px"
                        style={{ height: `${value * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
