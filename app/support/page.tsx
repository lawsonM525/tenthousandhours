"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Mail, MessageSquare, Bug, Send, CheckCircle } from "lucide-react"

export default function SupportPage() {
  const [formType, setFormType] = useState<"feedback" | "bug">("feedback")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Create mailto link with form data
    const mailtoSubject = encodeURIComponent(`[${formType === "bug" ? "Bug Report" : "Feedback"}] ${subject}`)
    const mailtoBody = encodeURIComponent(`From: ${email}\n\nType: ${formType === "bug" ? "Bug Report" : "Feedback"}\n\n${message}`)
    
    window.location.href = `mailto:michelle@michellelawson.me?subject=${mailtoSubject}&body=${mailtoBody}`
    
    // Show success state
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
    }, 500)
  }

  const resetForm = () => {
    setEmail("")
    setSubject("")
    setMessage("")
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="inline-block bg-mango-orange px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-4">
            <span className="font-bold text-xs uppercase text-white">Get Help</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-mango-dark mb-2">Support</h1>
          <p className="text-slate-500 font-bold">We&apos;re here to help you on your journey to 10,000 hours</p>
        </div>

        {/* Contact Email */}
        <div className="distressed-card p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-mango-red border-2 border-mango-dark flex items-center justify-center">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg uppercase text-mango-dark">Email Support</h2>
              <a 
                href="mailto:michelle@michellelawson.me" 
                className="text-mango-red font-bold hover:underline"
              >
                michelle@michellelawson.me
              </a>
            </div>
          </div>
        </div>

        {/* Feature Requests Link */}
        <div className="distressed-card p-6 mb-8">
          <a 
            href="https://lwsnlabs.featurebase.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-mango-yellow border-2 border-mango-dark flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-mango-dark" />
            </div>
            <div className="flex-1">
              <h2 className="font-black text-lg uppercase text-mango-dark group-hover:text-mango-red transition-colors">
                Feature Requests & Roadmap
              </h2>
              <p className="text-slate-500 font-bold text-sm">Vote on features and see what&apos;s coming next</p>
            </div>
          </a>
        </div>

        {/* Feedback / Bug Report Form */}
        <div className="distressed-card p-6">
          <h2 className="font-black text-xl uppercase text-mango-dark mb-6">Send Us a Message</h2>
          
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-mango-green border-2 border-mango-dark flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-black text-xl uppercase text-mango-dark mb-2">Message Sent!</h3>
              <p className="text-slate-500 mb-6">Your email client should have opened. If not, email us directly at michelle@michellelawson.me</p>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-mango-dark text-white font-bold uppercase border-2 border-mango-dark shadow-[4px_4px_0px_#FFB31A] hover:shadow-[6px_6px_0px_#FFB31A] hover:-translate-y-1 transition-all"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Type Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormType("feedback")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-bold uppercase text-sm border-2 border-mango-dark transition-all ${
                    formType === "feedback"
                      ? "bg-mango-orange text-white shadow-[3px_3px_0px_#1a1a1a]"
                      : "bg-white text-mango-dark hover:bg-mango-yellow/20"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setFormType("bug")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-bold uppercase text-sm border-2 border-mango-dark transition-all ${
                    formType === "bug"
                      ? "bg-mango-red text-white shadow-[3px_3px_0px_#1a1a1a]"
                      : "bg-white text-mango-dark hover:bg-mango-yellow/20"
                  }`}
                >
                  <Bug className="w-4 h-4" />
                  Bug Report
                </button>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-xs uppercase text-mango-dark mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-mango-dark font-bold text-mango-dark placeholder:text-slate-400 focus:outline-none focus:shadow-[3px_3px_0px_#FFB31A]"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block font-bold text-xs uppercase text-mango-dark mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={formType === "bug" ? "Brief description of the bug" : "What's on your mind?"}
                  className="w-full px-4 py-3 border-2 border-mango-dark font-bold text-mango-dark placeholder:text-slate-400 focus:outline-none focus:shadow-[3px_3px_0px_#FFB31A]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-bold text-xs uppercase text-mango-dark mb-2">
                  {formType === "bug" ? "Steps to Reproduce / Details" : "Message"}
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder={
                    formType === "bug"
                      ? "1. What were you trying to do?\n2. What happened instead?\n3. Any error messages?"
                      : "Share your thoughts, ideas, or suggestions..."
                  }
                  className="w-full px-4 py-3 border-2 border-mango-dark font-bold text-mango-dark placeholder:text-slate-400 focus:outline-none focus:shadow-[3px_3px_0px_#FFB31A] resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-mango-dark text-white font-black uppercase text-lg border-2 border-mango-dark shadow-[4px_4px_0px_#FFB31A] hover:shadow-[6px_6px_0px_#FFB31A] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Opening Email..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 pt-8 border-t-2 border-mango-dark/20">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 font-bold text-mango-dark hover:text-mango-red transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
