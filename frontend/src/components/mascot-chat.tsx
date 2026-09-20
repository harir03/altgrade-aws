import { useState, useEffect, useRef } from 'react'
import { ThinkingOrb } from 'thinking-orbs'
import { useTranslation } from 'react-i18next'
import {
  X,
  Send,
  Volume2,
  VolumeX,
  User,
  Maximize2,
  Minimize2,
  PhoneCall,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { sendMascotMessage, fetchMascotStatus, requestOutboundCall, getCallResults } from '@/lib/api'
import { getDefaultPhone, maskPhoneNumber } from '@/lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  modelUsed?: string
}


interface MascotTranslations {
  cardTitle: string
  cardDesc: string
  cardBtn: string
  zeroBureau: string
  vernacularSubtitle: string
  requestCallHeaderBtn: string
  drawerTitle: string
  drawerDesc: string
  voiceOption: string
  officerOption: string
  phonePlaceholder: string
  callBtn: string
  scheduleBtn: string
  listenBtn: string
  stopBtn: string
  inputPlaceholder: string
  footerTagline: string
  clickToChat: string
  assistantArrow: string
  thinking: string
  welcomeGreeting: string
  callbackVoiceConfirm: (phone: string) => string
  callbackOfficerConfirm: (phone: string) => string
  errorConnect: string
}

const MASCOT_I18N: Record<'en' | 'hi' | 'gu' | 'ta', MascotTranslations> = {
  en: {
    cardTitle: 'Prefer an on-call banking service?',
    cardDesc: 'Speak directly with our AI Voice Officer in your language or request a field visit.',
    cardBtn: 'Request Call Back',
    zeroBureau: 'Zero Bureau Required',
    vernacularSubtitle: 'Vernacular Credit Intelligence',
    requestCallHeaderBtn: 'Request Call',
    drawerTitle: 'Request Spoken Assistance',
    drawerDesc: 'Direct phone connection in your language',
    voiceOption: 'AI Voice Officer (Immediate)',
    officerOption: 'Field Officer Visit',
    phonePlaceholder: 'Enter 10-digit mobile number',
    callBtn: 'Call Me Now',
    scheduleBtn: 'Schedule Visit',
    listenBtn: 'Listen',
    stopBtn: 'Stop',
    inputPlaceholder: 'Ask anything about alternative credit, loans or score...',
    footerTagline: 'Mitra Vernacular AI • Verified by AltGrade Engine',
    clickToChat: 'Click to chat',
    assistantArrow: 'Assistant →',
    thinking: 'Thinking in English...',
    welcomeGreeting:
      'Hello! I am Mitra, your credit & financial guide. AltGrade brings online banking for all—evaluating your everyday utility bills and UPI history to approve fair loans without a CIBIL score.\n\nPrefer an on-call banking service? You can request an immediate callback from our AI Voice Officer or ask any question right here!',
    callbackVoiceConfirm: (phone: string) =>
      `📞 On-Call Banking Callback requested for ${phone}. Arun (Personal Account Manager) is dialing your number to discuss loan options.`,
    callbackOfficerConfirm: (phone: string) =>
      `📋 Local Field Loan Officer visit requested for ${phone}. An assigned representative will contact you within 24–48 hours to assist with paperwork.`,
    errorConnect:
      'I am taking a moment to connect. AltGrade verifies your utility and UPI history to grant fair loans without traditional bureau requirements.',
  },
  gu: {
    cardTitle: 'શું તમે ફોન પર બેંકિંગ સેવા પસંદ કરો છો?',
    cardDesc: 'તમારી ભાષામાં અમારા એઆઈ વૉઇસ ઑફિસર સાથે સીધી વાત કરો અથવા ફિલ્ડ વિઝિટની વિનંતી કરો.',
    cardBtn: 'કૉલ બૅકની વિનંતી કરો',
    zeroBureau: 'કોઈ સિબિલ સ્કોર જરૂરી નથી',
    vernacularSubtitle: 'પ્રાદેશિક ક્રેડિટ બુદ્ધિમત્તા',
    requestCallHeaderBtn: 'કૉલ વિનંતી',
    drawerTitle: 'બોલીને સહાય મેળવો',
    drawerDesc: 'તમારી ભાષામાં સીધો ફોન સંપર્ક',
    voiceOption: 'એઆઈ વૉઇસ ઑફિસર (તરત)',
    officerOption: 'ફિલ્ડ ઑફિસર મુલાકાત',
    phonePlaceholder: '૧૦ અંકનો મોબાઈલ નંબર દાખલ કરો',
    callBtn: 'મને અત્યારે કૉલ કરો',
    scheduleBtn: 'મુલાકાત શેડ્યૂલ કરો',
    listenBtn: 'સાંભળો',
    stopBtn: 'બંધ કરો',
    inputPlaceholder: 'લોન અથવા વ્યાજ દર વિશે કંઈપણ પૂછો...',
    footerTagline: 'મિત્રા વેરનેક્યુલર AI • ઓલ્ટગ્રેડ એન્જિન દ્વારા ચકાસાયેલ',
    clickToChat: 'ચેટ કરવા માટે ટૅપ કરો',
    assistantArrow: 'સહાયક →',
    thinking: 'ગુજરાતીમાં વિચારી રહ્યા છીએ...',
    welcomeGreeting:
      'નમસ્તે! હું મિત્રા છું, તમારો ક્રેડિટ માર્ગદર્શક. ઑલ્ટગ્રેડ તમારા લાઈટ બિલ અને યુપીઆઈથી વગર સિબિલ સ્કોરે સરળ લોન અપાવે છે.\n\nશું તમે ફોન પર બેંકિંગ સેવા પસંદ કરો છો? તમે અમારા એઆઈ વૉઇસ ઑફિસર પાસેથી તરત કૉલ બૅકની વિનંતી કરી શકો છો!',
    callbackVoiceConfirm: (phone: string) =>
      `📞 ${phone} માટે ઓન-કૉલ બેંકિંગ કૉલબૅકની વિનંતી થઈ છે. અરુણ (પર્સનલ એકાઉન્ટ મેનેજર) ગુજરાતીમાં લોન વિકલ્પોની ચર્ચા કરવા માટે તમારા નંબર પર કૉલ કરી રહ્યા છે.`,
    callbackOfficerConfirm: (phone: string) =>
      `📋 ${phone} માટે સ્થાનિક ફિલ્ડ લોન ઓફિસર મુલાકાતની વિનંતી નોંધાઈ છે. અમારા પ્રતિનિધિ દસ્તાવેજો માટે 24–48 કલાકમાં તમારો સંપર્ક કરશે.`,
    errorConnect:
      'માફ કરશો, કનેક્શનમાં થોડો સમય લાગી રહ્યો છે. તમે તમારા નજીકના લોન અધિકારીનો સંપર્ક કરી શકો છો.',
  },
  hi: {
    cardTitle: 'क्या आप फोन पर बैंकिंग सेवा पसंद करते हैं?',
    cardDesc: 'अपनी भाषा में हमारे एआई वॉइस ऑफिसर से सीधे बात करें या फील्ड विजिट का अनुरोध करें।',
    cardBtn: 'कॉल बैक का अनुरोध करें',
    zeroBureau: 'बिना सिबिल स्कोर आवश्यक',
    vernacularSubtitle: 'क्षेत्रीय क्रेडिट इंटेलिजेंस',
    requestCallHeaderBtn: 'कॉल अनुरोध',
    drawerTitle: 'बोलकर सहायता का अनुरोध करें',
    drawerDesc: 'आपकी भाषा में सीधा फोन कनेक्शन',
    voiceOption: 'एआई वॉइस ऑफिसर (तत्काल)',
    officerOption: 'फील्ड ऑफिसर विजिट',
    phonePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें',
    callBtn: 'मुझे अभी कॉल करें',
    scheduleBtn: 'विजिट शेड्यूल करें',
    listenBtn: 'सुनें',
    stopBtn: 'रोकें',
    inputPlaceholder: 'ऋण या ब्याज दर के बारे में कुछ भी पूछें...',
    footerTagline: 'मित्रा वर्नाक्युलर AI • ऑल्टग्रेड इंजन द्वारा सत्यापित',
    clickToChat: 'चैट करने के लिए टैप करें',
    assistantArrow: 'सहायक →',
    thinking: 'हिंदी में सोच रहे हैं...',
    welcomeGreeting:
      'नमस्ते! मैं मित्रा हूँ। ऑल्टग्रेड आपके बिजली बिल और यूपीआई से बिना सिबिल स्कोर के आसान लोन दिलाता है।\n\nक्या आप फोन पर बैंकिंग सेवा पसंद करते हैं? आप हमारे एआई वॉइस ऑफिसर से तुरंत कॉल बैक का अनुरोध कर सकते हैं!',
    callbackVoiceConfirm: (phone: string) =>
      `📞 ${phone} के लिए ऑन-कॉल बैंकिंग कॉलबैक का अनुरोध किया गया है। अरुण (पर्सनल अकाउंट मैनेजर) लोन विकल्पों पर चर्चा करने के लिए कॉल कर रहे हैं।`,
    callbackOfficerConfirm: (phone: string) =>
      `📋 ${phone} के लिए फील्ड लोन ऑफिसर विजिट का अनुरोध दर्ज किया गया है। 24–48 घंटों में संपर्क किया जाएगा।`,
    errorConnect:
      'क्षमा करें, कनेक्शन में कुछ समय लग रहा है। आप अपने नजदीकी लोन अधिकारी से संपर्क कर सकते हैं।',
  },
  ta: {
    cardTitle: 'ஃபோன் மூலம் வங்கி சேவையை விரும்புகிறீர்களா?',
    cardDesc: 'உங்கள் மொழியில் எங்கள் AI வாய்ஸ் ஆபிசருடன் நேரடியாகப் பேசுங்கள் அல்லது கள வருகையைக் கோருங்கள்.',
    cardBtn: 'கால் பேக் கோருங்கள்',
    zeroBureau: 'CIBIL தேவையில்லை',
    vernacularSubtitle: 'பிராந்திய கடன் நுண்ணறிவு',
    requestCallHeaderBtn: 'அழைப்பு கோரிக்கை',
    drawerTitle: 'பேசி உதவி பெற விண்ணப்பிக்கவும்',
    drawerDesc: 'உங்கள் மொழியில் நேரடி தொலைபேசி இணைப்பு',
    voiceOption: 'AI வாய்ஸ் ஆபிசர் (உடனடி)',
    officerOption: 'கள அதிகாரி வருகை',
    phonePlaceholder: '10 இலக்க மொபைல் எண்',
    callBtn: 'எனக்கு இப்போது அழைக்கவும்',
    scheduleBtn: 'வருகையைத் திட்டமிடுங்கள்',
    listenBtn: 'கேளுங்கள்',
    stopBtn: 'நிறுத்து',
    inputPlaceholder: 'கடன் அல்லது வட்டி பற்றி ஏதேனும் கேளுங்கள்...',
    footerTagline: 'மித்ரா வெர்னாகுலர் AI • ஆல்ட்கிரேட் என்ஜினால் சரிபார்க்கப்பட்டது',
    clickToChat: 'அரட்டை செய்ய தட்டவும்',
    assistantArrow: 'உதவியாளர் →',
    thinking: 'தமிழில் சிந்திக்கிறது...',
    welcomeGreeting:
      'வணக்கம்! நான் மித்ரா. மின் கட்டணம் மற்றும் UPI மூலம் CIBIL ஸ்கோர் இல்லாமலேயே நியாயமான கடன் பெறலாம்.\n\nஃபோன் கால் மூலம் வங்கி சேவையை விரும்புகிறீர்களா? எங்கள் AI வாய்ஸ் ஆபிசரிடமிருந்து உடனே கால் பேக் கோரலாம்!',
    callbackVoiceConfirm: (phone: string) =>
      `📞 ${phone} க்கான ஆன்-கால் பேங்கிங் கோரப்பட்டது. அருண் உங்கள் எண்ணை அழைக்கிறார்.`,
    callbackOfficerConfirm: (phone: string) =>
      `📋 ${phone} க்கான கள அதிகாரி வருகை பதிவு செய்யப்பட்டது.`,
    errorConnect:
      'மன்னிக்கவும், இணைப்பில் தாமதம் ஏற்படுகிறது. உங்கள் உள்ளூர் கடன் அதிகாரியைத் தொடர்பு கொள்ளலாம்.',
  },
}

export function MascotChat() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedLang, setSelectedLang] = useState<'hi' | 'gu' | 'ta' | 'en'>(() => {
    const curr = i18n.language
    return (curr === 'hi' || curr === 'gu' || curr === 'ta' || curr === 'en') ? curr : 'en'
  })
  const t = MASCOT_I18N[selectedLang] || MASCOT_I18N.en
  const [showCallbackForm, setShowCallbackForm] = useState(false)
  const [callbackPhone, setCallbackPhone] = useState(() => getDefaultPhone())
  const [isPhoneMasked, setIsPhoneMasked] = useState(true)
  const [callbackType, setCallbackType] = useState<'voice' | 'officer'>('voice')
  const [isRequestingCall, setIsRequestingCall] = useState(false)
  const [, setActiveCallId] = useState<string | null>(null)
  const [callStageMsg, setCallStageMsg] = useState<string | null>(null)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const curr = i18n.language
    const initialLang = (curr === 'hi' || curr === 'gu' || curr === 'ta' || curr === 'en') ? curr : 'en'
    const dict = MASCOT_I18N[initialLang as 'en' | 'hi' | 'gu' | 'ta'] || MASCOT_I18N.en
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: dict.welcomeGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'local-model',
      },
    ]
  })
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [isLocalModel, setIsLocalModel] = useState<boolean>(true)
  const [isHovered, setIsHovered] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync with global i18n language changes from navbar or elsewhere
  useEffect(() => {
    if (i18n.language && ['en', 'hi', 'gu', 'ta'].includes(i18n.language)) {
      setSelectedLang(i18n.language as any)
    }
  }, [i18n.language])

  // Cleanup polling timer on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
  }, [])


  // Check model status on mount
  useEffect(() => {
    fetchMascotStatus()
      .then((res) => {
        setIsLocalModel(res.ollama_online || res.status === 'ready')
      })
      .catch(() => setIsLocalModel(true))
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Handle language switch (syncs globally with i18n!)
  const handleLanguageChange = (lang: 'hi' | 'gu' | 'ta' | 'en') => {
    setSelectedLang(lang)
    i18n.changeLanguage(lang) // Updates the entire application globally!

    const dict = MASCOT_I18N[lang] || MASCOT_I18N.en
    setMessages((prev) => [
      ...prev,
      {
        id: `lang-switch-${Date.now()}`,
        role: 'assistant',
        content: dict.welcomeGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'local-model',
      },
    ])
  }

  // Text-To-Speech reader
  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      window.speechSynthesis?.cancel()
      setSpeakingId(null)
      return
    }

    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)

    const langCodes: Record<string, string> = {
      hi: 'hi-IN',
      gu: 'gu-IN',
      ta: 'ta-IN',
      en: 'en-IN',
    }
    utterance.lang = langCodes[selectedLang] || 'en-US'
    utterance.rate = 0.95

    utterance.onend = () => setSpeakingId(null)
    utterance.onerror = () => setSpeakingId(null)

    setSpeakingId(id)
    window.speechSynthesis.speak(utterance)
  }

  // Send message
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim()
    if (!text || isLoading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const [res] = await Promise.all([
        sendMascotMessage({
          message: text,
          language: selectedLang,
          history,
        }).catch(() => ({
          reply:
            selectedLang === 'hi'
              ? 'अल्टग्रेड बिजली, मोबाइल रीचार्ज और यूपीआई लेनदेन को बिना सिबिल स्कोर के लोन स्वीकृति के लिए स्वीकार करता है। आपका मासिक नियमित भुगतान स्कोर को मजबूत करता है।'
              : selectedLang === 'gu'
              ? 'અલ્ટગ્રેડ સીબીલ સ્કોર વિના લોન મંજૂરી માટે વીજળી બિલ, મોબાઈલ રિચાર્જ અને યુપીઆઈ વ્યવહારોને સ્વીકારે છે.'
              : selectedLang === 'ta'
              ? 'ஆல்ட்கிரேட் மின்சாரக் கட்டணம், தொலைத்தொடர்பு மற்றும் யுபிஐ வரலாற்றை ஆராய்ந்து எந்த சிபில் ஸ்கோரும் இல்லாமல் கடன் வழங்குகிறது.'
              : 'AltGrade accepts electricity bills, gas/LPG receipts, mobile telecom recharge consistency, and merchant UPI transaction histories. Regular payments verify your financial discipline and qualify you for instant loans without CIBIL!',
          model_used: 'altgrade-mascot-local',
          is_local: true,
        })),
        new Promise((resolve) => setTimeout(resolve, 1400)),
      ])

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: res.model_used,
      }

      setMessages((prev) => [...prev, botMsg])
      if (res.is_local !== undefined) {
        setIsLocalModel(res.is_local)
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          selectedLang === 'hi'
            ? 'क्षमा करें, कनेक्शन में कुछ समय लग रहा है। आप अपने नजदीकी लोन अधिकारी से संपर्क कर सकते हैं।'
            : selectedLang === 'gu'
            ? 'માફ કરશો, કનેક્શનમાં થોડો સમય લાગી રહ્યો છે. તમે તમારા નજીકના લોન અધિકારીનો સંપર્ક કરી શકો છો.'
            : selectedLang === 'ta'
            ? 'மன்னிக்கவும், இணைப்பில் தாமதம் ஏற்படுகிறது. உங்கள் உள்ளூர் கடன் அதிகாரியைத் தொடர்பு கொள்ளலாம்.'
            : 'I am taking a moment to connect. AltGrade verifies your utility and UPI history to grant fair loans without traditional bureau requirements.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'offline-agent',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Poll call progress and automatically handoff to Loan Dashboard upon completion
  const startCallPolling = (userId: string) => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    let lastStage = ''

    pollTimerRef.current = setInterval(async () => {
      try {
        const result = await getCallResults(userId)
        if (result.stage && result.stage !== lastStage) {
          lastStage = result.stage
          setCallStageMsg(result.message || null)

          if (result.stage === 'needs_discovery') {
            toast.info('Arun (Account Manager) connected: Discussing your banking needs...')
          } else if (result.stage === 'secure_verification') {
            toast.info('Secure Verification: Last 4 digits of Aadhaar & phone verified.')
          } else if (result.stage === 'credit_scoring') {
            toast.info('Credit Scoring: Calculating zero-CIBIL pre-approved limits...')
          }
        }

        if (result.completed) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current)
          pollTimerRef.current = null
          setActiveCallId(null)
          setCallStageMsg(null)

          const offer = result.loan_offer || result.ai_suggestion
          const offerLine = offer
            ? `\n\n🎉 Pre-Approved Offer: ₹${offer.credit_limit?.toLocaleString('en-IN')} at ${offer.annual_interest_rate}% interest (Monthly EMI: ₹${offer.emi?.toLocaleString('en-IN')}).\n\n🚀 Transferring you directly to your Loan Dashboard...`
            : '\n\n🚀 Transferring you directly to your Loan Dashboard...'

          const completionMsg: ChatMessage = {
            id: `call-complete-${Date.now()}`,
            role: 'assistant',
            content: `✅ On-Call Banking & Credit Scoring Completed with Account Manager Arun!${offerLine}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            modelUsed: 'account-manager-arun',
          }
          setMessages((prev) => [...prev, completionMsg])
          toast.success('On-call credit scoring completed! Unlocking Loan Dashboard...')

          // Automatically navigate to the Loan Dashboard after call completion
          setTimeout(() => {
            window.location.href = '/_applicant/score'
          }, 2200)
        } else if (result.failed) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current)
          pollTimerRef.current = null
          setActiveCallId(null)
          setCallStageMsg(null)
          toast.error(result.error_message || 'Call ended or could not be completed.')
        }
      } catch {
        // ignore polling errors
      }
    }, 2000)
  }

  // Handle request a call back
  const handleRequestCallback = async () => {
    const phone = callbackPhone.trim() || getDefaultPhone()
    setIsRequestingCall(true)
    try {
      if (callbackType === 'voice') {
        const res = await requestOutboundCall('guest-user', phone, selectedLang, 'farmer', 'on_call_banking')
        if (res.status === 'error') {
          toast.error(res.message || 'Call request could not be dispatched.')
        } else {
          toast.success(res.message || 'AI On-Call Banking callback initiated!')
          setActiveCallId(res.call_id || 'guest-user')
          startCallPolling('guest-user')
        }
      } else {
        toast.success('Field Loan Officer callback request confirmed!')
      }

      const maskedPhone = maskPhoneNumber(phone)
      const confirmationMsg: ChatMessage = {
        id: `callback-${Date.now()}`,
        role: 'assistant',
        content:
          callbackType === 'voice'
            ? `📞 On-Call Banking Callback requested for ${maskedPhone}. Arun (Personal Account Manager) is dialing your number to discuss loan options in ${selectedLang.toUpperCase()}.`
            : `📋 Local Field Loan Officer visit requested for ${maskedPhone}. An assigned representative will contact you within 24–48 hours to assist with paperwork.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'account-manager-arun',
      }
      setMessages((prev) => [...prev, confirmationMsg])
      setShowCallbackForm(false)
    } catch {
      toast.error('Failed to dispatch call back. Please try again.')
    } finally {
      setIsRequestingCall(false)
    }
  }

  return (
    <div className='fixed bottom-4 right-4 sm:bottom-6 sm:right-6 pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)] z-40 flex flex-col items-end max-w-[calc(100vw-1.5rem)] pointer-events-none [&>*]:pointer-events-auto'>
      {/* Collapsed FAB by default — only expands to chat when clicked (P0 fix: no auto-popping speech bubble overlapping content) */}
      {!isOpen && (
        <button
          type='button'
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className='group relative flex h-14 w-14 sm:h-[58px] sm:w-[58px] items-center justify-center rounded-full bg-[#e8efe2]/96 border border-[#8fc45a]/50 text-[#121A12] shadow-[0_10px_30px_rgba(18,26,18,0.18),0_0_20px_rgba(143,196,90,0.22)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-[#8fc45a]/80 hover:shadow-[0_0_28px_rgba(143,196,90,0.4)] active:scale-95 cursor-pointer'
          aria-label='Open Mitra AI Financial Guide'
          title='Ask Mitra AI (Vernacular Credit Guide)'
        >
          {/* Ambient Glow Halo */}
          <div className='absolute -inset-1 rounded-full bg-[#8fc45a]/25 opacity-0 group-hover:opacity-100 blur-md transition duration-300 pointer-events-none' />

          {/* ThinkingOrb Canvas Core */}
          <div className='relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center overflow-hidden rounded-full'>
            <ThinkingOrb
              state={isHovered ? 'working' : 'breathing'}
              size={64}
              theme='light'
              speed={isHovered ? 1.25 : 1}
            />
          </div>

          {/* Live status pip */}
          <span className='absolute top-0.5 right-0.5 flex h-3 w-3'>
            <span className='absolute inline-flex h-full w-full rounded-full bg-[#8fc45a] opacity-75 animate-ping' />
            <span className='relative inline-flex h-3 w-3 rounded-full border-2 border-[#121A12] bg-[#8fc45a] shadow-xs' />
          </span>
        </button>
      )}

      {/* Modern AI Chat Window - Recursive Theme Frosted Linen & Forest */}
      {isOpen && (
        <div
          style={{ fontFamily: "'DM Sans', 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'Noto Sans Tamil', system-ui, sans-serif" }}
          className={`relative z-50 flex flex-col rounded-3xl border border-[#8fc45a]/40 bg-[#f4f7f1]/98 shadow-[0_32px_90px_rgba(18,26,18,0.22),0_0_0_1px_rgba(143,196,90,0.2)] text-[#121A12] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'h-[86vh] max-h-[760px] w-[94vw] sm:w-[720px] md:w-[800px]'
              : 'h-[min(580px,84vh)] w-[calc(100vw-1.5rem)] sm:w-[420px]'
          }`}
        >
          {/* Sleek Single-Row Header */}
          <div className='border-b border-[#8fc45a]/25 bg-white/75 px-4 py-3 sm:px-5 backdrop-blur-md flex items-center justify-between shrink-0'>
            {/* Identity & Status */}
            <div className='flex items-center gap-2.5'>
              <div className='relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#8fc45a]/20 border border-[#8fc45a]/35 shadow-2xs overflow-hidden'>
                <ThinkingOrb
                  state={isLoading ? 'searching' : isRequestingCall ? 'connecting' : 'breathing'}
                  size={20}
                  theme='light'
                />
                <span className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-white ${isLoading ? 'bg-emerald-500 animate-pulse' : 'bg-[#8fc45a]'}`} />
              </div>
              <div>
                <div className='flex items-center gap-1.5'>
                  <h3 className='text-[13px] font-bold tracking-tight text-[#121A12] font-sans'>Mitra</h3>
                  <Badge variant='outline' className='text-[9px] px-1.5 py-0 font-mono bg-[#8fc45a]/20 text-[#1b3d1b] border-[#8fc45a]/40 uppercase tracking-wider'>
                    {isLocalModel ? 'Local AI' : 'Edge AI'}
                  </Badge>
                </div>
                <span className='text-[10px] text-[#3d4f3b] font-mono leading-none block'>Vernacular Credit Guide</span>
              </div>
            </div>

            {/* Actions Cluster */}
            <div className='flex items-center gap-1.5'>
              {/* Segmented Language Switcher */}
              <div className='flex items-center rounded-lg border border-[#8fc45a]/30 bg-[#e4ecdc]/80 p-0.5 text-[10px] font-mono'>
                {(
                  [
                    { code: 'en', label: 'EN' },
                    { code: 'hi', label: 'HI' },
                    { code: 'gu', label: 'GU' },
                    { code: 'ta', label: 'TA' },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.code}
                    type='button'
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`rounded px-1.5 py-0.5 transition-all ${
                      selectedLang === lang.code
                        ? 'bg-[#121A12] text-white font-semibold shadow-2xs'
                        : 'text-[#3d4f3b] hover:text-[#121A12]'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Officer Voice Callback Toggle */}
              <button
                type='button'
                onClick={() => setShowCallbackForm(!showCallbackForm)}
                className={`p-1.5 rounded-lg border transition-all ${
                  showCallbackForm
                    ? 'bg-[#121A12] text-white border-[#121A12]'
                    : 'bg-[#8fc45a]/15 text-[#1b3d1b] border-[#8fc45a]/35 hover:bg-[#8fc45a]/25'
                }`}
                title='Request Officer Callback'
              >
                <PhoneCall className='h-3.5 w-3.5' />
              </button>

              {/* Window Size & Close */}
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 rounded-lg text-[#3d4f3b] hover:text-[#121A12] hover:bg-[#8fc45a]/15'
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Contract' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className='h-3.5 w-3.5' /> : <Maximize2 className='h-3.5 w-3.5' />}
              </Button>

              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 rounded-lg text-[#3d4f3b] hover:text-[#121A12] hover:bg-[#8fc45a]/15'
                onClick={() => {
                  window.speechSynthesis?.cancel()
                  setIsOpen(false)
                }}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Slide-Down Callback Request Drawer */}
          {showCallbackForm && (
            <div className='border-b border-[#8fc45a]/30 bg-[#eef4ea]/95 p-3.5 sm:p-4 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-[#121A12] text-white shadow-2xs'>
                    <PhoneCall className='h-3 w-3 text-[#8fc45a]' />
                  </div>
                  <div>
                    <h4 className='text-xs font-semibold text-[#121A12] font-sans'>{t.drawerTitle}</h4>
                    <p className='text-[10px] text-[#3d4f3b] font-mono'>{t.drawerDesc}</p>
                  </div>
                </div>
                <button
                  type='button'
                  onClick={() => setShowCallbackForm(false)}
                  className='text-[#3d4f3b] hover:text-[#121A12] p-1'
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              </div>

              <div className='flex rounded-lg border border-[#8fc45a]/25 bg-[#e4ecdc]/80 p-0.5 gap-1 text-[11px] font-mono'>
                <button
                  type='button'
                  onClick={() => setCallbackType('voice')}
                  className={`flex-1 py-1 px-2 rounded-md transition-all text-center ${
                    callbackType === 'voice'
                      ? 'bg-[#121A12] text-[#f3f8ee] font-semibold shadow-2xs'
                      : 'text-[#3d4f3b] hover:text-[#121A12]'
                  }`}
                >
                  {t.voiceOption}
                </button>
                <button
                  type='button'
                  onClick={() => setCallbackType('officer')}
                  className={`flex-1 py-1 px-2 rounded-md transition-all text-center ${
                    callbackType === 'officer'
                      ? 'bg-[#121A12] text-[#f3f8ee] font-semibold shadow-2xs'
                      : 'text-[#3d4f3b] hover:text-[#121A12]'
                  }`}
                >
                  {t.officerOption}
                </button>
              </div>

              <div className='flex gap-2 pt-0.5'>
                <div className='relative flex-1'>
                  <span className='absolute left-3 top-2 text-xs font-mono text-[#3d4f3b]'>+91</span>
                  <Input
                    type={isPhoneMasked ? 'password' : 'tel'}
                    value={isPhoneMasked ? maskPhoneNumber(callbackPhone).replace('+91 ', '') : callbackPhone}
                    onChange={(e) => {
                      setIsPhoneMasked(false)
                      setCallbackPhone(e.target.value)
                    }}
                    onFocus={() => {
                      if (isPhoneMasked) {
                        setIsPhoneMasked(false)
                      }
                    }}
                    placeholder={t.phonePlaceholder}
                    className='h-8 pl-11 pr-9 text-xs font-mono bg-white/90 border-[#8fc45a]/35 text-[#121A12] placeholder:text-[#6e826b] rounded-lg focus-visible:ring-1 focus-visible:ring-[#8fc45a]'
                  />
                  <button
                    type='button'
                    onClick={() => setIsPhoneMasked(!isPhoneMasked)}
                    className='absolute right-2.5 top-2 text-[#3d4f3b] hover:text-[#121A12] transition-colors'
                  >
                    {isPhoneMasked ? <EyeOff className='h-3 w-3' /> : <Eye className='h-3 w-3' />}
                  </button>
                </div>
                <Button
                  type='button'
                  size='sm'
                  disabled={isRequestingCall}
                  onClick={handleRequestCallback}
                  className='h-8 px-3 text-xs font-mono font-semibold bg-[#121A12] text-[#f3f8ee] hover:bg-[#203020] rounded-lg shrink-0 transition-all active:scale-95 shadow-2xs'
                >
                  {isRequestingCall ? (
                    <ThinkingOrb state='connecting' size={20} theme='light' />
                  ) : (
                    callbackType === 'voice' ? t.callBtn : t.scheduleBtn
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Active Call In-Progress Banner */}
          {callStageMsg && (
            <div className='mx-4 mt-2.5 flex items-center gap-2.5 rounded-xl border border-[#8fc45a]/40 bg-[#121A12] px-3.5 py-2 text-xs font-mono text-[#f3f8ee] shadow-sm animate-pulse'>
              <PhoneCall className='h-3.5 w-3.5 shrink-0 text-[#8fc45a] animate-bounce' />
              <div className='flex-1 truncate'>
                <span className='font-semibold text-[#8fc45a]'>Officer Call Active:</span> {callStageMsg}
              </div>
            </div>
          )}

          {/* Centered Conversation Thread */}
          <div className='flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 font-sans'>
            <div className='max-w-2xl mx-auto w-full space-y-3.5'>
              {/* Clean Starter Suggestion Chips (Visible at Start) */}
              {messages.length <= 1 && (
                <div className='pt-1 pb-2 space-y-2 animate-in fade-in duration-300'>
                  <span className='text-[10px] font-mono text-[#3d4f3b] uppercase tracking-wider block font-semibold'>
                    Quick Questions
                  </span>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5'>
                    {[
                      { label: '🌱 How does Zero-CIBIL scoring work?', query: 'How does AltGrade score people without a traditional CIBIL score?' },
                      { label: '⚡ Can I qualify with UPI history?', query: 'Can I qualify for an AltGrade credit line with my daily UPI inflows?' },
                      { label: '💳 Check loan eligibility criteria', query: 'What documents and alternate data are needed to check loan eligibility?' },
                      { label: '📞 Request an officer phone callback', query: 'How do I speak to an officer regarding a micro-business credit line?' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type='button'
                        onClick={() => {
                          setInputValue(item.query)
                          if (inputRef.current) inputRef.current.focus()
                        }}
                        className='text-left p-2 rounded-xl border border-[#8fc45a]/25 bg-white/80 hover:bg-[#e8efe2] hover:border-[#8fc45a]/60 transition-all text-xs font-sans text-[#121A12] shadow-2xs group flex items-start gap-1.5'
                      >
                        <span className='h-1.5 w-1.5 rounded-full bg-[#8fc45a] mt-1 shrink-0 group-hover:scale-125 transition-transform' />
                        <span className='font-medium text-[#121A12] leading-snug'>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#8fc45a]/20 border border-[#8fc45a]/35 text-[#121A12] mt-1 shadow-2xs overflow-hidden'>
                      <ThinkingOrb state='shaping' size={20} theme='light' />
                    </div>
                  )}

                  <div className={`space-y-1 ${msg.role === 'user' ? 'max-w-[80%]' : 'max-w-[88%] sm:max-w-[82%]'}`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed transition-all ${
                        msg.role === 'user'
                          ? 'bg-[#121A12] text-[#f4f8f0] font-medium rounded-tr-xs shadow-xs'
                          : 'bg-white/95 border border-[#8fc45a]/20 text-[#121A12] rounded-tl-xs shadow-[0_2px_8px_rgba(18,26,18,0.03)] backdrop-blur-sm'
                      }`}
                    >
                      <p className='whitespace-pre-wrap'>{msg.content}</p>

                      {/* Interactive On-Call Banking Callout Card */}
                      {(msg.id === 'welcome' ||
                        msg.id.startsWith('lang-switch-') ||
                        msg.content.toLowerCase().includes('on-call banking') ||
                        msg.content.toLowerCase().includes('call back') ||
                        msg.content.includes('કૉલ બૅક') ||
                        msg.content.includes('કૉલ બેક') ||
                        msg.content.includes('બેંકિંગ સેવા') ||
                        msg.content.includes('કૉલબેક') ||
                        msg.content.includes('कॉल बैक') ||
                        msg.content.includes('கால் பேக்')) && (
                        <div className='mt-2.5 pt-2.5 border-t border-[#8fc45a]/20'>
                          <div className='rounded-xl border border-[#8fc45a]/30 bg-[#e8efe2]/70 p-2.5 transition-all hover:border-[#8fc45a]/50'>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                              <div className='space-y-0.5'>
                                <div className='flex items-center gap-1.5 text-xs font-semibold text-[#121A12]'>
                                  <PhoneCall className='h-3 w-3 text-[#2b4b21]' />
                                  <span>{t.cardTitle}</span>
                                </div>
                                <p className='text-[10.5px] text-[#3d4f3b] font-mono leading-relaxed'>
                                  {t.cardDesc}
                                </p>
                              </div>
                              <button
                                type='button'
                                onClick={() => setShowCallbackForm(true)}
                                className='shrink-0 rounded-lg bg-[#121A12] px-2.5 py-1 text-[10.5px] font-mono font-semibold text-[#f3f8ee] hover:bg-[#203020] transition-all active:scale-95 shadow-2xs flex items-center gap-1'
                              >
                                <PhoneCall className='h-2.5 w-2.5 text-[#8fc45a]' />
                                <span>{t.cardBtn}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions Footer */}
                    <div
                      className={`flex items-center gap-2 text-[9.5px] font-mono text-[#5a6e56] px-1 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-between'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {msg.role === 'assistant' && (
                        <div className='flex items-center gap-2'>
                          {msg.modelUsed && (
                            <span className='text-[9px] text-[#5a6e56]/80 font-mono hidden xs:inline'>
                              {msg.modelUsed === 'local-model' ? 'Ollama' : msg.modelUsed}
                            </span>
                          )}
                          <button
                            type='button'
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className='flex items-center gap-1 rounded px-1 py-0.5 text-[#3d4f3b] hover:text-[#121A12] hover:bg-[#8fc45a]/15 transition-colors'
                            title='Listen'
                          >
                            {speakingId === msg.id ? (
                              <>
                                <VolumeX className='h-2.5 w-2.5 text-[#121A12] animate-pulse' />
                                <span className='text-[#121A12]'>{t.stopBtn}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className='h-2.5 w-2.5' />
                                <span>{t.listenBtn}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#121A12] text-white font-semibold mt-1 shadow-2xs'>
                      <User className='h-3 w-3' />
                    </div>
                  )}
                </div>
              ))}

              {/* Clean Single Thinking Orb Indicator */}
              {isLoading && (
                <div className='flex items-center gap-2.5 pl-1 py-2 animate-in fade-in duration-300'>
                  <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/95 border border-[#8fc45a]/35 shadow-2xs overflow-hidden'>
                    <ThinkingOrb state='searching' size={20} theme='light' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-mono text-xs text-[#121A12] font-semibold'>{t.thinking}</span>
                    <span className='text-[10px] font-mono text-[#3d4f3b]'>
                      Evaluating AltGrade alternate credit signals…
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Clean Unified Composer Bar */}
          <div className='border-t border-[#8fc45a]/25 bg-white/70 px-4 py-2.5 sm:px-5 backdrop-blur-md shrink-0'>
            <div className='max-w-2xl mx-auto w-full'>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className='relative flex items-center rounded-2xl border border-[#8fc45a]/35 bg-white/95 transition-all focus-within:border-[#8fc45a] focus-within:ring-2 focus-within:ring-[#8fc45a]/25 shadow-2xs px-3 py-1'
              >
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className='h-9 text-xs sm:text-[13px] bg-transparent border-0 text-[#121A12] placeholder:text-[#6e826b] focus-visible:ring-0 focus-visible:outline-none shadow-none py-1'
                  disabled={isLoading}
                />
                <Button
                  type='submit'
                  size='icon'
                  className='h-7 w-7 shrink-0 rounded-xl bg-[#121A12] text-white hover:bg-[#203020] disabled:opacity-35 transition-all active:scale-95 shadow-2xs overflow-hidden'
                  disabled={!inputValue.trim() || isLoading}
                >
                  {isLoading ? (
                    <ThinkingOrb state='working' size={20} theme='light' />
                  ) : (
                    <Send className='h-3 w-3' />
                  )}
                </Button>
              </form>

              <p className='mt-1.5 text-center text-[9.5px] font-mono text-[#5a6e56] tracking-wide'>
                AltGrade DPDP Compliant · Zero Bureau Footprint
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

