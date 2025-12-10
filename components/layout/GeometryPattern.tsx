import { ReactNode } from 'react'

const GeometryPattern = ({children}:{children:ReactNode}) => {
  return (
   <div className="min-h-screen w-full bg-white relative">
  {/*  Diagonal Cross Top Left Fade Grid Background */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, var(--primary) 49%, var(--secondary) 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, var(--primary) 49%, var(--secondary) 51%, transparent 51%)
      `,
      backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
    }}
  />
  {children}
</div>
  )
}

export default GeometryPattern