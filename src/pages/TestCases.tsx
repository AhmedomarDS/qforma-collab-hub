import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Library, PlusCircle, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { parseCSV } from '@/lib/utils/csvParser';
import { useToast } from '@/hooks/use-toast';

const TestCases = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTestCase, setNewTestCase] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'draft',
    assignee: '',
    category: '',
    tags: '',
    steps: '',
    expectedResult: '',
  });

  const handleCreateTestCase = () => {
    console.log('Creating new test case:', newTestCase);
    setNewTestCase({
      title: '',
      description: '',
      priority: 'medium',
      status: 'draft',
      assignee: '',
      category: '',
      tags: '',
      steps: '',
      expectedResult: '',
    });
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Test case created successfully!",
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const handleCSVUpload = async () => {
    if (!selectedFile) return;

    try {
      const data = await parseCSV(selectedFile);
      console.log('Parsed CSV data:', data);
      
      toast({
        title: "Success",
        description: t('testCases.uploadSuccess'),
      });
      
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({
        title: "Error",
        description: t('testCases.uploadError'),
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('testCases.title')}</h1>
            <p className="text-muted-foreground">{t('testCases.description')}</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('testCases.uploadCSV')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{t('testCases.csvUploadTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('testCases.csvUploadDescription')}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="csvFile">{t('testCases.selectFile')}</Label>
                    <Input 
                      id="csvFile" 
                      type="file" 
                      accept=".csv"
                      onChange={handleFileSelect}
                    />
                    <p className="text-sm text-muted-foreground">
                      {t('testCases.csvFormatNote')}
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    onClick={handleCSVUpload} 
                    disabled={!selectedFile}
                  >
                    {t('common.upload')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t('testCases.createNew')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('testCases.createNew')}</DialogTitle>
                  <DialogDescription>
                    Create a comprehensive test case with detailed steps and expected results.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">{t('testCases.testCaseTitle')}</Label>
                    <Input 
                      id="title" 
                      value={newTestCase.title}
                      onChange={(e) => setNewTestCase({...newTestCase, title: e.target.value})}
                      placeholder="Enter test case title"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">{t('testCases.description')}</Label>
                    <Textarea 
                      id="description"
                      value={newTestCase.description}
                      onChange={(e) => setNewTestCase({...newTestCase, description: e.target.value})}
                      placeholder="Describe what this test case validates"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">{t('testCases.priority')}</Label>
                      <Select 
                        value={newTestCase.priority}
                        onValueChange={(value) => setNewTestCase({...newTestCase, priority: value})}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="status">{t('testCases.status')}</Label>
                      <Select 
                        value={newTestCase.status}
                        onValueChange={(value) => setNewTestCase({...newTestCase, status: value})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="deprecated">Deprecated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">{t('testCases.assignee')}</Label>
                      <Input 
                        id="assignee" 
                        value={newTestCase.assignee}
                        onChange={(e) => setNewTestCase({...newTestCase, assignee: e.target.value})}
                        placeholder="Assign to team member"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="category">{t('testCases.category')}</Label>
                      <Input 
                        id="category" 
                        value={newTestCase.category}
                        onChange={(e) => setNewTestCase({...newTestCase, category: e.target.value})}
                        placeholder="UI, API, Integration, etc."
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="tags">{t('testCases.tags')}</Label>
                    <Input 
                      id="tags" 
                      value={newTestCase.tags}
                      onChange={(e) => setNewTestCase({...newTestCase, tags: e.target.value})}
                      placeholder="smoke, regression, critical (comma separated)"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="steps">{t('testCases.steps')}</Label>
                    <Textarea 
                      id="steps"
                      value={newTestCase.steps}
                      onChange={(e) => setNewTestCase({...newTestCase, steps: e.target.value})}
                      placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="expectedResult">{t('testCases.expectedResult')}</Label>
                    <Textarea 
                      id="expectedResult"
                      value={newTestCase.expectedResult}
                      onChange={(e) => setNewTestCase({...newTestCase, expectedResult: e.target.value})}
                      placeholder="Describe the expected outcome"
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    onClick={handleCreateTestCase} 
                    disabled={!newTestCase.title || !newTestCase.description}
                  >
                    {t('common.create')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Test Cases Library Management</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <Library className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('testCases.noTestCases')}</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {t('testCases.noTestCasesDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TestCases;
