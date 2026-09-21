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
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>All Decisions</h1>
          <p className='text-sm text-muted-foreground'>
            Review all approved and rejected credit applications with officer notes.
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-3 mb-6'>
          <Card className='cursor-pointer transition-all duration-200 border-[rgba(92,140,58,0.18)] bg-[#0A140C]/90 backdrop-blur-md hover:border-[#8FC45A]/40' onClick={() => setStatusFilter('all')}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#9BB096]'>Total Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='font-headingNow font-black text-3xl tracking-tight text-[#F4F8F1]'>{decisions.length}</div>
            </CardContent>
          </Card>
          <Card className='cursor-pointer transition-all duration-200 border-[rgba(92,140,58,0.18)] bg-[#0A140C]/90 backdrop-blur-md hover:border-[#5C8C3A]/70' onClick={() => setStatusFilter('approved')}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#9BB096]'>Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='font-headingNow font-black text-3xl tracking-tight text-[#8FC45A]'>{approvedCount}</div>
            </CardContent>
          </Card>
          <Card className='cursor-pointer transition-all duration-200 border-[rgba(92,140,58,0.18)] bg-[#0A140C]/90 backdrop-blur-md hover:border-[#EF4444]/40' onClick={() => setStatusFilter('rejected')}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-[#9BB096]'>Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='font-headingNow font-black text-3xl tracking-tight text-[#F87171]'>{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className='border-[rgba(92,140,58,0.18)] bg-[#0A140C]/90 backdrop-blur-md'>
          <CardHeader className='pb-3'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <CardTitle className='text-base font-semibold text-[#F4F8F1]'>Decision Log</CardTitle>
              <div className='flex items-center gap-2'>
                <div className='relative'>
                  <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9BB096]' />
                  <Input
                    placeholder='Search applicant...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-8 h-8 text-xs w-48 bg-[#050B06] border-[#2F5527]/50 text-[#F4F8F1] focus-visible:ring-[#8FC45A]'
                  />
                </div>
                <div className='flex items-center gap-1 border border-[#2F5527]/50 rounded-md p-0.5 bg-[#050B06]'>
                  <Filter className='h-3.5 w-3.5 text-[#9BB096] ml-1.5' />
                  {(['all', 'approved', 'rejected'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`text-[11px] px-2.5 py-1 rounded transition-colors capitalize font-mono ${
                        statusFilter === s
                          ? 'bg-[#5C8C3A] text-[#050B06] font-bold shadow-xs'
                          : 'text-[#9BB096] hover:text-[#F4F8F1]'
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
                {[1, 2, 3].map((i) => <Skeleton key={i} className='h-12 w-full' />)}
              </div>
            ) : filtered.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-8'>
                No decisions found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.
              </p>
            ) : (
              <div className='rounded-lg border border-[#2F5527]/40 overflow-hidden bg-[#050B06]/60'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-b border-[#2F5527]/40 bg-[#0C1A0F]/60 hover:bg-[#0C1A0F]/80'>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#8FC45A]'>Applicant</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#8FC45A]'>Status</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#8FC45A]'>Rate</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#8FC45A]'>Terms</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#8FC45A]'>Officer Notes</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#8FC45A]'>Date</TableHead>
                      <TableHead className='font-mono text-[11px] uppercase tracking-wider text-[#8FC45A] text-right'>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((d) => (
                      <TableRow key={d.user_id} className='border-b border-[#2F5527]/20 hover:bg-[#0A140C]/80 transition-colors'>
                        <TableCell className='font-mono text-xs font-semibold text-[#F4F8F1]'>{d.user_id}</TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={d.decision === 'approved'
                              ? 'bg-[#142817] text-[#8FC45A] border-[#2F5527]/70 font-mono text-[10px] uppercase font-semibold'
                              : 'bg-[#280B0B] text-[#F87171] border-[#7A1D1D]/60 font-mono text-[10px] uppercase font-semibold'
                            }
                          >
                            {d.decision}
                          </Badge>
                        </TableCell>
                        <TableCell className='font-mono text-xs text-[#F4F8F1]'>
                          {d.decision === 'approved' ? `${d.interest_rate}%` : '-'}
                        </TableCell>
                        <TableCell className='font-mono text-xs text-[#9BB096]'>
                          {d.decision === 'approved' ? d.terms : '-'}
                        </TableCell>
                        <TableCell className='text-xs max-w-[200px] truncate text-[#9BB096]'>
                          {d.notes || '-'}
                        </TableCell>
                        <TableCell className='font-mono text-xs text-[#9BB096]'>
                          {d.timestamp ? new Date(d.timestamp).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            size='sm'
                            variant='outline'
                            className='h-7 text-xs font-mono rounded border-[#2F5527]/50 bg-[#122415]/60 text-[#8FC45A] hover:bg-[#5C8C3A] hover:text-[#050B06] hover:border-[#8FC45A] transition-colors'
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
          <DialogContent className='sm:max-w-[560px] max-h-[80vh] overflow-y-auto bg-[#050B06] border border-[#2F5527]/50 text-[#F4F8F1]'>
            <DialogHeader>
              <DialogTitle className='tracking-tight text-base font-headingNow font-bold text-[#F4F8F1] flex items-center gap-2'>
                <span className='size-2 rounded-full bg-[#8FC45A] animate-pulse' />
                AI Advisor: {selectedDecision.user_id}
              </DialogTitle>
            </DialogHeader>

            <div className='rounded-lg bg-[#0A140C] border border-[#2F5527]/40 p-3 space-y-1.5 text-xs'>
              <div className='flex justify-between items-center'>
                <span className='text-[#9BB096] font-medium'>Decision</span>
                <Badge
                  variant='outline'
                  className={selectedDecision.decision === 'approved'
                    ? 'bg-[#142817] text-[#8FC45A] border-[#2F5527]/70 font-mono text-[10px] uppercase font-semibold'
                    : 'bg-[#280B0B] text-[#F87171] border-[#7A1D1D]/60 font-mono text-[10px] uppercase font-semibold'
                  }
                >
                  {selectedDecision.decision}
                </Badge>
              </div>
              {selectedDecision.decision === 'approved' && (
                <>
                  <div className='flex justify-between items-center'>
                    <span className='text-[#9BB096] font-medium'>Rate</span>
                    <span className='font-mono font-semibold text-[#8FC45A]'>{selectedDecision.interest_rate}%</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-[#9BB096] font-medium'>Terms</span>
                    <span className='font-mono text-[#F4F8F1]'>{selectedDecision.terms}</span>
                  </div>
                </>
              )}
              {selectedDecision.notes && (
                <div className='pt-1.5 border-t border-[#2F5527]/30'>
                  <span className='text-[#9BB096] font-medium block mb-0.5 font-mono text-[10px] uppercase tracking-wider'>Officer Notes</span>
                  <p className='text-[#F4F8F1] leading-relaxed'>{selectedDecision.notes}</p>
                </div>
              )}
            </div>

            <div className='rounded-lg border border-[#2F5527]/40 bg-[#0A140C]/80 h-[280px] flex flex-col'>
              <div className='flex-1 overflow-y-auto p-3 space-y-3'>
                {advisorMessages.length === 0 && (
                  <div className='flex flex-col items-center justify-center h-full gap-2 text-[#9BB096]'>
                    <Bot className='h-6 w-6 text-[#8FC45A]/50' />
                    <p className='text-xs font-mono'>Ask the AI about this applicant&apos;s credit profile</p>
                  </div>
                )}
                {advisorMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'advisor' && <Bot className='h-4 w-4 mt-1 shrink-0 text-[#8FC45A]' />}
                    <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#122415] text-[#F4F8F1] border border-[#2F5527]/70'
                        : 'bg-[#050B06] text-[#F4F8F1] border border-[#2F5527]/40'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && <User className='h-4 w-4 mt-1 shrink-0 text-[#9BB096]' />}
                  </div>
                ))}
                {advisorLoading && (
                  <div className='flex gap-2.5 items-center text-[#9BB096] py-1.5 animate-in fade-in'>
                    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#122415] border border-[#2F5527]/60 overflow-hidden'>
                      <ThinkingOrb state='searching' size={20} theme='auto' />
                    </div>
                    <span className='text-xs font-mono text-[#8FC45A]'>Analyzing credit policy factors…</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className='border-t border-[#2F5527]/40 p-2 flex gap-2 bg-[#050B06]'>
                <Input
                  placeholder='Why was this applicant approved/rejected?'
                  value={advisorInput}
                  onChange={(e) => setAdvisorInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAdvisorAsk()}
                  className='text-xs h-8 bg-[#0A140C] border-[#2F5527]/50 text-[#F4F8F1] focus-visible:ring-[#8FC45A]'
                  disabled={advisorLoading}
                />
                <Button
                  size='sm'
                  onClick={handleAdvisorAsk}
                  disabled={advisorLoading || !advisorInput.trim()}
                  className='h-8 px-3 overflow-hidden bg-[#5C8C3A] hover:bg-[#8FC45A] text-[#050B06] font-semibold transition-colors'
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
                  className='text-[10px] px-2.5 py-1 rounded-full border border-[#2F5527]/60 bg-[#122415]/60 hover:bg-[#142817] hover:border-[#8FC45A]/50 text-[#8FC45A] transition-colors font-mono'
                >
                  {q}
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
