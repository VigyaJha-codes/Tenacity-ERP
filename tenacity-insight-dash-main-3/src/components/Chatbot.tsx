import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Send, Bot, User, Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hello! I\'m your Tenacity ERP assistant. I can help you with information about exams, fees, placements, and hostel services. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Keyword-based response system
  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();

    // Exam related queries
    if (message.includes('exam') || message.includes('test') || message.includes('assessment')) {
      return `🎓 **Exam Information:**
      
• Check your exam schedule in the Student Dashboard
• View your current marks and CGPA
• Use the CGPA calculator to predict future scores
• Contact faculty for exam-related queries

**Exam Helpline:** +91-XXXX-EXAM (3926)
**Email:** exams@tenacityerp.edu`;
    }

    // Fee related queries
    if (message.includes('fee') || message.includes('payment') || message.includes('money') || message.includes('receipt')) {
      return `💳 **Fee Information:**
      
• Pay fees online through the Fee Module
• Download receipts instantly after payment
• Check fee status and payment history
• Multiple payment options available

**Fee Office Hours:** Mon-Fri, 9 AM - 5 PM
**Contact:** +91-XXXX-FEES (3337)
**Email:** fees@tenacityerp.edu`;
    }

    // Placement related queries
    if (message.includes('placement') || message.includes('job') || message.includes('career') || message.includes('internship')) {
      return `🚀 **Placement & Career Services:**
      
• Access placement portal through student dashboard
• Update your resume and academic records
• Register for campus recruitment drives
• Career counseling sessions available

**Placement Cell:** Mon-Fri, 10 AM - 4 PM
**Contact:** +91-XXXX-JOBS (5627)
**Email:** placements@tenacityerp.edu`;
    }

    // Hostel related queries
    if (message.includes('hostel') || message.includes('room') || message.includes('accommodation') || message.includes('mess')) {
      return `🏠 **Hostel Information:**
      
• Check room allocation in Admin Dashboard
• Submit hostel requests and complaints
• Mess menu and timings available
• Hostel fee payment through Fee Module

**Hostel Office Hours:** 24/7 (Emergency)
**Warden Contact:** +91-XXXX-HOST (4678)
**Email:** hostel@tenacityerp.edu`;
    }

    // Academic queries
    if (message.includes('marks') || message.includes('grade') || message.includes('cgpa') || message.includes('result')) {
      return `📊 **Academic Information:**
      
• View your marks in Student Dashboard
• Use the CGPA calculator for predictions
• Download academic transcripts
• Early warning system alerts for improvement

**Academic Office:** Mon-Fri, 9 AM - 5 PM
**Contact:** +91-XXXX-ACAD (2223)
**Email:** academics@tenacityerp.edu`;
    }

    // Attendance queries
    if (message.includes('attendance') || message.includes('absent') || message.includes('present')) {
      return `✅ **Attendance Information:**
      
• View attendance percentage in dashboard
• Minimum 75% attendance required
• Apply for attendance shortage through faculty
• Regular attendance tracking available

**Student Services:** Mon-Fri, 9 AM - 5 PM
**Contact:** +91-XXXX-ATTN (2886)`;
    }

    // General help
    if (message.includes('help') || message.includes('support') || message.includes('contact')) {
      return `📞 **Contact Information:**
      
**Main Office:** +91-XXXX-MAIN (6246)
**Email:** support@tenacityerp.edu
**Address:** Tenacity Institute of Technology
123 Education Street, Knowledge City

**Office Hours:** Mon-Fri, 9 AM - 6 PM
**Emergency:** +91-XXXX-HELP (4357)`;
    }

    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
      return `You're welcome! 😊 Is there anything else I can help you with regarding your academic journey at Tenacity ERP?`;
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello! 👋 I'm here to help you with any questions about Tenacity ERP. You can ask me about:
      
• Exams and assessments
• Fee payments and receipts
• Placement and career services
• Hostel accommodations
• Academic records and CGPA

What would you like to know?`;
    }

    // Default response
    return `I understand you're asking about "${userMessage}". Here are some common topics I can help with:

🎓 **Exams** - Schedules, marks, CGPA
💳 **Fees** - Payments, receipts, status
🚀 **Placements** - Career services, jobs
🏠 **Hostel** - Room allocation, mess
📊 **Academics** - Grades, transcripts

Please try asking about one of these topics, or contact our support team:
**Phone:** +91-XXXX-HELP (4357)
**Email:** support@tenacityerp.edu`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date(),
    };

    const botResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      message: getResponse(inputMessage.trim()),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'How to pay fees?',
    'Check exam schedule',
    'Hostel room allocation',
    'CGPA calculation',
    'Placement information',
    'Contact support'
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-lg hover:shadow-xl z-50 border-0"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={onToggle}>
        <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 bg-gradient-primary text-white rounded-t-lg">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Tenacity ERP Assistant
            </DialogTitle>
          </DialogHeader>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.message}</div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(question)}
                    className="text-xs h-8"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                size="sm"
                className="bg-gradient-primary px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Try asking about exams, fees, placements, or hostel services
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};