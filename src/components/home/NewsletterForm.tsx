'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function NewsletterForm({ cmsSubscribeButton }: { cmsSubscribeButton?: string | null }) {
  const t = useTranslations()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('newsletter-email') as HTMLInputElement).value.trim()

    if (!email) {
      setStatus('error')
      setErrorMsg(t('newsletterForm.errorInvalid'))
      return
    }

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(body.error || 'Request failed')
      }

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMsg(t('newsletterForm.errorGeneric'))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3"
      aria-label={t('newsletter.formLabel')}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        {t('newsletter.emailLabel')}
      </label>
      <div className="flex-1 flex flex-col gap-1">
        <input
          id="newsletter-email"
          type="email"
          name="newsletter-email"
          required
          placeholder={t('newsletter.emailPlaceholder')}
          className="w-full bg-[#f0eff0] border-none rounded-[10px] px-5 py-[15px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash font-normal text-[15.9px] focus:outline-none focus:ring-2 focus:ring-white transition"
        />
        {status === 'success' && (
          <p className="font-clash text-xs text-green-200 font-medium">
            {t('newsletterForm.success')}
          </p>
        )}
        {status === 'error' && errorMsg && (
          <p className="font-clash text-xs text-red-200 font-medium">{errorMsg}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center justify-center bg-[#302e2f] text-[#f0eff0] font-clash font-medium text-[15px] leading-[24px] rounded-[10px] py-3 px-7 hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60"
      >
        <Send className="size-[18px] mr-3" />
        {status === 'sending' ? t('newsletterForm.subscribing') : t('newsletter.subscribe')}
      </button>
    </form>
  )
}
