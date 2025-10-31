import { Facility } from '@/types';
import FacilityCard from './FacilityCard';

interface Step2Props {
  facilities: Facility[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  isLoading?: boolean;
}

const Step2SelectFacilities = ({ facilities, selectedIds, onSelectionChange, isLoading }: Step2Props) => {
  const toggleFacility = (facilityId: number) => {
    if (selectedIds.includes(facilityId)) {
      onSelectionChange(selectedIds.filter((id) => id !== facilityId));
    } else {
      if (selectedIds.length >= 5) {
        return;
      }
      onSelectionChange([...selectedIds, facilityId]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Select Golf Courses</h2>
        <p className="text-muted-foreground mb-6">
          Choose up to 5 courses to monitor ({selectedIds.length}/5 selected)
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-32 bg-muted rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No facilities found in this area</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {facilities.map((facility) => {
              const isSelected = selectedIds.includes(facility.id);
              const isDisabled = !isSelected && selectedIds.length >= 5;

              return (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  onToggle={() => toggleFacility(facility.id)}
                />
              );
            })}
          </div>

          {selectedIds.length >= 5 && (
            <p className="text-sm text-muted-foreground text-center">
              Maximum of 5 courses reached. Deselect a course to choose another.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Step2SelectFacilities;
