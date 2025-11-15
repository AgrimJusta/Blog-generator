import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Package,
  Layout,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

export default function App() {
  const [contentType, setContentType] = useState("blog");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    { id: "blog", name: "Blog Post", icon: FileText, desc: "Engaging articles and posts" },
    { id: "product", name: "Product Description", icon: Package, desc: "Compelling product copy" },
    { id: "landing", name: "Landing Page", icon: Layout, desc: "Conversion-focused pages" },
  ];

  const tones = ["professional", "casual", "enthusiastic", "authoritative", "friendly"];
  const lengths = [
    { id: "short", name: "Short", words: "100-200 words" },
    { id: "medium", name: "Medium", words: "300-500 words" },
    { id: "long", name: "Long", words: "600-1000 words" },
  ];

  const buildPrompt = () => {
    const lengthMap = {
      short: "100-200 words",
      medium: "300-500 words",
      long: "600-1000 words",
    };

    const prompts = {
      blog: `Write an engaging blog post about "${topic}".

Key requirements:
- Tone: ${tone}
- Length: ${lengthMap[length]}
- Keywords to include: ${keywords || "none specified"}
- Structure: Include a catchy title, introduction, main sections with subheadings, and conclusion
- Make it SEO-friendly and reader-engaging
- Use natural language and avoid keyword stuffing`,

      product: `Create a compelling product description for: "${topic}"

Key requirements:
- Tone: ${tone}
- Length: ${lengthMap[length]}
- Keywords to include: ${keywords || "none specified"}
- Highlight key features and benefits
- Include a strong call-to-action
- Focus on how it solves customer problems
- Make it scannable with bullet points where appropriate`,

      landing: `Write conversion-focused landing page content for: "${topic}"

Key requirements:
- Tone: ${tone}
- Length: ${lengthMap[length]}
- Keywords to include: ${keywords || "none specified"}
- Structure: Headline, subheadline, value proposition, features/benefits, social proof section, CTA
- Focus on conversion and clear messaging
- Address customer pain points
- Include compelling calls-to-action`,
    };

    return prompts[contentType];
  };

  const generateContent = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic or product name");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      // Frontend should call your backend proxy (recommended) at /api/generate
      const endpoint = import.meta.env.VITE_AI_API_ENDPOINT || "/api/generate";
      const apiKey = import.meta.env.VITE_AI_API_KEY || "";

      const body = {
        model: "gpt-4o-mini",
        max_tokens: 1000,
        messages: [{ role: "user", content: buildPrompt() }],
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let data;
      const text = await res.text();
      
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Failed to parse API response: ${res.status} ${res.statusText} — ${text}`);
      }

      if (!res.ok) {
        const errorMsg = data?.error?.message || data?.error || data?.message || text;
        throw new Error(`API error: ${res.status} ${res.statusText} — ${errorMsg}`);
      }

      // Try multiple common response shapes
      if (data?.content && Array.isArray(data.content) && data.content[0]?.text) {
        setGeneratedContent(data.content[0].text);
      } else if (data?.choices && data.choices[0]?.message?.content) {
        setGeneratedContent(data.choices[0].message.content);
      } else if (typeof data === "string") {
        setGeneratedContent(data);
      } else if (data?.output) {
        // some providers use `output`
        setGeneratedContent(JSON.stringify(data.output, null, 2));
      } else {
        console.debug('API response:', data);
        setGeneratedContent("Error: Unable to parse API response. Check console for details.");
      }
    } catch (error) {
      setGeneratedContent(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard error:", err);
      alert("Unable to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Content Generator</h1>
          <p className="text-gray-600">Create professional website content in seconds</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Settings</h2>

              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setContentType(type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        contentType === type.id ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                      aria-pressed={contentType === type.id}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${contentType === type.id ? "text-purple-600" : "text-gray-400"}`} />
                        <div>
                          <div className="font-medium text-gray-900">{type.name}</div>
                          <div className="text-sm text-gray-500">{type.desc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">{contentType === "product" ? "Product Name" : "Topic"}</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={contentType === "product" ? "e.g., Wireless Bluetooth Headphones" : "e.g., The Future of Remote Work"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                aria-label="topic"
              />

              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Keywords (optional)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., productivity, technology, innovation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                aria-label="keywords"
              />

              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {tones.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Length</label>
              <div className="grid grid-cols-3 gap-2">
                {lengths.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLength(l.id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      length === l.id ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                    aria-pressed={length === l.id}
                  >
                    <div className="font-medium text-sm">{l.name}</div>
                    <div className="text-xs opacity-70">{l.words}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={generateContent}
              disabled={isGenerating || !topic.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Content
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated Content</h2>
              {generatedContent && (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 min-h-[500px] max-h-[600px] overflow-y-auto">
              {generatedContent ? (
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{generatedContent}</div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FileText className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-center">Your generated content will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">For more help</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { title: "Email", desc: "agrimjusta@gmail.com" },
              { title: "LinkedIn", desc: (
                <a
                  href="https://linkedin.com/in/agrim-justa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Link
                </a> )},
              { title: "Github", desc: (
                <a
                  href="https://github.com/in/agrim-justa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Link
                </a> )},
              { title: "PookieLabs", desc: "Building for fun" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-white/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
