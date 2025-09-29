import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student, FeeTransaction } from '../types';
import { generateReceiptId, formatCurrency } from '../utils/calculations';
import { generateFeeReceipt } from '../utils/pdf';
import { toast } from '../hooks/use-toast';
import { CreditCard, Download, Receipt } from 'lucide-react';

interface FeeFormProps {
  students: Student[];
  onAddTransaction: (transaction: FeeTransaction) => void;
}

export const FeeForm: React.FC<FeeFormProps> = ({ students, onAddTransaction }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    feeType: 'tuition',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<FeeTransaction | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSelectedStudent = () => {
    return students.find(s => s.id === formData.studentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedStudent = getSelectedStudent();
      if (!selectedStudent) {
        throw new Error('Student not found');
      }

      const transaction: FeeTransaction = {
        id: `fee_${Date.now()}`,
        studentId: formData.studentId,
        studentName: selectedStudent.name,
        amount: Number(formData.amount),
        date: formData.date,
        receiptId: generateReceiptId(),
      };

      onAddTransaction(transaction);
      setLastTransaction(transaction);

      toast({
        title: "Payment Processed Successfully",
        description: `Receipt ${transaction.receiptId} generated for ${selectedStudent.name}`,
      });

      // Reset form but keep date
      setFormData(prev => ({
        studentId: '',
        amount: '',
        date: prev.date,
        feeType: 'tuition',
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (lastTransaction) {
      generateFeeReceipt(lastTransaction);
    }
  };

  const isFormValid = formData.studentId && 
                     formData.amount && 
                     Number(formData.amount) > 0 &&
                     formData.date;

  const feeTypes = [
    { value: 'tuition', label: 'Tuition Fee' },
    { value: 'hostel', label: 'Hostel Fee' },
    { value: 'library', label: 'Library Fee' },
    { value: 'lab', label: 'Laboratory Fee' },
    { value: 'examination', label: 'Examination Fee' },
    { value: 'misc', label: 'Miscellaneous' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Payment Form */}
        <Card className="hover-lift shadow-lg">
          <CardHeader className="bg-gradient-secondary text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-6 w-6" />
              Fee Payment
            </CardTitle>
            <CardDescription className="text-white/90">
              Process student fee payments
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Selection */}
              <div className="space-y-2">
                <Label htmlFor="student" className="text-sm font-medium">
                  Select Student *
                </Label>
                <Select value={formData.studentId} onValueChange={(value) => handleInputChange('studentId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fee Type */}
              <div className="space-y-2">
                <Label htmlFor="feeType" className="text-sm font-medium">
                  Fee Type
                </Label>
                <Select value={formData.feeType} onValueChange={(value) => handleInputChange('feeType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {feeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount (₹) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full"
                  required
                />
                {formData.amount && (
                  <p className="text-sm text-muted-foreground">
                    Amount: {formatCurrency(Number(formData.amount))}
                  </p>
                )}
              </div>

              {/* Payment Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Payment Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Student Info Preview */}
              {formData.studentId && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Payment Summary:</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Student:</span> {getSelectedStudent()?.name}</p>
                    <p><span className="font-medium">ID:</span> {formData.studentId}</p>
                    <p><span className="font-medium">Fee Type:</span> {feeTypes.find(t => t.value === formData.feeType)?.label}</p>
                    {formData.amount && (
                      <p><span className="font-medium">Amount:</span> {formatCurrency(Number(formData.amount))}</p>
                    )}
                    <p><span className="font-medium">Date:</span> {new Date(formData.date).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-gradient-secondary text-white hover:opacity-90"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Transaction & Receipt */}
        <div className="space-y-6">
          {lastTransaction && (
            <Card className="hover-lift shadow-lg border-success">
              <CardHeader className="bg-success text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Payment Successful
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Receipt ID:</span>
                    <span className="font-mono text-sm">{lastTransaction.receiptId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Student:</span>
                    <span className="font-medium">{lastTransaction.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-bold text-success">{formatCurrency(lastTransaction.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="text-sm">{new Date(lastTransaction.date).toLocaleDateString()}</span>
                  </div>
                  
                  <Button
                    onClick={handleDownloadReceipt}
                    className="w-full mt-4 bg-gradient-primary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Fee Amounts */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">Quick Fee Amounts</CardTitle>
              <CardDescription>Common fee amounts for quick selection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[5000, 10000, 15000, 25000, 50000, 75000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('amount', amount.toString())}
                    className="text-sm"
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Guidelines */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">Payment Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• All payments are processed immediately</p>
              <p>• Receipts are automatically generated</p>
              <p>• Keep receipt ID for future reference</p>
              <p>• Contact admin for payment disputes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
