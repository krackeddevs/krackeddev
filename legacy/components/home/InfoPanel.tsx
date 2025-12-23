'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface InfoPanelProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  delay?: number;
}

const InfoPanel = ({ title, children, actions, delay = 0 }: InfoPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay }}
      className="h-full"
    >
      <Card className="glass-card bg-transparent border-0 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow py-4">
          {children}
        </CardContent>
        {actions && (
          <CardFooter className="pt-0 flex justify-center">
            {actions}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default InfoPanel;
