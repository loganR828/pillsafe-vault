import { useState } from "react";
import { Header } from "@/components/Header";
import { PrescriptionCard } from "@/components/PrescriptionCard";
import { WalletComponent } from "@/components/WalletComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, PILLSAFE_VAULT_ABI } from '@/lib/wallet';

const samplePrescriptions = [
  {
    id: "px_2024_001_4f7a8b9c2d1e",
    patientName: "Sarah Johnson",
    doctorName: "Dr. Michael Chen",
    medication: "Lisinopril 10mg",
    dosage: "Once daily",
    date: "2024-01-15",
    pharmacy: "CVS Pharmacy #1234",
    status: "encrypted" as const,
    encryptionLevel: "AES-256-FHE",
  },
  {
    id: "px_2024_002_9e3f5a6b8c7d",
    patientName: "Robert Davis",
    doctorName: "Dr. Emily Rodriguez",
    medication: "Metformin 500mg",
    dosage: "Twice daily with meals",
    date: "2024-01-14",
    pharmacy: "Walgreens #5678",
    status: "verified" as const,
    encryptionLevel: "RSA-4096",
  },
  {
    id: "px_2024_003_1a4b7c9e2f8d",
    patientName: "Lisa Anderson",
    doctorName: "Dr. James Wilson",
    medication: "Atorvastatin 20mg",
    dosage: "Once daily at bedtime",
    date: "2024-01-13",
    pharmacy: "Rite Aid #9012",
    status: "pending" as const,
    encryptionLevel: "ECC-P384",
  },
  {
    id: "px_2024_004_6c8d2e5f9a1b",
    patientName: "Michael Brown",
    doctorName: "Dr. Amanda Taylor",
    medication: "Omeprazole 40mg",
    dosage: "Once daily before breakfast",
    date: "2024-01-12",
    pharmacy: "CVS Pharmacy #3456",
    status: "encrypted" as const,
    encryptionLevel: "AES-256-FHE",
  },
  {
    id: "px_2024_005_3f9a1b5c8d2e",
    patientName: "Jennifer Wilson",
    doctorName: "Dr. David Martinez",
    medication: "Sertraline 50mg",
    dosage: "Once daily in morning",
    date: "2024-01-11",
    pharmacy: "Target Pharmacy #7890",
    status: "verified" as const,
    encryptionLevel: "RSA-4096",
  },
  {
    id: "px_2024_006_8b2e5f9a1c4d",
    patientName: "Thomas Garcia",
    doctorName: "Dr. Sarah Thompson",
    medication: "Amlodipine 5mg",
    dosage: "Once daily",
    date: "2024-01-10",
    pharmacy: "Walmart Pharmacy #2345",
    status: "encrypted" as const,
    encryptionLevel: "AES-256-FHE",
  },
];

const Index = () => {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const [prescriptions, setPrescriptions] = useState(samplePrescriptions);
  const [walletKeys, setWalletKeys] = useState([
    { id: "key1", name: "Primary Key", type: "AES-256-FHE", status: "Active" },
    { id: "key2", name: "Backup Key", type: "RSA-4096", status: "Standby" },
    { id: "key3", name: "Recovery Key", type: "Shamir Secret", status: "Stored" },
  ]);

  const handleGeneratePrescription = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // This is a simplified version - in a real implementation, you would use FHE encryption
      const newPrescription = {
        id: `px_2024_${String(prescriptions.length + 1).padStart(3, '0')}_${Math.random().toString(36).substr(2, 12)}`,
        patientName: "New Patient",
        doctorName: "Dr. System Generated",
        medication: "Sample Medication",
        dosage: "As needed",
        date: new Date().toISOString().split('T')[0],
        pharmacy: "Default Pharmacy",
        status: "pending" as const,
        encryptionLevel: "AES-256-FHE",
      };

      setPrescriptions(prev => [newPrescription, ...prev]);
      toast.success("New prescription generated successfully!");
    } catch (error) {
      console.error("Error generating prescription:", error);
      toast.error("Failed to generate prescription");
    }
  };

  const handleGenerateKey = () => {
    const newKey = {
      id: `key${walletKeys.length + 1}`,
      name: `Generated Key ${walletKeys.length + 1}`,
      type: "AES-256-FHE",
      status: "Active"
    };
    setWalletKeys(prev => [...prev, newKey]);
    toast.success("New encryption key generated!");
  };

  const handleRotateKeys = () => {
    setWalletKeys(prev => prev.map(key => ({
      ...key,
      status: key.status === "Active" ? "Rotating" : key.status
    })));
    
    setTimeout(() => {
      setWalletKeys(prev => prev.map(key => ({
        ...key,
        status: key.status === "Rotating" ? "Active" : key.status,
        type: key.status === "Rotating" ? "AES-256-FHE-v2" : key.type
      })));
      toast.success("Encryption keys rotated successfully!");
    }, 2000);

    toast.info("Key rotation in progress...");
  };

  const handleVerifyPrescription = (id: string) => {
    setPrescriptions(prev => prev.map(p => 
      p.id === id ? { ...p, status: "verified" as const } : p
    ));
    toast.success("Prescription verified successfully!");
  };

  const handleDownloadPrescription = (id: string) => {
    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
      // Simulate download
      const blob = new Blob([JSON.stringify(prescription, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${prescription.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Prescription downloaded successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main prescription cards area */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  FHE Encrypted Prescriptions
                </h2>
                <p className="text-muted-foreground">
                  Privacy-preserving prescription management with Fully Homomorphic Encryption
                </p>
              </div>
              <Button 
                onClick={handleGeneratePrescription}
                className="bg-gradient-medical text-primary-foreground hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Prescription
              </Button>
            </div>

            {/* Summary Card */}
            <Card className="mb-6 border-medical-blue/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-medical-blue" />
                  Prescription Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-security-green">
                      {prescriptions.filter(p => p.status === "encrypted").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Encrypted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-medical-blue">
                      {prescriptions.filter(p => p.status === "verified").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Verified</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning-amber">
                      {prescriptions.filter(p => p.status === "pending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prescriptions.map((prescription, index) => (
                <div
                  key={prescription.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <PrescriptionCard 
                    {...prescription} 
                    onVerify={handleVerifyPrescription}
                    onDownload={handleDownloadPrescription}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar with wallet */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <WalletComponent 
                keys={walletKeys}
                onGenerateKey={handleGenerateKey}
                onRotateKeys={handleRotateKeys}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;