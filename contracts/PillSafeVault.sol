// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract PillSafeVault is SepoliaConfig {
    using FHE for *;
    
    struct Prescription {
        euint32 prescriptionId;
        euint32 patientId;
        euint32 doctorId;
        euint32 medicationId;
        euint32 dosage;
        euint32 frequency;
        euint32 duration;
        bool isActive;
        bool isVerified;
        string medicationName;
        string instructions;
        address patient;
        address doctor;
        uint256 createdAt;
        uint256 expiresAt;
    }
    
    struct Patient {
        euint32 patientId;
        euint32 age;
        euint32 weight;
        bool isActive;
        string name;
        address wallet;
        uint256 registeredAt;
    }
    
    struct Doctor {
        euint32 doctorId;
        euint32 licenseNumber;
        bool isVerified;
        bool isActive;
        string name;
        string specialization;
        address wallet;
        uint256 registeredAt;
    }
    
    struct Medication {
        euint32 medicationId;
        euint32 stockQuantity;
        euint32 price;
        bool isAvailable;
        string name;
        string description;
        address pharmacy;
        uint256 addedAt;
    }
    
    struct PrescriptionHistory {
        euint32 historyId;
        euint32 prescriptionId;
        euint32 refillCount;
        euint32 totalDosage;
        bool isCompleted;
        address patient;
        uint256 lastRefill;
        uint256 createdAt;
    }
    
    mapping(uint256 => Prescription) public prescriptions;
    mapping(uint256 => Patient) public patients;
    mapping(uint256 => Doctor) public doctors;
    mapping(uint256 => Medication) public medications;
    mapping(uint256 => PrescriptionHistory) public prescriptionHistories;
    mapping(address => euint32) public patientReputation;
    mapping(address => euint32) public doctorReputation;
    mapping(address => euint32) public pharmacyReputation;
    
    uint256 public prescriptionCounter;
    uint256 public patientCounter;
    uint256 public doctorCounter;
    uint256 public medicationCounter;
    uint256 public historyCounter;
    
    address public owner;
    address public verifier;
    
    event PrescriptionCreated(uint256 indexed prescriptionId, address indexed patient, address indexed doctor);
    event PatientRegistered(uint256 indexed patientId, address indexed wallet);
    event DoctorRegistered(uint256 indexed doctorId, address indexed wallet);
    event MedicationAdded(uint256 indexed medicationId, address indexed pharmacy);
    event PrescriptionVerified(uint256 indexed prescriptionId, bool isVerified);
    event PrescriptionRefilled(uint256 indexed prescriptionId, uint256 indexed historyId);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function registerPatient(
        string memory _name,
        externalEuint32 age,
        externalEuint32 weight,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Patient name cannot be empty");
        
        uint256 patientId = patientCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAge = FHE.fromExternal(age, inputProof);
        euint32 internalWeight = FHE.fromExternal(weight, inputProof);
        
        patients[patientId] = Patient({
            patientId: FHE.asEuint32(0), // Will be set properly later
            age: internalAge,
            weight: internalWeight,
            isActive: true,
            name: _name,
            wallet: msg.sender,
            registeredAt: block.timestamp
        });
        
        emit PatientRegistered(patientId, msg.sender);
        return patientId;
    }
    
    function registerDoctor(
        string memory _name,
        string memory _specialization,
        externalEuint32 licenseNumber,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Doctor name cannot be empty");
        require(bytes(_specialization).length > 0, "Specialization cannot be empty");
        
        uint256 doctorId = doctorCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalLicenseNumber = FHE.fromExternal(licenseNumber, inputProof);
        
        doctors[doctorId] = Doctor({
            doctorId: FHE.asEuint32(0), // Will be set properly later
            licenseNumber: internalLicenseNumber,
            isVerified: false,
            isActive: true,
            name: _name,
            specialization: _specialization,
            wallet: msg.sender,
            registeredAt: block.timestamp
        });
        
        emit DoctorRegistered(doctorId, msg.sender);
        return doctorId;
    }
    
    function addMedication(
        string memory _name,
        string memory _description,
        externalEuint32 stockQuantity,
        externalEuint32 price,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Medication name cannot be empty");
        
        uint256 medicationId = medicationCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalStockQuantity = FHE.fromExternal(stockQuantity, inputProof);
        euint32 internalPrice = FHE.fromExternal(price, inputProof);
        
        medications[medicationId] = Medication({
            medicationId: FHE.asEuint32(0), // Will be set properly later
            stockQuantity: internalStockQuantity,
            price: internalPrice,
            isAvailable: true,
            name: _name,
            description: _description,
            pharmacy: msg.sender,
            addedAt: block.timestamp
        });
        
        emit MedicationAdded(medicationId, msg.sender);
        return medicationId;
    }
    
    function createPrescription(
        uint256 _patientId,
        uint256 _doctorId,
        uint256 _medicationId,
        string memory _medicationName,
        string memory _instructions,
        externalEuint32 dosage,
        externalEuint32 frequency,
        externalEuint32 duration,
        uint256 _expiresAt,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(patients[_patientId].wallet != address(0), "Patient does not exist");
        require(doctors[_doctorId].wallet == msg.sender, "Only registered doctor can create prescription");
        require(medications[_medicationId].pharmacy != address(0), "Medication does not exist");
        require(_expiresAt > block.timestamp, "Expiration time must be in the future");
        
        uint256 prescriptionId = prescriptionCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalDosage = FHE.fromExternal(dosage, inputProof);
        euint32 internalFrequency = FHE.fromExternal(frequency, inputProof);
        euint32 internalDuration = FHE.fromExternal(duration, inputProof);
        
        prescriptions[prescriptionId] = Prescription({
            prescriptionId: FHE.asEuint32(0), // Will be set properly later
            patientId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            doctorId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            medicationId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            dosage: internalDosage,
            frequency: internalFrequency,
            duration: internalDuration,
            isActive: true,
            isVerified: false,
            medicationName: _medicationName,
            instructions: _instructions,
            patient: patients[_patientId].wallet,
            doctor: msg.sender,
            createdAt: block.timestamp,
            expiresAt: _expiresAt
        });
        
        emit PrescriptionCreated(prescriptionId, patients[_patientId].wallet, msg.sender);
        return prescriptionId;
    }
    
    function refillPrescription(
        uint256 prescriptionId,
        externalEuint32 refillAmount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(prescriptions[prescriptionId].patient == msg.sender, "Only patient can refill prescription");
        require(prescriptions[prescriptionId].isActive, "Prescription is not active");
        require(block.timestamp <= prescriptions[prescriptionId].expiresAt, "Prescription has expired");
        
        uint256 historyId = historyCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalRefillAmount = FHE.fromExternal(refillAmount, inputProof);
        
        prescriptionHistories[historyId] = PrescriptionHistory({
            historyId: FHE.asEuint32(0), // Will be set properly later
            prescriptionId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            refillCount: FHE.add(prescriptionHistories[historyId].refillCount, FHE.asEuint32(1)),
            totalDosage: FHE.add(prescriptionHistories[historyId].totalDosage, internalRefillAmount),
            isCompleted: false,
            patient: msg.sender,
            lastRefill: block.timestamp,
            createdAt: block.timestamp
        });
        
        emit PrescriptionRefilled(prescriptionId, historyId);
        return historyId;
    }
    
    function verifyPrescription(uint256 prescriptionId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify prescriptions");
        require(prescriptions[prescriptionId].patient != address(0), "Prescription does not exist");
        
        prescriptions[prescriptionId].isVerified = isVerified;
        emit PrescriptionVerified(prescriptionId, isVerified);
    }
    
    function verifyDoctor(uint256 doctorId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify doctors");
        require(doctors[doctorId].wallet != address(0), "Doctor does not exist");
        
        doctors[doctorId].isVerified = isVerified;
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Determine user type based on context
        if (patients[patientCounter - 1].wallet == user) {
            patientReputation[user] = reputation;
        } else if (doctors[doctorCounter - 1].wallet == user) {
            doctorReputation[user] = reputation;
        } else {
            pharmacyReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getPrescriptionInfo(uint256 prescriptionId) public view returns (
        string memory medicationName,
        string memory instructions,
        uint8 dosage,
        uint8 frequency,
        uint8 duration,
        bool isActive,
        bool isVerified,
        address patient,
        address doctor,
        uint256 createdAt,
        uint256 expiresAt
    ) {
        Prescription storage prescription = prescriptions[prescriptionId];
        return (
            prescription.medicationName,
            prescription.instructions,
            0, // FHE.decrypt(prescription.dosage) - will be decrypted off-chain
            0, // FHE.decrypt(prescription.frequency) - will be decrypted off-chain
            0, // FHE.decrypt(prescription.duration) - will be decrypted off-chain
            prescription.isActive,
            prescription.isVerified,
            prescription.patient,
            prescription.doctor,
            prescription.createdAt,
            prescription.expiresAt
        );
    }
    
    function getPatientInfo(uint256 patientId) public view returns (
        string memory name,
        uint8 age,
        uint8 weight,
        bool isActive,
        address wallet,
        uint256 registeredAt
    ) {
        Patient storage patient = patients[patientId];
        return (
            patient.name,
            0, // FHE.decrypt(patient.age) - will be decrypted off-chain
            0, // FHE.decrypt(patient.weight) - will be decrypted off-chain
            patient.isActive,
            patient.wallet,
            patient.registeredAt
        );
    }
    
    function getDoctorInfo(uint256 doctorId) public view returns (
        string memory name,
        string memory specialization,
        uint8 licenseNumber,
        bool isVerified,
        bool isActive,
        address wallet,
        uint256 registeredAt
    ) {
        Doctor storage doctor = doctors[doctorId];
        return (
            doctor.name,
            doctor.specialization,
            0, // FHE.decrypt(doctor.licenseNumber) - will be decrypted off-chain
            doctor.isVerified,
            doctor.isActive,
            doctor.wallet,
            doctor.registeredAt
        );
    }
    
    function getMedicationInfo(uint256 medicationId) public view returns (
        string memory name,
        string memory description,
        uint8 stockQuantity,
        uint8 price,
        bool isAvailable,
        address pharmacy,
        uint256 addedAt
    ) {
        Medication storage medication = medications[medicationId];
        return (
            medication.name,
            medication.description,
            0, // FHE.decrypt(medication.stockQuantity) - will be decrypted off-chain
            0, // FHE.decrypt(medication.price) - will be decrypted off-chain
            medication.isAvailable,
            medication.pharmacy,
            medication.addedAt
        );
    }
    
    function getPatientReputation(address patient) public view returns (uint8) {
        return 0; // FHE.decrypt(patientReputation[patient]) - will be decrypted off-chain
    }
    
    function getDoctorReputation(address doctor) public view returns (uint8) {
        return 0; // FHE.decrypt(doctorReputation[doctor]) - will be decrypted off-chain
    }
    
    function getPharmacyReputation(address pharmacy) public view returns (uint8) {
        return 0; // FHE.decrypt(pharmacyReputation[pharmacy]) - will be decrypted off-chain
    }
    
    function deactivatePrescription(uint256 prescriptionId) public {
        require(prescriptions[prescriptionId].patient == msg.sender || 
                prescriptions[prescriptionId].doctor == msg.sender, 
                "Only patient or doctor can deactivate prescription");
        require(prescriptions[prescriptionId].patient != address(0), "Prescription does not exist");
        
        prescriptions[prescriptionId].isActive = false;
    }
}
