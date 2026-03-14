'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ContactForm({ cmsSendButton }: { cmsSendButton?: string | null }) {
  const t = useTranslations()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim(),
    }

    if (!data.name || !data.email || !data.message) {
      setStatus('error')
      setErrorMsg(t('contactForm.errorRequired'))
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Request failed')
      }

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMsg(t('contactForm.errorGeneric'))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 flex-1 flex flex-col"
      aria-label={t('contactSection.formHeading')}
    >
      <div>
        <label
          htmlFor="name"
          className="block font-clash font-medium text-[13px] leading-[20px] text-[#302e2f] mb-2"
        >
          {t('contactSection.nameLabel')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={t('contactSection.namePlaceholder')}
          className="w-full bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] px-5 py-3 h-[52px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash text-sm focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block font-clash font-medium text-[13px] leading-[20px] text-[#302e2f] mb-2"
        >
          {t('contactSection.phoneLabel')}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder={t('contactSection.phonePlaceholder')}
          className="w-full bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] px-5 py-3 h-[52px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash text-sm focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block font-clash font-medium text-[13px] leading-[20px] text-[#302e2f] mb-2"
        >
          {t('contactSection.emailLabel')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t('contactSection.emailPlaceholder')}
          className="w-full bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] px-5 py-3 h-[52px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash text-sm focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block font-clash font-medium text-[13px] leading-[20px] text-[#302e2f] mb-2"
        >
          {t('contactSection.messageLabel')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder={t('contactSection.messagePlaceholder')}
          className="w-full bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] px-5 py-3 h-[140px] sm:h-[178px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash text-sm focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition resize-none"
        />
      </div>

      {status === 'success' && (
        <p className="font-clash text-sm text-green-600 font-medium">
          {t('contactForm.success')}
        </p>
      )}
      {status === 'error' && errorMsg && (
        <p className="font-clash text-sm text-red-600 font-medium">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[16px] sm:text-[20px] uppercase rounded-[10px] px-8 py-4 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        <Send className="size-5" />
        {status === 'sending' ? t('contactForm.sending') : t('contactSection.sendMessage')}
      </button>
    </form>
  )
}
