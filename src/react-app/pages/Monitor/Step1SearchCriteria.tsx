import { Field, FieldLabel } from '@/react-app/components/ui/field';
import { Input } from '@/react-app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/react-app/components/ui/select';
import { Button } from '@/react-app/components/ui/button';
import { Calendar } from '@/react-app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/react-app/components/ui/popover';
import { SearchCriteria } from '@/types';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/react-app/lib/utils';

interface Step1Props {
  criteria: Partial<SearchCriteria>;
  onChange: (criteria: Partial<SearchCriteria>) => void;
}

const Step1SearchCriteria = ({ criteria, onChange }: Step1Props) => {
  const updateField = (field: keyof SearchCriteria, value: any) => {
    onChange({ ...criteria, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Search Criteria</h2>
        <p className="text-muted-foreground mb-6">
          Enter your location and preferences for tee time searches
        </p>
      </div>

      {/* Location - ZIP Code */}
      <Field>
        <FieldLabel htmlFor='zipCode'>ZIP Code</FieldLabel>
        <Input
          type="text"
          maxLength={5}
          placeholder="07052"
          value={criteria.zipCode || ''}
          onChange={(e) => updateField('zipCode', e.target.value)}
        />
      </Field>

      {/* Radius */}
      <Field>
        <FieldLabel htmlFor='radiusMiles'>Search Radius (miles)</FieldLabel>
        <Input
          type="number"
          min="1"
          max="100"
          placeholder="15"
          value={criteria.radiusMiles || ''}
          onChange={(e) => updateField('radiusMiles', parseInt(e.target.value))}
        />
      </Field>

      {/* Date */}
      <Field>
        <FieldLabel htmlFor='searchDate'>Date</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !criteria.searchDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {criteria.searchDate ? criteria.searchDate : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={criteria.searchDate ? new Date(criteria.searchDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  // Format date as "Oct 25 2025" to match expected format
                  updateField('searchDate', format(date, 'MMM dd yyyy'));
                }
              }}
              disabled={{ before: new Date() }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </Field>

      {/* Number of Players */}
      <Field>
        <FieldLabel htmlFor='numberOfPlayers'>Number of Players</FieldLabel>
        <Select
          value={criteria.numberOfPlayers?.toString()}
          onValueChange={(value) => updateField('numberOfPlayers', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select players" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Player</SelectItem>
            <SelectItem value="2">2 Players</SelectItem>
            <SelectItem value="3">3 Players</SelectItem>
            <SelectItem value="4">4 Players</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {/* Time Windows */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor='preferredTimeStart'>Preferred Start Time</FieldLabel>
          <Select
            value={criteria.preferredTimeStart?.toString()}
            onValueChange={(value) => updateField('preferredTimeStart', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 15 }, (_, i) => i + 6).map((hour) => (
                <SelectItem key={hour} value={hour.toString()}>
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor='preferredTimeEnd'>Preferred End Time</FieldLabel>
          <Select
            value={criteria.preferredTimeEnd?.toString()}
            onValueChange={(value) => updateField('preferredTimeEnd', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 15 }, (_, i) => i + 6).map((hour) => (
                <SelectItem key={hour} value={hour.toString()}>
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* Max Price */}
      <Field>
        <FieldLabel htmlFor='maxPrice'>Maximum Price (optional)</FieldLabel>
        <Input
          type="number"
          min="0"
          placeholder="80"
          value={criteria.maxPrice || ''}
          onChange={(e) => updateField('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
        />
      </Field>

      {/* Holes */}
      <Field>
        <FieldLabel htmlFor='holes'>Number of Holes</FieldLabel>
        <Select
          value={criteria.holes?.toString()}
          onValueChange={(value) => updateField('holes', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select holes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1" disabled>9 Holes</SelectItem>
            <SelectItem value="2">18 Holes</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {/* Hot Deals Only */}
      {/* <Field>
        <FieldLabel htmlFor='hotDealsOnly'>Hot Deals Only</FieldLabel>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hotDeals"
            checked={criteria.hotDealsOnly}
            onCheckedChange={(checked) => updateField('hotDealsOnly', checked === true)}
          />
          <label
            htmlFor="hotDeals"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Only show hot deals
          </label>
        </div>
      </Field> */}
    </div>
  );
};

export default Step1SearchCriteria;
