import { useState } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { SearchCriteria, Facility } from '@/types';
import { useFacilitySearch, useCreateMonitor } from '@/react-app/hooks/useTeeTime';
import { toast } from 'sonner';
import Step1SearchCriteria from './Step1SearchCriteria';
import Step2SelectFacilities from './Step2SelectFacilities';
import Step3Review from './Step3Review';

const TOTAL_STEPS = 3;

const MonitorPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [searchCriteria, setSearchCriteria] = useState<Partial<SearchCriteria>>({
    numberOfPlayers: 2,
    holes: 2,
    hotDealsOnly: false,
    preferredTimeStart: 8,
    preferredTimeEnd: 14,
  });
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<number[]>([]);

  // React Query hooks
  const facilitySearch = useFacilitySearch();
  const createMonitor = useCreateMonitor();

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate Step 1
      if (!validateStep1()) {
        return;
      }

      // Search for facilities
      const result = await facilitySearch.mutateAsync({
        zipCode: searchCriteria.zipCode!,
        radiusMiles: searchCriteria.radiusMiles!,
        searchDate: searchCriteria.searchDate!,
      });

      console.log('result', result);

      setFacilities(result || []);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate Step 2
      if (selectedFacilityIds.length === 0) {
        toast.error('Please select at least one facility');
        return;
      }
      if (selectedFacilityIds.length > 5) {
        toast.error('Please select no more than 5 facilities');
        return;
      }

      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await createMonitor.mutateAsync({
        searchCriteria: searchCriteria as SearchCriteria,
        priorityCourses: selectedFacilityIds,
      });

      // Redirect to Stripe checkout
      if (result.checkoutUrl) {
        toast.success('Redirecting to checkout...');
        // Open in new tab/window
        window.location.href = result.checkoutUrl;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create monitor');
    }
  };

  const validateStep1 = (): boolean => {
    if (!searchCriteria.zipCode || !/^\d{5}$/.test(searchCriteria.zipCode)) {
      toast.error('Please enter a valid 5-digit ZIP code');
      return false;
    }
    if (!searchCriteria.radiusMiles || searchCriteria.radiusMiles <= 0) {
      toast.error('Please enter a valid radius');
      return false;
    }
    if (!searchCriteria.searchDate) {
      toast.error('Please select a date');
      return false;
    }
    if (!searchCriteria.numberOfPlayers || searchCriteria.numberOfPlayers < 1) {
      toast.error('Please enter number of players');
      return false;
    }
    if (!searchCriteria.preferredTimeStart || !searchCriteria.preferredTimeEnd) {
      toast.error('Please select preferred time windows');
      return false;
    }
    if (searchCriteria.preferredTimeStart >= searchCriteria.preferredTimeEnd) {
      toast.error('Start time must be before end time');
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Set Up Your Tee Time Monitor
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure your preferences and we'll notify you when spots open up
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step < currentStep
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < TOTAL_STEPS && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 transition-colors ${
                      step < currentStep ? 'bg-primary/20' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between max-w-md mx-auto mt-2">
            <span className="text-xs sm:text-sm text-muted-foreground">Criteria</span>
            <span className="text-xs sm:text-sm text-muted-foreground">Courses</span>
            <span className="text-xs sm:text-sm text-muted-foreground">Review</span>
          </div>
        </div>

        {/* Form Steps */}
          {currentStep === 1 && (
            <Step1SearchCriteria
              criteria={searchCriteria}
              onChange={setSearchCriteria}
            />
          )}

          {currentStep === 2 && (
            <Step2SelectFacilities
              facilities={facilities}
              selectedIds={selectedFacilityIds}
              onSelectionChange={setSelectedFacilityIds}
              isLoading={facilitySearch.isPending}
            />
          )}

          {currentStep === 3 && (
            <Step3Review
              criteria={searchCriteria as SearchCriteria}
              facilities={facilities}
              selectedFacilityIds={selectedFacilityIds}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                onClick={handleNext}
                disabled={facilitySearch.isPending}
              >
                {facilitySearch.isPending ? 'Searching...' : 'Next'}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createMonitor.isPending}
              >
                {createMonitor.isPending ? 'Creating...' : 'Submit'}
              </Button>
            )}
          </div>
      </div>
    </div>
  );
};

export default MonitorPage;
