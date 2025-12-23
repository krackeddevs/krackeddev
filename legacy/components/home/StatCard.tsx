'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string;
  desc?: string;
  icon?: React.ReactNode;
  index?: number;
}

// Parse value string to extract number and formatting
const parseValue = (value: string) => {
  // Match patterns like "500+", "120+", "RM 50k+", "RM 50k"
  const prefixMatch = value.match(/^([A-Za-z\s]+)?/);
  const numberMatch = value.match(/(\d+(?:\.\d+)?)/);
  const multiplierMatch = value.match(/([km])/i);
  const suffixMatch = value.match(/(\+)$/);

  const prefix = prefixMatch?.[1]?.trim() || '';
  const numberStr = numberMatch?.[1] || '0';
  const multiplier = multiplierMatch?.[1]?.toLowerCase() || '';
  const suffix = suffixMatch?.[1] || '';

  let targetNumber = parseFloat(numberStr);
  if (multiplier === 'k') {
    targetNumber *= 1000;
  } else if (multiplier === 'm') {
    targetNumber *= 1000000;
  }

  return {
    prefix,
    targetNumber,
    displayNumber: numberStr,
    multiplier,
    suffix,
  };
};

const StatCard = ({ label, value, desc, icon, index = 0 }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const parsed = parseValue(value);
  const { prefix, targetNumber, multiplier, suffix } = parsed;

  useEffect(() => {
    if (hasAnimated || !isInView) return;

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (targetNumber - startValue) * easeOut;
      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetNumber);
        setHasAnimated(true);
      }
    };

    // Start animation with stagger delay
    const timer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, index * 100);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(timer);
    };
  }, [targetNumber, index, hasAnimated, isInView]);

  // Format the displayed number
  const formatDisplayValue = () => {
    let num = displayValue;
    let mult = multiplier;
    
    // Convert back to display format if multiplier exists
    if (multiplier === 'k' && num >= 1000) {
      num = num / 1000;
      mult = 'k';
    } else if (multiplier === 'm' && num >= 1000000) {
      num = num / 1000000;
      mult = 'm';
    } else {
      mult = '';
    }

    // Format number (remove decimals for whole numbers, keep 1 decimal for k/m)
    const formattedNum = mult 
      ? num.toFixed(num % 1 === 0 ? 0 : 1)
      : Math.floor(num).toString();

    return `${prefix ? prefix + ' ' : ''}${formattedNum}${mult}${suffix}`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="glass-card bg-transparent border-0 hover:bg-white/5 transition-colors h-full">
        <CardContent className="p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            {icon && <div className="text-muted-foreground/50">{icon}</div>}
          </div>
          <div className="text-2xl font-bold tracking-tight text-gradient">{formatDisplayValue()}</div>
          {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
