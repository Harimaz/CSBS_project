import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface ExamCardProps {
  subject: string;
  code: string;
  date: string;
  time: string;
  venue?: string;
  type: 'CAT' | 'Semester' | 'Lab';
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const ExamCard: React.FC<ExamCardProps> = ({
  subject,
  code,
  date,
  time,
  venue,
  type,
  status,
}) => {
  const typeColors = {
    CAT: 'bg-blue-100 text-blue-700 border-blue-200',
    Semester: 'bg-purple-100 text-purple-700 border-purple-200',
    Lab: 'bg-green-100 text-green-700 border-green-200',
  };

  const statusColors = {
    upcoming: 'badge-warning',
    ongoing: 'badge-success',
    completed: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border/50 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{subject}</h4>
          <p className="text-sm text-muted-foreground">{code}</p>
        </div>
        <Badge className={typeColors[type]} variant="outline">
          {type}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{time}</span>
        </div>
        {venue && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{venue}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <Badge className={statusColors[status]} variant="outline">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
    </div>
  );
};
