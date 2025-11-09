"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Mail } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isSignUp ? "Sign Up" : "Sign In", { email, password, name });
    // Clear form and close
    setEmail("");
    setPassword("");
    setName("");
    onClose();
  };

  const handleSocialAuth = (provider: string) => {
    console.log(`${isSignUp ? "Sign Up" : "Sign In"} with ${provider}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isSignUp ? "Create Account" : "Welcome Back"}>
      <div className="space-y-4">
        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            type="button"
            variant="outline" 
            className="w-full gap-2"
            onClick={() => handleSocialAuth("Google")}
          >
            <Mail className="h-4 w-4" />
            Google
          </Button>
          <Button 
            type="button"
            variant="outline" 
            className="w-full gap-2"
            onClick={() => handleSocialAuth("GitHub")}
          >
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">{isSignUp && (
          <div>
            <Input 
              type="text" 
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        
        <div>
          <Input 
            type="email" 
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>{" "}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setName("");
            }}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </form>
      </div>
    </Modal>
  );
}
