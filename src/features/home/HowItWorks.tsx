const HowItWorks = () => {
  const steps = [
    {
      title: "Browse Events",
      icon: "https://s3-alpha-sig.figma.com/img/f0a5/159c/c2dcc6cc173533dd787522d21bf66584?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bmWZQXZMLPIA5l1EjwznawDMkB2fKw4d8w8NoQJWYSH0bQRfh2SPQ0po5v-qrKRohHjpdBtx5evS1DHzZpdNaohHRJDF5t5koKIqHVHd8AemTbvH1dzDpcllPpSqU42wJJJ3w0Faw2ztKD3JL2vQXl8XPaKYJ5LusNw9ZH4ZCiEnqIQSdGJ2JLmDtdFpvPRGXt6~qlGPlkjIc8p2wKNLKS14rF5ncJOWPszOvtYlRg9AWt-E-LXjydlSMC8SYNGwgwcxTl5aixUwXv5AuGQx-z7zl1NgX5Erm869ksNnwasa6R-LPZEbBV2zOzp6upfZtzdvwJ38E7XndwKGBlBk5w__",
      description: "Discover upcoming events in your area.",
    },
    {
      title: "Join the Event",
      // icon: "/icons/join.svg",
      description: "Attend and talk with others.",
    },
    {
      title: "Enjoy",
      // icon: "/icons/ticket.svg",
      description: "Enjoy the event with others.",
    },
  ];

  return (
    <section className="how-it-works py-16 ">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-black text-eventoPink mb-8">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="border relative step p-4 bg-white shadow-md rounded-lg flex flex-col items-center"
            >
              <img
                src={step.icon}
                alt={step.title}
                className=" absolute inset-0 w-full h-full object-cover rounded-lg opacity-40"
              />
              <div className="bg-black absolute w-full h-full rounded-lg inset-0 opacity-40"></div>
              <h3 className="text-xl text-white font-bold mb-2 z-10">
                {step.title}
              </h3>
              <p className="text-white font-medium z-10">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
