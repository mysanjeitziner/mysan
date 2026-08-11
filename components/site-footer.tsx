```tsx
import Link from 'next/link'

const MYSAN_BLUE = '#1dabff'

export default function SiteFooter() {
  return (
    <footer className="bg-white">

      <div className="mx-auto max-w-7xl px-8 md:px-12 lg:px-16">

        {/* =====================================================
            FOOTER LINIE
        ===================================================== */}

        <div className="border-t border-neutral-200">

          <div
            className="
              flex
              flex-col
              justify-between
              gap-5
              py-7
              text-xs
              text-neutral-400
              md:flex-row
              md:items-center
            "
          >

            {/* =================================================
                COPYRIGHT
            ================================================= */}

            <p>
              © {new Date().getFullYear()} Mysan Jeitziner
            </p>

            {/* =================================================
                LINKS
            ================================================= */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-6
                gap-y-3
              "
            >

              {/* Impressum */}

              <Link
                href="/impressum"
                className="
                  transition-colors
                  duration-200
                  hover:text-[#1dabff]
                "
              >
                Impressum
              </Link>

              {/* Datenschutz */}

              <Link
                href="/datenschutz"
                className="
                  transition-colors
                  duration-200
                  hover:text-[#1dabff]
                "
              >
                Datenschutz
              </Link>

              {/* Cookies */}

              <Link
                href="/cookies"
                className="
                  transition-colors
                  duration-200
                  hover:text-[#1dabff]
                "
              >
                Cookies
              </Link>

              {/* Instagram */}

              <a
                href="https://www.instagram.com/mysan_jeitziner?igshid=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="mySan Jeitziner auf Instagram"
                className="
                  inline-flex
                  items-center
                  gap-2
                  transition-colors
                  duration-200
                  hover:text-[#1dabff]
                "
              >

                {/* Instagram Icon */}

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >

                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />

                </svg>

                <span>
                  Instagram
                </span>

              </a>

            </div>

          </div>

        </div>

      </div>

    </footer>
  )
}
```
