'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, Clock, FileText, Users } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'

interface CalendarEvent {
  id: number
  title: string
  date: Date
  time: string
  type: 'publish' | 'deadline' | 'meeting' | 'review'
  project?: string
  attendees?: string[]
}

const typeConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  publish: { color: 'bg-green-500/20 border-green-500/30 text-green-300', icon: <FileText className="w-4 h-4" />, label: 'Publish' },
  deadline: { color: 'bg-red-500/20 border-red-500/30 text-red-300', icon: <Clock className="w-4 h-4" />, label: 'Deadline' },
  meeting: { color: 'bg-blue-500/20 border-blue-500/30 text-blue-300', icon: <Users className="w-4 h-4" />, label: 'Meeting' },
  review: { color: 'bg-purple-500/20 border-purple-500/30 text-purple-300', icon: <FileText className="w-4 h-4" />, label: 'Review' },
}

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'AI Writing Guide - Publish',
    date: new Date(2024, 0, 15),
    time: '10:00 AM',
    type: 'publish',
    project: 'AI Writing Guide',
  },
  {
    id: 2,
    title: 'Marketing Strategy - Deadline',
    date: new Date(2024, 0, 18),
    time: '5:00 PM',
    type: 'deadline',
    project: 'Marketing Strategy',
  },
  {
    id: 3,
    title: 'Team Review Meeting',
    date: new Date(2024, 0, 20),
    time: '2:00 PM',
    type: 'meeting',
    attendees: ['John', 'Sarah', 'Mike'],
  },
  {
    id: 4,
    title: 'Product Launch - Review',
    date: new Date(2024, 0, 22),
    time: '11:00 AM',
    type: 'review',
    project: 'Product Launch',
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return mockEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const selectedDateEvents = selectedDate 
    ? mockEvents.filter(event => event.date.toDateString() === selectedDate.toDateString())
    : []

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <Calendar className="w-10 h-10" />
            Publishing Calendar
          </h1>
          <p className="text-muted-foreground">Schedule and track your content publishing timeline</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{monthName}</h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells */}
                {emptyDays.map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days */}
                {days.map(day => {
                  const dayEvents = getEventsForDate(day)
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  const isSelected = selectedDate?.toDateString() === date.toDateString()

                  return (
                    <motion.button
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      whileHover={{ scale: 1.05 }}
                      className={`aspect-square rounded-lg p-2 text-sm font-medium transition flex flex-col items-start justify-start ${
                        isSelected
                          ? 'bg-purple-500/30 border border-purple-500/50 text-white'
                          : dayEvents.length > 0
                          ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                          : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                      }`}
                    >
                      <span>{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="mt-1 flex gap-0.5">
                          {dayEvents.slice(0, 2).map(event => {
                            const config = typeConfig[event.type]
                            return (
                              <div key={event.id} className="w-1.5 h-1.5 rounded-full" style={{ 
                                backgroundColor: config.color.split(' ')[0] === 'bg-green-500/20' ? '#4ade80' :
                                                config.color.split(' ')[0] === 'bg-red-500/20' ? '#f87171' :
                                                config.color.split(' ')[0] === 'bg-blue-500/20' ? '#60a5fa' :
                                                '#a78bfa'
                              }} />
                            )
                          })}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar - Event Details */}
          <div className="space-y-6">
            {/* Legend */}
            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Event Types</h3>
              <div className="space-y-2">
                {Object.entries(typeConfig).map(([type, config]) => (
                  <div key={type} className="flex items-center gap-3 text-sm">
                    <div className={`p-2 rounded ${config.color}`}>
                      {config.icon}
                    </div>
                    <span className="text-muted-foreground">{config.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Selected Date Events */}
            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
              </h3>
              <div className="space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map(event => {
                    const config = typeConfig[event.type]
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg border ${config.color}`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {config.icon}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{event.title}</p>
                            <p className="text-xs text-white/60">{event.time}</p>
                          </div>
                        </div>
                        {event.project && (
                          <p className="text-xs text-white/70 ml-6">{event.project}</p>
                        )}
                      </motion.div>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No events scheduled</p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
