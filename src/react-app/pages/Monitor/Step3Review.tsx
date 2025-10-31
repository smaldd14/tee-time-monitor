import { Card } from '@/react-app/components/ui/card';
import { SearchCriteria, Facility } from '@/types';

interface Step3Props {
  criteria: SearchCriteria;
  facilities: Facility[];
  selectedFacilityIds: number[];
}

const Step3Review = ({ criteria, facilities, selectedFacilityIds }: Step3Props) => {
  const selectedFacilities = facilities.filter((f) => selectedFacilityIds.includes(f.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Review Your Monitor</h2>
        <p className="text-muted-foreground mb-6">
          Verify your preferences before proceeding to checkout
        </p>
      </div>

      {/* Search Criteria Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Search Criteria</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">ZIP Code:</span>
            <p className="font-medium">{criteria.zipCode}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Radius:</span>
            <p className="font-medium">{criteria.radiusMiles} miles</p>
          </div>
          <div>
            <span className="text-muted-foreground">Date:</span>
            <p className="font-medium">{criteria.searchDate}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Players:</span>
            <p className="font-medium">{criteria.numberOfPlayers}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Time Window:</span>
            <p className="font-medium">
              {formatHour(criteria.preferredTimeStart)} - {formatHour(criteria.preferredTimeEnd)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Holes:</span>
            <p className="font-medium">{criteria.holes === 1 ? '9 Holes' : '18 Holes'}</p>
          </div>
          {criteria.maxPrice && (
            <div>
              <span className="text-muted-foreground">Max Price:</span>
              <p className="font-medium">${criteria.maxPrice}</p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Hot Deals Only:</span>
            <p className="font-medium">{criteria.hotDealsOnly ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </Card>

      {/* Selected Courses */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">
          Selected Courses ({selectedFacilities.length})
        </h3>
        <div className="space-y-3">
          {selectedFacilities.map((facility, index) => (
            <div key={facility.id} className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium">{facility.name}</p>
                <p className="text-sm text-muted-foreground">{facility.address}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pricing & Next Steps */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Tee Time Monitor</h3>
            <p className="text-sm text-muted-foreground">One-time setup fee</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">$0.99</p>
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-2">What happens next?</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• You'll be redirected to Stripe's secure checkout page</li>
            <li>• After payment, we'll start monitoring immediately</li>
            <li>• You'll receive email notifications when matching tee times appear</li>
            <li>• Each notification includes direct booking links</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

function formatHour(hour: number): string {
  if (hour === 12) return '12 PM';
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

export default Step3Review;
