import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserRole } from '../types';
import logo from '../assets/logo.png';
import { Volume2, Eye, Type } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole | null;
  onRoleChange: (role: UserRole) => void;
  currentUser: { name: string; role: UserRole } | null;
  isHighContrast: boolean;
  isDyslexiaFriendly: boolean;
  onToggleHighContrast: () => void;
  onToggleDyslexiaFriendly: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  isHighContrast,
  isDyslexiaFriendly,
  onToggleHighContrast,
  onToggleDyslexiaFriendly,
}) => {
  const handleSpeak = () => {
    const text = `Welcome to Tenacity ERP. Current user: ${currentUser?.name || 'Guest'}, Role: ${currentRole || 'None'}`;
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <header className="w-full bg-gradient-hero text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img 
              src={logo} 
              alt="Tenacity ERP Logo" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold">Tenacity ERP</h1>
              <p className="text-sm opacity-90">Education Management System</p>
            </div>
          </div>

          {/* User Info and Controls */}
          <div className="flex items-center space-x-4">
            {/* Accessibility Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeak}
                className="text-white hover:bg-white/20"
                title="Text to Speech"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleHighContrast}
                className={`text-white hover:bg-white/20 ${isHighContrast ? 'bg-white/20' : ''}`}
                title="Toggle High Contrast"
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleDyslexiaFriendly}
                className={`text-white hover:bg-white/20 ${isDyslexiaFriendly ? 'bg-white/20' : ''}`}
                title="Toggle Dyslexia-Friendly Font"
              >
                <Type className="h-4 w-4" />
              </Button>
            </div>

            {/* Current User */}
            {currentUser && (
              <div className="text-right">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm opacity-75">{currentUser.role}</p>
              </div>
            )}

            {/* Role Selector */}
            <Select value={currentRole || ''} onValueChange={(value) => onRoleChange(value as UserRole)}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Faculty">Faculty</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};