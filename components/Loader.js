// Loader.js: indicador de carga.
export default function Loader({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ccc] border-t-[#111]" />
      <p className="text-xs uppercase tracking-[0.12em] text-[#666]">{text}</p>
    </div>
  );
}
