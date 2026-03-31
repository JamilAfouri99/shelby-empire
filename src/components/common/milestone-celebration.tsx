"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

type MilestoneCelebrationProps = {
  show: boolean;
  title: string;
  subtitle?: string;
  icon?: string;
  onDismiss?: () => void;
};

export function MilestoneCelebration({ show, title, subtitle, icon, onDismiss }: MilestoneCelebrationProps) {
  const [visible, setVisible] = useState(show);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const handleDismiss = useCallback(() => {
    setVisible(false);
    onDismissRef.current?.();
  }, []);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(handleDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, handleDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed inset-x-0 top-8 z-50 mx-auto max-w-sm"
          onClick={handleDismiss}
        >
          <div className="mx-4 rounded-lg border border-gold/25 bg-surface-elevated p-4 text-center shadow-lg shadow-gold/[0.08]">
            {icon && <span className="text-3xl">{icon}</span>}
            <p className="mt-1 font-heading text-lg font-bold text-gold">{title}</p>
            {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
