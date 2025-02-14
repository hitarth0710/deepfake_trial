import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  Wand2,
  ArrowRight,
  CheckCircle,
  Play,
  Zap,
  Lock,
  Users,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Layout } from "./layout";
import { AuthCheck } from "./auth/AuthCheck";

const teamMembers = [
  {
    name: "Shivansh Srivastava",
    role: "Team Leader",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shivansh",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com/ShivanshSrivastava136",
    },
  },
  {
    name: "Hitarth Soni",
    role: "Backend Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hitarth",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com/hitarth0710",
    },
  },
  {
    name: "Harshil Vadalia",
    role: "Designer and ML Work",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=harshil",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com/harshilvadalia",
    },
  },
  {
    name: "Harsh Kadecha",
    role: "Frontend Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=harsh",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com/HarshKadecha11",
    },
  },
];

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
              <AuthCheck>
                <Button
                  size="lg"
                  className="group"
                  onClick={() => navigate("/video-detection")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </AuthCheck>
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

        {/* Team Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:scale-[1.02] text-center group"
              >
                <Avatar className="h-24 w-24 mx-auto border-2 border-primary/20 mb-4 group-hover:border-primary transition-colors">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 mb-4">
                  <div className="font-semibold text-lg">{member.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.role}
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  {Object.entries(member.social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
                    >
                      {platform === "github" && <Github className="h-5 w-5" />}
                      {platform === "twitter" && (
                        <Twitter className="h-5 w-5" />
                      )}
                      {platform === "linkedin" && (
                        <Linkedin className="h-5 w-5" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
