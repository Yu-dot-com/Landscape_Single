export default function SelectPanel() {
  return (
    <div className="w-64 bg-panel border border-border rounded-2xl p-4 shadow">

      <h3 className="text-xs font-bold uppercase mb-4">
        Selected Object
      </h3>


      <div className="space-y-3 text-sm">

        <div>
          <label>Name</label>
          <input
            className="w-full border rounded-lg p-2"
            placeholder="Tree"
          />
        </div>


        <div className="grid grid-cols-2 gap-2">
          <input
            className="border rounded-lg p-2"
            placeholder="X"
          />

          <input
            className="border rounded-lg p-2"
            placeholder="Y"
          />
        </div>


        <div className="grid grid-cols-2 gap-2">
          <input
            className="border rounded-lg p-2"
            placeholder="Width"
          />

          <input
            className="border rounded-lg p-2"
            placeholder="Height"
          />
        </div>


        <button className="w-full bg-[#6B7A58] text-white rounded-lg py-2">
          Delete
        </button>

      </div>

    </div>
  );
}