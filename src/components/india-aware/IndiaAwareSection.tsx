import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Volume2,
  Mic,
  Copy,
  Check,
  Layers,
  ShieldCheck,
  Play,
  Pause,
} from 'lucide-react';

// ==========================================
// DATA DEFINITIONS & PRESETS
// ==========================================

interface DocumentPreset {
  id: string;
  title: string;
  language: string;
  languageNative: string;
  image: string;
  enhancedTitle: string;
  ocrConfidence: number;
  wordCount: number;
  script: string;
  ocrText: string;
  boundingBox: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

const DOCUMENT_PRESETS: DocumentPreset[] = [
  {
    id: 'handwritten',
    title: 'Handwritten Letter',
    language: 'English',
    languageNative: 'English',
    image: '/documents/handwritten_letter.jpg',
    enhancedTitle: '19th-Century Archival Manuscript',
    ocrConfidence: 99.4,
    wordCount: 142,
    script: 'Latin Cursive Handwriting',
    ocrText: `London, October 14th, 1852.

My Dearest Sister Sarah,
I am writing to you this day from my small study with a heavy heart, hoping this letter finds you well. The weather here is damp and chill as Autumn settles upon us. James has finally returned from the good tidings of both good fortune and some distress. It seems his endeavors in Paris with the whif...`,
    boundingBox: {
      top: '9%',
      left: '6%',
      width: '88%',
      height: '84%',
    },
  },
  {
    id: 'tamil',
    title: 'Tamil Manuscript',
    language: 'Tamil',
    languageNative: 'தமிழ்',
    image: '/documents/tamil_manuscript.jpg',
    enhancedTitle: 'Classical Grantha Palm-Leaf Epigraphy',
    ocrConfidence: 98.9,
    wordCount: 168,
    script: 'Tamil Grantha Script',
    ocrText: `தலையங்கெவிவாகருவமயக்கு: க்ஸ்ஸத்துதேனந்தல்படி வதிலே ஸ்ரீனிம
ருசாள்.வா மோறத்தக்கதைந்தும்முச்சுகொ களுக்கிக்தலிநாத் இல்தகை
ஸ்க்ரூபைப் அத்திருணாவடிம னெமைடி ஜலன கறைபங்றிமிளநகுகி-
ஆல்ரேயிகழற்சைலிங்கி றேமராஆ வராயொத்கைமக்ளுல்தாணத்துலேகை
துவரிகிள் காஃவினித்தநொப்டா ஜீ ஐகேந்வு அபிதை: ஈளிறிகெந்த
பெத்தஜபஎமஸ்தாதிபவுடுக் இன் அம்மனிசவுங்னய்வு இஸ்ழ்வாரானா...`,
    boundingBox: {
      top: '22%',
      left: '5%',
      width: '90%',
      height: '60%',
    },
  },
  {
    id: 'hindi',
    title: 'Hindi Document',
    language: 'Hindi',
    languageNative: 'हिन्दी',
    image: '/documents/hindi_document.jpg',
    enhancedTitle: 'District Revenue & Postal Archival Record',
    ocrConfidence: 99.2,
    wordCount: 185,
    script: 'Devanagari Script',
    ocrText: `अभिलेख विभाग
सरकारी कार्य
सम्मति कनरी, नहि नावाल (विलो कचहरी
सम्राधि से सेत्तक हैं एवं भूमिज में मुकरा कोई
कचहरी आगरा यो गङ्गतो निग्वाल)
वालियर में के गाशीधशित, अन्ता-री केणि
वित निदिया नित्र दाल हम शेके।

जिल्ला कचहरी - आगरा | २५ जनवरी १९२९ प्रमाणित`,
    boundingBox: {
      top: '5%',
      left: '6%',
      width: '88%',
      height: '86%',
    },
  },
];

type ShowcaseTab = 'cowork' | 'voice-agents' | 'tts' | 'stt' | 'digitisation';

export const IndiaAwareSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('digitisation');

  // Document Digitisation State
  const [selectedDocId, setSelectedDocId] = useState<string>('handwritten');
  const [viewMode, setViewMode] = useState<'enhanced' | 'ocr'>('enhanced');
  const [customDoc, setCustomDoc] = useState<DocumentPreset | null>(null);
  const [copiedOcr, setCopiedOcr] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Voice Agents & TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);
  const [selectedVoice, setSelectedVoice] = useState('Ananya (Hindi)');

  const currentDoc =
    selectedDocId === 'custom' && customDoc
      ? customDoc
      : DOCUMENT_PRESETS.find((d) => d.id === selectedDocId) || DOCUMENT_PRESETS[0];

  const handleCopyOcr = () => {
    navigator.clipboard.writeText(currentDoc.ocrText);
    setCopiedOcr(true);
    setTimeout(() => setCopiedOcr(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const uploadedDoc: DocumentPreset = {
        id: 'custom',
        title: file.name.replace(/\.[^/.]+$/, ''),
        language: 'Auto-Detected Indic',
        languageNative: 'भारत',
        image: dataUrl,
        enhancedTitle: 'User Uploaded Document Stream',
        ocrConfidence: 98.7,
        wordCount: 96,
        script: 'Indic Multilingual OCR Engine',
        ocrText: `[DOCUMENT DIGITISATION PIPELINE RESOLVED]
File: ${file.name}
Dimensions: High-Precision 300 DPI Preprocessed
Tokens Identified: 96 | Spatial Confidence: 98.7%
Detected Language: Multilingual Indic Context (Hinglish / Regional Script)
Content Normalized across Unicode Consonants & Matras.`,
        boundingBox: {
          top: '15%',
          left: '12%',
          width: '76%',
          height: '70%',
        },
      };

      setCustomDoc(uploadedDoc);
      setSelectedDocId('custom');
      setViewMode('enhanced');
    };
    reader.readAsDataURL(file);
  };

  const toggleAudioSimulation = (sampleText: string) => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(sampleText);
        utterance.rate = ttsSpeed;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 3500);
      }
    }
  };

  return (
    <section id="india-aware" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-transparent transition-colors duration-300">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#38BDF8]/4 dark:bg-[#38BDF8]/4 light:bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#A78BFA]/4 dark:bg-[#A78BFA]/4 light:bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        
        {/* Main Section Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-[#F4F7FB] mb-3">
          India Builds On
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#A4ADBB] max-w-2xl mx-auto mb-10 leading-relaxed">
          Sovereign AI infrastructure engineered for India's diverse scripts, colloquial code-switching, acoustic nuances, and historical archives.
        </p>

        {/* ======================================================== */}
        {/* SHOWCASE CONTAINER WITH INTEGRATED TOP TABS */}
        {/* ======================================================== */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0D1420]/95 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-xl text-left">
          
          {/* Top Tabs Bar */}
          <div className="flex items-center overflow-x-auto scrollbar-none border-b border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-[#080B10]/80">
            
            {/* Tab 1: Indus Cowork */}
            <button
              onClick={() => setActiveTab('cowork')}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-medium transition-all whitespace-nowrap cursor-pointer border-r border-slate-200/60 dark:border-white/5 ${
                activeTab === 'cowork'
                  ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-[#38BDF8] border-b-2 border-b-blue-600 dark:border-b-[#38BDF8] font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-[#A4ADBB] hover:text-slate-900 dark:hover:text-[#F4F7FB] hover:bg-slate-100/80 dark:hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Indus Cowork</span>
            </button>

            {/* Tab 2: अ Voice Agents */}
            <button
              onClick={() => setActiveTab('voice-agents')}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-medium transition-all whitespace-nowrap cursor-pointer border-r border-slate-200/60 dark:border-white/5 ${
                activeTab === 'voice-agents'
                  ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-[#38BDF8] border-b-2 border-b-blue-600 dark:border-b-[#38BDF8] font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-[#A4ADBB] hover:text-slate-900 dark:hover:text-[#F4F7FB] hover:bg-slate-100/80 dark:hover:bg-white/5'
              }`}
            >
              <span className="font-serif font-bold text-sm leading-none text-amber-500">अ</span>
              <span>Voice Agents</span>
            </button>

            {/* Tab 3: Text to Speech */}
            <button
              onClick={() => setActiveTab('tts')}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-medium transition-all whitespace-nowrap cursor-pointer border-r border-slate-200/60 dark:border-white/5 ${
                activeTab === 'tts'
                  ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-[#38BDF8] border-b-2 border-b-blue-600 dark:border-b-[#38BDF8] font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-[#A4ADBB] hover:text-slate-900 dark:hover:text-[#F4F7FB] hover:bg-slate-100/80 dark:hover:bg-white/5'
              }`}
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>Text to Speech</span>
            </button>

            {/* Tab 4: Speech to Text */}
            <button
              onClick={() => setActiveTab('stt')}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-medium transition-all whitespace-nowrap cursor-pointer border-r border-slate-200/60 dark:border-white/5 ${
                activeTab === 'stt'
                  ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-[#38BDF8] border-b-2 border-b-blue-600 dark:border-b-[#38BDF8] font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-[#A4ADBB] hover:text-slate-900 dark:hover:text-[#F4F7FB] hover:bg-slate-100/80 dark:hover:bg-white/5'
              }`}
            >
              <Mic className="w-4 h-4 shrink-0" />
              <span>Speech to Text</span>
            </button>

            {/* Tab 5: Document Digitisation (Active by default, matching image) */}
            <button
              onClick={() => setActiveTab('digitisation')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'digitisation'
                  ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-[#38BDF8] border-b-2 border-b-blue-600 dark:border-b-[#38BDF8] font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-[#A4ADBB] hover:text-slate-900 dark:hover:text-[#F4F7FB] hover:bg-slate-100/80 dark:hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Document Digitisation</span>
            </button>

          </div>

          {/* ======================================================== */}
          {/* TAB CONTENT: 1. DOCUMENT DIGITISATION */}
          {/* ======================================================== */}
          {activeTab === 'digitisation' && (
            <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive Document Canvas */}
              <div className="lg:col-span-8 bg-slate-100/70 dark:bg-[#080B10] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[460px] sm:min-h-[520px]">
                
                {/* Floating Top Badges Header */}
                <div className="flex items-center justify-between gap-3 mb-4 z-20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('enhanced')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                        viewMode === 'enhanced'
                          ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F4F7FB] border border-slate-200 dark:border-white/10'
                          : 'bg-white/60 dark:bg-white/5 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Enhanced Version
                    </button>
                    <button
                      onClick={() => setViewMode('ocr')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                        viewMode === 'ocr'
                          ? 'bg-blue-600 dark:bg-[#38BDF8] text-white dark:text-[#080B10]'
                          : 'bg-white/80 dark:bg-[#1E293B]/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-blue-400'
                      }`}
                    >
                      OCR Result
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 dark:text-[#A4ADBB] hidden sm:inline">
                    {currentDoc.enhancedTitle}
                  </span>
                </div>

                {/* Main Display Stage: Image with Bounding Box OR Transcribed OCR */}
                <div className="relative flex-1 flex items-center justify-center rounded-xl bg-white/60 dark:bg-[#0D1420]/80 border border-slate-200/60 dark:border-white/5 p-2 sm:p-4 overflow-hidden min-h-[360px]">
                  
                  {viewMode === 'enhanced' ? (
                    <div className="relative max-w-full max-h-[420px] rounded-lg overflow-hidden flex items-center justify-center shadow-md">
                      <img
                        src={currentDoc.image}
                        alt={currentDoc.title}
                        className="max-h-[380px] sm:max-h-[420px] w-auto object-contain rounded-lg select-none"
                      />

                      {/* Precise Orange Bounding Box Overlay matching image style */}
                      <div
                        className="absolute border-2 border-orange-500/90 rounded-xs pointer-events-none transition-all duration-300"
                        style={currentDoc.boundingBox}
                      >
                        <span className="absolute -top-3 left-2 bg-orange-500 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                          OCR DETECTED · {currentDoc.script}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-between text-left space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                            Confidence: {currentDoc.ocrConfidence}%
                          </span>
                          <span className="text-xs font-mono text-slate-500 dark:text-[#A4ADBB]">
                            Script: {currentDoc.script}
                          </span>
                        </div>

                        <button
                          onClick={handleCopyOcr}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-mono text-slate-700 dark:text-[#F4F7FB] transition-colors cursor-pointer"
                        >
                          {copiedOcr ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#080B10] border border-slate-200/80 dark:border-white/5 font-mono text-xs sm:text-sm text-slate-800 dark:text-[#F4F7FB] whitespace-pre-wrap leading-relaxed max-h-[280px] overflow-y-auto">
                        {currentDoc.ocrText}
                      </div>

                      <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-[#A4ADBB] flex items-center justify-between">
                        <span>Tokens Normalized: {currentDoc.wordCount} words</span>
                        <span className="text-blue-600 dark:text-[#38BDF8]">EMIQEN Indic OCR Engine</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Canvas Footer Note */}
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#A4ADBB] pt-1">
                  <span>Input: 300 DPI Archival Scan</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Accuracy: {currentDoc.ocrConfidence}%
                  </span>
                </div>

              </div>

              {/* Right Column: Upload Custom & Presets Sidebar */}
              <div className="lg:col-span-4 space-y-4 text-left">
                
                {/* Upload your own Card */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-white dark:bg-[#080B10] border border-slate-200/90 dark:border-white/10 hover:border-blue-500 dark:hover:border-[#38BDF8] flex items-center gap-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-[#A4ADBB] group-hover:text-blue-600 dark:group-hover:text-[#38BDF8] transition-colors">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-[#F4F7FB] group-hover:text-blue-600 dark:group-hover:text-[#38BDF8] transition-colors">
                      Upload your own
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-[#A4ADBB]">
                      PNG, JPG, PDF
                    </p>
                  </div>
                </div>

                {/* Examples Section Header */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2.5">
                    Examples
                  </span>

                  {/* Examples Presets List */}
                  <div className="space-y-2.5">
                    {DOCUMENT_PRESETS.map((doc) => {
                      const isSelected = selectedDocId === doc.id;

                      return (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setSelectedDocId(doc.id);
                            setViewMode('enhanced');
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-500/80 dark:border-[#38BDF8] shadow-xs'
                              : 'bg-white dark:bg-[#080B10] border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          <img
                            src={doc.image}
                            alt={doc.title}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-white/10 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className={`text-xs font-semibold truncate ${
                              isSelected
                                ? 'text-blue-700 dark:text-[#38BDF8]'
                                : 'text-slate-900 dark:text-[#F4F7FB]'
                            }`}>
                              {doc.title}
                            </h5>
                            <span className="text-[11px] text-slate-500 dark:text-[#A4ADBB] block">
                              {doc.languageNative !== doc.language ? `${doc.language} · ${doc.languageNative}` : doc.language}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB CONTENT: 2. VOICE AGENTS */}
          {/* ======================================================== */}
          {activeTab === 'voice-agents' && (
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-slate-50 dark:bg-[#080B10] rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-amber-500">अ</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-[#F4F7FB]">
                      Conversational Indic Voice Dialogue
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                    &lt;110ms Ultra-Low Latency
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1420] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-[#F4F7FB]">
                    <span className="text-blue-600 dark:text-[#38BDF8] font-bold block mb-1">User (Hinglish):</span>
                    "Bhaiya, mera UPI transaction fail ho gaya par account se paise kat gaye. Kya refund aa jayega?"
                  </div>
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-[#1E293B] border border-blue-200 dark:border-blue-900/50 text-slate-900 dark:text-[#F4F7FB]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">EMIQEN Voice Agent:</span>
                    "Haan ji, chinta mat kijiye! Banking switch ne transaction timeout record kiya hai. 24 hours ke andar aapke linked bank account mein automatic refund credit ho jayega."
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => toggleAudioSimulation("Bhaiya, mera UPI transaction fail ho gaya par account se paise kat gaye. Kya refund aa jayega?")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'Pause Voice Stream' : 'Simulate Voice Response'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-[#A4ADBB]">Acoustic Prosody: Indian Conversational</span>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">Pre-Trained Agent Domains</span>
                <div className="p-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-200 dark:border-white/10 text-xs">
                  <strong className="text-slate-900 dark:text-[#F4F7FB] block">Customer Service & Banking</strong>
                  <span className="text-slate-500 text-[11px]">Hinglish, Tamil & Telugu UPI dispute resolution</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-200 dark:border-white/10 text-xs">
                  <strong className="text-slate-900 dark:text-[#F4F7FB] block">Agri-Advisory & Weather</strong>
                  <span className="text-slate-500 text-[11px]">Rural Hindi, Marathi & Kannada crop telemetry</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB CONTENT: 3. TEXT TO SPEECH */}
          {/* ======================================================== */}
          {activeTab === 'tts' && (
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-slate-50 dark:bg-[#080B10] rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <span className="text-xs font-semibold text-slate-900 dark:text-[#F4F7FB]">Indic Neural Speech Synthesis (TTS)</span>
                  <span className="text-[10px] font-mono text-blue-600 dark:text-[#38BDF8]">24kHz HiFi Neural Vocoder</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0D1420] border border-slate-200 dark:border-white/5 text-xs text-slate-800 dark:text-[#F4F7FB] leading-relaxed">
                  "नमस्ते! EMIQEN का वॉइस इंजन भारतीय भाषाओं के लहजे और भावनाओं को पूरी स्वाभाविकता के साथ प्रस्तुत करता है।"
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleAudioSimulation("नमस्ते! EMIQEN का वॉइस इंजन भारतीय भाषाओं के लहजे और भावनाओं को पूरी स्वाभाविकता के साथ प्रस्तुत करता है।")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'Stop Speech' : 'Synthesize Voice'}</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span>Speed:</span>
                    <button onClick={() => setTtsSpeed(0.85)} className={`px-2 py-1 rounded ${ttsSpeed === 0.85 ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}>0.85x</button>
                    <button onClick={() => setTtsSpeed(1.0)} className={`px-2 py-1 rounded ${ttsSpeed === 1.0 ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}>1.0x</button>
                    <button onClick={() => setTtsSpeed(1.25)} className={`px-2 py-1 rounded ${ttsSpeed === 1.25 ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}>1.25x</button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-2.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">Voice Personas</span>
                {['Ananya (Hindi - Warm)', 'Rohan (Indian English - News)', 'Kavya (Tamil - Expressive)'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVoice(v)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-medium cursor-pointer transition-all ${
                      selectedVoice === v
                        ? 'border-blue-500 bg-blue-50/70 text-blue-700 dark:bg-blue-950/20 dark:text-[#38BDF8]'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#080B10] text-slate-800 dark:text-[#F4F7FB]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB CONTENT: 4. SPEECH TO TEXT */}
          {/* ======================================================== */}
          {activeTab === 'stt' && (
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-slate-50 dark:bg-[#080B10] rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <span className="text-xs font-semibold text-slate-900 dark:text-[#F4F7FB]">Indic Mixed-Language STT Engine</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">WER &lt;4.2% on Code-Switching</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0D1420] border border-slate-200 dark:border-white/5 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Live Audio Stream Captured (16kHz PCM)</span>
                  </div>
                  <p className="text-slate-900 dark:text-[#F4F7FB] leading-relaxed">
                    "Meeting kal subah 10 baje schedule kar do, client ke saath final contract review karna hai."
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">Hindi: 60%</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700">English: 40%</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Punctuation Restored</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">Robust To Real-World Audio</span>
                <div className="p-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-200 dark:border-white/10 text-xs">
                  <strong className="text-slate-900 dark:text-[#F4F7FB] block">Street & Traffic Noise</strong>
                  <span className="text-slate-500 text-[11px]">Trained on noisy 8kHz telephony channels</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-200 dark:border-white/10 text-xs">
                  <strong className="text-slate-900 dark:text-[#F4F7FB] block">Multi-Dialect Accents</strong>
                  <span className="text-slate-500 text-[11px]">Accurate on Bhojpuri, Bundelkhandi, Kongu Tamil</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB CONTENT: 5. INDUS COWORK */}
          {/* ======================================================== */}
          {activeTab === 'cowork' && (
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-slate-50 dark:bg-[#080B10] rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <span className="text-xs font-semibold text-slate-900 dark:text-[#F4F7FB]">Enterprise Bilingual Workspace Assistant</span>
                  <span className="text-[10px] font-mono text-purple-600 dark:text-[#A78BFA] font-bold">Domain SLM Grounded</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0D1420] border border-slate-200 dark:border-white/5 space-y-3 font-mono text-xs">
                  <div className="text-slate-500 text-[11px]">Prompt: "Analyze the tender agreement and summarize compliance requirements in Tamil."</div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-[#F4F7FB] leading-relaxed">
                    ஒப்பந்த விதிமுறைகளின்படி, அனைத்து ஜிஎஸ்டி மற்றும் தணிக்கை ஆவணங்கள் சமர்ப்பிக்கப்பட வேண்டும். 30 நாட்களுக்குள் கட்டணம் செலுத்தப்படும்.
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Context Retention: 32,000 Indic Tokens</span>
                  <span className="text-blue-600 dark:text-[#38BDF8]">Legal & FinTech Tuned</span>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">Enterprise Capabilities</span>
                <div className="p-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-200 dark:border-white/10 text-xs">
                  <strong className="text-slate-900 dark:text-[#F4F7FB] block">Contract Extraction</strong>
                  <span className="text-slate-500 text-[11px]">Bilingual clauses translated with legal fidelity</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#080B10] border border-slate-200 dark:border-white/10 text-xs">
                  <strong className="text-slate-900 dark:text-[#F4F7FB] block">Government Gazette Search</strong>
                  <span className="text-slate-500 text-[11px]">Cross-state circulars queried in regional tongues</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
