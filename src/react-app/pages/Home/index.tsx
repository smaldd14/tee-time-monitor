import { useNavigate } from 'react-router-dom';
import { Button } from '@/react-app/components/ui/button';
import { Card } from '@/react-app/components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Never Miss a Tee Time Again
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Automated monitoring for GolfNow tee times. Get notified the moment your perfect slot opens up.
            </p>

            <div className="pt-4">
              <Button
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 h-auto"
                onClick={() => navigate('/monitor')}
              >
                Start Monitoring
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {/* Step 1 */}
            <Card className="p-6 sm:p-8 space-y-4 border-2 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold">Set Your Preferences</h3>
              <p className="text-muted-foreground leading-relaxed">
                Choose your location, preferred courses, number of players, time windows, and price limits.
              </p>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 sm:p-8 space-y-4 border-2 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold">We Watch For You</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our system continuously monitors GolfNow for new tee times matching your criteria.
              </p>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 sm:p-8 space-y-4 border-2 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold">Book When Notified</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive instant email alerts with direct booking links the moment a slot becomes available.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-semibold">Catch Last-Minute Cancellations</h3>
              <p className="text-muted-foreground leading-relaxed">
                The best tee times often open up from cancellations. Be the first to know when they do.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-semibold">Monitor Multiple Courses</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track availability across all your favorite courses simultaneously in one place.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-semibold">Custom Filters</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set precise preferences for time windows, price limits, and number of players.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-semibold">Direct Booking Links</h3>
              <p className="text-muted-foreground leading-relaxed">
                Email notifications include ready-to-book links so you can reserve your spot instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Ready to Secure Your Next Tee Time?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop refreshing GolfNow manually. Let us do the work for you.
          </p>
          <Button
            size="lg"
            className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 h-auto"
            onClick={() => navigate('/monitor')}
          >
            Start Monitoring
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;