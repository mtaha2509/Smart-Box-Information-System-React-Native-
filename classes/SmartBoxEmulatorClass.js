export default class SmartBoxEmulator {
    constructor(small, medium, large) {
      this.compartments = [];
      this.logs = [];
  
      // Initialize compartments
      for (let i = 0; i < small; i++) {
        this.compartments.push({ 
            id: `S-${i + 1}`, 
            size: 'small', 
            occupied: false, 
            locked: true, 
            color: 'blue' // Initially blue
        });
    }
    for (let i = 0; i < medium; i++) {
        this.compartments.push({ 
            id: `M-${i + 1}`, 
            size: 'medium', 
            occupied: false, 
            locked: true, 
            color: 'blue' // Initially blue
        });
    }
    for (let i = 0; i < large; i++) {
        this.compartments.push({ 
            id: `L-${i + 1}`, 
            size: 'large', 
            occupied: false, 
            locked: true, 
            color: 'blue' // Initially blue
        });
    }
    
    }
  
    // Get compartment status
    getStatus() {
      return this.compartments;
    }
  
    // Lock/Unlock a compartment
    toggleLock(compartmentId, lockStatus) {
      const compartment = this.compartments.find((c) => c.id === compartmentId);
      if (compartment) {
        compartment.locked = lockStatus;
        this.logs.push({ event: lockStatus ? 'Lock' : 'Unlock', id: compartmentId, timestamp: new Date() });
        return { success: true, message: `Compartment ${compartmentId} is now ${lockStatus ? 'locked' : 'unlocked'}.` };
      }
      return { success: false, message: `Compartment ${compartmentId} not found.` };
    }
  
    // Add log entry
    logEvent(event) {
      this.logs.push({ ...event, timestamp: new Date() });
    }
  
    // Get logs
    getLogs() {
      return this.logs;
    }
  }
  