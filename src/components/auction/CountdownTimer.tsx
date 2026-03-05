import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endDate?: Date;
  onEnd?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ endDate, onEnd, size = "md", variant = "default" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!endDate) return;
    
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsEnded(true);
        onEnd?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onEnd]);

  if (!endDate) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-muted-foreground font-semibold font-display">Data não definida</span>
      </div>
    );
  }

  if (isEnded) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-destructive font-semibold font-display">Encerrado</span>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  // Compact variant for card timers (like reference site)
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1 text-accent font-display font-bold">
        <TimeBlock value={timeLeft.days} label="dias" />
        <span className="text-lg">:</span>
        <TimeBlock value={timeLeft.hours} label="horas" />
        <span className="text-lg">:</span>
        <TimeBlock value={timeLeft.minutes} label="min" />
        <span className="text-lg">:</span>
        <TimeBlock value={timeLeft.seconds} label="seg" />
      </div>
    );
  }

  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-2",
    lg: "text-base gap-3",
  };

  const digitClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  const labelClasses = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      {timeLeft.days > 0 && (
        <TimeUnit value={timeLeft.days} label="dias" digitClass={digitClasses[size]} labelClass={labelClasses[size]} />
      )}
      <TimeUnit value={timeLeft.hours} label="hrs" digitClass={digitClasses[size]} labelClass={labelClasses[size]} />
      <span className="text-muted-foreground font-bold">:</span>
      <TimeUnit value={timeLeft.minutes} label="min" digitClass={digitClasses[size]} labelClass={labelClasses[size]} />
      <span className="text-muted-foreground font-bold">:</span>
      <TimeUnit value={timeLeft.seconds} label="seg" digitClass={digitClasses[size]} labelClass={labelClasses[size]} />
    </div>
  );
}

interface TimeBlockProps {
  value: number;
  label: string;
}

function TimeBlock({ value, label }: TimeBlockProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg">{value.toString().padStart(2, "0")}</span>
      <span className="text-[8px] text-muted-foreground font-normal">{label}</span>
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
  digitClass: string;
  labelClass: string;
}

function TimeUnit({ value, label, digitClass, labelClass }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`${digitClass} bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-bold font-display shadow-sm`}>
        {value.toString().padStart(2, "0")}
      </div>
      <span className={`${labelClass} text-muted-foreground mt-1`}>{label}</span>
    </div>
  );
}
