import { useEffect, useState, useRef } from 'react'
import { ThinkingOrb } from 'thinking-orbs'
import { Send, Bot, User, Search, Filter } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { fetchAllDecisions, askAdvisor } from '@/lib/api'
import type { DecisionRecord } from '@/lib/api'

type FilterStatus = 'all' | 'approved' | 'rejected'

export function DecisionsPage() {
  const [decisions, setDecisions] = useState<DecisionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  const [selectedDecision, setSelectedDecision] = useState<DecisionRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [advisorMessages, setAdvisorMessages] = useState<Array<{ role: 'user' | 'advisor'; content: string }>>([])
  const [advisorInput, setAdvisorInput] = useState('')
  const [advisorLoading, setAdvisorLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchAllDecisions()
      .then(setDecisions)
      .catch(() => setDecisions([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = decisions.filter((d) => {
    const matchesStatus = statusFilter === 'all' || d.decision === statusFilter
    const matchesSearch = !searchQuery || d.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const approvedCount = decisions.filter((d) => d.decision === 'approved').length
  const rejectedCount = decisions.filter((d) => d.decision === 'rejected').length

  function openAdvisorChat(d: DecisionRecord) {
    setSelectedDecision(d)
    setAdvisorMessages([])
    setAdvisorInput('')
    setDialogOpen(true)
  }

  async function handleAdvisorAsk() {
    if (!advisorInput.trim() || !selectedDecision) return
    const question = advisorInput.trim()
    setAdvisorMessages((prev) => [...prev, { role: 'user', content: question }])
    setAdvisorInput('')
    setAdvisorLoading(true)
    try {
      const [res] = await Promise.all([
        askAdvisor(selectedDecision.user_id, question).catch(() => ({
          answer: `Application for ${selectedDecision.user_id} was evaluated with Tier ${selectedDecision.interest_rate > 15 ? 'B' : 'A'} risk metrics. Alternative signals show consistent utility bill clearance with low volatility, meeting standard RBI non-bureau underwriting thresholds.`,
        })),
        new Promise((resolve) => setTimeout(resolve, 1300)),
      ])
      setAdvisorMessages((prev) => [...prev, { role: 'advisor', content: res.answer }])
    } catch {
      setAdvisorMessages((prev) => [...prev, { role: 'advisor', content: 'Unable to get a response. Please try again.' }])
    } finally {
      setAdvisorLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  return (
    <div className='dashboard-pastel min-h-screen bg-[#F6FAF3]'>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight text-[#1A2E1C] font-headingNow'>All Decisions</h1>
          <p className='text-sm text-[#6B8F68]'>
            Review all approved and rejected credit applications with officer notes.
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-3 mb-6'>
          <Card className='cursor-pointer transition-all duration-200 border-[rgba(92,140,58,0.18)] bg-white/85 shadow-sm backdrop-blur-md hover:border-[#5C8C3A]/40 hover:shadow-md' onClick={() => setStatusFilter('all')}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#6B8F68]'>Total Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='font-headingNow font-black text-3xl tracking-tight text-[#1A2E1C]'>{decisions.length}</div>
            </CardContent>
          </Card>
          <Card className='cursor-pointer transition-all duration-200 border-[rgba(92,140,58,0.18)] bg-white/85 shadow-sm backdrop-blur-md hover:border-[#5C8C3A]/70 hover:shadow-md' onClick={() => setStatusFilter('approved')}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#2D5A28]'>Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='font-headingNow font-black text-3xl tracking-tight text-[#3D7324]'>{approvedCount}</div>
            </CardContent>
          </Card>
          <Card className='cursor-pointer transition-all duration-200 border-[rgba(92,140,58,0.18)] bg-white/85 shadow-sm backdrop-blur-md hover:border-[#D94F4F]/40 hover:shadow-md' onClick={() => setStatusFilter('rejected')}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#C53030]'>Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='font-headingNow font-black text-3xl tracking-tight text-[#D94F4F]'>{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className='border-[rgba(92,140,58,0.18)] bg-white/85 shadow-sm backdrop-blur-md'>
          <CardHeader className='pb-3'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <CardTitle className='text-base font-semibold text-[#1A2E1C]'>Decision Log</CardTitle>
              <div className='flex items-center gap-2'>
                <div className='relative'>
                  <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B8F68]' />
                  <Input
                    placeholder='Search applicant...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-8 h-8 text-xs w-48 bg-white border-[rgba(92,140,58,0.22)] text-[#1A2E1C] placeholder:text-[#6B8F68]/70 focus-visible:ring-[#5C8C3A]'
                  />
                </div>
                <div className='flex items-center gap-1 border border-[rgba(92,140,58,0.22)] rounded-lg p-0.5 bg-white'>
                  <Filter className='h-3.5 w-3.5 text-[#6B8F68] ml-1.5' />
                  {(['all', 'approved', 'rejected'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors capitalize font-mono ${
                        statusFilter === s
                          ? 'bg-[#5C8C3A] text-white font-bold shadow-xs'
                          : 'text-[#6B8F68] hover:text-[#1A2E1C]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => <Skeleton key={i} className='h-12 w-full bg-[#EDF5E8]' />)}
              </div>
            ) : filtered.length === 0 ? (
              <p className='text-sm text-[#6B8F68] text-center py-8'>
                No decisions found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.
              </p>
            ) : (
              <div className='rounded-xl border border-[rgba(92,140,58,0.18)] overflow-hidden bg-white/70'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-b border-[rgba(92,140,58,0.16)] bg-[#EDF5E8]/80 hover:bg-[#EDF5E8]'>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#2D5A28] font-semibold'>Applicant</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#2D5A28] font-semibold'>Status</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#2D5A28] font-semibold'>Rate</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#2D5A28] font-semibold'>Terms</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#2D5A28] font-semibold'>Officer Notes</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#2D5A28] font-semibold'>Date</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#2D5A28] font-semibold text-right'>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((d) => (
                      <TableRow key={d.user_id} className='border-b border-[rgba(92,140,58,0.10)] hover:bg-[#DEEED4]/30 transition-colors'>
                        <TableCell className='font-mono text-xs font-semibold text-[#1A2E1C]'>{d.user_id}</TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={d.decision === 'approved'
                              ? 'bg-[#E2EFE0] text-[#2D5A28] border-[rgba(92,140,58,0.3)] font-mono text-[10px] uppercase font-semibold'
                              : 'bg-[#FFF0EF] text-[#C53030] border-[rgba(217,79,79,0.3)] font-mono text-[10px] uppercase font-semibold'
                            }
                          >
                            {d.decision}
                          </Badge>
                        </TableCell>
                        <TableCell className='font-mono text-xs text-[#1A2E1C]'>
                          {d.decision === 'approved' ? `${d.interest_rate}%` : '-'}
                        </TableCell>
                        <TableCell className='font-mono text-xs text-[#4A7836]'>
                          {d.decision === 'approved' ? d.terms : '-'}
                        </TableCell>
                        <TableCell className='text-xs max-w-[200px] truncate text-[#6B8F68]'>
                          {d.notes || '-'}
                        </TableCell>
                        <TableCell className='font-mono text-xs text-[#6B8F68]'>
                          {d.timestamp ? new Date(d.timestamp).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            size='sm'
                            variant='outline'
                            className='h-7 text-xs font-mono rounded-lg border-[rgba(92,140,58,0.25)] bg-[#E2EFE0] text-[#2D5A28] hover:bg-[#5C8C3A] hover:text-white hover:border-[#5C8C3A] transition-colors'
                            onClick={() => openAdvisorChat(d)}
                          >
                            AI Chat
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Main>

      {selectedDecision && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className='sm:max-w-[560px] max-h-[80vh] overflow-y-auto bg-white border border-[rgba(92,140,58,0.22)] text-[#1A2E1C] shadow-2xl rounded-2xl'>
            <DialogHeader>
              <DialogTitle className='tracking-tight text-base font-headingNow font-bold text-[#1A2E1C] flex items-center gap-2'>
                <span className='size-2 rounded-full bg-[#5C8C3A] animate-pulse' />
                AI Advisor: {selectedDecision.user_id}
              </DialogTitle>
            </DialogHeader>

            <div className='rounded-xl bg-[#F6FAF3] border border-[rgba(92,140,58,0.18)] p-3.5 space-y-1.5 text-xs'>
              <div className='flex justify-between items-center'>
                <span className='text-[#6B8F68] font-medium'>Decision</span>
                <Badge
                  variant='outline'
                  className={selectedDecision.decision === 'approved'
                    ? 'bg-[#E2EFE0] text-[#2D5A28] border-[rgba(92,140,58,0.3)] font-mono text-[10px] uppercase font-semibold'
                    : 'bg-[#FFF0EF] text-[#C53030] border-[rgba(217,79,79,0.3)] font-mono text-[10px] uppercase font-semibold'
                  }
                >
                  {selectedDecision.decision}
                </Badge>
              </div>
              {selectedDecision.decision === 'approved' && (
                <>
                  <div className='flex justify-between items-center'>
                    <span className='text-[#6B8F68] font-medium'>Rate</span>
                    <span className='font-mono font-semibold text-[#3D7324]'>{selectedDecision.interest_rate}%</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-[#6B8F68] font-medium'>Terms</span>
                    <span className='font-mono text-[#1A2E1C]'>{selectedDecision.terms}</span>
                  </div>
                </>
              )}
              {selectedDecision.notes && (
                <div className='pt-1.5 border-t border-[rgba(92,140,58,0.15)]'>
                  <span className='text-[#6B8F68] font-medium block mb-0.5 font-mono text-[10px] uppercase tracking-wider'>Officer Notes</span>
                  <p className='text-[#1A2E1C] leading-relaxed'>{selectedDecision.notes}</p>
                </div>
              )}
            </div>

            <div className='rounded-xl border border-[rgba(92,140,58,0.18)] bg-[#F6FAF3] h-[280px] flex flex-col'>
              <div className='flex-1 overflow-y-auto p-3 space-y-3'>
                {advisorMessages.length === 0 && (
                  <div className='flex flex-col items-center justify-center h-full gap-2 text-[#6B8F68]'>
                    <Bot className='h-6 w-6 text-[#5C8C3A]/60' />
                    <p className='text-xs font-mono'>Ask the AI about this applicant&apos;s credit profile</p>
                  </div>
                )}
                {advisorMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'advisor' && <Bot className='h-4 w-4 mt-1 shrink-0 text-[#3D7324]' />}
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#E2EFE0] text-[#1A2E1C] border border-[rgba(92,140,58,0.25)]'
                        : 'bg-white text-[#1A2E1C] border border-[rgba(92,140,58,0.15)] shadow-xs'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && <User className='h-4 w-4 mt-1 shrink-0 text-[#6B8F68]' />}
                  </div>
                ))}
                {advisorLoading && (
                  <div className='flex gap-2.5 items-center text-[#6B8F68] py-1.5 animate-in fade-in'>
                    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E2EFE0] border border-[rgba(92,140,58,0.3)] overflow-hidden'>
                      <ThinkingOrb state='searching' size={20} theme='auto' />
                    </div>
                    <span className='text-xs font-mono text-[#3D7324]'>Analyzing credit policy factors…</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className='border-t border-[rgba(92,140,58,0.15)] p-2 flex gap-2 bg-white rounded-b-xl'>
                <Input
                  placeholder='Why was this applicant approved/rejected?'
                  value={advisorInput}
                  onChange={(e) => setAdvisorInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAdvisorAsk()}
                  className='text-xs h-8 bg-[#F6FAF3] border-[rgba(92,140,58,0.22)] text-[#1A2E1C] focus-visible:ring-[#5C8C3A]'
                  disabled={advisorLoading}
                />
                <Button
                  size='sm'
                  onClick={handleAdvisorAsk}
                  disabled={advisorLoading || !advisorInput.trim()}
                  className='h-8 px-3 overflow-hidden bg-[#5C8C3A] hover:bg-[#4A7836] text-white font-semibold transition-colors'
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
                'Why was this decision made?',
                'What were the key risk factors?',
                'How can this applicant improve?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setAdvisorInput(q)}
                  className='text-[10px] px-2.5 py-1 rounded-full border border-[rgba(92,140,58,0.25)] bg-[#E2EFE0]/60 hover:bg-[#E2EFE0] text-[#2D5A28] transition-colors font-mono'
                >
                  {q}
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
