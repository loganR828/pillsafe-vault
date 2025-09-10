import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, User, Pill, Lock, Download } from "lucide-react";

interface PrescriptionCardProps {
  id: string;
  patientName: string;
  doctorName: string;
  medication: string;
  dosage: string;
  date: string;
  pharmacy: string;
  status: "encrypted" | "verified" | "pending";
  encryptionLevel: string;
  onVerify?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export const PrescriptionCard = ({
  id,
  patientName,
  doctorName,
  medication,
  dosage,
  date,
  pharmacy,
  status,
  encryptionLevel,
  onVerify,
  onDownload,
}: PrescriptionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "encrypted":
        return "bg-security-green text-security-green-light";
      case "verified":
        return "bg-medical-blue text-medical-blue-light";
      case "pending":
        return "bg-warning-amber text-warning-amber";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "encrypted":
        return <Lock className="w-3 h-3" />;
      case "verified":
        return <Shield className="w-3 h-3" />;
      case "pending":
        return <Calendar className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-hover transition-all duration-300 animate-fade-in group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Pill className="w-5 h-5 text-medical-blue" />
            {medication}
          </CardTitle>
          <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
            {getStatusIcon(status)}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Patient:</span>
            </div>
            <p className="font-medium">{patientName}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Doctor:</span>
            </div>
            <p className="font-medium">{doctorName}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dosage:</span>
            <span className="font-medium">{dosage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pharmacy:</span>
            <span className="font-medium">{pharmacy}</span>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Encryption Level:</span>
            <Badge variant="outline" className="text-xs">
              {encryptionLevel}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Prescription ID:</span>
            <code className="text-xs bg-background/50 px-2 py-1 rounded">
              {id.slice(0, 12)}...
            </code>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-medical text-primary-foreground hover:opacity-90"
            onClick={() => onVerify?.(id)}
            disabled={status === "verified"}
          >
            <Shield className="w-4 h-4 mr-2" />
            {status === "verified" ? "Verified" : "Verify"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDownload?.(id)}
            title="Download Prescription"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};