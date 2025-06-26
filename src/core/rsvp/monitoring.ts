
/**
 * CRITICAL: RSVP SYSTEM MONITORING
 * 
 * ⚠️  WARNING: This provides monitoring and alerting for the RSVP system
 * ⚠️  Do not disable monitoring as it helps detect system issues
 */

import { rsvpEvents } from './event-system';
import { checkRsvpIntegrity } from './protected-handler';

interface RsvpMetrics {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageResponseTime: number;
  lastOperationTime: number;
}

class RsvpMonitor {
  private metrics: RsvpMetrics = {
    totalOperations: 0,
    successfulOperations: 0,
    failedOperations: 0,
    averageResponseTime: 0,
    lastOperationTime: 0,
  };

  private operationStartTimes: Map<string, number> = new Map();

  constructor() {
    this.setupEventListeners();
    this.startIntegrityChecks();
  }

  private setupEventListeners() {
    // Monitor RSVP operations
    rsvpEvents.subscribe('rsvp:started', (event) => {
      this.operationStartTimes.set(event.eventId, Date.now());
    });

    rsvpEvents.subscribe('rsvp:completed', (event) => {
      const startTime = this.operationStartTimes.get(event.eventId);
      if (startTime) {
        const duration = Date.now() - startTime;
        this.updateMetrics(event.success, duration);
        this.operationStartTimes.delete(event.eventId);
      }
    });

    rsvpEvents.subscribe('rsvp:error', (event) => {
      const startTime = this.operationStartTimes.get(event.eventId);
      if (startTime) {
        const duration = Date.now() - startTime;
        this.updateMetrics(false, duration);
        this.operationStartTimes.delete(event.eventId);
      }
      
      console.warn('⚠️  RSVP Error Detected:', event.error);
    });
  }

  private updateMetrics(success: boolean, duration: number) {
    this.metrics.totalOperations++;
    this.metrics.lastOperationTime = Date.now();
    
    if (success) {
      this.metrics.successfulOperations++;
    } else {
      this.metrics.failedOperations++;
    }

    // Update average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalOperations - 1) + duration) / 
      this.metrics.totalOperations;
  }

  private startIntegrityChecks() {
    // Run integrity check every 5 minutes in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        if (!checkRsvpIntegrity()) {
          console.error('🚨 RSVP System Integrity Check Failed - System may be compromised');
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  }

  getMetrics(): RsvpMetrics {
    return { ...this.metrics };
  }

  getHealthStatus(): 'healthy' | 'warning' | 'critical' {
    const failureRate = this.metrics.failedOperations / Math.max(this.metrics.totalOperations, 1);
    
    if (failureRate > 0.5) return 'critical';
    if (failureRate > 0.2) return 'warning';
    return 'healthy';
  }

  logHealthReport() {
    const health = this.getHealthStatus();
    const metrics = this.getMetrics();
    
    console.log('📊 RSVP System Health Report:', {
      status: health,
      metrics,
      timestamp: new Date().toISOString(),
    });
  }
}

// Global monitor instance
export const rsvpMonitor = new RsvpMonitor();

// Expose monitoring functions
export const logRsvpHealth = () => rsvpMonitor.logHealthReport();
export const getRsvpMetrics = () => rsvpMonitor.getMetrics();
export const getRsvpHealthStatus = () => rsvpMonitor.getHealthStatus();
