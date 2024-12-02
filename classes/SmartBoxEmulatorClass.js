export default class SmartParcelBoxEmulator {
    constructor() {
        this.locations = [
            { id: 'LOC-A', compartments: [] },
            { id: 'LOC-B', compartments: [] },
            { id: 'LOC-C', compartments: [] }
        ];

        // Initialize compartments for each location
        this.locations.forEach(location => {
            // 4 small compartments
            for (let i = 0; i < 4; i++) {
                location.compartments.push({
                    id: `${location.id}-S-${i + 1}`,
                    size: 'small',
                    occupied: false,
                    locked: true,
                    color: 'blue',
                    adminOTP: this.generateOTP(),
                    userOTP: this.generateOTP()
                });
            }

            // 4 medium compartments
            for (let i = 0; i < 4; i++) {
                location.compartments.push({
                    id: `${location.id}-M-${i + 1}`,
                    size: 'medium',
                    occupied: false,
                    locked: true,
                    color: 'blue',
                    adminOTP: this.generateOTP(),
                    userOTP: this.generateOTP()
                });
            }

            // 4 large compartments
            for (let i = 0; i < 4; i++) {
                location.compartments.push({
                    id: `${location.id}-L-${i + 1}`,
                    size: 'large',
                    occupied: false,
                    locked: true,
                    color: 'blue',
                    adminOTP: this.generateOTP(),
                    userOTP: this.generateOTP()
                });
            }
        });

        this.logs = [];
    }

    // Generate a random 4-digit OTP
    generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Get all compartments across all locations
    getAllCompartments() {
        return this.locations.flatMap(location => location.compartments);
    }

    // Get status of all compartments
    getStatus() {
        return this.getAllCompartments();
    }

    // Find a specific compartment by ID
    findCompartment(compartmentId) {
        return this.getAllCompartments().find(c => c.id === compartmentId);
    }

    // Verify OTP for a specific compartment
    verifyOTP(compartmentId, adminOTP, userOTP) {
        const compartment = this.findCompartment(compartmentId);
        if (!compartment) {
            return { success: false, message: 'Compartment not found.' };
        }

        const scheduledTime = new Date();
        const isScheduleCorrect = true; // Always allow access in this example

        if (adminOTP !== userOTP) {
            this.logEvent({
                event: 'OTP Verification Failed',
                compartmentId,
                details: 'OTP mismatch'
            });
            return { success: false, message: 'OTP mismatch.' };
        }

        // Update compartment status
        compartment.locked = false;
        compartment.color = compartment.occupied ? 'green' : 'blue';

        this.logEvent({
            event: 'OTP Verification Successful',
            compartmentId,
            details: 'Access granted'
        });

        return { 
            success: true, 
            message: 'Access granted.', 
            compartment: compartment 
        };
    }

    // Toggle compartment lock status
    toggleLock(compartmentId, lockStatus) {
        const compartment = this.findCompartment(compartmentId);
        if (compartment) {
            compartment.locked = lockStatus;
            compartment.color = lockStatus ? 'blue' : 'green';
            
            this.logEvent({
                event: lockStatus ? 'Locked' : 'Unlocked',
                compartmentId,
                details: `Compartment ${lockStatus ? 'locked' : 'unlocked'}`
            });

            return { 
                success: true, 
                message: `Compartment ${compartmentId} is now ${lockStatus ? 'locked' : 'unlocked'}.` 
            };
        }
        return { success: false, message: `Compartment ${compartmentId} not found.` };
    }

    // Set occupation status
    setOccupationStatus(compartmentId, isOccupied) {
        const compartment = this.findCompartment(compartmentId);
        if (compartment) {
            compartment.occupied = isOccupied;
            compartment.color = isOccupied ? 'green' : 'blue';
            
            this.logEvent({
                event: isOccupied ? 'Occupied' : 'Vacated',
                compartmentId,
                details: `Compartment marked as ${isOccupied ? 'occupied' : 'vacated'}`
            });

            return { 
                success: true, 
                message: `Compartment ${compartmentId} is now ${isOccupied ? 'occupied' : 'vacated'}.` 
            };
        }
        return { success: false, message: `Compartment ${compartmentId} not found.` };
    }

    // Add log entry
    logEvent(event) {
        const logEntry = { 
            ...event, 
            timestamp: new Date().toISOString() 
        };
        this.logs.push(logEntry);
        return logEntry;
    }

    // Get logs
    getLogs() {
        return this.logs;
    }
};