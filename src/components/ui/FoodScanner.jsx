import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Zap, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSettings } from '../../context/SettingsContext';

const FoodScanner = ({ onClose }) => {
  const { settings } = useSettings();
  const lang = settings.language || 'English';
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize camera
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Please allow camera access to scan food.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg');
    setCapturedImage(base64Image);
    setIsScanning(true);
    
    // Stop camera stream to save power after capture
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    await analyzeFood(base64Image);
  };

  const analyzeFood = async (base64) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      // Fallback for demo if no API key is provided
      setTimeout(() => {
        setStats({
          name: 'Detected Food',
          calories: 'Missing API Key',
          vibe: 'Get key from Google AI Studio'
        });
        setIsScanning(false);
      }, 2000);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analyze this food image. IMPORTANT: Respond entirely in ${lang} language. Return ONLY a JSON object:
      {
        "name": "Food name in ${lang} (be specific)",
        "calories": number,
        "protein": "string with unit (e.g. 15g)",
        "fats": "string with unit",
        "vibe": "Quick health benefit tip written in ${lang} with emoji"
      }`;

      // Convert base64 to parts for Gemini
      const generativePart = {
        inlineData: {
          data: base64.split(',')[1],
          mimeType: 'image/jpeg'
        }
      };

      const result = await model.generateContent([prompt, generativePart]);
      const response = await result.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);
      
      setStats(data);
    } catch (err) {
      console.error("AI Error:", err);
      setError("Failed to analyze food. Try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const resetScanner = async () => {
    setCapturedImage(null);
    setStats(null);
    setError(null);
    setIsScanning(false);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Please allow camera access.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6">
      {/* Viewfinder Area */}
      <div className="relative w-full aspect-[9/16] rounded-[40px] overflow-hidden border-4 border-white/10 shadow-2xl bg-zinc-900">
        {!capturedImage ? (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={capturedImage} 
            className="w-full h-full object-cover"
            alt="Captured food"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
        
        {/* Scanning Overlay Animation */}
        {isScanning && (
          <motion.div 
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-[#4ADE80] shadow-[0_0_20px_#4ADE80] z-20"
          />
        )}

        {/* HUD Elements */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start">
             <div className="w-10 h-10 border-t-4 border-l-4 border-[#4ADE80] rounded-tl-xl" />
             <div className="w-10 h-10 border-t-4 border-r-4 border-[#4ADE80] rounded-tr-xl" />
          </div>

          <div className="flex flex-col items-center gap-4">
             {error ? (
                <div className="bg-red-500/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-red-500/40 text-center pointer-events-auto">
                   <p className="text-red-400 text-xs font-bold">{error}</p>
                   <button onClick={resetScanner} className="mt-2 text-[10px] text-white underline">Retry</button>
                </div>
             ) : isScanning ? (
                <div className="bg-[#4ADE80]/20 backdrop-blur-md px-6 py-2 rounded-full border border-[#4ADE80]/40 flex items-center gap-2">
                   <Zap size={16} className="text-[#4ADE80] animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#4ADE80]">Analyzing with Gemini...</span>
                </div>
             ) : stats ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 w-full pointer-events-auto"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-[#4ADE80] font-black text-xl">{stats.name}</h3>
                    <button onClick={resetScanner} className="p-2 bg-white/10 rounded-full text-white">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-left">
                     <div>
                        <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Calories</p>
                        <p className="text-lg font-black text-white">{stats.calories}</p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Benefit</p>
                        <p className="text-sm font-bold text-white leading-tight">{stats.vibe}</p>
                     </div>
                  </div>
                </motion.div>
             ) : null}
          </div>

          <div className="flex justify-between items-end">
             <div className="w-10 h-10 border-b-4 border-l-4 border-[#4ADE80] rounded-bl-xl" />
             <div className="w-10 h-10 border-b-4 border-r-4 border-[#4ADE80] rounded-br-xl" />
          </div>
        </div>

        {/* Capture Button (Visible when camera is active) */}
        {!capturedImage && !error && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center z-30">
            <button 
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-[6px] border-white/40 flex items-center justify-center p-2 tap-effect"
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-lg">
                <Camera size={28} className="text-black" />
              </div>
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={onClose}
        className="mt-8 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white tap-effect border border-white/10"
      >
        <X size={32} />
      </button>
    </div>
  );
};

export default FoodScanner;
