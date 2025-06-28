import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Sparkles,
  LoaderCircle,
  Edit3,
} from "lucide-react";

// --- Helper & Utility Components ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl transform transition-all flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Sparkles className="text-purple-500 mr-2" size={24} />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto prose prose-sm md:prose-base max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="text-gray-700 mb-6">{children}</div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Markdown to HTML parser
const parseMarkdown = (text) => {
  if (!text) return "";
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mb-3">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      '<code class="bg-gray-200 text-sm rounded px-1 py-0.5">$1</code>'
    )
    .replace(/^\* (.*$)/gim, '<ul><li class="list-disc ml-5">$1</li></ul>')
    .replace(/<\/ul>\n<ul>/g, "")
    .replace(/\n/g, "<br />")
    .replace(/<br \/><h/g, "<h")
    .replace(/<br \/><ul/g, "<ul");

  return html;
};

// Main App Component
const App = () => {
  const [canvases, setCanvases] = useState([createNewCanvas()]);
  const [currentCanvasIndex, setCurrentCanvasIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [aiAnalysis, setAiAnalysis] = useState({
    isLoading: false,
    content: "",
  });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    try {
      const savedCanvases = localStorage.getItem("businessModelCanvases");
      if (savedCanvases) {
        const parsedCanvases = JSON.parse(savedCanvases);
        if (Array.isArray(parsedCanvases) && parsedCanvases.length > 0)
          setCanvases(parsedCanvases);
      }
    } catch (error) {
      console.error("Failed to load canvases:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("businessModelCanvases", JSON.stringify(canvases));
    } catch (error) {
      console.error("Failed to save canvases:", error);
    }
  }, [canvases]);

  const currentCanvas = canvases[currentCanvasIndex] || createNewCanvas();

  function createNewCanvas() {
    return {
      id: Date.now(),
      name: "Untitled Canvas",
      keyPartnerships: "",
      keyActivities: "",
      keyResources: "",
      valuePropositions: "",
      customerRelationships: "",
      channels: "",
      customerSegments: "",
      costStructure: "",
      revenueStreams: "",
    };
  }

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: null,
      title: "",
      message: "",
      onConfirm: () => {},
    });
    setAiAnalysis({ isLoading: false, content: "" });
  };

  async function callGeminiAPI(prompt) {
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    const result = await response.json();

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid API response structure.");
    }
  }

  const handleAddNewCanvas = () => {
    const newCanvas = createNewCanvas();
    const newCanvases = [...canvases, newCanvas];
    setCanvases(newCanvases);
    setCurrentCanvasIndex(newCanvases.length - 1);
  };

  const handleSelectCanvas = (index) => setCurrentCanvasIndex(index);

  const handleDeleteRequest = (indexToDelete) => {
    if (canvases.length <= 1) return;
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete Canvas",
      message: `Are you sure you want to delete "${canvases[indexToDelete].name}"? This action cannot be undone.`,
      onConfirm: () => handleDeleteCanvas(indexToDelete),
    });
  };

  const handleDeleteCanvas = (indexToDelete) => {
    const newCanvases = canvases.filter((_, index) => index !== indexToDelete);
    setCanvases(newCanvases);
    setCurrentCanvasIndex(Math.max(0, currentCanvasIndex - 1));
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedCanvases = [...canvases];
    updatedCanvases[currentCanvasIndex] = {
      ...updatedCanvases[currentCanvasIndex],
      [name]: value,
    };
    setCanvases(updatedCanvases);
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      // Check if the script is already in the document
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve();
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) =>
        reject(new Error(`Script load error for ${src}`, { cause: err }));
      document.head.appendChild(script);
    });
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      await Promise.all([
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        ),
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        ),
      ]);

      const { jsPDF } = window.jspdf;
      const html2canvas = window.html2canvas;

      if (!jsPDF || !html2canvas) {
        throw new Error("PDF generation libraries could not be loaded.");
      }

      const canvasElement = document.getElementById("canvas-board");
      if (!canvasElement) {
        console.error("Canvas board element not found");
        return;
      }

      const editButtons = canvasElement.querySelectorAll(".edit-button-class");
      editButtons.forEach((btn) => (btn.style.display = "none"));

      const originalBackgroundColor = canvasElement.style.backgroundColor;
      canvasElement.style.backgroundColor = "white";

      const canvas = await html2canvas(canvasElement, {
        scale: 2,
        useCORS: true,
      });

      canvasElement.style.backgroundColor = originalBackgroundColor;
      editButtons.forEach((btn) => (btn.style.display = "flex"));

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${currentCanvas.name.replace(/\s+/g, "_").toLowerCase()}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      setModal({
        isOpen: true,
        type: "alert",
        title: "Export Error",
        message: `Could not export to PDF. ${error.message}`,
        onConfirm: closeModal,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateIdeas = async (blockName, blockTitle) => {
    let canvasContext = `Business Name: ${currentCanvas.name}\n`;
    for (const key in currentCanvas) {
      if (
        key !== "id" &&
        key !== "name" &&
        key !== blockName &&
        currentCanvas[key]
      ) {
        const title = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        canvasContext += `${title}: ${currentCanvas[key]}\n`;
      }
    }
    const prompt = `You are an expert business strategist. Based on the following business model details, brainstorm a list of potential ideas for the '${blockTitle}' section. Provide the ideas as a bulleted list (using '*' for bullets). Be concise, actionable, and use Markdown formatting.\n\nExisting Canvas:\n${canvasContext}`;

    try {
      const responseText = await callGeminiAPI(prompt);
      const updatedCanvases = [...canvases];
      const currentBlockContent =
        updatedCanvases[currentCanvasIndex][blockName];
      updatedCanvases[currentCanvasIndex][blockName] =
        (currentBlockContent ? currentBlockContent + "\n\n" : "") +
        `### ✨ AI Suggestions\n${responseText}`;
      setCanvases(updatedCanvases);
    } catch (error) {
      setModal({
        isOpen: true,
        type: "alert",
        title: "AI Error",
        message: `Failed to generate ideas. ${error.message}`,
        onConfirm: closeModal,
      });
    }
  };

  const handleAnalyzeCanvas = async () => {
    setAiAnalysis({ isLoading: true, content: "" });
    setModal({ isOpen: true, type: "aiAnalysis" });

    let canvasContext =
      `Business Name: ${currentCanvas.name}\n` +
      Object.entries(currentCanvas)
        .filter(([key, value]) => key !== "id" && value)
        .map(
          ([key, value]) =>
            `${key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}: ${value}`
        )
        .join("\n");

    const prompt = `You are a venture capitalist. Analyze the provided Business Model Canvas for strengths, weaknesses, and risks. Provide actionable advice. Structure your feedback with clear headings using markdown (e.g., "### Strengths").\n\n${canvasContext}`;

    try {
      const responseText = await callGeminiAPI(prompt);
      setAiAnalysis({ isLoading: false, content: parseMarkdown(responseText) });
    } catch (error) {
      setAiAnalysis({
        isLoading: false,
        content: `<p class="text-red-500">Sorry, the analysis failed. ${error.message}</p>`,
      });
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100 font-sans">
        <aside
          className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-700 min-w-max">
            <h1 className="text-xl font-bold">My Canvases</h1>
          </div>
          <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
            {canvases.map((canvas, index) => (
              <div
                key={canvas.id}
                className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                  currentCanvasIndex === index
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => handleSelectCanvas(index)}
              >
                <div className="flex items-center min-w-0">
                  <FileText size={18} className="mr-3 flex-shrink-0" />
                  <span className="truncate font-medium">{canvas.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRequest(index);
                  }}
                  className="p-1 rounded-full hover:bg-red-500 text-gray-400 hover:text-white flex-shrink-0"
                  aria-label="Delete canvas"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleAddNewCanvas}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              <Plus size={20} className="mr-2" />
              New Canvas
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white shadow-md p-4 flex justify-between items-center z-10 gap-4">
            <div className="flex items-center min-w-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md hover:bg-gray-200 mr-2 md:mr-4"
              >
                <ChevronLeft
                  size={20}
                  className={`transition-transform duration-300 ${
                    isSidebarOpen ? "" : "rotate-180"
                  }`}
                />
              </button>
              <input
                type="text"
                name="name"
                value={currentCanvas.name}
                onChange={handleInputChange}
                className="text-xl md:text-2xl font-bold text-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 truncate"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyzeCanvas}
                className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex-shrink-0"
              >
                <Sparkles size={20} className="mr-2" />{" "}
                <span className="hidden sm:inline">Analyze Canvas</span>
              </button>
              <button
                onClick={exportAsPDF}
                disabled={isExporting}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex-shrink-0 disabled:bg-green-300 disabled:cursor-wait"
              >
                {isExporting ? (
                  <LoaderCircle size={20} className="animate-spin mr-2" />
                ) : (
                  <Download size={20} className="mr-2" />
                )}
                <span className="hidden sm:inline">
                  {isExporting ? "Exporting..." : "Export PDF"}
                </span>
              </button>
            </div>
          </header>

          <div
            id="canvas-board"
            className="flex-1 p-2 md:p-4 lg:p-6 overflow-auto bg-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full min-h-[650px]">
              {/* Left Column */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="flex-1">
                  <CanvasBlock
                    title="Key Partnerships"
                    name="keyPartnerships"
                    value={currentCanvas.keyPartnerships}
                    onChange={handleInputChange}
                    onGenerateIdeas={handleGenerateIdeas}
                    color="bg-red-100"
                  />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <CanvasBlock
                    title="Key Activities"
                    name="keyActivities"
                    value={currentCanvas.keyActivities}
                    onChange={handleInputChange}
                    onGenerateIdeas={handleGenerateIdeas}
                    color="bg-orange-100"
                  />
                  <CanvasBlock
                    title="Key Resources"
                    name="keyResources"
                    value={currentCanvas.keyResources}
                    onChange={handleInputChange}
                    onGenerateIdeas={handleGenerateIdeas}
                    color="bg-yellow-100"
                  />
                </div>
              </div>
              {/* Center Column */}
              <div className="flex items-center justify-center">
                <CanvasBlock
                  title="Value Propositions"
                  name="valuePropositions"
                  value={currentCanvas.valuePropositions}
                  onChange={handleInputChange}
                  onGenerateIdeas={handleGenerateIdeas}
                  color="bg-purple-200"
                  isCenter
                />
              </div>
              {/* Right Column */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="flex-1">
                  <CanvasBlock
                    title="Customer Segments"
                    name="customerSegments"
                    value={currentCanvas.customerSegments}
                    onChange={handleInputChange}
                    onGenerateIdeas={handleGenerateIdeas}
                    color="bg-green-100"
                  />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <CanvasBlock
                    title="Customer Relationships"
                    name="customerRelationships"
                    value={currentCanvas.customerRelationships}
                    onChange={handleInputChange}
                    onGenerateIdeas={handleGenerateIdeas}
                    color="bg-teal-100"
                  />
                  <CanvasBlock
                    title="Channels"
                    name="channels"
                    value={currentCanvas.channels}
                    onChange={handleInputChange}
                    onGenerateIdeas={handleGenerateIdeas}
                    color="bg-cyan-100"
                  />
                </div>
              </div>
              {/* Bottom Row */}
              <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <CanvasBlock
                  title="Cost Structure"
                  name="costStructure"
                  value={currentCanvas.costStructure}
                  onChange={handleInputChange}
                  onGenerateIdeas={handleGenerateIdeas}
                  color="bg-indigo-100"
                />
                <CanvasBlock
                  title="Revenue Streams"
                  name="revenueStreams"
                  value={currentCanvas.revenueStreams}
                  onChange={handleInputChange}
                  onGenerateIdeas={handleGenerateIdeas}
                  color="bg-pink-100"
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {modal.type === "confirm" && (
        <ConfirmationModal
          isOpen={modal.isOpen}
          onClose={closeModal}
          onConfirm={modal.onConfirm}
          title={modal.title}
        >
          {modal.message}
        </ConfirmationModal>
      )}
      {modal.type === "aiAnalysis" && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title="Business Model Analysis"
        >
          <div
            dangerouslySetInnerHTML={{ __html: aiAnalysis.content || "" }}
          ></div>
          {aiAnalysis.isLoading && (
            <div className="flex justify-center items-center h-48">
              <LoaderCircle
                className="animate-spin text-purple-500"
                size={48}
              />
            </div>
          )}
        </Modal>
      )}
      {modal.type === "alert" && (
        <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
          <p>{modal.message}</p>
        </Modal>
      )}
    </>
  );
};

const CanvasBlock = ({
  title,
  name,
  value,
  onChange,
  color,
  isCenter = false,
  onGenerateIdeas,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const handleGenerateClick = async (e) => {
    e.stopPropagation();
    setIsGenerating(true);
    await onGenerateIdeas(name, title);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col rounded-lg shadow-md p-3 md:p-4 ${color} h-full`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3
          className={`font-bold text-gray-700 ${
            isCenter ? "text-lg md:text-xl" : "text-base md:text-lg"
          }`}
        >
          {title}
        </h3>
        <button
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="flex items-center px-2 py-1 bg-white/60 hover:bg-white/90 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-md text-xs font-semibold text-purple-600 transition-all shadow-sm"
        >
          {isGenerating ? (
            <LoaderCircle className="animate-spin" size={16} />
          ) : (
            <Sparkles size={16} className="mr-1" />
          )}
          <span className="ml-1">
            {isGenerating ? "Generating..." : "Ideas"}
          </span>
        </button>
      </div>

      <div className="relative flex-grow">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={() => setIsEditing(false)}
            placeholder="Add notes using Markdown..."
            className="absolute inset-0 bg-white bg-opacity-70 border-2 border-blue-400 rounded-md p-2 w-full h-full resize-none focus:outline-none ring-2 ring-blue-400 z-10 text-sm"
          ></textarea>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="absolute inset-0 bg-white bg-opacity-50 border-2 border-transparent hover:border-blue-300 rounded-md p-2 w-full h-full cursor-pointer prose prose-sm max-w-none overflow-y-auto"
          >
            <div
              dangerouslySetInnerHTML={{
                __html:
                  parseMarkdown(value) ||
                  `<p class="text-gray-400">Click to add notes...</p>`,
              }}
            />
            <div className="edit-button-class absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity p-1 bg-gray-500/20 rounded-full">
              <Edit3 size={14} className="text-gray-700" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
