import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, Users, Plus, ArrowLeftRight, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface InvigilationDuty {
  id: string;
  exam_id?: string;
  faculty_id: string;
  faculty_name: string;
  date: string;
  shift: string;
  venue: string;
  co_invigilator_id?: string;
  co_invigilator_name?: string;
  status: string;
}

interface ExchangeRequest {
  id: string;
  duty_id: string;
  requester_id: string;
  requester_name: string;
  target_faculty_id: string;
  target_faculty_name: string;
  reason?: string;
  status: string;
  created_at: string;
}

const Invigilation: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [duties, setDuties] = useState<InvigilationDuty[]>([]);
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);
  const [faculty, setFaculty] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<InvigilationDuty | null>(null);
  
  const [assignForm, setAssignForm] = useState({
    faculty_id: '',
    faculty_name: '',
    date: '',
    shift: '',
    venue: '',
    co_invigilator_id: '',
    co_invigilator_name: '',
  });

  const [exchangeForm, setExchangeForm] = useState({
    target_faculty_id: '',
    target_faculty_name: '',
    reason: '',
  });

  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch duties
      let dutiesQuery = supabase.from('invigilation_duties').select('*').order('date');
      if (!isAdmin && user?.id) {
        dutiesQuery = dutiesQuery.or(`faculty_id.eq.${user.id},co_invigilator_id.eq.${user.id}`);
      }
      const { data: dutiesData } = await dutiesQuery;
      setDuties(dutiesData || []);

      // Fetch exchange requests
      if (isFaculty && user?.id) {
        const { data: exchangeData } = await supabase
          .from('invigilation_exchanges')
          .select('*')
          .or(`requester_id.eq.${user.id},target_faculty_id.eq.${user.id}`)
          .order('created_at', { ascending: false });
        setExchanges(exchangeData || []);
      }

      // Fetch faculty list
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name');
      setFaculty(profilesData || []);

    } catch (error: any) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDuty = async () => {
    try {
      const { error } = await supabase.from('invigilation_duties').insert({
        ...assignForm,
        status: 'assigned',
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'Duty assigned successfully' });
      setIsAssignDialogOpen(false);
      setAssignForm({ faculty_id: '', faculty_name: '', date: '', shift: '', venue: '', co_invigilator_id: '', co_invigilator_name: '' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleRequestExchange = async () => {
    if (!selectedDuty) return;
    try {
      const { error } = await supabase.from('invigilation_exchanges').insert({
        duty_id: selectedDuty.id,
        requester_id: user?.id,
        requester_name: user?.name || '',
        ...exchangeForm,
        status: 'pending',
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'Exchange request sent' });
      setIsExchangeDialogOpen(false);
      setSelectedDuty(null);
      setExchangeForm({ target_faculty_id: '', target_faculty_name: '', reason: '' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleExchangeResponse = async (exchangeId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('invigilation_exchanges')
        .update({ status: accept ? 'accepted' : 'rejected', responded_at: new Date().toISOString() })
        .eq('id', exchangeId);
      if (error) throw error;
      toast({ title: 'Success', description: accept ? 'Exchange accepted' : 'Exchange rejected' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const upcoming = duties.filter(d => new Date(d.date) >= new Date());
  const completed = duties.filter(d => new Date(d.date) < new Date());
  const pendingExchanges = exchanges.filter(e => e.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Invigilation Duty</h2>
          <p className="text-muted-foreground">Manage examination invigilation schedule</p>
        </div>
        {isAdmin && (
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Assign Duty</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Invigilation Duty</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Faculty</Label>
                  <Select onValueChange={(v) => {
                    const f = faculty.find(f => f.id === v);
                    setAssignForm(p => ({ ...p, faculty_id: v, faculty_name: f?.name || '' }));
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select faculty" /></SelectTrigger>
                    <SelectContent>
                      {faculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={assignForm.date} onChange={(e) => setAssignForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <Label>Shift</Label>
                  <Select value={assignForm.shift} onValueChange={(v) => setAssignForm(p => ({ ...p, shift: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning (9AM-12PM)">Morning (9AM-12PM)</SelectItem>
                      <SelectItem value="Afternoon (2PM-5PM)">Afternoon (2PM-5PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Venue</Label>
                  <Input value={assignForm.venue} onChange={(e) => setAssignForm(p => ({ ...p, venue: e.target.value }))} />
                </div>
                <div>
                  <Label>Co-Invigilator (Optional)</Label>
                  <Select onValueChange={(v) => {
                    const f = faculty.find(f => f.id === v);
                    setAssignForm(p => ({ ...p, co_invigilator_id: v, co_invigilator_name: f?.name || '' }));
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select co-invigilator" /></SelectTrigger>
                    <SelectContent>
                      {faculty.filter(f => f.id !== assignForm.faculty_id).map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAssignDuty} className="w-full">Assign Duty</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Duties</p>
            <p className="text-3xl font-bold">{duties.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <p className="text-3xl font-bold text-blue-600">{upcoming.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completed.length}</p>
          </CardContent>
        </Card>
        {isFaculty && (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Pending Exchanges</p>
              <p className="text-3xl font-bold text-orange-600">{pendingExchanges.length}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="duties">
        <TabsList>
          <TabsTrigger value="duties">My Duties</TabsTrigger>
          {isFaculty && <TabsTrigger value="exchanges">Exchange Requests</TabsTrigger>}
        </TabsList>

        <TabsContent value="duties" className="space-y-4">
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : upcoming.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming duties</p>
              </CardContent>
            </Card>
          ) : (
            upcoming.map((duty) => (
              <Card key={duty.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{duty.venue}</h3>
                      <p className="text-sm text-muted-foreground">
                        {duty.co_invigilator_name && `Co-invigilator: ${duty.co_invigilator_name}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Upcoming</Badge>
                      {isFaculty && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedDuty(duty);
                            setIsExchangeDialogOpen(true);
                          }}
                        >
                          <ArrowLeftRight className="h-4 w-4 mr-1" />
                          Request Exchange
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(duty.date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{duty.shift}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{duty.venue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {isFaculty && (
          <TabsContent value="exchanges" className="space-y-4">
            {pendingExchanges.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending exchange requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingExchanges.map((exchange) => (
                <Card key={exchange.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {exchange.requester_id === user?.id 
                            ? `Request sent to ${exchange.target_faculty_name}`
                            : `Request from ${exchange.requester_name}`
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">{exchange.reason}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(exchange.created_at), 'PPp')}
                        </p>
                      </div>
                      {exchange.target_faculty_id === user?.id && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleExchangeResponse(exchange.id, true)}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleExchangeResponse(exchange.id, false)}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                      {exchange.requester_id === user?.id && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Exchange Request Dialog */}
      <Dialog open={isExchangeDialogOpen} onOpenChange={setIsExchangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Duty Exchange</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Exchange With</Label>
              <Select onValueChange={(v) => {
                const f = faculty.find(f => f.id === v);
                setExchangeForm(p => ({ ...p, target_faculty_id: v, target_faculty_name: f?.name || '' }));
              }}>
                <SelectTrigger><SelectValue placeholder="Select faculty" /></SelectTrigger>
                <SelectContent>
                  {faculty.filter(f => f.id !== user?.id).map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason (Optional)</Label>
              <Textarea 
                value={exchangeForm.reason} 
                onChange={(e) => setExchangeForm(p => ({ ...p, reason: e.target.value }))}
                placeholder="Why do you need to exchange?"
              />
            </div>
            <Button onClick={handleRequestExchange} className="w-full">Send Request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invigilation;