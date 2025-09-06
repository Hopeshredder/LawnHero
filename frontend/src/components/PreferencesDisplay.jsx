export default function PreferencesDisplay({ prefs }) {
  if (!prefs) return null;

  return (
    <div className="mt-2 space-y-1 w-full">
      {/* Water */}
      <div className="grid gap-0 text-center border-b-[1px] border-b-[var(--color-medium)] pb-2 w-full">
        <div>
          <strong>Water</strong>
        </div>
        <div className="grid grid-cols-2 w-full">
          <div>Every</div>
          <div>Amount</div>
        </div>
        <div className="grid grid-cols-2 w-full">
          <div>{prefs.watering_interval} day(s)</div>
          <div>{prefs.watering_rate}" / week</div>
        </div>
      </div>

      {/* Fertilize */}
      <div className="grid gap-0 text-center border-b-[1px] border-b-[var(--color-medium)] pb-2 w-full">
        <div>
          <strong>Fertilize</strong>
        </div>
        <div className="grid grid-cols-2 w-full">
          <div>Every</div>
          <div>Amount</div>
        </div>
        <div className="grid grid-cols-2 w-full">
          <div>{prefs.fertilizing_interval} day(s)</div>
          <div>{prefs.fertilizing_rate} lbs/1000 sqft</div>
        </div>
      </div>

      {/* Mow / Aerate / Dethatch */}
      <div className="grid gap-0 text-center pb-2 w-full">
        <div className="grid grid-cols-3 divide-x-[1px] divide-[var(--color-medium)] w-full">
          <strong>Mow</strong>
          <strong>Aerate</strong>
          <strong>Dethatch</strong>
        </div>
        <div className="grid grid-cols-3 divide-x-[1px] divide-[var(--color-medium)] w-full">
          <div>Every</div>
          <div>Every</div>
          <div>Every</div>
        </div>
        <div className="grid grid-cols-3 divide-x-[1px] divide-[var(--color-medium)] w-full">
          <div>{prefs.mowing_interval} day(s)</div>
          <div>{prefs.aeration_interval} day(s)</div>
          <div>{prefs.dethatching_interval} day(s)</div>
        </div>
      </div>
    </div>
  );
}
