import './Background3D.css'

export default function Background3D() {
  return (
    <div className="background-3d">
      <div className="bg-grid"></div>
      <div className="bg-cube bg-cube-1"></div>
      <div className="bg-cube bg-cube-2"></div>
      <div className="bg-cube bg-cube-3"></div>
      <div className="bg-cube bg-cube-4"></div>
      <div className="bg-cube bg-cube-5"></div>
      <div className="bg-cube bg-cube-6"></div>
      <div className="bg-lines">
        <div className="bg-line bg-line-1"></div>
        <div className="bg-line bg-line-2"></div>
        <div className="bg-line bg-line-3"></div>
        <div className="bg-line bg-line-4"></div>
      </div>
      <div className="bg-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`bg-particle bg-particle-${i + 1}`}></div>
        ))}
      </div>
      <div className="bg-electric-field"></div>
    </div>
  )
}


