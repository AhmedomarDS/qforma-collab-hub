
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3,
  Save,
  X
} from 'lucide-react';

type TaskStatus = {
  id: string;
  name: string;
  color: string;
  description?: string;
  isDefault: boolean;
};

type DashboardConfig = {
  kanban: {
    statuses: TaskStatus[];
    autoRefresh: boolean;
    showAssignee: boolean;
    showDueDate: boolean;
  };
  agile: {
    sprintDuration: number;
    showVelocity: boolean;
    showBurndown: boolean;
  };
  cmmi: {
    maturityLevel: number;
    processAreas: string[];
    showCompliance: boolean;
  };
};

const defaultStatuses: TaskStatus[] = [
  { id: 'todo', name: 'To Do', color: '#6b7280', description: 'Tasks to be started', isDefault: true },
  { id: 'in-progress', name: 'In Progress', color: '#3b82f6', description: 'Tasks currently being worked on', isDefault: true },
  { id: 'review', name: 'Review', color: '#f59e0b', description: 'Tasks under review', isDefault: true },
  { id: 'done', name: 'Done', color: '#10b981', description: 'Completed tasks', isDefault: true },
];

interface DashboardSettingsProps {
  onSave: (config: DashboardConfig) => void;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({ onSave }) => {
  const [config, setConfig] = useState<DashboardConfig>({
    kanban: {
      statuses: defaultStatuses,
      autoRefresh: true,
      showAssignee: true,
      showDueDate: true,
    },
    agile: {
      sprintDuration: 14,
      showVelocity: true,
      showBurndown: true,
    },
    cmmi: {
      maturityLevel: 3,
      processAreas: ['Requirements', 'Design', 'Testing', 'Configuration'],
      showCompliance: true,
    },
  });

  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState({ name: '', color: '#3b82f6', description: '' });
  const [isOpen, setIsOpen] = useState(false);

  const addStatus = () => {
    if (newStatus.name.trim()) {
      const id = newStatus.name.toLowerCase().replace(/\s+/g, '-');
      const status: TaskStatus = {
        id,
        name: newStatus.name,
        color: newStatus.color,
        description: newStatus.description,
        isDefault: false,
      };
      
      setConfig(prev => ({
        ...prev,
        kanban: {
          ...prev.kanban,
          statuses: [...prev.kanban.statuses, status],
        },
      }));
      
      setNewStatus({ name: '', color: '#3b82f6', description: '' });
    }
  };

  const updateStatus = (id: string, updates: Partial<TaskStatus>) => {
    setConfig(prev => ({
      ...prev,
      kanban: {
        ...prev.kanban,
        statuses: prev.kanban.statuses.map(status =>
          status.id === id ? { ...status, ...updates } : status
        ),
      },
    }));
  };

  const deleteStatus = (id: string) => {
    setConfig(prev => ({
      ...prev,
      kanban: {
        ...prev.kanban,
        statuses: prev.kanban.statuses.filter(status => status.id !== id),
      },
    }));
  };

  const handleSave = () => {
    onSave(config);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Dashboard Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>
            Customize your project dashboard settings and configure task statuses.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="kanban" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="agile">Agile</TabsTrigger>
            <TabsTrigger value="cmmi">CMMi</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Statuses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {config.kanban.statuses.map((status) => (
                    <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <div>
                          <p className="font-medium">{status.name}</p>
                          {status.description && (
                            <p className="text-sm text-muted-foreground">{status.description}</p>
                          )}
                        </div>
                        {status.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingStatus(status.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        {!status.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteStatus(status.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add New Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="status-name">Status Name</Label>
                      <Input
                        id="status-name"
                        value={newStatus.name}
                        onChange={(e) => setNewStatus(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Testing"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status-color">Color</Label>
                      <Input
                        id="status-color"
                        type="color"
                        value={newStatus.color}
                        onChange={(e) => setNewStatus(prev => ({ ...prev, color: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status-description">Description</Label>
                      <Input
                        id="status-description"
                        value={newStatus.description}
                        onChange={(e) => setNewStatus(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <Button onClick={addStatus} className="mt-3" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Status
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh board data</p>
                  </div>
                  <Switch
                    checked={config.kanban.autoRefresh}
                    onCheckedChange={(checked) =>
                      setConfig(prev => ({
                        ...prev,
                        kanban: { ...prev.kanban, autoRefresh: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Assignee</Label>
                    <p className="text-sm text-muted-foreground">Display assignee on task cards</p>
                  </div>
                  <Switch
                    checked={config.kanban.showAssignee}
                    onCheckedChange={(checked) =>
                      setConfig(prev => ({
                        ...prev,
                        kanban: { ...prev.kanban, showAssignee: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Due Date</Label>
                    <p className="text-sm text-muted-foreground">Display due dates on task cards</p>
                  </div>
                  <Switch
                    checked={config.kanban.showDueDate}
                    onCheckedChange={(checked) =>
                      setConfig(prev => ({
                        ...prev,
                        kanban: { ...prev.kanban, showDueDate: checked },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sprint Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sprint-duration">Sprint Duration (days)</Label>
                  <Input
                    id="sprint-duration"
                    type="number"
                    value={config.agile.sprintDuration}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        agile: { ...prev.agile, sprintDuration: parseInt(e.target.value) || 14 },
                      }))
                    }
                    min="1"
                    max="30"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Velocity Chart</Label>
                    <p className="text-sm text-muted-foreground">Display team velocity metrics</p>
                  </div>
                  <Switch
                    checked={config.agile.showVelocity}
                    onCheckedChange={(checked) =>
                      setConfig(prev => ({
                        ...prev,
                        agile: { ...prev.agile, showVelocity: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Burndown Chart</Label>
                    <p className="text-sm text-muted-foreground">Display sprint burndown chart</p>
                  </div>
                  <Switch
                    checked={config.agile.showBurndown}
                    onCheckedChange={(checked) =>
                      setConfig(prev => ({
                        ...prev,
                        agile: { ...prev.agile, showBurndown: checked },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cmmi" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maturity Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maturity-level">Current Maturity Level</Label>
                  <Input
                    id="maturity-level"
                    type="number"
                    value={config.cmmi.maturityLevel}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        cmmi: { ...prev.cmmi, maturityLevel: parseInt(e.target.value) || 1 },
                      }))
                    }
                    min="1"
                    max="5"
                  />
                </div>
                <div>
                  <Label htmlFor="process-areas">Process Areas</Label>
                  <Textarea
                    id="process-areas"
                    value={config.cmmi.processAreas.join(', ')}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        cmmi: {
                          ...prev.cmmi,
                          processAreas: e.target.value.split(',').map(area => area.trim()).filter(Boolean),
                        },
                      }))
                    }
                    placeholder="Enter process areas separated by commas"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Compliance Status</Label>
                    <p className="text-sm text-muted-foreground">Display process compliance indicators</p>
                  </div>
                  <Switch
                    checked={config.cmmi.showCompliance}
                    onCheckedChange={(checked) =>
                      setConfig(prev => ({
                        ...prev,
                        cmmi: { ...prev.cmmi, showCompliance: checked },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardSettings;
