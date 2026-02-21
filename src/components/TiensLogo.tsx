import { cn } from "@/lib/utils";

interface TiensLogoProps {
  className?: string;
  showText?: boolean;
}

export default function TiensLogo({ className, showText = true }: TiensLogoProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox={showText ? "0 0 250 250" : "0 0 250 170"}
        className="w-full h-full drop-shadow-md"
      >
        <defs>
            {/* Mask for white wavy lines inside green leaves */}
            <mask id="white-lines-cutout">
                <rect width="100%" height="100%" fill="white"/>
                {/* Path that cuts the wavy line */}
                <path d="M 22 130 Q 35 90, 65 55 Q 85 90, 95 115 Q 105 80, 125 45 Q 145 80, 155 115 Q 165 90, 185 55 Q 215 90, 228 130" fill="none" stroke="black" strokeWidth="8.5" strokeLinejoin="miter" strokeLinecap="round"/>
            </mask>
        </defs>

        {/* Three Green Leaves */}
        <g mask="url(#white-lines-cutout)" fill="#00843D">
            {/* Left Leaf */}
            <path d="M 65 35 C 105 60, 105 130, 65 155 C 25 130, 25 60, 65 35 Z"/>
            {/* Middle Leaf */}
            <path d="M 125 10 C 175 40, 175 130, 125 165 C 75 130, 75 40, 125 10 Z"/>
            {/* Right Leaf */}
            <path d="M 185 35 C 225 60, 225 130, 185 155 C 145 130, 145 60, 185 35 Z"/>
        </g>

        {/* Tiens Text */}
        {showText && (
          <>
            <g className="fill-gray-900 dark:fill-white transition-colors duration-500" fillRule="evenodd">
                {/* Letter T */}
                <path d="M 38 185 L 71 185 L 71 193 L 59 193 L 59 225 L 48 225 L 48 193 L 34 193 Z"/>
                
                {/* Letter i base */}
                <path d="M 78 196 L 87 196 L 87 225 L 78 225 Z"/>
                
                {/* Letter e */}
                <path d="M 111 188 C 99 188 91 196 91 208 C 91 220 99 228 111 228 C 120 228 127 223 129 215 L 120 212 C 118 217 115 219 111 219 C 104 219 100 214 100 208 L 130 208 C 130 206 130 204 130 202 C 130 193 122 188 111 188 Z M 100 201 C 101 196 105 195 111 195 C 116 195 120 196 120 201 L 100 201 Z"/>
                
                {/* Letter n */}
                <path d="M 136 196 L 145 196 L 145 201 C 148 196 154 194 161 194 C 170 194 176 200 176 210 L 176 225 L 167 225 L 167 210 C 167 203 162 201 157 201 C 150 201 145 205 145 214 L 145 225 L 136 225 Z"/>
                
                {/* Letter s */}
                <path d="M 194 194 C 188 194 183 197 183 202 C 183 207 187 209 193 211 L 198 212 C 202 213 204 215 204 218 C 204 221 200 223 194 223 C 188 223 184 221 182 217 L 174 220 C 178 226 185 230 194 230 C 203 230 212 226 212 218 C 212 211 207 208 201 207 L 194 205 C 191 204 190 203 190 201 C 190 199 192 198 195 198 C 200 198 204 200 206 203 L 213 198 C 209 194 202 194 194 194 Z"/>
            </g>

            {/* Green dot for letter i */}
            <circle cx="82.5" cy="182" r="5.5" fill="#00843D"/>
          </>
        )}
      </svg>
    </div>
  );
}
