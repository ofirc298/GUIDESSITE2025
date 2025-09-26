```tsx
import React from 'react'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote'
import styles from './MdxRenderer.module.css'

// Define custom components if needed for MDX
const components = {
  h1: (props: any) => <h1 className={styles.h1} {...props} />,
  h2: (props: any) => <h2 className={styles.h2} {...props} />,
  h3: (props: any) => <h3 className={styles.h3} {...props} />,
  p: (props: any) => <p className={styles.p} {...props} />,
  a: (props: any) => <a className={styles.a} {...props} />,
  ul: (props: any) => <ul className={styles.ul} {...props} />,
  ol: (props: any) => <ol className={styles.ol} {...props} />,
  li: (props: any) => <li className={styles.li} {...props} />,
  blockquote: (props: any) => <blockquote className={styles.blockquote} {...props} />,
  code: (props: any) => <code className={styles.code} {...props} />,
  pre: (props: any) => <pre className={styles.pre} {...props} />,
  // Add more custom components as needed
}

interface MdxRendererProps {
  source: MDXRemoteProps['source']
}

export default function MdxRenderer({ source }: MdxRendererProps) {
  if (!source) {
    return <div className={styles.emptyContent}>אין תוכן להצגה.</div>
  }
  return (
    <div className={styles.mdxContent}>
      <MDXRemote {...source} components={components} />
    </div>
  )
}
```