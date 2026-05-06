interface PageTitleProps {
  title: string
  subtitle?: string
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="bg-[#f1f6fb] border-b border-[#c8d8ea] px-5 py-3.5">
      <div className="max-w-[620px] mx-auto">
        <h1 className="text-[#112e51] font-bold text-lg">{title}</h1>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
