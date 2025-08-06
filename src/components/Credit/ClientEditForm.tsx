import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ClientData } from '@/services/creditService';
import { Save, X } from 'lucide-react';

interface ClientEditFormProps {
  client: ClientData;
  onSave: (updates: Partial<ClientData>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClientEditForm: React.FC<ClientEditFormProps> = ({
  client,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email,
    phone: client.phone || '',
    address: client.address || '',
    profession: client.profession || '',
    monthlyIncome: client.monthlyIncome || 0,
    currentDebt: client.currentDebt || 0,
    status: client.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      ...formData,
      debtRatio: formData.monthlyIncome > 0 ? formData.currentDebt / formData.monthlyIncome : 0
    };
    
    onSave(updates);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle>Modifier le client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => handleChange('profession', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyIncome">Revenus mensuels (FCFA)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => handleChange('monthlyIncome', Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="currentDebt">Dettes actuelles (FCFA)</Label>
              <Input
                id="currentDebt"
                type="number"
                value={formData.currentDebt}
                onChange={(e) => handleChange('currentDebt', Number(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="INACTIVE">Inactif</SelectItem>
                <SelectItem value="BLACKLISTED">Liste noire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Annuler</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};