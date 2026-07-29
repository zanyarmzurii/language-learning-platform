// Speech recognition and synthesis utilities

export function speakText(text: string, language: string = "en-US") {
  if (typeof window === "undefined") return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.9; // Slightly slower for learning
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

export function startSpeechRecognition(
  language: string = "en-US",
  onResult: (text: string) => void,
  onError: (error: string) => void
) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("Speech recognition not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = language;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const text = event.results[0][0].transcript;
    onResult(text);
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.start();
  return recognition;
}

export function stopSpeechRecognition(recognition: any) {
  if (recognition) {
    recognition.stop();
  }
}

// Text-to-Speech using Browser API (Free)
export async function textToSpeech(
  text: string,
  language: string = "en-US"
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject("Browser only");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;

    utterance.onend = () => resolve("success");
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}
