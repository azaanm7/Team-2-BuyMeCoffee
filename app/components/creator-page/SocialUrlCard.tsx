type SocialUrlCardProps = {
  url: string;
};

export default function SocialUrlCard({ url }: SocialUrlCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-base font-bold text-gray-900">
        Social media URL
      </h3>
      <a href={url} className="text-sm text-gray-700 hover:underline break-all">
        {url}
      </a>
    </section>
  );
}
