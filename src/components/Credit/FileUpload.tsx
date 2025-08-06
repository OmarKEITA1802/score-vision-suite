import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, X, Download, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'uploading' | 'uploaded' | 'error';
  category: 'identity' | 'income' | 'bank' | 'guarantee' | 'other';
  progress?: number;
}

interface FileUploadProps {
  applicationId: string;
  readonly?: boolean;
  maxFiles?: number;
  maxSizePerFile?: number; // en MB
  acceptedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  applicationId,
  readonly = false,
  maxFiles = 10,
  maxSizePerFile = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx']
}) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'piece_identite.pdf',
      size: 1024000,
      type: 'application/pdf',
      uploadDate: new Date('2024-01-15T10:30:00'),
      status: 'uploaded',
      category: 'identity'
    },
    {
      id: '2',
      name: 'bulletins_salaire.pdf',
      size: 2048000,
      type: 'application/pdf',
      uploadDate: new Date('2024-01-15T10:35:00'),
      status: 'uploaded',
      category: 'income'
    }
  ]);
  const [dragActive, setDragActive] = useState(false);

  const fileCategories = {
    identity: { label: 'Pièce d\'identité', color: 'bg-blue-100 text-blue-800' },
    income: { label: 'Justificatifs revenus', color: 'bg-green-100 text-green-800' },
    bank: { label: 'Relevés bancaires', color: 'bg-purple-100 text-purple-800' },
    guarantee: { label: 'Garanties', color: 'bg-orange-100 text-orange-800' },
    other: { label: 'Autres', color: 'bg-gray-100 text-gray-800' }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    if (readonly) return;

    // Vérifications
    if (files.length + fileList.length > maxFiles) {
      toast({
        variant: 'destructive',
        title: 'Limite dépassée',
        description: `Maximum ${maxFiles} fichiers autorisés`,
      });
      return;
    }

    const validFiles = fileList.filter(file => {
      // Vérifier la taille
      if (file.size > maxSizePerFile * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Fichier trop volumineux',
          description: `${file.name} dépasse la limite de ${maxSizePerFile}MB`,
        });
        return false;
      }
      return true;
    });

    // Simuler l'upload
    validFiles.forEach(file => {
      const newFile: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        status: 'uploading',
        category: 'other',
        progress: 0
      };

      setFiles(prev => [...prev, newFile]);

      // Simuler le processus d'upload
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === newFile.id && f.progress !== undefined && f.progress < 100) {
            const newProgress = f.progress + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, progress: 100, status: 'uploaded' };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);
    });

    toast({
      title: 'Upload en cours',
      description: `${validFiles.length} fichier(s) en cours d'upload`,
    });
  };

  const removeFile = (fileId: string) => {
    if (readonly) return;
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: 'Fichier supprimé',
      description: 'Le fichier a été retiré de la demande',
    });
  };

  const updateFileCategory = (fileId: string, category: FileItem['category']) => {
    if (readonly) return;
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, category } : f));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('doc')) return '📝';
    return '📎';
  };

  const getStatusIcon = (status: FileItem['status']) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2 text-primary" />
          Pièces Justificatives
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Zone d'upload */}
        {!readonly && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Glissez-déposez vos fichiers ici ou
            </p>
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                Parcourir les fichiers
                <input
                  type="file"
                  multiple
                  accept={acceptedTypes.join(',')}
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Max {maxSizePerFile}MB par fichier • {acceptedTypes.join(', ')}
            </p>
          </div>
        )}

        {/* Infos sur les types de fichiers requis */}
        <Alert>
          <File className="h-4 w-4" />
          <AlertDescription>
            <strong>Documents recommandés :</strong> Pièce d'identité, 3 derniers bulletins de salaire, 
            relevés bancaires (3 mois), justificatifs de garanties.
          </AlertDescription>
        </Alert>

        {/* Liste des fichiers */}
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun fichier attaché</p>
            </div>
          ) : (
            files.map((file) => (
              <div key={file.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{file.name}</span>
                        {getStatusIcon(file.status)}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.uploadDate.toLocaleDateString('fr-FR')}</span>
                      </div>
                      {file.status === 'uploading' && file.progress !== undefined && (
                        <Progress value={file.progress} className="w-full mt-2" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Catégorie */}
                    {!readonly ? (
                      <select
                        value={file.category}
                        onChange={(e) => updateFileCategory(file.id, e.target.value as FileItem['category'])}
                        className="text-xs border rounded px-2 py-1"
                      >
                        {Object.entries(fileCategories).map(([key, cat]) => (
                          <option key={key} value={key}>{cat.label}</option>
                        ))}
                      </select>
                    ) : (
                      <Badge className={fileCategories[file.category].color}>
                        {fileCategories[file.category].label}
                      </Badge>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {!readonly && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistiques */}
        {files.length > 0 && (
          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>{files.length} / {maxFiles} fichiers</span>
            <span>
              Total: {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};