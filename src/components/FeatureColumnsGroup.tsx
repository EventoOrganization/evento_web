import Link from "next/link";

interface FeaturesColumnsProps {
  data: {
    //heading: string;
    //description: string;
    features: FeatureColumns[];
  };
}

interface FeatureColumns {
  //id: string;
  title: string;
  description: string;
  icon: string;
}

function FeatureCg({ title, description, icon }: FeatureColumns) {
  return (
    <div className="flex flex-col items-center p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-8 h-8 dark:text-violet-400"
      >
        <path
          fillRule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
          clipRule="evenodd"
        ></path>
      </svg>
      <h3 className="my-3 text-3xl font-semibold">{title}</h3>
      <div className="space-y-1 leading-tight my-6">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function FeaturesCg({ data }: FeaturesColumnsProps) {
  return (
    <section className="dark:bg-black dark:text-gray-100 m:py-4 lg:py-8">
      <div className="container mx-auto my-6 grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.features.map((item: FeatureColumns, index: number) => (
          <FeatureCg key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
