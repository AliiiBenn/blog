# Issue: Add Markdown Paste/Import Functionality to Rich Text Editor

## Status
**Open** - Ready to implement

## Priority
Medium

## Overview
Add the ability to paste Markdown content directly into the Payload rich text editor (Lexical) and have it automatically convert to rich text format. This will make it much easier to create blog posts from existing Markdown files or documentation.

## Problem Statement
Currently, when creating or editing blog posts in Payload CMS:
- Pasting Markdown results in plain text, not formatted content
- Must manually format all content (headings, bold, lists, code blocks, etc.)
- Time-consuming to convert existing Markdown articles to rich text
- No easy way to import Markdown documentation or existing blog posts

## Proposed Solution

### Approach 1: Paste Handler (Recommended)

Add a paste handler to the Lexical editor that detects Markdown content and converts it automatically.

**Benefits:**
- Seamless user experience - just paste and it works
- No additional UI needed
- Works with clipboard history
- Most intuitive for users

**Implementation:**
```typescript
// In payload.config.ts or Posts collection
editor: lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    // Add custom paste handler for Markdown
    {
      feature: function MarkdownPasteFeature({ editor }) {
        editor.registerCommand(
          PASTE_COMMAND,
          (event: ClipboardEvent) => {
            const pastedData = event.clipboardData?.getData('text/plain')

            // Detect if content looks like Markdown
            if (isMarkdown(pastedData)) {
              const lexicalData = convertMarkdownToLexical({
                markdown: pastedData,
                editorConfig: editorConfig
              })

              // Insert converted content
              editor.update(() => {
                // Insert lexicalData into editor
              })

              return true // Handled
            }

            return false // Use default paste
          }
        )
      }
    }
  ]
})
```

### Approach 2: Import Markdown Button

Add a button in the rich text editor toolbar that opens a modal for pasting/importing Markdown.

**Benefits:**
- More explicit - user knows what's happening
- Can include preview of converted content
- Can import from file upload
- Better for large Markdown documents

**Implementation:**
1. Add custom button to Lexical toolbar
2. Open modal on click with textarea for Markdown input
3. Show live preview of converted content
4. Button to insert into editor
5. Optional: File upload for .md files

### Approach 3: Hybrid (Best UX)

Combine both approaches:
- Automatic paste detection for quick pastes
- Import button for large content or file uploads
- Toggle in settings to disable auto-convert if desired

## Requirements

### Functional Requirements
1. Detect Markdown paste in rich text editor
2. Convert Markdown to Lexical rich text format
3. Support all common Markdown syntax:
   - Headings (# ## ### #### ##### ######)
   - Bold (**text**)
   - Italic (*text*)
   - Links [text](url)
   - Images ![alt](url)
   - Code blocks (```language ... ```)
   - Inline code (`code`)
   - Lists (unordered - and ordered 1.)
   - Blockquotes (> text)
   - Horizontal rules (--- or ***)
   - Tables (if possible)
4. Preserve code block language for syntax highlighting
5. Handle nested lists correctly
6. Maintain proper spacing and line breaks

### Non-Functional Requirements
- Fast conversion (no lag when pasting)
- Accurate conversion (matches expected formatting)
- No data loss during conversion
- Works with large Markdown files (up to 10,000 words)
- Undo/redo support after paste
- Error handling for invalid Markdown

## Payload Lexical Built-in Support

According to Payload documentation, the `@payloadcms/richtext-lexical` package includes:

**Markdown to RichText:**
```typescript
import { convertMarkdownToLexical } from '@payloadcms/richtext-lexical'

const lexicalJSON = convertMarkdownToLexical({
  editorConfig: editorConfig,
  markdown: '# Hello world\n\nThis is a **test**.',
})
```

**RichText to Markdown:**
```typescript
import { convertLexicalToMarkdown } from '@payloadcms/richtext-lexical'

const markdown = convertLexicalToMarkdown({
  data: lexicalData,
  editorConfig: editorConfig,
})
```

This means we don't need to write a custom Markdown parser - Payload already provides the conversion functions!

## Implementation Plan

### Phase 1: Paste Handler (1 day)
1. Create custom Lexical feature for paste handling
2. Implement Markdown detection heuristics
3. Integrate `convertMarkdownToLexical` from Payload
4. Add to Posts collection rich text editor
5. Test with common Markdown patterns

### Phase 2: Import Button (1 day)
1. Create custom toolbar button
2. Build modal component with Markdown textarea
3. Add preview pane (side-by-side)
4. Implement file upload (.md files)
5. Add insert/cancel actions

### Phase 3: Enhanced Features (Optional)
1. Support for frontmatter (YAML) - strip or parse
2. Support for MDX syntax
3. Handle GitHub-flavored Markdown (task lists, tables, strikethrough)
4. Paste from URL (fetch remote Markdown)
5. Bulk import from folder

## Markdown Detection Heuristics

To detect if pasted content is Markdown:
- Contains heading markers (# ## ###)
- Contains code blocks (```)
- Contains bold markers (** or __)
- Contains list markers (-, *, 1.)
- Contains link syntax [text](url)
- Multiple consecutive line breaks
- Combination of above with threshold

**Example:**
```typescript
function isMarkdown(text: string): boolean {
  const indicators = [
    /^#{1,6}\s/m,           // Headings
    /```\w*[\s\S]*```/m,     // Code blocks
    /\*\*.*?\*\*/m,          // Bold
    /\[.*?\]\(.*?\)/m,       // Links
    /^[\s]*[-*]\s/m,         // Lists
    /^[\s]*\d+\.\s/m,        // Ordered lists
  ]

  const matchCount = indicators.reduce((count, regex) => {
    return count + (text.match(regex)?.length || 0)
  }, 0)

  return matchCount >= 2 // Threshold
}
```

## Code Block Support

The blog already has code block support with the `Code` block in Lexical. The Markdown converter should:

1. Detect code blocks with language specifiers:
   ````markdown
   ```typescript
   const x = 1
   ```
   ````

2. Convert to the existing `Code` block format:
```typescript
{
  type: 'block',
  fields: {
    language: 'typescript',
    code: 'const x = 1'
  }
}
```

3. Map common language markers:
   - `js`, `javascript` → `javascript`
   - `ts`, `typescript` → `typescript`
   - `py`, `python` → `python`
   - `bash`, `sh` → `bash`
   - `text` (default) → `text`

## User Experience Flow

### Paste Handler Flow:
1. User copies Markdown from any source (VS Code, GitHub, etc.)
2. User pastes into Payload rich text editor
3. System detects Markdown format
4. Content automatically converts to rich text
5. User sees properly formatted content
6. User can undo if conversion is wrong

### Import Button Flow:
1. User clicks "Import Markdown" button in toolbar
2. Modal opens with textarea
3. User pastes or uploads Markdown file
4. Live preview shows converted content
5. User clicks "Insert"
6. Content added to editor at cursor position
7. Modal closes

## Configuration Options

Add to Posts collection or global config:
```typescript
{
  name: 'content',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Markdown paste feature
      // Markdown import button feature
    ],
  }),
  admin: {
    description: 'Supports automatic Markdown paste conversion'
  }
}
```

## Testing Checklist

- [ ] Paste simple Markdown (headings, paragraphs)
- [ ] Paste Markdown with bold/italic
- [ ] Paste Markdown with links
- [ ] Paste Markdown with code blocks (with language)
- [ ] Paste Markdown with lists (ordered/unordered)
- [ ] Paste Markdown with blockquotes
- [ ] Paste large Markdown files (1000+ words)
- [ ] Paste regular text (should NOT convert)
- [ ] Import button opens modal
- [ ] File upload works for .md files
- [ ] Preview shows correct conversion
- [ ] Undo works after paste/import
- [ ] No console errors
- [ ] Works on all browsers (Chrome, Firefox, Safari)

## Alternatives Considered

### 1. External Markdown Editor + Export
Use separate Markdown editor (Obsidian, VS Code) with Payload export plugin.

**Pros:**
- Better editing experience
- Full Markdown feature set

**Cons:**
- Requires additional tools
- More complex workflow
- Sync issues

### 2. Client-side Only Conversion
Convert Markdown only on frontend, keep as Markdown in database.

**Pros:**
- Simple storage
- Easy to edit

**Cons:**
- Can't use Payload rich text features
- Inconsistent with current setup
- Limited formatting in admin

### 3. Keep as Markdown Field
Add separate Markdown field and convert on display.

**Pros:**
- Simple implementation

**Cons:**
- Two different editors
- Confusing UX
- Can't use rich text features in admin

**Decision:** Convert on paste/import is best - keeps rich text editing capability while adding Markdown import convenience.

## Success Metrics

- Paste conversion works in < 1 second
- Accuracy rate > 95% for common Markdown
- Zero data loss during conversion
- User satisfaction (easy to use)
- No increase in support requests

## Dependencies

- `@payloadcms/richtext-lexical` (already installed)
- Payload Lexical editor (already configured)
- No additional packages needed

## Related Issues

- [Analytics Implementation](./analytics-implementation.md)

## Notes

- Payload already provides `convertMarkdownToLexical` function
- Leverage existing `Code` block for syntax highlighting
- Consider adding Markdown export button too (richtext → markdown)
- Test with real Markdown files from project docs
- Document the feature for future content creators
