import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Image as ImageIcon, 
  Type, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Check,
  ChevronRight,
  Code,
  AlertCircle
} from 'lucide-react';

/**
 * Utility to copy text to clipboard
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

export default function App() {
  // State for Video Path Converter
  const [videoInput, setVideoInput] = useState('');
  const [videoOutput, setVideoOutput] = useState('');
  const [videoError, setVideoError] = useState('');
  
  // State for Image Path Converter
  const [imageInput, setImageInput] = useState('');
  const [imageOutput, setImageOutput] = useState('');
  const [imageError, setImageError] = useState('');

  // State for Script/CSS Path Converter
  const [scriptInput, setScriptInput] = useState('');
  const [scriptOutput, setScriptOutput] = useState('');
  const [scriptError, setScriptError] = useState('');
  
  // Feedback state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // Video Conversion Logic
  const convertVideo = () => {
    let input = videoInput.trim();
    if (input.startsWith('locdoc/cn')) {
      setVideoError('');
      setVideoOutput(`https://content-web-cdn.wggames.cn/${input}`);
    } else if (input.startsWith('/locdoc/cn')) {
      setVideoError('');
      setVideoOutput(`https://content-web-cdn.wggames.cn${input}`);
    } else {
      setVideoError('please enter the correct path');
      setVideoOutput('');
    }
  };

  // Image Conversion Logic
  const convertImage = () => {
    const input = imageInput.trim();
    if (input.startsWith('https://content-wg.gcdn.co/locdoc')) {
      setImageError('');
      const result = input.replace('https://content-wg.gcdn.co', 'https://content-web-cdn.wggames.cn');
      setImageOutput(result);
    } else {
      setImageError('Unable to convert this type of link. Please enter a correct link.');
      setImageOutput('');
    }
  };

  // Script/CSS Conversion Logic
  const convertScript = () => {
    const input = scriptInput.trim();
    const targetWithSlash = 'https://content-wg.gcdn.co/eu-content/widget-scripts/';
    const targetWithoutSlash = 'https://content-wg.gcdn.co/eu-content/widget-scripts';
    
    if (input.startsWith(targetWithSlash)) {
      setScriptError('');
      const suffix = input.slice(targetWithSlash.length);
      setScriptOutput(`https://content-web-cdn.wggames.cn/locdoc/cn/scripts/${suffix}`);
    } else if (input.startsWith(targetWithoutSlash)) {
      setScriptError('');
      const suffix = input.slice(targetWithoutSlash.length);
      const cleanSuffix = suffix.startsWith('/') ? suffix.slice(1) : suffix;
      setScriptOutput(`https://content-web-cdn.wggames.cn/locdoc/cn/scripts/${cleanSuffix}`);
    } else {
      setScriptError('Unable to convert this type of link. Please enter a link starting with https://content-wg.gcdn.co/eu-content/widget-scripts/');
      setScriptOutput('');
    }
  };

  const handleCopy = async (text: string) => {
    if (!text) return;
    const success = await copyToClipboard(text);
    if (success) showToast('Copied to clipboard!');
  };

  const handleOpen = (url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans">
      <div className="max-w-[1024px] mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-12 pt-8 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            WG Content Converter
          </h1>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12 pb-12 flex-1">
          {/* Card 1: Video Path Converter */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border-main p-6 shadow-sm flex flex-col"
          >
            <div className="mb-5">
              <div className="flex items-center gap-2 font-semibold text-base mb-2">
                <Video size={18} className="text-primary" />
                <span>Video Path Converter</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Copy path from WinSCP (Right click &gt; File Names &gt; Generate File URL), only copy the part after <code className="bg-input-bg px-1 rounded">htdocs/</code>
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">Input Path</label>
                <textarea
                  rows={3}
                  placeholder="e.g. locdoc/cn/intro_v2.mp4"
                  className={`w-full p-3 text-[13px] bg-input-bg border rounded-lg focus:ring-1 transition-all outline-none resize-none ${
                    videoError ? 'border-red-500 focus:ring-red-500' : 'border-border-main focus:ring-primary focus:border-primary focus:bg-white'
                  }`}
                  value={videoInput}
                  onChange={(e) => {
                    setVideoInput(e.target.value);
                    setVideoError('');
                  }}
                />
                {videoError && (
                  <p className="text-[11px] text-red-500 font-medium">{videoError}</p>
                )}
              </div>

              {videoOutput && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 relative"
                >
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">Generated URL</label>
                  <button 
                    onClick={() => handleCopy(videoOutput)}
                    className="absolute right-2 top-8 px-2 py-1 text-[11px] bg-white border border-border-main rounded hover:bg-bg-main transition-colors text-text-main z-10"
                  >
                    Copy
                  </button>
                  <textarea 
                    readOnly
                    rows={3}
                    className="w-full p-3 pr-14 text-[13px] bg-input-bg border border-border-main rounded-lg font-mono break-all outline-none"
                    value={videoOutput}
                  />
                </motion.div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={convertVideo}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Convert
              </button>
              {videoOutput && (
                <button 
                  onClick={() => handleOpen(videoOutput)}
                  className="flex-1 py-2.5 bg-success hover:bg-success-hover text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Open Link
                </button>
              )}
            </div>
          </motion.section>

          {/* Card 2: Global Image Redirect */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border-main p-6 shadow-sm flex flex-col"
          >
            <div className="mb-5">
              <div className="flex items-center gap-2 font-semibold text-base mb-2">
                <ImageIcon size={18} className="text-primary" />
                <span>Global Image Redirect</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Paste global image URL to convert the domain to regional CDN address.
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">Global Source URL</label>
                <textarea
                  rows={3}
                  placeholder="https://content-wg.gcdn.co/locdoc/..."
                  className={`w-full p-3 text-[13px] bg-input-bg border rounded-lg focus:ring-1 transition-all outline-none resize-none ${
                    imageError ? 'border-red-500 focus:ring-red-500' : 'border-border-main focus:ring-primary focus:border-primary focus:bg-white'
                  }`}
                  value={imageInput}
                  onChange={(e) => {
                    setImageInput(e.target.value);
                    setImageError('');
                  }}
                />
                {imageError && (
                  <p className="text-[11px] text-red-500 font-medium">{imageError}</p>
                )}
              </div>

              {imageOutput && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 relative"
                >
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">Regional CDN URL</label>
                  <button 
                    onClick={() => handleCopy(imageOutput)}
                    className="absolute right-2 top-8 px-2 py-1 text-[11px] bg-white border border-border-main rounded hover:bg-bg-main transition-colors text-text-main z-10"
                  >
                    Copy
                  </button>
                  <textarea 
                    readOnly
                    rows={3}
                    className="w-full p-3 pr-14 text-[13px] bg-input-bg border border-border-main rounded-lg font-mono break-all outline-none"
                    value={imageOutput}
                  />
                </motion.div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={convertImage}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Convert
              </button>
              {imageOutput && (
                <button 
                  onClick={() => handleOpen(imageOutput)}
                  className="flex-1 py-2.5 bg-success hover:bg-success-hover text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Open Link
                </button>
              )}
            </div>
          </motion.section>

          {/* Card 3: Script/CSS Path Converter */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border-main p-6 shadow-sm flex flex-col"
          >
            <div className="mb-5">
              <div className="flex items-center gap-2 font-semibold text-base mb-2">
                <Code size={18} className="text-primary" />
                <span>Script/CSS Path Converter</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Convert global script/CSS links starting with <code className="bg-input-bg px-1 rounded font-mono">eu-content/widget-scripts/</code> to regional CN CDN scripts path.
              </p>
              <p className="text-[10px] text-amber-600 font-medium mt-2 leading-relaxed bg-amber-50 p-2 rounded-lg border border-amber-100">
                💡 Tip: If the converted link opens a blank page or actual code, it means the script already exists on CN CDN. If it shows a 404 error, the script needs to be uploaded to the CDN.
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">Script/CSS URL</label>
                  <textarea
                    rows={3}
                    placeholder="https://content-wg.gcdn.co/eu-content/widget-scripts/..."
                    className={`w-full p-3 text-[13px] bg-input-bg border rounded-lg focus:ring-1 transition-all outline-none resize-none ${
                      scriptError ? 'border-red-500 focus:ring-red-500' : 'border-border-main focus:ring-primary focus:border-primary focus:bg-white'
                    }`}
                    value={scriptInput}
                    onChange={(e) => {
                      setScriptInput(e.target.value);
                      setScriptError('');
                    }}
                  />
                  {scriptError && (
                    <p className="text-[11px] text-red-500 font-medium">{scriptError}</p>
                  )}
                </div>

                {scriptOutput && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 relative"
                  >
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">Regional CN CDN Link</label>
                    <button 
                      onClick={() => handleCopy(scriptOutput)}
                      className="absolute right-2 top-8 px-2 py-1 text-[11px] bg-white border border-border-main rounded hover:bg-bg-main transition-colors text-text-main z-10"
                    >
                      Copy
                    </button>
                    <textarea 
                      readOnly
                      rows={3}
                      className="w-full p-3 pr-14 text-[13px] bg-input-bg border border-border-main rounded-lg font-mono break-all outline-none"
                      value={scriptOutput}
                    />
                  </motion.div>
                )}
              </div>

              {/* Subfolder warning notice nested inside the card's empty space */}
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5 mt-6">
                <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-[11px] text-amber-800 leading-relaxed">
                  <span className="font-semibold block mb-0.5">Subfolder Notice:</span>
                  If the <code className="bg-amber-100/70 px-1 rounded font-mono text-[10px]">eu-content</code> path contains subfolders (e.g., <code className="bg-white/80 px-1 rounded font-mono text-[10px]">/eu-content/widget-scripts/<span className="text-red-600 font-bold">toc</span>/</code>), you can try deleting the subfolder path section before converting, because the CN CDN script repository does not contain subfolders.
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={convertScript}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Convert
              </button>
              {scriptOutput && (
                <button 
                  onClick={() => handleOpen(scriptOutput)}
                  className="flex-1 py-2.5 bg-success hover:bg-success-hover text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Open Link
                </button>
              )}
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-text-muted text-[11px]">
          CNWG Content Converter - <a href="https://cc423.notion.site/zhe-chen-website" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">Zhe Chen</a> April.2026
        </footer>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-sm rounded-full shadow-lg flex items-center gap-2 z-50"
          >
            <Check size={16} className="text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
