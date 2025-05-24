
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Folder, FolderPlus, Plus, Edit, Trash2 } from 'lucide-react';
import { useRequirements, RequirementFolder } from '@/contexts/RequirementsContext';

interface FolderManagementProps {
  onFolderSelect: (folderId: string | null) => void;
  selectedFolderId: string | null;
}

const FolderManagement: React.FC<FolderManagementProps> = ({ onFolderSelect, selectedFolderId }) => {
  const { folders, requirements, selectedProjectId, createFolder, updateFolder, deleteFolder, isLoading } = useRequirements();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<RequirementFolder | null>(null);
  const [newFolder, setNewFolder] = useState({
    name: '',
    description: '',
    parent_folder_id: null as string | null,
  });

  const handleCreateFolder = async () => {
    if (!newFolder.name || !selectedProjectId) return;

    try {
      await createFolder({
        ...newFolder,
        project_id: selectedProjectId,
        created_by: 'current-user', // In real app, this would be the logged in user
      });

      setNewFolder({ name: '', description: '', parent_folder_id: null });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleUpdateFolder = async () => {
    if (!editingFolder || !newFolder.name) return;

    try {
      await updateFolder(editingFolder.id, {
        name: newFolder.name,
        description: newFolder.description,
        parent_folder_id: newFolder.parent_folder_id,
      });

      setEditingFolder(null);
      setNewFolder({ name: '', description: '', parent_folder_id: null });
    } catch (error) {
      console.error('Failed to update folder:', error);
    }
  };

  const openEditDialog = (folder: RequirementFolder) => {
    setEditingFolder(folder);
    setNewFolder({
      name: folder.name,
      description: folder.description || '',
      parent_folder_id: folder.parent_folder_id,
    });
  };

  const getRootFolders = () => folders.filter(f => !f.parent_folder_id);
  const getSubFolders = (parentId: string) => folders.filter(f => f.parent_folder_id === parentId);
  const getFolderRequirements = (folderId: string) => requirements.filter(r => r.folder_id === folderId);
  const getUnorganizedRequirements = () => requirements.filter(r => !r.folder_id);

  const renderFolder = (folder: RequirementFolder, level = 0) => {
    const subFolders = getSubFolders(folder.id);
    const folderRequirements = getFolderRequirements(folder.id);
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id} style={{ marginLeft: `${level * 20}px` }}>
        <Card 
          className={`mb-2 cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
          }`}
          onClick={() => onFolderSelect(folder.id)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{folder.name}</span>
                <Badge variant="outline" className="text-xs">
                  {folderRequirements.length} req{folderRequirements.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(folder);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFolder(folder.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {folder.description && (
              <p className="text-sm text-muted-foreground mt-1">{folder.description}</p>
            )}
          </CardContent>
        </Card>
        {subFolders.map(subFolder => renderFolder(subFolder, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Folders</h3>
        <Dialog open={isCreateDialogOpen || !!editingFolder} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setEditingFolder(null);
            setNewFolder({ name: '', description: '', parent_folder_id: null });
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFolder ? 'Edit Folder' : 'Create New Folder'}
              </DialogTitle>
              <DialogDescription>
                {editingFolder ? 'Update folder details' : 'Create a new folder to organize your requirements'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input
                  id="folder-name"
                  value={newFolder.name}
                  onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                  placeholder="Enter folder name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="folder-description">Description (Optional)</Label>
                <Textarea
                  id="folder-description"
                  value={newFolder.description}
                  onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                  placeholder="Enter folder description"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parent-folder">Parent Folder (Optional)</Label>
                <Select
                  value={newFolder.parent_folder_id || "none"}
                  onValueChange={(value) => setNewFolder({
                    ...newFolder,
                    parent_folder_id: value === "none" ? null : value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent (Root Level)</SelectItem>
                    {folders.filter(f => f.id !== editingFolder?.id).map(folder => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingFolder(null);
                setNewFolder({ name: '', description: '', parent_folder_id: null });
              }}>
                Cancel
              </Button>
              <Button
                onClick={editingFolder ? handleUpdateFolder : handleCreateFolder}
                disabled={!newFolder.name || isLoading}
              >
                {editingFolder ? 'Update' : 'Create'} Folder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {/* All Requirements (unfiltered) */}
        <Card 
          className={`cursor-pointer transition-colors ${
            selectedFolderId === null ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
          }`}
          onClick={() => onFolderSelect(null)}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-gray-600" />
              <span className="font-medium">All Requirements</span>
              <Badge variant="outline" className="text-xs">
                {requirements.length} total
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Unorganized Requirements */}
        {getUnorganizedRequirements().length > 0 && (
          <Card 
            className={`cursor-pointer transition-colors ${
              selectedFolderId === 'unorganized' ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
            }`}
            onClick={() => onFolderSelect('unorganized')}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Unorganized</span>
                <Badge variant="outline" className="text-xs">
                  {getUnorganizedRequirements().length} req{getUnorganizedRequirements().length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Root Folders */}
        {getRootFolders().map(folder => renderFolder(folder))}
      </div>
    </div>
  );
};

export default FolderManagement;
