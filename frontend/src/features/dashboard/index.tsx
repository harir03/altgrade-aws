import { useState, useEffect, useRef } from 'react'
import { ThinkingOrb } from 'thinking-orbs'
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Send,
  Loader2,
  Bot,
  User,
  IndianRupee,
  Percent,
  Clock,
  Maximize2,
  Minimize2,
  Sliders,
  Calendar,
  Award,
  BellRing,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import {
  fetchDashboard,
  submitDecision,
  submitKnowledge,
  askAdvisor,
  fetchApplicantProfile,
  fetchEligibility,
  fetchInterviewSummary,
  fetchOfficerAlerts,
  fetchPersonalization,
  simulateRestructuring,
  sendOfficerMessage,
  requestOutboundCall,
} from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import type { DashboardOverview, ConflictApplicant, EligibilityResponse } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Stepper, Step } from '@/components/ui/stepper'

const BAND_COLORS: Record<string, string> = {
  'Excellent': 'bg-[#6DBE3B]',
  'Good': 'bg-[#5C8C3A]',
  'Fair': 'bg-[#D4A017]',
  'Poor': 'bg-[#D97B4A]',
  'Not Eligible': 'bg-[#D94F4F]',
}

const BAND_BG: Record<string, string> = {
  'Excellent': 'bg-[#E8F5E0] text-[#2D6B1E] border-[#5C8C3A]/30',
  'Good': 'bg-[#EDF5E8] text-[#3A7A2E] border-[#5C8C3A]/25',
  'Fair': 'bg-[#FFF8E7] text-[#9A7B1A] border-[#D4A017]/30',
  'Poor': 'bg-[#FFF0EF] text-[#B85C3A] border-[#D97B4A]/30',
  'Not Eligible': 'bg-[#FFF0EF] text-[#C43A3A] border-[#D94F4F]/30',
}

function PersonalizedMessageComposer({
  open,
  onOpenChange,
  alert,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  alert: {
    user_id: string
    name: string
    empathetic_message?: string
    ai_summary?: string
  } | null
}) {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('check_in')
  const [channel, setChannel] = useState('sms')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (open && alert) {
      setMessage(alert.empathetic_message || '')
      setSent(false)
    }
  }, [open, alert])

  async function handleSend() {
    if (!alert || !message.trim()) return
    setSending(true)
    try {
      const result = await sendOfficerMessage({
        userId: alert.user_id,
        message: message.trim(),
        category,
        channel,
      })
      setSent(true)

      // If channel is 'call', also trigger an outbound AI agent call
      if (channel === 'call' && result.trigger_ai_call) {
        try {
          await requestOutboundCall(alert.user_id, '', 'gu', 'general', 'on_call_banking')
        } catch {
          console.warn('AI call trigger failed, message was still sent')
        }
      }
    } catch {
      console.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (!alert) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[520px] bg-white/95 backdrop-blur-xl border border-[#5C8C3A]/15 text-[#1A2E1C]'>
        <DialogHeader>
          <DialogTitle className='tracking-tight font-headingNow font-bold text-lg text-[#1A2E1C] flex items-center gap-2'>
            <span className='size-2 rounded-full bg-[#5C8C3A] animate-pulse' />
            Send Personalized Message
          </DialogTitle>
          <DialogDescription className='text-xs text-[#6B8F68]'>
            Reach out to {alert.name} with an empathetic, context-aware message.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className='py-8 text-center space-y-3'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E0] border border-[#5C8C3A]/20 text-[#4A9E3F]'>
              <CheckCircle2 className='h-6 w-6 text-[#4A9E3F]' />
            </div>
            <p className='text-sm font-medium text-[#1A2E1C]'>Message {channel === 'call' ? 'queued & AI call triggered' : 'sent'} successfully</p>
            <p className='text-xs text-[#6B8F68]'>
              {channel === 'call'
                ? 'An AI agent will call the user with your message context.'
                : channel === 'sms'
                  ? 'SMS will be delivered shortly.'
                  : 'Message will appear in the user\'s dashboard.'}
            </p>
          </div>
        ) : (
          <div className='space-y-4 py-2'>
            {alert.ai_summary && (
              <div className='rounded-lg border border-[#5C8C3A]/12 bg-[#EDF5E8] p-3 text-xs text-[#4A6B48] leading-relaxed'>
                <span className='font-mono font-medium text-[#5C8C3A] text-[10px] uppercase tracking-wider'>AI Context</span>
                <p className='mt-1 text-[#1A2E1C]'>{alert.ai_summary}</p>
              </div>
            )}

            <div className='space-y-1.5'>
              <Label className='text-xs font-mono text-[#6B8F68]'>Delivery Channel</Label>
              <div className='flex gap-2'>
                {[
                  { value: 'sms', label: 'SMS', icon: <MessageCircle className='h-3 w-3' /> },
                  { value: 'call', label: 'AI Call', icon: <Phone className='h-3 w-3' /> },
                  { value: 'in_app', label: 'In-App', icon: <BellRing className='h-3 w-3' /> },
                ].map((ch) => (
                  <button
                    key={ch.value}
                    type='button'
                    onClick={() => setChannel(ch.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono border transition-colors ${
                      channel === ch.value
                        ? 'border-[#5C8C3A] bg-[#5C8C3A] text-white font-bold shadow-sm'
                        : 'border-[#5C8C3A]/15 bg-[#EDF5E8] text-[#4A6B48] hover:border-[#5C8C3A]/30 hover:text-[#1A2E1C]'
                    }`}
                  >
                    {ch.icon} {ch.label}
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-mono text-[#6B8F68]'>Category</Label>
              <div className='flex gap-2 flex-wrap'>
                {[
                  { value: 'check_in', label: 'Check-in' },
                  { value: 'payment_reminder', label: 'Payment' },
                  { value: 'restructuring_offer', label: 'Restructure' },
                  { value: 'product_recommendation', label: 'Product' },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    type='button'
                    onClick={() => setCategory(cat.value)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono border transition-colors ${
                      category === cat.value
                        ? 'border-[#5C8C3A]/40 bg-[#E8F5E0] text-[#2D6B1E] font-semibold'
                        : 'border-[#5C8C3A]/12 bg-[#F6FAF3] text-[#6B8F68] hover:border-[#5C8C3A]/25 hover:text-[#1A2E1C]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label className='text-xs font-mono text-[#6B8F68]'>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className='text-xs font-mono resize-none bg-[#F6FAF3] border-[#5C8C3A]/15 text-[#1A2E1C] placeholder:text-[#6B8F68]/50 focus-visible:ring-1 focus-visible:ring-[#5C8C3A]'
                placeholder='Type a personalized message...'
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className='w-full text-xs font-mono bg-[#5C8C3A] text-white hover:bg-[#4A7A30] font-bold transition-colors'
            >
              {sending ? (
                <><Loader2 className='h-3 w-3 animate-spin mr-1.5' /> Sending...</>
              ) : (
                <>{channel === 'call' ? <Phone className='h-3 w-3 mr-1.5' /> : <Send className='h-3 w-3 mr-1.5' />} Send via {channel === 'call' ? 'AI Agent Call' : channel === 'sms' ? 'SMS' : 'In-App'}</>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


function OfficerAlertsBanner({
  alerts,
  onActionClick,
  onSendMessage,
}: {
  alerts: Array<{
    user_id: string
    name: string
    segment: string
    status: string
    score: number
    type: string
    urgency: string
    message: string
    action: string
    severity_score?: number
    confidence_score?: number
    ai_summary?: string
    empathetic_message?: string
    recommended_action?: string
  }>
  onActionClick: (userId: string) => void
  onSendMessage: (alert: any) => void
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  if (!alerts || alerts.length === 0) return null

  return (
    <Card className='border border-[#5C8C3A]/12 bg-white/85 backdrop-blur-md shadow-sm mb-4 animate-fade-up'>
      <CardHeader className='pb-2 pt-4 px-5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex h-5 w-5 items-center justify-center rounded-full bg-[#E8F5E0] text-[#5C8C3A] border border-[#5C8C3A]/15'>
              <BellRing className='h-3 w-3' />
            </div>
            <CardTitle className='text-xs font-mono uppercase tracking-widest text-[#1A2E1C]'>
              Financial Stress & Action Triggers ({alerts.length})
            </CardTitle>
          </div>
          <Badge variant='outline' className='text-[10px] font-mono text-[#5C8C3A] border-[#5C8C3A]/20 bg-[#E8F5E0]'>
            AI-Powered Detection
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='px-5 pb-4'>
        <div className='grid gap-3 md:grid-cols-3'>
          {alerts.map((a, i) => {
            const severity = a.severity_score ?? 0
            const confidence = a.confidence_score ?? 0
            const isExpanded = expandedIdx === i

            return (
              <div
                key={i}
                className='flex flex-col justify-between rounded-lg border border-[#5C8C3A]/10 bg-[#F6FAF3] p-3.5 transition-all duration-200 hover:border-[#5C8C3A]/25 hover:shadow-sm'
              >
                <div className='space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <span className='font-mono font-semibold text-xs text-[#1A2E1C] truncate max-w-[170px]'>{a.name}</span>
                    <span className='font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#5C8C3A]/15 bg-[#E8F5E0] text-[#5C8C3A]'>
                      {a.type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Severity & Confidence */}
                  <div className='flex items-center gap-3 mt-1'>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-0.5'>
                        <span className='font-mono text-[9px] uppercase tracking-wider text-[#6B8F68]'>Severity</span>
                        <span className='font-mono text-[10px] font-medium text-[#D97B4A]'>{severity}</span>
                      </div>
                      <div className='h-1 w-full rounded-full bg-[#E2EDDB]'>
                        <div
                          className='h-1 rounded-full bg-gradient-to-r from-[#D4A017] to-[#D97B4A] transition-all duration-500'
                          style={{ width: `${severity}%` }}
                        />
                      </div>
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-0.5'>
                        <span className='font-mono text-[9px] uppercase tracking-wider text-[#6B8F68]'>Confidence</span>
                        <span className='font-mono text-[10px] font-medium text-[#5C8C3A]'>{confidence}%</span>
                      </div>
                      <div className='h-1 w-full rounded-full bg-[#E2EDDB]'>
                        <div
                          className='h-1 rounded-full bg-gradient-to-r from-[#5C8C3A] to-[#6DBE3B] transition-all duration-500'
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className='text-[11px] text-[#4A6B48] leading-relaxed line-clamp-2'>
                    {a.message}
                  </p>

                  {/* Expandable AI Summary */}
                  {a.ai_summary && (
                    <button
                      type='button'
                      onClick={() => setExpandedIdx(isExpanded ? null : i)}
                      className='text-[10px] font-mono text-[#5C8C3A] hover:text-[#4A7A30] transition-colors flex items-center gap-1'
                    >
                      <Sparkles className='h-2.5 w-2.5' />
                      {isExpanded ? 'Hide AI Summary' : 'View AI Summary'}
                    </button>
                  )}
                  {isExpanded && a.ai_summary && (
                    <div className='rounded border border-[#5C8C3A]/12 bg-[#EDF5E8] p-2.5 text-[11px] text-[#4A6B48] leading-relaxed animate-fade-up'>
                      <p>{a.ai_summary}</p>
                      {a.recommended_action && (
                        <p className='mt-1.5 text-[#2D6B1E] font-medium'>
                          → {a.recommended_action}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className='mt-3 flex items-center justify-between border-t border-[#5C8C3A]/10 pt-2 text-[11px]'>
                  <span className='font-mono text-[#6B8F68]'>Score: <span className='text-[#5C8C3A] font-semibold'>{a.score}</span></span>
                  <div className='flex gap-1.5'>
                    {(a.empathetic_message || a.type === 'pre_delinquency' || a.type === 'low_savings' || a.type === 'salary_delay' || a.type === 'medical_emergency' || a.type === 'emi_default_risk') && (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => onSendMessage(a)}
                        className='h-6 px-2 text-[10px] font-mono rounded border-[#5C8C3A]/20 bg-[#E8F5E0] text-[#5C8C3A] hover:bg-[#5C8C3A] hover:text-white hover:border-[#5C8C3A] transition-colors'
                      >
                        <MessageCircle className='h-2.5 w-2.5 mr-1' /> Message
                      </Button>
                    )}
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => onActionClick(a.user_id)}
                      className='h-6 px-2.5 text-[10px] font-mono rounded border-[#5C8C3A]/15 bg-[#E8F5E0] text-[#1A2E1C] hover:bg-[#5C8C3A] hover:text-white hover:border-[#5C8C3A] transition-colors'
                    >
                      {a.action} →
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function StatsCards({ data, stressCount = 0 }: { data: DashboardOverview; stressCount?: number }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
      <Card className='animate-fade-up border-[#5C8C3A]/10 bg-white/85 backdrop-blur-md hover:border-[#5C8C3A]/25 hover:shadow-sm transition-all duration-200'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#6B8F68]'>Total Scored</CardTitle>
          <div className='flex size-6 items-center justify-center rounded-md bg-[#E8F5E0] text-[#5C8C3A] border border-[#5C8C3A]/12'>
            <Users className='h-3.5 w-3.5' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='font-headingNow font-black text-3xl tracking-tight text-[#1A2E1C]'>{data.total_scored}</div>
          <p className='text-xs text-[#6B8F68] mt-0.5'>Applicants assessed</p>
        </CardContent>
      </Card>

      <Card className='animate-fade-up [animation-delay:50ms] border-[#5C8C3A]/10 bg-white/85 backdrop-blur-md hover:border-[#5C8C3A]/25 hover:shadow-sm transition-all duration-200'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#6B8F68]'>Approval Rate</CardTitle>
          <div className='flex size-6 items-center justify-center rounded-md bg-[#E8F5E0] text-[#4A9E3F] border border-[#5C8C3A]/12'>
            <CheckCircle2 className='h-3.5 w-3.5' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='font-headingNow font-black text-3xl tracking-tight text-[#4A9E3F]'>{data.approval_rate}%</div>
          <p className='text-xs text-[#6B8F68] mt-0.5'>Score ≥ 500 (Good or above)</p>
        </CardContent>
      </Card>

      <Card className='animate-fade-up [animation-delay:100ms] border-[#5C8C3A]/10 bg-white/85 backdrop-blur-md hover:border-[#D4A017]/25 hover:shadow-sm transition-all duration-200'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#6B8F68]'>Contradiction Review</CardTitle>
          <div className='flex size-6 items-center justify-center rounded-md bg-[#FFF8E7] text-[#D4A017] border border-[#D4A017]/15'>
            <AlertTriangle className='h-3.5 w-3.5' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='font-headingNow font-black text-3xl tracking-tight text-[#D4A017]'>{data.conflict_count}</div>
          <p className='text-xs text-[#6B8F68] mt-0.5'>
            Flagged for conflicting signals
          </p>
        </CardContent>
      </Card>

      <Card className='animate-fade-up [animation-delay:125ms] border-[#5C8C3A]/10 bg-white/85 backdrop-blur-md hover:border-[#5C8C3A]/25 hover:shadow-sm transition-all duration-200'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#6B8F68]'>Stress Alerts</CardTitle>
          <div className='flex size-6 items-center justify-center rounded-md bg-[#E8F5E0] text-[#5C8C3A] border border-[#5C8C3A]/12'>
            <BellRing className='h-3.5 w-3.5' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='font-headingNow font-black text-3xl tracking-tight text-[#5C8C3A]'>{stressCount}</div>
          <p className='text-xs text-[#6B8F68] mt-0.5'>
            Salary delay & savings signals
          </p>
        </CardContent>
      </Card>

      <Card className='animate-fade-up [animation-delay:150ms] border-[#5C8C3A]/10 bg-white/85 backdrop-blur-md hover:border-[#D94F4F]/20 hover:shadow-sm transition-all duration-200'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#6B8F68]'>Hard Blocked</CardTitle>
          <div className='flex size-6 items-center justify-center rounded-md bg-[#FFF0EF] text-[#D94F4F] border border-[#D94F4F]/15'>
            <ShieldAlert className='h-3.5 w-3.5' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='font-headingNow font-black text-3xl tracking-tight text-[#D94F4F]'>{data.hard_cap_count}</div>
          <p className='text-xs text-[#6B8F68] mt-0.5'>
            Wilful defaulter or EMI cap
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function DistributionChart({ data }: { data: DashboardOverview }) {
  const bands = data.band_distribution || []
  const maxCount = Math.max(...bands.map((b) => b.count), 1)

  return (
    <Card className='border-[#5C8C3A]/10 bg-white/85 backdrop-blur-md'>
      <CardHeader>
        <CardTitle className='text-base font-semibold text-[#1A2E1C]'>Score Distribution</CardTitle>
        <CardDescription className='text-xs text-[#6B8F68]'>
          Across {data.total_scored} applicants in the assessment population
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {bands.map((band) => (
            <div key={band.band} className='flex items-center gap-3'>
              <div className='w-28 shrink-0 text-right text-sm font-medium font-mono text-[#1A2E1C]'>
                {band.band}
              </div>
              <div className='flex flex-1 items-center gap-2'>
                <div className='relative h-6 flex-1 rounded-md bg-[#EDF5E8] border border-[#5C8C3A]/10 overflow-hidden'>
                  <div
                    className={`absolute left-0 top-0 h-full rounded-md transition-all duration-500 shadow-sm ${BAND_COLORS[band.band] ?? 'bg-muted-foreground'}`}
                    style={{ width: `${(band.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
              <div className='w-16 text-right text-sm font-mono'>
                <span className='font-bold text-[#1A2E1C]'>{band.count}</span>
                <span className='text-[#6B8F68] text-xs'> ({band.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ConflictsTable({
  data,
  completedDecisions,
  onReview,
}: {
  data: DashboardOverview
  completedDecisions: Record<string, 'approved' | 'rejected'>
  onReview: (applicant: ConflictApplicant) => void
}) {
  return (
    <Card className='border-[#5C8C3A]/10 bg-white/85 backdrop-blur-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-base font-semibold text-[#1A2E1C]'>
          <AlertTriangle className='h-4 w-4 text-[#D4A017]' />
          Applicants Flagged for Contradiction Review
        </CardTitle>
        <CardDescription className='text-xs text-[#6B8F68]'>
          Applicants where data sources provided conflicting assessments
          (combined magnitude &gt; 50 score points)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(!data.flagged_applicants || data.flagged_applicants.length === 0) ? (
          <p className='py-4 text-center text-sm text-[#6B8F68] font-mono'>
            No applicants flagged for contradiction review
          </p>
        ) : (
          <div className='rounded-lg border border-[#5C8C3A]/10 overflow-hidden bg-[#F6FAF3]'>
            <Table>
              <TableHeader>
                <TableRow className='border-b border-[#5C8C3A]/10 bg-[#EDF5E8] hover:bg-[#E8F5E0]'>
                  <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#5C8C3A]'>Applicant</TableHead>
                  <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#5C8C3A]'>Score</TableHead>
                  <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#5C8C3A]'>Band</TableHead>
                  <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#5C8C3A]'>Conflicting Workers</TableHead>
                  <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#5C8C3A] text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.flagged_applicants || []).map((applicant) => {
                  const decision = completedDecisions[applicant.user_id]
                  return (
                    <TableRow key={applicant.user_id} className='border-b border-[#5C8C3A]/8 hover:bg-[#EDF5E8]/60 transition-colors'>
                      <TableCell className='font-mono text-xs font-semibold text-[#1A2E1C]'>
                        {applicant.user_id}
                      </TableCell>
                      <TableCell className='font-mono text-xs font-bold text-[#5C8C3A]'>
                        {applicant.score}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={`font-mono text-[10px] uppercase font-semibold ${BAND_BG[applicant.band] ?? ''}`}
                        >
                          {applicant.band}
                        </Badge>
                      </TableCell>
                      <TableCell className='max-w-xs'>
                        {applicant.conflicts.map((c, i) => (
                          <p key={i} className='text-xs text-[#4A6B48] font-mono'>
                            {c}
                          </p>
                        ))}
                      </TableCell>
                      <TableCell className='text-right'>
                        {decision ? (
                          <Badge
                            variant='outline'
                            className={
                              decision === 'approved'
                                ? 'bg-[#E8F5E0] text-[#2D6B1E] border-[#5C8C3A]/20 font-mono text-[10px] uppercase font-semibold'
                                : 'bg-[#FFF0EF] text-[#C43A3A] border-[#D94F4F]/20 font-mono text-[10px] uppercase font-semibold'
                            }
                          >
                            {decision.toUpperCase()}
                          </Badge>
                        ) : (
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => onReview(applicant)}
                            className='h-7 px-3 text-xs font-mono rounded border-[#5C8C3A]/20 bg-[#E8F5E0] text-[#5C8C3A] hover:bg-[#5C8C3A] hover:text-white hover:border-[#5C8C3A] transition-colors'
                          >
                            Review
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FairnessCard({ data }: { data: DashboardOverview }) {
  const f = data.fairness ?? {
    demographic_parity_ratio: 1.0,
    passes_four_fifths: true,
    last_audit: 'N/A',
  }
  const ratio = typeof f.demographic_parity_ratio === 'number' ? f.demographic_parity_ratio : 1.0
  return (
    <Card className='border-[#5C8C3A]/10 bg-white/85 backdrop-blur-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-base font-semibold text-[#1A2E1C]'>
          <ShieldCheck className='h-4 w-4 text-[#5C8C3A]' />
          Fairness Audit
        </CardTitle>
        <CardDescription className='text-xs text-[#6B8F68]'>
          Demographic parity check across protected groups
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-[#4A6B48]'>Disparate Impact Ratio</span>
          <span className='text-lg font-bold font-mono text-[#1A2E1C] tracking-tight'>
            {ratio.toFixed(4)}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-[#4A6B48]'>Four-Fifths Rule (≥ 0.80)</span>
          <Badge
            variant='outline'
            className={f.passes_four_fifths
              ? 'bg-[#E8F5E0] text-[#2D6B1E] border-[#5C8C3A]/20 font-mono text-[10px] uppercase font-semibold'
              : 'bg-[#FFF0EF] text-[#C43A3A] border-[#D94F4F]/20 font-mono text-[10px] uppercase font-semibold'
            }
          >
            {f.passes_four_fifths ? 'Passes' : 'Fails'}
          </Badge>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-[#4A6B48]'>Last Audit</span>
          <span className='text-xs font-mono text-[#6B8F68]'>{f.last_audit ?? 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className='pb-2'>
              <Skeleton className='h-4 w-24' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16' />
              <Skeleton className='mt-1 h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <Skeleton className='h-5 w-40' />
          </CardHeader>
          <CardContent className='space-y-3'>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className='h-6 w-full' />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className='h-5 w-32' />
          </CardHeader>
          <CardContent className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-6 w-full' />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

const EMPTY_DASHBOARD_DATA: DashboardOverview = {
  total_scored: 0,
  approval_rate: 0.0,
  conflict_count: 0,
  hard_cap_count: 0,
  band_distribution: [
    { band: 'Excellent', count: 0, percentage: 0.0 },
    { band: 'Good', count: 0, percentage: 0.0 },
    { band: 'Fair', count: 0, percentage: 0.0 },
    { band: 'Poor', count: 0, percentage: 0.0 },
    { band: 'Not Eligible', count: 0, percentage: 0.0 },
  ],
  flagged_applicants: [],
  fairness: {
    demographic_parity_ratio: 1.0,
    passes_four_fifths: true,
    last_audit: 'Empty'
  }
}

const SIMULATED_DASHBOARD_DATA: DashboardOverview = {
  total_scored: 1248,
  approval_rate: 68.4,
  conflict_count: 5,
  hard_cap_count: 32,
  band_distribution: [
    { band: 'Excellent', count: 420, percentage: 33.6 },
    { band: 'Good', count: 434, percentage: 34.7 },
    { band: 'Fair', count: 242, percentage: 19.3 },
    { band: 'Poor', count: 120, percentage: 9.6 },
    { band: 'Not Eligible', count: 32, percentage: 2.5 },
  ],
  flagged_applicants: [
    {
      user_id: 'USR-8931A',
      score: 540,
      band: 'Fair',
      conflicts: [
        'E-Commerce spend is highly positive (+110 pts) but Questionnaire shows irregular seasonal income (-65 pts)',
        'Merchant POS inflows indicate active daily trades (+85 pts) but Bank balance volatility is extremely high (-70 pts)'
      ]
    },
    {
      user_id: 'USR-1049C',
      score: 495,
      band: 'Poor',
      conflicts: [
        'Location logs show high frequency of urban metro visits (+75 pts) but Telecom recharge frequency has declined by 60% (-80 pts)'
      ]
    },
    {
      user_id: 'USR-2947F',
      score: 615,
      band: 'Good',
      conflicts: [
        'Bank statement monthly inflow exceeds 50k (+140 pts) but psychometrics flag high impulse risk behavior (-95 pts)'
      ]
    },
    {
      user_id: 'USR-5821D',
      score: 520,
      band: 'Fair',
      conflicts: [
        'E-Commerce transaction count is high (+90 pts) but Aadhaar identity verification was updated within last 30 days (-55 pts)'
      ]
    },
    {
      user_id: 'USR-7391B',
      score: 410,
      band: 'Poor',
      conflicts: [
        'Telecom data shows 5+ years of active tenure (+60 pts) but monthly debt service ratio exceeds 70% (-110 pts)'
      ]
    }
  ],
  fairness: {
    demographic_parity_ratio: 0.8682,
    passes_four_fifths: true,
    last_audit: new Date().toISOString().split('T')[0]
  }
}

export function LoanOfficerDashboard() {
  const { auth } = useAuthStore()
  const user = auth.user
  const [data, setData] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSimulated, setIsSimulated] = useState(false)

  const [selectedApplicant, setSelectedApplicant] = useState<ConflictApplicant | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved')
  const [interestRate, setInterestRate] = useState(10.5)
  const [terms, setTerms] = useState('36 months')
  const [approvedAmount, setApprovedAmount] = useState<number>(200000)
  const [interviewSummary, setInterviewSummary] = useState<string>('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completedDecisions, setCompletedDecisions] = useState<Record<string, 'approved' | 'rejected'>>({})
  const [currentStep, setCurrentStep] = useState(1)

  const [officerAlerts, setOfficerAlerts] = useState<Array<{
    user_id: string
    name: string
    segment: string
    status: string
    score: number
    type: string
    urgency: string
    message: string
    action: string
  }>>([])
  const [personalization, setPersonalization] = useState<any | null>(null)
  const [personalizationLoading, setPersonalizationLoading] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<{
    monthly_emi: number
    foir_ratio_pct: number
    is_affordable: boolean
    max_recommended_emi: number
    projected_score: number
    score_delta: number
    repayment_schedule_type: string
    guidance: string
  } | null>(null)
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(0)
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>([])

  const [applicantProfile, setApplicantProfile] = useState<{
    shap_details: Array<{ label: string; points: number; worker: string }>
    tier: string
  } | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const [advisorMessages, setAdvisorMessages] = useState<Array<{ role: 'user' | 'advisor'; content: string }>>([])
  const [advisorInput, setAdvisorInput] = useState('')
  const [advisorLoading, setAdvisorLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const [messageComposerOpen, setMessageComposerOpen] = useState(false)
  const [messageComposerAlert, setMessageComposerAlert] = useState<any | null>(null)

  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null)
  const [eligibilityLoading, setEligibilityLoading] = useState(false)

  useEffect(() => {
    const isAdminNoMock = user?.email === 'admin@altgrade.in' || user?.email === 'admin@altgrade.com'

    fetchDashboard(user?.email || undefined)
      .then((res) => {
        if (isAdminNoMock) {
          setData(res)
          setIsSimulated(false)
        } else {
          setData(res)
          setIsSimulated(res.total_scored === 1248)
        }
      })
      .catch((err) => {
        console.warn('Dashboard fetch failed, using fallback.', err)
        if (isAdminNoMock) {
          setData(EMPTY_DASHBOARD_DATA)
          setIsSimulated(false)
        } else {
          setData(SIMULATED_DASHBOARD_DATA)
          setIsSimulated(true)
        }
      })
      .finally(() => setLoading(false))

    fetchOfficerAlerts()
      .then((res) => {
        if (res?.alerts) {
          setOfficerAlerts(res.alerts)
        }
      })
      .catch((err) => console.warn('Alerts fetch failed', err))
  }, [user?.email])

  async function runSimulation(
    userId: string,
    amt: number,
    rate: number,
    tenureStr: string,
    morat: number
  ) {
    setSimulating(true)
    const tenureNum = parseInt(tenureStr.replace(/\D/g, ''), 10) || 36
    try {
      const res = await simulateRestructuring({
        userId,
        loanAmount: amt,
        tenureMonths: tenureNum,
        annualInterestRate: rate,
        moratoriumMonths: morat,
      })
      setSimulationResult(res)
    } catch (err) {
      console.warn('Simulation failed', err)
    } finally {
      setSimulating(false)
    }
  }

  function handleReview(applicant: ConflictApplicant) {
    setSelectedApplicant(applicant)
    setDecision(applicant.score >= 600 ? 'approved' : 'rejected')
    setInterestRate(10.5)
    setTerms('36 months')
    setApprovedAmount(200000)
    setInterviewSummary('')
    setNotes('')
    setCurrentStep(1)
    setAdvisorMessages([])
    setAdvisorInput('')
    setApplicantProfile(null)
    setDialogOpen(true)
    setIsExpanded(false)

    setPersonalization(null)
    setPersonalizationLoading(true)
    setSimulationResult(null)
    setMoratoriumMonths(0)
    setSelectedSchemes([])

    fetchPersonalization(applicant.user_id)
      .then((p) => {
        setPersonalization(p)
        if (p.recommendations && p.recommendations.length > 0) {
          setSelectedSchemes([p.recommendations[0].scheme_name])
        }
        const defaultMorat = p.segment?.segment === 'farmer' ? 2 : 0
        setMoratoriumMonths(defaultMorat)
        runSimulation(applicant.user_id, 200000, 10.5, '36 months', defaultMorat)
      })
      .catch(() => {
        runSimulation(applicant.user_id, 200000, 10.5, '36 months', 0)
      })
      .finally(() => setPersonalizationLoading(false))

    setProfileLoading(true)
    fetchApplicantProfile(applicant.user_id)
      .then((p) => setApplicantProfile({ shap_details: p.shap_details, tier: p.tier }))
      .catch(() => setApplicantProfile(null))
      .finally(() => setProfileLoading(false))

    setSummaryLoading(true)
    fetchInterviewSummary(applicant.user_id)
      .then((res) => {
        if (res.summary) {
          setInterviewSummary(res.summary)
        }
      })
      .catch(() => {})
      .finally(() => setSummaryLoading(false))

    setEligibilityLoading(true)
    setEligibility(null)
    fetchEligibility(applicant.user_id, applicant.score, applicant.band)
      .then((e) => {
        setEligibility(e)
        if (e.is_eligible) {
          setInterestRate(e.interest_rate_annual)
          setApprovedAmount(e.max_loan_amount)
          const maxTenure = e.tenure_options[e.tenure_options.length - 1]
          if (maxTenure) setTerms(`${maxTenure.tenure_months} months`)
        }
      })
      .catch(() => setEligibility(null))
      .finally(() => setEligibilityLoading(false))
  }

  function handleAlertAction(userId: string) {
    const found = data?.flagged_applicants.find((a) => a.user_id === userId)
    if (found) {
      handleReview(found)
    } else {
      const alert = officerAlerts.find((a) => a.user_id === userId)
      handleReview({
        user_id: userId,
        score: alert?.score ?? 600,
        band: (alert?.score ?? 600) >= 600 ? 'Good' : 'Fair',
        conflicts: [alert?.message ?? 'Field intelligence alert triggered for underwriter review.'],
      })
    }
  }

  async function handleAdvisorAsk() {
    if (!advisorInput.trim() || !selectedApplicant) return
    const question = advisorInput.trim()
    setAdvisorMessages((prev) => [...prev, { role: 'user', content: question }])
    setAdvisorInput('')
    setAdvisorLoading(true)
    try {
      const res = await askAdvisor(selectedApplicant.user_id, question)
      setAdvisorMessages((prev) => [...prev, { role: 'advisor', content: res.answer }])
    } catch {
      setAdvisorMessages((prev) => [...prev, { role: 'advisor', content: 'Unable to get a response. Please try again.' }])
    } finally {
      setAdvisorLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  async function handleDecisionSubmit() {
    if (!selectedApplicant) return
    setSubmitting(true)
    try {
      const attachedSchemesText = selectedSchemes.length > 0 ? ` [Attached Schemes: ${selectedSchemes.join(', ')}]` : ''
      const moratoriumText = moratoriumMonths > 0 ? ` [Moratorium: ${moratoriumMonths}m harvest grace]` : ''
      const fullNotes = `${notes}${attachedSchemesText}${moratoriumText}`

      await submitDecision(selectedApplicant.user_id, decision, interestRate, terms, fullNotes, approvedAmount)
      const chatLog = advisorMessages.map((m) => ({ role: m.role === 'advisor' ? 'assistant' : 'officer', content: m.content }))
      await submitKnowledge(selectedApplicant.user_id, fullNotes, [
        { role: 'system', content: `Applicant core score: ${selectedApplicant.score}. Conflicting signals: ${selectedApplicant.conflicts.join(', ')}` },
        { role: 'officer', content: `Approved Amount: ₹${approvedAmount}. Interest rate set at ${interestRate}% for ${terms}. Decision: ${decision}.${attachedSchemesText}${moratoriumText}` },
        ...chatLog,
      ])

      setCompletedDecisions((prev) => ({
        ...prev,
        [selectedApplicant.user_id]: decision,
      }))
      setDialogOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='dashboard-pastel min-h-screen'>
      <Header>
        <div className='me-auto' />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='font-signifier text-[44px] font-normal leading-[1.1] tracking-[-0.66px] text-[#1A2E1C]'>
              Loan Officer Dashboard
            </h1>
            <p className='text-sm text-[#6B8F68]'>
              Assessment population overview and contradiction review queue
            </p>
          </div>
          {isSimulated && user?.email !== 'testadmin@altgrade.in' && (
            <Badge variant='outline' className='bg-[#E8F5E0] text-[#5C8C3A] border-[#5C8C3A]/20 px-3 py-1 font-mono text-xs animate-pulse'>
              Simulated Data
            </Badge>
          )}
        </div>

        {loading || !data ? (
          <div className='space-y-4'>
            <LoadingSkeleton />
          </div>
        ) : (
          <div className='space-y-4'>
            <OfficerAlertsBanner
              alerts={officerAlerts}
              onActionClick={handleAlertAction}
              onSendMessage={(alert) => {
                setMessageComposerAlert(alert)
                setMessageComposerOpen(true)
              }}
            />
            <PersonalizedMessageComposer
              open={messageComposerOpen}
              onOpenChange={setMessageComposerOpen}
              alert={messageComposerAlert}
            />
            <StatsCards data={data} stressCount={officerAlerts.length} />

            <div className='grid gap-4 lg:grid-cols-3'>
              <div className='lg:col-span-2'>
                <DistributionChart data={data} />
              </div>
              <FairnessCard data={data} />
            </div>

            <ConflictsTable
              data={data}
              completedDecisions={completedDecisions}
              onReview={handleReview}
            />
          </div>
        )}
      </Main>

      {selectedApplicant && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className={`transition-all duration-300 flex flex-col bg-white/98 backdrop-blur-xl border border-[#5C8C3A]/12 text-[#1A2E1C] ${
            isExpanded
              ? 'max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] md:max-w-[95vw] lg:max-w-[95vw] xl:max-w-[95vw] p-6'
              : 'sm:max-w-[640px] max-h-[85vh] overflow-y-auto'
          }`}>
            <DialogHeader className='relative pr-10 shrink-0'>
              <div className='flex items-center justify-between'>
                <DialogTitle className='tracking-tight font-headingNow font-bold text-lg text-[#1A2E1C] flex items-center gap-2'>
                  <span className='size-2 rounded-full bg-[#5C8C3A] animate-pulse' />
                  Review Credit Application
                </DialogTitle>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsExpanded(!isExpanded)}
                  className='absolute right-10 top-0 h-6 w-6 text-[#6B8F68] hover:text-[#1A2E1C] hover:bg-[#EDF5E8]'
                >
                  {isExpanded ? <Minimize2 className='h-4 w-4' /> : <Maximize2 className='h-4 w-4' />}
                </Button>
              </div>
              <DialogDescription className='text-xs text-[#6B8F68]'>
                Inspect per-source scores, consult the AI advisor, then log your final decision.
              </DialogDescription>
            </DialogHeader>

            <Stepper
              initialStep={1}
              onStepChange={setCurrentStep}
              onFinalStepCompleted={handleDecisionSubmit}
              onCancel={() => setDialogOpen(false)}
              nextButtonProps={{
                disabled: submitting || (currentStep === 4 && !notes.trim())
              }}
              backButtonProps={{
                disabled: submitting
              }}
              stepCircleContainerClassName='border-0 shadow-none bg-transparent w-full p-0 shrink-0'
              className={`w-full p-0 min-h-0 aspect-auto bg-transparent border-0 flex-1 flex flex-col ${isExpanded ? 'overflow-hidden' : 'flex-none'}`}
            >
              <Step>
                <div className={`space-y-4 py-2 text-sm ${isExpanded ? 'overflow-y-auto max-h-[70vh] pr-2' : ''}`}>
                  <h3 className='font-medium text-xs uppercase tracking-wider text-[#5C8C3A] font-mono mb-1'>Step 1: Per-Source Score Breakdown</h3>
                  <div className='rounded-lg bg-[#EDF5E8] p-3.5 border border-[#5C8C3A]/10 space-y-2.5'>
                    <div className='flex justify-between items-center'>
                      <span className='text-[#4A6B48] font-medium'>Applicant</span>
                      <span className='font-mono font-bold text-[#1A2E1C]'>{selectedApplicant.user_id}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-[#4A6B48] font-medium'>Model Score</span>
                      <span className='font-mono font-bold text-[#5C8C3A]'>{selectedApplicant.score} / 850</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-[#4A6B48] font-medium'>Risk Band</span>
                      <Badge variant='outline' className={`font-mono text-[10px] uppercase font-semibold ${BAND_BG[selectedApplicant.band] ?? ''}`}>{selectedApplicant.band}</Badge>
                    </div>
                  </div>

                  {personalizationLoading ? (
                    <div className='flex items-center gap-2 p-3 rounded-lg border border-[#5C8C3A]/10 bg-[#EDF5E8] text-xs text-[#5C8C3A] font-mono'>
                      <Loader2 className='h-3.5 w-3.5 animate-spin' /> Loading livelihood persona & financial health pulse...
                    </div>
                  ) : personalization ? (
                    <div className='space-y-2.5'>
                      {personalization.segment && (
                        <div className='rounded-lg bg-[#EDF5E8] border border-[#5C8C3A]/10 p-3 space-y-1.5 animate-fade-up'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <span className='text-base'>{personalization.segment.icon}</span>
                              <span className='font-mono font-semibold text-xs text-[#1A2E1C]'>
                                {personalization.segment.name}
                              </span>
                            </div>
                            <Badge variant='outline' className='bg-[#E8F5E0] border-[#5C8C3A]/15 text-[10px] font-mono text-[#5C8C3A]'>
                              {personalization.segment.segment?.toUpperCase()}
                            </Badge>
                          </div>
                          <p className='text-[11px] text-[#4A6B48] leading-relaxed'>
                            {personalization.segment.tagline}
                          </p>
                          {personalization.segment.underwriter_notes && (
                            <div className='text-[11px] text-[#1A2E1C] bg-[#F6FAF3] border border-[#5C8C3A]/10 p-2.5 rounded mt-1 leading-relaxed font-mono'>
                              <span className='font-semibold text-[#5C8C3A]'>Underwriter Intelligence:</span> {personalization.segment.underwriter_notes}
                            </div>
                          )}
                        </div>
                      )}

                      {personalization.health && (
                        <div className='rounded-lg border border-[#5C8C3A]/10 bg-[#EDF5E8] p-3 space-y-2.5 animate-fade-up'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <div className='h-2 w-2 rounded-full bg-[#5C8C3A] animate-pulse' />
                              <span className='font-mono font-medium text-xs text-[#1A2E1C]'>
                                {personalization.health.status_label}
                              </span>
                            </div>
                            <span className='text-xs font-mono text-[#6B8F68]'>
                              Stability: <span className='text-[#5C8C3A] font-semibold'>{personalization.health.stability_score}/100</span>
                            </span>
                          </div>

                          <div className='grid grid-cols-2 gap-2 text-xs'>
                            <div className='bg-[#F6FAF3] rounded p-2 border border-[#5C8C3A]/10 text-center font-mono'>
                              <div className='text-[#6B8F68] text-[10px]'>Liquidity Buffer</div>
                              <div className='font-bold text-xs text-[#5C8C3A]'>{personalization.health.liquidity_buffer_days} Days</div>
                            </div>
                            <div className='bg-[#F6FAF3] rounded p-2 border border-[#5C8C3A]/10 text-center font-mono'>
                              <div className='text-[#6B8F68] text-[10px]'>Bill Discipline</div>
                              <div className='font-bold text-xs text-[#5C8C3A]'>{personalization.health.bill_discipline_pct}% On-Time</div>
                            </div>
                          </div>

                          <p className='text-[11px] text-[#4A6B48] leading-relaxed'>
                            {personalization.health.intervention_summary}
                          </p>

                          {personalization.health.warning_signals?.length > 0 && (
                            <div className='text-[11px] text-[#D97B4A] space-y-0.5 pt-1 font-mono border-t border-[#5C8C3A]/10'>
                              {personalization.health.warning_signals.map((w: string, idx: number) => (
                                <div key={idx} className='flex items-start gap-1.5'>
                                  <span className='text-[#D4A017]'>•</span>
                                  <span>{w}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {profileLoading ? (
                    <div className='space-y-2'>
                      {[1,2,3,4,5].map((i) => <Skeleton key={i} className='h-5 w-full bg-[#E2EDDB]' />)}
                    </div>
                  ) : applicantProfile?.shap_details && applicantProfile.shap_details.length > 0 ? (
                    <div className='space-y-1.5'>
                      <span className='text-xs font-mono font-medium text-[#5C8C3A] uppercase tracking-wider'>SHAP Feature Contributions</span>
                      {[...applicantProfile.shap_details]
                        .sort((a, b) => Math.abs(b.points) - Math.abs(a.points))
                        .slice(0, 10)
                        .map((f, i) => {
                          const maxAbs = Math.max(...applicantProfile.shap_details.map(s => Math.abs(s.points)), 1)
                          const pct = Math.min((Math.abs(f.points) / maxAbs) * 100, 100)
                          const positive = f.points > 0
                          return (
                            <div key={i} className='flex items-center gap-2'>
                              <span className='w-32 shrink-0 text-right text-[11px] font-mono text-[#6B8F68] truncate'>
                                {f.label.replace(/^(bank_|telecom_|ecom_|loc_|psych_|merchant_)/, '')}
                              </span>
                              <div className='flex-1 h-4 relative bg-[#EDF5E8] rounded border border-[#5C8C3A]/10'>
                                <div className='absolute left-1/2 h-full w-px bg-[#5C8C3A]/20' />
                                {positive ? (
                                  <div className='absolute left-1/2 h-full rounded-r bg-[#5C8C3A]' style={{ width: `${pct / 2}%` }} />
                                ) : (
                                  <div className='absolute h-full rounded-l bg-[#D97B4A]' style={{ width: `${pct / 2}%`, right: '50%' }} />
                                )}
                              </div>
                              <span className={`w-14 text-right text-[11px] font-mono font-bold ${positive ? 'text-[#5C8C3A]' : 'text-[#D97B4A]'}`}>
                                {f.points > 0 ? '+' : ''}{f.points.toFixed(1)}
                              </span>
                              <Badge variant='outline' className='text-[10px] px-1.5 py-0 border-[#5C8C3A]/15 bg-[#E8F5E0] text-[#5C8C3A] font-mono'>{f.worker}</Badge>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <p className='text-xs text-[#6B8F68] font-mono'>No detailed SHAP data available for this applicant.</p>
                  )}

                  <div className='space-y-1 pt-2 border-t border-[#5C8C3A]/10'>
                    <span className='text-xs font-mono font-medium text-[#5C8C3A] uppercase tracking-wider'>Conflicting Signals</span>
                    {selectedApplicant.conflicts.map((c, i) => (
                      <p key={i} className='text-xs text-[#4A6B48] font-mono leading-relaxed'>• {c}</p>
                    ))}
                  </div>

                  {summaryLoading ? (
                    <div className='space-y-1.5 pt-2 border-t border-[#5C8C3A]/10'>
                      <span className='text-xs font-mono font-medium text-[#5C8C3A] uppercase tracking-wider block'>AI Conflict Interview</span>
                      <div className='flex items-center gap-1.5 text-xs text-[#6B8F68] font-mono'>
                        <Loader2 className='h-3 w-3 animate-spin text-[#5C8C3A]' /> Loading interview summary...
                      </div>
                    </div>
                  ) : interviewSummary ? (
                    <div className='space-y-2 pt-2 border-t border-[#5C8C3A]/10 bg-[#FFF8E7] p-2.5 rounded-lg border border-[#D4A017]/20'>
                      <span className='text-xs font-semibold text-[#D4A017] font-mono uppercase tracking-wider block'>AI Conflict Interview Summary</span>
                      <p className='text-xs text-[#4A6B48] leading-relaxed whitespace-pre-wrap'>{interviewSummary}</p>
                    </div>
                  ) : null}

                  <div className='space-y-2 pt-2 border-t border-[#5C8C3A]/10'>
                    <span className='text-xs font-mono font-medium text-[#5C8C3A] uppercase tracking-wider'>Loan Eligibility</span>
                    {eligibilityLoading ? (
                      <div className='flex items-center gap-2 text-[#6B8F68] font-mono'>
                        <Loader2 className='h-3 w-3 animate-spin text-[#5C8C3A]' />
                        <span className='text-xs'>Loading eligibility...</span>
                      </div>
                    ) : eligibility?.is_eligible ? (
                      <div className='grid grid-cols-3 gap-2'>
                        <div className='rounded-lg bg-[#EDF5E8] border border-[#5C8C3A]/10 p-2.5 text-center'>
                          <IndianRupee className='h-3.5 w-3.5 text-[#5C8C3A] mx-auto mb-1' />
                          <div className='text-sm font-bold font-mono text-[#1A2E1C]'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(eligibility.max_loan_amount)}</div>
                          <div className='text-[10px] text-[#6B8F68] font-mono'>Max Amount</div>
                        </div>
                        <div className='rounded-lg bg-[#EDF5E8] border border-[#5C8C3A]/10 p-2.5 text-center'>
                          <Percent className='h-3.5 w-3.5 text-[#5C8C3A] mx-auto mb-1' />
                          <div className='text-sm font-bold font-mono text-[#5C8C3A]'>{eligibility.interest_rate_annual}%</div>
                          <div className='text-[10px] text-[#6B8F68] font-mono'>Annual Rate</div>
                        </div>
                        <div className='rounded-lg bg-[#EDF5E8] border border-[#5C8C3A]/10 p-2.5 text-center'>
                          <Clock className='h-3.5 w-3.5 text-[#5C8C3A] mx-auto mb-1' />
                          <div className='text-sm font-bold font-mono text-[#1A2E1C]'>{eligibility.tenure_options[eligibility.tenure_options.length - 1]?.tenure_months || 0}m</div>
                          <div className='text-[10px] text-[#6B8F68] font-mono'>Max Tenure</div>
                        </div>
                      </div>
                    ) : (
                      <p className='text-xs text-[#D94F4F] font-mono'>Not eligible for loan based on current score.</p>
                    )}
                  </div>
                </div>
              </Step>

              <Step>
                <div className={`space-y-3 py-2 text-sm ${isExpanded ? 'flex flex-col flex-1 overflow-hidden h-[70vh] pr-2' : ''}`}>
                  <h3 className='font-medium text-xs uppercase tracking-wider text-[#5C8C3A] font-mono mb-1'>Step 2: AI Credit Advisor</h3>
                  <p className='text-xs text-[#6B8F68] shrink-0'>Ask the AI about this applicant&apos;s score factors, risk indicators, or regulatory context.</p>

                  <div className={`rounded-lg border border-[#5C8C3A]/12 bg-[#F6FAF3] flex flex-col transition-all duration-300 ${isExpanded ? 'flex-1 min-h-[300px]' : 'h-[240px]'}`}>
                    <div className='flex-1 overflow-y-auto p-3 space-y-3'>
                      {advisorMessages.length === 0 && (
                        <div className='flex flex-col items-center justify-center h-full gap-2 text-[#6B8F68]'>
                          <Bot className='h-6 w-6 text-[#5C8C3A]/50' />
                          <p className='text-xs font-mono'>Ask about this applicant&apos;s credit profile</p>
                        </div>
                      )}
                      {advisorMessages.map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.role === 'advisor' && <Bot className='h-4 w-4 mt-1 shrink-0 text-[#5C8C3A]' />}
                          <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user'
                              ? 'bg-[#E8F5E0] text-[#1A2E1C] border border-[#5C8C3A]/20'
                              : 'bg-white text-[#1A2E1C] border border-[#5C8C3A]/12'
                          }`}>
                            {msg.content}
                          </div>
                          {msg.role === 'user' && <User className='h-4 w-4 mt-1 shrink-0 text-[#6B8F68]' />}
                        </div>
                      ))}
                      {advisorLoading && (
                        <div className='flex gap-2.5 items-center text-[#6B8F68] py-1.5 animate-in fade-in'>
                          <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E8F5E0] border border-[#5C8C3A]/15 overflow-hidden'>
                            <ThinkingOrb state='searching' size={20} theme='auto' />
                          </div>
                          <span className='text-xs font-mono text-[#5C8C3A]'>Consulting credit policy engine…</span>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className='border-t border-[#5C8C3A]/12 p-2 flex gap-2 bg-[#EDF5E8]'>
                      <Input
                        placeholder='Why is the return rate flagged?'
                        value={advisorInput}
                        onChange={(e) => setAdvisorInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAdvisorAsk()}
                        className='text-xs h-8 bg-white border-[#5C8C3A]/15 text-[#1A2E1C] focus-visible:ring-[#5C8C3A]'
                        disabled={advisorLoading}
                      />
                      <Button
                        size='sm'
                        onClick={handleAdvisorAsk}
                        disabled={advisorLoading || !advisorInput.trim()}
                        className='h-8 px-3 overflow-hidden bg-[#5C8C3A] hover:bg-[#4A7A30] text-white font-semibold transition-colors'
                      >
                        {advisorLoading ? (
                          <ThinkingOrb state='working' size={20} theme='auto' />
                        ) : (
                          <Send className='h-3.5 w-3.5' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-1.5'>
                    {[
                      'Why is this score low?',
                      'Which source hurt the most?',
                      'Is the return rate concerning?',
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setAdvisorInput(q); }}
                        className='text-[10px] px-2.5 py-1 rounded-full border border-[#5C8C3A]/15 bg-[#E8F5E0] hover:bg-[#5C8C3A] hover:text-white hover:border-[#5C8C3A] text-[#5C8C3A] transition-colors font-mono'
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </Step>

              <Step>
                <div className={`space-y-4 py-2 text-sm ${isExpanded ? 'overflow-y-auto max-h-[70vh] pr-2' : ''}`}>
                  <h3 className='font-medium text-xs uppercase tracking-wider text-[#5C8C3A] font-mono mb-1'>Step 3: Credit Decision & Inclusive Structuring</h3>
                  <div className='space-y-3.5'>
                    <div className='space-y-1.5'>
                      <Label htmlFor='decision' className='text-xs font-mono text-[#6B8F68]'>Officer Credit Decision</Label>
                      <select
                        id='decision'
                        value={decision}
                        onChange={(e) => setDecision(e.target.value as 'approved' | 'rejected')}
                        className='w-full rounded-md border border-[#5C8C3A]/15 bg-[#F6FAF3] px-3 py-2 text-sm text-[#1A2E1C] focus:outline-none focus:ring-1 focus:ring-[#5C8C3A]'
                      >
                        <option value='approved'>Approve Loan</option>
                        <option value='rejected'>Reject Loan</option>
                      </select>
                    </div>

                    {decision === 'approved' && (
                      <div className='space-y-4 animate-fade-up'>
                        <div className='grid grid-cols-2 gap-3'>
                          <div className='col-span-2 space-y-1.5'>
                            <Label htmlFor='amount'>Approved Loan Amount (₹)</Label>
                            <Input
                              id='amount'
                              type='number'
                              value={approvedAmount}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0
                                setApprovedAmount(val)
                                if (selectedApplicant) {
                                  runSimulation(selectedApplicant.user_id, val, interestRate, terms, moratoriumMonths)
                                }
                              }}
                            />
                          </div>
                          <div className='space-y-1.5'>
                            <Label htmlFor='rate'>Interest Rate (%)</Label>
                            <Input
                              id='rate'
                              type='number'
                              step='0.1'
                              value={interestRate}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                setInterestRate(val)
                                if (selectedApplicant) {
                                  runSimulation(selectedApplicant.user_id, approvedAmount, val, terms, moratoriumMonths)
                                }
                              }}
                            />
                          </div>
                          <div className='space-y-1.5'>
                            <Label htmlFor='terms'>Repayment Terms</Label>
                            <Input
                              id='terms'
                              value={terms}
                              onChange={(e) => {
                                setTerms(e.target.value)
                                if (selectedApplicant) {
                                  runSimulation(selectedApplicant.user_id, approvedAmount, interestRate, e.target.value, moratoriumMonths)
                                }
                              }}
                            />
                          </div>
                          <div className='col-span-2 space-y-1.5'>
                            <div className='flex items-center justify-between'>
                              <Label htmlFor='moratorium' className='flex items-center gap-1.5 text-xs font-mono text-[#6B8F68]'>
                                <Calendar className='h-3.5 w-3.5 text-[#5C8C3A]' />
                                Seasonal Harvest Grace Period (Moratorium)
                              </Label>
                              <span className='text-[10px] text-[#6B8F68] font-mono'>Prevents early default during pre-harvest cycles</span>
                            </div>
                            <select
                              id='moratorium'
                              value={moratoriumMonths}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0
                                setMoratoriumMonths(val)
                                if (selectedApplicant) {
                                  runSimulation(selectedApplicant.user_id, approvedAmount, interestRate, terms, val)
                                }
                              }}
                              className='w-full rounded-md border border-[#5C8C3A]/15 bg-[#F6FAF3] px-3 py-2 text-xs text-[#1A2E1C] focus:outline-none focus:ring-1 focus:ring-[#5C8C3A]'
                            >
                              <option value={0}>0 months: Standard monthly EMI schedule</option>
                              <option value={1}>1 month: Post-seeding / setup relief window</option>
                              <option value={2}>2 months: Kharif harvest grace period (Recommended for Farmers)</option>
                              <option value={3}>3 months: Extended crop maturity / seasonal cycle</option>
                            </select>
                          </div>
                        </div>

                        {/* Underwriter What-If Simulator Result */}
                        {simulating ? (
                          <div className='flex items-center justify-center p-3 border border-[#5C8C3A]/12 rounded-lg bg-[#EDF5E8] text-xs text-[#5C8C3A] font-mono gap-2'>
                            <Loader2 className='h-3.5 w-3.5 animate-spin' /> Recalculating reducing-balance EMI & debt burden...
                          </div>
                        ) : simulationResult ? (
                          <div className='rounded-lg border border-[#5C8C3A]/12 bg-[#EDF5E8] p-3 space-y-2.5 animate-fade-up'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-1.5'>
                                <Sliders className='h-3.5 w-3.5 text-[#5C8C3A]' />
                                <span className='font-mono font-medium text-xs text-[#1A2E1C]'>Reducing Balance EMI & Affordability</span>
                              </div>
                              <span
                                className='font-mono text-[10px] px-2 py-0.5 rounded border border-[#5C8C3A]/20 bg-[#E8F5E0] text-[#5C8C3A]'
                              >
                                {simulationResult.is_affordable ? 'Affordable (FOIR Safe)' : 'High Debt Burden'}
                              </span>
                            </div>

                            <div className='grid grid-cols-3 gap-2 text-center font-mono'>
                              <div className='bg-[#F6FAF3] p-2 rounded-md border border-[#5C8C3A]/10'>
                                <div className='text-[10px] text-[#6B8F68]'>Monthly EMI</div>
                                <div className='text-xs font-bold text-[#5C8C3A]'>
                                  ₹{Math.round(simulationResult.monthly_emi).toLocaleString('en-IN')}
                                </div>
                              </div>
                              <div className='bg-[#F6FAF3] p-2 rounded-md border border-[#5C8C3A]/10'>
                                <div className='text-[10px] text-[#6B8F68]'>FOIR Burden</div>
                                <div className='text-xs font-bold text-[#5C8C3A]'>
                                  {simulationResult.foir_ratio_pct.toFixed(1)}%
                                </div>
                              </div>
                              <div className='bg-[#F6FAF3] p-2 rounded-md border border-[#5C8C3A]/10'>
                                <div className='text-[10px] text-[#6B8F68]'>Score Impact</div>
                                <div className='text-xs font-bold text-[#5C8C3A]'>
                                  {simulationResult.score_delta >= 0 ? `+${simulationResult.score_delta}` : simulationResult.score_delta} pts
                                </div>
                              </div>
                            </div>

                            <p className='text-[11px] text-[#4A6B48] leading-relaxed bg-[#F6FAF3] border border-[#5C8C3A]/10 p-2 rounded font-mono'>
                              <strong className='text-[#5C8C3A]'>Guidance:</strong> {simulationResult.guidance}
                            </p>
                          </div>
                        ) : null}

                        {/* Government Welfare Scheme Matcher */}
                        {personalization?.recommendations && personalization.recommendations.length > 0 && (
                          <div className='space-y-2 pt-2 border-t border-[#5C8C3A]/10 animate-fade-up'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-1.5'>
                                <Award className='h-3.5 w-3.5 text-[#5C8C3A]' />
                                <span className='text-xs font-mono uppercase tracking-wider text-[#5C8C3A]'>
                                  Matched Welfare & Subsidized Schemes
                                </span>
                              </div>
                              <span className='text-[10px] font-mono text-[#6B8F68]'>Attach to reduce default risk</span>
                            </div>

                            <div className='space-y-2'>
                              {personalization.recommendations.map((rec: any, idx: number) => {
                                const isChecked = selectedSchemes.includes(rec.scheme_name)
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => {
                                      setSelectedSchemes((prev) =>
                                        isChecked ? prev.filter((s) => s !== rec.scheme_name) : [...prev, rec.scheme_name]
                                      )
                                    }}
                                    className={`cursor-pointer rounded-lg border p-2.5 transition-all duration-150 flex items-start gap-2.5 ${
                                      isChecked
                                        ? 'border-[#5C8C3A] bg-[#E8F5E0] shadow-sm'
                                        : 'border-[#5C8C3A]/12 bg-[#F6FAF3] hover:border-[#5C8C3A]/30 hover:bg-[#EDF5E8]'
                                    }`}
                                  >
                                    <input
                                      type='checkbox'
                                      checked={isChecked}
                                      onChange={() => {}}
                                      className='mt-1 h-3.5 w-3.5 rounded border-[#5C8C3A]/30 bg-white text-[#5C8C3A] focus:ring-[#5C8C3A] cursor-pointer accent-[#5C8C3A]'
                                    />
                                    <div className='flex-1 min-w-0 space-y-1'>
                                      <div className='flex items-center justify-between gap-1'>
                                        <span className='font-mono font-medium text-xs text-[#1A2E1C] truncate'>
                                          {rec.scheme_name}
                                        </span>
                                        <Badge variant='outline' className='text-[9px] px-1.5 py-0 bg-[#E8F5E0] text-[#5C8C3A] border-[#5C8C3A]/20 shrink-0 font-mono'>
                                          {rec.match_score}% Match
                                        </Badge>
                                      </div>
                                      <div className='flex flex-wrap gap-x-2 text-[10px] text-[#6B8F68] font-mono'>
                                        <span>🏛️ {rec.ministry_or_body}</span>
                                        <span>• 💰 {rec.max_benefit}</span>
                                        <span>• 📉 {rec.interest_subsidy}</span>
                                      </div>
                                      <p className='text-[10px] text-[#6B8F68]/80 line-clamp-1 font-mono'>
                                        {rec.match_reasons?.join('; ')}
                                      </p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Step>

              <Step>
                <div className={`space-y-4 py-2 text-sm ${isExpanded ? 'overflow-y-auto max-h-[70vh] pr-2' : ''}`}>
                  <h3 className='font-medium text-xs uppercase tracking-wider text-[#5C8C3A] mb-1 font-mono'>Step 4: Reasoning & Audit Log</h3>

                  {/* Summary of Structuring Package */}
                  <div className='rounded-lg bg-[#EDF5E8] border border-[#5C8C3A]/12 p-3 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-mono font-medium text-[#1A2E1C]'>Structuring Package Summary</span>
                      <Badge variant='outline' className={decision === 'approved' ? 'bg-[#E8F5E0] text-[#2D6B1E] border-[#5C8C3A]/20 font-mono text-[10px] font-semibold' : 'bg-[#FFF0EF] text-[#C43A3A] border-[#D94F4F]/20 font-mono text-[10px] font-semibold'}>
                        {decision === 'approved' ? 'APPROVE WITH SAFEGUARDS' : 'REJECT APPLICATION'}
                      </Badge>
                    </div>

                    {decision === 'approved' && (
                      <div className='flex flex-wrap gap-1.5 text-[11px] font-mono'>
                        <span className='rounded bg-[#F6FAF3] px-2 py-0.5 border border-[#5C8C3A]/15 text-[#5C8C3A] font-semibold'>₹{approvedAmount.toLocaleString('en-IN')}</span>
                        <span className='rounded bg-[#F6FAF3] px-2 py-0.5 border border-[#5C8C3A]/15 text-[#5C8C3A] font-semibold'>{interestRate}% p.a.</span>
                        <span className='rounded bg-[#F6FAF3] px-2 py-0.5 border border-[#5C8C3A]/15 text-[#1A2E1C]'>{terms}</span>
                        {moratoriumMonths > 0 && (
                          <span className='rounded bg-[#E8F5E0] text-[#2D6B1E] px-2 py-0.5 border border-[#5C8C3A]/20 font-semibold'>
                            {moratoriumMonths}m Harvest Moratorium
                          </span>
                        )}
                        {selectedSchemes.map((s, idx) => (
                          <span key={idx} className='rounded bg-[#E8F5E0] text-[#2D6B1E] px-2 py-0.5 border border-[#5C8C3A]/20 font-semibold'>
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className='space-y-1.5'>
                    <Label htmlFor='notes' className='text-xs font-mono text-[#6B8F68]'>Decision Notes & Reasoning</Label>
                    <Textarea
                      id='notes'
                      placeholder='Explain rationale for override, field verification findings, crop/shop health, or attached subsidies...'
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className='bg-[#F6FAF3] border-[#5C8C3A]/15 text-[#1A2E1C] focus-visible:ring-[#5C8C3A]'
                    />
                    <p className='text-xs text-[#6B8F68] font-mono mt-1'>Notes are required to submit. Decision and attached restructuring package will be logged to knowledge audit trail.</p>
                  </div>
                </div>
              </Step>
            </Stepper>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
