export default function Switch({ checked, onChange, disabled = false, label }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; label?: string }) {
  return <label className={`inline-flex items-center gap-2 ${disabled?'cursor-not-allowed opacity-60':'cursor-pointer'}`}>
    <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={()=>onChange(!checked)} className={`relative h-6 w-11 rounded-full transition ${checked?'bg-[rgb(var(--success))]':'bg-[rgb(var(--surface-strong))]'}`}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${checked?'left-6':'left-1'}`}/>
    </button>
    {label && <span className="text-sm">{label}</span>}
  </label>
}
