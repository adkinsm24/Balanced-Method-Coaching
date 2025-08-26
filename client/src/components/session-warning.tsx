import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const SESSION_WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before expiry
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes total

export function SessionWarning() {
  const { user, isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let warningTimer: NodeJS.Timeout;
    let countdownTimer: NodeJS.Timeout;
    let warningShown = false;

    const resetTimers = () => {
      clearTimeout(warningTimer);
      clearInterval(countdownTimer);
      setShowWarning(false);
      warningShown = false;
      
      // Set warning timer for 25 minutes (5 minutes before 30-minute timeout)
      warningTimer = setTimeout(() => {
        if (!warningShown) {
          setShowWarning(true);
          setTimeLeft(SESSION_WARNING_TIME);
          warningShown = true;
          
          // Start countdown
          countdownTimer = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1000) {
                clearInterval(countdownTimer);
                setShowWarning(false);
                return 0;
              }
              return prev - 1000;
            });
          }, 1000);
        }
      }, SESSION_TIMEOUT - SESSION_WARNING_TIME);
    };

    const handleUserActivity = () => {
      resetTimers();
    };

    // Reset timers on user activity
    const events = ['mousedown', 'keypress', 'click', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Initialize timers
    resetTimers();

    return () => {
      clearTimeout(warningTimer);
      clearInterval(countdownTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, user]);

  const extendSession = async () => {
    try {
      await fetch('/api/auth/user', {
        method: 'GET',
        credentials: 'include',
      });
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning || !isAuthenticated) return null;

  return (
    <Alert className="fixed top-4 right-4 z-50 w-96 border-amber-200 bg-amber-50 shadow-lg">
      <Clock className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium mb-1">Session expiring soon</p>
            <p className="text-sm">
              Your session will expire in {formatTime(timeLeft)}
            </p>
          </div>
          <Button
            onClick={extendSession}
            size="sm"
            variant="outline"
            className="ml-3 border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Extend
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}