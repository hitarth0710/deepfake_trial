import { Button } from "@/components/ui/button";
import {
  Shield,
  Wand2,
  ArrowRight,
  CheckCircle,
  Play,
  Zap,
  Lock,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Layout } from "./layout";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Advanced AI Detection",
      description: "Industry-leading deepfake detection with 99.9% accuracy",
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Process videos in seconds with our optimized AI pipeline",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-grade encryption and secure video processing",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share results and collaborate with team members",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Detection Accuracy" },
    { value: "500K+", label: "Videos Analyzed" },
    { value: "200+", label: "Enterprise Clients" },
    { value: "24/7", label: "Expert Support" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="container pt-32 pb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl" />
          <div className="relative text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent animate-fade-in">
              Detect Deepfakes with Confidence
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in-delay">
              MaskOff is the world's most advanced deepfake detection platform,
              helping organizations verify content authenticity and protect
              against digital manipulation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Button
                size="lg"
                className="group"
                onClick={() => navigate("/analyze")}
              >
                Start Detection
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/docs")}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-20">
          <p className="text-sm font-medium text-muted-foreground mb-6">
            TRUSTED BY INDUSTRY LEADERS
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {[
              "Netflix",
              "Disney",
              "Warner Bros",
              "Universal",
              "Paramount",
              "Sony Pictures",
            ].map((company) => (
              <div
                key={company}
                className="flex items-center gap-2 animate-fade-in-up"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="font-semibold">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
