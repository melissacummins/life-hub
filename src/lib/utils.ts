import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export const COLORS = [
  { name: 'gray', value: 'bg-gray-500' },
  { name: 'red', value: 'bg-red-500' },
  { name: 'orange', value: 'bg-orange-500' },
  { name: 'yellow', value: 'bg-yellow-500' },
  { name: 'green', value: 'bg-green-500' },
  { name: 'blue', value: 'bg-blue-500' },
  { name: 'indigo', value: 'bg-indigo-500' },
  { name: 'purple', value: 'bg-purple-500' },
  { name: 'pink', value: 'bg-pink-500' },
];

export const ICONS = [
  '📝',
  '📚',
  '💼',
  '🏠',
  '🎯',
  '💡',
  '🎨',
  '🔬',
  '⚡',
  '🌟',
  '🚀',
  '📊',
  '🎵',
  '🎮',
  '🏋️',
  '✈️',
];
