import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContactDialog } from "./dialogs/ContactDialog";
import { PrivacyDialog } from "./dialogs/PrivacyDialog";

const teamMembers = [
  {
    name: "Shivansh Srivastava",
    role: "Team Leader",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shivansh",
  },
  {
    name: "Hitarth Soni",
    role: "Backend Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hitarth",
  },
  {
    name: "Harshil Vadalia",
    role: "Designer and ML Work",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=harshil",
  },
  {
    name: "Harsh Kadecha",
    role: "Frontend Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=harsh",
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background/60 backdrop-blur-md">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Team Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 animate-fade-in">
              Our Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.map((member, index) => (
                <div
                  key={member.name}
                  className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors animate-fade-in-up flex items-center gap-4"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-end gap-8">
              <PrivacyDialog />
              <ContactDialog />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t animate-fade-in-delay">
          © {new Date().getFullYear()} MaskOff. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
