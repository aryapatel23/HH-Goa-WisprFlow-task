"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  Tag,
  Utensils,
  X,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LANGUAGES = [
  { code: "hi-IN", label: "Hindi (हिंदी)", key: "hi" },
  { code: "en-IN", label: "English (Indian)", key: "en" },
  { code: "gu-IN", label: "Gujarati (ગુજરાતી)", key: "gu" },
];

const SAMPLE_VOICE_PROMPTS = [
  {
    text: "aaj ka paneer bahut oily tha, aur roti kacchi thi",
    lang: "hi",
    label: "Paneer & Roti quality",
  },
  {
    text: "water dispenser ke paas paani phaila hua hai aur bohot gandi smell aa rahi hai",
    lang: "hi",
    label: "Water cooler hygiene",
  },
  {
    text: "dinner ke time rice aur dal tadka 9:15 baje hi khatam ho gaya tha",
    lang: "hi",
    label: "Dal & Rice shortage",
  },
  {
    text: "The plates in the rack were greasy and oily. Wash water is cold.",
    lang: "en",
    label: "Greasy plates hygiene",
  },
  {
    text: "subah ka poha bilkul dry tha aur peanuts jale hue the",
    lang: "hi",
    label: "Breakfast Poha burnt",
  },
];

export function VoiceFeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState("hi-IN");
  const [transcript, setTranscript] = useState("");
  const [attachToMeal, setAttachToMeal] = useState<string>("dinner");
  const [isAnonymousGeneral, setIsAnonymousGeneral] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    category: string;
    sentiment: string;
    urgency: string;
    summary: string;
    dishName?: string | null;
  } | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) {
      // Fallback for browsers without speech API: use sample
      setIsRecording(true);
      setTimeout(() => {
        setTranscript("aaj ka paneer bahut oily tha, aur roti kacchi thi");
        setIsRecording(false);
      }, 1800);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = selectedLang;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsRecording(false);
      }
    }
  };

  const handleUsePrompt = (promptText: string, langKey: string) => {
    setTranscript(promptText);
    const matched = LANGUAGES.find((l) => l.key === langKey);
    if (matched) setSelectedLang(matched.code);
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    setConfirmation(null);

    const langObj = LANGUAGES.find((l) => l.code === selectedLang);
    const langKey = langObj?.key || "en";

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transcript.trim(),
          language: langKey,
          mealSlot: isAnonymousGeneral ? undefined : attachToMeal,
          linkDetail: isAnonymousGeneral ? "General Hostel Complaint" : `Attached to ${attachToMeal} meal`,
        }),
      });

      const data = await res.json();
      if (data.success && data.classification) {
        setConfirmation(data.classification);
      } else {
        alert(data.error || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTranscript("");
    setConfirmation(null);
    setIsRecording(false);
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            setIsOpen(true);
            resetForm();
          }}
          className="group flex h-14 items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-4 text-white shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 hover:shadow-emerald-600/50 focus:outline-none"
        >
          <div className="relative flex h-6 w-6 items-center justify-center">
            <Mic className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide">
            Speak Feedback
          </span>
        </button>
      </div>

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                    Voice Feedback & Complaint Box
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Identity is 100% Anonymous (No User ID Stored)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[75vh] overflow-y-auto p-4 space-y-4">
              {confirmation ? (
                /* AI CONFIRMATION CARD */
                <div className="space-y-4 rounded-xl border border-emerald-300 bg-emerald-50/70 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>AI Classification Confirmed!</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Detected Category:</span>
                      <Badge
                        variant={
                          confirmation.category === "HYGIENE"
                            ? "destructive"
                            : confirmation.category === "QUANTITY"
                            ? "warning"
                            : "default"
                        }
                        className="text-xs font-bold"
                      >
                        {confirmation.category}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Urgency Level:</span>
                      <Badge
                        variant={
                          confirmation.urgency === "CRITICAL"
                            ? "destructive"
                            : confirmation.urgency === "HIGH"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {confirmation.urgency}
                      </Badge>
                    </div>

                    {confirmation.dishName && (
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Linked Dish:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {confirmation.dishName}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900">
                      <span className="text-zinc-500 font-medium">English Summary:</span>
                      <p className="mt-1 font-semibold italic text-zinc-800 dark:text-zinc-200">
                        &ldquo;{confirmation.summary}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/80 p-3 text-[11px] text-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-400">
                    🔒 <strong>Privacy Assurance:</strong> Your feedback was securely recorded into the mess manager&apos;s actionable feed without linking your name, email, or student ID.
                  </div>

                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="w-full text-xs font-semibold"
                  >
                    Submit Another Feedback
                  </Button>
                </div>
              ) : (
                <>
                  {/* LANGUAGE PICKER */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-emerald-600" />
                      Select Speech Language:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setSelectedLang(lang.code)}
                          className={`rounded-lg border p-2 text-xs font-semibold text-center transition-all ${
                            selectedLang === lang.code
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-sm"
                              : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* RECORDING BUTTON AREA */}
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-6 text-center dark:border-emerald-900/60 dark:bg-emerald-950/20">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`h-20 w-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl ${
                        isRecording
                          ? "bg-red-500 animate-pulse scale-110 shadow-red-500/50"
                          : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 hover:scale-105"
                      }`}
                    >
                      {isRecording ? <MicOff className="h-9 w-9" /> : <Mic className="h-9 w-9" />}
                    </button>

                    <div className="mt-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                        {isRecording ? "🔴 Listening Live... Speak Now" : "Tap Microphone to Speak"}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Speaks in Hindi, Gujarati, or English. Browser converts to text.
                      </p>
                    </div>
                  </div>

                  {/* QUICK SIMULATION PROMPT CHIPS */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Or tap a realistic prompt to test:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLE_VOICE_PROMPTS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleUsePrompt(p.text, p.lang)}
                          className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:border-emerald-400 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                          💬 {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* EDITABLE TEXTAREA */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                      <span>Transcribed Text (Editable):</span>
                      <span className="text-[10px] text-zinc-400 font-normal">
                        You can edit or type before submitting
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Your voice transcription will appear here. You can also type directly..."
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    />
                  </div>

                  {/* ATTACHMENT TOGGLE: MEAL SLOT VS GENERAL */}
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        Attachment Scope:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAnonymousGeneral(false)}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                            !isAnonymousGeneral
                              ? "bg-white text-emerald-700 shadow-sm border border-emerald-300 dark:bg-zinc-800 dark:text-emerald-300"
                              : "text-zinc-500"
                          }`}
                        >
                          Attach to Meal
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAnonymousGeneral(true)}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                            isAnonymousGeneral
                              ? "bg-white text-emerald-700 shadow-sm border border-emerald-300 dark:bg-zinc-800 dark:text-emerald-300"
                              : "text-zinc-500"
                          }`}
                        >
                          General Mess Box
                        </button>
                      </div>
                    </div>

                    {!isAnonymousGeneral && (
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[11px] text-zinc-500">Meal Slot:</span>
                        <div className="flex gap-1.5">
                          {["breakfast", "lunch", "snacks", "dinner"].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setAttachToMeal(slot)}
                              className={`capitalize text-[11px] px-2 py-0.5 rounded border transition-all ${
                                attachToMeal === slot
                                  ? "border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold"
                                  : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            {!confirmation && (
              <div className="flex items-center justify-end gap-2 border-t border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!transcript.trim() || loading}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {loading ? (
                    "Analyzing with AI..."
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Submit Anonymously
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
