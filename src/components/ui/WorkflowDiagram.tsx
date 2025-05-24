
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, FolderPlus, FileText, Palette, CheckSquare, ClipboardList, Bug, Shield, Gauge, Bot } from 'lucide-react';

const WorkflowDiagram = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 border shadow-lg">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">QForma Workflow</h3>
        <p className="text-gray-600 text-sm">Complete SDLC Management Process</p>
      </div>
      
      {/* Step 1: Company Domain */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-qforma-blue text-white rounded-full p-4 mb-3 shadow-lg">
          <Building2 className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800">Company.qforma.app</h4>
          <p className="text-sm text-gray-600">Your subdomain setup</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-6">
        <div className="w-px h-8 bg-gray-300"></div>
      </div>

      {/* Step 2: Create Project */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-qforma-teal text-white rounded-full p-4 mb-3 shadow-lg">
          <FolderPlus className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800">Create Project</h4>
          <p className="text-sm text-gray-600">Initialize your SDLC workspace</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-6">
        <div className="w-px h-8 bg-gray-300"></div>
      </div>

      {/* Step 3: Core Planning (Requirements, Design) */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-purple-500 text-white rounded-full p-3 mb-2 shadow-md">
              <FileText className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h5 className="font-medium text-gray-800 text-sm">Requirements</h5>
              <p className="text-xs text-gray-600">Define features</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-500 text-white rounded-full p-3 mb-2 shadow-md">
              <Palette className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h5 className="font-medium text-gray-800 text-sm">Design</h5>
              <p className="text-xs text-gray-600">Create blueprints</p>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-6">
        <div className="w-px h-8 bg-gray-300"></div>
      </div>

      {/* Step 4: Test Cases */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-blue-500 text-white rounded-full p-4 mb-3 shadow-lg">
          <CheckSquare className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800">Test Cases</h4>
          <p className="text-sm text-gray-600">Linked to Requirements & Design</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-6">
        <div className="w-px h-8 bg-gray-300"></div>
      </div>

      {/* Step 5: Test Plans */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-indigo-500 text-white rounded-full p-4 mb-3 shadow-lg">
          <ClipboardList className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800">Test Plans</h4>
          <p className="text-sm text-gray-600">Organize test execution</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-6">
        <div className="w-px h-8 bg-gray-300"></div>
      </div>

      {/* Step 6: Testing Types */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center">
          <div className="bg-red-500 text-white rounded-full p-3 mb-2 shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h5 className="font-medium text-gray-800 text-sm">Security</h5>
            <p className="text-xs text-gray-600">Test security</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-yellow-500 text-white rounded-full p-3 mb-2 shadow-md">
            <Gauge className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h5 className="font-medium text-gray-800 text-sm">Performance</h5>
            <p className="text-xs text-gray-600">Load testing</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-cyan-500 text-white rounded-full p-3 mb-2 shadow-md">
            <Bot className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h5 className="font-medium text-gray-800 text-sm">Automation</h5>
            <p className="text-xs text-gray-600">AI-powered</p>
          </div>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-6">
        <div className="w-px h-8 bg-gray-300"></div>
      </div>

      {/* Step 7: Defect Tracking */}
      <div className="flex flex-col items-center">
        <div className="bg-orange-500 text-white rounded-full p-4 mb-3 shadow-lg">
          <Bug className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-gray-800">Defects</h4>
          <p className="text-sm text-gray-600">Track & resolve issues</p>
        </div>
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
        {/* You can add connecting lines here if needed */}
      </svg>
    </div>
  );
};

export default WorkflowDiagram;
