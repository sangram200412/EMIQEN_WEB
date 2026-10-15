import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  Building2,
  User,
  CheckCircle2,
  Sparkles,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: 'Enterprise SLM Deployment',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      inquiryType: 'Enterprise SLM Deployment',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-transparent dark:bg-[#080B10] transition-colors duration-300">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#48E5F5]/4 dark:bg-[#48E5F5]/4 light:bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-[#9A83FF]/4 dark:bg-[#9A83FF]/4 light:bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0D1420] border border-slate-300 dark:border-white/10 text-xs font-mono text-[#0284C7] dark:text-[#48E5F5]">
            <Building2 className="w-3.5 h-3.5" />
            <span>ENTERPRISE & DEVELOPER INQUIRIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-[#F4F7FB]">
            Contact the <span className="text-[#0284C7] dark:text-[#48E5F5]">EMIQEN Team</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-[#A4ADBB] leading-relaxed max-w-2xl mx-auto">
            Ready to integrate domain-specific small language models, explore local edge deployments, or request custom voice pipeline training? Connect with our AI product architects.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Form on Left, Enterprise Channels on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 text-left relative overflow-hidden shadow-xl dark:shadow-2xl">
            
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-5"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                      Message Received
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-[#A4ADBB] max-w-md mx-auto">
                      Thank you, <strong className="text-[#0284C7] dark:text-[#48E5F5]">{formData.name}</strong>. Our AI engineering team has logged your inquiry for <span className="font-mono text-xs">{formData.inquiryType}</span> and will respond to <span className="font-mono text-xs">{formData.email}</span> within 24 hours.
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-mono text-slate-800 dark:text-[#F4F7FB] border border-slate-300 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-[11px] font-mono text-slate-700 dark:text-[#A4ADBB] uppercase tracking-wider block mb-1.5 font-medium">
                        Your Full Name *
                      </label>
                      <div className="relative flex items-center">
                        <User className="w-4 h-4 text-slate-400 dark:text-[#A4ADBB] absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Dr. Emily Chen"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A4ADBB]/40 focus:outline-none focus:border-[#0284C7] dark:focus:border-[#48E5F5] shadow-xs transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="text-[11px] font-mono text-slate-700 dark:text-[#A4ADBB] uppercase tracking-wider block mb-1.5 font-medium">
                        Work Email Address *
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-[#A4ADBB] absolute left-3.5 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="emily@organization.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A4ADBB]/40 focus:outline-none focus:border-[#0284C7] dark:focus:border-[#48E5F5] shadow-xs transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Organization / Company */}
                    <div>
                      <label className="text-[11px] font-mono text-slate-700 dark:text-[#A4ADBB] uppercase tracking-wider block mb-1.5 font-medium">
                        Organization / Company
                      </label>
                      <div className="relative flex items-center">
                        <Building2 className="w-4 h-4 text-slate-400 dark:text-[#A4ADBB] absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="AI Labs / Enterprise Corp"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A4ADBB]/40 focus:outline-none focus:border-[#0284C7] dark:focus:border-[#48E5F5] shadow-xs transition-colors"
                        />
                      </div>
                    </div>

                    {/* Inquiry Category */}
                    <div>
                      <label className="text-[11px] font-mono text-slate-700 dark:text-[#A4ADBB] uppercase tracking-wider block mb-1.5 font-medium">
                        Inquiry Category
                      </label>
                      <div className="relative flex items-center">
                        <select
                          value={formData.inquiryType}
                          onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-[#F4F7FB] focus:outline-none focus:border-[#0284C7] dark:focus:border-[#48E5F5] shadow-xs transition-colors cursor-pointer"
                        >
                          <option value="Enterprise SLM Deployment" className="bg-white dark:bg-[#080B10] text-slate-900 dark:text-[#F4F7FB]">Enterprise SLM Deployment</option>
                          <option value="Edge Embedded Hardware Tuning" className="bg-white dark:bg-[#080B10] text-slate-900 dark:text-[#F4F7FB]">Edge Embedded Hardware Tuning</option>
                          <option value="Indian English & Hinglish Model" className="bg-white dark:bg-[#080B10] text-slate-900 dark:text-[#F4F7FB]">Indian English & Hinglish Model</option>
                          <option value="API Access & Benchmark Evaluation" className="bg-white dark:bg-[#080B10] text-slate-900 dark:text-[#F4F7FB]">API Access & Benchmark Evaluation</option>
                          <option value="Research & Academic Collaboration" className="bg-white dark:bg-[#080B10] text-slate-900 dark:text-[#F4F7FB]">Research & Academic Collaboration</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Project Requirements / Message */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-700 dark:text-[#A4ADBB] uppercase tracking-wider block mb-1.5 font-medium">
                      Project Scope & Message
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your use case, expected conversational concurrency, latency requirements, or model deployment environment..."
                      className="w-full p-4 rounded-xl bg-white dark:bg-[#080B10] border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A4ADBB]/40 focus:outline-none focus:border-[#0284C7] dark:focus:border-[#48E5F5] shadow-xs transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#38C6D5] text-[#080B10] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(72,229,245,0.3)] hover:shadow-[0_0_30px_rgba(72,229,245,0.5)] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#080B10] border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 fill-current" />
                        <span>Submit Enterprise Inquiry</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column: Direct Channels & Operational Commitments */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 text-left">
            
            {/* Direct Email Channels Card */}
            <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 space-y-4 shadow-lg dark:shadow-xl">
              <span className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#48E5F5] uppercase tracking-wider block">
                Direct Engineering Channels
              </span>

              <div className="space-y-3.5">
                <a
                  href="mailto:enterprise@emiqen.com"
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-white/[0.03] dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-[#0284C7] dark:text-[#48E5F5] mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-slate-900 dark:text-[#F4F7FB] font-semibold block group-hover:text-[#0284C7] dark:group-hover:text-[#48E5F5] transition-colors">
                      enterprise@emiqen.com
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#A4ADBB]">
                      Commercial licensing, custom SLM fine-tuning & SLAs
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:research@emiqen.com"
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-white/[0.03] dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 transition-colors group"
                >
                  <Sparkles className="w-4 h-4 text-[#7C3AED] dark:text-[#9A83FF] mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-slate-900 dark:text-[#F4F7FB] font-semibold block group-hover:text-[#7C3AED] dark:group-hover:text-[#9A83FF] transition-colors">
                      research@emiqen.com
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#A4ADBB]">
                      Academic evaluations, prosody dataset inquiries
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* SLA & Privacy Notes */}
            <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 space-y-4 shadow-lg dark:shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-[#A4ADBB]">
                <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Response SLA: Technical review within 24 hours</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-start gap-2.5 text-xs text-slate-500 dark:text-[#A4ADBB] leading-relaxed font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  All architectural inquiries are held strictly confidential under enterprise privacy standards.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
