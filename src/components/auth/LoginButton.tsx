
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";

interface LoginButtonProps {
  variant?: "default" | "outline" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const LoginButton = ({ 
  variant = "default", 
  size = "default", 
  className = "" 
}: LoginButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        Login / Register
      </Button>

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default LoginButton;
