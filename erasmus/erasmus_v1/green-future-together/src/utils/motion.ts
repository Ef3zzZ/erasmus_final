// Shared motion vocabulary (Emil Kowalski's animation philosophy & Apple WWDC fluid interface design).
// Damping 1.0 (critically damped, zero overshoot) for all default UI interactions.
// Low bounce (0.1–0.15) reserved strictly for gesture releases / flicks with momentum.
import type { Transition } from 'framer-motion';

/** Default UI spring — Apple-style critically damped, silky smooth, responsive and non-distracting (~400ms settle). */
export const springDefault: Transition = {
  type: 'spring',
  duration: 0.42,
  bounce: 0.08,
};

/** Snappier critically damped spring for small controls (pills, segmented tabs, indicator bars, buttons). */
export const springSnappy: Transition = {
  type: 'spring',
  duration: 0.28,
  bounce: 0.04,
};

/** Gentle modal & dialog spring — soft, elegant entrance without feeling sluggish. */
export const springModal: Transition = {
  type: 'spring',
  duration: 0.36,
  bounce: 0.06,
};

/** Drawer / sheet — Apple ships damping ~0.8, response ~0.3s. Used after a flick/drag release. */
export const springSheet: Transition = {
  type: 'spring',
  duration: 0.44,
  bounce: 0.12,
};

/** Subtle bouncy spring for playful badges or completion items. */
export const springBouncy: Transition = {
  type: 'spring',
  duration: 0.46,
  bounce: 0.18,
};

/** Emil's custom cubic-bezier easings for transitions and WAAPI/CSS */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/**
 * Apple's momentum projection (exponential decay, as in the WWDC sample code).
 * Returns how far (px) a release velocity (px/s) would travel before resting.
 */
export function project(initialVelocity: number, decelerationRate = 0.998): number {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

