import { Facility } from '@/types';
import { Card } from '@/react-app/components/ui/card';
import { Checkbox } from '@/react-app/components/ui/checkbox';

interface FacilityCardProps {
  facility: Facility;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}

const FacilityCard = ({ facility, isSelected, isDisabled, onToggle }: FacilityCardProps) => {
  return (
    <Card
      onClick={() => !isDisabled && onToggle()}
      className={`
        overflow-hidden cursor-pointer transition-all
        ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-muted">
          <img
            src={facility.imageUrl}
            alt={facility.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{facility.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{facility.address}</p>
            </div>
            <Checkbox
              checked={isSelected}
              disabled={isDisabled}
              className="mt-1 flex-shrink-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
            <div>
              <span className="text-muted-foreground">Distance: </span>
              <span className="font-medium">{facility.formattedDistance}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Rating: </span>
              <span className="font-medium">
                {facility.averageRating.toFixed(1)} ({facility.numberOfReviews})
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Times: </span>
              <span className="font-medium">{facility.availableTimeRange}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Price: </span>
              <span className="font-medium">{facility.priceRange}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FacilityCard;
