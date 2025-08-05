import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FilterConfig } from '@/hooks/useAdvancedFilters';
import { 
  Filter, 
  Plus, 
  X, 
  Search, 
  Download, 
  Upload, 
  RotateCcw,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface Field {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  options?: { value: string; label: string }[];
}

interface AdvancedFilterProps {
  fields: Field[];
  filters: FilterConfig[];
  search: string;
  sort: { field: string; direction: 'asc' | 'desc' } | null;
  onAddFilter: (filter: FilterConfig) => void;
  onRemoveFilter: (field: string) => void;
  onClearFilters: () => void;
  onSetSearch: (search: string) => void;
  onSetSort: (field: string, direction: 'asc' | 'desc') => void;
  onClearSort: () => void;
  onExportFilters: () => string;
  onImportFilters: (filters: string) => void;
}

const operators = {
  string: [
    { value: 'contains', label: 'Contient' },
    { value: 'equals', label: 'Égal à' },
    { value: 'startsWith', label: 'Commence par' },
    { value: 'endsWith', label: 'Finit par' },
  ],
  number: [
    { value: 'equals', label: 'Égal à' },
    { value: 'gt', label: 'Supérieur à' },
    { value: 'gte', label: 'Supérieur ou égal' },
    { value: 'lt', label: 'Inférieur à' },
    { value: 'lte', label: 'Inférieur ou égal' },
    { value: 'between', label: 'Entre' },
  ],
  date: [
    { value: 'equals', label: 'Égal à' },
    { value: 'gt', label: 'Après' },
    { value: 'lt', label: 'Avant' },
    { value: 'between', label: 'Entre' },
  ],
  boolean: [
    { value: 'equals', label: 'Égal à' },
  ],
  select: [
    { value: 'equals', label: 'Égal à' },
    { value: 'in', label: 'Dans' },
    { value: 'notIn', label: 'Pas dans' },
  ],
};

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  fields,
  filters,
  search,
  sort,
  onAddFilter,
  onRemoveFilter,
  onClearFilters,
  onSetSearch,
  onSetSort,
  onClearSort,
  onExportFilters,
  onImportFilters,
}) => {
  const [newFilter, setNewFilter] = useState<Partial<FilterConfig>>({});
  const [showAddFilter, setShowAddFilter] = useState(false);

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.operator && newFilter.value !== undefined) {
      const field = fields.find(f => f.key === newFilter.field);
      onAddFilter({
        field: newFilter.field,
        operator: newFilter.operator!,
        value: newFilter.value,
        type: field?.type || 'string',
      });
      setNewFilter({});
      setShowAddFilter(false);
    }
  };

  const renderValueInput = () => {
    const field = fields.find(f => f.key === newFilter.field);
    if (!field) return null;

    if (field.type === 'select') {
      return (
        <Select
          value={newFilter.value}
          onValueChange={(value) => setNewFilter(prev => ({ ...prev, value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border z-50">
            {field.options?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === 'boolean') {
      return (
        <Select
          value={String(newFilter.value)}
          onValueChange={(value) => setNewFilter(prev => ({ ...prev, value: value === 'true' }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border z-50">
            <SelectItem value="true">Oui</SelectItem>
            <SelectItem value="false">Non</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={newFilter.value || ''}
        onChange={(e) => setNewFilter(prev => ({ 
          ...prev, 
          value: field.type === 'number' ? Number(e.target.value) : e.target.value 
        }))}
        placeholder="Valeur..."
      />
    );
  };

  const handleExport = () => {
    const filtersJson = onExportFilters();
    const blob = new Blob([filtersJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filters.json';
    a.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onImportFilters(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres avancés
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recherche globale */}
        <div className="space-y-2">
          <Label>Recherche globale</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSetSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Tri */}
        <div className="space-y-2">
          <Label>Tri</Label>
          <div className="flex gap-2">
            <Select
              value={sort?.field || ''}
              onValueChange={(field) => onSetSort(field, sort?.direction || 'asc')}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Champ à trier..." />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {fields.map(field => (
                  <SelectItem key={field.key} value={field.key}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {sort && (
              <>
                <Button
                  variant={sort.direction === 'asc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSetSort(sort.field, 'asc')}
                >
                  <SortAsc className="h-4 w-4" />
                </Button>
                <Button
                  variant={sort.direction === 'desc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSetSort(sort.field, 'desc')}
                >
                  <SortDesc className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSort}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Filtres actifs */}
        {filters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Filtres actifs ({filters.length})</Label>
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Effacer tout
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => {
                const field = fields.find(f => f.key === filter.field);
                return (
                  <Badge key={filter.field} variant="secondary" className="flex items-center gap-1">
                    <span className="font-medium">{field?.label}</span>
                    <span className="text-muted-foreground">
                      {operators[filter.type]?.find(op => op.value === filter.operator)?.label}
                    </span>
                    <span>{String(filter.value)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => onRemoveFilter(filter.field)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <Separator />

        {/* Ajouter un filtre */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Ajouter un filtre</Label>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Exporter
              </Button>
              <label>
                <Button variant="ghost" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-1" />
                    Importer
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
            </div>
          </div>

          <Popover open={showAddFilter} onOpenChange={setShowAddFilter}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau filtre
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-card border border-border z-50">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Champ</Label>
                  <Select
                    value={newFilter.field}
                    onValueChange={(field) => setNewFilter(prev => ({ ...prev, field, operator: undefined, value: undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un champ..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border z-50">
                      {fields.map(field => (
                        <SelectItem key={field.key} value={field.key}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newFilter.field && (
                  <div className="space-y-2">
                    <Label>Opérateur</Label>
                    <Select
                      value={newFilter.operator}
                      onValueChange={(operator) => setNewFilter(prev => ({ ...prev, operator: operator as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un opérateur..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border z-50">
                        {operators[fields.find(f => f.key === newFilter.field)?.type || 'string']?.map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {newFilter.field && newFilter.operator && (
                  <div className="space-y-2">
                    <Label>Valeur</Label>
                    {renderValueInput()}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddFilter}
                    disabled={!newFilter.field || !newFilter.operator || newFilter.value === undefined}
                    className="flex-1"
                  >
                    Ajouter
                  </Button>
                  <Button variant="ghost" onClick={() => setShowAddFilter(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};