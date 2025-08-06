import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  Send,
  Video,
  MessageSquare,
  User
} from 'lucide-react';
import { useAgentActions } from '@/hooks/useAgentActions';

interface AppointmentSchedulerProps {
  applicationId: string;
  clientEmail?: string;
  clientPhone?: string;
}

interface Appointment {
  id: string;
  type: 'phone' | 'video' | 'office' | 'home';
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  location?: string;
}

interface FollowUp {
  id: string;
  type: 'email' | 'sms' | 'call';
  subject: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'opened' | 'failed';
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  applicationId,
  clientEmail = 'client@example.com',
  clientPhone = '+221 77 123 45 67'
}) => {
  const { executeAction, isLoading } = useAgentActions(applicationId);
  const [activeTab, setActiveTab] = useState<'schedule' | 'followup' | 'history'>('schedule');
  
  // États pour la planification
  const [appointmentType, setAppointmentType] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentDuration, setAppointmentDuration] = useState('30');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [appointmentLocation, setAppointmentLocation] = useState('');

  // États pour les relances
  const [followUpType, setFollowUpType] = useState('');
  const [followUpSubject, setFollowUpSubject] = useState('');
  const [followUpMessage, setFollowUpMessage] = useState('');

  // Données simulées
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      type: 'phone',
      date: '2024-01-20',
      time: '14:30',
      duration: 30,
      status: 'scheduled',
      notes: 'Appel pour clarifier les revenus'
    },
    {
      id: '2',
      type: 'office',
      date: '2024-01-18',
      time: '10:00',
      duration: 45,
      status: 'completed',
      notes: 'RDV bureau pour signature',
      location: 'Bureau principal Dakar'
    }
  ]);

  const [followUps] = useState<FollowUp[]>([
    {
      id: '1',
      type: 'email',
      subject: 'Documents complémentaires requis',
      message: 'Bonjour, nous avons besoin de vos 3 derniers bulletins de salaire...',
      sentAt: '2024-01-15T09:30:00Z',
      status: 'opened'
    }
  ]);

  const appointmentTypes = [
    { value: 'phone', label: 'Appel téléphonique', icon: Phone },
    { value: 'video', label: 'Visioconférence', icon: Video },
    { value: 'office', label: 'RDV au bureau', icon: MapPin },
    { value: 'home', label: 'Visite à domicile', icon: User }
  ];

  const followUpTypes = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
    { value: 'call', label: 'Appel de relance', icon: Phone }
  ];

  const handleScheduleAppointment = async () => {
    if (!appointmentType || !appointmentDate || !appointmentTime) {
      return;
    }

    const success = await executeAction('schedule_appointment', {
      type: appointmentType,
      date: appointmentDate,
      time: appointmentTime,
      duration: parseInt(appointmentDuration),
      notes: appointmentNotes,
      location: appointmentLocation,
      clientEmail,
      clientPhone
    });

    if (success) {
      // Reset form
      setAppointmentType('');
      setAppointmentDate('');
      setAppointmentTime('');
      setAppointmentNotes('');
      setAppointmentLocation('');
    }
  };

  const handleSendFollowUp = async () => {
    if (!followUpType || !followUpSubject || !followUpMessage) {
      return;
    }

    const success = await executeAction('send_follow_up', {
      type: followUpType,
      subject: followUpSubject,
      message: followUpMessage,
      recipient: followUpType === 'email' ? clientEmail : clientPhone
    });

    if (success) {
      // Reset form
      setFollowUpType('');
      setFollowUpSubject('');
      setFollowUpMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-warning';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-destructive';
      case 'sent': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'opened': return 'bg-success';
      case 'failed': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Rendez-vous et relances
        </CardTitle>
        
        <div className="flex space-x-2">
          {[
            { key: 'schedule', label: 'Planifier' },
            { key: 'followup', label: 'Relance' },
            { key: 'history', label: 'Historique' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Onglet Planification */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Type de rendez-vous</Label>
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <type.icon className="h-4 w-4 mr-2" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Durée (minutes)</Label>
                <Select value={appointmentDuration} onValueChange={setAppointmentDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label>Heure</Label>
                <Input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>
            </div>

            {(appointmentType === 'office' || appointmentType === 'home') && (
              <div>
                <Label>Lieu</Label>
                <Input
                  placeholder={appointmentType === 'office' ? 'Bureau principal' : 'Adresse du client'}
                  value={appointmentLocation}
                  onChange={(e) => setAppointmentLocation(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label>Notes (optionnel)</Label>
              <Textarea
                placeholder="Objectif du rendez-vous, points à aborder..."
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleScheduleAppointment}
              disabled={!appointmentType || !appointmentDate || !appointmentTime || isLoading}
              className="w-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isLoading ? 'Planification...' : 'Planifier le rendez-vous'}
            </Button>
          </div>
        )}

        {/* Onglet Relance */}
        {activeTab === 'followup' && (
          <div className="space-y-4">
            <div>
              <Label>Type de relance</Label>
              <Select value={followUpType} onValueChange={setFollowUpType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {followUpTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <type.icon className="h-4 w-4 mr-2" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sujet</Label>
              <Input
                placeholder="Objet de la relance"
                value={followUpSubject}
                onChange={(e) => setFollowUpSubject(e.target.value)}
              />
            </div>

            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Contenu de votre message..."
                value={followUpMessage}
                onChange={(e) => setFollowUpMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="p-3 bg-muted/30 rounded-lg text-sm">
              <p><strong>Destinataire:</strong></p>
              <p>{followUpType === 'email' ? clientEmail : clientPhone}</p>
            </div>

            <Button
              onClick={handleSendFollowUp}
              disabled={!followUpType || !followUpSubject || !followUpMessage || isLoading}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Envoi...' : 'Envoyer la relance'}
            </Button>
          </div>
        )}

        {/* Onglet Historique */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Rendez-vous</h4>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {appointmentTypes.find(t => t.value === appointment.type)?.icon && (
                        React.createElement(appointmentTypes.find(t => t.value === appointment.type)!.icon, {
                          className: "h-4 w-4 text-muted-foreground"
                        })
                      )}
                      <div>
                        <p className="font-medium">
                          {appointmentTypes.find(t => t.value === appointment.type)?.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(appointment.date, appointment.time)} • {appointment.duration}min
                        </p>
                        {appointment.notes && (
                          <p className="text-xs text-muted-foreground">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status === 'scheduled' ? 'Planifié' : 
                       appointment.status === 'completed' ? 'Terminé' : 'Annulé'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Relances</h4>
              <div className="space-y-3">
                {followUps.map((followUp) => (
                  <div key={followUp.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {followUpTypes.find(t => t.value === followUp.type)?.icon && (
                        React.createElement(followUpTypes.find(t => t.value === followUp.type)!.icon, {
                          className: "h-4 w-4 text-muted-foreground"
                        })
                      )}
                      <div>
                        <p className="font-medium">{followUp.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(followUp.sentAt).toLocaleDateString('fr-FR')} • {followUp.type.toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {followUp.message}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(followUp.status)}>
                      {followUp.status === 'sent' ? 'Envoyé' :
                       followUp.status === 'delivered' ? 'Livré' :
                       followUp.status === 'opened' ? 'Lu' : 'Échec'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};