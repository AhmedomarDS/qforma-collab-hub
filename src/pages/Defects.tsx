
import React, { useState } from 'react';
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
import { Bug, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Defects = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDefect, setNewDefect] = useState({
    title: '',
    description: '',
    severity: 'medium',
    priority: 'medium',
    tags: '',
  });

  const handleCreateDefect = () => {
    // This would normally submit the defect to an API
    console.log('Creating new defect:', newDefect);
    setNewDefect({
      title: '',
      description: '',
      severity: 'medium',
      priority: 'medium',
      tags: '',
    });
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Defects</h1>
            <p className="text-muted-foreground">Track and manage defects and issues</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-qforma-blue hover:bg-qforma-blue/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Report New Defect
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Report New Defect</DialogTitle>
                <DialogDescription>
                  Report a new defect or issue for the team to investigate.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={newDefect.title}
                    onChange={(e) => setNewDefect({...newDefect, title: e.target.value})}
                    placeholder="Brief summary of the defect"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={newDefect.description}
                    onChange={(e) => setNewDefect({...newDefect, description: e.target.value})}
                    placeholder="Steps to reproduce, expected vs. actual behavior"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select 
                      value={newDefect.severity}
                      onValueChange={(value) => setNewDefect({...newDefect, severity: value})}
                    >
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="cosmetic">Cosmetic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newDefect.priority}
                      onValueChange={(value) => setNewDefect({...newDefect, priority: value})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blocker">Blocker</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input 
                    id="tags" 
                    value={newDefect.tags}
                    onChange={(e) => setNewDefect({...newDefect, tags: e.target.value})}
                    placeholder="ui, login, backend (comma separated)"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateDefect} 
                  disabled={!newDefect.title || !newDefect.description}
                  className="bg-qforma-blue hover:bg-qforma-blue/90"
                >
                  Report Defect
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Defect Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <Bug className="h-16 w-16 text-qforma-danger" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Defects Reported</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              There are currently no reported defects. Use the "Report New Defect" button to log issues found during testing.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Defects;
