const SCRIPT_AND_STYLE_TAGS = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi
const INLINE_EVENT_HANDLERS = /\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const JAVASCRIPT_PROTOCOLS = /(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi
const DATA_HTML_PROTOCOLS = /(href|src)\s*=\s*(['"])\s*data:text\/html[\s\S]*?\2/gi
const TARGET_BLANK_WITHOUT_REL = /<a\b(?![^>]*\brel=)([^>]*\btarget=(['"])_blank\2[^>]*)>/gi
const URL_PATTERN = /(https?:\/\/[^\s<]+)/g

export function sanitizeHtml(html) {
  if (!html) return ''

  return String(html)
    .replace(SCRIPT_AND_STYLE_TAGS, '')
    .replace(INLINE_EVENT_HANDLERS, '')
    .replace(JAVASCRIPT_PROTOCOLS, '$1=$2#$2')
    .replace(DATA_HTML_PROTOCOLS, '$1=$2#$2')
    .replace(TARGET_BLANK_WITHOUT_REL, '<a$1 rel="noopener noreferrer">')
}

export function linkifyText(html) {
  if (!html) return ''

  return html.replace(
    URL_PATTERN,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-qehBlue underline hover:text-qehNavy">$1</a>'
  )
}

export function createMarkup(html, { linkify = false } = {}) {
  const safeHtml = sanitizeHtml(html)
  return {
    __html: linkify ? linkifyText(safeHtml) : safeHtml,
  }
}
