import CreatorAvatar from "./CreatorAvatar";

type AboutCardProps = {
  name: string;
  about: string;
  avatarUrl?: string | null;
};

export default function AboutCard({ name, about, avatarUrl }: AboutCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <CreatorAvatar name={name} avatarUrl={avatarUrl} size={48} />
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
      </div>

      <hr className="my-5 border-gray-200" />

      <h3 className="mb-3 text-base font-bold text-gray-900">About {name}</h3>
      <p className="text-sm leading-relaxed text-gray-700">{about}</p>
    </section>
  );
}
