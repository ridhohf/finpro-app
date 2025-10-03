import { Shield, DollarSign, Headphones, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your data is protected with enterprise-level security",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: DollarSign,
      title: "Best Price Guarantee",
      description: "Find the lowest prices or we refund the difference",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our team is always here to help you anytime",
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: Award,
      title: "Verified Properties",
      description: "All listings are verified for quality and safety",
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose StayInn?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make booking your perfect stay simple, secure, and affordable
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.color} mb-4`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
