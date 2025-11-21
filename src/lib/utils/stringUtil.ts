import { type ClassValue, clsx } from 'clsx'

export const formatters = {
  currency: (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  },
  date: (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  },
  dateTime: (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  },
  timeAgo: (date: string | Date) => {
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  },
}

export const urlUtils = {
  getSearchParams: () => {
    return new URLSearchParams(window.location.search)
  },
  setSearchParam: (key: string, value: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)
    window.history.pushState({}, '', url.toString())
  },
  removeSearchParam: (key: string) => {
    const url = new URL(window.location.href)
    url.searchParams.delete(key)
    window.history.pushState({}, '', url.toString())
  },
}

export const device = {
  isMobile: (): boolean => {
    return window.innerWidth <= 768
  },
  isTablet: (): boolean => {
    return window.innerWidth > 768 && window.innerWidth <= 1024
  },
  isDesktop: (): boolean => {
    return window.innerWidth > 1024
  },
  getTouchSupport: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },
}

export const validators = {
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },
  password: (password: string): boolean => {
    return password.length >= 8 && 
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)
  },
  phone: (phone: string): boolean => {
    return /^\+?[\d\s\-\(\)]+$/.test(phone)
  },
}

export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs)
}