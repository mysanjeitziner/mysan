type RichContentProps = {
  text: string | null | undefined
  className?: string
}

export default function RichContent({
  text,
  className = '',
}: RichContentProps) {
  if (!text) {
    return null
  }

  /*
   * Falls in der Datenbank tatsächlich "\n"
   * gespeichert wurde, wird daraus ein echter
   * Zeilenumbruch.
   */
  const normalizedText = text.replace(/\\n/g, '\n')

  const lines = normalizedText.split('\n')

  return (
    <div className={className}>

      {lines.map((line, index) => {

        const trimmed = line.trim()

        /*
         * LEERE ZEILE
         */

        if (!trimmed) {
          return (
            <div
              key={`empty-${index}`}
              className="h-3"
            />
          )
        }

        /*
         * AUFZÄHLUNG
         *
         * - Text
         * * Text
         */

        if (
          trimmed.startsWith('- ') ||
          trimmed.startsWith('* ')
        ) {
          return (
            <div
              key={index}
              className="flex gap-3"
            >

              <span
                className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: '#1dabff',
                }}
              />

              <span>
                {renderBold(
                  trimmed.substring(2)
                )}
              </span>

            </div>
          )
        }

        /*
         * NUMMERIERTE AUFZÄHLUNG
         *
         * 1. Text
         * 2. Text
         */

        const numbered =
          trimmed.match(
            /^(\d+)\.\s+(.*)$/
          )

        if (numbered) {
          return (
            <div
              key={index}
              className="flex gap-3"
            >

              <span
                className="shrink-0 font-semibold"
                style={{
                  color: '#1dabff',
                }}
              >
                {numbered[1]}.
              </span>

              <span>
                {renderBold(numbered[2])}
              </span>

            </div>
          )
        }

        /*
         * NORMALER TEXT
         */

        return (
          <div key={index}>
            {renderBold(trimmed)}
          </div>
        )
      })}

    </div>
  )
}

/*
=========================================================
FETT
=========================================================

**Text**

wird zu:

<strong>Text</strong>
*/

function renderBold(text: string) {
  const parts =
    text.split(/(\*\*.*?\*\*)/g)

  return parts.map((part, index) => {

    if (
      part.startsWith('**') &&
      part.endsWith('**')
    ) {
      return (
        <strong
          key={index}
          className="font-semibold text-neutral-900"
        >
          {part.slice(2, -2)}
        </strong>
      )
    }

    return (
      <span key={index}>
        {part}
      </span>
    )
  })
}