const Testimonials = ({ testimonials }: { testimonials: any }) => {
  return (
    <section className="testimonials py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">What People Are Saying</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {testimonials.map((testimonial: any, index: number) => (
            <div
              key={index}
              className="testimonial p-6 bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
            >
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="h-16 w-16 rounded-full mb-4"
              />
              <p className="italic">"{testimonial.quote}"</p>
              <h3 className="text-lg font-bold mt-4">{testimonial.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
