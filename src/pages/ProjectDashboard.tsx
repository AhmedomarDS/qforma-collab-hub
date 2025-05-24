import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Calendar,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';

type DashboardType = 'kanban' | 'agile' | 'cmmi';

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, tasks, getProjectTasks, updateTask } = useProject();
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [dashboardType, setDashboardType] = useState<DashboardType>('kanban');

  const project = projects.find(p => p.id === selectedProject);
  const projectTasks = selectedProject ? getProjectTasks(selectedProject) : [];

  const tasksByStatus = {
    todo: projectTasks.filter(task => task.status === 'todo'),
    'in-progress': projectTasks.filter(task => task.status === 'in-progress'),
    review: projectTasks.filter(task => task.status === 'review'),
    done: projectTasks.filter(task => task.status === 'done')
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside any droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update task status
    const newStatus = destination.droppableId as 'todo' | 'in-progress' | 'review' | 'done';
    updateTask(draggableId, { status: newStatus });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'todo': return 'secondary';
      case 'in-progress': return 'default';
      case 'review': return 'outline';
      case 'done': return 'default';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const KanbanBoard = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <Droppable key={status} droppableId={status}>
            {(provided, snapshot) => (
              <Card 
                className={`h-fit transition-colors ${
                  snapshot.isDraggingOver ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium capitalize flex items-center justify-between">
                    {status.replace('-', ' ')}
                    <Badge variant="outline">{tasks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 min-h-[200px]"
                >
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <Card 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 hover:shadow-sm transition-all cursor-move ${
                            snapshot.isDragging ? 'shadow-lg rotate-3 scale-105' : ''
                          }`}
                        >
                          <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                              {task.priority}
                            </Badge>
                            {task.dueDate && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              </Card>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );

  const AgileBoard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByStatus['in-progress'].length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByStatus.done.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((tasksByStatus.done.length / projectTasks.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sprint Backlog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectTasks.slice(0, 10).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(task.status)}>
                    {task.status}
                  </Badge>
                  <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CMMiBoard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Process Maturity Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Level 3</div>
            <p className="text-sm text-muted-foreground">Defined Process</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Defect Density</span>
                <span className="text-sm font-medium">0.2/KLOC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Test Coverage</span>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Process Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Badge variant="default" className="mr-1 mb-1">Requirements</Badge>
              <Badge variant="default" className="mr-1 mb-1">Design</Badge>
              <Badge variant="default" className="mr-1 mb-1">Testing</Badge>
              <Badge variant="default" className="mr-1 mb-1">Configuration</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Process Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Requirements Management</h4>
                <p className="text-sm text-muted-foreground">All requirements are tracked and managed</p>
              </div>
              <Badge variant="default">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Project Planning</h4>
                <p className="text-sm text-muted-foreground">Project plans are established and maintained</p>
              </div>
              <Badge variant="default">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Quality Assurance</h4>
                <p className="text-sm text-muted-foreground">QA processes are implemented</p>
              </div>
              <Badge variant="outline">Partial</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Project Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage your project progress</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dashboardType} onValueChange={(value) => setDashboardType(value as DashboardType)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kanban">Kanban Board</SelectItem>
              <SelectItem value="agile">Agile Dashboard</SelectItem>
              <SelectItem value="cmmi">CMMi Dashboard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!selectedProject ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a Project</h3>
              <p>Choose a project from the dropdown above to view its dashboard</p>
            </div>
          </Card>
        ) : (
          <>
            {project && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <p className="text-muted-foreground mt-1">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(project.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.members.length} members
                      </div>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            <div>
              {dashboardType === 'kanban' && <KanbanBoard />}
              {dashboardType === 'agile' && <AgileBoard />}
              {dashboardType === 'cmmi' && <CMMiBoard />}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ProjectDashboard;
