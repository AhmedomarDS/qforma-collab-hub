
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Shield,
  Monitor,
  Smartphone,
  Zap,
  Download,
  Search
} from 'lucide-react';

interface TraceabilityData {
  projectId: string;
  projectName: string;
  requirementId: string;
  requirementTitle: string;
  requirementStatus: string;
  testCasesCount: number;
  testExecutionsCount: number;
  passedTests: number;
  failedTests: number;
  defectsCount: number;
  designDocumentsCount: number;
  automationTestsCount: number;
  performanceTestsCount: number;
  securityTestsCount: number;
  compatibilityTestsCount: number;
  testCoveragePercentage: number;
}

const TraceabilityMatrix = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for traceability matrix
  const traceabilityData: TraceabilityData[] = [
    {
      projectId: 'p1',
      projectName: 'E-commerce Platform',
      requirementId: 'REQ-001',
      requirementTitle: 'User Registration Flow',
      requirementStatus: 'approved',
      testCasesCount: 8,
      testExecutionsCount: 6,
      passedTests: 5,
      failedTests: 1,
      defectsCount: 2,
      designDocumentsCount: 2,
      automationTestsCount: 4,
      performanceTestsCount: 1,
      securityTestsCount: 2,
      compatibilityTestsCount: 3,
      testCoveragePercentage: 87.5,
    },
    {
      projectId: 'p1',
      projectName: 'E-commerce Platform',
      requirementId: 'REQ-002',
      requirementTitle: 'Payment Processing',
      requirementStatus: 'development',
      testCasesCount: 12,
      testExecutionsCount: 8,
      passedTests: 6,
      failedTests: 2,
      defectsCount: 3,
      designDocumentsCount: 3,
      automationTestsCount: 6,
      performanceTestsCount: 2,
      securityTestsCount: 4,
      compatibilityTestsCount: 2,
      testCoveragePercentage: 75.0,
    },
    {
      projectId: 'p2',
      projectName: 'Mobile App',
      requirementId: 'REQ-003',
      requirementTitle: 'Push Notifications',
      requirementStatus: 'testing',
      testCasesCount: 6,
      testExecutionsCount: 6,
      passedTests: 5,
      failedTests: 1,
      defectsCount: 1,
      designDocumentsCount: 1,
      automationTestsCount: 3,
      performanceTestsCount: 1,
      securityTestsCount: 1,
      compatibilityTestsCount: 4,
      testCoveragePercentage: 100.0,
    },
  ];

  const filteredData = traceabilityData.filter(item => {
    const matchesProject = selectedProject === 'all' || item.projectId === selectedProject;
    const matchesSearch = item.requirementTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.requirementId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const projectStats = {
    totalRequirements: filteredData.length,
    totalTestCases: filteredData.reduce((sum, item) => sum + item.testCasesCount, 0),
    totalDefects: filteredData.reduce((sum, item) => sum + item.defectsCount, 0),
    averageCoverage: filteredData.length > 0 
      ? filteredData.reduce((sum, item) => sum + item.testCoveragePercentage, 0) / filteredData.length
      : 0,
  };

  const handleExportMatrix = () => {
    console.log('Exporting traceability matrix...');
    // Implement export functionality
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Traceability Matrix</h1>
            <p className="text-muted-foreground">Track coverage and relationships across your SDLC</p>
          </div>
          <Button onClick={handleExportMatrix}>
            <Download className="h-4 w-4 mr-2" />
            Export Matrix
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requirements</p>
                  <p className="text-2xl font-bold">{projectStats.totalRequirements}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TestTube className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Test Cases</p>
                  <p className="text-2xl font-bold">{projectStats.totalTestCases}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Defects</p>
                  <p className="text-2xl font-bold">{projectStats.totalDefects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Coverage</p>
                  <p className={`text-2xl font-bold ${getCoverageColor(projectStats.averageCoverage)}`}>
                    {projectStats.averageCoverage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requirements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="p1">E-commerce Platform</SelectItem>
                  <SelectItem value="p2">Mobile App</SelectItem>
                  <SelectItem value="p3">API Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Traceability Matrix Table */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements Coverage Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-center">Test Cases</TableHead>
                    <TableHead className="text-center">Executions</TableHead>
                    <TableHead className="text-center">Passed/Failed</TableHead>
                    <TableHead className="text-center">Defects</TableHead>
                    <TableHead className="text-center">Design</TableHead>
                    <TableHead className="text-center"><Zap className="h-4 w-4 mx-auto" /></TableHead>
                    <TableHead className="text-center"><TestTube className="h-4 w-4 mx-auto" /></TableHead>
                    <TableHead className="text-center"><Shield className="h-4 w-4 mx-auto" /></TableHead>
                    <TableHead className="text-center"><Monitor className="h-4 w-4 mx-auto" /></TableHead>
                    <TableHead className="text-center">Coverage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.requirementId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.requirementId}</p>
                          <p className="text-sm text-muted-foreground">{item.requirementTitle}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.requirementStatus)}>
                          {item.requirementStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{item.projectName}</TableCell>
                      <TableCell className="text-center">{item.testCasesCount}</TableCell>
                      <TableCell className="text-center">{item.testExecutionsCount}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {item.passedTests}
                          </span>
                          <span>/</span>
                          <span className="flex items-center text-red-600">
                            <XCircle className="h-3 w-3 mr-1" />
                            {item.failedTests}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{item.defectsCount}</TableCell>
                      <TableCell className="text-center">{item.designDocumentsCount}</TableCell>
                      <TableCell className="text-center">{item.automationTestsCount}</TableCell>
                      <TableCell className="text-center">{item.performanceTestsCount}</TableCell>
                      <TableCell className="text-center">{item.securityTestsCount}</TableCell>
                      <TableCell className="text-center">{item.compatibilityTestsCount}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center space-x-2">
                          <Progress value={item.testCoveragePercentage} className="w-16 h-2" />
                          <span className={`text-sm font-medium ${getCoverageColor(item.testCoveragePercentage)}`}>
                            {item.testCoveragePercentage}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TraceabilityMatrix;
