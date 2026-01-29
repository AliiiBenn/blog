import { convertMarkdownToLexical } from '@payloadcms/richtext-lexical'

/**
 * Utility function to convert Markdown to Lexical rich text format
 *
 * This function can be used to convert Markdown content to Payload's
 * Lexical editor format. Useful for importing content from other sources.
 *
 * @param markdown - The Markdown content to convert
 * @returns Lexical editor state JSON
 */
export function markdownToLexical(markdown: string) {
  try {
    const lexicalData = convertMarkdownToLexical({
      markdown,
      editorConfig: {} as never, // Editor config not needed for basic conversion
    })
    return lexicalData
  } catch (error) {
    console.error('Failed to convert Markdown to Lexical:', error)
    throw error
  }
}

/**
 * Detects if text appears to be Markdown format
 */
export function isMarkdown(text: string): boolean {
  const indicators = [
    /^#{1,6}\s/m, // Headings
    /```\w*[\s\S]*```/m, // Code blocks
    /\*\*.*?\*\*/m, // Bold
    /\[.*?\]\(.*?\)/m, // Links
    /^[\s]*[-*]\s/m, // Unordered lists
    /^[\s]*\d+\.\s/m, // Ordered lists
  ]

  const matchCount = indicators.reduce((count, regex) => {
    return count + (text.match(regex)?.length || 0)
  }, 0)

  // Consider it Markdown if it has 2 or more indicators
  return matchCount >= 2
}
