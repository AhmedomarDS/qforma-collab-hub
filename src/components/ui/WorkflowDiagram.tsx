
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, FolderPlus, FileText, Palette, CheckSquare, ClipboardList, Bug, Shield, Gauge, Bot } from 'lucide-react';

const WorkflowDiagram = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">QForma Workflow</h3>
        <p className="text-gray-600 text-xs">Complete SDLC Management Process</p>
      </div>
      
      {/* Step 1: Company Domain */}
      <div className="flex flex-col items-center mb-4">
        <div className="bg-qforma-blue text-white rounded-full p-3 mb-2 shadow-lg">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800 text-sm">Company.qforma.app</h4>
          <p className="text-xs text-gray-600">Your subdomain setup</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-4">
        <div className="w-px h-6 bg-gray-300"></div>
      </div>

      {/* Step 2: Create Project */}
      <div className="flex flex-col items-center mb-4">
        <div className="bg-qforma-teal text-white rounded-full p-3 mb-2 shadow-lg">
          <FolderPlus className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800 text-sm">Create Project</h4>
          <p className="text-xs text-gray-600">Initialize your SDLC workspace</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-4">
        <div className="w-px h-6 bg-gray-300"></div>
      </div>

      {/* Step 3: Core Planning (Requirements, Design) */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-purple-500 text-white rounded-full p-2 mb-1 shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <div className="text-center">
              <h5 className="font-medium text-gray-800 text-xs">Requirements</h5>
              <p className="text-xs text-gray-600">Define features</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-500 text-white rounded-full p-2 mb-1 shadow-md">
              <Palette className="h-5 w-5" />
            </div>
            <div className="text-center">
              <h5 className="font-medium text-gray-800 text-xs">Design</h5>
              <p className="text-xs text-gray-600">Create blueprints</p>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-4">
        <div className="w-px h-6 bg-gray-300"></div>
      </div>

      {/* Step 4: Test Cases */}
      <div className="flex flex-col items-center mb-4">
        <div className="bg-blue-500 text-white rounded-full p-3 mb-2 shadow-lg">
          <CheckSquare className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800 text-sm">Test Cases</h4>
          <p className="text-xs text-gray-600">Linked to Requirements & Design</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-4">
        <div className="w-px h-6 bg-gray-300"></div>
      </div>

      {/* Step 5: Test Plans */}
      <div className="flex flex-col items-center mb-4">
        <div className="bg-indigo-500 text-white rounded-full p-3 mb-2 shadow-lg">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800 text-sm">Test Plans</h4>
          <p className="text-xs text-gray-600">Organize test execution</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-4">
        <div className="w-px h-6 bg-gray-300"></div>
      </div>

      {/* Step 6: Testing Types */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex flex-col items-center">
          <div className="bg-red-500 text-white rounded-full p-2 mb-1 shadow-md">
            <Shield className="h-5 w-5" />
          </div>
          <div className="text-center">
            <h5 className="font-medium text-gray-800 text-xs">Security</h5>
            <p className="text-xs text-gray-600">Test security</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-yellow-500 text-white rounded-full p-2 mb-1 shadow-md">
            <Gauge className="h-5 w-5" />
          </div>
          <div className="text-center">
            <h5 className="font-medium text-gray-800 text-xs">Performance</h5>
            <p className="text-xs text-gray-600">Load testing</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-cyan-500 text-white rounded-full p-2 mb-1 shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div className="text-center">
            <h5 className="font-medium text-gray-800 text-xs">Automation</h5>
            <p className="text-xs text-gray-600">AI-powered</p>
          </div>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-4">
        <div className="w-px h-6 bg-gray-300"></div>
      </div>

      {/* Step 7: Defect Tracking */}
      <div className="flex flex-col items-center">
        <div className="bg-orange-500 text-white rounded-full p-3 mb-2 shadow-lg">
          <Bug className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800 text-sm">Defects</h4>
          <p className="text-xs text-gray-600">Track & resolve issues</p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
