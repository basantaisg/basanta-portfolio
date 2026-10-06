'use client';
import { useEffect } from 'react';
import { setupMotion } from '../lib/motion.mjs';

export default function MotionEffects() {
  useEffect(() => setupMotion(document.getElementById('main')), []);
  return null;
}
