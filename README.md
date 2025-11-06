# Life Hub

A modern, self-hosted note-taking and data organization app - your affordable alternative to Notion and Evernote with Coda-like capabilities.

## Features

### Core Capabilities

- **Notebooks**: Organize your content into separate workspaces
- **Notes**: Rich text documents with full formatting support
- **Tables**: Structured data with powerful property types
- **Tags**: Easy categorization across all your content
- **Search**: Global search to find anything instantly
- **Views**: Multiple ways to visualize your data (coming soon: card and list views)

### Property Types

Tables support rich property types similar to Coda and Notion:

- **Text**: Simple text fields
- **Number**: Numeric values
- **Select**: Single choice from predefined options
- **Multi-select**: Multiple choices
- **Date**: Date picker
- **Checkbox**: Boolean values
- **URL**: Clickable links
- **Email**: Email addresses with mailto links
- **File**: File attachments (coming soon)

### Why Life Hub?

- ✅ **Affordable**: Self-hosted, no subscription fees
- ✅ **Simple Tables**: Records are records, not full pages (unlike Notion)
- ✅ **Your Data**: Everything stored locally
- ✅ **Fast**: Lightweight and responsive
- ✅ **Privacy**: No data sent to third parties

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd life-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

### Creating Your First Notebook

1. Click the "+" button in the sidebar header
2. Give your notebook a name, icon, and color
3. Click "Create"

### Adding Items

1. Select a notebook from the sidebar
2. Click the "+" button that appears when hovering over the notebook
3. Choose between:
   - **Note**: For rich text documents
   - **Table**: For structured data with custom properties

### Working with Notes

- Use the rich text editor toolbar for formatting
- Add tags to organize and find notes later
- All changes are saved automatically

### Working with Tables

- Define properties when creating a table
- Add records by clicking "Add Record"
- Edit or delete records using the action buttons
- Each record can have notes attached (optional)

### Searching

- Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open search
- Search across all notes, tables, and content
- Click a result to jump directly to it

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Rich Text Editor**: TipTap
- **State Management**: Zustand with localStorage persistence
- **Tables**: Tanstack Table (ready for advanced features)

## Roadmap

- [ ] Card and List views for tables
- [ ] Filtering and sorting for table views
- [ ] Grouping records in tables
- [ ] File attachments
- [ ] Export to Markdown/CSV
- [ ] Backend API with Express + SQLite
- [ ] Real-time collaboration
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT

## Support

For questions and support, please open an issue on GitHub.
