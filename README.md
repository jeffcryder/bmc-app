# Business Model Canvas App

A modern, interactive web application for creating and managing Business Model Canvases with AI-powered insights and suggestions.

![React](https://img.shields.io/badge/React-19.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple)

## Overview

The Business Model Canvas App is a powerful tool designed to help entrepreneurs, business strategists, and innovators visualize and develop their business models using the popular Business Model Canvas framework. With integrated AI capabilities powered by Google's Gemini API, users can generate ideas, analyze their business models, and export professional PDFs.

## Features

### 📊 Canvas Management
- **Multiple Canvases**: Create and manage multiple business model canvases
- **Auto-Save**: Automatic saving to browser's local storage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Collapsible Sidebar**: Toggle sidebar for more workspace

### ✨ AI-Powered Features
- **Smart Suggestions**: Generate contextual ideas for each canvas block
- **Canvas Analysis**: Get comprehensive AI analysis of your entire business model
- **Venture Capitalist Perspective**: Receive feedback on strengths, weaknesses, and risks

### 📝 Rich Content Editing
- **Markdown Support**: Format your content with headers, bold, italic, and lists
- **Inline Editing**: Click any block to edit content directly
- **Visual Feedback**: Color-coded blocks for easy identification

### 📥 Export Capabilities
- **PDF Export**: Generate high-quality PDFs of your canvas
- **Professional Layout**: Landscape orientation optimized for printing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd bmc-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure AI features (optional):
   - Open `src/App.js`
   - Find the `callGeminiAPI` function
   - Add your Gemini API key:
```javascript
const apiKey = "YOUR_GEMINI_API_KEY_HERE";
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Creating a New Canvas

1. Click the **"New Canvas"** button in the sidebar
2. Give your canvas a meaningful name by clicking on the title
3. Start filling in the nine building blocks

### The Nine Building Blocks

1. **Key Partnerships**: Your key partners and suppliers
2. **Key Activities**: Most important activities to execute your value proposition
3. **Key Resources**: Assets required to offer and deliver your value proposition
4. **Value Propositions**: The bundle of products and services that create value
5. **Customer Relationships**: Types of relationships with customer segments
6. **Channels**: How your company communicates and reaches customer segments
7. **Customer Segments**: Groups of people or organizations you aim to reach
8. **Cost Structure**: All costs incurred to operate your business model
9. **Revenue Streams**: Cash generated from each customer segment

### Using AI Features

#### Generate Ideas for a Block
1. Click the **"Ideas"** button (sparkle icon) in any block
2. AI will analyze your existing canvas content
3. Contextual suggestions will be added to the block

#### Analyze Your Canvas
1. Click the **"Analyze Canvas"** button in the header
2. AI will provide comprehensive feedback including:
   - Strengths of your business model
   - Potential weaknesses and gaps
   - Risk factors to consider
   - Actionable recommendations

### Exporting Your Canvas

1. Click the **"Export PDF"** button in the header
2. Wait for the PDF generation process
3. The PDF will automatically download to your device

### Markdown Formatting

You can use the following Markdown syntax in canvas blocks:

- **Headers**: `# H1`, `## H2`, `### H3`
- **Bold**: `**text**` or `__text__`
- **Italic**: `*text*` or `_text_`
- **Code**: `` `code` ``
- **Lists**: `* item` for bullet points

## Project Structure

```
bmc-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Styles (unused - uses Tailwind classes)
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
├── package.json        # Project dependencies
└── README.md          # This file
```

## Technologies Used

- **React 19.1.0**: UI library
- **Tailwind CSS**: Utility-first CSS (inline classes)
- **Lucide React**: Icon library
- **Google Gemini API**: AI-powered features
- **jsPDF**: PDF generation
- **html2canvas**: Canvas to image conversion
- **Local Storage**: Data persistence

## Configuration

### API Key Setup

To enable AI features, you need a Google Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to the `callGeminiAPI` function in `App.js`

### Customization

You can customize the application by modifying:

- **Colors**: Change the `color` prop in `CanvasBlock` components
- **Layout**: Adjust the grid structure in the canvas board
- **AI Prompts**: Modify prompts in `handleGenerateIdeas` and `handleAnalyzeCanvas`

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome)

## Troubleshooting

### AI Features Not Working
- Verify your Gemini API key is correctly set
- Check browser console for API errors
- Ensure you have internet connectivity

### PDF Export Issues
- Make sure pop-ups are not blocked
- Check browser console for errors
- Try a different browser if issues persist

### Canvas Not Saving
- Check if local storage is enabled in your browser
- Clear browser cache and try again
- Verify browser supports local storage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] User authentication and cloud storage
- [ ] Collaboration features
- [ ] Canvas templates library
- [ ] Import/Export JSON format
- [ ] Dark mode support
- [ ] Multiple export formats (PNG, JPEG)
- [ ] Canvas versioning and history
- [ ] Integration with other business tools

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Business Model Canvas concept by Alexander Osterwalder
- Icons by Lucide React
- AI capabilities powered by Google Gemini

---

**Note**: This is a development version. For production use, ensure proper API key management and security practices.
