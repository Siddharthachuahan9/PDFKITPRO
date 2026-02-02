'use client';

import Modal from './Modal';
import UpgradeContent from '../billing/UpgradeContent';
import type { PlanType } from '@/types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
}

/**
 * Upgrade modal using the reusable Modal component
 * Properly centered with flex, accessible, and clean
 */
export default function UpgradeModal({ isOpen, onClose, currentPlan }: UpgradeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <UpgradeContent currentPlan={currentPlan} onSuccess={onClose} />
    </Modal>
  );
}
