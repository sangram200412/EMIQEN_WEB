import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  Building2,
  User,
  CheckCircle2,
  Sparkles,
  MapPin,
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
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#080B10] dark:bg-[#080B10] light:bg-[#F8FAFC] transition-colors duration-300">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#48E5F5]/4 dark:bg-[#48E5F5]/4 light:bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-[#9A83FF]/4 dark:bg-[#9A83FF]/4 light:bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1420] dark:bg-[#0D1420] light:bg-slate-100 border border-white/10 light:border-slate-300 text-xs font-mono text-[#48E5F5] light:text-[#0284C7]">
            <Building2 className="w-3.5 h-3.5" />
            <span>ENTERPRISE & DEVELOPER INQUIRIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F7FB] dark:text-[#F4F7FB] light:text-[#0F172A]">
            Contact the <span className="text-[#48E5F5] light:text-[#0284C7]">EMIQEN Team</span>
          </h2>

          <p className="text-sm sm:text-base text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Ready to integrate domain-specific small language models, explore local edge deployments, or request custom voice pipeline training? Connect with our AI product architects.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Form on Left, Enterprise Channels on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 light:border-slate-300 text-left relative overflow-hidden">
            
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
                    <h3 className="text-2xl font-bold text-[#F4F7FB] dark:text-[#F4F7FB] light:text-[#0F172A]">
                      Message Received
                    </h3>
                    <p className="text-sm text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 max-w-md mx-auto">
                      Thank you, <strong className="text-[#48E5F5] light:text-[#0284C7]">{formData.name}</strong>. Our AI engineering team has logged your inquiry for <span className="font-mono text-xs">{formData.inquiryType}</span> and will respond to <span className="font-mono text-xs">{formData.email}</span> within 24 hours.
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-white/5 light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 text-xs font-mono text-[#F4F7FB] light:text-slate-800 border border-white/10 light:border-slate-300 transition-colors cursor-pointer"
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
                      <label className="text-[11px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 uppercase tracking-wider block mb-1.5">
                        Your Full Name *
                      </label>
                      <div className="relative flex items-center">
                        <User className="w-4 h-4 text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Dr. Emily Chen"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080B10] dark:bg-[#080B10] light:bg-white border border-white/10 light:border-slate-300 text-xs sm:text-sm text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-900 placeholder:text-[#A4ADBB]/40 light:placeholder:text-slate-400 focus:outline-none focus:border-[#48E5F5] light:focus:border-[#0284C7] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="text-[11px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 uppercase tracking-wider block mb-1.5">
                        Work Email Address *
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="w-4 h-4 text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="emily@organization.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080B10] dark:bg-[#080B10] light:bg-white border border-white/10 light:border-slate-300 text-xs sm:text-sm text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-900 placeholder:text-[#A4ADBB]/40 light:placeholder:text-slate-400 focus:outline-none focus:border-[#48E5F5] light:focus:border-[#0284C7] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Organization / Company */}
                    <div>
                      <label className="text-[11px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 uppercase tracking-wider block mb-1.5">
                        Organization / Company
                      </label>
                      <div className="relative flex items-center">
                        <Building2 className="w-4 h-4 text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="AI Labs / Enterprise Corp"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080B10] dark:bg-[#080B10] light:bg-white border border-white/10 light:border-slate-300 text-xs sm:text-sm text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-900 placeholder:text-[#A4ADBB]/40 light:placeholder:text-slate-400 focus:outline-none focus:border-[#48E5F5] light:focus:border-[#0284C7] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Inquiry Category */}
                    <div>
                      <label className="text-[11px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 uppercase tracking-wider block mb-1.5">
                        Inquiry Category
                      </label>
                      <div className="relative flex items-center">
                        <select
                          value={formData.inquiryType}
                          onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#080B10] dark:bg-[#080B10] light:bg-white border border-white/10 light:border-slate-300 text-xs font-mono text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-900 focus:outline-none focus:border-[#48E5F5] light:focus:border-[#0284C7] transition-colors cursor-pointer"
                        >
                          <option value="Enterprise SLM Deployment">Enterprise SLM Deployment</option>
                          <option value="Edge Embedded Hardware Tuning">Edge Embedded Hardware Tuning</option>
                          <option value="Indian English & Hinglish Model">Indian English & Hinglish Model</option>
                          <option value="API Access & Benchmark Evaluation">API Access & Benchmark Evaluation</option>
                          <option value="Research & Academic Collaboration">Research & Academic Collaboration</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Project Requirements / Message */}
                  <div>
                    <label className="text-[11px] font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600 uppercase tracking-wider block mb-1.5">
                      Project Scope & Message
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your use case, expected conversational concurrency, latency requirements, or model deployment environment..."
                      className="w-full p-4 rounded-xl bg-[#080B10] dark:bg-[#080B10] light:bg-white border border-white/10 light:border-slate-300 text-xs sm:text-sm text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-900 placeholder:text-[#A4ADBB]/40 light:placeholder:text-slate-400 focus:outline-none focus:border-[#48E5F5] light:focus:border-[#0284C7] transition-colors resize-none"
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
            <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 light:border-slate-300 space-y-4">
              <span className="text-xs font-mono font-semibold text-[#48E5F5] light:text-[#0284C7] uppercase tracking-wider block">
                Direct Engineering Channels
              </span>

              <div className="space-y-3.5">
                <a
                  href="mailto:enterprise@emiqen.com"
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] light:bg-slate-100 hover:bg-white/5 light:hover:bg-slate-200 border border-white/5 light:border-slate-200 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-[#48E5F5] light:text-[#0284C7] mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-900 font-semibold block group-hover:text-[#48E5F5] light:group-hover:text-[#0284C7] transition-colors">
                      enterprise@emiqen.com
                    </span>
                    <span className="text-[11px] text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500">
                      Commercial licensing, custom SLM fine-tuning & SLAs
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:research@emiqen.com"
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] light:bg-slate-100 hover:bg-white/5 light:hover:bg-slate-200 border border-white/5 light:border-slate-200 transition-colors group"
                >
                  <Sparkles className="w-4 h-4 text-[#9A83FF] mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-[#F4F7FB] dark:text-[#F4F7FB] light:text-slate-900 font-semibold block group-hover:text-[#9A83FF] transition-colors">
                      research@emiqen.com
                    </span>
                    <span className="text-[11px] text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500">
                      Academic evaluations, prosody dataset inquiries
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* SLA, Location & Privacy Notes */}
            <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 light:border-slate-300 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Response SLA: Technical review within 24 hours</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-600">
                <MapPin className="w-4 h-4 text-[#48E5F5] light:text-[#0284C7]" />
                <span>Innovation Labs: Bengaluru, Karnataka, India</span>
              </div>

              <div className="pt-2 border-t border-white/5 light:border-slate-200 flex items-start gap-2.5 text-xs text-[#A4ADBB] dark:text-[#A4ADBB] light:text-slate-500 leading-relaxed font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
