
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, FolderPlus, FileText, Palette, CheckSquare, ClipboardList, Bug, Shield, Gauge, Bot } from 'lucide-react';

const WorkflowDiagram = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border shadow-md">
      <div className="text-center mb-4">
        <h3 className="text-base font-semibold text-gray-800 mb-1">QForma Workflow</h3>
        <p className="text-gray-600 text-xs">Complete SDLC Management Process</p>
      </div>
      
      {/* Step 1: Company Domain */}
      <div className="flex flex-col items-center mb-3">
        <div className="bg-qforma-blue text-white rounded-full p-2 mb-1 shadow-md">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="text-center">
          <h4 className="font-medium text-gray-800 text-xs">Company.qforma.app</h4>
          <p className="text-xs text-gray-600">Your subdomain setup</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-3">
        <div className="w-px h-4 bg-gray-300"></div>
      </div>

      {/* Step 2: Create Project */}
      <div className="flex flex-col items-center mb-3">
        <div className="bg-qforma-teal text-white rounded-full p-2 mb-1 shadow-md">
          <FolderPlus className="h-4 w-4" />
        </div>
        <div className="text-center">
          <h4 className="font-medium text-gray-800 text-xs">Create Project</h4>
          <p className="text-xs text-gray-600">Initialize workspace</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-3">
        <div className="w-px h-4 bg-gray-300"></div>
      </div>

      {/* Step 3: Core Planning (Requirements, Design) */}
      <div className="flex justify-center mb-3">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-purple-500 text-white rounded-full p-1.5 mb-1 shadow-sm">
              <FileText className="h-3 w-3" />
            </div>
            <div className="text-center">
              <h5 className="font-medium text-gray-800 text-xs">Requirements</h5>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-500 text-white rounded-full p-1.5 mb-1 shadow-sm">
              <Palette className="h-3 w-3" />
            </div>
            <div className="text-center">
              <h5 className="font-medium text-gray-800 text-xs">Design</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-3">
        <div className="w-px h-4 bg-gray-300"></div>
      </div>

      {/* Step 4: Test Cases */}
      <div className="flex flex-col items-center mb-3">
        <div className="bg-blue-500 text-white rounded-full p-2 mb-1 shadow-md">
          <CheckSquare className="h-4 w-4" />
        </div>
        <div className="text-center">
          <h4 className="font-medium text-gray-800 text-xs">Test Cases</h4>
          <p className="text-xs text-gray-600">Linked to Requirements</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-3">
        <div className="w-px h-4 bg-gray-300"></div>
      </div>

      {/* Step 5: Test Plans */}
      <div className="flex flex-col items-center mb-3">
        <div className="bg-indigo-500 text-white rounded-full p-2 mb-1 shadow-md">
          <ClipboardList className="h-4 w-4" />
        </div>
        <div className="text-center">
          <h4 className="font-medium text-gray-800 text-xs">Test Plans</h4>
          <p className="text-xs text-gray-600">Organize execution</p>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-3">
        <div className="w-px h-4 bg-gray-300"></div>
      </div>

      {/* Step 6: Testing Types */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex flex-col items-center">
          <div className="bg-red-500 text-white rounded-full p-1.5 mb-1 shadow-sm">
            <Shield className="h-3 w-3" />
          </div>
          <div className="text-center">
            <h5 className="font-medium text-gray-800 text-xs">Security</h5>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-yellow-500 text-white rounded-full p-1.5 mb-1 shadow-sm">
            <Gauge className="h-3 w-3" />
          </div>
          <div className="text-center">
            <h5 className="font-medium text-gray-800 text-xs">Performance</h5>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-cyan-500 text-white rounded-full p-1.5 mb-1 shadow-sm">
            <Bot className="h-3 w-3" />
          </div>
          <div className="text-center">
            <h5 className="font-medium text-gray-800 text-xs">Automation</h5>
          </div>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-3">
        <div className="w-px h-4 bg-gray-300"></div>
      </div>

      {/* Step 7: Defect Tracking */}
      <div className="flex flex-col items-center">
        <div className="bg-orange-500 text-white rounded-full p-2 mb-1 shadow-md">
          <Bug className="h-4 w-4" />
        </div>
        <div className="text-center">
          <h4 className="font-medium text-gray-800 text-xs">Defects</h4>
          <p className="text-xs text-gray-600">Track & resolve issues</p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
