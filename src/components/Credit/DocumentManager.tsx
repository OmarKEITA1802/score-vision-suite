import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAgentActions } from '@/hooks/useAgentActions';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  status: 'pending' | 'verified' | 'rejected';
  category: 'identity' | 'income' | 'guarantee' | 'other';
  url?: string;
}

interface DocumentManagerProps {
  applicationId: string;
  readonly?: boolean;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  applicationId,
  readonly = false
}) => {
  const { executeAction } = useAgentActions(applicationId);
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Carte d\'identité nationale.pdf',
      type: 'PDF',
      size: '2.1 MB',
      uploadDate: '2024-01-15T10:30:00Z',
      uploadedBy: 'Client',
      status: 'verified',
      category: 'identity'
    },
    {
      id: '2',
      name: 'Bulletin de salaire Janvier 2024.pdf',
      type: 'PDF', 
      size: '1.8 MB',
      uploadDate: '2024-01-15T10:35:00Z',
      uploadedBy: 'Client',
      status: 'verified',
      category: 'income'
    },
    {
      id: '3',
      name: 'Bulletin de salaire Décembre 2023.pdf',
      type: 'PDF',
      size: '1.7 MB', 
      uploadDate: '2024-01-15T10:36:00Z',
      uploadedBy: 'Client',
      status: 'pending',
      category: 'income'
    },
    {
      id: '4',
      name: 'Attestation de travail.pdf',
      type: 'PDF',
      size: '850 KB',
      uploadDate: '2024-01-15T10:38:00Z',
      uploadedBy: 'Agent - Marie Dupont',
      status: 'verified',
      category: 'income'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadingFile, setUploadingFile] = useState(false);

  const categories = [
    { value: 'all', label: 'Tous les documents', count: documents.length },
    { value: 'identity', label: 'Pièces d\'identité', count: documents.filter(d => d.category === 'identity').length },
    { value: 'income', label: 'Justificatifs revenus', count: documents.filter(d => d.category === 'income').length },
    { value: 'guarantee', label: 'Garanties', count: documents.filter(d => d.category === 'guarantee').length },
    { value: 'other', label: 'Autres', count: documents.filter(d => d.category === 'other').length }
  ];

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'Vérifié';
      case 'rejected':
        return 'Rejeté';
      case 'pending':
        return 'En attente';
    }
  };

  const getCategoryLabel = (category: Document['category']) => {
    switch (category) {
      case 'identity':
        return 'Identité';
      case 'income':
        return 'Revenus';
      case 'guarantee':
        return 'Garantie';
      case 'other':
        return 'Autre';
    }
  };

  const handleDownload = async (document: Document) => {
    await executeAction('download_document', {
      documentId: document.id,
      documentName: document.name
    });
    
    // Simulation du téléchargement
    const link = globalThis.document.createElement('a');
    link.href = '#';
    link.download = document.name;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
  };

  const handleUpload = async (file: File, category: string) => {
    setUploadingFile(true);
    
    try {
      await executeAction('upload_document', {
        fileName: file.name,
        fileSize: file.size,
        category
      });
      
      // Simulation de l'upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } finally {
      setUploadingFile(false);
    }
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Gestion des justificatifs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="text-xs"
            >
              {category.label} ({category.count})
            </Button>
          ))}
        </div>

        <Separator />

        {/* Zone d'upload */}
        {!readonly && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center space-y-3">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Ajouter un nouveau document</p>
              <p className="text-xs text-muted-foreground">
                Glissez-déposez un fichier ici ou cliquez pour sélectionner
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              disabled={uploadingFile}
              onClick={() => {
                const input = globalThis.document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.jpg,.jpeg,.png';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handleUpload(file, selectedCategory === 'all' ? 'other' : selectedCategory);
                  }
                };
                input.click();
              }}
            >
              {uploadingFile ? 'Upload en cours...' : 'Sélectionner un fichier'}
            </Button>
          </div>
        )}

        {/* Liste des documents */}
        <div className="space-y-3">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{document.name}</p>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span>{document.type} • {document.size}</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {document.uploadedBy}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-xs">
                  {getCategoryLabel(document.category)}
                </Badge>
                
                <div className="flex items-center space-x-1">
                  {getStatusIcon(document.status)}
                  <span className="text-xs">{getStatusLabel(document.status)}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('#', '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucun document dans cette catégorie</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};