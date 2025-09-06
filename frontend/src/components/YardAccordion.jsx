import CustomAccordion from "./MUIAccordion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function YardAccordion({ yard, groups, prefs, onEdit, onDelete }) {
  const groupName = yard.yard_group
    ? groups.find((g) => g.id === yard.yard_group)?.group_name || "Unnamed Group"
    : "N/A";

  return (
    <CustomAccordion
      id={`yard-${yard.id}`}
      key={yard.id}
      title={yard.yard_name}
      content={
        <>
          <div className="flex justify-between"><strong>Zipcode:</strong> {yard.zip_code}</div>
          <div className="flex justify-between"><strong>Size:</strong> {yard.yard_size} sqft</div>
          <div className="flex justify-between"><strong>Soil:</strong> {yard.soil_type}</div>
          <div className="flex justify-between"><strong>Grass:</strong> {yard.grass_type}</div>
          <div className="flex justify-between"><strong>Group:</strong> {groupName}</div>

          {prefs && (
            <CustomAccordion
              title="Preferences"
              noBorder
              noShadow
              className="w-full mt-2"
              content={
                <div className="mt-2 space-y-1 w-full">
                  {/* Water */}
                  <div className="grid gap-0 text-center border-b-[1px] border-b-[var(--color-medium)] pb-2 w-full">
                    <div><strong>Water</strong></div>
                    <div className="grid grid-cols-2 w-full"><div>Every</div><div>Amount</div></div>
                    <div className="grid grid-cols-2 w-full">
                      <div>{prefs.watering_interval} day(s)</div>
                      <div>{prefs.watering_rate}" / week</div>
                    </div>
                  </div>
                  {/* Fertilize */}
                  <div className="grid gap-0 text-center border-b-[1px] border-b-[var(--color-medium)] pb-2 w-full">
                    <div><strong>Fertilize</strong></div>
                    <div className="grid grid-cols-2 w-full"><div>Every</div><div>Amount</div></div>
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
                      <div>Every</div><div>Every</div><div>Every</div>
                    </div>
                    <div className="grid grid-cols-3 divide-x-[1px] divide-[var(--color-medium)] w-full">
                      <div>{prefs.mowing_interval} day(s)</div>
                      <div>{prefs.aeration_interval} day(s)</div>
                      <div>{prefs.dethatching_interval} day(s)</div>
                    </div>
                  </div>
                </div>
              }
            />
          )}
        </>
      }
      actions={
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <EditIcon variant="outlined" size="small" onClick={onEdit} />
            <DeleteForeverIcon variant="outlined" color="error" size="small" onClick={onDelete} />
          </div>
        </div>
      }
    />
  );
}
