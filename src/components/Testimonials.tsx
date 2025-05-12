
import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  image?: string;
  stars: number;
  quote: string;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "Young Professional",
      stars: 5,
      quote: "rentinlondon made finding my flat so easy! The search filters are incredibly helpful, and I was able to schedule viewings within hours. I found my perfect apartment in just one week."
    },
    {
      name: "David Chen",
      role: "Student",
      stars: 5,
      quote: "As an international student, I was worried about finding accommodation in London. This platform connected me with trustworthy landlords and I found a great room in a shared house near my university."
    },
    {
      name: "Olivia and James",
      role: "Young Family",
      stars: 4,
      quote: "We needed to find a family-friendly apartment quickly after relocating to London for work. The detailed listings and responsive landlords made our transition smooth and stress-free."
    }
  ];

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from people who have found their perfect London home through our platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mr-4 overflow-hidden">
                  {testimonial.image ? (
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {renderStars(testimonial.stars)}
              </div>
              
              <blockquote className="text-gray-700 italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
