type Props = {
  socialUrl: string;
  isLoading: boolean;
};

export function SocialMediaCard({ socialUrl, isLoading }: Props) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse mb-3" />
        <div className="h-3 w-56 rounded bg-gray-200 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-base font-bold text-gray-900">
        Social media URL
      </h3>
      <a
        href={socialUrl}
        className="text-sm text-gray-700 hover:underline break-all"
      >
        {socialUrl}
      </a>
    </section>
  );
}
