/**
 * 🏷️ APP IDENTITY — Change these values to rebrand the app.
 *
 * These are referenced across landing, auth, onboarding, and profile screens.
 * Update them once here and they propagate everywhere.
 */

export const APP_NAME = 'Focus'
export const APP_SCHEME = 'focus'
export const APP_SUPPORT_EMAIL = 'support@focus.app'
export const APP_DOCS_URL = 'https://focus.app/help'
export const APP_TAGLINE = 'Earn your focus'
export const APP_DESCRIPTION = 'Block apps, track time, earn rewards.'

// Focus App Specific
export const FOCUS_SESSION_DEFAULT = 25 * 60  // 25 minutes (Pomodoro)
export const BREAK_SESSION_DEFAULT = 5 * 60   // 5 minutes
export const LONG_BREAK_DEFAULT = 15 * 60     // 15 minutes
export const DAILY_GOAL_DEFAULT = 5.5 * 60 * 60  // 5h 30m in seconds

export const POINTS_PER_COMPLETED_SESSION = 25
export const POINTS_PER_INTERRUPTED_RESIST = 10
export const POINTS_DAILY_GOAL_BONUS = 100

export const STREAK_BONUS_THRESHOLDS = [3, 7, 14, 30, 100]  // Days
export const STREAK_REWARDS = [50, 200, 500, 1500, 5000]    // Points

// Demo Mode bypasses Paywall
export const DEMO_MODE = true;
