export default function FormularioEdicion({
    titulo,
    campos,
    selects = [],
    onSubmit,
    onCancel,
    }) {
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-4 w-full max-w-xl bg-white shadow rounded">
        <button
            onClick={onCancel}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
            ← Volver al Menú
        </button>
        <h2 className="text-2xl font-semibold mb-6">{titulo}</h2>

        <form onSubmit={onSubmit} className="space-y-4">
            {campos.map(({ id, label, type, value, onChange }) => (
            <div key={id}>
                <label htmlFor={id} className="block font-medium mb-1">{label}</label>
                <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            ))}

            {selects.map(({ id, label, value, onChange, options }) => (
            <div key={id}>
                <label className="block font-medium mb-1">{label}</label>
                <select
                id={id}
                value={value}
                onChange={onChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">Seleccione {label}</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.nombre}</option>
                ))}
                </select>
            </div>
            ))}

            <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Guardar Cambios
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Cancelar
            </button>
            </div>
        </form>
        </div>
    </div>
    );
}
