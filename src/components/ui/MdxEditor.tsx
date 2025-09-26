import React from 'react'
import { MessageCircle } from 'lucide-react'
import styles from './MdxEditor.module.css'

interface MdxEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  rows?: number
  disabled?: boolean
}

export default function MdxEditor({
  value,
  onChange,
  placeholder = 'כתוב את תוכן השיעור כאן באמצעות Markdown או MDX...',
  label = 'תוכן השיעור (MDX)',
  rows = 15,
  disabled = false,
}: MdxEditorProps) {
  return (
    <div className={styles.mdxEditorContainer}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
      />
      <div className={styles.hint}>
        <MessageCircle size={16} />
        <span>
          ניתן להשתמש בתחביר Markdown מלא, כולל רכיבי MDX מותאמים אישית.
          לדוגמה: `# כותרת`, **טקסט מודגש**, `[קישור](https://example.com)`.
        </span>
      </div>
    </div>
  )
}